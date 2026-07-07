# 部署指南

## 项目已成功构建 ✅
构建文件位置：`dist/` 文件夹

---

## 🚀 推荐部署方式：Netlify Drop（最简单）

### 步骤：
1. 打开浏览器访问：https://app.netlify.com/drop
2. 将 `dist` 文件夹拖拽到页面上
3. 等待上传完成（约10-30秒）
4. 获得永久访问网址（如：`https://xxx.netlify.app`）
5. 分享给同事即可访问

**优点**：无需注册、无需命令行、30秒完成

---

## 📦 方案二：Vercel 部署

### 1. 登录 Vercel
```bash
cd C:\Users\fuxiaomin\auto-parts-learning
vercel login
```

### 2. 部署到生产环境
```bash
vercel --prod
```

### 3. 获取网址
部署成功后会显示网址（如：`https://xxx.vercel.app`）

---

## 🔥 方案三：GitHub Pages

### 1. 初始化 Git 仓库（如果还没有）
```bash
cd C:\Users\fuxiaomin\auto-parts-learning
git init
git add .
git commit -m "Initial commit"
```

### 2. 推送到 GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/auto-parts-learning.git
git branch -M main
git push -u origin main
```

### 3. 部署到 GitHub Pages
```bash
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

### 4. 在 GitHub 仓库设置中启用 Pages
访问：`https://github.com/YOUR_USERNAME/auto-parts-learning/settings/pages`
选择 `gh-pages` 分支

---

## 🌍 当前可访问的地址

### 开发环境（局域网内可访问）
- 本地：http://localhost:5000
- 局域网：http://10.245.138.201:5000

**注意**：这些地址只能在局域网内访问，外网无法访问。

---

## ✨ 推荐：使用 Netlify Drop

**最快速的部署方式：**
1. 访问 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹
3. 获得永久网址
4. 完成！

**无需注册、无需命令行、立即可用！**
