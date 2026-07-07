# 橡胶材料库集成指南

## 📋 文件清单

已创建的核心文件：

### 1. 类型定义
- ✅ `src/types/rubber.ts` - 橡胶材料专用类型定义

### 2. 数据文件
- ✅ `src/data/rubberMaterials.ts` - 44个详细的橡胶材料数据

### 3. 主组件
- ✅ `src/components/rubber/EnhancedRubberMaterialView.tsx` - 增强版主视图组件

### 4. 需要创建的子组件（简化版代码见下方）
- `src/components/rubber/RubberMaterialCard.tsx` - 材料卡片
- `src/components/rubber/RubberFilterPanel.tsx` - 筛选面板
- `src/components/rubber/RubberCompareModal.tsx` - 对比弹窗
- `src/components/rubber/RubberSelectionWizard.tsx` - 选材助手

---

## 🚀 快速集成步骤

### 步骤 1: 修改 MaterialsPage.tsx

在 `src/pages/MaterialsPage.tsx` 中，找到橡胶材料的渲染部分（大约第 1142-1152 行）：

```typescript
// 原代码
{selectedTab === 'rubber' && (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-2">橡胶材料库</h2>
      <p className="text-gray-600">按用途分类，再按耐温等级（最高使用温度）展示</p>
    </div>
    <RubberMaterialTree materials={materials.filter(m => m.category === 'rubber')} />
  </div>
)}
```

**替换为：**

```typescript
{selectedTab === 'rubber' && (
  <div>
    <EnhancedRubberMaterialView />
  </div>
)}
```

### 步骤 2: 添加导入

在 `MaterialsPage.tsx` 文件顶部添加：

```typescript
import EnhancedRubberMaterialView from '../components/rubber/EnhancedRubberMaterialView';
```

### 步骤 3: 创建子组件

由于完整代码较长，这里提供**最小可用版本**的子组件代码：

#### RubberMaterialCard.tsx（简化版）

