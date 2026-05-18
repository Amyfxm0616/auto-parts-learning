// 其他材料类型定义

export interface OtherMaterial {
  id: string;
  name: string;
  nameEn?: string;
  category: 'foam' | 'inorganic' | 'other';
  subcategory?: string; // 发泡材料的具体类型或无机非材料的类型
  properties: {
    density?: string; // 密度 kg/m³
    tensileStrength?: string; // 抗拉强度 kPa
    compressiveStrength?: string; // 压缩强度 kPa
    thermalConductivity?: string; // 热导率 W/m·K
    flameRetardancy?: string; // 阻燃等级
    hardness?: string; // 硬度度数
    waterAbsorption?: string; // 吸水率 %
    temperatureRange?: string; // 使用温度范围
    cost?: string; // 相对成本
    recyclability?: string; // 可回收性
    other?: Record<string, string>;
  };
  description?: string;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  imageUrl?: string;
  parentId?: string; // 用于树状结构的父节点ID
  children?: OtherMaterial[]; // 子节点
}

// 发泡材料类型
export type FoamMaterialType =
  | 'polyurethane_foam' // 聚氨酯发泡
  | 'polyethylene_foam' // 聚乙烯发泡
  | 'polystyrene_foam' // 聚苯乙烯发泡
  | 'epoxy_foam' // 环氧发泡
  | 'expanded_rubber' // 橡胶发泡
  | 'phenolic_foam' // 酚醛发泡
  | 'silicone_foam' // 有机硅发泡
  | 'other_foam'; // 其他发泡

// 无机非金属材料类型
export type InorganicMaterialType =
  | 'ceramic' // 陶瓷
  | 'glass' // 玻璃
  | 'cement' // 水泥
  | 'composite_ceramic' // 复合陶瓷
  | 'refractory' // 耐火材料
  | 'insulation_material' // 保温材料
  | 'other_inorganic'; // 其他无机非

// 其他材料子分类常量
export const FOAM_SUBCATEGORIES: Record<FoamMaterialType, string> = {
  polyurethane_foam: '聚氨酯发泡',
  polyethylene_foam: '聚乙烯发泡',
  polystyrene_foam: '聚苯乙烯发泡',
  epoxy_foam: '环氧发泡',
  expanded_rubber: '橡胶发泡',
  phenolic_foam: '酚醛发泡',
  silicone_foam: '有机硅发泡',
  other_foam: '其他发泡',
};

export const INORGANIC_SUBCATEGORIES: Record<InorganicMaterialType, string> = {
  ceramic: '陶瓷',
  glass: '玻璃',
  cement: '水泥',
  composite_ceramic: '复合陶瓷',
  refractory: '耐火材料',
  insulation_material: '保温材料',
  other_inorganic: '其他无机非',
};

// 树状节点接口
export interface TreeNode<T = OtherMaterial> {
  id: string;
  name: string;
  children?: TreeNode<T>[];
  data?: T;
  expanded?: boolean;
  level?: number;
}

// 视图模式
export type ViewMode = 'tree' | 'table' | 'card';

// 过滤器状态
export interface OtherMaterialFilter {
  category: 'all' | 'foam' | 'inorganic' | 'other';
  subcategory: string;
  searchTerm: string;
}
