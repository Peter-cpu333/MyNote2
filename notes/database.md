# database.py文件详解

## 1 创建数据库文件

```python
DATABASE_URL = f"sqlite:///{os.path.join(database_dir, 'notes.db')}
# 会在项目文件中创建一个 notes.db 文件
```

>   **比喻**：就像在你桌子上放了一个文件柜，所有数据都存在这里

## 2 确保网站（FastAPI）能随时连接到数据库

```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```

>**比喻**：就像给你家装了电话线，随时可以打电话

```python
# 如果没有这个，那么路由无法访问数据库：
@app.get("/users/")  # ❌ 无法连接数据库
def get_users():
    # 怎么获取用户数据？没有连接！
    pass

# 有了这个：
@app.get("/users/")  # ✅ 可以连接数据库
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()  # 成功获取数据
```

## 3 每次用户操作时，给他一个专用的数据库"通道”

```python
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

>   **比喻**：就像银行的取号机，每个客户都有自己的服务窗口

```python
# 用户A想创建笔记：
session_A = SessionLocal()  # 给用户A一个专用通道
session_A.add(note_A)
session_A.commit()

# 用户B同时想查看笔记：
session_B = SessionLocal()  # 给用户B另一个专用通道
notes = session_B.query(Note).all()

# 两个用户互不干扰！
```

## 4 为所有数据表提供统一的"模板”

```python
Base = declarative_base()
```

>   **比喻**：就像建房子的标准图纸，所有房子都按这个标准建

```python
# 有了 Base，你可以轻松创建各种模型：
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    
# 所有模型都继承 Base 的功能
```

## 5 FastAPI 自动给每个请求提供数据库连接，用完自动回收

```python
def get_db():
    db = SessionLocal()
    try:
        yield db  # 给你一个数据库连接
    finally:
        db.close()  # 自动关闭连接
```

>   **比喻**：就像酒店的房卡系统，自动分配房间，退房时自动回收

```python
@app.post("/notes/")
def create_note(title: str, db: Session = Depends(get_db)):
    # FastAPI 自动执行：
    # 1. 调用 get_db() 获取数据库连接
    # 2. 把连接传给 db 参数
    # 3. 函数结束后自动关闭连接
    
    note = Note(title=title)
    db.add(note)
    db.commit()
    return note
    # 连接自动关闭，无需手动管理！
```

##  **完整的工作流程**

让我用一个完整的例子展示它们如何协作：

```python
# 1. 用户在浏览器访问：POST /notes/
# 2. FastAPI 收到请求
@app.post("/notes/")
def create_note(title: str, db: Session = Depends(get_db)):
    # 3. Depends(get_db) 触发：
    #    - F [依赖注入] 自动调用 get_db()
    #    - D [会话工厂] SessionLocal() 创建新会话
    #    - C [连接管理] engine 提供数据库连接
    
    # 4. 使用 E [模型基类] 创建的 Note 模型
    note = Note(title=title)
    
    # 5. 操作 B [数据库文件] notes.db
    db.add(note)
    db.commit()
    
    # 6. F [依赖注入] 自动关闭连接
    return note
```

##  **用生活场景类比**

想象这是一个**图书馆系统**：

-   **B → G**：建造了图书馆大楼（notes.db）
-   **C → H**：安装了门禁系统（FastAPI 能访问数据库）
-   **D → I**：设置了借书台（每个读者都有专用服务）
-   **E → J**：制定了图书分类标准（User/Note 模型规范）
-   **F → K**：配备了自动管理员（自动分配和回收资源）

现在明白每个部分的作用了吗？它们就像一个精密的机器，每个零件都有特定的功能！🎯