from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogResponse
from typing import List

router = APIRouter(prefix="/api/audit", tags=["Audit"])

@router.get("/{doc_id}", response_model=List[AuditLogResponse])
def get_audit_logs(doc_id: int, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).filter(AuditLog.document_id == doc_id).all()
    return logs
