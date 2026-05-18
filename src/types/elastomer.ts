// 弹性体（TPE）类型定义

export type ElastomerLevel = 'root' | 'family' | 'subtype';
export type PriceLevel = 'low-medium' | 'medium' | 'medium-high' | 'high' | 'very-high';

/** 性能评级（对应文档 +/++/+++ 三档） */
export interface PerformanceRatings {
  hydrolysis?: 1 | 2 | 3;      // 耐水解性
  oilResistance?: 1 | 2 | 3;   // 耐油性
  acidAlkali?: 1 | 2 | 3;      // 耐酸碱性
  scratchWear?: 1 | 2 | 3;     // 耐刮/耐磨
  weathering?: 1 | 2 | 3;      // 耐光老化
  odor?: 1 | 2 | 3;            // 气味
  flowability?: 1 | 2 | 3;     // 流动性（加工性）
  resilience?: 1 | 2 | 3;      // 回弹性
}

/** 核心力学性能（在 80A 硬度下的典型值） */
export interface MechanicalProps {
  tensileStrength?: string;    // 拉伸强度 MPa
  elongation?: string;         // 断裂伸长率 %
  tearStrength?: string;       // 撕裂强度 kN/m（直角）
  compressionSet?: string;     // 压缩永久形变（70℃，22h）%
}

/** TPE 树节点 */
export interface ElastomerNode {
  id: string;
  name: string;               // 中文名
  nameEn: string;             // 英文缩写（如 SEBS）
  fullNameEn?: string;        // 英文全称
  level: ElastomerLevel;
  parentId?: string;
  familyId?: string;          // 所属大类 ID（subtype 专用）
  color: string;              // Tailwind 颜色方案标识

  description?: string;
  appearance?: string;        // 外观
  feel?: string;              // 手感

  hardnessRange?: string;     // 硬度范围
  longTermTemp?: string;      // 长期老化温度
  minTemp?: string;           // 最低使用温度

  mechanical?: MechanicalProps;
  ratings?: PerformanceRatings;

  price?: PriceLevel;
  recyclable?: boolean;

  applications?: string[];
  advantages?: string[];
  disadvantages?: string[];
  typicalProducts?: string[]; // 典型牌号/供应商

  childIds?: string[];        // 子节点 ID
}

/** 颜色方案（每个大类一套颜色） */
export const FAMILY_COLORS: Record<string, {
  bg: string; text: string; border: string;
  lightBg: string; tag: string; tagText: string;
}> = {
  tps:  { bg: 'bg-blue-600',    text: 'text-white', border: 'border-blue-600',   lightBg: 'bg-blue-50',   tag: 'bg-blue-100',   tagText: 'text-blue-800'  },
  tpv:  { bg: 'bg-green-600',   text: 'text-white', border: 'border-green-600',  lightBg: 'bg-green-50',  tag: 'bg-green-100',  tagText: 'text-green-800' },
  tpu:  { bg: 'bg-purple-600',  text: 'text-white', border: 'border-purple-600', lightBg: 'bg-purple-50', tag: 'bg-purple-100', tagText: 'text-purple-800'},
  tpee: { bg: 'bg-orange-500',  text: 'text-white', border: 'border-orange-500', lightBg: 'bg-orange-50', tag: 'bg-orange-100', tagText: 'text-orange-800'},
  tpa:  { bg: 'bg-rose-500',    text: 'text-white', border: 'border-rose-500',   lightBg: 'bg-rose-50',   tag: 'bg-rose-100',   tagText: 'text-rose-800'  },
  tpo:  { bg: 'bg-teal-600',    text: 'text-white', border: 'border-teal-600',   lightBg: 'bg-teal-50',   tag: 'bg-teal-100',   tagText: 'text-teal-800'  },
  root: { bg: 'bg-gray-700',    text: 'text-white', border: 'border-gray-700',   lightBg: 'bg-gray-50',   tag: 'bg-gray-100',   tagText: 'text-gray-700'  },
};
