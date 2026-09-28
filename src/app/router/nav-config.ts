export interface NavItem {
  key: string;
  label: string;
  to: string;
  icon?: string;
  description?: string;
  showInSidebar?: boolean;
}

export const primaryNavItems: NavItem[] = [
  {
    key: 'home',
    label: '首页',
    to: '/home',
    icon: 'home',
    description: '工作台首页',
    showInSidebar: true,
  },
  {
    key: 'apps',
    label: '应用中心',
    to: '/apps',
    icon: 'grid',
    description: '14个项目统一入口',
    showInSidebar: true,
  },
  {
    key: 'assistant',
    label: 'AI助手',
    to: '/assistant',
    icon: 'sparkles',
    description: '自然语言路由与汇总',
    showInSidebar: true,
  },
  {
    key: 'knowledge',
    label: '知识培训',
    to: '/knowledge',
    icon: 'book',
    description: '材料数据库、培训与指南',
    showInSidebar: true,
  },
  {
    key: 'projects',
    label: '项目管理',
    to: '/projects',
    icon: 'folder',
    description: '预算、方案、待办',
    showInSidebar: true,
  },
  {
    key: 'system-status',
    label: '系统状态',
    to: '/system-status',
    icon: 'activity',
    description: '项目可用状态与接入情况',
    showInSidebar: true,
  },
];
