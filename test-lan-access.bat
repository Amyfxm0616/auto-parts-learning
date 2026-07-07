@echo off
chcp 65001 >nul
echo ====================================
echo 局域网访问测试
echo ====================================
echo.

echo [1/4] 检查本机IP地址...
echo.
ipconfig | findstr "IPv4"
echo.

echo [2/4] 检查端口5000监听状态...
echo.
netstat -ano | findstr ":5000" | findstr "LISTENING"
if %errorlevel% == 0 (
    echo ✓ 端口5000正在监听
) else (
    echo ✗ 端口5000未监听，请检查开发服务器是否运行
    echo   运行命令: npm run dev
)
echo.

echo [3/4] 检查防火墙规则...
echo.
netsh advfirewall firewall show rule name=all | findstr "5000" >nul
if %errorlevel% == 0 (
    echo ✓ 防火墙规则已配置
) else (
    echo ! 防火墙可能未配置端口5000
    echo   建议执行以下命令添加规则:
    echo   netsh advfirewall firewall add rule name="Vite Dev 5000" dir=in action=allow protocol=TCP localport=5000
)
echo.

echo [4/4] 测试本机HTTP访问...
echo.
curl -s -o nul -w "HTTP状态码: %%{http_code}\n" http://localhost:5000 2>nul
if %errorlevel% == 0 (
    echo ✓ 本机访问正常
) else (
    echo ! curl命令不可用或访问失败
    echo   请手动在浏览器测试: http://localhost:5000
)
echo.

echo ====================================
echo 测试完成
echo ====================================
echo.
echo 局域网访问地址（供同事使用）:
echo.
echo 📱 客户端: http://10.245.138.74:5000
echo 🔧 管理端: http://10.245.138.74:5000/admin
echo.
echo 快速访问链接:
echo - 首页: http://10.245.138.74:5000/
echo - 零部件: http://10.245.138.74:5000/parts
echo - 材料库: http://10.245.138.74:5000/materials
echo - 3D内饰: http://10.245.138.74:5000/interior-3d
echo - 管理控制台: http://10.245.138.74:5000/admin
echo - 示意图编辑: http://10.245.138.74:5000/admin/diagrams
echo.
echo 注意: IP地址可能会变化，如果无法访问请重新运行此脚本查看新IP
echo.
pause
