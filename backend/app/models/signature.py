from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.database import Base


class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)

    doc_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    x = Column(Integer, nullable=False)
    y = Column(Integer, nullable=False)
    page = Column(Integer, nullable=False)

    status = Column(String, default="PENDING")
    rejection_reason = Column(String, nullable=True)

    document = relationship("Document")
    user = relationship("User")
