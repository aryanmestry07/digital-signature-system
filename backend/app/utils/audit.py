from app.models.audit_log import AuditLog

def create_audit_log(db, user_id, document_id, action, ip):
    log = AuditLog(
        user_id=user_id,
        document_id=document_id,
        action=action,
        ip_address=ip
    )
    db.add(log)
    db.commit()
