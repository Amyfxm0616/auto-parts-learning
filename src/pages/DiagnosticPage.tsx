import { useState } from 'react';

export default function DiagnosticPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = async () => {
    const results: string[] = [];

    try {
      // 测试1: 基本导入
      results.push('✓ React导入成功');

      // 测试2: 数据导入
      const { partSystems } = await import('../data/systems');
      results.push(`✓ 系统数据导入成功 (${partSystems.length}个)`);

      // 测试3: 材料数据导入
      const { materials } = await import('../data/materials');
      results.push(`✓ 材料数据导入成功 (${materials.length}个)`);

      // 测试4: 解析器导入
      void await import('../services/fileParser/wordParser');
      results.push('✓ WordParser导入成功');

      // 测试5: 匹配器导入
      void await import('../services/nlp/keywordMatcher');
      results.push('✓ KeywordMatcher导入成功');

      // 测试6: 存储管理器导入
      void await import('../services/storage/localStorageManager');
      results.push('✓ LocalStorageManager导入成功');

      // 测试7: UploadButton导入
      try {
        await import('../components/upload/UploadButton');
        results.push('✓ UploadButton导入成功');
      } catch (e: any) {
        results.push(`✗ UploadButton导入失败: ${e.message}`);
      }

      // 测试8: UploadModal导入
      try {
        await import('../components/upload/UploadModal');
        results.push('✓ UploadModal导入成功');
      } catch (e: any) {
        results.push(`✗ UploadModal导入失败: ${e.message}`);
      }

      // 测试9: PartsPage导入
      try {
        await import('./PartsPage');
        results.push('✓ PartsPage导入成功');
      } catch (e: any) {
        results.push(`✗ PartsPage导入失败: ${e.message}`);
      }

    } catch (error: any) {
      results.push(`✗ 测试失败: ${error.message}`);
    }

    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">系统诊断页面</h1>

        <button
          onClick={runTests}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
        >
          运行诊断测试
        </button>

        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                result.startsWith('✓')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {result}
            </div>
          ))}
        </div>

        {testResults.length === 0 && (
          <p className="text-gray-500 italic">点击"运行诊断测试"开始检查...</p>
        )}
      </div>
    </div>
  );
}
