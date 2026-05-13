/**
 * 拼音搜索工具
 * 支持全拼、简拼搜索
 */

// 简化的拼音映射表（常用汉字）
const pinyinMap: Record<string, string> = {
  '零': 'ling', '部': 'bu', '件': 'jian', '材': 'cai', '料': 'liao',
  '塑': 'su', '胶': 'jiao', '橡': 'xiang', '金': 'jin', '属': 'shu',
  '钢': 'gang', '铝': 'lv', '铜': 'tong', '铁': 'tie',
  '座': 'zuo', '椅': 'yi', '板': 'ban', '门': 'men', '窗': 'chuang',
  '灯': 'deng', '具': 'ju', '内': 'nei', '饰': 'shi', '外': 'wai',
  '仪': 'yi', '表': 'biao', '盘': 'pan', '方': 'fang', '向': 'xiang',
  '换': 'huan', '挡': 'dang', '杆': 'gan',
  '中': 'zhong', '控': 'kong', '台': 'tai', '副': 'fu',
  '车': 'che', '汽': 'qi', '顶': 'ding', '棚': 'peng',
  '地': 'di', '毯': 'tan', '脚': 'jiao', '垫': 'dian',
  '把': 'ba', '手': 'shou', '扶': 'fu',
  '遮': 'zhe', '阳': 'yang', '帘': 'lian',
  '音': 'yin', '响': 'xiang', '屏': 'ping', '幕': 'mu',
  '空': 'kong', '调': 'tiao', '出': 'chu', '风': 'feng', '口': 'kou',
  '电': 'dian', '气': 'qi', '智': 'zhi', '能': 'neng',
  '后': 'hou', '视': 'shi', '镜': 'jing',
  '带': 'dai', '安': 'an', '全': 'quan',
  '头': 'tou', '枕': 'zhen',
  '衬': 'chen', '套': 'tao', '护': 'hu', '盖': 'gai',
  '罩': 'zhao', '壳': 'qiao',
  '架': 'jia', '支': 'zhi', '撑': 'cheng',
  '管': 'guan', '线': 'xian', '束': 'shu',
  '阀': 'fa', '泵': 'beng',
  '传': 'chuan', '感': 'gan', '器': 'qi',
  '总': 'zong', '成': 'cheng',
  // 可以继续扩展...
};

/**
 * 将中文转换为拼音
 */
function toPinyin(text: string): string {
  return text
    .split('')
    .map(char => pinyinMap[char] || char)
    .join('');
}

/**
 * 获取拼音首字母
 */
function getPinyinInitials(text: string): string {
  return text
    .split('')
    .map(char => {
      const pinyin = pinyinMap[char];
      return pinyin ? pinyin[0] : char;
    })
    .join('');
}

/**
 * 模糊匹配
 * 支持拼音全拼、简拼、中文
 */
export function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // 直接文本匹配
  if (lowerText.includes(lowerQuery)) {
    return true;
  }

  // 拼音全拼匹配
  const pinyin = toPinyin(text).toLowerCase();
  if (pinyin.includes(lowerQuery)) {
    return true;
  }

  // 拼音首字母匹配
  const initials = getPinyinInitials(text).toLowerCase();
  if (initials.includes(lowerQuery)) {
    return true;
  }

  return false;
}

/**
 * 高亮匹配的文本
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

/**
 * 搜索建议
 * 基于已有数据提供搜索建议
 */
export function getSearchSuggestions(
  query: string,
  allItems: string[],
  limit: number = 5
): string[] {
  if (!query || query.length < 2) return [];

  const matches = allItems.filter(item => fuzzyMatch(item, query));
  return matches.slice(0, limit);
}

/**
 * 保存搜索历史
 */
const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export function saveSearchHistory(query: string): void {
  if (!query || query.trim().length < 2) return;

  const history = getSearchHistory();
  const newHistory = [
    query,
    ...history.filter(item => item !== query)
  ].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
}

export function getSearchHistory(): string[] {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function clearSearchHistory(): void {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}
