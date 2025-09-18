from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker  # ✅ 新的导入方式
import os



# 确保 database 目录存在
database_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "database")
os.makedirs(database_dir, exist_ok=True)

# 使用绝对路径
DATABASE_URL = f"sqlite:///{os.path.join(database_dir, 'notes.db')}"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()  # ✅ 新的方式

# 数据库依赖函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建表的函数
def create_tables():
    Base.metadata.create_all(bind=engine)
    print(f"数据库文件位置: {DATABASE_URL}")


if __name__ == "__main__":
    create_tables()