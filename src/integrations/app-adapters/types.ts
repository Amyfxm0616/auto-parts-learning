import type { AppManifest } from '../../entities/app/types';

export interface AppLaunchContext {
  app: AppManifest;
  search: string;
}

export interface AppAdapter {
  appId: string;
  buildTargetUrl: (context: AppLaunchContext) => string;
}
