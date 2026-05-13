import Interior3DDiagram from '../components/Interior3DDiagram';

export default function Interior3DPage() {
  const handleSave = (elements: any[]) => {
    console.log('保存的3D元素:', elements);
    alert('3D模型数据已保存到控制台！');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚗 3D内饰零部件交互示意图
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            体验全新的3D可视化编辑功能，实时调整汽车内饰零部件的位置、尺寸、旋转角度
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="font-semibold text-gray-900 mb-1">交互式3D</h3>
              <p className="text-sm text-gray-600">
                真实的3D透视效果，可调整视角和透视强度
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-1">全方位编辑</h3>
              <p className="text-sm text-gray-600">
                拖拽移动、尺寸调整、旋转控制、整体缩放
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-1">实时渲染</h3>
              <p className="text-sm text-gray-600">
                立即看到修改效果，支持多种3D图形类型
              </p>
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <h2 className="text-2xl font-bold mb-4">✨ 3D编辑功能亮点</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">🎯 基础编辑</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ <strong>拖拽移动</strong>：点击并拖动3D对象到新位置</li>
                <li>✓ <strong>尺寸调整</strong>：单独控制宽度、高度、深度三个维度</li>
                <li>✓ <strong>整体缩放</strong>：快速放大或缩小对象，保持比例</li>
                <li>✓ <strong>颜色更改</strong>：8种预设颜色+自定义颜色选择器</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">🌟 高级功能</h3>
              <ul className="space-y-2 text-sm">
                <li>✓ <strong>3D旋转</strong>：独立控制X、Y、Z三个轴的旋转角度</li>
                <li>✓ <strong>视角控制</strong>：调整俯视角度、旋转角度和透视强度</li>
                <li>✓ <strong>3D类型</strong>：支持立方体、圆柱体、面板三种类型</li>
                <li>✓ <strong>深度排序</strong>：自动计算遮挡关系，真实3D效果</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3D示意图组件 */}
        <Interior3DDiagram onSave={handleSave} />

        {/* 使用教程 */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📖 快速开始</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex-shrink-0">1</span>
                <div>
                  <strong>调整视角</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    使用顶部的视角控制滑块，找到最佳观察角度
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex-shrink-0">2</span>
                <div>
                  <strong>进入编辑模式</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    点击"进入编辑模式"按钮开始编辑
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex-shrink-0">3</span>
                <div>
                  <strong>选择3D对象</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    点击任意3D零部件，右侧显示详细控制面板
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex-shrink-0">4</span>
                <div>
                  <strong>编辑对象</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    拖拽移动位置、调整尺寸、旋转角度、更改颜色
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold mr-3 flex-shrink-0">5</span>
                <div>
                  <strong>保存修改</strong>
                  <p className="text-xs text-gray-600 mt-1">
                    完成后点击"保存更改"按钮保存你的设计
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 专业技巧</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="bg-blue-50 rounded p-3">
                <h4 className="font-semibold text-blue-900 mb-1">🎯 精确定位</h4>
                <p className="text-xs text-blue-800">
                  先调整视角到合适角度，再移动对象。拖拽时小幅度移动鼠标会更精确。
                </p>
              </div>
              <div className="bg-purple-50 rounded p-3">
                <h4 className="font-semibold text-purple-900 mb-1">🔄 旋转技巧</h4>
                <p className="text-xs text-purple-800">
                  X轴控制前后倾斜，Y轴控制左右旋转，Z轴控制平面旋转。组合使用创造独特角度。
                </p>
              </div>
              <div className="bg-green-50 rounded p-3">
                <h4 className="font-semibold text-green-900 mb-1">📏 尺寸vs缩放</h4>
                <p className="text-xs text-green-800">
                  尺寸调整可以单独改变宽高深度，缩放则保持比例整体放大缩小。
                </p>
              </div>
              <div className="bg-orange-50 rounded p-3">
                <h4 className="font-semibold text-orange-900 mb-1">🎨 视觉层次</h4>
                <p className="text-xs text-orange-800">
                  使用深色表示金属件，浅色表示塑料件，亮色表示功能件，创建清晰的视觉层次。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 技术特性 */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 技术特性</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-3xl mb-2">🎲</div>
              <h4 className="font-semibold text-gray-900 mb-1">真3D渲染</h4>
              <p className="text-xs text-gray-600">
                基于SVG的3D投影算法，支持透视变换
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-3xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900 mb-1">智能着色</h4>
              <p className="text-xs text-gray-600">
                自动计算面的亮度，模拟光照效果
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-3xl mb-2">📐</div>
              <h4 className="font-semibold text-gray-900 mb-1">深度排序</h4>
              <p className="text-xs text-gray-600">
                画家算法自动处理遮挡关系
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-semibold text-gray-900 mb-1">实时交互</h4>
              <p className="text-xs text-gray-600">
                即时响应，流畅的编辑体验
              </p>
            </div>
          </div>
        </div>

        {/* 内饰零部件说明 */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🪑 内饰零部件介绍</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">仪表板组件</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 仪表板 - 主要结构件</li>
                <li>• 方向盘 - 操控部件</li>
                <li>• 中控屏 - 显示设备</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">座椅系统</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 驾驶座 - 主驾驶位</li>
                <li>• 副驾座 - 副驾驶位</li>
                <li>• 中控台 - 中央扶手区</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">装饰面板</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 左门板 - 驾驶侧</li>
                <li>• 右门板 - 副驾侧</li>
                <li>• 中控屏 - 多媒体显示</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
