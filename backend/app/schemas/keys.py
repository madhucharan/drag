from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class APIKeyCreate(BaseModel):
    name: Optional[str] = None


class APIKeyResponse(BaseModel):
    key_id: str
    key: str
    api_id: str
    created_at: datetime


class APIKeyInDB(BaseModel):
    key_id: str
    prefix: str
    created_at: datetime
    revoked: bool

    model_config = {"from_attributes": True}
