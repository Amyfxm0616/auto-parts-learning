@echo off
echo ========================================
echo 配置防火墙以允许端口5000访问
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [错误] 需要管理员权限！
    echo 请右键点击此文件，选择"以管理员身份运行"
    echo.
    pause
    exit /b 1
)

echo [1/3] 正在添加防火墙规则...
netsh advfirewall firewall add rule name="Vite Dev Server 5000" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1

if %errorLevel% equ 0 (
    echo [成功] 防火墙规则已添加
) else (
    echo [警告] 规则可能已存在，尝试删除后重新添加...
    netsh advfirewall firewall delete rule name="Vite Dev Server 5000" >nul 2>&1
    netsh advfirewall firewall add rule name="Vite Dev Server 5000" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
    echo [成功] 防火墙规则已更新
)

echo.
echo [2/3] 正在验证配置...
netsh advfirewall firewall show rule name="Vite Dev Server 5000" | findstr /C:"Vite Dev Server 5000" >nul
if %errorLevel% equ 0 (
    echo [成功] 防火墙规则验证通过
) else (
    echo [错误] 防火墙规则验证失败
)

echo.
echo [3/3] 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
echo [信息] 您的IP地址: %IP%
echo.

echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 同事现在可以通过以下地址访问您的网站：
echo http:%IP%:5000
echo.
echo 请确保：
echo 1. npm run dev 服务器正在运行
echo 2. 您和同事连接到同一个WiFi网络
echo.
pause
