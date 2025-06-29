from datetime import datetime
import os
import time
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Request, Depends, HTTPException, status
from loguru import logger
from sqlalchemy.orm import Session
from app.utils.clerk import authenticate_user
from app.schemas.keys import APIKeyCreate, APIKeyResponse
from app.db.database import get_db
from app.db.models import User, APIKey

load_dotenv()

router = APIRouter()

UNKEY_URL = os.getenv("UNKEY_URL")
HEADERS = {
    "Authorization": f"Bearer {os.getenv('UNKEY_ROOT_KEY')}",
    "Content-Type": "application/json",
}


@router.post("/", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    request: Request, key_data: APIKeyCreate, db: Session = Depends(get_db)
):

    is_signed_in, clerk_user_id = authenticate_user(request)

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

    # create the API key
    payload = {
        "apiId": os.getenv("UNKEY_API_ID"),
        "ownerId": user.id,
        "externalId": user.id,
        "meta": {"name": key_data.name} if key_data.name else None,
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{UNKEY_URL}/keys.createKey", json=payload, headers=HEADERS
            )
            res.raise_for_status()
            key_info = res.json()
    except Exception as e:
        logger.error(f"Unkey error: {e}")
        raise HTTPException(500, "Key creation failed")

    db_key = APIKey(
        key_id=key_info["keyId"],
        user_id=user.id,
        prefix=key_info["key"][:8],  # First 8 chars as prefix
        created_at=datetime.now(),
    )
    db.add(db_key)
    db.commit()

    return {
        "key_id": key_info["keyId"],
        "key": key_info["key"],
        "api_id": os.getenv("UNKEY_API_ID"),
        "created_at": db_key.created_at,
    }
