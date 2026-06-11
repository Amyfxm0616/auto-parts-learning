import { SYSTEM_KEYWORDS, MATERIAL_KEYWORDS, TECH_PARAM_PATTERNS } from './keywords';
import { materials } from '../../data/materials';

export class KeywordMatcher {
  // 匹配系统
  static matchSystem(text: string): {
    system: string;
    confidence: number;
    subcategory?: string;
  } {
    const normalizedText = text.toLowerCase();
    const scores: Record<string, number> = {};

    // 计算每个系统的匹配分数
    for (const [system, keywords] of Object.entries(SYSTEM_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = normalizedText.match(regex);
        if (matches) {
          score += matches.length;
        }
      }
      scores[system] = score;
    }

    // 找出最高分
    const maxScore = Math.max(...Object.values(scores), 0);
    if (maxScore === 0) return { system: '', confidence: 0 };

    const bestMatch = Object.entries(scores).find(([_, s]) => s === maxScore)!;
    const confidence = Math.min(1, maxScore / 5);  // 归一化到0-1

    return { system: bestMatch[0], confidence };
  }

  // 匹配材料
  static matchMaterials(text: string): { names: string[]; ids: string[] } {
    const normalizedText = text.toLowerCase();
    const matchedNames = new Set<string>();

    for (const [materialName, keywords] of Object.entries(MATERIAL_KEYWORDS)) {
      for (const keyword of keywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          matchedNames.add(materialName);
          break;
        }
      }
    }

    // 映射材料名称到ID
    const names = Array.from(matchedNames);
    const ids = materials
      .filter(m => names.some(name =>
        m.name.includes(name) ||
        name.includes(m.name) ||
        m.nameEn?.toLowerCase().includes(name.toLowerCase())
      ))
      .map(m => m.id);

    return { names, ids };
  }

  // 提取技术参数
  static extractTechnicalParams(text: string): {
    temperature?: string;
    pressure?: string;
    load?: string;
    environment?: string;
  } {
    const params: any = {};

    // 温度
    const tempRegex = new RegExp(TECH_PARAM_PATTERNS.temperature);
    const tempMatch = tempRegex.exec(text);
    if (tempMatch) {
      params.temperature = `${tempMatch[1]}°C ~ ${tempMatch[2]}°C`;
    }

    // 压力
    const pressureRegex = new RegExp(TECH_PARAM_PATTERNS.pressure);
    const pressureMatch = pressureRegex.exec(text);
    if (pressureMatch) {
      params.pressure = `${pressureMatch[1]}${pressureMatch[2]}`;
    }

    // 负载
    const loadRegex = new RegExp(TECH_PARAM_PATTERNS.load);
    const loadMatch = loadRegex.exec(text);
    if (loadMatch) {
      params.load = `${loadMatch[1]}${loadMatch[2]}`;
    }

    // 环境
    const envRegex = new RegExp(TECH_PARAM_PATTERNS.environment);
    const envMatch = envRegex.exec(text);
    if (envMatch) {
      params.environment = envMatch[1].trim();
    }

    return params;
  }

  // 提取零部件名称（从文本中智能提取）
  static extractPartName(text: string): string {
    // 简单策略：取第一句话或前50个字符
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length < 100) {
      return firstLine.substring(0, 50);
    }

    // 尝试匹配标题模式（如："零部件名称："后的内容）
    const titleMatch = text.match(/(?:名称|部件名|零件名|产品名)[:：]\s*([^\n。；;]{2,50})/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // 默认返回前20个字符
    return text.substring(0, 20).trim();
  }

  // 提取描述（从文本中提取描述性段落）
  static extractDescription(text: string): string {
    // 移除零部件名称行
    const lines = text.split('\n').filter(line => line.trim().length > 10);

    // 尝试找到包含"描述"、"介绍"、"说明"的段落
    const descMatch = text.match(/(?:描述|介绍|说明|概述)[:：]\s*([^\n]+(?:\n[^\n]+){0,5})/i);
    if (descMatch) {
      return descMatch[1].trim();
    }

    // 返回前几行作为描述（跳过标题行）
    return lines.slice(1, 4).join(' ').substring(0, 200);
  }
}
