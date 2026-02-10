// 直接定义类型避免导入问题
interface Material {
  id: string;
  name: string;
  nameEn?: string;
  category: 'metal' | 'plastic' | 'composite' | 'rubber' | 'elastomer' | 'acoustic' | 'ceramic' | 'other';
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
    other?: Record<string, string>;
  };
  description?: string;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  imageUrl?: string;
  reportUrl?: string;
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
    properties: {
      density: '0.90-0.91',
      tensileStrength: '30-40',
      elasticModulus: '1.5-2.0',
      meltingPoint: '160-170',
      thermalConductivity: '0.1-0.22',
      corrosionResistance: '优秀',
      cost: '低',
      recyclability: '可回收'
    },
    description: 'PP是最轻的塑料之一，具有良好的化学稳定性和加工性能。',
    applications: ['保险杠', '内饰板', '仪表盘', '油箱'],
    advantages: ['重量轻', '成本低', '耐化学腐蚀', '易成型'],
    disadvantages: ['耐低温性差', '刚性较低', '易老化']
  },
  {
    id: 'mat-005',
    name: 'ABS塑料',
    nameEn: 'ABS',
    category: 'plastic',
    properties: {
      density: '1.05',
      tensileStrength: '40-50',
      elasticModulus: '2.0-2.5',
      meltingPoint: '105',
      thermalConductivity: '0.25',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '可回收'
    },
    description: 'ABS是丙烯腈、丁二烯、苯乙烯三元共聚物，综合性能优异。',
    applications: ['格栅', '后视镜壳', '内饰件', '仪表板'],
    advantages: ['韧性好', '表面光泽度高', '易加工', '尺寸稳定'],
    disadvantages: ['耐候性一般', '成本较PP高']
  },
  {
    id: 'mat-006',
    name: '碳纤维复合材料',
    nameEn: 'Carbon Fiber Composite',
    category: 'composite',
    properties: {
      density: '1.5-1.6',
      tensileStrength: '3500-4500',
      elasticModulus: '230-240',
      thermalConductivity: '5-10',
      corrosionResistance: '优秀',
      cost: '极高',
      recyclability: '难以回收'
    },
    description: '碳纤维增强复合材料，具有极高的比强度和比刚度。',
    applications: ['车身结构件', '引擎盖', '车顶', '空气动力学部件'],
    advantages: ['极轻', '强度极高', '刚性好', '耐腐蚀'],
    disadvantages: ['成本极高', '维修困难', '加工复杂']
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
    name: '橡胶',
    nameEn: 'Rubber',
    category: 'rubber',
    properties: {
      density: '0.91-1.2',
      tensileStrength: '10-30',
      elasticModulus: '0.01-0.1',
      corrosionResistance: '良好',
      cost: '中等',
      recyclability: '部分可回收'
    },
    description: '具有高弹性的高分子材料，广泛用于密封和减震。',
    applications: ['轮胎', '密封条', '减震器', '软管'],
    advantages: ['弹性好', '减震性能优', '密封性好', '耐磨'],
    disadvantages: ['易老化', '耐温范围有限', '易受油脂侵蚀']
  }
];
