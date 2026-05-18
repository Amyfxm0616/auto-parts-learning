import { useState, useEffect, useRef } from 'react';
import { materials } from '../data/materials';
import { getSearchHistory, saveSearchHistory, clearSearchHistory } from '../utils/searchUtils';

interface FilterOptions {
  searchTerm: string;
  materials: string[];
  categories: string[];
  subcategories: string[];
}

interface AdvancedSearchFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  availableSubcategories: string[];
}

export default function AdvancedSearchFilter({
  onFilterChange,
  availableCategories,
  availableSubcategories
}: AdvancedSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 加载搜索历史
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // 触发筛选更新
  useEffect(() => {
    onFilterChange({
      searchTerm,
      materials: selectedMaterials,
      categories: selectedCategories,
      subcategories: selectedSubcategories
    });
  }, [searchTerm, selectedMaterials, selectedCategories, selectedSubcategories, onFilterChange]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 2) {
      saveSearchHistory(value);
      setSearchHistory(getSearchHistory());
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
    searchInputRef.current?.focus();
  };

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId)
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedMaterials([]);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  };

  const activeFiltersCount =
    selectedMaterials.length +
    selectedCategories.length +
    selectedSubcategories.length +
    (searchTerm ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 主搜索框 */}
      <div className="p-4">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="搜索零部件... (支持拼音首字母，如 'zxb' 搜索 '中控板')"
            className="w-full px-4 py-3 pl-10 pr-32 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {/* 高级筛选按钮 */}
          <div className="absolute right-2 top-2 flex gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                清除 ({activeFiltersCount})
              </button>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                showAdvanced
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              高级筛选
            </button>
          </div>

          {/* 搜索历史下拉 */}
          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className="text-xs text-gray-500">搜索历史</span>
                  <button
                    onClick={() => {
                      clearSearchHistory();
                      setSearchHistory([]);
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    清除历史
                  </button>
                </div>
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(term)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 高级筛选面板 */}
      {showAdvanced && (
        <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50">
          {/* 按材料筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              按材料筛选
            </label>
            <div className="flex flex-wrap gap-2">
              {materials.filter(m => m.category !== 'metal' && m.category !== 'ceramic').map((material) => (
                <button
                  key={material.id}
                  onClick={() => toggleMaterial(material.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedMaterials.includes(material.id)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {material.name}
                </button>
              ))}
            </div>
          </div>

          {/* 按系统筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              按系统筛选
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 按子专业筛选 */}
          {availableSubcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                按子专业筛选
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {availableSubcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => toggleSubcategory(subcategory)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedSubcategories.includes(subcategory)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
