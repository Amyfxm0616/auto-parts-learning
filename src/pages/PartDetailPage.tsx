import { Link, useParams } from 'react-router-dom';
import { parts as initialParts } from '../data/parts';
import { materials } from '../data/materials';

export default function PartDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Read from localStorage (saved by PartsPage), fallback to static data
  const savedPartsRaw = typeof window !== 'undefined' ? localStorage.getItem('customParts') : null;
  const parts: typeof initialParts = savedPartsRaw ? JSON.parse(savedPartsRaw) as typeof initialParts : initialParts;

  const part = parts.find(p => p.id === id);

  if (!part) {
    return (
      <div className="px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到零部件</h2>
        <Link to="/parts" className="text-blue-600 hover:text-blue-700">
          返回零部件列表
        </Link>
      </div>
    );
  }

  const partMaterials = materials.filter((m) =>
    part.materials.includes(m.id)
  );

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-700">
          首页
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/parts" className="text-blue-600 hover:text-blue-700">
          零部件
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{part.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Image Section */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
          {part.imageUrl ? (
            <img src={part.imageUrl} alt={part.name} className="h-full w-full object-contain" />
          ) : (
            <span className="text-8xl">🔧</span>
          )}
        </div>

        {/* Content Section */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {part.name}
            </h1>
            {part.nameEn && (
              <p className="text-xl text-gray-500">{part.nameEn}</p>
            )}
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {part.category}
              </span>
              {part.subcategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                  {part.subcategory}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {part.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">零部件描述</h2>
              <p className="text-gray-700 leading-relaxed">{part.description}</p>
            </div>
          )}

          {/* Function */}
          {part.function && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">功能</h2>
              <p className="text-gray-700 leading-relaxed">{part.function}</p>
            </div>
          )}

          {/* Working Conditions */}
          {part.workingConditions && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">工作条件</h2>
              <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {part.workingConditions.temperature && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      温度：
                    </span>
                    <span className="text-sm text-gray-900">
                      {part.workingConditions.temperature}
                    </span>
                  </div>
                )}
                {part.workingConditions.pressure && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      压力：
                    </span>
                    <span className="text-sm text-gray-900">
                      {part.workingConditions.pressure}
                    </span>
                  </div>
                )}
                {part.workingConditions.load && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      载荷：
                    </span>
                    <span className="text-sm text-gray-900">
                      {part.workingConditions.load}
                    </span>
                  </div>
                )}
                {part.workingConditions.environment && (
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      环境：
                    </span>
                    <span className="text-sm text-gray-900">
                      {part.workingConditions.environment}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Materials Used */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">使用材料</h2>
            <div className="grid grid-cols-1 gap-4">
              {partMaterials.map((material) => (
                <Link
                  key={material.id}
                  to={`/materials/${material.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {material.name}
                        {material.id === part.primaryMaterial && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                            主要材料
                          </span>
                        )}
                      </h3>
                      {material.nameEn && (
                        <p className="text-sm text-gray-500 mb-2">
                          {material.nameEn}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {material.description}
                      </p>
                    </div>
                    <span className="ml-4 text-blue-600">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Manufacturing Process */}
          {part.manufacturingProcess && part.manufacturingProcess.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">制造工艺</h2>
              <div className="flex flex-wrap gap-2">
                {part.manufacturingProcess.map((process, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-purple-50 text-purple-700 text-sm rounded-lg"
                  >
                    {index + 1}. {process}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
