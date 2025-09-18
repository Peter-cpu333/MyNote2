from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models 

import models
import schemas

# 密码哈希工具
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 用户id
def get_user_id(db: Session, username: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if user:
        return user.id
    return None


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


# 创建user
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str):
    """通过邮箱获取用户 - 用于注册时检查重复"""
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    """通过ID获取用户 - 用于认证后获取用户信息"""
    return db.query(models.User).filter(models.User.id == user_id).first()

def authenticate_user(db: Session, username: str, password: str):
    """用户登录验证 - 核心认证功能"""
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


