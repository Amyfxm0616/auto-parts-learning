// src/types/rubber.ts - 橡胶材料专用类型定义

export interface RubberPerformance {
  // 高温性能
  highTemp: {
    aging: string; // 热空气老化条件，如 "225℃×70hr"
    hardnessChange: string; // 硬度变化，如 "0~+10"
    tensileChange: string; // 拉伸强度变化率，如 "-25 max"
    elongationChange: string; // 伸长率变化率，如 "-30 max"
    compression: string; // 压缩永久变形，如 "175℃×22hr, ≤25"
  };
  // 低温性能
  lowTemp: {
    brittleness: string; // 低温脆性不断裂，如 "-40℃"
    tr10: string; // 低温回弹TR10，如 "-40℃ max"
    hardness: string; // 低温硬度变化，如 "✕" 或 "+10 max"
  };
}

export interface RubberMaterialExtended {
  // 基础信息（继承自现有Material接口）
  id: string;
  name: string;
  category: 'rubber';
  description: string;

  // 橡胶特有分类
  rubberType: 'bushing' | 'mount' | 'hose' | 'boot' | 'seal' | 'weatherstrip' | 'cushion' | 'other';
  tempLevel: 'temp1' | 'temp2' | 'temp3' | 'temp4' | 'temp5' | 'temp6';

  // 系统分类（新增）
  system: 'thermal' | 'chassis' | 'cabin' | 'engine' | 'body' | 'power';

  // 零部件信息
  partName: string; // 具体零部件名称，如 "中冷器气室密封圈"

  // 推荐材料
  material: string; // 如 "VMQ", "EPDM", "NBR"

  // 温度范围
  tempRange: {
    min: number; // 最低工作温度
    max: number; // 最高工作温度
    display: string; // 显示文本，如 "-40~170℃"
  };

  // 性能数据（新增）
  performance?: RubberPerformance;

  // 参考标准
  standards?: string[]; // 如 ["GB/T 7759", "HG/T 2196"]

  // 耐化学介质
  chemicalResistance?: {
    oil: boolean; // 耐油
    fuel: boolean; // 耐燃油
    coolant: boolean; // 耐冷却液
    water: boolean; // 耐水
  };

  // 其他属性
  properties: {
    hardness?: string;
    density?: string;
    tensileStrength?: string;
    elongation?: string;
    [key: string]: any;
  };

  // 应用案例
  applications?: string[];

  // 供应商（可选）
  suppliers?: string[];
}

// 系统配置
export const rubberSystems = [
  { id: 'thermal', name: '热管理系统', icon: '🌡️', color: 'bg-red-50 border-red-200' },
  { id: 'chassis', name: '底盘系统', icon: '🚗', color: 'bg-blue-50 border-blue-200' },
  { id: 'cabin', name: '座舱系统', icon: '🪟', color: 'bg-purple-50 border-purple-200' },
  { id: 'engine', name: '增程系统', icon: '⚙️', color: 'bg-orange-50 border-orange-200' },
  { id: 'body', name: '车身系统', icon: '🚙', color: 'bg-green-50 border-green-200' },
  { id: 'power', name: '动力驱动系统', icon: '⚡', color: 'bg-yellow-50 border-yellow-200' }
] as const;

// 材料类型映射
export const materialTypes = {
  'VMQ': '硅橡胶',
  'EPDM': '三元乙丙橡胶',
  'NBR': '丁腈橡胶',
  'HNBR': '氢化丁腈橡胶',
  'FKM': '氟橡胶',
  'CR': '氯丁橡胶',
  'ACM': '丙烯酸酯橡胶',
  'AEM': '乙烯丙烯酸酯橡胶',
  'TPV': '热塑性硫化橡胶',
  'TPS': '热塑性苯乙烯弹性体',
  'TPEE': '热塑性聚酯弹性体',
  'NR': '天然橡胶',
  'CM': '氯化聚乙烯橡胶',
  'ECO': '氯醇橡胶'
} as const;

export type MaterialType = keyof typeof materialTypes;
