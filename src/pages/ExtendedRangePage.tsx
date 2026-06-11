import { useState } from 'react';
import { extendedRangeData, ER_COLOR_MAP } from '../data/extendedRangeAssembly';
import type { ERPart, ERSubAssembly } from '../data/extendedRangeAssembly';
import ExtendedRangeEngineDiagram from '../components/ExtendedRangeEngineDiagram';

const totalAssemblies = extendedRangeData.reduce((s, g) => s + g.assemblies.length, 0);
const totalSubAssemblies = extendedRangeData.reduce(
  (s, g) => s + g.assemblies.reduce((s2, a) => s2 + a.subAssemblies.length, 0), 0
);
const totalParts = extendedRangeData.reduce(
  (s, g) => s + g.assemblies.reduce(
    (s2, a) => s2 + a.subAssemblies.reduce((s3, sub) => s3 + sub.parts.length, 0), 0
  ), 0
);

export default function ExtendedRangePage() {
  const [selectedGroupId, setSelectedGroupId]       = useState<string>('');
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('');
  const [selectedSubId, setSelectedSubId]           = useState<string>('');
  const [expandedGroupIds, setExpandedGroupIds]     = useState<Set<string>>(new Set());
  const [selectedPart, setSelectedPart]             = useState<ERPart | null>(null);

  const selectedGroup    = extendedRangeData.find(g => g.id === selectedGroupId) ?? null;
  const selectedAssembly = selectedGroup?.assemblies.find(a => a.id === selectedAssemblyId) ?? null;
  const selectedSub      = selectedAssembly?.subAssemblies.find(s => s.id === selectedSubId) ?? null;
  const colors           = selectedGroup ? (ER_COLOR_MAP[selectedGroup.color as keyof typeof ER_COLOR_MAP] ?? ER_COLOR_MAP.blue) : ER_COLOR_MAP.blue;

  function toggleGroup(id: string) {
    setExpandedGroupIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectGroup(id: string) {
    setSelectedGroupId(id);
    setSelectedAssemblyId('');
    setSelectedSubId('');
    setSelectedPart(null);
    setExpandedGroupIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function selectAssembly(groupId: string, assemblyId: string) {
    setSelectedGroupId(groupId);
    setSelectedAssemblyId(assemblyId);
    setSelectedSubId('');
    setSelectedPart(null);
  }

  function countGroupParts(gid: string) {
    const g = extendedRangeData.find(x => x.id === gid);
    if (!g) return 0;
    return g.assemblies.reduce((s, a) => s + a.subAssemblies.reduce((s2, sub) => s2 + sub.parts.length, 0), 0);
  }

  // ── Parts table (shared between assembly view and sub-assembly view) ─────
  const renderPartsTable = (subAssemblies: ERSubAssembly[], title?: string) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      {title && (
        <div className={`px-4 py-2.5 text-sm font-medium ${colors.light} ${colors.text} border-b ${colors.border}`}>
          {title}
        </div>
      )}
      <table className="min-w-full">
        <thead>
          <tr className={`${colors.light} border-b ${colors.border}`}>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase w-6">#</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">零部件名称</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">典型材料</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">成型工艺</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">所属分总成</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {subAssemblies.flatMap((sub, si) =>
            sub.parts.map((part, pi) => (
              <tr
                key={part.id}
                className={`cursor-pointer transition-colors ${colors.hover}`}
                onClick={() => setSelectedPart(part)}
              >
                <td className="px-4 py-2.5 text-xs text-gray-400">{si * 100 + pi + 1}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white">{part.name}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                    {part.material}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">{part.process}</td>
                <td className="px-4 py-2.5 text-xs text-gray-400 hidden md:table-cell">{sub.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* ── 页面标题 ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🔋</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">增程系统</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              增程式电动车发动机非金属材料体系 · {extendedRangeData.length} 大系统 · {totalAssemblies} 个总成 · {totalSubAssemblies} 个分总成 · {totalParts} 个零件
            </p>
          </div>
        </div>

        {/* 材料趋势横幅 */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-4 text-white mt-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏗️</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">主要材料</p>
                <p className="text-sm font-semibold">PA66系列 · PBT-GF · PPS-GF · PA6系列</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">主要工艺</p>
                <p className="text-sm font-semibold">注塑成型（全部零件）· 金属嵌件注塑</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">设计目标</p>
                <p className="text-sm font-semibold">耐高温 · 低摩擦 · 轻量化 · 高精度</p>
              </div>
            </div>
            <div className="ml-auto text-right hidden md:block">
              <p className="text-xs text-slate-400">参考文件</p>
              <p className="text-sm text-slate-200">增程系统-非金属材料零部件分级.docx</p>
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
            {extendedRangeData.map(group => {
              const c = ER_COLOR_MAP[group.color as keyof typeof ER_COLOR_MAP] ?? ER_COLOR_MAP.blue;
              const isGrpSelected = selectedGroupId === group.id;
              const isExpanded = expandedGroupIds.has(group.id);
              return (
                <div key={group.id} className="mb-0.5">
                  {/* Level 1: 系统组 */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-2 rounded-md cursor-pointer text-sm select-none transition-colors ${
                      isGrpSelected && !selectedAssemblyId
                        ? `${c.light} ${c.text} font-semibold`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => { selectGroup(group.id); toggleGroup(group.id); }}
                  >
                    <span className="text-xs text-gray-400 w-3 flex-shrink-0">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <span>{group.icon}</span>
                    <span className="flex-1 truncate font-medium text-xs">{group.name}</span>
                  </div>
                  {/* Level 2: 总成 */}
                  {isExpanded && (
                    <div className="ml-4 space-y-0.5 mt-0.5">
                      {group.assemblies.map(asm => (
                        <div
                          key={asm.id}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                            selectedAssemblyId === asm.id
                              ? `${c.light} ${c.text} font-medium`
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => selectAssembly(group.id, asm.id)}
                        >
                          <span className="text-gray-300">└</span>
                          <span className="flex-1 truncate">{asm.name}</span>
                          <span className="text-gray-400 text-[10px] flex-shrink-0">
                            {asm.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0)}件
                          </span>
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
          {/* 未选择：显示全局概览 + SVG示意图 */}
          {!selectedGroupId ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">增程系统全局示意图</h2>
              <p className="text-sm text-gray-500 mb-4">点击图中各系统区域，或使用左侧导航树浏览各总成零件清单。</p>
              <ExtendedRangeEngineDiagram
                groups={extendedRangeData}
                selectedGroupId={selectedGroupId}
                onGroupSelect={selectGroup}
              />
              {/* 系统卡片速览 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {extendedRangeData.map(g => {
                  const c = ER_COLOR_MAP[g.color as keyof typeof ER_COLOR_MAP] ?? ER_COLOR_MAP.blue;
                  return (
                    <div
                      key={g.id}
                      onClick={() => selectGroup(g.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${c.border} ${c.hover}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{g.icon}</span>
                        <span className={`text-sm font-semibold ${c.text}`}>{g.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {g.assemblies.length} 总成 · {countGroupParts(g.id)} 零件
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !selectedAssemblyId ? (
            /* 选了系统组，未选总成：显示组概览 + 示意图 + 总成卡片 */
            <div className="p-6">
              {/* 面包屑 */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <button className="hover:text-blue-600" onClick={() => { setSelectedGroupId(''); setSelectedAssemblyId(''); }}>
                  增程系统
                </button>
                <span>/</span>
                <span className={`font-medium ${colors.text}`}>{selectedGroup?.icon} {selectedGroup?.name}</span>
              </div>

              {/* 系统标题卡 */}
              <div className={`rounded-xl p-5 mb-5 ${colors.light} ${colors.border} border`}>
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{selectedGroup?.icon}</span>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedGroup?.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedGroup?.description}</p>
                    <div className="flex gap-4 pt-3 border-t border-gray-200">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${colors.text}`}>{selectedGroup?.assemblies.length}</p>
                        <p className="text-xs text-gray-500">一级总成</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          {selectedGroup?.assemblies.reduce((s, a) => s + a.subAssemblies.length, 0)}
                        </p>
                        <p className="text-xs text-gray-500">分总成</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${colors.text}`}>{countGroupParts(selectedGroupId)}</p>
                        <p className="text-xs text-gray-500">零部件</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 示意图（仍显示，当前系统高亮） */}
              <div className="mb-5">
                <ExtendedRangeEngineDiagram
                  groups={extendedRangeData}
                  selectedGroupId={selectedGroupId}
                  onGroupSelect={selectGroup}
                />
              </div>

              {/* 总成卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup?.assemblies.map(asm => (
                  <div
                    key={asm.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${colors.border} ${colors.hover}`}
                    onClick={() => selectAssembly(selectedGroupId, asm.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{asm.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {asm.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0)} 个零件
                      </span>
                    </div>
                    <div className="space-y-1">
                      {asm.subAssemblies.map(sub => (
                        <div key={sub.id} className="text-xs text-gray-500">
                          <span className="font-medium text-gray-600 dark:text-gray-400">{sub.name}</span>
                          {' — '}
                          {sub.parts.slice(0, 2).map(p => p.name).join('、')}
                          {sub.parts.length > 2 ? `…共${sub.parts.length}件` : ''}
                        </div>
                      ))}
                    </div>
                    <p className={`text-xs mt-2 font-medium ${colors.text}`}>查看完整清单 →</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 选了总成：显示全部分总成+零件表 */
            <div className="p-6">
              {/* 面包屑 */}
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
                <button className="hover:text-blue-600" onClick={() => { setSelectedGroupId(''); setSelectedAssemblyId(''); }}>
                  增程系统
                </button>
                <span>/</span>
                <button className="hover:text-blue-600" onClick={() => setSelectedAssemblyId('')}>
                  {selectedGroup?.icon} {selectedGroup?.name}
                </button>
                <span>/</span>
                <span className={`font-medium ${colors.text}`}>{selectedAssembly?.name}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedAssembly?.name}</h2>
                <span className="text-sm text-gray-500">
                  {selectedAssembly?.subAssemblies.length} 个分总成 ·{' '}
                  {selectedAssembly?.subAssemblies.reduce((s, sub) => s + sub.parts.length, 0)} 个零件
                </span>
              </div>

              {/* Tab: 分总成切换 */}
              {(selectedAssembly?.subAssemblies.length ?? 0) > 1 && (
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4 flex-wrap">
                  <button
                    onClick={() => setSelectedSubId('')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      !selectedSubId
                        ? `bg-white dark:bg-gray-600 ${colors.text} shadow`
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    全部
                  </button>
                  {selectedAssembly?.subAssemblies.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedSubId === sub.id
                          ? `bg-white dark:bg-gray-600 ${colors.text} shadow`
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {sub.name}
                      <span className="ml-1 text-gray-400">({sub.parts.length})</span>
                    </button>
                  ))}
                </div>
              )}

              {selectedSub
                ? renderPartsTable([selectedSub])
                : renderPartsTable(selectedAssembly?.subAssemblies ?? [])
              }
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className={`flex justify-between items-start mb-5 pb-4 border-b ${colors.border}`}>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPart.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedGroup?.icon} {selectedGroup?.name} / {selectedAssembly?.name}
                    {selectedSub ? ` / ${selectedSub.name}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
                >×</button>
              </div>

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

              {/* 材料解读 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-600 mb-1.5">材料选型要点</p>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                  {selectedPart.material.includes('PPS')
                    ? 'PPS（聚苯硫醚）耐热性优异（>260℃），耐化学品，尺寸稳定，适用于高温冷却和排放系统。'
                    : selectedPart.material.includes('PA46')
                      ? 'PA46耐热性高于PA66（热变形温度约290℃），适用于长期高温工况的电机和传动部件。'
                      : selectedPart.material.includes('PA66')
                        ? 'PA66（GF增强）兼具强度、刚性与耐热性，是增程发动机非金属零件的最主要选材。'
                        : selectedPart.material.includes('PBT')
                          ? 'PBT-GF30耐高温、尺寸稳定、电气绝缘性好，广泛用于传感器壳体和电连接器。'
                          : selectedPart.material.includes('PA12') || selectedPart.material.includes('PA11') || selectedPart.material.includes('PA610') || selectedPart.material.includes('PA612')
                            ? '长链PA（PA12/PA11/PA610/PA612）柔韧性好、耐化学品、抗水解，适用于燃油管路系统。'
                            : '注塑成型工艺可高效制造复杂形状零件，实现以塑代钢，减轻发动机重量。'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
