from fastapi import HTTPException, Request
from httpx import Request
from clerk_backend_api import Clerk, AuthenticateRequestOptions
import os
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

clerk_sdk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))


def authenticate_user(request: Request):
    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=[
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",
                ],
                jwt_key=os.getenv("JWT_KEY"),
            ),
        )

        return request_state.is_signed_in, request_state.payload.get("sub")

    except Exception as e:
        logger.error(f"Error authenticating user - {e} - {request_state.reason}")
        raise HTTPException(status_code=500, detail="Error authenticating user")
