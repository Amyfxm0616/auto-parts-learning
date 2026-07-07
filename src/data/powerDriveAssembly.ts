export interface PDPart {
  id: string;
  name: string;
  material: string;
  process: string;
  note?: string;
}

export interface PDSubAssembly {
  id: string;
  name: string;
  parts: PDPart[];
}

export interface PDAssembly {
  id: string;
  name: string;
  subAssemblies: PDSubAssembly[];
}

export interface PDSystemGroup {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  assemblies: PDAssembly[];
}

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',   hover: 'hover:bg-blue-50',   svg: '#3b82f6', svgLight: '#eff6ff', svgBorder: '#93c5fd' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  hover: 'hover:bg-amber-50',  svg: '#f59e0b', svgLight: '#fffbeb', svgBorder: '#fcd34d' },
  cyan:   { bg: 'bg-cyan-600',   light: 'bg-cyan-50',   border: 'border-cyan-200',  text: 'text-cyan-700',  badge: 'bg-cyan-100 text-cyan-700',   hover: 'hover:bg-cyan-50',   svg: '#06b6d4', svgLight: '#ecfeff', svgBorder: '#67e8f9' },
  green:  { bg: 'bg-green-600',  light: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  hover: 'hover:bg-green-50',  svg: '#22c55e', svgLight: '#f0fdf4', svgBorder: '#86efac' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-50', svg: '#a855f7', svgLight: '#faf5ff', svgBorder: '#d8b4fe' },
};

export type PDColor = keyof typeof COLOR_MAP;
export const PD_COLOR_MAP = COLOR_MAP;

