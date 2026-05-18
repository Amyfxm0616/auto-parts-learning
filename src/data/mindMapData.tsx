import { Box, Settings, Layers, Wrench } from 'lucide-react';

export const iconMap = {
  box: Box,
  settings: Settings,
  layers: Layers,
  wrench: Wrench,
};

export type IconType = keyof typeof iconMap;

export interface MindMapNode {
  id: string;
  name: string;
  nameEn?: string;
  materials?: string[];
  level: number;
  children?: MindMapNode[];
  icon?: IconType;
}

// Center Console Assembly (副仪表板总成) - Based on Word document
export const centerConsoleAssemblyData: MindMapNode = {
  id: 'center-console-root',
  name: '副仪表板总成',
  nameEn: 'Center Console Assembly',
  level: 1,
  icon: 'box',
  children: [
    {
      id: 'console-body',
      name: '中控台本体',
      nameEn: 'Console Main Body',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PP-T20'],
      children: [
        {
          id: 'console-frame',
          name: '中控台骨架',
          nameEn: 'Console Frame',
          level: 3,
          icon: 'wrench',
          materials: ['ABS', 'PC/ABS'],
          children: [
            {
              id: 'console-frame-x01',
              name: 'X01车型骨架',
              nameEn: 'X01 Frame',
              level: 4,
              icon: 'settings',
              materials: ['PC/ABS'],
            },
            {
              id: 'console-frame-w01',
              name: 'W01车型骨架',
              nameEn: 'W01 Frame',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'console-upper-cover',
          name: '中控台上盖板',
          nameEn: 'Console Upper Cover',
          level: 3,
          icon: 'wrench',
          materials: ['ABS', 'ASF'],
          children: [
            {
              id: 'console-upper-cover-x01',
              name: 'X01车型上盖板',
              nameEn: 'X01 Upper Cover',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'console-upper-cover-w01',
              name: 'W01车型上盖板',
              nameEn: 'W01 Upper Cover',
              level: 4,
              icon: 'settings',
              materials: ['ASF'],
            },
          ],
        },
      ],
    },
    {
      id: 'center-armrest',
      name: '中央扶手箱',
      nameEn: 'Center Armrest Box',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PP-EPDM-TD20'],
      children: [
        {
          id: 'armrest-box-body',
          name: '扶手箱本体',
          nameEn: 'Armrest Box Body',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
          children: [
            {
              id: 'armrest-box-x01',
              name: 'X01车型扶手箱',
              nameEn: 'X01 Armrest Box',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'armrest-box-w01',
              name: 'W01车型扶手箱',
              nameEn: 'W01 Armrest Box',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'armrest-pad',
          name: '扶手垫',
          nameEn: 'Armrest Pad',
          level: 3,
          icon: 'wrench',
          materials: ['PP-EPDM-TD20'],
          children: [
            {
              id: 'armrest-pad-x01',
              name: 'X01车型扶手垫',
              nameEn: 'X01 Armrest Pad',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-TD20'],
            },
            {
              id: 'armrest-pad-w01',
              name: 'W01车型扶手垫',
              nameEn: 'W01 Armrest Pad',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-M10'],
            },
          ],
        },
      ],
    },
    {
      id: 'console-panels',
      name: '侧围饰板',
      nameEn: 'Side Trim Panels',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PC/ABS'],
      children: [
        {
          id: 'left-trim-panel',
          name: '左侧饰板',
          nameEn: 'Left Trim Panel',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
          children: [
            {
              id: 'left-trim-x01',
              name: 'X01车型左侧饰板',
              nameEn: 'X01 Left Trim',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'left-trim-w01',
              name: 'W01车型左侧饰板',
              nameEn: 'W01 Left Trim',
              level: 4,
              icon: 'settings',
              materials: ['PC/ABS'],
            },
          ],
        },
        {
          id: 'right-trim-panel',
          name: '右侧饰板',
          nameEn: 'Right Trim Panel',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
          children: [
            {
              id: 'right-trim-x01',
              name: 'X01车型右侧饰板',
              nameEn: 'X01 Right Trim',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'right-trim-w01',
              name: 'W01车型右侧饰板',
              nameEn: 'W01 Right Trim',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
      ],
    },
    {
      id: 'console-storage',
      name: '储物盒',
      nameEn: 'Storage Box',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PP-T20'],
      children: [
        {
          id: 'front-storage',
          name: '前排储物盒',
          nameEn: 'Front Storage Box',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
        },
        {
          id: 'rear-storage',
          name: '后排储物盒',
          nameEn: 'Rear Storage Box',
          level: 3,
          icon: 'wrench',
          materials: ['PP-T20'],
        },
      ],
    },
    {
      id: 'console-accessories',
      name: '附件部件',
      nameEn: 'Accessories',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PC'],
      children: [
        {
          id: 'cup-holder',
          name: '杯托',
          nameEn: 'Cup Holder',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
        },
        {
          id: 'phone-holder',
          name: '手机支架',
          nameEn: 'Phone Holder',
          level: 3,
          icon: 'wrench',
          materials: ['PC'],
        },
        {
          id: 'ashtray',
          name: '烟灰缸',
          nameEn: 'Ashtray',
          level: 3,
          icon: 'wrench',
          materials: ['ABS'],
        },
      ],
    },
  ],
};

// Door Panel Assembly (门板总成) - Based on Word document
export const doorPanelAssemblyData: MindMapNode = {
  id: 'door-panel-root',
  name: '门板总成',
  nameEn: 'Door Panel Assembly',
  level: 1,
  icon: 'box',
  children: [
    {
      id: 'trim-panel',
      name: '饰板骨架',
      nameEn: 'Trim Panel Frame',
      level: 2,
      icon: 'layers',
      materials: ['PC/ABS', 'ABS H3', 'PP-EPDM-TD20', 'PP-EPDM-M10'],
      children: [
        {
          id: 'upper-trim-panel',
          name: '上饰板骨架',
          nameEn: 'Upper Trim Panel Frame',
          level: 3,
          icon: 'wrench',
          materials: ['PC/ABS', 'ABS H3'],
          children: [
            {
              id: 'upper-trim-x01',
              name: 'X01车型上饰板骨架',
              nameEn: 'X01 Upper Trim Frame',
              level: 4,
              icon: 'settings',
              materials: ['PC/ABS'],
            },
            {
              id: 'upper-trim-w01',
              name: 'W01车型上饰板骨架',
              nameEn: 'W01 Upper Trim Frame',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'middle-trim-panel',
          name: '中饰板骨架',
          nameEn: 'Middle Trim Panel Frame',
          level: 3,
          icon: 'wrench',
          materials: ['ABS', 'ABS H3'],
          children: [
            {
              id: 'middle-trim-x01',
              name: 'X01车型中饰板骨架',
              nameEn: 'X01 Middle Trim Frame',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'middle-trim-w01',
              name: 'W01车型中饰板骨架',
              nameEn: 'W01 Middle Trim Frame',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'skirt-panel',
          name: '裙板本体',
          nameEn: 'Skirt Panel Body',
          level: 3,
          icon: 'wrench',
          materials: ['PP-EPDM-TD20', 'PP-EPDM-M10'],
          children: [
            {
              id: 'skirt-x01',
              name: 'X01车型裙板本体',
              nameEn: 'X01 Skirt Panel',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-TD20'],
            },
            {
              id: 'skirt-w01',
              name: 'W01车型裙板本体',
              nameEn: 'W01 Skirt Panel',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-M10'],
            },
          ],
        },
        {
          id: 'map-pocket',
          name: '地图袋',
          nameEn: 'Map Pocket',
          level: 3,
          icon: 'wrench',
          materials: ['PP-EPDM-M10'],
          children: [
            {
              id: 'map-pocket-w01',
              name: 'W01车型地图袋',
              nameEn: 'W01 Map Pocket',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-M10'],
            },
          ],
        },
      ],
    },
    {
      id: 'armrest-assembly',
      name: '扶手总成',
      nameEn: 'Armrest Assembly',
      level: 2,
      icon: 'layers',
      materials: ['ABS', 'PC/ABS', 'PP-EPDM-TD20', 'ABS H3'],
      children: [
        {
          id: 'front-door-handle-box',
          name: '左前门拉手盒骨架',
          nameEn: 'Front Left Door Handle Box Frame',
          level: 3,
          icon: 'wrench',
          materials: ['ABS', 'PC/ABS'],
          children: [
            {
              id: 'handle-box-x01',
              name: 'X01车型拉手盒骨架',
              nameEn: 'X01 Handle Box Frame',
              level: 4,
              icon: 'settings',
              materials: ['ABS'],
            },
            {
              id: 'handle-box-w01',
              name: 'W01车型拉手盒骨架',
              nameEn: 'W01 Handle Box Frame',
              level: 4,
              icon: 'settings',
              materials: ['PC/ABS'],
            },
          ],
        },
        {
          id: 'handle-body',
          name: '拉手本体',
          nameEn: 'Handle Body',
          level: 3,
          icon: 'wrench',
          materials: ['PP-EPDM-TD20', 'ABS H3'],
          children: [
            {
              id: 'handle-x01',
              name: 'X01车型拉手本体',
              nameEn: 'X01 Handle Body',
              level: 4,
              icon: 'settings',
              materials: ['PP-EPDM-TD20'],
            },
            {
              id: 'handle-w01',
              name: 'W01车型拉手本体',
              nameEn: 'W01 Handle Body',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'armrest-trim',
          name: '扶手饰板本体',
          nameEn: 'Armrest Trim Body',
          level: 3,
          icon: 'wrench',
          materials: ['ABS H3'],
          children: [
            {
              id: 'armrest-trim-x01',
              name: 'X01车型扶手饰板本色',
              nameEn: 'X01 Armrest Trim',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
            {
              id: 'armrest-trim-w01',
              name: 'W01车型扶手饰板本色',
              nameEn: 'W01 Armrest Trim',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
        {
          id: 'headrest-body',
          name: '靠枕本体',
          nameEn: 'Headrest Body',
          level: 3,
          icon: 'wrench',
          materials: ['ABS H3'],
          children: [
            {
              id: 'headrest-x01',
              name: 'X01车型靠枕本体',
              nameEn: 'X01 Headrest Body',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
            {
              id: 'headrest-w01',
              name: 'W01车型靠枕本体',
              nameEn: 'W01 Headrest Body',
              level: 4,
              icon: 'settings',
              materials: ['ABS H3'],
            },
          ],
        },
      ],
    },
  ],
};

// Exterior Trim Assembly (外饰总成) - Based on Word document
export const exteriorAssemblyData: MindMapNode = {
  id: 'exterior-root',
  name: '外饰总成',
  nameEn: 'Exterior Trim Assembly',
  level: 1,
  icon: 'box',
  children: [
    {
      id: 'grille',
      name: '格栅',
      nameEn: 'Grille',
      level: 2,
      icon: 'layers',
      materials: ['PC/ABS', 'ASA'],
    },
    {
      id: 'bumper',
      name: '保险杠',
      nameEn: 'Bumper',
      level: 2,
      icon: 'layers',
      materials: ['TPO', 'PP-EPDM-TD20'],
    },
    {
      id: 'front-end-module',
      name: '前端框架',
      nameEn: 'Front End Module',
      level: 2,
      icon: 'layers',
      materials: ['PP-GF40', 'PBT-GF30', 'PA66-GF35'],
    },
    {
      id: 'spoiler',
      name: '扰流板',
      nameEn: 'Spoiler',
      level: 2,
      icon: 'layers',
      materials: ['PC/ABS', 'ASA'],
    },
    {
      id: 'ags',
      name: 'AGS（主动进气格栅）',
      nameEn: 'Active Grille Shutter',
      level: 2,
      icon: 'layers',
      materials: ['PP-GF30', 'POM', 'PP'],
    },
  ],
};

// All assemblies mapping
export const assemblyMap: Record<string, MindMapNode> = {
  'center-console': centerConsoleAssemblyData,
  'door-panel': doorPanelAssemblyData,
  'exterior': exteriorAssemblyData,
};