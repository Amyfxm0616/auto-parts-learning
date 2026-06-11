import { useState } from 'react';
import SealingDiagram from '../SealingDiagram';
import { sealingAssemblyData } from '../../data/sealingAssembly';

export default function SealingSystemView() {
  const [selectedSealAssemblyId, setSelectedSealAssemblyId] = useState<string>('');
  const [selectedSealSubId, setSelectedSealSubId] = useState<string>('');

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧：L1总成 + 展开后的L2子总成卡片 */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">密封系统</h3>
          <div className="space-y-0.5">
            {sealingAssemblyData.map((assembly) => {
              const isExpanded = selectedSealAssemblyId === assembly.id;
              return (
                <div key={assembly.id}>
                  {/* L1 总成行 */}
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                      isExpanded
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedSealAssemblyId(isExpanded ? '' : assembly.id);
                      setSelectedSealSubId('');
                    }}
                  >
                    <span className="text-xs text-gray-400 w-3">{isExpanded ? '▼' : '▶'}</span>
                    <span className="mr-1">{assembly.icon}</span>
                    <span className="flex-1 text-sm">{assembly.name}</span>
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 flex-shrink-0">
                      {assembly.subAssemblies.length}
                    </span>
                  </div>
                  {/* L2 子总成卡片 */}
                  {isExpanded && (
                    <div className="ml-2 mt-1 mb-1 space-y-1">
                      {assembly.subAssemblies.map((sub) => {
                        const isSelected = selectedSealSubId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            className={`px-3 py-2 rounded-md cursor-pointer border text-xs ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                            onClick={() => setSelectedSealSubId(isSelected ? '' : sub.id)}
                          >
                            <div className="font-medium leading-tight">{sub.name}</div>
                            <div className={`mt-0.5 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
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
        {/* 顶部：示意图（总览 or 截面图） */}
        <div className="p-4 border-b border-gray-200">
          <SealingDiagram
            assemblies={sealingAssemblyData}
            selectedAssemblyId={selectedSealAssemblyId}
            selectedSubId={selectedSealSubId}
            onAssemblyClick={(id) => {
              setSelectedSealAssemblyId(id === selectedSealAssemblyId ? '' : id);
              setSelectedSealSubId('');
            }}
          />
        </div>

        {/* 底部：选中子总成后显示零件明细表 */}
        {selectedSealSubId ? (() => {
          const assembly = sealingAssemblyData.find(a => a.subAssemblies.some(s => s.id === selectedSealSubId));
          const sub = assembly?.subAssemblies.find(s => s.id === selectedSealSubId);
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
              <div className="text-3xl mb-2">🔷</div>
              <p className="text-sm">
                {selectedSealAssemblyId ? '选择左侧子总成卡片查看零件明细' : '点击左侧总成展开子总成'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
