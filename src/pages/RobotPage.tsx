import { useState } from 'react';
import { robotAssemblyData, type RobotAssembly, type RobotPart } from '../data/robotAssembly';

const COLOR_MAP: Record<string, { bg: string; light: string; border: string; text: string; badge: string; hover: string }> = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   border: 'border-blue-200', text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',   hover: 'hover:bg-blue-50' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  border: 'border-amber-200',text: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700',  hover: 'hover:bg-amber-50' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-200',text: 'text-purple-700',badge: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-50' },
  cyan:   { bg: 'bg-cyan-600',   light: 'bg-cyan-50',   border: 'border-cyan-200',  text: 'text-cyan-700',  badge: 'bg-cyan-100 text-cyan-700',    hover: 'hover:bg-cyan-50' },
  indigo: { bg: 'bg-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-200',text: 'text-indigo-700',badge: 'bg-indigo-100 text-indigo-700', hover: 'hover:bg-indigo-50' },
  green:  { bg: 'bg-green-600',  light: 'bg-green-50',  border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700',   hover: 'hover:bg-green-50' },
  orange: { bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200',text: 'text-orange-700',badge: 'bg-orange-100 text-orange-700',  hover: 'hover:bg-orange-50' },
  pink:   { bg: 'bg-pink-600',   light: 'bg-pink-50',   border: 'border-pink-200',  text: 'text-pink-700',  badge: 'bg-pink-100 text-pink-700',    hover: 'hover:bg-pink-50' },
};

export default function RobotPage() {
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('rb-01');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['rb-01']));
  const [selectedPart, setSelectedPart] = useState<RobotPart | null>(null);

  const selectedAssembly = robotAssemblyData.find(a => a.id === selectedAssemblyId) ?? null;
  const selectedSub = selectedAssembly?.subAssemblies.find(s => s.id === selectedSubId) ?? null;
  const colors = selectedAssembly ? (COLOR_MAP[selectedAssembly.color] ?? COLOR_MAP.blue) : COLOR_MAP.blue;

  const totalParts = robotAssemblyData.reduce(
    (sum, a) => sum + a.subAssemblies.reduce((s2, sub) => s2 + sub.parts.length, 0), 0
  );
  const totalSubs = robotAssemblyData.reduce((sum, a) => sum + a.subAssemblies.length, 0);

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* ── 页面标题 ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🤖</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">智能机器人</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              人形机器人非金属材料体系 · {robotAssemblyData.length} 大系统 · {totalSubs} 个分总成 · {totalParts} 个零部件
            </p>
          </div>
        </div>

        {/* 材料趋势横幅 */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-4 text-white mt-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">轻量化</p>
                <p className="text-sm font-semibold">以塑代钢 · PEEK · 碳纤维复材</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">智能化</p>
                <p className="text-sm font-semibold">电子皮肤 · 柔性传感 · 多模态感知</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧬</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">类人化</p>
                <p className="text-sm font-semibold">仿生皮肤 · 仿生肌腱 · 仿生肌肉</p>
              </div>
            </div>
            <div className="ml-auto text-right hidden md:block">
              <p className="text-xs text-slate-400">参考文件</p>
              <p className="text-sm text-slate-200">机器人材料 - 非金属.docx</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 主体：左侧树 + 右侧内容 ── */}
      <div className="flex gap-0 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden min-h-[600px]">

        {/* ── 左侧：系统导航树 ── */}
        <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">系统分类</p>
            {robotAssemblyData.map(assembly => {
              const c = COLOR_MAP[assembly.color] ?? COLOR_MAP.blue;
              const isAsmSelected = selectedAssemblyId === assembly.id;
              return (
                <div key={assembly.id} className="mb-0.5">
                  {/* Level 1: 系统 */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-2 rounded-md cursor-pointer text-sm select-none transition-colors ${
                      isAsmSelected && selectedSubId === ''
                        ? `${c.light} ${c.text} font-semibold`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setSelectedAssemblyId(assembly.id);
                      setSelectedSubId('');
                      setSelectedPart(null);
                      toggleExpand(assembly.id);
                    }}
                  >
                    <span className="text-xs text-gray-400 w-3 flex-shrink-0">
                      {expandedIds.has(assembly.id) ? '▼' : '▶'}
                    </span>
                    <span>{assembly.icon}</span>
                    <span className="flex-1 truncate font-medium text-xs">{assembly.name}</span>
                  </div>
                  {/* Level 2: 分总成 */}
                  {expandedIds.has(assembly.id) && (
                    <div className="ml-4 space-y-0.5 mt-0.5">
                      {assembly.subAssemblies.map(sub => (
                        <div
                          key={sub.id}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                            selectedSubId === sub.id
                              ? `${c.light} ${c.text} font-medium`
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => {
                            setSelectedAssemblyId(assembly.id);
                            setSelectedSubId(sub.id);
                            setSelectedPart(null);
                          }}
                        >
                          <span className="text-gray-300">└</span>
                          <span className="flex-1 truncate">{sub.name}</span>
                          <span className="text-gray-400 text-[10px] flex-shrink-0">{sub.parts.length}件</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 右侧：内容区 ── */}
        <div className="flex-1 overflow-auto">
          {!selectedAssembly ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>请选择左侧系统</p>
            </div>
          ) : selectedSub ? (
            /* ── 分总成：零件清单表 ── */
            <div className="p-6">
              {/* 面包屑 */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <button className="hover:text-blue-600" onClick={() => setSelectedSubId('')}>
                  {selectedAssembly.icon} {selectedAssembly.name}
                </button>
                <span>/</span>
                <span className={`font-medium ${colors.text}`}>{selectedSub.name}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSub.name}</h2>
                <span className="text-sm text-gray-500">共 {selectedSub.parts.length} 个零部件</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full">
                  <thead>
                    <tr className={`${colors.light} border-b ${colors.border}`}>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-8">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">零部件名称</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">典型材料</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">成型工艺</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">主要供应商</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {selectedSub.parts.map((part, idx) => (
                      <tr
                        key={part.id}
                        className={`transition-colors cursor-pointer ${colors.hover}`}
                        onClick={() => setSelectedPart(part)}
                      >
                        <td className="px-4 py-3 text-sm text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{part.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                            {part.material}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{part.process}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">
                          {part.suppliers?.join('、') ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ── 系统总览 ── */
            <div className="p-6">
              {/* 系统标题 */}
              <div className={`rounded-xl p-5 mb-6 ${colors.light} ${colors.border} border`}>
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{selectedAssembly.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedAssembly.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedAssembly.description}</p>
                    {selectedAssembly.trend && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${colors.badge}`}>
                        <span>📈</span>
                        <span>{selectedAssembly.trend}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${colors.text}`}>{selectedAssembly.subAssemblies.length}</p>
                    <p className="text-xs text-gray-500">分总成</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${colors.text}`}>
                      {selectedAssembly.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0)}
                    </p>
                    <p className="text-xs text-gray-500">零部件</p>
                  </div>
                </div>
              </div>

              {/* 分总成卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedAssembly.subAssemblies.map(sub => (
                  <div
                    key={sub.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${colors.border} ${colors.hover}`}
                    onClick={() => setSelectedSubId(sub.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold text-gray-900 dark:text-white`}>{sub.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {sub.parts.length} 个零件
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sub.parts.map(part => (
                        <div key={part.id} className="flex items-start gap-2 text-xs">
                          <span className="text-gray-300 mt-0.5 flex-shrink-0">•</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{part.name}</span>
                            <span className="text-gray-400 mx-1">—</span>
                            <span className={`${colors.text}`}>{part.material}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className={`text-xs mt-3 font-medium ${colors.text} flex items-center gap-1`}>
                      查看完整清单 →
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 零部件详情弹窗 ── */}
      {selectedPart && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPart(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              {/* 头部 */}
              <div className={`flex justify-between items-start mb-5 pb-4 border-b ${colors.border}`}>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPart.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedAssembly?.icon} {selectedAssembly?.name} / {selectedSub?.name}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                >×</button>
              </div>

              {/* 材料与工艺 */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`rounded-lg p-3 ${colors.light}`}>
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">典型材料</p>
                  <p className={`text-sm font-semibold ${colors.text}`}>{selectedPart.material}</p>
                </div>
                <div className="rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">成型工艺</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{selectedPart.process}</p>
                </div>
              </div>

              {/* 功能描述 */}
              {selectedPart.function && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">功能说明</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {selectedPart.function}
                  </p>
                </div>
              )}

              {/* 详细描述 */}
              {selectedPart.description && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">材料说明</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedPart.description}
                  </p>
                </div>
              )}

              {/* 供应商 */}
              {selectedPart.suppliers && selectedPart.suppliers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">主要供应商</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPart.suppliers.map((s, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
