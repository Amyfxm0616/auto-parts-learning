import fs from 'fs';
import { glassAssemblyData } from './src/data/glassAssembly.js';

// 将 TypeScript 数据转换为 JSON 格式
const jsonData = glassAssemblyData.map(category => ({
  id: category.id,
  name: category.name,
  icon: category.icon,
  hasCoatingDesc: category.hasCoatingDesc || false,
  parts: category.parts.map(part => ({
    id: part.id,
    name: part.name,
    variants: part.variants.map(variant => ({
      id: variant.id,
      vehicleModel: variant.vehicleModel,
      glassComposition: variant.glassComposition,
      glassType: variant.glassType,
      privacyFunction: variant.privacyFunction,
      soundInsulation: variant.soundInsulation,
      coatingDesc: variant.coatingDesc || '',
      thermalTTS: variant.thermalTTS,
      lightTransmittance: variant.lightTransmittance,
      irBlockingRate: variant.irBlockingRate,
      uvBlockingRate: variant.uvBlockingRate,
      glassArea: variant.glassArea
    }))
  }))
}));

// 保存到 JSON 文件
const outputPath = 'C:/Users/fuxiaomin/auto-parts-learning/public/glassData.json';
fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf8');

console.log('📝 数据导出完成！');
console.log(`文件路径：${outputPath}`);
console.log(`总数据量：${jsonData.length} 个总成`);
console.log(`总零件数：${jsonData.reduce((sum, cat) => sum + cat.parts.length, 0)} 个分类`);
jsonData.forEach(cat => {
  const total = cat.parts.reduce((sum, p) => sum + p.variants.length, 0);
  console.log(`  - ${cat.name}: ${total} 个零件`);
});
