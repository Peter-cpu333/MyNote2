#!/bin/bash

# MyNote2.0 应用停止脚本
# 用于停止后端和前端服务

echo "🛑 停止 MyNote2.0 应用..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 停止后端服务
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "🔧 停止后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        sleep 2
        if kill -0 $BACKEND_PID 2>/dev/null; then
            echo "⚠️  强制停止后端服务..."
            kill -9 $BACKEND_PID
        fi
        echo "✅ 后端服务已停止"
    else
        echo "ℹ️  后端服务未运行"
    fi
    rm -f logs/backend.pid
else
    echo "ℹ️  未找到后端服务PID文件"
fi

# 停止前端服务
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "🔧 停止前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        sleep 2
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            echo "⚠️  强制停止前端服务..."
            kill -9 $FRONTEND_PID
        fi
        echo "✅ 前端服务已停止"
    else
        echo "ℹ️  前端服务未运行"
    fi
    rm -f logs/frontend.pid
else
    echo "ℹ️  未找到前端服务PID文件"
fi

# 额外清理：杀死可能残留的进程
echo "🧹 清理残留进程..."
pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "next start" 2>/dev/null || true

echo ""
echo "✅ MyNote2.0 应用已完全停止"
echo ""