@echo off
REM 后台静默启动局域网服务器

cd /d "%~dp0"

REM 检查是否已经在运行
tasklist /FI "WINDOWTITLE eq Auto Parts Learning - LAN Server" 2>nul | find /I /N "node.exe">nul
if "%ERRORLEVEL%"=="0" (
    echo 服务器已在运行中
    exit /b 0
)

REM 后台启动服务器（最小化窗口）
start /MIN "Auto Parts Learning - LAN Server" serve dist -l 5000 --no-clipboard

echo 局域网服务器已启动（后台运行）
echo 访问地址：http://10.245.138.184:5000
timeout /t 2 /nobreak >nul
