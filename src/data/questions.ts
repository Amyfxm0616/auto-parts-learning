// 直接定义类型避免导入问题
interface Question {
  id: string;
  type: 'single' | 'multiple' | 'matching';
  question: string;
  options: string[];
  correctAnswer: number | number[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedPartId?: string;
  relatedMaterialId?: string;
}

export const quizQuestions: Question[] = [
  {
    id: 'q-001',
    type: 'single',
    question: '以下哪种材料最适合用于制造发动机缸体？',
    options: ['橡胶', '铝合金', '塑料', '陶瓷'],
    correctAnswer: 1,
    explanation: '铝合金具有良好的导热性、较高的强度和较低的密度，非常适合用于发动机缸体。',
    difficulty: 'easy',
    relatedMaterialId: 'mat-001',
  },
  {
    id: 'q-002',
    type: 'single',
    question: '汽车保险杠通常使用什么材料制造？',
    options: ['碳钢', '聚丙烯(PP)', '铸铁', '铝合金'],
    correctAnswer: 1,
    explanation: 'PP塑料重量轻、成本低、易成型，非常适合用于保险杠。',
    difficulty: 'easy',
    relatedMaterialId: 'mat-004',
    relatedPartId: 'part-005',
  },
  {
    id: 'q-003',
    type: 'single',
    question: '刹车盘通常使用哪种材料？',
    options: ['铝合金', '塑料', '铸铁', '橡胶'],
    correctAnswer: 2,
    explanation: '铸铁具有良好的耐磨性和减震性能，是制造刹车盘的理想材料。',
    difficulty: 'medium',
    relatedPartId: 'part-004',
    relatedMaterialId: 'mat-007',
  },
  {
    id: 'q-004',
    type: 'single',
    question: '碳纤维复合材料的主要优势是什么？',
    options: ['成本低', '易于加工', '重量轻且强度高', '耐高温性差'],
    correctAnswer: 2,
    explanation: '碳纤维复合材料具有极高的比强度和比刚度，重量轻但强度极高。',
    difficulty: 'medium',
    relatedMaterialId: 'mat-006',
  },
  {
    id: 'q-005',
    type: 'single',
    question: '高强度钢主要用于汽车的哪个部位？',
    options: ['仪表盘', '保险杠', '防撞梁', '轮胎'],
    correctAnswer: 2,
    explanation: '高强度钢具有极高的强度，常用于车身安全结构如防撞梁、B柱等。',
    difficulty: 'medium',
    relatedMaterialId: 'mat-003',
    relatedPartId: 'part-007',
  },
  {
    id: 'q-006',
    type: 'single',
    question: '铝合金相比碳钢的主要优势是什么？',
    options: ['成本更低', '强度更高', '重量更轻', '更易焊接'],
    correctAnswer: 2,
    explanation: '铝合金的密度约为钢的1/3，因此重量更轻是其主要优势。',
    difficulty: 'easy',
    relatedMaterialId: 'mat-001',
  },
  {
    id: 'q-007',
    type: 'single',
    question: 'ABS塑料常用于汽车的哪些部件？',
    options: ['发动机缸体', '曲轴', '格栅和后视镜壳', '刹车盘'],
    correctAnswer: 2,
    explanation: 'ABS塑料韧性好、表面光泽度高，常用于格栅、后视镜壳等外观件。',
    difficulty: 'easy',
    relatedMaterialId: 'mat-005',
  },
  {
    id: 'q-008',
    type: 'single',
    question: '活塞在工作时承受的最高温度约为？',
    options: ['50-100°C', '150-200°C', '250-350°C', '500-600°C'],
    correctAnswer: 2,
    explanation: '活塞在发动机气缸内工作，承受高温高压燃气，最高温度可达250-350°C。',
    difficulty: 'hard',
    relatedPartId: 'part-002',
  },
  {
    id: 'q-009',
    type: 'single',
    question: '橡胶材料在汽车上的主要应用是？',
    options: ['车身结构', '发动机部件', '轮胎和密封件', '仪表盘'],
    correctAnswer: 2,
    explanation: '橡胶具有高弹性和减震性能，主要用于轮胎、密封条、减震器等部件。',
    difficulty: 'easy',
    relatedMaterialId: 'mat-008',
  },
  {
    id: 'q-010',
    type: 'single',
    question: '以下哪种材料的可回收性最好？',
    options: ['碳纤维复合材料', '橡胶', '铝合金', '热固性塑料'],
    correctAnswer: 2,
    explanation: '铝合金100%可回收，回收后性能几乎不受影响，是最环保的材料之一。',
    difficulty: 'medium',
    relatedMaterialId: 'mat-001',
  },
];
