import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { materials as allMaterials } from '../../data/materials';

type Material = typeof allMaterials[number];

// ─── 颜色方案 ──────────────────────────────────────────────────────────────────

const LEVEL_COLORS = {
  specialty: {
    bg: 'bg-red-600', text: 'text-white', border: 'border-red-600',
    lightBg: 'bg-red-50', tag: 'bg-red-100', tagText: 'text-red-800',
  },
  engineering: {
    bg: 'bg-orange-500', text: 'text-white', border: 'border-orange-500',
    lightBg: 'bg-orange-50', tag: 'bg-orange-100', tagText: 'text-orange-800',
  },
  general: {
    bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-500',
    lightBg: 'bg-yellow-50', tag: 'bg-yellow-100', tagText: 'text-yellow-800',
  },
  root: {
    bg: 'bg-gray-700', text: 'text-white', border: 'border-gray-700',
    lightBg: 'bg-gray-50', tag: 'bg-gray-100', tagText: 'text-gray-700',
  },
};

const CRYSTALLINITY_COLORS = {
  crystalline: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  amorphous:   { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
};

const SYSTEMS: Record<string, string> = {
  thermal: '热管理系统', chassis: '底盘系统', cabin: '座舱系统',
  engine: '动力系统', body: '车身系统', power: '动力驱动',
};

// ─── 数据持久化 ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'customMaterials';

function loadPlasticMaterials(): Material[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const all = JSON.parse(saved) as Material[];
      const plastics = all.filter(m => m.category === 'plastic');
      if (plastics.length > 0) return plastics;
    }
  } catch {}
  return allMaterials.filter(m => m.category === 'plastic');
}

function persistMaterials(newPlastics: Material[]) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const all: Material[] = saved ? JSON.parse(saved) : [...allMaterials];
    const rest = all.filter((m: Material) => m.category !== 'plastic');
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...rest, ...newPlastics]));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlastics));
  }
}

// ─── 树节点类型 ────────────────────────────────────────────────────────────────

type NodeType = 'root' | 'level' | 'crystallinity' | 'material';

interface TreeNodeData {
  id: string;
  type: NodeType;
  label: string;
  labelEn?: string;
  levelKey?: 'specialty' | 'engineering' | 'general';
  crystallinityKey?: 'crystalline' | 'amorphous';
  material?: Material;
  children: TreeNodeData[];
}

// ─── 构建树结构 ────────────────────────────────────────────────────────────────

function buildTree(plasticMaterials: Material[]): TreeNodeData {
  const levels: Array<{ key: 'specialty' | 'engineering' | 'general'; label: string; labelEn: string }> = [
    { key: 'specialty',   label: '特种工程塑料', labelEn: '≥200℃' },
    { key: 'engineering', label: '工程塑料',     labelEn: '150–200℃' },
    { key: 'general',     label: '通用塑料',     labelEn: '<150℃' },
  ];
  const crystallinities: Array<{ key: 'crystalline' | 'amorphous'; label: string }> = [
    { key: 'crystalline', label: '结晶性' },
    { key: 'amorphous',   label: '非结晶性（无定形）' },
  ];

  return {
    id: 'root',
    type: 'root',
    label: '塑料材料',
    labelEn: 'Plastic',
    children: levels.map(lv => ({
      id: lv.key,
      type: 'level',
      label: lv.label,
      labelEn: lv.labelEn,
      levelKey: lv.key,
      children: crystallinities
        .map(cr => {
          const mats = plasticMaterials.filter(
            m => m.level === lv.key && m.crystallinity === cr.key
          );
          if (mats.length === 0) return null;
          return {
            id: `${lv.key}-${cr.key}`,
            type: 'crystallinity' as NodeType,
            label: cr.label,
            levelKey: lv.key,
            crystallinityKey: cr.key,
            children: mats.map(m => ({
              id: m.id,
              type: 'material' as NodeType,
              label: m.name,
              labelEn: m.nameEn,
              levelKey: lv.key,
              crystallinityKey: cr.key,
              material: m,
              children: [],
            })),
          };
        })
        .filter(Boolean) as TreeNodeData[],
    })),
  };
}

// ─── 编辑弹窗 ──────────────────────────────────────────────────────────────────

interface FormState {
  name: string; nameEn: string;
  level: 'specialty' | 'engineering' | 'general';
  crystallinity: 'crystalline' | 'amorphous';
  system: string; partName: string; tempGrade: string; tempRange: string;
  description: string;
  propDensity: string; propTensileStrength: string; propElasticModulus: string;
  propMeltingPoint: string; propHardness: string; propMaxTemp: string; propCost: string;
  htAging: string; htHdt: string; htTensile: string;
  htElongation: string; htHardness: string; htCompression: string;
  ltBrittleness: string; ltImpact: string; ltHardness: string;
  applications: string; advantages: string; disadvantages: string;
}

