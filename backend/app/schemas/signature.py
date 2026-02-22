from pydantic import BaseModel
from typing import Optional


class SignatureCreate(BaseModel):
    document_id: int
    x: float
    y: float
    page: int


class SignatureResponse(BaseModel):
    id: int
    doc_id: int          # ✅ FIXED
    user_id: int
    x: float
    y: float
    page: int
    status: str
    rejection_reason: Optional[str] = None

    model_config = {
        "from_attributes": True
    }