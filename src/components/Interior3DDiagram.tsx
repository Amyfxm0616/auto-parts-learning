import { useState, useRef } from 'react';

interface Shape3DElement {
  id: string;
  type: 'box' | 'cylinder' | 'sphere' | 'panel';
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  color: string;
  text: string;
  scale: number;
}

interface Interior3DDiagramProps {
  onSave?: (elements: Shape3DElement[]) => void;
}

export default function Interior3DDiagram({ onSave }: Interior3DDiagramProps) {
  const [elements, setElements] = useState<Shape3DElement[]>([
    {
      id: 'dashboard',
      type: 'box',
      x: 400,
      y: 150,
      z: 100,
      width: 180,
      height: 100,
      depth: 50,
      rotateX: -20,
      rotateY: 0,
      rotateZ: 0,
      color: '#6b7280',
      text: '仪表板',
      scale: 1,
    },
    {
      id: 'steering-wheel',
      type: 'cylinder',
      x: 500,
      y: 200,
      z: 80,
      width: 60,
      height: 60,
      depth: 20,
      rotateX: -30,
      rotateY: 0,
      rotateZ: 0,
      color: '#374151',
      text: '方向盘',
      scale: 1,
    },
    {
      id: 'center-console',
      type: 'box',
      x: 300,
      y: 280,
      z: 80,
      width: 120,
      height: 150,
      depth: 60,
      rotateX: -15,
      rotateY: 10,
      rotateZ: 0,
      color: '#4b5563',
      text: '中控台',
      scale: 1,
    },
    {
      id: 'seat-driver',
      type: 'box',
      x: 500,
      y: 320,
      z: 60,
      width: 80,
      height: 100,
      depth: 80,
      rotateX: -10,
      rotateY: -5,
      rotateZ: 0,
      color: '#6366f1',
      text: '驾驶座',
      scale: 1,
    },
    {
      id: 'seat-passenger',
      type: 'box',
      x: 200,
      y: 320,
      z: 60,
      width: 80,
      height: 100,
      depth: 80,
      rotateX: -10,
      rotateY: 5,
      rotateZ: 0,
      color: '#6366f1',
      text: '副驾座',
      scale: 1,
    },
    {
      id: 'door-panel-left',
      type: 'panel',
      x: 100,
      y: 250,
      z: 50,
      width: 150,
      height: 200,
      depth: 30,
      rotateX: -5,
      rotateY: 25,
      rotateZ: 0,
      color: '#8b5cf6',
      text: '左门板',
      scale: 1,
    },
    {
      id: 'door-panel-right',
      type: 'panel',
      x: 650,
      y: 250,
      z: 50,
      width: 150,
      height: 200,
      depth: 30,
      rotateX: -5,
      rotateY: -25,
      rotateZ: 0,
      color: '#8b5cf6',
      text: '右门板',
      scale: 1,
    },
    {
      id: 'center-screen',
      type: 'panel',
      x: 320,
      y: 200,
      z: 90,
      width: 100,
      height: 60,
      depth: 10,
      rotateX: -15,
      rotateY: 5,
      rotateZ: 0,
      color: '#1e3a8a',
      text: '中控屏',
      scale: 1,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [_isScaling, setIsScaling] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [perspective, setPerspective] = useState(1200);
  const [viewAngle, setViewAngle] = useState({ x: 20, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedElement = elements.find(el => el.id === selectedId);

  // 3D投影计算
  const project3D = (x: number, y: number, z: number, element?: Shape3DElement) => {
    const rotX = ((viewAngle.x + (element?.rotateX || 0)) * Math.PI) / 180;
    const rotY = ((viewAngle.y + (element?.rotateY || 0)) * Math.PI) / 180;
    const rotZ = ((element?.rotateZ || 0) * Math.PI) / 180;

    // 应用旋转
    let x1 = x;
    let y1 = y * Math.cos(rotX) - z * Math.sin(rotX);
    let z1 = y * Math.sin(rotX) + z * Math.cos(rotX);

    let x2 = x1 * Math.cos(rotY) + z1 * Math.sin(rotY);
    let y2 = y1;
    let z2 = -x1 * Math.sin(rotY) + z1 * Math.cos(rotY);

    let x3 = x2 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
    let y3 = x2 * Math.sin(rotZ) + y2 * Math.cos(rotZ);
    let z3 = z2;

    // 透视投影
    const scale = perspective / (perspective + z3);
    return {
      x: x3 * scale,
      y: y3 * scale,
      z: z3,
      scale: scale,
    };
  };

  // 渲染3D盒子
  const renderBox = (element: Shape3DElement) => {
    const { x, y, z, width, height, depth, scale: elemScale } = element;
    const w = width * elemScale;
    const h = height * elemScale;
    const d = depth * elemScale;

    // 8个顶点
    const vertices = [
      project3D(x - w / 2, y - h / 2, z - d / 2, element),
      project3D(x + w / 2, y - h / 2, z - d / 2, element),
      project3D(x + w / 2, y + h / 2, z - d / 2, element),
      project3D(x - w / 2, y + h / 2, z - d / 2, element),
      project3D(x - w / 2, y - h / 2, z + d / 2, element),
      project3D(x + w / 2, y - h / 2, z + d / 2, element),
      project3D(x + w / 2, y + h / 2, z + d / 2, element),
      project3D(x - w / 2, y + h / 2, z + d / 2, element),
    ];

    // 6个面
    const faces = [
      { points: [0, 1, 2, 3], z: (vertices[0].z + vertices[2].z) / 2, color: element.color, brightness: 0.8 },
      { points: [4, 5, 6, 7], z: (vertices[4].z + vertices[6].z) / 2, color: element.color, brightness: 1.2 },
      { points: [0, 1, 5, 4], z: (vertices[0].z + vertices[5].z) / 2, color: element.color, brightness: 0.9 },
      { points: [2, 3, 7, 6], z: (vertices[2].z + vertices[7].z) / 2, color: element.color, brightness: 0.7 },
      { points: [0, 3, 7, 4], z: (vertices[0].z + vertices[7].z) / 2, color: element.color, brightness: 0.6 },
      { points: [1, 2, 6, 5], z: (vertices[1].z + vertices[6].z) / 2, color: element.color, brightness: 1.0 },
    ];

    // 按Z轴排序（画家算法）
    faces.sort((a, b) => a.z - b.z);

    const isSelected = element.id === selectedId && editMode;

    return (
      <g key={element.id}>
        {faces.map((face, idx) => {
          const pathData = `M ${vertices[face.points[0]].x} ${vertices[face.points[0]].y}
                           L ${vertices[face.points[1]].x} ${vertices[face.points[1]].y}
                           L ${vertices[face.points[2]].x} ${vertices[face.points[2]].y}
                           L ${vertices[face.points[3]].x} ${vertices[face.points[3]].y} Z`;

          const faceColor = adjustBrightness(face.color, face.brightness);

          return (
            <path
              key={idx}
              d={pathData}
              fill={faceColor}
              stroke={isSelected ? '#3b82f6' : '#000'}
              strokeWidth={isSelected ? 2 : 0.5}
              className={editMode ? 'cursor-move' : 'cursor-pointer'}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
              onClick={() => !editMode && setSelectedId(element.id)}
              style={{ transition: 'all 0.2s' }}
            />
          );
        })}
        {/* 文本标签 */}
        <text
          x={vertices[6].x}
          y={vertices[6].y - 10}
          textAnchor="middle"
          className="fill-gray-900 text-sm font-semibold pointer-events-none select-none"
          style={{ textShadow: '1px 1px 2px white' }}
        >
          {element.text}
        </text>
      </g>
    );
  };

  // 渲染圆柱体
  const renderCylinder = (element: Shape3DElement) => {
    const { x, y, z, width, height, depth, scale: elemScale } = element;
    const w = width * elemScale;
    const h = height * elemScale;
    const d = depth * elemScale;

    const topCenter = project3D(x, y - h / 2, z, element);
    const bottomCenter = project3D(x, y + h / 2, z, element);

    const isSelected = element.id === selectedId && editMode;

    return (
      <g key={element.id}>
        {/* 圆柱体侧面 */}
        <ellipse
          cx={bottomCenter.x}
          cy={bottomCenter.y}
          rx={w / 2}
          ry={d / 2}
          fill={adjustBrightness(element.color, 0.7)}
          stroke={isSelected ? '#3b82f6' : '#000'}
          strokeWidth={isSelected ? 2 : 0.5}
        />
        <rect
          x={topCenter.x - w / 2}
          y={topCenter.y}
          width={w}
          height={Math.abs(bottomCenter.y - topCenter.y)}
          fill={adjustBrightness(element.color, 0.9)}
          stroke={isSelected ? '#3b82f6' : '#000'}
          strokeWidth={isSelected ? 2 : 0.5}
          className={editMode ? 'cursor-move' : 'cursor-pointer'}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onClick={() => !editMode && setSelectedId(element.id)}
        />
        <ellipse
          cx={topCenter.x}
          cy={topCenter.y}
          rx={w / 2}
          ry={d / 2}
          fill={adjustBrightness(element.color, 1.1)}
          stroke={isSelected ? '#3b82f6' : '#000'}
          strokeWidth={isSelected ? 2 : 0.5}
          className={editMode ? 'cursor-move' : 'cursor-pointer'}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onClick={() => !editMode && setSelectedId(element.id)}
        />
        {/* 文本 */}
        <text
          x={topCenter.x}
          y={topCenter.y - 15}
          textAnchor="middle"
          className="fill-gray-900 text-sm font-semibold pointer-events-none select-none"
          style={{ textShadow: '1px 1px 2px white' }}
        >
          {element.text}
        </text>
      </g>
    );
  };

  // 渲染面板
  const renderPanel = (element: Shape3DElement) => {
    const { x, y, z, width, height, depth, scale: elemScale } = element;
    const w = width * elemScale;
    const h = height * elemScale;
    const d = depth * elemScale;

    const vertices = [
      project3D(x - w / 2, y - h / 2, z, element),
      project3D(x + w / 2, y - h / 2, z, element),
      project3D(x + w / 2, y + h / 2, z, element),
      project3D(x - w / 2, y + h / 2, z, element),
      project3D(x - w / 2, y - h / 2, z + d, element),
      project3D(x + w / 2, y - h / 2, z + d, element),
      project3D(x + w / 2, y + h / 2, z + d, element),
      project3D(x - w / 2, y + h / 2, z + d, element),
    ];

    const isSelected = element.id === selectedId && editMode;

    const frontPath = `M ${vertices[4].x} ${vertices[4].y}
                       L ${vertices[5].x} ${vertices[5].y}
                       L ${vertices[6].x} ${vertices[6].y}
                       L ${vertices[7].x} ${vertices[7].y} Z`;

    return (
      <g key={element.id}>
        <path
          d={frontPath}
          fill={element.color}
          stroke={isSelected ? '#3b82f6' : '#000'}
          strokeWidth={isSelected ? 2 : 0.5}
          className={editMode ? 'cursor-move' : 'cursor-pointer'}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onClick={() => !editMode && setSelectedId(element.id)}
          style={{ transition: 'all 0.2s' }}
        />
        <text
          x={(vertices[4].x + vertices[6].x) / 2}
          y={(vertices[4].y + vertices[6].y) / 2}
          textAnchor="middle"
          className="fill-white text-sm font-semibold pointer-events-none select-none"
        >
          {element.text}
        </text>
      </g>
    );
  };

  // 调整颜色亮度
  const adjustBrightness = (color: string, factor: number): string => {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * factor));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * factor));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * factor));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // 鼠标按下
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (!editMode) return;
    e.stopPropagation();
    setSelectedId(elementId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !editMode) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setElements(prev => prev.map(el => {
      if (el.id === selectedId) {
        return {
          ...el,
          x: el.x + dx,
          y: el.y + dy,
        };
      }
      return el;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // 鼠标松开
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsScaling(false);
  };

  // 改变颜色
  const handleColorChange = (color: string) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el =>
      el.id === selectedId ? { ...el, color } : el
    ));
  };

  // 改变尺寸
  const handleSizeChange = (property: 'width' | 'height' | 'depth', value: number) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el =>
      el.id === selectedId ? { ...el, [property]: value } : el
    ));
  };

  // 改变缩放
  const handleScaleChange = (value: number) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el =>
      el.id === selectedId ? { ...el, scale: value } : el
    ));
  };

  // 改变旋转
  const handleRotationChange = (axis: 'rotateX' | 'rotateY' | 'rotateZ', value: number) => {
    if (!selectedId) return;
    setElements(prev => prev.map(el =>
      el.id === selectedId ? { ...el, [axis]: value } : el
    ));
  };

  // 渲染元素
  const renderElement = (element: Shape3DElement) => {
    switch (element.type) {
      case 'box':
        return renderBox(element);
      case 'cylinder':
        return renderCylinder(element);
      case 'panel':
        return renderPanel(element);
      default:
        return renderBox(element);
    }
  };

  // 按Z深度排序元素
  const sortedElements = [...elements].sort((a, b) => {
    const aProj = project3D(a.x, a.y, a.z, a);
    const bProj = project3D(b.x, b.y, b.z, b);
    return aProj.z - bProj.z;
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">3D内饰零部件示意图</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              editMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {editMode ? '退出编辑' : '进入编辑模式'}
          </button>
          {editMode && onSave && (
            <button
              onClick={() => onSave(elements)}
              className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors"
            >
              保存更改
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>3D编辑模式：</strong> 点击并拖拽3D对象来移动，使用右侧面板调整尺寸、旋转角度和缩放比例
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D画布 */}
        <div className="lg:col-span-3">
          {/* 视角控制 */}
          <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">🎥 视角控制</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  俯视角度: {viewAngle.x}°
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={viewAngle.x}
                  onChange={(e) => setViewAngle({ ...viewAngle, x: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  旋转角度: {viewAngle.y}°
                </label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={viewAngle.y}
                  onChange={(e) => setViewAngle({ ...viewAngle, y: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  透视强度: {perspective}
                </label>
                <input
                  type="range"
                  min="800"
                  max="2000"
                  value={perspective}
                  onChange={(e) => setPerspective(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setViewAngle({ x: 20, y: 0 });
                    setPerspective(1200);
                  }}
                  className="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                >
                  重置视角
                </button>
              </div>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-auto border-2 border-gray-300 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ minHeight: '500px' }}
          >
            {/* 地面网格 */}
            <g opacity="0.3">
              {Array.from({ length: 20 }).map((_, i) => {
                const y = 500;
                const x1 = 50 + i * 35;
                const x2 = x1;
                const start = project3D(x1, y, -200, undefined);
                const end = project3D(x2, y, 200, undefined);
                return (
                  <line
                    key={`grid-v-${i}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                );
              })}
              {Array.from({ length: 10 }).map((_, i) => {
                const y = 500;
                const z = -200 + i * 40;
                const start = project3D(50, y, z, undefined);
                const end = project3D(750, y, z, undefined);
                return (
                  <line
                    key={`grid-h-${i}`}
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                );
              })}
            </g>

            {/* 渲染3D元素 */}
            {sortedElements.map(element => renderElement(element))}
          </svg>
        </div>

        {/* 控制面板 */}
        <div className="lg:col-span-1">
          {selectedElement ? (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 space-y-4 max-h-[700px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900">3D对象设置</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
                <p className="text-sm text-gray-600">{selectedElement.text}</p>
                <p className="text-xs text-gray-500">ID: {selectedElement.id}</p>
              </div>

              {/* 颜色选择 */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">颜色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#6b7280', '#374151', '#4b5563', '#6366f1', '#8b5cf6', '#1e3a8a', '#dc2626', '#f59e0b'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-full h-10 rounded border-2 transition-all ${
                          selectedElement.color === color ? 'border-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="mt-2 w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              )}

              {/* 尺寸调整 */}
              {editMode && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">📏 尺寸调整</h4>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      宽度: {selectedElement.width}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={selectedElement.width}
                      onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      高度: {selectedElement.height}px
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={selectedElement.height}
                      onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      深度: {selectedElement.depth}px
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={selectedElement.depth}
                      onChange={(e) => handleSizeChange('depth', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* 缩放比例 */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    🔍 整体缩放: {(selectedElement.scale * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={selectedElement.scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleScaleChange(selectedElement.scale - 0.1)}
                      className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      缩小
                    </button>
                    <button
                      onClick={() => handleScaleChange(1)}
                      className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      重置
                    </button>
                    <button
                      onClick={() => handleScaleChange(selectedElement.scale + 0.1)}
                      className="flex-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      放大
                    </button>
                  </div>
                </div>
              )}

              {/* 旋转控制 */}
              {editMode && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">🔄 旋转控制</h4>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      X轴旋转: {selectedElement.rotateX}°
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={selectedElement.rotateX}
                      onChange={(e) => handleRotationChange('rotateX', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Y轴旋转: {selectedElement.rotateY}°
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={selectedElement.rotateY}
                      onChange={(e) => handleRotationChange('rotateY', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Z轴旋转: {selectedElement.rotateZ}°
                    </label>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={selectedElement.rotateZ}
                      onChange={(e) => handleRotationChange('rotateZ', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setElements(prev => prev.map(el =>
                        el.id === selectedId
                          ? { ...el, rotateX: -20, rotateY: 0, rotateZ: 0 }
                          : el
                      ));
                    }}
                    className="w-full px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                  >
                    重置旋转
                  </button>
                </div>
              )}

              {/* 位置信息 */}
              <div className="pt-3 border-t border-blue-300">
                <h4 className="text-sm font-medium text-gray-700 mb-2">📍 3D位置</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>X: {Math.round(selectedElement.x)}</p>
                  <p>Y: {Math.round(selectedElement.y)}</p>
                  <p>Z: {Math.round(selectedElement.z)}</p>
                  <p className="pt-2 border-t border-blue-200">
                    类型: {selectedElement.type === 'box' ? '立方体' : selectedElement.type === 'cylinder' ? '圆柱体' : '面板'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                {editMode ? '点击任意3D对象进行编辑' : '点击任意3D对象查看详情'}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {editMode ? '可以拖拽移动、调整尺寸、旋转和缩放' : '进入编辑模式后可修改'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 提示信息 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">💡 3D操作提示</h3>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• <strong>移动对象</strong>：在编辑模式下点击并拖拽3D对象</li>
          <li>• <strong>调整尺寸</strong>：使用宽度、高度、深度滑块单独调整各个维度</li>
          <li>• <strong>整体缩放</strong>：使用缩放滑块或按钮快速放大/缩小对象</li>
          <li>• <strong>旋转对象</strong>：调整X、Y、Z三个轴的旋转角度创建不同视角</li>
          <li>• <strong>调整视角</strong>：使用顶部视角控制查看不同角度的3D场景</li>
        </ul>
      </div>
    </div>
  );
}
