Set WshShell = CreateObject("WScript.Shell")

' 项目路径
projectPath = "C:\Users\fuxiaomin\auto-parts-learning"

' 检查服务是否已运行（端口5000）
Set shell = CreateObject("WScript.Shell")
Set exec = shell.Exec("netstat -ano | findstr :5000")
output = exec.StdOut.ReadAll

If InStr(output, "LISTENING") > 0 Then
    ' 服务已在运行，不重复启动
    WScript.Quit
End If

' 启动服务（静默模式）
WshShell.Run "cmd /c cd /d " & projectPath & " && npm run dev", 0, False

WScript.Quit
