import { useState } from 'react';

interface Props {
  onSelect: (assemblyId: string) => void;
  selectedId: string;
}

const W = 880, H = 700;
const BG = '#080f1e';

/* ── 机器人体色 (银白金属风格) ── */
const RS  = '#527090';   // 描边
const RL  = '#dceaf6';   // 高光
const RD  = '#8aafc5';   // 暗面板
const JA  = '#3a6080';   // 关节环
const JF  = '#1a3048';   // 关节芯

const THEME: Record<string, { border: string; text: string; line: string; bg: string; sub: string }> = {
  indigo: { border: '#6366f1', text: '#a5b4fc', line: '#6366f1', bg: '#1e1b4b', sub: '#818cf8' },
  blue:   { border: '#3b82f6', text: '#93c5fd', line: '#3b82f6', bg: '#0c2a4a', sub: '#60a5fa' },
  amber:  { border: '#f59e0b', text: '#fcd34d', line: '#f59e0b', bg: '#2a1500', sub: '#fbbf24' },
  pink:   { border: '#ec4899', text: '#f9a8d4', line: '#ec4899', bg: '#2d0a1e', sub: '#f472b6' },
  cyan:   { border: '#06b6d4', text: '#67e8f9', line: '#06b6d4', bg: '#0c2d3a', sub: '#22d3ee' },
  green:  { border: '#22c55e', text: '#86efac', line: '#22c55e', bg: '#0c2a18', sub: '#4ade80' },
  purple: { border: '#a855f7', text: '#d8b4fe', line: '#a855f7', bg: '#1e0a3c', sub: '#c084fc' },
  orange: { border: '#f97316', text: '#fdba74', line: '#f97316', bg: '#2a0e03', sub: '#fb923c' },
};

interface LabelDef {
  assemblyId: string;
  name: string;
  color: string;
  side: 'left' | 'right';
  ly: number;
  lh: number;
  bx: number;
  by: number;
  items: string[];
}

const LW   = 145;
const LX_L = 8;
const LX_R = W - LW - 8; // 727

const LABELS: LabelDef[] = [
  // ── 左侧 ──
  { assemblyId: 'rb-05', name: '控制与计算系统', color: 'indigo', side: 'left',
    ly: 32,  lh: 80, bx: 410, by: 76,  items: ['主控芯片', '算法处理器', '…'] },
  { assemblyId: 'rb-01', name: '机身结构',       color: 'blue',   side: 'left',
    ly: 178, lh: 72, bx: 330, by: 232, items: ['结构件', '外观装饰件'] },
  { assemblyId: 'rb-02', name: '关节/驱动系统',  color: 'amber',  side: 'left',
    ly: 318, lh: 80, bx: 210, by: 282, items: ['电机', '减速器', '编码器'] },
  { assemblyId: 'rb-08', name: '仿生组织',        color: 'pink',   side: 'left',
    ly: 458, lh: 80, bx: 202, by: 436, items: ['仿生皮肤', '仿生肌腱', '…'] },
  // ── 右侧 ──
  { assemblyId: 'rb-04', name: '感知系统',        color: 'cyan',   side: 'right',
    ly: 32,  lh: 80, bx: 470, by: 76,  items: ['激光雷达', '深度相机', '传感器'] },
  { assemblyId: 'rb-06', name: '电源系统',        color: 'green',  side: 'right',
    ly: 178, lh: 72, bx: 550, by: 215, items: ['电池包', 'BMS', '…'] },
  { assemblyId: 'rb-03', name: '灵巧手',          color: 'purple', side: 'right',
    ly: 318, lh: 80, bx: 676, by: 436, items: ['力传感器', '触觉传感器', '…'] },
  { assemblyId: 'rb-07', name: '热管理系统',      color: 'orange', side: 'right',
    ly: 458, lh: 80, bx: 540, by: 346, items: ['风冷', '液冷', 'VC均热板'] },
];

