from fastapi import APIRouter, Request, HTTPException, Depends, status
from loguru import logger
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.schemas.users import UserCreateModel
from svix.webhooks import Webhook
import os
import json


router = APIRouter()


@router.post("/clerk")
async def handle_clerk_webhook(request: Request, db: Session = Depends(get_db)):
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")
    if not webhook_secret:
        logger.error("CLERK_WEBHOOK_SECRET not set")
        raise HTTPException(status_code=500, detail="Missing Clerk webhook secret")

    try:

        body = await request.body()
        payload = body.decode("utf-8")
        headers = dict(request.headers)

        webhook = Webhook(webhook_secret)

        webhook.verify(payload, headers)

        data = json.loads(payload)

        event_type = data.get("type")

        if event_type not in ["user.created", "user.updated", "user.deleted"]:
            return {"status": "ignored"}

        user_data = data.get("data", {})
        clerk_id = user_data.get("id")
        email = user_data.get("email_addresses", [{}])[0].get("email_address")
        name = user_data.get("first_name")

        user_exists = db.query(User).filter(User.clerk_id == clerk_id).first()

        if event_type == "user.created":
            if user_exists:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail="User already exists"
                )

            new_user = User(email=email, clerk_id=clerk_id, name=name)

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return {
                "status": "success",
                "message": "User created successfully",
                "data": {
                    "event": event_type,
                    "user_id": new_user.id,
                },
            }
        elif event_type == "user.updated":
            if not user_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            user_exists.email = email
            user_exists.name = name
            db.commit()
            db.refresh(user_exists)

            return {
                "status": "success",
                "message": "User updated successfully",
                "data": {"event": event_type},
            }

        elif event_type == "user.deleted":
            if not user_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )

            db.delete(user_exists)
            db.commit()

            return {
                "status": "success",
                "message": "User deleted successfully",
                "data": {"event": event_type},
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching event - {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
