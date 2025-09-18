from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# 修改这些导入
import crud
import schemas
import models
from dependencies import get_db, get_current_user

# 创建一个 APIRouter 实例
router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)

# --- 1. 创建笔记 (POST) ---
@router.post("/", response_model=schemas.NoteRead, status_code=status.HTTP_201_CREATED)
def create_new_note(
    note_data: schemas.NoteCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    为当前认证用户创建一个新笔记。
    """
    # 调用 CRUD 函数
    return crud.create_note(db=db, note=note_data, owner_id=current_user.id)

# --- 2. 获取所有笔记 (GET) ---
@router.get("/", response_model=List[schemas.NoteRead])
def read_all_notes(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取当前用户的所有笔记。
    """
    # 调用 CRUD 函数
    notes = crud.get_notes_by_owner(db=db, owner_id=current_user.id)
    return notes

# --- 3. 获取单个笔记 (GET by ID) ---
@router.get("/{note_id}", response_model=schemas.NoteRead)
def read_note_by_id(
    note_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    根据笔记 ID 获取单个笔记。
    """
    # 调用 CRUD 函数
    db_note = crud.get_note_by_id(db=db, note_id=note_id, owner_id=current_user.id)
    if not db_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you don't have permission"
        )
    return db_note

# --- 4. 更新笔记 (PUT) ---
@router.put("/{note_id}", response_model=schemas.NoteRead)
def update_existing_note(
    note_id: int,
    note_data: schemas.NoteUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新指定 ID 的笔记。
    """
    # 调用 CRUD 函数
    db_note = crud.update_note(
        db=db,
        note_id=note_id,
        owner_id=current_user.id,
        note_data=note_data
    )
    if not db_note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you don't have permission"
        )
    return db_note

# --- 5. 删除笔记 (DELETE) ---
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_note(
    note_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    删除指定 ID 的笔记。
    """
    # 调用 CRUD 函数
    success = crud.delete_note(db=db, note_id=note_id, owner_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or you don't have permission"
        )
    # 返回 204 No Content 状态码表示成功删除，无需返回体
    return None

# --- 6. 获取特定文件夹中的所有笔记 (GET) ---
@router.get("/folder/{folder_id}", response_model=List[schemas.NoteRead])
def read_notes_in_a_folder(
    folder_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取指定文件夹中的所有笔记。
    """
    # 额外检查文件夹是否属于当前用户
    folder = crud.get_folder_by_id(db, folder_id=folder_id, owner_id=current_user.id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found or you don't have permission"
        )
    
    # 调用 CRUD 函数
    notes = crud.get_notes_in_folder(db=db, folder_id=folder_id, owner_id=current_user.id)
    return notes