export default function RobotBodyDiagram({ onSelect, selectedId }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto rounded-xl" style={{ background: BG }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 700 }}>
        <defs>
          {/* 背景网格 */}
          <pattern id="rbGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e1f35" strokeWidth="0.5"/>
          </pattern>

          {/* 机身水平渐变 (左右暗、中央亮) */}
          <linearGradient id="gBodyH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#9ab0c5"/>
            <stop offset="35%"  stopColor="#ccdae8"/>
            <stop offset="65%"  stopColor="#ccdae8"/>
            <stop offset="100%" stopColor="#9ab0c5"/>
          </linearGradient>
          {/* 头部垂直渐变 */}
          <linearGradient id="gHeadV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#dceaf6"/>
            <stop offset="100%" stopColor="#a8c0d2"/>
          </linearGradient>
          {/* 手臂水平渐变 */}
          <linearGradient id="gArmH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8aadc2"/>
            <stop offset="45%"  stopColor="#c8dae8"/>
            <stop offset="100%" stopColor="#8aadc2"/>
          </linearGradient>
          {/* 腿部水平渐变 */}
          <linearGradient id="gLegH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8aadc2"/>
            <stop offset="50%"  stopColor="#c5d8e6"/>
            <stop offset="100%" stopColor="#8aadc2"/>
          </linearGradient>
          {/* 关节球形渐变 */}
          <radialGradient id="gJoint" cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#4a6a82"/>
            <stop offset="100%" stopColor="#0e2030"/>
          </radialGradient>
          {/* 胸腔发光渐变 */}
          <radialGradient id="gChest" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#082030" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* 背景 */}
        <rect width={W} height={H} fill={BG}/>
        <rect width={W} height={H} fill="url(#rbGrid)"/>

        {/* 标题 */}
        <text x={W/2} y={15} textAnchor="middle" fill="#1e3a5f"
          fontSize="10" fontWeight="bold" letterSpacing="2.5">
          智能机器人 · 工程蓝图与系统结构解析
        </text>

        {/* ════════════════════════════════
              机器人主体
            ════════════════════════════════ */}

        {/* ── 头部 ── */}
        <rect x={410} y={40} width={60} height={70} rx={20}
          fill="url(#gHeadV)" stroke={RS} strokeWidth={1.5}/>
        {/* 顶部高光 */}
        <rect x={416} y={43} width={30} height={18} rx={8}
          fill={RL} opacity={0.45}/>
        {/* 面部护板 */}
        <rect x={416} y={62} width={48} height={27} rx={5}
          fill="#12253a" stroke="#2a4a62" strokeWidth={0.9}/>
        {/* 左眼 */}
        <rect x={418} y={64} width={20} height={23} rx={4}
          fill="#0b3550" stroke="#0ea5e9" strokeWidth={0.9} opacity={0.95}/>
        {/* 右眼 */}
        <rect x={442} y={64} width={20} height={23} rx={4}
          fill="#0b3550" stroke="#0ea5e9" strokeWidth={0.9} opacity={0.95}/>
        {/* 眼部发光 */}
        <rect x={419} y={65} width={18} height={8} rx={3}
          fill="#22d3ee" opacity={0.4}/>
        <rect x={443} y={65} width={18} height={8} rx={3}
          fill="#22d3ee" opacity={0.4}/>
        {/* 额头传感点 */}
        {[424, 432, 440, 448, 456].map((x, i) => (
          <circle key={i} cx={x} cy={52} r={2.2} fill="#0ea5e9" opacity={0.6}/>
        ))}
        {/* 下颌细节 */}
        <rect x={421} y={96} width={38} height={8} rx={3}
          fill={RD} stroke={RS} strokeWidth={0.7}/>

        {/* ── 颈部 ── */}
        <rect x={428} y={110} width={24} height={24} rx={4}
          fill="url(#gBodyH)" stroke={RS} strokeWidth={1.4}/>
        {[434, 440, 446].map((x, i) => (
          <line key={i} x1={x} y1={112} x2={x} y2={132}
            stroke={RS} strokeWidth={0.5} opacity={0.4}/>
        ))}

        {/* ── 肩部横梁 ── */}
        <rect x={268} y={134} width={344} height={24} rx={8}
          fill="url(#gBodyH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={272} y={136} width={336} height={8} rx={4}
          fill={RL} opacity={0.25}/>

        {/* ── 躯干 ── */}
        <rect x={330} y={158} width={220} height={178} rx={10}
          fill="url(#gBodyH)" stroke={RS} strokeWidth={1.5}/>
        {/* 左胸面板 */}
        <rect x={344} y={170} width={88} height={58} rx={5}
          fill="#111e30" stroke="#243548" strokeWidth={0.8}/>
        {/* 右胸面板 */}
        <rect x={448} y={170} width={88} height={58} rx={5}
          fill="#111e30" stroke="#243548" strokeWidth={0.8}/>
        {/* 胸腔指示灯 */}
        {[352, 364, 376].map((x, i) => (
          <circle key={i} cx={x} cy={180} r={3.2}
            fill={['#22d3ee','#4ade80','#818cf8'][i]} opacity={0.85}/>
        ))}
        {/* 中央胸腔发光圈 */}
        <circle cx={440} cy={202} r={22} fill="url(#gChest)"/>
        <circle cx={440} cy={202} r={16} fill="#0e1e30" stroke="#1e4060" strokeWidth={1}/>
        <circle cx={440} cy={202} r={10} fill="#081828" stroke="#0ea5e9" strokeWidth={0.8} opacity={0.7}/>
        <circle cx={440} cy={202} r={4.5} fill="#22d3ee" opacity={0.7}/>
        {/* 腹部面板 */}
        <rect x={362} y={248} width={156} height={46} rx={5}
          fill="#111e30" stroke="#243548" strokeWidth={0.8}/>
        {/* 腹部细节格线 */}
        {[390, 418, 446].map((x, i) => (
          <line key={i} x1={x} y1={252} x2={x} y2={290}
            stroke="#1e3a5f" strokeWidth={0.6} opacity={0.6}/>
        ))}
        {/* 躯干纵向分缝 */}
        <line x1={440} y1={160} x2={440} y2={336}
          stroke={RS} strokeWidth={0.5} opacity={0.2}/>
        {/* 躯干高光条 */}
        <rect x={334} y={160} width={36} height={110} rx={6}
          fill={RL} opacity={0.06}/>

        {/* ── 骨盆 ── */}
        <rect x={338} y={336} width={204} height={44} rx={8}
          fill="url(#gBodyH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={352} y={342} width={78} height={16} rx={3}
          fill="#111e30" stroke="#243548" strokeWidth={0.7}/>
        <rect x={450} y={342} width={78} height={16} rx={3}
          fill="#111e30" stroke="#243548" strokeWidth={0.7}/>

        {/* ════ 左臂 (图左 = 机器人右臂) ════ */}
        {/* 肩盖 */}
        <rect x={208} y={138} width={60} height={32} rx={10}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        {/* 上臂 */}
        <rect x={210} y={170} width={50} height={108} rx={12}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={214} y={174} width={16} height={56} rx={5}
          fill={RL} opacity={0.22}/>
        <line x1={235} y1={172} x2={235} y2={276}
          stroke={RS} strokeWidth={0.5} opacity={0.35}/>
        {/* 前臂 */}
        <rect x={212} y={290} width={46} height={118} rx={10}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={235} y1={294} x2={235} y2={404}
          stroke={RS} strokeWidth={0.5} opacity={0.3}/>
        {/* 手掌 */}
        <rect x={202} y={410} width={58} height={80} rx={12}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={210} y={420} width={40} height={28} rx={5}
          fill="#111e30" stroke="#243548" strokeWidth={0.7}/>
        {/* 手指 (4根) */}
        {[204, 216, 228, 240].map((x, i) => (
          <rect key={i} x={x} y={490} width={10} height={24} rx={4}
            fill="url(#gArmH)" stroke={RS} strokeWidth={0.9}/>
        ))}

        {/* ════ 右臂 (图右 = 机器人左臂) ════ */}
        {/* 肩盖 */}
        <rect x={612} y={138} width={60} height={32} rx={10}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        {/* 上臂 */}
        <rect x={620} y={170} width={50} height={108} rx={12}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={624} y={174} width={16} height={56} rx={5}
          fill={RL} opacity={0.22}/>
        <line x1={645} y1={172} x2={645} y2={276}
          stroke={RS} strokeWidth={0.5} opacity={0.35}/>
        {/* 前臂 */}
        <rect x={622} y={290} width={46} height={118} rx={10}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={645} y1={294} x2={645} y2={404}
          stroke={RS} strokeWidth={0.5} opacity={0.3}/>
        {/* 手掌 */}
        <rect x={620} y={410} width={58} height={80} rx={12}
          fill="url(#gArmH)" stroke={RS} strokeWidth={1.5}/>
        <rect x={630} y={420} width={40} height={28} rx={5}
          fill="#111e30" stroke="#243548" strokeWidth={0.7}/>
        {/* 手指 (4根) */}
        {[622, 634, 646, 658].map((x, i) => (
          <rect key={i} x={x} y={490} width={10} height={24} rx={4}
            fill="url(#gArmH)" stroke={RS} strokeWidth={0.9}/>
        ))}

        {/* ════ 腿部 ════ */}
        {/* 左大腿 */}
        <rect x={347} y={380} width={62} height={132} rx={12}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={378} y1={384} x2={378} y2={508}
          stroke={RS} strokeWidth={0.5} opacity={0.3}/>
        {/* 左小腿 */}
        <rect x={351} y={516} width={54} height={108} rx={10}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={378} y1={520} x2={378} y2={618}
          stroke={RS} strokeWidth={0.5} opacity={0.28}/>
        {/* 左脚 */}
        <rect x={332} y={620} width={84} height={20} rx={8}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.4}/>

        {/* 右大腿 */}
        <rect x={471} y={380} width={62} height={132} rx={12}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={502} y1={384} x2={502} y2={508}
          stroke={RS} strokeWidth={0.5} opacity={0.3}/>
        {/* 右小腿 */}
        <rect x={475} y={516} width={54} height={108} rx={10}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.5}/>
        <line x1={502} y1={520} x2={502} y2={618}
          stroke={RS} strokeWidth={0.5} opacity={0.28}/>
        {/* 右脚 */}
        <rect x={464} y={620} width={84} height={20} rx={8}
          fill="url(#gLegH)" stroke={RS} strokeWidth={1.4}/>

        {/* ════ 关节圆 ════ */}
        {/* 肩关节 */}
        <circle cx={234} cy={152} r={15} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={234} cy={152} r={6}  fill={JF}/>
        <circle cx={646} cy={152} r={15} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={646} cy={152} r={6}  fill={JF}/>
        {/* 肘关节 */}
        <circle cx={235} cy={281} r={13} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={235} cy={281} r={5}  fill={JF}/>
        <circle cx={645} cy={281} r={13} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={645} cy={281} r={5}  fill={JF}/>
        {/* 腕关节 */}
        <circle cx={231} cy={402} r={9}  fill="url(#gJoint)" stroke={JA} strokeWidth={1.2}/>
        <circle cx={649} cy={402} r={9}  fill="url(#gJoint)" stroke={JA} strokeWidth={1.2}/>
        {/* 髋关节 */}
        <circle cx={378} cy={379} r={14} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={378} cy={379} r={6}  fill={JF}/>
        <circle cx={502} cy={379} r={14} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={502} cy={379} r={6}  fill={JF}/>
        {/* 膝关节 */}
        <circle cx={378} cy={515} r={13} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={378} cy={515} r={5}  fill={JF}/>
        <circle cx={502} cy={515} r={13} fill="url(#gJoint)" stroke={JA} strokeWidth={1.5}/>
        <circle cx={502} cy={515} r={5}  fill={JF}/>
        {/* 踝关节 */}
        <circle cx={374} cy={621} r={8}  fill="url(#gJoint)" stroke={JA} strokeWidth={1.2}/>
        <circle cx={506} cy={621} r={8}  fill="url(#gJoint)" stroke={JA} strokeWidth={1.2}/>

        {/* ════ 尺寸标注 ════ */}
        {/* 身高标注线 */}
        <line x1={192} y1={40} x2={192} y2={640}
          stroke="#1e3a5f" strokeWidth={0.8} strokeDasharray="3,4"/>
        <line x1={187} y1={40}  x2={197} y2={40}  stroke="#1e3a5f" strokeWidth={0.9}/>
        <line x1={187} y1={640} x2={197} y2={640} stroke="#1e3a5f" strokeWidth={0.9}/>
        <text x={186} y={344} fill="#1e3a5f" fontSize="8" textAnchor="middle"
          transform="rotate(-90,186,344)">身高 1.73m</text>

        {/* 肩宽标注 */}
        <line x1={234} y1={126} x2={646} y2={126}
          stroke="#1e3a5f" strokeWidth={0.8} strokeDasharray="3,4"/>
        <line x1={234} y1={121} x2={234} y2={131} stroke="#1e3a5f" strokeWidth={0.9}/>
        <line x1={646} y1={121} x2={646} y2={131} stroke="#1e3a5f" strokeWidth={0.9}/>
        <text x={440} y={124} fill="#1e3a5f" fontSize="7.5" textAnchor="middle">
          肩宽 0.48m
        </text>

        {/* ════ 标注标签 & 连接线 ════ */}
        {LABELS.map(label => {
          const t = THEME[label.color];
          const lx = label.side === 'left' ? LX_L : LX_R;
          const cy = label.ly + label.lh / 2;
          const isSelected = selectedId === label.assemblyId;
          const isHov = hoveredId === label.assemblyId;
          const active = isSelected || isHov;
          const midX = label.side === 'left' ? lx + LW + 30 : lx - 30;

          const pts = label.side === 'left'
            ? `${lx + LW},${cy} ${midX},${cy} ${label.bx},${label.by}`
            : `${label.bx},${label.by} ${midX},${cy} ${lx},${cy}`;

          return (
            <g key={label.assemblyId}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect(label.assemblyId)}
              onMouseEnter={() => setHoveredId(label.assemblyId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* 连接线 */}
              <polyline
                points={pts}
                fill="none"
                stroke={active ? t.line : '#1e3a5f'}
                strokeWidth={active ? 1.5 : 0.8}
                strokeDasharray={active ? undefined : '4,3'}
                opacity={active ? 1 : 0.7}
              />
              {/* 机体端连接点 */}
              <circle cx={label.bx} cy={label.by} r={3.5}
                fill={active ? t.line : '#2a4a60'}
                opacity={active ? 1 : 0.55}
              />

              {/* 标签阴影 */}
              {active && (
                <rect x={lx+2} y={label.ly+2} width={LW} height={label.lh} rx={6}
                  fill={t.border} opacity={0.14}/>
              )}
              {/* 标签框 */}
              <rect x={lx} y={label.ly} width={LW} height={label.lh} rx={6}
                fill={active ? t.bg : '#0a1c2e'}
                stroke={active ? t.border : '#1e3a5f'}
                strokeWidth={active ? 1.5 : 0.8}
              />
              {/* 色彩竖条 */}
              <rect
                x={label.side === 'left' ? lx : lx + LW - 4}
                y={label.ly + 6}
                width={4} height={label.lh - 12} rx={2}
                fill={t.border} opacity={active ? 0.9 : 0.38}
              />
              {/* 系统名称 */}
              <text
                x={label.side === 'left' ? lx + 11 : lx + 10}
                y={label.ly + 18}
                fill={active ? t.text : '#475569'}
                fontSize="11" fontWeight="bold" letterSpacing="0.4"
              >
                {label.name}
              </text>
              {/* 子条目 */}
              {label.items.map((item, i) => (
                <text key={i}
                  x={label.side === 'left' ? lx + 14 : lx + 11}
                  y={label.ly + 33 + i * 14}
                  fill={active ? t.sub : '#2e4a60'}
                  fontSize="10"
                >
                  {item}
                </text>
              ))}
            </g>
          );
        })}

        {/* 底部提示 */}
        <text x={W / 2} y={H - 6} textAnchor="middle" fill="#1e3a5f" fontSize="9">
          点击各系统标签 → 查看详细零件清单与材料信息
        </text>
      </svg>
    </div>
  );
}
