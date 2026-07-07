export interface ChassisPart {
  id: string;
  name: string;
  material: string;
  process: string;
  note?: string;
}

export interface ChassisSubAssembly {
  id: string;
  name: string;
  parts: ChassisPart[];
}

export interface ChassisAssembly {
  id: string;
  name: string;
  subAssemblies: ChassisSubAssembly[];
}

export interface ChassisSubsystem {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  colorKey: ChassisColorKey;
  assemblies: ChassisAssembly[];
}

export interface ChassisDiagramZone {
  id: string;
  subsystemId: ChassisSubsystem['id'];
  label: string;
  hint: string;
  type: 'rect' | 'ellipse';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}

const CHASSIS_COLOR_MAP_INTERNAL = {
  slate: {
    bg: 'bg-slate-700',
    light: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    hover: 'hover:bg-slate-50',
    ring: 'ring-slate-300',
    panel: 'from-slate-700 via-slate-800 to-slate-900',
    svgFill: '#cbd5e1',
    svgFillStrong: '#94a3b8',
    svgStroke: '#475569',
    accent: '#334155',
  },
  emerald: {
    bg: 'bg-emerald-600',
    light: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    hover: 'hover:bg-emerald-50',
    ring: 'ring-emerald-300',
    panel: 'from-emerald-600 via-emerald-700 to-teal-800',
    svgFill: '#a7f3d0',
    svgFillStrong: '#6ee7b7',
    svgStroke: '#047857',
    accent: '#065f46',
  },
  amber: {
    bg: 'bg-amber-500',
    light: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    hover: 'hover:bg-amber-50',
    ring: 'ring-amber-300',
    panel: 'from-amber-500 via-amber-600 to-orange-700',
    svgFill: '#fde68a',
    svgFillStrong: '#fbbf24',
    svgStroke: '#b45309',
    accent: '#92400e',
  },
} as const;

export type ChassisColorKey = keyof typeof CHASSIS_COLOR_MAP_INTERNAL;
export const CHASSIS_COLOR_MAP = CHASSIS_COLOR_MAP_INTERNAL;

