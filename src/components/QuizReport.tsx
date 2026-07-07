import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, TrendingDown, AlertCircle, ChevronDown, ChevronRight,
  CheckCircle, XCircle, BookOpen, Target, Calendar, Clock, Lightbulb, ExternalLink,
} from 'lucide-react';
import type { QuizSession } from '../data/quizHistory';
import {
  GRADE_CONFIG, TYPE_LABEL, DIFF_LABEL, formatDuration, formatDateTime,
} from '../data/quizHistory';

interface Props {
  session: QuizSession;
  allSessions: QuizSession[];  // 含当前 session（index 0）
  onRetry?: () => void;
  onBack?: () => void;
  readOnly?: boolean;          // 历史记录查看时隐藏操作按钮
}

// ── 智能分析生成 ──────────────────────────────────────────────────────────────
function generateAnalysis(session: QuizSession, allSessions: QuizSession[]) {
  const { accuracy, weakAreas, records, correctCount, totalQuestions } = session;
  const prev = allSessions[1]; // index 0 = current session

  // 综合点评
  let summaryParts: string[] = [];
  if (accuracy >= 90) {
    summaryParts.push(`本次答对 ${correctCount}/${totalQuestions} 题，正确率 ${accuracy}%，知识掌握非常扎实！`);
  } else if (accuracy >= 70) {
    summaryParts.push(`本次正确率 ${accuracy}%（${correctCount}/${totalQuestions}），整体掌握较好。`);
  } else if (accuracy >= 50) {
    summaryParts.push(`本次正确率 ${accuracy}%（${correctCount}/${totalQuestions}），还有提升空间。`);
  } else {
    summaryParts.push(`本次正确率 ${accuracy}%（${correctCount}/${totalQuestions}），建议系统复习相关知识点。`);
  }

  // 与上次对比
  if (prev) {
    const diff = accuracy - prev.accuracy;
    if (diff >= 10) summaryParts.push(`较上次大幅提升 +${diff}%，进步显著！`);
    else if (diff > 0) summaryParts.push(`较上次提升 +${diff}%，保持进步势头。`);
    else if (diff === 0) summaryParts.push(`与上次水平持平（${accuracy}%）。`);
    else if (diff >= -5) summaryParts.push(`较上次略有下降 ${diff}%，注意巩固。`);
    else summaryParts.push(`较上次下降 ${diff}%，建议重新梳理薄弱知识点。`);
  } else {
    summaryParts.push(`这是您的第一次测验记录，已自动保存。`);
  }

  const highError = weakAreas.filter(a => a.errorRate >= 0.6 && a.wrong > 0);
  const medError  = weakAreas.filter(a => a.errorRate >= 0.3 && a.errorRate < 0.6 && a.wrong > 0);
  if (highError.length > 0) {
    summaryParts.push(`重点薄弱区域：${highError.slice(0, 3).map(a => a.label).join('、')}，建议优先攻克。`);
  }

  // 提升建议
  type Priority = 'high' | 'medium' | 'low';
  const recommendations: Array<{ priority: Priority; icon: string; area: string; advice: string }> = [];

  highError.forEach(a => {
    recommendations.push({
      priority: 'high', icon: '🔴',
      area: a.label,
      advice: `错误率 ${Math.round(a.errorRate * 100)}%（${a.wrong}/${a.total} 题），建议系统复习该知识点，整理核心概念和常用材料参数。`,
    });
  });

  medError.forEach(a => {
    recommendations.push({
      priority: 'medium', icon: '🟡',
      area: a.label,
      advice: `错误率 ${Math.round(a.errorRate * 100)}%（${a.wrong}/${a.total} 题），建议回顾相关章节，加强易混淆概念辨析。`,
    });
  });

  const fillWrong = records.filter(r => r.questionType === 'fill' && !r.isCorrect);
  if (fillWrong.length >= 2) {
    recommendations.push({
      priority: 'medium', icon: '📝',
      area: '材料术语记忆',
      advice: `填空题答错 ${fillWrong.length} 道，建议制作材料术语卡片，加强关键材料名称和属性的记忆。`,
    });
  }

  const multipleWrong = records.filter(r => r.questionType === 'multiple' && !r.isCorrect);
  if (multipleWrong.length >= 2) {
    recommendations.push({
      priority: 'medium', icon: '✅',
      area: '多选题审题',
      advice: `多选题答错 ${multipleWrong.length} 道，注意审题细节，区分相近材料的性能差异。`,
    });
  }

  const excellentAreas = weakAreas.filter(a => a.wrong === 0 && a.total > 0);
  if (excellentAreas.length > 0) {
    recommendations.push({
      priority: 'low', icon: '🟢',
      area: '巩固优势',
      advice: `${excellentAreas.slice(0, 2).map(a => a.label).join('、')} 等方面全部答对，定期复习防止遗忘即可。`,
    });
  }

  if (recommendations.length === 0 && accuracy >= 90) {
    recommendations.push({
      priority: 'low', icon: '🌟',
      area: '挑战提升',
      advice: '已掌握当前题目，可以尝试更高难度或全部题型混合测验，挑战极限。',
    });
  }

  // 学习计划
  const studyPlan: Array<{ timeframe: string; icon: string; task: string; reason: string }> = [];

  if (highError.length > 0) {
    studyPlan.push({
      timeframe: '今天',
      icon: '📖',
      task: `精读"${highError[0].label}"相关章节，整理核心知识点`,
      reason: `错误率 ${Math.round(highError[0].errorRate * 100)}%，需立即强化`,
    });
  }

  if (medError.length > 0) {
    studyPlan.push({
      timeframe: '本周',
      icon: '🔄',
      task: `复习 ${medError.slice(0, 2).map(a => a.label).join('、')}，完成错题重做`,
      reason: '中等错误率，需要系统巩固',
    });
  }

  studyPlan.push({
    timeframe: '下次测验',
    icon: '🎯',
    task: accuracy < 70
      ? '先从简单题开始，建立信心，逐步挑战中等难度'
      : accuracy >= 90
        ? '挑战全部题型+困难难度，检验综合掌握程度'
        : '尝试全部题目混合测验，检验整体掌握水平',
    reason: accuracy < 70 ? '当前基础需加强，循序渐进' : '已有良好基础，综合检验',
  });

  return { summary: summaryParts.join(''), recommendations, studyPlan };
}

