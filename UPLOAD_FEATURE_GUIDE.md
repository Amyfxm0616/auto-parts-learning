# 汽车零部件学习平台 - 一键上传功能测试指南

## 功能已完成实施 ✅

所有核心功能已经成功实现并集成到系统中！

## 访问地址

- **开发服务器**: http://localhost:5000
- **零部件管理页面**: http://localhost:5000/parts

## 已实现功能

### ✅ 1. 文件解析器
- **Word解析器** (`src/services/fileParser/wordParser.ts`)
  - 使用 mammoth 库提取文本和图片

- **PDF解析器** (`src/services/fileParser/pdfParser.ts`)
  - 使用 pdfjs-dist 提取文本并渲染前3页为图片
  - 限制最多处理20页

- **图片OCR解析器** (`src/services/fileParser/imageParser.ts`)
  - 使用 tesseract.js 进行中英文OCR识别
  - 自动压缩图片

- **飞书解析器** (`src/services/fileParser/feishuParser.ts`)
  - 基础实现（可选功能）

### ✅ 2. 智能匹配系统
- **关键词字典** (`src/services/nlp/keywords.ts`)
  - 包含8大系统的关键词映射
  - 包含30+种材料的关键词映射
  - 技术参数正则表达式

- **匹配引擎** (`src/services/nlp/keywordMatcher.ts`)
  - 智能系统匹配（置信度评分）
  - 材料识别和ID映射
  - 技术参数提取（温度、压力、负载、环境）
  - 零部件名称和描述自动提取

### ✅ 3. 存储管理
- **LocalStorageManager** (`src/services/storage/localStorageManager.ts`)
  - 存储配额检查
  - 智能图片压缩（目标400KB）
  - 批量图片处理

### ✅ 4. UI组件
- **上传按钮** (`src/components/upload/UploadButton.tsx`)
  - 渐变色设计，带图标

- **上传模态框** (`src/components/upload/UploadModal.tsx`)
  - 拖拽上传支持
  - 实时进度显示
  - 错误处理

- **数据预览组件** (`src/components/preview/ExtractedDataPreview.tsx`)
  - 识别结果展示
  - 所有字段可编辑
  - 置信度指示器
  - 多图片预览和选择
  - 系统和子专业手动选择

### ✅ 5. 页面集成
- 已集成到 `PartsPage.tsx` (C:\Users\fuxiaomin\auto-parts-learning\src\pages\PartsPage.tsx:757-763)
- "一键上传"按钮位于"添加零部件"按钮旁边

## 测试步骤

### 1. 访问零部件页面
```
打开浏览器访问: http://localhost:5000/parts
```

### 2. 点击"一键上传"按钮
在零部件管理界面右上角，点击带有📤图标的"一键上传"按钮

### 3. 上传测试文件

#### 方式A: 拖拽上传
- 将Word/PDF/图片文件拖拽到上传区域

#### 方式B: 点击选择
- 点击上传区域
- 在文件选择器中选择文件

### 4. 观察解析过程
系统会显示实时进度：
- 正在解析文件... (20%)
- 正在提取信息... (50%)
- 正在匹配系统... (70%)
- 正在压缩图片... (80%)
- 处理完成！ (100%)

### 5. 检查提取结果
- ✅ 零部件名称是否正确
- ✅ 系统分类是否智能推荐（带蓝色标签）
- ✅ 材料是否识别
- ✅ 技术参数是否提取
- ✅ 图片是否显示
- ✅ 置信度指示器显示

### 6. 编辑和确认
- 修改任何不准确的字段
- 选择正确的系统和子专业
- 点击"确认保存"

### 7. 验证保存
- 新零部件应该出现在列表中
- 刷新页面后数据应该保持（localStorage）

## 创建测试文档示例

### Word文档示例 (.docx)

```
仪表板本体

材料：PP-T20、ABS
工作温度：-40°C ~ 85°C
负载：10kg

这是汽车座舱系统的核心部件，位于驾驶员正前方。主要采用注塑成型工艺制造，
使用PP和ABS材料，具有良好的耐候性和机械强度。

[插入一张仪表板图片]
```

