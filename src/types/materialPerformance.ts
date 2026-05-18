// 材料性能数据类型定义

export interface MaterialProperty {
  name: string;              // 性能名称
  value: string | number;    // 性能值
  unit: string;              // 单位
  category: PropertyCategory; // 性能类别
  importance: 'high' | 'medium' | 'low'; // 重要性
  description?: string;      // 描述
}

export type PropertyCategory =
  | 'mechanical'    // 力学性能
  | 'thermal'       // 热学性能
  | 'electrical'    // 电学性能
  | 'physical'      // 物理性能
  | 'chemical'      // 化学性能
  | 'processing';   // 加工性能

export interface MaterialPerformanceData {
  materialId: string;
  materialName: string;
  category: string;
  properties: MaterialProperty[];
  performanceScore?: {
    overall: number;          // 综合评分 0-100
    mechanical: number;       // 力学性能评分
    thermal: number;          // 热学性能评分
    processing: number;       // 加工性能评分
  };
}

// 性能类别配置
export const PROPERTY_CATEGORIES = {
  mechanical: {
    name: '力学性能',
    icon: '💪',
    color: 'blue',
    properties: [
      '拉伸强度',
      '弯曲强度',
      '冲击强度',
      '硬度',
      '弹性模量',
      '屈服强度',
      '断裂伸长率',
      '压缩强度'
    ]
  },
  thermal: {
    name: '热学性能',
    icon: '🌡️',
    color: 'red',
    properties: [
      '熔点',
      '玻璃化转变温度',
      '热变形温度',
      '热膨胀系数',
      '导热系数',
      '比热容',
      '燃烧性能',
      '耐热性'
    ]
  },
  electrical: {
    name: '电学性能',
    icon: '⚡',
    color: 'yellow',
    properties: [
      '介电常数',
      '介电强度',
      '体积电阻率',
      '表面电阻率',
      '漏电起痕指数',
      '静电性能'
    ]
  },
  physical: {
    name: '物理性能',
    icon: '🔬',
    color: 'green',
    properties: [
      '密度',
      '吸水率',
      '透光率',
      '折射率',
      '雾度',
      '光泽度',
      '颜色稳定性'
    ]
  },
  chemical: {
    name: '化学性能',
    icon: '🧪',
    color: 'purple',
    properties: [
      '耐酸性',
      '耐碱性',
      '耐溶剂性',
      '耐油性',
      '耐候性',
      '抗氧化性',
      '抗紫外线'
    ]
  },
  processing: {
    name: '加工性能',
    icon: '⚙️',
    color: 'orange',
    properties: [
      '熔融指数',
      '成型收缩率',
      '成型温度',
      '干燥温度',
      '加工流动性',
      '焊接性能',
      '涂装性能'
    ]
  }
} as const;

// 性能指标权重（用于计算综合评分）
export const PROPERTY_WEIGHTS = {
  拉伸强度: 0.15,
  冲击强度: 0.12,
  硬度: 0.08,
  密度: 0.08,
  熔点: 0.10,
  热变形温度: 0.12,
  吸水率: 0.08,
  成型收缩率: 0.10,
  加工流动性: 0.08,
  耐候性: 0.09
};

// 性能评估标准
export interface PropertyStandard {
  excellent: { min: number; max: number };  // 优秀
  good: { min: number; max: number };       // 良好
  fair: { min: number; max: number };       // 一般
  poor: { min: number; max: number };       // 较差
}

// 常见性能的评估标准
export const PROPERTY_STANDARDS: Record<string, PropertyStandard> = {
  '拉伸强度': {
    excellent: { min: 80, max: Infinity },
    good: { min: 50, max: 80 },
    fair: { min: 30, max: 50 },
    poor: { min: 0, max: 30 }
  },
  '冲击强度': {
    excellent: { min: 50, max: Infinity },
    good: { min: 20, max: 50 },
    fair: { min: 10, max: 20 },
    poor: { min: 0, max: 10 }
  },
  '热变形温度': {
    excellent: { min: 120, max: Infinity },
    good: { min: 90, max: 120 },
    fair: { min: 60, max: 90 },
    poor: { min: 0, max: 60 }
  }
  // 可以继续添加更多标准...
};
