from fastapi import APIRouter, Request
import uuid
from app.utils.clerk import authenticate_user

router = APIRouter()


@router.get("/generate-api-key")
def generate_api_key(request: Request):
    user = authenticate_user(request=request)
    return {"drag_api_key": "drag_abc"}
