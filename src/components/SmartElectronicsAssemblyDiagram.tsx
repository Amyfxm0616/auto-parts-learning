import { useState, useRef } from 'react';
import type { SmartElectronicsAssembly, SmartElectronicsPart } from '../data/smartElectronicsAssembly';

interface SmartElectronicsAssemblyDiagramProps {
  assemblies: SmartElectronicsAssembly[];
  selectedAssemblyId: string;
  selectedSubAssemblyId: string;
  onAssemblyClick: (assemblyId: string) => void;
  onSubAssemblyClick: (subAssemblyId: string) => void;
  onPartClick: (part: SmartElectronicsPart) => void;
  selectedPart: SmartElectronicsPart | null;
}

interface DiagramZone {
  id: string;
  assemblyId: string;
  label: string;
  icon: string;
  type: 'ellipse' | 'rect';
  color: string;
  cx?: number; cy?: number; rx?: number; ry?: number;
  x?: number; y?: number; width?: number; height?: number;
}

const ZONE_COLORS: Record<string, string> = {
  'se-01': '#dbeafe', // 蓝 - 供配电
  'se-02': '#fef3c7', // 黄 - 座椅开关
  'se-03': '#d1fae5', // 绿 - 玻璃升降
  'se-04': '#ede9fe', // 紫 - 组合开关
  'se-05': '#fce7f3', // 粉 - 尾门开关
  'se-06': '#ffedd5', // 橙 - 方向盘
  'se-07': '#fee2e2', // 红 - 制动灯
  'se-08': '#e0f2fe', // 天蓝 - 前雨刮
  'se-09': '#f0fdf4', // 浅绿 - 后雨刮
};

const zones: DiagramZone[] = [
  // 前雨刮 - 前风挡上方
  { id: 'z-se-08', assemblyId: 'se-08', label: '前雨刮总成', icon: '🌧️', type: 'rect', color: ZONE_COLORS['se-08'], x: 230, y: 40, width: 220, height: 50 },
  // 后雨刮 - 后风挡上方
  { id: 'z-se-09', assemblyId: 'se-09', label: '后雨刮总成', icon: '🌦️', type: 'rect', color: ZONE_COLORS['se-09'], x: 520, y: 40, width: 160, height: 50 },
  // 方向盘调节开关 - 左上
  { id: 'z-se-06', assemblyId: 'se-06', label: '方向盘调节', icon: '🎯', type: 'ellipse', color: ZONE_COLORS['se-06'], cx: 160, cy: 230, rx: 65, ry: 45 },
  // 组合开关 - 方向柱
  { id: 'z-se-04', assemblyId: 'se-04', label: '组合开关总成', icon: '🔄', type: 'rect', color: ZONE_COLORS['se-04'], x: 90, y: 290, width: 130, height: 70 },
  // 玻璃升降开关 - 门把手区域
  { id: 'z-se-03', assemblyId: 'se-03', label: '玻璃升降开关', icon: '🪟', type: 'rect', color: ZONE_COLORS['se-03'], x: 80, y: 390, width: 160, height: 70 },
  // 低压供配电 - 中央区域
  { id: 'z-se-01', assemblyId: 'se-01', label: '低压供配电电源', icon: '⚡', type: 'ellipse', color: ZONE_COLORS['se-01'], cx: 400, cy: 270, rx: 90, ry: 55 },
  // 座椅开关 - 右侧中间
  { id: 'z-se-02', assemblyId: 'se-02', label: '座椅开关总成', icon: '🎛️', type: 'rect', color: ZONE_COLORS['se-02'], x: 530, y: 220, width: 160, height: 80 },
  // 尾门开关 - 右上
  { id: 'z-se-05', assemblyId: 'se-05', label: '尾门开关总成', icon: '🚪', type: 'rect', color: ZONE_COLORS['se-05'], x: 560, y: 340, width: 140, height: 70 },
  // 制动灯开关 - 左下
  { id: 'z-se-07', assemblyId: 'se-07', label: '制动灯开关', icon: '🛑', type: 'ellipse', color: ZONE_COLORS['se-07'], cx: 200, cy: 510, rx: 80, ry: 40 },
];

