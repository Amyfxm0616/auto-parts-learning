// src/components/rubber/RubberCompareModal.tsx
import React from 'react';
import type { RubberMaterialExtended } from '../../types/rubber';

interface Props {
  materials: RubberMaterialExtended[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const RubberCompareModal: React.FC<Props> = ({ materials, onClose, onRemove, onClear }) => {
  if (materials.length === 0) {
    return null;
  }

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
        className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>⚖️</span>
              材料性能对比
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              对比 {materials.length} 个材料的详细性能参数
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
          >
            ×
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700 min-w-[150px]">
                    对比项
                  </th>
                  {materials.map(material => (
                    <th key={material.id} className="border border-gray-200 px-4 py-3 min-w-[200px]">
                      <div className="text-center">
                        <div className="font-bold text-gray-900 mb-2 text-base">{material.partName}</div>
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          {material.material}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{material.tempRange.display}</div>
                        <button
                          onClick={() => onRemove(material.id)}
                          className="text-xs text-red-600 hover:text-red-800 hover:underline transition-all"
                        >
                          移除
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 基础信息 */}
                <tr className="bg-blue-50">
                  <td colSpan={materials.length + 1} className="border border-gray-200 px-4 py-2 font-semibold text-gray-900">
                    📋 基础信息
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">所属系统</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-3 text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm">
                        {systemNames[m.system]}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">零件类型</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-3 text-center">
                      {rubberTypeNames[m.rubberType]}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">工作温度范围</td>
                  {materials.map(m => (
                    <td key={m.id} className="border border-gray-200 px-4 py-3 text-center font-medium">
                      {m.tempRange.display}
                    </td>
                  ))}
                </tr>

                {/* 高温性能 */}
                {materials[0]?.performance && (
                  <>
                    <tr className="bg-orange-50">
                      <td colSpan={materials.length + 1} className="border border-gray-200 px-4 py-2 font-semibold text-gray-900">
                        🔥 高温性能要求
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">热空气老化条件</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.highTemp.aging || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">硬度变化</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.highTemp.hardnessChange || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">拉伸强度变化率</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.highTemp.tensileChange || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">伸长率变化率</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.highTemp.elongationChange || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">压缩永久变形</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.highTemp.compression || '-'}
                        </td>
                      ))}
                    </tr>

                    {/* 低温性能 */}
                    <tr className="bg-blue-50">
                      <td colSpan={materials.length + 1} className="border border-gray-200 px-4 py-2 font-semibold text-gray-900">
                        ❄️ 低温性能要求
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">低温脆性不断裂</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm font-medium">
                          {m.performance?.lowTemp.brittleness || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">低温回弹 TR10</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.lowTemp.tr10 || '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">低温硬度变化</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-sm">
                          {m.performance?.lowTemp.hardness || '-'}
                        </td>
                      ))}
                    </tr>
                  </>
                )}

                {/* 耐化学介质 */}
                {materials[0]?.chemicalResistance && (
                  <>
                    <tr className="bg-green-50">
                      <td colSpan={materials.length + 1} className="border border-gray-200 px-4 py-2 font-semibold text-gray-900">
                        🧪 耐化学介质性能
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">耐油性</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-2xl">
                          {m.chemicalResistance?.oil ? '✅' : '❌'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">耐燃油</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-2xl">
                          {m.chemicalResistance?.fuel ? '✅' : '❌'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">耐冷却液</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-2xl">
                          {m.chemicalResistance?.coolant ? '✅' : '❌'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">耐水/蒸汽</td>
                      {materials.map(m => (
                        <td key={m.id} className="border border-gray-200 px-4 py-3 text-center text-2xl">
                          {m.chemicalResistance?.water ? '✅' : '❌'}
                        </td>
                      ))}
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex gap-3 justify-between bg-gray-50">
          <button
            onClick={onClear}
            className="px-6 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            🗑️ 清空列表
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all font-medium"
            >
              🖨️ 打印
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium shadow-sm"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RubberCompareModal;
