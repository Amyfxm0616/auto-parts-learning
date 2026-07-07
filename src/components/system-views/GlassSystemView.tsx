import { useState, useEffect } from 'react';
import GlassDiagram from '../GlassDiagram';
import { glassAssemblyData, type GlassVariant } from '../../data/glassAssembly';

export default function GlassSystemView() {
  const [selectedGlassCatId, setSelectedGlassCatId] = useState<string>('');
  const [selectedGlassPartId, setSelectedGlassPartId] = useState<string>('');
  const [selectedGlassVariant, setSelectedGlassVariant] = useState<GlassVariant | null>(null);
  const [expandedGlassCats, setExpandedGlassCats] = useState<Set<string>>(new Set(['gl-cat-fw']));
  const [glassVariantEdits, setGlassVariantEdits] = useState<Record<string, Partial<GlassVariant>>>({});
  const [glassDeletedIds, setGlassDeletedIds] = useState<Set<string>>(new Set());
  const [editingGlassVariant, setEditingGlassVariant] = useState<GlassVariant | null>(null);
  const [editGlassVehicleModel, setEditGlassVehicleModel] = useState('');
  const [editGlassComposition, setEditGlassComposition] = useState('');
  const [editGlassType, setEditGlassType] = useState('');
  const [editGlassCoating, setEditGlassCoating] = useState('');
  const [editGlassPrivacy, setEditGlassPrivacy] = useState('');
  const [editGlassSound, setEditGlassSound] = useState('');
  const [editGlassTTS, setEditGlassTTS] = useState('');
  const [editGlassTL, setEditGlassTL] = useState('');
  const [editGlassIR, setEditGlassIR] = useState('');
  const [editGlassUV, setEditGlassUV] = useState('');
  const [editGlassArea, setEditGlassArea] = useState('');

  useEffect(() => {
    const savedEdits = localStorage.getItem('glassVariantEdits');
    if (savedEdits) {
      setGlassVariantEdits(JSON.parse(savedEdits));
    }
    const savedDeleted = localStorage.getItem('glassDeletedIds');
    if (savedDeleted) {
      setGlassDeletedIds(new Set(JSON.parse(savedDeleted)));
    }
  }, []);

  const getGlassV = (v: GlassVariant): GlassVariant => ({
    ...v,
    ...(glassVariantEdits[v.id] ?? {}),
  });

  return (
    <>
      <div className="flex min-h-[500px]">
        {/* 左侧树形导航 */}
        <div className="w-60 flex-shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto">
          <div className="p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">🪟 玻璃系统</h3>
            <div className="space-y-0.5">
              {glassAssemblyData.map((cat) => (
                <div key={cat.id}>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                      selectedGlassCatId === cat.id
                        ? 'bg-sky-100 text-sky-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setExpandedGlassCats(prev => {
                        const next = new Set(prev);
                        next.has(cat.id) ? next.delete(cat.id) : next.add(cat.id);
                        return next;
                      });
                      setSelectedGlassCatId(cat.id);
                      setSelectedGlassPartId('');
                      setSelectedGlassVariant(null);
                    }}
                  >
                    <span className="text-xs text-gray-400 w-3">
                      {expandedGlassCats.has(cat.id) ? '▼' : '▶'}
                    </span>
                    <span className="mr-1">{cat.icon}</span>
                    <span className="font-semibold text-sm">{cat.name}</span>
                    <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                      {cat.parts.reduce((s, p) => s + p.variants.length, 0)}款
                    </span>
                  </div>
                  {expandedGlassCats.has(cat.id) && (
                    <div className="ml-3 mt-0.5 space-y-0.5">
                      {cat.parts.map((part) => (
                        <div key={part.id}>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer text-sm ${
                              selectedGlassPartId === part.id
                                ? 'bg-sky-100 text-sky-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setSelectedGlassCatId(cat.id);
                              setSelectedGlassPartId(part.id);
                              setSelectedGlassVariant(null);
                            }}
                          >
                            <span className="text-xs text-gray-300 w-3">▸</span>
                            <span className="text-xs text-gray-400">└</span>
                            <span>{part.name}</span>
                            <span className="ml-auto text-xs bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                              {part.variants.length}款
                            </span>
                          </div>
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
            <GlassDiagram
              categories={glassAssemblyData}
              selectedCategoryId={selectedGlassCatId}
              onCategoryClick={(catId) => {
                setSelectedGlassCatId(catId);
                setSelectedGlassPartId('');
                setSelectedGlassVariant(null);
                setExpandedGlassCats(prev => { const next = new Set(prev); next.add(catId); return next; });
              }}
            />
          </div>

          {/* 玻璃系统内容展示 */}
          {selectedGlassPartId !== '' ? (
            (() => {
              const cat = glassAssemblyData.find(c => c.id === selectedGlassCatId);
              const part = cat?.parts.find(p => p.id === selectedGlassPartId);
              if (!part) return null;
              return (
                <div className="px-4 pb-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {cat?.icon} {cat?.name} / {part.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">共 {part.variants.filter(v => !glassDeletedIds.has(v.id)).length} 款车型</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase w-8">序</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">车型</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">玻璃组合</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">类型</th>
                          {cat?.hasCoatingDesc && <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">镀膜</th>}
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">隐私</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">隔音</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">TTS</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">TL</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">红外阻隔率</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">紫外阻隔率</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">面积(m²)</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {part.variants.filter(v => !glassDeletedIds.has(v.id)).map((v, idx) => {
                          const gv = getGlassV(v);
                          const isEdited = !!glassVariantEdits[v.id];
                          return (
                          <tr
                            key={v.id}
                            className={`hover:bg-sky-50 transition-colors cursor-pointer ${selectedGlassVariant?.id === v.id ? 'bg-sky-50' : ''}`}
                            onClick={() => setSelectedGlassVariant(gv)}
                          >
                            <td className="px-3 py-2 text-gray-400">
                              {idx + 1}
                              {isEdited && <span className="ml-1 text-orange-400 text-xs">*</span>}
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{gv.vehicleModel}</td>
                            <td className="px-3 py-2 text-gray-700">{gv.glassComposition}</td>
                            <td className="px-3 py-2">
                              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{gv.glassType}</span>
                            </td>
                            {cat?.hasCoatingDesc && (
                              <td className="px-3 py-2">
                                {gv.coatingDesc && gv.coatingDesc !== '/' ? (
                                  <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">{gv.coatingDesc}</span>
                                ) : <span className="text-gray-300">—</span>}
                              </td>
                            )}
                            <td className="px-3 py-2">
                              <span className={`px-1.5 py-0.5 rounded ${gv.privacyFunction === '非隐私' ? 'bg-gray-50 text-gray-500' : 'bg-purple-50 text-purple-700'}`}>
                                {gv.privacyFunction}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-1.5 py-0.5 rounded ${gv.soundInsulation === '/' || gv.soundInsulation === '无' ? 'bg-gray-50 text-gray-400' : 'bg-green-50 text-green-700'}`}>
                                {gv.soundInsulation}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{gv.thermalTTS}</td>
                            <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{gv.lightTransmittance}</td>
                            <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{gv.irBlockingRate}</td>
                            <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{gv.uvBlockingRate}</td>
                            <td className="px-3 py-2 text-gray-700 whitespace-nowrap">{gv.glassArea}</td>
                            <td className="px-3 py-2 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                              <button
                                className="text-xs text-blue-600 hover:text-blue-800 mr-2"
                                onClick={() => {
                                  const merged = getGlassV(v);
                                  setEditingGlassVariant(merged);
                                  setEditGlassVehicleModel(merged.vehicleModel);
                                  setEditGlassComposition(merged.glassComposition);
                                  setEditGlassType(merged.glassType);
                                  setEditGlassCoating(merged.coatingDesc ?? '');
                                  setEditGlassPrivacy(merged.privacyFunction);
                                  setEditGlassSound(merged.soundInsulation);
                                  setEditGlassTTS(merged.thermalTTS);
                                  setEditGlassTL(merged.lightTransmittance);
                                  setEditGlassIR(merged.irBlockingRate);
                                  setEditGlassUV(merged.uvBlockingRate);
                                  setEditGlassArea(merged.glassArea);
                                }}
                              >编辑</button>
                              <button
                                className="text-xs text-red-500 hover:text-red-700"
                                onClick={() => {
                                  if (window.confirm(`确定删除「${gv.vehicleModel}」这条记录吗？`)) {
                                    const newSet = new Set(glassDeletedIds);
                                    newSet.add(v.id);
                                    setGlassDeletedIds(newSet);
                                    localStorage.setItem('glassDeletedIds', JSON.stringify([...newSet]));
                                    if (selectedGlassVariant?.id === v.id) setSelectedGlassVariant(null);
                                  }
                                }}
                              >删除</button>
                              {isEdited && (
                                <button
                                  className="text-xs text-gray-400 hover:text-gray-600 ml-2"
                                  onClick={() => {
                                    const newEdits = { ...glassVariantEdits };
                                    delete newEdits[v.id];
                                    setGlassVariantEdits(newEdits);
                                    localStorage.setItem('glassVariantEdits', JSON.stringify(newEdits));
                                  }}
                                >还原</button>
                              )}
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 选中某一行后显示详情卡片 */}
                  {selectedGlassVariant && (
                    <div className="mt-4 border border-sky-200 rounded-xl p-4 bg-sky-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sky-900 text-sm">
                          {part.name} — {selectedGlassVariant.vehicleModel}
                        </h4>
                        <button onClick={() => setSelectedGlassVariant(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕ 关闭</button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div><span className="text-gray-500">玻璃组合：</span><span className="font-medium">{selectedGlassVariant.glassComposition}</span></div>
                        <div><span className="text-gray-500">玻璃类型：</span><span className="font-medium">{selectedGlassVariant.glassType}</span></div>
                        {cat?.hasCoatingDesc && <div><span className="text-gray-500">镀膜：</span><span className="font-medium">{selectedGlassVariant.coatingDesc || '—'}</span></div>}
                        <div><span className="text-gray-500">隐私功能：</span><span className="font-medium">{selectedGlassVariant.privacyFunction}</span></div>
                        <div><span className="text-gray-500">隔音功能：</span><span className="font-medium">{selectedGlassVariant.soundInsulation}</span></div>
                        <div><span className="text-gray-500">TTS（隔热/太阳能透射）：</span><span className="font-medium text-orange-700">{selectedGlassVariant.thermalTTS}</span></div>
                        <div><span className="text-gray-500">TL（透光率）：</span><span className="font-medium text-blue-700">{selectedGlassVariant.lightTransmittance}</span></div>
                        <div><span className="text-gray-500">红外阻隔率：</span><span className="font-medium text-red-700">{selectedGlassVariant.irBlockingRate}</span></div>
                        <div><span className="text-gray-500">紫外阻隔率：</span><span className="font-medium text-violet-700">{selectedGlassVariant.uvBlockingRate}</span></div>
                        <div><span className="text-gray-500">玻璃面积：</span><span className="font-medium">{selectedGlassVariant.glassArea} m²</span></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()
          ) : selectedGlassCatId !== '' ? (
            (() => {
              const cat = glassAssemblyData.find(c => c.id === selectedGlassCatId);
              if (!cat) return null;
              const total = cat.parts.reduce((s, p) => s + p.variants.length, 0);
              return (
                <div className="px-4 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{cat.icon} {cat.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">共 {cat.parts.length} 个零件分类，{total} 款车型</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cat.parts.map((part) => (
                      <div
                        key={part.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedGlassPartId(part.id)}
                      >
                        <h4 className="font-semibold text-sm text-gray-900 mb-1">{part.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{part.variants.length} 款车型</p>
                        <div className="space-y-1">
                          {part.variants.slice(0, 3).map((v) => (
                            <div key={v.id} className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="text-gray-300">•</span>
                              <span className="font-medium flex-shrink-0">{v.vehicleModel}</span>
                              <span className="truncate text-gray-400">{v.glassComposition}</span>
                            </div>
                          ))}
                          {part.variants.length > 3 && (
                            <p className="text-xs text-gray-400 ml-3">...还有 {part.variants.length - 3} 款</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="px-4 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🪟 整车玻璃系统总成</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {glassAssemblyData.map((cat) => {
                  const total = cat.parts.reduce((s, p) => s + p.variants.length, 0);
                  return (
                    <div
                      key={cat.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedGlassCatId(cat.id);
                        setExpandedGlassCats(prev => { const next = new Set(prev); next.add(cat.id); return next; });
                      }}
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        <span className="mr-1">{cat.icon}</span>{cat.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">{cat.parts.length} 个零件，{total} 款车型</p>
                      <div className="space-y-1">
                        {cat.parts.map((part) => (
                          <div key={part.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="text-gray-300">└</span>
                            <span className="truncate flex-1">{part.name}</span>
                            <span className="text-gray-400">{part.variants.length}款</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 玻璃变体编辑弹窗 ── */}
      {editingGlassVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditingGlassVariant(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">编辑玻璃数据 — {editingGlassVariant.vehicleModel}</h3>
              <button onClick={() => setEditingGlassVariant(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">车型</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassVehicleModel} onChange={e => setEditGlassVehicleModel(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">玻璃组合</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassComposition} onChange={e => setEditGlassComposition(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">玻璃类型</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassType} onChange={e => setEditGlassType(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">镀膜信息</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassCoating} onChange={e => setEditGlassCoating(e.target.value)} placeholder="无则留空" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">隐私功能</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassPrivacy} onChange={e => setEditGlassPrivacy(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">隔音功能</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassSound} onChange={e => setEditGlassSound(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">TTS（太阳能总透射比）</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassTTS} onChange={e => setEditGlassTTS(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">TL（透光率）</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassTL} onChange={e => setEditGlassTL(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">红外阻隔率</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassIR} onChange={e => setEditGlassIR(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">紫外阻隔率</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassUV} onChange={e => setEditGlassUV(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">玻璃面积(m²)</label>
                <input className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={editGlassArea} onChange={e => setEditGlassArea(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 mt-5 justify-end">
              <button
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setEditingGlassVariant(null)}
              >取消</button>
              <button
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => {
                  const newEdits = {
                    ...glassVariantEdits,
                    [editingGlassVariant.id]: {
                      vehicleModel: editGlassVehicleModel,
                      glassComposition: editGlassComposition,
                      glassType: editGlassType,
                      coatingDesc: editGlassCoating,
                      privacyFunction: editGlassPrivacy,
                      soundInsulation: editGlassSound,
                      thermalTTS: editGlassTTS,
                      lightTransmittance: editGlassTL,
                      irBlockingRate: editGlassIR,
                      uvBlockingRate: editGlassUV,
                      glassArea: editGlassArea,
                    }
                  };
                  setGlassVariantEdits(newEdits);
                  localStorage.setItem('glassVariantEdits', JSON.stringify(newEdits));
                  // 更新已选中的变体
                  if (selectedGlassVariant?.id === editingGlassVariant.id) {
                    setSelectedGlassVariant({ ...editingGlassVariant, ...newEdits[editingGlassVariant.id] });
                  }
                  setEditingGlassVariant(null);
                }}
              >保存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
