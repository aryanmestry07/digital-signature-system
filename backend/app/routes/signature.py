client_ip = request.client.host

create_audit_log(
    db=db,
    user_id=current_user.id,
    document_id=doc.id,
    action="SIGNED",
    ip=client_ip
)
