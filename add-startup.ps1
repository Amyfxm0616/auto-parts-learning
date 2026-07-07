$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\AutoPartsPlatform.lnk")
$Shortcut.TargetPath = "C:\Users\fuxiaomin\auto-parts-learning\启动服务.bat"
$Shortcut.WorkingDirectory = "C:\Users\fuxiaomin\auto-parts-learning"
$Shortcut.Description = "Auto Parts Learning Platform"
$Shortcut.Save()
Write-Host "Startup shortcut created successfully!" -ForegroundColor Green
Write-Host "Location: $env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\AutoPartsPlatform.lnk"