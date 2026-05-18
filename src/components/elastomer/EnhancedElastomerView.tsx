import { useState, useMemo } from 'react';
import { elastomerNodes, elastomerMap, getChildren } from '../../data/elastomerMaterials';
import { FAMILY_COLORS, type ElastomerNode, type PerformanceRatings } from '../../types/elastomer';

// ─── 评级渲染 ──────────────────────────────────────────────────────────────

function RatingDots({ value }: { value?: number }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} className={`w-2.5 h-2.5 rounded-full ${i <= value ? 'bg-blue-500' : 'bg-gray-200'}`} />
      ))}
    </span>
  );
}

const RATING_LABELS: Record<keyof PerformanceRatings, string> = {
  hydrolysis:    '耐水解',
  oilResistance: '耐油性',
  acidAlkali:    '耐酸碱',
  scratchWear:   '耐刮磨',
  weathering:    '耐光老化',
  odor:          '气味',
  flowability:   '流动性',
  resilience:    '回弹性',
};

const PRICE_LABEL: Record<string, { text: string; color: string }> = {
  'low-medium':  { text: '低～中',   color: 'text-green-600' },
  'medium':      { text: '中',       color: 'text-blue-600'  },
  'medium-high': { text: '中～高',   color: 'text-orange-600'},
  'high':        { text: '高',       color: 'text-red-500'   },
  'very-high':   { text: '极高',     color: 'text-red-700'   },
};

// ─── 详情面板 ──────────────────────────────────────────────────────────────

