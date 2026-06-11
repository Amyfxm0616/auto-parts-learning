export interface SealPart {
  id: string;
  name: string;
  material: string;
  process: string;
}

export interface SealSubAssembly {
  id: string;
  name: string;
  diagramType: 'watercut' | 'glasschannel' | 'glassguide' | 'doorstrip' | 'cabinstrip' | 'doorhole' | 'framstrip' | 'trim';
  parts: SealPart[];
}

export type SealCategory = 'static' | 'dynamic' | 'exterior';

export interface SealAssembly {
  id: string;
  name: string;
  icon: string;
  category: SealCategory;
  subAssemblies: SealSubAssembly[];
}

export const sealingAssemblyData: SealAssembly[] = [
  // ── 静态密封 ──────────────────────────────────────────────────────────
  {
    id: 'se-01',
    name: '静态密封',
    icon: '🔷',
    category: 'static',
    subAssemblies: [
      {
        id: 'se-01-01',
        name: '前门内水切总成',
        diagramType: 'watercut',
        parts: [
          { id: 'se-01-01-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-01-02', name: '接角胶', material: 'TPV', process: '挤出' },
          { id: 'se-01-01-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'se-01-02',
        name: '后门内水切总成',
        diagramType: 'watercut',
        parts: [
          { id: 'se-01-02-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-02-02', name: '接角胶', material: 'TPV', process: '挤出' },
          { id: 'se-01-02-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'se-01-03',
        name: '前门外水切总成',
        diagramType: 'watercut',
        parts: [
          { id: 'se-01-03-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-03-02', name: '接角胶', material: 'TPV', process: '挤出' },
        ],
      },
      {
        id: 'se-01-04',
        name: '后门外水切总成',
        diagramType: 'watercut',
        parts: [
          { id: 'se-01-04-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-04-02', name: '接角胶', material: 'TPV', process: '挤出' },
        ],
      },
      {
        id: 'se-01-05',
        name: '前门玻璃导槽密封条',
        diagramType: 'glasschannel',
        parts: [
          { id: 'se-01-05-01', name: '顶条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-05-02', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-01-05-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'se-01-06',
        name: '后门玻璃导槽密封条',
        diagramType: 'glasschannel',
        parts: [
          { id: 'se-01-06-01', name: '顶条', material: 'EPDM', process: '挤出' },
          { id: 'se-01-06-02', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-01-06-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'se-01-07',
        name: '前门玻璃前导轨总成',
        diagramType: 'glassguide',
        parts: [
          { id: 'se-01-07-01', name: '塑料导轨本体', material: 'PA66-GF35', process: '注塑' },
        ],
      },
      {
        id: 'se-01-08',
        name: '前门玻璃后导轨总成',
        diagramType: 'glassguide',
        parts: [
          { id: 'se-01-08-01', name: '塑料导轨本体', material: 'PA66-GF35', process: '注塑' },
        ],
      },
    ],
  },

  // ── 动态密封条 ──────────────────────────────────────────────────────
  {
    id: 'se-02',
    name: '动态密封条',
    icon: '🔶',
    category: 'dynamic',
    subAssemblies: [
      {
        id: 'se-02-01',
        name: '前门门槛密封条',
        diagramType: 'doorstrip',
        parts: [
          { id: 'se-02-01-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-01-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-01-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-01-04', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'se-02-02',
        name: '后门门槛密封条',
        diagramType: 'doorstrip',
        parts: [
          { id: 'se-02-02-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-02-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-02-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-02-04', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'se-02-03',
        name: '背门门洞密封条',
        diagramType: 'doorhole',
        parts: [
          { id: 'se-02-03-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-03-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-04',
        name: '前门辅助密封条',
        diagramType: 'doorstrip',
        parts: [
          { id: 'se-02-04-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-04-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-04-03', name: '接角胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-05',
        name: '后门辅助密封条',
        diagramType: 'doorstrip',
        parts: [
          { id: 'se-02-05-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-05-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-05-03', name: '接角胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-06',
        name: '机舱前密封条',
        diagramType: 'cabinstrip',
        parts: [
          { id: 'se-02-06-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-06-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-06-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-06-04', name: '内置镶件', material: 'PA66-GF15', process: '注塑' },
          { id: 'se-02-06-05', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'se-02-07',
        name: '机舱中密封条',
        diagramType: 'cabinstrip',
        parts: [
          { id: 'se-02-07-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-07-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-08',
        name: '前门门洞密封条',
        diagramType: 'doorhole',
        parts: [
          { id: 'se-02-08-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-08-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-08-03', name: '发泡密实胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-09',
        name: '后门门洞密封条',
        diagramType: 'doorhole',
        parts: [
          { id: 'se-02-09-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-09-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-09-03', name: '发泡密实胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-10',
        name: '前门门框密封条',
        diagramType: 'framstrip',
        parts: [
          { id: 'se-02-10-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-10-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-11',
        name: '后门门框密封条',
        diagramType: 'framstrip',
        parts: [
          { id: 'se-02-11-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-11-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'se-02-12',
        name: '后门下后部辅助密封条',
        diagramType: 'doorstrip',
        parts: [
          { id: 'se-02-12-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-12-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-12-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'se-02-12-04', name: '内置镶件', material: 'PA66-GF15', process: '注塑' },
          { id: 'se-02-12-05', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
    ],
  },

  // ── B柱外饰板总成 ───────────────────────────────────────────────────
  {
    id: 'se-03',
    name: 'B柱外饰板总成',
    icon: '🔲',
    category: 'exterior',
    subAssemblies: [
      {
        id: 'se-03-01',
        name: '三角饰板总成',
        diagramType: 'trim',
        parts: [
          { id: 'se-03-01-01', name: '前三角饰板底板', material: 'ABS/TPS', process: '注塑' },
          { id: 'se-03-01-02', name: '前三角饰板盖板', material: 'ABS', process: '注塑' },
        ],
      },
      {
        id: 'se-03-02',
        name: 'B柱外饰板总成',
        diagramType: 'trim',
        parts: [
          { id: 'se-03-02-01', name: '前门B柱饰板本体', material: 'PC', process: '注塑+淋涂' },
          { id: 'se-03-02-02', name: '后门B柱饰板本体', material: 'PC', process: '注塑+淋涂' },
        ],
      },
    ],
  },
];