### 预期识别结果
- 名称: "仪表板本体"
- 系统: "座舱系统" (置信度 ~80%)
- 材料: PP, ABS
- 技术参数:
  - 温度: -40°C ~ 85°C
  - 负载: 10kg
- 图片: 已提取并压缩

## 支持的文件格式

| 格式 | 扩展名 | 最大大小 | 功能 |
|------|--------|----------|------|
| Word | .docx | 20MB | 文本+图片提取 |
| PDF | .pdf | 20MB | 文本+图片渲染 |
| 图片 | .jpg, .png | 10MB | OCR识别 |

## 关键词匹配参考

### 系统关键词示例
- **座舱系统**: 仪表板、门板、座椅、中控、气囊、氛围灯、显示屏
- **车身系统**: 车门、车顶、保险杠、车灯、玻璃
- **底盘系统**: 悬架、制动、转向、轮胎
- **动力电池系统**: 电池、电芯、BMS、模组
- **热管理系统**: 空调、冷却、散热、压缩机

### 材料关键词示例
- **PP**: 聚丙烯、PP、PP-T20
- **ABS**: ABS、丙烯腈
- **PC**: 聚碳酸酯、PC
- **铝合金**: 铝、铝合金、Al

## 已知限制

1. **localStorage限制**:
   - 浏览器限制约5-10MB
   - 建议每张图片压缩到300KB以下

2. **OCR准确率**:
   - Tesseract.js中文识别率约70-80%
   - 建议使用清晰、正面的图片

3. **PDF处理**:
   - 限制最多处理20页
   - 仅渲染前3页为图片

4. **飞书文档**:
   - 需要Access Token
   - 可能存在CORS限制
   - 建议导出为Word后上传

## 故障排查

### 问题1: 上传后无反应
- 检查浏览器控制台是否有错误
- 确认文件格式和大小符合要求

### 问题2: OCR识别不准确
- 使用更清晰的图片
- 尝试先将图片转为Word文档

### 问题3: 存储空间不足
- 清除浏览器localStorage
- 删除部分旧的零部件数据
- 使用更小的图片

### 问题4: 系统识别不准确
- 手动选择正确的系统和子专业
- 在关键词字典中添加更多关键词

## 文件清单

### 新增文件 (13个)

```
src/
├── types/
│   └── upload.ts                                    # 上传类型定义
├── services/
│   ├── fileParser/
│   │   ├── wordParser.ts                           # Word解析器
│   │   ├── pdfParser.ts                            # PDF解析器
│   │   ├── imageParser.ts                          # 图片OCR解析器
│   │   └── feishuParser.ts                         # 飞书解析器
│   ├── nlp/
│   │   ├── keywords.ts                             # 关键词字典
│   │   └── keywordMatcher.ts                       # 匹配引擎
│   └── storage/
│       └── localStorageManager.ts                  # 存储管理器
├── components/
│   ├── upload/
│   │   ├── UploadButton.tsx                        # 上传按钮
│   │   └── UploadModal.tsx                         # 上传模态框
│   └── preview/
│       └── ExtractedDataPreview.tsx                # 数据预览组件
└── utils/
    └── errorHandler.ts                              # 错误处理器
```

### 修改文件 (1个)
```
src/pages/PartsPage.tsx                              # 集成上传按钮
```

## 下一步增强建议

1. **AI增强**: 接入GPT-4 API提升识别准确率
2. **批量上传**: 支持一次上传多个文件
3. **云存储**: 集成图床服务（如七牛云）
4. **模板系统**: 预定义零部件模板
5. **导出功能**: 导出零部件为Excel/PDF

## 技术栈

- **React 19** + **TypeScript**
- **Vite** 开发服务器
- **Tailwind CSS** 样式
- **mammoth** - Word解析
- **pdfjs-dist** - PDF解析
- **tesseract.js** - OCR识别
- **browser-image-compression** - 图片压缩
- **react-dropzone** - 拖拽上传

---

**实施完成时间**: 2026-03-10
**开发者**: Claude Sonnet 4.5
**状态**: ✅ 所有功能已实现并可测试