export const powerDriveData: PDSystemGroup[] = [
  {
    id: 'pd-g01',
    name: '控制与信号系统',
    shortName: '控制信号',
    icon: '🧠',
    color: 'blue',
    description: '聚焦动力驱动系统中的低压信号接口、电流检测与控制单元辅助结构，保障控制器采样与信号传输稳定。',
    assemblies: [
      {
        id: 'pd-01',
        name: 'NTC滤波板-线路板组件',
        subAssemblies: [
          {
            id: 'pd-01-01',
            name: 'NTC滤波板',
            parts: [
              { id: 'pd-01-01-01', name: '低压信号接插件塑壳', material: 'PBT-GF30', process: '注塑' },
            ],
          },
          {
            id: 'pd-01-02',
            name: '线路板组件',
            parts: [
              { id: 'pd-01-02-01', name: '低压信号接插件塑壳', material: 'PBT-GF30', process: '注塑' },
              { id: 'pd-01-02-02', name: '导向套', material: 'PPS-GF40', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-02',
        name: '电机控制器电流传感器支架',
        subAssemblies: [
          {
            id: 'pd-02-01',
            name: '传感器支架',
            parts: [
              { id: 'pd-02-01-01', name: '塑壳', material: 'PPS-GF40', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pd-g02',
    name: '润滑与油路系统',
    shortName: '润滑油路',
    icon: '🛢️',
    color: 'amber',
    description: '覆盖喷油环、电子油泵、集油盒、导油管和机械泵齿轮等核心润滑部件，承担润滑油分配、回收与输送。',
    assemblies: [
      {
        id: 'pd-03',
        name: '喷油环总成',
        subAssemblies: [
          {
            id: 'pd-03-01',
            name: '喷油环总成-前端',
            parts: [
              { id: 'pd-03-01-01', name: '前端喷油环', material: 'PA66-GF30', process: '注塑' },
            ],
          },
          {
            id: 'pd-03-02',
            name: '喷油环总成-后端',
            parts: [
              { id: 'pd-03-02-01', name: '后喷油环主体', material: 'PA66-GF30', process: '注塑' },
              { id: 'pd-03-02-02', name: '后喷油环盖子', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-04',
        name: '通气塞总成',
        subAssemblies: [
          {
            id: 'pd-04-01',
            name: '通气塞总成',
            parts: [
              { id: 'pd-04-01-01', name: '通气塞本体', material: 'PA66-GF33', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-05',
        name: '电子油泵总成',
        subAssemblies: [
          {
            id: 'pd-05-01',
            name: '电子油泵',
            parts: [
              { id: 'pd-05-01-01', name: '塑壳', material: 'PPA', process: '注塑' },
              { id: 'pd-05-01-02', name: '电控单元盖', material: 'PA66', process: '注塑' },
              { id: 'pd-05-01-03', name: '塑盖', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-06',
        name: '油环小总成',
        subAssemblies: [
          {
            id: 'pd-06-01',
            name: 'PSM喷油环小总成',
            parts: [
              { id: 'pd-06-01-01', name: 'PSM喷油环', material: 'PPS-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-07',
        name: 'ASM喷油环小总成',
        subAssemblies: [
          {
            id: 'pd-07-01',
            name: 'ASM喷油环小总成',
            parts: [
              { id: 'pd-07-01-01', name: 'ASM喷油环', material: 'PPS-GF30', process: '注塑' },
              { id: 'pd-07-01-02', name: 'ASM喷油环盖板', material: 'PPS-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-08',
        name: '集油盒&挡油板',
        subAssemblies: [
          {
            id: 'pd-08-01',
            name: '集油盒小总成',
            parts: [
              { id: 'pd-08-01-01', name: '集油盒壳体', material: 'PA66-GF30', process: '注塑' },
              { id: 'pd-08-01-02', name: '集油盒上盖', material: 'PA66-GF30', process: '注塑' },
              { id: 'pd-08-01-03', name: '弹簧座', material: 'PA66-GF30', process: '注塑' },
              { id: 'pd-08-01-04', name: '阀芯', material: 'PPS-GF40', process: '注塑' },
            ],
          },
          {
            id: 'pd-08-02',
            name: '导油管小总成',
            parts: [
              { id: 'pd-08-02-01', name: '导油管', material: 'PA6-(GF20+GB10)', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-09',
        name: '机械泵齿轮',
        subAssemblies: [
          {
            id: 'pd-09-01',
            name: '机械泵齿轮',
            parts: [
              { id: 'pd-09-01-01', name: '机械泵齿轮', material: 'PA66-GF33', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pd-g03',
    name: '冷却与介质管路',
    shortName: '冷却管路',
    icon: '💧',
    color: 'cyan',
    description: '围绕电驱总成冷却介质连接展开，重点体现水管快插接口等耐热、耐介质注塑件。',
    assemblies: [
      {
        id: 'pd-10',
        name: '电驱水管',
        subAssemblies: [
          {
            id: 'pd-10-01',
            name: '电驱水管',
            parts: [
              { id: 'pd-10-01-01', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pd-g04',
    name: '连接与绝缘系统',
    shortName: '连接绝缘',
    icon: '🔌',
    color: 'green',
    description: '包含高压输入接插件与三相接线座，承担动力驱动系统中的高压导电连接、绝缘隔离和防护功能。',
    assemblies: [
      {
        id: 'pd-11',
        name: '高压输入接插件',
        subAssemblies: [
          {
            id: 'pd-11-01',
            name: '高压输入接插件',
            parts: [
              { id: 'pd-11-01-01', name: '互锁壳体', material: 'PA66-GF25', process: '注塑' },
              { id: 'pd-11-01-02', name: '插座壳体', material: 'PA66-GF25', process: '注塑' },
              { id: 'pd-11-01-03', name: '插座防尘盖', material: 'PP', process: '注塑' },
              { id: 'pd-11-01-04', name: '插座绝缘体', material: 'PA66-GF25', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'pd-12',
        name: '三相接线座小总成',
        subAssemblies: [
          {
            id: 'pd-12-01',
            name: '相接线座',
            parts: [
              { id: 'pd-12-01-01', name: '塑料主体', material: 'PPS-GF40', process: '注塑' },
              { id: 'pd-12-01-02', name: '三相接线座盖板', material: 'PPS-GF40', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'pd-g05',
    name: '传动支撑系统',
    shortName: '传动支撑',
    icon: '🧩',
    color: 'purple',
    description: '面向轴承与传动支撑类非金属件，强调耐磨、尺寸稳定和高载荷工况下的结构支撑能力。',
    assemblies: [
      {
        id: 'pd-13',
        name: '轴承类零件',
        subAssemblies: [
          {
            id: 'pd-13-01',
            name: '圆锥滚子轴承内组件',
            parts: [
              { id: 'pd-13-01-01', name: '组件', material: 'PA46', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
];
