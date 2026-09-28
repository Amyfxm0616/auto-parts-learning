import type { ResultRecord } from '../entities/result/types';

export const mockResults: ResultRecord[] = [
  {
    resultId: 'mock-weight-cost-001',
    capabilityId: 'weight_cost_analysis',
    appId: 'weight-cost-analysis',
    title: '门板骨架减重降本分析',
    summary:
      '发现 3 个潜在优化机会，建议优先验证 PP-EPDM-M10 替代方案，预计可实现 12% 降重和 8% 成本优化。',
    resultType: 'recommendation',
    tags: ['门板骨架', '内饰', '减重降本', '中风险'],
    createdAt: '2026-07-10 14:30',
    input: {
      part_name: '门板骨架',
      vehicle_system: '内饰',
      material_name: 'ABS',
      target_goal: '减重降本',
      analysis_depth: 'standard',
      performance_requirements: ['刚性', '耐热', '低气味'],
    },
    data: {
      opportunities: [
        {
          scheme: '方案A',
          currentMaterial: 'ABS',
          recommendedMaterial: 'PP-EPDM-M10',
          estimatedWeightChange: '-12%',
          estimatedCostChange: '-8%',
          riskLevel: '中',
          reason:
            '在满足目标性能边界的前提下，该方案存在较明显的质量与成本优势。',
        },
        {
          scheme: '方案B',
          currentMaterial: 'ABS',
          recommendedMaterial: 'PP-EPDM-TD20',
          estimatedWeightChange: '-7%',
          estimatedCostChange: '-4%',
          riskLevel: '低',
          reason: '替代风险相对较低，但减重收益不如方案A明显。',
        },
        {
          scheme: '方案C',
          currentMaterial: 'ABS',
          recommendedMaterial: 'TPO',
          estimatedWeightChange: '-5%',
          estimatedCostChange: '-6%',
          riskLevel: '中',
          reason: '具有一定成本优势，但需要重点验证尺寸稳定性。',
        },
      ],
      evidence: [
        '候选材料在相似零件中已有应用案例',
        '理论性能满足目标边界',
        '供应链具备进一步评估空间',
      ],
    },
    nextActions: [
      {
        label: '查看智能选材推荐',
        capabilityId: 'material_recommend',
        routePath: '/apps/material-recommend',
      },
      {
        label: '查询分供方信息',
        capabilityId: 'supplier_extract',
        routePath: '/apps/supplier-extract',
      },
      {
        label: '进入整车选材分析',
        capabilityId: 'vehicle_material_analysis',
        routePath: '/apps/vehicle-analysis',
      },
    ],
  },
  {
    resultId: 'mock-rubber-001',
    capabilityId: 'rubber_db_search',
    appId: 'rubber-db',
    title: 'EPDM 与 TPE 材料对比结果',
    summary:
      'EPDM 在耐候性、密封应用成熟度上更具优势；TPE 在加工便利性与部分轻量化场景中更具潜力。',
    resultType: 'table',
    tags: ['EPDM', 'TPE', '性能对比', '橡胶数据库'],
    createdAt: '2026-07-10 11:10',
    input: {
      material_name: 'EPDM',
      material_class: '橡胶',
      target_goal: '性能对比',
      analysis_depth: 'quick',
    },
    data: {
      compareTable: [
        { metric: '耐候性', epdm: '高', tpe: '中' },
        { metric: '加工便利性', epdm: '中', tpe: '高' },
        { metric: '密封系统成熟应用', epdm: '高', tpe: '中' },
        { metric: '轻量化潜力', epdm: '中', tpe: '中高' },
      ],
      conclusion:
        '如果面向传统密封系统和成熟应用优先，建议优先考虑 EPDM；如果更关注加工效率与某些柔性替代场景，可评估 TPE。',
    },
    nextActions: [
      {
        label: '进入智能选材工具',
        capabilityId: 'material_recommend',
        routePath: '/apps/material-recommend',
      },
      {
        label: '查看分供方提取',
        capabilityId: 'supplier_extract',
        routePath: '/apps/supplier-extract',
      },
    ],
  },
  {
    resultId: 'mock-material-001',
    capabilityId: 'material_recommend',
    appId: 'material-recommend',
    title: '门板骨架材料推荐结果',
    summary:
      '已识别 2 个可优先评估的候选方案，建议先比较 PP-EPDM-M10 与 PP-EPDM-TD20 的性能边界与风险差异。',
    resultType: 'recommendation',
    tags: ['选材推荐', '门板骨架', '材料推荐'],
    createdAt: '2026-07-10 15:10',
    input: {
      part_name: '门板骨架',
      vehicle_system: '内饰',
      target_goal: '选材',
      analysis_depth: 'standard',
      performance_requirements: ['刚性', '耐热', '低VOC'],
    },
    data: {
      candidates: [
        {
          rank: 1,
          material: 'PP-EPDM-M10',
          suitability: '高',
          risk: '中',
          note: '综合平衡较好，建议优先验证。',
        },
        {
          rank: 2,
          material: 'PP-EPDM-TD20',
          suitability: '中高',
          risk: '低',
          note: '替代路径稳健，但轻量化收益略弱。',
        },
      ],
    },
    nextActions: [
      {
        label: '分析减重降本机会',
        capabilityId: 'weight_cost_analysis',
        routePath: '/apps/weight-cost-analysis',
      },
      {
        label: '查询橡胶材料数据库',
        capabilityId: 'rubber_db_search',
        routePath: '/apps/rubber-db',
      },
    ],
  },
];
