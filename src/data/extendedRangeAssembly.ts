export interface ERPart {
  id: string;
  name: string;
  material: string;
  process: string;
}

export interface ERSubAssembly {
  id: string;
  name: string;
  parts: ERPart[];
}

export interface ERAssembly {
  id: string;
  name: string;
  subAssemblies: ERSubAssembly[];
}

export interface ERSystemGroup {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  assemblies: ERAssembly[];
}

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',   hover: 'hover:bg-blue-50',   svg: '#3b82f6', svgLight: '#eff6ff', svgBorder: '#93c5fd' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200',text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  hover: 'hover:bg-amber-50',  svg: '#f59e0b', svgLight: '#fffbeb', svgBorder: '#fcd34d' },
  cyan:   { bg: 'bg-cyan-600',   light: 'bg-cyan-50',   border: 'border-cyan-200',  text: 'text-cyan-700',  badge: 'bg-cyan-100 text-cyan-700',    hover: 'hover:bg-cyan-50',   svg: '#06b6d4', svgLight: '#ecfeff', svgBorder: '#67e8f9' },
  green:  { bg: 'bg-green-600',  light: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700',   hover: 'hover:bg-green-50',  svg: '#22c55e', svgLight: '#f0fdf4', svgBorder: '#86efac' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-200',text: 'text-purple-700',badge: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-50', svg: '#a855f7', svgLight: '#faf5ff', svgBorder: '#d8b4fe' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700',badge: 'bg-orange-100 text-orange-700',  hover: 'hover:bg-orange-50', svg: '#f97316', svgLight: '#fff7ed', svgBorder: '#fdba74' },
};

export type ERColor = keyof typeof COLOR_MAP;
export const ER_COLOR_MAP = COLOR_MAP;

