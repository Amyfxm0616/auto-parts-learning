import { useState } from 'react';
import type { MaterialPerformanceData } from '../types/materialPerformance';
import { PROPERTY_CATEGORIES } from '../types/materialPerformance';

interface MaterialPerformanceCardProps {
  data: MaterialPerformanceData;
  onCompare?: (materialId: string) => void;
  isComparing?: boolean;
  isCustom?: boolean;
  onEdit?: (materialId: string) => void;
  onDelete?: (materialId: string, name: string) => void;
}

export default function MaterialPerformanceCard({
  data,
  onCompare,
  isComparing = false,
  isCustom = false,
  onEdit,
  onDelete,
}: MaterialPerformanceCardProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // 按类别分组性能数据
  const groupedProperties = data.properties.reduce((acc, prop) => {
    if (!acc[prop.category]) {
      acc[prop.category] = [];
    }
    acc[prop.category].push(prop);
    return acc;
  }, {} as Record<string, typeof data.properties>);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900';
    if (score >= 70) return 'bg-blue-100 dark:bg-blue-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-2 transition-all ${
      isComparing ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'
    }`}>
      {/* 材料头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{data.materialName}</h3>
            <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">
              {data.category === 'plastic' ? '工程塑料' : data.category === 'rubber' ? '橡胶材料' : '其他材料'}
            </p>
          </div>
          {onCompare && (
            <button
              onClick={() => onCompare(data.materialId)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isComparing
                  ? 'bg-white text-blue-600 dark:bg-gray-700 dark:text-blue-400'
                  : 'bg-blue-400 text-white hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              {isComparing ? '✓ 已选择' : '加入对比'}
            </button>
          )}
        </div>
      </div>

      {/* 综合评分 */}
      {data.performanceScore && (
        <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(data.performanceScore.overall)}`}>
                {data.performanceScore.overall}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">综合评分</div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2">
              <div className={`p-2 rounded text-center ${getScoreBgColor(data.performanceScore.mechanical)}`}>
                <div className={`text-lg font-semibold ${getScoreColor(data.performanceScore.mechanical)}`}>
                  {data.performanceScore.mechanical}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300">力学性能</div>
              </div>
              <div className={`p-2 rounded text-center ${getScoreBgColor(data.performanceScore.thermal)}`}>
                <div className={`text-lg font-semibold ${getScoreColor(data.performanceScore.thermal)}`}>
                  {data.performanceScore.thermal}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300">热学性能</div>
              </div>
              <div className={`p-2 rounded text-center ${getScoreBgColor(data.performanceScore.processing)}`}>
                <div className={`text-lg font-semibold ${getScoreColor(data.performanceScore.processing)}`}>
                  {data.performanceScore.processing}
                </div>
                <div className="text-xs text-gray-700 dark:text-gray-300">加工性能</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 性能分类 */}
      <div className="p-4 space-y-2">
        {Object.entries(groupedProperties).map(([category, properties]) => {
          const catConfig = PROPERTY_CATEGORIES[category as keyof typeof PROPERTY_CATEGORIES];
          if (!catConfig) return null;

          const isExpanded = expandedCategory === category;
          const importantProps = properties.filter(p => p.importance === 'high');

          return (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* 分类标题 */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{catConfig.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{catConfig.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({properties.length} 项)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
                    isExpanded ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 性能列表 */}
              {isExpanded && (
                <div className="p-4 space-y-2 bg-white dark:bg-gray-800">
                  {properties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {prop.name}
                          </span>
                          {prop.importance === 'high' && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded">
                              重要
                            </span>
                          )}
                        </div>
                        {prop.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {prop.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {prop.value}
                        </div>
                        {prop.unit && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {prop.unit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 快速预览（折叠时显示重要性能）*/}
              {!isExpanded && importantProps.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750">
                  <div className="flex flex-wrap gap-2">
                    {importantProps.slice(0, 3).map((prop, idx) => (
                      <span key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                        {prop.name}: <span className="font-medium text-gray-900 dark:text-white">{prop.value}</span>
                        {prop.unit && <span className="ml-0.5">{prop.unit}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        {isCustom && onEdit && (
          <button
            onClick={() => onEdit(data.materialId)}
            className="px-4 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors text-sm"
          >
            ✏️ 编辑
          </button>
        )}
        {isCustom && onDelete && (
          <button
            onClick={() => onDelete(data.materialId, data.materialName)}
            className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors text-sm"
          >
            🗑️ 删除
          </button>
        )}
        <button className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm">
          查看详情
        </button>
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
          下载数据
        </button>
      </div>
    </div>
  );
}
