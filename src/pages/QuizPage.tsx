import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Settings, ChevronRight, ChevronDown, FileText, CheckSquare, AlignLeft, List, BookOpen, PlayCircle, Clock, Trophy, TrendingDown, AlertCircle } from 'lucide-react';
import { getQuestions, initializeQuestions } from '../data/questions';
import type { Question } from '../data/questions';
import { checkAndStoreAdminToken, isAdmin } from '../utils/adminAuth';

interface QuizRecord {
  id: string;
  questionId: string;
  userAnswer: number | number[] | string | string[] | boolean;
  isCorrect: boolean;
  timestamp: number;
}

type QuestionType = Question['type'] | 'all';

const TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  all:      { label: '全部题目', icon: <BookOpen size={18} />,    color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  fill:     { label: '填空题',   icon: <AlignLeft size={18} />,   color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  boolean:  { label: '判断题',   icon: <CheckSquare size={18} />, color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  single:   { label: '单选题',   icon: <List size={18} />,        color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
  multiple: { label: '多选题',   icon: <List size={18} />,        color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200' },
  essay:    { label: '简答题',   icon: <FileText size={18} />,    color: 'text-gray-700',   bg: 'bg-gray-50',   border: 'border-gray-200' },
};

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '简单', medium: '中等', hard: '困难',
};

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizRecords, setQuizRecords] = useState<QuizRecord[]>([]);
  const [adminAccess, setAdminAccess] = useState(false);
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI?.isElectron;

  // 检测 URL token，存入 sessionStorage
  useEffect(() => {
    checkAndStoreAdminToken(searchParams);
    setAdminAccess(isAdmin());
  }, [searchParams]);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['fill', 'boolean']));

  // 测验状态
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // 答题状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | string | string[] | boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 计时 & 结果
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [sessionRecords, setSessionRecords] = useState<QuizRecord[]>([]);

  useEffect(() => {
    initializeQuestions();
    setAllQuestions(getQuestions());
  }, []);

  useEffect(() => {
    const savedRecords = localStorage.getItem('quizRecords');
    if (savedRecords) {
      try { setQuizRecords(JSON.parse(savedRecords)); } catch {}
    }
  }, []);

  // 计时器：答题期间每秒更新
  useEffect(() => {
    if (!isQuizStarted || isQuizFinished || quizStartTime === null) return;
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - quizStartTime) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [isQuizStarted, isQuizFinished, quizStartTime]);

  const getFilteredQuestions = (type: QuestionType, difficulty: 'all' | 'easy' | 'medium' | 'hard') => {
    return allQuestions.filter(q =>
      (type === 'all' || q.type === type) &&
      (difficulty === 'all' || q.difficulty === difficulty)
    );
  };

  const filteredQuestions = getFilteredQuestions(selectedType, selectedDifficulty);
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const toggleType = (type: string) => {
    setExpandedTypes(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const startQuiz = (type: QuestionType, difficulty: 'all' | 'easy' | 'medium' | 'hard' = 'all') => {
    const qs = getFilteredQuestions(type, difficulty);
    if (qs.length === 0) return;
    setSelectedType(type);
    setSelectedDifficulty(difficulty);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizFinished(false);
    setSessionRecords([]);
    setQuizStartTime(Date.now());
    setElapsedSeconds(0);
    setIsQuizStarted(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizStarted(false);
    setIsQuizFinished(false);
    setSessionRecords([]);
    setQuizStartTime(null);
    setElapsedSeconds(0);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === 'single') {
      return selectedAnswer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'boolean') {
      // selectedAnswer 是 0（正确）或 1（错误），correctAnswer 是 true/false
      return (selectedAnswer === 0) === (currentQuestion.correctAnswer === true);
    } else if (currentQuestion.type === 'multiple' && Array.isArray(selectedAnswer) && Array.isArray(currentQuestion.correctAnswer)) {
      const a = [...selectedAnswer].sort();
      const b = [...(currentQuestion.correctAnswer as number[])].sort();
      return a.length === b.length && a.every((v, i) => v === b[i]);
    } else if (currentQuestion.type === 'fill' && Array.isArray(selectedAnswer)) {
      return (selectedAnswer as string[]).every((ans, i) => {
        const correct = (currentQuestion.correctAnswer as string[])[i] || '';
        return matchFillBlank(ans, correct);
      });
    } else if (currentQuestion.type === 'essay') {
      return typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0;
    }
    return false;
  };

  /** 填空题单空匹配：正确答案含"或"时，用户答案与任一分支匹配即视为正确 */
  const matchFillBlank = (userAns: string | undefined, correct: string): boolean => {
    const user = (userAns || '').trim().toLowerCase();
    return correct.split('或').some(alt => alt.trim().toLowerCase() === user);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    const isCorrect = checkAnswer();
    const record: QuizRecord = {
      id: `record-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer!,
      isCorrect,
      timestamp: Date.now(),
    };
    const updated = [...quizRecords, record];
    setQuizRecords(updated);
    setSessionRecords(prev => [...prev, record]);
    localStorage.setItem('quizRecords', JSON.stringify(updated));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const updateSelectedAnswer = (index: number) => {
    if (currentQuestion.type === 'multiple') {
      const arr = Array.isArray(selectedAnswer) ? (selectedAnswer as number[]) : [];
      setSelectedAnswer(arr.includes(index) ? arr.filter(i => i !== index) : [...arr, index]);
    } else {
      setSelectedAnswer(index);
    }
  };

  const getStats = () => {
    const total = quizRecords.length;
    const correct = quizRecords.filter(r => r.isCorrect).length;
    return { total, correct, accuracy: total > 0 ? ((correct / total) * 100).toFixed(0) : 0 };
  };

  // ─── 起始页（树状结构）───────────────────────────────────────
  if (!isQuizStarted) {
    const stats = getStats();
    const typeOrder: QuestionType[] = ['fill', 'boolean', 'single', 'multiple', 'essay'];

    return (
      <div className="px-4 py-8 max-w-3xl mx-auto">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">练习测验</h1>
          {adminAccess && isElectron && (
            <Link
              to="/quiz/manage"
              className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Settings size={18} /> 管理题库
            </Link>
          )}
        </div>

        {/* 统计 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-6 grid grid-cols-3 gap-4">
          {[
            { val: stats.total,    label: '已答题数', color: 'text-blue-600' },
            { val: stats.correct,  label: '答对题数', color: 'text-green-600' },
            { val: `${stats.accuracy}%`, label: '正确率', color: 'text-purple-600' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 全部题目快速入口 */}
        <div className="mb-4">
          <button
            onClick={() => startQuiz('all')}
            disabled={allQuestions.length === 0}
            className="w-full flex items-center justify-between px-5 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl shadow transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} />
              <span className="font-semibold text-lg">全部题目</span>
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {allQuestions.length} 题
              </span>
            </div>
            <PlayCircle size={22} />
          </button>
        </div>

        {/* 树状题型列表 */}
        <div className="space-y-3">
          {typeOrder.map(type => {
            const cfg = TYPE_CONFIG[type];
            const typeQuestions = allQuestions.filter(q => q.type === type);
            const isExpanded = expandedTypes.has(type);
            const byDifficulty = {
              easy:   typeQuestions.filter(q => q.difficulty === 'easy'),
              medium: typeQuestions.filter(q => q.difficulty === 'medium'),
              hard:   typeQuestions.filter(q => q.difficulty === 'hard'),
            };

            return (
              <div key={type} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
                {/* 题型节点 */}
                <div className={`flex items-center ${cfg.bg} dark:bg-gray-800`}>
                  {/* 展开/折叠按钮 */}
                  <button
                    onClick={() => toggleType(type)}
                    className="flex items-center gap-3 flex-1 px-5 py-4 text-left"
                  >
                    <span className={cfg.color}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                    <span className={`${cfg.color}`}>{cfg.icon}</span>
                    <span className={`font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.color}`}>
                      {typeQuestions.length} 题
                    </span>
                  </button>
                  {/* 直接开始按钮 */}
                  <button
                    onClick={() => startQuiz(type)}
                    disabled={typeQuestions.length === 0}
                    className={`flex items-center gap-1 mr-4 px-3 py-1.5 rounded-lg text-sm font-medium border ${cfg.border} ${cfg.color} hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity`}
                  >
                    <PlayCircle size={15} /> 开始
                  </button>
                </div>

                {/* 展开后：按难度细分 */}
                {isExpanded && typeQuestions.length > 0 && (
                  <div className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700">
                    {(['easy', 'medium', 'hard'] as const).map(diff => {
                      const qs = byDifficulty[diff];
                      if (qs.length === 0) return null;
                      return (
                        <button
                          key={diff}
                          onClick={() => startQuiz(type, diff)}
                          className="w-full flex items-center justify-between px-8 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span className={`text-sm font-medium ${
                              diff === 'easy' ? 'text-green-700' :
                              diff === 'medium' ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {DIFFICULTY_LABEL[diff]}
                            </span>
                            <span className="text-xs text-gray-400">{qs.length} 题</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 空题型提示 */}
                {isExpanded && typeQuestions.length === 0 && (
                  <div className="bg-white dark:bg-gray-900 px-8 py-3 text-sm text-gray-400">
                    暂无题目，可前往题库管理添加
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── 辅助：格式化秒数 ─────────────────────────────────────────
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ─── 结果页 ───────────────────────────────────────────────────
  if (isQuizFinished) {
    const totalQ = sessionRecords.length;
    const correctQ = sessionRecords.filter(r => r.isCorrect).length;
    const wrongQ = totalQ - correctQ;
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

    // 按知识点/材料分类统计（category → 第一个tag → 题型名）
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));
    const TYPE_LABEL: Record<string, string> = {
      single: '单选题', multiple: '多选题', boolean: '判断题', fill: '填空题', essay: '简答题',
    };
    type GroupStat = { wrong: number; total: number };
    const groups = new Map<string, GroupStat>();
    sessionRecords.forEach(r => {
      const q = questionMap.get(r.questionId);
      if (!q) return;
      const label = (q.category && q.category !== '') ? q.category
        : (q.tags && q.tags.length > 0) ? q.tags[0]
        : TYPE_LABEL[q.type] || q.type;
      if (!groups.has(label)) groups.set(label, { wrong: 0, total: 0 });
      groups.get(label)!.total++;
      if (!r.isCorrect) groups.get(label)!.wrong++;
    });
    const groupStats = Array.from(groups.entries())
      .map(([label, s]) => ({ label, ...s, rate: s.total > 0 ? s.wrong / s.total : 0 }))
      .sort((a, b) => b.rate - a.rate);
    const weakest = groupStats.filter(g => g.wrong > 0);

    // 成绩评级
    const grade = accuracy >= 90 ? { text: '优秀', emoji: '🏆', cls: 'text-yellow-500' }
      : accuracy >= 70 ? { text: '良好', emoji: '👍', cls: 'text-blue-500' }
      : accuracy >= 50 ? { text: '需加强', emoji: '📚', cls: 'text-orange-500' }
      : { text: '继续努力', emoji: '💪', cls: 'text-red-500' };

    return (
      <div className="px-4 py-8 max-w-3xl mx-auto space-y-5">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-2">
          <Trophy size={28} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">本次测验结果</h1>
        </div>

        {/* 得分 & 用时 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">{correctQ}<span className="text-xl text-gray-400">/{totalQ}</span></div>
            <div className="text-sm text-gray-500 mt-1">答对题数</div>
          </div>
          <div>
            <div className={`text-4xl font-bold ${accuracy >= 70 ? 'text-green-600' : 'text-red-500'}`}>{accuracy}%</div>
            <div className="text-sm text-gray-500 mt-1">正确率</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">{formatTime(elapsedSeconds)}</div>
            <div className="text-sm text-gray-500 mt-1">用时</div>
          </div>
        </div>

        {/* 评级 */}
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 ${
          accuracy >= 90 ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' :
          accuracy >= 70 ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' :
          accuracy >= 50 ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' :
          'border-red-300 bg-red-50 dark:bg-red-900/20'
        }`}>
          <span className="text-3xl">{grade.emoji}</span>
          <div>
            <div className={`text-lg font-bold ${grade.cls}`}>{grade.text}</div>
            <div className="text-sm text-gray-500">
              {accuracy >= 90 ? '表现出色，知识掌握非常扎实！' :
               accuracy >= 70 ? '掌握较好，继续巩固薄弱知识点。' :
               accuracy >= 50 ? '还需努力，建议重点复习错题涉及的材料知识。' :
               '差距较大，建议系统性地重新学习相关材料知识。'}
            </div>
          </div>
        </div>

        {/* 错题材料分析 */}
        {wrongQ > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={20} className="text-red-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">错题分析</h2>
              <span className="text-sm text-gray-400">共 {wrongQ} 道错题</span>
            </div>
            <div className="space-y-3">
              {groupStats.map(g => {
                const errorPct = Math.round(g.rate * 100);
                const barColor = g.rate >= 0.6 ? 'bg-red-500' : g.rate >= 0.3 ? 'bg-orange-400' : 'bg-yellow-400';
                return (
                  <div key={g.label}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{g.label}</span>
                      <span className="text-gray-500">
                        {g.wrong}/{g.total} 错误 &nbsp;
                        <span className={g.rate >= 0.6 ? 'text-red-500 font-semibold' : g.rate >= 0.3 ? 'text-orange-500 font-semibold' : 'text-yellow-600 font-semibold'}>
                          {errorPct}%
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div className={`${barColor} h-2.5 rounded-full transition-all`} style={{ width: `${errorPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 加强建议 */}
        {weakest.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={20} className="text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">建议加强学习</h2>
            </div>
            <ul className="space-y-2">
              {weakest.slice(0, 4).map(g => (
                <li key={g.label} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="mt-0.5 text-orange-400">•</span>
                  <span>
                    <span className="font-semibold">{g.label}</span>
                    {' '}—— 错误率 {Math.round(g.rate * 100)}%（{g.wrong}/{g.total} 题），
                    {g.rate >= 0.6 ? '建议重点复习，系统梳理相关知识。' :
                     g.rate >= 0.3 ? '建议回顾错题解析，强化记忆。' :
                     '偶有失误，注意细节即可。'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => { startQuiz(selectedType, selectedDifficulty); }}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            再做一遍
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            返回题库
          </button>
        </div>
      </div>
    );
  }

  // ─── 题目为空 ────────────────────────────────────────────────
  if (filteredQuestions.length === 0) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto text-center">
        <p className="text-gray-500 mb-4">当前分类没有题目</p>
        <button onClick={handleRestart} className="text-blue-600 hover:text-blue-700">返回</button>
      </div>
    );
  }

  // ─── 答题页 ──────────────────────────────────────────────────
  const typeCfg = TYPE_CONFIG[selectedType] || TYPE_CONFIG['all'];
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;
  // 判断题若数据中缺 options，自动补 ['正确', '错误']
  const displayOptions = currentQuestion.type === 'boolean'
    ? (currentQuestion.options ?? ['正确', '错误'])
    : currentQuestion.options;

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <span className={typeCfg.color}>{typeCfg.icon}</span>
            <span className={`font-medium ${typeCfg.color}`}>{typeCfg.label}</span>
            {selectedDifficulty !== 'all' && (
              <span className="text-xs text-gray-400">· {DIFFICULTY_LABEL[selectedDifficulty]}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-gray-500">
              <Clock size={13} />
              {formatTime(elapsedSeconds)}
            </span>
            <span>第 {currentQuestionIndex + 1} / {filteredQuestions.length} 题</span>
            <button onClick={handleRestart} className="text-blue-600 hover:text-blue-700">退出</button>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 题目卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        {/* 标签行 */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2 py-1 text-xs rounded-lg border ${typeCfg.border} ${typeCfg.color} ${typeCfg.bg}`}>
            {typeCfg.label}
          </span>
          <span className={`px-2 py-1 text-xs rounded-lg ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {DIFFICULTY_LABEL[currentQuestion.difficulty] || currentQuestion.difficulty}
          </span>
        </div>

        {/* 题目 */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.question}
        </h2>

        {/* 题目配图：所有题型均支持多图（按 a/b/c 标注），兼容旧的单图 imageUrl */}
        {currentQuestion.questionImages && currentQuestion.questionImages.length > 0 ? (
          <div className="flex flex-wrap gap-4 mb-6">
            {currentQuestion.questionImages.map((src, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <img
                  src={src}
                  alt={`图片${String.fromCharCode(97 + idx)}`}
                  className="max-h-48 max-w-full rounded-lg border border-gray-200 object-contain"
                />
                {currentQuestion.questionImages!.length > 1 && (
                  <span className="text-xs font-semibold text-gray-500">
                    图片{String.fromCharCode(97 + idx)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : currentQuestion.imageUrl ? (
          <img src={currentQuestion.imageUrl} alt="题目配图"
            className="max-w-full h-auto rounded-lg border border-gray-200 mb-6" />
        ) : null}

        {/* 选择题 / 判断题 */}
        {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') && displayOptions && (
          <div className="space-y-3 mb-6">
            {displayOptions.map((option, index) => {
              const isSelected = currentQuestion.type === 'multiple'
                ? Array.isArray(selectedAnswer) && (selectedAnswer as number[]).includes(index)
                : selectedAnswer === index;
              const isCorrect = currentQuestion.type === 'boolean'
                ? (currentQuestion.correctAnswer === true && index === 0) || (currentQuestion.correctAnswer === false && index === 1)
                : Array.isArray(currentQuestion.correctAnswer)
                  ? (currentQuestion.correctAnswer as number[]).includes(index)
                  : currentQuestion.correctAnswer === index;

              let cls = 'w-full text-left px-6 py-4 border-2 rounded-xl transition-colors ';
              if (showResult) {
                cls += isCorrect ? 'border-green-500 bg-green-50 text-green-900'
                  : isSelected ? 'border-red-500 bg-red-50 text-red-900'
                  : 'border-gray-200 text-gray-500';
              } else {
                cls += isSelected ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 text-gray-900 dark:text-gray-100';
              }

              return (
                <button key={index} onClick={() => {
                  if (currentQuestion.type === 'multiple') updateSelectedAnswer(index);
                  else if (!showResult) setSelectedAnswer(index);
                }} disabled={showResult && currentQuestion.type !== 'multiple'} className={cls}>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 填空题 */}
        {currentQuestion.type === 'fill' && (
          <div className="space-y-4 mb-6">
            {Array.from({ length: currentQuestion.fillBlanks || 1 }).map((_, index) => (
              <div key={index}>
                {/* 该空对应的图片（a-f 依次对应） */}
                {currentQuestion.fillImages?.[index] && (
                  <img
                    src={currentQuestion.fillImages[index]}
                    alt={`选项 ${String.fromCharCode(97 + index)}`}
                    className="max-w-full h-auto max-h-48 rounded-lg border border-gray-200 mb-2 object-contain"
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap w-6">
                    {String.fromCharCode(97 + index)}.
                  </span>
                  <input
                    type="text"
                    value={Array.isArray(selectedAnswer) ? (selectedAnswer as string[])[index] || '' : ''}
                    onChange={e => {
                      const arr = Array.isArray(selectedAnswer) ? [...(selectedAnswer as string[])] : [];
                      arr[index] = e.target.value;
                      setSelectedAnswer(arr);
                    }}
                    disabled={showResult}
                    placeholder="请填写答案"
                    className={`flex-1 px-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:text-white ${
                      showResult
                        ? (matchFillBlank(
                            Array.isArray(selectedAnswer) ? (selectedAnswer as string[])[index] : undefined,
                            (currentQuestion.correctAnswer as string[])[index] || ''
                          ) ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
                        : 'border-gray-300'
                    }`}
                  />
                  {showResult && (() => {
                    const correct = (currentQuestion.correctAnswer as string[])[index] || '';
                    const isBlankCorrect = matchFillBlank(
                      Array.isArray(selectedAnswer) ? (selectedAnswer as string[])[index] : undefined,
                      correct
                    );
                    return isBlankCorrect
                      ? <span className="text-sm font-medium text-green-700 whitespace-nowrap">✓ 正确</span>
                      : <span className="text-sm font-medium text-red-600 whitespace-nowrap">参考答案：{correct}</span>;
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 简答题 */}
        {currentQuestion.type === 'essay' && (
          <div className="space-y-3 mb-6">
            <textarea
              value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
              onChange={e => setSelectedAnswer(e.target.value)}
              disabled={showResult} rows={5}
              placeholder="请输入你的答案..."
              className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="text-xs text-gray-400">
              字数：{typeof selectedAnswer === 'string' ? selectedAnswer.length : 0} / {currentQuestion.maxLength || 200}
            </div>
            {showResult && typeof currentQuestion.correctAnswer === 'string' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm font-medium text-green-800 mb-1">参考答案：</p>
                <p className="text-sm text-green-700">{currentQuestion.correctAnswer}</p>
              </div>
            )}
          </div>
        )}

        {/* 解析 */}
        {showResult && currentQuestion.explanation && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-xl">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">解析：</p>
            <p className="text-sm text-blue-800 dark:text-blue-400">{currentQuestion.explanation}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              提交答案
            </button>
          ) : (
            !isLastQuestion ? (
              <button onClick={handleNext}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                下一题
              </button>
            ) : (
              <button onClick={() => setIsQuizFinished(true)}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                完成测验
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
