import { useEffect, useMemo, useState } from 'react';
import HmiSystemDiagram from '../HmiSystemDiagram';
import { hmiGroups, type HmiAssembly, type HmiGroup, type HmiPart, type HmiSubAssembly } from '../../data/hmiAssembly';

type ViewState = 'overview' | 'group' | 'assembly' | 'subAssembly' | 'part';

interface PartLocation {
  group: HmiGroup;
  assembly: HmiAssembly;
  subAssembly: HmiSubAssembly;
}

const totalAssemblies = hmiGroups.reduce((sum, group) => sum + group.assemblies.length, 0);
const totalParts = hmiGroups.reduce(
  (sum, group) =>
    sum +
    group.assemblies.reduce(
      (assemblySum, assembly) => assemblySum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
      0,
    ),
  0,
);

function countGroupParts(group: HmiGroup) {
  return group.assemblies.reduce(
    (sum, assembly) => sum + assembly.subAssemblies.reduce((subSum, subAssembly) => subSum + subAssembly.parts.length, 0),
    0,
  );
}

function countAssemblyParts(assembly: HmiAssembly) {
  return assembly.subAssemblies.reduce((sum, subAssembly) => sum + subAssembly.parts.length, 0);
}

function findPartLocation(partId: string): PartLocation | null {
  for (const group of hmiGroups) {
    for (const assembly of group.assemblies) {
      for (const subAssembly of assembly.subAssemblies) {
        if (subAssembly.parts.some(part => part.id === partId)) {
          return { group, assembly, subAssembly };
        }
      }
    }
  }

  return null;
}

function getMaterialInsight(material: string) {
  if (material.includes('PC')) {
    return 'PC 系材料常用于透光、外观和绝缘相关部件，适合显示、声学与光学模块中的精密注塑件。';
  }
  if (material.includes('PBT')) {
    return 'PBT 增强体系兼顾尺寸稳定与耐热绝缘能力，适用于控制器壳体、盖板和连接区域。';
  }
  if (material.includes('PP')) {
    return 'PP 增强材料在车机硬件中常用于壳体与支撑件，兼顾轻量化、刚性与成本控制。';
  }
  if (material.includes('POM')) {
    return 'POM 适用于低摩擦、尺寸精度要求较高的传动与支撑零件。';
  }
  if (material.includes('PA6')) {
    return '增强 PA6 适合承受更高结构载荷的控制器盖板与支撑件。';
  }

  return '该材料用于平衡车机硬件在结构强度、外观、绝缘与加工效率之间的需求。';
}

