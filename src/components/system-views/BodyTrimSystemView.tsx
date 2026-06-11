import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BodyTrimDiagram from '../BodyTrimDiagram';
import { bodyTrimAssemblyData, type BodyTrimPart } from '../../data/bodyTrimAssembly';

export default function BodyTrimSystemView() {
  const navigate = useNavigate();
  const [selectedBodyTrimNode, setSelectedBodyTrimNode] = useState<string>('');
  const [expandedBodyTrimL1, setExpandedBodyTrimL1] = useState<Set<string>>(new Set(['bt-ext']));
  const [expandedBodyTrimL2, setExpandedBodyTrimL2] = useState<Set<string>>(new Set());
  const [selectedBodyTrimL1, setSelectedBodyTrimL1] = useState<string>('');
  const [selectedBodyTrimL2, setSelectedBodyTrimL2] = useState<string>('');
  const [selectedBodyTrimPart, setSelectedBodyTrimPart] = useState<BodyTrimPart | null>(null);
  const [bodyTrimPartEdits, setBodyTrimPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingBodyTrimPart, setEditingBodyTrimPart] = useState<BodyTrimPart | null>(null);
  const [editBodyTrimMaterial, setEditBodyTrimMaterial] = useState('');
  const [editBodyTrimProcess, setEditBodyTrimProcess] = useState('');
  const [editBodyTrimImage, setEditBodyTrimImage] = useState<string>('');
  const [editBodyTrimDescription, setEditBodyTrimDescription] = useState('');
  const [editBodyTrimFunction, setEditBodyTrimFunction] = useState('');
  const [editBodyTrimVehicleModels, setEditBodyTrimVehicleModels] = useState<string[]>([]);
  const [newBodyTrimVehicleModel, setNewBodyTrimVehicleModel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bodyTrimPartEdits');
    if (saved) {
      setBodyTrimPartEdits(JSON.parse(saved));
    }
  }, []);

  const getBodyTrimPartMaterial = (part: BodyTrimPart) => bodyTrimPartEdits[part.id]?.material ?? part.material;
  const getBodyTrimPartProcess = (part: BodyTrimPart) => bodyTrimPartEdits[part.id]?.process ?? part.process;

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧树形导航 */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">外观及功能饰件</h3>
          <div className="space-y-0.5">
            {bodyTrimAssemblyData.map((assembly) => (
              <div key={assembly.id}>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                    selectedBodyTrimL1 === assembly.id
                      ? 'bg-emerald-100 text-emerald-800 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setExpandedBodyTrimL1(prev => {
                      const next = new Set(prev);
                      if (next.has(assembly.id)) {
                        next.delete(assembly.id);
                      } else {
                        next.add(assembly.id);
                      }
                      return next;
                    });
                    setSelectedBodyTrimL1(assembly.id);
                    setSelectedBodyTrimL2('');
                    setSelectedBodyTrimNode(assembly.id);
                  }}
                >
                  <span className="text-xs text-gray-400 w-3">
                    {expandedBodyTrimL1.has(assembly.id) ? '▼' : '▶'}
                  </span>
                  <span className="mr-1">{assembly.icon}</span>
                  <span className="font-semibold text-sm">{assembly.name}</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                    {assembly.subAssemblies.length}个分总成
                  </span>
                </div>
                {expandedBodyTrimL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {assembly.subAssemblies.map((sub) => (
                      <div key={sub.id}>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                            selectedBodyTrimL2 === sub.id
                              ? 'bg-emerald-100 text-emerald-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setExpandedBodyTrimL2(prev => {
                              const next = new Set(prev);
                              if (next.has(sub.id)) {
                                next.delete(sub.id);
                              } else {
                                next.add(sub.id);
                              }
                              return next;
                            });
                            setSelectedBodyTrimL1(assembly.id);
                            setSelectedBodyTrimL2(sub.id);
                            setSelectedBodyTrimNode(sub.id);
                          }}
                        >
                          <span className="text-xs text-gray-300 w-3">
                            {expandedBodyTrimL2.has(sub.id) ? '▾' : '▸'}
                          </span>
                          <span className="text-xs text-gray-400">└</span>
                          <span>{sub.name}</span>
                          <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                            {sub.parts.length}个零件
                          </span>
                        </div>
                        {expandedBodyTrimL2.has(sub.id) && sub.parts.length > 0 && (
                          <div className="ml-6 mt-0.5 space-y-0.5">
                            {sub.parts.map((part) => (
                              <div
                                key={part.id}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-emerald-50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedBodyTrimPart(part);
                                }}
                              >
                                <span className="text-gray-300">•</span>
                                <span className="truncate">{part.name}</span>
                                <span className="ml-auto flex gap-1">
                                  <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getBodyTrimPartMaterial(part)}</span>
                                  <span className="bg-purple-50 text-purple-700 px-1 rounded text-[10px] leading-tight">{getBodyTrimPartProcess(part)}</span>
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
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <BodyTrimDiagram
            assemblies={bodyTrimAssemblyData}
            selectedAssemblyId={selectedBodyTrimL1}
            selectedSubAssemblyId={selectedBodyTrimL2}
            onAssemblyClick={(assemblyId) => {
              setSelectedBodyTrimL1(assemblyId);
              setSelectedBodyTrimNode(assemblyId);
              setExpandedBodyTrimL1(prev => {
                const next = new Set(prev);
                next.add(assemblyId);
                return next;
              });
            }}
            onSubAssemblyClick={(subId) => {
              const parent = bodyTrimAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
              if (parent) {
                setSelectedBodyTrimL1(parent.id);
                setSelectedBodyTrimL2(subId);
                setSelectedBodyTrimNode(subId);
                setExpandedBodyTrimL2(prev => {
                  const next = new Set(prev);
                  next.add(subId);
                  return next;
                });
              }
            }}
            onPartClick={(part) => setSelectedBodyTrimPart(part)}
            selectedBodyTrimPart={selectedBodyTrimPart}
          />
        </div>

        {selectedBodyTrimNode === '' ? (
          <div className="px-4 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚗 外观及功能饰件总成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bodyTrimAssemblyData.map((assembly) => {
                const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                return (
                  <div
                    key={assembly.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedBodyTrimL1(assembly.id);
                      setSelectedBodyTrimNode(assembly.id);
                      setExpandedBodyTrimL1(prev => {
                        const next = new Set(prev);
                        next.add(assembly.id);
                        return next;
                      });
                    }}
                  >
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      <span className="mr-1">{assembly.icon}</span>
                      {assembly.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                    <div className="space-y-1">
                      {assembly.subAssemblies.slice(0, 2).map((sub) => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-gray-300">└</span>
                          <span className="truncate flex-1">{sub.name}</span>
                          <span className="text-gray-400">{sub.parts.length}件</span>
                        </div>
                      ))}
                      {assembly.subAssemblies.length > 2 && (
                        <p className="text-xs text-gray-400 ml-3">...还有 {assembly.subAssemblies.length - 2} 个分总成</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedBodyTrimL2 !== '' ? (
          (() => {
            const assembly = bodyTrimAssemblyData.find(a => a.id === selectedBodyTrimL1);
            const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedBodyTrimL2);
            if (!subAssembly) return null;
            return (
              <div className="px-4 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assembly?.name} / {subAssembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">共 {subAssembly.parts.length} 个零件</p>
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
                        <tr key={part.id} className="hover:bg-emerald-50 transition-colors cursor-pointer" onClick={() => setSelectedBodyTrimPart(part)}>
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getBodyTrimPartMaterial(part)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{getBodyTrimPartProcess(part)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : selectedBodyTrimL1 !== '' ? (
          (() => {
            const assembly = bodyTrimAssemblyData.find(a => a.id === selectedBodyTrimL1);
            if (!assembly) return null;
            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
            return (
              <div className="px-4 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <span className="mr-2">{assembly.icon}</span>
                    {assembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assembly.subAssemblies.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedBodyTrimL2(sub.id);
                        setSelectedBodyTrimNode(sub.id);
                        setExpandedBodyTrimL2(prev => {
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
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getBodyTrimPartMaterial(part)}</span>
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

        {/* Detail Modal for body trim part */}
        {selectedBodyTrimPart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedBodyTrimPart(null); setEditingBodyTrimPart(null); }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedBodyTrimPart.name}</h2>
                  <button onClick={() => { setSelectedBodyTrimPart(null); setEditingBodyTrimPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  {(() => {
                    const editImage = bodyTrimPartEdits[selectedBodyTrimPart.id]?.imageUrl || selectedBodyTrimPart.imageUrl;
                    return editImage ? (
                      <img src={editImage} alt={selectedBodyTrimPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl block mb-2">🚗</span>
                        <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                      </div>
                    );
                  })()}
                </div>
                {(() => {
                  const editDesc = bodyTrimPartEdits[selectedBodyTrimPart.id]?.description || selectedBodyTrimPart.description;
                  const editFunc = bodyTrimPartEdits[selectedBodyTrimPart.id]?.function || selectedBodyTrimPart.function;
                  const editModels = bodyTrimPartEdits[selectedBodyTrimPart.id]?.vehicleModels || selectedBodyTrimPart.vehicleModels;
                  return (
                    <>
                      {editDesc && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4>
                          <p className="text-sm text-gray-600">{editDesc}</p>
                        </div>
                      )}
                      {editFunc && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4>
                          <p className="text-sm text-gray-600">{editFunc}</p>
                        </div>
                      )}
                      {editModels && editModels.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">车型信息</h4>
                          <div className="flex flex-wrap gap-1">
                            {editModels.map((model: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">{model}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
                {editingBodyTrimPart?.id === selectedBodyTrimPart.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                      <div className="flex flex-col gap-2">
                        {editBodyTrimImage && (
                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={editBodyTrimImage} alt="预览" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => setEditBodyTrimImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-lg cursor-pointer hover:bg-emerald-100">
                          <span className="text-sm text-emerald-600 font-medium">{editBodyTrimImage ? '重新上传图片' : '点击上传图片'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setEditBodyTrimImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                      <textarea value={editBodyTrimDescription} onChange={e => setEditBodyTrimDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                      <textarea value={editBodyTrimFunction} onChange={e => setEditBodyTrimFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                      <input type="text" value={editBodyTrimMaterial} onChange={e => setEditBodyTrimMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                      <input type="text" value={editBodyTrimProcess} onChange={e => setEditBodyTrimProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editBodyTrimVehicleModels.map((model, i) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium flex items-center gap-1">
                            {model}
                            <button type="button" onClick={() => setEditBodyTrimVehicleModels(prev => prev.filter((_, j) => j !== i))} className="text-amber-500 hover:text-red-500 ml-1">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newBodyTrimVehicleModel} onChange={e => setNewBodyTrimVehicleModel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newBodyTrimVehicleModel.trim()) { setEditBodyTrimVehicleModels(prev => [...prev, newBodyTrimVehicleModel.trim()]); setNewBodyTrimVehicleModel(''); } }} placeholder="输入车型后按回车" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm" />
                        <button type="button" onClick={() => { if (newBodyTrimVehicleModel.trim()) { setEditBodyTrimVehicleModels(prev => [...prev, newBodyTrimVehicleModel.trim()]); setNewBodyTrimVehicleModel(''); } }} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-sm">添加</button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => {
                        const newEdits = { ...bodyTrimPartEdits, [selectedBodyTrimPart.id]: { material: editBodyTrimMaterial, process: editBodyTrimProcess, imageUrl: editBodyTrimImage, description: editBodyTrimDescription, function: editBodyTrimFunction, vehicleModels: editBodyTrimVehicleModels } };
                        setBodyTrimPartEdits(newEdits);
                        localStorage.setItem('bodyTrimPartEdits', JSON.stringify(newEdits));
                        setEditingBodyTrimPart(null);
                        setSelectedBodyTrimPart({ ...selectedBodyTrimPart });
                      }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">保存</button>
                      <button onClick={() => setEditingBodyTrimPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型材料：</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getBodyTrimPartMaterial(selectedBodyTrimPart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型工艺：</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-sm font-medium">{getBodyTrimPartProcess(selectedBodyTrimPart)}</span>
                    </div>
                    {bodyTrimPartEdits[selectedBodyTrimPart.id] && (
                      <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedBodyTrimPart.material} / {selectedBodyTrimPart.process}）</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const existingEdit = bodyTrimPartEdits[selectedBodyTrimPart.id] || {};
                        setEditingBodyTrimPart(selectedBodyTrimPart);
                        setEditBodyTrimMaterial(getBodyTrimPartMaterial(selectedBodyTrimPart));
                        setEditBodyTrimProcess(getBodyTrimPartProcess(selectedBodyTrimPart));
                        setEditBodyTrimImage(existingEdit.imageUrl || selectedBodyTrimPart.imageUrl || '');
                        setEditBodyTrimDescription(existingEdit.description || selectedBodyTrimPart.description || '');
                        setEditBodyTrimFunction(existingEdit.function || selectedBodyTrimPart.function || '');
                        setEditBodyTrimVehicleModels(existingEdit.vehicleModels || selectedBodyTrimPart.vehicleModels || []);
                      }} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 text-sm">编辑完整信息</button>
                      <button
                        onClick={() => navigate(`/body-trim-parts/${selectedBodyTrimPart.id}`)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                      >
                        查看完整详情
                      </button>
                    </div>
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
