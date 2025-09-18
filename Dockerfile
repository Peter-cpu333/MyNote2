# MyNote2.0 应用 Dockerfile
# 多阶段构建：前端构建 + 后端运行

# 阶段1: 构建前端
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY forward/package*.json ./

# 安装前端依赖
RUN npm ci --only=production

# 复制前端源码
COPY forward/ ./

# 构建前端应用
RUN npm run build

# 阶段2: 运行时环境
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 安装Node.js (用于运行前端)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# 复制后端依赖文件
COPY backend/requirements.txt ./backend/

# 安装Python依赖
RUN pip install --no-cache-dir -r backend/requirements.txt

# 复制后端源码
COPY backend/ ./backend/

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/next.config.ts ./frontend/

# 安装前端运行时依赖
WORKDIR /app/frontend
RUN npm ci --only=production

# 回到应用根目录
WORKDIR /app

# 复制启动脚本
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

# 创建日志目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3000 8008

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 && curl -f http://localhost:8008/health || exit 1

# 启动应用
CMD ["./docker-start.sh"]