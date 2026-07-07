@echo off
echo ========================================
echo 橡胶材料库文件创建工具
echo ========================================
echo.

cd /d C:\Users\fuxiaomin\auto-parts-learning

echo [1/5] 创建 rubber 组件目录...
if not exist "src\components\rubber" mkdir "src\components\rubber"
echo ✓ 目录创建完成

echo.
echo [2/5] 检查核心文件...
if exist "src\types\rubber.ts" (
    echo ✓ rubber.ts 已存在
) else (
    echo ✗ rubber.ts 缺失，请手动创建
)

if exist "src\data\rubberMaterials.ts" (
    echo ✓ rubberMaterials.ts 已存在
) else (
    echo ✗ rubberMaterials.ts 缺失，请手动创建
)

if exist "src\components\rubber\EnhancedRubberMaterialView.tsx" (
    echo ✓ EnhancedRubberMaterialView.tsx 已存在
) else (
    echo ✗ EnhancedRubberMaterialView.tsx 缺失，请手动创建
)

echo.
echo [3/5] 检查子组件文件...
set MISSING=0

if not exist "src\components\rubber\RubberMaterialCard.tsx" (
    echo ✗ RubberMaterialCard.tsx 缺失
    set MISSING=1
)

if not exist "src\components\rubber\RubberFilterPanel.tsx" (
    echo ✗ RubberFilterPanel.tsx 缺失
    set MISSING=1
)

if not exist "src\components\rubber\RubberCompareModal.tsx" (
    echo ✗ RubberCompareModal.tsx 缺失
    set MISSING=1
)

if not exist "src\components\rubber\RubberSelectionWizard.tsx" (
    echo ✗ RubberSelectionWizard.tsx 缺失
    set MISSING=1
)

if %MISSING%==0 (
    echo ✓ 所有子组件已存在
)

echo.
echo [4/5] 文件清单
echo ----------------------------------------
dir /b src\types\rubber.ts 2>nul && echo ✓ src\types\rubber.ts || echo ✗ src\types\rubber.ts
dir /b src\data\rubberMaterials.ts 2>nul && echo ✓ src\data\rubberMaterials.ts || echo ✗ src\data\rubberMaterials.ts
dir /b src\components\rubber\EnhancedRubberMaterialView.tsx 2>nul && echo ✓ src\components\rubber\EnhancedRubberMaterialView.tsx || echo ✗ src\components\rubber\EnhancedRubberMaterialView.tsx
dir /b src\components\rubber\RubberMaterialCard.tsx 2>nul && echo ✓ src\components\rubber\RubberMaterialCard.tsx || echo ✗ src\components\rubber\RubberMaterialCard.tsx
dir /b src\components\rubber\RubberFilterPanel.tsx 2>nul && echo ✓ src\components\rubber\RubberFilterPanel.tsx || echo ✗ src\components\rubber\RubberFilterPanel.tsx
dir /b src\components\rubber\RubberCompareModal.tsx 2>nul && echo ✓ src\components\rubber\RubberCompareModal.tsx || echo ✗ src\components\rubber\RubberCompareModal.tsx
dir /b src\components\rubber\RubberSelectionWizard.tsx 2>nul && echo ✓ src\components\rubber\RubberSelectionWizard.tsx || echo ✗ src\components\rubber\RubberSelectionWizard.tsx

echo.
echo [5/5] 下一步操作
echo ----------------------------------------
if %MISSING%==1 (
    echo 1. 从 INTEGRATION_GUIDE.md 复制缺失的子组件代码
    echo 2. 粘贴到 src\components\rubber\ 目录下
)
echo 3. 修改 src\pages\MaterialsPage.tsx（参考集成指南）
echo 4. 运行: npm run dev
echo 5. 访问: http://localhost:5000/materials
echo.

echo ========================================
echo 详细说明请查看以下文档：
echo - INTEGRATION_GUIDE.md （集成指南）
echo - IMPLEMENTATION_CHECKLIST.md （实施清单）
echo ========================================

pause
