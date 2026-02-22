from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles   # 👈 ADD THIS
from app.db.database import Base, engine
from app.models import user
from app.api import auth
from app.api import documents
from app.routes import audit
from app.routes import signature 

app = FastAPI(title="Digital Signature System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(documents.router)
app.include_router(audit.router)
app.include_router(signature.router)

# 🔥 THIS LINE WAS MISSING
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Backend running"}