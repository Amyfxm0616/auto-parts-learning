import type { Question } from '../data/questions';

export interface ParsedQuestion {
  type: 'single' | 'multiple' | 'boolean' | 'fill' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: number | number[] | string | string[] | boolean;
  fillBlanks?: number;
  maxLength?: number;
  keywords?: string[];
  confidence: number;
}

/**
 * 判断题关键词
 */
const BOOLEAN_KEYWORDS = ['判断', '对错', '正确', '错误', '对或错', '√', '×'];

/**
 * 填空题标记
 */
const FILL_BLANK_MARKERS = ['______', '____', '___', '__', '（）', '( )', '（ ）', '（ ）'];

/**
 * 简答题关键词
 */
const ESSAY_KEYWORDS = ['简述', '简答', '说明', '描述', '解释', '阐述', '分析', '论述', '谈谈'];

/**
 * 多选题关键词
 */
const MULTIPLE_KEYWORDS = ['多选', '多项', '选择多个', '以下哪些'];

/**
 * 智能识别题目类型
 */
export function detectQuestionType(text: string): ParsedQuestion['type'] {
  const lowerText = text.toLowerCase();

  // 检测填空题（优先级最高）
  if (FILL_BLANK_MARKERS.some(marker => text.includes(marker))) {
    return 'fill';
  }

  // 检测简答题
  if (ESSAY_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    return 'essay';
  }

  // 检测判断题
  if (BOOLEAN_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    return 'boolean';
  }

  // 检测多选题
  if (MULTIPLE_KEYWORDS.some(keyword => lowerText.includes(keyword))) {
    return 'multiple';
  }

  // 默认为单选题
  return 'single';
}

/**
 * 提取填空题答案数量
 */
export function extractFillBlanksCount(text: string): number {
  const blankMarkers = ['______', '____', '___', '__'];
  let count = 0;
  blankMarkers.forEach(marker => {
    const regex = new RegExp(escapeRegExp(marker), 'g');
    const matches = text.match(regex);
    if (matches) {
      count += matches.length;
    }
  });

  // 如果有括号标记，计算括号数量
  const bracketMatches = text.match(/[（(]\s*[）)]/g);
  if (bracketMatches) {
    count += bracketMatches.length;
  }

  return Math.max(count, 1);
}

/**
 * 从文本中提取简答题关键词
 */
export function extractEssayKeywords(answer: string): string[] {
  const keywords: string[] = [];
  const commonKeywords = [
    '密度', '强度', '硬度', '温度', '压力', '腐蚀', '耐磨',
    '弹性', '塑性', '韧性', '脆性', '导热', '导电', '绝缘',
    '轻量化', '安全', '环保', '回收', '成本', '加工',
    '质量', '重量', '体积', '面积', '尺寸', '形状'
  ];

  commonKeywords.forEach(keyword => {
    if (answer.includes(keyword)) {
      keywords.push(keyword);
    }
  });

  return keywords;
}

/**
 * 解析题目内容
 */
