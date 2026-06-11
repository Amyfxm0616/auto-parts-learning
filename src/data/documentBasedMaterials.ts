import type { MaterialPerformanceData } from '../types/materialPerformance';

// 基于文档《材料基本性能》提取的材料数据
// 文档日期：2019-04-12，包含116页详细材料性能数据
// 已导入10种材料：LDPE, HDPE, PVC, POM, PS, PPS, PC, PA66, PMMA, PBT

export const documentBasedMaterials: MaterialPerformanceData[] = [
  {
    materialId: 'mat-pe-ldpe',
    materialName: '低密度聚乙烯 (LDPE)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '8-25', unit: 'MPa', category: 'mechanical', importance: 'high', description: '低强度，柔软' },
      { name: '弯曲强度', value: '10-20', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '冲击强度', value: '无断裂', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '韧性极好' },
      { name: '硬度', value: '40-50', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '断裂伸长率', value: '100-600', unit: '%', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '105-115', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热变形温度', value: '35-50', unit: '℃', category: 'thermal', importance: 'high', description: '耐热性较差' },
      { name: '热膨胀系数', value: '100-200', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '0.91-0.93', unit: 'g/cm³', category: 'physical', importance: 'high', description: '密度最低' },
      { name: '吸水率', value: '<0.01', unit: '%', category: 'physical', importance: 'medium' },
      { name: '透光率', value: '90', unit: '%', category: 'physical', importance: 'low' },

      // 化学性能
      { name: '耐酸性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐油性', value: '良', unit: '', category: 'chemical', importance: 'medium' },

      // 加工性能
      { name: '熔融指数', value: '0.2-20', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.02', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性极好' },
      { name: '成型收缩率', value: '1.5-3.0', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '160-220', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 68,
      mechanical: 60,
      thermal: 55,
      processing: 85
    }
  },
  {
    materialId: 'mat-pe-hdpe',
    materialName: '高密度聚乙烯 (HDPE)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '20-37', unit: 'MPa', category: 'mechanical', importance: 'high', description: '强度适中' },
      { name: '弯曲强度', value: '25-35', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '冲击强度', value: '2-10', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '60-70', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '800-1400', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '断裂伸长率', value: '50-600', unit: '%', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '125-135', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热变形温度', value: '60-85', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '100-130', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '0.94-0.97', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '<0.01', unit: '%', category: 'physical', importance: 'medium' },

      // 化学性能
      { name: '耐酸性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐候性', value: '良', unit: '', category: 'chemical', importance: 'medium' },

      // 加工性能
      { name: '熔融指数', value: '0.2-20', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.02', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性极好' },
      { name: '成型收缩率', value: '1.5-4.0', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '180-280', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 72,
      mechanical: 68,
      thermal: 65,
      processing: 85
    }
  },
  {
    materialId: 'mat-pvc',
    materialName: '聚氯乙烯 (PVC)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '40-60', unit: 'MPa', category: 'mechanical', importance: 'high', description: '硬质PVC强度高' },
      { name: '弯曲强度', value: '70-120', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '2-20', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '70-85', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2400-4000', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '无明显熔点', unit: '℃', category: 'thermal', importance: 'high', description: '分解温度160-200℃' },
      { name: '热变形温度', value: '65-75', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '50-100', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.35-1.45', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.04-0.4', unit: '%', category: 'physical', importance: 'medium' },

      // 化学性能
      { name: '耐酸性', value: '优', unit: '', category: 'chemical', importance: 'high' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'high' },
      { name: '阻燃性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '自熄性材料' },

      // 加工性能
      { name: '成型收缩率', value: '0.1-0.6', unit: '%', category: 'processing', importance: 'high', description: '收缩率很小' },
      { name: '成型温度', value: '160-190', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 78,
      mechanical: 75,
      thermal: 70,
      processing: 82
    }
  },
  {
    materialId: 'mat-pom',
    materialName: '聚甲醛 (POM)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '60-70', unit: 'MPa', category: 'mechanical', importance: 'high', description: '高强度，耐疲劳' },
      { name: '弯曲强度', value: '85-110', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '5-10', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '115-125', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2600-3200', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '断裂伸长率', value: '15-75', unit: '%', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '165-175', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热变形温度', value: '110-165', unit: '℃', category: 'thermal', importance: 'high', description: '耐热性优良' },
      { name: '热膨胀系数', value: '100-110', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.41-1.43', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.2-0.4', unit: '%', category: 'physical', importance: 'medium', description: '吸水率很低' },

      // 化学性能
      { name: '耐油性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '优异的耐油性' },
      { name: '耐溶剂性', value: '优', unit: '', category: 'chemical', importance: 'high' },
      { name: '耐磨性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '摩擦系数小' },

      // 加工性能
      { name: '熔融指数', value: '2-25', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.02', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性极好' },
      { name: '成型收缩率', value: '1.8-2.5', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '190-230', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 86,
      mechanical: 88,
      thermal: 85,
      processing: 85
    }
  },
  {
    materialId: 'mat-ps',
    materialName: '聚苯乙烯 (PS)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '35-55', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '弯曲强度', value: '60-100', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '1-3', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '脆性大' },
      { name: '硬度', value: '70-80', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '3000-3300', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '无明显熔点', unit: '℃', category: 'thermal', importance: 'high', description: '玻璃化温度100℃' },
      { name: '热变形温度', value: '75-95', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '60-80', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.04-1.06', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '<0.05', unit: '%', category: 'physical', importance: 'medium' },
      { name: '透光率', value: '88-92', unit: '%', category: 'physical', importance: 'high', description: '透明性优' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '良', unit: '', category: 'chemical', importance: 'medium' },

      // 加工性能
      { name: '熔融指数', value: '2-30', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.03', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性较好' },
      { name: '成型收缩率', value: '0.3-0.8', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '180-250', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 74,
      mechanical: 70,
      thermal: 68,
      processing: 85
    }
  },
  {
    materialId: 'mat-pps',
    materialName: '聚苯硫醚 (PPS)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '65-85', unit: 'MPa', category: 'mechanical', importance: 'high', description: '高强度特种工程塑料' },
      { name: '弯曲强度', value: '95-135', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '3-5', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '85-95', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '3300-4100', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '285-290', unit: '℃', category: 'thermal', importance: 'high', description: '熔点极高' },
      { name: '热变形温度', value: '260-270', unit: '℃', category: 'thermal', importance: 'high', description: '耐高温性能优异' },
      { name: '热膨胀系数', value: '35-50', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.34-1.36', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '<0.05', unit: '%', category: 'physical', importance: 'medium' },

      // 化学性能
      { name: '耐酸性', value: '优', unit: '', category: 'chemical', importance: 'high' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'high' },
      { name: '耐溶剂性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '化学稳定性极佳' },
      { name: '阻燃性', value: '优', unit: '', category: 'chemical', importance: 'high', description: 'UL94-V0级' },

      // 加工性能
      { name: '熔融指数', value: '10-50', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.02', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性极好' },
      { name: '成型收缩率', value: '0.5-1.0', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '300-350', unit: '℃', category: 'processing', importance: 'medium', description: '加工温度高' }
    ],
    performanceScore: {
      overall: 92,
      mechanical: 88,
      thermal: 98,
      processing: 85
    }
  },
  {
    materialId: 'mat-pc',
    materialName: '聚碳酸酯 (PC)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '60-70', unit: 'MPa', category: 'mechanical', importance: 'high', description: '高强度工程塑料' },
      { name: '弯曲强度', value: '90-100', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '60-80', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '超高冲击强度' },
      { name: '硬度', value: '115-125', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2350-2400', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '断裂伸长率', value: '80-150', unit: '%', category: 'mechanical', importance: 'medium' },
      { name: '蠕变模量', value: '24150', unit: 'MPa', category: 'mechanical', importance: 'medium', description: '20℃下承载1h后' },

      // 热学性能
      { name: '熔点', value: '无明确熔点', unit: '℃', category: 'thermal', importance: 'high', description: '非晶态聚合物' },
      { name: '玻璃化转变温度', value: '145-150', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热变形温度', value: '130-140', unit: '℃', category: 'thermal', importance: 'high', description: '高温性能优异' },
      { name: '相对温度指数RTI', value: '125', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '65-70', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.18-1.20', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.15-0.35', unit: '%', category: 'physical', importance: 'medium' },
      { name: '透光率', value: '86-89', unit: '%', category: 'physical', importance: 'high', description: '透明性优异' },
      { name: '折射率', value: '1.586', unit: '', category: 'physical', importance: 'medium' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium', description: '耐稀酸' },
      { name: '耐碱性', value: '差', unit: '', category: 'chemical', importance: 'medium', description: '不耐碱液' },
      { name: '耐溶剂性', value: '中', unit: '', category: 'chemical', importance: 'medium', description: '不耐极性溶剂' },

      // 加工性能
      { name: '成型收缩率', value: '0.5-0.8', unit: '%', category: 'processing', importance: 'high', description: '尺寸稳定性好' },
      { name: '成型温度', value: '280-320', unit: '℃', category: 'processing', importance: 'medium' },
      { name: '溢边值', value: '0.05-0.06', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性差' }
    ],
    performanceScore: {
      overall: 90,
      mechanical: 92,
      thermal: 90,
      processing: 75
    }
  },
  {
    materialId: 'mat-pa66',
    materialName: '尼龙66 (PA66)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '75-90', unit: 'MPa', category: 'mechanical', importance: 'high', description: '高强度工程塑料' },
      { name: '弯曲强度', value: '90-120', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '50-90', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '韧性好' },
      { name: '硬度', value: '108-118', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2900-3100', unit: 'MPa', category: 'mechanical', importance: 'medium' },
      { name: '摩擦系数', value: '0.45', unit: '', category: 'mechanical', importance: 'medium', description: '耐磨性能好' },

      // 热学性能
      { name: '熔点', value: '255-265', unit: '℃', category: 'thermal', importance: 'high', description: '熔点高于PA6' },
      { name: '玻璃化转变温度', value: '50-60', unit: '℃', category: 'thermal', importance: 'medium' },
      { name: '热变形温度', value: '75-90', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '相对温度指数RTI', value: '105-110', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '80-100', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.13-1.15', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '1.0-1.5', unit: '%', category: 'physical', importance: 'high', description: '吸水性较PA6低' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐油性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '耐油性能优异' },
      { name: '耐磨性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '自润滑性能好' },

      // 加工性能
      { name: '熔融指数', value: '5-50', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '成型收缩率', value: '1.0-2.0', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '260-300', unit: '℃', category: 'processing', importance: 'medium', description: '加工温度高' },
      { name: '干燥温度', value: '80-100', unit: '℃', category: 'processing', importance: 'medium', description: '需充分干燥' }
    ],
    performanceScore: {
      overall: 89,
      mechanical: 90,
      thermal: 88,
      processing: 82
    }
  },
  {
    materialId: 'mat-pmma',
    materialName: '聚甲基丙烯酸甲酯 (PMMA)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '55-75', unit: 'MPa', category: 'mechanical', importance: 'high', description: '强度适中' },
      { name: '弯曲强度', value: '90-130', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '2-4', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '脆性较大' },
      { name: '硬度', value: '85-95', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2800-3300', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '无明确熔点', unit: '℃', category: 'thermal', importance: 'high', description: '玻璃化温度105℃' },
      { name: '玻璃化转变温度', value: '100-105', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热变形温度', value: '85-105', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '相对温度指数RTI', value: '50', unit: '℃', category: 'thermal', importance: 'medium', description: '耐热性一般' },
      { name: '热膨胀系数', value: '70-90', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.17-1.20', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.3-0.4', unit: '%', category: 'physical', importance: 'medium' },
      { name: '透光率', value: '92-93', unit: '%', category: 'physical', importance: 'high', description: '透明性极佳' },
      { name: '折射率', value: '1.492', unit: '', category: 'physical', importance: 'medium' },

      // 化学性能
      { name: '耐酸性', value: '中', unit: '', category: 'chemical', importance: 'medium', description: '不耐浓酸' },
      { name: '耐碱性', value: '差', unit: '', category: 'chemical', importance: 'medium', description: '不耐强碱' },
      { name: '耐溶剂性', value: '中', unit: '', category: 'chemical', importance: 'medium', description: '不耐酮类溶剂' },
      { name: '耐候性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '耐紫外线性能好' },

      // 加工性能
      { name: '熔融指数', value: '2-30', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '溢边值', value: '0.03', unit: 'mm', category: 'processing', importance: 'medium', description: '流动性中等' },
      { name: '成型收缩率', value: '0.2-0.8', unit: '%', category: 'processing', importance: 'high', description: '收缩率小' },
      { name: '成型温度', value: '200-250', unit: '℃', category: 'processing', importance: 'medium' }
    ],
    performanceScore: {
      overall: 76,
      mechanical: 72,
      thermal: 65,
      processing: 85
    }
  },
  {
    materialId: 'mat-pbt',
    materialName: '聚对苯二甲酸丁二醇酯 (PBT)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '50-60', unit: 'MPa', category: 'mechanical', importance: 'high', description: '强度适中' },
      { name: '弯曲强度', value: '80-95', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '4-8', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '115-120', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2300-2600', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '223-228', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '玻璃化转变温度', value: '22-43', unit: '℃', category: 'thermal', importance: 'medium' },
      { name: '热变形温度', value: '50-60', unit: '℃', category: 'thermal', importance: 'high', description: '未增强' },
      { name: '相对温度指数RTI', value: '120-130', unit: '℃', category: 'thermal', importance: 'high', description: '耐热性能好' },
      { name: '热膨胀系数', value: '70-90', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },

      // 物理性能
      { name: '密度', value: '1.30-1.38', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.06-0.08', unit: '%', category: 'physical', importance: 'medium', description: '吸水率很低' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '中', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐油性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '耐油性能好' },
      { name: '耐溶剂性', value: '良', unit: '', category: 'chemical', importance: 'high', description: '耐有机溶剂' },

      // 电学性能
      { name: '介电常数', value: '3.0-3.2', unit: '', category: 'electrical', importance: 'high', description: '电气性能优良' },
      { name: '体积电阻率', value: '>10¹⁴', unit: 'Ω·cm', category: 'electrical', importance: 'high' },

      // 加工性能
      { name: '成型收缩率', value: '1.5-2.3', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '240-280', unit: '℃', category: 'processing', importance: 'medium' },
      { name: '干燥温度', value: '120-140', unit: '℃', category: 'processing', importance: 'medium', description: '需充分干燥' }
    ],
    performanceScore: {
      overall: 84,
      mechanical: 78,
      thermal: 85,
      processing: 82
    }
  }
];
