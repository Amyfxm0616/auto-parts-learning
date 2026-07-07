import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Settings, ChevronRight, ChevronDown, FileText, CheckSquare, AlignLeft, List, BookOpen, PlayCircle, Clock } from 'lucide-react';
import { getQuestions, initializeQuestions } from '../data/questions';
import type { Question } from '../data/questions';
import { checkAndStoreAdminToken, isAdmin } from '../utils/adminAuth';
import { buildSession, saveSession, getSessions } from '../data/quizHistory';
import type { QuizSession } from '../data/quizHistory';
import QuizReport from '../components/QuizReport';
import QuizHistory from '../components/QuizHistory';

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
  const [isInitializing, setIsInitializing] = useState(true);
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI?.isElectron;

  // 检测 URL token，存入 sessionStorage
  useEffect(() => {
    checkAndStoreAdminToken(searchParams);
    setAdminAccess(isAdmin());
  }, [searchParams]);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['fill', 'boolean']));

  // 选题页 Tab
  const [activeTab, setActiveTab] = useState<'quiz' | 'history'>('quiz');

  // 测验状态
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // 答题状态
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | number[] | string | string[] | boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);

  // 计时 & 结果
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [sessionRecords, setSessionRecords] = useState<QuizRecord[]>([]);
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      setIsInitializing(true);
      await initializeQuestions();
      if (!cancelled) {
        setAllQuestions(getQuestions());
        setIsInitializing(false);
      }
    };

    loadQuestions();

    return () => {
      cancelled = true;
    };
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
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

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
    setCurrentSession(null);
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
      return matchFillBlanks(
        selectedAnswer as string[],
        currentQuestion.correctAnswer as string[]
      ).isAllCorrect;
    } else if (currentQuestion.type === 'essay') {
      return typeof selectedAnswer === 'string' && matchEssayAnswer(selectedAnswer, currentQuestion);
    }
    return false;
  };

  /** 去除标点和排序连接符，只保留关键字（汉字、字母、数字） */
  const stripPunct = (s: string): string =>
    s.replace(/[、，。；：""''！？—…·\s,\.;:!?\-_\/\\<>≤≥=]/g, '').toLowerCase();

  const matchEssayAnswer = (userAnswer: string | null, question: Question): boolean => {
    const normalizedAnswer = stripPunct(userAnswer || '');
    if (!normalizedAnswer) return false;

    const keywords = (question.keywords ?? []).map(keyword => stripPunct(keyword)).filter(Boolean);
    if (keywords.length > 0) {
      return keywords.some(keyword => normalizedAnswer.includes(keyword) || keyword.includes(normalizedAnswer));
    }

    if (typeof question.correctAnswer !== 'string') return false;
    const fallbackAnswer = stripPunct(question.correctAnswer);
    return !!fallbackAnswer && (normalizedAnswer.includes(fallbackAnswer) || fallbackAnswer.includes(normalizedAnswer));
  };

  /** 填空题单空匹配：支持"或"多答案、忽略标点、关键字包含匹配 */
  const matchFillBlank = (userAns: string | undefined, correct: string): boolean => {
    const user = stripPunct(userAns || '');
    if (!user) return false;
    return correct.split('或').some(alt => {
      const a = stripPunct(alt);
      return a === user || a.includes(user) || user.includes(a);
    });
  };

  /**
   * 填空题整体匹配：先按位置精确匹配，失败则做集合匹配（顺序无关）。
   * 返回每个空的匹配结果，以及整体是否正确。
   */
  const matchFillBlanks = (
    userAnswers: string[],
    correctAnswers: string[]
  ): { isAllCorrect: boolean; blankResults: Array<{ isCorrect: boolean; refAnswer: string }> } => {
    // 1. 先按位置匹配
    const byPosition = userAnswers.map((ans, i) => ({
      isCorrect: matchFillBlank(ans, correctAnswers[i] || ''),
      refAnswer: correctAnswers[i] || '',
    }));
    if (byPosition.every(r => r.isCorrect)) {
      return { isAllCorrect: true, blankResults: byPosition };
    }

    // 2. 顺序无关集合匹配（贪心）
    const remaining = correctAnswers.map((c, i) => ({ c, i }));
    const blankResults = userAnswers.map(ans => {
      const idx = remaining.findIndex(({ c }) => matchFillBlank(ans, c));
      if (idx !== -1) {
        const { c } = remaining[idx];
        remaining.splice(idx, 1);
        return { isCorrect: true, refAnswer: c };
      }
      return { isCorrect: false, refAnswer: '' };
    });
    const isAllCorrect = blankResults.every(r => r.isCorrect);
    // 对于判错的空，补充参考答案（取位置对应的原始答案）
    blankResults.forEach((r, i) => {
      if (!r.isCorrect) r.refAnswer = correctAnswers[i] || '';
    });
    return { isAllCorrect, blankResults };
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

  const handleFinishQuiz = () => {
    const finishedAt = Date.now();
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));
    const session = buildSession({
      sessionRecords: [...sessionRecords].map(r => ({
        questionId: r.questionId,
        userAnswer: r.userAnswer,
        isCorrect: r.isCorrect,
      })),
      questionMap,
      startedAt: quizStartTime ?? finishedAt - elapsedSeconds * 1000,
      finishedAt,
      quizType: selectedType,
      quizDifficulty: selectedDifficulty,
    });
    saveSession(session);
    setCurrentSession(session);
    setIsQuizFinished(true);
  };

  useEffect(() => {
    setActiveOptionIndex(0);
  }, [currentQuestionIndex, currentQuestion?.id]);

  useEffect(() => {
    const isChoiceQuestion = currentQuestion?.type === 'single' || currentQuestion?.type === 'multiple' || currentQuestion?.type === 'boolean';
    const currentDisplayOptions = currentQuestion?.type === 'boolean'
      ? (currentQuestion.options ?? ['正确', '错误'])
      : currentQuestion?.options;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;

      if (showResult && event.key === 'Enter') {
        event.preventDefault();
        if (isLastQuestion) {
          handleFinishQuiz();
        } else {
          handleNext();
        }
        return;
      }

      if (!isChoiceQuestion || !currentDisplayOptions || showResult) return;

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveOptionIndex(prev => (prev + 1) % currentDisplayOptions.length);
        return;
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveOptionIndex(prev => (prev - 1 + currentDisplayOptions.length) % currentDisplayOptions.length);
        return;
      }

      const upperKey = event.key.toUpperCase();
      const letterIndex = upperKey.length === 1 ? upperKey.charCodeAt(0) - 65 : -1;
      if (letterIndex >= 0 && letterIndex < currentDisplayOptions.length) {
        event.preventDefault();
        setActiveOptionIndex(letterIndex);
        if (currentQuestion.type === 'multiple') {
          updateSelectedAnswer(letterIndex);
        } else {
          setSelectedAnswer(letterIndex);
        }
        return;
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (event.key === 'Enter' && selectedAnswer !== null) {
          handleSubmit();
          return;
        }
        if (currentQuestion.type === 'multiple') {
          updateSelectedAnswer(activeOptionIndex);
        } else {
          setSelectedAnswer(activeOptionIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOptionIndex, currentQuestion, selectedAnswer, showResult, isLastQuestion, sessionRecords, allQuestions, quizStartTime, elapsedSeconds, selectedType, selectedDifficulty]);

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
  if (isInitializing) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto text-center text-gray-500 dark:text-gray-400">
        正在加载题库...
      </div>
    );
  }

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

        {/* Tab 切换 */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
          {(['quiz', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab === 'quiz' ? '📝 练习测验' : '📊 历史记录'}
            </button>
          ))}
        </div>

        {activeTab === 'history' ? (
          <QuizHistory />
        ) : (
          <>
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
          </>
        )}
      </div>
    );
  }

  // ─── 辅助：格式化秒数 ─────────────────────────────────────────
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ─── 结果页 ───────────────────────────────────────────────────
  if (isQuizFinished && currentSession) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <QuizReport
          session={currentSession}
          allSessions={getSessions()}
          onRetry={() => startQuiz(selectedType, selectedDifficulty)}
          onBack={handleRestart}
        />
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
  // 判断题若数据中缺 options，自动补 ['正确', '错误']
  const displayOptions = currentQuestion.type === 'boolean'
    ? (currentQuestion.options ?? ['正确', '错误'])
    : currentQuestion.options;
  const selectionHint = currentQuestion.type === 'single'
    ? '单选题：请选择 1 个答案'
    : currentQuestion.type === 'multiple'
      ? '多选题：可选择多个答案'
      : currentQuestion.type === 'boolean'
        ? '判断题：请选择“正确”或“错误”'
        : null;
  const selectedOptionLabels = Array.isArray(selectedAnswer)
    ? (selectedAnswer as number[]).map(index => String.fromCharCode(65 + index))
    : typeof selectedAnswer === 'number'
      ? [String.fromCharCode(65 + selectedAnswer)]
      : [];
  const selectionStatus = !showResult && (currentQuestion.type === 'single' || currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean')
    ? currentQuestion.type === 'multiple'
      ? (selectedOptionLabels.length > 0 ? `已选 ${selectedOptionLabels.length} 项：${selectedOptionLabels.join('、')}` : '当前未选择任何选项')
      : (selectedOptionLabels[0] ? `当前选择：${selectedOptionLabels[0]}` : '当前未选择选项')
    : null;
  const currentRecord = showResult ? sessionRecords[sessionRecords.length - 1] : null;
  const resultBanner = showResult
    ? currentRecord?.isCorrect
      ? { text: '回答正确', className: 'mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700' }
      : { text: '回答错误', className: 'mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700' }
    : null;

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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {currentQuestion.question}
        </h2>

        {selectionHint && (
          <div className="mb-3 inline-flex items-center rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 border border-blue-200">
            {selectionHint}
          </div>
        )}

        {selectionStatus && (
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-300">
            {selectionStatus}
          </div>
        )}

        {!showResult && (currentQuestion.type === 'single' || currentQuestion.type === 'multiple' || currentQuestion.type === 'boolean') && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
            键盘提示：A/B/C/D 直接选择，↑↓/←→ 切换，空格选择，Enter 提交
          </div>
        )}

        {resultBanner && (
          <div className={resultBanner.className}>
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{resultBanner.text}</span>
              <span className="text-sm opacity-80">按 Enter {isLastQuestion ? '完成测验' : '进入下一题'}</span>
            </div>
          </div>
        )}

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
              const isMultipleChoice = currentQuestion.type === 'multiple';
              const shouldShowActiveMarker = isSelected || (showResult && isCorrect);

              let cls = 'w-full text-left px-6 py-4 border-2 rounded-xl transition-all duration-200 ';
              if (showResult) {
                cls += isCorrect ? 'border-green-500 bg-green-50 text-green-900 cursor-not-allowed'
                  : isSelected ? 'border-red-500 bg-red-50 text-red-900 cursor-not-allowed'
                  : 'border-gray-200 text-gray-500 cursor-not-allowed';
              } else {
                cls += isSelected ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-sm scale-[1.01]'
                  : 'border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:border-blue-300 hover:bg-blue-50/60 hover:-translate-y-0.5 hover:shadow-sm';
                if (index === activeOptionIndex) {
                  cls += ' ring-2 ring-blue-200 ring-offset-2';
                }
              }

              const markerClass = showResult
                ? isCorrect
                  ? 'border-green-500 bg-white text-green-600'
                  : isSelected
                    ? 'border-red-500 bg-white text-red-600'
                    : 'border-gray-300 bg-white text-transparent dark:bg-gray-800'
                : isSelected
                  ? 'border-blue-500 bg-white text-blue-600'
                  : 'border-gray-300 bg-white text-transparent dark:bg-gray-800';

              return (
                <button key={index} onClick={() => {
                  if (currentQuestion.type === 'multiple') updateSelectedAnswer(index);
                  else if (!showResult) setSelectedAnswer(index);
                }} disabled={showResult} className={cls}>
                  <div className="flex items-center gap-3">
                    <span className={`relative flex h-5 w-5 shrink-0 items-center justify-center border-2 ${isMultipleChoice ? 'rounded-sm' : 'rounded-full'} ${markerClass}`}>
                      {isMultipleChoice
                        ? shouldShowActiveMarker
                          ? <span className="text-xs font-bold leading-none">✓</span>
                          : null
                        : <span className={`h-2.5 w-2.5 rounded-full bg-current transition-opacity ${shouldShowActiveMarker ? 'opacity-100' : 'opacity-0'}`} />}
                    </span>
                    <span className={`font-semibold ${isSelected && !showResult ? 'text-blue-700' : ''}`}>{String.fromCharCode(65 + index)}.</span>
                    <span className="flex-1">{option}</span>
                    {!showResult && index === activeOptionIndex && (
                      <span className="text-xs font-medium text-gray-500">键盘焦点</span>
                    )}
                    {isSelected && !showResult && <span className="text-xs font-medium text-blue-600">已选择</span>}
                    {showResult && isCorrect && <span className="text-green-600 font-bold">✓</span>}
                    {showResult && isSelected && !isCorrect && <span className="text-red-600 font-bold">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 填空题 */}
        {currentQuestion.type === 'fill' && (() => {
          const fillBlankResults = showResult
            ? matchFillBlanks(
                Array.isArray(selectedAnswer) ? (selectedAnswer as string[]) : [],
                currentQuestion.correctAnswer as string[]
              ).blankResults
            : null;
          return (
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
                        ? (fillBlankResults?.[index]?.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50')
                        : 'border-gray-300'
                    }`}
                  />
                  {showResult && (() => {
                    const blankRes = fillBlankResults?.[index];
                    return blankRes?.isCorrect
                      ? <span className="text-sm font-medium text-green-700 whitespace-nowrap">✓ 正确</span>
                      : <span className="text-sm font-medium text-red-600 whitespace-nowrap">参考答案：{blankRes?.refAnswer ?? (currentQuestion.correctAnswer as string[])[index] ?? ''}</span>;
                  })()}
                </div>
              </div>
            ))}
          </div>
          );
        })()}

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
              <button onClick={handleFinishQuiz}
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
