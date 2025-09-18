from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .base import BaseModel

class Folder(BaseModel):
    __tablename__ = "folders"

    name = Column(String(100), nullable=False, comment="文件夹名称")
    description = Column(String(500), comment="文件夹描述")
    color = Column(String(7), default="#6B73FF", comment="文件夹颜色(hex)")
    is_default = Column(Boolean, default=False, comment="是否为默认文件夹")
    
    # 外键
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, comment="用户ID")
    
    # 关系定义
    owner = relationship("User", back_populates="folders")
    notes = relationship("Note", back_populates="folder")

    def __repr__(self):
        return f"<Folder(id={self.id}, name='{self.name}', owner_id={self.owner_id})>"
