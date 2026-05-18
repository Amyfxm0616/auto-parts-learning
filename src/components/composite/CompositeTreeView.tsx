import { useState, useMemo } from 'react';
import { compositeNodes, compositeMap, getChildren, getAncestors } from '../../data/composites';
import { useNavigate } from 'react-router-dom';
import type { CompositeNode } from '../../data/composites';

// ─── 颜色方案 ──────────────────────────────────────────────────────────────────

const RESIN_COLORS: Record<string, {
  bg: string; text: string; border: string;
  lightBg: string; tag: string; tagText: string;
}> = {
  thermoset: {
    bg: 'bg-orange-600', text: 'text-white', border: 'border-orange-600',
    lightBg: 'bg-orange-50', tag: 'bg-orange-100', tagText: 'text-orange-800',
  },
  thermoplastic: {
    bg: 'bg-blue-600', text: 'text-white', border: 'border-blue-600',
    lightBg: 'bg-blue-50', tag: 'bg-blue-100', tagText: 'text-blue-800',
  },
  both: {
    bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-600',
    lightBg: 'bg-purple-50', tag: 'bg-purple-100', tagText: 'text-purple-800',
  },
  root: {
    bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-700',
    lightBg: 'bg-gray-50', tag: 'bg-gray-100', tagText: 'text-gray-700',
  },
};

