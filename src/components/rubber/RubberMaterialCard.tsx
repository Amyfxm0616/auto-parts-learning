// src/components/rubber/RubberMaterialCard.tsx
import React from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';
import { useNavigate } from 'react-router-dom';

interface Props {
  material: RubberMaterialExtended;
  onAddToCompare: (material: RubberMaterialExtended) => void;
  isInCompareList: boolean;
  onEdit?: (material: RubberMaterialExtended) => void;
  showEditActions?: boolean;
}

const RubberMaterialCard: React.FC<Props> = ({ material, onAddToCompare, isInCompareList, onEdit, showEditActions = false }) => {
  const navigate = useNavigate();

  const tempColors: Record<string, string> = {
    temp1: 'bg-blue-100 text-blue-800 border-blue-300',
    temp2: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    temp3: 'bg-green-100 text-green-800 border-green-300',
    temp4: 'bg-amber-100 text-amber-800 border-amber-300',
    temp5: 'bg-red-100 text-red-800 border-red-300',
    temp6: 'bg-red-200 text-red-900 border-red-400'
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-blue-400 bg-white relative">
      {/* 编辑按钮 */}
      {showEditActions && onEdit && (
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(material);
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
            title="编辑"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      )}

      {/* 标题 */}
      <div className="mb-3 pr-8">
        <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{material.partName}</h4>
        <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
      </div>

      {/* 材料标签 */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {material.material}
        </span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${tempColors[material.tempLevel]}`}>
          {material.tempRange.display}
        </span>
      </div>

      {/* 性能摘要 */}
      {material.performance && (
        <div className="text-xs text-gray-600 mb-3 space-y-1 bg-gray-50 p-2 rounded">
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span className="truncate">老化: {material.performance.highTemp.aging}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>❄️</span>
            <span className="truncate">脆性: {material.performance.lowTemp.brittleness}</span>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/materials/${material.id}`)}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all text-sm font-medium"
        >
          查看详情
        </button>
        <button
          onClick={() => onAddToCompare(material)}
          disabled={isInCompareList}
          className={`px-3 py-2 rounded text-sm transition-all font-medium ${
            isInCompareList
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {isInCompareList ? '已添加' : '对比'}
        </button>
      </div>
    </div>
  );
};

export default RubberMaterialCard;
