import { useState } from 'react';
import ThermalManagementDiagram from '../ThermalManagementDiagram';
import { thermalManagementData } from '../../data/thermalManagementAssembly';

export default function ThermalManagementSystemView() {
  const [selectedThermalAssemblyId, setSelectedThermalAssemblyId] = useState<string>('');
  const [selectedThermalSubId, setSelectedThermalSubId] = useState<string>('');

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧：L1总成 + 展开后的L2子总成卡片 */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">热管理系统</h3>
          <div className="space-y-0.5">
            {thermalManagementData.map((assembly) => {
              const isExpanded = selectedThermalAssemblyId === assembly.id;
              return (
                <div key={assembly.id}>
                  {/* L1 总成行 */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                      isExpanded
                        ? 'bg-orange-100 text-orange-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedThermalAssemblyId(isExpanded ? '' : assembly.id);
                      setSelectedThermalSubId('');
                    }}
                  >
                    <span className="text-xs text-gray-400 w-3">{isExpanded ? '▼' : '▶'}</span>
                    <span className="mr-1">{assembly.icon}</span>
                    <span className="flex-1 text-sm">{assembly.name}</span>
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 flex-shrink-0">
                      {assembly.subAssemblies.length}
                    </span>
                  </div>
                  {/* L2 子总成卡片（折叠展开） */}
                  {isExpanded && (
                    <div className="ml-2 mt-1 mb-1 space-y-1">
                      {assembly.subAssemblies.map((sub) => {
                        const isSelected = selectedThermalSubId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            className={`px-3 py-2 rounded-md cursor-pointer border text-xs ${
                              isSelected
                                ? 'bg-orange-500 text-white border-orange-500 font-medium'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                            }`}
                            onClick={() => setSelectedThermalSubId(isSelected ? '' : sub.id)}
                          >
                            <div className="font-medium leading-tight">{sub.name}</div>
                            <div className={`mt-0.5 ${isSelected ? 'text-orange-100' : 'text-gray-400'}`}>
                              {sub.parts.length} 个零件
                            </div>
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

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-y-auto">
        {/* 顶部：示意图 */}
        <div className="p-4 border-b border-gray-200">
          <ThermalManagementDiagram
            assemblies={thermalManagementData}
            selectedAssemblyId={selectedThermalAssemblyId}
            onAssemblyClick={(id) => {
              setSelectedThermalAssemblyId(id === selectedThermalAssemblyId ? '' : id);
              setSelectedThermalSubId('');
            }}
          />
        </div>

        {/* 底部：选中子总成后显示零件明细表 */}
        {selectedThermalSubId ? (() => {
          const assembly = thermalManagementData.find(a => a.id === selectedThermalAssemblyId);
          const sub = assembly?.subAssemblies.find(s => s.id === selectedThermalSubId);
          if (!assembly || !sub) return null;
          return (
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-base">{assembly.icon}</span>
                <span className="text-xs text-gray-400">{assembly.name}</span>
                <span className="text-xs text-gray-300">›</span>
                <h3 className="text-sm font-semibold text-gray-900">{sub.name}</h3>
                <span className="ml-auto text-xs text-gray-400">{sub.parts.length} 个零件</span>
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200 w-8">#</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">零件名称</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">典型材料</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200">典型工艺</th>
                  </tr>
                </thead>
                <tbody>
                  {sub.parts.map((part, idx) => (
                    <tr key={part.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-xs text-gray-400 border-b border-gray-100">{idx + 1}</td>
                      <td className="px-3 py-2 text-sm text-gray-800 border-b border-gray-100 font-medium">{part.name}</td>
                      <td className="px-3 py-2 border-b border-gray-100">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{part.material}</span>
                      </td>
                      <td className="px-3 py-2 border-b border-gray-100">
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{part.process}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })() : (
          <div className="flex items-center justify-center h-48 text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2">🌡️</div>
              <p className="text-sm">
                {selectedThermalAssemblyId ? '选择左侧子总成卡片查看零件明细' : '点击示意图或左侧总成查看详情'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
