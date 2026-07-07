@echo off
echo ========================================
echo   汽车零部件学习平台 - 局域网服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 检查构建文件...
if not exist "dist\index.html" (
    echo 错误：构建文件不存在，正在构建...
    call npm run build
    if errorlevel 1 (
        echo 构建失败，请检查错误信息
        pause
        exit /b 1
    )
)

echo [2/4] 停止可能存在的服务...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill //F //PID %%a >nul 2>&1
)

echo [3/4] 启动局域网服务器...
echo.
echo 正在启动服务器，请稍候...
echo.

REM 使用 http-server 在 5000 端口提供静态文件服务
start "Auto Parts Learning - LAN Server" npx http-server dist -p 5000 -a 0.0.0.0

timeout /t 5 /nobreak >nul

echo [4/4] 服务器已启动！
echo.

REM 获取当前 IP 地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "10."') do (
    set IP=%%a
)
set IP=%IP:~1%

echo ========================================
echo   访问地址（局域网内）
echo ========================================
echo.
echo   本机访问：http://localhost:5000
if defined IP (
    echo   局域网访问：http://%IP%:5000
) else (
    echo   局域网访问：http://10.245.138.184:5000
)
echo.
echo   请将局域网地址分享给同事
echo.
echo ========================================
echo   操作说明
echo ========================================
echo.
echo   - 保持此窗口打开，服务器将持续运行
echo   - 关闭窗口将停止服务器
echo   - 同事需要在同一局域网内访问
echo   - 如果无法访问，请检查防火墙设置
echo.
echo ========================================

REM 配置防火墙规则（需要管理员权限）
echo [配置防火墙规则...]
netsh advfirewall firewall show rule name="Auto Parts Learning LAN" >nul 2>&1
if %errorlevel% neq 0 (
    echo 首次运行需要添加防火墙规则...
    echo 如果弹出权限请求，请点击"允许"
    netsh advfirewall firewall add rule name="Auto Parts Learning LAN" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ 防火墙规则已添加
    ) else (
        echo ⚠ 需要管理员权限添加防火墙规则
        echo   请右键此文件，选择"以管理员身份运行"
        echo   或手动配置防火墙允许 5000 端口
    )
) else (
    echo ✓ 防火墙规则已存在
)

echo.
echo 按任意键打开浏览器...
pause >nul

start http://localhost:5000

echo.
echo 服务器正在运行中...
echo 按 Ctrl+C 或关闭窗口可停止服务器
echo.
pause
