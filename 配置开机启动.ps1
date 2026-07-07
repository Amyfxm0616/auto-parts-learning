$WshShell = New-Object -ComObject WScript.Shell
$projectPath = "C:\Users\fuxiaomin\auto-parts-learning"

# 检查服务是否已运行
$portCheck = & netstat -ano | Select-String ":5000" | Select-String "LISTENING"
if ($portCheck) {
    Write-Host "服务已在运行中，跳过启动"
    exit
}

# 创建启动脚本快捷方式
$shortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\AutoPartsPlatform.lnk"
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "$projectPath\启动服务-静默.vbs"
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "Auto Parts Learning Platform - Auto Start"
$shortcut.Save()

Write-Host "开机启动已配置完成" -ForegroundColor Green
Write-Host "快捷方式: $shortcutPath" -ForegroundColor Yellow
Write-Host ""
Write-Host "注意：首次运行需要以管理员权限执行此脚本" -ForegroundColor Cyan