// ── 用户答案展示辅助 ──────────────────────────────────────────────────────────
function renderAnswerText(
  answer: number | number[] | string | string[] | boolean,
  type: string,
  options?: string[],
): string {
  if (type === 'boolean') {
    return answer === true || answer === 0 ? '正确 ✓' : '错误 ✗';
  }
  if (type === 'single' && typeof answer === 'number' && options) {
    return `${String.fromCharCode(65 + answer)}. ${options[answer] ?? ''}`;
  }
  if (type === 'multiple' && Array.isArray(answer) && options) {
    return (answer as number[]).sort().map(i => `${String.fromCharCode(65 + i)}. ${options[i] ?? ''}`).join(' | ');
  }
  if (type === 'fill' && Array.isArray(answer)) {
    return (answer as string[]).map((a, i) => `${String.fromCharCode(97 + i)}: ${a}`).join('  ');
  }
  return String(answer);
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function QuizReport({ session, allSessions, onRetry, onBack, readOnly = false }: Props) {
  const [expandedWrong, setExpandedWrong] = useState<Set<string>>(new Set());
  const gc = GRADE_CONFIG[session.grade];
  const { summary, recommendations, studyPlan } = generateAnalysis(session, allSessions);

  const wrongRecords = session.records.filter(r => !r.isCorrect);
  const recentSessions = allSessions.slice(0, 6).reverse(); // 最近6次，从旧到新

  const toggleWrong = (id: string) => {
    setExpandedWrong(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* ── 报告头部 ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={22} className="text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">测验分析报告</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDateTime(session.startedAt)} &nbsp;·&nbsp;
            {TYPE_LABEL[session.quizType] ?? session.quizType} &nbsp;·&nbsp;
            {DIFF_LABEL[session.quizDifficulty] ?? session.quizDifficulty}
          </p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            {onRetry && (
              <button onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                再做一遍
              </button>
            )}
            {onBack && (
              <button onClick={onBack}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                返回题库
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 核心指标 ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${session.accuracy >= 70 ? 'text-green-600' : 'text-red-500'}`}>
            {session.accuracy}%
          </div>
          <div className="text-xs text-gray-500 mt-1">正确率</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {session.correctCount}<span className="text-lg text-gray-400">/{session.totalQuestions}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">答对题数</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{formatDuration(session.duration)}</div>
          <div className="text-xs text-gray-500 mt-1">用时</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${gc.color}`}>{gc.emoji} {gc.text}</div>
          <div className="text-xs text-gray-500 mt-1">评级</div>
        </div>
      </div>

      {/* ── 智能点评 ── */}
      <div className={`rounded-xl border-2 p-4 ${gc.bg} dark:bg-opacity-10 ${gc.border}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧠</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">智能点评</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{summary}</p>
      </div>

      {/* ── 知识点分析 ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">知识点分析</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <th className="text-left pb-2 font-medium text-gray-500 text-xs uppercase pr-4">知识点</th>
                <th className="text-center pb-2 font-medium text-gray-500 text-xs uppercase px-2">题数</th>
                <th className="text-center pb-2 font-medium text-gray-500 text-xs uppercase px-2">正确</th>
                <th className="text-center pb-2 font-medium text-gray-500 text-xs uppercase px-2">错误</th>
                <th className="text-left pb-2 font-medium text-gray-500 text-xs uppercase pl-4" style={{ minWidth: 120 }}>正确率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {session.weakAreas.map(area => {
                const pct = Math.round((1 - area.errorRate) * 100);
                const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-500';
                return (
                  <tr key={area.label}>
                    <td className="py-2.5 pr-4 font-medium text-gray-800 dark:text-gray-200">{area.label}</td>
                    <td className="py-2.5 text-center text-gray-600 dark:text-gray-400 px-2">{area.total}</td>
                    <td className="py-2.5 text-center text-green-600 font-medium px-2">{area.total - area.wrong}</td>
                    <td className="py-2.5 text-center px-2">
                      <span className={area.wrong > 0 ? 'text-red-500 font-medium' : 'text-gray-400'}>{area.wrong}</span>
                    </td>
                    <td className="py-2.5 pl-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2" style={{ minWidth: 60 }}>
                          <div className={`${barColor} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-xs font-semibold w-8 ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {pct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 错题回顾 ── */}
      {wrongRecords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={18} className="text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">错题回顾</h3>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {wrongRecords.length} 道
            </span>
          </div>
          <div className="space-y-2">
            {wrongRecords.map((r, idx) => {
              const isOpen = expandedWrong.has(r.questionId + idx);
              return (
                <div key={r.questionId + idx} className="border border-red-100 dark:border-red-900/40 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleWrong(r.questionId + idx)}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{r.questionText}</span>
                    <span className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                      r.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      r.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {r.difficulty === 'easy' ? '简单' : r.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    {isOpen ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-2 bg-red-50/50 dark:bg-red-900/10">
                      <div className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-red-600 flex-shrink-0">你的答案：</span>
                        <span className="text-red-700 dark:text-red-400">
                          {renderAnswerText(r.userAnswer, r.questionType, r.options)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-green-700 dark:text-green-400 flex-shrink-0">正确答案：</span>
                        <span className="text-green-700 dark:text-green-400">
                          {renderAnswerText(r.correctAnswer, r.questionType, r.options)}
                        </span>
                      </div>
                      {r.explanation && (
                        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">解析：</span>
                          <p className="text-xs text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">{r.explanation}</p>
                        </div>
                      )}
                      {(r.relatedMaterialId || r.relatedPartId) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {r.relatedMaterialId && (
                            <Link
                              to={`/materials/${r.relatedMaterialId}`}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              <BookOpen size={11} /> 查看相关材料
                              <ExternalLink size={10} />
                            </Link>
                          )}
                          {r.relatedPartId && (
                            <Link
                              to={`/parts/${r.relatedPartId}`}
                              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              onClick={e => e.stopPropagation()}
                            >
                              <Target size={11} /> 查看相关零部件
                              <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 提升建议 ── */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">提升建议</h3>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className={`p-3 rounded-lg border-l-4 ${
                rec.priority === 'high'   ? 'bg-red-50 dark:bg-red-900/20 border-red-400' :
                rec.priority === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-400' :
                                           'bg-green-50 dark:bg-green-900/20 border-green-400'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span>{rec.icon}</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{rec.area}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    rec.priority === 'high'   ? 'bg-red-100 text-red-600' :
                    rec.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {rec.priority === 'high' ? '优先' : rec.priority === 'medium' ? '重要' : '保持'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{rec.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 个性化学习建议 ── */}
      {(() => {
        const wrongRecs = session.records.filter(r => !r.isCorrect);
        const materialLinks = Array.from(
          new Map(
            wrongRecs
              .filter(r => r.relatedMaterialId)
              .map(r => [r.relatedMaterialId!, { id: r.relatedMaterialId!, label: r.category || r.tags[0] || '相关材料' }])
          ).values()
        );
        const partLinks = Array.from(
          new Map(
            wrongRecs
              .filter(r => r.relatedPartId)
              .map(r => [r.relatedPartId!, { id: r.relatedPartId!, label: r.tags[0] || r.category || '相关零部件' }])
          ).values()
        );
        const hasLinks = materialLinks.length > 0 || partLinks.length > 0;
        const topWeak = session.weakAreas.filter(a => a.wrong > 0).slice(0, 3);
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">个性化学习建议</h3>
            </div>
            <div className="space-y-4">

              {/* 1. 针对薄弱知识点的学习路径 */}
              {topWeak.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">薄弱知识点学习路径</p>
                  <div className="space-y-2">
                    {topWeak.map((area, i) => {
                      const pct = Math.round((1 - area.errorRate) * 100);
                      const steps = [
                        `阅读"${area.label}"相关章节，整理材料属性与应用场景`,
                        `在材料库中检索"${area.label}"，对比相近材料的性能差异`,
                        `重做该知识点错题，直至正确率达到 80% 以上`,
                      ];
                      return (
                        <div key={area.label} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {i + 1}. {area.label}
                            </span>
                            <span className={`text-xs font-semibold ${pct < 60 ? 'text-red-500' : 'text-yellow-600'}`}>
                              正确率 {pct}%
                            </span>
                          </div>
                          <ol className="space-y-1">
                            {steps.map((step, si) => (
                              <li key={si} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                  {si + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. 推荐学习资源快捷入口 */}
              {hasLinks && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">推荐学习资源（基于错题）</p>
                  <div className="flex flex-wrap gap-2">
                    {materialLinks.map(m => (
                      <Link key={m.id} to={`/materials/${m.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors">
                        <BookOpen size={12} /> {m.label} 材料详情
                        <ExternalLink size={10} />
                      </Link>
                    ))}
                    {partLinks.map(p => (
                      <Link key={p.id} to={`/parts/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors">
                        <Target size={12} /> {p.label} 零部件详情
                        <ExternalLink size={10} />
                      </Link>
                    ))}
                    <Link to="/materials"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 transition-colors">
                      <BookOpen size={12} /> 浏览全部材料库
                    </Link>
                    <Link to="/parts"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 transition-colors">
                      <Target size={12} /> 浏览汽车零部件
                    </Link>
                  </div>
                </div>
              )}

              {/* 3. 下次测验策略 */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">下次测验策略</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    {
                      icon: '🎯',
                      title: session.accuracy < 60 ? '专项练习' : session.accuracy < 85 ? '混合题型' : '挑战难度',
                      desc: session.accuracy < 60
                        ? '先选"简单"难度，按知识点逐个击破，建立基础信心'
                        : session.accuracy < 85
                        ? '选"全部题目"混合练习，检验各类题型综合掌握水平'
                        : '选"困难"难度或全题型测验，冲击更高分数',
                    },
                    {
                      icon: '⏱️',
                      title: '控制答题节奏',
                      desc: `本次平均每题用时 ${session.totalQuestions > 0 ? Math.round(session.duration / session.totalQuestions) : 0} 秒，${
                        session.duration / session.totalQuestions < 15
                          ? '答题较快，建议放慢节奏仔细审题'
                          : session.duration / session.totalQuestions > 60
                          ? '答题较慢，熟记材料参数可提升速度'
                          : '答题节奏适中，保持即可'
                      }`,
                    },
                    {
                      icon: '📒',
                      title: '错题本整理',
                      desc: `本次共 ${session.records.filter(r => !r.isCorrect).length} 道错题，建议记录到"我的笔记"，定期回顾巩固`,
                    },
                  ].map((tip, i) => (
                    <div key={i} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{tip.icon}</span>
                        <span className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">{tip.title}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. 跳转笔记 */}
              <div className="flex items-center gap-2 pt-1">
                <Link to="/notes"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  <BookOpen size={12} /> 前往"我的笔记"记录学习心得 →
                </Link>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── 学习计划 ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">学习计划</h3>
        </div>
        <div className="space-y-3">
          {studyPlan.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-16 text-center">
                <span className="text-lg">{item.icon}</span>
                <div className="text-xs font-semibold text-gray-500 mt-0.5">{item.timeframe}</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.task}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 历史趋势 ── */}
      {recentSessions.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">近期趋势</h3>
            <span className="text-xs text-gray-400">最近 {recentSessions.length} 次</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {recentSessions.map((s) => {
              const isCurrentSession = s.id === session.id;
              const barH = Math.max(8, Math.round((s.accuracy / 100) * 80));
              const gc2 = GRADE_CONFIG[s.grade];
              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{s.accuracy}%</span>
                  <div
                    className={`w-full rounded-t transition-all ${isCurrentSession ? 'ring-2 ring-blue-400' : ''}`}
                    style={{
                      height: barH,
                      background: s.accuracy >= 90 ? '#22c55e' : s.accuracy >= 70 ? '#3b82f6' : s.accuracy >= 50 ? '#f59e0b' : '#ef4444',
                      opacity: isCurrentSession ? 1 : 0.6,
                    }}
                    title={`${formatDateTime(s.startedAt)}  ${s.accuracy}%`}
                  />
                  <span className="text-[10px] text-gray-400">{gc2.emoji}</span>
                  <span className="text-[10px] text-gray-400 hidden sm:block">
                    {new Date(s.startedAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-end flex-wrap">
            {(['🟩≥90% 优秀', '🟦≥70% 良好', '🟨≥50% 需加强', '🟥<50% 继续努力'] as string[]).map(t => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── 底部操作 (非只读) ── */}
      {!readOnly && (
        <div className="flex gap-3 pt-1 pb-4">
          {onRetry && (
            <button onClick={onRetry}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Clock size={16} /> 再做一遍
            </button>
          )}
          {onBack && (
            <button onClick={onBack}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              返回题库
            </button>
          )}
        </div>
      )}
    </div>
  );
}
