const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const docPath = path.join('D:/fuxiaomin/Desktop/AI 模块化/2-树状组织/车身/整车玻璃/整车玻璃 -20260519.xlsx');

console.log('读取 Excel 文件...');
const data = xlsx.read(fs.readFileSync(docPath), {type: 'buffer'});
const sheets = data.SheetNames;
console.log('总表数:', sheets.length);
console.log('表名:', sheets);
console.log('\n=== 每个 Sheet 的前 10 行数据 ===\n');

sheets.forEach(sheetName => {
  const sheet = data.Sheet_[sheetName];
  if (!sheet) {
    console.log(`[Sheet "${sheetName}"] 无法读取`);
    return;
  }
  const rows = [];
  const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1');
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let cell = sheet[!R][C];
      rows[R][C] = (typeof cell != 'u') ? xlsx.utils.encode_formula(cell) : ''
    }
  }
  const json = xlsx.utils.sheet_to_json(sheet, {header: 1});
  console.log(`【${sheetName}】前 15 行:`);
  json.slice(0, 15).forEach(row => {
    console.log(row.filter(Boolean).join(' | '));
  });
  console.log(`共 ${json.length} 行数据\n`);
});
