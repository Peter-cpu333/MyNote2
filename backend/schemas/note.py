from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime

# ==================== 1. NoteCreate - 创建笔记 ====================
class NoteCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,  # 匹配数据库 String(200)
        description="笔记标题"
    )
    content: Optional[str] = Field(
        None,
        description="笔记内容"
    )
    folder_id: Optional[int] = Field(
        None,
        description="文件夹ID（可选）"
    )
    
    @field_validator('title')
    def validate_title(cls, v):
        """验证标题"""
        if not v or not v.strip():
            raise ValueError('笔记标题不能为空')
        return v.strip()
    
    @field_validator('content')
    def validate_content(cls, v):
        """验证内容"""
        if v is not None:
            return v.strip() if v.strip() else None
        return v
    
    @field_validator('folder_id')
    def validate_folder_id(cls, v):
        """验证文件夹ID"""
        if v is not None and v <= 0:
            raise ValueError('文件夹ID必须大于0')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "我的第一篇笔记",
                "content": "这是笔记的内容...",
                "folder_id": 1
            }
        }

# ==================== 2. NoteUpdate - 更新笔记 ====================
class NoteUpdate(BaseModel):
    title: Optional[str] = Field(
        None,
        min_length=1,
        max_length=200,
        description="新标题（可选）"
    )
    content: Optional[str] = Field(
        None,
        description="新内容（可选）"
    )
    folder_id: Optional[int] = Field(
        None,
        description="新文件夹ID（可选，设为null可移出文件夹）"
    )
    
    @field_validator('title')
    def validate_title(cls, v):
        """验证标题"""
        if v is not None:
            if not v or not v.strip():
                raise ValueError('笔记标题不能为空')
            return v.strip()
        return v
    
    @field_validator('content')
    def validate_content(cls, v):
        """验证内容"""
        if v is not None:
            return v.strip() if v.strip() else None
        return v
    
    @field_validator('folder_id')
    def validate_folder_id(cls, v):
        """验证文件夹ID"""
        if v is not None and v <= 0:
            raise ValueError('文件夹ID必须大于0')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "更新后的标题",
                "content": "更新后的内容...",
                "folder_id": 2
            }
        }

# ==================== 3. NoteResponse - 笔记信息输出 ====================
class NoteRead(BaseModel):
    id: int
    title: str
    content: Optional[str]
    owner_id: int
    folder_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True  # 允许从 SQLAlchemy 对象创建
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "我的笔记",
                "content": "笔记内容...",
                "owner_id": 1,
                "folder_id": 1,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
