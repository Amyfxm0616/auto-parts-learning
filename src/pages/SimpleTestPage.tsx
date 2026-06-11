export default function SimpleTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">✅ 简单测试页面</h1>
        <p className="text-lg mb-4">如果你能看到这个页面，说明React正常工作。</p>

        <div className="space-y-4">
          <div className="p-4 bg-green-100 rounded">
            <h2 className="font-bold">测试1: 基本渲染 ✓</h2>
            <p>React组件渲染正常</p>
          </div>

          <div className="p-4 bg-blue-100 rounded">
            <h2 className="font-bold">测试2: Tailwind CSS ✓</h2>
            <p>样式系统正常工作</p>
          </div>

          <div className="p-4 bg-yellow-100 rounded">
            <h2 className="font-bold">下一步</h2>
            <p>请在浏览器中按 F12 打开开发者工具</p>
            <p>查看 Console（控制台）标签中是否有红色错误信息</p>
            <p>将错误信息告诉开发者</p>
          </div>
        </div>
      </div>
    </div>
  );
}
