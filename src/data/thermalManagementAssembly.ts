export interface ThermalPart {
  id: string;
  name: string;
  material: string;
  process: string;
}

export interface ThermalSubAssembly {
  id: string;
  name: string;
  parts: ThermalPart[];
}

export type ThermalCategory = 'refrigeration_heat' | 'cooling_heat' | 'air';

export interface ThermalAssembly {
  id: string;
  name: string;
  icon: string;
  category: ThermalCategory;
  subAssemblies: ThermalSubAssembly[];
}

export const thermalManagementData: ThermalAssembly[] = [
  // ── 制冷/热系统 ──────────────────────────────────────────────────────────
  {
    id: 'th-19',
    name: '三温区空调箱',
    icon: '🌬️',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-19-01',
        name: '三温区空调箱',
        parts: [
          { id: 'th-19-01-01', name: '补偿风门连杆', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-02', name: '补偿风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-03', name: '吹面风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-04', name: '除霜风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-05', name: '上温度风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-06', name: '下温度风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-07', name: '吹脚风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-08', name: '中Bypass风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-19-01-09', name: '后模式支架', material: 'PP-TD20', process: '注塑' },
          { id: 'th-19-01-10', name: '后模式盘', material: 'POM', process: '注塑' },
          { id: 'th-19-01-11', name: '后吹面曲柄', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-12', name: '后吹面连杆', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-13', name: '后吹脚连杆', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-14', name: 'Bypass曲柄', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-15', name: 'Bypass连杆', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-16', name: '除霜风门曲柄', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-17', name: '吹面电机曲柄', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-19-01-18', name: '温度驱动齿轮', material: 'PA66-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-06',
    name: '后空调箱总成',
    icon: '❄️',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-06-01',
        name: '后空调箱总成',
        parts: [
          { id: 'th-06-01-01', name: '壳体-下模式', material: 'PP-TD20', process: '注塑' },
          { id: 'th-06-01-02', name: '膨胀阀盖板', material: 'PP-TD20', process: '注塑' },
          { id: 'th-06-01-03', name: '模式风门', material: 'PP-TD40/TPS', process: '注塑' },
          { id: 'th-06-01-04', name: '模式电机摇臂', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-06-02',
        name: '风道-左前吹脚总成',
        parts: [
          { id: 'th-06-02-01', name: '风道-前吹脚', material: 'PP-TD20', process: '注塑' },
        ],
      },
      {
        id: 'th-06-03',
        name: '风道-外循环风道总成',
        parts: [
          { id: 'th-06-03-01', name: '风道-进风箱', material: 'PP-TD20', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-18',
    name: '电动压缩机',
    icon: '⚙️',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-18-01',
        name: '电动压缩机',
        parts: [
          { id: 'th-18-01-01', name: '静盘密封条', material: 'PPS', process: '注塑' },
          { id: 'th-18-01-02', name: '动盘密封条', material: 'PPS', process: '注塑' },
          { id: 'th-18-01-03', name: '节流管组件', material: 'PA66', process: '注塑' },
          { id: 'th-18-01-04', name: '高压插件', material: 'PA66+HNBR+H62', process: '注塑' },
          { id: 'th-18-01-05', name: '低压插件', material: 'PA66+HNBR+H62', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-05',
    name: '空调管路总成',
    icon: '🌡️',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-05-01',
        name: '前蒸发器低压管总成',
        parts: [
          { id: 'th-05-01-01', name: '防尘盖', material: 'LDPE', process: '注塑' },
          { id: 'th-05-01-02', name: '橡胶软管', material: 'PA6+IIR+PET+EPDM', process: '硫化' },
        ],
      },
      {
        id: 'th-05-02',
        name: '水冷冷凝器和气冷冷凝器连接管',
        parts: [
          { id: 'th-05-02-01', name: '防尘盖', material: 'LDPE', process: '注塑' },
          { id: 'th-05-02-02', name: '橡胶软管', material: 'PA6+IIR+PET+EPDM', process: '硫化' },
        ],
      },
      {
        id: 'th-05-03',
        name: '气液分离器低压管总成',
        parts: [
          { id: 'th-05-03-01', name: '防尘盖', material: 'LDPE', process: '注塑' },
          { id: 'th-05-03-02', name: '橡胶软管', material: 'PA6+IIR+PET+EPDM', process: '硫化' },
        ],
      },
      {
        id: 'th-05-04',
        name: '压缩机排气管总成',
        parts: [
          { id: 'th-05-04-01', name: '防尘盖', material: 'LDPE', process: '注塑' },
          { id: 'th-05-04-02', name: '橡胶软管', material: 'PA6+IIR+PET+EPDM', process: '硫化' },
        ],
      },
      {
        id: 'th-05-05',
        name: '压缩机吸气管总成',
        parts: [
          { id: 'th-05-05-01', name: '橡胶软管', material: 'PA6+IIR+PET+EPDM', process: '硫化' },
        ],
      },
    ],
  },
  {
    id: 'th-16',
    name: '制冷剂侧集成模块',
    icon: '🧊',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-16-01',
        name: '制冷剂侧集成模块',
        parts: [
          { id: 'th-16-01-01', name: '防尘盖', material: 'PP-TD20', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-10',
    name: '高压水暖加热器',
    icon: '♨️',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-10-01',
        name: '高压水暖加热器',
        parts: [
          { id: 'th-10-01-01', name: '底座', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-10-01-02', name: '高压接插件', material: 'PA66', process: '注塑' },
          { id: 'th-10-01-03', name: '低压接插件', material: 'PBT', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-02',
    name: '暖风电子水泵总成',
    icon: '💧',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-02-01',
        name: '暖风电子水泵',
        parts: [
          { id: 'th-02-01-01', name: '泵壳', material: 'PPS-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-15',
    name: '高压空气加热器',
    icon: '🔆',
    category: 'refrigeration_heat',
    subAssemblies: [
      {
        id: 'th-15-01',
        name: '高压空气加热器',
        parts: [
          { id: 'th-15-01-01', name: '壳体', material: 'PBT-GF30', process: '注塑' },
          { id: 'th-15-01-02', name: '汇流排支架', material: 'PBT-GF30', process: '注塑' },
          { id: 'th-15-01-03', name: 'IGBT压板', material: 'PBT-GF30', process: '注塑' },
        ],
      },
    ],
  },

  // ── 冷却/散热系统 ────────────────────────────────────────────────────────
  {
    id: 'th-07',
    name: '低温冷却管路总成',
    icon: '🔵',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-07-01',
        name: '电池包进水软管',
        parts: [
          { id: 'th-07-01-01', name: '成型管', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-01-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-07-02',
        name: '电池返气管',
        parts: [
          { id: 'th-07-02-01', name: '成型管', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-02-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-07-02-03', name: '管夹', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'th-07-03',
        name: '车机进水管',
        parts: [
          { id: 'th-07-03-01', name: '成型管', material: 'TPV/PET/TPV', process: '挤出' },
          { id: 'th-07-03-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-07-04',
        name: 'OBC出水软管',
        parts: [
          { id: 'th-07-04-01', name: '成型管', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-04-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-07-05',
        name: 'OBC进水软管',
        parts: [
          { id: 'th-07-05-01', name: '成型管', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-05-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-07-06',
        name: '电机副水箱补水软管',
        parts: [
          { id: 'th-07-06-01', name: '成型管A', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-06-02', name: '成型管B', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-06-03', name: '管夹', material: 'PA66', process: '注塑' },
          { id: 'th-07-06-04', name: '密封件', material: 'TPE', process: '注塑' },
          { id: 'th-07-06-05', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-07-07',
        name: '电机返气管',
        parts: [
          { id: 'th-07-07-01', name: '成型管', material: 'PA12/TIE/PP', process: '挤出' },
          { id: 'th-07-07-02', name: '快插接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-14',
    name: '电子冷却风扇',
    icon: '💨',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-14-01',
        name: '冷却风扇总成',
        parts: [
          { id: 'th-14-01-01', name: '护风圈', material: 'PP-LGF30', process: '注塑' },
          { id: 'th-14-01-02', name: '风扇叶轮', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-14-01-03', name: '导电支架', material: 'PA66-GF15', process: '注塑' },
          { id: 'th-14-01-04', name: '塑料挡圈', material: 'PA66-GF15', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-09',
    name: '膨胀水箱',
    icon: '🫙',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-09-01',
        name: '集成式发动机膨胀箱总成',
        parts: [
          { id: 'th-09-01-01', name: '壳体', material: 'PP', process: '注塑' },
          { id: 'th-09-01-02', name: '液位标尺', material: 'PP', process: '注塑' },
          { id: 'th-09-01-03', name: '液位器插针组件', material: 'PP-GF30', process: '注塑' },
          { id: 'th-09-01-04', name: '盖子总成', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-01-05', name: '阀体', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-01-06', name: '防尘盖', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-01-07', name: '上气门顶', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-09-02',
        name: '发动机膨胀箱总成',
        parts: [
          { id: 'th-09-02-01', name: '壳体', material: 'PP', process: '注塑' },
          { id: 'th-09-02-02', name: '液位标尺', material: 'PP', process: '注塑' },
          { id: 'th-09-02-03', name: '液位器插针组件', material: 'PP-GF30', process: '注塑' },
          { id: 'th-09-02-04', name: '盖子总成', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-02-05', name: '阀体', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-02-06', name: '防尘盖', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-09-02-07', name: '上气门顶', material: 'PA66-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-11',
    name: '水侧集成模块',
    icon: '🔧',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-11-01',
        name: '热管理集成模块',
        parts: [
          { id: 'th-11-01-01', name: '流道板', material: 'PP-GF20', process: '注塑' },
          { id: 'th-11-01-02', name: '电子水泵腔盖', material: 'PPS-GF40', process: '注塑' },
          { id: 'th-11-01-03', name: '定子组件连接板', material: 'PPA', process: '注塑' },
          { id: 'th-11-01-04', name: '电子水阀', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-11-01-05', name: '集成控制模块', material: 'PBT-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-12',
    name: '前端冷却模块',
    icon: '🌀',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-12-01',
        name: '发动机散热器总成',
        parts: [
          { id: 'th-12-01-01', name: '出水室总成', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-12-01-02', name: '进水室总成', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-12-02',
        name: '电机散热器总成',
        parts: [
          { id: 'th-12-02-01', name: '出水室总成', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-12-02-02', name: '进水室总成', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-12-03',
        name: '前气冷器总成',
        parts: [
          { id: 'th-12-03-01', name: '出水室总成', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-12-03-02', name: '进水室总成', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-12-04',
        name: '室外换热器',
        parts: [
          { id: 'th-12-04-01', name: '散热器上密封条总成', material: 'PP-TD20+TPV', process: '注塑' },
          { id: 'th-12-04-02', name: '散热器下密封条总成', material: 'PP-TD20+TPV', process: '注塑' },
          { id: 'th-12-04-03', name: '散热器上悬置', material: 'PA66-GF30/EPDM', process: '注塑' },
          { id: 'th-12-04-04', name: '散热器下悬置', material: 'PA66-GF30/EPDM', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-01',
    name: '电子三通阀总成',
    icon: '🔀',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-01-01',
        name: '电子三通阀',
        parts: [
          { id: 'th-01-01-01', name: '下壳体', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-01-01-02', name: '上壳体', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-01-01-03', name: '支架', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-01-01-04', name: '阀芯轴', material: 'PPA-GF30', process: '注塑' },
          { id: 'th-01-01-05', name: '阀芯底座', material: 'PPA-GF30', process: '注塑' },
          { id: 'th-01-01-06', name: '三通阀体', material: 'PA66-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-08',
    name: '高温水管总成',
    icon: '🔴',
    category: 'cooling_heat',
    subAssemblies: [
      {
        id: 'th-08-01',
        name: '高温散热器进水管总成',
        parts: [
          { id: 'th-08-01-01', name: '接头', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-08-01-02', name: '管夹', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'th-08-02',
        name: 'PTC进水软管',
        parts: [
          { id: 'th-08-02-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-02-02', name: '接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-08-03',
        name: '电池包出水软管',
        parts: [
          { id: 'th-08-03-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-03-02', name: '接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-08-04',
        name: '暖风补水管分总成',
        parts: [
          { id: 'th-08-04-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-04-02', name: '接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-08-05',
        name: '暖风除气管总成',
        parts: [
          { id: 'th-08-05-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-05-02', name: '尼龙管总成', material: 'PA12', process: '挤出' },
          { id: 'th-08-05-03', name: '开关阀', material: 'PA66-GF30', process: '注塑' },
          { id: 'th-08-05-04', name: '接头', material: 'PA66-GF30', process: '注塑' },
        ],
      },
      {
        id: 'th-08-06',
        name: '高温散热器返气管',
        parts: [
          { id: 'th-08-06-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-06-02', name: '限流阀', material: 'PA66', process: '注塑' },
        ],
      },
      {
        id: 'th-08-07',
        name: '散热器进水软管',
        parts: [
          { id: 'th-08-07-01', name: '橡胶管', material: 'EPDM', process: '硫化' },
          { id: 'th-08-07-02', name: '管夹', material: 'PA66', process: '注塑' },
        ],
      },
    ],
  },

  // ── 空气调节/输送系统 ────────────────────────────────────────────────────
  {
    id: 'th-13',
    name: '负离子发生器',
    icon: '⚡',
    category: 'air',
    subAssemblies: [
      {
        id: 'th-13-01',
        name: '负离子发生器',
        parts: [
          { id: 'th-13-01-01', name: '本体上盖', material: 'ABS', process: '—' },
          { id: 'th-13-01-02', name: '负离子模块', material: 'ABS', process: '—' },
          { id: 'th-13-01-03', name: '发射端盖', material: 'ABS', process: '—' },
          { id: 'th-13-01-04', name: '固定夹', material: 'ABS', process: '—' },
          { id: 'th-13-01-05', name: '本体下盖', material: 'ABS', process: '—' },
        ],
      },
    ],
  },
  {
    id: 'th-17',
    name: '回风风道总成',
    icon: '🔄',
    category: 'air',
    subAssemblies: [
      {
        id: 'th-17-01',
        name: '回风风道总成',
        parts: [
          { id: 'th-17-01-01', name: '回风风道本体', material: 'HDPE', process: '挤出' },
        ],
      },
    ],
  },
  {
    id: 'th-03',
    name: '主驾吹脚风道总成',
    icon: '🌊',
    category: 'air',
    subAssemblies: [
      {
        id: 'th-03-01',
        name: '主驾吹脚风道',
        parts: [
          { id: 'th-03-01-01', name: '风道-前吹脚', material: 'PP-TD20', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'th-04',
    name: '香氛发生器总成',
    icon: '🌸',
    category: 'air',
    subAssemblies: [
      {
        id: 'th-04-01',
        name: '香氛发生器',
        parts: [
          { id: 'th-04-01-01', name: '上壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'th-04-01-02', name: '下壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'th-04-01-03', name: '香氛盒', material: 'PC+ABS', process: '注塑' },
          { id: 'th-04-01-04', name: '风机支架', material: 'PC+ABS', process: '注塑' },
        ],
      },
    ],
  },
];
