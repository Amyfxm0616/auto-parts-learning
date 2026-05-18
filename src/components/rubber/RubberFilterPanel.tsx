// src/components/rubber/RubberFilterPanel.tsx
import React from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';

export interface FilterState {
  system: string;
  tempLevel: string;
  rubberType: string;
  material: string;
  searchTerm: string;
}

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  materials: RubberMaterialExtended[];
}

const RubberFilterPanel: React.FC<Props> = ({ filters, onFilterChange }) => {
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

  const hasActiveFilters = filters.system || filters.tempLevel || filters.rubberType || filters.material || filters.searchTerm;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索材料名称、零部件、描述..."
            value={filters.searchTerm}
            onChange={(e) => handleChange('searchTerm', e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 筛选器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 系统筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">系统分类</label>
          <select
            value={filters.system}
            onChange={(e) => handleChange('system', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">所有系统</option>
            <option value="thermal">🌡️ 热管理系统</option>
            <option value="chassis">🚗 底盘系统</option>
            <option value="cabin">🪟 座舱系统</option>
            <option value="engine">⚙️ 增程系统</option>
            <option value="body">🚙 车身系统</option>
            <option value="power">⚡ 动力驱动系统</option>
          </select>
        </div>

        {/* 温度等级筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">温度等级</label>
          <select
            value={filters.tempLevel}
            onChange={(e) => handleChange('tempLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">所有温度</option>
            <option value="temp1">≤70℃</option>
            <option value="temp2">70~100℃</option>
            <option value="temp3">100-125℃</option>
            <option value="temp4">125-150℃</option>
            <option value="temp5">150-175℃</option>
            <option value="temp6">≥175℃</option>
          </select>
        </div>

        {/* 用途分类筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">用途分类</label>
          <select
            value={filters.rubberType}
            onChange={(e) => handleChange('rubberType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">所有用途</option>
            <option value="seal">密封件</option>
            <option value="hose">管路类</option>
            <option value="bushing">衬套类</option>
            <option value="mount">悬置类</option>
            <option value="boot">护罩（套）类</option>
            <option value="weatherstrip">胶条</option>
            <option value="cushion">软垫类</option>
            <option value="other">其它</option>
          </select>
        </div>

        {/* 材料筛选 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">材料类型</label>
          <select
            value={filters.material}
            onChange={(e) => handleChange('material', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
            <option value="TPS">TPS (热塑性苯乙烯)</option>
            <option value="CM">CM (氯化聚乙烯)</option>
            <option value="ECO">ECO (氯醇橡胶)</option>
          </select>
        </div>
      </div>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {hasActiveFilters && '已应用筛选条件'}
          </span>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-all"
          >
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              清除所有筛选
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RubberFilterPanel;
