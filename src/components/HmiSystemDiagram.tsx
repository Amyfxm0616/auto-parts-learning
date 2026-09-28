import { useState } from 'react';
import type { HmiGroup } from '../data/hmiAssembly';

interface HmiSystemDiagramProps {
  groups: HmiGroup[];
  selectedGroupId: string;
  onGroupClick: (groupId: string) => void;
}

interface HmiZone {
  groupId: HmiGroup['id'];
  label: string;
  shortLabel: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
}

const HMI_ZONES: HmiZone[] = [
  { groupId: 'hmi-display', label: '显示系统', shortLabel: '显示', color: '#bfdbfe', x: 185, y: 80, width: 270, height: 80, rx: 18 },
  { groupId: 'hmi-control', label: '控制模块', shortLabel: '控制', color: '#ddd6fe', x: 505, y: 115, width: 150, height: 120, rx: 20 },
  { groupId: 'hmi-audio', label: '音响系统', shortLabel: '音响', color: '#fde68a', x: 110, y: 90, width: 52, height: 210, rx: 18 },
  { groupId: 'hmi-audio', label: '音响系统', shortLabel: '音响', color: '#fde68a', x: 680, y: 90, width: 52, height: 210, rx: 18 },
  { groupId: 'hmi-audio', label: '音响系统', shortLabel: '音响', color: '#fde68a', x: 240, y: 305, width: 90, height: 55, rx: 18 },
  { groupId: 'hmi-audio', label: '音响系统', shortLabel: '音响', color: '#fde68a', x: 505, y: 305, width: 90, height: 55, rx: 18 },
  { groupId: 'hmi-communication', label: '通信与接收模块', shortLabel: '通信', color: '#bbf7d0', x: 560, y: 52, width: 105, height: 48, rx: 16 },
  { groupId: 'hmi-other', label: '其他HMI模块', shortLabel: '其他', color: '#e5e7eb', x: 345, y: 315, width: 135, height: 48, rx: 16 },
];

function countGroupAssemblies(group: HmiGroup) {
  return group.assemblies.length;
}

function countGroupParts(group: HmiGroup) {
  return group.assemblies.reduce(
    (assemblySum, assembly) =>
      assemblySum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
    0,
  );
}

export default function HmiSystemDiagram({ groups, selectedGroupId, onGroupClick }: HmiSystemDiagramProps) {
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const selectedGroup = groups.find(group => group.id === selectedGroupId) ?? null;

  const getFill = (zone: HmiZone) => {
    if (selectedGroupId === zone.groupId) return '#fbbf24';
    if (hoveredGroupId === zone.groupId) return '#93c5fd';
    return zone.color;
  };

  const getStroke = (zone: HmiZone) => {
    if (selectedGroupId === zone.groupId) return '#d97706';
    if (hoveredGroupId === zone.groupId) return '#2563eb';
    return '#6b7280';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">车机硬件交互示意图</h2>
          <p className="text-xs text-gray-500">点击座舱模块高亮对应业务域，并联动左侧树形导航与右侧内容区</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#fbbf24] border border-amber-700" /> 当前选中
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#93c5fd] border border-blue-700" /> 悬停预览
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden border border-gray-200 rounded-lg bg-gradient-to-br from-slate-50 to-gray-100 h-[390px]">
            <svg viewBox="0 0 820 420" className="w-full h-full">
              <defs>
                <filter id="hmi-shadow">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.16" />
                </filter>
              </defs>

              <rect x="70" y="40" width="680" height="320" rx="40" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" filter="url(#hmi-shadow)" />
              <path d="M 165 95 Q 250 30 410 32 Q 570 30 655 95" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <path d="M 185 80 L 635 80 L 665 160 L 155 160 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
              <rect x="245" y="175" width="330" height="145" rx="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="360" y="175" width="100" height="145" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="120" y="180" width="80" height="125" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <rect x="620" y="180" width="80" height="125" rx="18" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="315" cy="260" r="40" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
              <circle cx="510" cy="260" r="40" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
              <rect x="365" y="65" width="90" height="26" rx="10" fill="#cbd5e1" />
              <text x="410" y="82" textAnchor="middle" fontSize="12" className="fill-slate-600 font-semibold">前风挡 / HUD 区</text>

              {HMI_ZONES.map((zone, index) => (
                <g
                  key={`${zone.groupId}-${index}`}
                  onMouseEnter={() => setHoveredGroupId(zone.groupId)}
                  onMouseLeave={() => setHoveredGroupId(null)}
                  onClick={() => onGroupClick(zone.groupId)}
                  className="cursor-pointer"
                >
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx={zone.rx ?? 16}
                    fill={getFill(zone)}
                    fillOpacity="0.82"
                    stroke={getStroke(zone)}
                    strokeWidth={selectedGroupId === zone.groupId ? 3 : 1.8}
                  />
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 4}
                    textAnchor="middle"
                    fontSize="16"
                    className="fill-slate-800 font-semibold pointer-events-none select-none"
                  >
                    {zone.shortLabel}
                  </text>
                </g>
              ))}

              <text x="410" y="388" textAnchor="middle" fontSize="12" className="fill-slate-400 pointer-events-none select-none">
                座舱俯视 HMI 模块示意图
              </text>
            </svg>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedGroup ? (
            <div className="bg-sky-50 rounded-lg p-3 border border-sky-200 h-full overflow-y-auto max-h-[390px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{selectedGroup.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedGroup.name}</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3 leading-5">{selectedGroup.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-md bg-white border border-sky-100 px-3 py-2">
                  <p className="text-[11px] text-gray-500">总成</p>
                  <p className="text-lg font-semibold text-sky-700">{countGroupAssemblies(selectedGroup)}</p>
                </div>
                <div className="rounded-md bg-white border border-sky-100 px-3 py-2">
                  <p className="text-[11px] text-gray-500">零件</p>
                  <p className="text-lg font-semibold text-sky-700">{countGroupParts(selectedGroup)}</p>
                </div>
              </div>
              <div className="space-y-2">
                {selectedGroup.assemblies.map(assembly => (
                  <button
                    key={assembly.id}
                    className="w-full text-left rounded-lg bg-white border border-sky-100 px-3 py-2 hover:bg-sky-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span>{assembly.icon}</span>
                      <span>{assembly.name}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-500">
                      {assembly.subAssemblies.length} 个分总成 · {assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0)} 个零件
                    </p>
                  </button>
                ))}
                {selectedGroup.assemblies.length === 0 && (
                  <div className="rounded-lg bg-white border border-dashed border-gray-300 px-3 py-6 text-center text-xs text-gray-400">
                    该分组暂未整理对应总成
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">点击示意图中的模块区域</p>
                <p className="text-xs text-gray-400">右侧显示该业务域统计，并同步左侧树形导航</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
