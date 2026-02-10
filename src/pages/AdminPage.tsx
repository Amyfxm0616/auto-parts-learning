import { useState, useEffect } from 'react';
import { parts as initialParts } from '../data/parts';
import { materials } from '../data/materials';
import { partSystems } from '../data/systems';

type Part = typeof initialParts[number];

export default function AdminPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<string>('sys-001');

  // 只显示非金属材料
  const nonMetalMaterials = materials.filter((m) =>
    m.category !== 'metal' && m.category !== 'ceramic'
  );

  useEffect(() => {
    const savedParts = localStorage.getItem('customParts');
    if (savedParts) {
      setParts(JSON.parse(savedParts));
    } else {
      setParts(initialParts);
    }
  }, []);

  const saveParts = (newParts: Part[]) => {
    setParts(newParts);
    localStorage.setItem('customParts', JSON.stringify(newParts));
  };

  const handleCreate = (systemName: string) => {
    const newPart: Part = {
      id: `part-${Date.now()}`,
      name: '新零部件',
      category: systemName,
      materials: [],
      description: '',
      imageUrl: '',
    };
    setEditingPart(newPart);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingPart) return;

    if (isCreating) {
      saveParts([...parts, editingPart]);
    } else {
      saveParts(parts.map((p) => (p.id === editingPart.id ? editingPart : p)));
    }
    setEditingPart(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个零部件吗？')) {
      saveParts(parts.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (part: Part) => {
    setEditingPart({ ...part });
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingPart(null);
    setIsCreating(false);
  };

  const updateField = (field: keyof Part, value: any) => {
    if (editingPart) {
      setEditingPart({ ...editingPart, [field]: value });
    }
  };

  // 按系统分组零部件
  const getPartsBySystem = (systemName: string) => {
    return parts.filter((p) => p.category === systemName);
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">零部件管理</h1>

      {/* 系统选择标签 */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200">
          {partSystems.map((system) => (
            <button
              key={system.id}
              onClick={() => setSelectedSystem(system.id)}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium whitespace-nowrap ${
                selectedSystem === system.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{system.icon}</span>
              {system.name}
            </button>
          ))}
        </div>
      </div>

      {/* 编辑表单模态框 */}
      {editingPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {isCreating ? '创建零部件' : '编辑零部件'}
              </h2>

              <div className="space-y-4">
                {/* 图片预览和编辑 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    零部件图片
                  </label>
                  <div className="flex flex-col gap-3">
                    {editingPart.imageUrl && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={editingPart.imageUrl}
                          alt="预览"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingPart.imageUrl || ''}
                      onChange={(e) => updateField('imageUrl', e.target.value)}
                      placeholder="输入图片URL地址，例如：https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">
                      提示：可以使用在线图片链接，或上传图片到图床后粘贴链接
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      零部件名称 *
                    </label>
                    <input
                      type="text"
                      value={editingPart.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      英文名称
                    </label>
                    <input
                      type="text"
                      value={editingPart.nameEn || ''}
                      onChange={(e) => updateField('nameEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      系统分类 *
                    </label>
                    <select
                      value={editingPart.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {partSystems.map((system) => (
                        <option key={system.id} value={system.name}>
                          {system.icon} {system.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      子分类
                    </label>
                    <input
                      type="text"
                      value={editingPart.subcategory || ''}
                      onChange={(e) => updateField('subcategory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用材料（仅非金属）*
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {nonMetalMaterials.map((material) => (
                      <label
                        key={material.id}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={editingPart.materials.includes(material.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('materials', [
                                ...editingPart.materials,
                                material.id,
                              ]);
                            } else {
                              updateField(
                                'materials',
                                editingPart.materials.filter((m) => m !== material.id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{material.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    value={editingPart.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    功能说明
                  </label>
                  <textarea
                    value={editingPart.function || ''}
                    onChange={(e) => updateField('function', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!editingPart.name || editingPart.materials.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 系统内容区 */}
      {partSystems.map((system) => {
        if (system.id !== selectedSystem) return null;

        const systemParts = getPartsBySystem(system.name);

        return (
          <div key={system.id} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span>{system.icon}</span>
                  <span>{system.name}</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">{system.description}</p>
              </div>
              <button
                onClick={() => handleCreate(system.name)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + 添加零部件
              </button>
            </div>

            {/* 零部件网格 */}
            {systemParts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">暂无零部件</p>
                <p className="text-sm">点击"添加零部件"按钮创建第一个</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {systemParts.map((part) => {
                  const partMaterials = materials.filter((m) =>
                    part.materials.includes(m.id)
                  );

                  return (
                    <div
                      key={part.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* 图片区域 */}
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        {part.imageUrl ? (
                          <img
                            src={part.imageUrl}
                            alt={part.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (
                                e.target as HTMLImageElement
                              ).parentElement!.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">无图片</div>';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                            📦
                          </div>
                        )}
                      </div>

                      {/* 内容区域 */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {part.name}
                        </h3>
                        {part.nameEn && (
                          <p className="text-xs text-gray-500 mb-2">{part.nameEn}</p>
                        )}
                        {part.subcategory && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                            {part.subcategory}
                          </span>
                        )}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {part.description || '暂无描述'}
                        </p>
                        <div className="mb-3">
                          <span className="text-xs text-gray-500">材料：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {partMaterials.map((m) => (
                              <span
                                key={m.id}
                                className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded"
                              >
                                {m.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(part)}
                            className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDelete(part.id)}
                            className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
