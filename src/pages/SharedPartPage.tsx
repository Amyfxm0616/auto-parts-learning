import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { materials } from '../data/materials';

export default function SharedPartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sharedPart, setSharedPart] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPart, setEditedPart] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 只显示非金属材料
  const nonMetalMaterials = materials.filter((m) =>
    m.category !== 'metal' && m.category !== 'ceramic'
  );

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (!data) {
        setError('无效的分享链接');
        return;
      }

      // 解码Base64数据
      const decoded = atob(data);
      const part = JSON.parse(decoded);
      setSharedPart(part);
      setEditedPart(part);
    } catch (err) {
      console.error('解析分享数据失败:', err);
      setError('分享链接已损坏或无效');
    }
  }, [searchParams]);

  const handleSaveToMyParts = () => {
    if (!editedPart) return;

    try {
      // 生成新的ID
      const newPart = {
        ...editedPart,
        id: `part-${Date.now()}`,
      };

      // 保存到本地localStorage
      const existingParts = JSON.parse(localStorage.getItem('customParts') || '[]');
      const updatedParts = [...existingParts, newPart];
      localStorage.setItem('customParts', JSON.stringify(updatedParts));

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/parts');
      }, 1500);
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请重试');
    }
  };

  const updateField = (field: string, value: any) => {
    if (editedPart) {
      setEditedPart({ ...editedPart, [field]: value });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">分享链接无效</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/parts')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回零部件列表
          </button>
        </div>
      </div>
    );
  }

  if (!sharedPart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载分享内容...</p>
        </div>
      </div>
    );
  }

  const partMaterials = materials.filter((m) => sharedPart.materials.includes(m.id));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🔗</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sharedPart.name}
                </h1>
                <p className="text-sm text-blue-600">有人分享了这个零部件给您</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/parts')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ✕ 关闭
            </button>
          </div>

          {saveSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              ✓ 已保存到您的零部件列表！正在跳转...
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isEditing ? (
            // 编辑模式
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">编辑零部件</h2>

              <div className="space-y-4">
                {/* 图片预览和编辑 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    零部件图片
                  </label>
                  <div className="flex flex-col gap-3">
                    {editedPart.imageUrl && (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={editedPart.imageUrl}
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
                      value={editedPart.imageUrl || ''}
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
                      零部件名称 *
                    </label>
                    <input
                      type="text"
                      value={editedPart.name}
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
                      value={editedPart.nameEn || ''}
                      onChange={(e) => updateField('nameEn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 使用材料 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    使用材料（仅非金属）*
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {nonMetalMaterials.map((material) => (
                      <label
                        key={material.id}
                        className="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={editedPart.materials.includes(material.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('materials', [...editedPart.materials, material.id]);
                            } else {
                              updateField('materials', editedPart.materials.filter((m: string) => m !== material.id));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{material.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 描述 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    零部件描述
                  </label>
                  <textarea
                    value={editedPart.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 功能说明 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    功能说明
                  </label>
                  <textarea
                    value={editedPart.function || ''}
                    onChange={(e) => updateField('function', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 技术报告链接 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    技术报告链接
                  </label>
                  <input
                    type="text"
                    value={editedPart.reportUrl || ''}
                    onChange={(e) => updateField('reportUrl', e.target.value)}
                    placeholder="输入技术报告URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveToMyParts}
                  disabled={!editedPart.name || editedPart.materials.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  💾 保存到我的零部件
                </button>
                <button
                  onClick={() => {
                    setEditedPart(sharedPart);
                    setIsEditing(false);
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  取消编辑
                </button>
              </div>
            </div>
          ) : (
            // 查看模式
            <div>
              {/* 图片 */}
              {sharedPart.imageUrl && (
                <div className="h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={sharedPart.imageUrl}
                    alt={sharedPart.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {sharedPart.name}
                  </h2>
                  {sharedPart.nameEn && (
                    <p className="text-gray-500">{sharedPart.nameEn}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">系统分类</h3>
                    <p className="text-gray-900">{sharedPart.category} - {sharedPart.subcategory}</p>
                  </div>

                  {sharedPart.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">描述</h3>
                      <p className="text-gray-900">{sharedPart.description}</p>
                    </div>
                  )}

                  {sharedPart.function && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">功能说明</h3>
                      <p className="text-gray-900">{sharedPart.function}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">使用材料</h3>
                    <div className="flex flex-wrap gap-2">
                      {partMaterials.map((m) => (
                        <span
                          key={m.id}
                          className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {sharedPart.reportUrl && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">技术报告</h3>
                      <a
                        href={sharedPart.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                      >
                        <span>📄</span>
                        <span>查看技术报告</span>
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    ✏️ 编辑并保存到我的零部件
                  </button>
                  <button
                    onClick={handleSaveToMyParts}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    💾 直接保存到我的零部件
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💡 提示：您可以编辑后保存到自己的零部件库，或直接保存原始版本</p>
        </div>
      </div>
    </div>
  );
}
