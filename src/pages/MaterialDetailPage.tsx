import { Link, useParams } from 'react-router-dom';
import { materials } from '../data/materials';
import { parts } from '../data/parts';

type Material = typeof materials[number];

const categoryLabels: Record<Material['category'], string> = {
  metal: '金属',
  plastic: '塑料',
  composite: '复合材料',
  rubber: '橡胶',
  ceramic: '陶瓷',
  other: '其他',
};

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const material = materials.find((m) => m.id === id);

  if (!material) {
    return (
      <div className="px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到材料</h2>
        <Link to="/materials" className="text-blue-600 hover:text-blue-700">
          返回材料库
        </Link>
      </div>
    );
  }

  const usedInParts = parts.filter((p) => p.materials.includes(material.id));

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          首页
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/materials" className="text-blue-600 hover:text-blue-700">
          材料库
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{material.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {material.name}
            </h1>
            {material.nameEn && (
              <p className="text-xl text-gray-500 mb-3">{material.nameEn}</p>
            )}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              {categoryLabels[material.category]}
            </span>
          </div>

          {/* Description */}
          {material.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">材料描述</h2>
              <p className="text-gray-700 leading-relaxed">
                {material.description}
              </p>
            </div>
          )}

          {/* Properties */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">材料属性</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(material.properties).map(([key, value]) => {
                if (!value || key === 'other') return null;

                const labels: Record<string, string> = {
                  density: '密度',
                  tensileStrength: '抗拉强度',
                  yieldStrength: '屈服强度',
                  elasticModulus: '弹性模量',
                  meltingPoint: '熔点',
                  thermalConductivity: '热导率',
                  hardness: '硬度',
                  corrosionResistance: '耐腐蚀性',
                  cost: '成本',
                  recyclability: '可回收性',
                };

                return (
                  <div
                    key={key}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {labels[key] || key}
                    </span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advantages */}
          {material.advantages && material.advantages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">优点</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {material.advantages.map((adv, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disadvantages */}
          {material.disadvantages && material.disadvantages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">缺点</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {material.disadvantages.map((dis, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-red-500 mt-0.5">✗</span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Applications */}
          {material.applications && material.applications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">典型应用</h2>
              <div className="flex flex-wrap gap-2">
                {material.applications.map((app, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-purple-50 text-purple-700 text-sm rounded-lg"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Used In Parts */}
          {usedInParts.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                应用该材料的零部件 ({usedInParts.length})
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {usedInParts.map((part) => (
                  <Link
                    key={part.id}
                    to={`/parts/${part.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {part.name}
                          {part.primaryMaterial === material.id && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                              主要材料
                            </span>
                          )}
                        </h3>
                        <div className="flex gap-2 mt-1 mb-2">
                          <span className="text-xs text-gray-500">
                            {part.category}
                          </span>
                          {part.subcategory && (
                            <>
                              <span className="text-xs text-gray-400">·</span>
                              <span className="text-xs text-gray-500">
                                {part.subcategory}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {part.description}
                        </p>
                      </div>
                      <span className="ml-4 text-blue-600">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
