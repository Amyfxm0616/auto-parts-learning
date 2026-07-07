import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MaterialPerformanceData, MaterialProperty } from '../types/materialPerformance';
import { PROPERTY_CATEGORIES } from '../types/materialPerformance';
import { upsertCustomPerformance } from '../data/materialPerformance';

type ImportMode = 'form' | 'paste' | 'file';
type PropCategory = keyof typeof PROPERTY_CATEGORIES;

const EMPTY_PROP = {
  name: '', value: '', unit: '',
  category: 'mechanical' as PropCategory,
  importance: 'medium' as const,
  description: ''
};

/** 将表格行数组（每行为列数组）解析成 MaterialProperty[] */
function parseRows(rows: string[][]): MaterialProperty[] {
  const result: MaterialProperty[] = [];
  for (const row of rows) {
    const [name, value, unit, cat, desc] = row.map(c => (c ?? '').toString().trim());
    if (!name || !value) continue;
    // 自动识别分类
    let category: PropCategory = 'mechanical';
    const nameLower = name.toLowerCase();
    if (/热|温度|导热|比热|膨胀/.test(nameLower)) category = 'thermal';
    else if (/密度|吸水|透光|折射/.test(nameLower)) category = 'physical';
    else if (/耐|腐蚀|溶剂|酸碱/.test(nameLower)) category = 'chemical';
    else if (/加工|流动|收缩|注射|成型/.test(nameLower)) category = 'processing';
    if (cat && PROPERTY_CATEGORIES[cat as PropCategory]) category = cat as PropCategory;
    result.push({ name, value, unit: unit || '', category, importance: 'medium', description: desc || '' });
  }
  return result;
}

