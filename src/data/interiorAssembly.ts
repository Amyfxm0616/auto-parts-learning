export interface InteriorPart {
  id: string;
  name: string;
  material: string;   // 典型材料
  process: string;    // 典型工艺
  imageUrl?: string;  // 零件图片路径
}

export interface InteriorSubAssembly {
  id: string;
  name: string;
  parts: InteriorPart[];
}

export interface InteriorAssembly {
  id: string;
  name: string;
  icon: string;
  subAssemblies: InteriorSubAssembly[];
}

export const interiorAssemblyData: InteriorAssembly[] = [
  {
    id: 'ia-01',
    name: '仪表板总成',
    icon: '🖥️',
    subAssemblies: [
      {
        id: 'ia-01-01',
        name: '仪表板本体总成',
        parts: [
          { id: 'ia-01-01-01', name: '仪表板本体骨架', material: 'PP-LGF20', process: '注塑', imageUrl: '/images/parts/仪表板本体.jpg' },
        ],
      },
      {
        id: 'ia-01-02',
        name: '仪表板上盖板总成',
        parts: [
          { id: 'ia-01-02-01', name: '仪表板上盖板', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆', imageUrl: '/images/parts/仪表板本体.jpg' },
        ],
      },
      {
        id: 'ia-01-03',
        name: '气囊框总成',
        parts: [
          { id: 'ia-01-03-01', name: '气囊框', material: 'TPO', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-04',
        name: '前除霜格栅盖板总成',
        parts: [
          { id: 'ia-01-04-01', name: '前除霜格栅盖板', material: 'PC+ABS', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-05',
        name: '前除霜风道总成',
        parts: [
          { id: 'ia-01-05-01', name: '前除霜风道前段', material: 'PP-TD20', process: '注塑' },
          { id: 'ia-01-05-02', name: '前除霜风道后段', material: 'PP-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-06',
        name: '吹面风道总成',
        parts: [
          { id: 'ia-01-06-01', name: '吹面风道', material: 'HDPE', process: '吹塑' },
        ],
      },
      {
        id: 'ia-01-07',
        name: '左侧除霜风道总成',
        parts: [
          { id: 'ia-01-07-01', name: '左侧除霜风道', material: 'HDPE', process: '吹塑' },
        ],
      },
      {
        id: 'ia-01-08',
        name: '右侧除霜风道总成',
        parts: [
          { id: 'ia-01-08-01', name: '右侧除霜风道', material: 'HDPE', process: '吹塑' },
        ],
      },
      {
        id: 'ia-01-09',
        name: '中下护板总成',
        parts: [
          { id: 'ia-01-09-01', name: '中下护板骨架', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆', imageUrl: '/images/parts/下护板.jpg' },
          { id: 'ia-01-09-02', name: '香氛饰盖', material: 'PA6-GF30', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-10',
        name: '仪表板右下护板总成',
        parts: [
          { id: 'ia-01-10-01', name: '仪表板右下护板', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆', imageUrl: '/images/parts/下护板.jpg' },
          { id: 'ia-01-10-02', name: '手套箱开启拉手盒装饰圈', material: 'PC+ABS', process: '注塑+电镀' },
          { id: 'ia-01-10-03', name: '手套箱内斗本体', material: 'PP+EPDM-TD20', process: '注塑+植绒' },
          { id: 'ia-01-10-04', name: '手套箱左/右锁杆', material: 'PA6-GF30', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-11',
        name: '手套箱开启拉手总成',
        parts: [
          { id: 'ia-01-11-01', name: '手套箱开启拉', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-01-11-02', name: '手套箱开启拉手盒', material: 'PA6-GF30', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-12',
        name: '仪表板左/右包覆饰板分总成',
        parts: [
          { id: 'ia-01-12-01', name: '仪表板包覆饰板', material: 'PC+ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-01-13',
        name: '手套箱总成',
        parts: [
          { id: 'ia-01-13-01', name: '手套箱外板', material: 'PP+EPDM-TD20', process: '表皮包覆' },
        ],
      },
      {
        id: 'ia-01-14',
        name: '手套箱框总成',
        parts: [
          { id: 'ia-01-14-01', name: '手套箱框', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-01-15',
        name: '仪表板下装饰板总成',
        parts: [
          { id: 'ia-01-15-01', name: '仪表板下装饰板骨架', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-02',
    name: '副仪表板总成',
    icon: '🎛️',
    subAssemblies: [
      {
        id: 'ia-02-01',
        name: '副仪表板本体骨架总成',
        parts: [
          { id: 'ia-02-01-01', name: '副仪表板上本体骨架', material: 'PP-TD20', process: '注塑' },
          { id: 'ia-02-01-02', name: '副仪表板下本体骨架', material: 'PP-(GF20+TD10)', process: '注塑' },
          { id: 'ia-02-01-03', name: '副仪表板后风管', material: 'HDPE', process: '吹塑' },
        ],
      },
      {
        id: 'ia-02-02',
        name: '副仪表板上装饰板总成',
        parts: [
          { id: 'ia-02-02-01', name: '副仪表板上装饰板', material: 'PC+ABS', process: '注塑+表皮包覆' },
          { id: 'ia-02-02-02', name: '扶手骨架', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-03', name: '锁钩座', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-04', name: '锁钩', material: 'POM', process: '注塑' },
          { id: 'ia-02-02-05', name: '乘客侧锁钩', material: 'POM', process: '注塑' },
          { id: 'ia-02-02-06', name: '扶手箱灯安装支架', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-07', name: '驾驶员/乘客扶手内板', material: 'PC+ABS-GF10', process: '注塑+表皮包覆' },
          { id: 'ia-02-02-08', name: '驾驶员/乘客扶手外板', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-09', name: '副仪表板前杯托本体', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-10', name: '杯托上/下卡爪', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-02-11', name: '前杯托装饰条', material: 'PC+ABS', process: '注塑+电镀' },
          { id: 'ia-02-02-12', name: '副仪表板扶手按钮壳体', material: 'POM', process: '注塑' },
          { id: 'ia-02-02-13', name: '副仪表板扶手按钮面板/装饰条', material: 'PC+ABS', process: '注塑+电镀' },
          { id: 'ia-02-02-14', name: '副仪表板扶手按钮底座', material: 'PC+ABS', process: '注塑' },
        ],
      },
      {
        id: 'ia-02-03',
        name: '副仪表板中饰板总成',
        parts: [
          { id: 'ia-02-03-01', name: '副仪表板中饰板', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-02-04',
        name: '副仪表板后端盖板总成',
        parts: [
          { id: 'ia-02-04-01', name: '副仪表板后盖板本体', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-02-05',
        name: '副仪表板后储物盒总成',
        parts: [
          { id: 'ia-02-05-01', name: '副仪表板后储物盒外盖板', material: 'PP+EPDM-TD20', process: '注塑' },
          { id: 'ia-02-05-02', name: '副仪表板后储物盒内盖板/装饰条', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-02-05-03', name: '副仪表板后储物盒壳体', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-02-05-04', name: '后开放储物盒本体', material: 'PP+EPDM-TD20', process: '注塑' },
          { id: 'ia-02-05-05', name: '后储物盒垫', material: 'TPS', process: '注塑' },
          { id: 'ia-02-05-06', name: '副仪表板储物盒垫', material: 'TPS', process: '注塑' },
        ],
      },
      {
        id: 'ia-02-06',
        name: '副仪表板下饰板总成',
        parts: [
          { id: 'ia-02-06-01', name: '副仪表板下饰板本体', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-02-07',
        name: '车机防水罩总成',
        parts: [
          { id: 'ia-02-07-01', name: '车机防水罩本体', material: 'PP-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-02-08',
        name: '副仪表板手机盒总成',
        parts: [
          { id: 'ia-02-08-01', name: '副仪表板手机盒本体', material: 'PC+ABS/TPS', process: '双色注塑' },
          { id: 'ia-02-08-02', name: '前储物盒装饰条', material: 'PC+ABS', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-03',
    name: '门饰板总成',
    icon: '🚪',
    subAssemblies: [
      {
        id: 'ia-03-01',
        name: '前门本体总成',
        parts: [
          { id: 'ia-03-01-01', name: '前门本体骨架', material: 'PC+ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-02',
        name: '中饰板总成',
        parts: [
          { id: 'ia-03-02-01', name: '前门中饰板骨架', material: 'ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-03',
        name: '前门扶手总成',
        parts: [
          { id: 'ia-03-03-01', name: '前门扶手骨架', material: 'ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-04',
        name: '前门地图袋总成',
        parts: [
          { id: 'ia-03-04-01', name: '前门地图袋', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆' },
          { id: 'ia-03-04-02', name: '前门地图袋支架', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-05',
        name: '前门门板裙边总成',
        parts: [
          { id: 'ia-03-05-01', name: '前门门板裙边本体', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-06',
        name: '前门上装支架',
        parts: [
          { id: 'ia-03-06-01', name: '前门上装支架', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-07',
        name: '后门本体总成',
        parts: [
          { id: 'ia-03-07-01', name: '后门本体骨架', material: 'PC+ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-08',
        name: '后门中饰板总成',
        parts: [
          { id: 'ia-03-08-01', name: '后门中饰板骨架', material: 'ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-09',
        name: '后门扶手总成',
        parts: [
          { id: 'ia-03-09-01', name: '后门扶手骨架', material: 'ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-03-10',
        name: '后门地图袋总成',
        parts: [
          { id: 'ia-03-10-01', name: '后门地图袋', material: 'PP+EPDM-TD20', process: '注塑+表皮包覆' },
          { id: 'ia-03-10-02', name: '后门地图袋檐口支架', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-11',
        name: '后门拉手盒总成',
        parts: [
          { id: 'ia-03-11-01', name: '后门拉手盒', material: 'ABS', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-12',
        name: '前门扶手装饰板总成',
        parts: [
          { id: 'ia-03-12-01', name: '前门扶手装饰板本体/骨架', material: 'ABS', process: '注塑' },
        ],
      },
      {
        id: 'ia-03-13',
        name: '后门扶手装饰板总成',
        parts: [
          { id: 'ia-03-13-01', name: '后门扶手装饰板本体/骨架', material: 'ABS', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-04',
    name: '冰箱总成',
    icon: '❄️',
    subAssemblies: [
      {
        id: 'ia-04-01',
        name: '门体发泡组件',
        parts: [
          { id: 'ia-04-01-01', name: '门内壳', material: 'PC+ABS', process: '注塑' },
        ],
      },
      {
        id: 'ia-04-02',
        name: '抽屉运动机构组件',
        parts: [
          { id: 'ia-04-02-01', name: '抽屉内斗', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-04-02-02', name: '下轨', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-04-02-03', name: '卷簧座', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-04-02-04', name: '滚轮阻尼支架左/右', material: 'POM', process: '注塑' },
        ],
      },
      {
        id: 'ia-04-03',
        name: '箱体总成',
        parts: [
          { id: 'ia-04-03-01', name: '上/下外壳', material: 'PP-GF30', process: '注塑' },
          { id: 'ia-04-03-02', name: '箱框', material: 'PC+ABS', process: '注塑+喷漆' },
          { id: 'ia-04-03-03', name: '箱内胆背板', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-04-03-04', name: '灯盒上/下盖', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-04-03-05', name: '门外盖', material: 'PC+ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-04-04',
        name: '触摸面板总成',
        parts: [
          { id: 'ia-04-04-01', name: '触摸面板', material: 'PC+ABS/PC', process: '注塑' },
        ],
      },
      {
        id: 'ia-04-05',
        name: '直流风扇组件',
        parts: [
          { id: 'ia-04-05-01', name: '直流风扇', material: 'PBT-GF30', process: '注塑' },
        ],
      },
      {
        id: 'ia-04-06',
        name: '直流压缩机',
        parts: [
          { id: 'ia-04-06-01', name: '压缩机托板', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-04-06-02', name: '直流压缩机模块', material: 'ABS', process: '注塑' },
          { id: 'ia-04-06-03', name: '控制器', material: 'PP-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-05',
    name: '出风口总成',
    icon: '💨',
    subAssemblies: [
      {
        id: 'ia-05-01',
        name: '副仪表板后出风口总成',
        parts: [
          { id: 'ia-05-01-01', name: '副仪表板后风口外圈亮条', material: 'PC+ABS', process: '注塑+喷漆' },
          { id: 'ia-05-01-02', name: '副仪表板后风口中央支架', material: 'PA6-GF50', process: '注塑' },
          { id: 'ia-05-01-03', name: '副仪表板后风口壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-01-04', name: '副仪表板侧出风口前排叶片', material: 'PA6-GF50', process: '注塑' },
          { id: 'ia-05-01-05', name: '副仪表板后出风口前排左侧支架', material: 'PA6-GF50', process: '注塑' },
          { id: 'ia-05-01-06', name: '副仪表板后出风口下层叶片', material: 'PP-TD40/TPS-SEBS', process: '双色注塑' },
        ],
      },
      {
        id: 'ia-05-02',
        name: '侧出风口总成',
        parts: [
          { id: 'ia-05-02-01', name: '侧封口面板', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-02-02', name: '侧风口上/下固定支架', material: 'POM', process: '注塑' },
          { id: 'ia-05-02-03', name: '侧风口上叶片', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-05-02-04', name: '侧风口左/右外壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-02-05', name: '侧风口后内壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-02-06', name: '侧风口风门上/下叶片', material: 'PA6-GF30/TPS', process: '双色注塑' },
          { id: 'ia-05-02-07', name: '侧风口电机支架', material: 'PA6-GF30', process: '注塑' },
        ],
      },
      {
        id: 'ia-05-03',
        name: '中央出风口总成',
        parts: [
          { id: 'ia-05-03-01', name: '中央风口面板', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-03-02', name: '中央风口上/下外壳体', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-05-03-03', name: '中风口上/下固定支架', material: 'POM', process: '注塑' },
          { id: 'ia-05-03-04', name: '中风口上叶片', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-05-03-05', name: '中风口风门上/下叶片', material: 'PA6-GF30/TPS', process: '双色注塑' },
          { id: 'ia-05-03-06', name: '中风口风门轨迹盘', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-05-03-07', name: '中风口电机支架', material: 'PA6-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-06',
    name: '门槛内饰板总成',
    icon: '⬜',
    subAssemblies: [
      {
        id: 'ia-06-01',
        name: '门槛内饰板总成',
        parts: [
          { id: 'ia-06-01-01', name: '门槛内饰板', material: 'PP+EPDM-TD10', process: '注塑' },
        ],
      },
      {
        id: 'ia-06-02',
        name: '尾门槛内饰板总成',
        parts: [
          { id: 'ia-06-02-01', name: '尾门槛内饰板', material: 'PP+EPDM-TD10', process: '注塑' },
        ],
      },
      {
        id: 'ia-06-03',
        name: '行李箱盖板支架总成',
        parts: [
          { id: 'ia-06-03-01', name: '行李箱盖板支架', material: 'PP-TD20', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-07',
    name: '立柱内饰板总成',
    icon: '📐',
    subAssemblies: [
      {
        id: 'ia-07-01',
        name: 'A柱上饰板总成',
        parts: [
          { id: 'ia-07-01-01', name: 'A柱上饰板骨架', material: 'PC+ABS', process: '注塑+织物包覆' },
        ],
      },
      {
        id: 'ia-07-02',
        name: 'A柱下饰板总成',
        parts: [
          { id: 'ia-07-02-01', name: 'A柱下饰板', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-07-03',
        name: 'B柱上饰板总成',
        parts: [
          { id: 'ia-07-03-01', name: 'B柱上饰板骨架', material: 'PC+ABS', process: '注塑+织物包覆' },
          { id: 'ia-07-03-02', name: 'B柱高调滑板', material: 'PA6/66-MD20', process: '注塑' },
          { id: 'ia-07-03-03', name: 'B柱高调按键', material: 'PP+EPDM-TD10', process: '注塑' },
        ],
      },
      {
        id: 'ia-07-04',
        name: 'B柱中饰板总成',
        parts: [
          { id: 'ia-07-04-01', name: 'B柱中饰板', material: 'PP+EPDM-TD10', process: '注塑' },
          { id: 'ia-07-04-02', name: 'B柱包覆饰板骨架', material: 'PC+ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-07-05',
        name: 'C柱上饰板总成',
        parts: [
          { id: 'ia-07-05-01', name: 'C柱上饰板', material: 'PP+EPDM-TD10', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-08',
    name: '顶棚总成',
    icon: '⬆️',
    subAssemblies: [
      {
        id: 'ia-08-01',
        name: '顶棚装饰板总成',
        parts: [
          { id: 'ia-08-01-01', name: '前顶灯支架', material: 'PC+ABS-GF20', process: '注塑' },
          { id: 'ia-08-01-02', name: '音响面罩', material: 'PP+EPDM-TD20', process: '注塑' },
          { id: 'ia-08-01-03', name: '音响面罩支架', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-08-01-04', name: '麦克风支架', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-08-01-05', name: '阅读灯面罩支架', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-08-01-06', name: 'A柱加强框', material: 'PC+ABS', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-09',
    name: '内后视镜上/下罩壳总成',
    icon: '🔍',
    subAssemblies: [
      {
        id: 'ia-09-01',
        name: '内后视镜上/下罩壳总成',
        parts: [
          { id: 'ia-09-01-01', name: '内后视镜上/下罩壳', material: 'PC+ABS', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-10',
    name: '顶棚扶手总成',
    icon: '✋',
    subAssemblies: [
      {
        id: 'ia-10-01',
        name: '后排左/右侧顶棚拉手',
        parts: [
          { id: 'ia-10-01-01', name: '拉手本体', material: 'PA6-GF15', process: '注塑' },
          { id: 'ia-10-01-02', name: '侧基座', material: 'PA6-GF30', process: '注塑' },
          { id: 'ia-10-01-03', name: '侧饰条', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-10-01-04', name: '包覆骨架', material: 'PC+ABS-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-11',
    name: '后侧围内饰板总成',
    icon: '◀️',
    subAssemblies: [
      {
        id: 'ia-11-01',
        name: '后侧围上内饰板总成',
        parts: [
          { id: 'ia-11-01-01', name: '后侧围上内饰板本体', material: 'PP+EPDM-TD10', process: '注塑' },
          { id: 'ia-11-01-02', name: '后侧围安全带支撑支架本体', material: 'PP-GF20', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-02',
        name: '后侧围下内饰板总成',
        parts: [
          { id: 'ia-11-02-01', name: '后侧围下内饰板背面支架', material: 'PP-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-03',
        name: '左侧围泄压格栅总成',
        parts: [
          { id: 'ia-11-03-01', name: '左侧围泄压格栅', material: 'PP+EPDM-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-04',
        name: '侧围前内饰板总成',
        parts: [
          { id: 'ia-11-04-01', name: '侧围包覆件骨架', material: 'ABS', process: '注塑+表皮包覆' },
          { id: 'ia-11-04-02', name: '侧围前内饰板下部', material: 'PP+EPDM-TD10', process: '注塑' },
          { id: 'ia-11-04-03', name: '后侧围小扶手骨架', material: 'ABS', process: '注塑+表皮包覆' },
        ],
      },
      {
        id: 'ia-11-05',
        name: '左后侧围储物盒饰板总成',
        parts: [
          { id: 'ia-11-05-01', name: '后侧围储物盒饰板本体', material: 'PP-TD20', process: '注塑+针刺毯面包覆' },
        ],
      },
      {
        id: 'ia-11-06',
        name: '后侧围内饰安装支架总成',
        parts: [
          { id: 'ia-11-06-01', name: '后侧围内饰安装支架本体', material: 'PP-TD20', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-07',
        name: '侧围上饰板安装支架总成',
        parts: [
          { id: 'ia-11-07-01', name: '侧围上饰板安装支架', material: 'PP-GF20', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-08',
        name: '后侧围开关面板总成',
        parts: [
          { id: 'ia-11-08-01', name: '后侧围开关面板', material: 'PC+ABS', process: '注塑' },
          { id: 'ia-11-08-02', name: '12V电源盖板', material: 'PC+ABS/TPV', process: '注塑' },
        ],
      },
      {
        id: 'ia-11-09',
        name: '行李箱中部支架总成',
        parts: [
          { id: 'ia-11-09-01', name: '行李箱中部支架', material: 'PP-GF30', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-12',
    name: '后背门内饰板总成',
    icon: '🔲',
    subAssemblies: [
      {
        id: 'ia-12-01',
        name: '后背门上/下内饰板总成',
        parts: [
          { id: 'ia-12-01-01', name: '后背门上/下内饰板本体', material: 'PP+EPDM-TD10', process: '注塑' },
          { id: 'ia-12-01-02', name: '后背门上内饰板卡扣座', material: 'PP+EPDM-TD10', process: '注塑' },
          { id: 'ia-12-01-03', name: '后背门应急锁盖板/开启按钮', material: 'PP+EPDM-TD10', process: '注塑' },
        ],
      },
    ],
  },
  {
    id: 'ia-13',
    name: '地毯总成',
    icon: '🟫',
    subAssemblies: [
      {
        id: 'ia-13-01',
        name: '主驾地毯总成',
        parts: [
          { id: 'ia-13-01-01', name: '主驾地毯垫块', material: 'EPP', process: '发泡' },
          { id: 'ia-13-01-02', name: '歇脚板', material: 'PP/PE', process: '注塑' },
        ],
      },
      {
        id: 'ia-13-02',
        name: '副驾地毯总成',
        parts: [
          { id: 'ia-13-02-01', name: '副驾地毯垫块', material: 'EPP', process: '发泡' },
          { id: 'ia-13-02-02', name: 'VIN指示标牌', material: 'ABS', process: '注塑' },
          { id: 'ia-13-02-03', name: '地毯副驾侧格栅', material: 'PP-TD20', process: '注塑' },
          { id: 'ia-13-02-04', name: '地毯副驾侧格栅支架', material: 'PP-GF20', process: '注塑' },
        ],
      },
      {
        id: 'ia-13-03',
        name: '二排地毯总成',
        parts: [
          { id: 'ia-13-03-01', name: '二排地毯垫块', material: 'EPP', process: '发泡' },
        ],
      },
    ],
  },
];