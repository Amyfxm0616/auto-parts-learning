import { useState } from 'react';
import type { ERSystemGroup } from '../data/extendedRangeAssembly';
import { ER_COLOR_MAP } from '../data/extendedRangeAssembly';

interface Props {
  groups: ERSystemGroup[];
  selectedGroupId: string;
  onGroupSelect: (id: string) => void;
}

// SVG layout constants
const W = 620;
const H = 490;

// Zone definitions: [id, x, y, w, h, label row 1, label row 2, sub-labels]
type Zone = {
  id: string;
  x: number; y: number; w: number; h: number;
  isEngine?: boolean;
};

const ENGINE_ZONE: Zone = { id: 'engine', x: 200, y: 140, w: 220, h: 240, isEngine: true };

const GROUP_ZONES: Record<string, Zone> = {
  'er-g01': { id: 'er-g01', x: 10,  y: 40,  w: 600, h: 90 },   // top full width
  'er-g05': { id: 'er-g05', x: 10,  y: 140, w: 180, h: 120 },  // mid-left top
  'er-g02': { id: 'er-g02', x: 430, y: 140, w: 180, h: 120 },  // mid-right top
  'er-g03': { id: 'er-g03', x: 10,  y: 270, w: 180, h: 100 },  // mid-left bottom
  'er-g04': { id: 'er-g04', x: 430, y: 270, w: 180, h: 100 },  // mid-right bottom
  'er-g06': { id: 'er-g06', x: 10,  y: 380, w: 600, h: 90 },   // bottom full width
};

