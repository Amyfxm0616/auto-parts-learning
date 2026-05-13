import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { materials as initialMaterials } from '../data/materials';
import EnhancedRubberMaterialView from '../components/rubber/EnhancedRubberMaterialView';
import EnhancedPlasticMaterialView from '../components/plastic/EnhancedPlasticMaterialView';
import EnhancedCompositeView from '../components/composite/EnhancedCompositeView';
import EnhancedElastomerView from '../components/elastomer/EnhancedElastomerView';
import EnhancedOtherMaterialView from '../components/other/EnhancedOtherMaterialView';

type Material = typeof initialMaterials[number];

interface PyramidLevel {
  name: string;
  temperature: string;
  color: string;
  category: 'specialty' | 'engineering' | 'general';
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedTab, setSelectedTab] = useState<'plastic' | 'rubber' | 'elastomer' | 'composite' | 'other'>('plastic');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCrystallinity, setSelectedCrystallinity] = useState<'crystalline' | 'amorphous' | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<'pyramid' | 'table'>('table'); // 塑料视图模式
  const [isAdminMode, setIsAdminMode] = useState(false); // 管理员编辑模式

  // 可编辑的标题
  const [pyramidTitle, setPyramidTitle] = useState(() => {
    const saved = localStorage.getItem('pyramidTitle');
    return saved || '材料金字塔';
  });

  const [temperatureLabels, setTemperatureLabels] = useState(() => {
    const saved = localStorage.getItem('temperatureLabels');
    return saved ? JSON.parse(saved) : {
      specialty: '特种工程塑料',
      engineering: '工程塑料',
      general: '通用塑料',
    };
  });

  // 金字塔布局配置
  const [pyramidConfig, setPyramidConfig] = useState(() => {
    const saved = localStorage.getItem('pyramidConfig');
    return saved ? JSON.parse(saved) : {
      centerX: 400,
      topY: 100,
      layer1Y: 280,
      layer2Y: 440,
      baseY: 580,
      topWidth: 400,
      baseWidth: 660,
    };
  });

  // 保存金字塔配置
  useEffect(() => {
    localStorage.setItem('pyramidConfig', JSON.stringify(pyramidConfig));
  }, [pyramidConfig]);

  // 保存可编辑的标题和标签
  useEffect(() => {
    localStorage.setItem('pyramidTitle', pyramidTitle);
  }, [pyramidTitle]);

  useEffect(() => {
    localStorage.setItem('temperatureLabels', JSON.stringify(temperatureLabels));
  }, [temperatureLabels]);

  // 加载材料数据
  useEffect(() => {
    const savedMaterials = localStorage.getItem('customMaterials');
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    } else {
      setMaterials(initialMaterials);
    }
  }, []);

  const saveMaterials = (newMaterials: Material[]) => {
    setMaterials(newMaterials);
    localStorage.setItem('customMaterials', JSON.stringify(newMaterials));
  };

  const levels: PyramidLevel[] = [
    { name: temperatureLabels.specialty, temperature: '≥ 200°C', color: '#dc2626', category: 'specialty' },
    { name: temperatureLabels.engineering, temperature: '150-200°C', color: '#ea580c', category: 'engineering' },
    { name: temperatureLabels.general, temperature: '< 150°C', color: '#ca8a04', category: 'general' },
  ];

  // 只显示塑料类别
  const plasticMaterials = materials.filter(m => m.category === 'plastic');

  // 按类别和结晶性分类材料（使用level和crystallinity属性）
  const categorizedMaterials = {
    specialty: {
      crystalline: plasticMaterials.filter(m => m.level === 'specialty' && m.crystallinity === 'crystalline'),
      amorphous: plasticMaterials.filter(m => m.level === 'specialty' && m.crystallinity === 'amorphous'),
    },
    engineering: {
      crystalline: plasticMaterials.filter(m => m.level === 'engineering' && m.crystallinity === 'crystalline'),
      amorphous: plasticMaterials.filter(m => m.level === 'engineering' && m.crystallinity === 'amorphous'),
    },
    general: {
      crystalline: plasticMaterials.filter(m => m.level === 'general' && m.crystallinity === 'crystalline'),
      amorphous: plasticMaterials.filter(m => m.level === 'general' && m.crystallinity === 'amorphous'),
    },
  };

  // 兼容旧数据：为没有level或crystallinity属性的材料设置默认值
  plasticMaterials.forEach(m => {
    if (!m.level || !m.crystallinity) {
      const props = m.properties as { [key: string]: any } | string[] | undefined;

      // 扩展属性为数组格式方便检查
      let propsArray: string[] = [];
      if (Array.isArray(props)) {
        propsArray = props;
      } else if (typeof props === 'object' && props !== null) {
        propsArray = Object.values(props).filter(Boolean);
      }

      // 推断level
      if (!m.level) {
        if (propsArray.some(p => typeof p === 'string' && (p.includes('耐高温') || p.includes('200') || p.includes('特种')))) {
          m.level = 'specialty';
        } else if (propsArray.some(p => typeof p === 'string' && p.includes('工程'))) {
          m.level = 'engineering';
        } else if (['PP', 'PE', 'PS', 'PVC', '聚丙烯', '聚乙烯', '聚苯乙烯', '聚氯乙烯'].some(name => m.name.includes(name))) {
          m.level = 'general';
        } else if (['PA', 'POM', 'PBT', 'PC', 'ABS'].some(name => m.name.includes(name))) {
          m.level = 'engineering';
        } else if (!m.level) {
          m.level = 'general'; // 默认
        }
      }

      // 推断crystallinity
      if (!m.crystallinity) {
        if (propsArray.some(p => typeof p === 'string' && (p.includes('非结晶') || p.includes('无定形')))) {
          m.crystallinity = 'amorphous';
        } else if (propsArray.some(p => typeof p === 'string' && p.includes('结晶'))) {
          m.crystallinity = 'crystalline';
        } else if (['PC', 'ABS', 'PS', 'PVC'].some(name => m.name.includes(name))) {
          m.crystallinity = 'amorphous';
        } else if (['PA', 'POM', 'PBT', 'PP', 'PE'].some(name => m.name.includes(name))) {
          m.crystallinity = 'crystalline';
        } else if (!m.crystallinity) {
          m.crystallinity = 'crystalline'; // 默认
        }
      }

      // 更新到localStorage
      const savedMaterials = localStorage.getItem('customMaterials');
      if (savedMaterials) {
        const allMaterials = JSON.parse(savedMaterials);
        const updated = allMaterials.map((mat: Material) => mat.id === m.id ? m : mat);
        localStorage.setItem('customMaterials', JSON.stringify(updated));
      }
    }
  });

  const getFilteredMaterials = () => {
    if (!selectedLevel || !selectedCrystallinity) return [];
    const levelMaterials = categorizedMaterials[selectedLevel as keyof typeof categorizedMaterials];
    return levelMaterials[selectedCrystallinity] || [];
  };

  // 计算某个区域的可用显示空间和材料位置
  const calculateMaterialPositions = (
    level: 'specialty' | 'engineering' | 'general',
    crystallinity: 'crystalline' | 'amorphous'
  ) => {
    const materials = categorizedMaterials[level]?.[crystallinity] || [];

    let startY, endY, regionWidth;
    const isLeft = crystallinity === 'amorphous';

    if (level === 'specialty') {
      startY = topY;
      endY = layer1Y;
      regionWidth = layer1Width / 2;
    } else if (level === 'engineering') {
      startY = layer1Y;
      endY = layer2Y;
      regionWidth = layer2Width / 2;
    } else {
      startY = layer2Y;
      endY = baseY;
      regionWidth = baseWidth / 2;
    }

    const height = endY - startY;

    // 标签占用中间区域，材料分布在左右两侧
    const labelHeight = 30; // 中心标签区域高度
    const availableHeight = height - labelHeight;

    if (materials.length === 0) return [];

    // 计算每个材料的位置
    return materials.map((material, index) => {
      // 多列布局：根据材料数量动态计算
      const cols = Math.min(Math.max(1, Math.floor(regionWidth / 50)), Math.max(1, Math.ceil(materials.length / 4))); // 列数
      const rows = Math.ceil(materials.length / cols);

      const col = index % cols;
      const row = Math.floor(index / cols);

      // 计算位置
      const rowHeight = availableHeight / rows;

      // 左侧：从中心向左偏移，避开中心标签
      // 右侧：从中心向右偏移，避开中心标签
      const labelArea = 40; // 中心Label区域宽度的一半
      const usableWidth = regionWidth - labelArea;

      const xOffset = isLeft
        ? -(labelArea + usableWidth / 2)
        : (labelArea + usableWidth / 2);

      // 在可用区域内分配列
      const columnOffset = (col - (cols - 1) / 2) * (usableWidth / cols);

      const x = centerX + xOffset + columnOffset;
      const y = startY + labelHeight / 2 + rowHeight / 2 + row * rowHeight + 6; // +6 避免与温度标签重叠

      return { material, x, y };
    });
  };

  const filteredMaterials = getFilteredMaterials();

  // 计算金字塔坐标
  const { centerX, topY, layer1Y, layer2Y, baseY, topWidth, baseWidth } = pyramidConfig;

  // 顶层宽度在不同高度的计算
  const getWidthAtY = (y: number) => {
    const ratio = (y - topY) / (baseY - topY);
    return topWidth + (baseWidth - topWidth) * ratio;
  };

  const layer1Width = getWidthAtY(layer1Y);
  const layer2Width = getWidthAtY(layer2Y);

  // 重置金字塔
  const handleResetPyramid = () => {
    if (confirm('确定要重置金字塔为默认布局吗？')) {
      setPyramidConfig({
        centerX: 400,
        topY: 100,
        layer1Y: 280,
        layer2Y: 440,
        baseY: 580,
        topWidth: 400,
        baseWidth: 660,
      });
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial({ ...material });
    setIsCreating(false);
  };

  const handleCreate = () => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      name: '新材料',
      nameEn: '',
      category: 'plastic',
      level: (selectedLevel as 'specialty' | 'engineering' | 'general') || 'engineering',  // 当前选中的级别
      crystallinity: (selectedCrystallinity as 'crystalline' | 'amorphous') || 'amorphous',  // 当前选中的结晶性
      properties: {},
      description: '',
      applications: [],
      advantages: [],
      disadvantages: [],
    };
    setEditingMaterial(newMaterial);
    setIsCreating(true);
  };

  const handleSave = () => {
    if (!editingMaterial) return;

    if (isCreating) {
      saveMaterials([...materials, editingMaterial]);
    } else {
      saveMaterials(materials.map((m) => (m.id === editingMaterial.id ? editingMaterial : m)));
    }
    setEditingMaterial(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个材料吗？')) {
      saveMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingMaterial(null);
    setIsCreating(false);
  };

  const updateField = (field: keyof Material, value: any) => {
    if (editingMaterial) {
      setEditingMaterial({ ...editingMaterial, [field]: value });
    }
  };

  const updateProperty = (property: string, value: string) => {
    if (editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        properties: { ...editingMaterial.properties, [property]: value },
      });
    }
  };

  const updateArrayField = (field: 'applications' | 'advantages' | 'disadvantages', value: string) => {
    if (editingMaterial) {
      const items = value.split('\n').filter((item) => item.trim());
      setEditingMaterial({ ...editingMaterial, [field]: items });
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">材料库</h1>
        <Link
          to="/materials/performance"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <span className="text-lg">📊</span>
          <span className="font-medium">材料性能数据库</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-8">按类别管理和查看材料信息</p>

      {/* 顶部分类标签 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'plastic' as const, label: '塑料' },
              { id: 'rubber' as const, label: '橡胶' },
              { id: 'elastomer' as const, label: '弹性体' },
              { id: 'composite' as const, label: '复材' },
              { id: 'other' as const, label: '其他' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedTab(tab.id);
                  setSelectedLevel(null);
                  setSelectedCrystallinity(null);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTab === 'plastic' && (
        /* 塑料部分 */
        <div>
          {/* 视图切换按钮 */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">显示模式：</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-table mr-2"></i>
                    详细表格
                  </button>
                  <button
                    onClick={() => setViewMode('pyramid')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      viewMode === 'pyramid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <i className="fas fa-mountain mr-2"></i>
                    金字塔视图
                  </button>
                </div>
              </div>
              {viewMode === 'table' && (
                <button
                  onClick={() => {
                    if (isAdminMode) {
                      setIsAdminMode(false);
                    } else {
                      const pwd = window.prompt('请输入管理员密码：');
                      if (pwd === 'admin') {
                        setIsAdminMode(true);
                      } else if (pwd !== null) {
                        alert('密码错误');
                      }
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isAdminMode
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isAdminMode ? '✏ 编辑模式（点击退出）' : '🔒 管理员编辑'}
                </button>
              )}
            </div>
          </div>

          {/* 表格视图 */}
          {viewMode === 'table' && (
            <EnhancedPlasticMaterialView isAdmin={isAdminMode} />
          )}

          {/* 金字塔视图 */}
          {viewMode === 'pyramid' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 金字塔图 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {isEditingLayout ? (
                    <input
                      type="text"
                      value={pyramidTitle}
                      onChange={(e) => setPyramidTitle(e.target.value)}
                      className="w-64 px-2 py-1 border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  ) : (
                    pyramidTitle
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditingLayout ? '拖动控制点调整金字塔形状，或直接编辑标签' : '点击金字塔区域查看该类别材料'}
                </p>
              </div>
              <div className="flex gap-2">
                {isEditingLayout && (
                  <>
                    <button
                      onClick={() => {
                        if (confirm('确定要重置所有标签为默认值吗？')) {
                          setPyramidTitle('材料金字塔');
                          setTemperatureLabels({
                            specialty: '特种工程塑料',
                            engineering: '工程塑料',
                            general: '通用塑料',
                          });
                        }
                      }}
                      className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      重置标签
                    </button>
                    <button
                      onClick={handleResetPyramid}
                      className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      重置形状
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsEditingLayout(!isEditingLayout)}
                  className={`px-3 py-1.5 text-sm rounded transition-colors ${
                    isEditingLayout
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isEditingLayout ? '完成编辑' : '编辑布局'}
                </button>
              </div>
            </div>

          <svg ref={svgRef} viewBox="0 0 800 700" className="w-full h-auto">
            {/* 背景网格 */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="800" height="700" fill="url(#grid)" />

            {/* 温度标尺 */}
            <g>
              <line x1="50" y1={topY} x2="50" y2={baseY + 20} stroke="#9ca3af" strokeWidth="2" />
              <text x="30" y={topY + 10} className="text-xs fill-gray-600">≥200°C</text>
              <text x="30" y={layer1Y + 10} className="text-xs fill-gray-600">200°C</text>
              <text x="30" y={layer2Y + 10} className="text-xs fill-gray-600">150°C</text>
              <text x="30" y={baseY + 10} className="text-xs fill-gray-600">&lt;100°C</text>
              <line x1="45" y1={topY} x2="55" y2={topY} stroke="#9ca3af" strokeWidth="2" />
              <line x1="45" y1={layer1Y} x2="55" y2={layer1Y} stroke="#9ca3af" strokeWidth="2" />
              <line x1="45" y1={layer2Y} x2="55" y2={layer2Y} stroke="#9ca3af" strokeWidth="2" />
              <line x1="45" y1={baseY} x2="55" y2={baseY} stroke="#9ca3af" strokeWidth="2" />
            </g>

            {/* 中心分隔线 */}
            <line x1={centerX} y1={topY} x2={centerX} y2={baseY} stroke="#6b7280" strokeWidth="3" strokeDasharray="8,4" />

            {/* 结晶性标签 */}
            <text x={centerX - 150} y="650" textAnchor="middle" className="text-base font-bold fill-gray-700">
              非结晶性（无定形）
            </text>
            <text x={centerX + 150} y="650" textAnchor="middle" className="text-base font-bold fill-gray-700">
              结晶性
            </text>

            {/* 金字塔轮廓 */}
            <path
              d={`M ${centerX} ${topY} L ${centerX - baseWidth/2} ${baseY} L ${centerX + baseWidth/2} ${baseY} Z`}
              fill="none"
              stroke="#374151"
              strokeWidth="3"
            />

            {/* 特种工程塑料 - 顶层 */}
            <g>
              {/* 左侧 - 非结晶 */}
              <path
                d={`M ${centerX} ${topY} L ${centerX - layer1Width/2} ${layer1Y} L ${centerX} ${layer1Y} Z`}
                fill={selectedLevel === 'specialty' && selectedCrystallinity === 'amorphous' ? '#b91c1c' : '#dc2626'}
                stroke="#991b1b"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('specialty'), setSelectedCrystallinity('amorphous'))}
              />
              {/* 右侧 - 结晶 */}
              <path
                d={`M ${centerX} ${topY} L ${centerX} ${layer1Y} L ${centerX + layer1Width/2} ${layer1Y} Z`}
                fill={selectedLevel === 'specialty' && selectedCrystallinity === 'crystalline' ? '#b91c1c' : '#dc2626'}
                stroke="#991b1b"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('specialty'), setSelectedCrystallinity('crystalline'))}
              />
              <text x={centerX} y={(topY + layer1Y) / 2} textAnchor="middle" className="text-lg font-bold fill-white pointer-events-none">
                {isEditingLayout ? (
                  ''
                ) : (
                  temperatureLabels.specialty
                )}
              </text>
              {isEditingLayout && (
                <foreignObject x={centerX - 80} y={(topY + layer1Y) / 2 - 15} width="160" height="30">
                  <input
                    type="text"
                    value={temperatureLabels.specialty}
                    onChange={(e) => setTemperatureLabels({ ...temperatureLabels, specialty: e.target.value })}
                    className="w-full px-2 py-1 text-sm border-2 border-white rounded bg-white/90 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </foreignObject>
              )}
              <text x={centerX} y={(topY + layer1Y) / 2 + 25} textAnchor="middle" className="text-sm fill-white pointer-events-none">
                ≥ 200°C
              </text>

              {/* 左侧材料列表 - 顶部非结晶 */}
              <g>
                {calculateMaterialPositions('specialty', 'amorphous').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
              {/* 右侧材料列表 - 顶部结晶 */}
              <g>
                {calculateMaterialPositions('specialty', 'crystalline').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
            </g>

            {/* 工程塑料 - 中层 */}
            <g>
              {/* 左侧 - 非结晶 */}
              <path
                d={`M ${centerX - layer1Width/2} ${layer1Y} L ${centerX - layer2Width/2} ${layer2Y} L ${centerX} ${layer2Y} L ${centerX} ${layer1Y} Z`}
                fill={selectedLevel === 'engineering' && selectedCrystallinity === 'amorphous' ? '#c2410c' : '#ea580c'}
                stroke="#9a3412"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('engineering'), setSelectedCrystallinity('amorphous'))}
              />
              {/* 右侧 - 结晶 */}
              <path
                d={`M ${centerX} ${layer1Y} L ${centerX} ${layer2Y} L ${centerX + layer2Width/2} ${layer2Y} L ${centerX + layer1Width/2} ${layer1Y} Z`}
                fill={selectedLevel === 'engineering' && selectedCrystallinity === 'crystalline' ? '#c2410c' : '#ea580c'}
                stroke="#9a3412"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('engineering'), setSelectedCrystallinity('crystalline'))}
              />
              <text x={centerX} y={(layer1Y + layer2Y) / 2} textAnchor="middle" className="text-lg font-bold fill-white pointer-events-none">
                {isEditingLayout ? (
                  ''
                ) : (
                  temperatureLabels.engineering
                )}
              </text>
              {isEditingLayout && (
                <foreignObject x={centerX - 60} y={(layer1Y + layer2Y) / 2 - 15} width="120" height="30">
                  <input
                    type="text"
                    value={temperatureLabels.engineering}
                    onChange={(e) => setTemperatureLabels({ ...temperatureLabels, engineering: e.target.value })}
                    className="w-full px-2 py-1 text-sm border-2 border-white rounded bg-white/90 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </foreignObject>
              )}
              <text x={centerX} y={(layer1Y + layer2Y) / 2 + 25} textAnchor="middle" className="text-sm fill-white pointer-events-none">
                150-200°C
              </text>

              {/* 左侧材料列表 - 中部非结晶 */}
              <g>
                {calculateMaterialPositions('engineering', 'amorphous').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
              {/* 右侧材料列表 - 中部结晶 */}
              <g>
                {calculateMaterialPositions('engineering', 'crystalline').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
            </g>

            {/* 通用塑料 - 底层 */}
            <g>
              {/* 左侧 - 非结晶 */}
              <path
                d={`M ${centerX - layer2Width/2} ${layer2Y} L ${centerX - baseWidth/2} ${baseY} L ${centerX} ${baseY} L ${centerX} ${layer2Y} Z`}
                fill={selectedLevel === 'general' && selectedCrystallinity === 'amorphous' ? '#a16207' : '#ca8a04'}
                stroke="#854d0e"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('general'), setSelectedCrystallinity('amorphous'))}
              />
              {/* 右侧 - 结晶 */}
              <path
                d={`M ${centerX} ${layer2Y} L ${centerX} ${baseY} L ${centerX + baseWidth/2} ${baseY} L ${centerX + layer2Width/2} ${layer2Y} Z`}
                fill={selectedLevel === 'general' && selectedCrystallinity === 'crystalline' ? '#a16207' : '#ca8a04'}
                stroke="#854d0e"
                strokeWidth="2"
                className={isEditingLayout ? 'pointer-events-none' : 'cursor-pointer transition-all hover:opacity-80'}
                onClick={() => !isEditingLayout && (setSelectedLevel('general'), setSelectedCrystallinity('crystalline'))}
              />
              <text x={centerX} y={(layer2Y + baseY) / 2} textAnchor="middle" className="text-lg font-bold fill-white pointer-events-none">
                {isEditingLayout ? (
                  ''
                ) : (
                  temperatureLabels.general
                )}
              </text>
              {isEditingLayout && (
                <foreignObject x={centerX - 60} y={(layer2Y + baseY) / 2 - 15} width="120" height="30">
                  <input
                    type="text"
                    value={temperatureLabels.general}
                    onChange={(e) => setTemperatureLabels({ ...temperatureLabels, general: e.target.value })}
                    className="w-full px-2 py-1 text-sm border-2 border-white rounded bg-white/90 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </foreignObject>
              )}
              <text x={centerX} y={(layer2Y + baseY) / 2 + 25} textAnchor="middle" className="text-sm fill-white pointer-events-none">
                {'< 150°C'}
              </text>

              {/* 左侧材料列表 - 底部非结晶 */}
              <g>
                {calculateMaterialPositions('general', 'amorphous').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
              {/* 右侧材料列表 - 底部结晶 */}
              <g>
                {calculateMaterialPositions('general', 'crystalline').map(({ material, x, y }) => (
                  <text
                    key={material.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className="text-xs fill-white pointer-events-none opacity-90"
                  >
                    {material.name}
                  </text>
                ))}
              </g>
            </g>

            {/* 编辑模式控制点 */}
            {isEditingLayout && (
              <g>
                {/* 顶点 */}
                <circle
                  cx={centerX}
                  cy={topY}
                  r="8"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-move"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startTopY = topY;
                    const handleMove = (e: MouseEvent) => {
                      const svg = svgRef.current;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const deltaY = ((e.clientY - startY) * 700) / rect.height;
                      setPyramidConfig({ ...pyramidConfig, topY: Math.max(50, Math.min(200, startTopY + deltaY)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
                {/* 第一层分界线 */}
                <line
                  x1={centerX - layer1Width/2 - 20}
                  y1={layer1Y}
                  x2={centerX + layer1Width/2 + 20}
                  y2={layer1Y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <circle
                  cx={centerX}
                  cy={layer1Y}
                  r="8"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-move"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startLayer1Y = layer1Y;
                    const handleMove = (e: MouseEvent) => {
                      const svg = svgRef.current;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const deltaY = ((e.clientY - startY) * 700) / rect.height;
                      setPyramidConfig({ ...pyramidConfig, layer1Y: Math.max(topY + 80, Math.min(layer2Y - 80, startLayer1Y + deltaY)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
                {/* 第二层分界线 */}
                <line
                  x1={centerX - layer2Width/2 - 20}
                  y1={layer2Y}
                  x2={centerX + layer2Width/2 + 20}
                  y2={layer2Y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
                <circle
                  cx={centerX}
                  cy={layer2Y}
                  r="8"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-move"
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startLayer2Y = layer2Y;
                    const handleMove = (e: MouseEvent) => {
                      const svg = svgRef.current;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const deltaY = ((e.clientY - startY) * 700) / rect.height;
                      setPyramidConfig({ ...pyramidConfig, layer2Y: Math.max(layer1Y + 80, Math.min(baseY - 80, startLayer2Y + deltaY)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
                {/* 底部控制点 */}
                <circle
                  cx={centerX - baseWidth/2}
                  cy={baseY}
                  r="8"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-ew-resize"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startBaseWidth = baseWidth;
                    const handleMove = (e: MouseEvent) => {
                      const svg = svgRef.current;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const deltaX = ((e.clientX - startX) * 800) / rect.width;
                      setPyramidConfig({ ...pyramidConfig, baseWidth: Math.max(300, Math.min(700, startBaseWidth - 2 * deltaX)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
                <circle
                  cx={centerX + baseWidth/2}
                  cy={baseY}
                  r="8"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-ew-resize"
                  onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startBaseWidth = baseWidth;
                    const handleMove = (e: MouseEvent) => {
                      const svg = svgRef.current;
                      if (!svg) return;
                      const rect = svg.getBoundingClientRect();
                      const deltaX = ((e.clientX - startX) * 800) / rect.width;
                      setPyramidConfig({ ...pyramidConfig, baseWidth: Math.max(300, Math.min(700, startBaseWidth + 2 * deltaX)) });
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                />
              </g>
            )}
          </svg>

          {/* 图例 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">按温度分类</h3>
              <div className="space-y-2">
                {levels.map(level => (
                  <div key={level.category} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: level.color }}></div>
                    <div>
                      <span className="text-sm font-medium">{level.name}</span>
                      <span className="text-xs text-gray-500 ml-2">{level.temperature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">按结晶性分类</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-400 bg-gray-100"></div>
                  <span className="text-sm">左侧：非结晶性（无定形）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-2 border-gray-400 bg-white"></div>
                  <span className="text-sm">右侧：结晶性</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 材料列表 */}
        <div className="lg:col-span-1">
          {selectedLevel && selectedCrystallinity ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {levels.find(l => l.category === selectedLevel)?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedCrystallinity === 'amorphous' ? '非结晶性（无定形）' : '结晶性'}
                    • {filteredMaterials.length} 种材料
                  </p>
                </div>
                <button
                  onClick={handleCreate}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  + 添加
                </button>
              </div>

              {filteredMaterials.length > 0 ? (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredMaterials.map(material => (
                    <div
                      key={material.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <div className="font-semibold text-gray-900">{material.name}</div>
                      {material.nameEn && (
                        <div className="text-xs text-gray-500 mt-1">{material.nameEn}</div>
                      )}
                      {material.description && (
                        <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {material.description}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Link
                          to={`/materials/${material.id}`}
                          className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center"
                        >
                          查看
                        </Link>
                        <button
                          onClick={() => handleEdit(material)}
                          className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">暂无材料数据</p>
                  <p className="text-sm">该分类下尚未添加材料</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🔺</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                点击金字塔区域
              </h3>
              <p className="text-sm text-gray-600">
                选择左侧金字塔中的任意区域<br/>
                查看该类别的材料列表
              </p>
              <div className="mt-6 text-xs text-gray-500">
                <p>• 左侧区域：非结晶性材料</p>
                <p>• 右侧区域：结晶性材料</p>
                <p>• 从上到下：耐温性能递减</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
        </div>
      )}

      {selectedTab === 'rubber' && (
        <EnhancedRubberMaterialView />
      )}

      {selectedTab === 'composite' && (
        <EnhancedCompositeView />
      )}

      {selectedTab === 'elastomer' && (
        <EnhancedElastomerView />
      )}

      {selectedTab === 'other' && (
        <EnhancedOtherMaterialView />
      )}

      {/* 编辑材料模态框 */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {isCreating ? '创建材料' : '编辑材料'}
              </h2>

              <div className="space-y-4">
                {/* 图片预览和编辑 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    材料图片
                  </label>
                  <div className="flex flex-col gap-3">
                    {editingMaterial.imageUrl && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={editingMaterial.imageUrl}
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
                      value={editingMaterial.imageUrl || ''}
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
                      材料名称 *
                    </label>
                    <input
                      type="text"
                      value={editingMaterial.name}
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
                      value={editingMaterial.nameEn || ''}
                      onChange={(e) => updateField('nameEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    材料描述
                  </label>
                  <textarea
                    value={editingMaterial.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 温度级别和结晶性选择 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      温度级别
                    </label>
                    <select
                      value={editingMaterial.level || (isCreating && selectedLevel ? selectedLevel : '')}
                      onChange={(e) => updateField('level', e.target.value as 'specialty' | 'engineering' | 'general')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="specialty">特种工程塑料 (≥200°C)</option>
                      <option value="engineering">工程塑料 (150-200°C)</option>
                      <option value="general">通用塑料 (&lt;150°C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      结晶性
                    </label>
                    <select
                      value={editingMaterial.crystallinity || (isCreating && selectedCrystallinity ? selectedCrystallinity : '')}
                      onChange={(e) => updateField('crystallinity', e.target.value as 'crystalline' | 'amorphous')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="crystalline">结晶性</option>
                      <option value="amorphous">非结晶性（无定形）</option>
                    </select>
                  </div>
                </div>

                {/* 材料属性 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    材料属性
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="密度 (g/cm³)"
                      value={editingMaterial.properties.density || ''}
                      onChange={(e) => updateProperty('density', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="抗拉强度 (MPa)"
                      value={editingMaterial.properties.tensileStrength || ''}
                      onChange={(e) => updateProperty('tensileStrength', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="熔点 (°C)"
                      value={editingMaterial.properties.meltingPoint || ''}
                      onChange={(e) => updateProperty('meltingPoint', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="成本"
                      value={editingMaterial.properties.cost || ''}
                      onChange={(e) => updateProperty('cost', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 应用场景 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    应用场景（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.applications || []).join('\n')}
                    onChange={(e) => updateArrayField('applications', e.target.value)}
                    rows={3}
                    placeholder="例如：保险杠&#10;内饰板&#10;仪表盘"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 优点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优点（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.advantages || []).join('\n')}
                    onChange={(e) => updateArrayField('advantages', e.target.value)}
                    rows={2}
                    placeholder="例如：重量轻&#10;成本低"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 缺点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缺点（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.disadvantages || []).join('\n')}
                    onChange={(e) => updateArrayField('disadvantages', e.target.value)}
                    rows={2}
                    placeholder="例如：耐温性差&#10;易老化"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!editingMaterial.name}
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
    </div>
  );
}
