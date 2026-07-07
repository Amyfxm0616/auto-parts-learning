@echo off
chcp 65001 >nul

cd /d "%~dp0"

:: 检查是否已经在运行
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo 服务已在运行中...
    exit /b
)

:: 静默启动开发服务器
start /B cmd /c "npm run dev" >nul 2>&1

:: 等待几秒让服务启动
timeout /t 3 /nobreak >nul

echo 服务已启动，访问地址：
echo   http://localhost:5000
echo   http://10.245.137.145:5000

exit /b