function initForm(m: Material): FormState {
  return {
    name: m.name ?? '',
    nameEn: (m as any).nameEn ?? '',
    level: (m.level as 'specialty' | 'engineering' | 'general') ?? 'engineering',
    crystallinity: (m.crystallinity as 'crystalline' | 'amorphous') ?? 'crystalline',
    system: (m as any).system ?? '',
    partName: (m as any).partName ?? '',
    tempGrade: (m as any).tempGrade ?? '',
    tempRange: (m as any).tempRange ?? '',
    description: (m as any).description ?? '',
    propDensity: m.properties?.density ?? '',
    propTensileStrength: m.properties?.tensileStrength ?? '',
    propElasticModulus: m.properties?.elasticModulus ?? '',
    propMeltingPoint: m.properties?.meltingPoint ?? '',
    propHardness: m.properties?.hardness ?? '',
    propMaxTemp: m.properties?.maxTemp ?? '',
    propCost: m.properties?.cost ?? '',
    htAging: (m as any).highTemp?.aging ?? '',
    htHdt: (m as any).highTemp?.hdt ?? '',
    htTensile: (m as any).highTemp?.tensile ?? '',
    htElongation: (m as any).highTemp?.elongation ?? '',
    htHardness: (m as any).highTemp?.hardness ?? '',
    htCompression: (m as any).highTemp?.compression ?? '',
    ltBrittleness: (m as any).lowTemp?.brittleness ?? '',
    ltImpact: (m as any).lowTemp?.impact ?? '',
    ltHardness: (m as any).lowTemp?.hardness ?? '',
    applications: (m as any).applications?.join('\n') ?? '',
    advantages: (m as any).advantages?.join('\n') ?? '',
    disadvantages: (m as any).disadvantages?.join('\n') ?? '',
  };
}

function formToMaterial(form: FormState, id: string): Material {
  const parseLines = (s: string) => s.split('\n').map(x => x.trim()).filter(Boolean);
  const hasHighTemp = form.htAging || form.htHdt || form.htTensile || form.htElongation || form.htHardness || form.htCompression;
  const hasLowTemp  = form.ltBrittleness || form.ltImpact || form.ltHardness;
  return {
    id,
    name: form.name.trim(),
    nameEn: form.nameEn.trim() || undefined,
    category: 'plastic',
    level: form.level,
    crystallinity: form.crystallinity,
    system: form.system.trim() || undefined,
    partName: form.partName.trim() || undefined,
    tempGrade: form.tempGrade.trim() || undefined,
    tempRange: form.tempRange.trim() || undefined,
    description: form.description.trim() || undefined,
    properties: {
      density: form.propDensity.trim() || undefined,
      tensileStrength: form.propTensileStrength.trim() || undefined,
      elasticModulus: form.propElasticModulus.trim() || undefined,
      meltingPoint: form.propMeltingPoint.trim() || undefined,
      hardness: form.propHardness.trim() || undefined,
      maxTemp: form.propMaxTemp.trim() || undefined,
      cost: form.propCost.trim() || undefined,
    },
    highTemp: hasHighTemp ? {
      aging: form.htAging.trim() || undefined,
      hdt: form.htHdt.trim() || undefined,
      tensile: form.htTensile.trim() || undefined,
      elongation: form.htElongation.trim() || undefined,
      hardness: form.htHardness.trim() || undefined,
      compression: form.htCompression.trim() || undefined,
    } : undefined,
    lowTemp: hasLowTemp ? {
      brittleness: form.ltBrittleness.trim() || undefined,
      impact: form.ltImpact.trim() || undefined,
      hardness: form.ltHardness.trim() || undefined,
    } : undefined,
    applications: parseLines(form.applications).length ? parseLines(form.applications) : undefined,
    advantages: parseLines(form.advantages).length ? parseLines(form.advantages) : undefined,
    disadvantages: parseLines(form.disadvantages).length ? parseLines(form.disadvantages) : undefined,
  } as unknown as Material;
}

