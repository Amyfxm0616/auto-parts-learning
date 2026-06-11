import { Link } from 'react-router-dom';
import { partSystems } from '../data/systems';
import { materials } from '../data/materials';
import { parts } from '../data/parts';

export default function Home() {
  const materialCategoryCount = new Set(materials.map((m) => m.category)).size;
  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          汽车及智能穿戴材料学习平台
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          探索汽车零部件与智能穿戴设备材料的奥秘，了解不同材料的特性及其工程应用
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          to="/parts"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🔧</div>
          <h3 className="text-lg font-semibold mb-2">零部件浏览</h3>
          <p className="text-gray-600 text-sm">
            按系统分类浏览汽车零部件，了解其功能和材料应用
          </p>
        </Link>

        <Link
          to="/materials"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">⚗️</div>
          <h3 className="text-lg font-semibold mb-2">材料数据库</h3>
          <p className="text-gray-600 text-sm">
            查看各类材料的详细属性和性能参数
          </p>
        </Link>

        <Link
          to="/quiz"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">练习测验</h3>
          <p className="text-gray-600 text-sm">
            通过练习题巩固所学知识，测试学习效果
          </p>
        </Link>

        <Link
          to="/notes"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold mb-2">学习笔记</h3>
          <p className="text-gray-600 text-sm">
            记录学习笔记，收藏重要内容
          </p>
        </Link>
      </div>

      {/* New Interactive Features - Highlighted Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-12 text-white">
        <h2 className="text-3xl font-bold mb-4">🎨 全新交互功能</h2>
        <p className="text-lg mb-6 opacity-90">
          体验可编辑的零部件示意图，实时拖拽、调整、编辑，创建自己的学习资料
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/editable-diagram"
            className="bg-white text-gray-900 p-6 rounded-lg shadow hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">✏️</div>
            <h3 className="text-xl font-semibold mb-2">基础版可编辑示意图</h3>
            <p className="text-sm text-gray-600 mb-3">
              支持4种专业：座椅、灯具、智能电子、内饰
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>✓ 拖拽移动图形</li>
              <li>✓ 调整大小和颜色</li>
              <li>✓ 编辑文本标签</li>
              <li>✓ 快速上手使用</li>
            </ul>
          </Link>

          <Link
            to="/advanced-diagram"
            className="bg-white text-gray-900 p-6 rounded-lg shadow hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-semibold mb-2">高级版示意图编辑器</h3>
            <p className="text-sm text-gray-600 mb-3">
              完整汽车系统示意图 + 专业级编辑功能
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>✓ 撤销/重做功能</li>
              <li>✓ 添加/复制/删除元素</li>
              <li>✓ 图层管理与透明度控制</li>
              <li>✓ 导出JSON数据</li>
            </ul>
          </Link>

          <Link
            to="/interior-3d"
            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-4 border-yellow-300"
          >
            <div className="text-4xl mb-3">🎮</div>
            <div className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full mb-2 font-bold">
              NEW
            </div>
            <h3 className="text-xl font-semibold mb-2">3D内饰交互编辑器</h3>
            <p className="text-sm mb-3">
              真实3D效果 + 全方位交互控制
            </p>
            <ul className="text-xs space-y-1">
              <li>✓ 真3D透视渲染</li>
              <li>✓ 拖拽+缩放+旋转</li>
              <li>✓ 视角自由调整</li>
              <li>✓ 沉浸式编辑体验</li>
            </ul>
          </Link>
        </div>
      </div>

      {/* Systems Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">汽车系统分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partSystems.map((system) => (
            <Link
              key={system.id}
              to={`/parts?system=${system.id}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{system.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{system.name}</h3>
                  <p className="text-sm text-gray-600">{system.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {system.parts.length} 个零部件
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{parts.length}</div>
          <div className="text-sm text-gray-600 mt-1">零部件</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{materialCategoryCount}</div>
          <div className="text-sm text-gray-600 mt-1">材料类型</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{partSystems.length}</div>
          <div className="text-sm text-gray-600 mt-1">系统分类</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{materials.length}</div>
          <div className="text-sm text-gray-600 mt-1">材料数据</div>
        </div>
      </div>
    </div>
  );
}
