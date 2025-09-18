from pydantic import BaseModel, Field, field_validator, constr, constr
from typing import Optional, List
from datetime import datetime
import re


class FolderCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,  
        description="文件夹名称",
    )
    description: Optional[str] = Field(
        None,
        max_length=500,  
        description="文件夹描述",
    )
    color: Optional[str] = Field(
        "#6B73FF",
        max_length=7,  
        description="文件夹颜色(hex格式)，默认为 #6B73FF"
    )
    is_default: Optional[bool] = Field(
        False,
        description="是否为默认文件夹，默认为 False"
    )
    
    @field_validator('name')
    def validate_name(cls, v):
        """验证文件夹名称"""
        if not v or not v.strip():
            raise ValueError('文件夹名称不能为空')
        
        # 去除首尾空格
        v = v.strip()
        
        # 检查非法字符
        invalid_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
        for char in invalid_chars:
            if char in v:
                raise ValueError(f'文件夹名称不能包含字符: {char}')
            
        return v
    
    @field_validator('description')
    def validate_description(cls, v):
        """验证描述内容"""
        if v is not None:
            v = v.strip()
            if len(v) == 0:
                return None
        return v
    
    @field_validator('color')
    def validate_color(cls, v):
        """验证颜色格式"""
        if v is not None:
            # 检查是否为有效的hex颜色格式 (#RRGGBB)
            if not re.match(r'^#[0-9A-Fa-f]{6}$', v):
                raise ValueError('颜色必须为有效的hex格式，如: #6B73FF')
            # 确保长度为7 (包含#号)
            if len(v) != 7:
                raise ValueError('颜色格式必须为7位字符，如: #6B73FF')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "工作笔记",
                "description": "存放工作相关的笔记和文档",
                "color": "#6B73FF",
                "is_default": False
            }
        }

class FolderUpdate(BaseModel):
    name: Optional[str] = Field(
        None, 
        min_length=1, 
        max_length=100,  # ✅ 匹配数据库
        description="新文件夹名称（可选）"
    )
    description: Optional[str] = Field(
        None, 
        max_length=500,  # 🔧 修正：匹配数据库
        description="新文件夹描述（可选）"
    )
    color: Optional[str] = Field(
        None,
        max_length=7,  # 🆕 添加：匹配数据库
        description="新文件夹颜色（可选）"
    )
    is_default: Optional[bool] = Field(
        None,
        description="是否为默认文件夹（可选）"
    )
    
    @field_validator('name')
    def validate_name(cls, v):
        """验证文件夹名称"""
        if v is not None:
            if not v or not v.strip():
                raise ValueError('文件夹名称不能为空')
            
            v = v.strip()
            
            # 检查非法字符
            invalid_chars = ['/', '\\', ':', '*', '?', '"', '<', '>', '|']
            for char in invalid_chars:
                if char in v:
                    raise ValueError(f'文件夹名称不能包含字符: {char}')
                
        return v
    
    @field_validator('description')
    def validate_description(cls, v):
        """验证描述内容"""
        if v is not None:
            v = v.strip()
            if len(v) == 0:
                return None
        return v
    
    @field_validator('color')
    def validate_color(cls, v):
        """验证颜色格式"""
        if v is not None:
            # 检查是否为有效的hex颜色格式
            if not re.match(r'^#[0-9A-Fa-f]{6}$', v):
                raise ValueError('颜色必须为有效的hex格式，如: #6B73FF')
            if len(v) != 7:
                raise ValueError('颜色格式必须为7位字符，如: #6B73FF')
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "个人笔记",
                "description": "更新后的描述信息",
                "color": "#FF6B6B",
                "is_default": False
            }
        }


class FolderRead(BaseModel):
    id: int = Field(..., description="文件夹ID")
    name: str = Field(..., description="文件夹名称")
    description: str | None = Field(None, description="文件夹描述")
    color: str = Field(..., description="文件夹颜色")
    is_default: bool = Field(..., description="是否为默认文件夹")
    owner_id: int = Field(..., description="拥有者ID")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "工作笔记",
                "description": "存放工作相关的笔记和文档",
                "color": "#6B73FF",
                "is_default": False,
                "owner_id": 1,
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00"
            }
        }
