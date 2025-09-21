#!/bin/bash

# MyNote2.0 应用启动脚本
# 用于同时启动后端和前端服务

set -e  # 遇到错误时退出

echo "🚀 启动 MyNote2.0 应用..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查是否安装了必要的依赖
echo "📦 检查依赖..."

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    exit 1
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 创建日志目录
mkdir -p logs

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend

# 检查虚拟环境
if [ ! -d ".venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv .venv
fi

# 激活虚拟环境
source .venv/bin/activate

# 安装Python依赖
if [ -f "requirements.txt" ]; then
    echo "📦 安装Python依赖..."
    pip install -r requirements.txt
fi

# 启动后端服务（后台运行）
echo "🚀 启动后端API服务 (端口 8008)..."
nohup uvicorn main:app --host 0.0.0.0 --port 8008 > /dev/null 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"

# 返回项目根目录
cd ..

# 启动前端服务
echo "🔧 启动前端服务..."
cd forward

# 安装Node.js依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装Node.js依赖..."
    npm install
fi

# 构建前端应用
echo "🏗️  构建前端应用..."
npm run build

# 启动前端服务（后台运行）
echo "🚀 启动前端服务 (端口 3000)..."
nohup npm start > /dev/null 2>&1 &
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
echo ""

# 等待服务启动
sleep 3

# 检查服务状态
echo "🔍 检查服务状态..."
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ 后端服务运行正常"
else
    echo "❌ 后端服务启动失败"
fi

if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "✅ 前端服务运行正常"
else
    echo "❌ 前端服务启动失败"
fi

echo ""
echo "🌟 应用已就绪，请访问 http://localhost:3000 开始使用！"