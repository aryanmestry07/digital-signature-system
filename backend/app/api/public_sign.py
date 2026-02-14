from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.signing_token import SigningToken
from app.models.document import Document

router = APIRouter(prefix="/public", tags=["Public Signing"])

@router.get("/validate/{token}")
def validate_public_token(token: str, db: Session = Depends(get_db)):
    signing_token = db.query(SigningToken).filter(
        SigningToken.token == token,
        SigningToken.status == "active"
    ).first()

    if not signing_token:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    document = db.query(Document).filter(
        Document.id == signing_token.document_id
    ).first()

    signing_token.status = "used"
    db.commit()


    return {
        "document_id": document.id,
        "filename": document.filename
    }
