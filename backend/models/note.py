from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class Note(BaseModel):
    __tablename__ = "notes"

    title = Column(String(200), nullable=False, comment="笔记标题")
    content = Column(Text, comment="笔记内容")
    # 外键
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, comment="用户ID")
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True, comment="文件夹ID")
    
    # 关系定义
    owner = relationship("User", back_populates="notes")
    folder = relationship("Folder", back_populates="notes")

    def __repr__(self):
        return f"<Note(id={self.id}, title='{self.title}', owner_id={self.owner_id})>"
