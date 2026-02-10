# 汽车零部件材料学习平台

一个面向大学生的汽车零部件和材料学习Web应用。

## 功能特点

### 1. 零部件浏览
- 按系统分类（发动机、底盘、制动、车身、内饰）
- 详细的零部件信息展示
- 包含功能描述、工作条件、制造工艺
- 显示每个零部件使用的材料

### 2. 材料数据库
- 8种常用汽车材料（铝合金、碳钢、高强度钢、塑料、复合材料等）
- 详细的材料属性（密度、强度、熔点等）
- 材料优缺点分析
- 典型应用场景
- 显示使用该材料的所有零部件

### 3. 搜索和筛选
- 按名称搜索零部件和材料
- 按系统筛选零部件
- 按类别筛选材料

### 4. 学习笔记
- 创建和管理学习笔记
- 添加标签分类
- 收藏重要内容
- 数据本地存储

### 5. 练习测验
- 10道精选测验题
- 三个难度级别（简单、中等、困难）
- 即时反馈和详细解析
- 学习统计追踪

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **路由**: React Router v6
- **样式**: Tailwind CSS
- **数据存储**: LocalStorage (示例数据在代码中)

## 快速开始

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 项目结构

```
src/
├── data/              # 示例数据
│   ├── materials.ts   # 材料数据
│   ├── parts.ts       # 零部件数据
│   ├── systems.ts     # 系统分类
│   └── questions.ts   # 测验题目
├── pages/             # 页面组件
│   ├── Home.tsx
│   ├── PartsPage.tsx
│   ├── PartDetailPage.tsx
│   ├── MaterialsPage.tsx
│   ├── MaterialDetailPage.tsx
│   ├── QuizPage.tsx
│   └── NotesPage.tsx
├── types/             # TypeScript类型定义
│   └── index.ts
├── App.tsx            # 主应用组件
└── main.tsx           # 入口文件
```

## 数据扩展

### 添加新的材料

编辑 `src/data/materials.ts`:

```typescript
{
  id: 'mat-009',
  name: '材料名称',
  category: 'metal', // metal | plastic | composite | rubber | ceramic | other
  properties: {
    density: '数值',
    tensileStrength: '数值',
    // ... 其他属性
  },
  description: '材料描述',
  advantages: ['优点1', '优点2'],
  disadvantages: ['缺点1', '缺点2'],
  applications: ['应用1', '应用2']
}
```

### 添加新的零部件

编辑 `src/data/parts.ts`:

```typescript
{
  id: 'part-011',
  name: '零部件名称',
  category: '系统分类',
  materials: ['mat-001', 'mat-002'], // 材料ID数组
  primaryMaterial: 'mat-001',
  description: '零部件描述',
  function: '功能描述',
  workingConditions: {
    temperature: '温度范围',
    pressure: '压力',
    environment: '工作环境'
  },
  manufacturingProcess: ['工艺1', '工艺2']
}
```

### 添加测验题目

编辑 `src/data/questions.ts`:

```typescript
{
  id: 'q-011',
  type: 'single',
  question: '问题内容？',
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: 1, // 正确答案索引（0-3）
  explanation: '答案解析',
  difficulty: 'medium', // easy | medium | hard
  relatedPartId: 'part-001', // 可选
  relatedMaterialId: 'mat-001' // 可选
}
```

## 后续扩展建议

1. **数据库集成**: 将数据从代码迁移到后端数据库
2. **用户系统**: 添加用户注册登录，同步笔记到云端
3. **3D模型**: 集成Three.js展示零部件3D模型
4. **交互式图解**: 添加可点击的汽车示意图
5. **更多题目**: 扩充测验题库
6. **学习路径**: 添加推荐学习顺序
7. **对比功能**: 材料和零部件对比分析
8. **图片上传**: 支持上传真实的零部件图片

## 许可证

MIT License
