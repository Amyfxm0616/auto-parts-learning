# Plan: 发布首页咨询窗口

## 根因
- 线上 GitHub Pages 当前 bundle 仍来自 `origin/gh-pages` 的旧部署提交；新首页与在线咨询组件只在本地未提交工作区，因此线上不可见。

## 已获授权的操作
1. 运行构建，确认当前工作区能生成发布产物。
2. 将用户已授权的当前本地全部改动（包含新工作台源码和首页咨询窗口）提交到 `main`。
3. 推送 `main` 到 `origin`，由 `.github/workflows/deploy.yml` 自动构建并发布到 `gh-pages`。
4. 等待并检查线上首页 bundle 是否更新为包含“在线咨询”组件的版本。
