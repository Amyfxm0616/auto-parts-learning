import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { parts as initialParts } from '../data/parts';
import { partSystems as initialSystems } from '../data/systems';
import { materials } from '../data/materials';
import AdvancedSearchFilter from '../components/AdvancedSearchFilter';
import { fuzzyMatch } from '../utils/searchUtils';
import InteriorSystemView from '../components/system-views/InteriorSystemView';
import SeatSystemView from '../components/system-views/SeatSystemView';
import LightingSystemView from '../components/system-views/LightingSystemView';
import SmartElectronicsSystemView from '../components/system-views/SmartElectronicsSystemView';
import BodyTrimSystemView from '../components/system-views/BodyTrimSystemView';
import SealingSystemView from '../components/system-views/SealingSystemView';
import GlassSystemView from '../components/system-views/GlassSystemView';
import SideDoorSystemView from '../components/system-views/SideDoorSystemView';
import ThermalManagementSystemView from '../components/system-views/ThermalManagementSystemView';
import ExtendedRangeSystemView from '../components/system-views/ExtendedRangeSystemView';
import PowerDriveSystemView from '../components/system-views/PowerDriveSystemView';
import ChassisSystemView from '../components/system-views/ChassisSystemView';

const DEDICATED_SYSTEM_IDS = new Set(['sys-003', 'sys-005', 'sys-007']);

const CURRENT_VERSION = '4.3';

