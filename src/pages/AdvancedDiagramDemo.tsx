import { useState } from 'react';
import AdvancedEditableDiagram from '../components/AdvancedEditableDiagram';

export default function AdvancedDiagramDemo() {
  // 汽车系统综合示意图
  const [carSystemElements] = useState([
    // 车身外观
    {
      id: 'car-body',
      type: 'path' as const,
      x: 400,
      y: 300,
      fill: '#e5e7eb',
      stroke: '#374151',
      strokeWidth: 3,
      text: '车身',
      textX: 400,
      textY: 305,
      d: 'M 150 250 L 200 200 L 300 180 L 500 180 L 600 200 L 650 250 L 650 350 L 600 400 L 200 400 L 150 350 Z',
      opacity: 0.5,
    },
    // 前大灯
    {
      id: 'headlight-left',
      type: 'ellipse' as const,
      x: 620,
      y: 280,
      rx: 40,
      ry: 30,
      fill: '#fef3c7',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前灯',
      textX: 620,
      textY: 285,
      opacity: 1,
    },
    // 尾灯
    {
      id: 'taillight-left',
      type: 'rect' as const,
      x: 160,
      y: 260,
      width: 30,
      height: 50,
      rx: 5,
      fill: '#fca5a5',
      stroke: '#374151',
      strokeWidth: 2,
      text: '尾灯',
      textX: 175,
      textY: 290,
      opacity: 1,
    },
    // 前轮
    {
      id: 'wheel-front',
      type: 'circle' as const,
      x: 580,
      y: 420,
      radius: 35,
      fill: '#374151',
      stroke: '#1f2937',
      strokeWidth: 3,
      text: '前轮',
      textX: 580,
      textY: 425,
      opacity: 1,
    },
    // 后轮
    {
      id: 'wheel-rear',
      type: 'circle' as const,
      x: 220,
      y: 420,
      radius: 35,
      fill: '#374151',
      stroke: '#1f2937',
      strokeWidth: 3,
      text: '后轮',
      textX: 220,
      textY: 425,
      opacity: 1,
    },
    // 挡风玻璃
    {
      id: 'windshield',
      type: 'rect' as const,
      x: 450,
      y: 200,
      width: 120,
      height: 60,
      rx: 10,
      fill: '#93c5fd',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前挡',
      textX: 510,
      textY: 235,
      opacity: 0.6,
    },
    // 后挡风玻璃
    {
      id: 'rear-window',
      type: 'rect' as const,
      x: 230,
      y: 210,
      width: 90,
      height: 50,
      rx: 8,
      fill: '#93c5fd',
      stroke: '#374151',
      strokeWidth: 2,
      text: '后挡',
      textX: 275,
      textY: 240,
      opacity: 0.6,
    },
    // 车门
    {
      id: 'door-front',
      type: 'rect' as const,
      x: 450,
      y: 280,
      width: 80,
      height: 100,
      rx: 5,
      fill: '#d1d5db',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前门',
      textX: 490,
      textY: 335,
      opacity: 0.8,
    },
    {
      id: 'door-rear',
      type: 'rect' as const,
      x: 320,
      y: 280,
      width: 80,
      height: 100,
      rx: 5,
      fill: '#d1d5db',
      stroke: '#374151',
      strokeWidth: 2,
      text: '后门',
      textX: 360,
      textY: 335,
      opacity: 0.8,
    },
    // 座椅
    {
      id: 'seat-driver',
      type: 'rect' as const,
      x: 480,
      y: 300,
      width: 50,
      height: 60,
      rx: 8,
      fill: '#6366f1',
      stroke: '#374151',
      strokeWidth: 2,
      text: '驾驶座',
      textX: 505,
      textY: 335,
      opacity: 1,
    },
    {
      id: 'seat-passenger',
      type: 'rect' as const,
      x: 350,
      y: 300,
      width: 50,
      height: 60,
      rx: 8,
      fill: '#6366f1',
      stroke: '#374151',
      strokeWidth: 2,
      text: '副驾',
      textX: 375,
      textY: 335,
      opacity: 1,
    },
    // 中控显示屏
    {
      id: 'center-screen',
      type: 'rect' as const,
      x: 410,
      y: 260,
      width: 60,
      height: 40,
      rx: 5,
      fill: '#1e3a8a',
      stroke: '#374151',
      strokeWidth: 2,
      text: '中控屏',
      textX: 440,
      textY: 285,
      opacity: 1,
    },
    // 方向盘
    {
      id: 'steering-wheel',
      type: 'circle' as const,
      x: 520,
      y: 270,
      radius: 20,
      fill: '#374151',
      stroke: '#1f2937',
      strokeWidth: 2,
      text: '方向盘',
      textX: 520,
      textY: 250,
      opacity: 1,
    },
  ]);

  const handleSave = (elements: any[]) => {
    console.log('保存的元素:', elements);
    alert('更改已保存到控制台！查看完整数据请打开浏览器开发者工具。');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">高级可编辑示意图 - 完整汽车系统</h1>
          <div className="space-y-3 text-gray-600">
            <p className="text-lg">🎨 <strong>增强功能说明：</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>基础编辑：</strong>拖拽移动、调整大小、更改颜色和文本</li>
              <li><strong>撤销/重做：</strong>支持操作历史记录，可以撤销和重做任意步骤</li>
              <li><strong>添加元素：</strong>点击"添加图形"按钮可以添加新的矩形、圆形或椭圆</li>
              <li><strong>复制/粘贴：</strong>选中元素后可以复制并粘贴到新位置</li>
              <li><strong>删除元素：</strong>选中不需要的元素可以直接删除</li>
              <li><strong>图层管理：</strong>调整元素的显示层次（置顶、置底、上移、下移）</li>
              <li><strong>透明度控制：</strong>调节元素的透明度，创建层叠效果</li>
              <li><strong>导出功能：</strong>将编辑结果导出为JSON文件，便于保存和分享</li>
            </ul>
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="bg-blue-50 rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">⌨️ 快捷键提示</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-700">
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+Z</kbd>
              <span className="ml-2">撤销</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+Y</kbd>
              <span className="ml-2">重做</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+C</kbd>
              <span className="ml-2">复制</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Ctrl+V</kbd>
              <span className="ml-2">粘贴</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Delete</kbd>
              <span className="ml-2">删除</span>
            </div>
            <div>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
              <span className="ml-2">取消选择</span>
            </div>
          </div>
        </div>

        {/* 高级可编辑示意图 */}
        <AdvancedEditableDiagram
          initialElements={carSystemElements}
          title="汽车零部件综合示意图"
          onSave={handleSave}
        />

        {/* 使用说明 */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📖 详细使用指南</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">基础操作</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>点击"进入编辑模式"开始编辑</li>
                <li>点击任意图形，右侧显示控制面板</li>
                <li>拖拽图形可以移动位置</li>
                <li>使用右侧滑块调整大小和透明度</li>
                <li>点击颜色块或使用颜色选择器更改颜色</li>
                <li>点击文本旁边的"编辑"按钮修改标签</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">高级功能</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>使用"添加图形"创建新元素</li>
                <li>选中元素后点击"复制"和"粘贴"</li>
                <li>使用图层控制调整元素叠放顺序</li>
                <li>撤销/重做功能支持无限步骤</li>
                <li>点击"导出JSON"保存编辑结果</li>
                <li>完成后点击"保存更改"确认修改</li>
              </ol>
            </div>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">精确控制</h3>
            <p className="text-sm text-gray-600">
              精确调整每个元素的位置、大小、颜色和透明度，创建专业的示意图
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">实时预览</h3>
            <p className="text-sm text-gray-600">
              所有修改都会实时显示，即时看到效果，快速迭代设计方案
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl mb-2">💾</div>
            <h3 className="font-semibold text-gray-900 mb-2">数据导出</h3>
            <p className="text-sm text-gray-600">
              支持导出JSON格式，可以保存、分享或导入到其他系统中使用
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
