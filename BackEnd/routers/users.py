from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate, UserLogin, Token
from utils.security import hash_password, verify_password, create_access_token
from auth import get_db, get_current_user

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter_by(username=user.username).first():
        raise HTTPException(status_code=400, detail="Username já em uso")
    if db.query(User).filter_by(phone=user.phone).first():
        raise HTTPException(status_code=400, detail="Número de celular já registrado")

    hashed = hash_password(user.password)
    db_user = User(
        username=user.username,
        phone=user.phone,
        password=hashed
    )
    db.add(db_user)
    db.commit()
    return {"msg": "Usuário registrado com sucesso"}

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(phone=data.phone).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = create_access_token({"sub": user.username})
    return {"access_token": token}

@router.get("/find")
def find_user_by_contact(
        contact: str = Query(..., description="Número de telefone do usuário"),
        db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.phone == contact).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return {
        "id": user.id,
        "username": user.username,
        "phone": user.phone
    }

@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "phone": current_user.phone
    }