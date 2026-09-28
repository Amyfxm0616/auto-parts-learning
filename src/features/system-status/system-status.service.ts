import type { AppManifest } from '../../entities/app/types';
import { appManifests } from '../../integrations/registry/app-manifests';
import { capabilityRegistry } from '../../integrations/registry/capability-registry';

export interface SystemStatusRow extends AppManifest {
  capabilityCount: number;
}

export interface SystemStatusOverviewData {
  stats: {
    totalApps: number;
    activeApps: number;
    visibleOnHomeApps: number;
    totalCapabilities: number;
  };
  rows: SystemStatusRow[];
}

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

export const systemStatusService = {
  async getOverview(): Promise<SystemStatusOverviewData> {
    await delay();

    const rows: SystemStatusRow[] = appManifests.map((app) => ({
      ...app,
      capabilityCount: capabilityRegistry.filter(
        (item) => item.appId === app.appId
      ).length,
    }));

    return {
      stats: {
        totalApps: appManifests.length,
        activeApps: appManifests.filter((item) =>
          ['active', 'available'].includes(item.status)
        ).length,
        visibleOnHomeApps: appManifests.filter((item) => item.visibleOnHome)
          .length,
        totalCapabilities: capabilityRegistry.length,
      },
      rows,
    };
  },
};
