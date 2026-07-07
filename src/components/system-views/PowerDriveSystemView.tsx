import { useEffect, useRef, useState } from 'react';
import PowerDriveSystemDiagram from '../PowerDriveSystemDiagram';
import { powerDriveData, PD_COLOR_MAP } from '../../data/powerDriveAssembly';
import type { PDPart, PDSubAssembly } from '../../data/powerDriveAssembly';

const totalAssemblies = powerDriveData.reduce((sum, group) => sum + group.assemblies.length, 0);
const totalSubAssemblies = powerDriveData.reduce(
  (sum, group) => sum + group.assemblies.reduce((groupSum, assembly) => groupSum + assembly.subAssemblies.length, 0),
  0,
);
const totalParts = powerDriveData.reduce(
  (sum, group) => sum + group.assemblies.reduce((groupSum, assembly) => groupSum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0), 0),
  0,
);

export default function PowerDriveSystemView() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set());
  const [selectedPart, setSelectedPart] = useState<PDPart | null>(null);

  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rightPanelRef.current?.scrollTo({ top: 0 });
    rightPanelRef.current?.closest('[data-pdsv-root]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedGroupId, selectedAssemblyId]);

  const selectedGroup = powerDriveData.find(group => group.id === selectedGroupId) ?? null;
  const selectedAssembly = selectedGroup?.assemblies.find(assembly => assembly.id === selectedAssemblyId) ?? null;
  const selectedSub = selectedAssembly?.subAssemblies.find(subAssembly => subAssembly.id === selectedSubId) ?? null;
  const colors = selectedGroup ? (PD_COLOR_MAP[selectedGroup.color as keyof typeof PD_COLOR_MAP] ?? PD_COLOR_MAP.blue) : PD_COLOR_MAP.blue;

  function toggleGroup(id: string) {
    setExpandedGroupIds(previous => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectGroup(id: string) {
    setSelectedGroupId(id);
    setSelectedAssemblyId('');
    setSelectedSubId('');
    setSelectedPart(null);
    setExpandedGroupIds(previous => {
      const next = new Set(previous);
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

  function countGroupParts(groupId: string) {
    const group = powerDriveData.find(item => item.id === groupId);
    if (!group) return 0;
    return group.assemblies.reduce((sum, assembly) => sum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0), 0);
  }

  const renderPartsTable = (subAssemblies: PDSubAssembly[], title?: string) => (
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
          {subAssemblies.flatMap((subAssembly, subIndex) =>
            subAssembly.parts.map((part, partIndex) => (
              <tr
                key={part.id}
                className={`cursor-pointer transition-colors ${colors.hover}`}
                onClick={() => {
                  setSelectedSubId(subAssembly.id);
                  setSelectedPart(part);
                }}
              >
                <td className="px-4 py-2.5 text-xs text-gray-400">{subIndex * 100 + partIndex + 1}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white">{part.name}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                    {part.material}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">{part.process}</td>
                <td className="px-4 py-2.5 text-xs text-gray-400 hidden md:table-cell">{subAssembly.name}</td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );

  const materialInsight = (material: string) => {
    if (material.includes('PPS')) {
      return 'PPS 具有优异的耐热性、尺寸稳定性和绝缘性能，适合动力驱动系统中的高温绝缘与精密支撑件。';
    }
    if (material.includes('PA46')) {
      return 'PA46 在耐热和耐磨方面表现突出，适用于轴承保持架等长期受载、摩擦敏感的传动支撑部件。';
    }
    if (material.includes('PBT')) {
      return 'PBT-GF30 兼顾电气绝缘、尺寸稳定和加工效率，常用于控制信号接口与电连接结构件。';
    }
    if (material.includes('PPA')) {
      return 'PPA 适合电子油泵等高温介质环境，可在较高温度下保持强度和尺寸稳定。';
    }
    if (material.includes('PA66')) {
      return 'PA66 及其玻纤增强体系兼具强度、韧性和耐热性，是动力驱动油路、接插件和结构注塑件的主流材料。';
    }
    if (material.includes('PP')) {
      return 'PP 具有良好的耐化学性和成型性，适合防尘盖等轻量化防护类部件。';
    }
    return '动力驱动系统非金属件以注塑成型为主，通过材料耐热、绝缘、耐介质和轻量化能力满足电驱总成工况要求。';
  };

  return (
    <div data-pdsv-root>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          动力驱动系统非金属材料体系 · {powerDriveData.length} 大分组 · {totalAssemblies} 个总成 · {totalSubAssemblies} 个分总成 · {totalParts} 个零件
        </p>
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-4 text-white">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏗️</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">主要材料</p>
                <p className="text-sm font-semibold">PA66系列 · PPS-GF · PBT-GF · PA46 · PPA</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">主要工艺</p>
                <p className="text-sm font-semibold">注塑成型 · 绝缘结构件一体化 · 油路功能件轻量化</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-xs text-slate-300 font-medium uppercase tracking-wide">设计目标</p>
                <p className="text-sm font-semibold">耐热绝缘 · 耐油耐介质 · 高尺寸稳定 · 轻量高集成</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[560px]">
        <div className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">系统分类</p>
            {powerDriveData.map(group => {
              const groupColors = PD_COLOR_MAP[group.color as keyof typeof PD_COLOR_MAP] ?? PD_COLOR_MAP.blue;
              const isGroupSelected = selectedGroupId === group.id;
              const isExpanded = expandedGroupIds.has(group.id);

              return (
                <div key={group.id} className="mb-0.5">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-2 rounded-md cursor-pointer text-sm select-none transition-colors ${
                      isGroupSelected && !selectedAssemblyId
                        ? `${groupColors.light} ${groupColors.text} font-semibold`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => selectGroup(group.id)}
                  >
                    <span
                      className="text-xs text-gray-400 w-3 flex-shrink-0 hover:text-gray-600"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleGroup(group.id);
                      }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <span>{group.icon}</span>
                    <span className="flex-1 truncate font-medium text-xs">{group.name}</span>
                  </div>
                  {isExpanded && (
                    <div className="ml-4 space-y-0.5 mt-0.5">
                      {group.assemblies.map(assembly => (
                        <div
                          key={assembly.id}
                          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${
                            selectedAssemblyId === assembly.id
                              ? `${groupColors.light} ${groupColors.text} font-medium`
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => selectAssembly(group.id, assembly.id)}
                        >
                          <span className="text-gray-300">└</span>
                          <span className="flex-1 truncate">{assembly.name}</span>
                          <span className="text-gray-400 text-[10px] flex-shrink-0">
                            {assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0)}件
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

        <div className="flex-1 overflow-auto" ref={rightPanelRef}>
          {!selectedGroupId ? (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">动力驱动系统全局示意图</h2>
              <p className="text-sm text-gray-500 mb-4">点击图中各功能区域，或使用左侧导航树浏览动力驱动总成与零件清单。</p>
              <PowerDriveSystemDiagram groups={powerDriveData} selectedGroupId={selectedGroupId} onGroupSelect={selectGroup} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                {powerDriveData.map(group => {
                  const groupColors = PD_COLOR_MAP[group.color as keyof typeof PD_COLOR_MAP] ?? PD_COLOR_MAP.blue;
                  return (
                    <div
                      key={group.id}
                      onClick={() => selectGroup(group.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${groupColors.border} ${groupColors.hover}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{group.icon}</span>
                        <span className={`text-sm font-semibold ${groupColors.text}`}>{group.name}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {group.assemblies.length} 总成 · {countGroupParts(group.id)} 零件
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : !selectedAssemblyId ? (
            <div className="p-6">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                <button className="hover:text-blue-600" onClick={() => { setSelectedGroupId(''); setSelectedAssemblyId(''); }}>
                  动力驱动系统
                </button>
                <span>/</span>
                <span className={`font-medium ${colors.text}`}>{selectedGroup?.icon} {selectedGroup?.name}</span>
              </div>

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
                          {selectedGroup?.assemblies.reduce((sum, assembly) => sum + assembly.subAssemblies.length, 0)}
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

              <div className={`rounded-xl border ${colors.border} mb-5 overflow-hidden`}>
                <div className={`px-4 py-2 ${colors.light} border-b ${colors.border}`}>
                  <p className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                    {selectedGroup?.icon} {selectedGroup?.name} · 总成结构示意图
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-2 items-center justify-start">
                    {selectedGroup?.assemblies.map((assembly, index) => {
                      const assemblyPartCount = assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0);
                      const isLast = index === selectedGroup.assemblies.length - 1;
                      return (
                        <div key={assembly.id} className="flex items-center gap-2">
                          <div
                            className={`flex flex-col items-center justify-center rounded-lg border-2 cursor-pointer transition-all hover:shadow-md px-3 py-2 min-w-[90px] text-center ${colors.border} ${colors.hover} bg-white dark:bg-gray-700`}
                            onClick={() => selectAssembly(selectedGroupId, assembly.id)}
                          >
                            <span className={`text-[11px] font-semibold ${colors.text} leading-tight`}>{assembly.name}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{assemblyPartCount}件</span>
                          </div>
                          {!isLast && <span className={`text-lg font-bold ${colors.text} opacity-50`}>→</span>}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3">点击各总成节点查看完整零件清单</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup?.assemblies.map(assembly => (
                  <div
                    key={assembly.id}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${colors.border} ${colors.hover}`}
                    onClick={() => selectAssembly(selectedGroupId, assembly.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{assembly.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                        {assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0)} 个零件
                      </span>
                    </div>
                    <div className="space-y-1">
                      {assembly.subAssemblies.map(subAssembly => (
                        <div key={subAssembly.id} className="text-xs text-gray-500">
                          <span className="font-medium text-gray-600 dark:text-gray-400">{subAssembly.name}</span>
                          {' — '}
                          {subAssembly.parts.slice(0, 2).map(part => part.name).join('、')}
                          {subAssembly.parts.length > 2 ? `…共${subAssembly.parts.length}件` : ''}
                        </div>
                      ))}
                    </div>
                    <p className={`text-xs mt-2 font-medium ${colors.text}`}>查看完整清单 →</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
                <button className="hover:text-blue-600" onClick={() => { setSelectedGroupId(''); setSelectedAssemblyId(''); }}>
                  动力驱动系统
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
                  {selectedAssembly?.subAssemblies.length} 个分总成 · {selectedAssembly?.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0)} 个零件
                </span>
              </div>
              {(selectedAssembly?.subAssemblies.length ?? 0) > 1 && (
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4 flex-wrap">
                  <button
                    onClick={() => setSelectedSubId('')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      !selectedSubId ? `bg-white dark:bg-gray-600 ${colors.text} shadow` : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    全部
                  </button>
                  {selectedAssembly?.subAssemblies.map(subAssembly => (
                    <button
                      key={subAssembly.id}
                      onClick={() => setSelectedSubId(subAssembly.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        selectedSubId === subAssembly.id ? `bg-white dark:bg-gray-600 ${colors.text} shadow` : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {subAssembly.name}
                      <span className="ml-1 text-gray-400">({subAssembly.parts.length})</span>
                    </button>
                  ))}
                </div>
              )}
              {selectedSub ? renderPartsTable([selectedSub]) : renderPartsTable(selectedAssembly?.subAssemblies ?? [])}
            </div>
          )}
        </div>
      </div>

      {selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPart(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={event => event.stopPropagation()}>
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
              {selectedPart.note && (
                <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20 mb-4">
                  <p className="text-xs text-amber-600 font-semibold mb-1.5">备注</p>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{selectedPart.note}</p>
                </div>
              )}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-xs font-semibold text-blue-600 mb-1.5">材料选型要点</p>
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{materialInsight(selectedPart.material)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
