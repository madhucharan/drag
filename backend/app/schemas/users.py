from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional


class UserCreateModel(BaseModel):
    email: EmailStr
    clerk_id: str
    name: Optional[str] = None

    @field_validator("email", "clerk_id")
    def must_not_be_blank(cls, v, field):
        if not v.strip():
            raise ValueError(f"{field.name} cannot be empty")
        return v
