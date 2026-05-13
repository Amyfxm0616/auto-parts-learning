import { useState, useRef } from 'react';
import type { BodyTrimAssembly, BodyTrimPart } from '../data/bodyTrimAssembly';

interface BodyTrimDiagramProps {
  assemblies: BodyTrimAssembly[];
  selectedAssemblyId: string;
  selectedSubAssemblyId: string;
  onAssemblyClick: (assemblyId: string) => void;
  onSubAssemblyClick: (subAssemblyId: string) => void;
  onPartClick: (part: BodyTrimPart) => void;
  selectedBodyTrimPart: BodyTrimPart | null;
}

export default function BodyTrimDiagram({
  assemblies,
  selectedAssemblyId,
  selectedSubAssemblyId,
  onAssemblyClick,
  onSubAssemblyClick,
  onPartClick,
  selectedBodyTrimPart,
}: BodyTrimDiagramProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getAssembly = (id: string) => assemblies.find(a => a.id === id);
  const getTotalParts = (id: string) => {
    const a = getAssembly(id);
    return a ? a.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0) : 0;
  };

  const isSelected = (assemblyId: string) => selectedAssemblyId === assemblyId;
  const isHovered = (zoneId: string) => hoveredZone === zoneId;
  const isPartOfSelected = (assemblyId: string) => {
    if (!selectedSubAssemblyId) return isSelected(assemblyId);
    return getAssembly(assemblyId)?.subAssemblies.some(s => s.id === selectedSubAssemblyId) ?? false;
  };

  const getFill = (assemblyId: string, defaultColor: string) => {
    if (isPartOfSelected(assemblyId)) return '#fbbf24';
    if (isHovered('zone-' + assemblyId)) return '#93c5fd';
    return defaultColor;
  };
  const getStroke = (assemblyId: string) => {
    if (isPartOfSelected(assemblyId)) return '#d97706';
    if (isHovered('zone-' + assemblyId)) return '#3b82f6';
    return '#6b7280';
  };
  const getStrokeW = (assemblyId: string) => isPartOfSelected(assemblyId) ? '3' : '1.5';

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    setScale(p => Math.min(Math.max(0.5, p * (e.deltaY > 0 ? 0.9 : 1.1)), 3));
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
          <h2 className="text-lg font-semibold text-gray-900">外观及功能饰件示意图</h2>
          <p className="text-xs text-gray-500">点击图上区域查看零件清单 | 滚轮缩放，Ctrl+拖动平移</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(p => Math.max(p / 1.2, 0.5))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">−</button>
          <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(p => Math.min(p * 1.2, 3))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">+</button>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">重置</button>
          <div className="flex items-center gap-3 ml-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#d1fae5] border border-gray-400" /> 外观饰件
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded-sm bg-[#e0e7ff] border border-gray-400" /> 功能饰件
            </span>
          </div>
        </div>
      </div>

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
              <defs>
                <filter id="bt-shadow">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* ── Car body outline (non-interactive) ── */}
              {/* Main body */}
              <path
                d="M 155 200 L 200 168 L 305 148 L 485 148 L 582 168 L 622 200 L 652 200 L 662 222 L 672 232 L 672 420 L 660 450 L 638 460 L 578 470 L 198 470 L 148 460 L 128 448 L 124 428 L 124 328 L 130 308 L 148 278 L 155 200 Z"
                fill="#f9fafb" stroke="#9ca3af" strokeWidth="2" filter="url(#bt-shadow)"
              />
              {/* Roof */}
              <path d="M 200 168 L 305 148 L 485 148 L 582 168" fill="none" stroke="#6b7280" strokeWidth="3" />
              {/* Windows */}
              <path d="M 225 173 L 298 155 L 382 155 L 432 170 L 432 194 L 225 194 Z" fill="#dbeafe" stroke="#9ca3af" strokeWidth="1" />
              <path d="M 450 170 L 512 158 L 558 170 L 558 194 L 450 194 Z" fill="#dbeafe" stroke="#9ca3af" strokeWidth="1" />
              <rect x="432" y="152" width="14" height="46" fill="#9ca3af" rx="2" />
              <line x1="225" y1="198" x2="225" y2="380" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />
              <line x1="558" y1="198" x2="558" y2="380" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="4,3" />
              {/* Wheels */}
              <ellipse cx="268" cy="470" rx="42" ry="38" fill="#374151" />
              <ellipse cx="268" cy="470" rx="22" ry="20" fill="#6b7280" />
              <ellipse cx="508" cy="470" rx="42" ry="38" fill="#374151" />
              <ellipse cx="508" cy="470" rx="22" ry="20" fill="#6b7280" />
              {/* Underbody */}
              <line x1="188" y1="430" x2="590" y2="430" stroke="#d1d5db" strokeWidth="1" />

              {/* ── Zone: 外观饰件 (bt-ext) ── overlay on car exterior */}
              {/* Front bumper area */}
              <rect
                x="625" y="210" width="48" height="205" rx="8"
                fill={getFill('bt-ext', '#d1fae5')} fillOpacity="0.75"
                stroke={getStroke('bt-ext')} strokeWidth={getStrokeW('bt-ext')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-ext')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-ext')}
              />
              {/* Rear bumper area */}
              <rect
                x="125" y="210" width="48" height="210" rx="8"
                fill={getFill('bt-ext', '#d1fae5')} fillOpacity="0.75"
                stroke={getStroke('bt-ext')} strokeWidth={getStrokeW('bt-ext')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-ext')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-ext')}
              />
              {/* Side sill / door lower trim */}
              <rect
                x="200" y="380" width="380" height="50" rx="6"
                fill={getFill('bt-ext', '#d1fae5')} fillOpacity="0.75"
                stroke={getStroke('bt-ext')} strokeWidth={getStrokeW('bt-ext')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-ext')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-ext')}
              />
              {/* Spoiler area */}
              <rect
                x="130" y="148" width="80" height="30" rx="6"
                fill={getFill('bt-ext', '#d1fae5')} fillOpacity="0.75"
                stroke={getStroke('bt-ext')} strokeWidth={getStrokeW('bt-ext')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-ext')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-ext')}
              />
              {/* exterior label */}
              <text x="649" y="305" textAnchor="middle" fontSize="10" className="fill-gray-700 font-semibold pointer-events-none select-none" style={{writingMode: 'vertical-lr'}}>外观饰件</text>
              <text x="649" y="350" textAnchor="middle" fontSize="9" className="fill-gray-500 pointer-events-none select-none" style={{writingMode: 'vertical-lr'}}>
                {getTotalParts('bt-ext')}件
              </text>

              {/* ── Zone: 功能饰件 (bt-func) ── overlay on underbody + engine bay */}
              {/* Underbody protection */}
              <rect
                x="210" y="432" width="360" height="30" rx="6"
                fill={getFill('bt-func', '#e0e7ff')} fillOpacity="0.85"
                stroke={getStroke('bt-func')} strokeWidth={getStrokeW('bt-func')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-func')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-func')}
              />
              {/* Engine/front-trunk bay area */}
              <rect
                x="585" y="155" width="80" height="80" rx="8"
                fill={getFill('bt-func', '#e0e7ff')} fillOpacity="0.85"
                stroke={getStroke('bt-func')} strokeWidth={getStrokeW('bt-func')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-func')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-func')}
              />
              {/* Wheel arch areas */}
              <ellipse
                cx="268" cy="432" rx="38" ry="14"
                fill={getFill('bt-func', '#e0e7ff')} fillOpacity="0.85"
                stroke={getStroke('bt-func')} strokeWidth={getStrokeW('bt-func')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-func')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-func')}
              />
              <ellipse
                cx="508" cy="432" rx="38" ry="14"
                fill={getFill('bt-func', '#e0e7ff')} fillOpacity="0.85"
                stroke={getStroke('bt-func')} strokeWidth={getStrokeW('bt-func')}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredZone('zone-bt-func')}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => onAssemblyClick('bt-func')}
              />
              {/* functional labels */}
              <text x="390" y="452" textAnchor="middle" fontSize="10" className="fill-gray-700 font-semibold pointer-events-none select-none">
                🔩 功能饰件 · {getTotalParts('bt-func')}件
              </text>
              <text x="625" y="188" textAnchor="middle" fontSize="9" className="fill-gray-600 pointer-events-none select-none">前舱</text>
              <text x="625" y="200" textAnchor="middle" fontSize="9" className="fill-gray-600 pointer-events-none select-none">功能件</text>

              {/* exterior zone labels */}
              <text x="649" y="250" textAnchor="middle" fontSize="11" className="fill-green-700 font-bold pointer-events-none select-none" style={{writingMode: 'vertical-lr'}}>
                🚗 外观饰件
              </text>

              {/* Bottom caption */}
              <text x="400" y="495" textAnchor="middle" fontSize="11" className="fill-gray-400 pointer-events-none select-none">
                汽车侧视图 — 前方朝右
              </text>
            </svg>
          </div>
        </div>

        {/* Right info panel */}
        <div className="lg:col-span-1">
          {selectedAssembly ? (
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 h-full overflow-y-auto max-h-[380px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedAssembly.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedAssembly.name}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                {selectedAssembly.subAssemblies.length} 个分总成 · {getTotalParts(selectedAssembly.id)} 个零件
              </p>
              <div className="space-y-1">
                {selectedAssembly.subAssemblies.map(sub => (
                  <div key={sub.id}>
                    <button
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                        selectedSubAssemblyId === sub.id
                          ? 'bg-emerald-200 text-emerald-900 font-medium'
                          : 'text-gray-700 hover:bg-emerald-100'
                      }`}
                      onClick={() => onSubAssemblyClick(sub.id)}
                    >
                      {sub.name}
                      <span className="ml-1 text-gray-400">({sub.parts.length}件)</span>
                    </button>
                    {selectedSubAssemblyId === sub.id && (
                      <div className="ml-2 mt-0.5 space-y-0.5">
                        {sub.parts.map(part => (
                          <button
                            key={part.id}
                            className={`w-full text-left px-2 py-0.5 rounded text-[11px] flex items-center justify-between transition-colors ${
                              selectedBodyTrimPart?.id === part.id
                                ? 'bg-emerald-300 text-emerald-900'
                                : 'text-gray-500 hover:bg-emerald-50'
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
                <p className="text-xs text-gray-400">查看饰件零件清单</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
