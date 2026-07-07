import { useState } from 'react';
import type { GlassCategory, GlassPart } from '../data/glassAssembly';

interface GlassDiagramProps {
  categories: GlassCategory[];
  selectedCategoryId: string;
  onCategoryClick: (catId: string) => void;
}

export default function GlassDiagram({
  categories,
  selectedCategoryId,
  onCategoryClick,
}: GlassDiagramProps) {
  const [hovered, setHovered] = useState<string>('');

  const isActive = (id: string) => selectedCategoryId === id || hovered === id;

  // 每个玻璃区域的颜色
  const colors: Record<string, { normal: string; active: string; border: string }> = {
    'gl-cat-fw': { normal: '#dbeafe', active: '#93c5fd', border: '#3b82f6' },
    'gl-cat-ts': { normal: '#d1fae5', active: '#6ee7b7', border: '#10b981' },
    'gl-cat-dr': { normal: '#fef3c7', active: '#fcd34d', border: '#f59e0b' },
    'gl-cat-rw': { normal: '#ede9fe', active: '#c4b5fd', border: '#8b5cf6' },
    'gl-cat-sw': { normal: '#fce7f3', active: '#f9a8d4', border: '#ec4899' },
  };

  const getCatColor = (catId: string, type: 'normal' | 'active' | 'border') =>
    colors[catId]?.[type] ?? (type === 'border' ? '#6b7280' : '#f3f4f6');

  // 计算每个分类的隐私等级
  const getPrivacyLevel = (catId: string): 'all' | 'partial' | 'none' => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return 'none';
    const allVariants = cat.parts.flatMap((p: GlassPart) => p.variants);
    const privacyCount = allVariants.filter(v => v.privacyFunction !== '非隐私').length;
    if (privacyCount === 0) return 'none';
    if (privacyCount === allVariants.length) return 'all';
    return 'partial';
  };

  // 计算单个零件的隐私等级（用于前门/后门分别标注）
  const getPartPrivacyLevel = (catId: string, partId: string): 'all' | 'partial' | 'none' => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return 'none';
    const part = cat.parts.find(p => p.id === partId);
    if (!part) return 'none';
    const privacyCount = part.variants.filter(v => v.privacyFunction !== '非隐私').length;
    if (privacyCount === 0) return 'none';
    if (privacyCount === part.variants.length) return 'all';
    return 'partial';
  };

  // 隐私标识徽章（SVG内置）
  const PrivacyBadge = ({ x, y, level }: { x: number; y: number; level: 'all' | 'partial' | 'none' }) => {
    if (level === 'none') return null;
    const isAll = level === 'all';
    const bg = isAll ? '#4b5563' : '#9ca3af';
    const text = isAll ? '隐私' : '部分隐私';
    const w = isAll ? 24 : 44;
    return (
      <g className="pointer-events-none">
        <rect x={x - w / 2} y={y - 8} width={w} height={14} rx={3} fill={bg} opacity={0.85} />
        <text x={x} y={y + 2.5} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{text}</text>
      </g>
    );
  };

  // 隐私覆盖图案（diagonal hatch）— 用 clipPath 限定在形状内
  // 对于隐私玻璃区域叠加半透明深色
  const privacyOverlayOpacity = (level: 'all' | 'partial' | 'none') => {
    if (level === 'all') return 0.18;
    if (level === 'partial') return 0.08;
    return 0;
  };

  const privacyLevels: Record<string, 'all' | 'partial' | 'none'> = {
    'gl-cat-fw': getPrivacyLevel('gl-cat-fw'),
    'gl-cat-ts': getPrivacyLevel('gl-cat-ts'),
    'gl-cat-dr': getPrivacyLevel('gl-cat-dr'),
    'gl-cat-rw': getPrivacyLevel('gl-cat-rw'),
    'gl-cat-sw': getPrivacyLevel('gl-cat-sw'),
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-base font-semibold text-gray-800 mb-1">整车玻璃分布示意图</h3>
      <p className="text-xs text-gray-500 mb-3">点击高亮区域查看对应玻璃规格</p>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* ── 主 SVG：侧视图 ── */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1 text-center">侧视图</p>
          <svg viewBox="0 0 700 320" className="w-full h-auto" style={{ maxHeight: 280 }}>
            <defs>
              {/* 斜线图案：用于部分隐私标识 */}
              <pattern id="hatch-privacy" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#374151" strokeWidth="1.2" opacity="0.35" />
              </pattern>
              {/* 隐私覆盖：深色半透明 */}
              <pattern id="hatch-partial" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#374151" strokeWidth="1" opacity="0.2" />
              </pattern>
            </defs>

            {/* 车身轮廓 */}
            <path d="M60 230 Q60 200 90 200 L160 150 Q200 120 280 115 L460 115 Q540 118 580 150 L630 200 Q655 200 655 230 L655 260 Q655 270 645 270 L70 270 Q60 270 60 260 Z"
              fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
            {/* 车顶 */}
            <path d="M160 150 Q200 120 280 115 L460 115 Q540 118 580 150"
              fill="none" stroke="#64748b" strokeWidth="3" />

            {/* 前风挡 */}
            <path
              d="M170 152 Q205 122 275 118 L285 118 L290 152 Z"
              fill={isActive('gl-cat-fw') ? getCatColor('gl-cat-fw', 'active') : getCatColor('gl-cat-fw', 'normal')}
              stroke={getCatColor('gl-cat-fw', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-fw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-fw')}
            />
            {/* 前风挡隐私覆盖（无隐私，opacity=0） */}
            <path d="M170 152 Q205 122 275 118 L285 118 L290 152 Z"
              fill={privacyLevels['gl-cat-fw'] === 'all' ? 'url(#hatch-privacy)' : privacyLevels['gl-cat-fw'] === 'partial' ? 'url(#hatch-partial)' : 'none'}
              opacity={privacyOverlayOpacity(privacyLevels['gl-cat-fw'])} className="pointer-events-none" />
            <text x="228" y="138" textAnchor="middle" fontSize="10" fill="#1e40af" className="pointer-events-none font-medium">前风挡</text>

            {/* 前侧窗（A柱三角窗/前角窗）— 位于前风挡与前车门之间，非隐私 */}
            <path
              d="M290 120 L300 120 L300 180 L290 180 Q287 165 288 145 Z"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />
            {/* 前角窗：非隐私，无覆盖 */}
            <text x="295" y="112" textAnchor="middle" fontSize="8" fill="#9d174d" className="pointer-events-none font-medium">前</text>
            <text x="295" y="122" textAnchor="middle" fontSize="8" fill="#9d174d" className="pointer-events-none font-medium">角</text>
            <text x="295" y="132" textAnchor="middle" fontSize="8" fill="#9d174d" className="pointer-events-none font-medium">窗</text>

            {/* 前门玻璃（前车门升降玻璃） */}
            <rect
              x="303" y="120" width="110" height="60" rx="4"
              fill={isActive('gl-cat-dr') ? getCatColor('gl-cat-dr', 'active') : getCatColor('gl-cat-dr', 'normal')}
              stroke={getCatColor('gl-cat-dr', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-dr')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-dr')}
            />
            {/* 前门玻璃：非隐私，无覆盖 */}
            <text x="358" y="147" textAnchor="middle" fontSize="10" fill="#92400e" className="pointer-events-none font-medium">前门</text>
            <text x="358" y="160" textAnchor="middle" fontSize="9" fill="#92400e" className="pointer-events-none">玻璃</text>

            {/* 后门玻璃 */}
            <rect
              x="425" y="120" width="105" height="60" rx="4"
              fill={isActive('gl-cat-dr') ? getCatColor('gl-cat-dr', 'active') : getCatColor('gl-cat-dr', 'normal')}
              stroke={getCatColor('gl-cat-dr', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-dr')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-dr')}
            />
            {/* 后门玻璃：全部隐私，叠加深色纹路 */}
            <rect x="425" y="120" width="105" height="60" rx="4"
              fill="url(#hatch-privacy)"
              opacity={privacyOverlayOpacity(getPartPrivacyLevel('gl-cat-dr', 'gl-dr-04'))} className="pointer-events-none" />
            <text x="477" y="147" textAnchor="middle" fontSize="10" fill="#92400e" className="pointer-events-none font-medium">后门</text>
            <text x="477" y="160" textAnchor="middle" fontSize="9" fill="#92400e" className="pointer-events-none">玻璃</text>
            <PrivacyBadge x={477} y={175} level={getPartPrivacyLevel('gl-cat-dr', 'gl-dr-04')} />

            {/* 后侧窗（C柱/侧围） */}
            <path
              d="M539 120 L562 120 Q580 120 584 132 L592 182 L539 182 Z"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />
            {/* 后侧窗隐私覆盖：gl-sw-01 全部隐私 */}
            <path d="M539 120 L562 120 Q580 120 584 132 L592 182 L539 182 Z"
              fill="url(#hatch-privacy)"
              opacity={privacyOverlayOpacity(getPartPrivacyLevel('gl-cat-sw', 'gl-sw-01'))} className="pointer-events-none" />
            <text x="562" y="148" textAnchor="middle" fontSize="9" fill="#9d174d" className="pointer-events-none font-medium">后侧</text>
            <text x="562" y="159" textAnchor="middle" fontSize="9" fill="#9d174d" className="pointer-events-none font-medium">窗</text>
            <PrivacyBadge x={562} y={174} level={getPartPrivacyLevel('gl-cat-sw', 'gl-sw-01')} />

            {/* 后风挡 */}
            <path
              d="M596 155 Q620 158 628 180 L628 190 L598 185 Z"
              fill={isActive('gl-cat-rw') ? getCatColor('gl-cat-rw', 'active') : getCatColor('gl-cat-rw', 'normal')}
              stroke={getCatColor('gl-cat-rw', 'border')} strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-rw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-rw')}
            />
            {/* 后风挡隐私覆盖 */}
            <path d="M596 155 Q620 158 628 180 L628 190 L598 185 Z"
              fill="url(#hatch-privacy)"
              opacity={privacyOverlayOpacity(privacyLevels['gl-cat-rw'])} className="pointer-events-none" />
            <text x="615" y="170" textAnchor="middle" fontSize="9" fill="#4c1d95" className="pointer-events-none font-medium">后风挡</text>
            <PrivacyBadge x={615} y={190} level={privacyLevels['gl-cat-rw']} />

            {/* 天窗（车顶） */}
            <rect
              x="300" y="113" width="155" height="8" rx="2"
              fill={isActive('gl-cat-ts') ? getCatColor('gl-cat-ts', 'active') : getCatColor('gl-cat-ts', 'normal')}
              stroke={getCatColor('gl-cat-ts', 'border')} strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHovered('gl-cat-ts')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-ts')}
            />
            {/* 天窗隐私覆盖 */}
            <rect x="300" y="113" width="155" height="8" rx="2"
              fill="url(#hatch-privacy)"
              opacity={privacyOverlayOpacity(privacyLevels['gl-cat-ts'])} className="pointer-events-none" />
            <text x="377" y="108" textAnchor="middle" fontSize="10" fill="#065f46" className="pointer-events-none font-medium">天窗</text>
            <PrivacyBadge x={377} y={100} level={privacyLevels['gl-cat-ts']} />

            {/* 车轮 */}
            <circle cx="170" cy="270" r="32" fill="#374151" />
            <circle cx="170" cy="270" r="22" fill="#6b7280" />
            <circle cx="170" cy="270" r="12" fill="#9ca3af" />
            <circle cx="530" cy="270" r="32" fill="#374151" />
            <circle cx="530" cy="270" r="22" fill="#6b7280" />
            <circle cx="530" cy="270" r="12" fill="#9ca3af" />
          </svg>
        </div>

        {/* ── 俯视图 ── */}
        <div className="w-40 flex-shrink-0">
          <p className="text-xs text-gray-400 mb-1 text-center">俯视图</p>
          <svg viewBox="0 0 160 340" className="w-full h-auto" style={{ maxHeight: 280 }}>
            <defs>
              <pattern id="hatch-privacy-top" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#374151" strokeWidth="1.2" opacity="0.35" />
              </pattern>
              <pattern id="hatch-partial-top" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#374151" strokeWidth="1" opacity="0.2" />
              </pattern>
            </defs>

            {/* 车身轮廓俯视 */}
            <path d="M30 40 Q30 20 80 18 Q130 20 130 40 L130 300 Q130 320 80 322 Q30 320 30 300 Z"
              fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />

            {/* 前风挡（俯视） */}
            <path
              d="M35 40 L125 40 L118 75 L42 75 Z"
              fill={isActive('gl-cat-fw') ? getCatColor('gl-cat-fw', 'active') : getCatColor('gl-cat-fw', 'normal')}
              stroke={getCatColor('gl-cat-fw', 'border')} strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-fw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-fw')}
            />
            <text x="80" y="61" textAnchor="middle" fontSize="8" fill="#1e40af" className="pointer-events-none">前风挡</text>

            {/* 前角窗（俯视）— A柱两侧小三角 */}
            <path d="M30 75 L42 75 L39 88 L30 85 Z"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />
            <path d="M130 75 L118 75 L121 88 L130 85 Z"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />

            {/* 天窗（俯视） */}
            <rect
              x="38" y="82" width="84" height="130" rx="4"
              fill={isActive('gl-cat-ts') ? getCatColor('gl-cat-ts', 'active') : getCatColor('gl-cat-ts', 'normal')}
              stroke={getCatColor('gl-cat-ts', 'border')} strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-ts')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-ts')}
            />
            {/* 天窗隐私覆盖 */}
            <rect x="38" y="82" width="84" height="130" rx="4"
              fill="url(#hatch-privacy-top)"
              opacity={privacyOverlayOpacity(privacyLevels['gl-cat-ts'])} className="pointer-events-none" />
            <text x="80" y="144" textAnchor="middle" fontSize="9" fill="#065f46" className="pointer-events-none font-medium">天窗</text>
            <text x="80" y="156" textAnchor="middle" fontSize="7" fill="#047857" fontWeight="bold" className="pointer-events-none">● 隐私灰玻</text>

            {/* 车门玻璃（俯视） — 左右各一条；前门=非隐私，后门=隐私，此处俯视图合并显示为升降玻璃区 */}
            <rect x="30" y="85" width="9" height="60" rx="2"
              fill={isActive('gl-cat-dr') ? getCatColor('gl-cat-dr', 'active') : getCatColor('gl-cat-dr', 'normal')}
              stroke={getCatColor('gl-cat-dr', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-dr')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-dr')}
            />
            <rect x="121" y="85" width="9" height="60" rx="2"
              fill={isActive('gl-cat-dr') ? getCatColor('gl-cat-dr', 'active') : getCatColor('gl-cat-dr', 'normal')}
              stroke={getCatColor('gl-cat-dr', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-dr')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-dr')}
            />
            <text x="80" y="200" textAnchor="middle" fontSize="7" fill="#92400e" className="pointer-events-none">车门玻璃</text>

            {/* 侧窗（俯视）— 此处代表后侧窗 gl-sw-01，全部隐私 */}
            <rect x="30" y="155" width="9" height="55" rx="2"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />
            <rect x="30" y="155" width="9" height="55" rx="2"
              fill="url(#hatch-privacy-top)"
              opacity={privacyOverlayOpacity(getPartPrivacyLevel('gl-cat-sw', 'gl-sw-01'))} className="pointer-events-none" />
            <rect x="121" y="155" width="9" height="55" rx="2"
              fill={isActive('gl-cat-sw') ? getCatColor('gl-cat-sw', 'active') : getCatColor('gl-cat-sw', 'normal')}
              stroke={getCatColor('gl-cat-sw', 'border')} strokeWidth="1"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-sw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-sw')}
            />
            <rect x="121" y="155" width="9" height="55" rx="2"
              fill="url(#hatch-privacy-top)"
              opacity={privacyOverlayOpacity(getPartPrivacyLevel('gl-cat-sw', 'gl-sw-01'))} className="pointer-events-none" />

            {/* 后风挡（俯视） */}
            <path
              d="M40 258 L120 258 L126 293 L34 293 Z"
              fill={isActive('gl-cat-rw') ? getCatColor('gl-cat-rw', 'active') : getCatColor('gl-cat-rw', 'normal')}
              stroke={getCatColor('gl-cat-rw', 'border')} strokeWidth="1.5"
              className="cursor-pointer"
              onMouseEnter={() => setHovered('gl-cat-rw')}
              onMouseLeave={() => setHovered('')}
              onClick={() => onCategoryClick('gl-cat-rw')}
            />
            {/* 后风挡隐私覆盖 */}
            <path d="M40 258 L120 258 L126 293 L34 293 Z"
              fill="url(#hatch-privacy-top)"
              opacity={privacyOverlayOpacity(privacyLevels['gl-cat-rw'])} className="pointer-events-none" />
            <text x="80" y="272" textAnchor="middle" fontSize="8" fill="#4c1d95" className="pointer-events-none">后风挡</text>
            <text x="80" y="283" textAnchor="middle" fontSize="7" fill="#6d28d9" fontWeight="bold" className="pointer-events-none">● 隐私</text>
          </svg>
        </div>
      </div>

      {/* 隐私标识图例 */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-2">
        <span className="font-medium text-gray-600">隐私标识：</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-3 rounded-sm bg-gray-500 opacity-80"></span>
          <span className="font-medium text-gray-700">隐私</span>
          <span className="text-gray-400">（全部车型均为隐私玻璃）</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-3 rounded-sm bg-gray-400 opacity-50"></span>
          <span className="font-medium text-gray-700">部分隐私</span>
          <span className="text-gray-400">（部分零件/车型为隐私玻璃）</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-3 rounded-sm bg-gray-200 border border-gray-300"></span>
          <span className="text-gray-500">非隐私</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {categories.map(cat => {
          const totalVariants = cat.parts.reduce((s, p) => s + p.variants.length, 0);
          const label = cat.id === 'gl-cat-sw' ? `${cat.name}（前角窗+后侧围）` : cat.name;
          const pLevel = privacyLevels[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedCategoryId === cat.id
                  ? 'border-2 shadow-sm scale-105'
                  : 'border hover:scale-105'
              }`}
              style={{
                borderColor: getCatColor(cat.id, 'border'),
                background: selectedCategoryId === cat.id ? getCatColor(cat.id, 'active') : getCatColor(cat.id, 'normal'),
              }}
            >
              <span>{cat.icon}</span>
              <span>{label}</span>
              <span className="opacity-70">({totalVariants}条)</span>
              {pLevel === 'all' && (
                <span className="ml-1 bg-gray-600 text-white text-[9px] px-1 py-0.5 rounded font-bold">隐私</span>
              )}
              {pLevel === 'partial' && (
                <span className="ml-1 bg-gray-400 text-white text-[9px] px-1 py-0.5 rounded">部分隐私</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