type Part = typeof initialParts[number];
type PartSystem = typeof initialSystems[number];

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [systems, setSystems] = useState<PartSystem[]>([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    materials: [] as string[],
    categories: [] as string[],
    subcategories: [] as string[]
  });
  const [selectedSystem, setSelectedSystem] = useState<string>('sys-001');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>(''); // 子系统选择
  const [selectedSubspecialty, setSelectedSubspecialty] = useState<string>('');
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingSubspecialty, setEditingSubspecialty] = useState<string | null>(null);
  const [isAddingSubspecialty, setIsAddingSubspecialty] = useState(false);
  const [newSubspecialtyName, setNewSubspecialtyName] = useState('');
  // 系统编辑状态
  const [isEditingSystems, setIsEditingSystems] = useState(false);
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  const [newSystemIcon, setNewSystemIcon] = useState('📦');
  const [newSystemDescription, setNewSystemDescription] = useState('');
  const [newMaterialInput, setNewMaterialInput] = useState('');

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

  // 当切换系统时，重置子系统和子专业选择
  useEffect(() => {
    const system = systems.find((s) => s.id === selectedSystem);

    // 如果是座舱系统，设置默认子系统为"内饰"
    if (selectedSystem === 'sys-001') {
      setSelectedSubsystem('内饰');
    } else if (DEDICATED_SYSTEM_IDS.has(selectedSystem)) {
      setSelectedSubsystem('');
      setSelectedSubspecialty('');
    } else {
      setSelectedSubsystem('');
      // 非座舱系统，使用原有逻辑
      if (system && system.subspecialties && system.subspecialties.length > 0) {
        setSelectedSubspecialty(system.subspecialties[0]);
      } else {
        setSelectedSubspecialty('');
      }
    }
  }, [selectedSystem, systems]);

  // 当切换子系统时，重置子专业选择
  useEffect(() => {
    if (selectedSystem === 'sys-001' && selectedSubsystem) {
      const system = systems.find((s) => s.id === selectedSystem);
      if (system && system.subspecialties) {
        // 找到属于当前子系统的第一个专业
        const subsystemSpecialties = system.subspecialties.filter((spec) =>
          spec.startsWith(selectedSubsystem)
        );
        if (subsystemSpecialties.length > 0) {
          setSelectedSubspecialty(subsystemSpecialties[0]);
        } else {
          setSelectedSubspecialty('');
        }
      }
    }
  }, [selectedSubsystem, selectedSystem, systems]);

  const saveParts = (newParts: Part[]) => {
    setParts(newParts);
    localStorage.setItem('customParts', JSON.stringify(newParts));
  };

  const saveSystems = (newSystems: PartSystem[]) => {
    setSystems(newSystems);
    localStorage.setItem('customSystems', JSON.stringify(newSystems));
  };

  // 移动系统顺序
  const handleMoveSystem = (index: number, direction: 'left' | 'right') => {
    const swapIndex = direction === 'left' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= systems.length) return;
    const newSystems = [...systems];
    [newSystems[index], newSystems[swapIndex]] = [newSystems[swapIndex], newSystems[index]];
    saveSystems(newSystems);
  };

  // 删除系统
  const handleDeleteSystem = (id: string) => {
    const target = systems.find(s => s.id === id);
    if (!window.confirm(`确定要删除「${target?.name}」系统吗？`)) return;
    const newSystems = systems.filter(s => s.id !== id);
    saveSystems(newSystems);
    if (selectedSystem === id) {
      setSelectedSystem(newSystems[0]?.id || '');
    }
  };

  // 添加新系统
  const handleAddSystem = () => {
    if (!newSystemName.trim()) return;
    const newSystem: PartSystem = {
      id: `sys-${Date.now()}`,
      name: newSystemName.trim(),
      icon: newSystemIcon || '📦',
      parts: [],
      description: newSystemDescription.trim(),
      subspecialties: [],
    };
    saveSystems([...systems, newSystem]);
    setNewSystemName('');
    setNewSystemIcon('📦');
    setNewSystemDescription('');
    setIsAddingSystem(false);
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

  // 获取指定系统和子专业的零部件，并应用高级搜索过滤
  const getPartsBySystemAndSubspecialty = useCallback((systemName: string, subspecialty: string) => {
    let filtered = parts.filter(
      (p) => p.category === systemName && p.subcategory === subspecialty
    );

    // 应用搜索词过滤（支持模糊搜索和拼音）
    if (filters.searchTerm) {
      filtered = filtered.filter((part) =>
        fuzzyMatch(part.name, filters.searchTerm) ||
        fuzzyMatch(part.nameEn || '', filters.searchTerm) ||
        fuzzyMatch(part.description || '', filters.searchTerm)
      );
    }

    // 按材料过滤
    if (filters.materials.length > 0) {
      filtered = filtered.filter((part) =>
        filters.materials.some((matId) => part.materials.includes(matId))
      );
    }

    // 按系统过滤
    if (filters.categories.length > 0) {
      filtered = filtered.filter((part) =>
        filters.categories.includes(part.category)
      );
    }

    // 按子专业过滤
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter((part) =>
        filters.subcategories.includes(part.subcategory || '')
      );
    }

    return filtered;
  }, [parts, filters]);

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
    setNewMaterialInput('');
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
    setNewMaterialInput('');
  };

  const handleShare = (part: Part) => {
    // 将零部件数据编码为Base64
    const partData = JSON.stringify(part);
    const encoded = btoa(partData);

    // 生成分享链接
    const shareUrl = `${window.location.origin}/shared?data=${encoded}`;

    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`✓ 分享链接已复制到剪贴板！\n\n${shareUrl}\n\n发送给同事，他们点击后可以查看和编辑这个零部件。`);
    }).catch(() => {
      // 如果复制失败，显示链接让用户手动复制
      prompt('分享链接（请复制后发送给同事）：', shareUrl);
    });
  };

  const updateField = (field: keyof Part, value: any) => {
    if (editingPart) {
      setEditingPart({ ...editingPart, [field]: value });
    }
  };

  const currentSystem = systems.find((s) => s.id === selectedSystem);

  // 如果是座舱系统，只显示当前子系统的专业
  let subspecialties = currentSystem?.subspecialties || [];
  if (selectedSystem === 'sys-001' && selectedSubsystem) {
    subspecialties = subspecialties.filter((spec) => spec.startsWith(selectedSubsystem));
  }

  // 获取所有可用的分类和子分类
  const availableCategories = [...new Set(parts.map(p => p.category))];
  const availableSubcategories = [...new Set(parts.map(p => p.subcategory).filter(Boolean) as string[])];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">汽车零部件</h1>

      {/* Advanced Search Filter */}
      <div className="mb-6">
        <AdvancedSearchFilter
          onFilterChange={setFilters}
          availableCategories={availableCategories}
          availableSubcategories={availableSubcategories}
        />
      </div>

      {/* System Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 transition-colors">
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {systems.map((system, index) => (
            isEditingSystems ? (
              /* 编辑模式：显示排序和删除控件 */
              <div key={system.id} className="flex-shrink-0 flex items-center gap-1 px-3 py-2 border-r border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleMoveSystem(index, 'left')}
                  disabled={index === 0}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  title="左移"
                >◀</button>
                <span className="px-2 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <span className="mr-1">{system.icon}</span>{system.name}
                </span>
                <button
                  onClick={() => handleMoveSystem(index, 'right')}
                  disabled={index === systems.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  title="右移"
                >▶</button>
                <button
                  onClick={() => handleDeleteSystem(system.id)}
                  className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 hover:text-red-600 text-xs font-bold"
                  title="删除系统"
                >×</button>
              </div>
            ) : (
              /* 正常模式：正常标签页 */
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
            )
          ))}

          {/* 编辑模式：添加系统按钮 */}
          {isEditingSystems && (
            <button
              onClick={() => setIsAddingSystem(true)}
              className="flex-shrink-0 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 whitespace-nowrap font-medium"
            >
              + 添加系统
            </button>
          )}

          {/* 右侧编辑按钮 */}
          <div className="ml-auto flex-shrink-0 px-3 py-2">
            <button
              onClick={() => { setIsEditingSystems(!isEditingSystems); setIsAddingSystem(false); }}
              className={`px-3 py-1.5 text-xs rounded border font-medium whitespace-nowrap transition-colors ${
                isEditingSystems
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  : 'text-gray-500 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isEditingSystems ? '✓ 完成编辑' : '✎ 编辑系统'}
            </button>
          </div>
        </div>

        {/* 添加新系统表单 */}
        {isEditingSystems && isAddingSystem && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">图标（emoji）</label>
                <input
                  type="text"
                  value={newSystemIcon}
                  onChange={e => setNewSystemIcon(e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1.5 text-center text-lg"
                  maxLength={2}
                />
              </div>
              <div className="flex-1 min-w-32">
                <label className="block text-xs text-gray-500 mb-1">系统名称 *</label>
                <input
                  type="text"
                  value={newSystemName}
                  onChange={e => setNewSystemName(e.target.value)}
                  placeholder="如：热管理系统"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  onKeyDown={e => e.key === 'Enter' && handleAddSystem()}
                />
              </div>
              <div className="flex-1 min-w-40">
                <label className="block text-xs text-gray-500 mb-1">描述（可选）</label>
                <input
                  type="text"
                  value={newSystemDescription}
                  onChange={e => setNewSystemDescription(e.target.value)}
                  placeholder="系统描述"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddSystem}
                  disabled={!newSystemName.trim()}
                  className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-40"
                >
                  确认添加
                </button>
                <button
                  onClick={() => { setIsAddingSystem(false); setNewSystemName(''); setNewSystemIcon('📦'); setNewSystemDescription(''); }}
                  className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
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
                {/* 图片上传 */}
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
                        <button
                          type="button"
                          onClick={() => updateField('imageUrl', '')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-sm text-blue-600 font-medium">
                        {editingPart.imageUrl ? '重新上传图片' : '点击上传图片'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            updateField('imageUrl', ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
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
                    使用材料 *
                  </label>
                  {/* 现有材料复选框（多选） */}
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
                  {/* 自定义新增材料 */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newMaterialInput}
                      onChange={(e) => setNewMaterialInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const name = newMaterialInput.trim();
                          const mats = editingPart.materials || [];
                          if (name && !mats.includes(name)) {
                            updateField('materials', [...mats, name]);
                            setNewMaterialInput('');
                          }
                        }
                      }}
                      placeholder="输入新材料名称后点击新增"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const name = newMaterialInput.trim();
                        const mats = editingPart.materials || [];
                        if (name && !mats.includes(name)) {
                          updateField('materials', [...mats, name]);
                          setNewMaterialInput('');
                        }
                      }}
                      disabled={!newMaterialInput.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                      + 新增
                    </button>
                  </div>
                  {/* 已新增的自定义材料标签 */}
                  {editingPart.materials.filter((id) => !materials.find((m) => m.id === id)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingPart.materials
                        .filter((id) => !materials.find((m) => m.id === id))
                        .map((customName) => (
                          <span
                            key={customName}
                            className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-sm"
                          >
                            {customName}
                            <button
                              type="button"
                              onClick={() => updateField('materials', editingPart.materials.filter((m) => m !== customName))}
                              className="text-purple-500 hover:text-purple-800 font-bold ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
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

          {/* Subsystem Tabs (仅座舱系统显示) */}
          {selectedSystem === 'sys-001' && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex px-6 overflow-x-auto">
                {['内饰', '座椅', '灯具', '智能电器'].map((subsystem) => (
                  <button
                    key={subsystem}
                    onClick={() => setSelectedSubsystem(subsystem)}
                    className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                      selectedSubsystem === subsystem
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {subsystem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Subspecialty Tabs with Management (内饰、座椅、灯具、智能电器及专用系统不显示) */}
          {!(selectedSystem === 'sys-001' && ['内饰', '座椅', '灯具', '智能电器'].includes(selectedSubsystem)) && !DEDICATED_SYSTEM_IDS.has(selectedSystem) && (
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
          )}

          {/* Subspecialty Content */}
          {(selectedSubspecialty || (selectedSystem === 'sys-001' && selectedSubsystem) || selectedSystem === 'sys-004' || DEDICATED_SYSTEM_IDS.has(selectedSystem)) && (
            <div>
              {/* 各系统视图组件 */}
              {selectedSystem === 'sys-001' && selectedSubsystem === '内饰' ? (
                <InteriorSystemView currentSystem={currentSystem!} parts={parts} onEdit={handleEdit} />
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '座椅' ? (
                <SeatSystemView />
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '灯具' ? (
                <LightingSystemView />
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '智能电器' ? (
                <SmartElectronicsSystemView />
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '外观及功能饰件' ? (
                <BodyTrimSystemView />
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '密封系统' ? (
                <SealingSystemView />
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '玻璃系统' ? (
                <GlassSystemView />
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '侧门系统' ? (
                <SideDoorSystemView />
              ) : selectedSystem === 'sys-004' ? (
                <ThermalManagementSystemView />
              ) : selectedSystem === 'sys-003' ? (
                <ExtendedRangeSystemView />
              ) : selectedSystem === 'sys-005' ? (
                <PowerDriveSystemView />
              ) : selectedSystem === 'sys-007' ? (
                <ChassisSystemView />
              ) : (
                <>
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedSubspecialty}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        共 {getPartsBySystemAndSubspecialty(currentSystem.name, selectedSubspecialty).length} 个零部件
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {/* 临时禁用上传按钮进行调试 */}
                      {/* <UploadButton onPartCreated={(part) => {
                        saveParts([...parts, part]);
                      }} /> */}
                      <button
                        onClick={() => handleCreate(currentSystem.name, selectedSubspecialty)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        + 添加零部件
                      </button>
                    </div>
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
                            {filters.searchTerm ? '未找到匹配的零部件' : '暂无零部件'}
                          </p>
                          {filters.searchTerm ? (
                            <button
                              onClick={() => setFilters({...filters, searchTerm: ''})}
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
                                onClick={() => handleShare(part)}
                                className="flex-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                                title="生成分享链接"
                              >
                                分享
                              </button>
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
            </>
          )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
