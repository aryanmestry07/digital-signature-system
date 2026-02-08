from fastapi import FastAPI
from app.db.database import Base, engine
from app.models import user
from app.api import auth

app = FastAPI(title="Digital Signature System")

app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend running"}
