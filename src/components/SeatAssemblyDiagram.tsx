import { useState, useRef } from 'react';
import type { SeatAssembly, SeatPart } from '../data/seatAssembly';

interface SeatAssemblyDiagramProps {
  assemblies: SeatAssembly[];
  selectedAssemblyId: string;
  selectedSubAssemblyId: string;
  onAssemblyClick: (assemblyId: string) => void;
  onSubAssemblyClick: (subAssemblyId: string) => void;
  onPartClick: (part: SeatPart) => void;
  selectedSeatPart: SeatPart | null;
}

interface DiagramZone {
  id: string;
  assemblyId: string;
  label: string;
  icon: string;
  color: string;
  // SVG path data
  d: string;
  // label position
  labelX: number;
  labelY: number;
}

export default function SeatAssemblyDiagram({
  assemblies,
  selectedAssemblyId,
  selectedSubAssemblyId,
  onAssemblyClick,
  onSubAssemblyClick,
  onPartClick,
  selectedSeatPart,
}: SeatAssemblyDiagramProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const zones: DiagramZone[] = [
    {
      id: 'zone-sa-01',
      assemblyId: 'sa-01',
      label: '前排座椅',
      icon: '🪑',
      color: '#fde68a',
      // Front seat outline
      d: 'M 160 90 Q 200 60 260 60 Q 320 60 360 90 L 360 120 Q 340 110 260 110 Q 180 110 160 120 Z M 170 125 L 350 125 L 355 370 Q 340 385 260 385 Q 180 385 165 370 Z M 145 375 L 385 375 L 390 450 Q 380 470 260 470 Q 140 470 130 450 Z M 145 455 L 175 455 L 185 490 L 160 490 Z M 375 455 L 405 455 L 415 490 L 390 490 Z',
      labelX: 260,
      labelY: 280,
    },
    {
      id: 'zone-sa-02',
      assemblyId: 'sa-02',
      label: '二排座椅总成',
      icon: '🛋️',
      color: '#bfdbfe',
      // Rear seat outline (wider, lower, bench style)
      d: 'M 480 130 L 730 130 L 735 160 Q 720 155 605 155 Q 490 155 475 160 Z M 480 165 L 730 165 L 735 365 Q 720 380 605 380 Q 490 380 475 365 Z M 460 375 L 750 375 L 755 450 Q 740 465 605 465 Q 470 465 455 450 Z',
      labelX: 605,
      labelY: 280,
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
    if (!selectedSubAssemblyId) return isSelected(zone);
    const assembly = getAssembly(zone.assemblyId);
    return assembly?.subAssemblies.some(s => s.id === selectedSubAssemblyId) || false;
  };

  const getFillColor = (zone: DiagramZone) => {
    if (isPartOfSelected(zone)) return '#fbbf24';
    if (isHovered(zone)) return '#93c5fd';
    return zone.color;
  };

  const getStrokeColor = (zone: DiagramZone) => {
    if (isPartOfSelected(zone)) return '#d97706';
    if (isHovered(zone)) return '#3b82f6';
    return '#6b7280';
  };

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
    if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };

  const handlePanEnd = () => setIsPanning(false);

  const selectedAssembly = selectedAssemblyId ? getAssembly(selectedAssemblyId) : null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">座椅总成示意图</h2>
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
          <div className="flex items-center gap-3 ml-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#fde68a] border border-gray-400" /> 前排座椅
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#bfdbfe] border border-gray-400" /> 二排座椅
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
              viewBox="0 0 800 510"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <defs>
                <filter id="seat-shadow" x="-5%" y="-5%" width="110%" height="110%">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* ── 前排座椅轮廓 (背景, 非交互) ── */}
              {/* Headrest body */}
              <ellipse cx="260" cy="90" rx="100" ry="55" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Backrest body */}
              <rect x="162" y="120" width="196" height="250" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Cushion body */}
              <rect x="140" y="368" width="240" height="90" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Seat legs */}
              <rect x="155" y="455" width="22" height="38" rx="4" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              <rect x="343" y="455" width="22" height="38" rx="4" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1" />
              {/* Headrest rod */}
              <rect x="230" y="108" width="10" height="20" rx="2" fill="#d1d5db" />
              <rect x="278" y="108" width="10" height="20" rx="2" fill="#d1d5db" />

              {/* ── 二排座椅轮廓 (背景, 非交互) ── */}
              {/* Headrest area */}
              <rect x="485" y="98" width="230" height="65" rx="10" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Backrest */}
              <rect x="482" y="160" width="236" height="210" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Cushion */}
              <rect x="462" y="368" width="276" height="82" rx="12" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" filter="url(#seat-shadow)" />
              {/* Divide 60/40 backrest */}
              <line x1="643" y1="160" x2="643" y2="370" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,3" />
              <text x="563" y="182" textAnchor="middle" className="fill-gray-400 pointer-events-none select-none" fontSize="11">60%</text>
              <text x="706" y="182" textAnchor="middle" className="fill-gray-400 pointer-events-none select-none" fontSize="11">40%</text>

              {/* ── 交互区域 ── */}
              {zones.map(zone => {
                const fill = getFillColor(zone);
                const stroke = getStrokeColor(zone);
                const strokeW = isPartOfSelected(zone) ? '3' : '1.5';
                const partsCount = getTotalParts(zone.assemblyId);
                const assembly = getAssembly(zone.assemblyId);
                return (
                  <g key={zone.id}>
                    {zone.assemblyId === 'sa-01' ? (
                      <>
                        {/* Front seat clickable overlay */}
                        <ellipse
                          cx="260" cy="90" rx="100" ry="55"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                        <rect
                          x="162" y="120" width="196" height="250" rx="12"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                        <rect
                          x="140" y="368" width="240" height="90" rx="12"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                      </>
                    ) : (
                      <>
                        {/* Rear seat clickable overlay */}
                        <rect
                          x="485" y="98" width="230" height="65" rx="10"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                        <rect
                          x="482" y="160" width="236" height="210" rx="12"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                        <rect
                          x="462" y="368" width="276" height="82" rx="12"
                          fill={fill} fillOpacity="0.6"
                          stroke={stroke} strokeWidth={strokeW}
                          className="cursor-pointer transition-all duration-150"
                          onMouseEnter={() => setHoveredZone(zone.id)}
                          onMouseLeave={() => setHoveredZone(null)}
                          onClick={() => onAssemblyClick(zone.assemblyId)}
                        />
                      </>
                    )}
                    {/* Zone label */}
                    <text
                      x={zone.labelX}
                      y={zone.labelY - 10}
                      textAnchor="middle"
                      className="fill-gray-800 font-semibold pointer-events-none select-none"
                      fontSize="13"
                    >
                      {zone.icon} {zone.label}
                    </text>
                    <text
                      x={zone.labelX}
                      y={zone.labelY + 10}
                      textAnchor="middle"
                      className="fill-gray-600 pointer-events-none select-none"
                      fontSize="11"
                    >
                      {assembly?.subAssemblies.length}个分总成 · {partsCount}个零件
                    </text>
                  </g>
                );
              })}

              {/* Bottom label */}
              <text x="400" y="502" textAnchor="middle" className="fill-gray-400 pointer-events-none select-none" fontSize="11">
                座椅侧视示意图 — 前排（左）· 二排（右）
              </text>
            </svg>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-1">
          {selectedAssembly ? (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 h-full overflow-y-auto max-h-[380px]">
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
                          ? 'bg-amber-200 text-amber-900 font-medium'
                          : 'text-gray-700 hover:bg-amber-100'
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
                              selectedSeatPart?.id === part.id
                                ? 'bg-amber-300 text-amber-900'
                                : 'text-gray-500 hover:bg-amber-50'
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
                <p className="text-xs text-gray-400">查看座椅总成零件清单</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
