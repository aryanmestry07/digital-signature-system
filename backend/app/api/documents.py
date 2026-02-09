from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import shutil
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.models.user import User


from app.db.database import SessionLocal
from app.models.document import Document

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔐 JWT protection
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 🔹 Save metadata with user info
    document = Document(
        filename=file.filename,
        file_path=file_path,
        uploaded_by=current_user.id,  # 👈 link to logged-in user
        status="uploaded"
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return {
        "id": document.id,
        "filename": document.filename,
        "uploaded_by": current_user.email,
        "message": "PDF uploaded securely"
    }
