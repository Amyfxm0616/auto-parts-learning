import type { AppManifest } from '../../entities/app/types';
import type { CapabilityDefinition } from '../../entities/capability/types';
import { http } from '../../integrations/api/http';

export interface AppCatalogQuery {
  keyword?: string;
  category?: string;
  visibleOnHome?: boolean;
  status?: AppManifest['status'];
  limit?: number;
}

export interface AppDetailData {
  app: AppManifest;
  relatedCapabilities: CapabilityDefinition[];
}

export const appCatalogService = {
  async listApps(query: AppCatalogQuery = {}): Promise<AppManifest[]> {
    return http.get<AppManifest[]>('/api/apps', {
      query: query as Record<string, unknown>,
    });
  },

  async getAppById(appId: string): Promise<AppManifest | null> {
    return http.get<AppManifest | null>(`/api/apps/${appId}`);
  },

  async listCategories(): Promise<string[]> {
    return http.get<string[]>('/api/apps/categories');
  },

  async listHomeApps(limit = 5): Promise<AppManifest[]> {
    return this.listApps({
      visibleOnHome: true,
      limit,
    });
  },

  async getHomeStats() {
    const apps = await this.listApps();
    const totalApps = apps.length;
    const activeApps = apps.filter((item) =>
      ['active', 'available'].includes(item.status)
    ).length;
    const homeApps = apps.filter((item) => item.visibleOnHome).length;

    return {
      totalApps,
      activeApps,
      homeApps,
    };
  },

  async getCapabilitiesByAppId(
    appId: string
  ): Promise<CapabilityDefinition[]> {
    return http.get<CapabilityDefinition[]>(`/api/apps/${appId}/capabilities`);
  },

  async getAppDetail(appId: string): Promise<AppDetailData | null> {
    const app = await this.getAppById(appId);

    if (!app) return null;

    const relatedCapabilities = await this.getCapabilitiesByAppId(appId);

    return {
      app,
      relatedCapabilities,
    };
  },
};
