import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parts as initialParts } from '../data/parts';
import { partSystems as initialSystems } from '../data/systems';
import { materials } from '../data/materials';
import InteriorDiagram from '../components/InteriorDiagram';
import LightsDiagram from '../components/LightsDiagram';
import LightingDiagram from '../components/LightingDiagram';
import SeatAssemblyDiagram from '../components/SeatAssemblyDiagram';
import BodyTrimDiagram from '../components/BodyTrimDiagram';
import SideDoorDiagram from '../components/SideDoorDiagram';
import SmartElectronicsDiagram from '../components/SmartElectronicsDiagram';
import MindMapDiagram from '../components/MindMapDiagram';
import AdvancedSearchFilter from '../components/AdvancedSearchFilter';
import { fuzzyMatch } from '../utils/searchUtils';
import {
  centerConsoleAssemblyData,
  doorPanelAssemblyData,
  type MindMapNode,
} from '../data/mindMapData';
import { interiorAssemblyData, type InteriorPart } from '../data/interiorAssembly';
import { lightingAssemblyData, type LightingPart } from '../data/lightingAssembly';
import { seatAssemblyData, type SeatPart } from '../data/seatAssembly';
import { bodyTrimAssemblyData, type BodyTrimPart } from '../data/bodyTrimAssembly';
import { sideDoorAssemblyData, type SideDoorPart } from '../data/sideDoorAssembly';

type Part = typeof initialParts[number];
type PartSystem = typeof initialSystems[number];

