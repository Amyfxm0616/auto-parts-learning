// src/components/rubber/RubberTreeView.tsx
// 橡胶材料树状图视图

import React, { useState, useEffect, useRef } from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  materials: RubberMaterialExtended[];
  onMaterialSelect?: (material: RubberMaterialExtended) => void;
}

// 温度等级定义
interface TempLevel {
  id: string;
  name: string;
  range: string;
  color: string;
  selectedColor: string;
}

const tempLevels: TempLevel[] = [
  { id: 'temp6', name: 'temp6', range: '≥175℃', color: '#dc2626', selectedColor: '#b91c1c' },
  { id: 'temp5', name: 'temp5', range: '150-175℃', color: '#ea580c', selectedColor: '#c2410c' },
  { id: 'temp4', name: 'temp4', range: '125-150℃', color: '#ca8a04', selectedColor: '#a16207' },
  { id: 'temp3', name: 'temp3', range: '100-125℃', color: '#65a30d', selectedColor: '#4d7c0f' },
  { id: 'temp2', name: 'temp2', range: '70-100℃', color: '#0d9488', selectedColor: '#0f766e' },
  { id: 'temp1', name: 'temp1', range: '≤70℃', color: '#0ea5e9', selectedColor: '#0284c7' }
];

// 用途分类
const rubberTypes = {
  seal: '密封件',
  hose: '管路类',
  boot: '护罩（套）类',
  bushing: '衬套类',
  mount: '悬置类',
  weatherstrip: '胶条',
  cushion: '软垫类',
  other: '其它'
};

// 左侧分类（密封相关）
const leftTypes = ['seal', 'hose', 'boot'];

// 右侧分类（减振/支撑相关）
const rightTypes = ['bushing', 'mount', 'weatherstrip', 'cushion', 'other'];

