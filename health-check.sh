#!/bin/bash

# MyNote2.0 健康检查脚本
# 用于监控应用服务状态

echo "🔍 MyNote2.0 健康检查..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
check_service() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    echo -n "检查 $name... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "$url" 2>/dev/null); then
        if [ "$response" = "$expected_code" ]; then
            echo -e "${GREEN}✅ 正常${NC} (HTTP $response)"
            return 0
        else
            echo -e "${RED}❌ 异常${NC} (HTTP $response)"
            return 1
        fi
    else
        echo -e "${RED}❌ 无法连接${NC}"
        return 1
    fi
}

# 检查进程
check_process() {
    local name=$1
    local pattern=$2
    
    echo -n "检查 $name 进程... "
    
    if pgrep -f "$pattern" > /dev/null; then
        local pid=$(pgrep -f "$pattern" | head -1)
        echo -e "${GREEN}✅ 运行中${NC} (PID: $pid)"
        return 0
    else
        echo -e "${RED}❌ 未运行${NC}"
        return 1
    fi
}

# 检查磁盘空间
check_disk_space() {
    echo -n "检查磁盘空间... "
    
    local usage=$(df . | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -lt 80 ]; then
        echo -e "${GREEN}✅ 正常${NC} (使用率: ${usage}%)"
        return 0
    elif [ "$usage" -lt 90 ]; then
        echo -e "${YELLOW}⚠️  警告${NC} (使用率: ${usage}%)"
        return 1
    else
        echo -e "${RED}❌ 空间不足${NC} (使用率: ${usage}%)"
        return 1
    fi
}

# 检查内存使用
check_memory() {
    echo -n "检查内存使用... "
    
    if command -v free > /dev/null; then
        local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
        
        if [ "$usage" -lt 80 ]; then
            echo -e "${GREEN}✅ 正常${NC} (使用率: ${usage}%)"
            return 0
        elif [ "$usage" -lt 90 ]; then
            echo -e "${YELLOW}⚠️  警告${NC} (使用率: ${usage}%)"
            return 1
        else
            echo -e "${RED}❌ 内存不足${NC} (使用率: ${usage}%)"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  无法检查${NC}"
        return 1
    fi
}

# 主检查流程
main() {
    local failed=0
    
    echo "===================="
    echo "🏥 服务健康检查"
    echo "===================="
    
    # 检查HTTP服务
    check_service "前端服务" "http://localhost:3000" || ((failed++))
    check_service "后端API" "http://localhost:8008" || ((failed++))
    check_service "API文档" "http://localhost:8008/docs" || ((failed++))
    
    echo ""
    echo "===================="
    echo "🔧 进程检查"
    echo "===================="
    
    # 检查进程
    check_process "后端进程" "uvicorn main:app" || ((failed++))
    check_process "前端进程" "npm.*start\|next.*start" || ((failed++))
    
    echo ""
    echo "===================="
    echo "💻 系统资源检查"
    echo "===================="
    
    # 检查系统资源
    check_disk_space || ((failed++))
    check_memory || ((failed++))
    
    echo ""
    echo "===================="
    echo "📊 检查结果"
    echo "===================="
    
    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}🎉 所有检查通过！应用运行正常${NC}"
        exit 0
    else
        echo -e "${RED}❌ 发现 $failed 个问题，请检查上述输出${NC}"
        exit 1
    fi
}

# 运行检查
main "$@"