export function parseQuestionInput(
  questionText: string,
  answerText?: string,
  optionsText?: string,
  forceType?: ParsedQuestion['type']
): ParsedQuestion {
  // 清理输入
  const cleanedQuestion = questionText.trim();
  const cleanedAnswer = answerText?.trim() || '';
  const cleanedOptions = optionsText?.trim() || '';

  // 检测题目类型（使用强制类型或自动检测）
  const type = forceType || detectQuestionType(cleanedQuestion);

  let parsedQuestion: ParsedQuestion = {
    type,
    question: cleanedQuestion,
    correctAnswer: '',
    confidence: 0.8,
  };

  switch (type) {
    case 'single': {
      parsedQuestion.options = [];
      parsedQuestion.correctAnswer = 0;

      if (cleanedOptions) {
        // 解析选项（支持多种格式）
        const optionLines = cleanedOptions
          .split(/[\n;；,，]/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // 提取选项内容（去除 A. B. C. D. 等前缀）
        parsedQuestion.options = optionLines.map(line =>
          line.replace(/^[A-Za-z][.、:：]\s*/, '')
        );

        // 解析正确答案
        if (cleanedAnswer) {
          const answerMatch = cleanedAnswer.match(/[A-Za-z]/i);
          if (answerMatch) {
            const answerIndex = answerMatch[0].toUpperCase().charCodeAt(0) - 65;
            if (answerIndex >= 0 && answerIndex < parsedQuestion.options.length) {
              parsedQuestion.correctAnswer = answerIndex;
              parsedQuestion.confidence = 0.9;
            }
          } else {
            // 尝试从答案文本中匹配选项
            const normalizedAnswer = cleanedAnswer.toLowerCase();
            const matchIndex = parsedQuestion.options.findIndex(opt =>
              opt.toLowerCase().includes(normalizedAnswer)
            );
            if (matchIndex >= 0) {
              parsedQuestion.correctAnswer = matchIndex;
              parsedQuestion.confidence = 0.85;
            }
          }
        }
      }
      break;
    }

    case 'multiple': {
      parsedQuestion.options = [];
      parsedQuestion.correctAnswer = [];

      if (cleanedOptions) {
        const optionLines = cleanedOptions
          .split(/[\n;；,，]/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        parsedQuestion.options = optionLines.map(line =>
          line.replace(/^[A-Za-z][.、:：]\s*/, '')
        );

        if (cleanedAnswer) {
          const answerLetters = cleanedAnswer.match(/[A-Za-z]/g) || [];
          parsedQuestion.correctAnswer = answerLetters
            .map(letter => letter.toUpperCase().charCodeAt(0) - 65)
            .filter(idx => idx >= 0 && idx < parsedQuestion.options!.length);
          parsedQuestion.confidence = parsedQuestion.correctAnswer.length > 0 ? 0.9 : 0.5;
        }
      }
      break;
    }

    case 'boolean': {
      parsedQuestion.options = ['正确', '错误'];

      if (cleanedAnswer) {
        const lowerAnswer = cleanedAnswer.toLowerCase();
        if (lowerAnswer.includes('正确') || lowerAnswer.includes('对') || lowerAnswer.includes('√') || lowerAnswer.includes('true')) {
          parsedQuestion.correctAnswer = true;
          parsedQuestion.confidence = 0.95;
        } else if (lowerAnswer.includes('错误') || lowerAnswer.includes('错') || lowerAnswer.includes('×') || lowerAnswer.includes('false')) {
          parsedQuestion.correctAnswer = false;
          parsedQuestion.confidence = 0.95;
        }
      }
      break;
    }

    case 'fill': {
      parsedQuestion.fillBlanks = extractFillBlanksCount(cleanedQuestion);

      if (cleanedAnswer) {
        // 解析填空答案（支持多种分隔符）
        const answers = cleanedAnswer
          .split(/[,，;；\n]/)
          .map(a => a.trim())
          .filter(a => a.length > 0);

        parsedQuestion.correctAnswer = answers.length >= parsedQuestion.fillBlanks!
          ? answers.slice(0, parsedQuestion.fillBlanks)
          : [...answers, ...Array(parsedQuestion.fillBlanks! - answers.length).fill('')];
        parsedQuestion.confidence = 0.85;
      } else {
        parsedQuestion.correctAnswer = Array(parsedQuestion.fillBlanks!).fill('');
      }
      break;
    }

    case 'essay': {
      parsedQuestion.correctAnswer = cleanedAnswer;
      parsedQuestion.maxLength = 200;
      parsedQuestion.keywords = extractEssayKeywords(cleanedAnswer);
      parsedQuestion.confidence = 0.7;
      break;
    }
  }

  return parsedQuestion;
}

/**
 * 自动识别完整题目
 * 支持多种输入格式
 */
export function autoParseQuestion(inputText: string): Partial<Question> {
  const lines = inputText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  if (lines.length === 0) {
    return { type: 'single', question: '' };
  }

  let questionText = lines[0];
  let answerText = '';
  let optionsText = '';

  // 尝试解析结构化输入
  const hasAnswerPrefix = lines.some(line => /^答案[:：]/.test(line));
  const hasOptionsPrefix = lines.some(line => /^选项[:：]/.test(line));

  if (hasAnswerPrefix || hasOptionsPrefix) {
    // 结构化格式
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('答案') || line.startsWith('Answer')) {
        answerText = line.replace(/^(答案|Answer)[:：]\s*/, '');
      } else if (line.startsWith('选项') || line.startsWith('Options')) {
        optionsText = line.replace(/^(选项|Options)[:：]\s*/, '');
      } else if (answerText && !line.startsWith('答案') && !line.startsWith('选项')) {
        // 可能是多行答案
        answerText += '\n' + line;
      } else if (optionsText && !line.startsWith('答案') && !line.startsWith('选项')) {
        // 可能是多行选项
        optionsText += '\n' + line;
      }
    }
  } else {
    // 非结构化格式，尝试自动识别
    const optionLines: string[] = [];
    const nonOptionLines: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^[A-Za-z][.、:：]/.test(line)) {
        optionLines.push(line);
      } else if (/^答案[:：]/i.test(line)) {
        answerText = line.replace(/^答案[:：]\s*/i, '');
      } else {
        nonOptionLines.push(line);
      }
    }

    if (optionLines.length >= 2) {
      optionsText = optionLines.join('\n');
    }

    if (nonOptionLines.length > 0 && answerText === '') {
      answerText = nonOptionLines.join('\n');
    }
  }

  const parsed = parseQuestionInput(questionText, answerText, optionsText);

  return {
    type: parsed.type,
    question: parsed.question,
    options: parsed.options,
    correctAnswer: parsed.correctAnswer,
    fillBlanks: parsed.fillBlanks,
    maxLength: parsed.maxLength,
    keywords: parsed.keywords,
    difficulty: 'medium',
    category: '',
    tags: [],
  };
}

