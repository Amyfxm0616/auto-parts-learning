import { useState, useEffect } from 'react';
import { quizQuestions } from '../data/questions';

type Question = typeof quizQuestions[number];

interface QuizRecord {
  id: string;
  questionId: string;
  userAnswer: number | number[];
  isCorrect: boolean;
  timestamp: number;
}

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizRecords, setQuizRecords] = useState<QuizRecord[]>([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredQuestions =
    difficulty === 'all'
      ? quizQuestions
      : quizQuestions.filter((q) => q.difficulty === difficulty);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    const savedRecords = localStorage.getItem('quizRecords');
    if (savedRecords) {
      setQuizRecords(JSON.parse(savedRecords));
    }
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const record: QuizRecord = {
      id: `record-${Date.now()}`,
      questionId: currentQuestion.id,
      userAnswer: selectedAnswer,
      isCorrect,
      timestamp: Date.now(),
    };

    const updatedRecords = [...quizRecords, record];
    setQuizRecords(updatedRecords);
    localStorage.setItem('quizRecords', JSON.stringify(updatedRecords));

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsQuizStarted(false);
  };

  const getStats = () => {
    const total = quizRecords.length;
    const correct = quizRecords.filter((r) => r.isCorrect).length;
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(0) : 0;
    return { total, correct, accuracy };
  };

  const stats = getStats();
  const isLastQuestion = currentQuestionIndex === filteredQuestions.length - 1;

  if (!isQuizStarted) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">练习测验</h1>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">学习统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">已答题数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.correct}
              </div>
              <div className="text-sm text-gray-600 mt-1">答对题数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {stats.accuracy}%
              </div>
              <div className="text-sm text-gray-600 mt-1">正确率</div>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">选择难度</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  difficulty === level
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {level === 'all' && '全部'}
                {level === 'easy' && '简单'}
                {level === 'medium' && '中等'}
                {level === 'hard' && '困难'}
                <div className="text-xs text-gray-500 mt-1">
                  {
                    quizQuestions.filter((q) =>
                      level === 'all' ? true : q.difficulty === level
                    ).length
                  }{' '}
                  题
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={() => setIsQuizStarted(true)}
          className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          开始练习 ({filteredQuestions.length} 题)
        </button>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="px-4 py-8 max-w-3xl mx-auto text-center">
        <p className="text-gray-500 mb-4">当前难度没有题目</p>
        <button
          onClick={handleRestart}
          className="text-blue-600 hover:text-blue-700"
        >
          返回选择
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            题目 {currentQuestionIndex + 1} / {filteredQuestions.length}
          </span>
          <button
            onClick={handleRestart}
            className="text-blue-600 hover:text-blue-700"
          >
            退出测验
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow p-8">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded ${
              currentQuestion.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {currentQuestion.difficulty === 'easy' && '简单'}
            {currentQuestion.difficulty === 'medium' && '中等'}
            {currentQuestion.difficulty === 'hard' && '困难'}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            const showCorrectness = showResult;

            let buttonClass =
              'w-full text-left px-6 py-4 border-2 rounded-lg transition-colors ';
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass += 'border-green-500 bg-green-50 text-green-900';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'border-red-500 bg-red-50 text-red-900';
              } else {
                buttonClass += 'border-gray-200 text-gray-600';
              }
            } else {
              if (isSelected) {
                buttonClass += 'border-blue-500 bg-blue-50 text-blue-900';
              } else {
                buttonClass +=
                  'border-gray-300 hover:border-blue-300 text-gray-900';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option}</span>
                  {showCorrectness && isCorrect && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <span className="ml-auto text-red-600">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && currentQuestion.explanation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-1">解析：</p>
            <p className="text-sm text-blue-800">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              提交答案
            </button>
          ) : (
            <>
              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  下一题
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  完成测验
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