export default function HmiSystemView() {
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<HmiGroup['id'] | ''>('');
  const [selectedAssemblyId, setSelectedAssemblyId] = useState<string>('');
  const [selectedSubAssemblyId, setSelectedSubAssemblyId] = useState<string>('');
  const [selectedPart, setSelectedPart] = useState<HmiPart | null>(null);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(new Set(['hmi-display']));
  const [expandedAssemblyIds, setExpandedAssemblyIds] = useState<Set<string>>(new Set());

  const selectedGroup = useMemo(
    () => hmiGroups.find(group => group.id === selectedGroupId) ?? null,
    [selectedGroupId],
  );
  const selectedAssembly = useMemo(
    () => selectedGroup?.assemblies.find(assembly => assembly.id === selectedAssemblyId) ?? null,
    [selectedGroup, selectedAssemblyId],
  );
  const selectedSubAssembly = useMemo(
    () => selectedAssembly?.subAssemblies.find(subAssembly => subAssembly.id === selectedSubAssemblyId) ?? null,
    [selectedAssembly, selectedSubAssemblyId],
  );
  const selectedPartLocation = useMemo(
    () => (selectedPart ? findPartLocation(selectedPart.id) : null),
    [selectedPart],
  );

  const viewState: ViewState = selectedPart
    ? 'part'
    : selectedSubAssembly
      ? 'subAssembly'
      : selectedAssembly
        ? 'assembly'
        : selectedGroup
          ? 'group'
          : 'overview';

  useEffect(() => {
    if (!selectedGroupId) return;
    setExpandedGroupIds(previous => {
      const next = new Set(previous);
      next.add(selectedGroupId);
      return next;
    });
  }, [selectedGroupId]);

  useEffect(() => {
    if (!selectedAssemblyId) return;
    setExpandedAssemblyIds(previous => {
      const next = new Set(previous);
      next.add(selectedAssemblyId);
      return next;
    });
  }, [selectedAssemblyId]);

  const openOverview = () => {
    setSelectedNode('');
    setSelectedGroupId('');
    setSelectedAssemblyId('');
    setSelectedSubAssemblyId('');
    setSelectedPart(null);
  };

  const openGroup = (groupId: HmiGroup['id']) => {
    setSelectedNode(groupId);
    setSelectedGroupId(groupId);
    setSelectedAssemblyId('');
    setSelectedSubAssemblyId('');
    setSelectedPart(null);
  };

  const openAssembly = (groupId: HmiGroup['id'], assemblyId: string) => {
    setSelectedNode(assemblyId);
    setSelectedGroupId(groupId);
    setSelectedAssemblyId(assemblyId);
    setSelectedSubAssemblyId('');
    setSelectedPart(null);
  };

  const openSubAssembly = (groupId: HmiGroup['id'], assemblyId: string, subAssemblyId: string) => {
    setSelectedNode(subAssemblyId);
    setSelectedGroupId(groupId);
    setSelectedAssemblyId(assemblyId);
    setSelectedSubAssemblyId(subAssemblyId);
    setSelectedPart(null);
  };

  const openPart = (part: HmiPart, location: PartLocation) => {
    setSelectedNode(location.subAssembly.id);
    setSelectedGroupId(location.group.id);
    setSelectedAssemblyId(location.assembly.id);
    setSelectedSubAssemblyId(location.subAssembly.id);
    setSelectedPart(part);
  };

  return (
    <div className="flex min-h-[560px]">
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-2 ${
              selectedNode === '' ? 'bg-sky-100 text-sky-700' : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={openOverview}
          >
            <span>💻</span>
            <span>车机硬件总览</span>
          </div>

          <div className="space-y-1">
            {hmiGroups.map(group => (
              <div key={group.id}>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                    selectedGroupId === group.id && selectedAssemblyId === ''
                      ? 'bg-sky-100 text-sky-800 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setExpandedGroupIds(previous => {
                      const next = new Set(previous);
                      next.has(group.id) ? next.delete(group.id) : next.add(group.id);
                      return next;
                    });
                    openGroup(group.id);
                  }}
                >
                  <span className="text-xs text-gray-400 w-3">
                    {expandedGroupIds.has(group.id) ? '▼' : '▶'}
                  </span>
                  <span>{group.icon}</span>
                  <span className="font-semibold text-sm">{group.name}</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                    {group.assemblies.length}个总成
                  </span>
                </div>

                {expandedGroupIds.has(group.id) && group.assemblies.length > 0 && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {group.assemblies.map(assembly => (
                      <div key={assembly.id}>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                            selectedAssemblyId === assembly.id && selectedSubAssemblyId === ''
                              ? 'bg-sky-100 text-sky-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setExpandedAssemblyIds(previous => {
                              const next = new Set(previous);
                              next.has(assembly.id) ? next.delete(assembly.id) : next.add(assembly.id);
                              return next;
                            });
                            openAssembly(group.id, assembly.id);
                          }}
                        >
                          <span className="text-xs text-gray-300 w-3">
                            {expandedAssemblyIds.has(assembly.id) ? '▾' : '▸'}
                          </span>
                          <span className="text-xs text-gray-400">└</span>
                          <span>{assembly.icon}</span>
                          <span className="truncate flex-1">{assembly.name}</span>
                          <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                            {assembly.subAssemblies.length}个分总成
                          </span>
                        </div>

                        {expandedAssemblyIds.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                          <div className="ml-6 mt-0.5 space-y-0.5">
                            {assembly.subAssemblies.map(subAssembly => (
                              <div key={subAssembly.id}>
                                <div
                                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs cursor-pointer ${
                                    selectedSubAssemblyId === subAssembly.id
                                      ? 'bg-sky-100 text-sky-700 font-medium'
                                      : 'text-gray-500 hover:bg-sky-50'
                                  }`}
                                  onClick={() => openSubAssembly(group.id, assembly.id, subAssembly.id)}
                                >
                                  <span className="text-gray-300">•</span>
                                  <span className="truncate flex-1">{subAssembly.name}</span>
                                  <span className="text-gray-400">{subAssembly.parts.length}件</span>
                                </div>

                                {selectedSubAssemblyId === subAssembly.id && subAssembly.parts.length > 0 && (
                                  <div className="ml-5 mt-0.5 space-y-0.5">
                                    {subAssembly.parts.map(part => (
                                      <button
                                        key={part.id}
                                        className={`w-full text-left flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] ${
                                          selectedPart?.id === part.id
                                            ? 'bg-sky-200 text-sky-800 font-medium'
                                            : 'text-gray-500 hover:bg-sky-50'
                                        }`}
                                        onClick={() => openPart(part, { group, assembly, subAssembly })}
                                      >
                                        <span className="text-gray-300">·</span>
                                        <span className="truncate flex-1">{part.name}</span>
                                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">
                                          {part.material}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <HmiSystemDiagram groups={hmiGroups} selectedGroupId={selectedGroupId} onGroupClick={openGroup} />
        </div>

        {viewState === 'overview' ? (
          <div className="px-4 pb-4">
            <div className="mb-4 rounded-xl bg-gradient-to-r from-sky-700 via-cyan-700 to-teal-700 text-white p-5">
              <h3 className="text-lg font-semibold mb-2">车机硬件树状总览</h3>
              <p className="text-sm text-sky-50 leading-6">
                该视图按 HMI 一级域组织车机硬件文档中的总成、分总成与零件信息，并与右侧交互示意图联动。
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4 max-w-md">
                <div>
                  <p className="text-2xl font-bold">{hmiGroups.length}</p>
                  <p className="text-xs text-sky-100">一级域</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalAssemblies}</p>
                  <p className="text-xs text-sky-100">总成</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalParts}</p>
                  <p className="text-xs text-sky-100">零件</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hmiGroups.map(group => (
                <div
                  key={group.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openGroup(group.id)}
                >
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    <span className="mr-1">{group.icon}</span>
                    {group.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{group.assemblies.length} 个总成，{countGroupParts(group)} 个零件</p>
                  <div className="space-y-1">
                    {group.assemblies.slice(0, 3).map(assembly => (
                      <div key={assembly.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <span>{assembly.icon}</span>
                        <span className="truncate flex-1">{assembly.name}</span>
                        <span className="text-gray-400">{countAssemblyParts(assembly)}件</span>
                      </div>
                    ))}
                    {group.assemblies.length > 3 && (
                      <p className="text-xs text-gray-400 ml-3">...还有 {group.assemblies.length - 3} 个总成</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewState === 'group' && selectedGroup ? (
          <div className="px-4 pb-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2">{selectedGroup.icon}</span>
                {selectedGroup.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">共 {selectedGroup.assemblies.length} 个总成，{countGroupParts(selectedGroup)} 个零件</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedGroup.assemblies.map(assembly => (
                <div
                  key={assembly.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openAssembly(selectedGroup.id, assembly.id)}
                >
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    <span className="mr-1">{assembly.icon}</span>
                    {assembly.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{countAssemblyParts(assembly)} 个零件</p>
                  <div className="space-y-1">
                    {assembly.subAssemblies.slice(0, 3).map(subAssembly => (
                      <div key={subAssembly.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-gray-300">└</span>
                        <span className="truncate flex-1">{subAssembly.name}</span>
                        <span className="text-gray-400">{subAssembly.parts.length}件</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewState === 'assembly' && selectedAssembly ? (
          <div className="px-4 pb-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                <span className="mr-2">{selectedAssembly.icon}</span>
                {selectedAssembly.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">共 {selectedAssembly.subAssemblies.length} 个分总成，{countAssemblyParts(selectedAssembly)} 个零件</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedAssembly.subAssemblies.map(subAssembly => (
                <div
                  key={subAssembly.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openSubAssembly(selectedGroupId as HmiGroup['id'], selectedAssembly.id, subAssembly.id)}
                >
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">{subAssembly.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{subAssembly.parts.length} 个零件</p>
                  <div className="space-y-1">
                    {subAssembly.parts.slice(0, 4).map(part => (
                      <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="text-gray-300">•</span>
                        <span className="truncate flex-1">{part.name}</span>
                        <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{part.material}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : viewState === 'subAssembly' && selectedAssembly && selectedSubAssembly ? (
          <div className="px-4 pb-4">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedAssembly.name} / {selectedSubAssembly.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">共 {selectedSubAssembly.parts.length} 个零件</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备注</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedSubAssembly.parts.map((part, index) => (
                    <tr key={part.id} className="hover:bg-sky-50 transition-colors cursor-pointer" onClick={() => openPart(part, { group: selectedGroup!, assembly: selectedAssembly, subAssembly: selectedSubAssembly })}>
                      <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{part.material}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{part.process}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{part.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewState === 'part' && selectedPart && selectedPartLocation ? (
          <div className="px-4 pb-4">
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs uppercase tracking-wide font-semibold text-sky-700">Part Detail</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{selectedPart.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{getMaterialInsight(selectedPart.material)}</p>
                </div>
                <button
                  onClick={() => openSubAssembly(selectedPartLocation.group.id, selectedPartLocation.assembly.id, selectedPartLocation.subAssembly.id)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-white"
                >
                  返回零件表
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-200 p-4 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">典型材料</p>
                <p className="text-lg font-semibold text-sky-700">{selectedPart.material}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-4 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">典型工艺</p>
                <p className="text-lg font-semibold text-gray-900">{selectedPart.process}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-4 bg-white md:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">所属路径</p>
                <p className="text-sm text-gray-700 leading-6">
                  {selectedPartLocation.group.name} / {selectedPartLocation.assembly.name} / {selectedPartLocation.subAssembly.name} / {selectedPart.name}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-4 bg-white md:col-span-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">备注</p>
                <p className="text-sm text-gray-700 leading-6">{selectedPart.note ?? '暂无备注'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
