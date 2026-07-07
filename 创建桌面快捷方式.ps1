$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$releaseDir = Join-Path $scriptDir "release"

$targetPath = Get-ChildItem -Path $releaseDir -Recurse -File -Filter *.exe |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $targetPath) {
  throw "No packaged app found in release directory."
}

$workingDirectory = Split-Path -Parent $targetPath
$shortcutName = [System.IO.Path]::GetFileNameWithoutExtension($targetPath)
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath ($shortcutName + ".lnk")

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.WorkingDirectory = $workingDirectory
$shortcut.Description = "Auto Parts Learning Platform"
$shortcut.Save()
