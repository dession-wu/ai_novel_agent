from datetime import datetime, timedelta, UTC
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.models import User

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 令牌有效期
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
ALGORITHM = "HS256"
SECRET_KEY = settings.SECRET_KEY

class AuthService:
    def __init__(self):
        pass

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """生成密码哈希"""
        return pwd_context.hash(password)

    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """创建访问令牌"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(UTC) + expires_delta
        else:
            expire = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """创建刷新令牌"""
        to_encode = data.copy()
        expire = datetime.now(UTC) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """解码令牌"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None

    def create_tokens(self, username: str) -> Dict[str, str]:
        """同时创建访问令牌和刷新令牌"""
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": username, "type": "access"}, 
            expires_delta=access_token_expires
        )
        
        refresh_token = self.create_refresh_token(
            data={"sub": username, "type": "refresh"}
        )
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }

    def verify_refresh_token(self, token: str) -> Optional[str]:
        """验证刷新令牌并返回用户名"""
        payload = self.decode_token(token)
        if payload and payload.get("type") == "refresh":
            return payload.get("sub")
        return None

    def get_user_by_username(self, db: Session, username: str) -> Optional[User]:
        """根据用户名获取用户"""
        return db.query(User).filter(User.username == username).first()

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """根据邮箱获取用户"""
        return db.query(User).filter(User.email == email).first()

    def create_user(self, db: Session, username: str, email: str, password: str) -> User:
        """创建新用户"""
        hashed_password = self.get_password_hash(password)
        db_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate_user(self, db: Session, username: str, password: str) -> Optional[User]:
        """验证用户身份"""
        user = self.get_user_by_username(db, username)
        if not user:
            return None
        if not self.verify_password(password, user.hashed_password):
            return None
        return user

# 创建认证服务实例
auth_service = AuthService()