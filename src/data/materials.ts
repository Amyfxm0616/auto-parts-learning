// 直接定义类型避免导入问题
interface Material {
  id: string;
  name: string;
  nameEn?: string;
  category: 'metal' | 'plastic' | 'composite' | 'rubber' | 'elastomer' | 'acoustic' | 'ceramic' | 'other';
  level?: 'specialty' | 'engineering' | 'general';  // 温度级别（塑料用）
  crystallinity?: 'crystalline' | 'amorphous';  // 结晶性（塑料用）
  rubberType?: 'bushing' | 'mount' | 'hose' | 'boot' | 'seal' | 'weatherstrip' | 'cushion' | 'other';  // 橡胶用途分类
  tempLevel?: 'temp1' | 'temp2' | 'temp3' | 'temp4' | 'temp5' | 'temp6';  // 橡胶耐温等级：temp1(≤70), temp2(70-100), temp3(100-125), temp4(125-150), temp5(150-175), temp6(≥175)
  system?: string;  // 所属系统：thermal(热管理), chassis(底盘), cabin(座舱), engine(动力), body(车身), power(动力驱动)
  partName?: string;  // 零件名称（塑料用）
  tempGrade?: string;  // 温度等级显示（如"≥200℃"）
  tempRange?: string;  // 工作温度范围（如"-40~150℃"）
  highTemp?: {  // 高温性能（塑料用）
    aging?: string;  // 热空气老化条件
    hardness?: string;  // 硬度变化
    tensile?: string;  // 拉伸强度变化率
    elongation?: string;  // 伸长率变化率
    compression?: string;  // 压缩永久变形
    hdt?: string;  // 热变形温度
  };
  lowTemp?: {  // 低温性能（塑料用）
    brittleness?: string;  // 低温脆性温度
    impact?: string;  // 低温冲击强度
    hardness?: string;  // 低温硬度变化
  };
  properties: {
    density?: string;
    tensileStrength?: string;
    yieldStrength?: string;
    elasticModulus?: string;
    meltingPoint?: string;
    thermalConductivity?: string;
    hardness?: string;
    corrosionResistance?: string;
    cost?: string;
    recyclability?: string;
    maxTemp?: string;  // 最高使用温度
    minTemp?: string;  // 最低使用温度
    other?: Record<string, string>;
  };
  description?: string;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  imageUrl?: string;
  reportUrl?: string;
  manufacturingProcess?: string[];  // 成型工艺流程（复合材料用）
}

