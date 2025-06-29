from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class APIKeyCreate(BaseModel):
    name: Optional[str] = None


class APIKeyBase(BaseModel):
    key_id: str
    key: str


class APIKeyResponse(APIKeyBase):
    created_at: datetime


class APIKeyInDB(BaseModel):
    key_id: str
    created_at: datetime
    revoked: bool

    model_config = {"from_attributes": True}
