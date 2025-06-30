from datetime import datetime
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Depends, HTTPException, status
from loguru import logger
from sqlalchemy.orm import Session
from app.utils.clerk import authenticate_user
from app.schemas.keys import APIKeyCreate, APIKeyInDB, APIKeyResponse
from app.db.database import get_db
from app.db.models import User, APIKey
from unkey_py import Unkey

from backend.app.schemas import keys

load_dotenv()

router = APIRouter()

unkey_client = Unkey(bearer_auth=os.getenv("UNKEY_ROOT_KEY", ""))


@router.post("/", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    request: Request, key_data: APIKeyCreate, db: Session = Depends(get_db)
):
    is_signed_in, clerk_user_id = authenticate_user(request)

    if not unkey_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unkey client error",
        )

    if not is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    # fetch the user
    user = db.query(User).filter(User.clerk_id == clerk_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    try:
        res = unkey_client.keys.create(
            request={
                "api_id": os.getenv("UNKEY_API_ID"),
                "owner_id": user.id,
                "external_id": user.id,
                "name": key_data.name if key_data.name else None,
            }
        )
    except Exception as e:
        logger.error(f"Unkey SDK error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Key creation failed",
        )

    if res.object is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid response from Unkey",
        )

    db_key = APIKey(
        key_id=res.object.key_id,
        user_id=user.id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(db_key)
    db.commit()

    return {
        "key_id": res.object.key_id,
        "key": res.object.key,
        "created_at": db_key.created_at,
    }


@router.get("/", response_model=list[APIKeyInDB])
async def list_api_keys(request: Request, db: Session = Depends(get_db)):
    is_signed_in, clerk_user_id = authenticate_user(request)

    if not is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    user = db.query(User).filter(User.clerk_id == clerk_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    keys = (
        db.query(APIKey)
        .filter(APIKey.user_id == user.id, APIKey.revoked == False)
        .all()
    )

    return {
        "status": "success",
        "message": "API keys fetched successfully",
        "data": {"keys": keys},
    }


@router.get("/{key_id}", response_model=APIKeyInDB)
async def get_api_key(key_id: str, request: Request, db: Session = Depends(get_db)):
    is_signed_in, clerk_user_id = authenticate_user(request)

    if not is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    user = db.query(User).filter(User.clerk_id == clerk_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    key = (
        db.query(APIKey)
        .filter(APIKey.key_id == key_id, APIKey.user_id == user.id)
        .first()
    )
    if not key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="API Key not found"
        )

    return key


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(key_id: str, request: Request, db: Session = Depends(get_db)):
    is_signed_in, clerk_user_id = authenticate_user(request)
    if not is_signed_in:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user = db.query(User).filter(User.clerk_id == clerk_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    key = (
        db.query(APIKey)
        .filter(APIKey.key_id == key_id, APIKey.user_id == user.id)
        .first()
    )
    if not key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="API key not found"
        )

    try:
        unkey_client.keys.revoke(key_id)
    except Exception as e:
        logger.error(f"Unkey revoke failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke API key",
        )

    key.revoked = True
    key.updated_at = datetime.now()
    db.commit()

    return {
        "status": "success",
        "message": "API key revoked successfully",
        "data": {"key_id": key_id},
    }
