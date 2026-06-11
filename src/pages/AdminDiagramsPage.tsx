import { Link } from 'react-router-dom';

export default function AdminDiagramsPage() {
  const diagrams = [
    {
      id: 'interior',
      name: '内饰零部件示意图',
      type: '2D可编辑',
      parts: 18,
      lastUpdate: '刚刚',
      status: 'active',
      editUrl: '/editable-diagram?tab=interior',
    },
    {
      id: 'seat',
      name: '座椅零部件示意图',
      type: '2D可编辑',
      parts: 6,
      lastUpdate: '2分钟前',
      status: 'active',
      editUrl: '/editable-diagram?tab=seat',
    },
    {
      id: 'lights',
      name: '灯具零部件示意图',
      type: '2D可编辑',
      parts: 8,
      lastUpdate: '5分钟前',
      status: 'active',
      editUrl: '/editable-diagram?tab=lights',
    },
    {
      id: 'electronics',
      name: '智能电器示意图',
      type: '2D可编辑',
      parts: 10,
      lastUpdate: '10分钟前',
      status: 'active',
      editUrl: '/editable-diagram?tab=electronics',
    },
    {
      id: 'interior-3d',
      name: '3D内饰示意图',
      type: '3D可编辑',
      parts: 8,
      lastUpdate: '1小时前',
      status: 'active',
      editUrl: '/interior-3d',
    },
    {
      id: 'advanced',
      name: '高级示意图编辑器',
      type: '2D高级',
      parts: 4,
      lastUpdate: '今天',
      status: 'active',
      editUrl: '/advanced-diagram',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">示意图管理</h1>
        <p className="mt-2 text-gray-600">编辑和管理所有零部件示意图</p>
      </div>

      {/* 功能说明 */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>管理功能：</strong> 支持拖拽移动、缩放、旋转、颜色修改、添加/删除部件等完整编辑功能
            </p>
          </div>
        </div>
      </div>

      {/* 示意图列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagrams.map((diagram) => (
          <div
            key={diagram.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{diagram.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{diagram.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  diagram.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {diagram.status === 'active' ? '活跃' : '草稿'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {diagram.parts} 个部件
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  更新于 {diagram.lastUpdate}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to={diagram.editUrl}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors text-center"
                >
                  编辑
                </Link>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
                  预览
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 创建新示意图 */}
      <div className="mt-8">
        <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-sm font-medium">创建新示意图</p>
          <p className="text-xs text-gray-500 mt-1">支持2D/3D示意图</p>
        </button>
      </div>

      {/* 使用提示 */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">编辑器功能说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">2D编辑器</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• 拖拽移动部件位置</li>
              <li>• 调整部件大小和形状</li>
              <li>• 修改颜色和透明度</li>
              <li>• 添加/删除/复制部件</li>
              <li>• 撤销/重做操作</li>
              <li>• 导出PNG图片</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">3D编辑器</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• X/Y/Z三轴旋转</li>
              <li>• 3D空间移动</li>
              <li>• 缩放和尺寸调整</li>
              <li>• 深度排序渲染</li>
              <li>• 智能光照着色</li>
              <li>• 视角控制</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
