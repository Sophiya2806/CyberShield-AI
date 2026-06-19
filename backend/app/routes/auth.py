from fastapi import APIRouter, HTTPException, Depends
from app.models import UserCreate, UserLogin
from app.services.auth import get_password_hash, verify_password, create_access_token
from app.services.database import get_db
from datetime import datetime

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    db = get_db()
    
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    
    new_user = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "created_at": datetime.utcnow().isoformat()
    }
    
    result = db.users.insert_one(new_user)
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "message": "User registered successfully",
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/login")
async def login(user: UserLogin):
    db = get_db()
    
    db_user = db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "name": db_user["name"],
            "email": db_user["email"]
        }
    }
