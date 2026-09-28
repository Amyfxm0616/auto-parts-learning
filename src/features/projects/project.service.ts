import type { ProjectSummary } from '../../entities/project/types';

export interface ProjectFocusItem {
  id: string;
  title: string;
  subtitle: string;
  level: 'success' | 'warning' | 'danger' | 'info';
  levelLabel: string;
  to: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'done' | 'ongoing' | 'pending' | 'blocked';
  note?: string;
}

export interface ProjectDetailData {
  project: ProjectSummary & {
    description?: string;
    tags?: string[];
    relatedApps?: Array<{
      id: string;
      name: string;
      to: string;
    }>;
  };
  budget: {
    status: 'healthy' | 'warning' | 'risk';
    usedRatio: number;
    note: string;
  };
  todos: Array<{
    id: string;
    title: string;
    owner?: string;
    status: 'todo' | 'doing' | 'done';
  }>;
  milestones: ProjectMilestone[];
  relatedResults: Array<{
    id: string;
    title: string;
    subtitle: string;
    to: string;
  }>;
  nextActions: Array<{
    id: string;
    label: string;
    to: string;
  }>;
}

export interface ProjectsOverviewData {
  stats: {
    totalProjects: number;
    activeProjects: number;
    budgetWarningCount: number;
    openTodoCount: number;
  };
  projects: ProjectSummary[];
  focusItems: ProjectFocusItem[];
}

const mockProjects: ProjectSummary[] = [
  {
    projectId: 'project-a',
    projectName: 'A车型门板优化',
    status: 'active',
    owner: 'fuxiaomin',
    budgetWarning: true,
    todoCount: 5,
    riskCount: 2,
  },
  {
    projectId: 'project-b',
    projectName: '密封系统材料替代',
    status: 'active',
    owner: 'team-materials',
    budgetWarning: false,
    todoCount: 3,
    riskCount: 1,
  },
  {
    projectId: 'project-c',
    projectName: '前端框架减重验证',
    status: 'paused',
    owner: 'team-nvh',
    budgetWarning: false,
    todoCount: 2,
    riskCount: 1,
  },
];

const mockFocusItems: ProjectFocusItem[] = [
  {
    id: 'focus-1',
    title: 'A车型门板优化预算存在偏差',
    subtitle: '建议核对预算剩余与实际支出匹配关系',
    level: 'warning',
    levelLabel: '预算提醒',
    to: '/projects/project-a',
  },
  {
    id: 'focus-2',
    title: '密封系统方案待验证',
    subtitle: '当前还缺少供应商与风险验证结果',
    level: 'info',
    levelLabel: '待推进',
    to: '/projects/project-b',
  },
  {
    id: 'focus-3',
    title: '前端框架验证进度暂停',
    subtitle: '当前项目已暂停，建议确认后续优先级',
    level: 'danger',
    levelLabel: '状态异常',
    to: '/projects/project-c',
  },
];

