import React from 'react';
import type { SealAssembly } from '../data/sealingAssembly';

interface Props {
  assemblies: SealAssembly[];
  selectedAssemblyId: string;
  selectedSubId: string;
  onAssemblyClick: (id: string) => void;
}

// 各 L1 总成的高亮区域定义
const ASSEMBLY_HIGHLIGHT: Record<string, {
  color: string;
  label: string;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'end' | 'middle';
  lineFrom: [number, number];
  paths: Array<{ d: string } | { rect: [number, number, number, number, number?] }>;
}> = {
  'se-01': {
    color: '#2563eb',
    label: '静态密封条',
    labelX: 178, labelY: 38, anchor: 'middle',
    lineFrom: [260, 88],
    paths: [
      // 前门玻璃顶内水切
      { rect: [228, 88, 148, 7, 2] },
      // 后门玻璃顶内水切
      { rect: [382, 88, 130, 7, 2] },
      // 前门玻璃前导槽/导轨 (垂直)
      { rect: [224, 95, 7, 62, 2] },
      // 前门玻璃后导槽/导轨 (垂直)
      { rect: [370, 95, 7, 62, 2] },
      // 后门玻璃前导槽 (垂直)
      { rect: [378, 95, 7, 70, 2] },
      // 后门玻璃后导槽 (垂直)
      { rect: [507, 95, 7, 70, 2] },
    ],
  },
  'se-02': {
    color: '#dc2626',
    label: '动态密封条',
    labelX: 440, labelY: 315, anchor: 'middle',
    lineFrom: [385, 258],
    paths: [
      // 前门洞左边 (机舱侧)
      { rect: [209, 88, 8, 170, 2] },
      // 前门洞顶
      { rect: [217, 88, 163, 8, 2] },
      // 前门门槛底
      { rect: [217, 252, 163, 8, 2] },
      // 后门洞顶
      { rect: [381, 88, 134, 8, 2] },
      // 后门门槛底
      { rect: [381, 252, 134, 8, 2] },
      // 后门洞右边
      { rect: [507, 88, 8, 170, 2] },
      // 机舱前密封 (最左竖)
      { rect: [68, 108, 7, 140, 2] },
      // 机舱中密封
      { rect: [79, 108, 7, 140, 2] },
      // 背门密封 (右侧竖)
      { rect: [516, 88, 7, 155, 2] },
    ],
  },
  'se-03': {
    color: '#0d9488',
    label: 'B柱外饰板',
    labelX: 560, labelY: 38, anchor: 'middle',
    lineFrom: [383, 110],
    paths: [
      // B柱三角饰板 (上)
      { rect: [375, 88, 14, 50, 3] },
      // B柱饰板主体 (下)
      { rect: [375, 140, 14, 118, 3] },
    ],
  },
};

// 子总成 → L1 的映射
const SUB_TO_ASSEMBLY: Record<string, string> = {
  'se-01-01': 'se-01', 'se-01-02': 'se-01', 'se-01-03': 'se-01', 'se-01-04': 'se-01',
  'se-01-05': 'se-01', 'se-01-06': 'se-01', 'se-01-07': 'se-01', 'se-01-08': 'se-01',
  'se-02-01': 'se-02', 'se-02-02': 'se-02', 'se-02-03': 'se-02', 'se-02-04': 'se-02',
  'se-02-05': 'se-02', 'se-02-06': 'se-02', 'se-02-07': 'se-02', 'se-02-08': 'se-02',
  'se-02-09': 'se-02', 'se-02-10': 'se-02', 'se-02-11': 'se-02', 'se-02-12': 'se-02',
  'se-03-01': 'se-03', 'se-03-02': 'se-03',
};

