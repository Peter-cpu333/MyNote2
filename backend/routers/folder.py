# 文件: routers/folders.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# 修改这些导入
import crud
import schemas
import models
from dependencies import get_db, get_current_user
# 创建一个APIRouter实例
router = APIRouter(
    prefix="/folders",
    tags=["folders"]
)

# --- 1. 创建文件夹 (POST) ---
@router.post("/", response_model=schemas.FolderRead, status_code=status.HTTP_201_CREATED)
def create_folder(
    folder_data: schemas.FolderCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    为当前认证用户创建一个新的文件夹。
    """
    # 调用 CRUD 函数
    db_folder = crud.create_folder(
        db=db,
        folder=folder_data,
        owner_id=current_user.id
    )
    return db_folder

# --- 2. 获取所有文件夹 (GET) ---
@router.get("/", response_model=List[schemas.FolderRead])
def read_folders(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取当前用户的所有文件夹列表。
    """
    # 调用 CRUD 函数
    folders = crud.get_folders_by_owner(db=db, owner_id=current_user.id)
    return folders

# --- 3. 获取单个文件夹 (GET by ID) ---
@router.get("/{folder_id}", response_model=schemas.FolderRead)
def read_folder(
    folder_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    获取指定ID的文件夹，前提是该文件夹属于当前用户。
    """
    # 调用 CRUD 函数
    db_folder = crud.get_folder_by_id(
        db=db,
        folder_id=folder_id,
        owner_id=current_user.id
    )
    if not db_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found or you don't have permission"
        )
    return db_folder

# --- 4. 更新文件夹 (PUT) ---
@router.put("/{folder_id}", response_model=schemas.FolderRead)
def update_folder(
    folder_id: int,
    folder_data: schemas.FolderUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    更新指定ID的文件夹。
    """
    # 调用 CRUD 函数
    db_folder = crud.update_folder(
        db=db,
        folder_id=folder_id,
        owner_id=current_user.id,
        folder_data=folder_data
    )
    if not db_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found or you don't have permission"
        )
    return db_folder

# --- 5. 删除文件夹 (DELETE) ---
@router.delete("/{folder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_folder(
    folder_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    删除指定ID的文件夹。
    """
    # 调用 CRUD 函数
    success = crud.delete_folder(
        db=db,
        folder_id=folder_id,
        owner_id=current_user.id
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Folder not found or you don't have permission"
        )
    return {"message": "Folder deleted successfully"}