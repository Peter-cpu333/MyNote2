#!/bin/bash

# MyNote2.0 环境安装脚本
# 用于安装和配置开发环境

set -e  # 遇到错误时退出

echo "🔧 MyNote2.0 环境安装脚本"
echo "=========================="

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 检查是否安装了必要的系统依赖
echo "📦 检查系统依赖..."

# 检查Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 未安装，请先安装 Python3"
    echo "   macOS: brew install python3"
    echo "   Ubuntu: sudo apt-get install python3 python3-pip python3-venv"
    exit 1
else
    echo "✅ Python3 已安装: $(python3 --version)"
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    echo "   macOS: brew install node"
    echo "   Ubuntu: sudo apt-get install nodejs npm"
    echo "   或访问: https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js 已安装: $(node --version)"
fi

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
else
    echo "✅ npm 已安装: $(npm --version)"
fi

echo ""
echo "🐍 设置后端Python环境..."

# 进入后端目录
cd backend

# 创建Python虚拟环境
if [ ! -d ".venv" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv .venv
    echo "✅ Python虚拟环境创建完成"
else
    echo "✅ Python虚拟环境已存在"
fi

# 激活虚拟环境
echo "🔄 激活虚拟环境..."
source .venv/bin/activate

# 升级pip
echo "📦 升级pip..."
pip install --upgrade pip

# 安装Python依赖
if [ -f "requirements.txt" ]; then
    echo "📦 安装Python依赖..."
    pip install -r requirements.txt
    echo "✅ Python依赖安装完成"
else
    echo "⚠️  未找到 requirements.txt 文件"
fi

# 返回项目根目录
cd ..

echo ""
echo "🌐 设置前端Node.js环境..."

# 进入前端目录
cd forward

# 安装Node.js依赖
if [ -f "package.json" ]; then
    echo "📦 安装Node.js依赖..."
    npm install
    echo "✅ Node.js依赖安装完成"
else
    echo "⚠️  未找到 package.json 文件"
fi

# 返回项目根目录
cd ..

# 创建必要的目录
echo ""
echo "📁 创建必要的目录..."
mkdir -p logs
mkdir -p backend/database
echo "✅ 目录创建完成"

echo ""
echo "🎉 环境安装完成！"
echo "=========================="
echo "📋 安装摘要:"
echo "   ✅ Python虚拟环境: backend/.venv"
echo "   ✅ Python依赖: 已安装"
echo "   ✅ Node.js依赖: 已安装"
echo "   ✅ 日志目录: logs/"
echo ""
echo "🚀 现在可以运行 ./start.sh 启动应用"
echo "🛑 停止服务请运行: ./stop.sh"
echo ""