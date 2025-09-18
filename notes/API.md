# 基础 CRUD 操作
POST   /notes              → NoteCreate      → NoteResponse
GET    /notes/{id}         → 无输入          → NoteDetailResponse
PATCH  /notes/{id}         → NoteUpdate      → NoteResponse
DELETE /notes/{id}         → 无输入          → 成功状态

# 笔记管理操作
PUT    /notes/{id}/move    → NoteMove        → NoteResponse
GET    /notes/search       → NotesSearch     → NotesListResponse

# 批量操作
POST   /notes/batch/move   → NoteBatchMove   → 成功状态
POST   /notes/batch/delete → NoteBatchDelete → 成功状态

# 列表查询
GET    /notes              → NotesSearch     → NotesListResponse
GET    /folders/{id}/notes → NotesSearch     → NotesListResponse

## 🔍 **当前文件分析**

### 1. **user.py** 👤

```
复制
# 包含的模型：
✅ UserCreate      - 用户注册
✅ UserLogin       - 用户登录  
✅ UserResponse    - 用户信息输出
✅ UserUpdate      - 用户信息更新
✅ PasswordUpdate  - 密码修改
✅ Token           - JWT令牌响应
✅ ApiResponse     - 通用API响应
```

### 2. **note.py** 📝

```
复制
# 包含的模型：
✅ NoteCreate         - 创建笔记
✅ NoteUpdate         - 更新笔记
✅ NoteMove           - 移动笔记
✅ NotesSearch        - 搜索笔记
✅ NoteBatchMove      - 批量移动
✅ NoteBatchDelete    - 批量删除
✅ NoteResponse       - 笔记信息输出
✅ NoteDetailResponse - 笔记详情输出
✅ NotesListResponse  - 笔记列表输出
```

### 3. **folder.py** 📁

```
复制
# 包含的模型：
✅ FolderCreate       - 创建文件夹
✅ FolderUpdate       - 更新文件夹
✅ FolderMove         - 移动文件夹
✅ FoldersSearch      - 搜索文件夹
✅ FolderBatchMove    - 批量移动文件夹
✅ FolderBatchDelete  - 批量删除文件夹
✅ FolderResponse     - 文件夹信息输出
✅ FoldersListResponse - 文件夹列表输出
```