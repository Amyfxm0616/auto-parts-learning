import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">管理控制台</h1>
        <p className="mt-2 text-gray-600">欢迎使用汽车及智能穿戴材料学习平台管理端</p>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-80">零部件总数</div>
          <div className="text-3xl font-bold mt-2">125</div>
          <div className="text-xs mt-2 opacity-70">覆盖5大系统</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-80">材料种类</div>
          <div className="text-3xl font-bold mt-2">48</div>
          <div className="text-xs mt-2 opacity-70">金属、塑料等</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-80">示意图数量</div>
          <div className="text-3xl font-bold mt-2">8</div>
          <div className="text-xs mt-2 opacity-70">包含3D版本</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="text-sm font-medium opacity-80">用户数量</div>
          <div className="text-3xl font-bold mt-2">156</div>
          <div className="text-xs mt-2 opacity-70">活跃用户</div>
        </div>
      </div>

      {/* 管理功能卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/parts"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">零部件管理</h3>
          </div>
          <p className="text-gray-600 text-sm">添加、编辑、删除零部件信息</p>
          <div className="mt-4 text-blue-600 text-sm font-medium">管理 →</div>
        </Link>

        <Link
          to="/admin/materials"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-green-500"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">材料管理</h3>
          </div>
          <p className="text-gray-600 text-sm">管理材料库，编辑材料属性</p>
          <div className="mt-4 text-green-600 text-sm font-medium">管理 →</div>
        </Link>

        <Link
          to="/admin/diagrams"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-purple-500"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">示意图编辑</h3>
          </div>
          <p className="text-gray-600 text-sm">编辑2D/3D示意图布局</p>
          <div className="mt-4 text-purple-600 text-sm font-medium">编辑 →</div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-2 border-transparent hover:border-orange-500"
        >
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">用户管理</h3>
          </div>
          <p className="text-gray-600 text-sm">管理用户账号和权限</p>
          <div className="mt-4 text-orange-600 text-sm font-medium">管理 →</div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center mb-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">数据统计</h3>
          </div>
          <p className="text-gray-600 text-sm">即将推出</p>
          <div className="mt-4 text-gray-400 text-sm font-medium">敬请期待</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300">
          <div className="flex items-center mb-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">系统设置</h3>
          </div>
          <p className="text-gray-600 text-sm">即将推出</p>
          <div className="mt-4 text-gray-400 text-sm font-medium">敬请期待</div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">新增了座椅零部件的缩放功能</p>
              <p className="text-gray-500 text-xs">2分钟前</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">更新了灯具零部件示意图</p>
              <p className="text-gray-500 text-xs">5分钟前</p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="bg-purple-100 rounded-full p-2 mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">15位新用户注册</p>
              <p className="text-gray-500 text-xs">今天</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
