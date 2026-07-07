import { useEffect, useMemo, useState } from 'react';
import ChassisSystemDiagram from '../ChassisSystemDiagram';
import {
  CHASSIS_COLOR_MAP,
  chassisSubsystems,
  type ChassisAssembly,
  type ChassisPart,
  type ChassisSubAssembly,
  type ChassisSubsystem,
} from '../../data/chassisAssembly';

type ViewState = 'overview' | 'subsystem' | 'assembly' | 'subAssembly' | 'part';

interface PartLocation {
  subsystem: ChassisSubsystem;
  assembly: ChassisAssembly;
  subAssembly: ChassisSubAssembly;
}

const totalAssemblies = chassisSubsystems.reduce((sum, subsystem) => sum + subsystem.assemblies.length, 0);
const totalSubAssemblies = chassisSubsystems.reduce(
  (sum, subsystem) => sum + subsystem.assemblies.reduce((assemblySum, assembly) => assemblySum + assembly.subAssemblies.length, 0),
  0,
);
const totalParts = chassisSubsystems.reduce(
  (sum, subsystem) =>
    sum +
    subsystem.assemblies.reduce(
      (assemblySum, assembly) => assemblySum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
      0,
    ),
  0,
);

const materialHighlights = ['PA66系列', 'POM', 'PBT/PPA/PPS增强体系', 'TPV/TPEE', 'PA12管路材料'];
const processHighlights = ['注塑成型', '增强尼龙结构件', '密封防尘件一体化', '管路夹持与导向件轻量化'];

function countSubsystemParts(subsystem: ChassisSubsystem) {
  return subsystem.assemblies.reduce(
    (sum, assembly) => sum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
    0,
  );
}

function countAssemblyParts(assembly: ChassisAssembly) {
  return assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0);
}

function findPartLocation(partId: string): PartLocation | null {
  for (const subsystem of chassisSubsystems) {
    for (const assembly of subsystem.assemblies) {
      for (const subAssembly of assembly.subAssemblies) {
        if (subAssembly.parts.some(part => part.id === partId)) {
          return { subsystem, assembly, subAssembly };
        }
      }
    }
  }
  return null;
}

function getPartInsight(material: string) {
  if (material.includes('POM')) {
    return 'POM 适合滑块、球座、导向件等低摩擦工位，可提升转向与悬架执行机构的运动稳定性。';
  }
  if (material.includes('TPV') || material.includes('TPEE')) {
    return '弹性体材料兼顾回弹、防尘和耐环境老化性能，常用于缓冲、防尘罩及密封保护件。';
  }
  if (material.includes('PPS') || material.includes('PPA')) {
    return '高温增强树脂适用于执行器、电控互联和高温邻近区域，可保持结构刚度与尺寸稳定。';
  }
  if (material.includes('PA12')) {
    return 'PA12 常用于气路/油路软硬连接件，具备耐介质、耐低温和较好的柔韧性。';
  }
  if (material.includes('PA66') || material.includes('PA6')) {
    return '增强尼龙体系是底盘系统最常见的结构材料，兼顾强度、韧性、耐疲劳与注塑效率。';
  }
  if (material.includes('PBT')) {
    return 'PBT 适用于电气相关外壳、盖板与绝缘支撑件，可兼顾尺寸稳定与绝缘性能。';
  }
  return '该材料用于满足底盘系统在耐久、轻量、尺寸稳定和环境适应性之间的综合平衡。';
}

