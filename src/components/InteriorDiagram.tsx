import { useState, useRef } from 'react';
import { materials } from '../data/materials';

type Part = {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  subcategory?: string;
  materials: string[];
  description?: string;
  function?: string;
};

interface InteriorDiagramProps {
  parts: Part[];
  onPartClick: (part: Part) => void;
  onPartEdit?: (part: Part) => void;
}

type Zone = {
  id: string;
  partType: string;
  label: string;
  color: string;
  bg: string;
  zoneX: number; zoneY: number; zoneW: number; zoneH: number;
  rx?: number;
  dotX: number; dotY: number;
  labelX: number; labelY: number;
};

const HANDLES = ['nw','n','ne','e','se','s','sw','w'] as const;
type HandleDir = typeof HANDLES[number];

const CURSOR_MAP: Record<HandleDir, string> = {
  nw: 'nw-resize', n: 'n-resize',  ne: 'ne-resize',
  e:  'e-resize',  se: 'se-resize', s:  's-resize',
  sw: 'sw-resize', w:  'w-resize',
};

function handlePos(z: Zone, dir: HandleDir) {
  const cx = z.zoneX + z.zoneW / 2, cy = z.zoneY + z.zoneH / 2;
  switch (dir) {
    case 'nw': return { x: z.zoneX,           y: z.zoneY };
    case 'n':  return { x: cx,                 y: z.zoneY };
    case 'ne': return { x: z.zoneX + z.zoneW,  y: z.zoneY };
    case 'e':  return { x: z.zoneX + z.zoneW,  y: cy };
    case 'se': return { x: z.zoneX + z.zoneW,  y: z.zoneY + z.zoneH };
    case 's':  return { x: cx,                 y: z.zoneY + z.zoneH };
    case 'sw': return { x: z.zoneX,            y: z.zoneY + z.zoneH };
    case 'w':  return { x: z.zoneX,            y: cy };
  }
}

const INITIAL_ZONES: Zone[] = [
  {
    id: 'rear_door',  partType: 'rear_door',  label: '后背门内饰板',
    color: '#2563eb', bg: '#dbeafe',
    zoneX: 40,  zoneY: 108, zoneW: 90,  zoneH: 322,
    dotX: 85,   dotY: 108, labelX: 88,  labelY: 20,
  },
  {
    id: 'rear_side',  partType: 'rear_side',  label: '后侧围内饰板',
    color: '#0891b2', bg: '#e0f2fe',
    zoneX: 130, zoneY: 175, zoneW: 85,  zoneH: 255,
    dotX: 172,  dotY: 175, labelX: 172, labelY: 20,
  },
  {
    id: 'pillar',     partType: 'pillar',     label: '立柱内饰板',
    color: '#475569', bg: '#e2e8f0',
    zoneX: 215, zoneY: 55,  zoneW: 25,  zoneH: 385,
    dotX: 228,  dotY: 62,  labelX: 284, labelY: 20,
  },
  {
    id: 'door',       partType: 'door',       label: '门饰板',
    color: '#059669', bg: '#d1fae5',
    zoneX: 240, zoneY: 108, zoneW: 175, zoneH: 322,
    dotX: 328,  dotY: 108, labelX: 390, labelY: 20,
  },
  {
    id: 'headliner',  partType: 'headliner',  label: '顶棚总成',
    color: '#7c3aed', bg: '#ede9fe',
    zoneX: 40,  zoneY: 55,  zoneW: 740, zoneH: 53,
    dotX: 420,  dotY: 62,  labelX: 506, labelY: 20,
  },
  {
    id: 'handle',     partType: 'handle',     label: '内扣手',
    color: '#d97706', bg: '#fef3c7',
    zoneX: 255, zoneY: 260, zoneW: 130, zoneH: 38,
    dotX: 400,  dotY: 260, rx: 4,
    labelX: 598, labelY: 20,
  },
  {
    id: 'dashboard',  partType: 'dashboard',  label: '仪表板',
    color: '#dc2626', bg: '#fee2e2',
    zoneX: 628, zoneY: 55,  zoneW: 152, zoneH: 230,
    dotX: 704,  dotY: 62,  labelX: 730, labelY: 20,
  },
  {
    id: 'carpet',     partType: 'carpet',     label: '地毯脚垫',
    color: '#92400e', bg: '#fef9c3',
    zoneX: 40,  zoneY: 418, zoneW: 740, zoneH: 22,
    dotX: 220,  dotY: 440, labelX: 185, labelY: 468,
  },
  {
    id: 'fridge',     partType: 'fridge',     label: '冰箱总成',
    color: '#0d9488', bg: '#ccfbf1',
    zoneX: 418, zoneY: 360, zoneW: 120, zoneH: 58, rx: 4,
    dotX: 478,  dotY: 418, labelX: 370, labelY: 468,
  },
  {
    id: 'door_sill',  partType: 'door_sill',  label: '门槛内饰板',
    color: '#64748b', bg: '#f1f5f9',
    zoneX: 40,  zoneY: 400, zoneW: 740, zoneH: 18,
    dotX: 550,  dotY: 418, labelX: 520, labelY: 468,
  },
  {
    id: 'cnsl',       partType: 'cnsl',       label: '副仪表板',
    color: '#9333ea', bg: '#f3e8ff',
    zoneX: 628, zoneY: 285, zoneW: 152, zoneH: 133,
    dotX: 704,  dotY: 418, labelX: 648, labelY: 468,
  },
  {
    id: 'vent',       partType: 'vent',       label: '出风口',
    color: '#ea580c', bg: '#ffedd5',
    zoneX: 640, zoneY: 132, zoneW: 62,  zoneH: 30, rx: 3,
    dotX: 750,  dotY: 370, labelX: 750, labelY: 468,
  },
];