export default function MaterialDataImportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editMaterial = (location.state as any)?.editMaterial as MaterialPerformanceData | undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importMode, setImportMode] = useState<ImportMode>('form');
  const [editingMaterialId] = useState<string | undefined>(editMaterial?.materialId);
  const [materialName, setMaterialName] = useState(() => {
    if (!editMaterial) return '';
    // Strip "(EN)" suffix if present for the name field
    const match = editMaterial.materialName.match(/^(.+?) \(([^)]+)\)$/);
    return match ? match[1] : editMaterial.materialName;
  });
  const [materialNameEn, setMaterialNameEn] = useState(() => {
    if (!editMaterial) return '';
    const match = editMaterial.materialName.match(/^(.+?) \(([^)]+)\)$/);
    return match ? match[2] : '';
  });
  const [materialCategory, setMaterialCategory] = useState(editMaterial?.category ?? 'plastic');
  const [properties, setProperties] = useState<MaterialProperty[]>(editMaterial?.properties ?? []);
  const [newProp, setNewProp] = useState<MaterialProperty>({ ...EMPTY_PROP });
  const [pasteInput, setPasteInput] = useState('');
  const [fileStatus, setFileStatus] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  /* ── 表单：添加 / 编辑 ── */
  const commitProp = () => {
    if (!newProp.name || !newProp.value) return;
    if (editingIdx !== null) {
      const arr = [...properties];
      arr[editingIdx] = { ...newProp };
      setProperties(arr);
      setEditingIdx(null);
    } else {
      setProperties([...properties, { ...newProp }]);
    }
    setNewProp({ ...EMPTY_PROP });
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setNewProp({ ...properties[idx] });
    setImportMode('form');
  };

  const removeProp = (idx: number) => {
    setProperties(properties.filter((_, i) => i !== idx));
    if (editingIdx === idx) { setEditingIdx(null); setNewProp({ ...EMPTY_PROP }); }
  };

  /* ── 粘贴解析 ── */
  const parsePasted = () => {
    const rows = pasteInput.split('\n')
      .filter(l => l.trim())
      .map(l => l.split(/\t|,/));
    const parsed = parseRows(rows);
    if (parsed.length > 0) {
      setProperties(prev => [...prev, ...parsed]);
      setPasteInput('');
      setFileStatus(`已解析 ${parsed.length} 条`);
    } else {
      setFileStatus('未能解析，请检查格式');
    }
  };

  /* ── 文件上传解析 ── */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileStatus('解析中...');
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        // Excel / CSV
        const [{ read: xlsxRead, utils: xlsxUtils }] = await Promise.all([
          import('xlsx')
        ]);
        const buf = await file.arrayBuffer();
        const wb = xlsxRead(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw: string[][] = xlsxUtils.sheet_to_json(ws, { header: 1, defval: '' });
        // 跳过首行（表头）
        const dataRows = raw.length > 1 && isNaN(Number(raw[0][1])) ? raw.slice(1) : raw;
        const parsed = parseRows(dataRows);
        if (!materialName && wb.SheetNames[0] !== 'Sheet1') setMaterialName(wb.SheetNames[0]);
        setProperties(prev => [...prev, ...parsed]);
        setFileStatus(`Excel 解析成功：${parsed.length} 条性能数据`);
      } else if (ext === 'docx') {
        // Word
        const mammoth = await import('mammoth');
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        const lines = result.value.split('\n').filter(l => l.trim());
        const rows = lines.map(l => l.split(/\t|[\u3000\s]{2,}|,/));
        const parsed = parseRows(rows);
        setProperties(prev => [...prev, ...parsed]);
        setFileStatus(`Word 解析成功：${parsed.length} 条性能数据`);
      } else {
        setFileStatus('仅支持 .xlsx / .xls / .csv / .docx 格式');
      }
    } catch (err: any) {
      setFileStatus('解析失败：' + err.message);
    }
    // 清空 input 允许重复上传
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── 保存到数据库 ── */
  const handleSave = () => {
    if (!materialName || properties.length === 0) return;
    const data: MaterialPerformanceData = {
      materialId: editingMaterialId ?? `mat-custom-${Date.now()}`,
      materialName: materialNameEn ? `${materialName} (${materialNameEn})` : materialName,
      category: materialCategory,
      properties,
      performanceScore: { overall: 0, mechanical: 0, thermal: 0, processing: 0 }
    };
    upsertCustomPerformance(data);
    alert(`"${materialName}" 已保存到性能数据库！`);
    navigate('/materials/performance');
  };

  const catOptions = Object.entries(PROPERTY_CATEGORIES);

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">← 返回</button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{editingMaterialId ? '编辑材料性能数据' : '新增材料性能数据'}</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
        支持手动录入、粘贴表格，以及直接上传 Excel / Word 文件
      </p>

      {/* 基本信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-5">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">材料基本信息</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">材料名称 *</label>
            <input value={materialName} onChange={e => setMaterialName(e.target.value)}
              placeholder="例：聚丙烯"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">英文/简称（可选）</label>
            <input value={materialNameEn} onChange={e => setMaterialNameEn(e.target.value)}
              placeholder="例：PP"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">材料类别 *</label>
            <select value={materialCategory} onChange={e => setMaterialCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm">
              <option value="plastic">塑料</option>
              <option value="rubber">橡胶</option>
              <option value="metal">金属</option>
              <option value="composite">复合材料</option>
            </select>
          </div>
        </div>
      </div>

      {/* 导入方式 tab */}
      <div className="flex gap-2 mb-5">
        {([
          { key: 'form', label: '✏️ 手动录入' },
          { key: 'paste', label: '📋 粘贴表格' },
          { key: 'file', label: '📂 上传文件' },
        ] as const).map(tab => (
          <button key={tab.key} onClick={() => setImportMode(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              importMode === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 手动录入 */}
      {importMode === 'form' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
            {editingIdx !== null ? `编辑第 ${editingIdx + 1} 条` : '添加性能参数'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">性能名称 *</label>
              <input value={newProp.name} onChange={e => setNewProp({...newProp, name: e.target.value})}
                placeholder="如：拉伸强度"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">数值 *</label>
              <input value={newProp.value} onChange={e => setNewProp({...newProp, value: e.target.value})}
                placeholder="如：30-40"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">单位</label>
              <input value={newProp.unit} onChange={e => setNewProp({...newProp, unit: e.target.value})}
                placeholder="如：MPa"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">分类</label>
              <select value={newProp.category} onChange={e => setNewProp({...newProp, category: e.target.value as PropCategory})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm">
                {catOptions.map(([k, v]) => <option key={k} value={k}>{v.icon} {v.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">重要性</label>
              <select value={newProp.importance} onChange={e => setNewProp({...newProp, importance: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm">
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">说明（可选）</label>
              <input value={newProp.description} onChange={e => setNewProp({...newProp, description: e.target.value})}
                placeholder="参数说明"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={commitProp} disabled={!newProp.name || !newProp.value}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 text-sm">
              {editingIdx !== null ? '✔ 确认修改' : '➕ 添加'}
            </button>
            {editingIdx !== null && (
              <button onClick={() => { setEditingIdx(null); setNewProp({ ...EMPTY_PROP }); }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm">
                取消
              </button>
            )}
          </div>
        </div>
      )}

      {/* 粘贴表格 */}
      {importMode === 'paste' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">粘贴 Excel / Word 表格</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            每行格式：<code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">性能名称 [Tab] 数值 [Tab] 单位 [Tab] 分类(可选)</code>
          </p>
          <textarea value={pasteInput} onChange={e => setPasteInput(e.target.value)}
            rows={10} placeholder={"拉伸强度\t30-40\tMPa\n冲击强度\t2-6\tkJ/m²\n密度\t0.90\tg/cm³"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm mb-3" />
          <button onClick={parsePasted}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            🔄 解析并添加
          </button>
          {fileStatus && <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">{fileStatus}</span>}
        </div>
      )}

      {/* 文件上传 */}
      {importMode === 'file' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-5">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">上传 Excel / Word 文件</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            支持 <strong>.xlsx</strong>、<strong>.xls</strong>、<strong>.csv</strong>（Excel 格式）和 <strong>.docx</strong>（Word 格式）<br />
            Excel 表格第一列：性能名称，第二列：数值，第三列：单位，第四列：分类（可选）
          </p>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-3">📂</div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">点击选择文件，或将文件拖拽到此处</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">.xlsx / .xls / .csv / .docx</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.docx"
            className="hidden"
            onChange={handleFileUpload}
          />
          {fileStatus && (
            <div className={`mt-3 px-4 py-2 rounded-lg text-sm ${
              fileStatus.includes('成功') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
              fileStatus.includes('失败') || fileStatus.includes('仅支持') ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
              'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
            }`}>
              {fileStatus}
            </div>
          )}
        </div>
      )}

      {/* 已添加的性能参数列表 */}
      {properties.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">已录入性能参数 ({properties.length})</h2>
            <button onClick={() => setProperties([])} className="text-xs text-red-500 hover:text-red-700">清空全部</button>
          </div>
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {properties.map((prop, idx) => (
              <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                editingIdx === idx ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-300' : 'bg-gray-50 dark:bg-gray-700/50'
              }`}>
                <span className="text-xs text-gray-400 w-5 shrink-0">{idx + 1}</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white flex-1">{prop.name}</span>
                <span className="text-blue-600 dark:text-blue-400 text-sm">{prop.value}</span>
                {prop.unit && <span className="text-gray-500 text-xs">{prop.unit}</span>}
                <span className="text-xs text-gray-400 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">
                  {PROPERTY_CATEGORIES[prop.category as PropCategory]?.icon} {PROPERTY_CATEGORIES[prop.category as PropCategory]?.name}
                </span>
                <button onClick={() => startEdit(idx)} className="text-xs text-blue-600 hover:text-blue-800 px-2 py-0.5 rounded hover:bg-blue-50">编辑</button>
                <button onClick={() => removeProp(idx)} className="text-xs text-red-500 hover:text-red-700 px-2 py-0.5 rounded hover:bg-red-50">删除</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={!materialName || properties.length === 0}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          💾 保存到数据库
        </button>
        <button
          onClick={() => { setMaterialName(''); setMaterialNameEn(''); setProperties([]); setPasteInput(''); setFileStatus(''); setEditingIdx(null); setNewProp({ ...EMPTY_PROP }); }}
          className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          🔄 重置
        </button>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800">
          取消
        </button>
      </div>

      {/* 提示 */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-400">
        <p className="font-medium mb-1">💡 Excel/Word 格式建议</p>
        <ul className="list-disc list-inside space-y-0.5 text-xs">
          <li>第一列：性能名称（如：拉伸强度、密度）</li>
          <li>第二列：数值（如：30-40 或 35）</li>
          <li>第三列：单位（如：MPa、g/cm³）</li>
          <li>第四列（可选）：分类（mechanical / thermal / physical / chemical / processing）</li>
          <li>有表头行时系统会自动跳过</li>
        </ul>
      </div>
    </div>
  );
}