export default function ChassisSystemView() {
  const [selectedSubsystemId, setSelectedSubsystemId] = useState<ChassisSubsystem['id'] | ''>('');
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('');
  const [selectedSubAssemblyId, setSelectedSubAssemblyId] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<ChassisPart | null>(null);
  const [expandedSubsystemIds, setExpandedSubsystemIds] = useState<Set<string>>(new Set());
  const [expandedAssemblyIds, setExpandedAssemblyIds] = useState<Set<string>>(new Set());

  const selectedSubsystem = useMemo(
    () => chassisSubsystems.find(subsystem => subsystem.id === selectedSubsystemId) ?? null,
    [selectedSubsystemId],
  );
  const selectedAssembly = useMemo(
    () => selectedSubsystem?.assemblies.find(assembly => assembly.id === selectedAssemblyId) ?? null,
    [selectedSubsystem, selectedAssemblyId],
  );
  const selectedSubAssembly = useMemo(
    () => selectedAssembly?.subAssemblies.find(subAssembly => subAssembly.id === selectedSubAssemblyId) ?? null,
    [selectedAssembly, selectedSubAssemblyId],
  );
  const selectedPartLocation = useMemo(
    () => (selectedPart ? findPartLocation(selectedPart.id) : null),
    [selectedPart],
  );

  const activeColors = CHASSIS_COLOR_MAP[selectedSubsystem?.colorKey ?? 'slate'];

  const viewState: ViewState = selectedPart
    ? 'part'
    : selectedSubAssembly
      ? 'subAssembly'
      : selectedAssembly
        ? 'assembly'
        : selectedSubsystem
          ? 'subsystem'
          : 'overview';

  useEffect(() => {
    if (!selectedSubsystemId) return;
    setExpandedSubsystemIds(previous => {
      const next = new Set(previous);
      next.add(selectedSubsystemId);
      return next;
    });
  }, [selectedSubsystemId]);

  useEffect(() => {
    if (!selectedAssemblyId) return;
    setExpandedAssemblyIds(previous => {
      const next = new Set(previous);
      next.add(selectedAssemblyId);
      return next;
    });
  }, [selectedAssemblyId]);

  const openSubsystem = (subsystemId: ChassisSubsystem['id'] | '') => {
    setSelectedSubsystemId(subsystemId);
    setSelectedAssemblyId('');
    setSelectedSubAssemblyId('');
    setSelectedPart(null);
  };

  const openAssembly = (subsystemId: string, assemblyId: string) => {
    setSelectedSubsystemId(subsystemId as ChassisSubsystem['id']);
    setSelectedAssemblyId(assemblyId);
    setSelectedSubAssemblyId('');
    setSelectedPart(null);
  };

  const openSubAssembly = (subsystemId: string, assemblyId: string, subAssemblyId: string) => {
    setSelectedSubsystemId(subsystemId as ChassisSubsystem['id']);
    setSelectedAssemblyId(assemblyId);
    setSelectedSubAssemblyId(subAssemblyId);
    setSelectedPart(null);
  };

  const openPart = (part: ChassisPart, location: PartLocation) => {
    setSelectedSubsystemId(location.subsystem.id);
    setSelectedAssemblyId(location.assembly.id);
    setSelectedSubAssemblyId(location.subAssembly.id);
    setSelectedPart(part);
  };

  const renderBreadcrumb = () => {
    if (viewState === 'overview') {
      return <span className="text-sm text-gray-500">底盘系统 / 总览</span>;
    }

    return (
      <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
        <button className="hover:text-blue-600" onClick={() => openSubsystem('')}>
          底盘系统
        </button>
        {selectedSubsystem && (
          <>
            <span>/</span>
            <button className={`hover:opacity-80 ${activeColors.text}`} onClick={() => openSubsystem(selectedSubsystem.id)}>
              {selectedSubsystem.name}
            </button>
          </>
        )}
        {selectedAssembly && (
          <>
            <span>/</span>
            <button className="hover:text-blue-600" onClick={() => openAssembly(selectedSubsystem!.id, selectedAssembly.id)}>
              {selectedAssembly.name}
            </button>
          </>
        )}
        {selectedSubAssembly && (
          <>
            <span>/</span>
            <button className="hover:text-blue-600" onClick={() => openSubAssembly(selectedSubsystem!.id, selectedAssembly!.id, selectedSubAssembly.id)}>
              {selectedSubAssembly.name}
            </button>
          </>
        )}
        {selectedPart && (
          <>
            <span>/</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">{selectedPart.name}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[620px]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          底盘系统非金属材料体系 · 3 大子系统 · {totalAssemblies} 个总成 · {totalSubAssemblies} 个分总成 · {totalParts} 个零件
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr_1fr] gap-4">
          <div className="rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 text-white p-5">
            <h2 className="text-xl font-bold mb-2">底盘系统专用视图</h2>
            <p className="text-sm text-slate-200 leading-6">
              面向 sys-007 的统一底盘结构视图，联动呈现底盘结构、悬架系统与转向系统的层级数据、零件材料与工艺信息。
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">核心材料</p>
            <div className="flex flex-wrap gap-2">
              {materialHighlights.map(item => (
                <span key={item} className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">主要工艺</p>
            <div className="space-y-1.5">
              {processHighlights.map(item => (
                <p key={item} className="text-sm text-gray-700 dark:text-gray-200">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] min-h-[720px]">
        <div className="border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">底盘树形导航</p>
            <div className="space-y-1">
              {chassisSubsystems.map(subsystem => {
                const colors = CHASSIS_COLOR_MAP[subsystem.colorKey];
                const subsystemSelected = selectedSubsystemId === subsystem.id && !selectedAssemblyId && !selectedSubAssemblyId;
                const subsystemExpanded = expandedSubsystemIds.has(subsystem.id);
                return (
                  <div key={subsystem.id} className="rounded-lg">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        subsystemSelected
                          ? `${colors.light} ${colors.text} font-semibold`
                          : 'text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800'
                      }`}
                      onClick={() => openSubsystem(subsystem.id)}
                    >
                      <span
                        className="w-4 text-xs text-gray-400"
                        onClick={event => {
                          event.stopPropagation();
                          setExpandedSubsystemIds(previous => {
                            const next = new Set(previous);
                            next.has(subsystem.id) ? next.delete(subsystem.id) : next.add(subsystem.id);
                            return next;
                          });
                        }}
                      >
                        {subsystemExpanded ? '▼' : '▶'}
                      </span>
                      <span>{subsystem.icon}</span>
                      <span className="flex-1 truncate text-sm">{subsystem.name}</span>
                      <span className="text-[11px] text-gray-400">{subsystem.assemblies.length}</span>
                    </div>

                    {subsystemExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {subsystem.assemblies.map(assembly => {
                          const assemblySelected = selectedAssemblyId === assembly.id && !selectedSubAssemblyId;
                          const assemblyExpanded = expandedAssemblyIds.has(assembly.id);
                          return (
                            <div key={assembly.id}>
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                                  assemblySelected
                                    ? `${colors.light} ${colors.text} font-medium`
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                                }`}
                                onClick={() => openAssembly(subsystem.id, assembly.id)}
                              >
                                <span
                                  className="w-4 text-xs text-gray-400"
                                  onClick={event => {
                                    event.stopPropagation();
                                    setExpandedAssemblyIds(previous => {
                                      const next = new Set(previous);
                                      next.has(assembly.id) ? next.delete(assembly.id) : next.add(assembly.id);
                                      return next;
                                    });
                                  }}
                                >
                                  {assemblyExpanded ? '▾' : '▸'}
                                </span>
                                <span className="text-gray-300">└</span>
                                <span className="flex-1 truncate">{assembly.name}</span>
                              </div>

                              {assemblyExpanded && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {assembly.subAssemblies.map(subAssembly => {
                                    const subSelected = selectedSubAssemblyId === subAssembly.id;
                                    return (
                                      <div key={subAssembly.id}>
                                        <div
                                          className={`flex items-center gap-2 px-2.5 py-1 rounded-md cursor-pointer text-xs transition-colors ${
                                            subSelected
                                              ? `${colors.light} ${colors.text} font-medium`
                                              : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                                          }`}
                                          onClick={() => openSubAssembly(subsystem.id, assembly.id, subAssembly.id)}
                                        >
                                          <span className="text-gray-300">•</span>
                                          <span className="flex-1 truncate">{subAssembly.name}</span>
                                          <span className="text-[10px] text-gray-400">{subAssembly.parts.length}件</span>
                                        </div>
                                        {subSelected && subAssembly.parts.length > 0 && (
                                          <div className="ml-5 mt-0.5 space-y-0.5">
                                            {subAssembly.parts.map(part => {
                                              const isSelectedPart = selectedPart?.id === part.id;
                                              const location = { subsystem, assembly, subAssembly };
                                              return (
                                                <button
                                                  key={part.id}
                                                  onClick={() => openPart(part, location)}
                                                  className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                                                    isSelectedPart
                                                      ? `${colors.badge}`
                                                      : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
                                                  }`}
                                                >
                                                  <span className="truncate inline-block max-w-[170px] align-middle">{part.name}</span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto bg-white dark:bg-gray-800">
          <div className="p-5 space-y-5">
            <ChassisSystemDiagram selectedSubsystemId={selectedSubsystemId} onSubsystemSelect={openSubsystem} />

            <div className="space-y-4">
              {renderBreadcrumb()}

              {viewState === 'overview' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {chassisSubsystems.map(subsystem => {
                      const colors = CHASSIS_COLOR_MAP[subsystem.colorKey];
                      const partCount = countSubsystemParts(subsystem);
                      return (
                        <button
                          key={subsystem.id}
                          onClick={() => openSubsystem(subsystem.id)}
                          className={`text-left rounded-2xl border p-4 transition-all hover:shadow-md ${colors.border} ${colors.hover}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{subsystem.icon}</span>
                            <span className={`font-semibold ${colors.text}`}>{subsystem.name}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-6 min-h-[72px]">{subsystem.description}</p>
                          <p className="text-xs text-gray-500 mt-3">
                            {subsystem.assemblies.length} 个总成 · {partCount} 个零件
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewState === 'subsystem' && selectedSubsystem && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-5 ${activeColors.light} ${activeColors.border}`}>
                    <div className="flex items-start gap-4">
                      <span className="text-5xl">{selectedSubsystem.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSubsystem.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-6">{selectedSubsystem.description}</p>
                        <div className="grid grid-cols-3 gap-3 mt-4 max-w-md">
                          <div>
                            <p className={`text-2xl font-bold ${activeColors.text}`}>{selectedSubsystem.assemblies.length}</p>
                            <p className="text-xs text-gray-500">总成</p>
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${activeColors.text}`}>
                              {selectedSubsystem.assemblies.reduce((sum, assembly) => sum + assembly.subAssemblies.length, 0)}
                            </p>
                            <p className="text-xs text-gray-500">分总成</p>
                          </div>
                          <div>
                            <p className={`text-2xl font-bold ${activeColors.text}`}>{countSubsystemParts(selectedSubsystem)}</p>
                            <p className="text-xs text-gray-500">零件</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubsystem.assemblies.map(assembly => (
                      <button
                        key={assembly.id}
                        onClick={() => openAssembly(selectedSubsystem.id, assembly.id)}
                        className={`text-left rounded-2xl border p-4 transition-all hover:shadow-md ${activeColors.border} ${activeColors.hover}`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{assembly.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${activeColors.badge}`}>{countAssemblyParts(assembly)} 件</span>
                        </div>
                        <div className="space-y-1.5">
                          {assembly.subAssemblies.slice(0, 3).map(subAssembly => (
                            <p key={subAssembly.id} className="text-xs text-gray-500 dark:text-gray-400">
                              {subAssembly.name} · {subAssembly.parts.length} 件
                            </p>
                          ))}
                          {assembly.subAssemblies.length > 3 && (
                            <p className="text-xs text-gray-400">...还有 {assembly.subAssemblies.length - 3} 个分总成</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {viewState === 'assembly' && selectedAssembly && selectedSubsystem && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedAssembly.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {selectedAssembly.subAssemblies.length} 个分总成 · {countAssemblyParts(selectedAssembly)} 个零件
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${activeColors.badge}`}>
                      {selectedSubsystem.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAssembly.subAssemblies.map(subAssembly => (
                      <button
                        key={subAssembly.id}
                        onClick={() => openSubAssembly(selectedSubsystem.id, selectedAssembly.id, subAssembly.id)}
                        className="text-left rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{subAssembly.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${activeColors.badge}`}>{subAssembly.parts.length} 件</span>
                        </div>
                        <div className="space-y-1.5">
                          {subAssembly.parts.slice(0, 4).map(part => (
                            <div key={part.id} className="text-xs text-gray-500 dark:text-gray-400">
                              {part.name} · {part.material}
                            </div>
                          ))}
                          {subAssembly.parts.length > 4 && (
                            <p className="text-xs text-gray-400">...还有 {subAssembly.parts.length - 4} 个零件</p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {viewState === 'subAssembly' && selectedSubAssembly && selectedAssembly && selectedSubsystem && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedSubAssembly.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      共 {selectedSubAssembly.parts.length} 个零件 · {selectedAssembly.name}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full">
                      <thead>
                        <tr className={`${activeColors.light} border-b ${activeColors.border}`}>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">序号</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">零件名称</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">材料</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">工艺</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">备注</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                        {selectedSubAssembly.parts.map((part, index) => (
                          <tr
                            key={part.id}
                            className={`cursor-pointer transition-colors ${activeColors.hover}`}
                            onClick={() => openPart(part, { subsystem: selectedSubsystem, assembly: selectedAssembly, subAssembly: selectedSubAssembly })}
                          >
                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{part.name}</td>
                            <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 rounded text-xs ${activeColors.badge}`}>{part.material}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{part.process}</td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{part.note ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {viewState === 'part' && selectedPart && selectedPartLocation && (
                <div className="space-y-4">
                  <div className={`rounded-2xl border p-5 ${activeColors.light} ${activeColors.border}`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className={`text-xs uppercase tracking-wide font-semibold ${activeColors.text}`}>Part Detail</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{selectedPart.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{getPartInsight(selectedPart.material)}</p>
                      </div>
                      <button
                        onClick={() => openSubAssembly(selectedPartLocation.subsystem.id, selectedPartLocation.assembly.id, selectedPartLocation.subAssembly.id)}
                        className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                      >
                        返回零件表
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">材料</p>
                      <p className={`text-lg font-semibold ${activeColors.text}`}>{selectedPart.material}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">工艺</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedPart.process}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">路径</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-6">
                        {selectedPartLocation.subsystem.name} / {selectedPartLocation.assembly.name} / {selectedPartLocation.subAssembly.name} / {selectedPart.name}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 md:col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">备注</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-6">{selectedPart.note ?? '暂无备注'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
