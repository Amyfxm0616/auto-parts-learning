// src/components/rubber/EnhancedRubberMaterialView.tsx
// 增强版橡胶材料展示组件

import React, { useState, useMemo } from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';
import { rubberSystems } from '../../types/rubber';
import { rubberMaterialsData } from '../../data/rubberMaterials';
import RubberMaterialCard from './RubberMaterialCard';
import RubberFilterPanel from './RubberFilterPanel';
import RubberCompareModal from './RubberCompareModal';
import RubberSelectionWizard from './RubberSelectionWizard';
import RubberMaterialEditModal from './RubberMaterialEditModal';
import { useNavigate } from 'react-router-dom';

interface EnhancedRubberMaterialViewProps {
  materials?: RubberMaterialExtended[];
}

export type ViewMode = 'system' | 'temp' | 'type' | 'table';
export type FilterState = {
  system: string;
  tempLevel: string;
  rubberType: string;
  material: string;
  searchTerm: string;
};

const EnhancedRubberMaterialView: React.FC<EnhancedRubberMaterialViewProps> = ({
  materials = rubberMaterialsData
}) => {
  // 状态管理
  const [viewMode, setViewMode] = useState<'temp' | 'type'>('temp');
  const [filters, setFilters] = useState<FilterState>({
    system: '',
    tempLevel: '',
    rubberType: '',
    material: '',
    searchTerm: ''
  });
  const [compareList, setCompareList] = useState<RubberMaterialExtended[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RubberMaterialExtended | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [materialsList, setMaterialsList] = useState<RubberMaterialExtended[]>(materials);
  const navigate = useNavigate();

  // 筛选材料
  const filteredMaterials = useMemo(() => {
    return materialsList.filter(material => {
      if (filters.system && material.system !== filters.system) return false;
      if (filters.tempLevel && material.tempLevel !== filters.tempLevel) return false;
      if (filters.rubberType && material.rubberType !== filters.rubberType) return false;
      if (filters.material && material.material !== filters.material) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          material.name.toLowerCase().includes(term) ||
          material.partName.toLowerCase().includes(term) ||
          material.material.toLowerCase().includes(term) ||
          material.description.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [materialsList, filters]);

  // 按温度维度组织的树状结构
  const temperatureTree = useMemo(() => {
    const tree: Record<string, Record<string, RubberMaterialExtended[]>> = {};

    filteredMaterials.forEach(material => {
      // 一级：温度等级
      const tempKey = material.tempLevel;
      if (!tree[tempKey]) tree[tempKey] = {};

      // 二级：材料类型（弹性体）
      const materialKey = material.material;
      if (!tree[tempKey][materialKey]) tree[tempKey][materialKey] = [];

      tree[tempKey][materialKey].push(material);
    });

    return tree;
  }, [filteredMaterials]);

  // 切换展开状态
  const toggleSection = (key: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  // 添加到对比
  const addToCompare = (material: RubberMaterialExtended) => {
    if (compareList.find(m => m.id === material.id)) {
      alert('该材料已在对比列表中');
      return;
    }
    if (compareList.length >= 4) {
      alert('最多只能对比4个材料');
      return;
    }
    setCompareList([...compareList, material]);
  };

  // 从对比列表移除
  const removeFromCompare = (materialId: string) => {
    setCompareList(compareList.filter(m => m.id !== materialId));
  };

  // 清空对比列表
  const clearCompare = () => {
    setCompareList([]);
    setShowCompareModal(false);
  };

  // 处理材料选择
  const handleMaterialSelect = (material: RubberMaterialExtended) => {
    navigate(`/materials/${material.id}`);
  };

  // 处理材料编辑
  const handleMaterialEdit = (material: RubberMaterialExtended) => {
    setEditingMaterial(material);
    setShowEditModal(true);
  };

  // 保存材料修改
  const handleMaterialSave = (updatedMaterial: RubberMaterialExtended) => {
    setMaterialsList(prev => prev.map(m => m.id === updatedMaterial.id ? updatedMaterial : m));
    setEditingMaterial(null);
    setShowEditModal(false);
  };

  // 删除材料
  const handleMaterialDelete = (materialId: string) => {
    if (confirm('确定要删除该材料吗？此操作不可撤销。')) {
      setMaterialsList(prev => prev.filter(m => m.id !== materialId));
      setEditingMaterial(null);
      setShowEditModal(false);
    }
  };

  // 按视图模式分组
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, Record<string, RubberMaterialExtended[]>> = {};

    filteredMaterials.forEach(material => {
      let primaryKey: string;
      let secondaryKey: string;

      switch (viewMode) {
        case 'type':
          primaryKey = material.rubberType;
          secondaryKey = material.tempLevel;
          break;
        case 'temp':
        default:
          primaryKey = material.material;
          secondaryKey = material.temperatureRangeKey || material.system;
          break;
      }

      if (!groups[primaryKey]) groups[primaryKey] = {};
      if (!groups[primaryKey][secondaryKey]) groups[primaryKey][secondaryKey] = [];
      groups[primaryKey][secondaryKey].push(material);
    });

    return groups;
  }, [filteredMaterials, viewMode]);

  // 获取分组标题
  const getGroupTitle = (key: string, type: 'primary' | 'secondary'): string => {
    if (type === 'primary') {
      // 按弹性体分类时，显示材料中文名
      const materialNames: Record<string, string> = {
        'VMQ': '硅橡胶',
        'EPDM': '三元乙丙橡胶',
        'NBR': '丁腈橡胶',
        'HNBR': '氢化丁腈橡胶',
        'FKM': '氟橡胶',
        'CR': '氯丁橡胶',
        'ACM': '丙烯酸酯橡胶',
        'AEM': '乙烯丙烯酸酯橡胶',
        'TPV': '热塑性硫化橡胶',
        'TPS': '热塑性苯乙烯弹性体',
        'TPEE': '热塑性聚酯弹性体',
        'NR': '天然橡胶',
        'SBR': '丁苯橡胶',
        'BR': '顺丁橡胶',
        'IIR': '丁基橡胶',
        'ECO': '环氧氯丙烷橡胶',
        'CO': '氯醇橡胶',
        'PUR': '聚氨酯橡胶'
      };
      if (viewMode === 'temp') return materialNames[key] || key;

      // 按用途分类
      const rubberTypeNames: Record<string, string> = {
        bushing: '衬套类',
        mount: '悬置类',
        hose: '管路类',
        boot: '护罩（套）类',
        seal: '密封件',
        weatherstrip: '胶条',
        cushion: '软垫类',
        other: '其它'
      };
      return rubberTypeNames[key] || key;
    } else {
      // 次级标题
      if (viewMode === 'temp') {
        // 显示系统名称
        return rubberSystems.find(s => s.id === key)?.name || key;
      }
      // 显示温度等级
      const tempLevels: Record<string, string> = {
        temp1: '≤70℃',
        temp2: '70~100℃',
        temp3: '100-125℃',
        temp4: '125-150℃',
        temp5: '150-175℃',
        temp6: '≥175℃'
      };
      return tempLevels[key] || key;
    }
    return key;
  };

  // 获取温度等级颜色
  const getTempColor = (tempLevel: string): string => {
    const colors: Record<string, string> = {
      temp1: 'bg-blue-100 text-blue-800 border-blue-300',
      temp2: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      temp3: 'bg-green-100 text-green-800 border-green-300',
      temp4: 'bg-amber-100 text-amber-800 border-amber-300',
      temp5: 'bg-red-100 text-red-800 border-red-300',
      temp6: 'bg-red-200 text-red-900 border-red-400'
    };
    return colors[tempLevel] || 'bg-gray-100 text-gray-800';
  };

  // 获取树节点颜色
  const getTreeColor = (key: string, type: 'primary' | 'secondary'): string => {
    if (type === 'primary') {
      switch (viewMode) {
        case 'system':
          const systemColors: Record<string, string> = {
            engine: 'bg-red-100 text-red-800 border-red-300',
            transmission: 'bg-orange-100 text-orange-800 border-orange-300',
            suspension: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            braking: 'bg-green-100 text-green-800 border-green-300',
            cooling: 'bg-cyan-100 text-cyan-800 border-cyan-300',
            fuel: 'bg-blue-100 text-blue-800 border-blue-300',
            electrical: 'bg-purple-100 text-purple-800 border-purple-300',
            body: 'bg-pink-100 text-pink-800 border-pink-300'
          };
          return systemColors[key] || 'bg-gray-100 text-gray-800';
        case 'temp':
          return getTempColor(key);
        case 'type':
          const typeColors: Record<string, string> = {
            seal: 'bg-blue-100 text-blue-800 border-blue-300',
            hose: 'bg-cyan-100 text-cyan-800 border-cyan-300',
            boot: 'bg-green-100 text-green-800 border-green-300',
            bushing: 'bg-amber-100 text-amber-800 border-amber-300',
            mount: 'bg-orange-100 text-orange-800 border-orange-300',
            weatherstrip: 'bg-purple-100 text-purple-800 border-purple-300',
            cushion: 'bg-pink-100 text-pink-800 border-pink-300',
            other: 'bg-gray-100 text-gray-800'
          };
          return typeColors[key] || 'bg-gray-100 text-gray-800';
      }
    }
    return getTempColor(key);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* 头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">橡胶材料库</h2>
            <p className="text-sm text-gray-600 mt-1">
              共 {materialsList.length} 种橡胶材料，当前显示 {filteredMaterials.length} 种
            </p>
          </div>
          <div className="flex gap-2">
            {/* 编辑模式切换 */}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg hover:shadow-sm transition-all flex items-center gap-2 ${
                editMode
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{editMode ? '✓' : '✏️'}</span>
              {editMode ? '编辑完成' : '编辑模式'}
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-2"
            >
              <span className="text-lg">🧙</span>
              选材助手
            </button>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-2 relative"
              disabled={compareList.length === 0}
            >
              <span className="text-lg">⚖️</span>
              对比 ({compareList.length})
              {compareList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 视图模式切换 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setViewMode('temp')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'temp'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            按弹性体分类
          </button>
          <button
            onClick={() => setViewMode('type')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'type'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            按用途分类
          </button>
        </div>

        {/* 筛选面板 */}
        <RubberFilterPanel
          filters={filters}
          onFilterChange={setFilters}
          materials={materials}
        />
      </div>

      {/* 内容区域 - 按弹性体显示 */}
      <div className="p-6">
        {viewMode === 'type' ? (
          // 按用途分类视图
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-gray-300 to-transparent" />

              {Object.entries(groupedMaterials).map(([primaryKey, secondaryGroups]) => {
                const primarySectionKey = `${viewMode}-${primaryKey}`;
                const isExpanded = expandedSections.has(primarySectionKey) || expandedSections.size === 0;

                return (
                  <div key={primaryKey} className="relative mb-3">
                    <div className="absolute left-6 top-8 w-4 h-0.5 bg-gray-300" />
                    <div
                      onClick={() => toggleSection(primarySectionKey)}
                      className="ml-10 p-4 bg-white border-2 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      style={{ borderColor: isExpanded ? '#3b82f6' : '#e5e7eb' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 6L14 10L6 14V6Z" />
                          </svg>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTreeColor(primaryKey, 'primary')}`}>
                          {getGroupTitle(primaryKey, 'primary')}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {Object.values(secondaryGroups).reduce((sum, items) => sum + items.length, 0)} 项
                        </span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="ml-20 mt-2 space-y-2 relative">
                        <div className="absolute left-[-8px] top-2 bottom-2 w-0.5 bg-gray-200" />

                        {Object.entries(secondaryGroups).map(([secondaryKey, materialsList]) => {
                          const secondarySectionKey = `${primarySectionKey}-${secondaryKey}`;
                          const isSecondaryExpanded = expandedSections.has(secondarySectionKey) || expandedSections.size === 0;

                          return (
                            <div key={secondaryKey} className="relative">
                              <div className="absolute left-[-8px] top-5 w-4 h-0.5 bg-gray-200" />
                              <div
                                onClick={() => toggleSection(secondarySectionKey)}
                                className="p-3 bg-gray-50 border-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                                style={{ borderColor: isSecondaryExpanded ? '#60a5fa' : '#e5e7eb' }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${isSecondaryExpanded ? 'rotate-90' : ''}`}>
                                    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6 6L14 10L6 14V6Z" />
                                    </svg>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTreeColor(secondaryKey, 'secondary')}`}>
                                    {getGroupTitle(secondaryKey, 'secondary')}
                                  </span>
                                  <span className="text-xs text-gray-600">{materialsList.length} 个材料</span>
                                </div>
                              </div>

                              {isSecondaryExpanded && (
                                <div className="ml-8 mt-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {materialsList.map(material => (
                                      <RubberMaterialCard
                                        key={material.id}
                                        material={material}
                                        onAddToCompare={addToCompare}
                                        isInCompareList={compareList.some(m => m.id === material.id)}
                                        onEdit={handleMaterialEdit}
                                        showEditActions={editMode}
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // 按弹性体分类视图 - 按温度维度树状结构
          <div className="space-y-6">
            {Object.keys(temperatureTree).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg">没有找到符合条件的材料</p>
              </div>
            ) : (
              Object.entries(temperatureTree)
                .sort((a, b) => {
                  const tempOrder: Record<string, number> = {
                    temp6: 0,
                    temp5: 1,
                    temp4: 2,
                    temp3: 3,
                    temp2: 4,
                    temp1: 5
                  };
                  return (tempOrder[a[0]] || 99) - (tempOrder[b[0]] || 99);
                })
                .map(([tempKey, materialsByMaterial]) => {
                  const tempSectionKey = `temp-${tempKey}`;
                  const isTempExpanded = expandedSections.has(tempSectionKey) || expandedSections.size === 0;

                  const tempDisplay = {
                    temp1: '≤70℃',
                    temp2: '70~100℃',
                    temp3: '100-125℃',
                    temp4: '125-150℃',
                    temp5: '150-175℃',
                    temp6: '≥175℃'
                  }[tempKey] || tempKey;

                  return (
                    <div key={tempKey} className="border-2 rounded-lg overflow-hidden" style={{ borderColor: isTempExpanded ? '#3b82f6' : '#e5e7eb' }}>
                      {/* 温度等级节点 */}
                      <div
                        onClick={() => toggleSection(tempSectionKey)}
                        className={`p-4 cursor-pointer transition-all ${isTempExpanded ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${isTempExpanded ? 'rotate-90' : ''}`}>
                              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6 6L14 10L6 14V6Z" />
                              </svg>
                            </div>
                            <span className={`px-4 py-2 rounded-lg font-bold text-sm ${getTempColor(tempKey)}`}>
                              {tempDisplay}
                            </span>
                            <span className="text-sm text-gray-600">
                              {Object.values(materialsByMaterial).reduce((sum, items) => sum + items.length, 0)} 种材料
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 弹性体类型列表 */}
                      {isTempExpanded && (
                        <div className="p-4 space-y-3">
                          {Object.entries(materialsByMaterial).map(([materialKey, materials]) => {
                            const materialSectionKey = `${tempSectionKey}-${materialKey}`;
                            const isMaterialExpanded = expandedSections.has(materialSectionKey) || expandedSections.size === 0;

                            const materialNames: Record<string, string> = {
                              'VMQ': '硅橡胶',
                              'EPDM': '三元乙丙橡胶',
                              'NBR': '丁腈橡胶',
                              'HNBR': '氢化丁腈橡胶',
                              'FKM': '氟橡胶',
                              'CR': '氯丁橡胶',
                              'ACM': '丙烯酸酯橡胶',
                              'AEM': '乙烯丙烯酸酯橡胶',
                              'TPV': '热塑性硫化橡胶',
                              'TPS': '热塑性苯乙烯弹性体',
                              'TPEE': '热塑性聚酯弹性体',
                              'NR': '天然橡胶',
                              'SBR': '丁苯橡胶',
                              'BR': '顺丁橡胶',
                              'IIR': '丁基橡胶',
                              'ECO': '环氧氯丙烷橡胶',
                              'CO': '氯醇橡胶',
                              'PUR': '聚氨酯橡胶'
                            };

                            return (
                              <div key={materialKey} className="border rounded-lg overflow-hidden">
                                {/* 弹性体类型节点 */}
                                <div
                                  onClick={() => toggleSection(materialSectionKey)}
                                  className={`p-3 cursor-pointer transition-all flex items-center justify-between ${isMaterialExpanded ? 'bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${isMaterialExpanded ? 'rotate-90' : ''}`}>
                                      <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 6L14 10L6 14V6Z" />
                                      </svg>
                                    </div>
                                    <span className="font-semibold text-sm">{materialNames[materialKey] || materialKey}</span>
                                    <span className="text-xs text-gray-500">({materialKey})</span>
                                    <span className="text-xs text-gray-600">
                                      · {materials.length} 个零部件
                                    </span>
                                  </div>
                                </div>

                                {/* 零部件详情 */}
                                {isMaterialExpanded && (
                                  <div className="p-3 space-y-2 bg-white">
                                    {materials.map(material => (
                                      <div
                                        key={material.id}
                                        className="p-3 border rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative"
                                        onClick={(e) => {
                                          // 如果在编辑模式且点击的是编辑按钮，不触发导航
                                          if (editMode && (e.target as HTMLElement).closest('[data-edit-action]')) {
                                            return;
                                          }
                                          handleMaterialSelect(material);
                                        }}
                                      >
                                        {/* 编辑按钮 */}
                                        {editMode && (
                                          <button
                                            data-edit-action
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleMaterialEdit(material);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                                            title="编辑"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                          </button>
                                        )}

                                        <div className="flex items-start justify-between mb-2 pr-8">
                                          <div>
                                            <div className="font-semibold text-gray-900 text-sm">{material.partName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{material.name}</div>
                                          </div>
                                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTempColor(material.tempLevel)}`}>
                                            {material.tempRange.display}
                                          </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">系统:</span>
                                            <span>{rubberSystems.find(s => s.id === material.system)?.name || material.system}</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <span className="font-medium">温度:</span>
                                            <span>{material.tempRange.display}</span>
                                          </div>
                                        </div>

                                        {material.applications && material.applications.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            <span className="text-xs font-medium text-gray-600">应用:</span>
                                            {material.applications.slice(0, 3).map((app, i) => (
                                              <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                                {app}
                                              </span>
                                            ))}
                                            {material.applications.length > 3 && (
                                              <span className="text-xs text-gray-400">+{material.applications.length - 3}</span>
                                            )}
                                          </div>
                                        )}

                                        {material.chemicalResistance && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            {material.chemicalResistance.oil && (
                                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">耐油</span>
                                            )}
                                            {material.chemicalResistance.fuel && (
                                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">耐燃油</span>
                                            )}
                                            {material.chemicalResistance.coolant && (
                                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">耐冷却液</span>
                                            )}
                                            {material.chemicalResistance.water && (
                                              <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">耐水</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
            )}
          </div>
        )}
      </div>

      {/* 对比弹窗 */}
      {showCompareModal && (
        <RubberCompareModal
          materials={compareList}
          onClose={() => setShowCompareModal(false)}
          onRemove={removeFromCompare}
          onClear={clearCompare}
        />
      )}

      {/* 选材助手弹窗 */}
      {showWizard && (
        <RubberSelectionWizard
          onClose={() => setShowWizard(false)}
          onRecommend={(recommended) => {
            setFilters({ ...filters, material: recommended[0]?.material || '' });
            setShowWizard(false);
          }}
          allMaterials={materialsList}
        />
      )}

      {/* 编辑材料弹窗 */}
      {showEditModal && editingMaterial && (
        <RubberMaterialEditModal
          material={editingMaterial}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingMaterial(null);
          }}
          onSave={handleMaterialSave}
          onDelete={handleMaterialDelete}
        />
      )}
    </div>
  );
};

export default EnhancedRubberMaterialView;
