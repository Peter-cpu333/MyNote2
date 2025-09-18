"""NoteApp应用的Pydantic模型定义

该模块包含了用于API数据验证和序列化的Pydantic模型。
"""

# 从user模块导入用户相关模型
from .user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
    PasswordUpdate,
    Token,
    TokenData
)

# 从folder模块导入文件夹相关模型
from .folder import (
    FolderCreate,
    FolderUpdate,
    FolderRead
)

# 从note模块导入笔记相关模型
from .note import (
    NoteCreate,
    NoteUpdate,
    NoteRead
)

# 定义可导出的公共接口
__all__ = [
    # 用户相关模型
    'UserCreate',
    'UserLogin',
    'UserResponse',
    'UserUpdate',
    'PasswordUpdate',
    'Token',
    'TokenData'
    
    # 文件夹相关模型
    'FolderCreate',
    'FolderUpdate',
    'FolderRead',
    
    # 笔记相关模型
    'NoteCreate',
    'NoteUpdate',
    'NoteRead'
]