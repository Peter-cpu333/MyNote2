# MyNote2.0 部署指南

本文档提供了多种部署 MyNote2.0 应用的方法，适用于不同的服务器环境和需求。

## 📋 目录

- [系统要求](#系统要求)
- [方法1: 直接部署](#方法1-直接部署)
- [方法2: Docker部署](#方法2-docker部署)
- [方法3: systemd服务部署](#方法3-systemd服务部署)
- [方法4: 使用Nginx反向代理](#方法4-使用nginx反向代理)
- [安全配置](#安全配置)
- [监控和维护](#监控和维护)
- [故障排除](#故障排除)

## 🖥️ 系统要求

### 最低要求
- **操作系统**: Linux (Ubuntu 20.04+, CentOS 8+) 或 macOS
- **内存**: 1GB RAM
- **存储**: 2GB 可用空间
- **网络**: 开放端口 3000 (前端) 和 8008 (后端API)

### 软件依赖
- **Python**: 3.8+
- **Node.js**: 16+
- **npm**: 8+
- **Git**: 2.0+

### 可选依赖
- **Docker**: 20.10+ (用于容器化部署)
- **Docker Compose**: 1.29+ (用于编排部署)
- **Nginx**: 1.18+ (用于反向代理)

## 🚀 方法1: 直接部署

### 1.1 克隆项目
```bash
git clone https://github.com/Peter-cpu333/MyNote2.git
cd MyNote2.0
```

### 1.2 安装依赖

**后端依赖:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..
```

**前端依赖:**
```bash
cd forward
npm install
npm run build
cd ..
```

### 1.3 启动应用
```bash
# 使用启动脚本
./start.sh

# 或者手动启动
# 后端
cd backend && source .venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8008 &
# 前端
cd forward && npm start &
```

### 1.4 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8008
- API文档: http://localhost:8008/docs

### 1.5 停止应用
```bash
./stop.sh
```

## 🐳 方法2: Docker部署

### 2.1 使用Docker Compose (推荐)
```bash
# 构建并启动
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 2.2 使用单独的Docker命令
```bash
# 构建镜像
docker build -t mynote2.0 .

# 运行容器
docker run -d \
  --name mynote2.0 \
  -p 3000:3000 \
  -p 8008:8008 \
  -v $(pwd)/backend/database:/app/backend/database \
  -v $(pwd)/logs:/app/logs \
  mynote2.0

# 查看日志
docker logs -f mynote2.0

# 停止容器
docker stop mynote2.0
docker rm mynote2.0
```

### 2.3 使用Nginx反向代理
```bash
# 启动应用和Nginx
docker-compose --profile with-nginx up -d

# 访问应用 (通过Nginx)
# http://localhost (端口80)
```

## ⚙️ 方法3: systemd服务部署

### 3.1 安装系统服务
```bash
# 使用安装脚本 (需要root权限)
sudo ./install-service.sh
```

### 3.2 手动安装
```bash
# 创建用户
sudo useradd -r -s /bin/false -d /opt/mynote2.0 mynote

# 复制文件
sudo mkdir -p /opt/mynote2.0
sudo cp -r . /opt/mynote2.0/
sudo chown -R mynote:mynote /opt/mynote2.0
sudo chmod +x /opt/mynote2.0/*.sh

# 安装服务文件
sudo cp mynote.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable mynote
```

### 3.3 服务管理
```bash
# 启动服务
sudo systemctl start mynote

# 停止服务
sudo systemctl stop mynote

# 重启服务
sudo systemctl restart mynote

# 查看状态
sudo systemctl status mynote

# 查看日志
sudo journalctl -u mynote -f

# 禁用自动启动
sudo systemctl disable mynote
```

## 🌐 方法4: 使用Nginx反向代理

### 4.1 安装Nginx
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 4.2 配置Nginx
```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/mynote
sudo ln -s /etc/nginx/sites-available/mynote /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 4.3 SSL配置 (可选)
```bash
# 使用Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# 或者使用自签名证书
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem
```

## 🔒 安全配置

### 5.1 防火墙设置
```bash
# Ubuntu (ufw)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 5.2 环境变量配置
```bash
# 创建环境配置文件
cp backend/.env.example backend/.env
cp forward/.env.local.example forward/.env.local

# 编辑配置文件，设置安全的密钥和数据库连接
nano backend/.env
nano forward/.env.local
```

### 5.3 数据库安全
```bash
# 设置数据库文件权限
chmod 600 backend/database/notes.db
chown mynote:mynote backend/database/notes.db
```

## 📊 监控和维护

### 6.1 日志管理
```bash
# 查看应用日志
tail -f logs/backend.log
tail -f logs/frontend.log

# 使用logrotate管理日志
sudo nano /etc/logrotate.d/mynote
```

### 6.2 健康检查
```bash
# 检查服务状态
curl -f http://localhost:3000
curl -f http://localhost:8008/health

# 使用脚本监控
./health-check.sh
```

### 6.3 备份数据
```bash
# 备份数据库
cp backend/database/notes.db backup/notes_$(date +%Y%m%d_%H%M%S).db

# 自动备份脚本
crontab -e
# 添加: 0 2 * * * /path/to/backup-script.sh
```

## 🔧 故障排除

### 7.1 常见问题

**端口被占用:**
```bash
# 查看端口占用
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8008

# 杀死占用进程
sudo kill -9 <PID>
```

**权限问题:**
```bash
# 检查文件权限
ls -la /opt/mynote2.0/
sudo chown -R mynote:mynote /opt/mynote2.0/
```

**依赖问题:**
```bash
# 重新安装依赖
cd backend && pip install -r requirements.txt
cd forward && npm install
```

### 7.2 性能优化

**系统优化:**
```bash
# 增加文件描述符限制
echo "mynote soft nofile 65536" >> /etc/security/limits.conf
echo "mynote hard nofile 65536" >> /etc/security/limits.conf
```

**应用优化:**
```bash
# 使用生产模式
export NODE_ENV=production
export PYTHONOPTIMIZE=1
```

### 7.3 更新应用
```bash
# 拉取最新代码
git pull origin main

# 重新构建和重启
./restart.sh

# 或者使用Docker
docker-compose pull
docker-compose up -d
```

## 📞 支持

如果遇到问题，请：

1. 查看日志文件
2. 检查系统资源使用情况
3. 确认网络连接和端口开放
4. 参考GitHub Issues: https://github.com/Peter-cpu333/MyNote2.git/issues

---

**祝您部署顺利！🎉**