import { useState } from 'react';
import type { AutonomousDrivingGroup } from '../data/autonomousDrivingAssembly';

interface AutonomousDrivingSystemDiagramProps {
  groups: AutonomousDrivingGroup[];
  selectedGroupId: string;
  onGroupClick: (groupId: string) => void;
}

interface AutonomousDrivingZone {
  groupId: AutonomousDrivingGroup['id'];
  label: string;
  shortLabel: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
}

const AUTONOMOUS_DRIVING_ZONES: AutonomousDrivingZone[] = [
  { groupId: 'ad-camera', label: '摄像头系统', shortLabel: '摄像头', color: '#bfdbfe', x: 160, y: 58, width: 170, height: 64, rx: 18 },
  { groupId: 'ad-camera', label: '摄像头系统', shortLabel: '摄像头', color: '#bfdbfe', x: 500, y: 58, width: 170, height: 64, rx: 18 },
  { groupId: 'ad-camera', label: '摄像头系统', shortLabel: '摄像头', color: '#bfdbfe', x: 125, y: 146, width: 92, height: 82, rx: 18 },
  { groupId: 'ad-camera', label: '摄像头系统', shortLabel: '摄像头', color: '#bfdbfe', x: 613, y: 146, width: 92, height: 82, rx: 18 },
  { groupId: 'ad-camera', label: '摄像头系统', shortLabel: '舱内感知', color: '#bfdbfe', x: 318, y: 126, width: 194, height: 82, rx: 20 },
  { groupId: 'ad-optical', label: '光学/反射系统', shortLabel: '后视镜', color: '#ddd6fe', x: 348, y: 74, width: 134, height: 42, rx: 18 },
  { groupId: 'ad-radar', label: '雷达系统', shortLabel: '激光雷达', color: '#fde68a', x: 245, y: 276, width: 130, height: 56, rx: 18 },
  { groupId: 'ad-radar', label: '雷达系统', shortLabel: '毫米波', color: '#fde68a', x: 447, y: 276, width: 130, height: 56, rx: 18 },
  { groupId: 'ad-other', label: '其他自动驾驶模块', shortLabel: '预留', color: '#e5e7eb', x: 343, y: 336, width: 144, height: 40, rx: 16 },
];

function countGroupAssemblies(group: AutonomousDrivingGroup) {
  return group.assemblies.length;
}

function countGroupParts(group: AutonomousDrivingGroup) {
  return group.assemblies.reduce(
    (assemblySum, assembly) =>
      assemblySum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
    0,
  );
}

export default function AutonomousDrivingSystemDiagram({
  groups,
  selectedGroupId,
  onGroupClick,
}: AutonomousDrivingSystemDiagramProps) {
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const selectedGroup = groups.find(group => group.id === selectedGroupId) ?? null;

  const getFill = (zone: AutonomousDrivingZone) => {
    if (selectedGroupId === zone.groupId) return '#fbbf24';
    if (hoveredGroupId === zone.groupId) return '#93c5fd';
    return zone.color;
  };

  const getStroke = (zone: AutonomousDrivingZone) => {
    if (selectedGroupId === zone.groupId) return '#d97706';
    if (hoveredGroupId === zone.groupId) return '#2563eb';
    return '#6b7280';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">自动驾驶硬件交互示意图</h2>
          <p className="text-xs text-gray-500">点击感知硬件区域高亮对应业务域，并联动左侧树形导航与右侧内容区</p>
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
                <filter id="autonomous-driving-shadow">
                  <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.16" />
                </filter>
              </defs>

              <rect x="70" y="32" width="680" height="340" rx="48" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" filter="url(#autonomous-driving-shadow)" />
              <path d="M 180 84 Q 260 24 410 24 Q 560 24 640 84" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <path d="M 126 138 Q 410 248 694 138" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="10 8" />
              <rect x="200" y="112" width="420" height="188" rx="28" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="352" y="130" width="116" height="138" rx="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="254" cy="308" r="34" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
              <circle cx="566" cy="308" r="34" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
              <path d="M 214 108 L 606 108" stroke="#cbd5e1" strokeWidth="2" />
              <text x="410" y="48" textAnchor="middle" fontSize="12" className="fill-slate-500 font-semibold">整车自动驾驶硬件布置示意</text>
              <text x="410" y="230" textAnchor="middle" fontSize="12" className="fill-slate-400 font-semibold">座舱感知 / 后视镜区域</text>
              <text x="410" y="358" textAnchor="middle" fontSize="12" className="fill-slate-400 pointer-events-none select-none">
                前舱雷达与四周视觉传感器抽象示意
              </text>

              {AUTONOMOUS_DRIVING_ZONES.map((zone, index) => (
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
                    fontSize={zone.shortLabel.length > 4 ? 14 : 16}
                    className="fill-slate-800 font-semibold pointer-events-none select-none"
                  >
                    {zone.shortLabel}
                  </text>
                </g>
              ))}
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
                <p className="text-sm text-gray-500 mb-1">点击示意图中的感知硬件区域</p>
                <p className="text-xs text-gray-400">右侧显示该业务域统计，并同步左侧树形导航</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
