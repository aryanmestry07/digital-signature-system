from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

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
