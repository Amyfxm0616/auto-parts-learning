import { useLocation, matchPath } from 'react-router-dom';

export interface CurrentRouteMeta {
  title: string;
  group: string;
  requiresRightRail: boolean;
  requiresProjectContext: boolean;
}

const routeMetaTable = [
  { pattern: '/', title: '首页', group: 'home', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/home', title: '首页', group: 'home', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/apps', title: '应用中心', group: 'apps', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/apps/:appId', title: '系统接入页', group: 'apps', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/apps/:appId/meta', title: '应用说明', group: 'apps', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/assistant', title: 'AI助手', group: 'assistant', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/assistant/new', title: 'AI助手', group: 'assistant', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/assistant/:sessionId', title: 'AI助手会话', group: 'assistant', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/results/:resultId', title: '结果详情', group: 'results', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/knowledge', title: '知识培训', group: 'knowledge', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/projects', title: '项目管理', group: 'projects', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/projects/:projectId', title: '项目详情', group: 'projects', requiresRightRail: true, requiresProjectContext: true },
  { pattern: '/system-status', title: '系统状态', group: 'system-status', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/recent', title: '最近工作', group: 'recent', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/favorites', title: '收藏', group: 'favorites', requiresRightRail: true, requiresProjectContext: false },
  { pattern: '/settings', title: '设置', group: 'settings', requiresRightRail: true, requiresProjectContext: false },
];

export function useCurrentRouteMeta(): CurrentRouteMeta {
  const location = useLocation();

  const matched = routeMetaTable.find((item) =>
    matchPath({ path: item.pattern, end: true }, location.pathname)
  );

  if (!matched) {
    return {
      title: '工作台',
      group: 'unknown',
      requiresRightRail: true,
      requiresProjectContext: false,
    };
  }

  return matched;
}