export default function SmartElectronicsAssemblyDiagram({
  assemblies,
  selectedAssemblyId,
  selectedSubAssemblyId,
  onAssemblyClick,
  onSubAssemblyClick,
  onPartClick,
  selectedPart,
}: SmartElectronicsAssemblyDiagramProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(prev => Math.min(Math.max(0.4, prev * (e.deltaY > 0 ? 0.9 : 1.1)), 3));
  };
  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };
  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  const handlePanEnd = () => setIsPanning(false);

  const getZoneFill = (zone: DiagramZone) => {
    if (hoveredZone === zone.id || selectedAssemblyId === zone.assemblyId) {
      return zone.color.replace('fe', 'c7').replace('fae5', 'e7ff').replace('dbeafe', '93c5fd')
        .replace('fef3c7', 'fde68a').replace('d1fae5', '6ee7b7').replace('ede9fe', 'c4b5fd')
        .replace('fce7f3', 'f9a8d4').replace('ffedd5', 'fdba74').replace('fee2e2', 'fca5a5')
        .replace('e0f2fe', '7dd3fc').replace('f0fdf4', 'bbf7d0');
    }
    return zone.color;
  };

  const handleZoneClick = (zone: DiagramZone) => {
    onAssemblyClick(zone.assemblyId);
    // 自动展开第一个分总成
    const assembly = assemblies.find(a => a.id === zone.assemblyId);
    if (assembly && assembly.subAssemblies.length > 0) {
      onSubAssemblyClick(assembly.subAssemblies[0].id);
    }
  };

  const totalParts = assemblies.reduce(
    (sum, a) => sum + a.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0),
    0
  );

  const selectedAssembly = selectedAssemblyId ? assemblies.find(a => a.id === selectedAssemblyId) : null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">智能电器总成示意图</h2>
          <p className="text-xs text-gray-500">
            点击图上区域查看总成零件 | 滚轮缩放，Ctrl+拖动平移
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(p => Math.max(p / 1.2, 0.4))} className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">−</button>
          <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(p => Math.min(p * 1.2, 3))} className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">+</button>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }} className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">重置</button>
          <span className="ml-1 text-xs text-gray-500">{assemblies.length} 个总成 · {totalParts} 个零件</span>
        </div>
      </div>

      {/* 图 + 右侧信息面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG 图区 */}
        <div className="lg:col-span-2">
          <div
            className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-slate-50 to-blue-50"
            style={{ height: 380, cursor: isPanning ? 'grabbing' : 'grab' }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 750 580"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transition: isPanning ? 'none' : 'transform 0.15s ease-out',
                transformOrigin: 'center center',
              }}
            >
              {/* 车身轮廓 */}
              <path
                d="M 70 440 L 100 360 L 120 280 L 170 200 L 260 150 L 490 150 L 600 200 L 650 280 L 680 380 L 680 480 L 620 520 L 130 520 Z"
                fill="none" stroke="#d1d5db" strokeWidth="2" strokeDasharray="6,4"
              />
              {/* 车顶分隔线 */}
              <line x1="230" y1="150" x2="230" y2="90" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="520" y1="150" x2="520" y2="90" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />

              {/* 底部说明 */}
              <text x="375" y="570" textAnchor="middle" fontSize="11" fill="#9ca3af">智能电器系统分布示意图</text>

              {/* 渲染各区域 */}
              {zones.map((zone) => {
                const fill = getZoneFill(zone);
                const isSelected = selectedAssemblyId === zone.assemblyId;
                const strokeColor = isSelected ? '#3b82f6' : '#6b7280';
                const strokeWidth = isSelected ? 2.5 : 1.5;
                const assembly = assemblies.find(a => a.id === zone.assemblyId);
                const partCount = assembly?.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0) ?? 0;

                return (
                  <g key={zone.id} className="cursor-pointer" onClick={() => handleZoneClick(zone)}
                    onMouseEnter={() => setHoveredZone(zone.id)} onMouseLeave={() => setHoveredZone(null)}>
                    {zone.type === 'ellipse' ? (
                      <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry}
                        fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
                    ) : (
                      <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height}
                        rx="8" fill={fill} stroke={strokeColor} strokeWidth={strokeWidth} />
                    )}
                    <text
                      x={zone.type === 'ellipse' ? zone.cx : (zone.x! + zone.width! / 2)}
                      y={zone.type === 'ellipse' ? (zone.cy! - 10) : (zone.y! + zone.height! / 2 - 6)}
                      textAnchor="middle" fontSize="16" className="pointer-events-none select-none"
                    >{zone.icon}</text>
                    <text
                      x={zone.type === 'ellipse' ? zone.cx : (zone.x! + zone.width! / 2)}
                      y={zone.type === 'ellipse' ? (zone.cy! + 8) : (zone.y! + zone.height! / 2 + 8)}
                      textAnchor="middle" fontSize="10" fontWeight={isSelected ? 700 : 400}
                      fill={isSelected ? '#1d4ed8' : '#374151'} className="pointer-events-none select-none"
                    >{zone.label}</text>
                    <text
                      x={zone.type === 'ellipse' ? zone.cx : (zone.x! + zone.width! / 2)}
                      y={zone.type === 'ellipse' ? (zone.cy! + 22) : (zone.y! + zone.height! / 2 + 22)}
                      textAnchor="middle" fontSize="9" fill="#6b7280" className="pointer-events-none select-none"
                    >{partCount}个零件</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className="lg:col-span-1">
          {selectedAssembly ? (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 h-full overflow-y-auto max-h-[380px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedAssembly.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedAssembly.name}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {selectedAssembly.subAssemblies.length} 个分总成 · {selectedAssembly.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0)} 个零件
              </p>
              <div className="space-y-1">
                {selectedAssembly.subAssemblies.map((sub) => (
                  <div key={sub.id}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        selectedSubAssemblyId === sub.id
                          ? 'bg-blue-200 text-blue-900 font-medium'
                          : 'text-gray-700 hover:bg-blue-100'
                      }`}
                      onClick={() => onSubAssemblyClick(sub.id)}
                    >
                      {sub.name}
                      <span className="ml-1 text-gray-400">({sub.parts.length}件)</span>
                    </button>
                    {selectedSubAssemblyId === sub.id && (
                      <div className="ml-2 mt-0.5 space-y-0.5">
                        {sub.parts.map((part) => (
                          <button
                            key={part.id}
                            className={`w-full text-left px-2 py-0.5 rounded text-[11px] transition-colors flex items-center justify-between ${
                              selectedPart?.id === part.id
                                ? 'bg-blue-300 text-blue-900'
                                : 'text-gray-500 hover:bg-blue-50'
                            }`}
                            onClick={() => onPartClick(part)}
                          >
                            <span className="truncate">• {part.name}</span>
                            <span className="text-[10px] text-gray-400 ml-1 flex-shrink-0">{part.material}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl mb-2">⚡</p>
                <p className="text-sm text-gray-500 mb-1">点击图上区域</p>
                <p className="text-xs text-gray-400">查看智能电器总成零件清单</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1">
        {assemblies.map(a => (
          <button key={a.id}
            onClick={() => onAssemblyClick(a.id)}
            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
              selectedAssemblyId === a.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <span>{a.icon}</span>
            <span>{a.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
