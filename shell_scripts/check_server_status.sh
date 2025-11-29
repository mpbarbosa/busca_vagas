#!/bin/bash

# Script to check the status of nginx and node web servers
# Usage: ./check_server_status.sh

echo "======================================"
echo "  Web Servers Status Check"
echo "======================================"
echo ""

# Check nginx status
echo "📋 Nginx Server Status:"
echo "--------------------------------------"
if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo "✅ Nginx is running"
        systemctl status nginx --no-pager -l | grep -E "(Active:|Main PID:|Tasks:|Memory:|CPU:)"
    elif pgrep nginx > /dev/null; then
        echo "✅ Nginx is running (detected by process)"
        ps aux | grep -E "nginx: (master|worker)" | grep -v grep
    else
        echo "❌ Nginx is not running"
    fi
else
    echo "⚠️  Nginx is not installed"
fi

echo ""
echo "======================================"
echo ""

# Check Node.js processes
echo "📋 Node.js Server Status:"
echo "--------------------------------------"
if command -v node &> /dev/null; then
    NODE_PROCESSES=$(pgrep -f "node.*server" | wc -l)
    if [ "$NODE_PROCESSES" -gt 0 ]; then
        echo "✅ Found $NODE_PROCESSES Node.js server process(es) running"
        echo ""
        ps aux | grep -E "node.*(server|app|index)" | grep -v grep | awk '{print "  PID: " $2 " | CPU: " $3 "% | MEM: " $4 "% | CMD: " substr($0, index($0,$11))}'
    else
        echo "❌ No Node.js server processes found"
    fi
    echo ""
    echo "All Node.js processes:"
    NODE_ALL=$(pgrep node | wc -l)
    if [ "$NODE_ALL" -gt 0 ]; then
        echo "  Total Node.js processes: $NODE_ALL"
        ps aux | grep node | grep -v grep | awk '{print "  PID: " $2 " | CMD: " substr($0, index($0,$11))}'
    else
        echo "  No Node.js processes running"
    fi
else
    echo "⚠️  Node.js is not installed"
fi

echo ""
echo "======================================"
echo ""

# Check listening ports
echo "📋 Active Web Server Ports:"
echo "--------------------------------------"
if command -v ss &> /dev/null; then
    echo "HTTP/HTTPS ports in use:"
    ss -tlnp 2>/dev/null | grep -E ":(80|443|3000|8080|8000|5000)" || echo "  No common web server ports detected"
elif command -v netstat &> /dev/null; then
    echo "HTTP/HTTPS ports in use:"
    netstat -tlnp 2>/dev/null | grep -E ":(80|443|3000|8080|8000|5000)" || echo "  No common web server ports detected"
else
    echo "⚠️  Neither ss nor netstat available"
fi

echo ""
echo "======================================"
echo "Status check completed at $(date)"
echo "======================================"
