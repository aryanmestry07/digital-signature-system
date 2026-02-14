from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base
import uuid

class SigningToken(Base):
    __tablename__ = "signing_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(Integer, ForeignKey("documents.id"))
    email = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="active")  # active | used | expired
