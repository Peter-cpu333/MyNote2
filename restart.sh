#!/bin/bash

# MyNote2.0 应用重启脚本
# 用于重启后端和前端服务

echo "🔄 重启 MyNote2.0 应用..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 停止服务
echo "🛑 停止现有服务..."
./stop.sh

# 等待服务完全停止
echo "⏳ 等待服务完全停止..."
sleep 3

# 启动服务
echo "🚀 启动服务..."
./start.sh

echo ""
echo "✅ MyNote2.0 应用重启完成！"