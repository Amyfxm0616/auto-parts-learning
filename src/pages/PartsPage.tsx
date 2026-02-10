import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parts as initialParts } from '../data/parts';
import { partSystems as initialSystems } from '../data/systems';
import { materials } from '../data/materials';

type Part = typeof initialParts[number];
type PartSystem = typeof initialSystems[number];

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [systems, setSystems] = useState<PartSystem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('sys-001');
  const [selectedSubspecialty, setSelectedSubspecialty] = useState<string>('');
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSubspecialty, setEditingSubspecialty] = useState<string | null>(null);
  const [isAddingSubspecialty, setIsAddingSubspecialty] = useState(false);
  const [newSubspecialtyName, setNewSubspecialtyName] = useState('');

  // 只显示非金属材料
  const nonMetalMaterials = materials.filter((m) =>
    m.category !== 'metal' && m.category !== 'ceramic'
  );

  // 加载数据
  useEffect(() => {
    const savedParts = localStorage.getItem('customParts');
    const savedSystems = localStorage.getItem('customSystems');
    const dataVersion = localStorage.getItem('partsDataVersion');

    // 数据版本控制 - 如果版本不匹配，使用初始数据
    const CURRENT_VERSION = '4.0';

    if (dataVersion !== CURRENT_VERSION) {
      // 版本不匹配，重置为初始数据
      setParts(initialParts);
      setSystems(initialSystems);
      localStorage.setItem('partsDataVersion', CURRENT_VERSION);
      localStorage.setItem('customParts', JSON.stringify(initialParts));
      localStorage.setItem('customSystems', JSON.stringify(initialSystems));
    } else {
      // 版本匹配，使用保存的数据
      if (savedParts) {
        setParts(JSON.parse(savedParts));
      } else {
        setParts(initialParts);
      }

      if (savedSystems) {
        setSystems(JSON.parse(savedSystems));
      } else {
        setSystems(initialSystems);
      }
    }
  }, []);

  // 当切换系统时，重置子专业选择
  useEffect(() => {
    const system = systems.find((s) => s.id === selectedSystem);
    if (system && system.subspecialties && system.subspecialties.length > 0) {
      setSelectedSubspecialty(system.subspecialties[0]);
    } else {
      setSelectedSubspecialty('');
    }
  }, [selectedSystem, systems]);

  const saveParts = (newParts: Part[]) => {
    setParts(newParts);
    localStorage.setItem('customParts', JSON.stringify(newParts));
  };

  const saveSystems = (newSystems: PartSystem[]) => {
    setSystems(newSystems);
    localStorage.setItem('customSystems', JSON.stringify(newSystems));
  };

  // 添加子专业
  const handleAddSubspecialty = () => {
    if (!newSubspecialtyName.trim()) return;

    const currentSystem = systems.find((s) => s.id === selectedSystem);
    if (!currentSystem) return;

    const updatedSystems = systems.map((sys) => {
      if (sys.id === selectedSystem) {
        const subspecialties = sys.subspecialties || [];
        return {
          ...sys,
          subspecialties: [...subspecialties, newSubspecialtyName.trim()],
        };
      }
      return sys;
    });

    saveSystems(updatedSystems);
    setSelectedSubspecialty(newSubspecialtyName.trim());
    setNewSubspecialtyName('');
    setIsAddingSubspecialty(false);
  };

  // 编辑子专业名称
  const handleEditSubspecialty = (oldName: string, newName: string) => {
    if (!newName.trim() || oldName === newName) {
      setEditingSubspecialty(null);
      return;
    }

    const currentSystem = systems.find((s) => s.id === selectedSystem);
    if (!currentSystem) return;

    // 更新系统中的子专业名称
    const updatedSystems = systems.map((sys) => {
      if (sys.id === selectedSystem) {
        return {
          ...sys,
          subspecialties: (sys.subspecialties || []).map((sub) =>
            sub === oldName ? newName.trim() : sub
          ),
        };
      }
      return sys;
    });

    // 更新零部件中的子专业引用
    const updatedParts = parts.map((part) => {
      if (part.category === currentSystem.name && part.subcategory === oldName) {
        return { ...part, subcategory: newName.trim() };
      }
      return part;
    });

    saveSystems(updatedSystems);
    saveParts(updatedParts);

    if (selectedSubspecialty === oldName) {
      setSelectedSubspecialty(newName.trim());
    }

    setEditingSubspecialty(null);
  };

  // 删除子专业
  const handleDeleteSubspecialty = (subspecialtyName: string) => {
    const currentSystem = systems.find((s) => s.id === selectedSystem);
    if (!currentSystem) return;

    // 检查是否有零部件使用该子专业
    const partsInSubspecialty = parts.filter(
      (p) => p.category === currentSystem.name && p.subcategory === subspecialtyName
    );

    if (partsInSubspecialty.length > 0) {
      if (!confirm(`该子专业下有 ${partsInSubspecialty.length} 个零部件，删除后这些零部件也将被删除。确定继续？`)) {
        return;
      }
      // 删除该子专业下的所有零部件
      const updatedParts = parts.filter(
        (p) => !(p.category === currentSystem.name && p.subcategory === subspecialtyName)
      );
      saveParts(updatedParts);
    } else {
      if (!confirm('确定要删除这个子专业吗？')) {
        return;
      }
    }

    // 从系统中删除子专业
    const updatedSystems = systems.map((sys) => {
      if (sys.id === selectedSystem) {
        return {
          ...sys,
          subspecialties: (sys.subspecialties || []).filter((sub) => sub !== subspecialtyName),
        };
      }
      return sys;
    });

    saveSystems(updatedSystems);

    // 如果删除的是当前选中的子专业，选择第一个
    if (selectedSubspecialty === subspecialtyName) {
      const remainingSubspecialties = updatedSystems.find((s) => s.id === selectedSystem)?.subspecialties || [];
      if (remainingSubspecialties.length > 0) {
        setSelectedSubspecialty(remainingSubspecialties[0]);
      }
    }
  };

  // 获取指定系统和子专业的零部件，并应用搜索过滤
  const getPartsBySystemAndSubspecialty = (systemName: string, subspecialty: string) => {
    let filtered = parts.filter(
      (p) => p.category === systemName && p.subcategory === subspecialty
    );

    if (searchTerm) {
      filtered = filtered.filter(
        (part) =>
          part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          part.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleCreate = (systemName: string, subspecialty: string) => {
    const newPart: Part = {
      id: `part-${Date.now()}`,
      name: '新零部件',
      category: systemName,
      subcategory: subspecialty,
      materials: [],
      description: '',
      imageUrl: '',
    };
    setEditingPart(newPart);
    setIsCreating(true);
  };

  const handleEdit = (part: Part) => {
    setEditingPart({ ...part });
    setIsCreating(false);
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

  const handleCancel = () => {
    setEditingPart(null);
    setIsCreating(false);
  };

  const updateField = (field: keyof Part, value: any) => {
    if (editingPart) {
      setEditingPart({ ...editingPart, [field]: value });
    }
  };

  // 获取当前系统的子专业列表
  const currentSystem = systems.find((s) => s.id === selectedSystem);
  const subspecialties = currentSystem?.subspecialties || [];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">汽车零部件</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="搜索零部件名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* System Tabs */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200">
          {systems.map((system) => (
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

      {/* 编辑零部件模态框 */}
      {editingPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                      placeholder="输入图片URL地址"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 基本信息 */}
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
                      onChange={(e) => {
                        updateField('category', e.target.value);
                        const newSystem = systems.find((s) => s.name === e.target.value);
                        if (newSystem && newSystem.subspecialties && newSystem.subspecialties.length > 0) {
                          updateField('subcategory', newSystem.subspecialties[0]);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {systems.map((system) => (
                        <option key={system.id} value={system.name}>
                          {system.icon} {system.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      子专业 *
                    </label>
                    <select
                      value={editingPart.subcategory || ''}
                      onChange={(e) => updateField('subcategory', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {systems
                        .find((s) => s.name === editingPart.category)
                        ?.subspecialties?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* 使用材料 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用材料（仅非金属）*
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
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
                              updateField('materials', [...editingPart.materials, material.id]);
                            } else {
                              updateField('materials', editingPart.materials.filter((m) => m !== material.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{material.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    零部件描述
                  </label>
                  <textarea
                    value={editingPart.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 功能说明 */}
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

                {/* 技术报告链接 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    技术报告链接
                  </label>
                  <input
                    type="text"
                    value={editingPart.reportUrl || ''}
                    onChange={(e) => updateField('reportUrl', e.target.value)}
                    placeholder="输入技术报告URL"
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

      {/* System Content */}
      {currentSystem && (
        <div className="bg-white rounded-lg shadow">
          {/* System Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentSystem.icon}</span>
              <h2 className="text-2xl font-semibold">{currentSystem.name}</h2>
            </div>
            <p className="text-sm text-gray-600">{currentSystem.description}</p>
          </div>

          {/* Subspecialty Tabs with Management */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex px-6 items-center">
              {subspecialties.map((subspecialty) => (
                <div key={subspecialty} className="flex items-center group">
                  {editingSubspecialty === subspecialty ? (
                    <input
                      type="text"
                      defaultValue={subspecialty}
                      autoFocus
                      onBlur={(e) => handleEditSubspecialty(subspecialty, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditSubspecialty(subspecialty, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingSubspecialty(null);
                        }
                      }}
                      className="px-4 py-3 text-sm font-medium border-b-2 border-blue-600 focus:outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => setSelectedSubspecialty(subspecialty)}
                      className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                        selectedSubspecialty === subspecialty
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {subspecialty}
                    </button>
                  )}
                  <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingSubspecialty(subspecialty)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="编辑"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteSubspecialty(subspecialty)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="删除"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* 添加子专业按钮 */}
              {isAddingSubspecialty ? (
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="text"
                    value={newSubspecialtyName}
                    onChange={(e) => setNewSubspecialtyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSubspecialty();
                      } else if (e.key === 'Escape') {
                        setIsAddingSubspecialty(false);
                        setNewSubspecialtyName('');
                      }
                    }}
                    placeholder="子专业名称"
                    autoFocus
                    className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddSubspecialty}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    确定
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingSubspecialty(false);
                      setNewSubspecialtyName('');
                    }}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingSubspecialty(true)}
                  className="ml-2 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded whitespace-nowrap"
                >
                  + 添加子专业
                </button>
              )}
            </div>
          </div>

          {/* Subspecialty Content */}
          {selectedSubspecialty && (
            <div>
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedSubspecialty}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    共 {getPartsBySystemAndSubspecialty(currentSystem.name, selectedSubspecialty).length} 个零部件
                  </p>
                </div>
                <button
                  onClick={() => handleCreate(currentSystem.name, selectedSubspecialty)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + 添加零部件
                </button>
              </div>

              {/* Parts Grid */}
              {(() => {
                const subspecialtyParts = getPartsBySystemAndSubspecialty(
                  currentSystem.name,
                  selectedSubspecialty
                );

                if (subspecialtyParts.length === 0) {
                  return (
                    <div className="p-12 text-center text-gray-500">
                      <p className="text-lg mb-2">
                        {searchTerm ? '未找到匹配的零部件' : '暂无零部件'}
                      </p>
                      {searchTerm ? (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          清除搜索条件
                        </button>
                      ) : (
                        <p className="text-sm">点击"添加零部件"按钮创建第一个</p>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {subspecialtyParts.map((part) => {
                      const partMaterials = materials.filter((m) =>
                        part.materials.includes(m.id)
                      );

                      return (
                        <div
                          key={part.id}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {/* Image Area */}
                          <div className="h-48 bg-gray-100 overflow-hidden">
                            {part.imageUrl ? (
                              <img
                                src={part.imageUrl}
                                alt={part.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).parentElement!.innerHTML =
                                    '<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">无图片</div>';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                                📦
                              </div>
                            )}
                          </div>

                          {/* Content Area */}
                          <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {part.name}
                            </h3>
                            {part.nameEn && (
                              <p className="text-xs text-gray-500 mb-2">{part.nameEn}</p>
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

                            {/* 技术报告链接 */}
                            {part.reportUrl && (
                              <div className="mb-3 pt-3 border-t border-gray-200">
                                <a
                                  href={part.reportUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                  <span>📄</span>
                                  <span>查看技术报告</span>
                                </a>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Link
                                to={`/parts/${part.id}`}
                                className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center"
                              >
                                详情
                              </Link>
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
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
