import { Link, useParams, useNavigate } from 'react-router-dom';
import { materials } from '../data/materials';
import { smartElectronicsAssemblyData } from '../data/smartElectronicsAssembly';
import type { SmartElectronicsPart } from '../data/smartElectronicsAssembly';

function findSmartElectronicsPart(id: string): { part: SmartElectronicsPart; assemblyName: string; subAssemblyName: string } | null {
  for (const assembly of smartElectronicsAssemblyData) {
    for (const sub of assembly.subAssemblies) {
      const part = sub.parts.find(p => p.id === id);
      if (part) {
        return { part, assemblyName: assembly.name, subAssemblyName: sub.name };
      }
    }
  }
  return null;
}

export default function SmartElectronicsPartDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const result = id ? findSmartElectronicsPart(id) : null;

  if (!result) {
    return (
      <div className="px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到该智能电器零件</h2>
        <button onClick={() => navigate('/parts')} className="text-blue-600 hover:text-blue-700">
          返回零部件列表
        </button>
      </div>
    );
  }

  const { part, assemblyName, subAssemblyName } = result;

  const smartElectronicsPartEdits = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('smartElectronicsPartEdits') || '{}')
    : {};

  const customEdit = smartElectronicsPartEdits[id || ''];
  const materialName = customEdit?.material || part.material;
  const materialEntries = materials.filter(m =>
    materialName.split('/').some((mn: string) => m.name.includes(mn.trim()) || m.nameEn?.includes(mn.trim()))
  );

  const displayImage = customEdit?.imageUrl || part.imageUrl;
  const displayDescription = customEdit?.description || part.description;
  const displayFunction = customEdit?.function || part.function;
  const displayVehicleModels = customEdit?.vehicleModels || part.vehicleModels;
  const displayProcess = customEdit?.process || part.process;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link to="/" className="text-blue-600 hover:text-blue-700">首页</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link to="/parts" className="text-blue-600 hover:text-blue-700">零部件</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-500">智能电器</span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{part.name}</span>
      </nav>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{part.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">座舱系统</span>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">智能电器</span>
                <span className="text-gray-400">|</span>
                <span>{assemblyName}</span>
                <span className="text-gray-400">/</span>
                <span>{subAssemblyName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center overflow-hidden border-b border-gray-200">
          {displayImage ? (
            <img src={displayImage} alt={part.name} className="h-full w-full object-contain" />
          ) : (
            <div className="text-center">
              <span className="text-6xl block mb-3">⚙️</span>
              <p className="text-base text-gray-500">示意图（暂无图片）</p>
              <p className="text-sm text-gray-400 mt-1">{part.name} - {materialName}</p>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-6">
          {displayDescription && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-blue-600">📝</span> 零部件描述
              </h2>
              <p className="text-gray-700 leading-relaxed">{displayDescription}</p>
            </div>
          )}

          {displayFunction && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-green-600">⚙️</span> 功能说明
              </h2>
              <p className="text-gray-700 leading-relaxed">{displayFunction}</p>
            </div>
          )}

          {displayVehicleModels && displayVehicleModels.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-amber-600">🚗</span> 车型信息
              </h2>
              <div className="flex flex-wrap gap-2">
                {displayVehicleModels.map((model: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200 font-medium">
                    {model}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Material Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-green-600">🧪</span> 材料信息
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {materialName.split('/').map((m: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 font-medium">
                  {m.trim()}
                </span>
              ))}
            </div>
            {materialEntries.length > 0 && (
              <div className="space-y-2">
                {materialEntries.map(mat => (
                  <Link
                    key={mat.id}
                    to={`/materials/${mat.id}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{mat.name}</p>
                        {mat.nameEn && <p className="text-xs text-gray-500">{mat.nameEn}</p>}
                        {mat.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{mat.description}</p>}
                      </div>
                      <span className="text-blue-600 text-sm ml-3">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Process Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-purple-600">🔧</span> 工艺信息
            </h2>
            <div className="flex flex-wrap gap-2">
              {displayProcess.split('+').map((p: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-lg border border-purple-200">
                  {p.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => navigate('/parts')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← 返回零部件列表
          </button>
        </div>
      </div>
    </div>
  );
}