function DetailPanel({ node }: { node: ElastomerNode }) {
  const c = FAMILY_COLORS[node.familyId ?? node.id] ?? FAMILY_COLORS.root;
  const children = getChildren(node.id);

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className={`${c.lightBg} rounded-xl p-5 border-l-4 ${c.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${c.bg} ${c.text} mb-2 inline-block`}>
              {node.nameEn}
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">{node.name}</h2>
            {node.fullNameEn && <p className="text-sm text-gray-500 mt-0.5">{node.fullNameEn}</p>}
          </div>
          <div className="text-right shrink-0 space-y-1">
            {node.hardnessRange && (
              <div className="text-xs text-gray-500">硬度 <span className="font-semibold text-gray-700">{node.hardnessRange}</span></div>
            )}
            {node.longTermTemp && (
              <div className="text-xs text-gray-500">长期老化 <span className="font-semibold text-gray-700">{node.longTermTemp}</span></div>
            )}
            {node.price && (
              <div className="text-xs">
                价格 <span className={`font-semibold ${PRICE_LABEL[node.price]?.color}`}>{PRICE_LABEL[node.price]?.text}</span>
              </div>
            )}
          </div>
        </div>
        {node.description && <p className="text-sm text-gray-700 mt-3 leading-relaxed">{node.description}</p>}
      </div>

      {/* 外观 & 手感 */}
      {(node.appearance || node.feel) && (
        <div className="grid grid-cols-2 gap-3">
          {node.appearance && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">外观</div>
              <div className="text-sm font-medium text-gray-800">{node.appearance}</div>
            </div>
          )}
          {node.feel && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">手感 / 回弹</div>
              <div className="text-sm font-medium text-gray-800">{node.feel}</div>
            </div>
          )}
        </div>
      )}

      {/* 力学性能 */}
      {node.mechanical && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">力学性能（80A 典型值）</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '拉伸强度', val: node.mechanical.tensileStrength },
              { label: '断裂伸长率', val: node.mechanical.elongation },
              { label: '撕裂强度', val: node.mechanical.tearStrength },
              { label: '压缩永久形变', val: node.mechanical.compressionSet },
            ].filter(p => p.val).map(p => (
              <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="text-xs text-gray-400 mb-0.5">{p.label}</div>
                <div className="text-sm font-semibold text-gray-800">{p.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 性能评级 */}
      {node.ratings && Object.keys(node.ratings).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">性能评级</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {(Object.entries(node.ratings) as [keyof PerformanceRatings, number | undefined][]).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{RATING_LABELS[k]}</span>
                <RatingDots value={v} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 应用 / 优势 / 不足 */}
      {node.applications && node.applications.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">典型应用场景</h4>
          <div className="flex flex-wrap gap-1.5">
            {node.applications.map((a, i) => (
              <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${c.tag} ${c.tagText} font-medium`}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {(node.advantages || node.disadvantages) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {node.advantages && (
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-green-700 mb-2">优势</h4>
              <ul className="space-y-1">
                {node.advantages.map((a, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-sm text-green-800">
                    <span className="mt-0.5 text-green-500 shrink-0">✓</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {node.disadvantages && (
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-red-700 mb-2">局限</h4>
              <ul className="space-y-1">
                {node.disadvantages.map((d, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-sm text-red-800">
                    <span className="mt-0.5 text-red-400 shrink-0">!</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 典型牌号 */}
      {node.typicalProducts && node.typicalProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">典型牌号 / 供应商</h4>
          <div className="flex flex-wrap gap-2">
            {node.typicalProducts.map((p, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* 子节点速览 */}
      {children.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">细分类型（{children.length} 种）</h4>
          <div className="grid grid-cols-1 gap-2">
            {children.map(ch => (
              <div key={ch.id} className={`${c.lightBg} border ${c.border} rounded-lg px-4 py-2 flex items-center justify-between`}>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{ch.nameEn}</span>
                  <span className="text-sm text-gray-500 ml-2">{ch.name}</span>
                </div>
                {ch.hardnessRange && <span className="text-xs text-gray-500">{ch.hardnessRange}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 树节点 ──────────────────────────────────────────────────────────────────

function TreeNode({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth = 0,
}: {
  node: ElastomerNode;
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  depth?: number;
}) {
  const children = getChildren(node.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const c = FAMILY_COLORS[node.familyId ?? node.id] ?? FAMILY_COLORS.root;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer select-none transition-all
          ${isSelected ? `${c.bg} ${c.text}` : 'hover:bg-gray-100 text-gray-700'}
        `}
        style={{ paddingLeft: `${12 + depth * 18}px` }}
        onClick={() => { onSelect(node.id); if (hasChildren) onToggle(node.id); }}
      >
        {/* 展开箭头 */}
        {hasChildren ? (
          <span className={`text-xs transition-transform ${isExpanded ? 'rotate-90' : ''} ${isSelected ? 'opacity-80' : 'text-gray-400'}`}>▶</span>
        ) : (
          <span className="w-3 h-3 shrink-0 rounded-full border-2 border-current opacity-40" />
        )}

        {/* 颜色标记（family 级别） */}
        {depth === 1 && (
          <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white opacity-80' : c.bg}`} />
        )}

        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate leading-tight ${isSelected ? '' : 'text-gray-800'}`}>
            {node.nameEn}
          </div>
          <div className={`text-xs truncate ${isSelected ? 'opacity-80' : 'text-gray-500'}`}>
            {node.name}
          </div>
        </div>

        {hasChildren && (
          <span className={`text-xs shrink-0 ${isSelected ? 'opacity-70' : 'text-gray-400'}`}>
            {children.length}
          </span>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-200 ml-5">
          {children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 性能对比表（来自文档） ───────────────────────────────────────────────────

function ComparisonTable() {
  const cols = ['TPS', 'TPV', 'TPU', 'TPEE'];
  const rows = [
    { label: '外观',        vals: ['哑面，半透', '雾面，不透', '亮面，高透', '亮面，不透'] },
    { label: '手感',        vals: ['涩，回弹一般', '滑，回弹一般', '滑，回弹优', '涩-滑，回弹好'] },
    { label: '耐水解',      vals: ['+++', '+++', '+', '++（酯型）'] },
    { label: '耐油性',      vals: ['+', '+', '++', '+++'] },
    { label: '耐酸碱',      vals: ['+++', '+++', '+', '++'] },
    { label: '耐刮/磨',     vals: ['+', '+', '+++', '++'] },
    { label: '耐光老化',    vals: ['++', '++', '+（芳）/++（脂）', '++'] },
    { label: '长期老化温度', vals: ['125℃', '135℃', '110℃', '150℃'] },
    { label: '硬度范围',    vals: ['10A-50D', '35A-50D', '70A-80D', '80A-80D'] },
    { label: '拉伸强度（MPa）', vals: ['16（80A）', '13（80A）', '30（80A）', '20（80A）'] },
    { label: '延伸率（%）',  vals: ['900（80A）', '450（80A）', '750（80A）', '900（80A）'] },
    { label: '撕裂强度（kN/m）', vals: ['40（80A）', '28（80A）', '56（80A）', '68（80A）'] },
    { label: '压缩形变（70℃22h）', vals: ['50（80A）', '27（80A）', '36（80A）', '45（80A）'] },
    { label: '流动性（加工性）', vals: ['+++', '+', '+++', '++'] },
    { label: '参考价格',    vals: ['低～中', '中～高', '高', '高'] },
  ];

  const colColors = [
    FAMILY_COLORS.tps,
    FAMILY_COLORS.tpv,
    FAMILY_COLORS.tpu,
    FAMILY_COLORS.tpee,
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">四大主流TPE性能对比（来源：TPE材料.docx）</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium bg-gray-50 border-b border-gray-200 w-36">性能项目</th>
              {cols.map((col, i) => (
                <th key={col} className={`px-4 py-2.5 text-center font-bold text-sm border-b border-gray-200 ${colColors[i].bg} ${colColors[i].text}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="px-4 py-2 text-xs font-medium text-gray-600 border-r border-gray-100">{row.label}</td>
                {row.vals.map((v, ci) => (
                  <td key={ci} className="px-4 py-2 text-center text-xs text-gray-700">
                    <span className={v.startsWith('+++') ? 'font-bold text-green-600' :
                      v.startsWith('++') ? 'font-semibold text-blue-600' :
                      v.startsWith('+') ? 'text-gray-500' : ''}>
                      {v}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function EnhancedElastomerView() {
  const rootNode = elastomerMap['root'];
  const families = getChildren('root');

  const [selectedId, setSelectedId] = useState<string>('root');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));
  const [showComparison, setShowComparison] = useState(false);

  const selectedNode = useMemo(() => selectedId ? elastomerMap[selectedId] : null, [selectedId]);

  const totalSubtypes = useMemo(
    () => elastomerNodes.filter(n => n.level === 'subtype').length,
    []
  );

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpandedIds(new Set(elastomerNodes.map(n => n.id)));
  }

  function collapseAll() {
    setExpandedIds(new Set(['root']));
  }

  return (
    <div className="space-y-5">
      {/* 顶部信息栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">热塑性弹性体 (TPE) 分类体系</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {families.length} 大类 · {totalSubtypes} 细分型号 · 数据来源：TPE材料.docx
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(v => !v)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${showComparison ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {showComparison ? '▲ 收起对比表' : '▼ 四大类性能对比'}
            </button>
          </div>
        </div>

        {/* 大类徽标 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {families.map(f => {
            const c = FAMILY_COLORS[f.id];
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedId(f.id);
                  setExpandedIds(prev => { const s = new Set(prev); s.add('root'); s.add(f.id); return s; });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                  selectedId === f.id || selectedId.startsWith(f.id + '-')
                    ? `${c.bg} ${c.text} ${c.border}`
                    : `${c.lightBg} ${c.tagText} border-transparent hover:border-current`
                }`}
              >
                {f.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 性能对比表 */}
      {showComparison && <ComparisonTable />}

      {/* 主体：树 + 详情 */}
      <div className="flex gap-5 items-start">
        {/* 左：树面板 */}
        <div className="w-64 shrink-0 bg-white rounded-xl border border-gray-200 p-3 sticky top-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">分类树</span>
            <div className="flex gap-1">
              <button onClick={expandAll} className="text-xs text-blue-500 hover:underline">展开</button>
              <span className="text-gray-300">|</span>
              <button onClick={collapseAll} className="text-xs text-blue-500 hover:underline">折叠</button>
            </div>
          </div>
          <div className="space-y-0.5">
            {rootNode && (
              <TreeNode
                node={rootNode}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={setSelectedId}
                onToggle={toggleExpand}
                depth={0}
              />
            )}
          </div>
        </div>

        {/* 右：详情面板 */}
        <div className="flex-1 min-w-0">
          {selectedNode ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <DetailPanel node={selectedNode} />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              点击左侧树节点查看详情
            </div>
          )}
        </div>
      </div>

      {/* 底部说明 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-amber-800 mb-1">TPE vs 硫化橡胶选型原则</h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          TPE可热塑加工、可回收，适合大批量注射成型；但长期压缩形变和高温蠕变弱于硫化橡胶。
          动态密封、高蠕变要求场合优先选<strong>TPV</strong>；耐磨/回弹首选<strong>TPU</strong>；
          耐油高温选<strong>TPEE</strong>；综合性能+低成本选<strong>TPS(SEBS)</strong>；
          轻量化外饰选<strong>TPO</strong>；最高综合性能选<strong>TPA/PEBA</strong>（价格最高）。
        </p>
      </div>
    </div>
  );
}
