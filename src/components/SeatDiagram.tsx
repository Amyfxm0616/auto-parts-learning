import { useState, useRef } from 'react';
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

interface SeatDiagramProps {
  parts: Part[];
  onPartClick: (part: Part) => void;
  onPartEdit?: (part: Part) => void;
}

export default function SeatDiagram({ parts, onPartClick, onPartEdit }: SeatDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // 缩放和平移状态
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

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
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
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

  // 按子专业分类座椅零部件
  const seatParts = {
    frame: parts.filter(p => p.subcategory?.includes('骨架') || p.subcategory?.includes('框架')),
    cushion: parts.filter(p => p.subcategory?.includes('坐垫') || p.subcategory?.includes('发泡')),
    cover: parts.filter(p => p.subcategory?.includes('面套') || p.subcategory?.includes('蒙皮')),
    headrest: parts.filter(p => p.subcategory?.includes('头枕')),
    armrest: parts.filter(p => p.subcategory?.includes('扶手')),
    other: parts.filter(p =>
      !p.subcategory?.includes('骨架') &&
      !p.subcategory?.includes('框架') &&
      !p.subcategory?.includes('坐垫') &&
      !p.subcategory?.includes('发泡') &&
      !p.subcategory?.includes('面套') &&
      !p.subcategory?.includes('蒙皮') &&
      !p.subcategory?.includes('头枕') &&
      !p.subcategory?.includes('扶手')
    ),
  };

  const handleAreaClick = (partType: keyof typeof seatParts) => {
    const partsList = seatParts[partType];
    if (partsList.length > 0) {
      setSelectedPart(partsList[0]);
    }
  };

  const getPartMaterials = (part: Part) => {
    return materials.filter(m => part.materials.includes(m.id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">座椅零部件示意图</h2>
      <p className="text-sm text-gray-600 mb-6">点击图中的各个区域查看零部件用材信息</p>

      {/* 缩放控制栏 */}
      <div className="mb-4 flex items-center gap-4 p-3 bg-gray-100 rounded-lg">
        <button
          onClick={handleZoomOut}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          title="缩小"
        >
          🔍−
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          title="放大"
        >
          🔍+
        </button>
        <button
          onClick={handleResetView}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          title="重置视图"
        >
          重置
        </button>
        <span className="text-xs text-gray-500 ml-2">
          💡 鼠标滚轮缩放 | Ctrl+拖动平移 | 中键拖动
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG 示意图 */}
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            className="relative overflow-hidden border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
            style={{
              cursor: isPanning ? 'grabbing' : 'grab',
              minHeight: '500px',
            }}
          >
            <svg
              viewBox="0 0 800 600"
              className="w-full h-auto"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                transformOrigin: 'center center',
              }}
            >
            {/* 汽车座椅侧视图 */}

            {/* 头枕 */}
            <ellipse
              cx="600"
              cy="120"
              rx="80"
              ry="60"
              fill={hoveredPart === 'headrest' ? '#93c5fd' : '#e5e7eb'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('headrest')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('headrest')}
            />
            <text x="600" y="125" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              头枕 ({seatParts.headrest.length})
            </text>

            {/* 靠背 - 面套 */}
            <rect
              x="480"
              y="180"
              width="180"
              height="250"
              rx="20"
              fill={hoveredPart === 'cover' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('cover')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('cover')}
            />
            <text x="570" y="295" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              面套/蒙皮
            </text>
            <text x="570" y="315" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({seatParts.cover.length}个部件)
            </text>

            {/* 靠背 - 发泡/坐垫 */}
            <rect
              x="500"
              y="200"
              width="140"
              height="210"
              rx="15"
              fill={hoveredPart === 'cushion' ? '#93c5fd' : '#f3f4f6'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('cushion')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('cushion')}
            />
            <text x="570" y="260" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
              坐垫/发泡
            </text>
            <text x="570" y="275" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({seatParts.cushion.length})
            </text>

            {/* 座椅底座 - 骨架 */}
            <path
              d="M 450 430 L 650 430 L 650 460 L 500 550 L 450 460 Z"
              fill={hoveredPart === 'frame' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('frame')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('frame')}
            />
            <text x="550" y="480" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              骨架/框架
            </text>
            <text x="550" y="500" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({seatParts.frame.length}个部件)
            </text>

            {/* 扶手 */}
            <rect
              x="350"
              y="350"
              width="80"
              height="100"
              rx="10"
              fill={hoveredPart === 'armrest' ? '#93c5fd' : '#e5e7eb'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('armrest')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('armrest')}
            />
            <text x="390" y="395" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
              扶手
            </text>
            <text x="390" y="410" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({seatParts.armrest.length})
            </text>

            {/* 其他零部件区域 */}
            <circle
              cx="200"
              cy="300"
              r="60"
              fill={hoveredPart === 'other' ? '#93c5fd' : '#f3f4f6'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('other')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('other')}
            />
            <text x="200" y="300" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
              其他
            </text>
            <text x="200" y="315" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({seatParts.other.length})
            </text>

            {/* 提示文字 */}
            <text x="400" y="580" textAnchor="middle" className="fill-gray-500 text-xs pointer-events-none">
              点击各区域查看零部件详情
            </text>
          </svg>
          </div>

          {/* 图例 */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400"></div>
              <span>未选中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border border-gray-400"></div>
              <span>悬停/选中</span>
            </div>
          </div>
        </div>

        {/* 零部件材料信息面板 */}
        <div className="lg:col-span-1">
          {selectedPart ? (
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
        <h3 className="text-lg font-semibold mb-4">所有座椅零部件</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries({
            '头枕': seatParts.headrest,
            '面套/蒙皮': seatParts.cover,
            '坐垫/发泡': seatParts.cushion,
            '骨架/框架': seatParts.frame,
            '扶手': seatParts.armrest,
            '其他': seatParts.other,
          }).map(([label, partsList]) => (
            <button
              key={label}
              onClick={() => partsList.length > 0 && setSelectedPart(partsList[0])}
              className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
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
