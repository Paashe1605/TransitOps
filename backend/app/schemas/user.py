from pydantic import BaseModel, EmailStr
from app.models.models import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    role: RoleEnum = RoleEnum.DRIVER

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True