/**
 * 批量解析多道题目
 * 支持自动识别题目分隔符和类型
 */
export function autoParseMultipleQuestions(inputText: string): Partial<Question>[] {
  const questions: Partial<Question>[] = [];

  if (!inputText.trim()) {
    return questions;
  }

  const questionBlocks: string[] = [];

  // 方式1：按题型标识分割（【单选题】、【判断题】等）
  const rawLines = inputText.split('\n').map(line => line.trim());
  const hasTypeMarkers = rawLines.some(line => /^【([^】]+)】$/.test(line));

  if (hasTypeMarkers) {
    let currentBlock = '';
    for (const line of rawLines) {
      const isTypeMarker = /^【([^】]+)】$/.test(line);
      if (isTypeMarker && currentBlock) {
        questionBlocks.push(currentBlock.trim());
        currentBlock = line;
      } else if (isTypeMarker && !currentBlock) {
        currentBlock = line;
      } else if (line) {
        currentBlock += (currentBlock ? '\n' : '') + line;
      }
    }
    if (currentBlock) {
      questionBlocks.push(currentBlock.trim());
    }
  }

  // 方式2：按数字编号分割（1. 2. 或 1、 2、）
  if (questionBlocks.length <= 1) {
    questionBlocks.length = 0;

    let tempBlock = '';
    let prevNonEmptyLine = '';

    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];

      if (!line) {
        // 空行：如果上一行是答案行，也是题目边界
        if (prevNonEmptyLine && /^(答案|Answer|正确答案)[:：]/i.test(prevNonEmptyLine) && tempBlock) {
          questionBlocks.push(tempBlock.trim());
          tempBlock = '';
        }
        continue;
      }

      const isNumberedLine = /^(\d+[.、]\s*)/.test(line);
      const isAnswerLine = /^(答案|Answer|正确答案)[:：]/i.test(line);

      if (isNumberedLine && tempBlock && !isAnswerLine) {
        // 上一个非空行是答案行，说明当前是新题目开始
        if (/^(答案|Answer|正确答案)[:：]/i.test(prevNonEmptyLine)) {
          questionBlocks.push(tempBlock.trim());
          tempBlock = line;
        } else {
          // 上一行不是答案行，数字可能是选项编号，继续追加
          tempBlock += '\n' + line;
        }
      } else {
        tempBlock += (tempBlock ? '\n' : '') + line;
      }

      prevNonEmptyLine = line;
    }

    if (tempBlock) {
      questionBlocks.push(tempBlock.trim());
    }
  }

  // 方式3：按空行分割（保留空行作为分隔符）
  if (questionBlocks.length <= 1) {
    questionBlocks.length = 0;
    const doubleLineBlocks = inputText.split(/\n\s*\n/);
    questionBlocks.push(...doubleLineBlocks.map(b => b.trim()).filter(b => b.length > 0));
  }

  // 解析每个题目块
  for (const block of questionBlocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;

    const question = parseSingleQuestionBlock(trimmedBlock);
    if (question && question.question) {
      questions.push(question);
    }
  }

  return questions;
}

/**
 * 解析单个题目块
 */