export const extendedRangeData: ERSystemGroup[] = [
  // ─── Group 1: 配气/进气系统 ────────────────────────────────────────
  {
    id: 'er-g01', name: '配气/进气系统', shortName: '配气进气', icon: '🌬️',
    color: 'blue',
    description: '负责发动机进气量控制与配气正时，涵盖正时链系统、涡轮增压、进气歧管及节气门等核心组件',
    assemblies: [
      {
        id: 'er-01', name: '正时系统总成',
        subAssemblies: [{
          id: 'er-01-01', name: '正时张紧器总成',
          parts: [
            { id: 'er-01-01-01', name: '通气阀',   material: 'PA66-GF15',    process: '注塑' },
            { id: 'er-01-01-02', name: '上导轨总成', material: 'PA66',         process: '注塑' },
            { id: 'er-01-01-03', name: '动导轨(A)', material: 'PA66+PTFE',    process: '注塑' },
            { id: 'er-01-01-04', name: '动导轨(B)', material: 'PA6-GF50',     process: '注塑' },
            { id: 'er-01-01-05', name: '定导轨',    material: 'PA66+PTFE',    process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-02', name: '进气歧管总成',
        subAssemblies: [{
          id: 'er-02-01', name: '进气歧管总成',
          parts: [
            { id: 'er-02-01-01', name: '进气歧管上片', material: 'PA6-GF30', process: '注塑' },
            { id: 'er-02-01-02', name: '进气歧管下片', material: 'PA6-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-03', name: '水空中冷器',
        subAssemblies: [{
          id: 'er-03-01', name: '水空中冷器',
          parts: [
            { id: 'er-03-01-01', name: '进气室', material: 'PA66-GF35', process: '注塑' },
            { id: 'er-03-01-02', name: '出气室', material: 'PA6-GF30',  process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-04', name: '涡轮增压器',
        subAssemblies: [{
          id: 'er-04-01', name: '涡轮增压器',
          parts: [
            { id: 'er-04-01-01', name: '执行器-组合件', material: '金属+PA6-GF40', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-05', name: '电子节气门阀体总成',
        subAssemblies: [
          {
            id: 'er-05-01', name: '充磁总成',
            parts: [
              { id: 'er-05-01-01', name: '齿轮轴',  material: '金属+PA66-GF33', process: '注塑' },
              { id: 'er-05-01-02', name: '弹簧衬套', material: 'PA66',           process: '注塑' },
            ],
          },
          {
            id: 'er-05-02', name: '节气门位置传感器',
            parts: [
              { id: 'er-05-02-01', name: 'TPS COVER盖板', material: 'PBT-GF30', process: '注塑' },
              { id: 'er-05-02-02', name: '惰轮',           material: 'PA66',     process: '注塑' },
              { id: 'er-05-02-03', name: '防尘帽',         material: 'HDPE',     process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'er-06', name: '电子节流阀体',
        subAssemblies: [{
          id: 'er-06-01', name: '电子节气门体总成',
          parts: [
            { id: 'er-06-01-01', name: '扇形齿轮+齿片', material: '金属+PA66-GF33', process: '注塑' },
            { id: 'er-06-01-02', name: '中间齿轮',       material: 'PA66',            process: '注塑' },
            { id: 'er-06-01-03', name: '转子+磁铁',      material: '金属+PA66-GF30', process: '注塑' },
          ],
        }],
      },
    ],
  },

  // ─── Group 2: 燃油/喷射系统 ───────────────────────────────────────
  {
    id: 'er-g02', name: '燃油/喷射系统', shortName: '燃油喷射', icon: '⛽',
    color: 'amber',
    description: '高压直喷燃油系统与蒸发排放控制，包括高压油泵、油轨喷嘴、碳罐电磁阀及各类燃油管路',
    assemblies: [
      {
        id: 'er-07', name: '油轨喷油器总成',
        subAssemblies: [{
          id: 'er-07-01', name: '高压油轨总成',
          parts: [
            { id: 'er-07-01-01', name: '螺线管组装件', material: 'PA66-GF35', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-08', name: '高压油泵总成',
        subAssemblies: [{
          id: 'er-08-01', name: '高压油泵总成',
          parts: [
            { id: 'er-08-01-01', name: '线圈', material: '金属+PA66', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-09', name: '碳罐电磁阀总成',
        subAssemblies: [{
          id: 'er-09-01', name: '碳罐电磁阀',
          parts: [
            { id: 'er-09-01-01', name: '壳体', material: 'PA66-GF35', process: '注塑' },
            { id: 'er-09-01-02', name: '滤网', material: 'PA66-GF35', process: '注塑' },
            { id: 'er-09-01-03', name: '端盖', material: 'PA66-GF35', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-10', name: '曲通管路及碳罐脱附管路总成',
        subAssemblies: [
          {
            id: 'er-10-01', name: '脏空气管总成',
            parts: [
              { id: 'er-10-01-01', name: '尼龙管',         material: 'PA612',        process: '注塑' },
              { id: 'er-10-01-02', name: '按钮式弯接头体', material: 'PA66-GF30',   process: '注塑' },
              { id: 'er-10-01-03', name: '隔离环',         material: 'PA66-GF30',   process: '注塑' },
              { id: 'er-10-01-04', name: '按钮式直接头体', material: 'PA66-GF30',   process: '注塑' },
            ],
          },
          {
            id: 'er-10-02', name: '碳罐脱附管路',
            parts: [
              { id: 'er-10-02-01', name: '尼龙成型管',       material: 'PA12+TIE+EVOH', process: '注塑' },
              { id: 'er-10-02-02', name: '按钮式弯接头体',   material: 'PA12-GF30',     process: '注塑' },
              { id: 'er-10-02-03', name: '按钮式直接头体',   material: 'PA12-GF30',     process: '注塑' },
              { id: 'er-10-02-04', name: '按钮式导向顶环',   material: 'PA66-GF30',     process: '注塑' },
              { id: 'er-10-02-05', name: '按钮式定位卡',     material: 'PA610',          process: '注塑' },
              { id: 'er-10-02-06', name: '隔离环',           material: 'PA12-GF30',     process: '注塑' },
            ],
          },
          {
            id: 'er-10-03', name: '新鲜空气管总成',
            parts: [
              { id: 'er-10-03-01', name: '成型尼龙管',         material: 'PA612',      process: '注塑' },
              { id: 'er-10-03-02', name: '按钮式大号直接头体', material: 'PA66-GF30', process: '注塑' },
              { id: 'er-10-03-03', name: '按钮式大号定位卡',   material: 'PA11',       process: '注塑' },
              { id: 'er-10-03-04', name: '按钮式大号导向顶环', material: 'PA12-GF30', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'er-11', name: '压后连接管组件总成',
        subAssemblies: [{
          id: 'er-11-01', name: '压后连接管组件',
          parts: [
            { id: 'er-11-01-01', name: '注塑管', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
    ],
  },

  // ─── Group 3: 冷却水系统 ──────────────────────────────────────────
  {
    id: 'er-g03', name: '冷却水系统', shortName: '冷却水', icon: '💧',
    color: 'cyan',
    description: '发动机热管理核心，通过节温器、电子水泵、水管及水套隔柱实现温度精确控制，防止过热',
    assemblies: [
      {
        id: 'er-12', name: '节温器总成',
        subAssemblies: [{
          id: 'er-12-01', name: '调温器总成',
          parts: [
            { id: 'er-12-01-01', name: '腔体',     material: 'PA66-GF35', process: '注塑' },
            { id: 'er-12-01-02', name: '节温器上盖', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-13', name: '电子水泵',
        subAssemblies: [{
          id: 'er-13-01', name: '电子水泵',
          parts: [
            { id: 'er-13-01-01', name: '叶轮组件',  material: 'PPS-GF40', process: '注塑' },
            { id: 'er-13-01-02', name: '线架',      material: 'PPS-GF40', process: '注塑' },
            { id: 'er-13-01-03', name: '固线架',    material: 'PPS-GF40', process: '注塑' },
            { id: 'er-13-01-04', name: '后盖组件',  material: 'PBT-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-14', name: '冷却水管包',
        subAssemblies: [
          {
            id: 'er-14-01', name: 'EGR冷却控制阀出水管',
            parts: [
              { id: 'er-14-01-01', name: '耐高温护套', material: 'PPS', process: '注塑' },
            ],
          },
          {
            id: 'er-14-02', name: '油冷器回水管',
            parts: [
              { id: 'er-14-02-01', name: '三通接头', material: 'PA66-GF30', process: '注塑' },
            ],
          },
          {
            id: 'er-14-03', name: '水泵到暖风出水管总成',
            parts: [
              { id: 'er-14-03-01', name: '开口型塑料卡夹', material: 'PA66', process: '注塑' },
              { id: 'er-14-03-02', name: '8字型塑料卡夹',  material: 'PA66', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'er-15', name: '水套隔柱总成',
        subAssemblies: [
          {
            id: 'er-15-01', name: '进气侧水套隔柱',
            parts: [
              { id: 'er-15-01-01', name: '进气侧水套隔柱', material: 'PPS-GF40', process: '注塑' },
            ],
          },
          {
            id: 'er-15-02', name: '排气侧水套隔柱',
            parts: [
              { id: 'er-15-02-01', name: '排气侧水套隔柱', material: 'PPS-GF40', process: '注塑' },
            ],
          },
        ],
      },
      {
        id: 'er-16', name: '活塞冷却喷嘴控制阀',
        subAssemblies: [{
          id: 'er-16-01', name: '活塞冷却喷嘴控制阀',
          parts: [
            { id: 'er-16-01-01', name: '电磁螺线管', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
    ],
  },

  // ─── Group 4: 传感器系统 ──────────────────────────────────────────
  {
    id: 'er-g04', name: '传感器系统', shortName: '传感器', icon: '📡',
    color: 'green',
    description: '实时监测发动机运行状态，包括位置、压力、温度等多类传感器，为ECU提供精确控制信号',
    assemblies: [
      {
        id: 'er-17', name: '凸轮轴位置传感器',
        subAssemblies: [{
          id: 'er-17-01', name: '凸轮轴位置传感器',
          parts: [
            { id: 'er-17-01-01', name: '连接头覆膜', material: 'PA66-GF30', process: '注塑' },
            { id: 'er-17-01-02', name: '斗',         material: 'PA66-GF30', process: '注塑' },
            { id: 'er-17-01-03', name: '支架',       material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-18', name: '曲轴位置传感器',
        subAssemblies: [{
          id: 'er-18-01', name: '曲轴位置传感器',
          parts: [
            { id: 'er-18-01-01', name: '连接头覆膜', material: 'PA66-GF30', process: '注塑' },
            { id: 'er-18-01-02', name: '斗',         material: 'PA66-GF30', process: '注塑' },
            { id: 'er-18-01-03', name: '支架',       material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-19', name: 'EGR压差传感器',
        subAssemblies: [{
          id: 'er-19-01', name: 'EGR压差传感器',
          parts: [
            { id: 'er-19-01-01', name: '壳体', material: 'PBT-GF30', process: '注塑' },
            { id: 'er-19-01-02', name: '盖板', material: 'PBT-GF30', process: '注塑' },
            { id: 'er-19-01-03', name: '载座', material: 'PPS',      process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-20', name: '爆震传感器',
        subAssemblies: [{
          id: 'er-20-01', name: '爆震传感器',
          parts: [
            { id: 'er-20-01-01', name: '壳体', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-21', name: '机油压力传感器',
        subAssemblies: [{
          id: 'er-21-01', name: '机油压力传感器',
          parts: [
            { id: 'er-21-01-01', name: '热敏电阻载体', material: 'PPS', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-22', name: 'EGR温度传感器',
        subAssemblies: [{
          id: 'er-22-01', name: 'EGR温度传感器',
          parts: [
            { id: 'er-22-01-01', name: '插头总成-塑料件', material: 'PPS', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-23', name: '进气温度压力传感器',
        subAssemblies: [{
          id: 'er-23-01', name: '进气温度压力传感器',
          parts: [
            { id: 'er-23-01-01', name: '壳体',   material: 'PBT-GF30', process: '注塑' },
            { id: 'er-23-01-02', name: '上盖板', material: 'PBT-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-24', name: '脱附诊断压力传感器',
        subAssemblies: [{
          id: 'er-24-01', name: '脱附诊断压力传感器',
          parts: [
            { id: 'er-24-01-01', name: '壳体', material: 'PBT-GF30', process: '注塑' },
            { id: 'er-24-01-02', name: '盖板', material: 'PBT-GF30', process: '注塑' },
          ],
        }],
      },
    ],
  },

  // ─── Group 5: 电机/点火系统 ───────────────────────────────────────
  {
    id: 'er-g05', name: '电机/点火系统', shortName: '电机点火', icon: '⚡',
    color: 'purple',
    description: '包括点火线圈、相位调节器电机及EGR混合阀，实现精确点火时序控制和排放优化',
    assemblies: [
      {
        id: 'er-25', name: '点火线圈',
        subAssemblies: [{
          id: 'er-25-01', name: '点火线圈',
          parts: [
            { id: 'er-25-01-01', name: '初级骨架',  material: 'PBT-GF30', process: '注塑' },
            { id: 'er-25-01-02', name: '次级骨架',  material: 'PPO-GF20', process: '注塑' },
            { id: 'er-25-01-03', name: 'C铁胶皮',   material: 'TPV',      process: '注塑' },
            { id: 'er-25-01-04', name: '接插头',    material: 'PBT-GF30', process: '注塑' },
            { id: 'er-25-01-05', name: 'CASE/壳体', material: 'PBT-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-26', name: '相位调节器电机',
        subAssemblies: [
          {
            id: 'er-26-01', name: '相位调节器电机',
            parts: [
              { id: 'er-26-01-01', name: '定子模块',  material: '铜线+硅钢片+PA46-GF30', process: '注塑' },
              { id: 'er-26-01-02', name: '注塑叠片',  material: '金属+PA46-GF30',        process: '注塑' },
              { id: 'er-26-01-03', name: '接插件',    material: 'PBT-GF30',               process: '注塑' },
            ],
          },
          {
            id: 'er-26-02', name: '相位调节器减速器',
            parts: [
              { id: 'er-26-02-01', name: '波发生器', material: '金属+PA46-GF30', process: '注塑' },
              { id: 'er-26-02-02', name: '保持架',   material: 'PA46-GF30',      process: '注塑' },
            ],
          },
          {
            id: 'er-26-03', name: '扭转减振器总成',
            parts: [
              { id: 'er-26-03-01', name: '尼龙压紧片', material: 'PA66-GF30', process: '注塑' },
              { id: 'er-26-03-02', name: '弹簧座',     material: 'PA66-GF30', process: '注塑' },
            ],
          },
          {
            id: 'er-26-04', name: 'EGR混合阀',
            parts: [
              { id: 'er-26-04-01', name: '盖板总成',   material: 'PBT-GF30',   process: '注塑' },
              { id: 'er-26-04-02', name: '中间齿轮',   material: 'PA46-GF50',  process: '注塑' },
              { id: 'er-26-04-03', name: '齿轮阀杆总成', material: 'PA46-GF50', process: '注塑' },
            ],
          },
        ],
      },
    ],
  },

  // ─── Group 6: 机油/曲通系统 ───────────────────────────────────────
  {
    id: 'er-g06', name: '机油/曲通系统', shortName: '机油曲通', icon: '🔩',
    color: 'orange',
    description: '润滑与曲轴箱通风系统，包括机油泵、油气分离器、扭振减振器及曲通管路，延长发动机寿命',
    assemblies: [
      {
        id: 'er-27', name: '扭转减振器',
        subAssemblies: [{
          id: 'er-27-01', name: '扭转减振器',
          parts: [
            { id: 'er-27-01-01', name: '衬套',       material: 'PA66-GF30', process: '注塑' },
            { id: 'er-27-01-02', name: '二级塑料垫片', material: 'PA66-GF30', process: '注塑' },
            { id: 'er-27-01-03', name: '一级塑料垫片', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-28', name: '机油泵总成',
        subAssemblies: [{
          id: 'er-28-01', name: '机油泵',
          parts: [
            { id: 'er-28-01-01', name: '集滤器总成', material: 'PA66-GF30', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-29', name: '机油标尺总成',
        subAssemblies: [{
          id: 'er-29-01', name: '机油标尺总成',
          parts: [
            { id: 'er-29-01-01', name: '手柄', material: 'PA66-GF35', process: '注塑' },
          ],
        }],
      },
      {
        id: 'er-30', name: '曲通核心系统',
        subAssemblies: [
          {
            id: 'er-30-01', name: '油气分离回油单向阀',
            parts: [
              { id: 'er-30-01-01', name: '回油单向阀本体', material: 'PA66-GF35', process: '注塑' },
              { id: 'er-30-01-02', name: '单向阀盖',       material: 'PA6-GF30',  process: '注塑' },
            ],
          },
          {
            id: 'er-30-02', name: '新鲜空气单向阀',
            parts: [
              { id: 'er-30-02-01', name: '新鲜空气单向阀上片', material: 'PA66-GF35', process: '注塑' },
            ],
          },
          {
            id: 'er-30-03', name: '油气分离器',
            parts: [
              { id: 'er-30-03-01', name: '油气分离器上片', material: 'PA66-GF35',          process: '注塑' },
              { id: 'er-30-03-02', name: '油气分离器下片', material: 'PA66-GF35',          process: '注塑' },
              { id: 'er-30-03-03', name: '精分离板',       material: 'PA66-GF35',          process: '注塑' },
              { id: 'er-30-03-04', name: '织物卡板',       material: 'PA66-(GF24+MD16)',   process: '注塑' },
              { id: 'er-30-03-05', name: '空滤侧管接头',   material: 'PA66-GF35',          process: '注塑' },
              { id: 'er-30-03-06', name: '歧管侧盖板',     material: 'PA66-GF35',          process: '注塑' },
              { id: 'er-30-03-07', name: '机油口盖本体',   material: 'PA66-GF30',          process: '注塑' },
              { id: 'er-30-03-08', name: '盖板',           material: 'PA66',               process: '注塑' },
            ],
          },
        ],
      },
    ],
  },
];
