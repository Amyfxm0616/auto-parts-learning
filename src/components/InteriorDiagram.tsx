import { useState, useEffect, useRef } from 'react';
import { materials } from '../data/materials';

type Part = {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  subcategory?: string;
  materials: string[];
  description?: string;
  function?: string;
};

interface DiagramArea {
  id: string;
  type: 'path' | 'rect' | 'ellipse' | 'circle';
  partType: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  cx?: number;
  cy?: number;
  r?: number;
  d?: string;
}

interface InteriorDiagramProps {
  parts: Part[];
  onPartClick: (part: Part) => void;
  onPartEdit?: (part: Part) => void;
}

export default function InteriorDiagram({ parts, onPartClick, onPartEdit }: InteriorDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggingArea, setDraggingArea] = useState<string | null>(null);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 缩放和平移状态
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 默认区域配置
  const defaultAreas: DiagramArea[] = [
    {
      id: 'headliner',
      type: 'path',
      partType: 'headliner',
      label: '顶棚',
      d: 'M 100 50 Q 400 30 700 50 L 700 120 Q 400 100 100 120 Z',
    },
    {
      id: 'dashboard',
      type: 'rect',
      partType: 'dashboard',
      label: '仪表板',
      x: 520,
      y: 200,
      width: 200,
      height: 120,
      rx: 10,
    },
    {
      id: 'cnsl',
      type: 'rect',
      partType: 'cnsl',
      label: '中控',
      x: 420,
      y: 320,
      width: 120,
      height: 180,
      rx: 8,
    },
    {
      id: 'door',
      type: 'rect',
      partType: 'door',
      label: '门板',
      x: 80,
      y: 200,
      width: 160,
      height: 280,
      rx: 10,
    },
    {
      id: 'pillar-left',
      type: 'rect',
      partType: 'pillar',
      label: '立柱',
      x: 260,
      y: 150,
      width: 50,
      height: 300,
      rx: 8,
    },
    {
      id: 'pillar-right',
      type: 'rect',
      partType: 'pillar',
      label: '立柱',
      x: 490,
      y: 150,
      width: 50,
      height: 300,
      rx: 8,
    },
    {
      id: 'carpet',
      type: 'ellipse',
      partType: 'carpet',
      label: '地毯',
      cx: 300,
      cy: 530,
      rx: 250,
      ry: 50,
    },
  ];

  // 从localStorage加载区域配置
  const [areas, setAreas] = useState<DiagramArea[]>(() => {
    const saved = localStorage.getItem('interiorDiagramAreas');
    return saved ? JSON.parse(saved) : defaultAreas;
  });

  // 保存区域配置到localStorage
  useEffect(() => {
    localStorage.setItem('interiorDiagramAreas', JSON.stringify(areas));
  }, [areas]);

  // 按子专业分类内饰零部件
  const interiorParts = {
    dashboard: parts.filter(p => p.subcategory?.startsWith('内饰-仪表板')),
    door: parts.filter(p => p.subcategory?.startsWith('内饰-门板')),
    cnsl: parts.filter(p => p.subcategory?.startsWith('内饰-CNSL')),
    pillar: parts.filter(p => p.subcategory?.startsWith('内饰-立柱')),
    headliner: parts.filter(p => p.subcategory?.startsWith('内饰-顶棚')),
    carpet: parts.filter(p => p.subcategory?.startsWith('内饰-地毯')),
  };

  const handleAreaClick = (partType: string, areaId: string) => {
    if (isEditMode) {
      setEditingArea(editingArea === areaId ? null : areaId);
      return;
    }
    const partsList = (interiorParts as any)[partType] || [];
    if (partsList.length > 0) {
      // 设置第一个零件为选中状态，显示其详细信息
      setSelectedPart(partsList[0]);
      console.log(`点击区域: ${partType}, 找到 ${partsList.length} 个零件`, partsList);
    } else {
      // 如果没有找到零件，清空选中状态，但在控制台提示
      console.warn(`点击区域: ${partType}, 但没有找到匹配的零件`);
      setSelectedPart(null);
    }
  };

  const getPartMaterials = (part: Part) => {
    return materials.filter(m => part.materials.includes(m.id));
  };

  const handleMouseDown = (e: React.MouseEvent<SVGElement>, areaId: string) => {
    if (!isEditMode || editingArea === areaId) return;
    e.stopPropagation();
    setDraggingArea(areaId);

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (800 / rect.width);
    const svgY = (e.clientY - rect.top) * (600 / rect.height);

    const area = areas.find(a => a.id === areaId);
    if (!area) return;

    const offsetX = area.x !== undefined ? svgX - area.x :
                    area.cx !== undefined ? svgX - area.cx : 0;
    const offsetY = area.y !== undefined ? svgY - area.y :
                    area.cy !== undefined ? svgY - area.cy : 0;

    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isEditMode || !draggingArea) return;

    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const svgX = (e.clientX - rect.left) * (800 / rect.width);
    const svgY = (e.clientY - rect.top) * (600 / rect.height);

    setAreas(prev => prev.map(area => {
      if (area.id !== draggingArea) return area;

      const newX = svgX - dragOffset.x;
      const newY = svgY - dragOffset.y;

      if (area.type === 'rect') {
        return { ...area, x: newX, y: newY };
      } else if (area.type === 'ellipse' || area.type === 'circle') {
        return { ...area, cx: newX, cy: newY };
      }
      return area;
    }));
  };

  const handleMouseUp = () => {
    setDraggingArea(null);
    setIsPanning(false);
  };

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(0.5, scale * delta), 3);
    setScale(newScale);
  };

  // 缩放控制
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  // 平移控制
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // 中键或Ctrl+左键
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handleAddArea = () => {
    const newArea: DiagramArea = {
      id: `area-${Date.now()}`,
      type: 'rect',
      partType: 'other',
      label: '新部件',
      x: 300,
      y: 300,
      width: 100,
      height: 100,
      rx: 8,
    };
    setAreas([...areas, newArea]);
    setEditingArea(newArea.id);
  };

  const handleDeleteArea = (areaId: string) => {
    if (confirm('确定要删除这个区域吗？')) {
      setAreas(areas.filter(a => a.id !== areaId));
      if (editingArea === areaId) {
        setEditingArea(null);
      }
    }
  };

  const handleResetAreas = () => {
    if (confirm('确定要重置所有区域位置吗？')) {
      setAreas(defaultAreas);
      setEditingArea(null);
    }
  };

  const updateAreaProperty = (areaId: string | null, property: keyof DiagramArea, value: any) => {
    if (!areaId) return;
    setAreas(prev => prev.map(area => {
      if (area.id === areaId) {
        return { ...area, [property]: value };
      }
      return area;
    }));
  };

  const changeAreaType = (areaId: string | null, newType: 'rect' | 'ellipse' | 'circle') => {
    if (!areaId) return;
    setAreas(prev => prev.map(area => {
      if (area.id !== areaId) return area;

      // 获取当前中心点
      const centerX = area.x !== undefined ? area.x + (area.width || 0) / 2 :
                     area.cx !== undefined ? area.cx : 300;
      const centerY = area.y !== undefined ? area.y + (area.height || 0) / 2 :
                     area.cy !== undefined ? area.cy : 300;

      if (newType === 'rect') {
        return {
          ...area,
          type: 'rect',
          x: centerX - 50,
          y: centerY - 50,
          width: 100,
          height: 100,
          rx: 8,
          cx: undefined,
          cy: undefined,
          r: undefined,
        };
      } else if (newType === 'ellipse') {
        return {
          ...area,
          type: 'ellipse',
          cx: centerX,
          cy: centerY,
          rx: 80,
          ry: 50,
          x: undefined,
          y: undefined,
          width: undefined,
          height: undefined,
          r: undefined,
        };
      } else if (newType === 'circle') {
        return {
          ...area,
          type: 'circle',
          cx: centerX,
          cy: centerY,
          r: 50,
          x: undefined,
          y: undefined,
          width: undefined,
          height: undefined,
          rx: undefined,
          ry: undefined,
        };
      }
      return area;
    }));
  };

  const renderArea = (area: DiagramArea) => {
    const partsList = (interiorParts as any)[area.partType] || [];
    const isHovered = hoveredPart === area.partType;
    const isSelected = editingArea === area.id;
    const fillColor = isSelected ? '#fbbf24' : isHovered ? '#93c5fd' : '#d1d5db';
    const className = isEditMode
      ? 'cursor-pointer transition-all hover:fill-blue-300'
      : 'cursor-pointer transition-all hover:fill-blue-200';

    const commonProps = {
      fill: fillColor,
      stroke: isSelected ? '#f59e0b' : '#374151',
      strokeWidth: isSelected ? '4' : isEditMode ? '3' : '2',
      className,
      onMouseEnter: () => !isEditMode && setHoveredPart(area.partType),
      onMouseLeave: () => !isEditMode && setHoveredPart(null),
      onClick: () => handleAreaClick(area.partType, area.id),
      onMouseDown: (e: React.MouseEvent<SVGElement>) => handleMouseDown(e, area.id),
    };

    if (area.type === 'path' && area.d) {
      return (
        <g key={area.id}>
          <path d={area.d} {...commonProps} />
          <text x="400" y="80" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
            {area.label} ({partsList.length})
          </text>
        </g>
      );
    } else if (area.type === 'rect' && area.x !== undefined && area.y !== undefined) {
      return (
        <g key={area.id}>
          <rect
            x={area.x}
            y={area.y}
            width={area.width}
            height={area.height}
            rx={area.rx}
            {...commonProps}
          />
          <text
            x={area.x + (area.width || 0) / 2}
            y={area.y + (area.height || 0) / 2 - 5}
            textAnchor="middle"
            className="fill-gray-700 text-sm font-medium pointer-events-none"
          >
            {area.label}
          </text>
          <text
            x={area.x + (area.width || 0) / 2}
            y={area.y + (area.height || 0) / 2 + 15}
            textAnchor="middle"
            className="fill-gray-600 text-xs pointer-events-none"
          >
            ({partsList.length})
          </text>
          {isEditMode && !isSelected && (
            <circle
              cx={area.x + (area.width || 0)}
              cy={area.y}
              r="12"
              fill="#ef4444"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteArea(area.id);
              }}
            >
              <title>删除</title>
            </circle>
          )}
        </g>
      );
    } else if (area.type === 'ellipse' && area.cx !== undefined && area.cy !== undefined) {
      return (
        <g key={area.id}>
          <ellipse
            cx={area.cx}
            cy={area.cy}
            rx={area.rx}
            ry={area.ry}
            {...commonProps}
          />
          <text x={area.cx} y={area.cy} textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
            {area.label}
          </text>
          <text x={area.cx} y={area.cy + 15} textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
            ({partsList.length})
          </text>
          {isEditMode && !isSelected && (
            <circle
              cx={area.cx + (area.rx || 0)}
              cy={area.cy}
              r="12"
              fill="#ef4444"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteArea(area.id);
              }}
            >
              <title>删除</title>
            </circle>
          )}
        </g>
      );
    } else if (area.type === 'circle' && area.cx !== undefined && area.cy !== undefined) {
      return (
        <g key={area.id}>
          <circle
            cx={area.cx}
            cy={area.cy}
            r={area.r}
            {...commonProps}
          />
          <text x={area.cx} y={area.cy} textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
            {area.label}
          </text>
          <text x={area.cx} y={area.cy + 15} textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
            ({partsList.length})
          </text>
          {isEditMode && !isSelected && (
            <circle
              cx={area.cx + (area.r || 0)}
              cy={area.cy}
              r="12"
              fill="#ef4444"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteArea(area.id);
              }}
            >
              <title>删除</title>
            </circle>
          )}
        </g>
      );
    }
    return null;
  };

  const editingAreaData = areas.find(a => a.id === editingArea);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">内饰零部件示意图</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isEditMode ? (editingArea ? '点击部件属性进行编辑' : '点击部件选择编辑，或拖动调整位置') : '点击图中的各个区域查看零部件用材信息'}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditMode && (
            <>
              <button
                onClick={handleAddArea}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                + 添加部件
              </button>
              <button
                onClick={handleResetAreas}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                重置
              </button>
            </>
          )}
          <button
            onClick={() => {
              setIsEditMode(!isEditMode);
              setEditingArea(null);
            }}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              isEditMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditMode ? '退出编辑' : '编辑布局'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG 示意图 */}
        <div className="lg:col-span-2">
          {/* 缩放控制栏 */}
          <div className="mb-3 flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-300">
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="缩小 (滚轮向下)"
              >
                🔍−
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="放大 (滚轮向上)"
              >
                🔍+
              </button>
              <button
                onClick={handleResetView}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
                title="重置视图"
              >
                重置
              </button>
            </div>
            <div className="text-xs text-gray-600">
              💡 使用鼠标滚轮缩放 | Ctrl+左键拖动平移
            </div>
          </div>

          {/* SVG容器 */}
          <div
            ref={containerRef}
            className="relative overflow-hidden border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
            style={{
              cursor: isPanning ? 'grabbing' : 'grab',
              height: '600px'
            }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={(e) => {
              handlePanMove(e as any);
              handleMouseMove(e as any);
            }}
            onMouseUp={() => {
              handlePanEnd();
              handleMouseUp();
            }}
            onMouseLeave={() => {
              handlePanEnd();
              handleMouseUp();
            }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isPanning || draggingArea ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              {areas.map(area => renderArea(area))}
              <text x="400" y="580" textAnchor="middle" className="fill-gray-500 text-xs pointer-events-none">
                {isEditMode ? (editingArea ? '编辑右侧属性调整部件' : '点击选择部件，拖动移动位置') : '鼠标滚轮缩放 | 点击各区域查看零部件详情'}
              </text>
            </svg>
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="lg:col-span-1">
          {editingAreaData && isEditMode ? (
            <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-300 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-amber-900">编辑部件属性</h3>
                <button
                  onClick={() => setEditingArea(null)}
                  className="text-amber-700 hover:text-amber-900 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* 部件名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">部件名称</label>
                <input
                  type="text"
                  value={editingAreaData.label}
                  onChange={(e) => editingArea && updateAreaProperty(editingArea, 'label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* 形状类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">形状类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['rect', 'ellipse', 'circle'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => editingArea && changeAreaType(editingArea, type)}
                      className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
                        editingAreaData.type === type
                          ? 'bg-amber-100 border-amber-500 text-amber-900'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-amber-300'
                      }`}
                    >
                      {type === 'rect' ? '矩形' : type === 'ellipse' ? '椭圆' : '圆形'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 位置和尺寸 */}
              {editingAreaData.type === 'rect' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">X 坐标</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.x || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'x', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Y 坐标</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.y || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'y', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">宽度</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.width || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'width', Number(e.target.value))}
                        min="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">高度</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.height || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'height', Number(e.target.value))}
                        min="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">圆角半径</label>
                    <input
                      type="number"
                      value={Math.round(editingAreaData.rx || 0)}
                      onChange={(e) => updateAreaProperty(editingArea, 'rx', Number(e.target.value))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              {editingAreaData.type === 'ellipse' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">中心 X</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.cx || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'cx', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">中心 Y</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.cy || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'cy', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">横向半径</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.rx || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'rx', Number(e.target.value))}
                        min="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">纵向半径</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.ry || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'ry', Number(e.target.value))}
                        min="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {editingAreaData.type === 'circle' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">中心 X</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.cx || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'cx', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">中心 Y</label>
                      <input
                        type="number"
                        value={Math.round(editingAreaData.cy || 0)}
                        onChange={(e) => updateAreaProperty(editingArea, 'cy', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">半径</label>
                    <input
                      type="number"
                      value={Math.round(editingAreaData.r || 0)}
                      onChange={(e) => updateAreaProperty(editingArea, 'r', Number(e.target.value))}
                      min="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              <button
                onClick={() => editingArea && handleDeleteArea(editingArea)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                删除此部件
              </button>
            </div>
          ) : selectedPart && !isEditMode ? (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPart.name}</h3>
              {selectedPart.nameEn && (
                <p className="text-sm text-gray-600 mb-3">{selectedPart.nameEn}</p>
              )}

              {selectedPart.description && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">零部件描述：</p>
                  <p className="text-sm text-gray-600">{selectedPart.description}</p>
                </div>
              )}

              {selectedPart.function && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">功能说明：</p>
                  <p className="text-sm text-gray-600">{selectedPart.function}</p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">使用材料：</p>
                <div className="space-y-2">
                  {getPartMaterials(selectedPart).map(material => (
                    <div key={material.id} className="bg-white rounded p-2 border border-blue-300">
                      <p className="font-medium text-sm text-gray-900">{material.name}</p>
                      {material.nameEn && (
                        <p className="text-xs text-gray-500">{material.nameEn}</p>
                      )}
                      {material.description && (
                        <p className="text-xs text-gray-600 mt-1">{material.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {onPartEdit && (
                  <button
                    onClick={() => onPartEdit(selectedPart)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    编辑零部件
                  </button>
                )}
                <button
                  onClick={() => onPartClick(selectedPart)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  查看完整详情
                </button>
              </div>
            </div>
          ) : isEditMode ? (
            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">编辑模式说明</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>点击部件选择并编辑其属性</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>拖动部件可调整位置（未选中状态）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>可修改名称、形状、大小等属性</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>点击"添加部件"创建新区域</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>所有更改自动保存</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">请点击左侧示意图中的任意区域</p>
              <p className="text-gray-400 text-xs mt-2">查看零部件的材料信息</p>
            </div>
          )}
        </div>
      </div>

      {/* 零部件列表 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">所有内饰零部件</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries({
            '仪表板': interiorParts.dashboard,
            '门板': interiorParts.door,
            '中控': interiorParts.cnsl,
            '立柱': interiorParts.pillar,
            '顶棚': interiorParts.headliner,
            '地毯': interiorParts.carpet,
          }).map(([label, partsList]) => (
            <button
              key={label}
              onClick={() => !isEditMode && partsList.length > 0 && setSelectedPart(partsList[0])}
              disabled={isEditMode}
              className={`px-3 py-2 bg-white border-2 border-gray-300 rounded-lg transition-all text-sm ${
                isEditMode
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <div className="font-medium text-gray-900">{label}</div>
              <div className="text-xs text-gray-500">{partsList.length} 个部件</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
