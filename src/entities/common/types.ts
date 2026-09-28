export type Id = string;

export type RiskLevel = 'R1' | 'R2' | 'R3' | 'R4';
export type PriorityLevel = 'P0' | 'P1' | 'P2';
export type EntryType = 'embed' | 'redirect' | 'native';
export type AppStatus =
  | 'active'
  | 'available'
  | 'pilot'
  | 'demo'
  | 'inactive'
  | 'unknown'
  | 'paused';

export type Category =
  | '学习培训'
  | '选材推荐'
  | '分析仿真'
  | '数据采集'
  | '业务管理'
  | '前瞻洞察'
  | '知识库';

export type UserRole =
  | 'engineer'
  | 'dre'
  | 'project-manager'
  | 'newbie'
  | 'analyst'
  | 'admin';
