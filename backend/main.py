# 修复版本
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users_router, notes_router, folders_router
from database import create_tables
from models import folder
from models import user
from models import note

# ✅ 在主应用启动时调用，此时所有模型都已导入
create_tables() 


app = FastAPI(
    title="笔记应用 API",
    description="完整的笔记管理系统",
    version="1.0.0"
)

# CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(users_router, prefix="/api")
app.include_router(folders_router, prefix="/api")
app.include_router(notes_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "笔记应用 API 运行中！"}