function EditMaterialModal({
  material, isNew, onSave, onClose,
}: {
  material: Material; isNew: boolean;
  onSave: (m: Material) => void; onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initForm(material));
  const set = (key: keyof FormState, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { alert('材料名称不能为空'); return; }
    const id = isNew ? `plastic-${Date.now()}` : material.id;
    onSave(formToMaterial(form, id));
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';
  const sectionCls = 'bg-gray-50 rounded-xl p-4 space-y-3';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-900">
            {isNew ? '新增塑料材料' : `编辑：${material.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>

        {/* 表单（可滚动） */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* 基本信息 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded inline-block" />基本信息
            </h3>
            <div className={sectionCls}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>中文名称 <span className="text-red-500">*</span></label>
                  <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="例：聚丙烯" />
                </div>
                <div>
                  <label className={labelCls}>英文名称 / 缩写</label>
                  <input className={inputCls} value={form.nameEn} onChange={e => set('nameEn', e.target.value)} placeholder="例：PP" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>温度等级</label>
                  <select className={inputCls} value={form.level} onChange={e => set('level', e.target.value as any)}>
                    <option value="specialty">特种工程塑料 ≥200℃</option>
                    <option value="engineering">工程塑料 150–200℃</option>
                    <option value="general">通用塑料 &lt;150℃</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>结晶性</label>
                  <select className={inputCls} value={form.crystallinity} onChange={e => set('crystallinity', e.target.value as any)}>
                    <option value="crystalline">结晶性</option>
                    <option value="amorphous">非结晶性（无定形）</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>系统类别</label>
                  <select className={inputCls} value={form.system} onChange={e => set('system', e.target.value)}>
                    <option value="">— 不指定 —</option>
                    <option value="engine">动力系统</option>
                    <option value="body">车身系统</option>
                    <option value="cabin">座舱系统</option>
                    <option value="chassis">底盘系统</option>
                    <option value="thermal">热管理系统</option>
                    <option value="power">动力驱动</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>温度等级标注</label>
                  <input className={inputCls} value={form.tempGrade} onChange={e => set('tempGrade', e.target.value)} placeholder="例：≥200℃" />
                </div>
                <div>
                  <label className={labelCls}>工作温度范围</label>
                  <input className={inputCls} value={form.tempRange} onChange={e => set('tempRange', e.target.value)} placeholder="例：-40~130℃" />
                </div>
                <div>
                  <label className={labelCls}>典型零件</label>
                  <input className={inputCls} value={form.partName} onChange={e => set('partName', e.target.value)} placeholder="例：保险杠、仪表盘" />
                </div>
              </div>
            </div>
          </section>

          {/* 描述 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded inline-block" />材料描述
            </h3>
            <div className={sectionCls}>
              <div>
                <label className={labelCls}>描述</label>
                <textarea className={inputCls + ' resize-none'} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="材料特性简介..." />
              </div>
            </div>
          </section>

          {/* 核心性能参数 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-orange-500 rounded inline-block" />核心性能参数
            </h3>
            <div className={sectionCls}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  ['密度 (g/cm³)', 'propDensity', '例：0.90–0.91'],
                  ['拉伸强度 (MPa)', 'propTensileStrength', '例：25–40'],
                  ['弹性模量 (GPa)', 'propElasticModulus', '例：1.0–1.4'],
                  ['熔点 (℃)', 'propMeltingPoint', '例：160–175'],
                  ['硬度', 'propHardness', '例：Shore D 65'],
                  ['最高使用温度 (℃)', 'propMaxTemp', '例：100'],
                  ['成本', 'propCost', '例：低'],
                ].map(([lbl, key, ph]) => (
                  <div key={key}>
                    <label className={labelCls}>{lbl}</label>
                    <input className={inputCls} value={form[key as keyof FormState]} onChange={e => set(key as keyof FormState, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 高温性能 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-500 rounded inline-block" />高温性能要求
              <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </h3>
            <div className={sectionCls}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ['热空气老化条件', 'htAging', '例：150℃×500h'],
                  ['热变形温度 (HDT)', 'htHdt', '例：≥80℃'],
                  ['拉伸强度变化', 'htTensile', '例：±20%'],
                  ['伸长率变化', 'htElongation', '例：±30%'],
                  ['硬度变化', 'htHardness', '例：±5'],
                  ['压缩永久形变', 'htCompression', '例：≤30%'],
                ].map(([lbl, key, ph]) => (
                  <div key={key}>
                    <label className={labelCls}>{lbl}</label>
                    <input className={inputCls} value={form[key as keyof FormState]} onChange={e => set(key as keyof FormState, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 低温性能 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded inline-block" />低温性能要求
              <span className="text-xs text-gray-400 font-normal">（选填）</span>
            </h3>
            <div className={sectionCls}>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['低温脆性温度', 'ltBrittleness', '例：-40℃ 不破裂'],
                  ['低温冲击强度', 'ltImpact', '例：≥15 kJ/m²'],
                  ['低温硬度变化', 'ltHardness', '例：不超过±10'],
                ].map(([lbl, key, ph]) => (
                  <div key={key}>
                    <label className={labelCls}>{lbl}</label>
                    <input className={inputCls} value={form[key as keyof FormState]} onChange={e => set(key as keyof FormState, e.target.value)} placeholder={ph} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 应用/优势/局限 */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-green-500 rounded inline-block" />应用场景 &amp; 优劣势
              <span className="text-xs text-gray-400 font-normal">（每行一条）</span>
            </h3>
            <div className={sectionCls}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>典型应用场景</label>
                  <textarea className={inputCls + ' resize-none'} rows={5} value={form.applications} onChange={e => set('applications', e.target.value)} placeholder={"保险杠\n进气歧管\n仪表盘面板"} />
                </div>
                <div>
                  <label className={labelCls}>优势</label>
                  <textarea className={inputCls + ' resize-none'} rows={5} value={form.advantages} onChange={e => set('advantages', e.target.value)} placeholder={"耐化学腐蚀性好\n密度低、轻量化\n成本低廉"} />
                </div>
                <div>
                  <label className={labelCls}>局限 / 注意事项</label>
                  <textarea className={inputCls + ' resize-none'} rows={5} value={form.disadvantages} onChange={e => set('disadvantages', e.target.value)} placeholder={"低温脆性明显\n耐紫外线差\n成型收缩率较大"} />
                </div>
              </div>
            </div>
          </section>

        </form>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t shrink-0 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">取消</button>
          <button onClick={handleSubmit} className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            {isNew ? '新增材料' : '保存修改'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 详情面板 ──────────────────────────────────────────────────────────────────

function DetailPanel({
  node, onAddCompare, isAdmin, onEdit, onDelete, onAddNew, plasticMaterials,
}: {
  node: TreeNodeData;
  onAddCompare: (m: Material) => void;
  isAdmin: boolean;
  onEdit: (m: Material) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  plasticMaterials: Material[];
}) {
  if (node.type === 'root') {
    const specialty = plasticMaterials.filter(m => m.level === 'specialty').length;
    const engineering = plasticMaterials.filter(m => m.level === 'engineering').length;
    const general = plasticMaterials.filter(m => m.level === 'general').length;
    return (
      <div className="space-y-5">
        <div className="bg-gray-50 rounded-xl p-5 border-l-4 border-gray-700">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-gray-900">汽车塑料材料体系</h2>
            {isAdmin && (
              <button onClick={onAddNew} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-1">
                + 新增材料
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            汽车用塑料按耐热温度分为三大类：特种工程塑料（≥200℃）、工程塑料（150-200℃）和通用塑料（&lt;150℃）；
            按结晶结构分为结晶性和非结晶性（无定形）两类。点击左侧树节点查看各分类详情。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '特种工程塑料', value: specialty, color: 'bg-red-50 text-red-700' },
            { label: '工程塑料',     value: engineering, color: 'bg-orange-50 text-orange-700' },
            { label: '通用塑料',     value: general, color: 'bg-yellow-50 text-yellow-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-1 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-1">选材原则</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            结晶性塑料（如PA、PP、POM）耐化学腐蚀性好、耐疲劳性强，但成型收缩率大；
            非结晶性塑料（如PC、ABS）尺寸稳定性好、透明度高，但耐化学品性较弱。
            选材需综合考虑耐温等级、力学性能、成本及加工工艺。
          </p>
        </div>
      </div>
    );
  }

  if (node.type === 'level') {
    const lv = node.levelKey!;
    const c = LEVEL_COLORS[lv];
    const mats = plasticMaterials.filter(m => m.level === lv);
    const crystalline = mats.filter(m => m.crystallinity === 'crystalline');
    const amorphous   = mats.filter(m => m.crystallinity === 'amorphous');
    const tempDesc: Record<string, string> = {
      specialty:   '长期使用温度 ≥ 200℃，用于发动机舱、传感器等高温苛刻环境，是替代金属的高端材料。',
      engineering: '使用温度 150–200℃，综合性能优异，广泛用于结构件、电气件及功能零件。',
      general:     '使用温度低于 150℃，成本低、易加工，适用于内外饰大面积覆盖件。',
    };
    return (
      <div className="space-y-5">
        <div className={`${c.lightBg} rounded-xl p-5 border-l-4 ${c.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${c.bg} ${c.text} mb-2 inline-block`}>
                {node.labelEn}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">{node.label}</h2>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{tempDesc[lv]}</p>
            </div>
            {isAdmin && (
              <button onClick={onAddNew} className="ml-4 shrink-0 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                + 新增材料
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{crystalline.length}</div>
            <div className="text-xs text-blue-600 mt-1">结晶性材料</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">{amorphous.length}</div>
            <div className="text-xs text-purple-600 mt-1">非结晶性材料</div>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">该分类材料</h4>
          <div className="space-y-2">
            {mats.map(m => (
              <div key={m.id} className={`${c.lightBg} border ${c.border} rounded-lg px-4 py-2.5 flex items-center justify-between`}>
                <div>
                  <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                  {(m as any).nameEn && <span className="text-xs text-gray-500 ml-2">{(m as any).nameEn}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    m.crystallinity === 'crystalline'
                      ? CRYSTALLINITY_COLORS.crystalline.bg + ' ' + CRYSTALLINITY_COLORS.crystalline.text
                      : CRYSTALLINITY_COLORS.amorphous.bg + ' ' + CRYSTALLINITY_COLORS.amorphous.text
                  }`}>
                    {m.crystallinity === 'crystalline' ? '结晶' : '无定形'}
                  </span>
                  {(m as any).tempRange && <span className="text-xs text-gray-500 font-mono">{(m as any).tempRange}</span>}
                  {isAdmin && (
                    <div className="flex gap-1 ml-1">
                      <button onClick={() => onEdit(m)} className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200">编辑</button>
                      <button onClick={() => onDelete(m.id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">删除</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (node.type === 'crystallinity') {
    const lv = node.levelKey!;
    const cr = node.crystallinityKey!;
    const c = LEVEL_COLORS[lv];
    const cc = CRYSTALLINITY_COLORS[cr];
    const mats = plasticMaterials.filter(m => m.level === lv && m.crystallinity === cr);
    const crDesc = {
      crystalline: '分子链规整排列，具有明显的熔点。耐化学品性、耐疲劳性强，成型收缩率较大，需控制翘曲。',
      amorphous:   '分子链无规则排列，无明显熔点，有玻璃化转变温度。尺寸稳定性好、透明度高，成型收缩率小。',
    };
    return (
      <div className="space-y-5">
        <div className={`${c.lightBg} rounded-xl p-5 border-l-4 ${c.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex gap-2 flex-wrap mb-2">
                <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${c.bg} ${c.text}`}>{node.label.slice(0, 4)}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cc.bg} ${cc.text} ${cc.border}`}>{node.label}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{crDesc[cr]}</p>
            </div>
            {isAdmin && (
              <button onClick={onAddNew} className="ml-4 shrink-0 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                + 新增材料
              </button>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            共 {mats.length} 种材料
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {mats.map(m => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{m.name}</h3>
                    {(m as any).nameEn && <p className="text-xs text-gray-400">{(m as any).nameEn}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-mono shrink-0 ml-2">{(m as any).tempRange}</span>
                    {isAdmin && (
                      <div className="flex gap-1">
                        <button onClick={() => onEdit(m)} className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200">编辑</button>
                        <button onClick={() => onDelete(m.id)} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">删除</button>
                      </div>
                    )}
                  </div>
                </div>
                {(m as any).description && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{(m as any).description}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {(m as any).applications?.slice(0, 3).map((app: string, i: number) => (
                    <span key={i} className={`text-xs px-2 py-0.5 rounded ${c.tag} ${c.tagText}`}>{app}</span>
                  ))}
                  {((m as any).applications?.length ?? 0) > 3 && (
                    <span className="text-xs text-gray-400">+{(m as any).applications.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 材料叶节点详情
  const m = node.material!;
  const lv = (m.level ?? 'general') as 'specialty' | 'engineering' | 'general';
  const c = LEVEL_COLORS[lv];
  const cr = ((m as any).crystallinity ?? 'crystalline') as 'crystalline' | 'amorphous';
  const cc = CRYSTALLINITY_COLORS[cr];

  return (
    <div className="space-y-5">
      {/* 标题 */}
      <div className={`${c.lightBg} rounded-xl p-5 border-l-4 ${c.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex gap-2 flex-wrap mb-2">
              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${c.bg} ${c.text}`}>
                {(m as any).tempGrade || m.level}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cc.bg} ${cc.text} ${cc.border}`}>
                {cr === 'crystalline' ? '结晶性' : '非结晶性'}
              </span>
              {(m as any).system && (
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {SYSTEMS[(m as any).system] || (m as any).system}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{m.name}</h2>
            {(m as any).nameEn && <p className="text-sm text-gray-500 mt-0.5">{(m as any).nameEn}</p>}
          </div>
          <div className="shrink-0 space-y-1 text-right">
            {(m as any).tempRange && <div className="text-xs text-gray-500">工作温度 <span className="font-semibold text-gray-700 font-mono">{(m as any).tempRange}</span></div>}
            {m.properties.cost && <div className="text-xs text-gray-500">成本 <span className="font-semibold text-gray-700">{m.properties.cost}</span></div>}
            {isAdmin && (
              <div className="flex gap-1.5 justify-end mt-2">
                <button onClick={() => onEdit(m)} className="px-3 py-1 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">✏ 编辑</button>
                <button onClick={() => onDelete(m.id)} className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium">✕ 删除</button>
              </div>
            )}
          </div>
        </div>
        {(m as any).description && <p className="text-sm text-gray-700 mt-3 leading-relaxed">{(m as any).description}</p>}
      </div>

      {/* 零件应用 */}
      {(m as any).partName && (
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div className="text-xs text-gray-400 mb-1">典型零件</div>
          <div className="text-sm font-medium text-gray-800">{(m as any).partName}</div>
        </div>
      )}

      {/* 核心性能参数 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">核心性能参数</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '密度 (g/cm³)',    val: m.properties.density },
            { label: '拉伸强度 (MPa)',  val: m.properties.tensileStrength },
            { label: '弹性模量 (GPa)',  val: m.properties.elasticModulus },
            { label: '熔点 (℃)',        val: m.properties.meltingPoint },
            { label: '硬度',            val: m.properties.hardness },
            { label: '最高使用温度 (℃)',val: m.properties.maxTemp },
          ].filter(p => p.val).map(p => (
            <div key={p.label} className="bg-gray-50 rounded-lg px-3 py-2">
              <div className="text-xs text-gray-400 mb-0.5">{p.label}</div>
              <div className="text-sm font-semibold text-gray-800">{p.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 高温性能 */}
      {(m as any).highTemp && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">高温性能要求</h4>
          <div className="bg-red-50 rounded-xl p-4 grid grid-cols-2 gap-3">
            {[
              { label: '热空气老化', val: (m as any).highTemp.aging },
              { label: '热变形温度', val: (m as any).highTemp.hdt },
              { label: '拉伸强度变化', val: (m as any).highTemp.tensile },
              { label: '伸长率变化', val: (m as any).highTemp.elongation },
              { label: '硬度变化', val: (m as any).highTemp.hardness },
              { label: '压缩永久形变', val: (m as any).highTemp.compression },
            ].filter(p => p.val).map(p => (
              <div key={p.label} className="flex gap-2 text-sm">
                <span className="text-gray-500 shrink-0">{p.label}：</span>
                <span className="font-medium text-gray-800">{p.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 低温性能 */}
      {(m as any).lowTemp && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">低温性能要求</h4>
          <div className="bg-blue-50 rounded-xl p-4 grid grid-cols-2 gap-3">
            {[
              { label: '低温脆性', val: (m as any).lowTemp.brittleness },
              { label: '冲击强度', val: (m as any).lowTemp.impact },
              { label: '硬度变化', val: (m as any).lowTemp.hardness },
            ].filter(p => p.val).map(p => (
              <div key={p.label} className="flex gap-2 text-sm">
                <span className="text-gray-500 shrink-0">{p.label}：</span>
                <span className="font-medium text-gray-800">{p.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 应用场景 */}
      {(m as any).applications && (m as any).applications.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">典型应用场景</h4>
          <div className="flex flex-wrap gap-2">
            {(m as any).applications.map((app: string, i: number) => (
              <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${c.tag} ${c.tagText} font-medium`}>{app}</span>
            ))}
          </div>
        </div>
      )}

      {/* 优势 & 局限 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(m as any).advantages && (m as any).advantages.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-green-700 mb-2">优势</h4>
            <ul className="space-y-1">
              {(m as any).advantages.map((a: string, i: number) => (
                <li key={i} className="flex items-start gap-1.5 text-sm text-green-800">
                  <span className="mt-0.5 text-green-500 shrink-0">✓</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(m as any).disadvantages && (m as any).disadvantages.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">局限 / 注意事项</h4>
            <ul className="space-y-1">
              {(m as any).disadvantages.map((d: string, i: number) => (
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
          onClick={() => onAddCompare(m)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          加入对比
        </button>
        <Link
          to={`/materials/${m.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          查看完整页面
        </Link>
      </div>
    </div>
  );
}

// ─── 树节点组件 ────────────────────────────────────────────────────────────────

function TreeNodeItem({
  node, selectedId, expandedIds, onSelect, onToggle, depth = 0,
}: {
  node: TreeNodeData; selectedId: string;
  expandedIds: Set<string>;
  onSelect: (id: string) => void; onToggle: (id: string) => void;
  depth?: number;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const lv = node.levelKey;
  const c = lv ? LEVEL_COLORS[lv] : LEVEL_COLORS.root;

  return (
    <div>
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer select-none transition-all
          ${isSelected ? `${c.bg} ${c.text}` : 'hover:bg-gray-100 text-gray-700'}
        `}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => { onSelect(node.id); if (hasChildren) onToggle(node.id); }}
      >
        {hasChildren ? (
          <span className={`text-xs transition-transform inline-block ${isExpanded ? 'rotate-90' : ''} ${isSelected ? 'opacity-80' : 'text-gray-400'}`}>▶</span>
        ) : (
          <span className={`w-2.5 h-2.5 shrink-0 rounded-full border-2 ${isSelected ? 'border-white bg-white' : 'border-gray-300'}`} />
        )}
        {node.type === 'level' && (
          <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-white opacity-80' : c.bg}`} />
        )}
        {node.type === 'crystallinity' && (
          <span className={`w-2 h-2 rounded-sm shrink-0 ${
            node.crystallinityKey === 'crystalline'
              ? isSelected ? 'bg-white opacity-80' : 'bg-blue-400'
              : isSelected ? 'bg-white opacity-80' : 'bg-purple-400'
          }`} />
        )}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate leading-tight ${isSelected ? '' : 'text-gray-800'}`}>
            {node.label}
          </div>
          {node.labelEn && (
            <div className={`text-xs truncate ${isSelected ? 'opacity-75' : 'text-gray-400'}`}>
              {node.labelEn}
            </div>
          )}
        </div>
        {hasChildren && (
          <span className={`text-xs shrink-0 ${isSelected ? 'opacity-70' : 'text-gray-400'}`}>
            {node.children.length}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div className="border-l-2 border-gray-200 ml-5">
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id} node={child} selectedId={selectedId}
              expandedIds={expandedIds} onSelect={onSelect} onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 对比弹窗 ──────────────────────────────────────────────────────────────────

function CompareModal({ list, onRemove, onClear, onClose }: {
  list: Material[]; onRemove: (id: string) => void; onClear: () => void; onClose: () => void;
}) {
  const rows = [
    { label: '温度等级',      get: (m: Material) => (m as any).tempGrade || m.level },
    { label: '温度范围',      get: (m: Material) => (m as any).tempRange || '-' },
    { label: 'HDT',          get: (m: Material) => (m as any).highTemp?.hdt || '-' },
    { label: '密度 (g/cm³)', get: (m: Material) => m.properties.density || '-' },
    { label: '拉伸强度 (MPa)',get: (m: Material) => m.properties.tensileStrength || '-' },
    { label: '弹性模量 (GPa)',get: (m: Material) => m.properties.elasticModulus || '-' },
    { label: '成本',          get: (m: Material) => m.properties.cost || '-' },
    { label: '低温脆性',      get: (m: Material) => (m as any).lowTemp?.brittleness || '-' },
  ];
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h2 className="text-xl font-bold text-gray-900">塑料材料性能对比</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">×</button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600 border border-gray-200 w-36">对比项</th>
                  {list.map(m => (
                    <th key={m.id} className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div>{m.name}</div>
                          {(m as any).nameEn && <div className="text-xs font-normal text-gray-400">{(m as any).nameEn}</div>}
                        </div>
                        <button onClick={() => onRemove(m.id)} className="text-red-400 hover:text-red-600 shrink-0">×</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2.5 font-medium text-gray-600 border border-gray-200">{row.label}</td>
                    {list.map(m => (
                      <td key={m.id} className="px-4 py-2.5 border border-gray-200 text-gray-700">{row.get(m)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex gap-3">
            <button onClick={onClear} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm">清空对比</button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">关闭</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 主组件 ────────────────────────────────────────────────────────────────────

export default function EnhancedPlasticMaterialView({ isAdmin = false }: { isAdmin?: boolean }) {
  const [plasticMaterials, setPlasticMaterials] = useState<Material[]>(loadPlasticMaterials);
  const tree = useMemo(() => buildTree(plasticMaterials), [plasticMaterials]);

  const [selectedId, setSelectedId] = useState('root');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root']));
  const [searchTerm, setSearchTerm] = useState('');
  const [compareList, setCompareList] = useState<Material[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // 编辑状态
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isNewMaterial, setIsNewMaterial] = useState(false);

  // 搜索过滤
  const matchedIds = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const s = searchTerm.toLowerCase();
    const ids = new Set<string>();
    plasticMaterials.forEach(m => {
      if (
        m.name.toLowerCase().includes(s) ||
        (m as any).nameEn?.toLowerCase().includes(s) ||
        (m as any).partName?.toLowerCase().includes(s) ||
        (m as any).description?.toLowerCase().includes(s) ||
        (m as any).applications?.some((a: string) => a.toLowerCase().includes(s))
      ) ids.add(m.id);
    });
    return ids;
  }, [searchTerm, plasticMaterials]);

  function findNode(id: string, node: TreeNodeData): TreeNodeData | null {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(id, child);
      if (found) return found;
    }
    return null;
  }

  const selectedNode = useMemo(() => findNode(selectedId, tree), [selectedId, tree]);

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function expandAll() {
    const allIds = new Set<string>();
    function collect(n: TreeNodeData) { allIds.add(n.id); n.children.forEach(collect); }
    collect(tree);
    setExpandedIds(allIds);
  }

  function collapseAll() { setExpandedIds(new Set(['root'])); }

  function addToCompare(m: Material) {
    if (compareList.length >= 4) { alert('最多只能对比4个材料'); return; }
    if (compareList.find(x => x.id === m.id)) { alert('该材料已在对比列表中'); return; }
    setCompareList(prev => [...prev, m]);
  }

  // 管理员操作
  function handleEdit(m: Material) {
    setEditingMaterial({ ...m });
    setIsNewMaterial(false);
  }

  function handleAddNew() {
    const node = selectedNode;
    const defaultLevel = (node?.levelKey ?? 'engineering') as 'specialty' | 'engineering' | 'general';
    const defaultCr = (node?.crystallinityKey ?? 'crystalline') as 'crystalline' | 'amorphous';
    setEditingMaterial({
      id: '',
      name: '',
      category: 'plastic',
      level: defaultLevel,
      crystallinity: defaultCr,
      properties: {},
    } as unknown as Material);
    setIsNewMaterial(true);
  }

  function handleDelete(id: string) {
    if (!confirm('确定要删除这个材料吗？此操作不可撤销。')) return;
    const updated = plasticMaterials.filter(m => m.id !== id);
    setPlasticMaterials(updated);
    persistMaterials(updated);
    if (selectedId === id) setSelectedId('root');
  }

  function handleSave(m: Material) {
    const updated = isNewMaterial
      ? [...plasticMaterials, m]
      : plasticMaterials.map(x => x.id === m.id ? m : x);
    setPlasticMaterials(updated);
    persistMaterials(updated);
    setEditingMaterial(null);
    if (isNewMaterial) {
      const lv = (m as any).level ?? 'engineering';
      const cr = (m as any).crystallinity ?? 'crystalline';
      setSelectedId(m.id);
      setExpandedIds(new Set(['root', lv, `${lv}-${cr}`]));
    }
  }

  // 统计数据
  const stats = useMemo(() => ({
    total: plasticMaterials.length,
    specialty: plasticMaterials.filter(m => m.level === 'specialty').length,
    engineering: plasticMaterials.filter(m => m.level === 'engineering').length,
    general: plasticMaterials.filter(m => m.level === 'general').length,
    crystalline: plasticMaterials.filter(m => m.crystallinity === 'crystalline').length,
    amorphous: plasticMaterials.filter(m => m.crystallinity === 'amorphous').length,
  }), [plasticMaterials]);

  return (
    <div className="space-y-5">
      {/* 顶部统计 + 操作栏 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">汽车塑料材料分类体系</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.total} 种塑料 · {stats.crystalline} 结晶 · {stats.amorphous} 无定形
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <button
                onClick={handleAddNew}
                className="px-3 py-1.5 text-sm rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                + 新增材料
              </button>
            )}
            <button
              onClick={() => setShowCompare(true)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                showCompare ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              对比列表 {compareList.length > 0 && `(${compareList.length})`}
            </button>
          </div>
        </div>

        {/* 统计徽标 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { id: 'specialty',   label: '特种工程塑料 ≥200℃', value: stats.specialty,   color: LEVEL_COLORS.specialty },
            { id: 'engineering', label: '工程塑料 150-200℃',   value: stats.engineering, color: LEVEL_COLORS.engineering },
            { id: 'general',     label: '通用塑料 <150℃',      value: stats.general,     color: LEVEL_COLORS.general },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedId(s.id);
                setExpandedIds(prev => { const n = new Set(prev); n.add('root'); n.add(s.id); return n; });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                selectedId === s.id || selectedId.startsWith(s.id + '-')
                  ? `${s.color.bg} ${s.color.text} ${s.color.border}`
                  : `${s.color.lightBg} ${s.color.tagText} border-transparent hover:border-current`
              }`}
            >
              {s.label} · {s.value}种
            </button>
          ))}
        </div>

        {/* 搜索框 */}
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="搜索材料名称、零件名、应用场景..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 搜索结果 */}
        {matchedIds && (
          <div className="mt-3">
            {matchedIds.size === 0 ? (
              <p className="text-sm text-gray-400">未找到匹配材料</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {plasticMaterials
                  .filter(m => matchedIds.has(m.id))
                  .map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedId(m.id);
                        const lv = m.level ?? 'general';
                        const cr = (m as any).crystallinity ?? 'crystalline';
                        setExpandedIds(new Set(['root', lv, `${lv}-${cr}`]));
                      }}
                      className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                        selectedId === m.id ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

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
            <TreeNodeItem
              node={tree} selectedId={selectedId} expandedIds={expandedIds}
              onSelect={setSelectedId} onToggle={toggleExpand} depth={0}
            />
          </div>
        </div>

        {/* 右：详情面板 */}
        <div className="flex-1 min-w-0">
          {selectedNode ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <DetailPanel
                node={selectedNode}
                onAddCompare={addToCompare}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
                plasticMaterials={plasticMaterials}
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
              点击左侧树节点查看详情
            </div>
          )}
        </div>
      </div>

      {/* 对比弹窗 */}
      {showCompare && compareList.length > 0 && (
        <CompareModal
          list={compareList}
          onRemove={id => setCompareList(prev => prev.filter(m => m.id !== id))}
          onClear={() => setCompareList([])}
          onClose={() => setShowCompare(false)}
        />
      )}

      {/* 编辑弹窗 */}
      {editingMaterial && (
        <EditMaterialModal
          material={editingMaterial}
          isNew={isNewMaterial}
          onSave={handleSave}
          onClose={() => setEditingMaterial(null)}
        />
      )}
    </div>
  );
}