export const chassisSubsystems: ChassisSubsystem[] = [
  {
    id: 'chassis-structure',
    name: '底盘结构',
    shortName: '底盘结构',
    icon: 'CH',
    description: '覆盖稳定杆、减振器、空气弹簧、动力悬置与储能/连接基础件，突出底盘基础结构件的轻量化与耐久选材。',
    colorKey: 'slate',
    assemblies: [
      {
        id: 'chs-asm-01',
        name: '前后稳定杆总成',
        subAssemblies: [
          {
            id: 'chs-asm-01-sub-01',
            name: '前稳定杆总成',
            parts: [
              { id: 'chs-part-01-01-01', name: '衬套（底座）', material: 'PA66-GF35', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-01-sub-02',
            name: '后稳定杆总成',
            parts: [
              { id: 'chs-part-01-02-01', name: '衬套（底座）', material: 'PA66-GF35', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-02',
        name: '前稳定杆连接杆总成',
        subAssemblies: [
          {
            id: 'chs-asm-02-sub-01',
            name: '前稳定杆连接杆',
            parts: [{ id: 'chs-part-02-01-01', name: '球座', material: 'POM', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-03',
        name: '后稳定杆连接杆总成',
        subAssemblies: [
          {
            id: 'chs-asm-03-sub-01',
            name: '后稳定杆连接杆',
            parts: [{ id: 'chs-part-03-01-01', name: '球座', material: 'POM', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-04',
        name: '前滑柱及后减振器总成',
        subAssemblies: [
          {
            id: 'chs-asm-04-sub-01',
            name: '前滑柱总成',
            parts: [
              { id: 'chs-part-04-01-01', name: '防尘盖', material: 'PP', process: '注塑' },
              { id: 'chs-part-04-01-02', name: '上支撑座总成', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-04-01-03', name: '防尘罩', material: 'TPEE', process: '注塑' },
              { id: 'chs-part-04-01-04', name: '缓冲块', material: 'TPEE', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-04-sub-02',
            name: '前减振器总成',
            parts: [
              { id: 'chs-part-04-02-01', name: '卡帽', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-04-02-02', name: '缓冲软垫上', material: 'PA66-GF30', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-04-sub-03',
            name: '电磁阀线圈总成',
            parts: [{ id: 'chs-part-04-03-01', name: '弹簧补偿垫', material: 'PA66-GF30', process: '注塑' }],
          },
          {
            id: 'chs-asm-04-sub-04',
            name: '后滑柱总成',
            parts: [
              { id: 'chs-part-04-04-01', name: '防尘盖', material: 'PP', process: '注塑' },
              { id: 'chs-part-04-04-02', name: '上支撑座总成', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-04-04-03', name: '防尘罩', material: 'TPV', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-04-sub-05',
            name: '后减振器总成',
            parts: [
              { id: 'chs-part-04-05-01', name: '卡帽', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-04-05-02', name: '缓冲软垫上', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-05',
        name: '前/后空簧总成',
        subAssemblies: [
          {
            id: 'chs-asm-05-sub-01',
            name: '前空气空簧总成',
            parts: [
              { id: 'chs-part-05-01-01', name: '前上顶座上盖', material: 'PA6-GF50', process: '注塑' },
              { id: 'chs-part-05-01-02', name: '前上顶座下盖', material: 'PA6-GF50', process: '注塑' },
              { id: 'chs-part-05-01-03', name: '电磁阀挡块', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-01-04', name: '活塞支撑挡圈', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-01-05', name: '前缓冲块', material: 'NDI', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-05-sub-02',
            name: '前减振器总成',
            parts: [
              { id: 'chs-part-05-02-01', name: '电磁阀挡圈', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-02-02', name: '闷盖', material: 'PA66-GF50', process: '注塑' },
              { id: 'chs-part-05-02-03', name: '前簧防尘罩', material: 'TPEE', process: '注塑' },
              { id: 'chs-part-05-02-04', name: '前上顶座上盖', material: 'PA66-GF50', process: '注塑' },
              { id: 'chs-part-05-02-05', name: '前上顶座下盖', material: 'PA66-GF50', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-05-sub-03',
            name: '后空气弹簧总成',
            parts: [
              { id: 'chs-part-05-03-01', name: '轴承座', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-02', name: '轴承', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-03', name: '后簧上座总成', material: 'PA66-GF50', process: '注塑' },
              { id: 'chs-part-05-03-04', name: '上顶座上盖', material: 'PA66-GF50', process: '注塑' },
              { id: 'chs-part-05-03-05', name: '上顶座下盖', material: 'PA66-GF50', process: '注塑' },
              { id: 'chs-part-05-03-06', name: '电磁阀挡圈', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-07', name: '防尘罩衬垫', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-08', name: '推环', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-09', name: '后空簧下座', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-05-03-10', name: '前缓冲块', material: 'NDI', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-06',
        name: '动力悬置总成',
        subAssemblies: [
          {
            id: 'chs-asm-06-sub-01',
            name: '前动力悬置',
            parts: [
              { id: 'chs-part-06-01-01', name: '衬套外管', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-06-01-02', name: '塑料外壳', material: 'PA6-GF35', process: '注塑' },
              { id: 'chs-part-06-01-03', name: '下嵌件', material: 'PA6-GF35', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-06-sub-02',
            name: '前动力后悬置',
            parts: [{ id: 'chs-part-06-02-01', name: '衬套外管', material: 'PA66-GF30', process: '注塑' }],
          },
          {
            id: 'chs-asm-06-sub-03',
            name: '后动力前悬置',
            parts: [{ id: 'chs-part-06-03-01', name: '尼龙外管', material: 'PA66-GF30', process: '注塑' }],
          },
          {
            id: 'chs-asm-06-sub-04',
            name: '后动力后悬置',
            parts: [{ id: 'chs-part-06-04-01', name: '尼龙外管', material: 'PA66-GF30', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-07',
        name: '后螺旋弹簧垫块',
        subAssemblies: [
          {
            id: 'chs-asm-07-sub-01',
            name: '后螺旋弹簧垫块',
            parts: [{ id: 'chs-part-07-01-01', name: '塑料骨架', material: 'PA66-GF35', process: '注塑' }],
          },
          {
            id: 'chs-asm-07-sub-02',
            name: '后螺旋弹簧下垫块',
            parts: [{ id: 'chs-part-07-02-01', name: '塑料骨架', material: 'PA66-GF35', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-08',
        name: '空簧CDC',
        subAssemblies: [
          {
            id: 'chs-asm-08-sub-01',
            name: '前减振器总成',
            parts: [
              { id: 'chs-part-08-01-01', name: '复原缓冲块', material: 'PA6-GF30', process: '注塑' },
              { id: 'chs-part-08-01-02', name: '顶盖', material: 'PA6-GF30', process: '注塑' },
              { id: 'chs-part-08-01-03', name: '防尘罩', material: 'TPV', process: '注塑' },
              { id: 'chs-part-08-01-04', name: '盖', material: 'PP', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-08-sub-02',
            name: '后减振器总成',
            parts: [
              { id: 'chs-part-08-02-01', name: '复原缓冲块', material: 'PA6-GF30', process: '注塑' },
              { id: 'chs-part-08-02-02', name: '顶盖', material: 'PA6-GF30', process: '注塑' },
              { id: 'chs-part-08-02-03', name: '防尘罩', material: 'TPV', process: '注塑' },
              { id: 'chs-part-08-02-04', name: '盖', material: 'PP', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-09',
        name: '制动储液罐连接管',
        subAssemblies: [
          {
            id: 'chs-asm-09-sub-01',
            name: '制动储液罐连接管',
            parts: [
              { id: 'chs-part-09-01-01', name: '扣夹', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-09-01-02', name: '空滤器', material: '未标注', process: '注塑', note: '源文档材料项标注为 /。' },
              { id: 'chs-part-09-01-03', name: '消音器', material: '未标注', process: '注塑', note: '源文档材料项标注为 /。' },
              { id: 'chs-part-09-01-04', name: '管夹1', material: 'PA66', process: '注塑' },
              { id: 'chs-part-09-01-05', name: '管夹2', material: 'PA66', process: '注塑' },
              { id: 'chs-part-09-01-06', name: '管夹3', material: 'PA66', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-10',
        name: '前转向节总成',
        subAssemblies: [
          {
            id: 'chs-asm-10-sub-01',
            name: '前上控制臂总成',
            parts: [{ id: 'chs-part-10-01-01', name: '外球座', material: 'POM', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-11',
        name: '储气罐总成',
        subAssemblies: [
          {
            id: 'chs-asm-11-sub-01',
            name: '储气罐',
            parts: [
              { id: 'chs-part-11-01-01', name: '塑料管卡', material: 'PA66', process: '注塑' },
              { id: 'chs-part-11-01-02', name: '气管', material: 'PA12', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-12',
        name: '后转向节球销',
        subAssemblies: [
          {
            id: 'chs-asm-12-sub-01',
            name: '后转向节球销',
            parts: [{ id: 'chs-part-12-01-01', name: '球座', material: 'POM', process: '注塑' }],
          },
        ],
      },
      {
        id: 'chs-asm-13',
        name: '主动悬架油泵',
        subAssemblies: [
          {
            id: 'chs-asm-13-sub-01',
            name: '前主动悬架油泵带支架及油管总成',
            parts: [
              { id: 'chs-part-13-01-01', name: '特殊连接器-汽车连接器', material: 'PPS-GF40', process: '注塑' },
              { id: 'chs-part-13-01-02', name: '电机绕线支架带Pin针', material: 'LCP+Cu', process: '注塑' },
              { id: 'chs-part-13-01-03', name: '悬架绕线支架不带Pin针', material: 'LCP', process: '注塑' },
              { id: 'chs-part-13-01-04', name: '特殊连接器-低压连接器', material: 'PA10T-GF30', process: '注塑' },
              { id: 'chs-part-13-01-05', name: '特殊连接器-高压连接器', material: 'PA-GF', process: '注塑' },
              { id: 'chs-part-13-01-06', name: '悬架-泵与电控互联结构组件', material: 'PPS-GF40', process: '注塑' },
              { id: 'chs-part-13-01-07', name: '特殊连接器-压力板转接包塑件', material: 'PPS-GF40', process: '注塑' },
              { id: 'chs-part-13-01-08', name: '防水接头', material: '硅胶/PBT-GF30/EPTFE', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-13-sub-02',
            name: '后主动悬架油泵带支架及油管总成',
            parts: [
              { id: 'chs-part-13-02-01', name: '特殊连接器-汽车连接器', material: 'PPS-GF40', process: '注塑' },
              { id: 'chs-part-13-02-02', name: '电机绕线支架带Pin针', material: 'LCP+Cu', process: '注塑' },
              { id: 'chs-part-13-02-03', name: '悬架绕线支架不带Pin针', material: 'LCP', process: '注塑' },
              { id: 'chs-part-13-02-04', name: '特殊连接器-低压连接器', material: 'PA-GF/铜合金/SUS', process: '注塑' },
              { id: 'chs-part-13-02-05', name: '特殊连接器-低压连接器', material: 'PBT-GF30', process: '注塑' },
              { id: 'chs-part-13-02-06', name: '特殊连接器-压力板转接包塑件', material: 'PPS-GF40', process: '注塑' },
              { id: 'chs-part-13-02-07', name: '防水接头', material: '硅胶/PBT-GF30/EPTFE', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-14',
        name: '全主动减振器',
        subAssemblies: [
          {
            id: 'chs-asm-14-sub-01',
            name: '后减振器总成',
            parts: [
              { id: 'chs-part-14-01-01', name: '缓冲器', material: 'PA46', process: '注塑' },
              { id: 'chs-part-14-01-02', name: '控制环', material: 'PA66-CF20', process: '注塑' },
              { id: 'chs-part-14-01-03', name: '导向环', material: 'PA6', process: '注塑' },
              { id: 'chs-part-14-01-04', name: '阀盖', material: 'PA66-GF30', process: '注塑' },
            ],
          },
          {
            id: 'chs-asm-14-sub-02',
            name: '前减振器总成',
            parts: [
              { id: 'chs-part-14-02-01', name: '缓冲器', material: 'PA46', process: '注塑' },
              { id: 'chs-part-14-02-02', name: '控制环', material: 'PA66-CF20', process: '注塑' },
              { id: 'chs-part-14-02-03', name: '导向环', material: 'PA6', process: '注塑' },
              { id: 'chs-part-14-02-04', name: '阀盖', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'chs-asm-15',
        name: '后副车架总成',
        subAssemblies: [
          {
            id: 'chs-asm-15-sub-01',
            name: '堵盖',
            parts: [{ id: 'chs-part-15-01-01', name: '堵盖', material: 'PA66', process: '注塑' }],
          },
          {
            id: 'chs-asm-15-sub-02',
            name: '后副车架后衬套',
            parts: [
              { id: 'chs-part-15-02-01', name: '外管', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-15-02-02', name: '内管总成', material: 'PA66-GF30', process: '注塑' },
              { id: 'chs-part-15-02-03', name: '嵌件', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'suspension-system',
    name: '悬架系统',
    shortName: '悬架系统',
    icon: 'SU',
    description: '围绕制动硬管、空气管路、轮毂轴承及踏板机构展开，体现底盘运动与制动附件的非金属材料体系。',
    colorKey: 'emerald',
    assemblies: [
      {
        id: 'sus-asm-01',
        name: '制动硬管',
        subAssemblies: [
          {
            id: 'sus-asm-01-sub-01',
            name: '前制动硬管',
            parts: [{ id: 'sus-part-01-01-01', name: '管夹', material: 'PA66', process: '注塑' }],
          },
          {
            id: 'sus-asm-01-sub-02',
            name: '后制动硬管',
            parts: [{ id: 'sus-part-01-02-01', name: '管夹', material: 'PA66', process: '注塑' }],
          },
          {
            id: 'sus-asm-01-sub-03',
            name: '制动硬管管束',
            parts: [{ id: 'sus-part-01-03-01', name: '管夹', material: 'PA66', process: '注塑' }],
          },
          {
            id: 'sus-asm-01-sub-04',
            name: '轮毂轴承',
            parts: [],
          },
          {
            id: 'sus-asm-01-sub-05',
            name: '非驱轮毂轴承总成',
            parts: [{ id: 'sus-part-01-05-01', name: '保持架', material: 'PA66-GF25', process: '注塑' }],
          },
          {
            id: 'sus-asm-01-sub-06',
            name: '驱动轮毂轴承总成',
            parts: [{ id: 'sus-part-01-06-01', name: '保持架', material: 'PA66-GF25', process: '注塑' }],
          },
        ],
      },
      {
        id: 'sus-asm-02',
        name: '空气管路',
        subAssemblies: [
          {
            id: 'sus-asm-02-sub-01',
            name: '前空气弹簧管路前段',
            parts: [
              { id: 'sus-part-02-01-01', name: '尼龙管', material: 'PA12', process: '注塑' },
              { id: 'sus-part-02-01-02', name: '管夹', material: 'PA66', process: '注塑' },
            ],
          },
          {
            id: 'sus-asm-02-sub-02',
            name: '前空气弹簧管路后段',
            parts: [
              { id: 'sus-part-02-02-01', name: '尼龙管', material: 'PA12', process: '注塑' },
              { id: 'sus-part-02-02-02', name: '管夹', material: 'PA66', process: '注塑' },
            ],
          },
          {
            id: 'sus-asm-02-sub-03',
            name: '后空气弹簧管路',
            parts: [
              { id: 'sus-part-02-03-01', name: '尼龙管', material: 'PA12', process: '注塑' },
              { id: 'sus-part-02-03-02', name: '管夹', material: 'PA66', process: '注塑' },
            ],
          },
          {
            id: 'sus-asm-02-sub-04',
            name: '压缩机和电磁阀管路',
            parts: [
              { id: 'sus-part-02-04-01', name: '尼龙管', material: 'PA12', process: '注塑' },
              { id: 'sus-part-02-04-02', name: '管夹', material: 'PA66', process: '注塑' },
            ],
          },
          {
            id: 'sus-asm-02-sub-05',
            name: '电磁阀和储气罐管路',
            parts: [
              { id: 'sus-part-02-05-01', name: '尼龙管', material: 'PA12', process: '注塑' },
              { id: 'sus-part-02-05-02', name: '管夹', material: 'PA66', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'sus-asm-03',
        name: '制动踏板',
        subAssemblies: [
          {
            id: 'sus-asm-03-sub-01',
            name: '制动支架组件',
            parts: [
              { id: 'sus-part-03-01-01', name: '支架', material: 'PP-GF40', process: '注塑' },
              { id: 'sus-part-03-01-02', name: '踏板罩', material: 'PVC', process: '注塑' },
              { id: 'sus-part-03-01-03', name: '主轴衬套', material: 'POM', process: '注塑' },
              { id: 'sus-part-03-01-04', name: '真空助力器连接件内衬', material: 'POM', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'sus-asm-04',
        name: '加速踏板',
        subAssemblies: [
          {
            id: 'sus-asm-04-sub-01',
            name: '加速踏板',
            parts: [
              { id: 'sus-part-04-01-01', name: '壳体', material: 'PP-LGF30', process: '注塑' },
              { id: 'sus-part-04-01-02', name: '踏板臂', material: 'PP-LGF30', process: '注塑' },
              { id: 'sus-part-04-01-03', name: '摇杆', material: 'PA66-GF40', process: '注塑' },
              { id: 'sus-part-04-01-04', name: '转子', material: 'PP-GF50POMPP-GF30', process: '注塑' },
              { id: 'sus-part-04-01-05', name: '连杆', material: 'PP-GF30', process: '注塑' },
              { id: 'sus-part-04-01-06', name: '壳体盖', material: 'PP-LGF30', process: '注塑' },
              { id: 'sus-part-04-01-07', name: '接插件', material: 'PP-LGF30', process: '注塑' },
              { id: 'sus-part-04-01-08', name: '堵盖', material: 'PP-GF30', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'steering-system',
    name: '转向系统',
    shortName: '转向系统',
    icon: 'ST',
    description: '聚焦后轮转向、线控转向、电动助力与转向柱调节机构，体现高强度、低摩擦与密封防护材料组合。',
    colorKey: 'amber',
    assemblies: [
      {
        id: 'ste-asm-01',
        name: '胎压监测传感器总成',
        subAssemblies: [
          {
            id: 'ste-asm-01-sub-01',
            name: '胎压监测传感器总成',
            parts: [
              { id: 'ste-part-01-01-01', name: '外壳', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-01-01-02', name: '盖', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-02',
        name: '电动拖车牵引装置',
        subAssemblies: [
          {
            id: 'ste-asm-02-sub-01',
            name: '电动拖车钩总成',
            parts: [
              { id: 'ste-part-02-01-01', name: '线束总成带防护罩上', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-02-01-02', name: '防护罩下', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-03',
        name: '后轮转向器总成',
        subAssemblies: [
          {
            id: 'ste-asm-03-sub-01',
            name: '后轮转向器',
            parts: [
              { id: 'ste-part-03-01-01', name: '滑块', material: 'PPS-GF40/PTFE', process: '注塑' },
              { id: 'ste-part-03-01-02', name: '底盖', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-03-01-03', name: '端盖', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-03-01-04', name: '防尘罩', material: 'TPV', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-04',
        name: '线控转向HWA',
        subAssemblies: [
          {
            id: 'ste-asm-04-sub-01',
            name: '线控转向手感模拟器总成',
            parts: [
              { id: 'ste-part-04-01-01', name: '防尘盖', material: 'PP', process: '注塑' },
              { id: 'ste-part-04-01-02', name: '联轴器转子', material: 'PA46-GF50', process: '注塑' },
              { id: 'ste-part-04-01-03', name: '传感器盖子', material: 'TPV', process: '注塑' },
              { id: 'ste-part-04-01-04', name: '齿轮保持器', material: 'PA46-GF30', process: '注塑' },
              { id: 'ste-part-04-01-05', name: '轴承保持架', material: 'PA410', process: '注塑' },
              { id: 'ste-part-04-01-06', name: '执行器外壳', material: 'PET-GF30', process: '注塑' },
              { id: 'ste-part-04-01-07', name: '丝杠外壳', material: 'PA66', process: '注塑' },
              { id: 'ste-part-04-01-08', name: '螺母顶盖', material: 'POM', process: '注塑' },
              { id: 'ste-part-04-01-09', name: '插头', material: 'POM', process: '注塑' },
              { id: 'ste-part-04-01-10', name: '蜗杆齿轮', material: 'PA66-CF20', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-05',
        name: '线控转向前轮执行器总成RWA',
        subAssemblies: [
          {
            id: 'ste-asm-05-sub-01',
            name: '线控转向前轮执行器总成',
            parts: [
              { id: 'ste-part-05-01-01', name: '大球座', material: 'POM', process: '注塑' },
              { id: 'ste-part-05-01-02', name: '传感器上盖', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-05-01-03', name: '下回球管', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-05-01-04', name: '上回球管', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-05-01-05', name: '滚珠螺母护套', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-05-01-06', name: '限位支撑块', material: 'PA66', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-06',
        name: '气门嘴总成',
        subAssemblies: [
          {
            id: 'ste-asm-06-sub-01',
            name: '气门嘴',
            parts: [{ id: 'ste-part-06-01-01', name: '气门帽', material: 'PP', process: '注塑' }],
          },
        ],
      },
      {
        id: 'ste-asm-07',
        name: '随车工具',
        subAssemblies: [
          {
            id: 'ste-asm-07-sub-01',
            name: '轮胎充气泵总成',
            parts: [
              { id: 'ste-part-07-01-01', name: '上盖', material: 'PP', process: '注塑' },
              { id: 'ste-part-07-01-02', name: '下盖', material: 'PP', process: '注塑' },
              { id: 'ste-part-07-01-03', name: '方形开关', material: 'PA66-GF10', process: '注塑' },
              { id: 'ste-part-07-01-04', name: '风叶', material: 'PA66', process: '注塑' },
              { id: 'ste-part-07-01-05', name: '风叶罩', material: 'PA66-GF35', process: '注塑' },
              { id: 'ste-part-07-01-06', name: '气缸盖', material: 'PA66-GF35', process: '注塑' },
              { id: 'ste-part-07-01-07', name: '压力表壳', material: 'PA66-GF35', process: '注塑' },
              { id: 'ste-part-07-01-08', name: '减速齿轮', material: 'PA66-GF35', process: '注塑' },
              { id: 'ste-part-07-01-09', name: '连杆', material: 'PA66-GF35', process: '注塑' },
              { id: 'ste-part-07-01-10', name: '插头上盖', material: 'PA66-GF30', process: '注塑' },
              { id: 'ste-part-07-01-11', name: '插头下盖', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-08',
        name: '电动调节转向柱总成',
        subAssemblies: [
          {
            id: 'ste-asm-08-sub-01',
            name: '电动调节转向柱',
            parts: [
              { id: 'ste-part-08-01-01', name: '角度限位片', material: 'POM-CF10', process: '注塑' },
              { id: 'ste-part-08-01-02', name: '预紧顶丝', material: 'POM', process: '注塑' },
              { id: 'ste-part-08-01-03', name: '角度调节块', material: 'POM', process: '注塑' },
              { id: 'ste-part-08-01-04', name: '预紧塑料块', material: 'POM', process: '注塑' },
              { id: 'ste-part-08-01-05', name: '塑料导向条', material: 'POM-CF10', process: '注塑' },
              { id: 'ste-part-08-01-06', name: '长度导向螺栓套总成', material: 'POM', process: '注塑' },
              { id: 'ste-part-08-01-07', name: '压紧块', material: 'POM', process: '注塑' },
              { id: 'ste-part-08-01-08', name: '端塞总成', material: 'PPA-GF50', process: '注塑' },
              { id: 'ste-part-08-01-09', name: '节叉限位套', material: 'PA11', process: '注塑' },
              { id: 'ste-part-08-01-10', name: '线束支架定位块', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ste-asm-09',
        name: '电动助力转向器带横拉杆总成',
        subAssemblies: [
          {
            id: 'ste-asm-09-sub-01',
            name: '电动助力转向器带横拉杆',
            parts: [
              { id: 'ste-part-09-01-01', name: '一体式蜗轮', material: 'PA66-GF50', process: '注塑' },
              { id: 'ste-part-09-01-02', name: '伺服盖', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-09-01-03', name: '传感器转子', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-09-01-04', name: '传感器盖', material: 'PBT-GF30', process: '注塑' },
              { id: 'ste-part-09-01-05', name: '防尘罩', material: 'TPV', process: '注塑' },
              { id: 'ste-part-09-01-06', name: '钟摆轴承保持架', material: 'PA66-GF25', process: '注塑' },
              { id: 'ste-part-09-01-07', name: '密封盖', material: 'PBT-GF20', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
];

export const CHASSIS_DIAGRAM_ZONES: ChassisDiagramZone[] = [
  {
    id: 'zone-chassis-structure',
    subsystemId: 'chassis-structure',
    label: '底盘结构',
    hint: '前后稳定杆、减振器、空气弹簧、动力悬置与底盘基础结构件',
    type: 'rect',
    x: 170,
    y: 330,
    width: 430,
    height: 64,
  },
  {
    id: 'zone-suspension-system-front',
    subsystemId: 'suspension-system',
    label: '悬架系统',
    hint: '制动硬管、空气管路、轮毂轴承与踏板机构',
    type: 'ellipse',
    cx: 245,
    cy: 286,
    rx: 120,
    ry: 86,
  },
  {
    id: 'zone-suspension-system-rear',
    subsystemId: 'suspension-system',
    label: '悬架系统',
    hint: '后桥/空气悬架与制动连接件非金属部件',
    type: 'ellipse',
    cx: 585,
    cy: 296,
    rx: 108,
    ry: 84,
  },
  {
    id: 'zone-steering-system-rack',
    subsystemId: 'steering-system',
    label: '转向系统',
    hint: '后轮转向、线控转向、电动助力与转向柱调节机构',
    type: 'rect',
    x: 215,
    y: 215,
    width: 250,
    height: 54,
  },
  {
    id: 'zone-steering-system-column',
    subsystemId: 'steering-system',
    label: '转向系统',
    hint: '方向柱与前舱执行机构区域',
    type: 'ellipse',
    cx: 360,
    cy: 142,
    rx: 92,
    ry: 54,
  },
];
