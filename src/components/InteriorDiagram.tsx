import { useState } from 'react';
import { materials } from '../data/materials';

type Part = {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  subcategory?: string;
  materials: string[];
  description?: string;
  function?: string;
};

interface InteriorDiagramProps {
  parts: Part[];
  onPartClick: (part: Part) => void;
}

export default function InteriorDiagram({ parts, onPartClick }: InteriorDiagramProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // 按子专业分类内饰零部件
  const interiorParts = {
    dashboard: parts.filter(p => p.subcategory?.startsWith('内饰-仪表板')),
    door: parts.filter(p => p.subcategory?.startsWith('内饰-门板')),
    cnsl: parts.filter(p => p.subcategory?.startsWith('内饰-CNSL')),
    pillar: parts.filter(p => p.subcategory?.startsWith('内饰-立柱')),
    headliner: parts.filter(p => p.subcategory?.startsWith('内饰-顶棚')),
    carpet: parts.filter(p => p.subcategory?.startsWith('内饰-地毯')),
  };

  const handleAreaClick = (partType: keyof typeof interiorParts) => {
    const partsList = interiorParts[partType];
    if (partsList.length > 0) {
      setSelectedPart(partsList[0]);
    }
  };

  const getPartMaterials = (part: Part) => {
    return materials.filter(m => part.materials.includes(m.id));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">内饰零部件示意图</h2>
      <p className="text-sm text-gray-600 mb-6">点击图中的各个区域查看零部件用材信息</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG 示意图 */}
        <div className="lg:col-span-2">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-auto border-2 border-gray-300 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
          >
            {/* 汽车内饰侧视图 */}

            {/* 顶棚 */}
            <path
              d="M 100 50 Q 400 30 700 50 L 700 120 Q 400 100 100 120 Z"
              fill={hoveredPart === 'headliner' ? '#93c5fd' : '#e5e7eb'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('headliner')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('headliner')}
            />
            <text x="400" y="80" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              顶棚 ({interiorParts.headliner.length})
            </text>

            {/* 仪表板 */}
            <rect
              x="520"
              y="200"
              width="200"
              height="120"
              rx="10"
              fill={hoveredPart === 'dashboard' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('dashboard')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('dashboard')}
            />
            <text x="620" y="265" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              仪表板
            </text>
            <text x="620" y="285" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({interiorParts.dashboard.length}个部件)
            </text>

            {/* 中控CNSL */}
            <rect
              x="420"
              y="320"
              width="120"
              height="180"
              rx="8"
              fill={hoveredPart === 'cnsl' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('cnsl')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('cnsl')}
            />
            <text x="480" y="410" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              中控
            </text>
            <text x="480" y="430" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({interiorParts.cnsl.length})
            </text>

            {/* 左侧门板 */}
            <rect
              x="80"
              y="200"
              width="160"
              height="280"
              rx="10"
              fill={hoveredPart === 'door' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('door')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('door')}
            />
            <text x="160" y="340" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              门板
            </text>
            <text x="160" y="360" textAnchor="middle" className="fill-gray-600 text-xs pointer-events-none">
              ({interiorParts.door.length}个部件)
            </text>

            {/* 立柱 (A/B/C柱) */}
            <g>
              {/* A柱 */}
              <rect
                x="240"
                y="120"
                width="30"
                height="180"
                fill={hoveredPart === 'pillar' ? '#93c5fd' : '#d1d5db'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('pillar')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('pillar')}
              />
              {/* B柱 */}
              <rect
                x="390"
                y="120"
                width="25"
                height="200"
                fill={hoveredPart === 'pillar' ? '#93c5fd' : '#d1d5db'}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer transition-all hover:fill-blue-200"
                onMouseEnter={() => setHoveredPart('pillar')}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => handleAreaClick('pillar')}
              />
              <text x="320" y="210" textAnchor="middle" className="fill-gray-700 text-xs font-medium pointer-events-none">
                立柱({interiorParts.pillar.length})
              </text>
            </g>

            {/* 地毯 */}
            <ellipse
              cx="300"
              cy="530"
              rx="250"
              ry="50"
              fill={hoveredPart === 'carpet' ? '#93c5fd' : '#d1d5db'}
              stroke="#374151"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:fill-blue-200"
              onMouseEnter={() => setHoveredPart('carpet')}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => handleAreaClick('carpet')}
            />
            <text x="300" y="535" textAnchor="middle" className="fill-gray-700 text-sm font-medium pointer-events-none">
              地毯 ({interiorParts.carpet.length})
            </text>

            {/* 提示文字 */}
            <text x="400" y="580" textAnchor="middle" className="fill-gray-500 text-xs pointer-events-none">
              点击各区域查看零部件详情
            </text>
          </svg>

          {/* 图例 */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 border border-gray-400"></div>
              <span>未选中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 border border-gray-400"></div>
              <span>悬停/选中</span>
            </div>
          </div>
        </div>

        {/* 零部件材料信息面板 */}
        <div className="lg:col-span-1">
          {selectedPart ? (
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedPart.name}</h3>
              {selectedPart.nameEn && (
                <p className="text-sm text-gray-600 mb-3">{selectedPart.nameEn}</p>
              )}

              {selectedPart.description && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">零部件描述：</p>
                  <p className="text-sm text-gray-600">{selectedPart.description}</p>
                </div>
              )}

              {selectedPart.function && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-1">功能说明：</p>
                  <p className="text-sm text-gray-600">{selectedPart.function}</p>
                </div>
              )}

              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">使用材料：</p>
                <div className="space-y-2">
                  {getPartMaterials(selectedPart).map(material => (
                    <div key={material.id} className="bg-white rounded p-2 border border-blue-300">
                      <p className="font-medium text-sm text-gray-900">{material.name}</p>
                      {material.nameEn && (
                        <p className="text-xs text-gray-500">{material.nameEn}</p>
                      )}
                      {material.description && (
                        <p className="text-xs text-gray-600 mt-1">{material.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onPartClick(selectedPart)}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                查看完整详情
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 text-center">
              <p className="text-gray-500 text-sm">请点击左侧示意图中的任意区域</p>
              <p className="text-gray-400 text-xs mt-2">查看零部件的材料信息</p>
            </div>
          )}
        </div>
      </div>

      {/* 零部件列表 */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">所有内饰零部件</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries({
            '仪表板': interiorParts.dashboard,
            '门板': interiorParts.door,
            '中控': interiorParts.cnsl,
            '立柱': interiorParts.pillar,
            '顶棚': interiorParts.headliner,
            '地毯': interiorParts.carpet,
          }).map(([label, partsList]) => (
            <button
              key={label}
              onClick={() => partsList.length > 0 && setSelectedPart(partsList[0])}
              className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-sm"
            >
              <div className="font-medium text-gray-900">{label}</div>
              <div className="text-xs text-gray-500">{partsList.length} 个部件</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
