// 车身侧门系统 - 非金属零件分级
// 来源：车身侧门系统-非金属零件分级.docx

export interface SideDoorPart {
  id: string;
  name: string;
  material: string;    // 典型选材类型
  process: string;     // 典型工艺
  imageUrl?: string;
  description?: string;
  function?: string;
  vehicleModels?: string[];
}

export interface SideDoorSubAssembly {
  id: string;
  name: string;
  parts: SideDoorPart[];
}

export interface SideDoorAssembly {
  id: string;
  name: string;
  icon: string;
  subAssemblies: SideDoorSubAssembly[];
}

export const sideDoorAssemblyData: SideDoorAssembly[] = [
  // ── 1. 车门外把手总成 ──────────────────────────────────────────────────
  {
    id: 'sd-01',
    name: '车门外把手总成',
    icon: '🚪',
    subAssemblies: [
      {
        id: 'sd-01-01',
        name: '前门外把手总成',
        parts: [
          { id: 'sd-01-01-01', name: '前门隐藏外把手壳', material: 'PA66+PP/EPC+ABS', process: '注塑+喷漆' },
          { id: 'sd-01-01-02', name: '前骨架', material: 'PA6-GF30', process: '注塑' },
          { id: 'sd-01-01-03', name: '前门底座', material: 'PP-GF30', process: '注塑' },
          { id: 'sd-01-01-04', name: '推杆', material: 'PP-GF50', process: '注塑' },
          { id: 'sd-01-01-05', name: '软胶', material: 'TPV', process: '注塑' },
          { id: 'sd-01-01-06', name: '前转臂', material: 'PP-GF50', process: '注塑' },
          { id: 'sd-01-01-07', name: '前控制杆总成', material: 'PA6-GF30/TPV', process: '双色注塑' },
          { id: 'sd-01-01-08', name: '前密封垫', material: 'PA6-GF30/TPV', process: '双色注塑' },
          { id: 'sd-01-01-09', name: '前底座盖板', material: 'PP-GF50', process: '注塑' },
        ],
      },
      {
        id: 'sd-01-02',
        name: '后门外把手总成',
        parts: [
          { id: 'sd-01-02-01', name: '后门隐藏外把手壳', material: 'PA66+PP/EPC+ABS', process: '注塑+喷漆' },
          { id: 'sd-01-02-02', name: '后骨架', material: 'PA6-GF30', process: '注塑' },
          { id: 'sd-01-02-03', name: '后门底座', material: 'PP-GF30', process: '注塑' },
          { id: 'sd-01-02-04', name: '推杆', material: 'PP-GF50', process: '注塑' },
          { id: 'sd-01-02-05', name: '软胶', material: 'TPV', process: '注塑' },
          { id: 'sd-01-02-06', name: '前转臂', material: 'PP-GF50', process: '注塑' },
          { id: 'sd-01-02-07', name: '前控制杆总成', material: 'PA6-GF30/TPV', process: '双色注塑' },
          { id: 'sd-01-02-08', name: '前密封垫', material: 'PA6-GF30/TPV', process: '双色注塑' },
          { id: 'sd-01-02-09', name: '前底座盖板', material: 'PP-GF50', process: '注塑' },
        ],
      },
    ],
  },

  // ── 2. 尾门电撑杆总成 ─────────────────────────────────────────────────
  {
    id: 'sd-02',
    name: '尾门电撑杆总成',
    icon: '📐',
    subAssemblies: [
      {
        id: 'sd-02-01',
        name: '尾门电撑杆',
        parts: [
          { id: 'sd-02-01-01', name: '尾门电撑杆套管', material: 'PA6-GF30', process: '注塑' },
          { id: 'sd-02-01-02', name: '球销座', material: 'PA66-GF50', process: '注塑' },
        ],
      },
    ],
  },

  // ── 3. 玻璃升降器总成 ─────────────────────────────────────────────────
  {
    id: 'sd-03',
    name: '玻璃升降器总成',
    icon: '⬆️',
    subAssemblies: [
      {
        id: 'sd-03-01',
        name: '玻璃升降器总成',
        parts: [
          { id: 'sd-03-01-01', name: '座板', material: 'PA66-GF35', process: '注塑' },
          { id: 'sd-03-01-02', name: '绕线轮', material: 'PA66-GF35', process: '注塑' },
        ],
      },
    ],
  },

  // ── 4. 四门活动玻璃总成 ───────────────────────────────────────────────
  {
    id: 'sd-04',
    name: '四门活动玻璃总成',
    icon: '🪟',
    subAssemblies: [
      {
        id: 'sd-04-01',
        name: '四门活动玻璃总成',
        parts: [
          { id: 'sd-04-01-01', name: '塑料导轨', material: 'PBT-GF30', process: '注塑' },
          { id: 'sd-04-01-02', name: '托架', material: 'PBT-GF30', process: '注塑' },
        ],
      },
    ],
  },

  // ── 5. 静态密封 ───────────────────────────────────────────────────────
  {
    id: 'sd-05',
    name: '静态密封',
    icon: '🔒',
    subAssemblies: [
      {
        id: 'sd-05-01',
        name: '前门内水切总成',
        parts: [
          { id: 'sd-05-01-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-01-02', name: '接角胶', material: 'TPV', process: '挤出' },
          { id: 'sd-05-01-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'sd-05-02',
        name: '后门内水切总成',
        parts: [
          { id: 'sd-05-02-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-02-02', name: '接角胶', material: 'TPV', process: '挤出' },
          { id: 'sd-05-02-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'sd-05-03',
        name: '前门外水切总成',
        parts: [
          { id: 'sd-05-03-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-03-02', name: '接角胶', material: 'TPV', process: '挤出' },
        ],
      },
      {
        id: 'sd-05-04',
        name: '后门外水切总成',
        parts: [
          { id: 'sd-05-04-01', name: '挤出条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-04-02', name: '接角胶', material: 'TPV', process: '挤出' },
        ],
      },
      {
        id: 'sd-05-05',
        name: '前门玻璃导槽密封条',
        parts: [
          { id: 'sd-05-05-01', name: '顶条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-05-02', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-05-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'sd-05-06',
        name: '后门玻璃导槽密封条',
        parts: [
          { id: 'sd-05-06-01', name: '顶条', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-06-02', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-05-06-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'sd-05-07',
        name: '前门玻璃前导轨总成',
        parts: [
          { id: 'sd-05-07-01', name: '塑料导轨本体', material: 'PA66-GF35', process: '注塑' },
        ],
      },
      {
        id: 'sd-05-08',
        name: '前门玻璃后导轨总成',
        parts: [
          { id: 'sd-05-08-01', name: '塑料导轨本体', material: 'PA66-GF35', process: '注塑' },
        ],
      },
    ],
  },

  // ── 6. 动态密封条 ─────────────────────────────────────────────────────
  {
    id: 'sd-06',
    name: '动态密封条',
    icon: '🧲',
    subAssemblies: [
      {
        id: 'sd-06-01',
        name: '前门门槛密封条',
        parts: [
          { id: 'sd-06-01-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-01-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-01-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-01-04', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'sd-06-02',
        name: '后门门槛密封条',
        parts: [
          { id: 'sd-06-02-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-02-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-02-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-02-04', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'sd-06-03',
        name: '背门门洞密封条',
        parts: [
          { id: 'sd-06-03-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-03-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-04',
        name: '前门辅助密封条',
        parts: [
          { id: 'sd-06-04-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-04-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-04-03', name: '接角胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-05',
        name: '后门辅助密封条',
        parts: [
          { id: 'sd-06-05-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-05-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-05-03', name: '接角胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-06',
        name: '机舱前密封条',
        parts: [
          { id: 'sd-06-06-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-06-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-06-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-06-04', name: '内置镶件', material: 'PA66-GF15', process: '注塑' },
          { id: 'sd-06-06-05', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'sd-06-07',
        name: '机舱中密封条',
        parts: [
          { id: 'sd-06-07-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-07-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-08',
        name: '前门门洞密封条',
        parts: [
          { id: 'sd-06-08-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-08-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-08-03', name: '发泡密实胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-09',
        name: '后门门洞密封条',
        parts: [
          { id: 'sd-06-09-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-09-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-09-03', name: '发泡密实胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-10',
        name: '前门门框密封条',
        parts: [
          { id: 'sd-06-10-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-10-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-11',
        name: '后门门框密封条',
        parts: [
          { id: 'sd-06-11-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-11-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
        ],
      },
      {
        id: 'sd-06-12',
        name: '后门下后部辅助密封条',
        parts: [
          { id: 'sd-06-12-01', name: '密实胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-12-02', name: '海绵胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-12-03', name: '接角胶', material: 'EPDM', process: '挤出' },
          { id: 'sd-06-12-04', name: '内置镶件', material: 'PA66-GF15', process: '注塑' },
          { id: 'sd-06-12-05', name: '卡扣', material: 'PA66', process: '注塑' },
        ],
      },
    ],
  },

  // ── 7. B柱外饰板总成 ──────────────────────────────────────────────────
  {
    id: 'sd-07',
    name: 'B柱外饰板总成',
    icon: '🏗️',
    subAssemblies: [
      {
        id: 'sd-07-01',
        name: '三角饰板总成',
        parts: [
          { id: 'sd-07-01-01', name: '前三角饰板底板', material: 'ABS/TPS', process: '注塑' },
          { id: 'sd-07-01-02', name: '前三角饰板盖板', material: 'ABS', process: '注塑' },
        ],
      },
      {
        id: 'sd-07-02',
        name: 'B柱外饰板总成',
        parts: [
          { id: 'sd-07-02-01', name: '前门B柱饰板本体', material: 'PC', process: '注塑+淋涂' },
          { id: 'sd-07-02-02', name: '后门B柱饰板本体', material: 'PC', process: '注塑+淋涂' },
        ],
      },
    ],
  },

  // ── 8. 后侧窗角窗总成 ─────────────────────────────────────────────────
  {
    id: 'sd-08',
    name: '后侧窗角窗总成',
    icon: '🔲',
    subAssemblies: [
      {
        id: 'sd-08-01',
        name: '后侧窗角窗总成',
        parts: [
          { id: 'sd-08-01-01', name: '包边条', material: 'TPS', process: '注塑' },
          { id: 'sd-08-01-02', name: '嵌件', material: 'PP-GF30', process: '注塑' },
        ],
      },
    ],
  },

  // ── 9. 前门低音扬声器支架 ─────────────────────────────────────────────
  {
    id: 'sd-09',
    name: '前门低音扬声器支架',
    icon: '🔊',
    subAssemblies: [
      {
        id: 'sd-09-01',
        name: '前门低音扬声器支架',
        parts: [
          { id: 'sd-09-01-01', name: '前门低音扬声器支架', material: 'PP-LGF40', process: '注塑' },
        ],
      },
    ],
  },
];
