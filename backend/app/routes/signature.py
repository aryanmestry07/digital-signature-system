from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.db.database import get_db
from app.models.signature import Signature
from app.models.document import Document
from app.schemas.signature import SignatureResponse
from app.dependencies import get_current_user
from app.utils.audit import create_audit_log

router = APIRouter(prefix="/api/signatures", tags=["Signatures"])


# -----------------------------
# Request Schema for Rejection
# -----------------------------
class RejectRequest(BaseModel):
    reason: str


# -----------------------------
# Create Signature (PENDING)
# -----------------------------
@router.post("/")
def create_signature(
    document_id: int,
    x: int,
    y: int,
    page: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    signature = Signature(
        doc_id=document_id,   # ✅ FIXED
        user_id=current_user.id,
        x=x,
        y=y,
        page=page,
        status="PENDING"
    )

    db.add(signature)
    db.commit()
    db.refresh(signature)

    return {"message": "Signature placeholder created", "status": signature.status}


# -----------------------------
# Sign Document
# -----------------------------
@router.post("/{signature_id}/sign")
def sign_document(
    signature_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    signature = db.query(Signature).filter(Signature.id == signature_id).first()

    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")

    if signature.status == "SIGNED":
        raise HTTPException(status_code=400, detail="Already signed")

    signature.status = "SIGNED"
    signature.rejection_reason = None

    db.commit()

    # ✅ FIXED (use doc_id)
    create_audit_log(
        db,
        current_user.id,
        signature.doc_id,
        "SIGNED",
        request.client.host
    )

    return {"message": "Document signed successfully"}


# -----------------------------
# Reject Signature
# -----------------------------
@router.post("/{signature_id}/reject")
def reject_signature(
    signature_id: int,
    data: RejectRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    signature = db.query(Signature).filter(Signature.id == signature_id).first()

    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")

    if signature.status == "SIGNED":
        raise HTTPException(status_code=400, detail="Already signed, cannot reject")

    signature.status = "REJECTED"
    signature.rejection_reason = data.reason

    db.commit()

    # ✅ FIXED (use doc_id)
    create_audit_log(
        db,
        current_user.id,
        signature.doc_id,
        "REJECTED",
        request.client.host
    )

    return {"message": "Signature rejected successfully"}


# -----------------------------
# Get Signatures for Document
# -----------------------------
@router.get("/document/{document_id}", response_model=List[SignatureResponse])
def get_signatures(
    document_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    signatures = db.query(Signature).filter(
        Signature.doc_id == document_id   # ✅ FIXED
    ).all()

    return signatures
