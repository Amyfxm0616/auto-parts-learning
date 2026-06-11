import type { Question } from './questions';

export type QuizGrade = 'excellent' | 'good' | 'needsWork' | 'keepTrying';

export interface QuizSessionRecord {
  questionId: string;
  questionText: string;
  questionType: Question['type'];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  options?: string[];
  userAnswer: number | number[] | string | string[] | boolean;
  correctAnswer: number | number[] | string | string[] | boolean;
  explanation?: string;
  isCorrect: boolean;
}

export interface WeakArea {
  label: string;
  total: number;
  wrong: number;
  errorRate: number;
}

export interface QuizSession {
  id: string;
  startedAt: number;
  finishedAt: number;
  duration: number;
  quizType: string;
  quizDifficulty: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  grade: QuizGrade;
  records: QuizSessionRecord[];
  weakAreas: WeakArea[];
}

const SESSIONS_KEY = 'quizSessions';
const MAX_SESSIONS = 50;

export function getSessions(): QuizSession[] {
  try {
    const data = localStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: QuizSession): void {
  const sessions = getSessions();
  sessions.unshift(session);
  if (sessions.length > MAX_SESSIONS) sessions.splice(MAX_SESSIONS);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage full: remove oldest and retry
    sessions.splice(MAX_SESSIONS / 2);
    try { localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)); } catch {}
  }
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function clearAllSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

export function getGrade(accuracy: number): QuizGrade {
  if (accuracy >= 90) return 'excellent';
  if (accuracy >= 70) return 'good';
  if (accuracy >= 50) return 'needsWork';
  return 'keepTrying';
}

export function computeWeakAreas(records: QuizSessionRecord[]): WeakArea[] {
  const map = new Map<string, { total: number; wrong: number }>();
  records.forEach(r => {
    const label = r.category || r.tags[0] || r.questionType;
    if (!map.has(label)) map.set(label, { total: 0, wrong: 0 });
    const s = map.get(label)!;
    s.total++;
    if (!r.isCorrect) s.wrong++;
  });
  return Array.from(map.entries())
    .map(([label, s]) => ({ label, ...s, errorRate: s.total > 0 ? s.wrong / s.total : 0 }))
    .sort((a, b) => b.errorRate - a.errorRate);
}

/** 由 QuizPage 调用，基于当次答题记录构建完整 QuizSession */
export function buildSession(params: {
  sessionRecords: Array<{
    questionId: string;
    userAnswer: number | number[] | string | string[] | boolean;
    isCorrect: boolean;
  }>;
  questionMap: Map<string, Question>;
  startedAt: number;
  finishedAt: number;
  quizType: string;
  quizDifficulty: string;
}): QuizSession {
  const { sessionRecords, questionMap, startedAt, finishedAt, quizType, quizDifficulty } = params;

  const records: QuizSessionRecord[] = sessionRecords.map(r => {
    const q = questionMap.get(r.questionId);
    return {
      questionId: r.questionId,
      questionText: q?.question ?? '',
      questionType: q?.type ?? 'single',
      category: q?.category ?? '',
      difficulty: q?.difficulty ?? 'medium',
      tags: q?.tags ?? [],
      options: q?.options,
      userAnswer: r.userAnswer,
      correctAnswer: q?.correctAnswer ?? '',
      explanation: q?.explanation,
      isCorrect: r.isCorrect,
    };
  });

  const totalQuestions = records.length;
  const correctCount = records.filter(r => r.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    id: `session-${startedAt}-${Math.random().toString(36).slice(2, 7)}`,
    startedAt,
    finishedAt,
    duration: Math.floor((finishedAt - startedAt) / 1000),
    quizType,
    quizDifficulty,
    totalQuestions,
    correctCount,
    accuracy,
    grade: getGrade(accuracy),
    records,
    weakAreas: computeWeakAreas(records),
  };
}

/** 格式化秒数为 MM:SS */
export function formatDuration(seconds: number): string {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

/** 格式化时间戳为本地日期时间字符串 */
export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export const GRADE_CONFIG: Record<QuizGrade, { text: string; emoji: string; color: string; bg: string; border: string }> = {
  excellent: { text: '优秀',   emoji: '🏆', color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-300' },
  good:      { text: '良好',   emoji: '👍', color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-300' },
  needsWork: { text: '需加强', emoji: '📚', color: 'text-orange-600', bg: 'bg-orange-50',  border: 'border-orange-300' },
  keepTrying:{ text: '继续努力',emoji: '💪', color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-300' },
};

export const TYPE_LABEL: Record<string, string> = {
  all: '全部题目', single: '单选题', multiple: '多选题',
  boolean: '判断题', fill: '填空题', essay: '简答题',
};

export const DIFF_LABEL: Record<string, string> = {
  all: '全部难度', easy: '简单', medium: '中等', hard: '困难',
};
