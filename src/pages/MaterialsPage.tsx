import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materials as initialMaterials } from '../data/materials';

type Material = typeof initialMaterials[number];

// 只显示非金属材料类别
const nonMetalCategories = ['plastic', 'rubber', 'elastomer', 'acoustic', 'composite', 'other'] as const;

const categoryLabels: Record<string, string> = {
  plastic: '塑料',
  rubber: '橡胶',
  elastomer: '弹性体',
  acoustic: '吸隔音材料',
  composite: '复合材料',
  other: '其他',
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('plastic');
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 加载材料数据
  useEffect(() => {
    const savedMaterials = localStorage.getItem('customMaterials');
    if (savedMaterials) {
      setMaterials(JSON.parse(savedMaterials));
    } else {
      setMaterials(initialMaterials);
    }
  }, []);

  const saveMaterials = (newMaterials: Material[]) => {
    setMaterials(newMaterials);
    localStorage.setItem('customMaterials', JSON.stringify(newMaterials));
  };

  // 过滤出非金属材料
  const nonMetalMaterials = materials.filter((m) =>
    nonMetalCategories.includes(m.category as any)
  );

  // 获取指定类别的材料，并应用搜索过滤
  const getMaterialsByCategory = (category: string) => {
    let filtered = nonMetalMaterials.filter((m) => m.category === category);

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.nameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getCategoryIcon = (category: Material['category']) => {
    const icons: Record<string, string> = {
      plastic: '🧪',
      rubber: '⚫',
      elastomer: '🔵',
      acoustic: '🔇',
      composite: '🔬',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  const handleCreate = (category: string) => {
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      name: '新材料',
      category: category as Material['category'],
      properties: {},
      description: '',
      applications: [],
      advantages: [],
      disadvantages: [],
    };
    setEditingMaterial(newMaterial);
    setIsCreating(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial({ ...material });
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!editingMaterial) return;

    if (isCreating) {
      saveMaterials([...materials, editingMaterial]);
    } else {
      saveMaterials(materials.map((m) => (m.id === editingMaterial.id ? editingMaterial : m)));
    }
    setEditingMaterial(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个材料吗？')) {
      saveMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingMaterial(null);
    setIsCreating(false);
  };

  const updateField = (field: keyof Material, value: any) => {
    if (editingMaterial) {
      setEditingMaterial({ ...editingMaterial, [field]: value });
    }
  };

  const updateProperty = (property: string, value: string) => {
    if (editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        properties: { ...editingMaterial.properties, [property]: value },
      });
    }
  };

  const updateArrayField = (field: 'applications' | 'advantages' | 'disadvantages', value: string) => {
    if (editingMaterial) {
      const items = value.split('\n').filter((item) => item.trim());
      setEditingMaterial({ ...editingMaterial, [field]: items });
    }
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">材料数据库</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="搜索材料名称..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
        <div className="flex border-b border-gray-200">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex-shrink-0 px-6 py-3 text-sm font-medium whitespace-nowrap ${
                selectedCategory === key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="mr-2">{getCategoryIcon(key as Material['category'])}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 编辑表单模态框 */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {isCreating ? '创建材料' : '编辑材料'}
              </h2>

              <div className="space-y-4">
                {/* 图片预览和编辑 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    材料图片
                  </label>
                  <div className="flex flex-col gap-3">
                    {editingMaterial.imageUrl && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={editingMaterial.imageUrl}
                          alt="预览"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingMaterial.imageUrl || ''}
                      onChange={(e) => updateField('imageUrl', e.target.value)}
                      placeholder="输入图片URL地址"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      材料名称 *
                    </label>
                    <input
                      type="text"
                      value={editingMaterial.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      英文名称
                    </label>
                    <input
                      type="text"
                      value={editingMaterial.nameEn || ''}
                      onChange={(e) => updateField('nameEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      材料类别 *
                    </label>
                    <select
                      value={editingMaterial.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <option key={key} value={key}>
                          {getCategoryIcon(key as Material['category'])} {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    材料描述
                  </label>
                  <textarea
                    value={editingMaterial.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 材料属性 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    材料属性
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="密度 (g/cm³)"
                      value={editingMaterial.properties.density || ''}
                      onChange={(e) => updateProperty('density', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="抗拉强度 (MPa)"
                      value={editingMaterial.properties.tensileStrength || ''}
                      onChange={(e) => updateProperty('tensileStrength', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="弹性模量 (GPa)"
                      value={editingMaterial.properties.elasticModulus || ''}
                      onChange={(e) => updateProperty('elasticModulus', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="熔点 (°C)"
                      value={editingMaterial.properties.meltingPoint || ''}
                      onChange={(e) => updateProperty('meltingPoint', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="热导率"
                      value={editingMaterial.properties.thermalConductivity || ''}
                      onChange={(e) => updateProperty('thermalConductivity', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="硬度"
                      value={editingMaterial.properties.hardness || ''}
                      onChange={(e) => updateProperty('hardness', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="耐腐蚀性"
                      value={editingMaterial.properties.corrosionResistance || ''}
                      onChange={(e) => updateProperty('corrosionResistance', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="成本"
                      value={editingMaterial.properties.cost || ''}
                      onChange={(e) => updateProperty('cost', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="可回收性"
                      value={editingMaterial.properties.recyclability || ''}
                      onChange={(e) => updateProperty('recyclability', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 应用场景 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    应用场景（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.applications || []).join('\n')}
                    onChange={(e) => updateArrayField('applications', e.target.value)}
                    rows={3}
                    placeholder="例如：保险杠&#10;内饰板&#10;仪表盘"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 优点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    优点（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.advantages || []).join('\n')}
                    onChange={(e) => updateArrayField('advantages', e.target.value)}
                    rows={2}
                    placeholder="例如：重量轻&#10;成本低"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 缺点 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缺点（每行一个）
                  </label>
                  <textarea
                    value={(editingMaterial.disadvantages || []).join('\n')}
                    onChange={(e) => updateArrayField('disadvantages', e.target.value)}
                    rows={2}
                    placeholder="例如：耐温性差&#10;易老化"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 报告链接 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    技术报告链接
                  </label>
                  <input
                    type="text"
                    value={editingMaterial.reportUrl || ''}
                    onChange={(e) => updateField('reportUrl', e.target.value)}
                    placeholder="输入技术报告或文档的URL链接"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    可以上传到云盘或文档平台后粘贴链接
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={!editingMaterial.name}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Content */}
      {Object.entries(categoryLabels).map(([category, label]) => {
        if (category !== selectedCategory) return null;

        const categoryMaterials = getMaterialsByCategory(category);

        return (
          <div key={category} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span>{getCategoryIcon(category as Material['category'])}</span>
                  <span>{label}</span>
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  共 {categoryMaterials.length} 种材料
                </p>
              </div>
              <button
                onClick={() => handleCreate(category)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + 添加材料
              </button>
            </div>

            {/* Materials Grid */}
            {categoryMaterials.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg mb-2">
                  {searchTerm ? '未找到匹配的材料' : '暂无材料'}
                </p>
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    清除搜索条件
                  </button>
                ) : (
                  <p className="text-sm">点击"添加材料"按钮创建第一个</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {categoryMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* 图片区域 */}
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      {material.imageUrl ? (
                        <img
                          src={material.imageUrl}
                          alt={material.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.innerHTML =
                              '<div class="w-full h-full flex items-center justify-center text-gray-400 text-sm">无图片</div>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                          {getCategoryIcon(material.category)}
                        </div>
                      )}
                    </div>

                    {/* 内容区域 */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {material.name}
                          </h3>
                          {material.nameEn && (
                            <p className="text-xs text-gray-500">{material.nameEn}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {categoryLabels[material.category]}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {material.description || '暂无描述'}
                      </p>

                      {/* Key Properties */}
                      {(material.properties.density || material.properties.tensileStrength || material.properties.cost) && (
                        <div className="border-t border-gray-200 pt-3 mb-3 space-y-1">
                          {material.properties.density && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">密度:</span>
                              <span className="text-gray-900 font-medium">
                                {material.properties.density} g/cm³
                              </span>
                            </div>
                          )}
                          {material.properties.tensileStrength && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">抗拉强度:</span>
                              <span className="text-gray-900 font-medium">
                                {material.properties.tensileStrength} MPa
                              </span>
                            </div>
                          )}
                          {material.properties.cost && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">成本:</span>
                              <span className="text-gray-900 font-medium">
                                {material.properties.cost}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Applications Preview */}
                      {material.applications && material.applications.length > 0 && (
                        <div className="mb-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">应用:</p>
                          <p className="text-xs text-gray-700">
                            {material.applications.slice(0, 2).join('、')}
                            {material.applications.length > 2 && '...'}
                          </p>
                        </div>
                      )}

                      {/* 报告链接 */}
                      {material.reportUrl && (
                        <div className="mb-3 pt-3 border-t border-gray-200">
                          <a
                            href={material.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <span>📄</span>
                            <span>查看技术报告</span>
                          </a>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Link
                          to={`/materials/${material.id}`}
                          className="flex-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-center"
                        >
                          详情
                        </Link>
                        <button
                          onClick={() => handleEdit(material)}
                          className="flex-1 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="flex-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