export default function ExtendedRangeEngineDiagram({ groups, selectedGroupId, onGroupSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const groupMap = new Map(groups.map(g => [g.id, g]));

  // Count total parts per group
  const partCount = (g: ERSystemGroup) =>
    g.assemblies.reduce((s, a) => s + a.subAssemblies.reduce((s2, sub) => s2 + sub.parts.length, 0), 0);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 500 }}
      >
        {/* Background */}
        <rect width={W} height={H} fill="#f8fafc" rx="12" />

        {/* Title */}
        <text x={W / 2} y={25} textAnchor="middle" fill="#374151" fontSize="14" fontWeight="bold">
          增程系统 · 非金属材料分布示意图
        </text>
        <text x={W / 2} y={42} textAnchor="middle" fill="#9ca3af" fontSize="11">
          共 30 个总成 · 主要工艺：注塑 · 主要材料：PA66系列 / PBT / PPS
        </text>

        {/* Engine block */}
        <rect
          x={ENGINE_ZONE.x} y={ENGINE_ZONE.y}
          width={ENGINE_ZONE.w} height={ENGINE_ZONE.h}
          rx="10" fill="#475569" stroke="#334155" strokeWidth="2"
        />
        {/* Engine cylinder rows */}
        {[0, 1, 2].map(i => (
          <rect
            key={i}
            x={ENGINE_ZONE.x + 18 + i * 62} y={ENGINE_ZONE.y + 20}
            width={46} height={80} rx="6"
            fill="#334155" stroke="#64748b" strokeWidth="1"
          />
        ))}
        <text x={ENGINE_ZONE.x + ENGINE_ZONE.w / 2} y={ENGINE_ZONE.y + 130} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          增程发动机
        </text>
        <text x={ENGINE_ZONE.x + ENGINE_ZONE.w / 2} y={ENGINE_ZONE.y + 150} textAnchor="middle" fill="#94a3b8" fontSize="11">
          1.5L 三缸增程器
        </text>
        <text x={ENGINE_ZONE.x + ENGINE_ZONE.w / 2} y={ENGINE_ZONE.y + 168} textAnchor="middle" fill="#64748b" fontSize="10">
          进气 · 压缩 · 燃烧 · 排气
        </text>
        {/* Oil pan */}
        <rect
          x={ENGINE_ZONE.x + 20} y={ENGINE_ZONE.y + ENGINE_ZONE.h - 55}
          width={ENGINE_ZONE.w - 40} height={40} rx="5"
          fill="#334155" stroke="#64748b" strokeWidth="1"
        />
        <text x={ENGINE_ZONE.x + ENGINE_ZONE.w / 2} y={ENGINE_ZONE.y + ENGINE_ZONE.h - 28} textAnchor="middle" fill="#94a3b8" fontSize="10">
          油底壳
        </text>

        {/* Connector arrows */}
        {/* Top → engine (进气通道) */}
        <line x1={W/2} y1={130} x2={W/2} y2={140} stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />
        {/* Left-top → engine */}
        <line x1={190} y1={200} x2={200} y2={200} stroke="#a855f7" strokeWidth="2" markerEnd="url(#arrowPurple)" />
        {/* Right-top → engine */}
        <line x1={430} y1={200} x2={420} y2={200} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowAmber)" />
        {/* Left-bottom → engine */}
        <line x1={190} y1={320} x2={200} y2={320} stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrowCyan)" />
        {/* Right-bottom → engine */}
        <line x1={430} y1={320} x2={420} y2={320} stroke="#22c55e" strokeWidth="2" markerEnd="url(#arrowGreen)" />
        {/* Engine → bottom */}
        <line x1={W/2} y1={380} x2={W/2} y2={380} stroke="#f97316" strokeWidth="2" />

        {/* Arrow markers */}
        <defs>
          {[
            ['arrowBlue',   '#3b82f6'],
            ['arrowPurple', '#a855f7'],
            ['arrowAmber',  '#f59e0b'],
            ['arrowCyan',   '#06b6d4'],
            ['arrowGreen',  '#22c55e'],
          ].map(([id, color]) => (
            <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={color} />
            </marker>
          ))}
        </defs>

        {/* Group zones */}
        {Object.entries(GROUP_ZONES).map(([gid, zone]) => {
          const g = groupMap.get(gid);
          if (!g) return null;
          const colorKey = g.color as keyof typeof ER_COLOR_MAP;
          const c = ER_COLOR_MAP[colorKey];
          const isSelected = selectedGroupId === gid;
          const isHovered = hoveredId === gid;
          const parts = partCount(g);
          const isActive = isSelected || isHovered;

          return (
            <g
              key={gid}
              style={{ cursor: 'pointer' }}
              onClick={() => onGroupSelect(gid)}
              onMouseEnter={() => setHoveredId(gid)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Shadow on hover */}
              {isActive && (
                <rect
                  x={zone.x + 2} y={zone.y + 2}
                  width={zone.w} height={zone.h}
                  rx="9" fill={c.svg} opacity="0.15"
                />
              )}
              {/* Main rect */}
              <rect
                x={zone.x} y={zone.y}
                width={zone.w} height={zone.h}
                rx="8"
                fill={isActive ? c.svgLight : '#ffffff'}
                stroke={isSelected ? c.svg : isHovered ? c.svgBorder : '#e2e8f0'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />
              {/* Color accent bar */}
              <rect
                x={zone.x} y={zone.y}
                width={zone.w > 200 ? 8 : zone.w}
                height={zone.w > 200 ? zone.h : 6}
                rx={zone.w > 200 ? '8 0 0 8' : '8 8 0 0'}
                fill={c.svg}
                opacity="0.8"
              />

              {/* Full-width layout (top/bottom) */}
              {zone.w > 200 ? (
                <>
                  <text x={zone.x + 22} y={zone.y + 24} fill={c.svg} fontSize="15" fontWeight="bold">
                    {g.icon} {g.name}
                  </text>
                  <text x={zone.x + 22} y={zone.y + 42} fill="#6b7280" fontSize="11">
                    {g.assemblies.slice(0, 5).map(a => a.name).join(' · ')}{g.assemblies.length > 5 ? ' ...' : ''}
                  </text>
                  <text x={zone.x + 22} y={zone.y + 62} fill="#9ca3af" fontSize="10">
                    {g.assemblies.length} 个总成 · {parts} 个零件
                  </text>
                  {/* Badge */}
                  <rect x={zone.x + zone.w - 72} y={zone.y + 22} width={62} height={22} rx="11" fill={c.svg} opacity="0.9" />
                  <text x={zone.x + zone.w - 41} y={zone.y + 37} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                    {parts} 零件
                  </text>
                </>
              ) : (
                /* Narrow layout (left/right) */
                <>
                  <text x={zone.x + zone.w / 2} y={zone.y + 26} textAnchor="middle" fill={c.svg} fontSize="18">
                    {g.icon}
                  </text>
                  <text x={zone.x + zone.w / 2} y={zone.y + 46} textAnchor="middle" fill={c.svg} fontSize="12" fontWeight="bold">
                    {g.shortName}
                  </text>
                  <text x={zone.x + zone.w / 2} y={zone.y + 62} textAnchor="middle" fill="#6b7280" fontSize="10">
                    {g.assemblies.length}总成 · {parts}零件
                  </text>
                  {/* Mini part list */}
                  {g.assemblies.slice(0, 3).map((a, i) => (
                    <text
                      key={a.id}
                      x={zone.x + zone.w / 2} y={zone.y + 80 + i * 14}
                      textAnchor="middle" fill="#9ca3af" fontSize="9"
                    >
                      · {a.name.length > 8 ? a.name.slice(0, 8) + '…' : a.name}
                    </text>
                  ))}
                </>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <text x={10} y={H - 8} fill="#9ca3af" fontSize="9">
          点击各系统区域 → 查看分零件清单 | 蓝=配气进气 黄=燃油喷射 青=冷却水 绿=传感器 紫=电机点火 橙=机油曲通
        </text>
      </svg>
    </div>
  );
}
