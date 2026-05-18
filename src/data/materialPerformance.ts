import type { MaterialPerformanceData } from '../types/materialPerformance';
import { documentBasedMaterials } from './documentBasedMaterials';

// 示例：塑料材料性能数据
const baseMaterialPerformanceData: MaterialPerformanceData[] = [
  {
    materialId: 'mat-pp',
    materialName: '聚丙烯 (PP)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '30-40', unit: 'MPa', category: 'mechanical', importance: 'high', description: '材料抵抗拉伸破坏的能力' },
      { name: '弯曲强度', value: '40-55', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '2-6', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '材料抵抗冲击载荷的能力' },
      { name: '硬度', value: '70-80', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '1300-1800', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '160-170', unit: '℃', category: 'thermal', importance: 'high', description: '材料从固态转变为液态的温度' },
      { name: '玻璃化转变温度', value: '-10到0', unit: '℃', category: 'thermal', importance: 'medium' },
      { name: '热变形温度', value: '100-110', unit: '℃', category: 'thermal', importance: 'high', description: '材料在一定载荷下开始变形的温度' },
      { name: '热膨胀系数', value: '100-150', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },
      { name: '导热系数', value: '0.22', unit: 'W/(m·K)', category: 'thermal', importance: 'low' },

      // 物理性能
      { name: '密度', value: '0.90-0.91', unit: 'g/cm³', category: 'physical', importance: 'high', description: '单位体积材料的质量' },
      { name: '吸水率', value: '<0.01', unit: '%', category: 'physical', importance: 'medium', description: '材料吸收水分的程度' },
      { name: '透光率', value: '90', unit: '%', category: 'physical', importance: 'low' },

      // 化学性能
      { name: '耐酸性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐候性', value: '良', unit: '', category: 'chemical', importance: 'medium' },

      // 加工性能
      { name: '熔融指数', value: '2-40', unit: 'g/10min', category: 'processing', importance: 'high', description: '反映材料的流动性' },
      { name: '成型收缩率', value: '1.0-2.5', unit: '%', category: 'processing', importance: 'high', description: '成型后材料的收缩程度' },
      { name: '成型温度', value: '180-240', unit: '℃', category: 'processing', importance: 'medium' },
      { name: '干燥温度', value: '80-100', unit: '℃', category: 'processing', importance: 'low' }
    ],
    performanceScore: {
      overall: 75,
      mechanical: 70,
      thermal: 72,
      processing: 85
    }
  },
  {
    materialId: 'mat-abs',
    materialName: 'ABS树脂',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '40-52', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '弯曲强度', value: '65-90', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '15-35', unit: 'kJ/m²', category: 'mechanical', importance: 'high', description: '高韧性，抗冲击能力强' },
      { name: '硬度', value: '105-120', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2000-2800', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '无明确熔点', unit: '℃', category: 'thermal', importance: 'high', description: '非晶态聚合物' },
      { name: '玻璃化转变温度', value: '105-110', unit: '℃', category: 'thermal', importance: 'medium' },
      { name: '热变形温度', value: '93-118', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '热膨胀系数', value: '70-95', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },
      { name: '导热系数', value: '0.25-0.33', unit: 'W/(m·K)', category: 'thermal', importance: 'low' },

      // 物理性能
      { name: '密度', value: '1.04-1.06', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '0.2-0.4', unit: '%', category: 'physical', importance: 'medium' },
      { name: '透光率', value: '85-92', unit: '%', category: 'physical', importance: 'low' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐候性', value: '中', unit: '', category: 'chemical', importance: 'medium', description: '需要添加抗UV剂' },

      // 加工性能
      { name: '熔融指数', value: '2-50', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '成型收缩率', value: '0.4-0.7', unit: '%', category: 'processing', importance: 'high', description: '收缩率小，尺寸稳定' },
      { name: '成型温度', value: '180-250', unit: '℃', category: 'processing', importance: 'medium' },
      { name: '干燥温度', value: '80-90', unit: '℃', category: 'processing', importance: 'low' }
    ],
    performanceScore: {
      overall: 82,
      mechanical: 85,
      thermal: 75,
      processing: 88
    }
  },
  {
    materialId: 'mat-pa6',
    materialName: '尼龙6 (PA6)',
    category: 'plastic',
    properties: [
      // 力学性能
      { name: '拉伸强度', value: '70-85', unit: 'MPa', category: 'mechanical', importance: 'high', description: '强度高，承载能力强' },
      { name: '弯曲强度', value: '90-120', unit: 'MPa', category: 'mechanical', importance: 'high' },
      { name: '冲击强度', value: '50-80', unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
      { name: '硬度', value: '110-125', unit: 'Shore D', category: 'mechanical', importance: 'medium' },
      { name: '弹性模量', value: '2800-3200', unit: 'MPa', category: 'mechanical', importance: 'medium' },

      // 热学性能
      { name: '熔点', value: '215-225', unit: '℃', category: 'thermal', importance: 'high' },
      { name: '玻璃化转变温度', value: '45-55', unit: '℃', category: 'thermal', importance: 'medium' },
      { name: '热变形温度', value: '150-180', unit: '℃', category: 'thermal', importance: 'high', description: '耐热性优良' },
      { name: '热膨胀系数', value: '80-100', unit: '×10⁻⁶/℃', category: 'thermal', importance: 'medium' },
      { name: '导热系数', value: '0.25', unit: 'W/(m·K)', category: 'thermal', importance: 'low' },

      // 物理性能
      { name: '密度', value: '1.12-1.14', unit: 'g/cm³', category: 'physical', importance: 'high' },
      { name: '吸水率', value: '2.5-3.5', unit: '%', category: 'physical', importance: 'high', description: '吸水性较高，影响尺寸稳定性' },

      // 化学性能
      { name: '耐酸性', value: '良', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐碱性', value: '优', unit: '', category: 'chemical', importance: 'medium' },
      { name: '耐油性', value: '优', unit: '', category: 'chemical', importance: 'high', description: '耐油性能优异' },

      // 加工性能
      { name: '熔融指数', value: '5-60', unit: 'g/10min', category: 'processing', importance: 'high' },
      { name: '成型收缩率', value: '0.8-2.0', unit: '%', category: 'processing', importance: 'high' },
      { name: '成型温度', value: '230-280', unit: '℃', category: 'processing', importance: 'medium' },
      { name: '干燥温度', value: '80-100', unit: '℃', category: 'processing', importance: 'medium', description: '吸湿性强，需充分干燥' }
    ],
    performanceScore: {
      overall: 88,
      mechanical: 92,
      thermal: 85,
      processing: 80
    }
  }
];

// 合并基础数据和文档导入的数据
export const materialPerformanceData: MaterialPerformanceData[] = [
  ...baseMaterialPerformanceData,
  ...documentBasedMaterials
];

// 导出便捷访问函数
const PERF_STORAGE_KEY = 'customMaterialPerformance';

function getCustomPerformance(): MaterialPerformanceData[] {
  try {
    const saved = localStorage.getItem(PERF_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveCustomPerformance(list: MaterialPerformanceData[]): void {
  localStorage.setItem(PERF_STORAGE_KEY, JSON.stringify(list));
}

export function getMaterialPerformance(materialId: string): MaterialPerformanceData | undefined {
  return getAllMaterialsPerformance().find(m => m.materialId === materialId);
}

export function getAllMaterialsPerformance(): MaterialPerformanceData[] {
  return [...materialPerformanceData, ...getCustomPerformance()];
}

export function getMaterialsByCategory(category: string): MaterialPerformanceData[] {
  return getAllMaterialsPerformance().filter(m => m.category === category);
}

/** 新增或覆盖一条自定义性能数据，保存到 localStorage */
export function upsertCustomPerformance(data: MaterialPerformanceData): void {
  const list = getCustomPerformance();
  const idx = list.findIndex(m => m.materialId === data.materialId);
  if (idx >= 0) list[idx] = data;
  else list.push(data);
  saveCustomPerformance(list);
}

/** 删除一条自定义性能数据 */
export function deleteCustomPerformance(materialId: string): void {
  saveCustomPerformance(getCustomPerformance().filter(m => m.materialId !== materialId));
}

/** 判断某条数据是否是用户自定义的（可编辑/删除） */
export function isCustomPerformance(materialId: string): boolean {
  return getCustomPerformance().some(m => m.materialId === materialId);
}
