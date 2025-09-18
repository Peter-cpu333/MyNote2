#!/bin/bash

# MyNote2.0 系统服务安装脚本
# 用于在Linux系统上安装systemd服务

set -e

echo "🔧 安装 MyNote2.0 系统服务..."

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    echo "❌ 请使用root权限运行此脚本"
    echo "   sudo ./install-service.sh"
    exit 1
fi

# 检查systemd是否可用
if ! command -v systemctl &> /dev/null; then
    echo "❌ 系统不支持systemd，无法安装服务"
    exit 1
fi

# 创建专用用户
echo "👤 创建mynote用户..."
if ! id "mynote" &>/dev/null; then
    useradd -r -s /bin/false -d /opt/mynote2.0 mynote
    echo "✅ 用户mynote已创建"
else
    echo "ℹ️  用户mynote已存在"
fi

# 创建应用目录
echo "📁 创建应用目录..."
mkdir -p /opt/mynote2.0
cp -r . /opt/mynote2.0/
chown -R mynote:mynote /opt/mynote2.0
chmod +x /opt/mynote2.0/*.sh

# 安装systemd服务文件
echo "📋 安装systemd服务..."
cp mynote.service /etc/systemd/system/
systemctl daemon-reload

# 启用服务
echo "🚀 启用服务..."
systemctl enable mynote.service

echo ""
echo "✅ MyNote2.0 系统服务安装完成！"
echo ""
echo "📋 服务管理命令："
echo "   启动服务: sudo systemctl start mynote"
echo "   停止服务: sudo systemctl stop mynote"
echo "   重启服务: sudo systemctl restart mynote"
echo "   查看状态: sudo systemctl status mynote"
echo "   查看日志: sudo journalctl -u mynote -f"
echo ""
echo "🔄 服务将在系统启动时自动启动"
echo ""

# 询问是否立即启动服务
read -p "是否立即启动服务？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动服务..."
    systemctl start mynote
    sleep 3
    systemctl status mynote --no-pager
    echo ""
    echo "🌟 服务已启动！访问 http://localhost:3000 开始使用"
fi