export default function InteriorDiagram({ parts, onPartClick, onPartEdit }: InteriorDiagramProps) {
  const [zones, setZones] = useState<Zone[]>(() => INITIAL_ZONES.map(z => ({ ...z })));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 拖拽状态（用 ref 避免重渲染延迟）
  const dragRef = useRef<{
    mode: 'move' | 'resize';
    zoneId: string;
    handle: HandleDir | null;
    startX: number; startY: number;
    orig: Zone;
  } | null>(null);

  const interiorParts: Record<string, Part[]> = {
    dashboard: parts.filter(p => p.subcategory?.startsWith('内饰-仪表板')),
    door:      parts.filter(p => p.subcategory?.startsWith('内饰-门板') || p.subcategory?.startsWith('内饰-门饰板')),
    cnsl:      parts.filter(p => p.subcategory?.startsWith('内饰-CNSL') || p.subcategory?.startsWith('内饰-副仪表板')),
    pillar:    parts.filter(p => p.subcategory?.startsWith('内饰-立柱')),
    headliner: parts.filter(p => p.subcategory?.startsWith('内饰-顶棚')),
    carpet:    parts.filter(p => p.subcategory?.startsWith('内饰-地毯')),
    rear_door: parts.filter(p => p.subcategory?.startsWith('内饰-后背门')),
    rear_side: parts.filter(p => p.subcategory?.startsWith('内饰-后侧围')),
    handle:    parts.filter(p => p.subcategory?.startsWith('内饰-内扣手')),
    vent:      parts.filter(p => p.subcategory?.startsWith('内饰-出风口')),
    door_sill: parts.filter(p => p.subcategory?.startsWith('内饰-门槛')),
    fridge:    parts.filter(p => p.subcategory?.startsWith('内饰-冰箱')),
  };

  // ── 坐标转换：屏幕坐标 → SVG 本地坐标 ──
  const toSVG = (e: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = svgRef.current.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  // ── 区域点击（选中 + 展示零件） ──
  const selectZone = (zoneId: string) => {
    setSelectedId(zoneId);
    const z = zones.find(z => z.id === zoneId);
    if (!z) return;
    const list = interiorParts[z.partType] || [];
    setSelectedPart(list.length > 0 ? list[0] : null);
  };

  // ── 区域 mousedown：选中 or 启动移动 ──
  const onZoneMD = (e: React.MouseEvent, zone: Zone) => {
    if (e.button !== 0 || e.ctrlKey) return;
    e.stopPropagation();
    if (selectedId !== zone.id) {
      selectZone(zone.id);
      return;
    }
    // 已选中 → 启动移动
    const { x, y } = toSVG(e);
    dragRef.current = { mode: 'move', zoneId: zone.id, handle: null, startX: x, startY: y, orig: { ...zone } };
  };

  // ── 调整手柄 mousedown ──
  const onHandleMD = (e: React.MouseEvent, zoneId: string, dir: HandleDir) => {
    e.preventDefault();
    e.stopPropagation();
    const { x, y } = toSVG(e);
    const orig = zones.find(z => z.id === zoneId)!;
    dragRef.current = { mode: 'resize', zoneId, handle: dir, startX: x, startY: y, orig: { ...orig } };
  };

  // ── 容器 mousedown（平移） ──
  const onContainerMD = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
    }
  };

  // ── mousemove：执行移动/缩放/平移 ──
  const onMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: panStartRef.current.px + e.clientX - panStartRef.current.mx,
        y: panStartRef.current.py + e.clientY - panStartRef.current.my,
      });
      return;
    }
    const drag = dragRef.current;
    if (!drag) return;

    const { x, y } = toSVG(e);
    const dx = x - drag.startX, dy = y - drag.startY;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;

    const MIN = 15;
    setZones(prev => prev.map(z => {
      if (z.id !== drag.zoneId) return z;
      if (drag.mode === 'move') {
        return {
          ...z,
          zoneX: drag.orig.zoneX + dx,
          zoneY: drag.orig.zoneY + dy,
          dotX:  drag.orig.dotX  + dx,
          dotY:  drag.orig.dotY  + dy,
          labelX: drag.orig.labelX + dx,
          // labelY 固定（顶/底标签行）
        };
      }
      // ── resize ──
      let { zoneX, zoneY, zoneW, zoneH } = drag.orig;
      switch (drag.handle) {
        case 'nw': zoneX += dx; zoneY += dy; zoneW -= dx; zoneH -= dy; break;
        case 'n':  zoneY += dy; zoneH -= dy; break;
        case 'ne': zoneY += dy; zoneW += dx; zoneH -= dy; break;
        case 'e':  zoneW += dx; break;
        case 'se': zoneW += dx; zoneH += dy; break;
        case 's':  zoneH += dy; break;
        case 'sw': zoneX += dx; zoneW -= dx; zoneH += dy; break;
        case 'w':  zoneX += dx; zoneW -= dx; break;
      }
      if (zoneW < MIN) { zoneX = drag.orig.zoneX + drag.orig.zoneW - MIN; zoneW = MIN; }
      if (zoneH < MIN) { zoneY = drag.orig.zoneY + drag.orig.zoneH - MIN; zoneH = MIN; }
      return { ...z, zoneX, zoneY, zoneW, zoneH };
    }));
  };

  const onMouseUp = () => {
    dragRef.current = null;
    setIsPanning(false);
  };

  const bw = (label: string) => Math.max(40, label.length * 12 + 10);

  const selZone = zones.find(z => z.id === selectedId);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* ── 标题栏 ── */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">内饰零部件示意图</h2>
          <p className="text-sm text-gray-500 mt-1">
            点击区域选中 · 再次拖动可移位 · 拖动蓝色手柄可调整大小
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end">
          <button onClick={() => setScale(p => Math.max(p / 1.2, 0.5))}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">🔍−</button>
          <span className="text-sm font-medium text-gray-700 min-w-[52px] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(p => Math.min(p * 1.2, 3))}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">🔍+</button>
          <button onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">重置视图</button>
          <button
            onClick={() => { setZones(INITIAL_ZONES.map(z => ({ ...z }))); setSelectedId(null); setSelectedPart(null); }}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
            重置布局
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── SVG 示意图 ── */}
        <div className="lg:col-span-2">
          <div
            ref={containerRef}
            className="relative overflow-hidden border-2 border-gray-200 rounded-lg"
            style={{
              cursor: isPanning ? 'grabbing' : dragRef.current ? 'crosshair' : 'default',
              height: '530px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            }}
            onWheel={e => { e.preventDefault(); setScale(p => Math.min(Math.max(0.5, p * (e.deltaY > 0 ? 0.9 : 1.1)), 3)); }}
            onMouseDown={onContainerMD}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 820 500"
              style={{
                width: '100%', height: '100%',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.1s ease-out',
                fontFamily: 'inherit',
              }}
            >
              {/* ── 车轮廓（装饰） ── */}
              <path d="M 30,108 Q 32,50 60,50 L 760,50 Q 788,50 790,90 L 790,108"
                fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,3"/>
              <path d="M 30,108 L 30,445 L 790,445 L 790,108"
                fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6,3"/>
              <circle cx="145" cy="455" r="22" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3"/>
              <circle cx="145" cy="455" r="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>
              <circle cx="668" cy="455" r="22" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,3"/>
              <circle cx="668" cy="455" r="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1"/>

              {/* ── 背景色块 ── */}
              {zones.map(zone => (
                <rect key={`bg-${zone.id}`}
                  x={zone.zoneX} y={zone.zoneY} width={zone.zoneW} height={zone.zoneH}
                  rx={zone.rx ?? 0}
                  fill={zone.bg}
                  stroke={zone.color} strokeWidth="1.2"
                />
              ))}

              {/* 中央座舱（不可点击） */}
              <rect x="415" y="108" width="213" height="292" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
              <text x="522" y="250" textAnchor="middle" fill="#94a3b8" fontSize="11" fontStyle="italic">座舱空间</text>
              <text x="522" y="265" textAnchor="middle" fill="#94a3b8" fontSize="11" fontStyle="italic">（中央）</text>

              {/* ── 区域内小标签 + 件数 ── */}
              {zones.map(zone => {
                const cx = zone.zoneX + zone.zoneW / 2;
                const cy = zone.zoneY + zone.zoneH / 2;
                const cnt = (interiorParts[zone.partType] || []).length;
                return (
                  <g key={`inner-${zone.id}`} style={{ pointerEvents: 'none' }}>
                    <text x={cx} y={cy + 2} textAnchor="middle"
                      fill={zone.color} fontSize="10" fontWeight="600" opacity="0.65">
                      {zone.label}
                    </text>
                    {cnt > 0 && (
                      <text x={cx} y={cy + 14} textAnchor="middle"
                        fill={zone.color} fontSize="9" opacity="0.55">{cnt}件</text>
                    )}
                  </g>
                );
              })}

              {/* ── 可交互层：悬停高亮 + 引线标注 ── */}
              {zones.map(zone => {
                const isHovered  = hoveredId  === zone.id;
                const isSelected = selectedId === zone.id;
                const isActive   = isHovered || isSelected;
                const w = bw(zone.label);
                const isTop = zone.labelY < 35;
                const lineEndY = isTop ? zone.labelY + 11 : zone.labelY - 11;

                return (
                  <g key={zone.id}
                    style={{ cursor: isSelected ? 'move' : 'pointer' }}
                    onMouseDown={e => onZoneMD(e, zone)}
                    onMouseEnter={() => setHoveredId(zone.id)}
                    onMouseLeave={() => setHoveredId(null)}>

                    {/* 点击热区（透明） */}
                    <rect
                      x={zone.zoneX} y={zone.zoneY} width={zone.zoneW} height={zone.zoneH}
                      rx={zone.rx ?? 0}
                      fill={zone.color} opacity={isActive ? 0.28 : 0}
                      stroke={isSelected ? zone.color : 'none'} strokeWidth={isSelected ? 2 : 0}
                    />

                    {/* 引线 + 圆点 + 标签 */}
                    <line x1={zone.dotX} y1={zone.dotY} x2={zone.labelX} y2={lineEndY}
                      stroke={zone.color} strokeWidth={isActive ? 1.8 : 1.2} opacity={isActive ? 1 : 0.6}/>
                    <circle cx={zone.dotX} cy={zone.dotY} r={isActive ? 4 : 3}
                      fill={zone.color} opacity={isActive ? 1 : 0.75}/>
                    <rect x={zone.labelX - w/2} y={zone.labelY - 11} width={w} height="22" rx="4"
                      fill={zone.color} opacity={isActive ? 1 : 0.82}/>
                    <text x={zone.labelX} y={zone.labelY + 4} textAnchor="middle"
                      fill="#fff" fontSize="11" fontWeight="700" style={{ pointerEvents: 'none' }}>
                      {zone.label}
                    </text>
                  </g>
                );
              })}

              {/* ── 选中区域：8个调整手柄 ── */}
              {selZone && (
                <g>
                  {/* 选中外框（蓝色虚线） */}
                  <rect
                    x={selZone.zoneX - 3} y={selZone.zoneY - 3}
                    width={selZone.zoneW + 6} height={selZone.zoneH + 6}
                    rx={4} fill="none"
                    stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3"
                    style={{ pointerEvents: 'none' }}
                  />
                  {/* 尺寸提示 */}
                  <text
                    x={selZone.zoneX + selZone.zoneW / 2}
                    y={selZone.zoneY - 8}
                    textAnchor="middle" fill="#3b82f6" fontSize="9"
                    style={{ pointerEvents: 'none' }}>
                    {Math.round(selZone.zoneW)} × {Math.round(selZone.zoneH)}
                  </text>
                  {/* 8个调整手柄 */}
                  {HANDLES.map(dir => {
                    const { x, y } = handlePos(selZone, dir);
                    return (
                      <rect key={dir}
                        x={x - 4.5} y={y - 4.5} width="9" height="9" rx="2"
                        fill="white" stroke="#3b82f6" strokeWidth="1.5"
                        style={{ cursor: CURSOR_MAP[dir] }}
                        onMouseDown={e => onHandleMD(e, selZone.id, dir)}
                      />
                    );
                  })}
                </g>
              )}

              {/* 外框 */}
              <rect x="40" y="55" width="740" height="385" rx="4"
                fill="none" stroke="#d1d5db" strokeWidth="1.5" style={{ pointerEvents: 'none' }}/>
            </svg>
          </div>

          {/* 当前选中位置信息 */}
          {selZone && (
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded px-3 py-1.5 border border-gray-200">
              <span className="font-medium" style={{ color: selZone.color }}>{selZone.label}</span>
              <span>位置 X:{Math.round(selZone.zoneX)} Y:{Math.round(selZone.zoneY)}</span>
              <span>大小 {Math.round(selZone.zoneW)} × {Math.round(selZone.zoneH)}</span>
              <span className="text-gray-400">· 拖动区域移位 · 拖动手柄调整大小 · 点击空白处取消选中</span>
            </div>
          )}
          {!selZone && (
            <p className="text-xs text-gray-400 mt-1 text-center">
              滚轮缩放 | Ctrl+左键拖动平移 | 点击区域选中后可拖动调整
            </p>
          )}
        </div>

        {/* ── 右侧详情面板 ── */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {selectedPart ? (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPart.name}</h3>
              {selectedPart.nameEn && <p className="text-sm text-gray-600 mb-2">{selectedPart.nameEn}</p>}
              {selectedPart.description && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">零部件描述：</p>
                  <p className="text-sm text-gray-600">{selectedPart.description}</p>
                </div>
              )}
              {selectedPart.function && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">功能说明：</p>
                  <p className="text-sm text-gray-600">{selectedPart.function}</p>
                </div>
              )}
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">使用材料：</p>
                <div className="space-y-2">
                  {((part: Part) => materials.filter(m => part.materials.includes(m.id)))(selectedPart).map(m => (
                    <div key={m.id} className="bg-white rounded p-2 border border-blue-200">
                      <p className="font-medium text-sm text-gray-900">{m.name}</p>
                      {m.nameEn && <p className="text-xs text-gray-500">{m.nameEn}</p>}
                      {m.description && <p className="text-xs text-gray-600 mt-1">{m.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {onPartEdit && (
                  <button onClick={() => onPartEdit(selectedPart)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    编辑零部件
                  </button>
                )}
                <button onClick={() => onPartClick(selectedPart)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  查看完整详情
                </button>
              </div>
            </div>
          ) : selectedId ? (
            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">该区域暂无零部件数据</p>
              <p className="text-gray-400 text-xs mt-1">{selZone?.label}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-5 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">点击示意图中的区域</p>
              <p className="text-gray-400 text-xs mt-1">查看该区域的零部件信息</p>
            </div>
          )}

          {/* ── 图例 ── */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">区域图例</p>
            <div className="grid grid-cols-2 gap-1">
              {zones.map(zone => {
                const count = (interiorParts[zone.partType] || []).length;
                const isActive = selectedId === zone.id;
                return (
                  <button key={zone.id}
                    onClick={() => selectZone(zone.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left transition-all ${
                      isActive ? 'bg-white shadow-sm ring-1 ring-blue-200' : 'hover:bg-white'
                    }`}>
                    <span className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: zone.bg, border: `2px solid ${zone.color}` }}/>
                    <span className="text-xs text-gray-700 truncate flex-1">{zone.label}</span>
                    {count > 0 && (
                      <span style={{ color: zone.color }} className="text-xs font-semibold">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 点击空白取消选中 */}
          {selectedId && (
            <button
              onClick={() => { setSelectedId(null); setSelectedPart(null); }}
              className="text-xs text-gray-400 hover:text-gray-600 text-center py-1">
              取消选中
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
