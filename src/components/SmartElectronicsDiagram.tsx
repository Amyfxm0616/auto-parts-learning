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

interface SmartElectronicsDiagramProps {
  parts: Part[];
  onPartClick: (part: Part) => void;
  onPartEdit?: (part: Part) => void;
}

export default function SmartElectronicsDiagram({ parts, onPartClick, onPartEdit }: SmartElectronicsDiagramProps) {
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

  // 按子专业分类智能电器零部件
  const electronicsParts = {
    display: parts.filter(p => p.subcategory?.includes('显示屏') || p.subcategory?.includes('屏幕') || p.subcategory?.includes('仪表')),
    audio: parts.filter(p => p.subcategory?.includes('音响') || p.subcategory?.includes('扬声器') || p.subcategory?.includes('喇叭')),
    camera: parts.filter(p => p.subcategory?.includes('摄像头') || p.subcategory?.includes('camera')),
    sensor: parts.filter(p => p.subcategory?.includes('传感器') || p.subcategory?.includes('雷达')),
    control: parts.filter(p => p.subcategory?.includes('控制器') || p.subcategory?.includes('ECU') || p.subcategory?.includes('主机')),
    other: parts.filter(p =>
      !p.subcategory?.includes('显示屏') &&
      !p.subcategory?.includes('屏幕') &&
      !p.subcategory?.includes('仪表') &&
      !p.subcategory?.includes('音响') &&
      !p.subcategory?.includes('扬声器') &&
      !p.subcategory?.includes('喇叭') &&
      !p.subcategory?.includes('摄像头') &&
      !p.subcategory?.includes('camera') &&
      !p.subcategory?.includes('传感器') &&
      !p.subcategory?.includes('雷达') &&
      !p.subcategory?.includes('控制器') &&
      !p.subcategory?.includes('ECU') &&
      !p.subcategory?.includes('主机')
    ),
  };

  const handleAreaClick = (partType: keyof typeof electronicsParts) => {
    const partsList = electronicsParts[partType];
    if (partsList.length > 0) {
      setSelectedPart(partsList[0]);
    }
  };

  const getPartMaterials = (part: Part) => {
    return materials.filter(m => part.materials.includes(m.id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">智能电器零部件示意图</h2>
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
            {/* 汽车智能电器系统布局 */}

            {/* 车身轮廓 */}
            <path
              d="M 100 250 L 150 200 L 250 180 L 550 180 L 650 200 L 700 250 L 700 380 L 650 430 L 150 430 L 100 380 Z"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />

            {/* 中控显示屏 */}
            <rect
              x="480"
              y="240"
              width="140"
              height="100"
              rx="8"
              fill={hoveredPart === 'display' ? '#93c5fd' : '#dbeafe'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('display')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('display')}
            />
            {/* 屏幕边框细节 */}
            <rect
              x="490"
              y="250"
              width="120"
              height="80"
              rx="4"
              fill="#1e3a8a"
              opacity="0.2"
              className="pointer-events-none"
            />
            <text x="550" y="290" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              显示屏/仪表
            </text>
            <text x="550" y="310" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({electronicsParts.display.length}个部件)
            </text>

            {/* 摄像头 */}
            <g>
              {/* 前视摄像头 */}
              <circle
                cx="640"
                cy="220"
                r="25"
                fill={hoveredPart === 'camera' ? '#93c5fd' : '#f3f4f6'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('camera')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('camera')}
              />
              <circle cx="640" cy="220" r="10" fill="#374151" opacity="0.3" className="pointer-events-none" />

              {/* 后视摄像头 */}
              <circle
                cx="160"
                cy="260"
                r="20"
                fill={hoveredPart === 'camera' ? '#93c5fd' : '#f3f4f6'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('camera')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('camera')}
              />
              <circle cx="160" cy="260" r="8" fill="#374151" opacity="0.3" className="pointer-events-none" />

              <text x="640" y="270" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
                摄像头
              </text>
              <text x="640" y="285" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
                ({electronicsParts.camera.length})
              </text>
            </g>

            {/* 传感器/雷达 */}
            <g>
              {/* 前雷达 */}
              <rect
                x="630"
                y="360"
                width="50"
                height="30"
                rx="5"
                fill={hoveredPart === 'sensor' ? '#93c5fd' : '#e0e7ff'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('sensor')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('sensor')}
              />
              {/* 后雷达 */}
              <rect
                x="120"
                y="340"
                width="40"
                height="30"
                rx="5"
                fill={hoveredPart === 'sensor' ? '#93c5fd' : '#e0e7ff'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('sensor')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('sensor')}
              />
              <text x="655" y="410" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
                传感器/雷达
              </text>
              <text x="655" y="425" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
                ({electronicsParts.sensor.length})
              </text>
            </g>

            {/* 音响/扬声器 */}
            <g>
              {/* 前门扬声器 */}
              <circle
                cx="580"
                cy="320"
                r="30"
                fill={hoveredPart === 'audio' ? '#93c5fd' : '#fef3c7'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('audio')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('audio')}
              />
              <circle cx="580" cy="320" r="15" fill="none" stroke="#374151" strokeWidth="2" className="pointer-events-none" />

              {/* 后门扬声器 */}
              <circle
                cx="220"
                cy="320"
                r="25"
                fill={hoveredPart === 'audio' ? '#93c5fd' : '#fef3c7'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('audio')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('audio')}
              />
              <circle cx="220" cy="320" r="12" fill="none" stroke="#374151" strokeWidth="2" className="pointer-events-none" />

              <text x="400" y="370" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
                音响/扬声器 ({electronicsParts.audio.length}个部件)
              </text>
            </g>

            {/* 控制器/ECU/主机 */}
            <rect
              x="320"
              y="360"
              width="120"
              height="70"
              rx="8"
              fill={hoveredPart === 'control' ? '#93c5fd' : '#d1fae5'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('control')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('control')}
            />
            {/* ECU细节 */}
            <rect x="330" y="370" width="100" height="10" rx="2" fill="#065f46" opacity="0.2" className="pointer-events-none" />
            <rect x="330" y="385" width="100" height="10" rx="2" fill="#065f46" opacity="0.2" className="pointer-events-none" />
            <rect x="330" y="400" width="100" height="10" rx="2" fill="#065f46" opacity="0.2" className="pointer-events-none" />
            <text x="380" y="450" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
              控制器/ECU
            </text>
            <text x="380" y="465" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({electronicsParts.control.length}个部件)
            </text>

            {/* 其他智能电器 */}
            <ellipse
              cx="400"
              cy="510"
              rx="100"
              ry="40"
              fill={hoveredPart === 'other' ? '#93c5fd' : '#f3f4f6'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('other')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('other')}
            />
            <text x="400" y="510" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              其他智能电器
            </text>
            <text x="400" y="525" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({electronicsParts.other.length}个部件)
            </text>

            {/* 提示文字 */}
            <text x="400" y="575" textAnchor="middle" className="fill-gray-500 text-xs pointer-events-none">
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
        <h3 className="text-lg font-semibold mb-4">所有智能电器零部件</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries({
            '显示屏': electronicsParts.display,
            '音响': electronicsParts.audio,
            '摄像头': electronicsParts.camera,
            '传感器': electronicsParts.sensor,
            '控制器': electronicsParts.control,
            '其他': electronicsParts.other,
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
