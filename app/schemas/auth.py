from pydantic import BaseModel, EmailStr
from typing import Optional

# 用户注册请求
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# 用户信息响应
class User(BaseModel):
    id: int
    username: str
    email: str
    is_active: int
    is_admin: int

    class Config:
        from_attributes = True

# 访问令牌响应
class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: str
    username: str

# 令牌数据
class TokenData(BaseModel):
    username: Optional[str] = None

# 刷新令牌请求
class RefreshToken(BaseModel):
    refresh_token: str

# 用户信息更新请求
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

# 密码修改请求
class PasswordChange(BaseModel):
    current_password: str
    new_password: str
