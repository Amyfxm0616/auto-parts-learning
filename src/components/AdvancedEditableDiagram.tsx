import { useState, useRef } from 'react';

interface ShapeElement {
  id: string;
  type: 'rect' | 'circle' | 'ellipse' | 'path';
  x: number;
  y: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  radius?: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  text: string;
  textX?: number;
  textY?: number;
  d?: string;
  rotation?: number;
  opacity?: number;
}

interface AdvancedEditableDiagramProps {
  initialElements: ShapeElement[];
  title: string;
  onSave?: (elements: ShapeElement[]) => void;
}

export default function AdvancedEditableDiagram({ initialElements, title, onSave }: AdvancedEditableDiagramProps) {
  const [elements, setElements] = useState<ShapeElement[]>(initialElements);
  const [history, setHistory] = useState<ShapeElement[][]>([initialElements]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editMode, setEditMode] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedElement, setCopiedElement] = useState<ShapeElement | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const selectedElement = elements.find(el => el.id === selectedId);

  // 添加到历史记录
  const addToHistory = (newElements: ShapeElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // 撤销
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  // 重做
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // 获取SVG坐标
  const getSVGCoordinates = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgP.x, y: svgP.y };
  };

  // 开始拖拽
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (!editMode) return;
    e.stopPropagation();
    setSelectedId(elementId);
    setIsDragging(true);
    const coords = getSVGCoordinates(e.clientX, e.clientY);
    setDragStart(coords);
  };

  // 拖拽移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !editMode) return;

    const coords = getSVGCoordinates(e.clientX, e.clientY);
    const dx = coords.x - dragStart.x;
    const dy = coords.y - dragStart.y;

    const newElements = elements.map(el => {
      if (el.id === selectedId) {
        return {
          ...el,
          x: el.x + dx,
          y: el.y + dy,
          textX: el.textX ? el.textX + dx : undefined,
          textY: el.textY ? el.textY + dy : undefined,
        };
      }
      return el;
    });

    setElements(newElements);
    setDragStart(coords);
  };

  // 结束拖拽
  const handleMouseUp = () => {
    if (isDragging) {
      addToHistory(elements);
    }
    setIsDragging(false);
  };

  // 改变颜色
  const handleColorChange = (color: string) => {
    if (!selectedId) return;
    const newElements = elements.map(el =>
      el.id === selectedId ? { ...el, fill: color } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  // 改变大小
  const handleSizeChange = (property: 'width' | 'height' | 'radius' | 'rx' | 'ry', value: number) => {
    if (!selectedId) return;
    const newElements = elements.map(el =>
      el.id === selectedId ? { ...el, [property]: value } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  // 改变透明度
  const handleOpacityChange = (value: number) => {
    if (!selectedId) return;
    const newElements = elements.map(el =>
      el.id === selectedId ? { ...el, opacity: value } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  // 编辑文本
  const startTextEdit = (elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setEditingTextId(elementId);
      setEditText(element.text);
    }
  };

  const saveTextEdit = () => {
    if (!editingTextId) return;
    const newElements = elements.map(el =>
      el.id === editingTextId ? { ...el, text: editText } : el
    );
    setElements(newElements);
    addToHistory(newElements);
    setEditingTextId(null);
    setEditText('');
  };

  // 复制元素
  const copyElement = () => {
    if (!selectedElement) return;
    setCopiedElement({ ...selectedElement });
  };

  // 粘贴元素
  const pasteElement = () => {
    if (!copiedElement) return;
    const newElement = {
      ...copiedElement,
      id: `${copiedElement.type}-${Date.now()}`,
      x: copiedElement.x + 20,
      y: copiedElement.y + 20,
      textX: copiedElement.textX ? copiedElement.textX + 20 : undefined,
      textY: copiedElement.textY ? copiedElement.textY + 20 : undefined,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newElement.id);
  };

  // 删除元素
  const deleteElement = () => {
    if (!selectedId) return;
    const newElements = elements.filter(el => el.id !== selectedId);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(null);
  };

  // 添加新元素
  const addNewElement = (type: 'rect' | 'circle' | 'ellipse') => {
    const newId = `${type}-${Date.now()}`;
    let newElement: ShapeElement;

    switch (type) {
      case 'rect':
        newElement = {
          id: newId,
          type: 'rect',
          x: 350,
          y: 250,
          width: 100,
          height: 80,
          rx: 5,
          fill: '#93c5fd',
          stroke: '#374151',
          strokeWidth: 2,
          text: '新矩形',
          textX: 400,
          textY: 295,
          opacity: 1,
        };
        break;
      case 'circle':
        newElement = {
          id: newId,
          type: 'circle',
          x: 400,
          y: 300,
          radius: 40,
          fill: '#93c5fd',
          stroke: '#374151',
          strokeWidth: 2,
          text: '新圆形',
          textX: 400,
          textY: 305,
          opacity: 1,
        };
        break;
      case 'ellipse':
        newElement = {
          id: newId,
          type: 'ellipse',
          x: 400,
          y: 300,
          rx: 60,
          ry: 40,
          fill: '#93c5fd',
          stroke: '#374151',
          strokeWidth: 2,
          text: '新椭圆',
          textX: 400,
          textY: 305,
          opacity: 1,
        };
        break;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newId);
    setShowAddMenu(false);
  };

  // 调整图层顺序
  const moveLayer = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!selectedId) return;
    const currentIndex = elements.findIndex(el => el.id === selectedId);
    if (currentIndex === -1) return;

    const newElements = [...elements];
    const [element] = newElements.splice(currentIndex, 1);

    switch (direction) {
      case 'up':
        newElements.splice(Math.min(currentIndex + 1, newElements.length), 0, element);
        break;
      case 'down':
        newElements.splice(Math.max(currentIndex - 1, 0), 0, element);
        break;
      case 'top':
        newElements.push(element);
        break;
      case 'bottom':
        newElements.unshift(element);
        break;
    }

    setElements(newElements);
    addToHistory(newElements);
  };

  // 导出JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(elements, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 渲染SVG元素
  const renderElement = (element: ShapeElement) => {
    const isSelected = element.id === selectedId && editMode;
    const commonProps = {
      fill: element.fill,
      stroke: isSelected ? '#3b82f6' : element.stroke,
      strokeWidth: isSelected ? 3 : element.strokeWidth,
      opacity: element.opacity || 1,
      className: editMode ? 'cursor-move transition-all' : 'cursor-pointer transition-all hover:opacity-80',
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, element.id),
      onClick: () => !editMode && setSelectedId(element.id),
    };

    let shape = null;
    switch (element.type) {
      case 'rect':
        shape = (
          <rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            rx={element.rx}
            {...commonProps}
          />
        );
        break;
      case 'circle':
        shape = (
          <circle
            cx={element.x}
            cy={element.y}
            r={element.radius}
            {...commonProps}
          />
        );
        break;
      case 'ellipse':
        shape = (
          <ellipse
            cx={element.x}
            cy={element.y}
            rx={element.rx}
            ry={element.ry}
            {...commonProps}
          />
        );
        break;
      case 'path':
        shape = (
          <path
            d={element.d}
            {...commonProps}
          />
        );
        break;
    }

    return (
      <g key={element.id}>
        {shape}
        <text
          x={element.textX || element.x}
          y={element.textY || element.y}
          textAnchor="middle"
          className="fill-gray-700 text-sm font-medium pointer-events-none select-none"
          opacity={element.opacity || 1}
        >
          {element.text}
        </text>
        {isSelected && (
          <>
            {/* 选中指示器 */}
            <circle cx={element.x} cy={element.y} r="5" fill="#3b82f6" />
          </>
        )}
      </g>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-4 py-2 rounded transition-colors ${
              editMode
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {editMode ? '退出编辑' : '进入编辑模式'}
          </button>
          {editMode && (
            <>
              <button
                onClick={undo}
                disabled={historyIndex === 0}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="撤销 (Ctrl+Z)"
              >
                ↶ 撤销
              </button>
              <button
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="重做 (Ctrl+Y)"
              >
                ↷ 重做
              </button>
              <button
                onClick={exportJSON}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                导出JSON
              </button>
            </>
          )}
          {editMode && onSave && (
            <button
              onClick={() => onSave(elements)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              保存更改
            </button>
          )}
        </div>
      </div>

      {editMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded space-y-2">
          <p className="text-sm text-yellow-800">
            <strong>编辑模式：</strong> 点击并拖拽图形来移动位置，使用右侧面板调整属性
          </p>
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                ➕ 添加图形
              </button>
              {showAddMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                  <button
                    onClick={() => addNewElement('rect')}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    矩形
                  </button>
                  <button
                    onClick={() => addNewElement('circle')}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    圆形
                  </button>
                  <button
                    onClick={() => addNewElement('ellipse')}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    椭圆
                  </button>
                </div>
              )}
            </div>
            {selectedElement && (
              <>
                <button
                  onClick={copyElement}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  📋 复制
                </button>
                {copiedElement && (
                  <button
                    onClick={pasteElement}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    📄 粘贴
                  </button>
                )}
                <button
                  onClick={deleteElement}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  🗑️ 删除
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG 画布 */}
        <div className="lg:col-span-3">
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-auto border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {elements.map((element) => renderElement(element))}
          </svg>
        </div>

        {/* 控制面板 */}
        <div className="lg:col-span-1 space-y-4">
          {selectedElement ? (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 space-y-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900">元素设置</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID</label>
                <p className="text-sm text-gray-600">{selectedElement.id}</p>
              </div>

              {/* 文本编辑 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文本内容</label>
                {editingTextId === selectedElement.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveTextEdit}
                        className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingTextId(null)}
                        className="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 flex-1">{selectedElement.text}</p>
                    {editMode && (
                      <button
                        onClick={() => startTextEdit(selectedElement.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        编辑
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* 颜色选择 */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">填充颜色</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#e5e7eb', '#93c5fd', '#fef3c7', '#fed7aa', '#fca5a5', '#ddd6fe', '#6ee7b7', '#f3f4f6'].map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-full h-10 rounded border-2 transition-all ${
                          selectedElement.fill === color ? 'border-blue-500 scale-110' : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={selectedElement.fill}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="mt-2 w-full h-10 rounded border border-gray-300 cursor-pointer"
                  />
                </div>
              )}

              {/* 透明度 */}
              {editMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    透明度: {((selectedElement.opacity || 1) * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedElement.opacity || 1}
                    onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* 大小调整 */}
              {editMode && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">大小调整</h4>

                  {selectedElement.width !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">宽度: {selectedElement.width}</label>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={selectedElement.width}
                        onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {selectedElement.height !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">高度: {selectedElement.height}</label>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={selectedElement.height}
                        onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {selectedElement.radius !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">半径: {selectedElement.radius}</label>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={selectedElement.radius}
                        onChange={(e) => handleSizeChange('radius', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {selectedElement.rx !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">X半径: {selectedElement.rx}</label>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={selectedElement.rx}
                        onChange={(e) => handleSizeChange('rx', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {selectedElement.ry !== undefined && (
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Y半径: {selectedElement.ry}</label>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={selectedElement.ry}
                        onChange={(e) => handleSizeChange('ry', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 图层顺序 */}
              {editMode && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">图层顺序</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => moveLayer('top')}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      ⬆️ 置顶
                    </button>
                    <button
                      onClick={() => moveLayer('bottom')}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                    >
                      ⬇️ 置底
                    </button>
                    <button
                      onClick={() => moveLayer('up')}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      ↑ 上移
                    </button>
                    <button
                      onClick={() => moveLayer('down')}
                      className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                    >
                      ↓ 下移
                    </button>
                  </div>
                </div>
              )}

              {/* 位置信息 */}
              <div className="pt-3 border-t border-blue-300">
                <h4 className="text-sm font-medium text-gray-700 mb-2">位置</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>X: {Math.round(selectedElement.x)}</p>
                  <p>Y: {Math.round(selectedElement.y)}</p>
                  <p>图层: {elements.findIndex(el => el.id === selectedElement.id) + 1} / {elements.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                {editMode ? '点击任意图形进行编辑' : '点击任意图形查看详情'}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {editMode ? '可以拖拽移动、调整大小和颜色' : '进入编辑模式后可修改'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
