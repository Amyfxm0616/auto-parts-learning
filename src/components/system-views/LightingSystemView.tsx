import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LightingDiagram from '../LightingDiagram';
import { lightingAssemblyData, type LightingPart } from '../../data/lightingAssembly';

export default function LightingSystemView() {
  const navigate = useNavigate();
  const [selectedLightingNode, setSelectedLightingNode] = useState<string>('');
  const [expandedLightingL1, setExpandedLightingL1] = useState<Set<string>>(new Set(['la-01']));
  const [expandedLightingL2, setExpandedLightingL2] = useState<Set<string>>(new Set());
  const [selectedLightingL1, setSelectedLightingL1] = useState<string>('');
  const [selectedLightingL2, setSelectedLightingL2] = useState<string>('');
  const [selectedLightingPart, setSelectedLightingPart] = useState<LightingPart | null>(null);
  const [lightingPartEdits, setLightingPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingLightingPart, setEditingLightingPart] = useState<LightingPart | null>(null);
  const [editLightingMaterial, setEditLightingMaterial] = useState('');
  const [editLightingProcess, setEditLightingProcess] = useState('');
  const [editLightingImage, setEditLightingImage] = useState<string>('');
  const [editLightingDescription, setEditLightingDescription] = useState('');
  const [editLightingFunction, setEditLightingFunction] = useState('');
  const [editLightingVehicleModels, setEditLightingVehicleModels] = useState<string[]>([]);
  const [newLightingVehicleModel, setNewLightingVehicleModel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lightingPartEdits');
    if (saved) {
      setLightingPartEdits(JSON.parse(saved));
    }
  }, []);

  const getLightingPartMaterial = (part: LightingPart) => lightingPartEdits[part.id]?.material ?? part.material;
  const getLightingPartProcess = (part: LightingPart) => lightingPartEdits[part.id]?.process ?? part.process;

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧树形导航 */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <div
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
              selectedLightingNode === ''
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => {
              setSelectedLightingNode('');
              setSelectedLightingL1('');
              setSelectedLightingL2('');
            }}
          >
            <span>💡</span>
            <span>灯具总成</span>
          </div>
          {lightingAssemblyData.map((assembly) => (
            <div key={assembly.id} className="mb-1">
              {/* Level 1: 总成 */}
              <div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                  selectedLightingL1 === assembly.id && selectedLightingL2 === ''
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setExpandedLightingL1(prev => {
                    const next = new Set(prev);
                    if (next.has(assembly.id)) {
                      next.delete(assembly.id);
                    } else {
                      next.add(assembly.id);
                    }
                    return next;
                  });
                  setSelectedLightingL1(assembly.id);
                  setSelectedLightingL2('');
                  setSelectedLightingNode(assembly.id);
                }}
              >
                <span className="text-xs text-gray-400 w-3">
                  {expandedLightingL1.has(assembly.id) ? '▼' : '▶'}
                </span>
                <span className="mr-1">{assembly.icon}</span>
                <span className="font-semibold text-sm">{assembly.name}</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                  {assembly.subAssemblies.length}个分总成
                </span>
              </div>
              {/* Level 2: 分总成 */}
              {expandedLightingL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {assembly.subAssemblies.map((sub) => (
                    <div key={sub.id}>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                          selectedLightingL2 === sub.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setExpandedLightingL2(prev => {
                            const next = new Set(prev);
                            if (next.has(sub.id)) {
                              next.delete(sub.id);
                            } else {
                              next.add(sub.id);
                            }
                            return next;
                          });
                          setSelectedLightingL1(assembly.id);
                          setSelectedLightingL2(sub.id);
                          setSelectedLightingNode(sub.id);
                        }}
                      >
                        <span className="text-xs text-gray-300 w-3">
                          {expandedLightingL2.has(sub.id) ? '▾' : '▸'}
                        </span>
                        <span className="text-xs text-gray-400">└</span>
                        <span>{sub.name}</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                          {sub.parts.length}个零件
                        </span>
                      </div>
                      {/* Level 3: 单件 */}
                      {expandedLightingL2.has(sub.id) && sub.parts.length > 0 && (
                        <div className="ml-6 mt-0.5 space-y-0.5">
                          {sub.parts.map((part) => (
                            <div
                              key={part.id}
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-blue-50 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLightingPart(part);
                              }}
                            >
                              <span className="text-gray-300">•</span>
                              <span className="truncate">{part.name}</span>
                              <span className="ml-auto flex gap-1">
                                <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getLightingPartMaterial(part)}</span>
                                <span className="bg-blue-50 text-blue-700 px-1 rounded text-[10px] leading-tight">{getLightingPartProcess(part)}</span>
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
        {/* Lighting Diagram at top - always visible */}
        <div className="p-4">
          <LightingDiagram
            assemblies={lightingAssemblyData}
            selectedAssemblyId={selectedLightingL1}
            selectedSubAssemblyId={selectedLightingL2}
            onAssemblyClick={(assemblyId) => {
              setSelectedLightingL1(assemblyId);
              setSelectedLightingNode(assemblyId);
              setExpandedLightingL1(prev => {
                const next = new Set(prev);
                next.add(assemblyId);
                return next;
              });
            }}
            onSubAssemblyClick={(subId) => {
              const parent = lightingAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
              if (parent) {
                setSelectedLightingL1(parent.id);
                setSelectedLightingL2(subId);
                setSelectedLightingNode(subId);
                setExpandedLightingL2(prev => {
                  const next = new Set(prev);
                  next.add(subId);
                  return next;
                });
              }
            }}
            onPartClick={(part) => setSelectedLightingPart(part)}
            selectedLightingPart={selectedLightingPart}
          />
        </div>

        {/* Parts detail content below diagram */}
        {selectedLightingNode === '' ? (
          /* 灯具总成概览 - 显示所有总成卡片 */
          <div className="px-4 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 全部灯具总成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lightingAssemblyData.map((assembly) => {
                const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                return (
                  <div
                    key={assembly.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedLightingL1(assembly.id);
                      setSelectedLightingNode(assembly.id);
                      setExpandedLightingL1(prev => {
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
        ) : selectedLightingL2 !== '' ? (
          /* Level 2 selected: show parts table with material & process info */
          (() => {
            const assembly = lightingAssemblyData.find(a => a.id === selectedLightingL1);
            const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedLightingL2);
            if (!subAssembly) return null;
            return (
              <div className="px-4 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
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
                        <tr key={part.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedLightingPart(part)}>
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getLightingPartMaterial(part)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getLightingPartProcess(part)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : selectedLightingL1 !== '' ? (
          /* Level 1 selected: show sub-assembly summary */
          (() => {
            const assembly = lightingAssemblyData.find(a => a.id === selectedLightingL1);
            if (!assembly) return null;
            const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
            return (
              <div className="px-4 pb-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <span className="mr-2">{assembly.icon}</span>
                    {assembly.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    共 {assembly.subAssemblies.length} 个分总成，{totalParts} 个零件
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {assembly.subAssemblies.map((sub) => (
                    <div
                      key={sub.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedLightingL2(sub.id);
                        setSelectedLightingNode(sub.id);
                        setExpandedLightingL2(prev => {
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
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getLightingPartMaterial(part)}</span>
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
        {/* Detail Modal for lighting part - enhanced */}
        {selectedLightingPart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedLightingPart(null); setEditingLightingPart(null); }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedLightingPart.name}</h2>
                  <button onClick={() => { setSelectedLightingPart(null); setEditingLightingPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                {/* Image / Schematic */}
                <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  {(() => {
                    const editImage = lightingPartEdits[selectedLightingPart.id]?.imageUrl || selectedLightingPart.imageUrl;
                    return editImage ? (
                      <img src={editImage} alt={selectedLightingPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl block mb-2">🔧</span>
                        <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Description & Function */}
                {(() => {
                  const editDesc = lightingPartEdits[selectedLightingPart.id]?.description || selectedLightingPart.description;
                  const editFunc = lightingPartEdits[selectedLightingPart.id]?.function || selectedLightingPart.function;
                  const editModels = lightingPartEdits[selectedLightingPart.id]?.vehicleModels || selectedLightingPart.vehicleModels;
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

                {/* Info - Editing or Display */}
                {editingLightingPart?.id === selectedLightingPart.id ? (
                  <div className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                      <div className="flex flex-col gap-2">
                        {editLightingImage && (
                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={editLightingImage} alt="预览" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => setEditLightingImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                          <span className="text-sm text-blue-600 font-medium">{editLightingImage ? '重新上传图片' : '点击上传图片'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setEditLightingImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      </div>
                    </div>
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                      <textarea value={editLightingDescription} onChange={e => setEditLightingDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* Function */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                      <textarea value={editLightingFunction} onChange={e => setEditLightingFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* Material */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                      <input type="text" value={editLightingMaterial} onChange={e => setEditLightingMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* Process */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                      <input type="text" value={editLightingProcess} onChange={e => setEditLightingProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    {/* Vehicle Models */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editLightingVehicleModels.map((model, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                            {model}
                            <button onClick={() => setEditLightingVehicleModels(prev => prev.filter((_, idx) => idx !== i))} className="text-amber-500 hover:text-amber-700">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newLightingVehicleModel} onChange={e => setNewLightingVehicleModel(e.target.value)} placeholder="输入车型名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => {
                          if (newLightingVehicleModel.trim() && !editLightingVehicleModels.includes(newLightingVehicleModel.trim())) {
                            setEditLightingVehicleModels(prev => [...prev, newLightingVehicleModel.trim()]);
                            setNewLightingVehicleModel('');
                          }
                        }} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">添加</button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => {
                        const newEdits = {
                          ...lightingPartEdits,
                          [selectedLightingPart.id]: {
                            material: editLightingMaterial,
                            process: editLightingProcess,
                            imageUrl: editLightingImage || undefined,
                            description: editLightingDescription || undefined,
                            function: editLightingFunction || undefined,
                            vehicleModels: editLightingVehicleModels.length > 0 ? editLightingVehicleModels : undefined,
                          }
                        };
                        setLightingPartEdits(newEdits);
                        localStorage.setItem('lightingPartEdits', JSON.stringify(newEdits));
                        setEditingLightingPart(null);
                        setSelectedLightingPart({ ...selectedLightingPart });
                      }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
                      <button onClick={() => setEditingLightingPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型材料：</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getLightingPartMaterial(selectedLightingPart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型工艺：</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{getLightingPartProcess(selectedLightingPart)}</span>
                    </div>
                    {(lightingPartEdits[selectedLightingPart.id]) && (
                      <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedLightingPart.material} / {selectedLightingPart.process}）</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const existingEdit = lightingPartEdits[selectedLightingPart.id] || {};
                        setEditingLightingPart(selectedLightingPart);
                        setEditLightingMaterial(getLightingPartMaterial(selectedLightingPart));
                        setEditLightingProcess(getLightingPartProcess(selectedLightingPart));
                        setEditLightingImage(existingEdit.imageUrl || selectedLightingPart.imageUrl || '');
                        setEditLightingDescription(existingEdit.description || selectedLightingPart.description || '');
                        setEditLightingFunction(existingEdit.function || selectedLightingPart.function || '');
                        setEditLightingVehicleModels(existingEdit.vehicleModels || selectedLightingPart.vehicleModels || []);
                      }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">编辑完整信息</button>
                      <button
                        onClick={() => navigate(`/lighting-parts/${selectedLightingPart.id}`)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
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
