import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function extractMaterialProperties() {
  const filePath = 'D:\\fuxiaomin\\Desktop\\AI模块化\\材料基本性能\\材料基本性能.docx';

  try {
    console.log('正在读取文档...');
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    console.log(`\n✅ 文档读取成功！`);
    console.log(`📄 文档总字数: ${text.length}`);

    // 保存完整文本到文件
    const outputPath = path.join(__dirname, 'material-properties-extracted.txt');
    fs.writeFileSync(outputPath, text, 'utf8');
    console.log(`💾 完整文本已保存到: ${outputPath}`);

    // 分析文档结构
    console.log('\n\n===== 📊 数据结构分析 =====\n');

    // 查找常见的材料性能关键词
    const keywords = [
      '密度', '拉伸强度', '弯曲强度', '冲击强度', '硬度',
      '熔点', '玻璃化转变温度', '热变形温度', '热膨胀系数',
      '导热系数', '吸水率', '收缩率', '弹性模量', '屈服强度',
      '断裂伸长率', '维卡软化点', '熔融指数', '成型温度'
    ];

    const keywordCounts = {};
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword, 'g');
      const matches = text.match(regex);
      if (matches) {
        keywordCounts[keyword] = matches.length;
      }
    });

    // 按出现次数排序显示
    const sorted = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    console.log('关键性能参数出现频率 (Top 15):\n');
    sorted.forEach(([keyword, count], index) => {
      console.log(`${index + 1}. ${keyword}: ${count} 次`);
    });

    // 尝试识别材料名称
    console.log('\n\n===== 🔍 材料识别 =====\n');

    const materialPatterns = [
      'PP', 'PE', 'ABS', 'PA6', 'PA66', 'PC', 'POM', 'PMMA',
      'PBT', 'PET', 'PPS', 'PEEK', 'PPO', 'PSU',
      '聚丙烯', '聚乙烯', '聚酰胺', '尼龙', '聚碳酸酯',
      '聚甲醛', '聚苯乙烯', '聚氯乙烯', 'PVC'
    ];

    const foundMaterials = {};
    materialPatterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'gi');
      const matches = text.match(regex);
      if (matches) {
        foundMaterials[pattern] = matches.length;
      }
    });

    const sortedMaterials = Object.entries(foundMaterials)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    console.log('识别到的材料 (Top 20):\n');
    sortedMaterials.forEach(([material, count], index) => {
      console.log(`${index + 1}. ${material}: ${count} 次`);
    });

    // 显示前2000字预览
    console.log('\n\n===== 📖 文档内容预览 (前2000字) =====\n');
    console.log(text.substring(0, 2000));
    console.log('\n...(后续内容已省略)...\n');

    // 尝试提取表格数据（简单的模式匹配）
    console.log('\n\n===== 📋 尝试提取数据模式 =====\n');

    // 查找类似 "性能名称 数值 单位" 的模式
    const lines = text.split('\n').slice(0, 100); // 分析前100行
    let tablePatterns = 0;

    lines.forEach((line, index) => {
      // 查找包含数字和单位的行
      if (/\d+\.?\d*\s*(MPa|GPa|g\/cm³|℃|%|kJ\/m²|Shore|mm)/i.test(line)) {
        tablePatterns++;
        if (tablePatterns <= 5) {
          console.log(`行 ${index}: ${line.substring(0, 80)}`);
        }
      }
    });

    console.log(`\n找到 ${tablePatterns} 行可能的数据模式`);

    console.log('\n\n✅ 解析完成！');
    console.log('\n💡 提示：请查看生成的 .txt 文件了解完整内容');
    console.log('   然后我将帮你结构化这些数据并导入系统。');

  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

extractMaterialProperties();