export default function PartsPage() {
  const navigate = useNavigate();
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
  const [selectedInteriorNode, setSelectedInteriorNode] = useState<string>(''); // 内饰树选中节点
  const [expandedInteriorL1, setExpandedInteriorL1] = useState<Set<string>>(new Set(['ia-01']));
  const [expandedInteriorL2, setExpandedInteriorL2] = useState<Set<string>>(new Set());
  const [selectedInteriorL1, setSelectedInteriorL1] = useState<string>('');
  const [selectedInteriorL2, setSelectedInteriorL2] = useState<string>('');
  const [selectedInteriorPart, setSelectedInteriorPart] = useState<InteriorPart | null>(null);
  const [interiorPartEdits, setInteriorPartEdits] = useState<Record<string, { material: string; process: string }>>({});
  const [editingInteriorPart, setEditingInteriorPart] = useState<InteriorPart | null>(null);
  const [editMaterial, setEditMaterial] = useState('');
  const [editProcess, setEditProcess] = useState('');

  // 灯具树状结构状态
  const [selectedLightingNode, setSelectedLightingNode] = useState<string>('');
  const [expandedLightingL1, setExpandedLightingL1] = useState<Set<string>>(new Set(['la-01']));
  const [expandedLightingL2, setExpandedLightingL2] = useState<Set<string>>(new Set());
  const [selectedLightingL1, setSelectedLightingL1] = useState<string>('');
  const [selectedLightingL2, setSelectedLightingL2] = useState<string>('');
  const [selectedLightingPart, setSelectedLightingPart] = useState<LightingPart | null>(null);
  const [lightingPartEdits, setLightingPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingLightingPart, setEditingLightingPart] = useState<LightingPart | null>(null);
  const [editLightingMaterial, setEditLightingMaterial] = useState('');
  const [editLightingProcess, setEditLightingProcess] = useState('');
  const [editLightingImage, setEditLightingImage] = useState<string>('');
  const [editLightingDescription, setEditLightingDescription] = useState('');
  const [editLightingFunction, setEditLightingFunction] = useState('');
  const [editLightingVehicleModels, setEditLightingVehicleModels] = useState<string[]>([]);
  const [newLightingVehicleModel, setNewLightingVehicleModel] = useState('');

  // 座椅树状结构状态
  const [selectedSeatNode, setSelectedSeatNode] = useState<string>('');
  const [expandedSeatL1, setExpandedSeatL1] = useState<Set<string>>(new Set(['sa-01']));
  const [expandedSeatL2, setExpandedSeatL2] = useState<Set<string>>(new Set());
  const [selectedSeatL1, setSelectedSeatL1] = useState<string>('');
  const [selectedSeatL2, setSelectedSeatL2] = useState<string>('');
  const [selectedSeatPart, setSelectedSeatPart] = useState<SeatPart | null>(null);
  const [seatPartEdits, setSeatPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingSeatPart, setEditingSeatPart] = useState<SeatPart | null>(null);
  const [editSeatMaterial, setEditSeatMaterial] = useState('');
  const [editSeatProcess, setEditSeatProcess] = useState('');
  const [editSeatImage, setEditSeatImage] = useState<string>('');
  const [editSeatDescription, setEditSeatDescription] = useState('');
  const [editSeatFunction, setEditSeatFunction] = useState('');
  const [editSeatVehicleModels, setEditSeatVehicleModels] = useState<string[]>([]);
  const [newSeatVehicleModel, setNewSeatVehicleModel] = useState('');

  // 车身外观及功能饰件树状结构状态
  const [selectedBodyTrimNode, setSelectedBodyTrimNode] = useState<string>('');
  const [expandedBodyTrimL1, setExpandedBodyTrimL1] = useState<Set<string>>(new Set(['bt-ext']));
  const [expandedBodyTrimL2, setExpandedBodyTrimL2] = useState<Set<string>>(new Set());
  const [selectedBodyTrimL1, setSelectedBodyTrimL1] = useState<string>('');
  const [selectedBodyTrimL2, setSelectedBodyTrimL2] = useState<string>('');
  const [selectedBodyTrimPart, setSelectedBodyTrimPart] = useState<BodyTrimPart | null>(null);
  const [bodyTrimPartEdits, setBodyTrimPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingBodyTrimPart, setEditingBodyTrimPart] = useState<BodyTrimPart | null>(null);
  const [editBodyTrimMaterial, setEditBodyTrimMaterial] = useState('');
  const [editBodyTrimProcess, setEditBodyTrimProcess] = useState('');
  const [editBodyTrimImage, setEditBodyTrimImage] = useState<string>('');
  const [editBodyTrimDescription, setEditBodyTrimDescription] = useState('');
  const [editBodyTrimFunction, setEditBodyTrimFunction] = useState('');
  const [editBodyTrimVehicleModels, setEditBodyTrimVehicleModels] = useState<string[]>([]);
  const [newBodyTrimVehicleModel, setNewBodyTrimVehicleModel] = useState('');

  // 侧门系统树状结构状态
  const [selectedSideDoorNode, setSelectedSideDoorNode] = useState<string>('');
  const [expandedSideDoorL1, setExpandedSideDoorL1] = useState<Set<string>>(new Set(['sd-01']));
  const [expandedSideDoorL2, setExpandedSideDoorL2] = useState<Set<string>>(new Set());
  const [selectedSideDoorL1, setSelectedSideDoorL1] = useState<string>('');
  const [selectedSideDoorL2, setSelectedSideDoorL2] = useState<string>('');
  const [selectedSideDoorPart, setSelectedSideDoorPart] = useState<SideDoorPart | null>(null);
  const [sideDoorPartEdits, setSideDoorPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingSideDoorPart, setEditingSideDoorPart] = useState<SideDoorPart | null>(null);
  const [editSideDoorMaterial, setEditSideDoorMaterial] = useState('');
  const [editSideDoorProcess, setEditSideDoorProcess] = useState('');
  const [editSideDoorImage, setEditSideDoorImage] = useState<string>('');
  const [editSideDoorDescription, setEditSideDoorDescription] = useState('');
  const [editSideDoorFunction, setEditSideDoorFunction] = useState('');
  const [editSideDoorVehicleModels, setEditSideDoorVehicleModels] = useState<string[]>([]);
  const [newSideDoorVehicleModel, setNewSideDoorVehicleModel] = useState('');

  const getMindMapData = (type: string): MindMapNode => {
    switch (type) {
      case '副仪表板总成':
        return centerConsoleAssemblyData;
      case '门板总成':
        return doorPanelAssemblyData;
      default:
        return centerConsoleAssemblyData;
    }
  };

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
    const CURRENT_VERSION = '4.2';

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

  // Load custom interior part edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('interiorPartEdits');
    if (saved) {
      setInteriorPartEdits(JSON.parse(saved));
    }
  }, []);

  // Load custom lighting part edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lightingPartEdits');
    if (saved) {
      setLightingPartEdits(JSON.parse(saved));
    }
  }, []);

  // Load custom seat part edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('seatPartEdits');
    if (saved) {
      setSeatPartEdits(JSON.parse(saved));
    }
  }, []);

  // Load custom body trim part edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bodyTrimPartEdits');
    if (saved) {
      setBodyTrimPartEdits(JSON.parse(saved));
    }
  }, []);

  // Load custom side door part edits from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sideDoorPartEdits');
    if (saved) {
      setSideDoorPartEdits(JSON.parse(saved));
    }
  }, []);

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

  // Helper functions for interior part material/process editing
  const getPartMaterial = (part: InteriorPart) => interiorPartEdits[part.id]?.material ?? part.material;
  const getPartProcess = (part: InteriorPart) => interiorPartEdits[part.id]?.process ?? part.process;

  // 灯具零件材料/工艺辅助函数
  const getLightingPartMaterial = (part: LightingPart) => lightingPartEdits[part.id]?.material ?? part.material;
  const getLightingPartProcess = (part: LightingPart) => lightingPartEdits[part.id]?.process ?? part.process;

  // 座椅零件材料/工艺辅助函数
  const getSeatPartMaterial = (part: SeatPart) => seatPartEdits[part.id]?.material ?? part.material;
  const getSeatPartProcess = (part: SeatPart) => seatPartEdits[part.id]?.process ?? part.process;

  // 车身饰件零件材料/工艺辅助函数
  const getBodyTrimPartMaterial = (part: BodyTrimPart) => bodyTrimPartEdits[part.id]?.material ?? part.material;
  const getBodyTrimPartProcess = (part: BodyTrimPart) => bodyTrimPartEdits[part.id]?.process ?? part.process;

  // 侧门零件材料/工艺辅助函数
  const getSideDoorPartMaterial = (part: SideDoorPart) => sideDoorPartEdits[part.id]?.material ?? part.material;
  const getSideDoorPartProcess = (part: SideDoorPart) => sideDoorPartEdits[part.id]?.process ?? part.process;


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

          {/* Subspecialty Tabs with Management (内饰、座椅、灯具、智能电器、副仪表板总成子系统不显示) */}
          {!(selectedSystem === 'sys-001' && ['内饰', '座椅', '灯具', '智能电器'].includes(selectedSubsystem)) && (
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
          {(selectedSubspecialty || (selectedSystem === 'sys-001' && selectedSubsystem)) && (
            <div>
              {/* 如果是座舱系统的子系统（内饰、座椅、灯具、智能电器），显示可视化示意图 */}
              {selectedSystem === 'sys-001' && selectedSubsystem === '内饰' ? (
                <div className="flex min-h-[500px]">
                  {/* 左侧树形导航 */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-3">
                      <div
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
                          selectedInteriorNode === ''
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedInteriorNode('');
                          setSelectedInteriorL1('');
                          setSelectedInteriorL2('');
                        }}
                      >
                        <span>🚗</span>
                        <span>内饰总成</span>
                      </div>
                      {interiorAssemblyData.map((assembly) => (
                        <div key={assembly.id} className="mb-1">
                          {/* Level 1: 总成 */}
                          <div
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                              selectedInteriorL1 === assembly.id && selectedInteriorL2 === ''
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setExpandedInteriorL1(prev => {
                                const next = new Set(prev);
                                if (next.has(assembly.id)) {
                                  next.delete(assembly.id);
                                } else {
                                  next.add(assembly.id);
                                }
                                return next;
                              });
                              setSelectedInteriorL1(assembly.id);
                              setSelectedInteriorL2('');
                              setSelectedInteriorNode(assembly.id);
                            }}
                          >
                            <span className="text-xs text-gray-400 w-3">
                              {expandedInteriorL1.has(assembly.id) ? '▼' : '▶'}
                            </span>
                            <span className="mr-1">{assembly.icon}</span>
                            <span className="font-semibold text-sm">{assembly.name}</span>
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                              {assembly.subAssemblies.length}个分总成
                            </span>
                          </div>
                          {/* Level 2: 分总成 */}
                          {expandedInteriorL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {assembly.subAssemblies.map((sub) => (
                                <div key={sub.id}>
                                  <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                                      selectedInteriorL2 === sub.id
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                      setExpandedInteriorL2(prev => {
                                        const next = new Set(prev);
                                        if (next.has(sub.id)) {
                                          next.delete(sub.id);
                                        } else {
                                          next.add(sub.id);
                                        }
                                        return next;
                                      });
                                      setSelectedInteriorL1(assembly.id);
                                      setSelectedInteriorL2(sub.id);
                                      setSelectedInteriorNode(sub.id);
                                    }}
                                  >
                                    <span className="text-xs text-gray-300 w-3">
                                      {expandedInteriorL2.has(sub.id) ? '▾' : '▸'}
                                    </span>
                                    <span className="text-xs text-gray-400">└</span>
                                    <span>{sub.name}</span>
                                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                      {sub.parts.length}个零件
                                    </span>
                                  </div>
                                  {/* Level 3: 单件 */}
                                  {expandedInteriorL2.has(sub.id) && sub.parts.length > 0 && (
                                    <div className="ml-6 mt-0.5 space-y-0.5">
                                      {sub.parts.map((part) => (
                                        <div
                                          key={part.id}
                                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-blue-50 cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedInteriorPart(part);
                                          }}
                                        >
                                          <span className="text-gray-300">•</span>
                                          <span className="truncate">{part.name}</span>
                                          <span className="ml-auto flex gap-1">
                                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getPartMaterial(part)}</span>
                                            <span className="bg-blue-50 text-blue-700 px-1 rounded text-[10px] leading-tight">{getPartProcess(part)}</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 右侧内容区 */}
                  <div className="flex-1 overflow-auto">
                    {selectedInteriorNode === '' ? (
                      /* 内饰总成概览 - 显示InteriorDiagram */
                      <div className="p-6">
                        <InteriorDiagram
                          parts={parts.filter(p =>
                            p.category === currentSystem!.name &&
                            p.subcategory?.startsWith('内饰')
                          )}
                          onPartClick={(part) => {
                            navigate(`/parts/${part.id}`);
                          }}
                          onPartEdit={(part) => {
                            handleEdit(part);
                          }}
                        />
                      </div>
                    ) : selectedInteriorL2 !== '' ? (
                      /* Level 2 selected: show parts table with material & process info */
                      (() => {
                        const assembly = interiorAssemblyData.find(a => a.id === selectedInteriorL1);
                        const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedInteriorL2);
                        if (!subAssembly) return null;
                        return (
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {assembly?.name} / {subAssembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                共 {subAssembly.parts.length} 个零件
                              </p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subAssembly.parts.map((part, index) => (
                                    <tr key={part.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedInteriorPart(part)}>
                                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getPartMaterial(part)}</span>
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getPartProcess(part)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    ) : selectedInteriorL1 !== '' ? (
                      /* Level 1 selected: show sub-assembly summary */
                      (() => {
                        const assembly = interiorAssemblyData.find(a => a.id === selectedInteriorL1);
                        if (!assembly) return null;
                        const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                        return (
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-xl font-semibold text-gray-900">
                                <span className="mr-2">{assembly.icon}</span>
                                {assembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {assembly.subAssemblies.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSelectedInteriorL2(sub.id);
                                    setSelectedInteriorNode(sub.id);
                                    setExpandedInteriorL2(prev => {
                                      const next = new Set(prev);
                                      next.add(sub.id);
                                      return next;
                                    });
                                  }}
                                >
                                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                                  <div className="space-y-1">
                                    {sub.parts.slice(0, 3).map((part) => (
                                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getPartMaterial(part)}</span>
                                      </div>
                                    ))}
                                    {sub.parts.length > 3 && (
                                      <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : null}
                    {/* Detail Modal for interior part */}
                    {selectedInteriorPart && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedInteriorPart(null); setEditingInteriorPart(null); }}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900">{selectedInteriorPart.name}</h2>
                              <button onClick={() => { setSelectedInteriorPart(null); setEditingInteriorPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>

                            {/* Image */}
                            <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4">
                              {selectedInteriorPart.imageUrl ? (
                                <img src={selectedInteriorPart.imageUrl} alt={selectedInteriorPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                              )}
                            </div>

                            {/* Info - Editing or Display */}
                            {editingInteriorPart?.id === selectedInteriorPart.id ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                                  <input type="text" value={editMaterial} onChange={e => setEditMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                                  <input type="text" value={editProcess} onChange={e => setEditProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button onClick={() => {
                                    const newEdits = { ...interiorPartEdits, [selectedInteriorPart.id]: { material: editMaterial, process: editProcess } };
                                    setInteriorPartEdits(newEdits);
                                    localStorage.setItem('interiorPartEdits', JSON.stringify(newEdits));
                                    setEditingInteriorPart(null);
                                    // Force re-render by updating selectedInteriorPart
                                    setSelectedInteriorPart({ ...selectedInteriorPart });
                                  }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
                                  <button onClick={() => setEditingInteriorPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型材料：</span>
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getPartMaterial(selectedInteriorPart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型工艺：</span>
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{getPartProcess(selectedInteriorPart)}</span>
                                </div>
                                {/* Show original data hint if edited */}
                                {(interiorPartEdits[selectedInteriorPart.id]) && (
                                  <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedInteriorPart.material} / {selectedInteriorPart.process}）</p>
                                )}
                                <button onClick={() => {
                                  setEditingInteriorPart(selectedInteriorPart);
                                  setEditMaterial(getPartMaterial(selectedInteriorPart));
                                  setEditProcess(getPartProcess(selectedInteriorPart));
                                }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">编辑材料信息</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '座椅' ? (
                <div className="flex min-h-[500px]">
                  {/* 左侧树形导航 */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-3">
                      <div
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
                          selectedSeatNode === ''
                            ? 'bg-amber-100 text-amber-700'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedSeatNode('');
                          setSelectedSeatL1('');
                          setSelectedSeatL2('');
                        }}
                      >
                        <span>🪑</span>
                        <span>座椅总成</span>
                      </div>
                      {seatAssemblyData.map((assembly) => (
                        <div key={assembly.id} className="mb-1">
                          {/* Level 1: 总成 */}
                          <div
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                              selectedSeatL1 === assembly.id && selectedSeatL2 === ''
                                ? 'bg-amber-100 text-amber-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setExpandedSeatL1(prev => {
                                const next = new Set(prev);
                                if (next.has(assembly.id)) next.delete(assembly.id);
                                else next.add(assembly.id);
                                return next;
                              });
                              setSelectedSeatL1(assembly.id);
                              setSelectedSeatL2('');
                              setSelectedSeatNode(assembly.id);
                            }}
                          >
                            <span className="text-xs text-gray-400 w-3">
                              {expandedSeatL1.has(assembly.id) ? '▼' : '▶'}
                            </span>
                            <span className="mr-1">{assembly.icon}</span>
                            <span className="font-semibold text-sm">{assembly.name}</span>
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                              {assembly.subAssemblies.length}个分总成
                            </span>
                          </div>
                          {/* Level 2: 分总成 */}
                          {expandedSeatL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {assembly.subAssemblies.map((sub) => (
                                <div key={sub.id}>
                                  <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                                      selectedSeatL2 === sub.id
                                        ? 'bg-amber-100 text-amber-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                      setExpandedSeatL2(prev => {
                                        const next = new Set(prev);
                                        if (next.has(sub.id)) next.delete(sub.id);
                                        else next.add(sub.id);
                                        return next;
                                      });
                                      setSelectedSeatL1(assembly.id);
                                      setSelectedSeatL2(sub.id);
                                      setSelectedSeatNode(sub.id);
                                    }}
                                  >
                                    <span className="text-xs text-gray-300 w-3">
                                      {expandedSeatL2.has(sub.id) ? '▾' : '▸'}
                                    </span>
                                    <span className="text-xs text-gray-400">└</span>
                                    <span>{sub.name}</span>
                                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                      {sub.parts.length}个零件
                                    </span>
                                  </div>
                                  {/* Level 3: 单件 */}
                                  {expandedSeatL2.has(sub.id) && sub.parts.length > 0 && (
                                    <div className="ml-6 mt-0.5 space-y-0.5">
                                      {sub.parts.map((part) => (
                                        <div
                                          key={part.id}
                                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-amber-50 cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSeatPart(part);
                                          }}
                                        >
                                          <span className="text-gray-300">•</span>
                                          <span className="truncate">{part.name}</span>
                                          <span className="ml-auto flex gap-1">
                                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getSeatPartMaterial(part)}</span>
                                            <span className="bg-amber-50 text-amber-700 px-1 rounded text-[10px] leading-tight">{getSeatPartProcess(part)}</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 右侧内容区 */}
                  <div className="flex-1 overflow-auto">
                    {/* Seat Diagram at top - always visible */}
                    <div className="p-4">
                      <SeatAssemblyDiagram
                        assemblies={seatAssemblyData}
                        selectedAssemblyId={selectedSeatL1}
                        selectedSubAssemblyId={selectedSeatL2}
                        onAssemblyClick={(assemblyId) => {
                          setSelectedSeatL1(assemblyId);
                          setSelectedSeatNode(assemblyId);
                          setExpandedSeatL1(prev => {
                            const next = new Set(prev);
                            next.add(assemblyId);
                            return next;
                          });
                        }}
                        onSubAssemblyClick={(subId) => {
                          const parent = seatAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
                          if (parent) {
                            setSelectedSeatL1(parent.id);
                            setSelectedSeatL2(subId);
                            setSelectedSeatNode(subId);
                            setExpandedSeatL2(prev => {
                              const next = new Set(prev);
                              next.add(subId);
                              return next;
                            });
                          }
                        }}
                        onPartClick={(part) => setSelectedSeatPart(part)}
                        selectedSeatPart={selectedSeatPart}
                      />
                    </div>

                    {/* Parts detail content below diagram */}
                    {selectedSeatNode === '' ? (
                      /* 座椅总成概览 */
                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🪑 全部座椅总成</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {seatAssemblyData.map((assembly) => {
                            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                            return (
                              <div
                                key={assembly.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedSeatL1(assembly.id);
                                  setSelectedSeatNode(assembly.id);
                                  setExpandedSeatL1(prev => {
                                    const next = new Set(prev);
                                    next.add(assembly.id);
                                    return next;
                                  });
                                }}
                              >
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                  <span className="mr-1">{assembly.icon}</span>
                                  {assembly.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                                <div className="space-y-1">
                                  {assembly.subAssemblies.slice(0, 2).map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600">
                                      <span className="text-gray-300">└</span>
                                      <span className="truncate flex-1">{sub.name}</span>
                                      <span className="text-gray-400">{sub.parts.length}件</span>
                                    </div>
                                  ))}
                                  {assembly.subAssemblies.length > 2 && (
                                    <p className="text-xs text-gray-400 ml-3">...还有 {assembly.subAssemblies.length - 2} 个分总成</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : selectedSeatL2 !== '' ? (
                      /* Level 2 selected: show parts table */
                      (() => {
                        const assembly = seatAssemblyData.find(a => a.id === selectedSeatL1);
                        const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedSeatL2);
                        if (!subAssembly) return null;
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assembly?.name} / {subAssembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">共 {subAssembly.parts.length} 个零件</p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subAssembly.parts.map((part, index) => (
                                    <tr key={part.id} className="hover:bg-amber-50 transition-colors cursor-pointer" onClick={() => setSelectedSeatPart(part)}>
                                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getSeatPartMaterial(part)}</span>
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-xs font-medium">{getSeatPartProcess(part)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    ) : selectedSeatL1 !== '' ? (
                      /* Level 1 selected: show sub-assembly summary */
                      (() => {
                        const assembly = seatAssemblyData.find(a => a.id === selectedSeatL1);
                        if (!assembly) return null;
                        const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">{assembly.icon}</span>
                                {assembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {assembly.subAssemblies.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSelectedSeatL2(sub.id);
                                    setSelectedSeatNode(sub.id);
                                    setExpandedSeatL2(prev => {
                                      const next = new Set(prev);
                                      next.add(sub.id);
                                      return next;
                                    });
                                  }}
                                >
                                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                                  <div className="space-y-1">
                                    {sub.parts.slice(0, 3).map((part) => (
                                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getSeatPartMaterial(part)}</span>
                                      </div>
                                    ))}
                                    {sub.parts.length > 3 && (
                                      <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : null}

                    {/* Detail Modal for seat part */}
                    {selectedSeatPart && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedSeatPart(null); setEditingSeatPart(null); }}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900">{selectedSeatPart.name}</h2>
                              <button onClick={() => { setSelectedSeatPart(null); setEditingSeatPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>

                            {/* Image / Schematic */}
                            <div className="w-full h-52 bg-amber-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                              {(() => {
                                const editImage = seatPartEdits[selectedSeatPart.id]?.imageUrl || selectedSeatPart.imageUrl;
                                return editImage ? (
                                  <img src={editImage} alt={selectedSeatPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                                ) : (
                                  <div className="text-center">
                                    <span className="text-4xl block mb-2">🪑</span>
                                    <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Description & Function */}
                            {(() => {
                              const editDesc = seatPartEdits[selectedSeatPart.id]?.description || selectedSeatPart.description;
                              const editFunc = seatPartEdits[selectedSeatPart.id]?.function || selectedSeatPart.function;
                              const editModels = seatPartEdits[selectedSeatPart.id]?.vehicleModels || selectedSeatPart.vehicleModels;
                              return (
                                <>
                                  {editDesc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4>
                                      <p className="text-sm text-gray-600">{editDesc}</p>
                                    </div>
                                  )}
                                  {editFunc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4>
                                      <p className="text-sm text-gray-600">{editFunc}</p>
                                    </div>
                                  )}
                                  {editModels && editModels.length > 0 && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">车型信息</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {editModels.map((model: string, i: number) => (
                                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{model}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}

                            {/* Info - Editing or Display */}
                            {editingSeatPart?.id === selectedSeatPart.id ? (
                              <div className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                                  <div className="flex flex-col gap-2">
                                    {editSeatImage && (
                                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={editSeatImage} alt="预览" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => setEditSeatImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                                      </div>
                                    )}
                                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-100">
                                      <span className="text-sm text-amber-600 font-medium">{editSeatImage ? '重新上传图片' : '点击上传图片'}</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setEditSeatImage(ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                      }} />
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                                  <textarea value={editSeatDescription} onChange={e => setEditSeatDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                                  <textarea value={editSeatFunction} onChange={e => setEditSeatFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                                  <input type="text" value={editSeatMaterial} onChange={e => setEditSeatMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                                  <input type="text" value={editSeatProcess} onChange={e => setEditSeatProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editSeatVehicleModels.map((model, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                                        {model}
                                        <button onClick={() => setEditSeatVehicleModels(prev => prev.filter((_, idx) => idx !== i))} className="text-amber-500 hover:text-amber-700">×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input type="text" value={newSeatVehicleModel} onChange={e => setNewSeatVehicleModel(e.target.value)} placeholder="输入车型名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500" />
                                    <button onClick={() => {
                                      if (newSeatVehicleModel.trim() && !editSeatVehicleModels.includes(newSeatVehicleModel.trim())) {
                                        setEditSeatVehicleModels(prev => [...prev, newSeatVehicleModel.trim()]);
                                        setNewSeatVehicleModel('');
                                      }
                                    }} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">添加</button>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button onClick={() => {
                                    const newEdits = {
                                      ...seatPartEdits,
                                      [selectedSeatPart.id]: {
                                        material: editSeatMaterial,
                                        process: editSeatProcess,
                                        imageUrl: editSeatImage || undefined,
                                        description: editSeatDescription || undefined,
                                        function: editSeatFunction || undefined,
                                        vehicleModels: editSeatVehicleModels.length > 0 ? editSeatVehicleModels : undefined,
                                      }
                                    };
                                    setSeatPartEdits(newEdits);
                                    localStorage.setItem('seatPartEdits', JSON.stringify(newEdits));
                                    setEditingSeatPart(null);
                                    setSelectedSeatPart({ ...selectedSeatPart });
                                  }} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">保存</button>
                                  <button onClick={() => setEditingSeatPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型材料：</span>
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getSeatPartMaterial(selectedSeatPart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型工艺：</span>
                                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-sm font-medium">{getSeatPartProcess(selectedSeatPart)}</span>
                                </div>
                                {(seatPartEdits[selectedSeatPart.id]) && (
                                  <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedSeatPart.material} / {selectedSeatPart.process}）</p>
                                )}
                                <div className="flex gap-2">
                                  <button onClick={() => {
                                    const existingEdit = seatPartEdits[selectedSeatPart.id] || {};
                                    setEditingSeatPart(selectedSeatPart);
                                    setEditSeatMaterial(getSeatPartMaterial(selectedSeatPart));
                                    setEditSeatProcess(getSeatPartProcess(selectedSeatPart));
                                    setEditSeatImage(existingEdit.imageUrl || selectedSeatPart.imageUrl || '');
                                    setEditSeatDescription(existingEdit.description || selectedSeatPart.description || '');
                                    setEditSeatFunction(existingEdit.function || selectedSeatPart.function || '');
                                    setEditSeatVehicleModels(existingEdit.vehicleModels || selectedSeatPart.vehicleModels || []);
                                  }} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 text-sm">编辑完整信息</button>
                                  <button
                                    onClick={() => navigate(`/seat-parts/${selectedSeatPart.id}`)}
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                                  >
                                    查看完整详情
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '灯具' ? (
                <div className="flex min-h-[500px]">
                  {/* 左侧树形导航 */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-3">
                      <div
                        className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
                          selectedLightingNode === ''
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-800 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setSelectedLightingNode('');
                          setSelectedLightingL1('');
                          setSelectedLightingL2('');
                        }}
                      >
                        <span>💡</span>
                        <span>灯具总成</span>
                      </div>
                      {lightingAssemblyData.map((assembly) => (
                        <div key={assembly.id} className="mb-1">
                          {/* Level 1: 总成 */}
                          <div
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                              selectedLightingL1 === assembly.id && selectedLightingL2 === ''
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setExpandedLightingL1(prev => {
                                const next = new Set(prev);
                                if (next.has(assembly.id)) {
                                  next.delete(assembly.id);
                                } else {
                                  next.add(assembly.id);
                                }
                                return next;
                              });
                              setSelectedLightingL1(assembly.id);
                              setSelectedLightingL2('');
                              setSelectedLightingNode(assembly.id);
                            }}
                          >
                            <span className="text-xs text-gray-400 w-3">
                              {expandedLightingL1.has(assembly.id) ? '▼' : '▶'}
                            </span>
                            <span className="mr-1">{assembly.icon}</span>
                            <span className="font-semibold text-sm">{assembly.name}</span>
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                              {assembly.subAssemblies.length}个分总成
                            </span>
                          </div>
                          {/* Level 2: 分总成 */}
                          {expandedLightingL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {assembly.subAssemblies.map((sub) => (
                                <div key={sub.id}>
                                  <div
                                    className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                                      selectedLightingL2 === sub.id
                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                    onClick={() => {
                                      setExpandedLightingL2(prev => {
                                        const next = new Set(prev);
                                        if (next.has(sub.id)) {
                                          next.delete(sub.id);
                                        } else {
                                          next.add(sub.id);
                                        }
                                        return next;
                                      });
                                      setSelectedLightingL1(assembly.id);
                                      setSelectedLightingL2(sub.id);
                                      setSelectedLightingNode(sub.id);
                                    }}
                                  >
                                    <span className="text-xs text-gray-300 w-3">
                                      {expandedLightingL2.has(sub.id) ? '▾' : '▸'}
                                    </span>
                                    <span className="text-xs text-gray-400">└</span>
                                    <span>{sub.name}</span>
                                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                      {sub.parts.length}个零件
                                    </span>
                                  </div>
                                  {/* Level 3: 单件 */}
                                  {expandedLightingL2.has(sub.id) && sub.parts.length > 0 && (
                                    <div className="ml-6 mt-0.5 space-y-0.5">
                                      {sub.parts.map((part) => (
                                        <div
                                          key={part.id}
                                          className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-blue-50 cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedLightingPart(part);
                                          }}
                                        >
                                          <span className="text-gray-300">•</span>
                                          <span className="truncate">{part.name}</span>
                                          <span className="ml-auto flex gap-1">
                                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getLightingPartMaterial(part)}</span>
                                            <span className="bg-blue-50 text-blue-700 px-1 rounded text-[10px] leading-tight">{getLightingPartProcess(part)}</span>
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 右侧内容区 */}
                  <div className="flex-1 overflow-auto">
                    {/* Lighting Diagram at top - always visible */}
                    <div className="p-4">
                      <LightingDiagram
                        assemblies={lightingAssemblyData}
                        selectedAssemblyId={selectedLightingL1}
                        selectedSubAssemblyId={selectedLightingL2}
                        onAssemblyClick={(assemblyId) => {
                          setSelectedLightingL1(assemblyId);
                          setSelectedLightingNode(assemblyId);
                          setExpandedLightingL1(prev => {
                            const next = new Set(prev);
                            next.add(assemblyId);
                            return next;
                          });
                        }}
                        onSubAssemblyClick={(subId) => {
                          const parent = lightingAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
                          if (parent) {
                            setSelectedLightingL1(parent.id);
                            setSelectedLightingL2(subId);
                            setSelectedLightingNode(subId);
                            setExpandedLightingL2(prev => {
                              const next = new Set(prev);
                              next.add(subId);
                              return next;
                            });
                          }
                        }}
                        onPartClick={(part) => setSelectedLightingPart(part)}
                        selectedLightingPart={selectedLightingPart}
                      />
                    </div>

                    {/* Parts detail content below diagram */}
                    {selectedLightingNode === '' ? (
                      /* 灯具总成概览 - 显示所有总成卡片 */
                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 全部灯具总成</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lightingAssemblyData.map((assembly) => {
                            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                            return (
                              <div
                                key={assembly.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedLightingL1(assembly.id);
                                  setSelectedLightingNode(assembly.id);
                                  setExpandedLightingL1(prev => {
                                    const next = new Set(prev);
                                    next.add(assembly.id);
                                    return next;
                                  });
                                }}
                              >
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                  <span className="mr-1">{assembly.icon}</span>
                                  {assembly.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                                <div className="space-y-1">
                                  {assembly.subAssemblies.slice(0, 2).map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600">
                                      <span className="text-gray-300">└</span>
                                      <span className="truncate flex-1">{sub.name}</span>
                                      <span className="text-gray-400">{sub.parts.length}件</span>
                                    </div>
                                  ))}
                                  {assembly.subAssemblies.length > 2 && (
                                    <p className="text-xs text-gray-400 ml-3">...还有 {assembly.subAssemblies.length - 2} 个分总成</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : selectedLightingL2 !== '' ? (
                      /* Level 2 selected: show parts table with material & process info */
                      (() => {
                        const assembly = lightingAssemblyData.find(a => a.id === selectedLightingL1);
                        const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedLightingL2);
                        if (!subAssembly) return null;
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assembly?.name} / {subAssembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                共 {subAssembly.parts.length} 个零件
                              </p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subAssembly.parts.map((part, index) => (
                                    <tr key={part.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedLightingPart(part)}>
                                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getLightingPartMaterial(part)}</span>
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getLightingPartProcess(part)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    ) : selectedLightingL1 !== '' ? (
                      /* Level 1 selected: show sub-assembly summary */
                      (() => {
                        const assembly = lightingAssemblyData.find(a => a.id === selectedLightingL1);
                        if (!assembly) return null;
                        const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">{assembly.icon}</span>
                                {assembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件
                              </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {assembly.subAssemblies.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSelectedLightingL2(sub.id);
                                    setSelectedLightingNode(sub.id);
                                    setExpandedLightingL2(prev => {
                                      const next = new Set(prev);
                                      next.add(sub.id);
                                      return next;
                                    });
                                  }}
                                >
                                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                                  <div className="space-y-1">
                                    {sub.parts.slice(0, 3).map((part) => (
                                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getLightingPartMaterial(part)}</span>
                                      </div>
                                    ))}
                                    {sub.parts.length > 3 && (
                                      <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : null}
                    {/* Detail Modal for lighting part - enhanced */}
                    {selectedLightingPart && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedLightingPart(null); setEditingLightingPart(null); }}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900">{selectedLightingPart.name}</h2>
                              <button onClick={() => { setSelectedLightingPart(null); setEditingLightingPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>

                            {/* Image / Schematic */}
                            <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                              {(() => {
                                const editImage = lightingPartEdits[selectedLightingPart.id]?.imageUrl || selectedLightingPart.imageUrl;
                                return editImage ? (
                                  <img src={editImage} alt={selectedLightingPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                                ) : (
                                  <div className="text-center">
                                    <span className="text-4xl block mb-2">🔧</span>
                                    <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Description & Function */}
                            {(() => {
                              const editDesc = lightingPartEdits[selectedLightingPart.id]?.description || selectedLightingPart.description;
                              const editFunc = lightingPartEdits[selectedLightingPart.id]?.function || selectedLightingPart.function;
                              const editModels = lightingPartEdits[selectedLightingPart.id]?.vehicleModels || selectedLightingPart.vehicleModels;
                              return (
                                <>
                                  {editDesc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4>
                                      <p className="text-sm text-gray-600">{editDesc}</p>
                                    </div>
                                  )}
                                  {editFunc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4>
                                      <p className="text-sm text-gray-600">{editFunc}</p>
                                    </div>
                                  )}
                                  {editModels && editModels.length > 0 && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">车型信息</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {editModels.map((model: string, i: number) => (
                                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{model}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}

                            {/* Info - Editing or Display */}
                            {editingLightingPart?.id === selectedLightingPart.id ? (
                              <div className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                                  <div className="flex flex-col gap-2">
                                    {editLightingImage && (
                                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={editLightingImage} alt="预览" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => setEditLightingImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                                      </div>
                                    )}
                                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                                      <span className="text-sm text-blue-600 font-medium">{editLightingImage ? '重新上传图片' : '点击上传图片'}</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setEditLightingImage(ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                      }} />
                                    </label>
                                  </div>
                                </div>
                                {/* Description */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                                  <textarea value={editLightingDescription} onChange={e => setEditLightingDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {/* Function */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                                  <textarea value={editLightingFunction} onChange={e => setEditLightingFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {/* Material */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                                  <input type="text" value={editLightingMaterial} onChange={e => setEditLightingMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {/* Process */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                                  <input type="text" value={editLightingProcess} onChange={e => setEditLightingProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                {/* Vehicle Models */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editLightingVehicleModels.map((model, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                                        {model}
                                        <button onClick={() => setEditLightingVehicleModels(prev => prev.filter((_, idx) => idx !== i))} className="text-amber-500 hover:text-amber-700">×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input type="text" value={newLightingVehicleModel} onChange={e => setNewLightingVehicleModel(e.target.value)} placeholder="输入车型名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                                    <button onClick={() => {
                                      if (newLightingVehicleModel.trim() && !editLightingVehicleModels.includes(newLightingVehicleModel.trim())) {
                                        setEditLightingVehicleModels(prev => [...prev, newLightingVehicleModel.trim()]);
                                        setNewLightingVehicleModel('');
                                      }
                                    }} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">添加</button>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button onClick={() => {
                                    const newEdits = {
                                      ...lightingPartEdits,
                                      [selectedLightingPart.id]: {
                                        material: editLightingMaterial,
                                        process: editLightingProcess,
                                        imageUrl: editLightingImage || undefined,
                                        description: editLightingDescription || undefined,
                                        function: editLightingFunction || undefined,
                                        vehicleModels: editLightingVehicleModels.length > 0 ? editLightingVehicleModels : undefined,
                                      }
                                    };
                                    setLightingPartEdits(newEdits);
                                    localStorage.setItem('lightingPartEdits', JSON.stringify(newEdits));
                                    setEditingLightingPart(null);
                                    setSelectedLightingPart({ ...selectedLightingPart });
                                  }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
                                  <button onClick={() => setEditingLightingPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型材料：</span>
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getLightingPartMaterial(selectedLightingPart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型工艺：</span>
                                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{getLightingPartProcess(selectedLightingPart)}</span>
                                </div>
                                {(lightingPartEdits[selectedLightingPart.id]) && (
                                  <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedLightingPart.material} / {selectedLightingPart.process}）</p>
                                )}
                                <div className="flex gap-2">
                                  <button onClick={() => {
                                    const existingEdit = lightingPartEdits[selectedLightingPart.id] || {};
                                    setEditingLightingPart(selectedLightingPart);
                                    setEditLightingMaterial(getLightingPartMaterial(selectedLightingPart));
                                    setEditLightingProcess(getLightingPartProcess(selectedLightingPart));
                                    setEditLightingImage(existingEdit.imageUrl || selectedLightingPart.imageUrl || '');
                                    setEditLightingDescription(existingEdit.description || selectedLightingPart.description || '');
                                    setEditLightingFunction(existingEdit.function || selectedLightingPart.function || '');
                                    setEditLightingVehicleModels(existingEdit.vehicleModels || selectedLightingPart.vehicleModels || []);
                                  }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">编辑完整信息</button>
                                  <button
                                    onClick={() => navigate(`/lighting-parts/${selectedLightingPart.id}`)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                                  >
                                    查看完整详情
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedSystem === 'sys-001' && selectedSubsystem === '智能电器' ? (
                <div className="p-6">
                  <SmartElectronicsDiagram
                    parts={parts.filter(p =>
                      p.category === currentSystem.name &&
                      p.subcategory?.startsWith('智能电器')
                    )}
                    onPartClick={(part) => {
                      navigate(`/parts/${part.id}`);
                    }}
                    onPartEdit={(part) => {
                      handleEdit(part);
                    }}
                  />
                </div>
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '外观及功能饰件' ? (
                <div className="flex min-h-[500px]">
                  {/* 左侧树形导航 */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">外观及功能饰件</h3>
                      <div className="space-y-0.5">
                        {bodyTrimAssemblyData.map((assembly) => (
                          <div key={assembly.id}>
                            <div
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                                selectedBodyTrimL1 === assembly.id
                                  ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setExpandedBodyTrimL1(prev => {
                                  const next = new Set(prev);
                                  if (next.has(assembly.id)) {
                                    next.delete(assembly.id);
                                  } else {
                                    next.add(assembly.id);
                                  }
                                  return next;
                                });
                                setSelectedBodyTrimL1(assembly.id);
                                setSelectedBodyTrimL2('');
                                setSelectedBodyTrimNode(assembly.id);
                              }}
                            >
                              <span className="text-xs text-gray-400 w-3">
                                {expandedBodyTrimL1.has(assembly.id) ? '▼' : '▶'}
                              </span>
                              <span className="mr-1">{assembly.icon}</span>
                              <span className="font-semibold text-sm">{assembly.name}</span>
                              <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                {assembly.subAssemblies.length}个分总成
                              </span>
                            </div>
                            {expandedBodyTrimL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                              <div className="ml-3 mt-0.5 space-y-0.5">
                                {assembly.subAssemblies.map((sub) => (
                                  <div key={sub.id}>
                                    <div
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                                        selectedBodyTrimL2 === sub.id
                                          ? 'bg-emerald-100 text-emerald-700 font-medium'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                      onClick={() => {
                                        setExpandedBodyTrimL2(prev => {
                                          const next = new Set(prev);
                                          if (next.has(sub.id)) {
                                            next.delete(sub.id);
                                          } else {
                                            next.add(sub.id);
                                          }
                                          return next;
                                        });
                                        setSelectedBodyTrimL1(assembly.id);
                                        setSelectedBodyTrimL2(sub.id);
                                        setSelectedBodyTrimNode(sub.id);
                                      }}
                                    >
                                      <span className="text-xs text-gray-300 w-3">
                                        {expandedBodyTrimL2.has(sub.id) ? '▾' : '▸'}
                                      </span>
                                      <span className="text-xs text-gray-400">└</span>
                                      <span>{sub.name}</span>
                                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                        {sub.parts.length}个零件
                                      </span>
                                    </div>
                                    {expandedBodyTrimL2.has(sub.id) && sub.parts.length > 0 && (
                                      <div className="ml-6 mt-0.5 space-y-0.5">
                                        {sub.parts.map((part) => (
                                          <div
                                            key={part.id}
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-emerald-50 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedBodyTrimPart(part);
                                            }}
                                          >
                                            <span className="text-gray-300">•</span>
                                            <span className="truncate">{part.name}</span>
                                            <span className="ml-auto flex gap-1">
                                              <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getBodyTrimPartMaterial(part)}</span>
                                              <span className="bg-purple-50 text-purple-700 px-1 rounded text-[10px] leading-tight">{getBodyTrimPartProcess(part)}</span>
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 右侧内容区 */}
                  <div className="flex-1 overflow-auto">
                    <div className="p-4">
                      <BodyTrimDiagram
                        assemblies={bodyTrimAssemblyData}
                        selectedAssemblyId={selectedBodyTrimL1}
                        selectedSubAssemblyId={selectedBodyTrimL2}
                        onAssemblyClick={(assemblyId) => {
                          setSelectedBodyTrimL1(assemblyId);
                          setSelectedBodyTrimNode(assemblyId);
                          setExpandedBodyTrimL1(prev => {
                            const next = new Set(prev);
                            next.add(assemblyId);
                            return next;
                          });
                        }}
                        onSubAssemblyClick={(subId) => {
                          const parent = bodyTrimAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
                          if (parent) {
                            setSelectedBodyTrimL1(parent.id);
                            setSelectedBodyTrimL2(subId);
                            setSelectedBodyTrimNode(subId);
                            setExpandedBodyTrimL2(prev => {
                              const next = new Set(prev);
                              next.add(subId);
                              return next;
                            });
                          }
                        }}
                        onPartClick={(part) => setSelectedBodyTrimPart(part)}
                        selectedBodyTrimPart={selectedBodyTrimPart}
                      />
                    </div>

                    {selectedBodyTrimNode === '' ? (
                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🚗 外观及功能饰件总成</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {bodyTrimAssemblyData.map((assembly) => {
                            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                            return (
                              <div
                                key={assembly.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedBodyTrimL1(assembly.id);
                                  setSelectedBodyTrimNode(assembly.id);
                                  setExpandedBodyTrimL1(prev => {
                                    const next = new Set(prev);
                                    next.add(assembly.id);
                                    return next;
                                  });
                                }}
                              >
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                  <span className="mr-1">{assembly.icon}</span>
                                  {assembly.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                                <div className="space-y-1">
                                  {assembly.subAssemblies.slice(0, 2).map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600">
                                      <span className="text-gray-300">└</span>
                                      <span className="truncate flex-1">{sub.name}</span>
                                      <span className="text-gray-400">{sub.parts.length}件</span>
                                    </div>
                                  ))}
                                  {assembly.subAssemblies.length > 2 && (
                                    <p className="text-xs text-gray-400 ml-3">...还有 {assembly.subAssemblies.length - 2} 个分总成</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : selectedBodyTrimL2 !== '' ? (
                      (() => {
                        const assembly = bodyTrimAssemblyData.find(a => a.id === selectedBodyTrimL1);
                        const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedBodyTrimL2);
                        if (!subAssembly) return null;
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assembly?.name} / {subAssembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">共 {subAssembly.parts.length} 个零件</p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subAssembly.parts.map((part, index) => (
                                    <tr key={part.id} className="hover:bg-emerald-50 transition-colors cursor-pointer" onClick={() => setSelectedBodyTrimPart(part)}>
                                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getBodyTrimPartMaterial(part)}</span>
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{getBodyTrimPartProcess(part)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    ) : selectedBodyTrimL1 !== '' ? (
                      (() => {
                        const assembly = bodyTrimAssemblyData.find(a => a.id === selectedBodyTrimL1);
                        if (!assembly) return null;
                        const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">{assembly.icon}</span>
                                {assembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {assembly.subAssemblies.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSelectedBodyTrimL2(sub.id);
                                    setSelectedBodyTrimNode(sub.id);
                                    setExpandedBodyTrimL2(prev => {
                                      const next = new Set(prev);
                                      next.add(sub.id);
                                      return next;
                                    });
                                  }}
                                >
                                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                                  <div className="space-y-1">
                                    {sub.parts.slice(0, 3).map((part) => (
                                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getBodyTrimPartMaterial(part)}</span>
                                      </div>
                                    ))}
                                    {sub.parts.length > 3 && (
                                      <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : null}

                    {/* Detail Modal for body trim part */}
                    {selectedBodyTrimPart && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedBodyTrimPart(null); setEditingBodyTrimPart(null); }}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900">{selectedBodyTrimPart.name}</h2>
                              <button onClick={() => { setSelectedBodyTrimPart(null); setEditingBodyTrimPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>
                            <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                              {(() => {
                                const editImage = bodyTrimPartEdits[selectedBodyTrimPart.id]?.imageUrl || selectedBodyTrimPart.imageUrl;
                                return editImage ? (
                                  <img src={editImage} alt={selectedBodyTrimPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ) : (
                                  <div className="text-center">
                                    <span className="text-4xl block mb-2">🚗</span>
                                    <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                                  </div>
                                );
                              })()}
                            </div>
                            {(() => {
                              const editDesc = bodyTrimPartEdits[selectedBodyTrimPart.id]?.description || selectedBodyTrimPart.description;
                              const editFunc = bodyTrimPartEdits[selectedBodyTrimPart.id]?.function || selectedBodyTrimPart.function;
                              const editModels = bodyTrimPartEdits[selectedBodyTrimPart.id]?.vehicleModels || selectedBodyTrimPart.vehicleModels;
                              return (
                                <>
                                  {editDesc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4>
                                      <p className="text-sm text-gray-600">{editDesc}</p>
                                    </div>
                                  )}
                                  {editFunc && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4>
                                      <p className="text-sm text-gray-600">{editFunc}</p>
                                    </div>
                                  )}
                                  {editModels && editModels.length > 0 && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">车型信息</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {editModels.map((model: string, i: number) => (
                                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{model}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            {editingBodyTrimPart?.id === selectedBodyTrimPart.id ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                                  <div className="flex flex-col gap-2">
                                    {editBodyTrimImage && (
                                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={editBodyTrimImage} alt="预览" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => setEditBodyTrimImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                                      </div>
                                    )}
                                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:bg-emerald-100">
                                      <span className="text-sm text-emerald-600 font-medium">{editBodyTrimImage ? '重新上传图片' : '点击上传图片'}</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setEditBodyTrimImage(ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                      }} />
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                                  <textarea value={editBodyTrimDescription} onChange={e => setEditBodyTrimDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                                  <textarea value={editBodyTrimFunction} onChange={e => setEditBodyTrimFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                                  <input type="text" value={editBodyTrimMaterial} onChange={e => setEditBodyTrimMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                                  <input type="text" value={editBodyTrimProcess} onChange={e => setEditBodyTrimProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editBodyTrimVehicleModels.map((model, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium flex items-center gap-1">
                                        {model}
                                        <button type="button" onClick={() => setEditBodyTrimVehicleModels(prev => prev.filter((_, j) => j !== i))} className="text-amber-500 hover:text-red-500 ml-1">×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input type="text" value={newBodyTrimVehicleModel} onChange={e => setNewBodyTrimVehicleModel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newBodyTrimVehicleModel.trim()) { setEditBodyTrimVehicleModels(prev => [...prev, newBodyTrimVehicleModel.trim()]); setNewBodyTrimVehicleModel(''); } }} placeholder="输入车型后按回车" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                                    <button type="button" onClick={() => { if (newBodyTrimVehicleModel.trim()) { setEditBodyTrimVehicleModels(prev => [...prev, newBodyTrimVehicleModel.trim()]); setNewBodyTrimVehicleModel(''); } }} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-sm">添加</button>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button onClick={() => {
                                    const newEdits = { ...bodyTrimPartEdits, [selectedBodyTrimPart.id]: { material: editBodyTrimMaterial, process: editBodyTrimProcess, imageUrl: editBodyTrimImage, description: editBodyTrimDescription, function: editBodyTrimFunction, vehicleModels: editBodyTrimVehicleModels } };
                                    setBodyTrimPartEdits(newEdits);
                                    localStorage.setItem('bodyTrimPartEdits', JSON.stringify(newEdits));
                                    setEditingBodyTrimPart(null);
                                    setSelectedBodyTrimPart({ ...selectedBodyTrimPart });
                                  }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">保存</button>
                                  <button onClick={() => setEditingBodyTrimPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型材料：</span>
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getBodyTrimPartMaterial(selectedBodyTrimPart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型工艺：</span>
                                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-sm font-medium">{getBodyTrimPartProcess(selectedBodyTrimPart)}</span>
                                </div>
                                {bodyTrimPartEdits[selectedBodyTrimPart.id] && (
                                  <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedBodyTrimPart.material} / {selectedBodyTrimPart.process}）</p>
                                )}
                                <div className="flex gap-2">
                                  <button onClick={() => {
                                    const existingEdit = bodyTrimPartEdits[selectedBodyTrimPart.id] || {};
                                    setEditingBodyTrimPart(selectedBodyTrimPart);
                                    setEditBodyTrimMaterial(getBodyTrimPartMaterial(selectedBodyTrimPart));
                                    setEditBodyTrimProcess(getBodyTrimPartProcess(selectedBodyTrimPart));
                                    setEditBodyTrimImage(existingEdit.imageUrl || selectedBodyTrimPart.imageUrl || '');
                                    setEditBodyTrimDescription(existingEdit.description || selectedBodyTrimPart.description || '');
                                    setEditBodyTrimFunction(existingEdit.function || selectedBodyTrimPart.function || '');
                                    setEditBodyTrimVehicleModels(existingEdit.vehicleModels || selectedBodyTrimPart.vehicleModels || []);
                                  }} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-sm">编辑完整信息</button>
                                  <button
                                    onClick={() => navigate(`/body-trim-parts/${selectedBodyTrimPart.id}`)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                                  >
                                    查看完整详情
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : selectedSystem === 'sys-002' && selectedSubspecialty === '侧门系统' ? (
                /* ══════════ 侧门系统 ══════════ */
                <div className="flex min-h-[500px]">
                  {/* 左侧树形导航 */}
                  <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">侧门系统</h3>
                      <div className="space-y-0.5">
                        {sideDoorAssemblyData.map((assembly) => (
                          <div key={assembly.id}>
                            <div
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                                selectedSideDoorL1 === assembly.id
                                  ? 'bg-sky-100 text-sky-800 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setExpandedSideDoorL1(prev => {
                                  const next = new Set(prev);
                                  next.has(assembly.id) ? next.delete(assembly.id) : next.add(assembly.id);
                                  return next;
                                });
                                setSelectedSideDoorL1(assembly.id);
                                setSelectedSideDoorL2('');
                                setSelectedSideDoorNode(assembly.id);
                              }}
                            >
                              <span className="text-xs text-gray-400 w-3">
                                {expandedSideDoorL1.has(assembly.id) ? '▼' : '▶'}
                              </span>
                              <span className="mr-1">{assembly.icon}</span>
                              <span className="font-semibold text-sm">{assembly.name}</span>
                              <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                {assembly.subAssemblies.length}个分总成
                              </span>
                            </div>
                            {expandedSideDoorL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                              <div className="ml-3 mt-0.5 space-y-0.5">
                                {assembly.subAssemblies.map((sub) => (
                                  <div key={sub.id}>
                                    <div
                                      className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                                        selectedSideDoorL2 === sub.id
                                          ? 'bg-sky-100 text-sky-700 font-medium'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                      onClick={() => {
                                        setExpandedSideDoorL2(prev => {
                                          const next = new Set(prev);
                                          next.has(sub.id) ? next.delete(sub.id) : next.add(sub.id);
                                          return next;
                                        });
                                        setSelectedSideDoorL1(assembly.id);
                                        setSelectedSideDoorL2(sub.id);
                                        setSelectedSideDoorNode(sub.id);
                                      }}
                                    >
                                      <span className="text-xs text-gray-300 w-3">
                                        {expandedSideDoorL2.has(sub.id) ? '▾' : '▸'}
                                      </span>
                                      <span className="text-xs text-gray-400">└</span>
                                      <span>{sub.name}</span>
                                      <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                                        {sub.parts.length}个零件
                                      </span>
                                    </div>
                                    {expandedSideDoorL2.has(sub.id) && sub.parts.length > 0 && (
                                      <div className="ml-6 mt-0.5 space-y-0.5">
                                        {sub.parts.map((part) => (
                                          <div
                                            key={part.id}
                                            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-sky-50 cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedSideDoorPart(part);
                                            }}
                                          >
                                            <span className="text-gray-300">•</span>
                                            <span className="truncate">{part.name}</span>
                                            <span className="ml-auto flex gap-1">
                                              <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getSideDoorPartMaterial(part)}</span>
                                              <span className="bg-purple-50 text-purple-700 px-1 rounded text-[10px] leading-tight">{getSideDoorPartProcess(part)}</span>
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 右侧内容区 */}
                  <div className="flex-1 overflow-auto">
                    <div className="p-4">
                      <SideDoorDiagram
                        assemblies={sideDoorAssemblyData}
                        selectedAssemblyId={selectedSideDoorL1}
                        selectedSubAssemblyId={selectedSideDoorL2}
                        onAssemblyClick={(assemblyId) => {
                          setSelectedSideDoorL1(assemblyId);
                          setSelectedSideDoorNode(assemblyId);
                          setExpandedSideDoorL1(prev => {
                            const next = new Set(prev);
                            next.add(assemblyId);
                            return next;
                          });
                        }}
                        onSubAssemblyClick={(subId) => {
                          const parent = sideDoorAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
                          if (parent) {
                            setSelectedSideDoorL1(parent.id);
                            setSelectedSideDoorL2(subId);
                            setSelectedSideDoorNode(subId);
                            setExpandedSideDoorL2(prev => {
                              const next = new Set(prev);
                              next.add(subId);
                              return next;
                            });
                          }
                        }}
                        onPartClick={(part) => setSelectedSideDoorPart(part)}
                        selectedSideDoorPart={selectedSideDoorPart}
                      />
                    </div>

                    {selectedSideDoorNode === '' ? (
                      <div className="px-4 pb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">🚗 侧门系统总成</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sideDoorAssemblyData.map((assembly) => {
                            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                            return (
                              <div
                                key={assembly.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                  setSelectedSideDoorL1(assembly.id);
                                  setSelectedSideDoorNode(assembly.id);
                                  setExpandedSideDoorL1(prev => { const next = new Set(prev); next.add(assembly.id); return next; });
                                }}
                              >
                                <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                  <span className="mr-1">{assembly.icon}</span>{assembly.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                                <div className="space-y-1">
                                  {assembly.subAssemblies.slice(0, 2).map((sub) => (
                                    <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600">
                                      <span className="text-gray-300">└</span>
                                      <span className="truncate flex-1">{sub.name}</span>
                                      <span className="text-gray-400">{sub.parts.length}件</span>
                                    </div>
                                  ))}
                                  {assembly.subAssemblies.length > 2 && (
                                    <p className="text-xs text-gray-400 ml-3">...还有 {assembly.subAssemblies.length - 2} 个分总成</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : selectedSideDoorL2 !== '' ? (
                      (() => {
                        const assembly = sideDoorAssemblyData.find(a => a.id === selectedSideDoorL1);
                        const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedSideDoorL2);
                        if (!subAssembly) return null;
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assembly?.name} / {subAssembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">共 {subAssembly.parts.length} 个零件</p>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {subAssembly.parts.map((part, index) => (
                                    <tr key={part.id} className="hover:bg-sky-50 transition-colors cursor-pointer" onClick={() => setSelectedSideDoorPart(part)}>
                                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getSideDoorPartMaterial(part)}</span>
                                      </td>
                                      <td className="px-4 py-3 text-sm">
                                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{getSideDoorPartProcess(part)}</span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()
                    ) : selectedSideDoorL1 !== '' ? (
                      (() => {
                        const assembly = sideDoorAssemblyData.find(a => a.id === selectedSideDoorL1);
                        if (!assembly) return null;
                        const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                        return (
                          <div className="px-4 pb-4">
                            <div className="mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                <span className="mr-2">{assembly.icon}</span>{assembly.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {assembly.subAssemblies.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => {
                                    setSelectedSideDoorL2(sub.id);
                                    setSelectedSideDoorNode(sub.id);
                                    setExpandedSideDoorL2(prev => { const next = new Set(prev); next.add(sub.id); return next; });
                                  }}
                                >
                                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                                  <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                                  <div className="space-y-1">
                                    {sub.parts.slice(0, 3).map((part) => (
                                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                                        <span className="text-gray-300">•</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getSideDoorPartMaterial(part)}</span>
                                      </div>
                                    ))}
                                    {sub.parts.length > 3 && (
                                      <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()
                    ) : null}

                    {/* Detail Modal for side door part */}
                    {selectedSideDoorPart && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedSideDoorPart(null); setEditingSideDoorPart(null); }}>
                        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h2 className="text-xl font-bold text-gray-900">{selectedSideDoorPart.name}</h2>
                              <button onClick={() => { setSelectedSideDoorPart(null); setEditingSideDoorPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                            </div>
                            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                              {(() => {
                                const editImage = sideDoorPartEdits[selectedSideDoorPart.id]?.imageUrl || selectedSideDoorPart.imageUrl;
                                return editImage ? (
                                  <img src={editImage} alt={selectedSideDoorPart.name} className="w-full h-full object-contain" />
                                ) : (
                                  <div className="text-center">
                                    <span className="text-4xl block mb-2">🚪</span>
                                    <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                                  </div>
                                );
                              })()}
                            </div>
                            {(() => {
                              const editDesc = sideDoorPartEdits[selectedSideDoorPart.id]?.description || selectedSideDoorPart.description;
                              const editFunc = sideDoorPartEdits[selectedSideDoorPart.id]?.function || selectedSideDoorPart.function;
                              const editModels = sideDoorPartEdits[selectedSideDoorPart.id]?.vehicleModels || selectedSideDoorPart.vehicleModels;
                              return (
                                <>
                                  {editDesc && <div className="mb-3"><h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4><p className="text-sm text-gray-600">{editDesc}</p></div>}
                                  {editFunc && <div className="mb-3"><h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4><p className="text-sm text-gray-600">{editFunc}</p></div>}
                                  {editModels && editModels.length > 0 && (
                                    <div className="mb-3">
                                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">车型信息</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {editModels.map((model: string, i: number) => (
                                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{model}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                            {editingSideDoorPart?.id === selectedSideDoorPart.id ? (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                                  <div className="flex flex-col gap-2">
                                    {editSideDoorImage && (
                                      <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={editSideDoorImage} alt="预览" className="w-full h-full object-contain" />
                                        <button type="button" onClick={() => setEditSideDoorImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                                      </div>
                                    )}
                                    <label className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg cursor-pointer hover:bg-sky-100">
                                      <span className="text-sm text-sky-600 font-medium">{editSideDoorImage ? '重新上传图片' : '点击上传图片'}</span>
                                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setEditSideDoorImage(ev.target?.result as string);
                                        reader.readAsDataURL(file);
                                      }} />
                                    </label>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                                  <textarea value={editSideDoorDescription} onChange={e => setEditSideDoorDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                                  <textarea value={editSideDoorFunction} onChange={e => setEditSideDoorFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                                  <input type="text" value={editSideDoorMaterial} onChange={e => setEditSideDoorMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                                  <input type="text" value={editSideDoorProcess} onChange={e => setEditSideDoorProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {editSideDoorVehicleModels.map((model, i) => (
                                      <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium flex items-center gap-1">
                                        {model}
                                        <button type="button" onClick={() => setEditSideDoorVehicleModels(prev => prev.filter((_, j) => j !== i))} className="text-amber-500 hover:text-red-500 ml-1">×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <input type="text" value={newSideDoorVehicleModel} onChange={e => setNewSideDoorVehicleModel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newSideDoorVehicleModel.trim()) { setEditSideDoorVehicleModels(prev => [...prev, newSideDoorVehicleModel.trim()]); setNewSideDoorVehicleModel(''); } }} placeholder="输入车型后按回车" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm" />
                                    <button type="button" onClick={() => { if (newSideDoorVehicleModel.trim()) { setEditSideDoorVehicleModels(prev => [...prev, newSideDoorVehicleModel.trim()]); setNewSideDoorVehicleModel(''); } }} className="px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 text-sm">添加</button>
                                  </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                  <button onClick={() => {
                                    const newEdits = { ...sideDoorPartEdits, [selectedSideDoorPart.id]: { material: editSideDoorMaterial, process: editSideDoorProcess, imageUrl: editSideDoorImage, description: editSideDoorDescription, function: editSideDoorFunction, vehicleModels: editSideDoorVehicleModels } };
                                    setSideDoorPartEdits(newEdits);
                                    localStorage.setItem('sideDoorPartEdits', JSON.stringify(newEdits));
                                    setEditingSideDoorPart(null);
                                    setSelectedSideDoorPart({ ...selectedSideDoorPart });
                                  }} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">保存</button>
                                  <button onClick={() => setEditingSideDoorPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型材料：</span>
                                  <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getSideDoorPartMaterial(selectedSideDoorPart)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">典型工艺：</span>
                                  <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-sm font-medium">{getSideDoorPartProcess(selectedSideDoorPart)}</span>
                                </div>
                                {sideDoorPartEdits[selectedSideDoorPart.id] && (
                                  <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedSideDoorPart.material} / {selectedSideDoorPart.process}）</p>
                                )}
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() => {
                                      setEditingSideDoorPart(selectedSideDoorPart);
                                      setEditSideDoorMaterial(getSideDoorPartMaterial(selectedSideDoorPart));
                                      setEditSideDoorProcess(getSideDoorPartProcess(selectedSideDoorPart));
                                      setEditSideDoorImage(sideDoorPartEdits[selectedSideDoorPart.id]?.imageUrl || selectedSideDoorPart.imageUrl || '');
                                      setEditSideDoorDescription(sideDoorPartEdits[selectedSideDoorPart.id]?.description || selectedSideDoorPart.description || '');
                                      setEditSideDoorFunction(sideDoorPartEdits[selectedSideDoorPart.id]?.function || selectedSideDoorPart.function || '');
                                      setEditSideDoorVehicleModels(sideDoorPartEdits[selectedSideDoorPart.id]?.vehicleModels || selectedSideDoorPart.vehicleModels || []);
                                    }}
                                    className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
                                  >
                                    编辑信息
                                  </button>
                                  {sideDoorPartEdits[selectedSideDoorPart.id] && (
                                    <button
                                      onClick={() => {
                                        const newEdits = { ...sideDoorPartEdits };
                                        delete newEdits[selectedSideDoorPart.id];
                                        setSideDoorPartEdits(newEdits);
                                        localStorage.setItem('sideDoorPartEdits', JSON.stringify(newEdits));
                                        setSelectedSideDoorPart({ ...selectedSideDoorPart });
                                      }}
                                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                                    >
                                      恢复原始
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
