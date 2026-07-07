// src/components/rubber/RubberMaterialEditModal.tsx
// 橡胶材料编辑弹窗

import React, { useState, useEffect } from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';
import { rubberSystems } from '../../types/rubber';

interface Props {
  material: RubberMaterialExtended | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: RubberMaterialExtended) => void;
  onDelete?: (materialId: string) => void;
}

const rubberTypes = {
  seal: '密封件',
  hose: '管路类',
  boot: '护罩（套）类',
  bushing: '衬套类',
  mount: '悬置类',
  weatherstrip: '胶条',
  cushion: '软垫类',
  other: '其它'
} as const;

const tempLevels = {
  temp1: { range: '≤70℃', min: -40, max: 70 },
  temp2: { range: '70~100℃', min: 70, max: 100 },
  temp3: { range: '100-125℃', min: 100, max: 125 },
  temp4: { range: '125-150℃', min: 125, max: 150 },
  temp5: { range: '150-175℃', min: 150, max: 175 },
  temp6: { range: '≥175℃', min: 175, max: 200 }
} as const;

const RubberMaterialEditModal: React.FC<Props> = ({ material, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<Partial<RubberMaterialExtended>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (material && isOpen) {
      setFormData({ ...material });
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [material, isOpen]);

  const handleInputChange = (field: keyof RubberMaterialExtended, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTempLevelChange = (tempLevel: string) => {
    const selectedTemp = tempLevels[tempLevel as keyof typeof tempLevels];
    if (selectedTemp) {
      setFormData(prev => ({
        ...prev,
        tempLevel: tempLevel as any,
        tempRange: {
          ...prev.tempRange!,
          min: selectedTemp.min,
          max: selectedTemp.max,
          display: selectedTemp.range
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.partName?.trim()) {
      newErrors.partName = '请输入零部件名称';
    }
    if (!formData.name?.trim()) {
      newErrors.name = '请输入材料名称';
    }
    if (!formData.material?.trim()) {
      newErrors.material = '请输入材料类型';
    }
    if (!formData.description?.trim()) {
      newErrors.description = '请输入描述';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm() || !formData) return;

    const updatedMaterial: RubberMaterialExtended = {
      id: material!.id,
      name: formData.name || material!.name,
      category: 'rubber',
      rubberType: formData.rubberType || material!.rubberType,
      tempLevel: formData.tempLevel || material!.tempLevel,
      system: formData.system || material!.system,
      partName: formData.partName || material!.partName,
      material: formData.material || material!.material,
      tempRange: formData.tempRange || material!.tempRange,
      description: formData.description || material!.description,
      properties: formData.properties || material!.properties,
      performance: formData.performance || material!.performance,
      chemicalResistance: formData.chemicalResistance || material!.chemicalResistance,
      applications: formData.applications || material!.applications,
      standards: formData.standards || material!.standards,
      suppliers: formData.suppliers || material!.suppliers
    };

    onSave(updatedMaterial);
    onClose();
  };

  const handleDelete = () => {
    if (material && onDelete) {
      onDelete(material.id);
      onClose();
    }
  };

  const handleAddApplication = () => {
    const newApp = prompt('请输入新的应用场景');
    if (newApp?.trim()) {
      setFormData(prev => ({
        ...prev,
        applications: [...(prev.applications || []), newApp.trim()]
      }));
    }
  };

  const handleRemoveApplication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      applications: prev.applications?.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen || !material) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">编辑橡胶材料</h2>
            <p className="text-sm text-gray-500 mt-0.5">ID: {material.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 表单内容 */}
        <div className="px-6 py-5 space-y-6">
          {/* 基本信息 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              基本信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 材料名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  材料名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* 零部件名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  零部件名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.partName || ''}
                  onChange={(e) => handleInputChange('partName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.partName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.partName && <p className="text-xs text-red-500 mt-1">{errors.partName}</p>}
              </div>

              {/* 材料类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  材料类型 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.material || ''}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="VMQ, EPDM, NBR..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.material ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.material && <p className="text-xs text-red-500 mt-1">{errors.material}</p>}
              </div>

              {/* 描述 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>
            </div>
          </section>

          {/* 分类选择 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              分类信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 所属系统 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所属系统</label>
                <select
                  value={formData.system || ''}
                  onChange={(e) => handleInputChange('system', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {rubberSystems.map(system => (
                    <option key={system.id} value={system.id}>{system.name}</option>
                  ))}
                </select>
              </div>

              {/* 用途类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用途类型</label>
                <select
                  value={formData.rubberType || ''}
                  onChange={(e) => handleInputChange('rubberType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {Object.entries(rubberTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* 温度等级 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">温度等级</label>
                <select
                  value={formData.tempLevel || ''}
                  onChange={(e) => handleTempLevelChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {Object.entries(tempLevels).map(([key, value]) => (
                    <option key={key} value={key}>{value.range}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 性能参数 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              性能参数
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">硬度</label>
                <input
                  type="text"
                  value={formData.properties?.hardness || ''}
                  onChange={(e) => handleInputChange('properties', { ...formData.properties, hardness: e.target.value })}
                  placeholder="60-80 Shore A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密度</label>
                <input
                  type="text"
                  value={formData.properties?.density || ''}
                  onChange={(e) => handleInputChange('properties', { ...formData.properties, density: e.target.value })}
                  placeholder="1.1-1.2 g/cm³"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">抗拉强度</label>
                <input
                  type="text"
                  value={formData.properties?.tensileStrength || ''}
                  onChange={(e) => handleInputChange('properties', { ...formData.properties, tensileStrength: e.target.value })}
                  placeholder="≥7 MPa"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">伸长率</label>
                <input
                  type="text"
                  value={formData.properties?.elongation || ''}
                  onChange={(e) => handleInputChange('properties', { ...formData.properties, elongation: e.target.value })}
                  placeholder="≥400%"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* 耐化学介质 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">耐化学介质</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.chemicalResistance?.oil || false}
                    onChange={(e) => handleInputChange('chemicalResistance', { ...formData.chemicalResistance, oil: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">耐油</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.chemicalResistance?.fuel || false}
                    onChange={(e) => handleInputChange('chemicalResistance', { ...formData.chemicalResistance, fuel: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">耐燃油</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.chemicalResistance?.coolant || false}
                    onChange={(e) => handleInputChange('chemicalResistance', { ...formData.chemicalResistance, coolant: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">耐冷却液</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.chemicalResistance?.water || false}
                    onChange={(e) => handleInputChange('chemicalResistance', { ...formData.chemicalResistance, water: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm">耐水</span>
                </label>
              </div>
            </div>
          </section>

          {/* 应用场景 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b pb-2">
              应用场景
            </h3>
            <div className="space-y-2">
              {(formData.applications || []).map((app, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-sm flex-1">
                    {app}
                  </span>
                  <button
                    onClick={() => handleRemoveApplication(index)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                  >
                    删除
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddApplication}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                + 添加应用场景
              </button>
            </div>
          </section>
        </div>

        {/* 底部操作按钮 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            {onDelete && (
              <>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-all text-sm font-medium"
                  >
                    删除材料
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all text-sm font-medium"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all text-sm font-medium"
                    >
                      确认删除
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-all font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all font-medium"
            >
              保存修改
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubberMaterialEditModal;
