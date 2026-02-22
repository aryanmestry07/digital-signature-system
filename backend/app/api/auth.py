from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import verify_password, hash_password
from app.core.jwt import create_access_token
from app.core.auth import get_current_user
from app.db.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Pydantic model for JSON request body
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print("---- LOGIN ATTEMPT ----")
    print("Username received:", form_data.username)
    print("Password received:", form_data.password)

    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        print("User NOT found in database")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    print("User found:", user.email)
    print("Stored hashed password:", user.password)

    is_valid = verify_password(form_data.password, user.password)
    print("Password match result:", is_valid)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }