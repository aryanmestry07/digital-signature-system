from fastapi import Request
from app.utils.audit import create_audit_log


client_ip = request.client.host

create_audit_log(
    db=db,
    user_id=current_user.id,
    document_id=new_doc.id,
    action="UPLOADED",
    ip=client_ip
)
