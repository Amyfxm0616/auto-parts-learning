import { useState, useMemo } from 'react';
import { materials as allMaterials } from '../../data/materials';
import CompositeTreeView from './CompositeTreeView';

type Material = typeof allMaterials[number];

// ─── 视图模式 ───────────────────────────────────────────────────────────────────

type ViewMode = 'cards' | 'tree';

// ─── 辅助函数 ────────────────────────────────────────────────────────────────

function getResinType(m: Material): '热固性' | '热塑性' | '热固/热塑' {
  const resin = m.properties.other?.['树脂体系'] ?? '';
  const hasFixed = resin.includes('热固');
  const hasThermo = resin.includes('热塑');
  if (hasFixed && hasThermo) return '热固/热塑';
  if (hasFixed) return '热固性';
  return '热塑性';
}

function getFiberType(m: Material): '碳纤维' | '玻璃纤维' | '碳纤/玻纤' {
  const fiber = (m.properties.other?.['纤维类型'] ?? '') + m.name;
  const hasCarbon = fiber.includes('碳纤') || fiber.includes('碳纤维') || fiber.includes('CFRP') || fiber.includes('CFRT') || fiber.includes('CFRP');
  const hasGlass = fiber.includes('玻璃') || fiber.includes('玻纤') || fiber.includes('GMT') || fiber.includes('SMC') || fiber.includes('BMC') || fiber.includes('LFT') || fiber.includes('LWRT');
  if (hasCarbon && hasGlass) return '碳纤/玻纤';
  if (hasCarbon) return '碳纤维';
  return '玻璃纤维';
}

const RESIN_COLOR: Record<string, string> = {
  '热固性':   'bg-orange-100 text-orange-700 border-orange-200',
  '热塑性':   'bg-blue-100 text-blue-700 border-blue-200',
  '热固/热塑': 'bg-purple-100 text-purple-700 border-purple-200',
};

