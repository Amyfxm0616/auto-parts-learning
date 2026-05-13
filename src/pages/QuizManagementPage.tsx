import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Upload, Sparkles, FileText, CheckCircle2, Globe, Loader2 } from 'lucide-react';
import type { Question } from '../data/questions';
import { getQuestions, addQuestion, updateQuestion, deleteQuestion, initializeQuestions } from '../data/questions';
import { autoParseQuestion, autoParseMultipleQuestions } from '../services/questionParser';

export default function QuizManagementPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAutoParse, setShowAutoParse] = useState(false);
  const [autoParseInput, setAutoParseInput] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Partial<Question>[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncError, setSyncError] = useState('');
  const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI?.isElectron;

  useEffect(() => {
    initializeQuestions();
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setQuestions(getQuestions());
  };

  const handleNewQuestion = () => {
    setEditingQuestion({
      type: 'single',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 'medium',
      explanation: '',
      category: '',
      tags: [],
    });
    setIsEditing(true);
    setShowAutoParse(false);
    setAutoParseInput('');
    setParsedQuestions([]);
  };

  const handleAutoParse = () => {
    if (!autoParseInput.trim()) return;

    try {
      // 尝试批量解析
      const multipleParsed = autoParseMultipleQuestions(autoParseInput);

      if (multipleParsed.length > 1) {
        // 多道题目，显示预览
        setParsedQuestions(multipleParsed);
      } else if (multipleParsed.length === 1) {
        // 单道题目，直接进入编辑
        setShowAutoParse(false);
        setEditingQuestion(multipleParsed[0]);
        setIsEditing(true);
        setParsedQuestions([]);
      } else {
        // 解析失败，尝试单题解析
        const singleParsed = autoParseQuestion(autoParseInput);
        setShowAutoParse(false);
        setEditingQuestion(singleParsed);
        setIsEditing(true);
        setParsedQuestions([]);
      }
    } catch (error) {
      alert('解析失败，请检查输入格式');
    }
  };

  const handleImportParsedQuestions = () => {
    if (parsedQuestions.length === 0) return;

    let successCount = 0;
    let failCount = 0;

    parsedQuestions.forEach(parsed => {
      if (parsed.question) {
        try {
          addQuestion(parsed as Omit<Question, 'id' | 'createdAt' | 'updatedAt'>);
          successCount++;
        } catch (error) {
          failCount++;
        }
      }
    });

    if (successCount > 0) {
      alert(`成功导入 ${successCount} 道题目${failCount > 0 ? `，失败 ${failCount} 道` : ''}`);
      loadQuestions();
      if (isElectron) handleSyncToNetlify();
    } else {
      alert('导入失败，请检查题目格式');
    }

    setShowAutoParse(false);
    setAutoParseInput('');
    setParsedQuestions([]);
  };

  const handleEditParsedQuestion = (index: number) => {
    setShowAutoParse(false);
    setEditingQuestion(parsedQuestions[index]);
    setIsEditing(true);
    setParsedQuestions([]);
  };

  const handleRemoveParsedQuestion = (index: number) => {
    const newParsed = [...parsedQuestions];
    newParsed.splice(index, 1);
    setParsedQuestions(newParsed);
  };

  const handleCancelAutoParse = () => {
    setShowAutoParse(false);
    setAutoParseInput('');
    setParsedQuestions([]);
  };

  const handleSyncToNetlify = async () => {
    if (syncStatus === 'syncing') return;
    setSyncStatus('syncing');
    setSyncError('');
    try {
      const allQuestions = getQuestions();
      const result = await (window as any).electronAPI.syncToNetlify(JSON.stringify(allQuestions));
      if (result.success) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 4000);
      } else {
        setSyncError(result.error || '未知错误');
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 6000);
      }
    } catch (e: any) {
      setSyncError(e.message || '未知错误');
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 6000);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setIsEditing(true);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('确定要删除这道题目吗？')) {
      deleteQuestion(id);
      loadQuestions();
      if (isElectron) handleSyncToNetlify();
    }
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion) return;

    // 验证必填字段
    if (!editingQuestion.question) {
      alert('请填写题目内容！');
      return;
    }

    // 根据不同类型验证必填字段
    if (editingQuestion.type === 'single' || editingQuestion.type === 'multiple') {
      if (!editingQuestion.options || editingQuestion.options.length < 2) {
        alert('选择题至少需要两个选项！');
        return;
      }
    }

    if (editingQuestion.type === 'fill' && typeof editingQuestion.correctAnswer === 'object' && Array.isArray(editingQuestion.correctAnswer)) {
      if (editingQuestion.correctAnswer.some(a => a === '')) {
        alert('请填写所有填空答案！');
        return;
      }
    }

    if (editingQuestion.type === 'essay' && !editingQuestion.correctAnswer) {
      alert('请填写参考答案！');
      return;
    }

    // 构建保存对象，确保字段类型正确
    const questionToSave: Omit<Question, 'id' | 'createdAt' | 'updatedAt'> = {
      type: editingQuestion.type || 'single',
      question: editingQuestion.question || '',
      options: (editingQuestion.type === 'single' || editingQuestion.type === 'multiple')
        ? editingQuestion.options || []
        : undefined,
      correctAnswer: editingQuestion.correctAnswer !== undefined && editingQuestion.correctAnswer !== ''
        ? editingQuestion.correctAnswer
        : getCorrectAnswerDefault(editingQuestion.type || 'single'),
      explanation: editingQuestion.explanation || '',
      difficulty: editingQuestion.difficulty || 'medium',
      category: editingQuestion.category || '',
      tags: editingQuestion.tags || [],
      imageUrl: editingQuestion.imageUrl,
      questionImages: editingQuestion.questionImages,
      optionImages: editingQuestion.optionImages,
      fillBlanks: editingQuestion.type === 'fill'
        ? editingQuestion.fillBlanks || (Array.isArray(editingQuestion.correctAnswer) ? editingQuestion.correctAnswer.length : extractFillBlanksCount(editingQuestion.question || ''))
        : undefined,
      fillImages: editingQuestion.type === 'fill' ? editingQuestion.fillImages : undefined,
      maxLength: editingQuestion.type === 'essay'
        ? editingQuestion.maxLength || 200
        : undefined,
      keywords: editingQuestion.type === 'essay' ? editingQuestion.keywords : undefined,
    };

    try {
      if (editingQuestion.id) {
        updateQuestion(editingQuestion.id, questionToSave);
      } else {
        addQuestion(questionToSave);
      }
    } catch (e) {
      alert('保存失败：图片数据过大，请减少或压缩图片后重试。');
      return;
    }

    setIsEditing(false);
    setEditingQuestion(null);
    setShowAutoParse(false);
    setAutoParseInput('');
    setParsedQuestions([]);
    loadQuestions();
    if (isElectron) handleSyncToNetlify();
  };
  const getCorrectAnswerDefault = (type: Question['type']): Question['correctAnswer'] => {
    switch (type) {
      case 'single':
        return 0;
      case 'multiple':
        return [];
      case 'boolean':
        return true;
      case 'fill':
        return [''];
      case 'essay':
        return '';
      default:
        return 0;
    }
  };

  // 辅助函数：提取填空题空数
  const extractFillBlanksCount = (text: string): number => {
    const matches = text.match(/_____/g);
    return matches ? matches.length : 1;
  };

  // 辅助函数：获取题目类型的默认值
  const getDefaultValuesForType = (type: Question['type']) => {
    const currentOptions = editingQuestion?.options;
    const currentCorrectAnswer = editingQuestion?.correctAnswer;
    const currentMaxLength = editingQuestion?.maxLength;
    const currentKeywords = editingQuestion?.keywords;

    switch (type) {
      case 'single':
        return {
          options: currentOptions?.length ? currentOptions : ['', '', '', ''],
          correctAnswer: typeof currentCorrectAnswer === 'number' ? currentCorrectAnswer : 0,
          fillBlanks: undefined,
          maxLength: undefined,
          keywords: undefined,
        };
      case 'multiple':
        return {
          options: currentOptions?.length ? currentOptions : ['', '', '', ''],
          correctAnswer: Array.isArray(currentCorrectAnswer) ? currentCorrectAnswer : [],
          fillBlanks: undefined,
          maxLength: undefined,
          keywords: undefined,
        };
      case 'boolean':
        return {
          options: ['正确', '错误'],
          correctAnswer: typeof currentCorrectAnswer === 'boolean' ? currentCorrectAnswer : true,
          fillBlanks: undefined,
          maxLength: undefined,
          keywords: undefined,
        };
      case 'fill':
        return {
          options: undefined,
          correctAnswer: Array.isArray(currentCorrectAnswer) ? currentCorrectAnswer : [''],
          fillBlanks: Array.isArray(currentCorrectAnswer) ? currentCorrectAnswer.length : 1,
          maxLength: undefined,
          keywords: undefined,
        };
      case 'essay':
        return {
          options: undefined,
          correctAnswer: typeof currentCorrectAnswer === 'string' ? currentCorrectAnswer : '',
          fillBlanks: undefined,
          maxLength: currentMaxLength || 200,
          keywords: currentKeywords,
        };
      default:
        return {};
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingQuestion(null);
  };

  /** 填空题题目配图：一次选多张，按选择顺序追加到 questionImages */
  const handleMultipleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      document.body.removeChild(input);
      if (files.length === 0) return;
      let loaded = 0;
      const newImages: string[] = new Array(files.length);
      files.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages[i] = event.target?.result as string;
          loaded++;
          if (loaded === files.length) {
            setEditingQuestion(prev => {
              if (!prev) return null;
              return { ...prev, questionImages: [...(prev.questionImages || []), ...newImages] };
            });
          }
        };
        reader.readAsDataURL(file);
      });
    };

    input.click();
  };

  const handleImageUpload = (field: 'imageUrl' | 'optionImages' | 'fillImages', index?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      document.body.removeChild(input);
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          if (field === 'imageUrl') {
            setEditingQuestion(prev => prev ? { ...prev, imageUrl } : null);
          } else if (field === 'optionImages' && index !== undefined) {
            setEditingQuestion(prev => {
              if (!prev) return null;
              const optionImages = [...(prev.optionImages || [])];
              optionImages[index] = imageUrl;
              return { ...prev, optionImages };
            });
          } else if (field === 'fillImages' && index !== undefined) {
            setEditingQuestion(prev => {
              if (!prev) return null;
              const fillImages = [...(prev.fillImages || [])];
              fillImages[index] = imageUrl;
              return { ...prev, fillImages };
            });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesType = filterType === 'all' || q.type === filterType;
    return matchesSearch && matchesDifficulty && matchesCategory && matchesType;
  });

  const categories = Array.from(new Set(questions.map(q => q.category).filter(Boolean))) as string[];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          题库管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理材料测试题目，支持编辑、新增、删除和添加图片
        </p>
      </div>

      {/* 工具栏 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* 搜索框 */}
          <input
            type="text"
            placeholder="搜索题目..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />

          {/* 难度筛选 */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">全部难度</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>

          {/* 分类筛选 */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">全部分类</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* 题型筛选 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">全部题型</option>
            <option value="single">单选题</option>
            <option value="multiple">多选题</option>
            <option value="boolean">判断题</option>
            <option value="fill">填空题</option>
            <option value="essay">简答题</option>
          </select>

          {/* 新增按钮 */}
          <button
            onClick={handleNewQuestion}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            新增题目
          </button>

          {/* 快速导入按钮 */}
          <button
            onClick={() => setShowAutoParse(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Sparkles size={20} />
            快速导入
          </button>

          {/* 同步到网页按钮（仅桌面 Electron 显示） */}
          {isElectron && (
            <button
              onClick={handleSyncToNetlify}
              disabled={syncStatus === 'syncing'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white ${
                syncStatus === 'syncing' ? 'bg-blue-400 cursor-not-allowed' :
                syncStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
                syncStatus === 'error'   ? 'bg-red-600 hover:bg-red-700' :
                'bg-blue-600 hover:bg-blue-700'
              }`}
              title={syncStatus === 'error' ? syncError : '将当前题库同步到 Netlify 网页版'}
            >
              {syncStatus === 'syncing' ? <Loader2 size={18} className="animate-spin" /> :
               syncStatus === 'success' ? <CheckCircle2 size={18} /> :
               <Globe size={18} />}
              {syncStatus === 'syncing' ? '同步中...' :
               syncStatus === 'success' ? '同步成功' :
               syncStatus === 'error'   ? '同步失败' :
               '同步到网页'}
            </button>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          共 {questions.length} 道题目，显示 {filteredQuestions.length} 道
        </div>
      </div>

      {/* 快速导入对话框 */}
      {showAutoParse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={24} className="text-purple-600" />
                  智能导入题目
                </h2>
                <button
                  onClick={handleCancelAutoParse}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  粘贴题目内容（系统将自动识别题目类型、答案等）
                </label>
                <textarea
                  value={autoParseInput}
                  onChange={(e) => setAutoParseInput(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder={`批量导入示例（支持多道题目）：

【判断题】
铝合金的密度比钢高。
答案：错误

【判断题】
碳纤维复合材料是100%可回收的。
答案：错误

【填空题】
活塞在发动机气缸内工作时，承受的最高温度可达______°C。
答案：250-350

【填空题】
汽车轮胎主要由______材料制成，因其具有优异的______性。
答案：橡胶，弹性

【简答题】
请简述铝合金在汽车制造中的三个主要优势。
答案：密度低、导热性好、耐腐蚀性强

【单选题】
以下哪种材料最适合用于制造发动机缸体？
A. 橡胶
B. 铝合金
C. 塑料
D. 陶瓷
答案：B

或使用数字编号：
1. 铝合金的主要优势是什么？
   A. 成本低
   B. 重量轻
   C. 强度高
   D. 易加工
   答案：B

2. 橡胶的密度比钢高。
   答案：错误
...`}
                />
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">支持格式说明：</h3>
                <ul className="text-sm text-purple-800 dark:text-purple-400 space-y-1">
                  <li>• <strong>批量导入</strong>：支持一次导入多道题目，使用数字编号（1. 2. 3.）或分隔符（===）区分题目</li>
                  <li>• 单选题/多选题：直接列出选项，答案用字母标识</li>
                  <li>• 判断题：答案为"正确/错误"或"对/错"</li>
                  <li>• 填空题：题目中使用____标记，答案用逗号分隔多个空</li>
                  <li>• 简答题：直接输入参考答案</li>
                </ul>
              </div>

              {/* 题目预览区 */}
              {parsedQuestions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      解析预览 - {parsedQuestions.length} 道题目
                    </h3>
                    <span className="text-sm text-green-600 font-medium">
                      <CheckCircle2 size={16} className="inline mr-1" />
                      解析成功
                    </span>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                    {parsedQuestions.map((parsed, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                                {index + 1}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                {parsed.type === 'single' && '单选题'}
                                {parsed.type === 'multiple' && '多选题'}
                                {parsed.type === 'boolean' && '判断题'}
                                {parsed.type === 'fill' && '填空题'}
                                {parsed.type === 'essay' && '简答题'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                              {parsed.question}
                            </p>
                            {(parsed.type === 'single' || parsed.type === 'multiple') && parsed.options && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                {parsed.options.map((opt, optIndex) => {
                                  const isCorrect = parsed.type === 'single'
                                    ? parsed.correctAnswer === optIndex
                                    : Array.isArray(parsed.correctAnswer) && (parsed.correctAnswer as number[]).includes(optIndex);
                                  return (
                                    <div key={optIndex} className={isCorrect ? 'text-green-600 font-medium' : ''}>
                                      {String.fromCharCode(65 + optIndex)}. {opt}
                                      {isCorrect && ' ✓'}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {parsed.type === 'boolean' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                <span className={parsed.correctAnswer ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                  {parsed.correctAnswer ? '正确' : '错误'}
                                </span>
                              </div>
                            )}
                            {parsed.type === 'fill' && Array.isArray(parsed.correctAnswer) && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                答案：{parsed.correctAnswer.join('，')}
                              </div>
                            )}
                            {parsed.type === 'essay' && typeof parsed.correctAnswer === 'string' && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                参考答案：{parsed.correctAnswer}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleEditParsedQuestion(index)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                              title="编辑"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleRemoveParsedQuestion(index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                              title="移除"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleImportParsedQuestions}
                    className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <CheckCircle2 size={18} />
                    导入所有题目 ({parsedQuestions.length} 道)
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelAutoParse}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={handleAutoParse}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  智能识别
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑对话框 */}
      {isEditing && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingQuestion.id ? '编辑题目' : '新增题目'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 题目类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    题目类型
                  </label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      const defaults = getDefaultValuesForType(newType);
                      setEditingQuestion({ ...editingQuestion, type: newType, ...defaults });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="boolean">判断题</option>
                    <option value="fill">填空题</option>
                    <option value="essay">简答题</option>
                  </select>
                </div>

                {/* 题目内容 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    题目内容 *
                  </label>
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, question: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="请输入题目内容..."
                  />
                </div>

                {/* 题目配图：所有题型均支持多张上传，按选择顺序自动编号 图片a/b/c */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    题目配图（可选）
                  </label>
                  <button
                    type="button"
                    onClick={handleMultipleImageUpload}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Upload size={16} />
                    上传图片（可一次多选）
                  </button>
                  {(editingQuestion.questionImages?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {editingQuestion.questionImages!.map((img, idx) => (
                        <div key={idx} className="relative flex flex-col items-center gap-1">
                          <img
                            src={img}
                            alt={`图片${String.fromCharCode(97 + idx)}`}
                            className="h-24 w-24 object-cover rounded border border-gray-200"
                          />
                          <span className="text-xs font-semibold text-gray-500">
                            图片{String.fromCharCode(97 + idx)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = editingQuestion.questionImages!.filter((_, i) => i !== idx);
                              setEditingQuestion({ ...editingQuestion, questionImages: newImgs.length ? newImgs : undefined });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                            title="删除此图片"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 选择题选项 */}
                {(editingQuestion.type === 'single' || editingQuestion.type === 'multiple') && editingQuestion.options && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      选项 * (至少2个)
                    </label>
                    <div className="space-y-3">
                      {editingQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="font-semibold">{String.fromCharCode(65 + index)}.</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...editingQuestion.options!];
                              newOptions[index] = e.target.value;
                              setEditingQuestion({ ...editingQuestion, options: newOptions });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                          />
                          <button
                            onClick={() => handleImageUpload('optionImages', index)}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                            title="上传选项图片"
                          >
                            <ImageIcon size={16} />
                          </button>
                          {editingQuestion.type === 'single' ? (
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={editingQuestion.correctAnswer === index}
                              onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: index })}
                              className="w-5 h-5"
                              title="设为正确答案"
                            />
                          ) : (
                            <input
                              type="checkbox"
                              checked={Array.isArray(editingQuestion.correctAnswer) && (editingQuestion.correctAnswer as number[]).includes(index)}
                              onChange={(e) => {
                                const current = Array.isArray(editingQuestion.correctAnswer) ? editingQuestion.correctAnswer : [];
                                if (e.target.checked) {
                                  const newArray = [...current, index] as number[];
                                  setEditingQuestion({ ...editingQuestion, correctAnswer: newArray });
                                } else {
                                  const newArray = current.filter(i => i !== index) as number[];
                                  setEditingQuestion({ ...editingQuestion, correctAnswer: newArray });
                                }
                              }}
                              className="w-5 h-5"
                              title="设为正确答案"
                            />
                          )}
                          {editingQuestion.options && editingQuestion.options.length > 2 && (
                            <button
                              onClick={() => {
                                const newOptions = editingQuestion.options!.filter((_, i) => i !== index);
                                setEditingQuestion({ ...editingQuestion, options: newOptions });
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newOptions = [...(editingQuestion.options || []), ''];
                        setEditingQuestion({ ...editingQuestion, options: newOptions });
                      }}
                      className="mt-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                    >
                      + 添加选项
                    </button>
                  </div>
                )}

                {/* 判断题选项（固定） */}
                {editingQuestion.type === 'boolean' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      正确答案
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 px-4 py-2border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="booleanAnswer"
                          checked={editingQuestion.correctAnswer === true}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: true })}
                          className="w-5 h-5"
                        />
                        <span className="text-green-600 font-semibold">正确</span>
                      </label>
                      <label className="flex items-center gap-2 px-4 py-2border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="radio"
                          name="booleanAnswer"
                          checked={editingQuestion.correctAnswer === false}
                          onChange={() => setEditingQuestion({ ...editingQuestion, correctAnswer: false })}
                          className="w-5 h-5"
                        />
                        <span className="text-red-600 font-semibold">错误</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 填空题答案 */}
                {editingQuestion.type === 'fill' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        填空答案 * ({Array.isArray(editingQuestion.correctAnswer) ? editingQuestion.correctAnswer.length : editingQuestion.fillBlanks || extractFillBlanksCount(editingQuestion.question || '')}个空)
                      </label>
                      <button
                        onClick={() => {
                          const newAnswers = Array.isArray(editingQuestion.correctAnswer)
                            ? [...editingQuestion.correctAnswer, ''] as string[]
                            : ['', ''];
                          setEditingQuestion({
                            ...editingQuestion,
                            correctAnswer: newAnswers,
                            fillBlanks: newAnswers.length
                          });
                        }}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                      >
                        + 添加填空
                      </button>
                    </div>
                    {Array.isArray(editingQuestion.correctAnswer) && editingQuestion.correctAnswer.map((answer, index) => (
                      <div key={index} className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-700 dark:text-gray-300 min-w-[1.5rem]">
                            {String.fromCharCode(97 + index)}.
                          </span>
                          <input
                            type="text"
                            value={answer || ''}
                            onChange={(e) => {
                              const newAnswers = [...(editingQuestion.correctAnswer as string[])];
                              newAnswers[index] = e.target.value;
                              setEditingQuestion({ ...editingQuestion, correctAnswer: newAnswers, fillBlanks: newAnswers.length });
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder={`第 ${String.fromCharCode(97 + index)} 空的答案（可用"或"分隔多个正确答案）`}
                          />
                          {/* 上传该空对应的图片 */}
                          <button
                            type="button"
                            onClick={() => handleImageUpload('fillImages', index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title={`上传第 ${String.fromCharCode(97 + index)} 空的图片`}
                          >
                            <ImageIcon size={16} />
                          </button>
                          <button
                            onClick={() => {
                              const newAnswers = (editingQuestion.correctAnswer as string[]).filter((_, i) => i !== index);
                              const newImages = (editingQuestion.fillImages || []).filter((_, i) => i !== index);
                              setEditingQuestion({
                                ...editingQuestion,
                                correctAnswer: newAnswers,
                                fillBlanks: newAnswers.length,
                                fillImages: newImages.length ? newImages : undefined,
                              });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="删除此填空"
                            disabled={Array.isArray(editingQuestion.correctAnswer) && editingQuestion.correctAnswer.length <= 1}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {/* 已上传的图片预览 */}
                        {editingQuestion.fillImages?.[index] && (
                          <div className="ml-7 flex items-center gap-2">
                            <img
                              src={editingQuestion.fillImages[index]}
                              alt={`第${String.fromCharCode(97 + index)}空图片`}
                              className="h-20 rounded border border-gray-200 object-contain"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(editingQuestion.fillImages || [])];
                                newImages[index] = '';
                                setEditingQuestion({ ...editingQuestion, fillImages: newImages });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded text-xs"
                              title="删除图片"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      在题目中使用 _____ 标记填空位置，如："发动机缸体通常使用_____材料制造。"
                    </div>
                  </div>
                )}

                {/* 简答题答案 */}
                {editingQuestion.type === 'essay' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      参考答案 *
                    </label>
                    <textarea
                      value={typeof editingQuestion.correctAnswer === 'string' ? editingQuestion.correctAnswer : ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, correctAnswer: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="请输入参考答案..."
                    />
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">最大字数：</label>
                        <input
                          type="number"
                          value={editingQuestion.maxLength || 200}
                          onChange={(e) => setEditingQuestion({
                            ...editingQuestion,
                            maxLength: parseInt(e.target.value) || 200
                          })}
                          className="w-24 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 难度 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      难度
                    </label>
                    <select
                      value={editingQuestion.difficulty}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      分类
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.category || ''}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="如：材料应用"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      标签
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.tags?.join(', ') || ''}
                      onChange={(e) => setEditingQuestion({
                        ...editingQuestion,
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="用逗号分隔"
                    />
                  </div>
                </div>

                {/* 解析 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    答案解析
                  </label>
                  <textarea
                    value={editingQuestion.explanation || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="请输入答案解析..."
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveQuestion}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 题目列表 */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div
            key={question.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {question.type === 'single' && '单选'}
                    {question.type === 'multiple' && '多选'}
                    {question.type === 'boolean' && '判断'}
                    {question.type === 'fill' && '填空'}
                    {question.type === 'essay' && '简答'}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      question.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {question.difficulty === 'easy' && '简单'}
                    {question.difficulty === 'medium' && '中等'}
                    {question.difficulty === 'hard' && '困难'}
                  </span>
                  {question.category && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {question.category}
                    </span>
                  )}
                  {(question.imageUrl || (question.questionImages && question.questionImages.length > 0)) && (
                    <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex items-center gap-1">
                      <ImageIcon size={12} />
                      {question.questionImages && question.questionImages.length > 1
                        ? `${question.questionImages.length}张配图`
                        : '有配图'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {question.question}
                </h3>

                {/* 显示选项（选择题和判断题） */}
                {(question.type === 'single' || question.type === 'multiple' || question.type === 'boolean') && question.options && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {question.options.map((option, index) => {
                      let isCorrect = false;
                      if (question.type === 'boolean') {
                        isCorrect = (question.correctAnswer === true && index === 0) || (question.correctAnswer === false && index === 1);
                      } else if (Array.isArray(question.correctAnswer)) {
                        isCorrect = (question.correctAnswer as number[]).includes(index);
                      } else {
                        isCorrect = question.correctAnswer === index;
                      }

                      return (
                        <div key={index} className="flex items-center gap-2">
                          <span className={isCorrect ? 'text-green-600 font-semibold' : ''}>
                            {String.fromCharCode(65 + index)}. {option}
                            {isCorrect && ' ✓'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 显示填空题答案 */}
                {question.type === 'fill' && Array.isArray(question.correctAnswer) && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-semibold mb-1">填空答案：</div>
                    {question.correctAnswer.map((answer, index) => (
                      <div key={index} className="text-green-600">
                        第{index + 1}空：{answer}
                      </div>
                    ))}
                  </div>
                )}

                {/* 显示简答题参考答案 */}
                {question.type === 'essay' && typeof question.correctAnswer === 'string' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-semibold mb-1">参考答案：</div>
                    <div className="text-green-600">
                      {question.correctAnswer}
                    </div>
                  </div>
                )}
                {question.explanation && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
                    解析：{question.explanation}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded"
                  title="编辑"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            暂无题目
          </div>
        )}
      </div>
    </div>
  );
}
