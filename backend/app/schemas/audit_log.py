from pydantic import BaseModel
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    document_id: int
    action: str
    ip_address: str
    timestamp: datetime

    model_config = {
        "from_attributes": True
    }