```typescript
// src/components/rubber/RubberMaterialCard.tsx
import React from 'react';
import { RubberMaterialExtended } from '../../types/rubber';
import { useNavigate } from 'react-router-dom';

interface Props {
  material: RubberMaterialExtended;
  onAddToCompare: (material: RubberMaterialExtended) => void;
  isInCompareList: boolean;
}

const RubberMaterialCard: React.FC<Props> = ({ material, onAddToCompare, isInCompareList }) => {
  const navigate = useNavigate();

  const tempColors: Record<string, string> = {
    temp1: 'bg-blue-100 text-blue-800',
    temp2: 'bg-cyan-100 text-cyan-800',
    temp3: 'bg-green-100 text-green-800',
    temp4: 'bg-amber-100 text-amber-800',
    temp5: 'bg-red-100 text-red-800',
    temp6: 'bg-red-200 text-red-900'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-400 bg-white">
      {/* 标题 */}
      <div className="mb-3">
        <h4 className="font-bold text-gray-900 mb-1">{material.partName}</h4>
        <p className="text-sm text-gray-600">{material.description}</p>
      </div>

      {/* 材料标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {material.material}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${tempColors[material.tempLevel]}`}>
          {material.tempRange.display}
        </span>
      </div>

      {/* 性能摘要 */}
      {material.performance && (
        <div className="text-xs text-gray-600 mb-3 space-y-1 bg-gray-50 p-2 rounded">
          <div>🔥 老化: {material.performance.highTemp.aging}</div>
          <div>❄️ 脆性: {material.performance.lowTemp.brittleness}</div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/materials/${material.id}`)}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all text-sm"
        >
          查看详情
        </button>
        <button
          onClick={() => onAddToCompare(material)}
          disabled={isInCompareList}
          className={`px-3 py-2 rounded text-sm transition-all ${
            isInCompareList
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {isInCompareList ? '已添加' : '对比'}
        </button>
      </div>
    </div>
  );
};

export default RubberMaterialCard;
```

#### RubberFilterPanel.tsx（简化版）

```typescript
// src/components/rubber/RubberFilterPanel.tsx
import React from 'react';
import { FilterState } from './EnhancedRubberMaterialView';
import { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  materials: RubberMaterialExtended[];
}

const RubberFilterPanel: React.FC<Props> = ({ filters, onFilterChange, materials }) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      system: '',
      tempLevel: '',
      rubberType: '',
      material: '',
      searchTerm: ''
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* 搜索框 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索材料名称、零部件、描述..."
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 筛选器 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 系统筛选 */}
        <select
          value={filters.system}
          onChange={(e) => handleChange('system', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有系统</option>
          <option value="thermal">热管理系统</option>
          <option value="chassis">底盘系统</option>
          <option value="cabin">座舱系统</option>
          <option value="engine">增程系统</option>
          <option value="body">车身系统</option>
          <option value="power">动力驱动系统</option>
        </select>

        {/* 温度等级筛选 */}
        <select
          value={filters.tempLevel}
          onChange={(e) => handleChange('tempLevel', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有温度等级</option>
          <option value="temp1">≤70℃</option>
          <option value="temp2">70~100℃</option>
          <option value="temp3">100-125℃</option>
          <option value="temp4">125-150℃</option>
          <option value="temp5">150-175℃</option>
          <option value="temp6">≥175℃</option>
        </select>

        {/* 用途分类筛选 */}
        <select
          value={filters.rubberType}
          onChange={(e) => handleChange('rubberType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有用途</option>
          <option value="seal">密封件</option>
          <option value="hose">管路类</option>
          <option value="bushing">衬套类</option>
          <option value="mount">悬置类</option>
          <option value="boot">护罩类</option>
          <option value="weatherstrip">胶条</option>
          <option value="cushion">软垫类</option>
          <option value="other">其它</option>
        </select>

        {/* 材料筛选 */}
        <select
          value={filters.material}
          onChange={(e) => handleChange('material', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有材料</option>
          <option value="VMQ">VMQ (硅橡胶)</option>
          <option value="EPDM">EPDM (三元乙丙)</option>
          <option value="NBR">NBR (丁腈橡胶)</option>
          <option value="HNBR">HNBR (氢化丁腈)</option>
          <option value="FKM">FKM (氟橡胶)</option>
          <option value="CR">CR (氯丁橡胶)</option>
          <option value="ACM">ACM (丙烯酸酯)</option>
          <option value="TPV">TPV (热塑性硫化)</option>
          <option value="NR">NR (天然橡胶)</option>
          <option value="TPEE">TPEE (热塑性聚酯)</option>
        </select>
      </div>

      {/* 重置按钮 */}
      {(filters.system || filters.tempLevel || filters.rubberType || filters.material || filters.searchTerm) && (
        <div className="mt-4 text-right">
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
          >
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
};

export default RubberFilterPanel;
```

#### RubberCompareModal.tsx（简化版）

```typescript
// src/components/rubber/RubberCompareModal.tsx
import React from 'react';
import { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  materials: RubberMaterialExtended[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const RubberCompareModal: React.FC<Props> = ({ materials, onClose, onRemove, onClear }) => {
  if (materials.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold">材料对比</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">
                    对比项
                  </th>
                  {materials.map(material => (
                    <th key={material.id} className="border border-gray-200 px-4 py-3">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 mb-2">{material.partName}</div>
                        <div className="text-sm text-gray-600 mb-2">{material.material}</div>
                        <button
                          onClick={() => onRemove(material.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          移除
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-2 font-medium">所属系统</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-2 text-center">
                      {m.system}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-medium">工作温度范围</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-2 text-center">
                      {m.tempRange.display}
                    </td>
                  ))}
                </tr>
                {materials[0]?.performance && (
                  <>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">热空气老化</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-2 text-center text-sm">
                          {m.performance?.highTemp.aging || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 font-medium">压缩永久变形</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-2 text-center text-sm">
                          {m.performance?.highTemp.compression || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 font-medium">低温脆性</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-2 text-center text-sm">
                          {m.performance?.lowTemp.brittleness || '-'}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 font-medium">耐油性</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-2 text-center">
                      {m.chemicalResistance?.oil ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-2 font-medium">耐燃油</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-2 text-center">
                      {m.chemicalResistance?.fuel ? '✅' : '❌'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClear}
            className="px-4 py-2 text-red-600 hover:text-red-800"
          >
            清空列表
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubberCompareModal;
```

#### RubberSelectionWizard.tsx（简化版）

```typescript
// src/components/rubber/RubberSelectionWizard.tsx
import React, { useState } from 'react';
import { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  onClose: () => void;
  onRecommend: (materials: RubberMaterialExtended[]) => void;
  allMaterials: RubberMaterialExtended[];
}

const RubberSelectionWizard: React.FC<Props> = ({ onClose, onRecommend, allMaterials }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    system: '',
    maxTemp: '',
    minTemp: '',
    needOilResistance: false,
    rubberType: ''
  });

  const handleSubmit = () => {
    // 简单的推荐逻辑
    let recommended = allMaterials;

    if (answers.system) {
      recommended = recommended.filter(m => m.system === answers.system);
    }

    if (answers.maxTemp) {
      const maxTemp = parseInt(answers.maxTemp);
      recommended = recommended.filter(m => m.tempRange.max >= maxTemp);
    }

    if (answers.rubberType) {
      recommended = recommended.filter(m => m.rubberType === answers.rubberType);
    }

    if (answers.needOilResistance) {
      recommended = recommended.filter(m => m.chemicalResistance?.oil);
    }

    onRecommend(recommended.slice(0, 3));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🧙 智能选材助手</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              1. 零件所属系统？
            </label>
            <select
              value={answers.system}
              onChange={(e) => setAnswers({ ...answers, system: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">请选择...</option>
              <option value="thermal">热管理系统</option>
              <option value="chassis">底盘系统</option>
              <option value="cabin">座舱系统</option>
              <option value="engine">增程系统</option>
              <option value="body">车身系统</option>
              <option value="power">动力驱动系统</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              2. 最高工作温度（℃）？
            </label>
            <input
              type="number"
              value={answers.maxTemp}
              onChange={(e) => setAnswers({ ...answers, maxTemp: e.target.value })}
              placeholder="例如：150"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              3. 零件类型？
            </label>
            <select
              value={answers.rubberType}
              onChange={(e) => setAnswers({ ...answers, rubberType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">请选择...</option>
              <option value="seal">密封件</option>
              <option value="hose">管路类</option>
              <option value="bushing">衬套类</option>
              <option value="mount">悬置类</option>
              <option value="boot">护罩类</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={answers.needOilResistance}
                onChange={(e) => setAnswers({ ...answers, needOilResistance: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">需要耐油性能</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            获取推荐
          </button>
        </div>
      </div>
    </div>
  );
};

export default RubberSelectionWizard;
```

---

## ✅ 验证步骤

1. **编译检查**
   ```bash
   npm run build
   ```

2. **本地测试**
   ```bash
   npm run dev
   ```

3. **访问页面**
   - 打开 http://localhost:5000/materials
   - 点击"橡胶"标签
   - 测试所有功能

---

## 🎨 样式说明

所有组件都使用 Tailwind CSS 类，与现有系统保持一致：
- 蓝色主色调 (`bg-blue-500`, `text-blue-600`)
- 响应式网格 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- 悬浮效果 (`hover:shadow-lg`, `transition-all`)
- 圆角卡片 (`rounded-lg`)

---

## 📊 数据统计

- **总材料数**: 44 种
- **系统分布**:
  - 热管理: 6 种
  - 底盘: 7 种
  - 座舱: 4 种
  - 增程: 6 种
  - 车身: 4 种
  - 动力驱动: 6 种

---

## 🔧 进一步优化建议

1. **详情页扩展**: 在 `MaterialDetailPage.tsx` 中添加橡胶材料的详细性能展示
2. **数据导出**: 添加导出Excel/PDF功能
3. **收藏功能**: 整合到现有的收藏系统
4. **搜索优化**: 添加搜索历史和智能提示
5. **移动端优化**: 完善移动端响应式布局

---

## 📞 技术支持

如有问题，请检查：
1. TypeScript编译错误
2. 导入路径是否正确
3. Tailwind CSS是否正确配置
4. React Router版本兼容性

---

**集成完成后，你的橡胶材料库将拥有：**
- ✅ 44种详细材料数据
- ✅ 6大系统分类
- ✅ 3种视图模式（系统/温度/用途）
- ✅ 强大的搜索筛选
- ✅ 材料对比功能
- ✅ 智能选材助手
- ✅ 完整的性能参数展示
- ✅ 与现有系统无缝集成
