from sqlalchemy.orm import Session
from typing import List, Optional
import models 

import schemas

# --- 创建 (Create) ---
def create_note(db: Session, note: schemas.NoteCreate, owner_id: int) -> models.Note:
    """
    在数据库中为特定用户创建一个新笔记。
    """
    db_note = models.Note(
        **note.model_dump(exclude_unset=True),
        owner_id=owner_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

# --- 读取 (Read) ---
def get_note_by_id(db: Session, note_id: int, owner_id: int) -> Optional[models.Note]:
    """
    根据ID和所有者ID获取单个笔记。
    
    返回: 匹配的 Note 对象，如果不存在则返回 None
    """
    return db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.owner_id == owner_id
    ).first()

def get_notes_by_owner(db: Session, owner_id: int) -> List[models.Note]:
    """
    获取属于特定用户的所有笔记。
    
    返回: Note 对象列表
    """
    return db.query(models.Note).filter(models.Note.owner_id == owner_id).all()

def get_notes_in_folder(db: Session, folder_id: int, owner_id: int) -> List[models.Note]:
    """
    获取特定文件夹中的所有笔记。
    
    返回: Note 对象列表
    """
    return db.query(models.Note).filter(
        models.Note.folder_id == folder_id,
        models.Note.owner_id == owner_id
    ).all()


# --- 更新 (Update) ---
def update_note(db: Session, note_id: int, owner_id: int, note_data: schemas.NoteUpdate) -> Optional[models.Note]:
    """
    更新现有笔记。
    
    返回: 更新后的 Note 对象，如果笔记不存在则返回 None
    """
    db_note = get_note_by_id(db, note_id, owner_id)
    if not db_note:
        return None
    
    # 使用 Pydantic 的 model_dump(exclude_unset=True) 只更新传入的字段
    update_data = note_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_note, key, value)
    
    db.commit()
    db.refresh(db_note)
    return db_note

# --- 删除 (Delete) ---
def delete_note(db: Session, note_id: int, owner_id: int) -> bool:
    """
    删除现有笔记。
    
    返回: 如果成功删除则返回 True，否则返回 False
    """
    db_note = get_note_by_id(db, note_id, owner_id)
    if not db_note:
        return False
    
    db.delete(db_note)
    db.commit()
    return True