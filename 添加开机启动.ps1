$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\汽车零部件学习平台.lnk")
$Shortcut.TargetPath = "C:\Users\fuxiaomin\auto-parts-learning\启动服务.bat"
$Shortcut.WorkingDirectory = "C:\Users\fuxiaomin\auto-parts-learning"
$Shortcut.Description = "启动汽车零部件材料学习平台"
$Shortcut.Save()
Write-Host "开机启动快捷方式已创建成功！" -ForegroundColor Green
Write-Host "位置: $env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\汽车零部件学习平台.lnk"