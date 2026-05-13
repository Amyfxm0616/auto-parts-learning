// 直接定义类型避免导入问题
interface Part {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  subcategory?: string;
  materials: string[];
  materialReasons?: Record<string, string>;
  primaryMaterial?: string;
  imageUrl?: string;
  modelUrl?: string;
  reportUrl?: string;
  description?: string;
  function?: string;
  workingConditions?: {
    temperature?: string;
    pressure?: string;
    load?: string;
    environment?: string;
  };
  manufacturingProcess?: string[];
}

export const parts: Part[] = [
  // 内饰-仪表板
  {
    id: 'part-001',
    name: '仪表板本体',
    nameEn: 'Dashboard Main Body',
    category: '座舱系统',
    subcategory: '内饰-仪表板-本体',
    materials: ['mat-004', 'mat-005'],
    imageUrl: '/images/parts/dashboard-main-body.jpg',
    description: '仪表板主体结构，承载所有功能模块。',
    function: '支撑仪表、安全气囊，提供储物空间。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '室内、紫外线照射'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },
  {
    id: 'part-002',
    name: '仪表板侧饰板',
    nameEn: 'Dashboard Side Trim',
    category: '座舱系统',
    subcategory: '内饰-仪表板-侧饰板',
    materials: ['mat-004'],
    description: '仪表板两侧的装饰面板。',
    function: '装饰仪表板侧面，遮盖结构件。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '室内'
    },
    manufacturingProcess: ['注塑成型']
  },

  // 内饰-门板
  {
    id: 'part-003',
    name: '门板本体',
    nameEn: 'Door Panel Main Body',
    category: '座舱系统',
    subcategory: '内饰-门板-本体',
    materials: ['mat-004', 'mat-005'],
    description: '车门内侧的主要装饰面板。',
    function: '装饰车门，集成窗控、门把手。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '频繁接触、振动'
    },
    manufacturingProcess: ['注塑成型', '软包', '装配']
  },
  {
    id: 'part-003-1',
    name: '上饰板骨架',
    nameEn: 'Upper Trim Panel Frame',
    category: '座舱系统',
    subcategory: '内饰-门板-本体',
    materials: ['mat-027', 'mat-028'],
    description: '门板上部的骨架结构，X01车型使用PC/ABS，W01车型使用ABS H3。',
    function: '支撑上饰板，提供结构强度。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '室内、紫外线照射'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-003-2',
    name: '中饰板骨架',
    nameEn: 'Middle Trim Panel Frame',
    category: '座舱系统',
    subcategory: '内饰-门板-本体',
    materials: ['mat-004', 'mat-028'],
    description: '门板中部的骨架结构，X01车型使用ABS，W01车型使用ABS H3。',
    function: '支撑中饰板，提供结构强度。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '室内、频繁接触'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-003-3',
    name: '裙板本体',
    nameEn: 'Skirt Panel Body',
    category: '座舱系统',
    subcategory: '内饰-门板-本体',
    materials: ['mat-029', 'mat-030'],
    description: '门板下部的裙板，X01车型使用PP-EPDM-TD20，W01车型使用PP-EPDM-M10。',
    function: '装饰门板下部，防止灰尘进入。',
    workingConditions: {
      temperature: '-30至80°C',
      environment: '频繁接触、污染'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-003-4',
    name: '地图袋',
    nameEn: 'Map Pocket',
    category: '座舱系统',
    subcategory: '内饰-门板-储物盒',
    materials: ['mat-030'],
    description: '门板上的储物袋，W01车型使用PP-EPDM-M10。',
    function: '提供储物空间，放置地图、文件等物品。',
    workingConditions: {
      temperature: '-30至70°C',
      environment: '频繁开合、承重'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-004',
    name: '门板扶手',
    nameEn: 'Door Armrest',
    category: '座舱系统',
    subcategory: '内饰-门板-扶手',
    materials: ['mat-004'],
    description: '门板上的扶手，提供舒适的手臂支撑。',
    function: '提供手臂支撑，关门时的把手。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '频繁接触、承重'
    },
    manufacturingProcess: ['注塑成型', '软包']
  },
  {
    id: 'part-004-1',
    name: '左前门拉手盒骨架',
    nameEn: 'Front Left Door Handle Box Frame',
    category: '座舱系统',
    subcategory: '内饰-门板-扶手',
    materials: ['mat-004', 'mat-027'],
    description: '左前门拉手盒的骨架结构，X01车型使用ABS，W01车型使用PC/ABS。',
    function: '支撑拉手盒，提供拉手安装基础。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '频繁拉拽、承重'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-004-2',
    name: '拉手本体',
    nameEn: 'Handle Body',
    category: '座舱系统',
    subcategory: '内饰-门板-扶手',
    materials: ['mat-029', 'mat-028'],
    description: '门内拉手主体，X01车型使用PP-EPDM-TD20，W01车型使用ABS H3。',
    function: '提供拉拽门的功能，便于开关门。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '频繁拉拽、承重'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-004-3',
    name: '扶手饰板本体',
    nameEn: 'Armrest Trim Body',
    category: '座舱系统',
    subcategory: '内饰-门板-扶手',
    materials: ['mat-028'],
    description: '扶手上的饰板，W01车型使用ABS H3，X01车型使用ABS H3。',
    function: '装饰扶手，提供美观的外观。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '频繁接触'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-004-4',
    name: '靠枕本体',
    nameEn: 'Armrest Headrest Body',
    category: '座舱系统',
    subcategory: '内饰-门板-扶手',
    materials: ['mat-028'],
    description: '扶手上的靠枕，W01车型使用ABS H3，X01车型使用ABS H3。',
    function: '提供舒适的手臂支撑。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '频繁接触、承重'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-005',
    name: '车门密封条',
    nameEn: 'Door Seal',
    category: '座舱系统',
    subcategory: '内饰-门板-本体',
    materials: ['mat-008'],
    description: '橡胶密封条，防止雨水和噪音进入车内。',
    function: '密封车门，隔音隔水，缓冲关门冲击。',
    workingConditions: {
      temperature: '-40至80°C',
      environment: '挤压、紫外线、臭氧老化'
    },
    manufacturingProcess: ['挤出成型', '硫化']
  },

  // 内饰-CNSL
  {
    id: 'part-006',
    name: 'CNSL本体',
    nameEn: 'Console Main Body',
    category: '座舱系统',
    subcategory: '内饰-CNSL-本体',
    materials: ['mat-004', 'mat-005'],
    description: '中控台主体结构。',
    function: '集成中控屏、空调控制等功能。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '室内、频繁操作'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },
  {
    id: 'part-007',
    name: '中央扶手箱',
    nameEn: 'Center Armrest Box',
    category: '座舱系统',
    subcategory: '内饰-CNSL-扶手箱',
    materials: ['mat-004'],
    description: '前排座椅之间的扶手箱，内部含储物空间。',
    function: '提供手臂支撑，储物功能。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '频繁开启、承重'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 内饰-立柱
  {
    id: 'part-008',
    name: 'A柱内饰',
    nameEn: 'A-Pillar Trim',
    category: '座舱系统',
    subcategory: '内饰-立柱-A柱',
    materials: ['mat-004'],
    description: 'A柱的装饰覆盖件。',
    function: '装饰A柱，隐藏结构和线束。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '紫外线照射'
    },
    manufacturingProcess: ['注塑成型']
  },
  {
    id: 'part-009',
    name: 'B柱内饰',
    nameEn: 'B-Pillar Trim',
    category: '座舱系统',
    subcategory: '内饰-立柱-B柱',
    materials: ['mat-004'],
    description: 'B柱的装饰覆盖件，含安全带固定点。',
    function: '装饰B柱，集成安全带安装点。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '承受安全带拉力'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 内饰-顶棚
  {
    id: 'part-010',
    name: '顶棚内饰本体',
    nameEn: 'Headliner Main Body',
    category: '座舱系统',
    subcategory: '内饰-顶棚-顶棚本体',
    materials: ['mat-004'],
    description: '车顶内侧的装饰覆盖件，具有隔音隔热功能。',
    function: '装饰车顶，隔音隔热，安装阅读灯。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '紫外线照射、温度变化'
    },
    manufacturingProcess: ['热压成型', '复合']
  },
  {
    id: 'part-011',
    name: '遮阳板',
    nameEn: 'Sun Visor',
    category: '座舱系统',
    subcategory: '内饰-顶棚-遮阳板',
    materials: ['mat-004'],
    description: '可翻转的遮阳板，遮挡阳光直射。',
    function: '遮挡阳光，部分带化妆镜和照明。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '频繁翻转、紫外线照射'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 内饰-地毯
  {
    id: 'part-012',
    name: '地毯总成',
    nameEn: 'Floor Carpet Assembly',
    category: '座舱系统',
    subcategory: '内饰-地毯-地毯总成',
    materials: ['mat-004'],
    description: '车内地板覆盖件，提供隔音和装饰功能。',
    function: '隔音、隔热、防尘、装饰。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '踩踏、磨损、潮湿'
    },
    manufacturingProcess: ['热压成型', '复合']
  },
  {
    id: 'part-013',
    name: '脚垫',
    nameEn: 'Floor Mat',
    category: '座舱系统',
    subcategory: '内饰-地毯-脚垫',
    materials: ['mat-008'],
    description: '可拆卸的脚垫，保护地毯并便于清洁。',
    function: '保护地毯，防污防水，易清洁。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '踩踏、磨损、污染'
    },
    manufacturingProcess: ['模压成型', '裁切']
  },

  // 被动安全
  {
    id: 'part-014',
    name: '主驾驶安全气囊',
    nameEn: 'Driver Airbag',
    category: '座舱系统',
    subcategory: '被动安全-安全气囊-主驾气囊',
    materials: ['mat-004'],
    description: '方向盘内的主驾驶安全气囊。',
    function: '碰撞时保护驾驶员头部和胸部。',
    workingConditions: {
      temperature: '-40至85°C',
      environment: '待机状态、瞬时爆发'
    },
    manufacturingProcess: ['织造', '折叠', '装配']
  },
  {
    id: 'part-015',
    name: '前排安全带',
    nameEn: 'Front Seat Belt',
    category: '座舱系统',
    subcategory: '被动安全-安全带-前排安全带',
    materials: ['mat-004'],
    description: '前排座椅的三点式安全带。',
    function: '约束乘员，防止碰撞时甩出。',
    workingConditions: {
      temperature: '-40至85°C',
      load: '高强度拉力',
      environment: '频繁使用、摩擦'
    },
    manufacturingProcess: ['织造', '装配']
  },

  // 电源与信号分布
  {
    id: 'part-016',
    name: '座舱主线束',
    nameEn: 'Cabin Main Harness',
    category: '座舱系统',
    subcategory: '电源与信号分布-线束-主线束',
    materials: ['mat-008', 'mat-004'],
    description: '座舱内的主要电气线束。',
    function: '传输电源和信号到各个电器设备。',
    workingConditions: {
      temperature: '-40至85°C',
      environment: '弯曲、振动'
    },
    manufacturingProcess: ['压接', '装配', '包扎']
  },
  {
    id: 'part-017',
    name: '高压连接器',
    nameEn: 'High Voltage Connector',
    category: '座舱系统',
    subcategory: '电源与信号分布-连接器-高压连接器',
    materials: ['mat-004'],
    description: '高压电气连接器。',
    function: '连接高压电气设备。',
    workingConditions: {
      temperature: '-40至125°C',
      environment: '高压、振动'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 灯具
  {
    id: 'part-018',
    name: '前排阅读灯',
    nameEn: 'Front Reading Light',
    category: '座舱系统',
    subcategory: '灯具-阅读灯-前排阅读灯',
    materials: ['mat-004'],
    description: '前排顶部的阅读灯。',
    function: '提供局部照明，方便阅读。',
    workingConditions: {
      temperature: '-40至85°C',
      environment: '室内、频繁开关'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },
  {
    id: 'part-019',
    name: '门板氛围灯',
    nameEn: 'Door Ambient Light',
    category: '座舱系统',
    subcategory: '灯具-氛围灯-门板氛围灯',
    materials: ['mat-004'],
    description: '门板上的装饰氛围灯。',
    function: '提供装饰照明，提升氛围。',
    workingConditions: {
      temperature: '-40至85°C',
      environment: '室内'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 智能电器
  {
    id: 'part-020',
    name: '中控大屏',
    nameEn: 'Center Display',
    category: '座舱系统',
    subcategory: '智能电器-显示屏-中控大屏',
    materials: ['mat-004', 'mat-005'],
    description: '触控式中央显示屏，控制车辆多媒体和功能设置。',
    function: '显示导航、媒体、车辆设置，触控交互。',
    workingConditions: {
      temperature: '-20至70°C',
      environment: '室内、频繁触控'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },
  {
    id: 'part-021',
    name: '液晶仪表屏',
    nameEn: 'LCD Instrument Cluster',
    category: '座舱系统',
    subcategory: '智能电器-显示屏-仪表屏',
    materials: ['mat-004', 'mat-005'],
    description: '全液晶数字仪表盘，显示车速、转速、导航等信息。',
    function: '为驾驶员提供实时的车辆状态和行驶信息。',
    workingConditions: {
      temperature: '-20至80°C',
      environment: '室内、紫外线照射'
    },
    manufacturingProcess: ['注塑成型', '表面处理', '装配']
  },
  {
    id: 'part-022',
    name: '空调控制器',
    nameEn: 'AC Controller',
    category: '座舱系统',
    subcategory: '智能电器-控制器-空调控制器',
    materials: ['mat-004'],
    description: '空调系统的控制单元。',
    function: '控制空调温度、风量、模式。',
    workingConditions: {
      temperature: '-40至85°C',
      environment: '室内'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },

  // 座椅
  {
    id: 'part-023',
    name: '座椅骨架',
    nameEn: 'Seat Frame',
    category: '座舱系统',
    subcategory: '座椅-骨架-座椅骨架',
    materials: ['mat-006'],
    description: '座椅的主要支撑结构，采用轻量化复合材料。',
    function: '支撑乘员重量，提供调节机构安装基础。',
    workingConditions: {
      load: '乘员重量、碰撞载荷',
      environment: '长期静载、动态冲击'
    },
    manufacturingProcess: ['模压成型', '装配']
  },
  {
    id: 'part-024',
    name: '座垫海绵',
    nameEn: 'Seat Cushion Foam',
    category: '座舱系统',
    subcategory: '座椅-发泡件-座垫海绵',
    materials: ['mat-004'],
    description: '座椅座垫的填充海绵，提供舒适的乘坐体验。',
    function: '缓冲振动，提供舒适性，支撑乘员身体。',
    workingConditions: {
      temperature: '-20至60°C',
      environment: '长期压缩、恢复'
    },
    manufacturingProcess: ['发泡成型', '裁切']
  },
  {
    id: 'part-025',
    name: '座垫面套',
    nameEn: 'Seat Cover',
    category: '座舱系统',
    subcategory: '座椅-面套-座垫面套',
    materials: ['mat-004'],
    description: '座椅表面的织物或皮革面套。',
    function: '保护海绵，提供舒适触感，装饰美观。',
    workingConditions: {
      temperature: '-20至60°C',
      environment: '频繁接触、磨损'
    },
    manufacturingProcess: ['裁剪', '缝纫']
  },

  // 车身系统
  {
    id: 'part-026',
    name: '格栅',
    nameEn: 'Grille',
    category: '车身系统',
    subcategory: '格栅',
    materials: ['mat-005', 'mat-027'],
    description: '车辆前部的进气格栅，用于进气散热和装饰。',
    function: '进气散热，支撑前大灯传感器，装饰车辆前脸。',
    workingConditions: {
      temperature: '-40至90°C',
      environment: '室外暴晒、石击、水汽'
    },
    manufacturingProcess: ['注塑成型', '电镀', '喷涂']
  },
  {
    id: 'part-027',
    name: '保险杠',
    nameEn: 'Bumper',
    category: '车身系统',
    subcategory: '保险杠',
    materials: ['mat-005', 'mat-029'],
    description: '用于吸收低速碰撞能量的前后保险杠。',
    function: '低速碰撞保护，美化车身外观，支撑牌照和传感器。',
    workingConditions: {
      temperature: '-40至90°C',
      environment: '室外暴晒、雨淋、石击、冲击'
    },
    manufacturingProcess: ['注塑成型', '喷涂']
  },
  {
    id: 'part-028',
    name: '前端框架',
    nameEn: 'Front End Module',
    category: '车身系统',
    subcategory: '前端框架',
    materials: ['mat-005', 'mat-019', 'mat-021'],
    description: '前部主要结构件，集中装配散热器、冷凝器、大灯等部件。',
    function: '支撑前部总成，承载冷却系统，安装大灯和传感器。',
    workingConditions: {
      temperature: '-40至110°C',
      environment: '发动机舱热环境、振动'
    },
    manufacturingProcess: ['注塑成型', '装配']
  },
  {
    id: 'part-029',
    name: '扰流板',
    nameEn: 'Spoiler',
    category: '车身系统',
    subcategory: '扰流板',
    materials: ['mat-005', 'mat-027'],
    description: '车辆后部的空气动力学部件。',
    function: '优化空气动力学性能，增加下压力，改善车辆稳定性。',
    workingConditions: {
      temperature: '-40至90°C',
      environment: '室外暴晒、高速气流'
    },
    manufacturingProcess: ['注塑成型', '喷涂']
  },
  {
    id: 'part-030',
    name: 'AGS（主动进气格栅）',
    nameEn: 'Active Grille Shutter',
    category: '车身系统',
    subcategory: 'AGS',
    materials: ['mat-005', 'mat-021', 'mat-020'],
    description: '可主动开闭的进气格栅系统。',
    function: '调节进气量以优化发动机热管理，降低风阻，提高燃油经济性。',
    workingConditions: {
      temperature: '-40至110°C',
      environment: '发动机舱、频繁动作、高温'
    },
    manufacturingProcess: ['注塑成型', '精密装配']
  },
  {
    id: 'part-031',
    name: '保险杠（模块化显示）',
    nameEn: 'Bumper (Modular Display)',
    category: '车身系统',
    subcategory: '保险杠',
    materials: ['mat-005', 'mat-029'],
    description: '用于吸收低速碰撞能量的前后保险杠（模块化显示版本）。',
    function: '低速碰撞保护，美化车身外观，支撑牌照和传感器。',
    workingConditions: {
      temperature: '-40至90°C',
      environment: '室外暴晒、雨淋、石击、冲击'
    },
    manufacturingProcess: ['注塑成型', '喷涂']
  },

  // 底盘系统
  {
    id: 'part-027',
    name: '轮胎',
    nameEn: 'Tire',
    category: '底盘系统',
    subcategory: '车轮系统',
    materials: ['mat-008'],
    description: '轮胎是车辆唯一与地面接触的部件。',
    function: '承载车重，提供牵引力和制动力，吸收路面冲击。',
    workingConditions: {
      temperature: '-40至100°C',
      load: '车辆重量、动态载荷',
      environment: '摩擦、冲击、臭氧老化'
    },
    manufacturingProcess: ['混炼', '压延', '成型', '硫化']
  }
];
