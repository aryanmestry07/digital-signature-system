from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import fitz  # PyMuPDF

from app.db.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.signature import Signature
from app.models.document import Document

router = APIRouter(
    prefix="/signatures",
    tags=["Signatures"]
)

# -------------------------------
# Pydantic Schemas
# -------------------------------

class SignatureCreate(BaseModel):
    doc_id: int
    x: float          # relative X (0–1)
    y: float          # relative Y (0–1)
    page: int


class SignatureResponse(BaseModel):
    id: int
    doc_id: int
    user_id: int
    x: float
    y: float
    page: int
    status: str

    class Config:
        orm_mode = True


# -------------------------------
# Create Signature (Save Position)
# POST /signatures
# -------------------------------

@router.post("", response_model=dict)
def create_signature(
    data: SignatureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure document exists
    document = db.query(Document).filter(Document.id == data.doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    signature = Signature(
        doc_id=data.doc_id,
        user_id=current_user.id,
        x=data.x,
        y=data.y,
        page=data.page,
        status="pending"
    )

    db.add(signature)
    db.commit()
    db.refresh(signature)

    return {
        "message": "Signature position saved",
        "signature_id": signature.id
    }


# -------------------------------
# Get Signature Placeholders
# GET /signatures/placeholders/{doc_id}
# -------------------------------

@router.get(
    "/placeholders/{doc_id}",
    response_model=List[SignatureResponse]
)
def get_signature_placeholders(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Ensure document exists
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    signatures = db.query(Signature).filter(
        Signature.doc_id == doc_id
    ).all()

    return signatures



@router.post("/sign/{doc_id}")
def sign_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get document
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    # Get pending signature
    signature = db.query(Signature).filter(
        Signature.doc_id == doc_id,
        Signature.user_id == current_user.id,
        Signature.status == "pending"
    ).first()

    if not signature:
        raise HTTPException(status_code=404, detail="No pending signature found")

    # File paths
    original_pdf = document.file_path
    signature_image = f"signatures/{current_user.id}.png"
    signed_dir = "signed_pdfs"
    os.makedirs(signed_dir, exist_ok=True)

    signed_pdf_path = f"{signed_dir}/{doc_id}_signed.pdf"

    # Open PDF
    pdf = fitz.open(original_pdf)
    page = pdf[signature.page - 1]

    # Convert relative → absolute
    page_width = page.rect.width
    page_height = page.rect.height

    abs_x = signature.x * page_width
    abs_y = signature.y * page_height

    # Insert signature image
    page.insert_image(
        fitz.Rect(
            abs_x,
            abs_y,
            abs_x + 150,
            abs_y + 50
        ),
        filename=signature_image
    )

    # Save signed PDF
    pdf.save(signed_pdf_path)
    pdf.close()

    # Update DB
    document.status = "signed"
    document.signed_file_path = signed_pdf_path
    signature.status = "signed"

    db.commit()

    return {
        "message": "Document signed successfully",
        "signed_pdf": signed_pdf_path
    }