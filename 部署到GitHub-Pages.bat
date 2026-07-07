@echo off
chcp 65001 >nul
title 部署到 GitHub Pages

echo ========================================
echo  汽车零部件学习平台 - 部署工具
echo ========================================
echo.
echo 步骤1: 构建项目...
cd /d "%~dp0"
call npx.cmd vite build
if %ERRORLEVEL% neq 0 (
    echo ❌ 构建失败，请检查代码错误
    pause
    exit /b 1
)
echo ✅ 构建成功
echo.

echo 步骤2: 部署到 GitHub Pages...
node -e "const ghpages = require('gh-pages'); ghpages.publish('dist', { branch: 'gh-pages', repo: 'https://github.com/Amyfxm0616/auto-parts-learning.git', message: '手动部署: ' + new Date().toISOString().slice(0,10), dotfiles: true }, function(err) { if (err) { console.error('❌ 部署失败:', err.message); process.exit(1); } else { console.log('✅ 部署成功!'); } });"
if %ERRORLEVEL% neq 0 (
    echo ❌ 部署失败
    pause
    exit /b 1
)
echo.
echo ========================================
echo  ✅ 部署完成！
echo  网站地址: https://amyfxm0616.github.io/auto-parts-learning/
echo  稍等1-2分钟即可访问
echo ========================================
pause