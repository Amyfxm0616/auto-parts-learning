// src/data/rubberMaterials.ts - 橡胶材料详细数据

import type { RubberMaterialExtended } from '../types/rubber';

export const rubberMaterialsData: RubberMaterialExtended[] = [
  // ============ 热管理系统 ============
  {
    id: 'rubber-thermal-001',
    name: '硅橡胶密封圈',
    category: 'rubber',
    description: '用于热管理系统的高温密封件，耐温性能优异',
    rubberType: 'seal',
    tempLevel: 'temp6',
    system: 'thermal',
    partName: '中冷器气室密封圈',
    material: 'VMQ',
    tempRange: {
      min: -40,
      max: 170,
      display: '-40~170℃'
    },
    performance: {
      highTemp: {
        aging: '225℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-25 max',
        elongationChange: '-30 max',
        compression: '175℃×22hr, ≤25'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759', 'HG/T 2196', 'GB/T 1682'],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      density: '1.1-1.2 g/cm³',
      tensileStrength: '≥7 MPa',
      elongation: '≥400%'
    },
    applications: ['中冷器气室密封', '高温管路密封', '电机密封'],
    suppliers: []
  },
  {
    id: 'rubber-thermal-002',
    name: 'EPDM冷却水管',
    category: 'rubber',
    description: '三元乙丙橡胶冷却管路，耐候性好',
    rubberType: 'hose',
    tempLevel: 'temp4',
    system: 'thermal',
    partName: '冷却水管、电机进水软管',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759', 'HG/T 2196'],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '55-75 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['发动机冷却管', '电机进水管', 'Chiller管路'],
    suppliers: []
  },
  {
    id: 'rubber-thermal-003',
    name: 'HNBR空调密封圈',
    category: 'rubber',
    description: '氢化丁腈橡胶，耐温耐油性能出色',
    rubberType: 'seal',
    tempLevel: 'temp4',
    system: 'thermal',
    partName: '冷凝器密封圈、HVAC蜗壳用密封圈、空调管路用密封圈',
    material: 'HNBR',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '150℃×70hr, 30max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-35℃ max',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759', 'HG/T 2196'],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-90 Shore A',
      tensileStrength: '≥18 MPa',
      elongation: '≥250%'
    },
    applications: ['空调系统密封', '制冷剂管路', '电动压缩机'],
    suppliers: []
  },
  {
    id: 'rubber-thermal-004',
    name: 'TPV冷却管路',
    category: 'rubber',
    description: '热塑性硫化橡胶，加工性能好',
    rubberType: 'hose',
    tempLevel: 'temp3',
    system: 'thermal',
    partName: '冷却水管、chiller进水软管、发动机冷却软管',
    material: 'TPV',
    tempRange: {
      min: -40,
      max: 135,
      display: '-40~135℃'
    },
    performance: {
      highTemp: {
        aging: '135℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '125℃×70h, 55max'
      },
      lowTemp: {
        brittleness: '-55℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥300%'
    },
    applications: ['电池冷却管', '发动机冷却管', 'Chiller管路'],
    suppliers: []
  },
  {
    id: 'rubber-thermal-005',
    name: 'EPDM散热器密封件',
    category: 'rubber',
    description: '电机散热器密封圈，耐老化性能好',
    rubberType: 'seal',
    tempLevel: 'temp3',
    system: 'thermal',
    partName: '电机散热器密封圈、发动机散热器防水开关密封圈',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 125,
      display: '-40~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759'],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-70 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['散热器密封', '水侧集成模块', '暖风水泵'],
    suppliers: []
  },
  {
    id: 'rubber-thermal-006',
    name: 'EPDM空调减振橡胶',
    category: 'rubber',
    description: '空调管路减振橡胶，降低振动噪音',
    rubberType: 'mount',
    tempLevel: 'temp2',
    system: 'thermal',
    partName: '空调管路用减振橡胶、散热器悬置用橡胶',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 100,
      display: '-40~100℃'
    },
    performance: {
      highTemp: {
        aging: '100℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-25 max',
        elongationChange: '-25 max',
        compression: '100℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '+10 max'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥250%'
    },
    applications: ['空调管路减振', '散热器悬置', '中冷器减震'],
    suppliers: []
  },

  // ============ 底盘系统 ============
  {
    id: 'rubber-chassis-001',
    name: 'FKM动力转向密封件',
    category: 'rubber',
    description: '氟橡胶密封件，耐高温耐油',
    rubberType: 'seal',
    tempLevel: 'temp6',
    system: 'chassis',
    partName: '动力转向油泵用密封件',
    material: 'FKM',
    tempRange: {
      min: -25,
      max: 175,
      display: '-25~175℃'
    },
    performance: {
      highTemp: {
        aging: '250℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '±30',
        elongationChange: '-50 max',
        compression: '175℃×22h, 35max'
      },
      lowTemp: {
        brittleness: '-25℃',
        tr10: '-15℃ max',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759', 'HG/T 2196'],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-90 Shore A',
      tensileStrength: '≥15 MPa',
      elongation: '≥200%'
    },
    applications: ['动力转向油泵', '高温油封'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-002',
    name: 'HNBR转向系统密封件',
    category: 'rubber',
    description: '氢化丁腈橡胶，综合性能优异',
    rubberType: 'seal',
    tempLevel: 'temp4',
    system: 'chassis',
    partName: '动力转向油泵用密封件',
    material: 'HNBR',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×96hr',
        hardnessChange: '0~+10',
        tensileChange: '-25 max',
        elongationChange: '-30 max',
        compression: '150℃×22hr, 30max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: ['GB/T 7759'],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-90 Shore A',
      tensileStrength: '≥18 MPa',
      elongation: '≥250%'
    },
    applications: ['转向油泵', '转向管路密封'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-003',
    name: 'EPDM转向机衬套',
    category: 'rubber',
    description: '转向机支架衬套，减振降噪',
    rubberType: 'bushing',
    tempLevel: 'temp3',
    system: 'chassis',
    partName: '转向机支架衬套',
    material: 'EPDM',
    tempRange: {
      min: -45,
      max: 125,
      display: '-45~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×100hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '100℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['转向机支架', '底盘衬套'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-004',
    name: 'EPDM制动软管',
    category: 'rubber',
    description: '制动软管外胶，耐压耐磨',
    rubberType: 'hose',
    tempLevel: 'temp3',
    system: 'chassis',
    partName: '制动软管外胶、制动软管内胶',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 125,
      display: '-40~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×100hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-50 max',
        compression: '100℃×70hr, 50max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: ['GB/T 16897'],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-75 Shore A',
      tensileStrength: '≥12 MPa',
      elongation: '≥350%'
    },
    applications: ['制动软管', '液压管路'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-005',
    name: 'CR制动卡钳防尘套',
    category: 'rubber',
    description: '氯丁橡胶防尘套，耐油耐候',
    rubberType: 'boot',
    tempLevel: 'temp3',
    system: 'chassis',
    partName: '制动卡钳防尘套、传动轴防尘罩',
    material: 'CR',
    tempRange: {
      min: -40,
      max: 120,
      display: '-40~120℃'
    },
    performance: {
      highTemp: {
        aging: '120℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '±25',
        elongationChange: '-55 max',
        compression: '100℃×22hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥15 MPa',
      elongation: '≥400%'
    },
    applications: ['制动卡钳', '传动轴护套', '球笼防尘罩'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-006',
    name: 'NR动力总成悬置',
    category: 'rubber',
    description: '天然橡胶悬置，弹性好成本低',
    rubberType: 'mount',
    tempLevel: 'temp2',
    system: 'chassis',
    partName: '动力总成悬置',
    material: 'NR',
    tempRange: {
      min: -45,
      max: 100,
      display: '-45~100℃'
    },
    performance: {
      highTemp: {
        aging: '100℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '100℃×22hr, 30max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '+10 max'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥20 MPa',
      elongation: '≥500%'
    },
    applications: ['发动机悬置', '变速箱悬置', '副车架衬套'],
    suppliers: []
  },
  {
    id: 'rubber-chassis-007',
    name: 'NR车架衬套',
    category: 'rubber',
    description: '减震器衬套、车架衬套',
    rubberType: 'bushing',
    tempLevel: 'temp1',
    system: 'chassis',
    partName: '减震器衬套、车架衬套、稳定杆衬套、摆臂衬套',
    material: 'NR',
    tempRange: {
      min: -45,
      max: 90,
      display: '-45~90℃'
    },
    performance: {
      highTemp: {
        aging: '70℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-25 max',
        elongationChange: '-25 max',
        compression: '70℃×22hr, 25max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '+10 max'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥20 MPa',
      elongation: '≥500%'
    },
    applications: ['减震器衬套', '悬架衬套', '稳定杆衬套'],
    suppliers: []
  },

  // ============ 增程系统 ============
  {
    id: 'rubber-engine-001',
    name: 'VMQ中冷器软管',
    category: 'rubber',
    description: '硅橡胶高温软管，耐温200℃',
    rubberType: 'hose',
    tempLevel: 'temp6',
    system: 'engine',
    partName: '中冷器软管',
    material: 'VMQ',
    tempRange: {
      min: -40,
      max: 200,
      display: '-40~200℃'
    },
    performance: {
      highTemp: {
        aging: '225℃×70hr',
        hardnessChange: '±15',
        tensileChange: '-30 max',
        elongationChange: '-50 max',
        compression: '175℃×22h, 25max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥7 MPa',
      elongation: '≥400%'
    },
    applications: ['增压器管路', '涡轮管路', '高温空气管'],
    suppliers: []
  },
  {
    id: 'rubber-engine-002',
    name: 'FKM油箱隔离阀密封圈',
    category: 'rubber',
    description: '氟橡胶密封圈，耐油耐温',
    rubberType: 'seal',
    tempLevel: 'temp6',
    system: 'engine',
    partName: '油箱隔离阀用密封圈',
    material: 'FKM',
    tempRange: {
      min: -40,
      max: 200,
      display: '-40~200℃'
    },
    performance: {
      highTemp: {
        aging: '250℃×70hr',
        hardnessChange: '±15',
        tensileChange: '-30 max',
        elongationChange: '-50 max',
        compression: '175℃×22h, 35max'
      },
      lowTemp: {
        brittleness: '-25℃',
        tr10: '-15℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-90 Shore A',
      tensileStrength: '≥15 MPa',
      elongation: '≥200%'
    },
    applications: ['燃油系统', '油箱密封', '高温油封'],
    suppliers: []
  },
  {
    id: 'rubber-engine-003',
    name: 'ACM中冷器进气管',
    category: 'rubber',
    description: '丙烯酸酯橡胶，耐热油性能好',
    rubberType: 'hose',
    tempLevel: 'temp5',
    system: 'engine',
    partName: '中冷器进气管',
    material: 'ACM',
    tempRange: {
      min: -40,
      max: 160,
      display: '-40~160℃'
    },
    performance: {
      highTemp: {
        aging: '175℃×504hr',
        hardnessChange: '-',
        tensileChange: '-30 max',
        elongationChange: '-30 max',
        compression: '150℃×70h, 40max'
      },
      lowTemp: {
        brittleness: '-30℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['中冷器管路', '进气系统', '涡轮管路'],
    suppliers: []
  },
  {
    id: 'rubber-engine-004',
    name: 'TPV空气滤清器进气软管',
    category: 'rubber',
    description: '热塑性硫化橡胶，加工性能优异',
    rubberType: 'hose',
    tempLevel: 'temp3',
    system: 'engine',
    partName: '空气滤清器进气软管（吹塑）、发动机进气波纹管（注吹）',
    material: 'TPV',
    tempRange: {
      min: -40,
      max: 120,
      display: '-40~120℃'
    },
    performance: {
      highTemp: {
        aging: '135℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '125℃×70h, 55max'
      },
      lowTemp: {
        brittleness: '-55℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥300%'
    },
    applications: ['空气滤清器', '进气管路', '波纹管'],
    suppliers: []
  },
  {
    id: 'rubber-engine-005',
    name: 'NBR中冷器出气管',
    category: 'rubber',
    description: '丁腈橡胶，耐油性能好',
    rubberType: 'hose',
    tempLevel: 'temp3',
    system: 'engine',
    partName: '中冷器出气管',
    material: 'NBR',
    tempRange: {
      min: -40,
      max: 120,
      display: '-40~120℃'
    },
    performance: {
      highTemp: {
        aging: '100℃×168hr, 120℃×70hr',
        hardnessChange: '0~+15',
        tensileChange: '-20 max',
        elongationChange: '-30/-40 max',
        compression: '100℃×22h, 50max'
      },
      lowTemp: {
        brittleness: '-35℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥15 MPa',
      elongation: '≥350%'
    },
    applications: ['中冷器管路', '燃油管', '油封'],
    suppliers: []
  },
  {
    id: 'rubber-engine-006',
    name: 'EPDM空气滤清器减震垫',
    category: 'rubber',
    description: '减震垫片，降低振动',
    rubberType: 'cushion',
    tempLevel: 'temp3',
    system: 'engine',
    partName: '空气滤清器减震垫、中冷管路减震垫、排气消声器吊耳',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 120,
      display: '-40~120℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-40 max',
        compression: '100℃×22h, 50max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['空滤减震', '管路减震', '排气吊耳'],
    suppliers: []
  },

  // ============ 座舱系统 ============
  {
    id: 'rubber-cabin-001',
    name: 'VMQ高压线束密封',
    category: 'rubber',
    description: '硅橡胶线束密封，耐高温绝缘',
    rubberType: 'seal',
    tempLevel: 'temp6',
    system: 'cabin',
    partName: '高压线束',
    material: 'VMQ',
    tempRange: {
      min: -40,
      max: 170,
      display: '-40~170℃'
    },
    performance: {
      highTemp: {
        aging: '225℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-25 max',
        elongationChange: '-30 max',
        compression: '175℃×22hr, ≤25'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥7 MPa',
      elongation: '≥400%'
    },
    applications: ['高压线束', '电气密封', '线束保护'],
    suppliers: []
  },
  {
    id: 'rubber-cabin-002',
    name: 'EPDM洗涤系统密封圈',
    category: 'rubber',
    description: '洗涤管路密封圈',
    rubberType: 'seal',
    tempLevel: 'temp3',
    system: 'cabin',
    partName: '洗涤系统密封圈',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 125,
      display: '-40~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-70 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['洗涤系统', '雨刮系统'],
    suppliers: []
  },
  {
    id: 'rubber-cabin-003',
    name: 'EPDM线束胶套',
    category: 'rubber',
    description: '过孔胶套、线束胶套',
    rubberType: 'boot',
    tempLevel: 'temp3',
    system: 'cabin',
    partName: '过孔胶套、线束胶套',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 125,
      display: '-40~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '100℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '55-70 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['线束过孔', '电缆保护', '密封胶套'],
    suppliers: []
  },
  {
    id: 'rubber-cabin-004',
    name: 'TPV杯垫尾门垫片',
    category: 'rubber',
    description: '软垫类装饰件',
    rubberType: 'cushion',
    tempLevel: 'temp2',
    system: 'cabin',
    partName: '杯垫、尾门垫片',
    material: 'TPV',
    tempRange: {
      min: -40,
      max: 90,
      display: '-40~90℃'
    },
    performance: {
      highTemp: {
        aging: '135℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '125℃×70h, 55max'
      },
      lowTemp: {
        brittleness: '-55℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥300%'
    },
    applications: ['杯托', '装饰垫片', '内饰软垫'],
    suppliers: []
  },

  // ============ 车身系统 ============
  {
    id: 'rubber-body-001',
    name: 'EPDM发动机装饰罩橡胶套',
    category: 'rubber',
    description: '发动机罩护罩类橡胶',
    rubberType: 'boot',
    tempLevel: 'temp4',
    system: 'body',
    partName: '发动机装饰罩橡胶套',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-30 max',
        elongationChange: '-50 max',
        compression: '125℃×70hr, 65max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-75 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['发动机罩', '装饰件', '护板'],
    suppliers: []
  },
  {
    id: 'rubber-body-002',
    name: 'TPV车门密封条',
    category: 'rubber',
    description: '前门B柱结角、后背门密封条',
    rubberType: 'weatherstrip',
    tempLevel: 'temp3',
    system: 'body',
    partName: '前门B柱结角、后背门密封条',
    material: 'TPV',
    tempRange: {
      min: -40,
      max: 90,
      display: '-40~90℃'
    },
    performance: {
      highTemp: {
        aging: '135℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '125℃×70h, 55max'
      },
      lowTemp: {
        brittleness: '-55℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '50-70 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥350%'
    },
    applications: ['车门密封', '车窗密封', '尾门密封'],
    suppliers: []
  },
  {
    id: 'rubber-body-003',
    name: 'EPDM门玻璃导槽密封胶',
    category: 'rubber',
    description: '车窗密封条',
    rubberType: 'weatherstrip',
    tempLevel: 'temp1',
    system: 'body',
    partName: '门玻璃导槽密封胶、门外水切密封胶',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 90,
      display: '-40~90℃'
    },
    performance: {
      highTemp: {
        aging: '70℃×70hr',
        hardnessChange: '0~+5',
        tensileChange: '±15',
        elongationChange: '≤25',
        compression: '70℃×70hr, ≤35/≤20'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '50-65 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥300%'
    },
    applications: ['车窗导槽', '水切密封', '玻璃密封'],
    suppliers: []
  },
  {
    id: 'rubber-body-004',
    name: 'TPV挡泥板软胶',
    category: 'rubber',
    description: '踏板总成缓冲垫、外后视镜防风密封垫等',
    rubberType: 'cushion',
    tempLevel: 'temp3',
    system: 'body',
    partName: '踏板总成缓冲垫、外后视镜防风密封垫、车门密封垫、挡泥板软胶',
    material: 'TPV',
    tempRange: {
      min: -40,
      max: 90,
      display: '-40~90℃'
    },
    performance: {
      highTemp: {
        aging: '135℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '125℃×70h, 55max'
      },
      lowTemp: {
        brittleness: '-55℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: false,
      water: true
    },
    properties: {
      hardness: '55-75 Shore A',
      tensileStrength: '≥8 MPa',
      elongation: '≥300%'
    },
    applications: ['挡泥板', '装饰软胶', '缓冲垫'],
    suppliers: []
  },

  // ============ 动力驱动系统 ============
  {
    id: 'rubber-power-001',
    name: 'VMQ充电线束密封圈',
    category: 'rubber',
    description: '交直流充电高压线束用密封圈',
    rubberType: 'seal',
    tempLevel: 'temp4',
    system: 'power',
    partName: '交直流充电高压线束用密封圈',
    material: 'VMQ',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×72hr',
        hardnessChange: '±8',
        tensileChange: '-15 max',
        elongationChange: '-20 max',
        compression: '150℃×168hr, ≤30'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-40℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-80 Shore A',
      tensileStrength: '≥7 MPa',
      elongation: '≥400%'
    },
    applications: ['充电接口', '高压线束', '电气密封'],
    suppliers: []
  },
  {
    id: 'rubber-power-002',
    name: 'EPDM电机冷却管',
    category: 'rubber',
    description: '电机用冷却管',
    rubberType: 'hose',
    tempLevel: 'temp4',
    system: 'power',
    partName: '电机用冷却管',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 150,
      display: '-40~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-75 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['电机冷却', '电驱散热', '热管理'],
    suppliers: []
  },
  {
    id: 'rubber-power-003',
    name: 'ACM电机油封',
    category: 'rubber',
    description: '电机用油封、差速器用油封',
    rubberType: 'seal',
    tempLevel: 'temp4',
    system: 'power',
    partName: '电机用油封、差速器用油封、驱动总成油封',
    material: 'ACM',
    tempRange: {
      min: -30,
      max: 150,
      display: '-30~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×70hr',
        hardnessChange: '±10',
        tensileChange: '-30 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-25℃',
        tr10: '-25℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-85 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥250%'
    },
    applications: ['电机油封', '减速器油封', '传动系统'],
    suppliers: []
  },
  {
    id: 'rubber-power-004',
    name: 'HNBR电驱密封圈',
    category: 'rubber',
    description: '前电驱水道密封圈、前电驱油道密封圈',
    rubberType: 'seal',
    tempLevel: 'temp4',
    system: 'power',
    partName: '前电驱水道密封圈、前电驱油道密封圈',
    material: 'HNBR',
    tempRange: {
      min: -30,
      max: 150,
      display: '-30~150℃'
    },
    performance: {
      highTemp: {
        aging: '150℃×96hr',
        hardnessChange: '0~+8',
        tensileChange: '≥16 MPa（拉伸强度）',
        elongationChange: '≥150%（断裂伸长率）',
        compression: '150℃×24h, 30max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '-35℃ max',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: true,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '70-90 Shore A',
      tensileStrength: '≥18 MPa',
      elongation: '≥250%'
    },
    applications: ['电驱系统', '冷却管路', '油路密封'],
    suppliers: []
  },
  {
    id: 'rubber-power-005',
    name: 'TPEE驱动轴防尘罩',
    category: 'rubber',
    description: '驱动轴移动端防尘罩',
    rubberType: 'boot',
    tempLevel: 'temp3',
    system: 'power',
    partName: '驱动轴移动端防尘罩',
    material: 'TPEE',
    tempRange: {
      min: -40,
      max: 120,
      display: '-40~120℃'
    },
    performance: {
      highTemp: {
        aging: '120℃×1000hr',
        hardnessChange: '-',
        tensileChange: '75min (保持率)',
        elongationChange: '75min (保持率)',
        compression: '-'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: true,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '40-60 Shore D',
      tensileStrength: '≥30 MPa',
      elongation: '≥500%'
    },
    applications: ['驱动轴护套', 'CV护套', '传动系统'],
    suppliers: []
  },
  {
    id: 'rubber-power-006',
    name: 'EPDM电驱干腔密封圈',
    category: 'rubber',
    description: '电驱干腔密封圈',
    rubberType: 'seal',
    tempLevel: 'temp3',
    system: 'power',
    partName: '电驱干腔密封圈',
    material: 'EPDM',
    tempRange: {
      min: -40,
      max: 125,
      display: '-40~125℃'
    },
    performance: {
      highTemp: {
        aging: '125℃×70hr',
        hardnessChange: '0~+10',
        tensileChange: '-20 max',
        elongationChange: '-30 max',
        compression: '125℃×70hr, 35max'
      },
      lowTemp: {
        brittleness: '-40℃',
        tr10: '✕',
        hardness: '✕'
      }
    },
    standards: [],
    chemicalResistance: {
      oil: false,
      fuel: false,
      coolant: true,
      water: true
    },
    properties: {
      hardness: '60-75 Shore A',
      tensileStrength: '≥10 MPa',
      elongation: '≥300%'
    },
    applications: ['电驱密封', '干腔密封'],
    suppliers: []
  }
];

// 导出统计信息
export const rubberMaterialsStats = {
  total: rubberMaterialsData.length,
  bySystem: {
    thermal: rubberMaterialsData.filter(m => m.system === 'thermal').length,
    chassis: rubberMaterialsData.filter(m => m.system === 'chassis').length,
    cabin: rubberMaterialsData.filter(m => m.system === 'cabin').length,
    engine: rubberMaterialsData.filter(m => m.system === 'engine').length,
    body: rubberMaterialsData.filter(m => m.system === 'body').length,
    power: rubberMaterialsData.filter(m => m.system === 'power').length
  },
  byTempLevel: {
    temp1: rubberMaterialsData.filter(m => m.tempLevel === 'temp1').length,
    temp2: rubberMaterialsData.filter(m => m.tempLevel === 'temp2').length,
    temp3: rubberMaterialsData.filter(m => m.tempLevel === 'temp3').length,
    temp4: rubberMaterialsData.filter(m => m.tempLevel === 'temp4').length,
    temp5: rubberMaterialsData.filter(m => m.tempLevel === 'temp5').length,
    temp6: rubberMaterialsData.filter(m => m.tempLevel === 'temp6').length
  },
  byRubberType: {
    bushing: rubberMaterialsData.filter(m => m.rubberType === 'bushing').length,
    mount: rubberMaterialsData.filter(m => m.rubberType === 'mount').length,
    hose: rubberMaterialsData.filter(m => m.rubberType === 'hose').length,
    boot: rubberMaterialsData.filter(m => m.rubberType === 'boot').length,
    seal: rubberMaterialsData.filter(m => m.rubberType === 'seal').length,
    weatherstrip: rubberMaterialsData.filter(m => m.rubberType === 'weatherstrip').length,
    cushion: rubberMaterialsData.filter(m => m.rubberType === 'cushion').length,
    other: rubberMaterialsData.filter(m => m.rubberType === 'other').length
  }
};
