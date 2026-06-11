import { useState, useEffect } from 'react';
import SideDoorDiagram from '../SideDoorDiagram';
import { sideDoorAssemblyData, type SideDoorPart } from '../../data/sideDoorAssembly';

export default function SideDoorSystemView() {
  const [selectedSideDoorNode, setSelectedSideDoorNode] = useState<string>('');
  const [expandedSideDoorL1, setExpandedSideDoorL1] = useState<Set<string>>(new Set(['sd-01']));
  const [expandedSideDoorL2, setExpandedSideDoorL2] = useState<Set<string>>(new Set());
  const [selectedSideDoorL1, setSelectedSideDoorL1] = useState<string>('');
  const [selectedSideDoorL2, setSelectedSideDoorL2] = useState<string>('');
  const [selectedSideDoorPart, setSelectedSideDoorPart] = useState<SideDoorPart | null>(null);
  const [sideDoorPartEdits, setSideDoorPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingSideDoorPart, setEditingSideDoorPart] = useState<SideDoorPart | null>(null);
  const [editSideDoorMaterial, setEditSideDoorMaterial] = useState('');
  const [editSideDoorProcess, setEditSideDoorProcess] = useState('');
  const [editSideDoorImage, setEditSideDoorImage] = useState<string>('');
  const [editSideDoorDescription, setEditSideDoorDescription] = useState('');
  const [editSideDoorFunction, setEditSideDoorFunction] = useState('');
  const [editSideDoorVehicleModels, setEditSideDoorVehicleModels] = useState<string[]>([]);
  const [newSideDoorVehicleModel, setNewSideDoorVehicleModel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sideDoorPartEdits');
    if (saved) {
      setSideDoorPartEdits(JSON.parse(saved));
    }
  }, []);

  const getSideDoorPartMaterial = (part: SideDoorPart) => sideDoorPartEdits[part.id]?.material ?? part.material;
  const getSideDoorPartProcess = (part: SideDoorPart) => sideDoorPartEdits[part.id]?.process ?? part.process;

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧树形导航 */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">侧门系统</h3>
          <div className="space-y-0.5">
            {sideDoorAssemblyData.map((assembly) => (
              <div key={assembly.id}>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                    selectedSideDoorL1 === assembly.id
                      ? 'bg-sky-100 text-sky-800 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setExpandedSideDoorL1(prev => {
                      const next = new Set(prev);
                      next.has(assembly.id) ? next.delete(assembly.id) : next.add(assembly.id);
                      return next;
                    });
                    setSelectedSideDoorL1(assembly.id);
                    setSelectedSideDoorL2('');
                    setSelectedSideDoorNode(assembly.id);
                  }}
                >
                  <span className="text-xs text-gray-400 w-3">
                    {expandedSideDoorL1.has(assembly.id) ? '▼' : '▶'}
                  </span>
                  <span className="mr-1">{assembly.icon}</span>
                  <span className="font-semibold text-sm">{assembly.name}</span>
                  <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                    {assembly.subAssemblies.length}个分总成
                  </span>
                </div>
                {expandedSideDoorL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                  <div className="ml-3 mt-0.5 space-y-0.5">
                    {assembly.subAssemblies.map((sub) => (
                      <div key={sub.id}>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                            selectedSideDoorL2 === sub.id
                              ? 'bg-sky-100 text-sky-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setExpandedSideDoorL2(prev => {
                              const next = new Set(prev);
                              next.has(sub.id) ? next.delete(sub.id) : next.add(sub.id);
                              return next;
                            });
                            setSelectedSideDoorL1(assembly.id);
                            setSelectedSideDoorL2(sub.id);
                            setSelectedSideDoorNode(sub.id);
                          }}
                        >
                          <span className="text-xs text-gray-300 w-3">
                            {expandedSideDoorL2.has(sub.id) ? '▾' : '▸'}
                          </span>
                          <span className="text-xs text-gray-400">└</span>
                          <span>{sub.name}</span>
                          <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                            {sub.parts.length}个零件
                          </span>
                        </div>
                        {expandedSideDoorL2.has(sub.id) && sub.parts.length > 0 && (
                          <div className="ml-6 mt-0.5 space-y-0.5">
                            {sub.parts.map((part) => (
                              <div
                                key={part.id}
                                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-sky-50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSideDoorPart(part);
                                }}
                              >
                                <span className="text-gray-300">•</span>
                                <span className="truncate">{part.name}</span>
                                <span className="ml-auto flex gap-1">
                                  <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getSideDoorPartMaterial(part)}</span>
                                  <span className="bg-purple-50 text-purple-700 px-1 rounded text-[10px] leading-tight">{getSideDoorPartProcess(part)}</span>
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
          <SideDoorDiagram
            assemblies={sideDoorAssemblyData}
            selectedAssemblyId={selectedSideDoorL1}
            selectedSubAssemblyId={selectedSideDoorL2}
            onAssemblyClick={(assemblyId) => {
              setSelectedSideDoorL1(assemblyId);
              setSelectedSideDoorNode(assemblyId);
              setExpandedSideDoorL1(prev => {
                const next = new Set(prev);
                next.add(assemblyId);
                return next;
              });
            }}
            onSubAssemblyClick={(subId) => {
              const parent = sideDoorAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
              if (parent) {
                setSelectedSideDoorL1(parent.id);
                setSelectedSideDoorL2(subId);
                setSelectedSideDoorNode(subId);
                setExpandedSideDoorL2(prev => {
                  const next = new Set(prev);
                  next.add(subId);
                  return next;
                });
              }
            }}
            onPartClick={(part) => setSelectedSideDoorPart(part)}
            selectedSideDoorPart={selectedSideDoorPart}
          />
        </div>

        {selectedSideDoorNode === '' ? (
          <div className="px-4 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">🚗 侧门系统总成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sideDoorAssemblyData.map((assembly) => {
                const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                return (
                  <div
                    key={assembly.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedSideDoorL1(assembly.id);
                      setSelectedSideDoorNode(assembly.id);
                      setExpandedSideDoorL1(prev => { const next = new Set(prev); next.add(assembly.id); return next; });
                    }}
                  >
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                      <span className="mr-1">{assembly.icon}</span>{assembly.name}
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
        ) : selectedSideDoorL2 !== '' ? (
          (() => {
            const assembly = sideDoorAssemblyData.find(a => a.id === selectedSideDoorL1);
            const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedSideDoorL2);
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
                        <tr key={part.id} className="hover:bg-sky-50 transition-colors cursor-pointer" onClick={() => setSelectedSideDoorPart(part)}>
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getSideDoorPartMaterial(part)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{getSideDoorPartProcess(part)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : selectedSideDoorL1 !== '' ? (
          (() => {
            const assembly = sideDoorAssemblyData.find(a => a.id === selectedSideDoorL1);
            if (!assembly) return null;
            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
            return (
              <div className="px-4 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <span className="mr-2">{assembly.icon}</span>{assembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assembly.subAssemblies.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedSideDoorL2(sub.id);
                        setSelectedSideDoorNode(sub.id);
                        setExpandedSideDoorL2(prev => { const next = new Set(prev); next.add(sub.id); return next; });
                      }}
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">{sub.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{sub.parts.length} 个零件</p>
                      <div className="space-y-1">
                        {sub.parts.slice(0, 3).map((part) => (
                          <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-gray-300">•</span>
                            <span className="truncate flex-1">{part.name}</span>
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getSideDoorPartMaterial(part)}</span>
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

        {/* Detail Modal for side door part */}
        {selectedSideDoorPart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedSideDoorPart(null); setEditingSideDoorPart(null); }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedSideDoorPart.name}</h2>
                  <button onClick={() => { setSelectedSideDoorPart(null); setEditingSideDoorPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  {(() => {
                    const editImage = sideDoorPartEdits[selectedSideDoorPart.id]?.imageUrl || selectedSideDoorPart.imageUrl;
                    return editImage ? (
                      <img src={editImage} alt={selectedSideDoorPart.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl block mb-2">🚪</span>
                        <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                      </div>
                    );
                  })()}
                </div>
                {(() => {
                  const editDesc = sideDoorPartEdits[selectedSideDoorPart.id]?.description || selectedSideDoorPart.description;
                  const editFunc = sideDoorPartEdits[selectedSideDoorPart.id]?.function || selectedSideDoorPart.function;
                  const editModels = sideDoorPartEdits[selectedSideDoorPart.id]?.vehicleModels || selectedSideDoorPart.vehicleModels;
                  return (
                    <>
                      {editDesc && <div className="mb-3"><h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">零部件描述</h4><p className="text-sm text-gray-600">{editDesc}</p></div>}
                      {editFunc && <div className="mb-3"><h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">功能说明</h4><p className="text-sm text-gray-600">{editFunc}</p></div>}
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
                {editingSideDoorPart?.id === selectedSideDoorPart.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                      <div className="flex flex-col gap-2">
                        {editSideDoorImage && (
                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={editSideDoorImage} alt="预览" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => setEditSideDoorImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg cursor-pointer hover:bg-sky-100">
                          <span className="text-sm text-sky-600 font-medium">{editSideDoorImage ? '重新上传图片' : '点击上传图片'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setEditSideDoorImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                      <textarea value={editSideDoorDescription} onChange={e => setEditSideDoorDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                      <textarea value={editSideDoorFunction} onChange={e => setEditSideDoorFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                      <input type="text" value={editSideDoorMaterial} onChange={e => setEditSideDoorMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                      <input type="text" value={editSideDoorProcess} onChange={e => setEditSideDoorProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editSideDoorVehicleModels.map((model, i) => (
                          <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium flex items-center gap-1">
                            {model}
                            <button type="button" onClick={() => setEditSideDoorVehicleModels(prev => prev.filter((_, j) => j !== i))} className="text-amber-500 hover:text-red-500 ml-1">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newSideDoorVehicleModel} onChange={e => setNewSideDoorVehicleModel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newSideDoorVehicleModel.trim()) { setEditSideDoorVehicleModels(prev => [...prev, newSideDoorVehicleModel.trim()]); setNewSideDoorVehicleModel(''); } }} placeholder="输入车型后按回车" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 text-sm" />
                        <button type="button" onClick={() => { if (newSideDoorVehicleModel.trim()) { setEditSideDoorVehicleModels(prev => [...prev, newSideDoorVehicleModel.trim()]); setNewSideDoorVehicleModel(''); } }} className="px-3 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 text-sm">添加</button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => {
                        const newEdits = { ...sideDoorPartEdits, [selectedSideDoorPart.id]: { material: editSideDoorMaterial, process: editSideDoorProcess, imageUrl: editSideDoorImage, description: editSideDoorDescription, function: editSideDoorFunction, vehicleModels: editSideDoorVehicleModels } };
                        setSideDoorPartEdits(newEdits);
                        localStorage.setItem('sideDoorPartEdits', JSON.stringify(newEdits));
                        setEditingSideDoorPart(null);
                        setSelectedSideDoorPart({ ...selectedSideDoorPart });
                      }} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">保存</button>
                      <button onClick={() => setEditingSideDoorPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型材料：</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getSideDoorPartMaterial(selectedSideDoorPart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型工艺：</span>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-sm font-medium">{getSideDoorPartProcess(selectedSideDoorPart)}</span>
                    </div>
                    {sideDoorPartEdits[selectedSideDoorPart.id] && (
                      <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedSideDoorPart.material} / {selectedSideDoorPart.process}）</p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingSideDoorPart(selectedSideDoorPart);
                          setEditSideDoorMaterial(getSideDoorPartMaterial(selectedSideDoorPart));
                          setEditSideDoorProcess(getSideDoorPartProcess(selectedSideDoorPart));
                          setEditSideDoorImage(sideDoorPartEdits[selectedSideDoorPart.id]?.imageUrl || selectedSideDoorPart.imageUrl || '');
                          setEditSideDoorDescription(sideDoorPartEdits[selectedSideDoorPart.id]?.description || selectedSideDoorPart.description || '');
                          setEditSideDoorFunction(sideDoorPartEdits[selectedSideDoorPart.id]?.function || selectedSideDoorPart.function || '');
                          setEditSideDoorVehicleModels(sideDoorPartEdits[selectedSideDoorPart.id]?.vehicleModels || selectedSideDoorPart.vehicleModels || []);
                        }}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 text-sm"
                      >
                        编辑信息
                      </button>
                      {sideDoorPartEdits[selectedSideDoorPart.id] && (
                        <button
                          onClick={() => {
                            const newEdits = { ...sideDoorPartEdits };
                            delete newEdits[selectedSideDoorPart.id];
                            setSideDoorPartEdits(newEdits);
                            localStorage.setItem('sideDoorPartEdits', JSON.stringify(newEdits));
                            setSelectedSideDoorPart({ ...selectedSideDoorPart });
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                        >
                          恢复原始
                        </button>
                      )}
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
