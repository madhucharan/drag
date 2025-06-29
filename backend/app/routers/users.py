from email import message
from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from sqlalchemy.orm import Session
from app.db.models import User
from app.db.database import get_db
from app.schemas.users import UserCreateModel

router = APIRouter()


@router.post("/")
def create_user(user: UserCreateModel, db: Session = Depends(get_db)):

    try:
        user_exists = db.query(User).filter(User.clerk_id == user.clerk_id).first()

        if user_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="User already exists"
            )

        new_user = User(email=user.email, clerk_id=user.clerk_id, name=user.name)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "status": "success",
            "message": "User created successfully",
            "data": {"user_id": new_user.id},
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating user - {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again",
        )


@router.get("/")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()
