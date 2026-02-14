from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
import shutil
from typing import List
from app.models.signing_token import SigningToken
import uuid
from app.core.email import send_email

from app.db.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.document import Document

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_DIR = "uploads"


# -------------------------------
# Upload PDF (JWT Protected)
# -------------------------------

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=file.filename,
        file_path=file_path,
        uploaded_by=current_user.id,
        status="uploaded"
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "id": document.id,
        "filename": document.filename,
        "message": "PDF uploaded successfully"
    }


# -------------------------------
# Get User-Specific Documents
# -------------------------------

@router.get("/", response_model=List[dict])
def get_user_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(
        Document.uploaded_by == current_user.id
    ).all()

    return [
        {
            "id": doc.id,
            "name": doc.filename,
            "url": f"/uploads/{doc.filename}",
            "status": doc.status,
            "created_at": doc.created_at
        }
        for doc in documents
    ]



@router.post("/generate-link/{doc_id}")
def generate_public_link(
    doc_id: int,
    email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.uploaded_by == current_user.id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found or unauthorized")

    token = SigningToken(
        document_id=doc_id,
        email=email
    )

    db.add(token)
    db.commit()
    db.refresh(token)

    public_link = f"http://localhost:3000/public-sign/{token.token}"

    # Optional: Email sending (can test later)
    try:
        send_email(
            email,
            "Document Signing Request",
            f"Click this link to sign: {public_link}"
        )
    except:
        pass  # avoid breaking API if email not configured yet

    return {
        "message": "Public signing link generated",
        "link": public_link
    }
