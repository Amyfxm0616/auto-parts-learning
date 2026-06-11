import { useState } from 'react';
import EditableDiagram from '../components/EditableDiagram';

export default function EditableDiagramDemo() {
  // 初始化座椅示意图元素
  const [seatElements] = useState([
    {
      id: 'headrest',
      type: 'ellipse' as const,
      x: 600,
      y: 120,
      rx: 80,
      ry: 60,
      fill: '#e5e7eb',
      stroke: '#374151',
      strokeWidth: 2,
      text: '头枕',
      textX: 600,
      textY: 125,
    },
    {
      id: 'backrest',
      type: 'rect' as const,
      x: 480,
      y: 180,
      width: 180,
      height: 250,
      rx: 20,
      fill: '#d1d5db',
      stroke: '#374151',
      strokeWidth: 2,
      text: '靠背',
      textX: 570,
      textY: 305,
    },
    {
      id: 'cushion',
      type: 'rect' as const,
      x: 500,
      y: 200,
      width: 140,
      height: 210,
      rx: 15,
      fill: '#f3f4f6',
      stroke: '#374151',
      strokeWidth: 2,
      text: '坐垫',
      textX: 570,
      textY: 305,
    },
    {
      id: 'armrest',
      type: 'rect' as const,
      x: 350,
      y: 350,
      width: 80,
      height: 100,
      rx: 10,
      fill: '#e5e7eb',
      stroke: '#374151',
      strokeWidth: 2,
      text: '扶手',
      textX: 390,
      textY: 405,
    },
    {
      id: 'base',
      type: 'circle' as const,
      x: 550,
      y: 500,
      radius: 50,
      fill: '#d1d5db',
      stroke: '#374151',
      strokeWidth: 2,
      text: '底座',
      textX: 550,
      textY: 505,
    },
  ]);

  // 灯具示意图元素
  const [lightElements] = useState([
    {
      id: 'headlight',
      type: 'ellipse' as const,
      x: 620,
      y: 280,
      rx: 70,
      ry: 55,
      fill: '#fef3c7',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前大灯',
      textX: 620,
      textY: 285,
    },
    {
      id: 'turnSignal',
      type: 'ellipse' as const,
      x: 640,
      y: 220,
      rx: 45,
      ry: 35,
      fill: '#fed7aa',
      stroke: '#374151',
      strokeWidth: 2,
      text: '转向灯',
      textX: 640,
      textY: 225,
    },
    {
      id: 'fogLight',
      type: 'circle' as const,
      x: 600,
      y: 360,
      radius: 30,
      fill: '#e5e7eb',
      stroke: '#374151',
      strokeWidth: 2,
      text: '雾灯',
      textX: 600,
      textY: 365,
    },
    {
      id: 'taillight',
      type: 'rect' as const,
      x: 130,
      y: 240,
      width: 60,
      height: 80,
      rx: 8,
      fill: '#fca5a5',
      stroke: '#374151',
      strokeWidth: 2,
      text: '尾灯',
      textX: 160,
      textY: 285,
    },
    {
      id: 'interiorLight',
      type: 'rect' as const,
      x: 320,
      y: 150,
      width: 140,
      height: 25,
      rx: 5,
      fill: '#ddd6fe',
      stroke: '#374151',
      strokeWidth: 2,
      text: '内饰灯',
      textX: 390,
      textY: 165,
    },
  ]);

  // 智能电子零部件示意图元素
  const [electronicsElements] = useState([
    {
      id: 'display',
      type: 'rect' as const,
      x: 480,
      y: 240,
      width: 140,
      height: 100,
      rx: 8,
      fill: '#dbeafe',
      stroke: '#374151',
      strokeWidth: 2,
      text: '显示屏',
      textX: 550,
      textY: 295,
    },
    {
      id: 'camera-front',
      type: 'circle' as const,
      x: 640,
      y: 220,
      radius: 25,
      fill: '#f3f4f6',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前摄像头',
      textX: 640,
      textY: 225,
    },
    {
      id: 'camera-rear',
      type: 'circle' as const,
      x: 160,
      y: 260,
      radius: 20,
      fill: '#f3f4f6',
      stroke: '#374151',
      strokeWidth: 2,
      text: '后摄像头',
      textX: 160,
      textY: 265,
    },
    {
      id: 'sensor-front',
      type: 'rect' as const,
      x: 630,
      y: 360,
      width: 50,
      height: 30,
      rx: 5,
      fill: '#e0e7ff',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前雷达',
      textX: 655,
      textY: 380,
    },
    {
      id: 'sensor-rear',
      type: 'rect' as const,
      x: 120,
      y: 340,
      width: 40,
      height: 30,
      rx: 5,
      fill: '#e0e7ff',
      stroke: '#374151',
      strokeWidth: 2,
      text: '后雷达',
      textX: 140,
      textY: 360,
    },
    {
      id: 'speaker-front',
      type: 'circle' as const,
      x: 580,
      y: 320,
      radius: 30,
      fill: '#fef3c7',
      stroke: '#374151',
      strokeWidth: 2,
      text: '前扬声器',
      textX: 580,
      textY: 325,
    },
    {
      id: 'speaker-rear',
      type: 'circle' as const,
      x: 220,
      y: 320,
      radius: 25,
      fill: '#fef3c7',
      stroke: '#374151',
      strokeWidth: 2,
      text: '后扬声器',
      textX: 220,
      textY: 325,
    },
    {
      id: 'ecu',
      type: 'rect' as const,
      x: 320,
      y: 360,
      width: 120,
      height: 70,
      rx: 8,
      fill: '#d1fae5',
      stroke: '#374151',
      strokeWidth: 2,
      text: 'ECU控制器',
      textX: 380,
      textY: 400,
    },
  ]);

  // 内饰零部件示意图元素
  const [interiorElements] = useState([
    {
      id: 'dashboard',
      type: 'rect' as const,
      x: 520,
      y: 200,
      width: 200,
      height: 120,
      rx: 10,
      fill: '#f3f4f6',
      stroke: '#374151',
      strokeWidth: 2,
      text: '仪表板',
      textX: 620,
      textY: 265,
    },
    {
      id: 'console',
      type: 'rect' as const,
      x: 420,
      y: 320,
      width: 120,
      height: 180,
      rx: 8,
      fill: '#e5e7eb',
      stroke: '#374151',
      strokeWidth: 2,
      text: '中控台',
      textX: 480,
      textY: 415,
    },
    {
      id: 'door-panel',
      type: 'rect' as const,
      x: 80,
      y: 200,
      width: 160,
      height: 280,
      rx: 10,
      fill: '#ddd6fe',
      stroke: '#374151',
      strokeWidth: 2,
      text: '门板',
      textX: 160,
      textY: 345,
    },
    {
      id: 'carpet',
      type: 'ellipse' as const,
      x: 300,
      y: 530,
      rx: 250,
      ry: 50,
      fill: '#fed7aa',
      stroke: '#374151',
      strokeWidth: 2,
      text: '地毯',
      textX: 300,
      textY: 535,
    },
    {
      id: 'steering-wheel',
      type: 'circle' as const,
      x: 650,
      y: 280,
      radius: 40,
      fill: '#fca5a5',
      stroke: '#374151',
      strokeWidth: 2,
      text: '方向盘',
      textX: 650,
      textY: 285,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'seat' | 'light' | 'electronics' | 'interior'>('seat');

  const handleSave = (elements: any[]) => {
    console.log('保存的元素:', elements);
    alert('更改已保存到控制台！');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">可编辑零部件示意图演示</h1>
          <div className="space-y-2 text-gray-600">
            <p>🎨 <strong>功能说明：</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>移动：</strong>进入编辑模式后，点击并拖拽图形即可移动位置</li>
              <li><strong>形状变化：</strong>使用右侧面板的滑块调整图形大小（宽度、高度、半径等）</li>
              <li><strong>内容编辑：</strong>选中图形后，点击"编辑"按钮修改文本标签</li>
              <li><strong>颜色变化：</strong>在右侧面板选择预设颜色或使用颜色选择器自定义颜色</li>
            </ul>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('seat')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'seat'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            座椅零部件
          </button>
          <button
            onClick={() => setActiveTab('light')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'light'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            灯具零部件
          </button>
          <button
            onClick={() => setActiveTab('electronics')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'electronics'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            智能电子
          </button>
          <button
            onClick={() => setActiveTab('interior')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'interior'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            内饰零部件
          </button>
        </div>

        {/* 示意图 */}
        {activeTab === 'seat' && (
          <EditableDiagram
            initialElements={seatElements}
            title="座椅零部件示意图"
            onSave={handleSave}
          />
        )}

        {activeTab === 'light' && (
          <EditableDiagram
            initialElements={lightElements}
            title="灯具零部件示意图"
            onSave={handleSave}
          />
        )}

        {activeTab === 'electronics' && (
          <EditableDiagram
            initialElements={electronicsElements}
            title="智能电子零部件示意图"
            onSave={handleSave}
          />
        )}

        {activeTab === 'interior' && (
          <EditableDiagram
            initialElements={interiorElements}
            title="内饰零部件示意图"
            onSave={handleSave}
          />
        )}

        {/* 使用说明 */}
        <div className="mt-6 bg-blue-50 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">使用提示</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>1. 点击<strong>"进入编辑模式"</strong>按钮开始编辑</p>
            <p>2. 点击任意图形，右侧会显示该图形的控制面板</p>
            <p>3. 在编辑模式下可以：</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>直接拖拽图形移动位置</li>
              <li>使用颜色面板更改填充颜色</li>
              <li>通过滑块调整图形的大小</li>
              <li>点击"编辑"按钮修改文本内容</li>
            </ul>
            <p>4. 完成编辑后点击<strong>"保存更改"</strong>按钮保存</p>
            <p>5. 点击<strong>"退出编辑"</strong>返回查看模式</p>
          </div>
        </div>
      </div>
    </div>
  );
}
