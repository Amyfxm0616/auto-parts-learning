import { useState, useRef } from 'react';
import type { LightingAssembly, LightingPart } from '../data/lightingAssembly';

interface LightingDiagramProps {
  assemblies: LightingAssembly[];
  selectedAssemblyId: string;
  selectedSubAssemblyId: string;
  onAssemblyClick: (assemblyId: string) => void;
  onSubAssemblyClick: (subAssemblyId: string) => void;
  onPartClick: (part: LightingPart) => void;
  selectedLightingPart: LightingPart | null;
}

interface DiagramZone {
  id: string;
  assemblyId: string;
  label: string;
  icon: string;
  type: 'ellipse' | 'rect' | 'path';
  color: string;
  // ellipse props
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  // rect props
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  // path props
  d?: string;
}

export default function LightingDiagram({
  assemblies,
  selectedAssemblyId,
  selectedSubAssemblyId,
  onAssemblyClick,
  onSubAssemblyClick,
  onPartClick,
  selectedLightingPart,
}: LightingDiagramProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Zone definitions - car side view, front faces right
  const zones: DiagramZone[] = [
    // FRONT GROUP (right side of SVG) - warm yellow
    {
      id: 'zone-la-01',
      assemblyId: 'la-01',
      label: '前星环灯',
      icon: '💡',
      type: 'ellipse',
      color: '#fef3c7',
      cx: 650,
      cy: 270,
      rx: 55,
      ry: 35,
    },
    {
      id: 'zone-la-02',
      assemblyId: 'la-02',
      label: '前照灯',
      icon: '🚘',
      type: 'ellipse',
      color: '#fef3c7',
      cx: 660,
      cy: 370,
      rx: 55,
      ry: 50,
    },
    {
      id: 'zone-la-06',
      assemblyId: 'la-06',
      label: '前备箱灯',
      icon: '📦',
      type: 'rect',
      color: '#fef3c7',
      x: 590,
      y: 100,
      width: 70,
      height: 30,
    },
    // REAR GROUP (left side of SVG) - red
    {
      id: 'zone-la-03',
      assemblyId: 'la-03',
      label: '后背门灯',
      icon: '🔙',
      type: 'rect',
      color: '#fca5a5',
      x: 150,
      y: 190,
      width: 65,
      height: 40,
    },
    {
      id: 'zone-la-04',
      assemblyId: 'la-04',
      label: '尾灯',
      icon: '🔴',
      type: 'ellipse',
      color: '#fca5a5',
      cx: 130,
      cy: 370,
      rx: 50,
      ry: 55,
    },
    {
      id: 'zone-la-05',
      assemblyId: 'la-05',
      label: '牌照灯',
      icon: '🔢',
      type: 'rect',
      color: '#fca5a5',
      x: 90,
      y: 445,
      width: 65,
      height: 25,
    },
    // INTERIOR GROUP (center) - purple
    {
      id: 'zone-la-07',
      assemblyId: 'la-07',
      label: '室内顶灯',
      icon: '💡',
      type: 'rect',
      color: '#ddd6fe',
      x: 310,
      y: 115,
      width: 180,
      height: 30,
    },
    {
      id: 'zone-la-08',
      assemblyId: 'la-08',
      label: '氛围灯',
      icon: '✨',
      type: 'path',
      color: '#ddd6fe',
      d: 'M 240 220 L 320 220 L 340 420 L 220 420 Z',
    },
  ];

  const getAssembly = (assemblyId: string) => assemblies.find(a => a.id === assemblyId);
  const getTotalParts = (assemblyId: string) => {
    const a = getAssembly(assemblyId);
    if (!a) return 0;
    return a.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
  };

  const isSelected = (zone: DiagramZone) => selectedAssemblyId === zone.assemblyId;
  const isHovered = (zone: DiagramZone) => hoveredZone === zone.id;
  const isPartOfSelected = (zone: DiagramZone) => {
    // Also highlight if a child sub-assembly is selected
    if (!selectedSubAssemblyId) return isSelected(zone);
    const assembly = getAssembly(zone.assemblyId);
    return assembly?.subAssemblies.some(s => s.id === selectedSubAssemblyId) || false;
  };

  const handleZoneClick = (zone: DiagramZone) => {
    onAssemblyClick(zone.assemblyId);
  };

  // Zoom/Pan handlers
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(0.5, prev * delta), 3));
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  };

  const handlePanEnd = () => setIsPanning(false);

  const getFillColor = (zone: DiagramZone) => {
    if (isPartOfSelected(zone)) return '#fbbf24'; // amber selected
    if (isHovered(zone)) return '#93c5fd'; // blue hover
    return zone.color; // default group color
  };

  const getStrokeColor = (zone: DiagramZone) => {
    if (isPartOfSelected(zone)) return '#d97706'; // amber-600
    if (isHovered(zone)) return '#3b82f6'; // blue-500
    return '#6b7280'; // gray-500
  };

  const renderZone = (zone: DiagramZone) => {
    const fill = getFillColor(zone);
    const stroke = getStrokeColor(zone);
    const strokeW = isPartOfSelected(zone) ? '3' : '1.5';
    const partsCount = getTotalParts(zone.assemblyId);

    const commonProps = {
      fill,
      stroke,
      strokeWidth: strokeW,
      className: 'cursor-pointer transition-all duration-150',
      onMouseEnter: () => setHoveredZone(zone.id),
      onMouseLeave: () => setHoveredZone(null),
      onClick: () => handleZoneClick(zone),
    };

    let zoneElement: React.ReactNode = null;
    let labelX = 0;
    let labelY = 0;

    if (zone.type === 'ellipse' && zone.cx !== undefined && zone.cy !== undefined) {
      labelX = zone.cx;
      labelY = zone.cy;
      zoneElement = (
        <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry} {...commonProps} />
      );
    } else if (zone.type === 'rect' && zone.x !== undefined && zone.y !== undefined) {
      labelX = zone.x + (zone.width || 0) / 2;
      labelY = zone.y + (zone.height || 0) / 2;
      zoneElement = (
        <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} rx={6} {...commonProps} />
      );
    } else if (zone.type === 'path' && zone.d) {
      zoneElement = (
        <path d={zone.d} {...commonProps} />
      );
      // label at center of path bounding box
      labelX = 280;
      labelY = 320;
    }

    return (
      <g key={zone.id}>
        {zoneElement}
        {zone.type !== 'path' && (
          <>
            <text
              x={labelX}
              y={labelY - 5}
              textAnchor="middle"
              className="fill-gray-800 text-xs font-semibold pointer-events-none select-none"
            >
              {zone.icon} {zone.label}
            </text>
            <text
              x={labelX}
              y={labelY + 12}
              textAnchor="middle"
              className="fill-gray-600 text-[10px] pointer-events-none select-none"
            >
              {partsCount}个零件
            </text>
          </>
        )}
        {zone.type === 'path' && (
          <>
            <text
              x={labelX}
              y={labelY - 5}
              textAnchor="middle"
              className="fill-gray-800 text-xs font-semibold pointer-events-none select-none"
            >
              ✨ 氛围灯
            </text>
            <text
              x={labelX}
              y={labelY + 12}
              textAnchor="middle"
              className="fill-gray-600 text-[10px] pointer-events-none select-none"
            >
              {partsCount}个零件
            </text>
          </>
        )}
      </g>
    );
  };

  // Get parts for selected zone's info panel
  const selectedAssembly = selectedAssemblyId ? getAssembly(selectedAssemblyId) : null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">灯具总成示意图</h2>
          <p className="text-xs text-gray-500">
            点击图上区域查看总成零件 | 滚轮缩放，Ctrl+拖动平移
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(prev => Math.max(prev / 1.2, 0.5))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
            title="缩小"
          >
            −
          </button>
          <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(prev => Math.min(prev * 1.2, 3))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
            title="放大"
          >
            +
          </button>
          <button
            onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
          >
            重置
          </button>
          {/* Legend */}
          <div className="flex items-center gap-3 ml-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#fef3c7] border border-gray-400" /> 前部灯具
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#fca5a5] border border-gray-400" /> 后部灯具
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#ddd6fe] border border-gray-400" /> 内部灯具
            </span>
          </div>
        </div>
      </div>

      {/* Diagram + Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Diagram */}
        <div className="lg:col-span-2">
          <div
            className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
            style={{ cursor: isPanning ? 'grabbing' : 'grab', height: '380px' }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 800 500"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              {/* Car Body Outline - side view, front facing right */}
              <defs>
                <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Main car body */}
              <path
                d="M 160 200 L 200 170 L 300 150 L 480 150 L 580 170 L 620 200 L 650 200 L 660 220 L 670 230 L 670 420 L 660 450 L 640 460 L 580 470 L 200 470 L 150 460 L 130 450 L 125 430 L 125 330 L 130 310 L 150 280 L 160 200 Z"
                fill="#f9fafb"
                stroke="#9ca3af"
                strokeWidth="2"
                filter="url(#shadow)"
              />

              {/* Roof */}
              <path d="M 200 170 L 300 150 L 480 150 L 580 170" fill="none" stroke="#6b7280" strokeWidth="3" />

              {/* Windows */}
              <path d="M 225 175 L 295 158 L 380 158 L 430 172 L 430 195 L 225 195 Z" fill="#dbeafe" stroke="#9ca3af" strokeWidth="1" />
              <path d="M 450 172 L 510 160 L 555 172 L 555 195 L 450 195 Z" fill="#dbeafe" stroke="#9ca3af" strokeWidth="1" />

              {/* B-pillar */}
              <rect x="430" y="155" width="14" height="45" fill="#9ca3af" rx="2" />

              {/* Door line */}
              <line x1="225" y1="200" x2="225" y2="380" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3" />
              <line x1="555" y1="200" x2="555" y2="380" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,3" />

              {/* Wheels */}
              <ellipse cx="270" cy="470" rx="42" ry="38" fill="#374151" />
              <ellipse cx="270" cy="470" rx="22" ry="20" fill="#6b7280" />
              <ellipse cx="510" cy="470" rx="42" ry="38" fill="#374151" />
              <ellipse cx="510" cy="470" rx="22" ry="20" fill="#6b7280" />

              {/* Underbody line */}
              <line x1="190" y1="430" x2="590" y2="430" stroke="#d1d5db" strokeWidth="1" />

              {/* Interactive Zones */}
              {zones.map(zone => renderZone(zone))}

              {/* Bottom label */}
              <text x="400" y="495" textAnchor="middle" className="fill-gray-400 text-[10px] pointer-events-none">
                汽车侧视图 — 前方朝右
              </text>
            </svg>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-1">
          {selectedAssembly ? (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 h-full overflow-y-auto max-h-[380px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedAssembly.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedAssembly.name}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {selectedAssembly.subAssemblies.length} 个分总成 · {getTotalParts(selectedAssembly.id)} 个零件
              </p>
              <div className="space-y-1">
                {selectedAssembly.subAssemblies.map((sub) => (
                  <div key={sub.id}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        selectedSubAssemblyId === sub.id
                          ? 'bg-blue-200 text-blue-800 font-medium'
                          : 'text-gray-700 hover:bg-blue-100'
                      }`}
                      onClick={() => onSubAssemblyClick(sub.id)}
                    >
                      {sub.name}
                      <span className="ml-1 text-gray-400">({sub.parts.length}件)</span>
                    </button>
                    {/* Show part list if sub-assembly is selected */}
                    {selectedSubAssemblyId === sub.id && (
                      <div className="ml-2 mt-0.5 space-y-0.5">
                        {sub.parts.map((part) => (
                          <button
                            key={part.id}
                            className={`w-full text-left px-2 py-0.5 rounded text-[11px] transition-colors flex items-center justify-between ${
                              selectedLightingPart?.id === part.id
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
                <p className="text-sm text-gray-500 mb-1">点击图上区域</p>
                <p className="text-xs text-gray-400">查看灯具总成零件清单</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}