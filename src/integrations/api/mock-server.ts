import type { AssistantRouteRequest, AssistantExecutionPlan } from '../../entities/assistant/types';
import type { AppManifest } from '../../entities/app/types';
import type { CapabilityDefinition } from '../../entities/capability/types';
import type { ResultRecord } from '../../entities/result/types';
import { appManifests } from '../registry/app-manifests';
import { capabilityRegistry } from '../registry/capability-registry';
import { mockResults } from '../../mocks/results.mock';
import {
  recentVisits,
  recentAnalyses,
  hotKnowledgeItems,
  reminderItems,
} from '../../mocks/home.mock';
import type { MockRouteRequestInput } from './mock-server.types';

const delay = (ms = 240) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const priorityOrder: Record<string, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
};

function normalizeText(value?: string) {
  return (value ?? '').trim().toLowerCase();
}

function sortApps(list: AppManifest[]) {
  return [...list].sort((a, b) => {
    const priorityA = priorityOrder[a.priority] ?? 99;
    const priorityB = priorityOrder[b.priority] ?? 99;

    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.name.localeCompare(b.name, 'zh-CN');
  });
}

function matchesKeyword(app: AppManifest, keyword?: string) {
  const q = normalizeText(keyword);
  if (!q) return true;

  const searchable = [
    app.name,
    app.shortName,
    app.description,
    app.category,
    ...(app.tags ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return searchable.includes(q);
}

function matchesResultKeyword(result: ResultRecord, keyword?: string) {
  const q = normalizeText(keyword);
  if (!q) return true;

  const searchable = [result.title, result.summary, ...(result.tags ?? [])]
    .join(' ')
    .toLowerCase();

  return searchable.includes(q);
}

function buildHomeOverview() {
  const totalApps = appManifests.length;
  const activeApps = appManifests.filter((item) =>
    ['active', 'available'].includes(item.status)
  ).length;
  const homeApps = appManifests.filter((item) => item.visibleOnHome).length;

  const coreApps = sortApps(
    appManifests.filter((item) => item.visibleOnHome)
  ).slice(0, 5);

  return {
    coreApps,
    stats: {
      totalApps,
      activeApps,
      homeApps,
    },
    recentVisits: recentVisits.slice(0, 3),
    recentAnalyses: recentAnalyses.slice(0, 3),
    hotKnowledgeItems: hotKnowledgeItems.slice(0, 3),
    reminderItems: reminderItems.slice(0, 3),
  };
}

const KNOWN_PARTS = [
  '门板骨架',
  '密封条',
  '保险杠',
  '扰流板',
  '前端框架',
  '门板',
  '副仪表板',
];

const KNOWN_SYSTEMS = [
  '内饰',
  '车身',
  '底盘',
  '热管理',
  '动力驱动',
  '自动驾驶',
  'HMI',
  '座椅',
  '增程',
];

const KNOWN_MATERIALS = [
  'EPDM',
  'TPE',
  'ABS',
  'TPO',
  'PP',
  'PP-EPDM-M10',
  'PP-EPDM-TD20',
];

function includesAny(text: string, keywords: string[]) {
  return keywords.some((item) => text.includes(item));
}

function extractKnownValue(text: string, candidates: string[]) {
  return candidates.find((item) => text.includes(item));
}

function extractParamsFromMessage(message: string) {
  const params: Record<string, any> = {};

  const partName = extractKnownValue(message, KNOWN_PARTS);
  const systemName = extractKnownValue(message, KNOWN_SYSTEMS);
  const materialName = extractKnownValue(message, KNOWN_MATERIALS);

  if (partName) params.part_name = partName;
  if (systemName) params.vehicle_system = systemName;
  if (materialName) params.material_name = materialName;

  if (message.includes('减重') || message.includes('降本')) {
    params.target_goal = '减重降本';
  } else if (message.includes('选材') || message.includes('推荐材料')) {
    params.target_goal = '选材';
  } else if (message.includes('供应商') || message.includes('分供方')) {
    params.target_goal = '供应商提取';
  } else if (message.includes('对比') || message.includes('性能')) {
    params.target_goal = '性能对比';
  } else {
    params.target_goal = '知识查询';
  }

  if (message.includes('快速')) {
    params.analysis_depth = 'quick';
  } else if (message.includes('深入') || message.includes('详细')) {
    params.analysis_depth = 'deep';
  } else {
    params.analysis_depth = 'standard';
  }

  const perfRequirements: string[] = [];
  if (message.includes('刚性')) perfRequirements.push('刚性');
  if (message.includes('耐热')) perfRequirements.push('耐热');
  if (message.includes('低VOC') || message.includes('低气味'))
    perfRequirements.push('低VOC');
  if (message.includes('阻燃')) perfRequirements.push('阻燃');

  if (perfRequirements.length) {
    params.performance_requirements = perfRequirements;
  }

  return params;
}

function determineIntent(message: string) {
  if (includesAny(message, ['减重', '降本', '优化机会'])) {
    return '减重降本分析';
  }

  if (includesAny(message, ['选材', '推荐材料', '推荐牌号'])) {
    return '智能选材推荐';
  }

  if (includesAny(message, ['供应商', '分供方', '清单提取'])) {
    return '供应链提取';
  }

  if (includesAny(message, ['橡胶', 'EPDM', 'TPE', '性能对比'])) {
    return '材料知识查询';
  }

  if (includesAny(message, ['整车', '系统分析', '零件分析'])) {
    return '整车选材分析';
  }

  return '知识查询';
}

function pickCapabilities(intent: string, params: Record<string, any>): string[] {
  switch (intent) {
    case '减重降本分析':
      return ['weight_cost_analysis', 'material_recommend', 'supplier_extract'];
    case '智能选材推荐':
      return ['material_recommend', 'vehicle_material_analysis', 'rubber_db_search'];
    case '供应链提取':
      return ['supplier_extract', 'material_recommend'];
    case '材料知识查询':
      return ['rubber_db_search', 'material_recommend'];
    case '整车选材分析':
      return ['vehicle_material_analysis', 'material_recommend'];
    default:
      if (params.material_name) return ['rubber_db_search'];
      return ['material_recommend'];
  }
}

function buildSummary(intent: string) {
  switch (intent) {
    case '减重降本分析':
      return '识别到你想分析零部件的减重降本机会，建议先进入减重降本分析能力，再按需要联动选材和供应商能力。';
    case '智能选材推荐':
      return '识别到你想进行选材推荐，建议先进入智能选材工具，再联动数据库或整车分析进行补充判断。';
    case '供应链提取':
      return '识别到你想提取分供方或供应商相关信息，建议先进入分供方提取能力。';
    case '材料知识查询':
      return '识别到你更像是在查资料或做材料对比，建议先使用数据库查询能力。';
    case '整车选材分析':
      return '识别到你希望从整车或系统视角分析零部件用材，建议先进入整车选材分析系统。';
    default:
      return '识别到你需要一个起点，建议先从选材或知识查询能力开始。';
  }
}

function buildClarificationQuestion(intent: string, params: Record<string, any>) {
  if (
    ['减重降本分析', '智能选材推荐', '整车选材分析'].includes(intent) &&
    !params.part_name
  ) {
    return '请补充你要分析的零件名称，例如：门板骨架、密封条、保险杠。';
  }

  if (intent === '材料知识查询' && !params.material_name) {
    return '请补充材料名称，例如：EPDM、TPE、ABS。';
  }

  return undefined;
}

const mockAssistantSessions = {
  'session-demo-001': {
    sessionId: 'session-demo-001',
    title: '门板骨架选材与减重分析',
    status: 'active',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: '帮我推荐门板骨架材料，并分析有没有减重降本机会',
        createdAt: '2026-07-10 14:00',
      },
      {
        id: 'm2',
        role: 'assistant',
        content:
          '识别到你想同时做选材推荐和减重降本分析，建议先进入减重降本分析，再联动智能选材工具。',
        createdAt: '2026-07-10 14:00',
      },
      {
        id: 'm3',
        role: 'assistant',
        content:
          '已识别参数：零件=门板骨架，系统=内饰，目标=减重降本。',
        createdAt: '2026-07-10 14:01',
      },
    ],
    suggestedActions: [
      { id: 'sa1', label: '继续进入减重降本分析', to: '/apps/weight-cost-analysis' },
      { id: 'sa2', label: '查看选材推荐', to: '/apps/material-recommend' },
      { id: 'sa3', label: '查询分供方', to: '/apps/supplier-extract' },
    ],
  },
};

