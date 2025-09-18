from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

import crud 
import schemas
import models
import auth  # ✅ 改为这样导入
from dependencies import get_db, get_current_user

# Create an API router instance
router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# --- 1. User Registration (POST /users/) ---
@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_new_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user account.
    """
    # Check if a user with the same email already exists
    db_user_by_email = crud.get_user_by_email(db, email=user_data.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )
    # Check if a user with the same username already exists
    db_user_by_username = crud.get_user_by_username(db, username=user_data.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken."
        )

    return crud.create_user(db=db, user=user_data)

# 添加登录端点
@router.post("/login", response_model=schemas.Token)
def login_user(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    User login endpoint
    """
    user = crud.authenticate_user(db, user_data.username, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(  # ✅ 使用 auth.create_access_token
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """
    Get current user information
    """
    return current_user
