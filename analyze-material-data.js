import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取提取的文本
const textPath = path.join(__dirname, 'material-properties-extracted.txt');
const text = fs.readFileSync(textPath, 'utf8');

// 材料名称映射
const materialMapping = {
  'PE': '聚乙烯',
  'PP': '聚丙烯',
  'PVC': '聚氯乙烯',
  'PC': '聚碳酸酯',
  'ABS': 'ABS树脂',
  'POM': '聚甲醛',
  'PA6': '尼龙6',
  'PA66': '尼龙66',
  'PMMA': '聚甲基丙烯酸甲酯',
  'PBT': '聚对苯二甲酸丁二醇酯',
  'PET': '聚对苯二甲酸乙二醇酯',
  'PPO': '聚苯醚',
  'PSU': '聚砜',
  'PPS': '聚苯硫醚',
  'PS': '聚苯乙烯'
};

// 性能参数映射
const propertyKeywords = {
  '密度': { unit: 'g/cm³', category: 'physical', importance: 'high' },
  '拉伸强度': { unit: 'MPa', category: 'mechanical', importance: 'high' },
  '弯曲强度': { unit: 'MPa', category: 'mechanical', importance: 'high' },
  '冲击强度': { unit: 'kJ/m²', category: 'mechanical', importance: 'high' },
  '硬度': { unit: 'Shore D', category: 'mechanical', importance: 'medium' },
  '弹性模量': { unit: 'MPa', category: 'mechanical', importance: 'medium' },
  '屈服强度': { unit: 'MPa', category: 'mechanical', importance: 'medium' },
  '断裂伸长率': { unit: '%', category: 'mechanical', importance: 'medium' },
  '熔点': { unit: '℃', category: 'thermal', importance: 'high' },
  '热变形温度': { unit: '℃', category: 'thermal', importance: 'high' },
  '熔融指数': { unit: 'g/10min', category: 'processing', importance: 'high' },
  '收缩率': { unit: '%', category: 'processing', importance: 'high' },
  '成型温度': { unit: '℃', category: 'processing', importance: 'medium' },
  '吸水率': { unit: '%', category: 'physical', importance: 'medium' }
};

// 尝试从文本中提取表格数据
function extractTables() {
  const lines = text.split('\n');
  const tables = [];
  let currentTable = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测表格开始（包含多个制表符或多列数据的行）
    if (line.includes('\t') && line.split('\t').length >= 3) {
      inTable = true;
      currentTable.push(line);
    } else if (inTable && line.length > 0) {
      currentTable.push(line);
    } else if (inTable && line.length === 0) {
      if (currentTable.length > 2) {
        tables.push([...currentTable]);
      }
      currentTable = [];
      inTable = false;
    }
  }

  return tables;
}

// 分析表格并提取材料数据
function analyzeTables() {
  const tables = extractTables();
  console.log(`\n📊 找到 ${tables.length} 个可能的表格\n`);

  // 显示前5个表格的样本
  tables.slice(0, 5).forEach((table, index) => {
    console.log(`--- 表格 ${index + 1} (${table.length} 行) ---`);
    table.slice(0, 3).forEach(row => {
      console.log(row.substring(0, 100));
    });
    console.log('');
  });
}

// 智能搜索材料性能数据
function findMaterialData(materialName) {
  const results = [];
  const lines = text.split('\n');

  // 搜索包含材料名称的段落
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes(materialName)) {
      // 提取上下文（前后5行）
      const context = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 10)).join('\n');

      // 尝试从上下文中提取性能数据
      Object.keys(propertyKeywords).forEach(prop => {
        const regex = new RegExp(`${prop}[：:】\\s]*([\\d\\.\\-~～]+)\\s*([a-zA-Z/²³°℃%]+)?`, 'g');
        const matches = context.matchAll(regex);

        for (const match of matches) {
          results.push({
            material: materialName,
            property: prop,
            value: match[1],
            unit: match[2] || propertyKeywords[prop].unit,
            context: line.substring(0, 80)
          });
        }
      });
    }
  }

  return results;
}

// 主分析函数
console.log('\\n===== 📊 深度分析 =====\\n');

// 分析表格结构
analyzeTables();

// 为每种主要材料搜索数据
console.log('\\n===== 🔍 搜索材料性能数据 =====\\n');

const mainMaterials = ['PP', 'PE', 'ABS', 'PC', 'PA6', 'POM'];

mainMaterials.forEach(mat => {
  const data = findMaterialData(mat);
  if (data.length > 0) {
    console.log(`\\n${mat} (${materialMapping[mat]}) - 找到 ${data.length} 条数据:`);
    data.slice(0, 5).forEach(d => {
      console.log(`  ${d.property}: ${d.value} ${d.unit}`);
    });
  }
});

console.log('\\n\\n💡 提示：');
console.log('  文档结构复杂，建议使用以下方式导入：');
console.log('  1. 使用数据导入工具手动输入关键数据');
console.log('  2. 从 Word 中复制表格粘贴到导入工具');
console.log('  3. 我可以帮你创建一些常用材料的完整数据');
