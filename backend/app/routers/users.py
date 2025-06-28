from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import User
from app.db.database import get_db
from app.schemas.users import UserCreateModel

router = APIRouter()


@router.post("/")
def create_user(user: UserCreateModel, db: Session = Depends(get_db)):

    user_exists = db.query(User).filter(User.clerk_id == user.clerk_id).first()

    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="User already exists"
        )

    new_user = User(email=user.email, clerk_id=user.clerk_id, name=user.name)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "user_id": new_user.id}


@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