function CarDiagram({ selectedAssemblyId, selectedSubId }: {
  selectedAssemblyId: string;
  selectedSubId: string;
}) {
  // 确定激活的 L1
  const activeId = selectedSubId
    ? SUB_TO_ASSEMBLY[selectedSubId] ?? selectedAssemblyId
    : selectedAssemblyId;

  const getOpacity = (id: string) => {
    if (!activeId) return 1;
    return id === activeId ? 1 : 0.12;
  };

  return (
    <svg viewBox="0 0 660 340" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 700, display: 'block' }}>

      {/* ── SUV 车身轮廓 ── */}
      {/* 车身主体 */}
      <path d="
        M 88,178 Q 88,165 98,158 L 138,148 Q 165,110 200,95
        L 218,88 L 520,88 Q 548,88 565,100
        L 598,128 Q 622,148 630,175
        L 635,258 Q 635,268 624,268
        L 580,268 A 58,42 0 0 1 466,268
        L 230,268 A 58,42 0 0 1 116,268
        L 88,268 Q 78,268 78,258 Z
      " fill="#f0f0f0" stroke="#bbb" strokeWidth="1.5"/>

      {/* 车顶弧线 */}
      <path d="M 200,95 Q 210,80 230,78 L 540,78 Q 558,78 570,92"
        fill="none" stroke="#aaa" strokeWidth="1.2"/>

      {/* 引擎盖 */}
      <path d="M 88,178 Q 95,165 108,158 L 138,148 L 200,95 L 218,88 L 218,105 L 162,145 Q 130,158 115,170 Z"
        fill="#e8e8e8" stroke="#bbb" strokeWidth="1"/>

      {/* 前保险杠 */}
      <path d="M 78,210 Q 75,230 78,255 L 110,255 L 115,245 L 90,220 Z"
        fill="#e0e0e0" stroke="#bbb" strokeWidth="1"/>

      {/* 后保险杠/尾部 */}
      <path d="M 586,130 Q 625,155 635,190 L 635,258 L 600,258 L 595,230 L 590,140 Z"
        fill="#e8e8e8" stroke="#bbb" strokeWidth="1"/>

      {/* 前轮毂 */}
      <circle cx="175" cy="268" r="46" fill="#d5d5d5" stroke="#aaa" strokeWidth="1.5"/>
      <circle cx="175" cy="268" r="32" fill="#c8c8c8" stroke="#999" strokeWidth="1"/>
      <circle cx="175" cy="268" r="12" fill="#bbb" stroke="#888" strokeWidth="1"/>
      {[0,60,120,180,240,300].map(a => {
        const r1 = 14, r2 = 30, rad = a * Math.PI / 180;
        return <line key={a} x1={175 + r1 * Math.cos(rad)} y1={268 + r1 * Math.sin(rad)}
          x2={175 + r2 * Math.cos(rad)} y2={268 + r2 * Math.sin(rad)}
          stroke="#999" strokeWidth="2.5"/>;
      })}

      {/* 后轮毂 */}
      <circle cx="525" cy="268" r="50" fill="#d5d5d5" stroke="#aaa" strokeWidth="1.5"/>
      <circle cx="525" cy="268" r="35" fill="#c8c8c8" stroke="#999" strokeWidth="1"/>
      <circle cx="525" cy="268" r="13" fill="#bbb" stroke="#888" strokeWidth="1"/>
      {[0,60,120,180,240,300].map(a => {
        const r1 = 15, r2 = 33, rad = a * Math.PI / 180;
        return <line key={a} x1={525 + r1 * Math.cos(rad)} y1={268 + r1 * Math.sin(rad)}
          x2={525 + r2 * Math.cos(rad)} y2={268 + r2 * Math.sin(rad)}
          stroke="#999" strokeWidth="2.5"/>;
      })}

      {/* 门槛装饰条 */}
      <rect x="120" y="262" width="345" height="6" rx="2" fill="#d0d0d0" stroke="#bbb" strokeWidth="0.8"/>

      {/* 前车门玻璃 */}
      <rect x="228" y="92" width="140" height="63" rx="4" fill="#dce8f5" stroke="#b0c8e0" strokeWidth="1"/>

      {/* 后车门玻璃 */}
      <rect x="382" y="92" width="123" height="68" rx="4" fill="#dce8f5" stroke="#b0c8e0" strokeWidth="1"/>

      {/* A柱 */}
      <rect x="214" y="88" width="14" height="172" rx="2" fill="#ccc" stroke="#bbb" strokeWidth="0.8"/>

      {/* C/D柱 */}
      <rect x="512" y="88" width="14" height="162" rx="2" fill="#ccc" stroke="#bbb" strokeWidth="0.8"/>

      {/* 后视镜 */}
      <ellipse cx="208" cy="118" rx="18" ry="10" fill="#d8d8d8" stroke="#bbb" strokeWidth="1"/>

      {/* 前大灯 */}
      <path d="M 90,148 Q 95,132 120,130 L 128,138 Q 105,142 98,155 Z"
        fill="#e8f0ff" stroke="#b0b8c8" strokeWidth="1"/>

      {/* 尾灯 */}
      <path d="M 620,130 Q 635,148 635,175 L 628,175 Q 628,150 615,136 Z"
        fill="#ffe0e0" stroke="#c8b0b0" strokeWidth="1"/>

      {/* ── 密封条高亮区域 ── */}
      {Object.entries(ASSEMBLY_HIGHLIGHT).map(([id, cfg]) => {
        const opacity = getOpacity(id);
        const isActive = id === activeId;
        return (
          <g key={id} opacity={opacity}>
            {cfg.paths.map((p, i) => {
              if ('rect' in p) {
                const [x, y, w, h, rx = 1] = p.rect;
                return (
                  <rect key={i} x={x} y={y} width={w} height={h} rx={rx}
                    fill={cfg.color} stroke={isActive ? cfg.color : cfg.color}
                    strokeWidth={isActive ? 1 : 0.5} opacity={0.88}/>
                );
              }
              return (
                <path key={i} d={p.d} fill={cfg.color} stroke={cfg.color}
                  strokeWidth={isActive ? 1.5 : 0.5} opacity={0.88}/>
              );
            })}
            {/* 引线 + 标注 */}
            {(isActive || !activeId) && (
              <g>
                <line
                  x1={cfg.lineFrom[0]} y1={cfg.lineFrom[1]}
                  x2={cfg.labelX} y2={cfg.labelY + 8}
                  stroke={cfg.color} strokeWidth="1.2"/>
                <circle cx={cfg.lineFrom[0]} cy={cfg.lineFrom[1]} r="3"
                  fill={cfg.color}/>
                <rect
                  x={cfg.anchor === 'middle' ? cfg.labelX - 42 : cfg.anchor === 'end' ? cfg.labelX - 84 : cfg.labelX}
                  y={cfg.labelY - 12} width="84" height="22" rx="4"
                  fill={cfg.color} opacity="0.92"/>
                <text x={cfg.labelX} y={cfg.labelY + 4}
                  textAnchor={cfg.anchor}
                  fill="#fff" fontSize="12" fontWeight="700"
                  fontFamily="inherit">
                  {cfg.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* 选中状态：高亮框 */}
      {activeId && ASSEMBLY_HIGHLIGHT[activeId]?.paths.map((p, i) => {
        if (!('rect' in p)) return null;
        const [x, y, w, h, rx = 1] = p.rect;
        return (
          <rect key={`hl-${i}`} x={x - 1.5} y={y - 1.5} width={w + 3} height={h + 3}
            rx={rx + 1} fill="none"
            stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5,3" opacity={0.9}/>
        );
      })}
    </svg>
  );
}

// ─── 主组件 ────────────────────────────────────────────────────────────────
const SealingDiagram: React.FC<Props> = ({
  assemblies, selectedAssemblyId, selectedSubId, onAssemblyClick,
}) => {
  return (
    <div>
      {/* L1 切换标签 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#94a3b8', marginRight: 2 }}>高亮显示：</span>
        <button
          onClick={() => onAssemblyClick('')}
          style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
            background: !selectedAssemblyId ? '#475569' : '#f1f5f9',
            color: !selectedAssemblyId ? '#fff' : '#64748b',
            border: `1px solid ${!selectedAssemblyId ? '#475569' : '#e2e8f0'}`,
            fontWeight: !selectedAssemblyId ? 700 : 400,
          }}>全部</button>
        {assemblies.map(a => {
          const cfg = ASSEMBLY_HIGHLIGHT[a.id];
          const isActive = selectedAssemblyId === a.id;
          return (
            <button key={a.id} onClick={() => onAssemblyClick(a.id)}
              style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                background: isActive ? (cfg?.color ?? '#475569') : '#f1f5f9',
                color: isActive ? '#fff' : '#475569',
                border: `1px solid ${isActive ? (cfg?.color ?? '#475569') : '#e2e8f0'}`,
                fontWeight: isActive ? 700 : 400,
              }}>
              {a.icon} {a.name}
            </button>
          );
        })}
      </div>

      {/* 车身集成示意图 */}
      <div style={{
        background: '#fafafa', borderRadius: 10, padding: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <CarDiagram
          selectedAssemblyId={selectedAssemblyId}
          selectedSubId={selectedSubId}
        />
      </div>
    </div>
  );
};

export default SealingDiagram;