const FIBER_COLORS: Record<string, {
  bg: string; text: string; border: string;
}> = {
  carbon: { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-800' },
  glass: { bg: 'bg-teal-600', text: 'text-white', border: 'border-teal-600' },
  both: { bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-600' },
};

const RESIN_LABEL: Record<string, string> = {
  thermoset: '热固性',
  thermoplastic: '热塑性',
  both: '热固/热塑',
};

const FIBER_LABEL: Record<string, string> = {
  carbon: '碳纤维',
  glass: '玻璃纤维',
  both: '碳纤/玻纤',
};

// ─── 工艺对比速查表 ───────────────────────────────────────────────────────────────

const PROCESS_GUIDE = [
  { name: 'GMT',  resin: '热塑', fiber: '玻纤毡', volume: '大批量', cost: '中',   apps: '门模块 / 座椅坐盆' },
  { name: 'SMC',  resin: '热固', fiber: '短切玻纤', volume: '大批量', cost: '中',  apps: '引擎盖 / 翼子板 / 尾门' },
  { name: 'BMC',  resin: '热固', fiber: '短切玻纤', volume: '大批量', cost: '低',  apps: '电气壳体 / 功能件' },
  { name: 'LFT',  resin: '热塑', fiber: '长玻纤',  volume: '大批量', cost: '低中', apps: '前端模块 / 保险杠骨架' },
  { name: 'CFRT', resin: '热塑', fiber: '连续纤维', volume: '中批量', cost: '高',  apps: '结构件 / Hybrid车身' },
  { name: 'LWRT', resin: '热塑', fiber: '短玻纤',  volume: '大批量', cost: '中',  apps: '顶棚 / 底护板 / 行李舱' },
  { name: 'CFRP', resin: '热固', fiber: '碳纤维',  volume: '小批量', cost: '极高', apps: '车身结构 / 空气动力学' },
];

// ─── 详情面板 ──────────────────────────────────────────────────────────────────

function DetailPanel({ node, onNavigate }: { node: CompositeNode; onNavigate: () => void }) {
  const c = RESIN_COLORS[node.resinType ?? 'root'];
  const children = getChildren(node.id);
  const ancestors = getAncestors(node.id);

  // 根节点：显示总体信息
  if (node.level === 'root') {
    const thermoset = compositeNodes.filter(n => n.resinType === 'thermoset' && n.level === 'material').length;
    const thermoplastic = compositeNodes.filter(n => n.resinType === 'thermoplastic' && n.level === 'material').length;
    const carbon = compositeNodes.filter(n => n.fiberType === 'carbon' && n.level === 'material').length;
    const glass = compositeNodes.filter(n => n.fiberType === 'glass' && n.level === 'material').length;

    return (
      <div className="space-y-5">
        <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-gray-700">
          <h2 className="text-xl font-bold text-gray-900">复合材料体系概览</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            复合材料由基体材料（树脂）和增强纤维通过特定工艺复合而成。按树脂分为<strong>热固性</strong>和<strong>热塑性</strong>两大类，
            按纤维分为<strong>碳纤维</strong>和<strong>玻璃纤维</strong>两大类。点击左侧树节点查看各分类详情。
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '总材料数', value: compositeNodes.filter(n => n.level === 'material').length, color: 'bg-blue-50 text-blue-700' },
            { label: '热固性', value: thermoset, color: 'bg-orange-50 text-orange-700' },
            { label: '热塑性', value: thermoplastic, color: 'bg-blue-50 text-blue-600' },
            { label: '可回收', value: thermoplastic, color: 'bg-emerald-50 text-emerald-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-1 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: '含碳纤', value: carbon, color: 'bg-gray-100 text-gray-700' },
            { label: '含玻纤', value: glass, color: 'bg-teal-50 text-teal-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-xs text-gray-500 mb-1">{s.label}</div>
              <div className="text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-2">复合材料 vs 金属材料</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            复合材料<strong>不能简单用金属替换思维</strong>来设计。须从整体构思与设计出发，与复合材料结构设计专业人员共同参与，
            将纤维沿承载方向铺设，空洞和切断位置意味着纤维断裂。
            合理设计可实现减重 <strong>30%–50%</strong>，但过多零件化设计反而浪费昂贵材料。
          </p>
        </div>
      </div>
    );
  }

  // 树节点：显示分类信息
  if (node.level === 'resin' || node.level === 'fiber') {
    const resinColor = RESIN_COLORS[node.resinType ?? 'root'];
    const fiberColor = node.fiberType ? FIBER_COLORS[node.fiberType] : null;

    return (
      <div className="space-y-5">
        {/* 标题 */}
        <div className={`${resinColor.lightBg} rounded-xl p-5 border-l-4 ${resinColor.border}`}>
          {node.nameEn && (
            <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${resinColor.bg} ${resinColor.text} mb-2 inline-block`}>
              {node.nameEn}
            </span>
          )}
          <h2 className="text-xl font-bold text-gray-900 mt-1">{node.name}</h2>
          {node.description && (
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">{node.description}</p>
          )}
        </div>

        {/* 徽标 */}
        <div className="flex flex-wrap gap-2">
          {node.resinType && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${resinColor.bg} ${resinColor.text}`}>
              {RESIN_LABEL[node.resinType]}
            </span>
          )}
          {fiberColor && (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${fiberColor.bg} ${fiberColor.text}`}>
              {FIBER_LABEL[node.fiberType!]}
            </span>
          )}
        </div>

        {/* 材料列表 */}
        {children.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              该分类材料 ({children.length} 种)
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {children.map(ch => (
                <div
                  key={ch.id}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{ch.name}</h3>
                      {ch.nameEn && <p className="text-xs text-gray-400 mt-0.5">{ch.nameEn}</p>}
                      {ch.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{ch.description}</p>
                      )}
                    </div>
                    {ch.properties?.density && (
                      <div className="text-xs text-gray-500 ml-3 shrink-0">
                        密度 {ch.properties.density} g/cm³
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 材料叶节点：显示详细信息
  const resinColor = RESIN_COLORS[node.resinType ?? 'root'];
  const fiberColor = node.fiberType ? FIBER_COLORS[node.fiberType] : null;

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className={`${resinColor.lightBg} rounded-xl p-5 border-l-4 ${resinColor.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {node.nameEn && (
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${resinColor.bg} ${resinColor.text}`}>
                  {node.nameEn}
                </span>
              )}
              {fiberColor && (
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${fiberColor.bg} ${fiberColor.text}`}>
                  {FIBER_LABEL[node.fiberType!]}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{node.name}</h2>
          </div>
          <div className="text-right shrink-0 space-y-1">
            {node.properties?.maxTemp && (
              <div className="text-xs text-gray-500">最高温度 <span className="font-semibold text-gray-700">{node.properties.maxTemp}℃</span></div>
            )}
            {node.properties?.cost && (
              <div className="text-xs text-gray-500">成本 <span className="font-semibold text-gray-700">{node.properties.cost}</span></div>
            )}
          </div>
        </div>
        {node.description && (
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">{node.description}</p>
        )}
      </div>

      {/* 核心性能参数 */}
      {node.properties && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">核心性能参数</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: '密度 (g/cm³)', val: node.properties.density },
              { label: '抗拉强度 (MPa)', val: node.properties.tensileStrength },
              { label: '弹性模量 (GPa)', val: node.properties.elasticModulus },
              { label: '热导率 (W/m·K)', val: node.properties.thermalConductivity },
            ].filter(p => p.val).map(p => (
              <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="text-xs text-gray-400 mb-0.5">{p.label}</div>
                <div className="text-sm font-semibold text-gray-800">{p.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 复材特有属性 */}
      {node.properties?.other && Object.keys(node.properties.other).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">纤维 · 树脂 · 工艺特性</h4>
          <div className="space-y-2">
            {Object.entries(node.properties.other).map(([k, v]) => (
              <div key={k} className="flex gap-3 text-sm">
                <span className="shrink-0 w-24 text-gray-500 font-medium">{k}</span>
                <span className="text-gray-800 leading-relaxed">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 成型工艺流程 */}
      {node.manufacturingProcess && node.manufacturingProcess.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">成型工艺流程</h4>
          <div className="flex flex-wrap items-center gap-2">
            {node.manufacturingProcess.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">{step}</span>
                {i < node.manufacturingProcess!.length - 1 && (
                  <span className="text-gray-400 text-lg">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 应用场景 */}
      {node.applications && node.applications.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">典型应用场景</h4>
          <div className="flex flex-wrap gap-2">
            {node.applications.map((app, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-full text-sm ${resinColor.tag} ${resinColor.tagText} font-medium`}>
                {app}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 优势 & 局限 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {node.advantages && node.advantages.length > 0 && (
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
        {node.disadvantages && node.disadvantages.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">局限 / 注意事项</h4>
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

      {/* 操作按钮 */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onNavigate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          查看完整页面
        </button>
      </div>
    </div>
  );
}

// ─── 树节点组件 ────────────────────────────────────────────────────────────────

function TreeNode({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth = 0,
}: {
  node: CompositeNode;
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

  const c = RESIN_COLORS[node.resinType ?? 'root'];
  const fc = node.fiberType ? FIBER_COLORS[node.fiberType] : null;

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
          <span className={`text-xs transition-transform inline-block ${isExpanded ? 'rotate-90' : ''} ${isSelected ? 'opacity-80' : 'text-gray-400'}`}>▶</span>
        ) : (
          <span className="w-3 h-3 shrink-0 rounded-full border-2 border-current opacity-40" />
        )}

        {/* 颜色标记（resin 层级） */}
        {node.level === 'resin' && (
          <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white opacity-80' : c.bg}`} />
        )}

        {/* 纤维类型标记 */}
        {node.level === 'fiber' && fc && (
          <span className={`w-2 h-2 rounded-sm shrink-0 ${isSelected ? 'bg-white opacity-80' : fc.bg}`} />
        )}

        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate leading-tight ${isSelected ? '' : 'text-gray-800'}`}>
            {node.name}
          </div>
          {node.nameEn && (
            <div className={`text-xs truncate ${isSelected ? 'opacity-80' : 'text-gray-400'}`}>
              {node.nameEn}
            </div>
          )}
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

// ─── 工艺对比表组件 ────────────────────────────────────────────────────────────

function ComparisonTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">复合材料工艺路线速查</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="text-left px-4 py-3 font-medium">类型</th>
              <th className="text-left px-4 py-3 font-medium">树脂</th>
              <th className="text-left px-4 py-3 font-medium">纤维</th>
              <th className="text-left px-4 py-3 font-medium">批量</th>
              <th className="text-left px-4 py-3 font-medium">成本</th>
              <th className="text-left px-4 py-3 font-medium">典型应用</th>
            </tr>
          </thead>
          <tbody>
            {PROCESS_GUIDE.map((row, i) => (
              <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-bold text-blue-700">{row.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    row.resin === '热固' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {row.resin}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{row.fiber}</td>
                <td className="px-4 py-3 text-gray-600">{row.volume}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    row.cost === '极高' ? 'text-red-600' :
                    row.cost === '高' ? 'text-orange-600' :
                    row.cost === '低中' || row.cost === '中' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {row.cost}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{row.apps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 主组件 ─────────────────────────────────────────────────────────────────────

export default function CompositeTreeView() {
  const rootNode = compositeMap['root'];
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string>('root');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));
  const [showComparison, setShowComparison] = useState(false);

  const selectedNode = compositeMap[selectedId];

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpandedIds(new Set(compositeNodes.map(n => n.id)));
  }

  function collapseAll() {
    setExpandedIds(new Set(['root']));
  }

  function handleNavigate() {
    if (selectedNode?.id.startsWith('mat-')) {
      navigate(`/materials/${selectedNode.id}`);
    }
  }

  const totalMaterials = compositeNodes.filter(n => n.level === 'material').length;
  const totalResinTypes = compositeNodes.filter(n => n.level === 'resin').length;
  const totalFiberTypes = compositeNodes.filter(n => n.level === 'fiber').length;

  return (
    <div className="space-y-5">
      {/* 顶部信息栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">复合材料分类体系</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalResinTypes} 类树脂 · {totalFiberTypes} 类纤维 · {totalMaterials} 种材料
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowComparison(v => !v)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                showComparison ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showComparison ? '▲ 收起对比表' : '▼ 工艺速查表'}
            </button>
          </div>
        </div>

        {/* 大类徽标 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['thermoset', 'thermoplastic'].map(type => {
            const c = RESIN_COLORS[type];
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedId(type);
                  setExpandedIds(prev => { const s = new Set(prev); s.add('root'); s.add(type); return s; });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                  selectedId === type || selectedId.startsWith(type + '-')
                    ? `${c.bg} ${c.text} ${c.border}`
                    : `${c.lightBg} ${c.tagText} border-transparent hover:border-current`
                }`}
              >
                {RESIN_LABEL[type]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 工艺对比表 */}
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
              <DetailPanel node={selectedNode} onNavigate={handleNavigate} />
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
        <h4 className="text-sm font-semibold text-amber-800 mb-1">复合材料设计原则</h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          复材工艺有其自身特点，很难用结构复杂性来弥补材料性能。
          <strong>不要用金属替换思维</strong>——须从整体构思与设计出发，与复合材料结构设计专业人员共同参与，
          将纤维沿承载方向铺设，空洞和切断位置意味着纤维断裂。
          合理设计可实现减重 <strong>30%–50%</strong>，过多零件化设计反而浪费昂贵材料。
        </p>
      </div>
    </div>
  );
}
