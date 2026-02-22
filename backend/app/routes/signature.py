from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import shutil
from PIL import Image
import fitz  # PyMuPDF

from app.db.database import get_db
from app.models.document import Document
from app.models.user import User
from app.core.auth import get_current_user
from app.utils.audit import create_audit_log

router = APIRouter(prefix="/api/signatures", tags=["Signatures"])


# =============================
# Schemas
# =============================

class ConfirmSignRequest(BaseModel):
    document_id: int
    x: float
    y: float
    page: int
    render_width: float
    render_height: float


# =============================
# Upload Signature
# =============================

@router.post("/upload-signature")
def upload_signature(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not file.filename.lower().endswith(".png"):
        raise HTTPException(status_code=400, detail="Only PNG files allowed")

    upload_dir = "uploads/signatures"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = f"{upload_dir}/user_{current_user.id}.png"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Remove white background
    img = Image.open(file_path).convert("RGBA")
    new_data = []

    for r, g, b, a in img.getdata():
        if r > 220 and g > 220 and b > 220:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append((r, g, b, a))

    img.putdata(new_data)
    img.save(file_path, "PNG")

    user = db.query(User).filter(User.id == current_user.id).first()
    user.signature_image_path = file_path
    db.commit()

    return {
        "message": "Signature uploaded successfully",
        "signature_path": file_path
    }


# =============================
# Confirm & Sign (FIXED ALIGNMENT)
# =============================

@router.post("/confirm-sign")
def confirm_sign(
    data: ConfirmSignRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == data.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user.signature_image_path:
        raise HTTPException(status_code=400, detail="Upload signature first")

    if not os.path.exists(user.signature_image_path):
        raise HTTPException(status_code=400, detail="Signature file missing")

    original_pdf_path = document.file_path
    signed_pdf_path = f"uploads/signed_{document.id}.pdf"

    pdf = fitz.open(original_pdf_path)
    page = pdf[data.page - 1]

    page_width = page.rect.width
    page_height = page.rect.height

    # Convert from rendered canvas pixels → PDF coordinates
    x = (data.x / data.render_width) * page_width
    y = (data.y / data.render_height) * page_height

    width = 150
    height = 60

    # Flip Y-axis (browser top-left → PDF bottom-left)
    y = page_height - y

    # Center-based rectangle (matches frontend translate(-50%, -50%))
    rect = fitz.Rect(
        x - width / 2,
        y - height / 2,
        x + width / 2,
        y + height / 2
    )

    page.insert_image(rect, filename=user.signature_image_path)

    os.makedirs("uploads", exist_ok=True)
    pdf.save(signed_pdf_path)
    pdf.close()

    document.signed_file_path = signed_pdf_path
    document.status = "SIGNED"
    db.commit()

    create_audit_log(
        db,
        current_user.id,
        document.id,
        "SIGNED",
        request.client.host
    )

    return {
        "message": "Document signed successfully",
        "signed_file_path": signed_pdf_path
    }