function parseSingleQuestionBlock(block: string): Partial<Question> | null {
  const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return null;

  // 移除题目类型标识（如【单选题】、【判断题】等）
  let firstLine = lines[0];
  const typeMatch = firstLine.match(/^【([^】]+)】/);

  let startIndex = 0;
  let questionType: ParsedQuestion['type'] = 'single';

  // 剥离开头的数字编号（如 "1. " "2、" 等），避免被误识别为数字选项
  const numberPrefixMatch = firstLine.match(/^(\d+[.、]\s*)([\s\S]*)/);
  if (numberPrefixMatch && !typeMatch) {
    lines[0] = numberPrefixMatch[2]; // 去掉编号，保留题目文本
    firstLine = lines[0];
  }

  // 如果有类型标识，使用它
  if (typeMatch) {
    const typeText = typeMatch[1];
    if (typeText.includes('单选')) {
      questionType = 'single';
    } else if (typeText.includes('多选')) {
      questionType = 'multiple';
    } else if (typeText.includes('判断')) {
      questionType = 'boolean';
    } else if (typeText.includes('填空')) {
      questionType = 'fill';
    } else if (typeText.includes('简答') || typeText.includes('论述')) {
      questionType = 'essay';
    }
    startIndex = 1; // 跳过类型标识行
  } else {
    // 先提取内容和答案
    const result = extractQuestionComponents(lines, 'single');

    // 从完整文本中识别类型
    questionType = detectQuestionTypeFromFullText(result.questionText, result.answerText);
  }

  // 提取题目内容、选项和答案
  const result = extractQuestionComponents(lines.slice(startIndex), questionType);

  if (!result.questionText) return null;

  const parsed = parseQuestionInput(result.questionText, result.answerText, result.optionsText, questionType);

  return {
    type: parsed.type,
    question: parsed.question,
    options: parsed.options,
    correctAnswer: parsed.correctAnswer,
    fillBlanks: parsed.fillBlanks,
    maxLength: parsed.maxLength,
    keywords: parsed.keywords,
    difficulty: 'medium',
    category: '',
    tags: [],
  };
}

/**
 * 从完整文本中识别题目类型
 */
function detectQuestionTypeFromFullText(questionText: string, answerText: string): ParsedQuestion['type'] {
  const lowerQuestion = questionText.toLowerCase();
  const lowerAnswer = answerText.toLowerCase();
  const fullText = (questionText + ' ' + answerText).toLowerCase();

  // 1. 检测填空题（优先级最高）- 检查题目中的填空标记
  if (FILL_BLANK_MARKERS.some(marker => questionText.includes(marker))) {
    return 'fill';
  }

  // 2. 检测判断题 - 通过答案判断（包含正确/错误/对/错等）
  if (lowerAnswer.includes('正确') || lowerAnswer.includes('错误') ||
      lowerAnswer.includes('对') || lowerAnswer.includes('错') ||
      lowerAnswer.includes('√') || lowerAnswer.includes('×') ||
      lowerAnswer.includes('true') || lowerAnswer.includes('false')) {
    return 'boolean';
  }

  // 3. 检测简答题 - 检查题目中的关键词
  if (ESSAY_KEYWORDS.some(keyword => lowerQuestion.includes(keyword))) {
    return 'essay';
  }

  // 4. 检测多选题
  if (MULTIPLE_KEYWORDS.some(keyword => fullText.includes(keyword))) {
    return 'multiple';
  }

  // 5. 默认为单选题
  return 'single';
}

/**
 * 从题目行中提取题目内容、选项和答案
 */
function extractQuestionComponents(
  lines: string[],
  type: ParsedQuestion['type']
): { questionText: string; optionsText: string; answerText: string } {
  let questionText = '';
  let optionsText = '';
  let answerText = '';
  const options: string[] = [];
  let inOptions = false;
  let inAnswer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 检查是否是答案行
    if (/^答案[:：]/i.test(line) || /^(Answer|正确答案)[:：]/i.test(line)) {
      inAnswer = true;
      inOptions = false;
      const answerLine = line.replace(/^(答案|Answer|正确答案)[:：]\s*/i, '');
      answerText = answerText ? answerText + '\n' + answerLine : answerLine;
      continue;
    }

    // 检查是否是选项行（A. B. C. D. 或 1. 2. 3. 4.）
    const isOptionLine = /^[A-Za-z][.、:：]|\d+[.、:：]/.test(line);

    // 对于选择题，识别选项
    if (isOptionLine && (type === 'single' || type === 'multiple')) {
      inOptions = true;
      options.push(line);
    } else if (inAnswer) {
      // 答案可能是多行的
      answerText = answerText ? answerText + '\n' + line : line;
    } else if (inOptions && (type === 'single' || type === 'multiple')) {
      // 还在选项部分
      options.push(line);
    } else if (!inAnswer && !inOptions) {
      // 题目内容部分
      if (questionText) {
        questionText += '\n' + line;
      } else {
        questionText = line;
      }
    }
  }

  // 对于选择题，将选项数组转换为文本
  if ((type === 'single' || type === 'multiple') && options.length > 0) {
    optionsText = options.join('\n');
  }

  return {
    questionText,
    optionsText,
    answerText,
  };
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}