# 汽车零部件材料学习平台 - 开机启动配置脚本

$WshShell = New-Object -ComObject WScript.Shell
$projectPath = "C:\Users\fuxiaomin\auto-parts-learning"

# 创建静默启动的 VBS 脚本
$vbsContent = @"
Set WshShell = CreateObject("WScript.Shell")

' 检查服务是否已运行
Set shell = CreateObject("WScript.Shell")
Set exec = shell.Exec("netstat -ano | findstr :5000")
output = exec.StdOut.ReadAll

If InStr(output, "LISTENING") > 0 Then
    WScript.Quit
End If

' 启动服务（静默模式）
WshShell.Run "cmd /c cd /d " & $projectPath & " && npm run dev", 0, False

WScript.Quit
"@

$vbsPath = "$projectPath\启动服务-静默.vbs"
$vbsContent | Out-File -FilePath $vbsPath -Encoding Default

# 创建开机启动快捷方式
$shortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\AutoPartsPlatform.lnk"
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $vbsPath
$shortcut.WorkingDirectory = $projectPath
$shortcut.Description = "Auto Parts Learning Platform - Auto Start"
$shortcut.Save()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  开机启动配置完成" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "快捷方式位置:" -ForegroundColor Yellow
Write-Host "  $shortcutPath" -ForegroundColor White
Write-Host ""
Write-Host "VBS 脚本位置:" -ForegroundColor Yellow
Write-Host "  $vbsPath" -ForegroundColor White
Write-Host ""
Write-Host "访问地址:" -ForegroundColor Yellow
Write-Host "  http://localhost:5000" -ForegroundColor White
Write-Host "  http://10.245.137.145:5000" -ForegroundColor White
Write-Host ""
Write-Host "说明:" -ForegroundColor Cyan
Write-Host "  1. 服务将在开机后自动静默启动" -ForegroundColor White
Write-Host "  2. 如果服务已运行，不会重复启动" -ForegroundColor White
Write-Host "  3. 可在启动文件夹中删除快捷方式来禁用" -ForegroundColor White
Write-Host "  4. 启动文件夹路径: $env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan