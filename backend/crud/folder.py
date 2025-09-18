from sqlalchemy.orm import Session

import models
import schemas
from typing import List, Optional

# --- 创建 (Create) ---
def create_folder(db: Session, folder: schemas.FolderCreate, owner_id: int) -> models.Folder:
    """
    在数据库中创建一个新文件夹。
    
    参数:
    - db: SQLAlchemy 数据库会话
    - folder: FolderCreate schema，包含文件夹数据
    - owner_id: 文件夹所有者的用户ID
    
    返回:
    - 创建的 Folder 数据库对象
    """
    db_folder = models.Folder(
        **folder.model_dump(),
        owner_id=owner_id
    )
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

# --- 读取 (Read) ---
def get_folder_by_id(db: Session, folder_id: int, owner_id: int) -> Optional[models.Folder]:
    """
    根据ID和所有者ID获取单个文件夹。
    
    返回:
    - 匹配的 Folder 对象，如果不存在则返回 None
    """
    return db.query(models.Folder).filter(
        models.Folder.id == folder_id,
        models.Folder.owner_id == owner_id
    ).first()

def get_folders_by_owner(db: Session, owner_id: int) -> List[models.Folder]:
    """
    获取属于特定用户的所有文件夹。
    
    返回:
    - Folder 对象列表
    """
    return db.query(models.Folder).filter(models.Folder.owner_id == owner_id).all()

# --- 更新 (Update) ---
def update_folder(db: Session, folder_id: int, owner_id: int, folder_data: schemas.FolderUpdate) -> Optional[models.Folder]:
    """
    更新现有文件夹。
    
    返回:
    - 更新后的 Folder 对象，如果文件夹不存在则返回 None
    """
    db_folder = get_folder_by_id(db, folder_id, owner_id)
    if not db_folder:
        return None
    
    # 使用 Pydantic 的 model_dump(exclude_unset=True) 只更新传入的字段
    update_data = folder_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_folder, key, value)
    
    db.commit()
    db.refresh(db_folder)
    return db_folder

# --- 删除 (Delete) ---
def delete_folder(db: Session, folder_id: int, owner_id: int) -> bool:
    """
    删除现有文件夹。
    
    返回:
    - 如果成功删除则返回 True，否则返回 False
    """
    db_folder = get_folder_by_id(db, folder_id, owner_id)
    if not db_folder:
        return False
    
    # ⚠️ 关联处理：在删除文件夹前，需要处理与它关联的笔记。
    # 选项1: 删除所有关联的笔记
    # db.query(models.Note).filter(models.Note.folder_id == folder_id).delete()
    # 选项2: 将关联笔记的 folder_id 设为 None
    # db.query(models.Note).filter(models.Note.folder_id == folder_id).update({"folder_id": None})
    
    # 在这个例子中，假设你的数据库外键关系是 CASCADE ON DELETE，会自动处理
    # 如果不是，你需要显式地处理关联笔记。
    
    db.delete(db_folder)
    db.commit()
    return True