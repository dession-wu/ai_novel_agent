from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.auth_service import auth_service, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas import auth as schemas
from app.api.deps import get_current_user, get_current_active_user, oauth2_scheme

router = APIRouter()
# oauth2_scheme is now imported from deps

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录，获取访问令牌"""
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    tokens = auth_service.create_tokens(user.username)
    return {
        **tokens,
        "username": user.username
    }

@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    # 检查用户名是否已存在
    existing_user = auth_service.get_user_by_username(db, username=user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="用户名已存在")
    
    # 检查邮箱是否已存在
    existing_email = auth_service.get_user_by_email(db, email=user.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="邮箱已存在")
    
    # 创建新用户
    db_user = auth_service.create_user(db, username=user.username, email=user.email, password=user.password)
    return db_user

@router.post("/refresh_token", response_model=schemas.Token)
def refresh_token(refresh_data: schemas.RefreshToken, db: Session = Depends(get_db)):
    """刷新访问令牌"""
    username = auth_service.verify_refresh_token(refresh_data.refresh_token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效或已过期的刷新令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = auth_service.get_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    tokens = auth_service.create_tokens(user.username)
    return {
        **tokens,
        "username": user.username
    }

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user = Depends(get_current_active_user)):
    """获取当前用户信息"""
    return current_user

@router.put("/me", response_model=schemas.User)
def update_users_me(user_data: schemas.UserUpdate, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """更新当前用户信息"""
    try:
        updated_user = auth_service.update_user(
            db, 
            user_id=current_user.id, 
            username=user_data.username, 
            email=user_data.email
        )
        if not updated_user:
            raise HTTPException(status_code=404, detail="用户不存在")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/change_password")
def change_password(password_data: schemas.PasswordChange, current_user = Depends(get_current_active_user), db: Session = Depends(get_db)):
    """修改当前用户密码"""
    success = auth_service.update_password(
        db, 
        user_id=current_user.id, 
        current_password=password_data.current_password, 
        new_password=password_data.new_password
    )
    if not success:
        raise HTTPException(status_code=400, detail="当前密码错误")
    return {"message": "密码修改成功"}
