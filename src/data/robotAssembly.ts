export interface RobotPart {
  id: string;
  name: string;
  material: string;
  process: string;
  description?: string;
  function?: string;
  suppliers?: string[];
}

export interface RobotSubAssembly {
  id: string;
  name: string;
  parts: RobotPart[];
}

export interface RobotAssembly {
  id: string;
  name: string;
  icon: string;
  color: string; // tailwind bg color class
  description: string;
  trend?: string;
  subAssemblies: RobotSubAssembly[];
}

export const robotAssemblyData: RobotAssembly[] = [
  // ─── 1. 机身结构 ────────────────────────────────────────────────
  {
    id: 'rb-01',
    name: '机身结构',
    icon: '🦾',
    color: 'blue',
    description: '机器人的骨骼与外壳体系，承载并保护内部系统，要求轻量化与高强度兼备',
    trend: '以塑代钢：PEEK、碳纤维复材取代铝合金，降重30%以上，配合3D打印快速制样',
    subAssemblies: [
      {
        id: 'rb-01-01',
        name: '骨架结构件',
        parts: [
          {
            id: 'rb-01-01-01',
            name: '胸腔前后盖',
            material: '碳纤维增强尼龙（FDM 3D打印）',
            process: 'FDM 3D打印 / 注塑',
            description: '保护机身内部零件，需有一定韧性与强度，原为铝合金机加工件，已完成轻量化替代',
            function: '机身前后防护、承载内部元器件安装点',
            suppliers: ['远铸智能', 'Stratasys', '长盈精密'],
          },
          {
            id: 'rb-01-01-02',
            name: '主骨架件',
            material: 'PEEK（聚醚醚酮）',
            process: '注塑 / 机加工',
            description: 'PEEK具备强度、耐磨、导热等综合特性，适用于承力骨架节点',
            function: '主承力结构，传递运动载荷',
            suppliers: ['威格斯', '中研新材料', '金发科技', '宁波华翔'],
          },
          {
            id: 'rb-01-01-03',
            name: '轻量化结构板',
            material: '碳纤维/玻纤增强尼龙（CF/GF-PA）',
            process: '注塑 / 层压成型',
            description: '功能集成化设计，强度与轻量化兼顾，实现以塑代钢',
            function: '隔舱板、安装基板等结构支撑',
            suppliers: ['BASF', 'EMS', '金发科技'],
          },
        ],
      },
      {
        id: 'rb-01-02',
        name: '外壳与外饰件',
        parts: [
          {
            id: 'rb-01-02-01',
            name: '头部外壳',
            material: '免喷涂PC/ABS',
            process: '注塑',
            description: '表面免喷涂，耐磨、外观优异，集成摄像头和传感器安装孔',
            function: '头部视觉系统防护与外观展示',
            suppliers: ['SABIC', '科思创', '三菱化学'],
          },
          {
            id: 'rb-01-02-02',
            name: '躯干外壳前盖',
            material: '碳纤维复合材料 / 免喷涂ABS',
            process: '碳纤维铺层 / 注塑',
            description: '轻量高强，外观可定制，兼顾工业质感',
            function: '躯干正面防护与外观',
            suppliers: ['模塑科技', '拓普集团', '星源卓镁'],
          },
          {
            id: 'rb-01-02-03',
            name: '四肢外壳件',
            material: 'PCABS / 碳纤维增强PA',
            process: '注塑',
            description: '覆盖手臂和腿部驱动系统，保护内部关节与线束',
            function: '四肢防护，防尘防碰撞',
            suppliers: ['模塑科技', '长盈精密'],
          },
        ],
      },
    ],
  },

  // ─── 2. 关节/驱动系统 ────────────────────────────────────────────
  {
    id: 'rb-02',
    name: '关节/驱动系统',
    icon: '⚙️',
    color: 'amber',
    description: '机器人运动的核心，通过电机+减速器+编码器实现精准关节控制，材料需兼顾轻量、耐磨、高刚性',
    trend: '高性能工程塑料关节壳体替代金属，配合谐波减速器实现高精度低背隙传动',
    subAssemblies: [
      {
        id: 'rb-02-01',
        name: '旋转关节总成',
        parts: [
          {
            id: 'rb-02-01-01',
            name: '关节壳体',
            material: 'PEEK / 碳纤增强PA66',
            process: '注塑 / 机加工',
            description: '高强度、耐磨、尺寸稳定，承受关节反复运动载荷',
            function: '关节结构外壳，集成轴承安装座',
            suppliers: ['威格斯', 'BASF', 'EMS'],
          },
          {
            id: 'rb-02-01-02',
            name: '谐波减速器',
            material: '钢（金属件） / PEEK（柔轮齿面涂层）',
            process: '精密机加工',
            description: '高精度、低背隙传动，体积小重量轻，是人形机器人关节核心器件',
            function: '电机降速增扭，实现精密位置控制',
            suppliers: ['绿地谐波', '汇川技术'],
          },
          {
            id: 'rb-02-01-03',
            name: '关节密封圈',
            material: 'FKM氟橡胶 / 硅橡胶',
            process: '模压成型',
            description: '防尘防水防润滑油泄漏，耐高温耐磨',
            function: '关节密封，延长机械寿命',
            suppliers: ['三花智控', '拓普集团'],
          },
        ],
      },
      {
        id: 'rb-02-02',
        name: '线性驱动总成',
        parts: [
          {
            id: 'rb-02-02-01',
            name: '丝杠螺母组件',
            material: 'POM（聚甲醛）/ 增强PA',
            process: '注塑 / 精密车削',
            description: 'POM自润滑性好、耐磨，用于滚珠丝杠螺母，降低摩擦系数',
            function: '旋转运动转直线运动，驱动腿部伸缩',
            suppliers: ['旭化成', '宝理塑料'],
          },
          {
            id: 'rb-02-02-02',
            name: '驱动电机定子绝缘',
            material: '聚酰亚胺（PI）薄膜 / 绝缘漆',
            process: '卷绕 / 浸漆',
            description: '耐高温、高压绝缘，确保电机长期可靠运行',
            function: '电机定子线圈绝缘保护',
            suppliers: ['杜邦', '东丽'],
          },
        ],
      },
    ],
  },

  // ─── 3. 灵巧手 ──────────────────────────────────────────────────
  {
    id: 'rb-03',
    name: '灵巧手',
    icon: '🖐️',
    color: 'purple',
    description: '模拟人类手部精细操作能力，集结构、传动、感知于一体，是机器人与环境交互的关键末端执行器',
    trend: '电子皮肤是研究重点：柔性传感材料实现多模态感知（压力、温度、滑动、纹理），从指尖向全身延伸',
    subAssemblies: [
      {
        id: 'rb-03-01',
        name: '手指骨架结构',
        parts: [
          {
            id: 'rb-03-01-01',
            name: '指骨结构件',
            material: 'PEEK / 碳纤维增强PA',
            process: '注塑 / SLS 3D打印',
            description: '高强度轻量，尺寸精度高，耐反复弯折疲劳',
            function: '手指骨架，传递抓握力',
            suppliers: ['威格斯', '傲意科技', '因时科技'],
          },
          {
            id: 'rb-03-01-02',
            name: '指尖端部件',
            material: 'TPU / 硅橡胶',
            process: '注塑 / 模压',
            description: '软质指尖提高抓取摩擦力，防止损伤被操作物体',
            function: '柔性接触，安全抓握',
            suppliers: ['信越化学', '瓦克化学', '万华化学'],
          },
          {
            id: 'rb-03-01-03',
            name: '肌腱传动绳',
            material: 'UHMWPE超高分子量聚乙烯纤维',
            process: '编织成型',
            description: '高强、抗蠕变、抗疲劳，质量极轻，是仿人腱驱灵巧手的理想传动材料',
            function: '腱绳传动，驱动手指弯曲',
            suppliers: ['塞拉尼斯', 'Avient', '帝人'],
          },
        ],
      },
      {
        id: 'rb-03-02',
        name: '电子皮肤',
        parts: [
          {
            id: 'rb-03-02-01',
            name: '柔性触觉传感器',
            material: 'TPU薄膜 + 纳米银线电极',
            process: '薄膜涂布 / 丝网印刷',
            description: '模仿人类皮肤感知能力，集成压力、温度、滑动多模态感知，柔性贴合曲面',
            function: '手掌和指尖触觉感知，实现精准抓握力控制',
            suppliers: ['福莱新材', '汉威科技', '冷石纳米'],
          },
          {
            id: 'rb-03-02-02',
            name: '导电弹性体基底',
            material: '有机硅（Silicone） + 碳纳米管',
            process: '浇注成型',
            description: '基底材料具备高弹性和生物相容性，碳纳米管赋予导电性',
            function: '传感器载体，兼具柔性与导电性',
            suppliers: ['信越化学', '瓦克', '天奈科技'],
          },
          {
            id: 'rb-03-02-03',
            name: '头部感知外壳',
            material: '聚碳酸酯（PC）/ 透明尼龙',
            process: '注塑',
            description: '耐磨、免喷涂，透光性好，可集成摄像头视觉模块',
            function: '头部传感器防护，外观透明化设计',
            suppliers: ['SABIC', '科思创', 'EMS'],
          },
        ],
      },
    ],
  },

  // ─── 4. 感知系统 ─────────────────────────────────────────────────
  {
    id: 'rb-04',
    name: '感知系统',
    icon: '👁️',
    color: 'cyan',
    description: '机器人的"眼睛和耳朵"，通过视觉、激光雷达、声学等多模态传感器实现环境感知与定位',
    trend: '传感器外壳向轻量免喷涂方向发展，透明PC/尼龙材料兼顾透光与强度需求',
    subAssemblies: [
      {
        id: 'rb-04-01',
        name: '视觉感知模组',
        parts: [
          {
            id: 'rb-04-01-01',
            name: '摄像头模组外壳',
            material: '免喷涂PC / 透明PC',
            process: '注塑',
            description: '耐磨、光学级透明，保护摄像头芯片，外观精致',
            function: 'RGB/深度相机防护，获取环境图像',
            suppliers: ['舜宇光学', 'SABIC', '科思创'],
          },
          {
            id: 'rb-04-01-02',
            name: '深度传感器外壳',
            material: 'PC+ABS / 玻纤增强PA',
            process: '注塑',
            description: '结构刚性好，尺寸稳定，耐冲击',
            function: '3D深度图像采集，用于障碍物识别和抓取定位',
            suppliers: ['奥比中光', 'SABIC'],
          },
          {
            id: 'rb-04-01-03',
            name: '激光雷达（LiDAR）外壳',
            material: '铝合金 + 光学级PC窗口',
            process: '压铸 / 注塑',
            description: '铝合金提供散热与屏蔽，PC窗口透光率高',
            function: '360°环境点云扫描，精确建图定位',
            suppliers: ['速腾聚创', '禾赛科技', '大疆'],
          },
        ],
      },
      {
        id: 'rb-04-02',
        name: '惯性与力觉感知',
        parts: [
          {
            id: 'rb-04-02-01',
            name: 'IMU惯性测量单元封装',
            material: '环氧树脂封装（EMC）',
            process: '模塑封装',
            description: '六轴加速度计+陀螺仪，封装材料需低应力、高尺寸稳定性',
            function: '实时感知机器人姿态和运动加速度',
            suppliers: ['博世', '英飞凌', '地平线'],
          },
          {
            id: 'rb-04-02-02',
            name: '六维力传感器外壳',
            material: '不锈钢 / 铝合金（结构件）',
            process: '机加工',
            description: '测量末端执行器的三维力和三维力矩，用于柔顺控制',
            function: '足底和腕部力矩感知，提升交互安全性',
            suppliers: ['ATI工业', 'Robotiq'],
          },
        ],
      },
    ],
  },

  // ─── 5. 控制与计算系统 ───────────────────────────────────────────
  {
    id: 'rb-05',
    name: '控制与计算系统',
    icon: '💻',
    color: 'indigo',
    description: '机器人的"大脑"，负责感知融合、运动规划和实时控制，核心材料为EMC封装料和PCB基板',
    trend: '高算力AI芯片集成，本地推理能力提升；EMC封装材料向低应力、高导热方向发展',
    subAssemblies: [
      {
        id: 'rb-05-01',
        name: '主控计算模块',
        parts: [
          {
            id: 'rb-05-01-01',
            name: 'AI计算板PCB',
            material: 'FR4高Tg环氧玻纤覆铜板',
            process: '多层板压合 / SMT贴装',
            description: '高频高速信号传输，低损耗，热膨胀系数匹配芯片封装',
            function: '承载AI推理芯片（GPU/NPU），完成视觉和运动规划算法',
            suppliers: ['英伟达', '高通', '地平线', '英特尔'],
          },
          {
            id: 'rb-05-01-02',
            name: '芯片封装料（EMC）',
            material: '环氧模塑料（EMC）',
            process: '注塑封装',
            description: '低翘曲、低应力、高导热，保护芯片免受湿热和机械损伤',
            function: '芯片封装保护，提升散热效率',
            suppliers: ['住友电木', '信越化学', '韩国三星SDI'],
          },
          {
            id: 'rb-05-01-03',
            name: 'EMI屏蔽罩',
            material: '导电金属涂层 / 不锈钢',
            process: '冲压 / 金属化喷涂',
            description: '防止高频信号干扰传感器和通信模块',
            function: '电磁屏蔽，确保感知数据准确性',
            suppliers: ['莱尔德', '贸泰电子'],
          },
        ],
      },
      {
        id: 'rb-05-02',
        name: '布线与连接',
        parts: [
          {
            id: 'rb-05-02-01',
            name: '主线束',
            material: 'XLPE/PVC绝缘 + TPU护套',
            process: '挤出成型 / 编织',
            description: '耐弯折、耐磨、柔性高，适应关节反复运动，TPU护套增加耐磨性',
            function: '全身电力和信号传输',
            suppliers: ['矢崎', '住友电工'],
          },
          {
            id: 'rb-05-02-02',
            name: '高密度连接器',
            material: 'PBT+GF / LCP液晶聚合物',
            process: '注塑',
            description: 'LCP耐高温、低介电损耗，适合高频信号连接器；PBT用于标准接口',
            function: '各模块快速插接，支持热插拔',
            suppliers: ['安费诺', '泰科电子', 'Molex'],
          },
        ],
      },
    ],
  },

  // ─── 6. 电源系统 ─────────────────────────────────────────────────
  {
    id: 'rb-06',
    name: '电源系统',
    icon: '🔋',
    color: 'green',
    description: '机器人的"心脏"，提供持续可靠的能量供给，要求高能量密度、安全防护和智能电源管理',
    trend: '磷酸铁锂（LFP）电池因安全性高成为主流选择；电池外壳向阻燃轻量化材料演进',
    subAssemblies: [
      {
        id: 'rb-06-01',
        name: '电池包总成',
        parts: [
          {
            id: 'rb-06-01-01',
            name: '电池包外壳',
            material: '阻燃PA66+GF / 铝合金',
            process: '注塑 / 压铸',
            description: 'UL94 V-0阻燃等级，高刚性、轻量，防止热失控扩散',
            function: '电芯机械保护与热隔离',
            suppliers: ['宁德时代', '兴旺达', '蜂巢能源'],
          },
          {
            id: 'rb-06-01-02',
            name: 'BMS电路板壳体',
            material: 'PEEK / 阻燃PC',
            process: '注塑',
            description: '耐高温、绝缘性能优异，防止BMS电路受热失效',
            function: '电池管理系统防护，监控单体电压和温度',
            suppliers: ['威格斯', 'SABIC'],
          },
          {
            id: 'rb-06-01-03',
            name: '电芯间隔热垫',
            material: '气凝胶隔热材料 / 云母片',
            process: '裁切 / 模压',
            description: '电芯间热隔离，防止热失控蔓延，耐高温压缩不变形',
            function: '电池热管理，抑制热失控扩散',
            suppliers: ['3M', '华玻集团'],
          },
        ],
      },
      {
        id: 'rb-06-02',
        name: '充电与配电',
        parts: [
          {
            id: 'rb-06-02-01',
            name: '充电接口外壳',
            material: 'PA66+GF / PBT',
            process: '注塑',
            description: '耐磨、耐插拔，满足IP54防尘防水要求',
            function: '外部充电连接，防止污染',
            suppliers: ['安费诺', '富士康'],
          },
          {
            id: 'rb-06-02-02',
            name: '高压线束绝缘护套',
            material: 'TPU / 硅橡胶',
            process: '挤出成型',
            description: '耐高压绝缘、耐弯折，硅橡胶版本耐温达200℃',
            function: '高压电路绝缘保护，防止短路',
            suppliers: ['住友电工', '矢崎'],
          },
        ],
      },
    ],
  },

  // ─── 7. 热管理系统 ───────────────────────────────────────────────
  {
    id: 'rb-07',
    name: '热管理系统',
    icon: '🌡️',
    color: 'orange',
    description: '控制电池、电机、计算单元的工作温度，防止过热导致性能下降或安全事故',
    trend: '导热硅胶垫、相变材料广泛应用；液冷管路向轻量柔性方向发展',
    subAssemblies: [
      {
        id: 'rb-07-01',
        name: '散热与导热',
        parts: [
          {
            id: 'rb-07-01-01',
            name: '导热硅胶垫',
            material: '导热硅橡胶（导热系数 3~6 W/m·K）',
            process: '模压 / 裁切',
            description: '填充芯片与散热器间的空气间隙，显著提升导热效率，柔软可压缩',
            function: '芯片、电机控制器的界面导热',
            suppliers: ['三花智控', '银轮股份', 'Bergquist'],
          },
          {
            id: 'rb-07-01-02',
            name: '相变导热垫',
            material: '相变材料（PCM，熔点45~55℃）',
            process: '涂布 / 裁切',
            description: '利用相变潜热吸收峰值热量，均温性好',
            function: '瞬态热缓冲，保护高功率器件',
            suppliers: ['3M', '霍尼韦尔'],
          },
          {
            id: 'rb-07-01-03',
            name: '散热器',
            material: '铝合金（6063-T5）',
            process: '挤出 / 压铸',
            description: '高导热率（~160 W/m·K），质轻，可阳极氧化增强散热面积',
            function: '计算模块和电机控制器主动/被动散热',
            suppliers: ['三花智控', '银轮股份'],
          },
        ],
      },
      {
        id: 'rb-07-02',
        name: '冷却管路',
        parts: [
          {
            id: 'rb-07-02-01',
            name: '冷却液管路',
            material: 'PA12 / 硅橡胶软管',
            process: '挤出成型',
            description: '耐冷却液腐蚀、耐压，柔性好适应关节弯折',
            function: '液冷循环，带走关节电机热量',
            suppliers: ['三花智控', '银轮股份'],
          },
          {
            id: 'rb-07-02-02',
            name: '水泵壳体',
            material: 'PA66+GF（30%）',
            process: '注塑',
            description: '耐冷却液、耐高温，高强度，尺寸稳定性好',
            function: '驱动冷却液循环',
            suppliers: ['三花智控'],
          },
        ],
      },
    ],
  },

  // ─── 8. 仿生组织 ─────────────────────────────────────────────────
  {
    id: 'rb-08',
    name: '仿生组织',
    icon: '🧬',
    color: 'pink',
    description: '模仿人体软组织特性，赋予机器人仿人外观与触感，是"类人化"趋势的核心材料方向',
    trend: '从工业机器人向家庭服务机器人延伸，仿生皮肤需兼顾亲肤性、三防（防雾/抗菌/抗静电）和智能传感',
    subAssemblies: [
      {
        id: 'rb-08-01',
        name: '仿生肌肉',
        parts: [
          {
            id: 'rb-08-01-01',
            name: '人工肌肉驱动单元（柔性树脂）',
            material: '光固化柔性光敏树脂',
            process: 'SLA光固化3D打印',
            description: '具备抗拉性与回弹性，多密度复合结构模拟肌肉梯度，支持智能传感集成',
            function: '软体驱动，模拟肌肉收缩运动',
            suppliers: ['博理新材', '华峰集团'],
          },
          {
            id: 'rb-08-01-02',
            name: '人工肌肉驱动单元（TPU）',
            material: 'TPU热塑性聚氨酯',
            process: 'SLS粉末3D打印',
            description: '抗拉强度高、回弹好，可快速打印复杂肌肉仿生结构',
            function: '软体驱动备选方案，工艺成本低',
            suppliers: ['BASF', '万华化学'],
          },
        ],
      },
      {
        id: 'rb-08-02',
        name: '仿生皮肤',
        parts: [
          {
            id: 'rb-08-02-01',
            name: '液态硅橡胶（LSR）仿生皮肤',
            material: '液态硅橡胶（LSR，医用级）',
            process: '液态注塑成型（LSR注塑）',
            description: '亲肤性极佳，生物相容性高，三防性能好，弹性与人体皮肤接近（60~80 Shore A）',
            function: '高仿真人体外皮，家庭服务机器人外观',
            suppliers: ['信越化学', '瓦克化学'],
          },
          {
            id: 'rb-08-02-02',
            name: 'TPE热塑弹性体皮肤',
            material: 'TPE热塑性弹性体',
            process: '注塑 / 共挤',
            description: '兼顾橡胶弹性和塑料可加工性，抗菌、抗静电、表面可着色，量产成本低',
            function: '工业/商用机器人外皮，亲肤防污',
            suppliers: ['胶宝', '奥世达', '金发科技'],
          },
          {
            id: 'rb-08-02-03',
            name: '智能感知皮肤（TPU复合）',
            material: 'TPU + 柔性电路',
            process: '粉末3D打印 / 柔性印刷',
            description: '集成传感功能，可感知压力和温度，三防处理，抗拉性和恢复性优异',
            function: '全身触觉感知皮肤，未来覆盖肩膀、大腿等部位',
            suppliers: ['BASF', '万华化学', '福莱新材'],
          },
        ],
      },
      {
        id: 'rb-08-03',
        name: '仿生肌腱与外衣',
        parts: [
          {
            id: 'rb-08-03-01',
            name: '仿生肌腱绳',
            material: 'UHMWPE超高分子量聚乙烯纤维',
            process: '编织成型',
            description: '抗蠕变、抗疲劳、高强低重，拉伸强度是钢的15倍，密度仅0.97 g/cm³，可大幅降本',
            function: '关节腱驱传动，模拟人体肌腱',
            suppliers: ['塞拉尼斯', 'Avient（DSM Dyneema）', '帝人'],
          },
          {
            id: 'rb-08-03-02',
            name: '外表织物衣层',
            material: '无缝3D立体编织面料（高弹氨纶混纺+抗菌纤维）',
            process: '无缝针织编织',
            description: '亲肤柔软，高弹力跟随机器人运动变形，抗菌、抗静电、三防处理',
            function: '机器人外衣，提升外观接受度，保护仿生皮肤',
            suppliers: ['申洲国际', '华利集团'],
          },
        ],
      },
    ],
  },
];
