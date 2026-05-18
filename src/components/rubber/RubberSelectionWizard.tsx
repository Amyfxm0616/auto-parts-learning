// src/components/rubber/RubberSelectionWizard.tsx
import React, { useState } from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  onClose: () => void;
  onRecommend: (materials: RubberMaterialExtended[]) => void;
  allMaterials: RubberMaterialExtended[];
}

const RubberSelectionWizard: React.FC<Props> = ({ onClose, onRecommend, allMaterials }) => {
  const [answers, setAnswers] = useState({
    system: '',
    maxTemp: '',
    minTemp: '',
    rubberType: '',
    needOilResistance: false,
    needFuelResistance: false
  });
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<RubberMaterialExtended[]>([]);

  const handleSubmit = () => {
    // 简单的推荐逻辑
    let recommended = [...allMaterials];

    // 按系统筛选
    if (answers.system) {
      recommended = recommended.filter(m => m.system === answers.system);
    }

    // 按最高温度筛选
    if (answers.maxTemp) {
      const maxTemp = parseInt(answers.maxTemp);
      recommended = recommended.filter(m => m.tempRange.max >= maxTemp);
    }

    // 按最低温度筛选
    if (answers.minTemp) {
      const minTemp = parseInt(answers.minTemp);
      recommended = recommended.filter(m => m.tempRange.min <= minTemp);
    }

    // 按零件类型筛选
    if (answers.rubberType) {
      recommended = recommended.filter(m => m.rubberType === answers.rubberType);
    }

    // 按耐油性筛选
    if (answers.needOilResistance) {
      recommended = recommended.filter(m => m.chemicalResistance?.oil);
    }

    // 按耐燃油筛选
    if (answers.needFuelResistance) {
      recommended = recommended.filter(m => m.chemicalResistance?.fuel);
    }

    // 按温度范围排序（优先推荐温度范围更宽的）
    recommended.sort((a, b) => {
      const rangeA = a.tempRange.max - a.tempRange.min;
      const rangeB = b.tempRange.max - b.tempRange.min;
      return rangeB - rangeA;
    });

    setRecommendations(recommended.slice(0, 5));
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({
      system: '',
      maxTemp: '',
      minTemp: '',
      rubberType: '',
      needOilResistance: false,
      needFuelResistance: false
    });
    setShowResults(false);
    setRecommendations([]);
  };

  const handleUseRecommendation = (material: RubberMaterialExtended) => {
    onRecommend([material]);
  };

  const systemNames: Record<string, string> = {
    thermal: '热管理系统',
    chassis: '底盘系统',
    cabin: '座舱系统',
    engine: '增程系统',
    body: '车身系统',
    power: '动力驱动系统'
  };

  const rubberTypeNames: Record<string, string> = {
    seal: '密封件',
    hose: '管路类',
    bushing: '衬套类',
    mount: '悬置类',
    boot: '护罩（套）类',
    weatherstrip: '胶条',
    cushion: '软垫类',
    other: '其它'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>🧙</span>
                智能选材助手
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                根据您的需求，智能推荐最适合的橡胶材料
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-6">
          {!showResults ? (
            <div className="space-y-6">
              {/* 系统选择 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  1. 零件所属系统？
                </label>
                <select
                  value={answers.system}
                  onChange={(e) => setAnswers({ ...answers, system: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">请选择系统...</option>
                  <option value="thermal">🌡️ 热管理系统</option>
                  <option value="chassis">🚗 底盘系统</option>
                  <option value="cabin">🪟 座舱系统</option>
                  <option value="engine">⚙️ 增程系统</option>
                  <option value="body">🚙 车身系统</option>
                  <option value="power">⚡ 动力驱动系统</option>
                </select>
              </div>

              {/* 温度要求 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    2. 最高工作温度（℃）？
                  </label>
                  <input
                    type="number"
                    value={answers.maxTemp}
                    onChange={(e) => setAnswers({ ...answers, maxTemp: e.target.value })}
                    placeholder="例如：150"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    3. 最低工作温度（℃）？
                  </label>
                  <input
                    type="number"
                    value={answers.minTemp}
                    onChange={(e) => setAnswers({ ...answers, minTemp: e.target.value })}
                    placeholder="例如：-40"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 零件类型 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  4. 零件类型？
                </label>
                <select
                  value={answers.rubberType}
                  onChange={(e) => setAnswers({ ...answers, rubberType: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">请选择零件类型...</option>
                  <option value="seal">密封件</option>
                  <option value="hose">管路类</option>
                  <option value="bushing">衬套类</option>
                  <option value="mount">悬置类</option>
                  <option value="boot">护罩（套）类</option>
                  <option value="weatherstrip">胶条</option>
                  <option value="cushion">软垫类</option>
                  <option value="other">其它</option>
                </select>
              </div>

              {/* 化学介质要求 */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  5. 耐化学介质要求？
                </label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all">
                    <input
                      type="checkbox"
                      checked={answers.needOilResistance}
                      onChange={(e) => setAnswers({ ...answers, needOilResistance: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">需要耐油性能</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all">
                    <input
                      type="checkbox"
                      checked={answers.needFuelResistance}
                      onChange={(e) => setAnswers({ ...answers, needFuelResistance: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">需要耐燃油性能</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {recommendations.length > 0 ? (
                <div>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <span className="text-2xl">✅</span>
                      <span>找到 {recommendations.length} 个符合条件的材料</span>
                    </div>
                    <p className="text-sm text-green-700">
                      以下材料已按适用性排序，点击"应用此材料"可直接筛选
                    </p>
                  </div>

                  <div className="space-y-4">
                    {recommendations.map((material, index) => (
                      <div
                        key={material.id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-400 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-lg">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{material.partName}</h4>
                              <p className="text-sm text-gray-600">{material.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-gray-600">材料：</span>
                            <span className="font-semibold text-blue-700">{material.material}</span>
                          </div>
                          <div className="bg-orange-50 p-2 rounded">
                            <span className="text-gray-600">温度：</span>
                            <span className="font-semibold text-orange-700">{material.tempRange.display}</span>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <span className="text-gray-600">系统：</span>
                            <span className="font-semibold text-green-700">{systemNames[material.system]}</span>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <span className="text-gray-600">类型：</span>
                            <span className="font-semibold text-purple-700">{rubberTypeNames[material.rubberType]}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUseRecommendation(material)}
                          className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-medium"
                        >
                          应用此材料
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😞</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">未找到符合条件的材料</h3>
                  <p className="text-gray-600 mb-6">
                    请调整筛选条件后重试，或放宽温度范围要求
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    重新选择
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        {!showResults && (
          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
            <button
              onClick={handleReset}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
            >
              重置
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-sm"
            >
              获取推荐方案
            </button>
          </div>
        )}

        {showResults && recommendations.length > 0 && (
          <div className="p-6 border-t border-gray-200 flex gap-3 justify-between bg-gray-50">
            <button
              onClick={handleReset}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium"
            >
              ← 返回重新选择
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
            >
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RubberSelectionWizard;
