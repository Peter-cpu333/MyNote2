根据您的三个表结构和业务需求，我来为每个表确定需要的CRUD操作：

## 1. User表 CRUD

**Create（创建）：**
- [ ] `create_user()` - 用户注册（自动创建默认文件夹）
- [ ] `verify_user()` - 用户登录验证

**Read（查询）：**
- [ ] `get_user_by_id()` - 根据ID获取用户信息
- [ ] `get_user_by_email()` - 根据邮箱获取用户（登录用）

**Update（更新）：**
- [ ] `update_user_profile()` - 更新用户基本信息
- [ ] `update_user_password()` - 修改密码
- [ ] `activate_user()` - 激活用户账户

**Delete（删除）：**
- [ ] `delete_user()` - 删除用户（级联删除所有数据）

## 2. Folder表 CRUD

**Create（创建）：**
- [ ] `create_folder()` - 创建新文件夹
- [ ] `create_default_folder()` - 创建默认文件夹（用户注册时调用）

**Read（查询）：**
- [ ] `get_user_folders()` - 获取用户所有文件夹
- [ ] `get_folder_by_id()` - 根据ID获取文件夹详情
- [ ] `get_default_folder()` - 获取用户的默认文件夹

**Update（更新）：**
- [ ] `update_folder()` - 更新文件夹信息（名称、描述、颜色）

**Delete（删除）：**
- [ ] `delete_folder()` - 删除文件夹（非默认，笔记移到默认文件夹）

## 3. Note表 CRUD

**Create（创建）：**
- [ ] `create_note()` - 创建新笔记（未指定文件夹则放入默认文件夹）

**Read（查询）：**
- [ ] `get_user_notes()` - 获取用户所有笔记
- [ ] `get_folder_notes()` - 获取指定文件夹的笔记
- [ ] `get_note_by_id()` - 根据ID获取笔记详情
- [ ] `search_notes()` - 搜索笔记（按标题/内容）

**Update（更新）：**
- [ ] `update_note()` - 更新笔记内容
- [ ] `move_note_to_folder()` - 移动笔记到其他文件夹

**Delete（删除）：**
- [ ] `delete_note()` - 删除笔记

**总计：21个CRUD方法**





## USER

## 📝 UserCRUD 方法清单

### 🔧 **共 7 个方法**

#### 1️⃣ **用户创建**
- `create_user(username, email, password)` - 用户注册

#### 2️⃣ **用户认证** 
- `verify_user(username, password)` - 登录验证

#### 3️⃣ **用户查询**
- `get_user_by_id(user_id)` - 按ID查找
- `get_user_by_username(username)` - 按用户名查找

#### 4️⃣ **用户更新**
- `update_user(user_id, username, email)` - 更新基本信息
- `update_user_password(user_id, old_password, new_password)` - 修改密码

#### 5️⃣ **初始化**
- `__init__(db)` - 构造函数

---

**总结**: 1个构造函数 + 6个业务方法 = **7个方法**



## Folder

## 🎯 **FolderCRUD 功能总结**

### 📋 **方法清单 (9个方法)**

#### 1️⃣ **文件夹创建**

-   `create_folder()` - 创建新文件夹

#### 2️⃣ **文件夹查询**

-   `get_folder_by_id()` - 按ID查找
-   `get_folders_by_user()` - 获取用户所有文件夹
-   `get_default_folder()` - 获取默认文件夹
-   `get_folder_with_notes_count()` - 获取文件夹及笔记数量

#### 3️⃣ **文件夹更新**

-   `update_folder()` - 更新文件夹信息

#### 4️⃣ **文件夹删除**

-   `delete_folder()` - 删除文件夹

#### 5️⃣ **权限验证**

-   `check_folder_ownership()` - 检查所有权

#### 6️⃣ **初始化**

-   `__init__()` - 构造函数





## Note

## 🎯 **NoteCRUD 功能总结**

### 📋 **方法清单 (15个方法)**

#### 1️⃣ **笔记创建**

-   `create_note()` - 创建新笔记

#### 2️⃣ **笔记查询**

-   `get_note_by_id()` - 按ID查找
-   `get_notes_by_user()` - 获取用户笔记
-   `get_notes_by_folder()` - 获取文件夹笔记
-   `get_uncategorized_notes()` - 获取未分类笔记
-   `get_recent_notes()` - 获取最近笔记

#### 3️⃣ **笔记搜索**

-   `search_notes()` - 全文搜索

#### 4️⃣ **笔记更新**

-   `update_note()` - 更新笔记内容
-   `move_note_to_folder()` - 移动到文件夹
-   `batch_move_notes()` - 批量移动

#### 5️⃣ **笔记删除**

-   `delete_note()` - 删除笔记

#### 6️⃣ **权限验证**

-   `check_note_ownership()` - 检查所有权

#### 7️⃣ **统计分析**

-   `get_notes_statistics()` - 获取统计信息

#### 8️⃣ **初始化**

-   `__init__()` - 构造函数