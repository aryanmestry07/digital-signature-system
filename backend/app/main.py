from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user
from app.api import auth
from app.api import documents
from app.routes import audit

app = FastAPI(title="Digital Signature System")

app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

app.include_router(documents.router)

app.include_router(audit.router)

@app.get("/")
def root():
    return {"message": "Backend running"}
