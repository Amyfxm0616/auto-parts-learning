import { Link } from 'react-router-dom';
import { partSystems } from '../data/systems';

export default function Home() {
  return (
    <div className="px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          汽车零部件材料学习平台
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          探索汽车零部件与材料的奥秘，了解不同材料的特性及其在汽车工程中的应用
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
          <div className="text-3xl font-bold text-blue-600">10</div>
          <div className="text-sm text-gray-600 mt-1">零部件</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">8</div>
          <div className="text-sm text-gray-600 mt-1">材料类型</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">5</div>
          <div className="text-sm text-gray-600 mt-1">系统分类</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">∞</div>
          <div className="text-sm text-gray-600 mt-1">学习机会</div>
        </div>
      </div>
    </div>
  );
}