const FIBER_COLOR: Record<string, string> = {
  '碳纤维':   'bg-gray-800 text-white',
  '玻璃纤维': 'bg-teal-100 text-teal-700 border-teal-200',
  '碳纤/玻纤': 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const PROP_LABEL: Record<string, string> = {
  density: '密度 (g/cm³)',
  tensileStrength: '抗拉强度 (MPa)',
  elasticModulus: '弹性模量 (GPa)',
  thermalConductivity: '热导率 (W/m·K)',
  corrosionResistance: '耐腐蚀性',
  cost: '成本',
  recyclability: '可回收性',
  maxTemp: '最高使用温度 (℃)',
  minTemp: '最低使用温度 (℃)',
  hardness: '硬度',
  yieldStrength: '屈服强度 (MPa)',
  meltingPoint: '熔点 (℃)',
};

// ─── 详情弹窗 ────────────────────────────────────────────────────────────────

function DetailModal({ material, onClose }: { material: Material; onClose: () => void }) {
  const resin = getResinType(material);
  const fiber = getFiberType(material);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* 顶栏 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{material.name}</h2>
            {material.nameEn && <p className="text-sm text-gray-500 mt-0.5">{material.nameEn}</p>}
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${RESIN_COLOR[resin]}`}>{resin}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${FIBER_COLOR[fiber]}`}>{fiber}</span>
            </div>
          </div>
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-700 text-2xl leading-none mt-1">×</button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* 描述 */}
          {material.description && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">材料概述</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{material.description}</p>
            </section>
          )}

          {/* 核心性能数据 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">核心性能参数</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(material.properties)
                .filter(([k, v]) => k !== 'other' && v)
                .map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{PROP_LABEL[k] ?? k}</div>
                    <div className="text-sm font-semibold text-gray-800">{v as string}</div>
                  </div>
                ))}
            </div>
          </section>

          {/* 复材特有属性（properties.other） */}
          {material.properties.other && Object.keys(material.properties.other).length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">纤维 · 树脂 · 工艺特性</h3>
              <div className="space-y-2">
                {Object.entries(material.properties.other).map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-sm">
                    <span className="shrink-0 w-24 text-gray-500 font-medium">{k}</span>
                    <span className="text-gray-800 leading-relaxed">{v}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 成型工艺流程 */}
          {material.manufacturingProcess && material.manufacturingProcess.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">成型工艺流程</h3>
              <div className="flex flex-wrap items-center gap-2">
                {material.manufacturingProcess.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">{step}</span>
                    {i < material.manufacturingProcess!.length - 1 && (
                      <span className="text-gray-400 text-lg">→</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 应用场景 */}
          {material.applications && material.applications.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">典型应用场景</h3>
              <div className="flex flex-wrap gap-2">
                {material.applications.map((app, i) => (
                  <span key={i} className="bg-green-50 text-green-700 border border-green-200 text-xs px-3 py-1.5 rounded-full">{app}</span>
                ))}
              </div>
            </section>
          )}

          {/* 优势 & 局限 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {material.advantages && material.advantages.length > 0 && (
              <section className="bg-green-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-green-700 mb-2">优势</h3>
                <ul className="space-y-1">
                  {material.advantages.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="mt-0.5 text-green-500">✓</span>{a}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {material.disadvantages && material.disadvantages.length > 0 && (
              <section className="bg-red-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-red-700 mb-2">局限 / 注意事项</h3>
                <ul className="space-y-1">
                  {material.disadvantages.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="mt-0.5 text-red-400">!</span>{d}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 材料卡片 ─────────────────────────────────────────────────────────────────

function CompositeCard({ material, onClick }: { material: Material; onClick: () => void }) {
  const resin = getResinType(material);
  const fiber = getFiberType(material);
  const processInfo = material.properties.other?.['成型工艺'] ?? material.properties.other?.['主要工艺'] ?? '';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
    >
      {/* 标题 */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-tight">{material.name}</h3>
        {material.nameEn && <p className="text-xs text-gray-400 mt-0.5">{material.nameEn}</p>}
      </div>

      {/* 徽标 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${RESIN_COLOR[resin]}`}>{resin}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${FIBER_COLOR[fiber]}`}>{fiber}</span>
      </div>

      {/* 核心参数 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: '密度', value: material.properties.density, unit: 'g/cm³' },
          { label: '抗拉强度', value: material.properties.tensileStrength, unit: 'MPa' },
          { label: '弹性模量', value: material.properties.elasticModulus, unit: 'GPa' },
          { label: '成本', value: material.properties.cost, unit: '' },
        ].filter(p => p.value).map(p => (
          <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2">
            <div className="text-xs text-gray-400">{p.label}</div>
            <div className="text-sm font-semibold text-gray-800 mt-0.5">{p.value}{p.unit && <span className="text-xs font-normal text-gray-500 ml-1">{p.unit}</span>}</div>
          </div>
        ))}
      </div>

      {/* 可回收性 */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          material.properties.recyclability?.includes('可回收') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {material.properties.recyclability?.includes('可回收') ? '♻ 可回收' : '⚠ 难回收'}
        </span>
        {material.properties.maxTemp && (
          <span className="text-xs text-gray-500">最高 {material.properties.maxTemp}℃</span>
        )}
      </div>

      {/* 工艺简介 */}
      {processInfo && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{processInfo}</p>
      )}

      {/* 应用预览 */}
      {material.applications && material.applications.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {material.applications.slice(0, 3).map((app, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{app}</span>
          ))}
          {material.applications.length > 3 && (
            <span className="text-xs text-gray-400">+{material.applications.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 工艺对比速查表 ───────────────────────────────────────────────────────────

const PROCESS_GUIDE = [
  { name: 'GMT',  resin: '热塑', fiber: '玻纤毡', volume: '大批量', cost: '中',   apps: '门模块 / 座椅坐盆' },
  { name: 'SMC',  resin: '热固', fiber: '短切玻纤', volume: '大批量', cost: '中',  apps: '引擎盖 / 翼子板 / 尾门' },
  { name: 'BMC',  resin: '热固', fiber: '短切玻纤', volume: '大批量', cost: '低',  apps: '电气壳体 / 功能件' },
  { name: 'LFT',  resin: '热塑', fiber: '长玻纤',  volume: '大批量', cost: '低中', apps: '前端模块 / 保险杠骨架' },
  { name: 'CFRT', resin: '热塑', fiber: '连续纤维', volume: '中批量', cost: '高',  apps: '结构件 / Hybrid车身' },
  { name: 'LWRT', resin: '热塑', fiber: '短玻纤',  volume: '大批量', cost: '中',  apps: '顶棚 / 底护板 / 行李舱' },
  { name: 'CFRP', resin: '热固', fiber: '碳纤维',  volume: '小批量', cost: '极高', apps: '车身结构 / 空气动力学' },
];

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function EnhancedCompositeView() {
  const compositeMaterials = useMemo(
    () => allMaterials.filter(m => m.category === 'composite'),
    []
  );

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResin, setFilterResin] = useState<'全部' | '热固性' | '热塑性'>('全部');
  const [filterFiber, setFilterFiber] = useState<'全部' | '碳纤维' | '玻璃纤维'>('全部');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showProcessGuide, setShowProcessGuide] = useState(false);

  const filtered = useMemo(() => {
    return compositeMaterials.filter(m => {
      if (filterResin !== '全部') {
        const r = getResinType(m);
        if (!r.includes(filterResin.replace('性', ''))) return false;
      }
      if (filterFiber !== '全部') {
        const f = getFiberType(m);
        if (!f.includes(filterFiber.replace('纤维', '纤'))) return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return (
          m.name.toLowerCase().includes(s) ||
          m.nameEn?.toLowerCase().includes(s) ||
          m.description?.toLowerCase().includes(s) ||
          m.applications?.some(a => a.toLowerCase().includes(s)) ||
          Object.values(m.properties.other ?? {}).some(v => v.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [compositeMaterials, filterResin, filterFiber, searchTerm]);

  const stats = useMemo(() => ({
    total: compositeMaterials.length,
    thermoset: compositeMaterials.filter(m => getResinType(m).includes('热固')).length,
    thermoplastic: compositeMaterials.filter(m => getResinType(m).includes('热塑')).length,
    carbon: compositeMaterials.filter(m => getFiberType(m).includes('碳')).length,
    glass: compositeMaterials.filter(m => getFiberType(m).includes('玻璃')).length,
    recyclable: compositeMaterials.filter(m => m.properties.recyclability?.includes('可回收')).length,
  }), [compositeMaterials]);

  const filterBtnCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  // 视图切换按钮样式
  const viewBtnCls = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="space-y-6">
      {/* 统计栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: '总材料', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: '热固性', value: stats.thermoset, color: 'bg-orange-50 text-orange-700' },
            { label: '热塑性', value: stats.thermoplastic, color: 'bg-blue-50 text-blue-600' },
            { label: '含碳纤', value: stats.carbon, color: 'bg-gray-100 text-gray-700' },
            { label: '含玻纤', value: stats.glass, color: 'bg-teal-50 text-teal-700' },
            { label: '可回收', value: stats.recyclable, color: 'bg-emerald-50 text-emerald-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-3 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 视图切换按钮 */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-sm text-gray-600">显示模式：</span>
          <button
            onClick={() => setViewMode('cards')}
            className={viewBtnCls(viewMode === 'cards')}
          >
            卡片网格
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={viewBtnCls(viewMode === 'tree')}
          >
            树状图谱
          </button>
        </div>
      </div>

      {/* 树状视图 */}
      {viewMode === 'tree' && <CompositeTreeView />}

      {/* 卡片视图 */}
      {viewMode === 'cards' && (
        <>
          {/* 搜索 + 筛选 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索材料名称、应用场景、工艺特性..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">树脂类型</span>
                {(['全部', '热固性', '热塑性'] as const).map(v => (
                  <button key={v} onClick={() => setFilterResin(v)} className={filterBtnCls(filterResin === v)}>{v}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">纤维类型</span>
                {(['全部', '碳纤维', '玻璃纤维'] as const).map(v => (
                  <button key={v} onClick={() => setFilterFiber(v)} className={filterBtnCls(filterFiber === v)}>{v}</button>
                ))}
              </div>
              <button
                onClick={() => setShowProcessGuide(v => !v)}
                className={filterBtnCls(showProcessGuide) + ' ml-auto'}
              >
                {showProcessGuide ? '▲ 收起工艺速查' : '▼ 工艺速查表'}
              </button>
            </div>
          </div>

          {/* 工艺速查表 */}
          {showProcessGuide && (
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
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.resin === '热固' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{row.resin}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.fiber}</td>
                    <td className="px-4 py-3 text-gray-600">{row.volume}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${row.cost === '极高' ? 'text-red-600' : row.cost === '高' ? 'text-orange-600' : row.cost === '低中' || row.cost === '中' ? 'text-blue-600' : 'text-green-600'}`}>{row.cost}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.apps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 材料卡片网格 */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          <p className="text-lg mb-2">未找到匹配材料</p>
          <p className="text-sm">请调整筛选条件或搜索关键词</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(m => (
            <CompositeCard key={m.id} material={m} onClick={() => setSelectedMaterial(m)} />
          ))}
        </div>
      )}

      {/* 设计理念提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h4 className="text-sm font-semibold text-amber-800 mb-2">复合材料设计原则</h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          复材工艺有其自身特点，很难用结构复杂性来弥补材料性能。
          <strong>不要用金属替换思维</strong>——须从整体构思与设计出发，与复合材料结构设计专业人员共同参与，
          将纤维沿承载方向铺设，空洞和切断位置意味着纤维断裂。
          合理设计可实现减重 <strong>30%–50%</strong>，过多零件化设计反而浪费昂贵材料。
        </p>
      </div>

      {/* 详情弹窗 */}
      {selectedMaterial && (
        <DetailModal material={selectedMaterial} onClose={() => setSelectedMaterial(null)} />
      )}
        </>
      )}
    </div>
  );
}
