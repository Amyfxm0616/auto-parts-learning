import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SmartElectronicsAssemblyDiagram from '../SmartElectronicsAssemblyDiagram';
import { smartElectronicsAssemblyData, type SmartElectronicsPart } from '../../data/smartElectronicsAssembly';

export default function SmartElectronicsSystemView() {
  const navigate = useNavigate();
  const [selectedSmartElecNode, setSelectedSmartElecNode] = useState<string>('');
  const [expandedSmartElecL1, setExpandedSmartElecL1] = useState<Set<string>>(new Set(['se-01']));
  const [expandedSmartElecL2, setExpandedSmartElecL2] = useState<Set<string>>(new Set());
  const [selectedSmartElecL1, setSelectedSmartElecL1] = useState<string>('');
  const [selectedSmartElecL2, setSelectedSmartElecL2] = useState<string>('');
  const [selectedSmartElecPart, setSelectedSmartElecPart] = useState<SmartElectronicsPart | null>(null);
  const [smartElecPartEdits, setSmartElecPartEdits] = useState<Record<string, { material: string; process: string; imageUrl?: string; vehicleModels?: string[]; description?: string; function?: string }>>({});
  const [editingSmartElecPart, setEditingSmartElecPart] = useState<SmartElectronicsPart | null>(null);
  const [editSmartElecMaterial, setEditSmartElecMaterial] = useState('');
  const [editSmartElecProcess, setEditSmartElecProcess] = useState('');
  const [editSmartElecImage, setEditSmartElecImage] = useState<string>('');
  const [editSmartElecDescription, setEditSmartElecDescription] = useState('');
  const [editSmartElecFunction, setEditSmartElecFunction] = useState('');
  const [editSmartElecVehicleModels, setEditSmartElecVehicleModels] = useState<string[]>([]);
  const [newSmartElecVehicleModel, setNewSmartElecVehicleModel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('smartElectronicsPartEdits');
    if (saved) {
      setSmartElecPartEdits(JSON.parse(saved));
    }
  }, []);

  const getSmartElecPartMaterial = (part: SmartElectronicsPart) => smartElecPartEdits[part.id]?.material ?? part.material;
  const getSmartElecPartProcess = (part: SmartElectronicsPart) => smartElecPartEdits[part.id]?.process ?? part.process;

  return (
    <div className="flex min-h-[500px]">
      {/* 左侧树形导航 */}
      <div className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
        <div className="p-3">
          <div
            className={`flex items-center gap-1 px-3 py-2 rounded-md font-semibold text-sm cursor-pointer mb-1 ${
              selectedSmartElecNode === ''
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-800 hover:bg-gray-100'
            }`}
            onClick={() => {
              setSelectedSmartElecNode('');
              setSelectedSmartElecL1('');
              setSelectedSmartElecL2('');
            }}
          >
            <span>⚙️</span>
            <span>智能电器总成</span>
          </div>
          {smartElectronicsAssemblyData.map((assembly) => (
            <div key={assembly.id} className="mb-1">
              {/* Level 1: 总成 */}
              <div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none ${
                  selectedSmartElecL1 === assembly.id && selectedSmartElecL2 === ''
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setExpandedSmartElecL1(prev => {
                    const next = new Set(prev);
                    if (next.has(assembly.id)) next.delete(assembly.id);
                    else next.add(assembly.id);
                    return next;
                  });
                  setSelectedSmartElecL1(assembly.id);
                  setSelectedSmartElecL2('');
                  setSelectedSmartElecNode(assembly.id);
                }}
              >
                <span className="text-xs text-gray-400 w-3">
                  {expandedSmartElecL1.has(assembly.id) ? '▼' : '▶'}
                </span>
                <span className="mr-1">{assembly.icon}</span>
                <span className="font-semibold text-sm">{assembly.name}</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                  {assembly.subAssemblies.length}个分总成
                </span>
              </div>
              {/* Level 2: 分总成 */}
              {expandedSmartElecL1.has(assembly.id) && assembly.subAssemblies.length > 0 && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {assembly.subAssemblies.map((sub) => (
                    <div key={sub.id}>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                          selectedSmartElecL2 === sub.id
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setExpandedSmartElecL2(prev => {
                            const next = new Set(prev);
                            if (next.has(sub.id)) next.delete(sub.id);
                            else next.add(sub.id);
                            return next;
                          });
                          setSelectedSmartElecL1(assembly.id);
                          setSelectedSmartElecL2(sub.id);
                          setSelectedSmartElecNode(sub.id);
                        }}
                      >
                        <span className="text-xs text-gray-300 w-3">
                          {expandedSmartElecL2.has(sub.id) ? '▾' : '▸'}
                        </span>
                        <span className="text-xs text-gray-400">└</span>
                        <span>{sub.name}</span>
                        <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                          {sub.parts.length}个零件
                        </span>
                      </div>
                      {/* Level 3: 单件 */}
                      {expandedSmartElecL2.has(sub.id) && sub.parts.length > 0 && (
                        <div className="ml-6 mt-0.5 space-y-0.5">
                          {sub.parts.map((part) => (
                            <div
                              key={part.id}
                              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-gray-500 hover:bg-blue-50 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSmartElecPart(part);
                              }}
                            >
                              <span className="text-gray-300">•</span>
                              <span className="truncate">{part.name}</span>
                              <span className="ml-auto flex gap-1">
                                <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] leading-tight">{getSmartElecPartMaterial(part)}</span>
                                <span className="bg-blue-50 text-blue-700 px-1 rounded text-[10px] leading-tight">{getSmartElecPartProcess(part)}</span>
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
        {/* 示意图 - 始终显示 */}
        <div className="p-4">
          <SmartElectronicsAssemblyDiagram
            assemblies={smartElectronicsAssemblyData}
            selectedAssemblyId={selectedSmartElecL1}
            selectedSubAssemblyId={selectedSmartElecL2}
            onAssemblyClick={(assemblyId) => {
              setSelectedSmartElecL1(assemblyId);
              setSelectedSmartElecNode(assemblyId);
              setExpandedSmartElecL1(prev => {
                const next = new Set(prev);
                next.add(assemblyId);
                return next;
              });
            }}
            onSubAssemblyClick={(subId) => {
              const parent = smartElectronicsAssemblyData.find(a => a.subAssemblies.some(s => s.id === subId));
              if (parent) {
                setSelectedSmartElecL1(parent.id);
                setSelectedSmartElecL2(subId);
                setSelectedSmartElecNode(subId);
                setExpandedSmartElecL2(prev => {
                  const next = new Set(prev);
                  next.add(subId);
                  return next;
                });
              }
            }}
            onPartClick={(part) => setSelectedSmartElecPart(part)}
            selectedPart={selectedSmartElecPart}
          />
        </div>

        {/* 内容详情区 */}
        {selectedSmartElecNode === '' ? (
          /* 总览 - 显示所有总成卡片 */
          <div className="px-4 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">⚙️ 全部智能电器总成</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {smartElectronicsAssemblyData.map((assembly) => {
                const totalParts = assembly.subAssemblies.reduce((sum, s) => sum + s.parts.length, 0);
                return (
                  <div
                    key={assembly.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedSmartElecL1(assembly.id);
                      setSelectedSmartElecNode(assembly.id);
                      setExpandedSmartElecL1(prev => {
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
        ) : selectedSmartElecL2 !== '' ? (
          /* 分总成零件表 */
          (() => {
            const assembly = smartElectronicsAssemblyData.find(a => a.id === selectedSmartElecL1);
            const subAssembly = assembly?.subAssemblies.find(s => s.id === selectedSmartElecL2);
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
                        <tr key={part.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedSmartElecPart(part)}>
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{part.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{getSmartElecPartMaterial(part)}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">{getSmartElecPartProcess(part)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()
        ) : selectedSmartElecL1 !== '' ? (
          /* 总成分总成摘要 */
          (() => {
            const assembly = smartElectronicsAssemblyData.find(a => a.id === selectedSmartElecL1);
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
                        setSelectedSmartElecL2(sub.id);
                        setSelectedSmartElecNode(sub.id);
                        setExpandedSmartElecL2(prev => {
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
                            <span className="bg-green-50 text-green-700 px-1 rounded text-[10px] flex-shrink-0">{getSmartElecPartMaterial(part)}</span>
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

        {/* 零件详情弹窗 */}
        {selectedSmartElecPart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedSmartElecPart(null); setEditingSmartElecPart(null); }}>
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedSmartElecPart.name}</h2>
                  <button onClick={() => { setSelectedSmartElecPart(null); setEditingSmartElecPart(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                {/* 图片区 */}
                <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                  {(() => {
                    const editImage = smartElecPartEdits[selectedSmartElecPart.id]?.imageUrl || selectedSmartElecPart.imageUrl;
                    return editImage ? (
                      <img src={editImage} alt={selectedSmartElecPart.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400">暂无图片</div>'; }} />
                    ) : (
                      <div className="text-center">
                        <span className="text-4xl block mb-2">⚙️</span>
                        <span className="text-sm text-gray-400">示意图（暂无图片）</span>
                      </div>
                    );
                  })()}
                </div>

                {/* 描述/功能/车型 */}
                {(() => {
                  const editDesc = smartElecPartEdits[selectedSmartElecPart.id]?.description || selectedSmartElecPart.description;
                  const editFunc = smartElecPartEdits[selectedSmartElecPart.id]?.function || selectedSmartElecPart.function;
                  const editModels = smartElecPartEdits[selectedSmartElecPart.id]?.vehicleModels || selectedSmartElecPart.vehicleModels;
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

                {/* 编辑/显示模式 */}
                {editingSmartElecPart?.id === selectedSmartElecPart.id ? (
                  <div className="space-y-4">
                    {/* 图片上传 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">示意图 / 图片</label>
                      <div className="flex flex-col gap-2">
                        {editSmartElecImage && (
                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={editSmartElecImage} alt="预览" className="w-full h-full object-contain" />
                            <button type="button" onClick={() => setEditSmartElecImage('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
                          </div>
                        )}
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100">
                          <span className="text-sm text-blue-600 font-medium">{editSmartElecImage ? '重新上传图片' : '点击上传图片'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => setEditSmartElecImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }} />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">零部件描述</label>
                      <textarea value={editSmartElecDescription} onChange={e => setEditSmartElecDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">功能说明</label>
                      <textarea value={editSmartElecFunction} onChange={e => setEditSmartElecFunction(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型材料</label>
                      <input type="text" value={editSmartElecMaterial} onChange={e => setEditSmartElecMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">典型工艺</label>
                      <input type="text" value={editSmartElecProcess} onChange={e => setEditSmartElecProcess(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">车型信息</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {editSmartElecVehicleModels.map((model, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-medium">
                            {model}
                            <button onClick={() => setEditSmartElecVehicleModels(prev => prev.filter((_, idx) => idx !== i))} className="text-amber-500 hover:text-amber-700">×</button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newSmartElecVehicleModel} onChange={e => setNewSmartElecVehicleModel(e.target.value)} placeholder="输入车型名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => {
                          if (newSmartElecVehicleModel.trim() && !editSmartElecVehicleModels.includes(newSmartElecVehicleModel.trim())) {
                            setEditSmartElecVehicleModels(prev => [...prev, newSmartElecVehicleModel.trim()]);
                            setNewSmartElecVehicleModel('');
                          }
                        }} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">添加</button>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => {
                        const newEdits = {
                          ...smartElecPartEdits,
                          [selectedSmartElecPart.id]: {
                            material: editSmartElecMaterial,
                            process: editSmartElecProcess,
                            imageUrl: editSmartElecImage || undefined,
                            description: editSmartElecDescription || undefined,
                            function: editSmartElecFunction || undefined,
                            vehicleModels: editSmartElecVehicleModels.length > 0 ? editSmartElecVehicleModels : undefined,
                          }
                        };
                        setSmartElecPartEdits(newEdits);
                        localStorage.setItem('smartElectronicsPartEdits', JSON.stringify(newEdits));
                        setEditingSmartElecPart(null);
                        setSelectedSmartElecPart({ ...selectedSmartElecPart });
                      }} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存</button>
                      <button onClick={() => setEditingSmartElecPart(null)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">取消</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型材料：</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{getSmartElecPartMaterial(selectedSmartElecPart)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">典型工艺：</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-sm font-medium">{getSmartElecPartProcess(selectedSmartElecPart)}</span>
                    </div>
                    {smartElecPartEdits[selectedSmartElecPart.id] && (
                      <p className="text-xs text-amber-600">（已自定义修改，原始：{selectedSmartElecPart.material} / {selectedSmartElecPart.process}）</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const existingEdit = smartElecPartEdits[selectedSmartElecPart.id] || {};
                        setEditingSmartElecPart(selectedSmartElecPart);
                        setEditSmartElecMaterial(getSmartElecPartMaterial(selectedSmartElecPart));
                        setEditSmartElecProcess(getSmartElecPartProcess(selectedSmartElecPart));
                        setEditSmartElecImage(existingEdit.imageUrl || selectedSmartElecPart.imageUrl || '');
                        setEditSmartElecDescription(existingEdit.description || selectedSmartElecPart.description || '');
                        setEditSmartElecFunction(existingEdit.function || selectedSmartElecPart.function || '');
                        setEditSmartElecVehicleModels(existingEdit.vehicleModels || selectedSmartElecPart.vehicleModels || []);
                      }} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">编辑完整信息</button>
                      <button
                        onClick={() => navigate(`/smart-electronics-parts/${selectedSmartElecPart.id}`)}
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
