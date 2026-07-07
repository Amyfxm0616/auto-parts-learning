import { useMemo, useRef, useState } from 'react';
import {
  CHASSIS_COLOR_MAP,
  CHASSIS_DIAGRAM_ZONES,
  chassisSubsystems,
  type ChassisSubsystem,
} from '../data/chassisAssembly';

interface ChassisSystemDiagramProps {
  selectedSubsystemId: ChassisSubsystem['id'] | '';
  onSubsystemSelect: (subsystemId: ChassisSubsystem['id']) => void;
}

export default function ChassisSystemDiagram({
  selectedSubsystemId,
  onSubsystemSelect,
}: ChassisSystemDiagramProps) {
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const totalAssemblies = useMemo(
    () => chassisSubsystems.reduce((sum, subsystem) => sum + subsystem.assemblies.length, 0),
    [],
  );
  const totalParts = useMemo(
    () =>
      chassisSubsystems.reduce(
        (sum, subsystem) =>
          sum +
          subsystem.assemblies.reduce(
            (assemblySum, assembly) =>
              assemblySum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
            0,
          ),
        0,
      ),
    [],
  );

  const selectedSubsystem = chassisSubsystems.find(subsystem => subsystem.id === selectedSubsystemId) ?? null;

  const getZoneFill = (subsystem: ChassisSubsystem, zoneId: string) => {
    const colors = CHASSIS_COLOR_MAP[subsystem.colorKey];
    if (selectedSubsystemId === subsystem.id || hoveredZoneId === zoneId) {
      return colors.svgFillStrong;
    }
    return colors.svgFill;
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setScale(previous => Math.min(Math.max(0.5, previous * (event.deltaY > 0 ? 0.92 : 1.08)), 2.8));
  };

  const handlePanStart = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
      event.preventDefault();
      setIsPanning(true);
      setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    }
  };

  const handlePanMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({ x: event.clientX - panStart.x, y: event.clientY - panStart.y });
  };

  const handlePanEnd = () => setIsPanning(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">底盘系统统一示意图</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            点击区域联动左侧树形导航，仅高亮到子系统层级；滚轮缩放，Ctrl+拖动平移
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
          <button
            onClick={() => setScale(previous => Math.max(previous / 1.15, 0.5))}
            className="px-2.5 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            −
          </button>
          <span className="min-w-[54px] text-center font-medium">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(previous => Math.min(previous * 1.15, 2.8))}
            className="px-2.5 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            +
          </button>
          <button
            onClick={() => {
              setScale(1);
              setPan({ x: 0, y: 0 });
            }}
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            重置
          </button>
          <span className="ml-1 text-gray-500 dark:text-gray-400">
            {chassisSubsystems.length} 个子系统 · {totalAssemblies} 个总成 · {totalParts} 个零件
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-0">
        <div className="p-4">
          <div
            className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            style={{ height: 420, cursor: isPanning ? 'grabbing' : 'grab' }}
            onWheel={handleWheel}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 820 460"
              className="w-full h-full"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.12s ease-out',
              }}
            >
              <defs>
                <filter id="chassis-shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
                </filter>
              </defs>

              <path
                d="M 118 310 L 148 220 L 222 170 L 330 145 L 520 145 L 642 175 L 702 220 L 732 298 L 702 322 L 656 324 L 612 324 L 582 365 L 472 365 L 438 332 L 262 332 L 226 365 L 144 365 L 118 336 Z"
                fill="#f8fafc"
                stroke="#94a3b8"
                strokeWidth="2.2"
                filter="url(#chassis-shadow)"
              />
              <path d="M 214 171 L 286 110 L 552 110 L 640 175" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <path d="M 256 148 L 318 118 L 444 118 L 444 175 L 242 175 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
              <path d="M 458 118 L 548 118 L 606 160 L 606 175 L 458 175 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
              <line x1="446" y1="118" x2="446" y2="332" stroke="#cbd5e1" strokeWidth="4" />
              <line x1="244" y1="180" x2="244" y2="333" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,5" />
              <line x1="610" y1="180" x2="610" y2="324" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,5" />

              <ellipse cx="246" cy="365" rx="72" ry="58" fill="#1f2937" opacity="0.88" />
              <ellipse cx="246" cy="365" rx="38" ry="31" fill="#64748b" />
              <ellipse cx="578" cy="365" rx="72" ry="58" fill="#1f2937" opacity="0.88" />
              <ellipse cx="578" cy="365" rx="38" ry="31" fill="#64748b" />

              <rect x="290" y="296" width="252" height="20" rx="10" fill="#cbd5e1" opacity="0.75" />
              <line x1="228" y1="322" x2="592" y2="322" stroke="#94a3b8" strokeWidth="3" opacity="0.55" />
              <line x1="246" y1="365" x2="286" y2="322" stroke="#94a3b8" strokeWidth="3" opacity="0.45" />
              <line x1="578" y1="365" x2="542" y2="322" stroke="#94a3b8" strokeWidth="3" opacity="0.45" />
              <line x1="362" y1="205" x2="362" y2="135" stroke="#94a3b8" strokeWidth="3" opacity="0.45" />
              <line x1="362" y1="205" x2="282" y2="235" stroke="#94a3b8" strokeWidth="3" opacity="0.45" />
              <line x1="362" y1="205" x2="518" y2="240" stroke="#94a3b8" strokeWidth="3" opacity="0.45" />

              {CHASSIS_DIAGRAM_ZONES.map(zone => {
                const subsystem = chassisSubsystems.find(item => item.id === zone.subsystemId)!;
                const colors = CHASSIS_COLOR_MAP[subsystem.colorKey];
                const isSelected = selectedSubsystemId === zone.subsystemId;
                const isHovered = hoveredZoneId === zone.id;
                const fill = getZoneFill(subsystem, zone.id);
                const stroke = isSelected || isHovered ? colors.accent : colors.svgStroke;
                const strokeWidth = isSelected ? 3 : isHovered ? 2.4 : 1.6;
                const totalSubsystemParts = subsystem.assemblies.reduce(
                  (sum, assembly) => sum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
                  0,
                );
                const labelX = zone.type === 'ellipse' ? zone.cx! : zone.x! + zone.width! / 2;
                const labelY = zone.type === 'ellipse' ? zone.cy! : zone.y! + zone.height! / 2;

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer"
                    onClick={() => onSubsystemSelect(zone.subsystemId)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                  >
                    {zone.type === 'ellipse' ? (
                      <ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry} fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={0.88} />
                    ) : (
                      <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} rx="12" fill={fill} stroke={stroke} strokeWidth={strokeWidth} opacity={0.9} />
                    )}
                    <text x={labelX} y={labelY - 10} textAnchor="middle" fontSize="14" fontWeight={700} fill={stroke} className="pointer-events-none select-none">
                      {subsystem.icon} {zone.label}
                    </text>
                    <text x={labelX} y={labelY + 11} textAnchor="middle" fontSize="10.5" fill="#475569" className="pointer-events-none select-none">
                      {subsystem.assemblies.length} 个总成 · {totalSubsystemParts} 个零件
                    </text>
                  </g>
                );
              })}

              <text x="410" y="444" textAnchor="middle" fontSize="11" fill="#94a3b8">
                智能底盘统一布局示意（子系统级联动）
              </text>
            </svg>
          </div>
        </div>

        <div className="border-t xl:border-t-0 xl:border-l border-gray-200 dark:border-gray-700 p-4 bg-gray-50/70 dark:bg-gray-900/40">
          {selectedSubsystem ? (
            <div className="space-y-3">
              <div className={`rounded-xl border ${CHASSIS_COLOR_MAP[selectedSubsystem.colorKey].border} ${CHASSIS_COLOR_MAP[selectedSubsystem.colorKey].light} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedSubsystem.icon}</span>
                  <h3 className={`text-sm font-semibold ${CHASSIS_COLOR_MAP[selectedSubsystem.colorKey].text}`}>{selectedSubsystem.name}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-5">{selectedSubsystem.description}</p>
              </div>
              <div className="space-y-2">
                {selectedSubsystem.assemblies.slice(0, 6).map(assembly => {
                  const partCount = assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0);
                  return (
                    <div key={assembly.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{assembly.name}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        {assembly.subAssemblies.length} 个分总成 · {partCount} 个零件
                      </div>
                    </div>
                  );
                })}
                {selectedSubsystem.assemblies.length > 6 && (
                  <p className="text-[11px] text-gray-400 px-1">还有 {selectedSubsystem.assemblies.length - 6} 个总成可在左侧树中继续查看</p>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[180px] flex items-center justify-center text-center px-4">
              <div>
                <p className="text-2xl mb-2">🛠️</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">点击示意图中的区域</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">快速定位到底盘结构、悬架系统或转向系统</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
        {chassisSubsystems.map(subsystem => {
          const colors = CHASSIS_COLOR_MAP[subsystem.colorKey];
          const isActive = selectedSubsystemId === subsystem.id;
          return (
            <button
              key={subsystem.id}
              onClick={() => onSubsystemSelect(subsystem.id)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-colors ${
                isActive
                  ? `${colors.light} ${colors.text} ${colors.border}`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span>{subsystem.icon}</span>
              <span>{subsystem.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
