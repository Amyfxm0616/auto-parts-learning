import { useState } from 'react';
import { Trash2, ChevronDown, ChevronRight, BarChart2, Award, AlertTriangle } from 'lucide-react';
import type { QuizSession } from '../data/quizHistory';
import {
  getSessions, deleteSession, clearAllSessions,
  GRADE_CONFIG, TYPE_LABEL, DIFF_LABEL, formatDuration, formatDateTime,
} from '../data/quizHistory';
import QuizReport from './QuizReport';

export default function QuizHistory() {
  const [sessions, setSessions] = useState<QuizSession[]>(() => getSessions());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const reload = () => setSessions(getSessions());

  const handleDelete = (id: string) => {
    deleteSession(id);
    reload();
    if (expandedId === id) setExpandedId(null);
  };

  const handleClear = () => {
    if (confirmClear) {
      clearAllSessions();
      reload();
      setConfirmClear(false);
      setExpandedId(null);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <BarChart2 size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium mb-2">暂无测验记录</p>
        <p className="text-sm">完成第一次测验后，记录将自动保存在这里</p>
      </div>
    );
  }

  // 汇总统计
  const totalSessions = sessions.length;
  const avgAccuracy = Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / totalSessions);
  const bestAccuracy = Math.max(...sessions.map(s => s.accuracy));
  const oldestAccuracy = sessions[sessions.length - 1]?.accuracy ?? 0;
  const improvementVsFirst = avgAccuracy - oldestAccuracy;

  return (
    <div className="space-y-4">
      {/* ── 汇总统计 ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{totalSessions}</div>
          <div className="text-xs text-gray-500 mt-1">测验次数</div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${avgAccuracy >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
            {avgAccuracy}%
          </div>
          <div className="text-xs text-gray-500 mt-1">平均正确率</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500">{bestAccuracy}%</div>
          <div className="text-xs text-gray-500 mt-1">最高分</div>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${improvementVsFirst >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {improvementVsFirst >= 0 ? '+' : ''}{improvementVsFirst}%
          </div>
          <div className="text-xs text-gray-500 mt-1">较最早进步</div>
        </div>
      </div>

      {/* ── 清空按钮 ── */}
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            confirmClear
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <AlertTriangle size={12} />
          {confirmClear ? '再次点击确认清空全部记录' : '清空历史'}
        </button>
      </div>

      {/* ── 会话列表 ── */}
      <div className="space-y-2">
        {sessions.map((s, idx) => {
          const gc = GRADE_CONFIG[s.grade];
          const isExpanded = expandedId === s.id;
          const isLatest = idx === 0;
          return (
            <div key={s.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
              {/* 列表行 */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 select-none"
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
              >
                {/* 序号 + 等级 */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-xl">{gc.emoji}</span>
                </div>

                {/* 主信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-bold ${gc.color}`}>{s.accuracy}%</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {s.correctCount}/{s.totalQuestions} 题正确
                    </span>
                    {isLatest && (
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                        最新
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${gc.bg} ${gc.color} dark:bg-opacity-20`}>
                      {gc.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                    <span>{formatDateTime(s.startedAt)}</span>
                    <span>·</span>
                    <span>{TYPE_LABEL[s.quizType] ?? s.quizType}</span>
                    <span>·</span>
                    <span>{DIFF_LABEL[s.quizDifficulty] ?? s.quizDifficulty}</span>
                    <span>·</span>
                    <span>{formatDuration(s.duration)}</span>
                  </div>
                </div>

                {/* 右侧操作 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(s.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="删除此记录"
                  >
                    <Trash2 size={14} />
                  </button>
                  {isExpanded
                    ? <ChevronDown size={16} className="text-gray-400" />
                    : <ChevronRight size={16} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* 展开的报告 */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-5">
                  <QuizReport
                    session={s}
                    allSessions={sessions.filter((_, i) => i >= idx)}  // 当前及更早的记录
                    readOnly
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {sessions.length >= 5 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 justify-center py-2">
          <Award size={12} />
          共 {sessions.length} 条记录（最多保留 50 条）
        </div>
      )}
    </div>
  );
}