function buildAssistantExecutionPlan(
  request: AssistantRouteRequest
): AssistantExecutionPlan {
  const message = request.message.trim();
  const extractedParams = extractParamsFromMessage(message);
  const intent = determineIntent(message);
  const selectedCapabilities = pickCapabilities(intent, extractedParams);
  const clarificationQuestion = buildClarificationQuestion(
    intent,
    extractedParams
  );

  const route = {
    intent,
    confidence: clarificationQuestion ? 0.72 : 0.9,
    selectedCapabilities,
    extractedParams,
    needsClarification: !!clarificationQuestion,
    clarificationQuestion,
    summary: buildSummary(intent),
  };

  const capabilities: CapabilityDefinition[] = capabilityRegistry.filter((item) =>
    selectedCapabilities.includes(item.capabilityId)
  );

  return {
    route,
    capabilities,
  };
}

export async function mockHttpRequest<T>({
  method,
  path,
  query,
  body,
}: MockRouteRequestInput): Promise<T> {
  await delay();

  if (method === 'GET' && path === '/api/apps/categories') {
    const categories = Array.from(
      new Set(appManifests.map((item) => item.category))
    ).sort((a, b) => a.localeCompare(b, 'zh-CN'));

    return ['全部', ...categories] as T;
  }

  if (method === 'GET' && path === '/api/apps') {
    let result = [...appManifests];

    const keyword = String(query?.keyword ?? '');
    const category = String(query?.category ?? '');
    const visibleOnHome = query?.visibleOnHome;
    const status = String(query?.status ?? '');
    const limit = query?.limit ? Number(query.limit) : undefined;

    if (category && category !== '全部') {
      result = result.filter((item) => item.category === category);
    }

    if (visibleOnHome !== undefined) {
      const boolVisible = visibleOnHome === true || visibleOnHome === 'true';
      result = result.filter((item) => !!item.visibleOnHome === boolVisible);
    }

    if (status) {
      result = result.filter((item) => item.status === status);
    }

    result = result.filter((item) => matchesKeyword(item, keyword));
    result = sortApps(result);

    if (limit) {
      result = result.slice(0, limit);
    }

    return result as T;
  }

  if (method === 'GET' && path.startsWith('/api/apps/') && !path.endsWith('/capabilities')) {
    const appId = path.replace('/api/apps/', '');
    const app = appManifests.find((item) => item.appId === appId) ?? null;
    return app as T;
  }

  if (method === 'GET' && path.startsWith('/api/apps/') && path.endsWith('/capabilities')) {
    const appId = path.replace('/api/apps/', '').replace('/capabilities', '');
    const capabilities = capabilityRegistry.filter((item) => item.appId === appId);
    return capabilities as T;
  }

  if (method === 'GET' && path === '/api/home/overview') {
    return buildHomeOverview() as T;
  }

  if (method === 'POST' && path === '/api/assistant/route') {
    const request = body as AssistantRouteRequest;

    if (!request?.message?.trim()) {
      throw new Error('消息不能为空');
    }

    if (request.message.includes('报错测试')) {
      throw new Error('模拟异常：助手路由服务暂不可用');
    }

    return buildAssistantExecutionPlan(request) as T;
  }

  if (method === 'GET' && path.startsWith('/api/assistant/sessions/')) {
    const sessionId = path.replace('/api/assistant/sessions/', '');
    return (mockAssistantSessions as any)[sessionId] ?? null;
  }

  if (method === 'GET' && path === '/api/results') {
    let result = [...mockResults];

    const capabilityId = String(query?.capabilityId ?? '');
    const appId = String(query?.appId ?? '');
    const keyword = String(query?.keyword ?? '');
    const limit = query?.limit ? Number(query.limit) : undefined;

    if (capabilityId) {
      result = result.filter((item) => item.capabilityId === capabilityId);
    }

    if (appId) {
      result = result.filter((item) => item.appId === appId);
    }

    result = result.filter((item) => matchesResultKeyword(item, keyword));
    result = [...result].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt, 'zh-CN')
    );

    if (limit) {
      result = result.slice(0, limit);
    }

    return result as T;
  }

  if (method === 'GET' && path.startsWith('/api/results/')) {
    const resultId = path.replace('/api/results/', '');
    const result = mockResults.find((item) => item.resultId === resultId) ?? null;
    return result as T;
  }

  throw new Error(`未实现的 Mock API：${method} ${path}`);
}
