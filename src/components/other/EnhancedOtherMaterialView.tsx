// src/components/other/EnhancedOtherMaterialView.tsx
// 增强版其他材料展示组件 - 包含发泡、无机非等

import React, { useState, useMemo } from 'react';
import type { OtherMaterial } from '../../types/other';
import { FOAM_SUBCATEGORIES, INORGANIC_SUBCATEGORIES, type TreeNode, type ViewMode, type OtherMaterialFilter } from '../../types/other';
import { foamMaterialsData } from '../../data/foamMaterials';
import { inorganicMaterialsData } from '../../data/inorganicMaterials';

interface EnhancedOtherMaterialViewProps {
  materials?: OtherMaterial[];
}

const ExpandedOtherMaterialView: React.FC<EnhancedOtherMaterialViewProps> = ({
  materials = [...foamMaterialsData, ...inorganicMaterialsData]
}) => {
  // 状态管理
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [filters, setFilters] = useState<OtherMaterialFilter>({
    category: 'all',
    subcategory: '',
    searchTerm: ''
  });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['foam', 'inorganic'])); // 默认展开顶层
  const [selectedMaterial, setSelectedMaterial] = useState<OtherMaterial | null>(null);

  // 构建树状结构
  const materialTree = useMemo(() => {
    const filtered = materials.filter(material => {
      if (filters.category !== 'all' && material.category !== filters.category) return false;
      if (filters.subcategory && material.subcategory !== filters.subcategory) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          material.name.toLowerCase().includes(term) ||
          material.nameEn?.toLowerCase().includes(term) ||
          material.description?.toLowerCase().includes(term) ||
          material.applications?.some(app => app.toLowerCase().includes(term))
        );
      }
      return true;
    });

    // 按类别组织
    const tree: TreeNode[] = [];

    const foams = filtered.filter(m => m.category === 'foam');
    const inorganics = filtered.filter(m => m.category === 'inorganic');
    const others = filtered.filter(m => m.category === 'other');

    // 构建发泡材料子树
    if (foams.length > 0) {
      const foamNode: TreeNode = {
        id: 'foam',
        name: '发泡材料',
        level: 0,
        children: Object.values(FOAM_SUBCATEGORIES).map((catName, idx) => {
          const subcategoryKey = Object.keys(FOAM_SUBCATEGORIES)[idx];
          const subFoams = foams.filter(f => f.subcategory === subcategoryKey);
          return {
            id: `foam-${subcategoryKey}`,
            name: catName,
            level: 1,
            children: subFoams.map(f => ({
              id: f.id,
              name: f.name,
              level: 2,
              data: f
            }))
          };
        })
      };
      tree.push(foamNode);
    }

    // 构建无机非金属材料子树
    if (inorganics.length > 0) {
      const inorganicNode: TreeNode = {
        id: 'inorganic',
        name: '无机非金属材料',
        level: 0,
        children: Object.values(INORGANIC_SUBCATEGORIES).map((catName, idx) => {
          const subcategoryKey = Object.keys(INORGANIC_SUBCATEGORIES)[idx];
          const subInorganics = inorganics.filter(i => i.subcategory === subcategoryKey);
          return {
            id: `inorganic-${subcategoryKey}`,
            name: catName,
            level: 1,
            children: subInorganics.map(i => ({
              id: i.id,
              name: i.name,
              level: 2,
              data: i
            }))
          };
        })
      };
      tree.push(inorganicNode);
    }

    // 构建其他材料子树
    if (others.length > 0) {
      const otherNode: TreeNode = {
        id: 'other',
        name: '其他',
        level: 0,
        children: others.map(o => ({
          id: o.id,
          name: o.name,
          level: 1,
          data: o
        }))
      };
      tree.push(otherNode);
    }

    return tree;
  }, [materials, filters]);

  // 切换节点展开状态
  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 展开所有节点
  const expandAll = () => {
    const allNodeIds: string[] = [];
    const collectIds = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allNodeIds.push(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(materialTree);
    setExpandedNodes(new Set(allNodeIds));
  };

  // 收起所有节点
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // 渲染树节点
  const renderTreeNode = (node: TreeNode): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedMaterial?.id === node.id;
    const isLeaf = !hasChildren || (node.data !== undefined);
    const indent = node.level ? node.level * 24 : 0;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-3 px-4 rounded-lg mb-1 transition-colors cursor-pointer ${
            isSelected
              ? 'bg-blue-100 border-l-4 border-blue-600'
              : 'hover:bg-gray-100 border-l-4 border-transparent'
          }`}
          style={{ paddingLeft: `${indent + 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            } else if (node.data) {
              setSelectedMaterial(node.data);
            }
          }}
        >
          {hasChildren && (
            <span className="mr-2 text-gray-500 w-4 h-4 flex items-center justify-center">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="mr-2 w-4 h-4"></span>}

          {isLeaf && node.data && (
            <span className="mr-2 text-blue-500">●</span>
          )}
          {!isLeaf && node.data !== undefined && <span className="mr-2 text-gray-400">○</span>}

          <span className={`flex-1 font-medium ${node.level === 0 ? 'text-lg' : 'text-base'}`}>
            {node.name}
          </span>

          {node.data && (
            <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-gray-100 rounded">
              {node.data.category === 'foam' ? '发泡' :
               node.data.category === 'inorganic' ? '无机' : '其他'}
            </span>
          )}

          {hasChildren && (
            <span className="text-sm text-gray-500 ml-2">
              ({node.children?.length})
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children?.map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  // 渲染表格卡片
  const renderCardTable = () => {
    const filtered = materials.filter(material => {
      if (filters.category !== 'all' && material.category !== filters.category) return false;
      if (filters.subcategory && material.subcategory !== filters.subcategory) return false;
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          material.name.toLowerCase().includes(term) ||
          material.nameEn?.toLowerCase().includes(term) ||
          material.description?.toLowerCase().includes(term) ||
          material.applications?.some(app => app.toLowerCase().includes(term))
        );
      }
      return true;
    });

    return (
      <div className="space-y-4">
        {filtered.map(material => (
          <div
            key={material.id}
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all p-6 cursor-pointer"
            onClick={() => setSelectedMaterial(material)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{material.name}</h3>
                {material.nameEn && (
                  <p className="text-sm text-gray-500">{material.nameEn}</p>
                )}
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {material.category === 'foam' ? '发泡' :
                 material.category === 'inorganic' ? '无机' : '其他'}
              </span>
            </div>

            {material.description && (
              <p className="text-gray-600 text-sm mb-4">{material.description}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
              {material.properties.density && (
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-gray-500 text-xs">密度</span>
                  <p className="font-medium">{material.properties.density} kg/m³</p>
                </div>
              )}
              {material.properties.compressiveStrength && (
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-gray-500 text-xs">压缩强度</span>
                  <p className="font-medium">{material.properties.compressiveStrength} kPa</p>
                </div>
              )}
              {material.properties.thermalConductivity && (
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-gray-500 text-xs">热导率</span>
                  <p className="font-medium">{material.properties.thermalConductivity} W/m·K</p>
                </div>
              )}
              {material.properties.cost && (
                <div className="bg-gray-50 rounded p-2">
                  <span className="text-gray-500 text-xs">成本</span>
                  <p className="font-medium">{material.properties.cost}</p>
                </div>
              )}
            </div>

            {material.applications && material.applications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">应用场景</h4>
                <div className="flex flex-wrap gap-2">
                  {material.applications.slice(0, 3).map((app, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded"
                    >
                      {app}
                    </span>
                  ))}
                  {material.applications.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-500">
                      +{material.applications.length - 3} 更多
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染材料详情
  const renderMaterialDetails = (material: OtherMaterial) => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{material.name}</h2>
            {material.nameEn && (
              <p className="text-gray-500 italic">{material.nameEn}</p>
            )}
          </div>
          <button
            onClick={() => setSelectedMaterial(null)}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {material.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">材料描述</h3>
            <p className="text-gray-700 leading-relaxed">{material.description}</p>
          </div>
        )}

        {/* 性能参数 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">性能参数</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(material.properties).map(([key, value]) => {
              if (value && key !== 'other') {
                const labelMap: Record<string, string> = {
                  density: '密度',
                  tensileStrength: '抗拉强度',
                  compressiveStrength: '压缩强度',
                  thermalConductivity: '热导率',
                  flameRetardancy: '阻燃等级',
                  hardness: '硬度',
                  waterAbsorption: '吸水率',
                  temperatureRange: '使用温度',
                  cost: '相对成本',
                  recyclability: '可回收性',
                };
                return (
                  <div key={key} className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">{labelMap[key] || key}</div>
                    <div className="font-semibold text-gray-900 text-sm">{String(value)}</div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* 应用场景 */}
        {material.applications && material.applications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">应用场景</h3>
            <div className="flex flex-wrap gap-2">
              {material.applications.map((app, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 优点和缺点 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {material.advantages && material.advantages.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-900 mb-3">✓ 优点</h3>
              <ul className="space-y-2">
                {material.advantages.map((adv, idx) => (
                  <li key={idx} className="text-green-800 flex items-start">
                    <span className="mr-2 text-green-600 font-bold">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {material.disadvantages && material.disadvantages.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-3">✗ 缺点</h3>
              <ul className="space-y-2">
                {material.disadvantages.map((dis, idx) => (
                  <li key={idx} className="text-red-800 flex items-start">
                    <span className="mr-2 text-red-600 font-bold">•</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-6">
      {/* 头部标题和视图切换 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">其他材料</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'tree'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              树状视图
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              卡片视图
            </button>
          </div>
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value as any, subcategory: '' })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">全部类别</option>
            <option value="foam">发泡材料</option>
            <option value="inorganic">无机非金属</option>
            <option value="other">其他</option>
          </select>

          {filters.category === 'foam' && (
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">全部子分类</option>
              {Object.entries(FOAM_SUBCATEGORIES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          )}

          {filters.category === 'inorganic' && (
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">全部子分类</option>
              {Object.entries(INORGANIC_SUBCATEGORIES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="搜索材料..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />

          {viewMode === 'tree' && (
            <>
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                展开全部
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                收起全部
              </button>
            </>
          )}
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 材料 */}
        <div className={`lg:col-span-${selectedMaterial ? '2' : '3'}`}>
          {viewMode === 'tree' ? (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">材料列表</h3>
              {(materialTree.length > 0) ? (
                <div className={viewMode === 'tree' ? 'max-h-[700px] overflow-y-auto' : ''}>
                  {materialTree.map(node => renderTreeNode(node))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">未找到匹配的材料</p>
                  <p className="text-sm mt-2">请尝试调整筛选条件</p>
                </div>
              )}
            </div>
          ) : (
            renderCardTable()
          )}
        </div>

        {/* 材料详情侧边栏 */}
        {selectedMaterial && (
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              {renderMaterialDetails(selectedMaterial)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandedOtherMaterialView;
