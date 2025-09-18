from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """用户注册输入模型"""
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=50,
        description="用户名，3-50个字符"
    )
    email: str = Field(
        ..., 
        description="邮箱地址"
    )
    password: str = Field(
        ..., 
        min_length=6, 
        max_length=100,
        description="密码，至少6个字符"
    )
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        """验证用户名格式"""
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('用户名只能包含字母、数字、下划线和连字符')
        return v.lower()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """验证密码强度"""
        if len(v) < 6:
            raise ValueError('密码长度至少6个字符')
        if v.isdigit():
            raise ValueError('密码不能全为数字')
        if v.isalpha():
            raise ValueError('密码不能全为字母')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "email": "john@example.com",
                "password": "password123"
            }
        }

class UserLogin(BaseModel):
    """用户登录输入模型"""
    username: str = Field(
        ..., 
        min_length=3,
        description="用户名"
    )
    password: str = Field(
        ..., 
        min_length=6,
        description="密码"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "johndoe",
                "password": "password123"
            }
        }

class UserResponse(BaseModel):
    """用户信息输出模型"""
    id: int = Field(..., description="用户ID")
    username: str = Field(..., description="用户名")
    email: EmailStr = Field(..., description="邮箱地址")
    is_active: bool = Field(default=True, description="用户状态")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "username": "johndoe",
                "email": "john@example.com",
                "is_active": True,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }

class UserUpdate(BaseModel):
    """用户信息更新模型"""
    username: Optional[str] = Field(
        None, 
        min_length=3, 
        max_length=50,
        description="新用户名（可选）"
    )
    email: Optional[EmailStr] = Field(
        None, 
        description="新邮箱地址（可选）"
    )
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v):
        """验证用户名格式"""
        if v is not None:
            if not v.replace('_', '').replace('-', '').isalnum():
                raise ValueError('用户名只能包含字母、数字、下划线和连字符')
            return v.lower()
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "newusername",
                "email": "newemail@example.com"
            }
        }

class PasswordUpdate(BaseModel):
    """密码修改模型"""
    old_password: str = Field(
        ..., 
        min_length=6,
        description="当前密码"
    )
    new_password: str = Field(
        ..., 
        min_length=6, 
        max_length=100,
        description="新密码，至少6个字符"
    )
    confirm_password: str = Field(
        ..., 
        min_length=6,
        description="确认新密码"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        """验证新密码强度"""
        if len(v) < 6:
            raise ValueError('新密码长度至少6个字符')
        if v.isdigit():
            raise ValueError('新密码不能全为数字')
        if v.isalpha():
            raise ValueError('新密码不能全为字母')
        return v
    
    @field_validator('confirm_password')
    @classmethod
    def passwords_match(cls, v, values):
        """验证密码确认"""
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('两次输入的新密码不一致')
        return v
    
    @field_validator('new_password')
    @classmethod
    def new_password_different(cls, v, values):
        """验证新密码与旧密码不同"""
        if 'old_password' in values and v == values['old_password']:
            raise ValueError('新密码不能与当前密码相同')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "old_password": "oldpassword123",
                "new_password": "newpassword456",
                "confirm_password": "newpassword456"
            }
        }

class Token(BaseModel):
    """JWT令牌响应模型"""
    access_token: str = Field(..., description="访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }

class TokenData(BaseModel):
    """JWT令牌数据模型"""
    email: Optional[str] = Field(None, description="用户邮箱")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@example.com"
            }
        }