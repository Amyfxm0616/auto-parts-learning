export interface AutonomousDrivingPart {
  id: string;
  name: string;
  material: string;
  process: string;
  note?: string;
}

export interface AutonomousDrivingSubAssembly {
  id: string;
  name: string;
  parts: AutonomousDrivingPart[];
}

export interface AutonomousDrivingAssembly {
  id: string;
  name: string;
  icon: string;
  subAssemblies: AutonomousDrivingSubAssembly[];
}

export interface AutonomousDrivingGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  assemblies: AutonomousDrivingAssembly[];
}

export const autonomousDrivingGroups: AutonomousDrivingGroup[] = [
  {
    id: 'ad-camera',
    name: '摄像头系统',
    icon: '📷',
    description: '覆盖外部感知与舱内感知摄像头总成，聚焦视觉感知模块中的结构件、连接件与支架类非金属零件。',
    assemblies: [
      {
        id: 'ad-camera-streaming',
        name: '流媒体摄像头',
        icon: '🎥',
        subAssemblies: [
          {
            id: 'ad-camera-streaming-cover',
            name: '线束一体化后盖',
            parts: [
              { id: 'ad-camera-streaming-cover-01', name: '绝缘体', material: 'PA10T-GF30.FR', process: '注塑' },
              { id: 'ad-camera-streaming-cover-02', name: '二次成型', material: 'PBT-GF15', process: '注塑' },
              { id: 'ad-camera-streaming-cover-03', name: '固定环', material: 'POM', process: '注塑' },
            ],
          },
          {
            id: 'ad-camera-streaming-connector',
            name: '电连',
            parts: [
              { id: 'ad-camera-streaming-connector-01', name: '绝缘体', material: 'LCP', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ad-camera-360',
        name: '360泊车摄像头',
        icon: '🚘',
        subAssemblies: [
          {
            id: 'ad-camera-360-front-rear',
            name: '前后摄像头',
            parts: [
              { id: 'ad-camera-360-front-rear-01', name: '支架', material: 'PA66-GF15', process: '注塑' },
              { id: 'ad-camera-360-front-rear-02', name: '电连8-浮动连接器', material: 'LCP', process: '注塑' },
            ],
          },
          {
            id: 'ad-camera-360-left-right',
            name: '左右摄像头',
            parts: [
              { id: 'ad-camera-360-left-right-01', name: '支架', material: 'PA66-GF15', process: '注塑' },
              { id: 'ad-camera-360-left-right-02', name: '电连8-浮动连接器', material: 'LCP', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ad-camera-row1-cabin',
        name: '一排舱内感知摄像头总成',
        icon: '👁️',
        subAssemblies: [
          {
            id: 'ad-camera-row1-cabin-main',
            name: '一排舱内感知摄像头',
            parts: [
              { id: 'ad-camera-row1-cabin-01', name: '玻璃盖板支架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ad-camera-fatigue',
        name: '疲劳监控摄像头总成',
        icon: '😴',
        subAssemblies: [
          {
            id: 'ad-camera-fatigue-main',
            name: '疲劳监测摄像头',
            parts: [
              { id: 'ad-camera-fatigue-01', name: '前罩组件', material: 'PA66-G15/PC', process: '注塑' },
              { id: 'ad-camera-fatigue-02', name: '支架', material: 'PA66-G15', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ad-camera-row2-cabin',
        name: '二排舱内感知摄像头总成',
        icon: '🧭',
        subAssemblies: [
          {
            id: 'ad-camera-row2-cabin-main',
            name: '二排舱内感知摄像头',
            parts: [
              { id: 'ad-camera-row2-cabin-01', name: 'LDS天线', material: 'PC-GF10', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ad-optical',
    name: '光学/反射系统',
    icon: '🪞',
    description: '以流媒体内后视镜为核心，展示镜体、感光与按键交互区域相关的典型非金属件。',
    assemblies: [
      {
        id: 'ad-optical-streaming-mirror',
        name: '流媒体内后视镜总成',
        icon: '🪞',
        subAssemblies: [
          {
            id: 'ad-optical-streaming-mirror-main',
            name: '流媒体内后视镜',
            parts: [
              { id: 'ad-optical-streaming-mirror-01', name: '装饰盖R/L', material: 'PC+ABS', process: '注塑' },
              { id: 'ad-optical-streaming-mirror-02', name: '感光窗', material: 'PC', process: '注塑' },
              { id: 'ad-optical-streaming-mirror-03', name: '曲柄球头基座', material: 'POM', process: '注塑' },
              { id: 'ad-optical-streaming-mirror-04', name: '中框', material: 'PC+ABS', process: '注塑' },
              { id: 'ad-optical-streaming-mirror-05', name: '按键', material: 'PC', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ad-radar',
    name: '雷达系统',
    icon: '📡',
    description: '集中展示激光雷达与前毫米波雷达的视窗、壳体与天线等典型感知硬件非金属件。',
    assemblies: [
      {
        id: 'ad-radar-lidar',
        name: '激光雷达总成',
        icon: '🛰️',
        subAssemblies: [
          {
            id: 'ad-radar-lidar-main',
            name: '激光雷达',
            parts: [
              { id: 'ad-radar-lidar-01', name: '视窗', material: 'PC', process: '注塑' },
              { id: 'ad-radar-lidar-02', name: '一体上盖', material: 'PBT+PC-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'ad-radar-mmwave-front',
        name: '前毫米波雷达总成',
        icon: '📶',
        subAssemblies: [
          {
            id: 'ad-radar-mmwave-front-main',
            name: '前毫米波雷达',
            parts: [
              { id: 'ad-radar-mmwave-front-01', name: '上壳', material: 'PBT-GF30', process: '激光焊接' },
              { id: 'ad-radar-mmwave-front-02', name: '下壳', material: 'PBT-GF30', process: '激光焊接' },
              { id: 'ad-radar-mmwave-front-03', name: '天线', material: 'PPS-(MD+GF)50', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ad-other',
    name: '其他自动驾驶模块',
    icon: '🧩',
    description: '预留后续接入尚未归类到摄像头、光学/反射或雷达系统的自动驾驶硬件模块。',
    assemblies: [],
  },
];
