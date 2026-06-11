// 系统关键词映射
export const SYSTEM_KEYWORDS: Record<string, string[]> = {
  '座舱系统': [
    '仪表板', '仪表盘', '门板', '内饰', '座椅', '方向盘', '中控', 'CNSL',
    '扶手', '顶棚', '地毯', '安全带', '气囊', '阅读灯', '氛围灯',
    '显示屏', '中控大屏', '仪表屏', '音响', '扬声器', '空调控制',
    'dashboard', 'interior', 'seat', 'console', 'airbag', 'cockpit',
    '立柱', 'A柱', 'B柱', 'C柱', '遮阳板', '拉手', '杯架',
    '座垫', '靠背', '头枕', '滑轨', '面套', '海绵'
  ],
  '车身系统': [
    '车门', '车顶', '车窗', '后视镜', '保险杠', '引擎盖', '车架',
    '白车身', '外饰', '密封', '玻璃', '尾门', '翼子板',
    'door', 'roof', 'window', 'bumper', 'hood', 'frame', 'body',
    '车灯', '前大灯', '尾灯', '雾灯', '转向灯'
  ],
  '底盘系统': [
    '悬架', '减震器', '弹簧', '转向', '制动', '刹车', '轮胎',
    '悬挂', '摆臂', '球头', '转向节', '制动盘', '制动钳',
    'suspension', 'brake', 'wheel', 'tire', 'steering', 'chassis',
    '减震', '避震', '稳定杆', '连杆'
  ],
  '动力电池系统': [
    '电池', '电芯', 'BMS', '电池包', '模组', '充电',
    '电池组', '电池管理', '高压', '正极', '负极', '隔膜',
    'battery', 'cell', 'pack', 'module', 'charging', 'BMS',
    '电池壳', '电池盖', '连接片', '冷却板'
  ],
  '动力驱动系统': [
    '电机', '驱动', '减速器', '电控', '传动', '差速器',
    '马达', '电驱', '逆变器', '控制器', '齿轮', '轴承',
    'motor', 'drive', 'reducer', 'inverter', 'transmission',
    '定子', '转子', '变速箱', '齿轮箱'
  ],
  '热管理系统': [
    '空调', '冷却', '散热', '热泵', '压缩机', '冷凝器',
    '蒸发器', '膨胀阀', '冷却液', '水泵', '散热器', '风扇',
    'HVAC', 'cooling', 'heating', 'condenser', 'radiator',
    '温度', '热管理', 'PTC', '加热器'
  ],
  '增程系统': [
    '增程器', '发动机', '燃油', '排气', '发电机',
    '汽油', '喷油', '点火', '进气', '排放',
    'range extender', 'engine', 'generator', 'fuel',
    '活塞', '气缸', '涡轮', '催化器'
  ]
};

// 材料关键词映射
export const MATERIAL_KEYWORDS: Record<string, string[]> = {
  'PP': ['聚丙烯', 'PP', 'polypropylene', 'PP-T20', 'PP材料'],
  'ABS': ['ABS', '丙烯腈', 'ABS树脂', 'ABS材料'],
  'PC': ['聚碳酸酯', 'PC', 'polycarbonate', 'PC材料', 'PC板'],
  'PC/ABS': ['PC/ABS', 'PC+ABS', 'PCABS合金'],
  'PA': ['尼龙', 'PA', 'polyamide', 'PA6', 'PA66', 'PA材料'],
  'PBT': ['PBT', '聚对苯二甲酸丁二醇酯', 'PBT材料'],
  'POM': ['聚甲醛', 'POM', 'acetal', '赛钢', 'POM材料'],
  'PET': ['PET', '聚对苯二甲酸乙二醇酯', 'PET材料'],
  'PPS': ['PPS', '聚苯硫醚', 'PPS材料'],
  'PMMA': ['PMMA', '亚克力', '有机玻璃', '聚甲基丙烯酸甲酯'],
  '铝合金': ['铝', '铝合金', 'aluminum', 'Al', '铝材', '铝板'],
  '钢': ['钢', '钢材', 'steel', '钢板', '冷轧钢', '热轧钢', '高强钢'],
  '不锈钢': ['不锈钢', 'stainless steel', '不锈钢板'],
  '镁合金': ['镁合金', 'magnesium', 'Mg合金', '镁材'],
  '钛合金': ['钛合金', 'titanium', 'Ti合金', '钛材'],
  '铜合金': ['铜', '铜合金', 'copper', '黄铜', '青铜'],
  '碳纤维': ['碳纤维', 'carbon fiber', 'CFRP', '碳纤', 'CF'],
  '玻璃纤维': ['玻璃纤维', 'glass fiber', 'GF', '玻纤'],
  '硅橡胶': ['硅橡胶', 'silicone rubber', '硅胶', '硅橡胶材料'],
  'EPDM': ['EPDM', '三元乙丙橡胶', 'EPDM橡胶'],
  '天然橡胶': ['天然橡胶', 'natural rubber', 'NR', '橡胶'],
  'TPE': ['TPE', '热塑性弹性体', 'thermoplastic elastomer'],
  'TPV': ['TPV', '热塑性硫化橡胶', 'TPV材料'],
  'PU': ['聚氨酯', 'PU', 'polyurethane', 'PU泡沫', 'PU材料'],
  '泡沫': ['泡沫', '海绵', 'foam', 'EPP', 'EPS', 'EPE'],
  '无纺布': ['无纺布', '非织造布', 'non-woven', 'nonwoven'],
  '陶瓷': ['陶瓷', 'ceramic', '氧化铝陶瓷', '氮化硅陶瓷'],
  '玻璃': ['玻璃', 'glass', '钢化玻璃', '夹层玻璃']
};

// 技术参数正则表达式
export const TECH_PARAM_PATTERNS = {
  temperature: /(?:工作温度|耐温|使用温度|温度范围)[:：]?\s*(-?\d+)\s*[~至-]\s*(-?\d+)\s*[℃°C]/gi,
  pressure: /(?:压力|耐压|工作压力)[:：]?\s*(\d+\.?\d*)\s*(MPa|kPa|bar|Pa)/gi,
  load: /(?:负载|承载|载荷|承重)[:：]?\s*(\d+\.?\d*)\s*(kg|N|kN|ton|吨)/gi,
  environment: /(?:环境|使用环境|工况)[:：]?\s*([^\n。；;]{5,50})/gi
};
