export interface HmiPart {
  id: string;
  name: string;
  material: string;
  process: string;
  note?: string;
}

export interface HmiSubAssembly {
  id: string;
  name: string;
  parts: HmiPart[];
}

export interface HmiAssembly {
  id: string;
  name: string;
  icon: string;
  subAssemblies: HmiSubAssembly[];
}

export interface HmiGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  assemblies: HmiAssembly[];
}

export const hmiGroups: HmiGroup[] = [
  {
    id: 'hmi-display',
    name: '显示系统',
    icon: '🖥️',
    description: '覆盖抬头显示、后排空调屏与光学显示模块，聚焦座舱信息呈现相关非金属件。',
    assemblies: [
      {
        id: 'hmi-display-hud',
        name: '抬头显示器总成',
        icon: '📡',
        subAssemblies: [
          {
            id: 'hmi-display-hud-main',
            name: '抬头显示器',
            parts: [
              { id: 'hmi-display-hud-01', name: '主机壳体', material: 'PP-GF40', process: '注塑' },
              { id: 'hmi-display-hud-02', name: '防尘罩壳体', material: 'PP-GF20', process: '注塑' },
              { id: 'hmi-display-hud-03', name: '马达组件支架', material: 'POM-GF25', process: '注塑' },
              { id: 'hmi-display-hud-04', name: '蜗杆支架', material: 'POM-GF25', process: '注塑' },
              { id: 'hmi-display-hud-05', name: '蜗杆', material: 'POM', process: '注塑' },
              { id: 'hmi-display-hud-06', name: '曲面反射镜', material: 'PC', process: '注塑' },
              { id: 'hmi-display-hud-07', name: '曲面反射镜右支架', material: 'POM-GF25', process: '注塑' },
              { id: 'hmi-display-hud-08', name: '曲面镜支架', material: 'PP-GF40', process: '注塑' },
              { id: 'hmi-display-hud-09', name: '平面反射镜背板', material: 'PP-GF40', process: '注塑' },
              { id: 'hmi-display-hud-10', name: 'LCD支架', material: 'PC+ABS', process: '注塑' },
              { id: 'hmi-display-hud-11', name: '3.1线形菲涅尔', material: 'PC', process: '注塑' },
              { id: 'hmi-display-hud-12', name: '圆形菲涅尔', material: 'PC', process: '注塑' },
              { id: 'hmi-display-hud-13', name: '灯筒A', material: 'PC', process: '注塑' },
              { id: 'hmi-display-hud-14', name: '灯筒B', material: 'PC', process: '注塑' },
              { id: 'hmi-display-hud-15', name: '底壳', material: 'PP-LGF20', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-display-rear-ac',
        name: '二排空调屏总成',
        icon: '🌡️',
        subAssemblies: [
          {
            id: 'hmi-display-rear-ac-main',
            name: '二排空调屏',
            parts: [
              { id: 'hmi-display-rear-ac-01', name: '导光板', material: 'PC', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-display-electrochromic',
        name: '电变色玻璃模块',
        icon: '🪟',
        subAssemblies: [
          {
            id: 'hmi-display-electrochromic-main',
            name: '电变色玻璃模块',
            parts: [
              { id: 'hmi-display-electrochromic-01', name: '盖板', material: 'PP-GF20', process: '注塑' },
              { id: 'hmi-display-electrochromic-02', name: '壳体', material: 'PP-GF20', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hmi-audio',
    name: '音响系统',
    icon: '🔊',
    description: '覆盖麦克风、车外提示扬声器及多位置扬声器总成，便于按声学模块查看材料与工艺。',
    assemblies: [
      {
        id: 'hmi-audio-microphone',
        name: '麦克风总成',
        icon: '🎤',
        subAssemblies: [
          {
            id: 'hmi-audio-microphone-main',
            name: '麦克风',
            parts: [
              { id: 'hmi-audio-microphone-01', name: 'Housing', material: 'PC+ABS', process: '注塑' },
              { id: 'hmi-audio-microphone-02', name: 'Cover', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-avas',
        name: 'AVAS车外扬声器总成',
        icon: '📢',
        subAssemblies: [
          {
            id: 'hmi-audio-avas-main',
            name: 'AVAS车外扬声器',
            parts: [
              { id: 'hmi-audio-avas-01', name: '前盖', material: 'PP-GF25', process: '注塑' },
              { id: 'hmi-audio-avas-02', name: '支架', material: 'PP-GF25', process: '注塑' },
              { id: 'hmi-audio-avas-03', name: '后盖', material: 'PP-GF25', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-driver-surround',
        name: '驾驶员前环绕扬声器总成',
        icon: '🎵',
        subAssemblies: [
          {
            id: 'hmi-audio-driver-surround-main',
            name: '驾驶员前环绕扬声器',
            parts: [
              { id: 'hmi-audio-driver-surround-01', name: '前盖', material: 'PC+ABS-GF17', process: '注塑' },
              { id: 'hmi-audio-driver-surround-02', name: '支架', material: 'PC+ABS-GF17', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-subwoofer',
        name: '低音炮总成',
        icon: '🪘',
        subAssemblies: [
          {
            id: 'hmi-audio-subwoofer-main',
            name: '低音炮',
            parts: [
              { id: 'hmi-audio-subwoofer-01', name: '前壳', material: 'PP-GF20', process: '注塑' },
              { id: 'hmi-audio-subwoofer-02', name: '后壳', material: 'PP-GF20', process: '注塑' },
              { id: 'hmi-audio-subwoofer-03', name: '网罩', material: 'PP-GF20', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-third-row-bass',
        name: '第三排低音扬声器总成',
        icon: '🔉',
        subAssemblies: [
          {
            id: 'hmi-audio-third-row-bass-main',
            name: '第三排低音扬声器',
            parts: [
              { id: 'hmi-audio-third-row-bass-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-front-surround',
        name: '前环绕扬声器总成',
        icon: '🔈',
        subAssemblies: [
          {
            id: 'hmi-audio-front-surround-main',
            name: '前环绕扬声器',
            parts: [
              { id: 'hmi-audio-front-surround-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-rear-bass',
        name: '后低音扬声器总成',
        icon: '🔊',
        subAssemblies: [
          {
            id: 'hmi-audio-rear-bass-main',
            name: '后低音扬声器',
            parts: [
              { id: 'hmi-audio-rear-bass-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-rear-tweeter',
        name: '后高音扬声器总成',
        icon: '🎶',
        subAssemblies: [
          {
            id: 'hmi-audio-rear-tweeter-main',
            name: '后高音扬声器',
            parts: [
              { id: 'hmi-audio-rear-tweeter-01', name: '前盖', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-rear-tweeter-02', name: '支撑柱', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-rear-tweeter-03', name: '绝缘环', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-rear-tweeter-04', name: '连接器板', material: 'PC', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-front-bass',
        name: '前低音扬声器总成',
        icon: '🔉',
        subAssemblies: [
          {
            id: 'hmi-audio-front-bass-main',
            name: '前低音扬声器',
            parts: [
              { id: 'hmi-audio-front-bass-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-front-mid',
        name: '前中音扬声器总成',
        icon: '🎚️',
        subAssemblies: [
          {
            id: 'hmi-audio-front-mid-main',
            name: '前中音扬声器',
            parts: [
              { id: 'hmi-audio-front-mid-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-front-tweeter',
        name: '前高音扬声器总成',
        icon: '📻',
        subAssemblies: [
          {
            id: 'hmi-audio-front-tweeter-main',
            name: '前高音扬声器',
            parts: [
              { id: 'hmi-audio-front-tweeter-01', name: '前盖', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-front-tweeter-02', name: '支撑柱', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-front-tweeter-03', name: '绝缘环', material: 'PC', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-center-speaker',
        name: '中置扬声器总成',
        icon: '📀',
        subAssemblies: [
          {
            id: 'hmi-audio-center-speaker-main',
            name: '中置扬声器',
            parts: [
              { id: 'hmi-audio-center-speaker-01', name: '盆架', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-audio-center-tweeter',
        name: '中置高音扬声器总成',
        icon: '🎼',
        subAssemblies: [
          {
            id: 'hmi-audio-center-tweeter-main',
            name: '中置高音扬声器',
            parts: [
              { id: 'hmi-audio-center-tweeter-01', name: '前盖', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-center-tweeter-02', name: '支撑柱', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-center-tweeter-03', name: '绝缘环', material: 'PC', process: '注塑' },
              { id: 'hmi-audio-center-tweeter-04', name: '连接器板', material: 'PC', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hmi-control',
    name: '控制模块',
    icon: '🎛️',
    description: '集中展示座椅、车身、区域与门控类控制器的壳体、盖板及连接件。',
    assemblies: [
      {
        id: 'hmi-control-seat',
        name: '主副驾座椅调整控制器总成',
        icon: '🪑',
        subAssemblies: [
          {
            id: 'hmi-control-seat-main',
            name: '主驾座椅调整控制器',
            parts: [
              { id: 'hmi-control-seat-01', name: '壳体', material: 'PC+ABS或PP-GF30', process: '注塑' },
              { id: 'hmi-control-seat-02', name: '盖板', material: 'PC+ABS或PP-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-airbag',
        name: '安全气囊控制器',
        icon: '🛡️',
        subAssemblies: [
          {
            id: 'hmi-control-airbag-main',
            name: '安全气囊控制器',
            parts: [
              { id: 'hmi-control-airbag-01', name: '上壳', material: 'PBT-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-door',
        name: '门模块控制器',
        icon: '🚪',
        subAssemblies: [
          {
            id: 'hmi-control-door-main',
            name: '门模块控制器',
            parts: [
              { id: 'hmi-control-door-01', name: '壳体', material: 'PC+ABS', process: '注塑' },
              { id: 'hmi-control-door-02', name: '接插件', material: 'PC+ABS', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-body',
        name: '车身控制器总成',
        icon: '🚘',
        subAssemblies: [
          {
            id: 'hmi-control-body-main',
            name: '车身控制器',
            parts: [
              { id: 'hmi-control-body-01', name: '上盖', material: 'PBT-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-driver-zone',
        name: '主驾区域控制器总成',
        icon: '🧭',
        subAssemblies: [
          {
            id: 'hmi-control-driver-zone-main',
            name: '主驾区域控制器',
            parts: [
              { id: 'hmi-control-driver-zone-01', name: '上盖', material: 'PP-GF30', process: '注塑' },
              { id: 'hmi-control-driver-zone-02', name: '底板', material: 'PP-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-rear-zone',
        name: '后区域控制器总成',
        icon: '🛰️',
        subAssemblies: [
          {
            id: 'hmi-control-rear-zone-main',
            name: '后区域控制器',
            parts: [
              { id: 'hmi-control-rear-zone-01', name: '底壳', material: 'PBT+PET-GF30', process: '注塑' },
              { id: 'hmi-control-rear-zone-02', name: '上壳', material: 'PBT+PET-GF30', process: '注塑' },
              { id: 'hmi-control-rear-zone-03', name: '护套盖', material: 'PBT+PET-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'hmi-control-trailer',
        name: '拖车模块',
        icon: '🛻',
        subAssemblies: [
          {
            id: 'hmi-control-trailer-main',
            name: '拖车模块',
            parts: [
              { id: 'hmi-control-trailer-01', name: '控制器上盖', material: 'PA6-GF50', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hmi-communication',
    name: '通信与接收模块',
    icon: '📶',
    description: '用于承载射频接收等通信与信号接收硬件的外壳与配套件。',
    assemblies: [
      {
        id: 'hmi-communication-rf',
        name: '射频接收器总成',
        icon: '📡',
        subAssemblies: [
          {
            id: 'hmi-communication-rf-main',
            name: '射频接收器',
            parts: [
              { id: 'hmi-communication-rf-01', name: '上壳体', material: 'PP-GF30', process: '注塑' },
              { id: 'hmi-communication-rf-02', name: '下壳体', material: 'PP-GF30', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hmi-other',
    name: '其他HMI模块',
    icon: '🧩',
    description: '保留未适合单独扩展为显示、音响、控制或通信域的座舱交互模块。',
    assemblies: [],
  },
];
