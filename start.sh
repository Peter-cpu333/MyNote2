#!/bin/bash

# MyNote2.0 应用启动脚本
# 用于同时启动后端和前端服务
# 注意：请先运行 ./setup.sh 安装环境依赖

set -e  # 遇到错误时退出

echo "🚀 启动 MyNote2.0 应用..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"


# 创建日志目录
mkdir -p logs

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
# 激活虚拟环境
source .venv/bin/activate
# 启动后端服务（后台运行）
echo "🚀 启动后端API服务 (端口 8008)..."
nohup uvicorn main:app --host 0.0.0.0 --port 8008 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"


# 返回项目根目录
cd ..
# 启动前端服务
echo "🔧 启动前端服务..."
cd forward
# 启动前端开发服务器（后台运行）

echo "🚀 启动前端开发服务器 (端口 3000)..."

nohup npm run > ../logs/frontend.log 2>&1 &

FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"

# 返回项目根目录
cd ..

echo ""
echo "🎉 MyNote2.0 应用启动完成！"
echo "📱 前端访问地址: http://localhost:3000"
echo "🔧 后端API地址: http://localhost:8008"
echo "📋 API文档地址: http://localhost:8008/docs"
echo ""
echo "🛑 停止服务请运行: ./stop.sh"
echo "📋 查看日志: tail -f logs/backend.log 或 tail -f logs/frontend.log"
echo ""


# 检查服务状态
echo "🔍 检查服务状态..."
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ 后端服务运行正常"
else
    echo "❌ 后端服务启动失败，请查看 logs/backend.log"
fi

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✅ 前端服务运行正常"
else
    echo "❌ 前端服务启动失败，请查看 logs/frontend.log"
fi

echo ""
echo "🌟 应用已就绪，请访问 http://localhost:3000 开始使用！"