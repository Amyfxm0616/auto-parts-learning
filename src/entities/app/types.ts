import type {
  AppStatus,
  Category,
  EntryType,
  Id,
  PriorityLevel,
  RiskLevel,
} from '../common/types';

export interface AppManifest {
  appId: Id;
  projectId: Id;
  name: string;
  shortName: string;
  category: Category;
  description: string;

  entryType: EntryType;
  routePath: string;
  externalUrl?: string;
  icon?: string;

  status: AppStatus;
  riskLevel: RiskLevel;
  priority: PriorityLevel;

  tags?: string[];
  owner?: string;

  supportsQueryParams?: boolean;
  supportedParams?: string[];

  visibleInCatalog?: boolean;
  visibleOnHome?: boolean;
}
