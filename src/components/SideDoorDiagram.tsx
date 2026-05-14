import { useState, useRef } from 'react';
import type { SideDoorAssembly, SideDoorPart } from '../data/sideDoorAssembly';

interface SideDoorDiagramProps {
  assemblies: SideDoorAssembly[];
  selectedAssemblyId: string;
  selectedSubAssemblyId: string;
  onAssemblyClick: (assemblyId: string) => void;
  onSubAssemblyClick: (subAssemblyId: string) => void;
  onPartClick: (part: SideDoorPart) => void;
  selectedSideDoorPart: SideDoorPart | null;
}

export default function SideDoorDiagram({
  assemblies,
  selectedAssemblyId,
  onAssemblyClick,
  selectedSideDoorPart,
}: SideDoorDiagramProps) {
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

  const getFill = (assemblyId: string, defaultColor: string) => {
    if (isSelected(assemblyId)) return '#fbbf24';
    if (isHovered('zone-' + assemblyId)) return '#93c5fd';
    return defaultColor;
  };
  const getStroke = (assemblyId: string, defaultStroke = '#6b7280') => {
    if (isSelected(assemblyId)) return '#d97706';
    if (isHovered('zone-' + assemblyId)) return '#3b82f6';
    return defaultStroke;
  };
  const getStrokeW = (assemblyId: string) => isSelected(assemblyId) ? '3' : '1.5';

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

  // Zone helper
  const zone = (id: string, color: string) => ({
    fill: getFill(id, color),
    fillOpacity: 0.8,
    stroke: getStroke(id),
    strokeWidth: getStrokeW(id),
    className: 'cursor-pointer transition-all duration-150',
    onMouseEnter: () => setHoveredZone('zone-' + id),
    onMouseLeave: () => setHoveredZone(null),
    onClick: () => onAssemblyClick(id),
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">侧门系统示意图</h2>
          <p className="text-xs text-gray-500">点击图上区域查看零件清单 | 滚轮缩放，Ctrl+拖动平移</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setScale(p => Math.max(p / 1.2, 0.5))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">−</button>
          <span className="text-sm font-medium text-gray-700 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(p => Math.min(p * 1.2, 3))}
            className="px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">+</button>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">重置</button>
          {/* Legend */}
          <div className="flex items-center gap-2 ml-2 text-xs text-gray-600 flex-wrap">
            {[
              { id: 'sd-01', color: '#d1fae5', label: '外把手' },
              { id: 'sd-05', color: '#fce7f3', label: '静态密封' },
              { id: 'sd-06', color: '#dbeafe', label: '动态密封' },
              { id: 'sd-07', color: '#e0e7ff', label: '饰板' },
            ].map(({ id, color, label }) => (
              <span key={id} className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm border border-gray-400" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SVG Diagram */}
        <div className="lg:col-span-2">
          <div
            className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100"
            style={{ cursor: isPanning ? 'grabbing' : 'grab', height: '400px' }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 820 480"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <defs>
                <filter id="sd-shadow">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* ── Side-view car body ── */}
              {/* Main body silhouette */}
              <path
                d="M 80 260 L 130 200 L 200 155 L 330 140 L 500 140 L 590 160 L 640 200 L 680 260 L 700 320 L 700 400 L 80 400 L 60 340 Z"
                fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" filter="url(#sd-shadow)"
              />
              {/* Roof line */}
              <path d="M 200 155 L 330 140 L 500 140 L 590 160 L 640 200" fill="none" stroke="#64748b" strokeWidth="2.5" />
              {/* Windshield */}
              <path d="M 220 165 L 320 148 L 400 148 L 450 168 L 450 210 L 220 210 Z" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" opacity="0.7" />
              {/* Front door window */}
              <path d="M 462 168 L 550 160 L 590 175 L 590 215 L 462 215 Z" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" opacity="0.7" />
              {/* B pillar separator */}
              <rect x="455" y="148" width="10" height="70" fill="#94a3b8" rx="2" />
              {/* Door line (front door / rear door) */}
              <line x1="455" y1="218" x2="455" y2="395" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3" />
              {/* Wheel arches */}
              <ellipse cx="230" cy="400" rx="80" ry="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              <ellipse cx="560" cy="400" rx="80" ry="20" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
              {/* Wheels */}
              <ellipse cx="230" cy="408" rx="55" ry="30" fill="#334155" />
              <ellipse cx="230" cy="408" rx="30" ry="18" fill="#64748b" />
              <ellipse cx="560" cy="408" rx="55" ry="30" fill="#334155" />
              <ellipse cx="560" cy="408" rx="30" ry="18" fill="#64748b" />
              {/* Sill / rocker */}
              <rect x="155" y="380" width="480" height="18" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

              {/* ════════════════════════════════════════════
                   INTERACTIVE ZONES
              ════════════════════════════════════════════ */}

              {/* sd-01 车门外把手总成 - front & rear door handles */}
              <rect x="340" y="268" width="50" height="22" rx="6"
                {...zone('sd-01', '#d1fae5')} />
              <rect x="570" y="268" width="50" height="22" rx="6"
                {...zone('sd-01', '#d1fae5')} />
              <text x="365" y="283" textAnchor="middle" fontSize="8"
                className="fill-gray-700 pointer-events-none select-none font-medium">外把手</text>
              <text x="595" y="283" textAnchor="middle" fontSize="8"
                className="fill-gray-700 pointer-events-none select-none font-medium">外把手</text>

              {/* sd-02 尾门电撑杆总成 - rear hatch strut area */}
              <rect x="690" y="155" width="35" height="80" rx="6"
                {...zone('sd-02', '#fef3c7')} />
              <text x="707" y="190" textAnchor="middle" fontSize="8"
                style={{ writingMode: 'vertical-lr' }}
                className="fill-gray-700 pointer-events-none select-none font-medium">电撑杆</text>

              {/* sd-03 玻璃升降器总成 - inside door panel area */}
              <rect x="225" y="295" width="80" height="40" rx="6"
                {...zone('sd-03', '#fef9c3')} />
              <text x="265" y="319" textAnchor="middle" fontSize="8"
                className="fill-gray-700 pointer-events-none select-none font-medium">升降器</text>

              {/* sd-04 四门活动玻璃总成 - all window areas */}
              <rect x="225" y="150" width="215" height="55" rx="4"
                {...zone('sd-04', '#e0f2fe')} fillOpacity={0.4} />
              <rect x="465" y="153" width="120" height="55" rx="4"
                {...zone('sd-04', '#e0f2fe')} fillOpacity={0.4} />
              <text x="332" y="180" textAnchor="middle" fontSize="8"
                className="fill-sky-700 pointer-events-none select-none font-medium">活动玻璃导轨</text>

              {/* sd-05 静态密封 - window frame seals (thin strips) */}
              {/* Front door inner belt */}
              <rect x="222" y="210" width="225" height="10" rx="3"
                {...zone('sd-05', '#fce7f3')} />
              {/* Rear door inner belt */}
              <rect x="460" y="212" width="130" height="10" rx="3"
                {...zone('sd-05', '#fce7f3')} />
              {/* Front door outer belt top */}
              <rect x="222" y="142" width="225" height="8" rx="3"
                {...zone('sd-05', '#fce7f3')} />
              <text x="335" y="208" textAnchor="middle" fontSize="8"
                className="fill-pink-600 pointer-events-none select-none font-medium">静态密封</text>

              {/* sd-06 动态密封条 - door perimeter / sill seals */}
              {/* Front door sill */}
              <rect x="155" y="376" width="295" height="10" rx="3"
                {...zone('sd-06', '#dbeafe')} />
              {/* Rear door sill */}
              <rect x="455" y="376" width="185" height="10" rx="3"
                {...zone('sd-06', '#dbeafe')} />
              {/* Front door frame */}
              <rect x="156" y="220" width="8" height="155" rx="3"
                {...zone('sd-06', '#dbeafe')} />
              <text x="330" y="373" textAnchor="middle" fontSize="8"
                className="fill-blue-600 pointer-events-none select-none font-medium">动态密封条</text>

              {/* sd-07 B柱外饰板总成 */}
              <rect x="447" y="148" width="18" height="70" rx="3"
                {...zone('sd-07', '#e0e7ff')} />
              <text x="456" y="200" textAnchor="middle" fontSize="7"
                style={{ writingMode: 'vertical-lr' }}
                className="fill-indigo-600 pointer-events-none select-none font-medium">B柱饰板</text>

              {/* sd-08 后侧窗角窗总成 */}
              <rect x="600" y="148" width="40" height="60" rx="4"
                {...zone('sd-08', '#fef3c7')} />
              <text x="620" y="182" textAnchor="middle" fontSize="8"
                className="fill-amber-700 pointer-events-none select-none font-medium">角窗</text>

              {/* sd-09 前门低音扬声器支架 */}
              <rect x="200" y="335" width="55" height="35" rx="5"
                {...zone('sd-09', '#fae8ff')} />
              <text x="227" y="357" textAnchor="middle" fontSize="7"
                className="fill-purple-700 pointer-events-none select-none font-medium">扬声器架</text>
            </svg>
          </div>
        </div>

        {/* Right panel - selected info */}
        <div className="flex flex-col gap-3">
          {selectedAssemblyId ? (
            (() => {
              const a = getAssembly(selectedAssemblyId);
              if (!a) return null;
              return (
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                    <span>{a.icon}</span><span>{a.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {a.subAssemblies.length} 个分总成 · {getTotalParts(selectedAssemblyId)} 个零件
                  </p>
                  <div className="space-y-2">
                    {a.subAssemblies.map(sub => (
                      <div key={sub.id} className="text-xs">
                        <div className="font-medium text-gray-700 mb-1">└ {sub.name}（{sub.parts.length}件）</div>
                        {sub.parts.slice(0, 3).map(p => (
                          <div key={p.id} className="flex items-center gap-1 ml-3 text-gray-500">
                            <span className="text-gray-300">•</span>
                            <span className="flex-1 truncate">{p.name}</span>
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px]">{p.material}</span>
                          </div>
                        ))}
                        {sub.parts.length > 3 && (
                          <p className="ml-3 text-gray-400 text-[10px]">...还有 {sub.parts.length - 3} 个零件</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-500 mb-3">点击左侧图上区域查看零件信息</p>
              <div className="space-y-1">
                {assemblies.map(a => (
                  <button
                    key={a.id}
                    onClick={() => onAssemblyClick(a.id)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-white hover:shadow-sm transition-all text-left"
                  >
                    <span>{a.icon}</span>
                    <span className="flex-1 truncate">{a.name}</span>
                    <span className="text-xs text-gray-400">{getTotalParts(a.id)}件</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected part card */}
          {selectedSideDoorPart && (
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <p className="text-xs font-medium text-blue-700 mb-1">当前选中零件</p>
              <p className="text-sm font-semibold text-gray-900">{selectedSideDoorPart.name}</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{selectedSideDoorPart.material}</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">{selectedSideDoorPart.process}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
