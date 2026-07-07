@echo off
chcp 65001 >nul
echo ========================================
echo   汽车零部件材料学习平台 - 启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo 正在启动开发服务器...
echo.
echo 访问地址：
echo   本地访问: http://localhost:5000
echo   局域网访问: http://PC-5CD5483H6T:5000
echo   IP地址访问: http://10.245.137.145:5000
echo.
echo 按任意键在浏览器中打开本地地址...
pause >nul

echo 正在打开浏览器...
start http://localhost:5000

echo.
echo ========================================
echo   服务器正在运行中...
echo   按 Ctrl+C 可停止服务器
echo ========================================
echo.

call npm run dev

pause