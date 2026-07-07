import { createRequire } from 'module';
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const { Level } = require('level');

const DB_PATH = 'C:/Users/fuxiaomin/AppData/Local/Temp/quiz-leveldb-copy';
const OUT_PATH = new URL('../src/data/questions.ts', import.meta.url);

async function main() {
  const db = new Level(DB_PATH, { keyEncoding: 'buffer', valueEncoding: 'buffer' });
  await db.open();

  let questions = null;
  for await (const [key, value] of db.iterator()) {
    const keyStr = key.toString('utf8');
    if (keyStr.includes('quizQuestions')) {
      const val = value.slice(1).toString('utf16le');
      questions = JSON.parse(val);
      break;
    }
  }
  await db.close();

  if (!questions) {
    console.error('quizQuestions not found in localStorage');
    process.exit(1);
  }

  console.log(`Found ${questions.length} questions`);
  questions.forEach((q, i) => console.log(`  ${i + 1}. [${q.type}] ${q.question.substring(0, 50)}`));

  const tsContent = `// 题目类型定义
export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'matching' | 'boolean' | 'fill' | 'essay';
  question: string;
  imageUrl?: string;
  questionImages?: string[];
  options?: string[];
  optionImages?: string[];
  correctAnswer: number | number[] | string | string[] | boolean;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedPartId?: string;
  relatedMaterialId?: string;
  category?: string;
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
  fillBlanks?: number;
  fillImages?: string[];
  maxLength?: number;
  keywords?: string[];
}

// 判断题的固定选项
export const BOOLEAN_OPTIONS = ['正确', '错误'];

export const quizQuestions: Question[] = ${JSON.stringify(questions, null, 2)};

// 从 localStorage 获取题目
export function getQuestions(): Question[] {
  const saved = localStorage.getItem('quizQuestions');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return quizQuestions;
    }
  }
  return quizQuestions;
}

// 保存题目到 localStorage
export function saveQuestions(questions: Question[]): void {
  localStorage.setItem('quizQuestions', JSON.stringify(questions));
}

// 添加题目
export function addQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
  const questions = getQuestions();
  const now = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const newQuestion: Question = {
    ...question,
    id: \`q-\${now}-\${random}\`,
    createdAt: now,
    updatedAt: now,
  };
  questions.push(newQuestion);
  saveQuestions(questions);
  return newQuestion;
}

// 更新题目
export function updateQuestion(id: string, updates: Partial<Question>): Question | null {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  questions[index] = { ...questions[index], ...updates, updatedAt: Date.now() };
  saveQuestions(questions);
  return questions[index];
}

// 删除题目
export function deleteQuestion(id: string): boolean {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  if (filtered.length === questions.length) return false;
  saveQuestions(filtered);
  return true;
}

// 初始化默认题目：版本不匹配时自动用内置题库覆盖旧缓存
export function initializeQuestions(): void {
  const serialized = JSON.stringify(quizQuestions);
  let hash = 0;
  for (let i = 0; i < serialized.length; i += 1) {
    hash = (hash * 31 + serialized.charCodeAt(i)) >>> 0;
  }
  const buildId = \`${'${quizQuestions.length}'}-\${hash.toString(36)}\`;
  const storedBuildId = localStorage.getItem('quizQuestionsBuildId');
  const saved = localStorage.getItem('quizQuestions');
  if (!saved || storedBuildId !== buildId) {
    saveQuestions(quizQuestions);
    localStorage.setItem('quizQuestionsBuildId', buildId);
  }
}
`;

  writeFileSync(fileURLToPath(OUT_PATH), tsContent, 'utf8');
  console.log(`\nquestions.ts updated successfully!`);
}

main().catch(console.error);
