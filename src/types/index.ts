// 材料接口
export interface Material {
  id: string;
  name: string;
  nameEn?: string;
  category: 'metal' | 'plastic' | 'composite' | 'rubber' | 'ceramic' | 'other';
  properties: {
    density?: string; // 密度 g/cm³
    tensileStrength?: string; // 抗拉强度 MPa
    yieldStrength?: string; // 屈服强度 MPa
    elasticModulus?: string; // 弹性模量 GPa
    meltingPoint?: string; // 熔点 °C
    thermalConductivity?: string; // 热导率 W/m·K
    hardness?: string; // 硬度
    corrosionResistance?: string; // 耐腐蚀性
    cost?: string; // 相对成本
    recyclability?: string; // 可回收性
    other?: Record<string, string>;
  };
  description?: string;
  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
}

// 零部件接口
export interface Part {
  id: string;
  name: string;
  nameEn?: string;
  category: string; // 如：发动机系统、底盘系统、车身系统等
  subcategory?: string;
  materials: string[]; // Material ID 数组
  primaryMaterial?: string; // 主要材料 ID
  imageUrl?: string;
  modelUrl?: string; // 3D模型URL（未来扩展）
  description?: string;
  function?: string; // 功能描述
  workingConditions?: {
    temperature?: string;
    pressure?: string;
    load?: string;
    environment?: string;
  };
  manufacturingProcess?: string[]; // 制造工艺
}

// 零部件系统分类
export interface PartSystem {
  id: string;
  name: string;
  icon?: string;
  parts: string[]; // Part ID 数组
  description?: string;
}

// 用户笔记
export interface Note {
  id: string;
  partId?: string;
  materialId?: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

// 收藏
export interface Favorite {
  id: string;
  type: 'part' | 'material';
  targetId: string;
  createdAt: number;
}

// 测验题目
export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'matching';
  question: string;
  options: string[];
  correctAnswer: number | number[]; // 单选为number，多选为number[]
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedPartId?: string;
  relatedMaterialId?: string;
}

// 测验记录
export interface QuizRecord {
  id: string;
  questionId: string;
  userAnswer: number | number[];
  isCorrect: boolean;
  timestamp: number;
}
