import { useState, useEffect } from 'react';
import type { ExtractedPartData } from '../../types/upload';
import { partSystems } from '../../data/systems';

interface ExtractedDataPreviewProps {
  data: ExtractedPartData;
  onConfirm: (data: ExtractedPartData) => void;
  onCancel: () => void;
}

export default function ExtractedDataPreview({ data, onConfirm, onCancel }: ExtractedDataPreviewProps) {
  const [editedData, setEditedData] = useState<ExtractedPartData>(data);
  const [selectedSystem, setSelectedSystem] = useState(data.suggestedSystem || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(data.suggestedSubcategory || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 获取当前系统的子专业列表
  const currentSystem = partSystems.find(s => s.name === selectedSystem);
  const subcategories = currentSystem?.subspecialties || [];

  useEffect(() => {
    setEditedData(prev => ({
      ...prev,
      suggestedSystem: selectedSystem,
      suggestedSubcategory: selectedSubcategory
    }));
  }, [selectedSystem, selectedSubcategory]);

  const handleConfirm = () => {
    onConfirm({
      ...editedData,
      suggestedSystem: selectedSystem,
      suggestedSubcategory: selectedSubcategory
    });
  };

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-600 bg-green-100';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* 置信度指示器 */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">识别置信度:</span>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(data.confidence)}`}>
          {Math.round(data.confidence * 100)}%
        </div>
        {data.confidence < 0.5 && (
          <span className="text-xs text-gray-500">建议手动检查并修改</span>
        )}
      </div>

      {/* 零部件名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          零部件名称 *
        </label>
        <input
          type="text"
          value={editedData.name}
          onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="请输入零部件名称"
        />
      </div>

      {/* 系统分类 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            系统分类 * {data.suggestedSystem && <span className="text-blue-600">(智能推荐)</span>}
          </label>
          <select
            value={selectedSystem}
            onChange={(e) => {
              setSelectedSystem(e.target.value);
              setSelectedSubcategory(''); // 重置子专业
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">请选择系统</option>
            {partSystems.map(sys => (
              <option key={sys.id} value={sys.name}>
                {sys.icon} {sys.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            子专业分类
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedSystem}
          >
            <option value="">请选择子专业</option>
            {subcategories.map(sub => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          描述
        </label>
        <textarea
          value={editedData.description}
          onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="请输入零部件描述"
        />
      </div>

      {/* 识别的材料 */}
      {editedData.materials.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            识别的材料 ({editedData.materials.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {editedData.materials.map((mat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {mat}
                <button
                  onClick={() => {
                    const newMaterials = editedData.materials.filter((_, i) => i !== index);
                    const newMaterialIds = editedData.materialIds.filter((_, i) => i !== index);
                    setEditedData({
                      ...editedData,
                      materials: newMaterials,
                      materialIds: newMaterialIds
                    });
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 技术参数 */}
      {editedData.technicalParams && Object.keys(editedData.technicalParams).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            技术参数
          </label>
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
            {editedData.technicalParams.temperature && (
              <div>
                <span className="text-xs text-gray-600">工作温度</span>
                <p className="text-sm font-medium">{editedData.technicalParams.temperature}</p>
              </div>
            )}
            {editedData.technicalParams.pressure && (
              <div>
                <span className="text-xs text-gray-600">压力</span>
                <p className="text-sm font-medium">{editedData.technicalParams.pressure}</p>
              </div>
            )}
            {editedData.technicalParams.load && (
              <div>
                <span className="text-xs text-gray-600">负载</span>
                <p className="text-sm font-medium">{editedData.technicalParams.load}</p>
              </div>
            )}
            {editedData.technicalParams.environment && (
              <div className="col-span-2">
                <span className="text-xs text-gray-600">环境</span>
                <p className="text-sm font-medium">{editedData.technicalParams.environment}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 提取的图片 */}
      {editedData.images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            提取的图片 ({editedData.images.length})
          </label>
          <div className="space-y-3">
            {/* 主图预览 */}
            <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
              <img
                src={editedData.images[selectedImageIndex]}
                alt={`预览图 ${selectedImageIndex + 1}`}
                className="w-full h-64 object-contain bg-gray-50"
              />
            </div>

            {/* 缩略图选择 */}
            {editedData.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {editedData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                      index === selectedImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`缩略图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          重新上传
        </button>
        <button
          onClick={handleConfirm}
          disabled={!editedData.name || !selectedSystem}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          确认保存
        </button>
      </div>
    </div>
  );
}
