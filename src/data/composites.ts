// src/data/composites.ts
// 复合材料 树状数据
// 数据来源：materials.ts 中的 composite 类别材料

export interface CompositeNode {
  id: string;
  name: string;
  nameEn?: string;
  level: 'root' | 'resin' | 'fiber' | 'material';
  resinType?: 'thermoset' | 'thermoplastic' | 'both';
  fiberType?: 'carbon' | 'glass' | 'both';
  description?: string;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  properties?: {
    density?: string;
    tensileStrength?: string;
    elasticModulus?: string;
    thermalConductivity?: string;
    cost?: string;
    recyclability?: string;
    maxTemp?: string;
    minTemp?: string;
    other?: Record<string, string>;
  };
  manufacturingProcess?: string[];
  childIds?: string[];
  parentIds?: string[];
}

export const compositeNodes: CompositeNode[] = [
  // 根节点
  {
    id: 'root',
    name: '复合材料',
    nameEn: 'Composite Materials',
    level: 'root',
    description: '由基体材料（树脂）和增强纤维通过特定工艺复合而成的高性能材料，兼具各组分优势。按树脂分为热固性和热塑性两大类，按纤维分为碳纤维和玻璃纤维两大类。',
    advantages: ['比强度极高', '比刚度极高', '可设计性强', '耐腐蚀性优秀', '减重效果显著（30-50%）'],
    disadvantages: ['成本较高', '各向异性性能', '加工复杂', '维修困难', '回收难度大'],
    childIds: ['thermoset', 'thermoplastic'],
  },

  // 热固性树脂类型
  {
    id: 'thermoset',
    name: '热固性复合材料',
    nameEn: 'Thermoset Composites',
    level: 'resin',
    resinType: 'thermoset',
    description: '以热固性树脂（不饱和聚酯、环氧树脂等）为基体的复合材料，成型后不可二次加工。性能稳定、耐高温性好，但不可回收。适用于大批量生产的外观件和结构件。',
    advantages: ['性能稳定', '耐高温性好', '尺寸精度高', '大批量生产效率高', '成本相对较低'],
    disadvantages: ['不可回收（热固性）', '成型后不可再加工', '强度低于热塑性'],
    childIds: ['thermoset-carbon', 'thermoset-glass'],
    parentIds: ['root'],
  },
  {
    id: 'thermoset-carbon',
    name: '热固性碳纤维复合材料',
    nameEn: 'CFRP',
    level: 'fiber',
    resinType: 'thermoset',
    fiberType: 'carbon',
    description: '以碳纤维为增强体、热固性树脂为基体的复合材料，是目前最高性能的工程材料之一。比强度和比刚度为所有材料之最。2020年缠绕与拉挤工艺成为第一大成型工艺。',
    advantages: ['比强度最高', '比刚度最高', '极佳的疲劳性能', '减重效果最显著（30-50%）'],
    disadvantages: ['成本极高', '维修困难', '需专业结构设计思维', '循环利用困难'],
    childIds: ['mat-cfrp'],
    parentIds: ['root', 'thermoset'],
  },
  {
    id: 'thermoset-glass',
    name: '热固性玻璃纤维复合材料',
    nameEn: 'Glass Fiber Thermoset',
    level: 'fiber',
    resinType: 'thermoset',
    fiberType: 'glass',
    description: '以玻璃纤维为增强体、热固性树脂为基体的复合材料，是最成熟的复合材料类型。SMC和BMC适合大批量生产，尺寸稳定性优异。',
    advantages: ['成本适中', '大批量生产效率高', '尺寸稳定性好', '耐腐蚀性优秀'],
    disadvantages: ['不可回收', '密度较大', '表面需后处理才能达到A级外观'],
    childIds: ['mat-smc', 'mat-bmc'],
    parentIds: ['root', 'thermoset'],
  },

  // 热塑性树脂类型
  {
    id: 'thermoplastic',
    name: '热塑性复合材料',
    nameEn: 'Thermoplastic Composites',
    level: 'resin',
    resinType: 'thermoplastic',
    description: '以热塑性树脂（PP、PA、PC等）为基体的复合材料，可多次热塑加工成型。具有可回收性好、成型周期短、抗冲击性能优异等特点，是汽车轻量化的重要方向。',
    advantages: ['可回收再利用', '成型周期短', '抗冲击性好', '可焊接连接', '储存稳定'],
    disadvantages: ['耐高温性略低于热固性', '某些工艺流程复杂', '加工温度要求高'],
    childIds: ['thermoplastic-carbon', 'thermoplastic-glass'],
    parentIds: ['root'],
  },
  {
    id: 'thermoplastic-carbon',
    name: '热塑性碳纤维复合材料',
    nameEn: 'CFRT',
    level: 'fiber',
    resinType: 'thermoplastic',
    fiberType: 'carbon',
    description: '以连续碳纤维为增强体、热塑性树脂为基体的复合材料。可单独使用或与金属Hybrid结合设计车身结构件。纤维须沿承载方向铺设，空洞和切断位置会导致纤维断裂。',
    advantages: ['强度接近热固性CFRP', '热塑可回收', '与金属Hybrid集成设计', '抗冲击性好', '减重40-50%'],
    disadvantages: ['成本高于LFT/GMT', '加工复杂需专用设备', '各向异性明显', '铺层设计要求高'],
    childIds: ['mat-cfrt'],
    parentIds: ['root', 'thermoplastic'],
  },
  {
    id: 'thermoplastic-glass',
    name: '热塑性玻璃纤维复合材料',
    nameEn: 'Glass Fiber Thermoplastic',
    level: 'fiber',
    resinType: 'thermoplastic',
    fiberType: 'glass',
    description: '以玻璃纤维为增强体、热塑性树脂（PP/PA/PC等）为基体的复合材料。包括GMT、LFT、LWRT等多种类型，是内饰金属支架以塑代钢的核心材料。',
    advantages: ['可回收', '重量轻（减重30-40%）', '成本适中', '设计灵活', '适合大批量生产'],
    disadvantages: ['各向异性', '表面浮纤不适合外观件', '翘曲变形风险', '纤维分散均匀性控制要求高'],
    childIds: ['mat-gmt', 'mat-lft', 'mat-lwrt'],
    parentIds: ['root', 'thermoplastic'],
  },

  // 具体材料节点
  {
    id: 'mat-cfrp',
    name: '碳纤维复合材料（CFRP）',
    nameEn: 'Carbon Fiber Reinforced Polymer',
    level: 'material',
    resinType: 'thermoset',
    fiberType: 'carbon',
    description: '以碳纤维为增强体的高性能复合材料，分热固性（CFRP）和热塑性（CFRTP）两类。碳纤维比强度、比刚度为所有工程材料最高水平。',
    properties: {
      density: '1.5-1.6',
      tensileStrength: '600-3500',
      elasticModulus: '70-240',
      thermalConductivity: '5-10',
      cost: '极高',
      recyclability: '较难回收',
      maxTemp: '150',
      minTemp: '-60',
      other: {
        '纤维类型': '碳纤维（T300/T700/T800等）',
        '主要工艺': 'PCM预浸料模压 / RTM / 热压罐 / HP-RTM / 缠绕 / 拉挤',
        '树脂体系': '环氧树脂（热固）/ PA/PP（热塑）',
      },
    },
    applications: ['车身结构件（CFRT+金属Hybrid）', '引擎盖Hood', '车顶', '空气动力学部件', '电池壳体（BMW i系列）', '后地板总成'],
    advantages: ['比强度极高', '比刚度极高', '耐腐蚀', '设计自由度高', '轻量化效果最佳（减重30-50%）'],
    disadvantages: ['成本极高', '维修困难', '各向异性', '循环利用困难', '需专业结构设计思维'],
    parentIds: ['root', 'thermoset', 'thermoset-carbon'],
  },
  {
    id: 'mat-smc',
    name: 'SMC片状模压复合材料',
    nameEn: 'Sheet Molding Compound',
    level: 'material',
    resinType: 'thermoset',
    fiberType: 'glass',
    description: '以短切纤维悬浮于热固性树脂中制成的片状模塑料，通过模压工艺成型。SMC确保纤维与树脂完全结合，在使用前需储存数天"固化"。',
    properties: {
      density: '1.7-1.9',
      tensileStrength: '100-200',
      elasticModulus: '10-15',
      cost: '中等',
      recyclability: '难以回收',
      maxTemp: '150',
      minTemp: '-40',
      other: {
        '纤维类型': '短切玻纤（1英寸左右）或碳纤',
        '树脂体系': '热固性树脂（UP不饱和聚酯 / 乙烯基酯 / 环氧树脂）',
        '成型工艺': '片材裁切 → 模压（温度+压力最高2000psi）→ 固化 → 脱模',
      },
    },
    applications: ['引擎盖（Hood）', '翼子板', '后备箱盖', '尾门外板', '前端模块', '挡泥板'],
    manufacturingProcess: ['片材储存固化', '裁切成"装料"', '模压加热（约150℃）', '加压固化（2000psi）', '脱模', '后喷漆处理'],
    advantages: ['比强度高', '尺寸稳定性优', '耐腐蚀性优秀', '大批量生产效率高', '设计自由度高', '成本低于钢冲压件'],
    disadvantages: ['热固性不可回收', '需后处理才能达到A级外观', '维修困难', '密度较大（约钢的1/4）'],
    parentIds: ['root', 'thermoset', 'thermoset-glass'],
  },
  {
    id: 'mat-bmc',
    name: 'BMC块状模压复合材料',
    nameEn: 'Bulk Molding Compound',
    level: 'material',
    resinType: 'thermoset',
    fiberType: 'glass',
    description: '玻璃纤维增强热固性预浸料，以块状中间体形式存在，类似于SMC但适合注射成型。适合生产界面变化较大的复杂薄壁产品。',
    properties: {
      density: '1.7-2.0',
      tensileStrength: '60-130',
      elasticModulus: '9-13',
      cost: '中等',
      recyclability: '难以回收',
      maxTemp: '150',
      minTemp: '-40',
      other: {
        '纤维类型': '短切玻璃纤维（纤维含量15-25%）',
        '树脂体系': '热固性树脂（UP不饱和聚酯）',
        '成型工艺': '注射成型 / 模压成型',
      },
    },
    applications: ['电气元件壳体', '发动机罩盖', '传感器支架', '水泵壳体', '灯具壳体'],
    manufacturingProcess: ['混料制备', '注射成型 / 模压成型', '加热固化', '脱模修边'],
    advantages: ['电绝缘性优', '耐热耐化学腐蚀', '尺寸精度高', '适合复杂形状', '成本低'],
    disadvantages: ['热固性不可回收', '纤维含量低强度低于SMC', '脆性较高'],
    parentIds: ['root', 'thermoset', 'thermoset-glass'],
  },
  {
    id: 'mat-cfrt',
    name: 'CFRT连续纤维增强热塑性复合材料',
    nameEn: 'Continuous Fiber Reinforced Thermoplastic',
    level: 'material',
    resinType: 'thermoplastic',
    fiberType: 'carbon',
    description: '以连续纤维（玻纤/碳纤）为增强体的热塑性复合材料，纤维连续性保证了最高力学性能，且相比热固性材料具备一定可回收性。',
    properties: {
      density: '1.4-1.6',
      tensileStrength: '300-800',
      elasticModulus: '30-90',
      cost: '高',
      recyclability: '较难回收',
      maxTemp: '130',
      minTemp: '-60',
      other: {
        '纤维类型': '连续玻璃纤维 / 连续碳纤维',
        '树脂体系': '热塑性树脂（PA / PP / PPS / PEEK等）',
        '成型工艺': '热压成型 / 与金属Hybrid混合设计',
      },
    },
    applications: ['内饰支架', '座椅背板', '座椅坐盆', '后备胎盆', '底护板', '车身Hybrid结构件（CFRT+金属）'],
    manufacturingProcess: ['连续纤维铺层', '热压成型', '与金属件嵌件注塑 / 激光焊接复合'],
    advantages: ['强度接近热固性CFRP', '热塑可回收', '与金属Hybrid集成设计', '轻量化效果优（减重40-50%）', '抗冲击性好'],
    disadvantages: ['成本高于LFT/GMT', '加工复杂需专用设备', '各向异性明显', '铺层设计要求高'],
    parentIds: ['root', 'thermoplastic', 'thermoplastic-carbon'],
  },
  {
    id: 'mat-gmt',
    name: 'GMT玻璃纤维毡热塑性复合材料',
    nameEn: 'Glass Mat Reinforced Thermoplastic',
    level: 'material',
    resinType: 'thermoplastic',
    fiberType: 'glass',
    description: '以玻璃纤维毡为增强体与热塑性树脂（PP/PBT/PA等）复合制成的预浸料片材。使用时加热软化后置于压机中冲压冷却成型。',
    properties: {
      density: '1.1-1.5',
      tensileStrength: '100-200',
      elasticModulus: '4-9',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '110',
      minTemp: '-40',
      other: {
        '纤维类型': '玻璃纤维毡（随机分布）',
        '树脂体系': '热塑性树脂（PP / PBT / PET / PA / PC）',
        '成型工艺': '板材加热软化 → 压机冲压 → 冷却定型',
        '半成品形态': '预浸料板材（片材）',
      },
    },
    applications: ['门模块骨架', '前端模块', '座椅坐盆', '备胎盆', '底护板', '行李舱底板'],
    manufacturingProcess: ['板材加热软化', '压机冲压成型', '冷却定型', '修边处理'],
    advantages: ['可回收', '重量轻（较钢减重40%）', '冲压成型效率高', '成本适中', '适合大面积构件'],
    disadvantages: ['浮纤明显不适合外观件', '形状复杂度有限', '各向异性', '刚性低于金属'],
    parentIds: ['root', 'thermoplastic', 'thermoplastic-glass'],
  },
  {
    id: 'mat-lft',
    name: 'LFT长玻纤增强热塑性复合材料',
    nameEn: 'Long Fiber Reinforced Thermoplastic',
    level: 'material',
    resinType: 'thermoplastic',
    fiberType: 'glass',
    description: '以长玻璃纤维（>10mm）增强热塑性树脂制成的复合材料，包括粒料型LFT-G和在线混合直接模压型LFT-D。',
    properties: {
      density: '1.1-1.4',
      tensileStrength: '120-250',
      elasticModulus: '6-12',
      cost: '中低',
      recyclability: '可回收',
      maxTemp: '120',
      minTemp: '-40',
      other: {
        '纤维类型': '长玻璃纤维（纤维长度>10mm）',
        '树脂体系': '热塑性树脂（PP / PA / PBT等）',
        'LFT-G工艺': '粒料型：单螺杆挤出机+压机注射成型',
        'LFT-D工艺': '在线混合直接模压：双螺杆挤出机+压机，无需粒料中间环节',
      },
    },
    applications: ['门模块骨架', '前端模块', '保险杠骨架', '座椅坐盆/骨架', '尾门内板', '内饰金属支架替代'],
    manufacturingProcess: ['LFT-G: 双螺杆混配造粒 → 注射成型', 'LFT-D: 双螺杆在线混合 → 直接模压成型'],
    advantages: ['可回收', '力学性能优于短纤', '重量轻（减重30-40%）', 'LFT-D成本低生产节拍快', '设计灵活'],
    disadvantages: ['各向异性', '表面浮纤不适合外观件', '翘曲变形风险', '纤维分散均匀性控制要求高'],
    parentIds: ['root', 'thermoplastic', 'thermoplastic-glass'],
  },
  {
    id: 'mat-lwrt',
    name: 'LWRT轻质增强热塑性复合材料',
    nameEn: 'Light-Weight Reinforced Thermoplastic',
    level: 'material',
    resinType: 'thermoplastic',
    fiberType: 'glass',
    description: '具有多孔蓬松微泡结构的轻质热塑性玻纤复合材料，密度低至0.8g/cm³，远轻于实心复合材料。',
    properties: {
      density: '0.8-1.2',
      tensileStrength: '50-120',
      elasticModulus: '2-7',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-30',
      other: {
        '纤维类型': '玻璃纤维短纤（随机）',
        '树脂体系': '热塑性树脂（PP）',
        '结构特点': '多孔微泡蓬松结构，密度远低于实心复合材料',
        '成型工艺': '加热膨胀 + 冲压成型',
      },
    },
    applications: ['行李舱地板', '车内顶棚', '底护板', '发动机舱隔音垫', '轮罩衬板', '备胎盆盖板'],
    manufacturingProcess: ['板材加热膨胀发泡', '冲压成型', '冷却定型', '修边处理'],
    advantages: ['密度极低（轻量化最佳）', '隔声隔热性好', '可回收', '成本适中', '触感好', '吸能缓冲'],
    disadvantages: ['结构强度低不适合承载', '耐水性和耐候性一般', '不适合高温区域', '形状精度较低'],
    parentIds: ['root', 'thermoplastic', 'thermoplastic-glass'],
  },
];

/** 按 ID 快速查找 */
export const compositeMap: Record<string, CompositeNode> =
  Object.fromEntries(compositeNodes.map(n => [n.id, n]));

/** 获取某节点的直接子节点 */
export function getChildren(id: string): CompositeNode[] {
  const node = compositeMap[id];
  return (node?.childIds ?? []).map(cid => compositeMap[cid]).filter(Boolean);
}

/** 获取某节点的所有祖先节点（包含自己） */
export function getAncestors(id: string): CompositeNode[] {
  const node = compositeMap[id];
  if (!node?.parentIds) return [];
  return node.parentIds.map(pid => compositeMap[pid]).filter(Boolean);
}

/** 获取某节点的所有后代（递归） */
export function getDescendants(id: string): CompositeNode[] {
  const children = getChildren(id);
  return children.flatMap(c => [c, ...getDescendants(c.id)]);
}
