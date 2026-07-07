import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const exportPath = path.join(projectRoot, '.questions-export.json');
const publicQuestionsPath = path.join(projectRoot, 'public', 'quiz-questions.json');
const questionsTsPath = path.join(projectRoot, 'src', 'data', 'questions.ts');

function readQuestions() {
  const questionsJSON = readFileSync(exportPath, 'utf8');
  const questions = JSON.parse(questionsJSON);
  if (!Array.isArray(questions)) {
    throw new Error('导出的题库格式无效');
  }
  return questions;
}

function updateQuestionsTs(questions) {
  const source = readFileSync(questionsTsPath, 'utf8');
  const nextArray = `export const quizQuestions: Question[] = ${JSON.stringify(questions, null, 2)};`;
  const updated = source.replace(
    /export const quizQuestions: Question\[] = [\s\S]*?;\n\nconst STORAGE_KEY = 'quizQuestions';/,
    `${nextArray}\n\nconst STORAGE_KEY = 'quizQuestions';`
  );

  if (updated === source) {
    throw new Error('未找到 questions.ts 中的 fallback 题库定义');
  }

  writeFileSync(questionsTsPath, updated, 'utf8');
}

function commitIfNeeded() {
  const diff = execSync('git status --short -- public/quiz-questions.json src/data/questions.ts', {
    cwd: projectRoot,
    encoding: 'utf8',
  }).trim();

  if (!diff) {
    console.log('题库文件没有变化，跳过提交。');
    return;
  }

  execSync('git add public/quiz-questions.json src/data/questions.ts', { cwd: projectRoot, stdio: 'inherit' });
  execSync('git commit -m "chore: update published quiz questions"', { cwd: projectRoot, stdio: 'inherit' });
  execSync('git push origin main', { cwd: projectRoot, stdio: 'inherit' });
}

const questions = readQuestions();
console.log(`Writing ${questions.length} questions to published sources...`);
writeFileSync(publicQuestionsPath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
updateQuestionsTs(questions);
commitIfNeeded();
console.log('Published quiz sources synced to main.');