export const materials: Material[] = [
  {
    id: 'mat-001',
    name: '铝合金',
    nameEn: 'Aluminum Alloy',
    category: 'metal',
    properties: {
      density: '2.7',
      tensileStrength: '310-483',
      yieldStrength: '276',
      elasticModulus: '69',
      meltingPoint: '582-652',
      thermalConductivity: '130-220',
      hardness: 'HB 95-150',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '100%可回收'
    },
    description: '铝合金是以铝为基础加入其他元素制成的合金材料，具有密度低、强度高、耐腐蚀等优点。',
    applications: ['发动机缸体', '轮毂', '车身面板', '散热器'],
    advantages: ['重量轻', '耐腐蚀', '易加工', '可回收性好'],
    disadvantages: ['成本较高', '焊接难度大', '强度不如钢材']
  },
  {
    id: 'mat-002',
    name: '碳钢',
    nameEn: 'Carbon Steel',
    category: 'metal',
    properties: {
      density: '7.85',
      tensileStrength: '400-550',
      yieldStrength: '250-350',
      elasticModulus: '200',
      meltingPoint: '1425-1540',
      thermalConductivity: '50',
      hardness: 'HB 120-200',
      corrosionResistance: '较差',
      cost: '低',
      recyclability: '100%可回收'
    },
    description: '碳钢是含碳量小于2.11%的铁碳合金，是最常用的汽车材料之一。',
    applications: ['车身框架', '发动机曲轴', '齿轮', '紧固件'],
    advantages: ['成本低', '强度高', '易加工', '焊接性好'],
    disadvantages: ['重量大', '易生锈', '耐腐蚀性差']
  },
  {
    id: 'mat-003',
    name: '高强度钢',
    nameEn: 'High-Strength Steel',
    category: 'metal',
    properties: {
      density: '7.85',
      tensileStrength: '600-1500',
      yieldStrength: '450-1200',
      elasticModulus: '200',
      meltingPoint: '1425-1540',
      thermalConductivity: '45',
      hardness: 'HB 180-450',
      corrosionResistance: '一般',
      cost: '中等',
      recyclability: '100%可回收'
    },
    description: '通过合金化和热处理提高强度的钢材，广泛用于车身安全结构。',
    applications: ['防撞梁', 'B柱', '车门防撞杆', '保险杠加强件'],
    advantages: ['强度极高', '安全性好', '减重潜力大'],
    disadvantages: ['成本较高', '加工难度大', '焊接要求高']
  },
  {
    id: 'mat-004',
    name: '聚丙烯 (PP)',
    nameEn: 'Polypropylene',
    category: 'plastic',
    level: 'general',
    crystallinity: 'crystalline',
    system: 'body',
    partName: '保险杠、内饰板、仪表盘',
    tempGrade: '< 150℃',
    tempRange: '-20~100℃',
    highTemp: {
      aging: '100℃×1000hr',
      hardness: '±5',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '100℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-20℃',
      impact: '≥5 kJ/m² @ -20℃',
      hardness: '+10 max'
    },
    properties: {
      density: '0.90-0.91',
      tensileStrength: '30-40',
      elasticModulus: '1.5-2.0',
      meltingPoint: '160-170',
      thermalConductivity: '0.1-0.22',
      hardness: 'Shore D 65-75',
      corrosionResistance: '优秀',
      cost: '低',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-20'
    },
    description: 'PP是最轻的塑料之一，具有良好的化学稳定性和加工性能。广泛用于汽车外饰和内饰件。',
    applications: ['保险杠', '内饰板', '仪表盘', '油箱', '通风管道'],
    advantages: ['重量轻', '成本低', '耐化学腐蚀', '易成型', '可回收性好'],
    disadvantages: ['耐低温性差', '刚性较低', '易老化', '耐候性一般']
  },
  {
    id: 'mat-005',
    name: 'ABS塑料',
    nameEn: 'ABS',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'amorphous',
    system: 'body',
    partName: '格栅、后视镜壳、仪表板',
    tempGrade: '150-200℃',
    tempRange: '-40~80℃',
    highTemp: {
      aging: '80℃×1000hr',
      hardness: '±8',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '95℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥10 kJ/m² @ -30℃',
      hardness: '+8 max'
    },
    properties: {
      density: '1.05',
      tensileStrength: '40-50',
      elasticModulus: '2.0-2.5',
      meltingPoint: '105',
      thermalConductivity: '0.25',
      hardness: 'Shore D 75-85',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '80',
      minTemp: '-40'
    },
    description: 'ABS是丙烯腈、丁二烯、苯乙烯三元共聚物，综合性能优异。具有良好的韧性、刚性和表面光泽度。',
    applications: ['格栅', '后视镜壳', '内饰件', '仪表板', '车灯外壳'],
    advantages: ['韧性好', '表面光泽度高', '易加工', '尺寸稳定', '耐冲击性好'],
    disadvantages: ['耐候性一般', '成本较PP高', '不耐强酸碱']
  },
  {
    id: 'mat-006',
    name: '碳纤维复合材料（CFRP）',
    nameEn: 'Carbon Fiber Reinforced Polymer',
    category: 'composite',
    properties: {
      density: '1.5-1.6',
      tensileStrength: '600-3500',
      elasticModulus: '70-240',
      thermalConductivity: '5-10',
      corrosionResistance: '优秀',
      cost: '极高',
      recyclability: '较难回收',
      maxTemp: '150',
      minTemp: '-60',
      other: {
        '纤维类型': '碳纤维（T300/T700/T800等）',
        '主要工艺': 'PCM预浸料模压 / RTM / 热压罐 / HP-RTM / 缠绕 / 拉挤',
        '树脂体系': '环氧树脂（热固）/ PA/PP（热塑）',
        '纤维模量': '标准模量230-265GPa，中等模量270-315GPa，高模量>315GPa',
        '丝束规格': '小丝束1-24K，大丝束>48K，巨丝束>100K'
      }
    },
    description: '以碳纤维为增强体的高性能复合材料，分热固性（CFRP）和热塑性（CFRTP）两类。碳纤维比强度、比刚度为所有工程材料最高水平。主流纤维牌号T700已取代T300成为通用级标准。2020年缠绕与拉挤工艺跃升为全球第一大成型工艺，PCM和RTM步骤繁琐、废料多。轻量化减重效果可达30%-50%，设计须从整体结构出发，避免简单以金属思维替换零件。',
    applications: ['车身结构件（CFRT+金属Hybrid）', '引擎盖Hood', '车顶', '空气动力学部件', '电池壳体（BMW i系列）', '后地板总成', 'A/B柱结构件', '座椅背板/坐盆'],
    advantages: ['比强度极高', '比刚度极高', '耐腐蚀', '设计自由度高', '轻量化效果最佳（减重30-50%）'],
    disadvantages: ['成本极高', '维修困难', '各向异性', '循环利用困难', '需专业结构设计思维，不能用金属替换思路']
  },
  {
    id: 'mat-007',
    name: '铸铁',
    nameEn: 'Cast Iron',
    category: 'metal',
    properties: {
      density: '7.2',
      tensileStrength: '200-400',
      elasticModulus: '100-160',
      meltingPoint: '1150-1250',
      thermalConductivity: '50-60',
      hardness: 'HB 150-300',
      corrosionResistance: '一般',
      cost: '低',
      recyclability: '100%可回收'
    },
    description: '含碳量高于2.11%的铁碳合金，铸造性能好，减震性能优异。',
    applications: ['发动机缸体', '刹车盘', '排气歧管'],
    advantages: ['成本低', '减震性好', '铸造性能优', '耐磨性好'],
    disadvantages: ['较脆', '重量大', '抗拉强度低']
  },
  {
    id: 'mat-008',
    name: '天然橡胶（NR）',
    nameEn: 'Natural Rubber',
    category: 'rubber',
    rubberType: 'seal',
    tempLevel: 'temp2',
    properties: {
      density: '0.91-0.93',
      tensileStrength: '25-30',
      elasticModulus: '0.01-0.1',
      maxTemp: '80',
      minTemp: '-50',
      hardness: '40-90 Shore A',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '从橡胶树提取的天然高分子材料，具有优异的弹性和机械性能。',
    applications: ['密封圈', '减震垫', '防尘套'],
    advantages: ['弹性好', '耐磨性优', '减震性能好', '加工性能好'],
    disadvantages: ['耐油性差', '耐臭氧性差', '易老化']
  },
  {
    id: 'mat-009',
    name: '丁腈橡胶（NBR）',
    nameEn: 'Nitrile Rubber',
    category: 'rubber',
    rubberType: 'seal',
    tempLevel: 'temp3',
    properties: {
      density: '1.0-1.2',
      tensileStrength: '15-25',
      maxTemp: '120',
      minTemp: '-40',
      hardness: '40-95 Shore A',
      corrosionResistance: '优秀',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '丁二烯和丙烯腈的共聚物，耐油性优异，广泛用于汽车密封系统。',
    applications: ['油封', '燃油管', 'O型圈', '隔膜'],
    advantages: ['耐油性好', '耐磨性好', '气密性好', '耐热性较好'],
    disadvantages: ['低温性能一般', '耐臭氧性差', '绝缘性差']
  },
  {
    id: 'mat-010',
    name: '氟橡胶（FKM）',
    nameEn: 'Fluorocarbon Rubber',
    category: 'rubber',
    rubberType: 'seal',
    tempLevel: 'temp6',
    properties: {
      density: '1.8-2.0',
      tensileStrength: '10-20',
      maxTemp: '200',
      minTemp: '-20',
      hardness: '60-90 Shore A',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '难以回收'
    },
    description: '含氟橡胶，耐高温和化学性能极佳，用于苛刻工况。',
    applications: ['发动机油封', '高温密封件', '燃油系统密封'],
    advantages: ['耐高温', '耐油性极佳', '耐化学腐蚀', '耐老化'],
    disadvantages: ['成本高', '低温性能差', '加工困难']
  },
  {
    id: 'mat-011',
    name: '三元乙丙橡胶（EPDM）',
    nameEn: 'EPDM Rubber',
    category: 'rubber',
    rubberType: 'weatherstrip',
    tempLevel: 'temp4',
    properties: {
      density: '0.86-0.90',
      tensileStrength: '10-20',
      maxTemp: '150',
      minTemp: '-50',
      hardness: '30-90 Shore A',
      corrosionResistance: '优秀',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '乙烯、丙烯和少量非共轭二烯烃的三元共聚物，耐候性极佳。',
    applications: ['车窗密封条', '车门密封条', '散热器软管', '防水条'],
    advantages: ['耐候性好', '耐臭氧', '耐老化', '电绝缘性好'],
    disadvantages: ['耐油性差', '粘合性差']
  },
  {
    id: 'mat-012',
    name: '硅橡胶（VMQ）',
    nameEn: 'Silicone Rubber',
    category: 'rubber',
    rubberType: 'hose',
    tempLevel: 'temp6',
    properties: {
      density: '1.1-1.3',
      tensileStrength: '5-10',
      maxTemp: '200',
      minTemp: '-60',
      hardness: '20-80 Shore A',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '难以回收'
    },
    description: '主链由硅氧键构成的特种橡胶，耐高低温性能优异。',
    applications: ['涡轮增压管', '进气管', '高温密封件'],
    advantages: ['耐高低温', '耐老化', '电绝缘性好', '生理惰性'],
    disadvantages: ['强度低', '耐油性差', '成本高']
  },
  {
    id: 'mat-013',
    name: '氯丁橡胶（CR）',
    nameEn: 'Chloroprene Rubber',
    category: 'rubber',
    rubberType: 'boot',
    tempLevel: 'temp3',
    properties: {
      density: '1.23',
      tensileStrength: '15-25',
      maxTemp: '120',
      minTemp: '-40',
      hardness: '40-90 Shore A',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '氯丁二烯聚合物，综合性能均衡，阻燃性好。',
    applications: ['传动轴护套', '防尘罩', '电线护套'],
    advantages: ['耐候性好', '阻燃性好', '耐油性较好', '粘合性好'],
    disadvantages: ['储存稳定性差', '低温性能一般']
  },
  {
    id: 'mat-014',
    name: '丁基橡胶（IIR）',
    nameEn: 'Butyl Rubber',
    category: 'rubber',
    rubberType: 'cushion',
    tempLevel: 'temp3',
    properties: {
      density: '0.92',
      tensileStrength: '15-20',
      maxTemp: '120',
      minTemp: '-50',
      hardness: '40-80 Shore A',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '异丁烯和少量异戊二烯的共聚物，气密性极佳。',
    applications: ['轮胎内胎', '减震垫', '密封垫'],
    advantages: ['气密性好', '耐老化', '减震性好', '耐化学品'],
    disadvantages: ['弹性较差', '耐油性一般', '硫化速度慢']
  },
  {
    id: 'mat-015',
    name: '聚氨酯橡胶（PU）',
    nameEn: 'Polyurethane Rubber',
    category: 'rubber',
    rubberType: 'bushing',
    tempLevel: 'temp3',
    properties: {
      density: '1.2-1.3',
      tensileStrength: '30-50',
      maxTemp: '120',
      minTemp: '-40',
      hardness: '60-95 Shore A',
      corrosionResistance: '良好',
      cost: '较高',
      recyclability: '部分可回收'
    },
    description: '含有氨基甲酸酯基团的弹性体，耐磨性极佳。',
    applications: ['悬架衬套', '稳定杆衬套', '控制臂衬套'],
    advantages: ['耐磨性极佳', '强度高', '承载能力强', '耐油性好'],
    disadvantages: ['耐水解性差', '成本较高', '低温性能一般']
  },
  {
    id: 'mat-016',
    name: '天然橡胶/SBR混合',
    nameEn: 'NR/SBR Blend',
    category: 'rubber',
    rubberType: 'mount',
    tempLevel: 'temp2',
    properties: {
      density: '0.93-0.95',
      tensileStrength: '20-25',
      maxTemp: '90',
      minTemp: '-50',
      hardness: '45-75 Shore A',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '天然橡胶与丁苯橡胶的混合物，性能均衡，成本适中。',
    applications: ['发动机悬置', '变速箱悬置', '排气悬置'],
    advantages: ['减震性好', '成本适中', '耐磨性好', '加工性好'],
    disadvantages: ['耐油性一般', '耐臭氧性一般', '使用温度受限']
  },
  {
    id: 'mat-017',
    name: '氢化丁腈橡胶（HNBR）',
    nameEn: 'Hydrogenated Nitrile Rubber',
    category: 'rubber',
    rubberType: 'hose',
    tempLevel: 'temp5',
    properties: {
      density: '1.0-1.1',
      tensileStrength: '20-30',
      maxTemp: '170',
      minTemp: '-40',
      hardness: '60-90 Shore A',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '部分可回收'
    },
    description: 'NBR氢化后的产品，耐热性和耐臭氧性大幅提升。',
    applications: ['涡轮增压系统软管', '冷却系统软管', '燃油管路'],
    advantages: ['耐高温', '耐油性好', '耐臭氧', '机械强度高'],
    disadvantages: ['成本高', '低温性能一般']
  },
  {
    id: 'mat-018',
    name: 'PA6 (尼龙6)',
    nameEn: 'Polyamide 6',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    system: 'engine',
    partName: '进气歧管、发动机罩盖',
    tempGrade: '150-200℃',
    tempRange: '-40~120℃',
    highTemp: {
      aging: '120℃×1000hr',
      hardness: '±10',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '155℃ @ 1.8MPa (增强)'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥8 kJ/m² @ -30℃',
      hardness: '+12 max'
    },
    properties: {
      density: '1.13-1.15',
      tensileStrength: '75-90',
      elasticModulus: '2.8-3.2',
      meltingPoint: '215-220',
      thermalConductivity: '0.25',
      hardness: 'Shore D 75-80',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '120',
      minTemp: '-40'
    },
    description: 'PA6是最常用的工程塑料之一，具有优异的机械性能和耐磨性。玻纤增强后可用于结构件。',
    applications: ['进气歧管', '发动机罩盖', '冷却风扇', '油底壳', '线束连接器'],
    advantages: ['强度高', '耐磨性好', '耐油性好', '易加工', '自润滑'],
    disadvantages: ['吸水性大', '尺寸稳定性差', '耐酸性差']
  },
  {
    id: 'mat-019',
    name: 'PA66 (尼龙66)',
    nameEn: 'Polyamide 66',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    system: 'thermal',
    partName: '散热器水室、冷却液连接件',
    tempGrade: '150-200℃',
    tempRange: '-40~130℃',
    highTemp: {
      aging: '130℃×1000hr',
      hardness: '±10',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '180℃ @ 1.8MPa (GF33%)'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥10 kJ/m² @ -30℃',
      hardness: '+12 max'
    },
    properties: {
      density: '1.14-1.15',
      tensileStrength: '80-95',
      elasticModulus: '2.9-3.3',
      meltingPoint: '255-265',
      thermalConductivity: '0.24',
      hardness: 'Shore D 78-82',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '130',
      minTemp: '-40'
    },
    description: 'PA66比PA6具有更高的熔点和刚性，适用于高温环境。是最重要的工程塑料之一。',
    applications: ['散热器水室', '进气歧管', '风扇叶片', '线束卡扣', '制动液储液罐'],
    advantages: ['强度高', '耐热性好', '耐磨性优', '刚性好', '尺寸稳定'],
    disadvantages: ['吸水性大', '成本较PA6高', '低温韧性一般']
  },
  {
    id: 'mat-020',
    name: 'PC (聚碳酸酯)',
    nameEn: 'Polycarbonate',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'amorphous',
    system: 'body',
    partName: '大灯灯罩、仪表盘面板',
    tempGrade: '150-200℃',
    tempRange: '-40~120℃',
    highTemp: {
      aging: '120℃×1000hr',
      hardness: '±8',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '130℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-100℃',
      impact: '≥30 kJ/m² @ -30℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.20',
      tensileStrength: '60-70',
      elasticModulus: '2.3-2.4',
      meltingPoint: '145 (玻璃化转变温度)',
      thermalConductivity: '0.19-0.22',
      hardness: 'Shore D 75-80',
      corrosionResistance: '一般',
      cost: '较高',
      recyclability: '可回收',
      maxTemp: '120',
      minTemp: '-40'
    },
    description: 'PC具有极高的冲击强度和透明性，是最重要的透明工程塑料。耐低温性能优异。',
    applications: ['车灯灯罩', '仪表盘', '内饰透明件', '安全玻璃替代', '电器外壳'],
    advantages: ['冲击强度极高', '透明性好', '耐低温', '尺寸稳定', '阻燃'],
    disadvantages: ['耐化学性差', '易划伤', '应力开裂', '成本较高']
  },
  {
    id: 'mat-021',
    name: 'PBT (聚对苯二甲酸丁二醇酯)',
    nameEn: 'Polybutylene Terephthalate',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    system: 'power',
    partName: '电器连接器、传感器外壳',
    tempGrade: '150-200℃',
    tempRange: '-40~120℃',
    highTemp: {
      aging: '120℃×1000hr',
      hardness: '±10',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '145℃ @ 1.8MPa (GF30%)'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥6 kJ/m² @ -30℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.31',
      tensileStrength: '55-65',
      elasticModulus: '2.3-2.8',
      meltingPoint: '223-227',
      thermalConductivity: '0.29',
      hardness: 'Shore D 75-80',
      corrosionResistance: '优秀',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '120',
      minTemp: '-40'
    },
    description: 'PBT是一种半结晶工程塑料，具有优异的电气性能和尺寸稳定性，广泛用于电子电气领域。',
    applications: ['电器连接器', '传感器外壳', '点火线圈骨架', '继电器外壳', '插接件'],
    advantages: ['电气性能好', '尺寸稳定', '耐化学性好', '加工性好', '低吸水性'],
    disadvantages: ['缺口敏感性高', '韧性一般', '耐候性需改进']
  },
  {
    id: 'mat-022',
    name: 'POM (聚甲醛)',
    nameEn: 'Polyoxymethylene',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    system: 'chassis',
    partName: '齿轮、轴承、滑块',
    tempGrade: '150-200℃',
    tempRange: '-40~110℃',
    highTemp: {
      aging: '110℃×1000hr',
      hardness: '±8',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '110℃ @ 1.8MPa'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥7 kJ/m² @ -30℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.41-1.42',
      tensileStrength: '65-70',
      elasticModulus: '2.8-3.1',
      meltingPoint: '165-175',
      thermalConductivity: '0.31',
      hardness: 'Shore D 80-85',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '110',
      minTemp: '-40'
    },
    description: 'POM被称为"夺钢"塑料，具有接近金属的机械性能和优异的自润滑性，是精密零件的理想材料。',
    applications: ['齿轮', '轴承', '滑块', '门锁机构', '燃油泵零件', '窗升降器'],
    advantages: ['强度高', '刚性好', '耐疲劳', '自润滑', '尺寸精度高', '耐蠕变'],
    disadvantages: ['耐酸性差', '耐候性一般', '热稳定性较差']
  },
  {
    id: 'mat-023',
    name: 'PPS (聚苯硫醚)',
    nameEn: 'Polyphenylene Sulfide',
    category: 'plastic',
    level: 'specialty',
    crystallinity: 'crystalline',
    system: 'engine',
    partName: '节气门体、燃油泵外壳',
    tempGrade: '≥ 200℃',
    tempRange: '-40~200℃',
    highTemp: {
      aging: '200℃×1000hr',
      hardness: '±10',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '260℃ @ 1.8MPa (GF40%)'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥5 kJ/m² @ -30℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.34-1.36',
      tensileStrength: '75-90',
      elasticModulus: '3.3-3.8',
      meltingPoint: '285',
      thermalConductivity: '0.29',
      hardness: 'Shore D 80-85',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '可回收',
      maxTemp: '200',
      minTemp: '-40'
    },
    description: 'PPS是一种特种工程塑料，具有优异的耐热性、耐化学性和尺寸稳定性，可长期在200℃环境下使用。',
    applications: ['节气门体', '燃油泵外壳', '水泵外壳', '传感器外壳', '点火系统零件'],
    advantages: ['耐高温', '耐化学性极佳', '阻燃', '尺寸稳定', '电气性能好', '低吸水'],
    disadvantages: ['韧性差', '成本很高', '加工困难', '缺口敏感']
  },
  {
    id: 'mat-024',
    name: 'PEEK (聚醚醚酮)',
    nameEn: 'Polyether Ether Ketone',
    category: 'plastic',
    level: 'specialty',
    crystallinity: 'crystalline',
    system: 'engine',
    partName: '高温密封件、轴承',
    tempGrade: '≥ 200℃',
    tempRange: '-50~250℃',
    highTemp: {
      aging: '250℃×1000hr',
      hardness: '±8',
      tensile: '-10% max',
      elongation: '-15% max',
      hdt: '315℃ @ 1.8MPa'
    },
    lowTemp: {
      brittleness: '-50℃',
      impact: '≥8 kJ/m² @ -40℃',
      hardness: '+8 max'
    },
    properties: {
      density: '1.30-1.32',
      tensileStrength: '90-100',
      elasticModulus: '3.6-4.0',
      meltingPoint: '343',
      thermalConductivity: '0.25',
      hardness: 'Shore D 85',
      corrosionResistance: '优秀',
      cost: '极高',
      recyclability: '可回收',
      maxTemp: '250',
      minTemp: '-50'
    },
    description: 'PEEK是最高端的特种工程塑料之一，具有极高的耐热性和机械强度，可在极端环境下使用。',
    applications: ['高温密封件', '轴承保持架', '耐磨件', '绝缘件', '燃油系统零件'],
    advantages: ['耐超高温', '强度极高', '耐化学性优', '耐磨损', '耐辐射', '生物相容'],
    disadvantages: ['成本极高', '加工难度大', '需特殊设备']
  },
  {
    id: 'mat-025',
    name: 'PEI (聚醚酰亚胺)',
    nameEn: 'Polyetherimide',
    category: 'plastic',
    level: 'specialty',
    crystallinity: 'amorphous',
    system: 'cabin',
    partName: '灯具反射罩、电器外壳',
    tempGrade: '≥ 200℃',
    tempRange: '-50~170℃',
    highTemp: {
      aging: '170℃×1000hr',
      hardness: '±8',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '210℃ @ 1.8MPa'
    },
    lowTemp: {
      brittleness: '-50℃',
      impact: '≥15 kJ/m² @ -40℃',
      hardness: '+8 max'
    },
    properties: {
      density: '1.27',
      tensileStrength: '105',
      elasticModulus: '3.0',
      meltingPoint: '217 (玻璃化转变温度)',
      thermalConductivity: '0.22',
      hardness: 'Shore D 85',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '可回收',
      maxTemp: '170',
      minTemp: '-50'
    },
    description: 'PEI是一种非晶态特种工程塑料，具有优异的耐热性、尺寸稳定性和阻燃性，可透明成型。',
    applications: ['车灯反射罩', '电器外壳', '透明耐热件', '航空内饰', '医疗器械'],
    advantages: ['耐高温', '尺寸稳定性好', '阻燃', '透明', '强度高', '耐蒸汽'],
    disadvantages: ['成本高', '耐化学性一般', '应力开裂敏感']
  },
  {
    id: 'mat-026',
    name: 'PPA (聚邻苯二甲酰胺)',
    nameEn: 'Polyphthalamide',
    category: 'plastic',
    level: 'specialty',
    crystallinity: 'crystalline',
    system: 'thermal',
    partName: '散热器端盖、热管理零件',
    tempGrade: '≥ 200℃',
    tempRange: '-40~180℃',
    highTemp: {
      aging: '180℃×1000hr',
      hardness: '±10',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '290℃ @ 1.8MPa (GF45%)'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥10 kJ/m² @ -30℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.18-1.20',
      tensileStrength: '85-100',
      elasticModulus: '3.0-3.5',
      meltingPoint: '295-310',
      thermalConductivity: '0.26',
      hardness: 'Shore D 80',
      corrosionResistance: '优秀',
      cost: '较高',
      recyclability: '可回收',
      maxTemp: '180',
      minTemp: '-40'
    },
    description: 'PPA是一种高性能尼龙，耐热性显著优于PA6和PA66，吸水率低，适用于高温热管理系统。',
    applications: ['散热器端盖', '热管理接头', '涡轮增压零件', '发动机周边零件', '高温电器'],
    advantages: ['耐高温', '低吸水率', '尺寸稳定', '耐化学性好', '强度高'],
    disadvantages: ['成本较高', '加工温度高', '韧性一般']
  },
  {
    id: 'mat-027',
    name: 'PC/ABS合金',
    nameEn: 'PC/ABS Alloy',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'amorphous',
    system: 'body',
    partName: '仪表板骨架、内饰件',
    tempGrade: '150-200℃',
    tempRange: '-40~100℃',
    highTemp: {
      aging: '90℃×1000hr',
      hardness: '±8',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '110℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥10 kJ/m² @ -30℃',
      hardness: '+8 max'
    },
    properties: {
      density: '1.15',
      tensileStrength: '55-65',
      elasticModulus: '2.2-2.6',
      meltingPoint: '130-150',
      thermalConductivity: '0.20-0.24',
      hardness: 'Shore D 75-82',
      corrosionResistance: '良好',
      cost: '中等偏高',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-40'
    },
    description: 'PC/ABS合金结合了PC的高冲击强度和ABS的良好加工性，综合性能优异。',
    applications: ['仪表板骨架', '内饰件', '汽车外饰', '家电外壳'],
    advantages: ['冲击强度高', '加工性好', '耐热性优于ABS', '光泽度高'],
    disadvantages: ['成本比ABS高', '耐化学性一般']
  },
  {
    id: 'mat-028',
    name: 'ABS H3',
    nameEn: 'ABS High Heat',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'amorphous',
    system: 'body',
    partName: '内饰件、外饰件',
    tempGrade: '150-200℃',
    tempRange: '-40~100℃',
    highTemp: {
      aging: '100℃×1000hr',
      hardness: '±8',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '105℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-40℃',
      impact: '≥10 kJ/m² @ -30℃',
      hardness: '+8 max'
    },
    properties: {
      density: '1.06',
      tensileStrength: '45-55',
      elasticModulus: '2.1-2.6',
      meltingPoint: '110',
      thermalConductivity: '0.25',
      hardness: 'Shore D 78-85',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-40'
    },
    description: 'ABS H3是高耐热ABS等级，热变形温度高于标准ABS，适用于对耐热性要求较高的场合。',
    applications: ['内饰件', '外饰件', '仪表板部件', '车灯外壳'],
    advantages: ['耐热性好', '韧性好', '表面光泽度高', '易加工'],
    disadvantages: ['成本较标准ABS高', '耐候性一般']
  },
  {
    id: 'mat-029',
    name: 'PP-EPDM-TD20',
    nameEn: 'PP-EPDM (20% Talc)',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    system: 'body',
    partName: '保险杠、内饰件',
    tempGrade: '< 150℃',
    tempRange: '-30~100℃',
    highTemp: {
      aging: '100℃×1000hr',
      hardness: '±5',
      tensile: '-15% max',
      elongation: '-20% max',
      hdt: '115℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-30℃',
      impact: '≥8 kJ/m² @ -20℃',
      hardness: '+10 max'
    },
    properties: {
      density: '1.05',
      tensileStrength: '25-35',
      elasticModulus: '2.5-3.0',
      meltingPoint: '165-175',
      thermalConductivity: '0.15-0.22',
      hardness: 'Shore D 70-78',
      corrosionResistance: '优秀',
      cost: '低',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-30'
    },
    description: 'PP-EPDM-TD20是PP与EPDM共混并添加20%滑石粉的改性材料，具有优异的耐冲击性和刚性。',
    applications: ['保险杠', '门板', '内饰件', '仪表板下护板'],
    advantages: ['耐冲击性好', '刚性好', '成本低', '耐化学腐蚀', '易成型'],
    disadvantages: ['耐低温性一般', '流动性较纯PP差']
  },
  {
    id: 'mat-030',
    name: 'PP-EPDM-M10',
    nameEn: 'PP-EPDM (10% Mineral)',
    category: 'plastic',
    level: 'general',
    crystallinity: 'crystalline',
    system: 'body',
    partName: '内饰件、外饰件',
    tempGrade: '< 150℃',
    tempRange: '-30~100℃',
    highTemp: {
      aging: '100℃×1000hr',
      hardness: '±5',
      tensile: '-20% max',
      elongation: '-25% max',
      hdt: '105℃ @ 0.45MPa'
    },
    lowTemp: {
      brittleness: '-30℃',
      impact: '≥6 kJ/m² @ -20℃',
      hardness: '+10 max'
    },
    properties: {
      density: '0.98',
      tensileStrength: '22-28',
      elasticModulus: '1.8-2.3',
      meltingPoint: '165-175',
      thermalConductivity: '0.15-0.20',
      hardness: 'Shore D 65-72',
      corrosionResistance: '优秀',
      cost: '低',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-30'
    },
    description: 'PP-EPDM-M10是PP与EPDM共混并添加10%矿物填料的改性材料，平衡了成本和性能。',
    applications: ['内饰件', '外饰件', '储物盒', '地图袋'],
    advantages: ['成本低', '韧性较好', '流动性好', '易成型', '可回收'],
    disadvantages: ['刚性较低', '耐高温性一般']
  },
  {
    id: 'mat-031',
    name: 'GMT玻璃纤维毡热塑性复合材料',
    nameEn: 'Glass Mat Reinforced Thermoplastic',
    category: 'composite',
    properties: {
      density: '1.1-1.5',
      tensileStrength: '100-200',
      elasticModulus: '4-9',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '110',
      minTemp: '-40',
      other: {
        '纤维类型': '玻璃纤维毡（随机分布）',
        '树脂体系': '热塑性树脂（PP / PBT / PET / PA / PC）',
        '成型工艺': '板材加热软化 → 压机冲压 → 冷却定型',
        '半成品形态': '预浸料板材（片材）'
      }
    },
    description: '以玻璃纤维毡为增强体与热塑性树脂（PP/PBT/PA等）复合制成的预浸料片材。使用时加热软化后置于压机中冲压冷却成型，适合较大面积、曲面形状的承载结构件。不适合形状复杂零件，表面浮纤明显，不适宜做外观件。可完全回收，是轻量化以塑代钢的代表性材料。',
    applications: ['门模块骨架', '前端模块', '座椅坐盆', '备胎盆', '底护板', '行李舱底板'],
    advantages: ['可回收', '重量轻（较钢减重40%）', '冲压成型效率高', '成本适中', '适合大面积构件'],
    disadvantages: ['浮纤明显不适合外观件', '形状复杂度有限', '各向异性', '刚性低于金属'],
    manufacturingProcess: ['板材加热软化', '压机冲压成型', '冷却定型', '修边处理']
  },
  {
    id: 'mat-032',
    name: 'SMC片状模压复合材料',
    nameEn: 'Sheet Molding Compound',
    category: 'composite',
    properties: {
      density: '1.7-1.9',
      tensileStrength: '100-200',
      elasticModulus: '10-15',
      corrosionResistance: '优秀',
      cost: '中等',
      recyclability: '难以回收',
      maxTemp: '150',
      minTemp: '-40',
      other: {
        '纤维类型': '短切玻纤（1英寸左右）或碳纤',
        '树脂体系': '热固性树脂（UP不饱和聚酯 / 乙烯基酯 / 环氧树脂）',
        '成型工艺': '片材裁切 → 模压（温度+压力最高2000psi）→ 固化 → 脱模',
        '供货形式': '卷装片材，重量不超过1000kg',
        '低收缩添加剂': 'MD填料及各种助剂'
      }
    },
    description: '以短切纤维悬浮于热固性树脂中制成的片状模塑料，通过模压工艺成型。SMC确保纤维与树脂完全结合，在使用前需储存数天"固化"。最终固化在模具中加热加压时完成。适合大批量生产，尺寸稳定性优异；要达到A级饰面需后喷漆处理。主要原料包括短切纤维、热固性树脂、低收缩添加剂和MD填料。',
    applications: ['引擎盖（Hood）', '翼子板', '后备箱盖', '尾门外板', '前端模块', '挡泥板'],
    advantages: ['比强度高', '尺寸稳定性优', '耐腐蚀性优秀', '大批量生产效率高', '设计自由度高', '成本低于钢冲压件'],
    disadvantages: ['热固性不可回收', '需后处理才能达到A级外观', '维修困难', '密度较大（约钢的1/4）'],
    manufacturingProcess: ['片材储存固化', '裁切成"装料"', '模压加热（约150℃）', '加压固化（2000psi）', '脱模', '后喷漆处理']
  },
  {
    id: 'mat-033',
    name: 'BMC块状模压复合材料',
    nameEn: 'Bulk Molding Compound',
    category: 'composite',
    properties: {
      density: '1.7-2.0',
      tensileStrength: '60-130',
      elasticModulus: '9-13',
      corrosionResistance: '优秀',
      cost: '中等',
      recyclability: '难以回收',
      maxTemp: '150',
      minTemp: '-40',
      other: {
        '纤维类型': '短切玻璃纤维（纤维含量15-25%）',
        '树脂体系': '热固性树脂（UP不饱和聚酯）',
        '成型工艺': '注射成型 / 模压成型',
        '与SMC区别': '以块状中间体状态存在，适合注射成型，界面变化较SMC更大'
      }
    },
    description: '玻璃纤维增强热固性预浸料，以块状中间体形式存在，类似于SMC但适合注射成型。适合生产界面变化较大的复杂薄壁产品，可在模具中灌注成型，无需等到工艺完成。具有优异的电绝缘性和耐化学腐蚀性，常用于电气功能零件。',
    applications: ['电气元件壳体', '发动机罩盖', '传感器支架', '水泵壳体', '灯具壳体'],
    advantages: ['电绝缘性优', '耐热耐化学腐蚀', '尺寸精度高', '适合复杂形状', '成本低'],
    disadvantages: ['热固性不可回收', '纤维含量低强度低于SMC', '脆性较高'],
    manufacturingProcess: ['混料制备', '注射成型 / 模压成型', '加热固化', '脱模修边']
  },
  {
    id: 'mat-034',
    name: 'LFT长玻纤增强热塑性复合材料',
    nameEn: 'Long Fiber Reinforced Thermoplastic',
    category: 'composite',
    properties: {
      density: '1.1-1.4',
      tensileStrength: '120-250',
      elasticModulus: '6-12',
      corrosionResistance: '良好',
      cost: '中低',
      recyclability: '可回收',
      maxTemp: '120',
      minTemp: '-40',
      other: {
        '纤维类型': '长玻璃纤维（纤维长度>10mm）',
        '树脂体系': '热塑性树脂（PP / PA / PBT等）',
        'LFT-G工艺': '粒料型：单螺杆挤出机+压机注射成型',
        'LFT-D工艺': '在线混合直接模压：双螺杆挤出机+压机，无需粒料中间环节',
        '与GMT区别': '纤维为长纤取向，力学性能优于GMT随机毡'
      }
    },
    description: '以长玻璃纤维（>10mm）增强热塑性树脂制成的复合材料，包括粒料型LFT-G和在线混合直接模压型LFT-D。长纤维在基体中保持高长径比，力学性能明显优于短纤增强材料。LFT-D省去粒料中间环节，纤维长度更长、强度更高、成本更低。是汽车内饰金属支架以塑代钢的核心材料。',
    applications: ['门模块骨架', '前端模块', '保险杠骨架', '座椅坐盆/骨架', '尾门内板', '内饰金属支架替代'],
    advantages: ['可回收', '力学性能优于短纤', '重量轻（减重30-40%）', 'LFT-D成本低生产节拍快', '设计灵活'],
    disadvantages: ['各向异性', '表面浮纤不适合外观件', '翘曲变形风险', '纤维分散均匀性控制要求高'],
    manufacturingProcess: ['LFT-G: 双螺杆混配造粒 → 注射成型', 'LFT-D: 双螺杆在线混合 → 直接模压成型']
  },
  {
    id: 'mat-035',
    name: 'CFRT连续纤维增强热塑性复合材料',
    nameEn: 'Continuous Fiber Reinforced Thermoplastic',
    category: 'composite',
    properties: {
      density: '1.4-1.6',
      tensileStrength: '300-800',
      elasticModulus: '30-90',
      corrosionResistance: '优秀',
      cost: '高',
      recyclability: '较难回收',
      maxTemp: '130',
      minTemp: '-60',
      other: {
        '纤维类型': '连续玻璃纤维 / 连续碳纤维',
        '树脂体系': '热塑性树脂（PA / PP / PPS / PEEK等）',
        '成型工艺': '热压成型 / 与金属Hybrid混合设计',
        '典型应用模式': 'CFRT单独使用 或 CFRT+金属/注塑 Hybrid结构'
      }
    },
    description: '以连续纤维（玻纤/碳纤）为增强体的热塑性复合材料，纤维连续性保证了最高力学性能，且相比热固性材料具备一定可回收性。可单独使用或与金属Hybrid结合设计车身结构件。纤维须沿承载方向铺设，空洞和切断位置会导致纤维断裂失效，需进行专业结构设计。',
    applications: ['内饰支架', '座椅背板', '座椅坐盆', '后备胎盆', '底护板', '车身Hybrid结构件（CFRT+金属）'],
    advantages: ['强度接近热固性CFRP', '热塑可回收', '与金属Hybrid集成设计', '轻量化效果优（减重40-50%）', '抗冲击性好'],
    disadvantages: ['成本高于LFT/GMT', '加工复杂需专用设备', '各向异性明显', '铺层设计要求高'],
    manufacturingProcess: ['连续纤维铺层', '热压成型', '与金属件嵌件注塑 / 激光焊接复合']
  },
  {
    id: 'mat-036',
    name: 'LWRT轻质增强热塑性复合材料',
    nameEn: 'Light-Weight Reinforced Thermoplastic',
    category: 'composite',
    properties: {
      density: '0.8-1.2',
      tensileStrength: '50-120',
      elasticModulus: '2-7',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收',
      maxTemp: '100',
      minTemp: '-30',
      other: {
        '纤维类型': '玻璃纤维短纤（随机）',
        '树脂体系': '热塑性树脂（PP）',
        '结构特点': '多孔微泡蓬松结构，密度远低于实心复合材料',
        '成型工艺': '加热膨胀 + 冲压成型'
      }
    },
    description: '具有多孔蓬松微泡结构的轻质热塑性玻纤复合材料，密度低至0.8g/cm³，远轻于实心复合材料。兼具良好的隔声隔热性能和触感，广泛用于车内覆盖件和底部防护件，是行李舱和顶棚的主要材料。可完全回收再利用。',
    applications: ['行李舱地板', '车内顶棚', '底护板', '发动机舱隔音垫', '轮罩衬板', '备胎盆盖板'],
    advantages: ['密度极低（轻量化最佳）', '隔声隔热性好', '可回收', '成本适中', '触感好', '吸能缓冲'],
    disadvantages: ['结构强度低不适合承载', '耐水性和耐候性一般', '不适合高温区域', '形状精度较低'],
    manufacturingProcess: ['板材加热膨胀发泡', '冲压成型', '冷却定型', '修边处理']
  },
  {
    id: 'mat-037',
    name: 'PMMA（亚克力/有机玻璃）',
    nameEn: 'Polymethyl Methacrylate',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'amorphous',
    properties: {
      density: '1.19',
      tensileStrength: '65-75',
      elasticModulus: '3.2',
      meltingPoint: '140-160',
      hardness: 'M90-100',
      thermalConductivity: '0.19',
      maxTemp: '80',
      minTemp: '-40',
      other: {
        '透光率': '92%',
        '折射率': '1.49',
        '耐UV': '优秀'
      }
    },
    description: 'PMMA是丙烯酸类透明非结晶塑料，具有卓越的光学透明性（透光率92%）、良好的耐候性和加工性能。其硬度优于PC，不易刮花，但抗冲击强度低于PC。广泛应用于汽车灯具灯罩、光导元件及内饰透光装饰件。',
    applications: ['车灯灯罩', '光导', '透明饰件', '仪表透明罩', '后尾灯配光镜'],
    advantages: ['透光率极高（92%）', '耐候性好不易发黄', '表面硬度高', '加工性好', '成本低于PC'],
    disadvantages: ['抗冲击性不如PC', '脆性较大', '耐化学溶剂性较差', '热变形温度较低']
  },
  {
    id: 'mat-038',
    name: 'TPV（热塑性硫化橡胶）',
    nameEn: 'Thermoplastic Vulcanizate',
    category: 'elastomer',
    properties: {
      density: '0.95',
      tensileStrength: '5-15',
      elasticModulus: '1-5',
      hardness: 'Shore A 55-90',
      meltingPoint: '170-190',
      maxTemp: '135',
      minTemp: '-40',
      other: {
        '压缩永久变形': '25-35%（70°C×22h）',
        '耐油性': '良好'
      }
    },
    description: 'TPV是PP与EPDM橡胶的动态硫化共混物，兼具热塑性塑料的加工性和硫化橡胶的弹性。具有优异的耐热老化性、耐油性和压缩永久变形性能。在汽车中用于密封件、防尘罩等，可回收利用。',
    applications: ['密封条', '防尘罩', '汽车内饰软触感包覆', '线束护套'],
    advantages: ['可回收利用', '加工效率高', '弹性回复好', '耐热老化性优异'],
    disadvantages: ['高温下强度下降', '与基材粘合需处理', '手感不如传统橡胶']
  },
  {
    id: 'mat-039',
    name: 'TPE（热塑性弹性体）',
    nameEn: 'Thermoplastic Elastomer',
    category: 'elastomer',
    properties: {
      density: '0.90-1.20',
      tensileStrength: '5-20',
      elasticModulus: '1-15',
      hardness: 'Shore A 30-95',
      maxTemp: '100',
      minTemp: '-40',
      other: {
        '压缩永久变形': '30-50%',
        '成型收缩率': '1.0-2.5%'
      }
    },
    description: 'TPE是一类在常温下显示橡胶弹性、高温下可塑化成型的热塑性弹性体总称。可采用注塑、挤出等热塑性加工方式成型，无需硫化。与PP、ABS等基材可通过双色注塑实现软硬结合，广泛用于汽车内饰软触感零件。',
    applications: ['双色注塑软触感包覆', '密封件', '缓冲垫', '把手包胶', '内饰防滑垫'],
    advantages: ['热塑性加工无需硫化', '与PP/ABS粘合性好', '触感柔软舒适', '可双色注塑一体成型', '可回收'],
    disadvantages: ['耐热性不及硫化橡胶', '压缩永久变形较大', '耐油性一般']
  },
  {
    id: 'mat-040',
    name: 'PP-TD40（PP+40%滑石粉）',
    nameEn: 'PP-40% Talc Filled',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    properties: {
      density: '1.22',
      tensileStrength: '25-35',
      elasticModulus: '3.5-5.0',
      meltingPoint: '160-165',
      hardness: 'R85-100',
      maxTemp: '120',
      minTemp: '-30',
      other: {
        '弯曲模量': '3000-4500 MPa',
        '收缩率': '0.8-1.2%',
        '填充量': '40%滑石粉'
      }
    },
    description: 'PP-TD40是聚丙烯基体中加入40%滑石粉填充的改性材料。滑石粉的加入显著提高了材料的刚性和热变形温度，降低了成型收缩率，改善了尺寸稳定性。在汽车中广泛用于壳体、支架等结构件，成本较低。',
    applications: ['车灯壳体', '支架', '风扇罩', '暖风机壳体', '内饰骨架件'],
    advantages: ['高刚性', '尺寸稳定性好', '收缩率低', '成本低', '加工性好'],
    disadvantages: ['韧性较纯PP下降', '密度增大', '表面光泽度降低', '焊接强度下降']
  },
  {
    id: 'mat-041',
    name: 'PP-TD30（PP+30%滑石粉）',
    nameEn: 'PP-30% Talc Filled',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    properties: {
      density: '1.14',
      tensileStrength: '23-32',
      elasticModulus: '2.8-4.0',
      meltingPoint: '160-165',
      hardness: 'R80-95',
      maxTemp: '120',
      minTemp: '-30',
      other: {
        '弯曲模量': '2500-3500 MPa',
        '收缩率': '1.0-1.4%',
        '填充量': '30%滑石粉'
      }
    },
    description: 'PP-TD30是聚丙烯基体中加入30%滑石粉填充的改性材料。相比PP-TD40具有更好的冲击韧性和加工流动性，同时保持了良好的刚性和尺寸稳定性。广泛应用于汽车氛围灯支架、饰板等非外观结构件。',
    applications: ['氛围灯支架', '遮光罩', '饰板骨架', '风道零件', '内饰支架'],
    advantages: ['刚韧平衡良好', '流动性好易成型', '尺寸稳定', '成本适中'],
    disadvantages: ['刚性低于PP-TD40', '耐热性中等']
  },
  {
    id: 'mat-042',
    name: 'PP-TD20（PP+20%滑石粉）',
    nameEn: 'PP-20% Talc Filled',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    properties: {
      density: '1.05',
      tensileStrength: '22-30',
      elasticModulus: '2.2-3.2',
      meltingPoint: '160-165',
      hardness: 'R75-90',
      maxTemp: '110',
      minTemp: '-30',
      other: {
        '弯曲模量': '2000-3000 MPa',
        '收缩率': '1.2-1.6%',
        '填充量': '20%滑石粉'
      }
    },
    description: 'PP-TD20是聚丙烯基体中加入20%滑石粉填充的改性材料。在PP-TD系列中具有最低密度和最佳韧性，良好的抗冲击和耐低温性能使其适用于密封垫、缓冲件等对韧性要求较高的零件。',
    applications: ['密封垫', '缓冲件', '卡扣', '内饰装饰件'],
    advantages: ['密度低质量轻', '韧性好', '抗冲击性能优良', '加工性好'],
    disadvantages: ['刚性较低', '耐热性一般']
  },
  {
    id: 'mat-043',
    name: 'PBT-GF30（PBT+30%玻璃纤维）',
    nameEn: 'PBT-30% Glass Fiber Reinforced',
    category: 'plastic',
    level: 'engineering',
    crystallinity: 'crystalline',
    properties: {
      density: '1.53',
      tensileStrength: '120-150',
      elasticModulus: '8-11',
      meltingPoint: '225',
      hardness: 'R115-120',
      maxTemp: '160',
      minTemp: '-40',
      other: {
        '弯曲强度': '180-210 MPa',
        '收缩率': '0.3-0.8%',
        '填充量': '30%玻璃纤维',
        '热变形温度(1.82MPa)': '205°C'
      }
    },
    description: 'PBT-GF30是聚对苯二甲酸丁二醇酯基体中加入30%玻璃纤维增强的改性工程塑料。具有优异的力学强度、耐热性和电气绝缘性，尺寸稳定性好，吸水率低。在汽车照明系统中广泛用于需要高耐热和精密尺寸的插座、连接器等零件。',
    applications: ['车灯插座', '接插件', '连接器', '电子电器零件', '传感器外壳'],
    advantages: ['强度高刚性好', '耐热性优异（HDT>200°C）', '尺寸稳定', '电绝缘性好', '耐化学性好'],
    disadvantages: ['密度大', '收缩率各向异性', '缺口敏感', '价格高于通用塑料']
  }
];
