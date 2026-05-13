import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MaterialPerformanceData } from '../types/materialPerformance';
import { PROPERTY_CATEGORIES } from '../types/materialPerformance';
import { getAllMaterialsPerformance, isCustomPerformance, deleteCustomPerformance, upsertCustomPerformance } from '../data/materialPerformance';
import MaterialPerformanceCard from '../components/MaterialPerformanceCard';

export default function MaterialPerformancePage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialPerformanceData[]>(getAllMaterialsPerformance());
  const [compareList, setCompareList] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'compare'>('cards');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const reload = useCallback(() => setMaterials(getAllMaterialsPerformance()), []);

  const handleEdit = (materialId: string) => {
    const material = materials.find(m => m.materialId === materialId);
    if (material) navigate('/materials/import', { state: { editMaterial: material } });
  };

  const handleDelete = (materialId: string, name: string) => {
    if (!window.confirm(`确定要删除"${name}"吗？`)) return;
    deleteCustomPerformance(materialId);
    reload();
  };

  const toggleCompare = (materialId: string) => {
    setCompareList(prev => {
      if (prev.includes(materialId)) return prev.filter(id => id !== materialId);
      if (prev.length >= 4) { alert('最多只能对比4个材料！'); return prev; }
      return [...prev, materialId];
    });
  };

  const comparingMaterials = materials.filter(m => compareList.includes(m.materialId));
  const filteredMaterials = filterCategory === 'all' ? materials : materials.filter(m => m.category === filterCategory);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              材料性能数据库
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看详细的材料性能参数，支持多材料对比分析
            </p>
          </div>
          <Link
            to="/materials/import"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-500 dark:to-blue-500 text-white rounded-lg hover:from-green-700 hover:to-blue-700 dark:hover:from-green-600 dark:hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span className="text-lg">➕</span>
            <span className="font-medium">新增材料</span>
          </Link>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
        {/* 视图切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            📋 卡片视图
          </button>
          <button
            onClick={() => setViewMode('compare')}
            disabled={compareList.length < 2}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'compare'
                ? 'bg-purple-600 text-white dark:bg-purple-500'
                : compareList.length < 2
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ⚖️ 对比模式 {compareList.length > 0 && `(${compareList.length})`}
          </button>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilterCategory('plastic')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === 'plastic'
                ? 'bg-green-600 text-white dark:bg-green-500'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            工程塑料
          </button>
          <button
            onClick={() => setFilterCategory('rubber')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === 'rubber'
                ? 'bg-orange-600 text-white dark:bg-orange-500'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            橡胶材料
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {compareList.length > 0 && (
            <button
              onClick={() => setCompareList([])}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              清除对比列表
            </button>
          )}
        </div>
      </div>

      {/* 卡片视图 */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterials.map(material => (
            <MaterialPerformanceCard
              key={material.materialId}
              data={material}
              onCompare={toggleCompare}
              isComparing={compareList.includes(material.materialId)}
              isCustom={isCustomPerformance(material.materialId)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* 对比视图 */}
      {viewMode === 'compare' && comparingMaterials.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-750">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-750 z-10">
                  性能指标
                </th>
                {comparingMaterials.map(material => (
                  <th
                    key={material.materialId}
                    className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white min-w-[200px]"
                  >
                    <div>{material.materialName}</div>
                    <button
                      onClick={() => toggleCompare(material.materialId)}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-1"
                    >
                      移除
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* 综合评分 */}
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white sticky left-0 bg-blue-50 dark:bg-blue-900/20 z-10">
                  综合评分
                </td>
                {comparingMaterials.map(material => (
                  <td key={material.materialId} className="px-4 py-3 text-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {material.performanceScore?.overall || '-'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* 按分类显示性能 */}
              {Object.entries(PROPERTY_CATEGORIES).map(([category, catConfig]) => {
                // 收集所有材料在该类别下的性能名称
                const allPropertyNames = new Set<string>();
                comparingMaterials.forEach(material => {
                  material.properties
                    .filter(p => p.category === category)
                    .forEach(p => allPropertyNames.add(p.name));
                });

                if (allPropertyNames.size === 0) return null;

                return (
                  <>
                    <tr key={`${category}-header`} className="bg-gray-100 dark:bg-gray-750">
                      <td
                        colSpan={comparingMaterials.length + 1}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        {catConfig.icon} {catConfig.name}
                      </td>
                    </tr>
                    {Array.from(allPropertyNames).map(propName => (
                      <tr key={`${category}-${propName}`} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 z-10">
                          {propName}
                        </td>
                        {comparingMaterials.map(material => {
                          const prop = material.properties.find(
                            p => p.category === category && p.name === propName
                          );
                          return (
                            <td key={material.materialId} className="px-4 py-3 text-center">
                              {prop ? (
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {prop.value}
                                  </div>
                                  {prop.unit && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {prop.unit}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 空状态 */}
      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            暂无该分类的材料数据
          </p>
        </div>
      )}

      {viewMode === 'compare' && compareList.length < 2 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            请选择至少 2 个材料进行对比
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            在卡片视图中点击"加入对比"按钮
          </p>
        </div>
      )}
    </div>
  );
}
