#!/bin/bash

# Docker容器内的启动脚本

set -e

echo "🐳 在Docker容器中启动 MyNote2.0 应用..."

# 启动后端服务（后台运行）
echo "🔧 启动后端API服务..."
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port 8008 &
BACKEND_PID=$!
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"

# 启动前端服务
echo "🔧 启动前端服务..."
cd /app/frontend
npm start &
FRONTEND_PID=$!
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"

echo ""
echo "🎉 MyNote2.0 应用在Docker中启动完成！"
echo "📱 前端访问地址: http://localhost:3000"
echo "🔧 后端API地址: http://localhost:8008"
echo ""

# 等待任一服务退出
wait