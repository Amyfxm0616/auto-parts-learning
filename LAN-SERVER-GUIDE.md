# 🌐 局域网永久访问配置指南

## 📋 当前配置

- **服务器IP**: 10.245.138.184
- **端口**: 5000
- **访问地址**: http://10.245.138.184:5000
- **状态**: 已配置局域网服务器

---

## 🚀 快速启动

### 方式一：前台运行（推荐用于测试）
双击运行：
```
start-lan-server.bat
```

**特点**：
- ✅ 可以看到访问日志
- ✅ 关闭窗口即停止服务
- ✅ 适合临时使用

### 方式二：后台运行（推荐用于长期运行）
双击运行：
```
start-lan-server-background.bat
```

**特点**：
- ✅ 后台最小化运行
- ✅ 不占用前台窗口
- ✅ 适合长期运行

---

## 🔥 设置开机自启动（永久运行）

### 方法一：添加到启动文件夹（最简单）

1. 按 `Win + R` 打开运行窗口
2. 输入 `shell:startup` 并回车
3. 将 `start-lan-server-background.bat` 的快捷方式复制到打开的文件夹
4. 重启电脑，服务器将自动启动

### 方法二：使用任务计划程序（更稳定）

1. 打开"任务计划程序"（taskschd.msc）
2. 点击"创建基本任务"
3. 名称：`Auto Parts Learning LAN Server`
4. 触发器：选择"当计算机启动时"
5. 操作：启动程序
   - 程序/脚本：浏览选择 `start-lan-server-background.bat`
   - 起始于：`C:\Users\fuxiaomin\auto-parts-learning`
6. 完成创建

---

## 🛡️ 防火墙配置

### 自动配置（推荐）
运行 `start-lan-server.bat` 会自动添加防火墙规则

### 手动配置（如果自动失败）
以管理员身份打开 PowerShell：
```powershell
New-NetFirewallRule -DisplayName "Auto Parts Learning LAN" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
```

### 验证防火墙规则
```cmd
netsh advfirewall firewall show rule name="Auto Parts Learning LAN"
```

---

## 🔍 IP 地址管理

### 查看当前 IP
```cmd
ipconfig | findstr "IPv4"
```

### 问题：IP 地址经常变化怎么办？

#### 解决方案一：设置静态 IP（推荐）

1. 打开"网络和共享中心"
2. 点击当前网络连接
3. 点击"属性" → "Internet 协议版本 4 (TCP/IPv4)"
4. 选择"使用下面的 IP 地址"：
   - IP 地址：`10.245.138.184`
   - 子网掩码：`255.255.248.0`
   - 默认网关：`10.245.143.254`
   - DNS 服务器：使用公司 DNS

#### 解决方案二：使用主机名访问

同事可以使用计算机名访问：
```
http://您的计算机名:5000
```

查看计算机名：
```cmd
hostname
```

---

## 🧪 测试访问

### 本机测试
浏览器访问：http://localhost:5000

### 局域网测试
1. 在另一台局域网内的电脑上
2. 浏览器访问：http://10.245.138.184:5000
3. 如果无法访问，请检查：
   - ✓ 服务器是否运行（看任务管理器中是否有 node.exe）
   - ✓ 防火墙规则是否添加成功
   - ✓ 是否在同一局域网（ping 10.245.138.184）
   - ✓ IP 地址是否正确（ipconfig）

---

## 🛠️ 管理服务器

### 查看服务器是否运行
```cmd
tasklist | findstr "node.exe"
```

### 停止服务器
```cmd
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *LAN Server*"
```

### 重启服务器
```cmd
# 先停止
taskkill /F /IM node.exe /FI "WINDOWTITLE eq *LAN Server*"
# 再启动
start-lan-server-background.bat
```

---

## 📱 移动设备访问

局域网内的手机、平板也可以访问：
1. 连接到同一 WiFi 网络
2. 浏览器输入：http://10.245.138.184:5000
3. 应用支持响应式设计，移动端体验良好

---

## ⚠️ 常见问题

### Q: 同事无法访问怎么办？

**A: 逐步排查**

1. **检查服务器是否运行**
   ```cmd
   tasklist | findstr "node.exe"
   ```

2. **检查防火墙**
   ```cmd
   netsh advfirewall firewall show rule name="Auto Parts Learning LAN"
   ```
   如果规则不存在，以管理员身份运行 `start-lan-server.bat`

3. **测试网络连通性**
   让同事在命令行运行：
   ```cmd
   ping 10.245.138.184
   ```
   如果无法 ping 通，说明网络不通

4. **检查 IP 地址**
   ```cmd
   ipconfig
   ```
   确认当前 IP 是否为 10.245.138.184

5. **检查端口占用**
   ```cmd
   netstat -ano | findstr "5000"
   ```

### Q: IP 地址变了怎么办？

**A:** 重新运行 `start-lan-server.bat`，它会显示当前 IP 地址
或者设置静态 IP（见上文）

### Q: 能否同时提供外网访问？

**A:** 可以！局域网和外网部署可以同时进行：
- 局域网：http://10.245.138.184:5000（内部快速访问）
- 外网：使用 Netlify Drop 部署（外部访问）

---

## 🎯 推荐配置

### 长期使用的最佳实践

1. ✅ **设置静态 IP**（避免 IP 变化）
2. ✅ **配置开机自启动**（无需手动启动）
3. ✅ **添加防火墙规则**（允许局域网访问）
4. ✅ **使用后台运行模式**（不占用窗口）

完成以上配置后，服务器将：
- 开机自动启动
- 后台持续运行
- IP 地址固定
- 局域网内随时访问

---

## 📞 分享访问地址

### 发送给同事的信息模板

```
🌐 汽车零部件学习平台 - 局域网访问

访问地址：http://10.245.138.184:5000

注意事项：
1. 需要连接到公司局域网（WiFi 或有线网络）
2. 支持电脑、手机、平板访问
3. 建议使用 Chrome 或 Edge 浏览器

功能介绍：
- 零部件库：汽车零部件分类查询
- 材料库：13种工程塑料详细性能数据
- 材料对比：支持多材料性能对比
- 数据导入：支持自定义材料数据

如有问题，请联系我
```

---

## 🔄 更新应用

当您修改了代码需要更新时：

1. 重新构建
   ```cmd
   npm run build
   ```

2. 重启服务器
   ```cmd
   taskkill /F /IM node.exe /FI "WINDOWTITLE eq *LAN Server*"
   start-lan-server-background.bat
   ```

同事刷新页面即可看到更新

---

## 📊 当前部署状态

- ✅ 构建文件：已准备（dist 文件夹）
- ✅ 静态服务器：已安装（serve）
- ✅ 启动脚本：已创建
- ✅ 防火墙配置：自动处理
- ⏳ 开机自启动：待配置（可选）
- ⏳ 静态 IP：待设置（推荐）

---

## 🎉 完成！

现在您可以：
1. 双击 `start-lan-server.bat` 启动服务器
2. 分享访问地址给同事
3. 享受局域网内的快速访问！
