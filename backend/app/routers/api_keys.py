from fastapi import APIRouter, Request
import uuid
import time
from app.utils.clerk import authenticate_user

router = APIRouter()


@router.get("/create")
def create_api_key(request: Request):
    time.sleep(3)
    user, user_id = authenticate_user(request=request)
    return {"drag_api_key": "drag_abc", "user": user_id}
