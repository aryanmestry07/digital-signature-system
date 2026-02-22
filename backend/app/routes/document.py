from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, User
from app.auth import get_current_user
from app.utils.audit import create_audit_log
import shutil
import os

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# 📄 Upload Document
@router.post("/upload")
def upload_document(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_doc = Document(
        name=file.filename,
        path=file_path,
        owner_id=current_user.id,
        status="PENDING"
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    # ✅ Audit Log
    client_ip = request.client.host

    create_audit_log(
        db=db,
        user_id=current_user.id,
        document_id=new_doc.id,
        action="UPLOADED",
        ip=client_ip
    )

    return {"message": "Document uploaded successfully"}


# 📋 Get User Documents
@router.get("/")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(
        Document.owner_id == current_user.id
    ).all()

    return documents