const mockProjectDetails: Record<string, ProjectDetailData> = {
  'project-a': {
    project: {
      projectId: 'project-a',
      projectName: 'A车型门板优化',
      status: 'active',
      owner: 'fuxiaomin',
      budgetWarning: true,
      todoCount: 5,
      riskCount: 2,
      description:
        '围绕门板骨架相关零件开展选材优化、减重降本分析与验证推进。',
      tags: ['门板骨架', '内饰', '减重降本', '选材优化'],
      relatedApps: [
        { id: 'material-recommend', name: '智能选材工具', to: '/apps/material-recommend' },
        { id: 'weight-cost-analysis', name: '减重降本分析', to: '/apps/weight-cost-analysis' },
        { id: 'supplier-extract', name: '分供方提取', to: '/apps/supplier-extract' },
      ],
    },
    budget: {
      status: 'warning',
      usedRatio: 0.78,
      note: '预算剩余与当前支出节奏不完全匹配，建议核对本月预估。',
    },
    todos: [
      { id: 'todo-1', title: '确认 PP-EPDM-M10 替代边界', owner: 'fuxiaomin', status: 'doing' },
      { id: 'todo-2', title: '补充供应商可得性信息', owner: 'team-materials', status: 'todo' },
      { id: 'todo-3', title: '更新减重降本评估记录', owner: 'fuxiaomin', status: 'todo' },
    ],
    milestones: [
      { id: 'm1', title: '完成材料候选识别', status: 'done', note: '已输出 2 个优先候选方案' },
      { id: 'm2', title: '完成供应商与风险验证', status: 'ongoing', note: '正在补充清单与验证条件' },
      { id: 'm3', title: '形成项目结论与方案入库', status: 'pending' },
    ],
    relatedResults: [
      {
        id: 'mock-weight-cost-001',
        title: '门板骨架减重降本分析',
        subtitle: '已输出 3 个潜在优化机会点',
        to: '/results/mock-weight-cost-001',
      },
      {
        id: 'mock-material-001',
        title: '门板骨架材料推荐结果',
        subtitle: '已识别 2 个候选方案',
        to: '/results/mock-material-001',
      },
    ],
    nextActions: [
      { id: 'a1', label: '继续做减重降本分析', to: '/apps/weight-cost-analysis' },
      { id: 'a2', label: '查看材料推荐结果', to: '/results/mock-material-001' },
      { id: 'a3', label: '查询分供方信息', to: '/apps/supplier-extract' },
    ],
  },
  'project-b': {
    project: {
      projectId: 'project-b',
      projectName: '密封系统材料替代',
      status: 'active',
      owner: 'team-materials',
      budgetWarning: false,
      todoCount: 3,
      riskCount: 1,
      description: '针对密封系统场景做材料替代和性能边界验证。',
      tags: ['密封系统', 'EPDM', 'TPE', '替代验证'],
      relatedApps: [
        { id: 'rubber-db', name: '橡胶材料数据库', to: '/apps/rubber-db' },
        { id: 'material-recommend', name: '智能选材工具', to: '/apps/material-recommend' },
      ],
    },
    budget: {
      status: 'healthy',
      usedRatio: 0.42,
      note: '当前预算状态健康，仍有较大验证空间。',
    },
    todos: [
      { id: 'todo-4', title: '对比 EPDM 与 TPE 的边界条件', owner: 'team-materials', status: 'doing' },
      { id: 'todo-5', title: '更新替代验证记录', owner: 'team-materials', status: 'todo' },
    ],
    milestones: [
      { id: 'm4', title: '完成材料数据库初筛', status: 'done' },
      { id: 'm5', title: '完成验证方案定义', status: 'ongoing' },
    ],
    relatedResults: [
      {
        id: 'mock-rubber-001',
        title: 'EPDM 与 TPE 材料对比结果',
        subtitle: '已给出两种路线的初步结论',
        to: '/results/mock-rubber-001',
      },
    ],
    nextActions: [
      { id: 'b1', label: '查看橡胶数据库', to: '/apps/rubber-db' },
      { id: 'b2', label: '进入智能选材工具', to: '/apps/material-recommend' },
    ],
  },
  'project-c': {
    project: {
      projectId: 'project-c',
      projectName: '前端框架减重验证',
      status: 'paused',
      owner: 'team-nvh',
      budgetWarning: false,
      todoCount: 2,
      riskCount: 1,
      description: '围绕前端框架相关零件做验证任务，当前处于暂停状态。',
      tags: ['前端框架', '验证暂停'],
      relatedApps: [
        { id: 'vehicle-analysis', name: '整车选材分析', to: '/apps/vehicle-analysis' },
      ],
    },
    budget: {
      status: 'healthy',
      usedRatio: 0.25,
      note: '预算当前无明显风险，但项目已暂停。',
    },
    todos: [
      { id: 'todo-6', title: '确认后续优先级', owner: 'team-nvh', status: 'todo' },
    ],
    milestones: [
      { id: 'm6', title: '完成需求收敛', status: 'done' },
      { id: 'm7', title: '重新启动验证计划', status: 'blocked', note: '等待优先级确认' },
    ],
    relatedResults: [],
    nextActions: [{ id: 'c1', label: '返回项目列表', to: '/projects' }],
  },
};

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectService = {
  async getOverview(): Promise<ProjectsOverviewData> {
    await delay();

    const totalProjects = mockProjects.length;
    const activeProjects = mockProjects.filter(
      (item) => item.status === 'active'
    ).length;
    const budgetWarningCount = mockProjects.filter(
      (item) => item.budgetWarning
    ).length;
    const openTodoCount = mockProjects.reduce(
      (sum, item) => sum + (item.todoCount ?? 0),
      0
    );

    return {
      stats: {
        totalProjects,
        activeProjects,
        budgetWarningCount,
        openTodoCount,
      },
      projects: mockProjects,
      focusItems: mockFocusItems,
    };
  },

  async getProjectDetail(projectId: string): Promise<ProjectDetailData | null> {
    await delay(140);
    return mockProjectDetails[projectId] ?? null;
  },
};
