import { useMemo, useState } from 'react';
import type { PDSystemGroup } from '../data/powerDriveAssembly';
import { PD_COLOR_MAP } from '../data/powerDriveAssembly';

interface Props {
  groups: PDSystemGroup[];
  selectedGroupId: string;
  onGroupSelect: (id: string) => void;
}

const W = 620;
const H = 500;

type Zone = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const CORE_ZONE: Zone = { id: 'core', x: 200, y: 150, w: 220, h: 200 };

const GROUP_ZONES: Record<string, Zone> = {
  'pd-g01': { id: 'pd-g01', x: 10, y: 55, w: 200, h: 105 },
  'pd-g04': { id: 'pd-g04', x: 410, y: 55, w: 200, h: 105 },
  'pd-g02': { id: 'pd-g02', x: 10, y: 190, w: 170, h: 155 },
  'pd-g03': { id: 'pd-g03', x: 440, y: 190, w: 170, h: 90 },
  'pd-g05': { id: 'pd-g05', x: 180, y: 375, w: 260, h: 95 },
};

export default function PowerDriveSystemDiagram({ groups, selectedGroupId, onGroupSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const groupMap = useMemo(() => new Map(groups.map(group => [group.id, group])), [groups]);

  const totalAssemblies = groups.reduce((sum, group) => sum + group.assemblies.length, 0);
  const totalParts = groups.reduce(
    (sum, group) => sum + group.assemblies.reduce((groupSum, assembly) => groupSum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0), 0),
    0,
  );

  const partCount = (group: PDSystemGroup) =>
    group.assemblies.reduce((sum, assembly) => sum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0), 0);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 510 }}>
        <rect width={W} height={H} fill="#f8fafc" rx="12" />

        <text x={W / 2} y={28} textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
          动力驱动系统 · 非金属材料分布示意图
        </text>
        <text x={W / 2} y={46} textAnchor="middle" fill="#9ca3af" fontSize="11">
          共 {totalAssemblies} 个总成 · {totalParts} 个零件 · 主要工艺：注塑 · 主要材料：PA66 / PPS / PBT / PA46 / PPA
        </text>

        <rect x={CORE_ZONE.x} y={CORE_ZONE.y} width={CORE_ZONE.w} height={CORE_ZONE.h} rx="14" fill="#334155" stroke="#1e293b" strokeWidth="2" />
        <rect x={CORE_ZONE.x + 18} y={CORE_ZONE.y + 28} width={86} height={58} rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <rect x={CORE_ZONE.x + 116} y={CORE_ZONE.y + 28} width={86} height={58} rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <rect x={CORE_ZONE.x + 55} y={CORE_ZONE.y + 102} width={110} height={44} rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx={CORE_ZONE.x + 58} cy={CORE_ZONE.y + 172} r="16" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
        <circle cx={CORE_ZONE.x + 162} cy={CORE_ZONE.y + 172} r="16" fill="#1f2937" stroke="#64748b" strokeWidth="2" />
        <text x={CORE_ZONE.x + CORE_ZONE.w / 2} y={CORE_ZONE.y + 78} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">
          电机 + 减速器总成
        </text>
        <text x={CORE_ZONE.x + CORE_ZONE.w / 2} y={CORE_ZONE.y + 98} textAnchor="middle" fill="#cbd5e1" fontSize="11">
          eDrive / PSM / 控制器 / 齿轮箱
        </text>
        <text x={CORE_ZONE.x + CORE_ZONE.w / 2} y={CORE_ZONE.y + 130} textAnchor="middle" fill="#94a3b8" fontSize="10">
          高压连接 · 润滑喷油 · 冷却管路 · 传动支撑
        </text>

        <defs>
          {[
            ['arrowBlue', '#3b82f6'],
            ['arrowGreen', '#22c55e'],
            ['arrowAmber', '#f59e0b'],
            ['arrowCyan', '#06b6d4'],
            ['arrowPurple', '#a855f7'],
          ].map(([id, color]) => (
            <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={color} />
            </marker>
          ))}
        </defs>

        <line x1={210} y1={120} x2={200} y2={165} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
        <line x1={410} y1={120} x2={420} y2={165} stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        <line x1={180} y1={260} x2={200} y2={255} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowAmber)" />
        <line x1={440} y1={235} x2={420} y2={235} stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowCyan)" />
        <line x1={310} y1={375} x2={310} y2={350} stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowPurple)" />

        {Object.entries(GROUP_ZONES).map(([groupId, zone]) => {
          const group = groupMap.get(groupId);
          if (!group) return null;

          const colors = PD_COLOR_MAP[group.color as keyof typeof PD_COLOR_MAP] ?? PD_COLOR_MAP.blue;
          const isSelected = selectedGroupId === groupId;
          const isHovered = hoveredId === groupId;
          const isActive = isSelected || isHovered;
          const parts = partCount(group);

          return (
            <g
              key={groupId}
              style={{ cursor: 'pointer' }}
              onClick={() => onGroupSelect(groupId)}
              onMouseEnter={() => setHoveredId(groupId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {isActive && (
                <rect
                  x={zone.x + 2}
                  y={zone.y + 2}
                  width={zone.w}
                  height={zone.h}
                  rx="9"
                  fill={colors.svg}
                  opacity="0.14"
                />
              )}
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx="8"
                fill={isActive ? colors.svgLight : '#ffffff'}
                stroke={isSelected ? colors.svg : isHovered ? colors.svgBorder : '#e2e8f0'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              <rect x={zone.x} y={zone.y} width={zone.w > 200 ? 8 : zone.w} height={zone.w > 200 ? zone.h : 6} rx={zone.w > 200 ? '8 0 0 8' : '8 8 0 0'} fill={colors.svg} opacity="0.82" />

              {zone.w > 190 ? (
                <>
                  <text x={zone.x + 20} y={zone.y + 25} fill={colors.svg} fontSize="15" fontWeight="bold">
                    {group.icon} {group.name}
                  </text>
                  <text x={zone.x + 20} y={zone.y + 45} fill="#6b7280" fontSize="10.5">
                    {group.assemblies.slice(0, 3).map(assembly => assembly.name).join(' · ')}
                    {group.assemblies.length > 3 ? ' ...' : ''}
                  </text>
                  <text x={zone.x + 20} y={zone.y + 66} fill="#9ca3af" fontSize="10">
                    {group.assemblies.length} 个总成 · {parts} 个零件
                  </text>
                  <rect x={zone.x + zone.w - 78} y={zone.y + 18} width={66} height={22} rx="11" fill={colors.svg} opacity="0.92" />
                  <text x={zone.x + zone.w - 45} y={zone.y + 33} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                    {parts} 零件
                  </text>
                </>
              ) : (
                <>
                  <text x={zone.x + zone.w / 2} y={zone.y + 26} textAnchor="middle" fill={colors.svg} fontSize="18">
                    {group.icon}
                  </text>
                  <text x={zone.x + zone.w / 2} y={zone.y + 46} textAnchor="middle" fill={colors.svg} fontSize="12" fontWeight="bold">
                    {group.shortName}
                  </text>
                  <text x={zone.x + zone.w / 2} y={zone.y + 62} textAnchor="middle" fill="#6b7280" fontSize="10">
                    {group.assemblies.length}总成 · {parts}零件
                  </text>
                  {group.assemblies.slice(0, 4).map((assembly, index) => (
                    <text key={assembly.id} x={zone.x + zone.w / 2} y={zone.y + 82 + index * 14} textAnchor="middle" fill="#9ca3af" fontSize="9">
                      · {assembly.name.length > 8 ? `${assembly.name.slice(0, 8)}…` : assembly.name}
                    </text>
                  ))}
                </>
              )}
            </g>
          );
        })}

        <text x={10} y={H - 8} fill="#9ca3af" fontSize="9">
          点击各系统区域 → 查看动力驱动总成与零件清单 | 蓝=控制信号 黄=润滑油路 青=冷却管路 绿=连接绝缘 紫=传动支撑
        </text>
      </svg>
    </div>
  );
}
