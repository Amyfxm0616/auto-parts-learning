// 在现有的 MaterialDetailPage.tsx 中添加橡胶材料的详细展示
// 这是一个补充文件，展示如何在详情页中显示橡胶性能数据

// 添加到 MaterialDetailPage.tsx 的渲染部分

// 1. 在文件顶部添加导入
import { RubberMaterialExtended, materialTypes } from '../types/rubber';
import { rubberMaterialsData } from '../data/rubberMaterials';

// 2. 在组件中添加橡胶材料判断
const isRubberMaterial = material?.category === 'rubber';
const rubberDetail = isRubberMaterial
  ? rubberMaterialsData.find(r => r.id === material.id || r.material === material.name)
  : null;

// 3. 在详情展示区域添加橡胶材料专用部分
// 在现有的properties展示后面添加：

{isRubberMaterial && rubberDetail && (
  <>
    {/* 温度范围卡片 */}
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">🌡️</span>
        工作温度范围
      </h3>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{rubberDetail.tempRange.min}℃</div>
          <div className="text-sm text-gray-600 mt-1">最低温度</div>
        </div>
        <div className="text-4xl text-gray-400">→</div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{rubberDetail.tempRange.max}℃</div>
          <div className="text-sm text-gray-600 mt-1">最高温度</div>
        </div>
      </div>
    </div>

    {/* 高温性能要求 */}
    {rubberDetail.performance && (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          高温性能要求
        </h3>

        <div className="space-y-4">
          {/* 热空气老化 */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-3">热空气老化</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">条件：</span>
                <span className="font-medium">{rubberDetail.performance.highTemp.aging}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">硬度变化：</span>
                <span className="font-medium">{rubberDetail.performance.highTemp.hardnessChange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">拉伸强度变化率：</span>
                <span className="font-medium">{rubberDetail.performance.highTemp.tensileChange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">伸长率变化率：</span>
                <span className="font-medium">{rubberDetail.performance.highTemp.elongationChange}</span>
              </div>
            </div>
          </div>

          {/* 压缩永久变形 */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-2">压缩永久变形</h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">要求：</span>
                <span className="font-medium">{rubberDetail.performance.highTemp.compression}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 低温性能要求 */}
    {rubberDetail.performance && (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">❄️</span>
          低温性能要求
        </h3>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600 mb-1">低温脆性不断裂</div>
              <div className="text-lg font-bold text-blue-600">
                {rubberDetail.performance.lowTemp.brittleness}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">低温回弹 TR10</div>
              <div className="text-lg font-bold text-blue-600">
                {rubberDetail.performance.lowTemp.tr10}
              </div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">低温硬度变化 (-30℃×6hr)</div>
              <div className="text-lg font-bold text-blue-600">
                {rubberDetail.performance.lowTemp.hardness}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 耐化学介质 */}
    {rubberDetail.chemicalResistance && (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          耐化学介质性能
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg border-2 ${
            rubberDetail.chemicalResistance.oil
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="text-3xl mb-2">
              {rubberDetail.chemicalResistance.oil ? '✅' : '❌'}
            </div>
            <div className="font-medium text-sm">耐油性</div>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            rubberDetail.chemicalResistance.fuel
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="text-3xl mb-2">
              {rubberDetail.chemicalResistance.fuel ? '✅' : '❌'}
            </div>
            <div className="font-medium text-sm">耐燃油</div>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            rubberDetail.chemicalResistance.coolant
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="text-3xl mb-2">
              {rubberDetail.chemicalResistance.coolant ? '✅' : '❌'}
            </div>
            <div className="font-medium text-sm">耐冷却液</div>
          </div>
          <div className={`text-center p-4 rounded-lg border-2 ${
            rubberDetail.chemicalResistance.water
              ? 'bg-green-50 border-green-300'
              : 'bg-gray-50 border-gray-300'
          }`}>
            <div className="text-3xl mb-2">
              {rubberDetail.chemicalResistance.water ? '✅' : '❌'}
            </div>
            <div className="font-medium text-sm">耐水/蒸汽</div>
          </div>
        </div>
      </div>
    )}

    {/* 参考标准 */}
    {rubberDetail.standards && rubberDetail.standards.length > 0 && (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          参考标准
        </h3>

        <div className="flex flex-wrap gap-2">
          {rubberDetail.standards.map((standard, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-300"
            >
              {standard}
            </span>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <div className="font-medium mb-2">标准说明：</div>
          <ul className="space-y-1 list-disc list-inside">
            <li>GB/T 7759 - 压缩永久变形测试方法</li>
            <li>HG/T 2196 - 热空气加速老化试验</li>
            <li>GB/T 1682 - 低温脆性测试方法</li>
          </ul>
        </div>
      </div>
    )}

    {/* 应用案例 */}
    {rubberDetail.applications && rubberDetail.applications.length > 0 && (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          典型应用
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rubberDetail.applications.map((app, index) => (
            <div
              key={index}
              className="bg-white px-4 py-3 rounded-lg border border-green-300 text-center text-sm font-medium text-gray-700 hover:shadow-md transition-all"
            >
              {app}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 材料类型说明 */}
    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-2xl">ℹ️</span>
        材料信息
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">材料代号：</span>
          <span className="font-bold text-blue-600 text-lg">{rubberDetail.material}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">材料全称：</span>
          <span className="font-medium text-gray-900">
            {materialTypes[rubberDetail.material as keyof typeof materialTypes] || rubberDetail.material}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">所属系统：</span>
          <span className="font-medium text-gray-900">
            {rubberDetail.system === 'thermal' && '热管理系统'}
            {rubberDetail.system === 'chassis' && '底盘系统'}
            {rubberDetail.system === 'cabin' && '座舱系统'}
            {rubberDetail.system === 'engine' && '增程系统'}
            {rubberDetail.system === 'body' && '车身系统'}
            {rubberDetail.system === 'power' && '动力驱动系统'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">零件类型：</span>
          <span className="font-medium text-gray-900">
            {rubberDetail.rubberType === 'seal' && '密封件'}
            {rubberDetail.rubberType === 'hose' && '管路类'}
            {rubberDetail.rubberType === 'bushing' && '衬套类'}
            {rubberDetail.rubberType === 'mount' && '悬置类'}
            {rubberDetail.rubberType === 'boot' && '护罩（套）类'}
            {rubberDetail.rubberType === 'weatherstrip' && '胶条'}
            {rubberDetail.rubberType === 'cushion' && '软垫类'}
            {rubberDetail.rubberType === 'other' && '其它'}
          </span>
        </div>
      </div>
    </div>
  </>
)}

// 4. 添加导出和分享功能（可选）
<div className="mt-8 flex gap-4">
  <button className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
    <span>📥</span>
    下载技术规格书
  </button>
  <button className="flex-1 px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
    <span>🔗</span>
    分享此材料
  </button>
</div>
