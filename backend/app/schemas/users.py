from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreateModel(BaseModel):
    email: EmailStr
    clerk_id: str
    name: Optional[str] = None