const RubberTreeView: React.FC<Props> = ({ materials, onMaterialSelect }) => {
  const [selectedTempLevel, setSelectedTempLevel] = useState<string | null>(null);
  const [selectedRubberType, setSelectedRubberType] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // 树状图配置
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('rubberTreeConfig');
    return saved ? JSON.parse(saved) : {
      centerX: 400,
      topY: 50,
      bottomY: 620,
      levelY: [120, 220, 320, 420, 520],
      maxLeftWidth: 350,
      maxRightWidth: 350
    };
  });

  // 保存配置
  useEffect(() => {
    localStorage.setItem('rubberTreeConfig', JSON.stringify(config));
  }, [config]);

  // 按温度和用途分组材料
  const groupedMaterials = React.useMemo(() => {
    const groups: Record<string, Record<string, RubberMaterialExtended[]>> = {};

    materials.forEach(material => {
      if (!groups[material.tempLevel]) {
        groups[material.tempLevel] = {};
      }
      if (!groups[material.tempLevel][material.rubberType]) {
        groups[material.tempLevel][material.rubberType] = [];
      }
      groups[material.tempLevel][material.rubberType].push(material);
    });

    return groups;
  }, [materials]);

  // 计算分支位置
  const calculateBranchPositions = (tempLevel: string, rubberType: string) => {
    const levelIndex = tempLevels.findIndex(l => l.id === tempLevel);
    if (levelIndex === -1) return [];

    const materials = groupedMaterials[tempLevel]?.[rubberType] || [];
    if (materials.length === 0) return [];

    const isLeft = leftTypes.includes(rubberType as any);

    // 计算 Y 坐标（温度层）
    const y = levelIndex === 0
      ? config.topY
      : config.levelY[levelIndex - 1];

    // 计算 X 坐标（根据用途和材料数量）
    const levelWidth = 80 + materials.length * 15;
    const maxLevelWidth = isLeft ? config.maxLeftWidth : config.maxRightWidth;
    const actualWidth = Math.min(levelWidth, maxLevelWidth);

    const xPos = isLeft
      ? config.centerX - actualWidth
      : config.centerX + actualWidth;

    return materials.map((material, index) => {
      const x = xPos + (actualWidth / materials.length) * (index + 0.5);
      return { material, x, y };
    });
  };

  // 获取选中的材料
  const selectedMaterials = React.useMemo(() => {
    if (!selectedTempLevel || !selectedRubberType) return [];
    return groupedMaterials[selectedTempLevel]?.[selectedRubberType] || [];
  }, [selectedTempLevel, selectedRubberType, groupedMaterials]);

  // 重置配置
  const handleReset = () => {
    if (confirm('确定要重置树状图为默认布局吗？')) {
      setConfig({
        centerX: 400,
        topY: 50,
        bottomY: 620,
        levelY: [120, 220, 320, 420, 520],
        maxLeftWidth: 350,
        maxRightWidth: 350
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 树状图 */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {isEditing ? '拖动调整节点位置' : '橡胶材料温度树状图'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEditing ? '编辑模式中' : '点击树节点查看材料详情'}
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                重置布局
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                isEditing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isEditing ? '完成编辑' : '编辑布局'}
            </button>
          </div>
        </div>

        <svg ref={svgRef} viewBox="0 0 800 700" className="w-full h-auto">
          {/* 背景网格 */}
          <defs>
            <pattern id="treeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="800" height="700" fill="url(#treeGrid)" />

          {/* 温度标尺 */}
          <g>
            <line x1="30" y1={config.topY} x2="30" y2={config.bottomY} stroke="#9ca3af" strokeWidth="2" />
            {tempLevels.map((level, index) => {
              const y = index === 0 ? config.topY : config.levelY[index - 1];
              return (
                <g key={level.id}>
                  <line x1="25" y1={y} x2="35" y2={y} stroke="#9ca3af" strokeWidth="2" />
                  <text x="20" y={y + 4} className="text-xs fill-gray-600" textAnchor="end">
                    {level.range}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 主干 */}
          <line
            x1={config.centerX}
            y1={config.topY}
            x2={config.centerX}
            y2={config.bottomY}
            stroke="#4b5563"
            strokeWidth="4"
          />

          {/* 左右标签 */}
          <text x={config.centerX - 200} y={config.bottomY + 30} textAnchor="middle" className="text-sm font-bold fill-gray-700">
            🔒 密封/管路类
          </text>
          <text x={config.centerX + 200} y={config.bottomY + 30} textAnchor="middle" className="text-sm font-bold fill-gray-700">
            🛡️ 减振/支撑类
          </text>

          {/* 温度层和分支 */}
          {tempLevels.map((tempLevel, levelIndex) => {
            const y = levelIndex === 0 ? config.topY : config.levelY[levelIndex - 1];
            const level = groupedMaterials[tempLevel.id] || {};
            const leftCount = leftTypes.reduce((sum, type) => sum + (level[type]?.length || 0), 0);
            const rightCount = rightTypes.reduce((sum, type) => sum + (level[type]?.length || 0), 0);

            return (
              <g key={tempLevel.id}>
                {/* 左分支 */}
                {leftCount > 0 && (
                  <path
                    d={`M ${config.centerX} ${y} L ${config.centerX - 120} ${y}`}
                    stroke={selectedTempLevel === tempLevel.id ? tempLevel.selectedColor : '#6b7280'}
                    strokeWidth={selectedTempLevel === tempLevel.id ? 4 : 2}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => !isEditing && setSelectedTempLevel(tempLevel.id)}
                  />
                )}

                {/* 右分支 */}
                {rightCount > 0 && (
                  <path
                    d={`M ${config.centerX} ${y} L ${config.centerX + 120} ${y}`}
                    stroke={selectedTempLevel === tempLevel.id ? tempLevel.selectedColor : '#6b7280'}
                    strokeWidth={selectedTempLevel === tempLevel.id ? 4 : 2}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => !isEditing && setSelectedTempLevel(tempLevel.id)}
                  />
                )}

                {/* 左侧节点 */}
                {leftTypes.map(type => {
                  const typeMaterials = level[type] || [];
                  if (typeMaterials.length === 0) return null;

                  const positions = calculateBranchPositions(tempLevel.id, type);
                  return positions.map(({ material, x, y: nodeY }) => {
                    const isSelected = selectedTempLevel === tempLevel.id && selectedRubberType === type;
                    return (
                      <React.Fragment key={material.id}>
                        {/* 连接线 */}
                        <line
                          x1={config.centerX - 120}
                          y1={y}
                          x2={x}
                          y2={nodeY}
                          stroke={isSelected ? tempLevel.selectedColor : '#9ca3af'}
                          strokeWidth={isSelected ? 2 : 1}
                          strokeDasharray="4,2"
                        />
                        {/* 节点 */}
                        <circle
                          cx={x}
                          cy={nodeY}
                          r={isSelected ? 8 : 6}
                          fill={isSelected ? tempLevel.selectedColor : tempLevel.color}
                          stroke="white"
                          strokeWidth={2}
                          className={`cursor-pointer ${isEditing ? 'pointer-events-none' : 'hover:scale-110 transition-transform'}`}
                          onClick={() => !isEditing && setSelectedRubberType(type)}
                        />
                        {/* 材料标签 */}
                        <text
                          x={x}
                          y={nodeY - 10}
                          textAnchor="middle"
                          className="text-xs fill-gray-700 pointer-events-none font-medium"
                        >
                          {material.partName.length > 8
                            ? material.partName.substring(0, 8) + '...'
                            : material.partName}
                        </text>
                        <text
                          x={x}
                          y={nodeY + 18}
                          textAnchor="middle"
                          className="text-[10px] fill-gray-500 pointer-events-none"
                        >
                          {material.material}
                        </text>
                      </React.Fragment>
                    );
                  });
                })}

                {/* 右侧节点 */}
                {rightTypes.map(type => {
                  const typeMaterials = level[type] || [];
                  if (typeMaterials.length === 0) return null;

                  const positions = calculateBranchPositions(tempLevel.id, type);
                  return positions.map(({ material, x, y: nodeY }) => {
                    const isSelected = selectedTempLevel === tempLevel.id && selectedRubberType === type;
                    return (
                      <React.Fragment key={material.id}>
                        {/* 连接线 */}
                        <line
                          x1={config.centerX + 120}
                          y1={y}
                          x2={x}
                          y2={nodeY}
                          stroke={isSelected ? tempLevel.selectedColor : '#9ca3af'}
                          strokeWidth={isSelected ? 2 : 1}
                          strokeDasharray="4,2"
                        />
                        {/* 节点 */}
                        <circle
                          cx={x}
                          cy={nodeY}
                          r={isSelected ? 8 : 6}
                          fill={isSelected ? tempLevel.selectedColor : tempLevel.color}
                          stroke="white"
                          strokeWidth={2}
                          className={`cursor-pointer ${isEditing ? 'pointer-events-none' : 'hover:scale-110 transition-transform'}`}
                          onClick={() => !isEditing && setSelectedRubberType(type)}
                        />
                        {/* 材料标签 */}
                        <text
                          x={x}
                          y={nodeY - 10}
                          textAnchor="middle"
                          className="text-xs fill-gray-700 pointer-events-none font-medium"
                        >
                          {material.partName.length > 8
                            ? material.partName.substring(0, 8) + '...'
                            : material.partName}
                        </text>
                        <text
                          x={x}
                          y={nodeY + 18}
                          textAnchor="middle"
                          className="text-[10px] fill-gray-500 pointer-events-none"
                        >
                          {material.material}
                        </text>
                      </React.Fragment>
                    );
                  });
                })}

                {/* 温度层标签 */}
                <rect
                  x={config.centerX - 50}
                  y={y - 12}
                  width={100}
                  height={24}
                  rx={4}
                  fill={selectedTempLevel === tempLevel.id ? tempLevel.selectedColor : tempLevel.color}
                  className={isEditing ? 'pointer-events-none' : 'cursor-pointer hover:opacity-90 transition-all'}
                  onClick={() => {
                    if (!isEditing) {
                      setSelectedTempLevel(tempLevel.id);
                      setSelectedRubberType(null);
                    }
                  }}
                />
                <text
                  x={config.centerX}
                  y={y + 4}
                  textAnchor="middle"
                  className="text-sm font-bold fill-white pointer-events-none"
                >
                  {tempLevel.range}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 图例 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">按温度分类</h3>
            <div className="space-y-1">
              {tempLevels.map(level => (
                <div key={level.id} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: level.color }}></div>
                  <span className="text-xs">{level.range}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">按用途分类</h3>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300"></div>
                <span className="text-xs">🔒 左侧：密封/管路类</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
                <span className="text-xs">🛡️ 右侧：减振/支撑类</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 材料详情面板 */}
      <div className="lg:col-span-1">
        {selectedTempLevel && selectedRubberType ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {rubberTypes[selectedRubberType as keyof typeof rubberTypes]}
                </h3>
                <p className="text-sm text-gray-600">
                  {tempLevels.find(l => l.id === selectedTempLevel)?.range}
                  • {selectedMaterials.length} 种材料
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTempLevel(null);
                  setSelectedRubberType(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedMaterials.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedMaterials.map(material => (
                  <div
                    key={material.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                    onClick={() => onMaterialSelect?.(material)}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {material.partName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {material.material} • {material.tempRange.display}
                    </div>
                    {material.description && (
                      <div className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {material.description}
                      </div>
                    )}
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {material.chemicalResistance?.oil && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs">耐油</span>
                      )}
                      {material.chemicalResistance?.fuel && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">耐燃油</span>
                      )}
                      {material.chemicalResistance?.coolant && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">耐冷却液</span>
                      )}
                      {material.chemicalResistance?.water && (
                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">耐水</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">暂无材料</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              点击树状图节点
            </h3>
            <p className="text-sm text-gray-600">
              选择树状图中的节点<br/>
              查看该分类的材料列表
            </p>
            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <p>• 从上到下：耐温性能递减</p>
              <p>• 左侧：密封/管路类材料</p>
              <p>• 右侧：减振/支撑类材料</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RubberTreeView;