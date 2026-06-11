import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { parts as initialParts } from '../../data/parts';
import { partSystems as initialSystems } from '../../data/systems';
import InteriorDiagram from '../InteriorDiagram';
import { interiorAssemblyData, type InteriorPart } from '../../data/interiorAssembly';

type Part = typeof initialParts[number];
type PartSystem = typeof initialSystems[number];

interface InteriorSystemViewProps {
  currentSystem: PartSystem;
  parts: Part[];
  onEdit: (part: Part) => void;
}

export default function InteriorSystemView({ currentSystem, parts, onEdit }: InteriorSystemViewProps) {
  const navigate = useNavigate();
  const [selectedInteriorNode, setSelectedInteriorNode] = useState<string>('');
  const [expandedInteriorL1, setExpandedInteriorL1] = useState<Set<string>>(new Set(['ia-01']));
  const [expandedInteriorL2, setExpandedInteriorL2] = useState<Set<string>>(new Set());
  const [selectedInteriorL1, setSelectedInteriorL1] = useState<string>('');
  const [selectedInteriorL2, setSelectedInteriorL2] = useState<string>('');
  const [selectedInteriorPart, setSelectedInteriorPart] = useState<InteriorPart | null>(null);
  const [interiorPartEdits, setInteriorPartEdits] = useState<Record<string, { material: string; process: string }>>({});
  const [editingInteriorPart, setEditingInteriorPart] = useState<InteriorPart | null>(null);
  const [editMaterial, setEditMaterial] = useState('');
  const [editProcess, setEditProcess] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('interiorPartEdits');
    if (saved) {
      setInteriorPartEdits(JSON.parse(saved));
    }
  }, []);

  const getPartMaterial = (part: InteriorPart) => interiorPartEdits[part.id]?.material ?? part.material;
  const getPartProcess = (part: InteriorPart) => interiorPartEdits[part.id]?.process ?? part.process;

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧树形导航 */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <div
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
              selectedInteriorNode === ''
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => {
              setSelectedInteriorNode('');
              setSelectedInteriorL1('');
              setSelectedInteriorL2('');
            }}
          >
            <span>🚗</span>
            <span>内饰总成</span>
          </div>
          {interiorAssemblyData.map((assembly) => (
            <div key={assembly.id} className="mb-1">
              {/* Level 1: 总成 */}
              <div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                  selectedInteriorL1 === assembly.id && selectedInteriorL2 === ''
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setExpandedInteriorL1(prev => {
                    const next = new Set(prev);
                    if (next.has(assembly.id)) {
                      next.delete(assembly.id);
                    } else {
                      next.add(assembly.id);
                    }
                    return next;
                  });
                  setSelectedInteriorL1(assembly.id);
                  setSelectedInteriorL2('');
                  setSelectedInteriorNode(assembly.id);
                }}
              >
                <span className="text-xs text-gray-400 w-3">
                  {expandedInteriorL1.has(assembly.id) ? '▼' : '▶'}
                </span>
                <span className="mr-1">{assembly.icon}</span>
                <span className="font-semibold text-sm">{assembly.name}</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                  {assembly.subAssemblies.length}个分总成
                </span>
              </div>
              {/* Level 2: 分总成 */}
              {expandedInteriorL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {assembly.subAssemblies.map((sub) => (
                    <div key={sub.id}>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                          selectedInteriorL2 === sub.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setExpandedInteriorL2(prev => {
                            const next = new Set(prev);
                            if (next.has(sub.id)) {
                              next.delete(sub.id);
                            } else {
                              next.add(sub.id);
                            }
                            return next;
                          });
                          setSelectedInteriorL1(assembly.id);
                          setSelectedInteriorL2(sub.id);
                          setSelectedInteriorNode(sub.id);
                        }}
                      >
                        <span className="text-xs text-gray-300 w-3">
                          {expandedInteriorL2.has(sub.id) ? '▾' : '▸'}
                        </span>
                        <span className="text-xs text-gray-400">└</span>
                        <span>{sub.name}</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                          {sub.parts.length}个零件
                        </span>
                      </div>
                      {/* Level 3: 单件 */}
                      {expandedInteriorL2.has(sub.id) && sub.parts.length > 0 && (
                        <div className="ml-6 mt-0.5 space-y-0.5">
                          {sub.parts.map((part) => (
                            <div
                              key={part.id}
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-blue-50 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedInteriorPart(part);
                              }}
                            >
                              <span className="text-gray-300">•</span>
                              <span className="truncate">{part.name}</span>
                              <span className="ml-auto flex gap-1">
                                <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getPartMaterial(part)}</span>
                                <span className="bg-blue-50 text-blue-700 px-1 rounded text-[10px] leading-tight">{getPartProcess(part)}</span>
                              </span>
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

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-auto">
        {selectedInteriorNode === '' ? (
          /* 内饰总成概览 - 显示InteriorDiagram */
          <div className="p-6">
            <InteriorDiagram
              parts={parts.filter(p =>
                p.category === currentSystem.name &&
                p.subcategory?.startsWith('内饰')
              )}
              onPartClick={(part) => {
                navigate(`/parts/${part.id}`);
              }}
              onPartEdit={(part) => {
                onEdit(part);
              }}
            />
          </div>
        ) : selectedInteriorL2 !== '' ? (
          /* Level 2 selected: show parts table with material & process info */
          (() => {
            const assembly = interiorAssemblyData.find(a => a.id === selectedInteriorL1);
            const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedInteriorL2);
            if (!subAssembly) return null;
            return (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {assembly?.name} / {subAssembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    共 {subAssembly.parts.length} 个零件
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">序号</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">零件名称</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型材料</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">典型工艺</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subAssembly.parts.map((part, index) => (
                        <tr key={part.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedInteriorPart(part)}>
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getPartMaterial(part)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getPartProcess(part)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : selectedInteriorL1 !== '' ? (
          /* Level 1 selected: show sub-assembly summary */
          (() => {
            const assembly = interiorAssemblyData.find(a => a.id === selectedInteriorL1);
            if (!assembly) return null;
            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
            return (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    <span className="mr-2">{assembly.icon}</span>
                    {assembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assembly.subAssemblies.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedInteriorL2(sub.id);
                        setSelectedInteriorNode(sub.id);
                        setExpandedInteriorL2(prev => {
                          const next = new Set(prev);
                          next.add(sub.id);
                          return next;
                        });
                      }}
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                      <div className="space-y-1">
                        {sub.parts.slice(0, 3).map((part) => (
                          <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-gray-300">•</span>
                            <span className="truncate flex-1">{part.name}</span>
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getPartMaterial(part)}</span>
                          </div>
                        ))}
                        {sub.parts.length > 3 && (
                          <p className="text-xs text-gray-400 ml-3">...还有 {sub.parts.length - 3} 个零件</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        ) : null}
        {/* Detail Modal for interior part */}
        {selectedInteriorPart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedInteriorPart(null); setEditingInteriorPart(null); }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedInteriorPart.name}</h2>
                  <button onClick={() => { setSelectedInteriorPart(null); setEditingInteriorPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                {/* Image */}
                <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {selectedInteriorPart.imageUrl ? (
                    <img src={selectedInteriorPart.imageUrl} alt={selectedInteriorPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>
                  )}
                </div>

                {/* Info - Editing or Display */}
                {editingInteriorPart?.id === selectedInteriorPart.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                      <input type="text" value={editMaterial} onChange={e => setEditMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                      <input type="text" value={editProcess} onChange={e => setEditProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => {
                        const newEdits = { ...interiorPartEdits, [selectedInteriorPart.id]: { material: editMaterial, process: editProcess } };
                        setInteriorPartEdits(newEdits);
                        localStorage.setItem('interiorPartEdits', JSON.stringify(newEdits));
                        setEditingInteriorPart(null);
                        // Force re-render by updating selectedInteriorPart
                        setSelectedInteriorPart({ ...selectedInteriorPart });
                      }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
                      <button onClick={() => setEditingInteriorPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型材料：</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getPartMaterial(selectedInteriorPart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型工艺：</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{getPartProcess(selectedInteriorPart)}</span>
                    </div>
                    {/* Show original data hint if edited */}
                    {(interiorPartEdits[selectedInteriorPart.id]) && (
                      <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedInteriorPart.material} / {selectedInteriorPart.process}）</p>
                    )}
                    <button onClick={() => {
                      setEditingInteriorPart(selectedInteriorPart);
                      setEditMaterial(getPartMaterial(selectedInteriorPart));
                      setEditProcess(getPartProcess(selectedInteriorPart));
                    }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">编辑材料信息</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
