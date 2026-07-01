// 题目类型定义
export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'matching' | 'boolean' | 'fill' | 'essay';
  question: string;
  imageUrl?: string;
  questionImages?: string[];
  options?: string[];
  optionImages?: string[];
  correctAnswer: number | number[] | string | string[] | boolean;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedPartId?: string;
  relatedMaterialId?: string;
  category?: string;
  tags?: string[];
  createdAt?: number;
  updatedAt?: number;
  fillBlanks?: number;
  fillImages?: string[];
  maxLength?: number;
  keywords?: string[];
}

// 判断题的固定选项
export const BOOLEAN_OPTIONS = ['正确', '错误'];

export const quizQuestions: Question[] = [
  {
    "id": "q-002",
    "type": "single",
    "question": "汽车保险杠通常使用什么材料制造？",
    "options": [
      "ABS",
      "PP+EPDM-TD",
      "PA",
      "PP-LGF"
    ],
    "correctAnswer": 1,
    "explanation": "PP塑料重量轻、成本低、易成型，非常适合用于保险杠。",
    "difficulty": "easy",
    "relatedMaterialId": "mat-004",
    "relatedPartId": "part-005",
    "category": "塑料材料",
    "tags": [
      "保险杠",
      "工程塑料"
    ],
    "updatedAt": 1778057625190
  },
  {
    "id": "q-009",
    "type": "single",
    "question": "橡胶材料在汽车上的主要应用是？",
    "options": [
      "车身结构",
      "发动机部件",
      "轮胎和密封件",
      "仪表盘"
    ],
    "correctAnswer": 2,
    "explanation": "橡胶具有高弹性和减震性能，主要用于轮胎、密封条、减震器等部件。",
    "difficulty": "easy",
    "relatedMaterialId": "mat-008",
    "category": "橡胶材料",
    "tags": [
      "橡胶",
      "密封"
    ]
  },
  {
    "id": "q-014",
    "type": "fill",
    "question": "汽车轮胎主要由______材料制成，因其具有优异的弹性和______。",
    "correctAnswer": [
      "橡胶",
      "减震（或减振）"
    ],
    "fillBlanks": 2,
    "explanation": "轮胎使用橡胶材料，因为橡胶具有高弹性和良好的减震性能。",
    "difficulty": "easy",
    "category": "轮胎",
    "tags": [
      "轮胎",
      "橡胶"
    ],
    "updatedAt": 1782723009329
  },
  {
    "type": "single",
    "question": "聚氨酯发泡海绵的发泡反应中，产生气泡的气体来源是什么？  （   B   ）",
    "options": [
      "氮气（N2）",
      "异氰酸酯与水反应生成的二氧化碳（CO2）",
      "多元醇分解产生的氧气（O2）",
      "硅油挥发产生的气体"
    ],
    "correctAnswer": 1,
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777606743834",
    "createdAt": 1777606743834,
    "updatedAt": 1777606743834
  },
  {
    "type": "single",
    "question": "在聚氨酯配方中，\"异氰酸酯指数（NCO Index）\"主要影响的是什么？  （      ）",
    "options": [
      "原料的颜色",
      "海绵的发泡速度与密度",
      "海绵的交联程度，进而影响硬度和压缩变形性能",
      "模具的脱模难易程度"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777608727612-ily14c",
    "createdAt": 1777608727612,
    "updatedAt": 1782806729425,
    "explanation": ""
  },
  {
    "type": "single",
    "question": "汽车座椅坐垫海绵的典型密度范围是多少？  （      ）",
    "options": [
      "5~15 kg/m³",
      "40~55 kg/m³",
      "100~150 kg/m³",
      "200~300 kg/m³"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777608727612-5bsokk",
    "createdAt": 1777608727612,
    "updatedAt": 1777608727612
  },
  {
    "type": "single",
    "question": "下列哪项物性指标主要用于评价海绵长期使用后是否容易塌陷？  （      ）",
    "options": [
      "回弹性（Ball Rebound）",
      "拉伸强度（Tensile Strength）",
      "压缩永久变形（Compression Set）",
      "透气性（Air Flow）"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777608727612-l71prv",
    "createdAt": 1777608727612,
    "updatedAt": 1777608727612
  },
  {
    "type": "fill",
    "question": "汽车内饰 PP 改性塑料添加滑石粉，主要作用是提升（）、降低（）。",
    "correctAnswer": [
      "刚性（或刚度）",
      "收缩率、尺寸变化"
    ],
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1777611603832-c2ar06",
    "createdAt": 1777611603832,
    "updatedAt": 1782870609325,
    "explanation": "",
    "fillBlanks": 2
  },
  {
    "type": "boolean",
    "question": "汽车用 ABS 材料耐候性优异，可直接长期应用于车身外饰裸露件，无需做喷涂或改性耐候处理。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": false,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603832-q1dg0n",
    "createdAt": 1777611603832,
    "updatedAt": 1777611603832
  },
  {
    "type": "boolean",
    "question": "硅橡胶（VMQ）耐高低温、耐老化性能优于普通三元乙丙橡胶 EPDM。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": true,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603832-muabrd",
    "createdAt": 1777611603832,
    "updatedAt": 1777611603832
  },
  {
    "type": "boolean",
    "question": "汽车燃油管路常用 NBR 丁腈橡胶，核心是利用其耐油特性。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": true,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603833-nhoppv",
    "createdAt": 1777611603833,
    "updatedAt": 1777611603833
  },
  {
    "type": "boolean",
    "question": "玻纤增强 PA66 材料，玻纤含量越高，材料韧性和抗冲击性能越好。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": false,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603833-rambbj",
    "createdAt": 1777611603833,
    "updatedAt": 1777611603833
  },
  {
    "type": "boolean",
    "question": "汽车内饰 VOC 挥发物主要来源于塑料粒子、助剂、胶水及发泡材料。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": true,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603833-eeioof",
    "createdAt": 1777611603833,
    "updatedAt": 1777611603833
  },
  {
    "type": "boolean",
    "question": "EPDM 三元乙丙橡胶耐候、耐臭氧性能差，不适合用作汽车门窗密封条。",
    "options": [
      "正确",
      "错误"
    ],
    "correctAnswer": false,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777611603833-9po1ud",
    "createdAt": 1777611603833,
    "updatedAt": 1777611603833
  },
  {
    "type": "fill",
    "question": "把以下橡胶材料，按耐热性能高低排序： \nHNBR、NBR、EPDM 、VMQ、ACM 、NR、FKM\n",
    "correctAnswer": [
      "FKM≥VMQ ≥ACM ≥HNBR≥EPDM≥NBR ≥NR"
    ],
    "explanation": "",
    "difficulty": "hard",
    "category": "",
    "tags": [],
    "fillBlanks": 1,
    "id": "q-1777612835700-fuw1d2",
    "createdAt": 1777612835700,
    "updatedAt": 1782870658006
  },
  {
    "type": "single",
    "question": "PP材料在汽车保险杠应用中，通常需要加入何种改性组分以提升低温冲击性能？",
    "options": [
      "玻纤（GF）",
      "滑石粉（Talc）",
      "三元乙丙橡胶（EPDM）",
      "碳酸钙（CaCO₃）"
    ],
    "correctAnswer": 2,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-hkoopd",
    "createdAt": 1777612882659,
    "updatedAt": 1777612882659
  },
  {
    "type": "single",
    "question": "PA66与PA6相比，以下描述错误的是？",
    "correctAnswer": 2,
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-pwx8c8",
    "createdAt": 1777612882659,
    "updatedAt": 1782870703703,
    "options": [
      "PA66熔点更高",
      "PA66吸水率低于PA6",
      "PA66加工流动性优于PA6",
      "PA66力学性能整体略优于PA6"
    ],
    "explanation": ""
  },
  {
    "type": "single",
    "question": "新能源汽车高压线束连接器的外壳材料，首选以下哪种？",
    "options": [
      "ABS",
      "PA66-GF25",
      "PP-TD20",
      "PC透明级"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-6kppwf",
    "createdAt": 1777612882659,
    "updatedAt": 1777612882659
  },
  {
    "type": "single",
    "question": "注塑件出现缩痕的根本原因是？",
    "options": [
      "模具温度过高导致表面氧化",
      "壁厚不均匀",
      "厚壁区冷却收缩时表面材料被拉陷",
      "注射压力过高造成内应力",
      "材料流动性不足导致充填不完整"
    ],
    "correctAnswer": 1,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-8mih6n",
    "createdAt": 1777612882659,
    "updatedAt": 1777612882659
  },
  {
    "type": "single",
    "question": "DSC（差示扫描量热法）用于表征聚合物热性能，以下哪项无法直接通过DSC测定？",
    "options": [
      "结晶熔融温度（Tm）",
      "玻璃化转变温度（Tg）",
      "结晶度（通过熔融焓计算）",
      "材料拉伸断裂伸长率"
    ],
    "correctAnswer": 3,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-exeze2",
    "createdAt": 1777612882659,
    "updatedAt": 1777612882659
  },
  {
    "type": "single",
    "question": "以下哪个温度可以代表材料的长期工作温度？",
    "options": [
      "CTI",
      "HDT",
      "玻璃化转变温度",
      "熔点"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-nffoz4",
    "createdAt": 1777612882659,
    "updatedAt": 1777612882659
  },
  {
    "type": "single",
    "question": "在玻璃纤维增强塑料（如PA66-GF30）中，玻纤提升材料刚性和强度的主要机理是？",
    "options": [
      "玻纤熔入基体形成固溶强化，类似金属合金",
      "玻纤增大材料密度，进而提升力学性能",
      "玻纤吸收冲击能量，通过自身断裂消耗能量",
      "玻纤以高模量刚性纤维形式分散于基体，承载应力并抑制分子链运动"
    ],
    "correctAnswer": 3,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-7plkrl",
    "createdAt": 1777612882659,
    "updatedAt": 1777613297519,
    "explanation": ""
  },
  {
    "type": "single",
    "question": "以下关于PC耐化学品性的描述，正确的是？\n",
    "correctAnswer": 2,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882659-gj9k19",
    "createdAt": 1777612882659,
    "updatedAt": 1777613223941,
    "options": [
      "PC耐燃油性极佳，可直接用于储油零件",
      "PC耐所有有机溶剂，是化学品最稳定的工程塑料之一",
      "PC耐稀酸，但对碱、芳香烃、酮类、酯类溶剂及应力开裂敏感",
      "PC耐化学品性优于PA，在各类化学介质中尺寸变化可忽略"
    ],
    "explanation": ""
  },
  {
    "type": "single",
    "question": "常用MFR来表征材料加工流动性，以下描述正确的是？",
    "correctAnswer": 1,
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777612882660-8b5woz",
    "createdAt": 1777612882660,
    "updatedAt": 1777613186305,
    "options": [
      "MFR越高，材料分子量越大，力学性能越好",
      "MFR越高，材料流动性越好，但通常分子量较低，力学性能有所下降",
      "MFR与材料力学性能无关，仅用于指导模具设计",
      "MFR值越低越适合薄壁复杂件注塑"
    ],
    "explanation": ""
  },
  {
    "type": "single",
    "question": "ABS材料中三种单体各自赋予材料的性能，对应正确的是？\n",
    "options": [
      "耐热性，刚性，韧性",
      "耐化学性/强度，韧性，加工流动性/光泽",
      "光泽，耐热，耐化学品",
      "加工流动性/光泽，韧性，耐化学性/强度"
    ],
    "correctAnswer": 1,
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1777613140201-x6w065",
    "createdAt": 1777613140201,
    "updatedAt": 1777613310598
  },
  {
    "type": "fill",
    "question": "橡胶的物理机械性能与硫化程度的关系（横坐标硫化程度，纵坐标物理机械性能），从上到下分别对应：",
    "correctAnswer": [
      "拉伸强度",
      "定伸应力",
      "伸长率",
      "弹性",
      "硬度",
      "永久变形"
    ],
    "explanation": "",
    "difficulty": "hard",
    "category": "",
    "tags": [],
    "imageUrl": "data:image/png;base64,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",
    "fillBlanks": 6,
    "id": "q-1777613913162-0ts5qm",
    "createdAt": 1777613913162,
    "updatedAt": 1778136927340
  },
  {
    "type": "fill",
    "question": "按受热时的行为和具备反复成型加工性，可以将塑料分为（）和（）两大类。",
    "correctAnswer": [
      "热塑性塑料或热固性塑料",
      "热固性塑料或热塑性塑料"
    ],
    "explanation": "",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "fillBlanks": 2,
    "id": "q-1777624105853-dl5olr",
    "createdAt": 1777624105853,
    "updatedAt": 1778057390849
  },
  {
    "type": "fill",
    "question": "硫化工艺条件是指决定橡胶硫化质量的三个重要因素，通常习惯称它们为“硫化三要素”，即（）",
    "correctAnswer": [
      "温度、时间 、压力"
    ],
    "explanation": "",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "fillBlanks": 1,
    "id": "q-1777624369250-omsu4l",
    "createdAt": 1777624369250,
    "updatedAt": 1782724513757
  },
  {
    "type": "fill",
    "question": "大多数橡胶具有不同程度的可燃性。而分子中含有的（）的橡胶，如（），则具一定的的抗燃性。",
    "correctAnswer": [
      "卤素",
      "氯丁橡胶CR,氟橡胶FKM"
    ],
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "fillBlanks": 2,
    "id": "q-1777624513004-1jhca9",
    "createdAt": 1777624513004,
    "updatedAt": 1782724538342
  },
  {
    "type": "single",
    "question": "仪表板主体材料选材为PC+ABS或PP+EPDM-TD20.HI的选材原因正确的是（   ）",
    "options": [
      "碰撞安全、气味要求、成本需求、减重需求、耐热及性能要求",
      "碰撞安全、气味要求、成本需求、减重需求；",
      "碰撞安全、气味要求、成本需求；",
      "碰撞安全、气味要求。"
    ],
    "correctAnswer": 0,
    "explanation": "PC+ABS兼顾高抗冲（ABS）、耐热（110℃以上，PC）与良好流动性，适合注塑复杂结构，且低温韧性好，满足车规（-40℃~110℃）与低VOC要求；PP+EPDM-TD20.HI，用于硬质或低成本车型本体，密度低、耐候性好、易回收、气味低，但表面硬度与光泽需后处理（如喷涂/覆膜）；满足刚度（弯曲模量≥1800MPa）与安全碰撞吸能需求",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1782723512221-3kpk2p",
    "createdAt": 1782723512221,
    "updatedAt": 1782723512221
  },
  {
    "type": "single",
    "question": "智能底盘系统衬套类零件主要橡胶选材类型及耐温要求（   ）",
    "options": [
      "NR，-40℃~100℃（125℃）；",
      "EPDM，-40℃~100℃（125℃）；",
      "HNBR，-40℃~100℃（125℃）；",
      "VMQ，-40℃~175℃。"
    ],
    "correctAnswer": 0,
    "explanation": "以天然橡胶NR材料为主，耐温范围一般在-40℃~100℃，耐温要求高的在125℃。",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1782723748898-etgygp",
    "createdAt": 1782723748898,
    "updatedAt": 1782723748898
  },
  {
    "type": "multiple",
    "question": "车型质量问题常见问题类型有哪些？（   ）",
    "options": [
      "材料一致性类问题，",
      "材料性能类问题；",
      "防火阻燃性能",
      "异响，外观，断裂，其他（涉及非金属材料问题）；"
    ],
    "correctAnswer": [
      0,
      1,
      2,
      3
    ],
    "explanation": "",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1782723810630-mrz2fy",
    "createdAt": 1782723810630,
    "updatedAt": 1782723810630
  },
  {
    "type": "single",
    "question": "热管理的低温水管零件第二代材料(PA12+TIE+PP)替代第一代PA612材料的主要原因是（  ）",
    "options": [
      "供应原因",
      "性能原因",
      " 工艺原因",
      "成本原因"
    ],
    "correctAnswer": 3,
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1782723848452-z0ytc9",
    "createdAt": 1782723848452,
    "updatedAt": 1782723848452
  },
  {
    "type": "single",
    "question": "项目流程审核时，应确认下列流程信息，请按照正确顺序进行排序（ ）\n①DVP计划需明确填写非金属QA要求的材料要求，限值及材料类型，试验数量等；\n②确定材料分供方清单的零件重量，材料类型，材料牌号，材料厂家，工艺要求等；\n③DV试验流程确认材料测试报告满足要求；\n④TR阶段沟通材料选材并推荐选材及DVP计划填写材料要求。\n⑤ESO规定其他涉及非金属材料的相关流程信息。",
    "options": [
      "①②③④⑤",
      "④①②③⑤",
      "④②①③⑤",
      "④②③①⑤",
      "②④③①⑤"
    ],
    "correctAnswer": 1,
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1782723945314-uiutbs",
    "createdAt": 1782723945314,
    "updatedAt": 1782723945314
  },
  {
    "type": "multiple",
    "question": "车型开发TR交流时，TR资料需确认哪些因素？（   ）",
    "options": [
      "零件清单",
      "零件重量",
      "材料类型",
      "材料标准信息",
      "推荐材料清单"
    ],
    "correctAnswer": [
      0,
      1,
      2,
      3,
      4
    ],
    "explanation": "",
    "difficulty": "easy",
    "category": "",
    "tags": [],
    "id": "q-1782724018902-tlavda",
    "createdAt": 1782724018902,
    "updatedAt": 1782724018902
  },
  {
    "type": "multiple",
    "question": "热管理管路零件的DRE沟通要求推荐材料选材时，需要确认哪些信息？（   ）",
    "options": [
      "选材具体类型",
      "数据库类型牌号确认",
      "特殊要求确认，如耐水解、耐油液、耐冲击以及阻燃性能等",
      "加工性和外观要求确认",
      "内部确认数据库牌号信息。"
    ],
    "correctAnswer": [
      0,
      1,
      2,
      3,
      4
    ],
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1782724079045-bjmidy",
    "createdAt": 1782724079045,
    "updatedAt": 1782724079045
  },
  {
    "type": "multiple",
    "question": "当DRE的选材类型无发布理想企标试验项限值时，应如何提供相关类型材料的相关试验项限值？（   ）",
    "options": [
      "确认选材类型是否有对应企标限值",
      "确认选材是否有特殊要求，如阻燃性能等",
      "内部确认是否有相关类型材料限值",
      "参照企标要求完成是试验项限值等内容填写",
      "针对内部试验项无现有企标或限值要求的，通过行业内多家体系内材料商材料水平技术评估后，编制材料大纲作为临时管控要求。"
    ],
    "correctAnswer": [
      0,
      1,
      2,
      3,
      4
    ],
    "explanation": "",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1782724225932-o86yck",
    "createdAt": 1782724225932,
    "updatedAt": 1782724225932
  },
  {
    "type": "essay",
    "question": "请简述汽车零件非金属选材的一般性原则?（提示：可列举实例）",
    "correctAnswer": "- 使用性能原则‌：确保材料满足零件在服役环境中的功能要求，如强度、耐热、耐候、耐化学腐蚀、阻燃及轻量化等（尤其对塑料、橡胶、复合材料等非金属件至关重要）。\n- 工艺性能原则‌：材料需适配成型工艺（如注塑、挤出、模压等），具备良好的流动性、热稳定性、尺寸稳定性及可连接性，以保障制造效率与良率。\n- 经济性能原则‌：在满足前两者前提下，综合考量材料成本、加工能耗、生命周期成本及回收性，实现性价比最优。\n这三原则适用于所有汽车零件材料选型，非金属件还需额外关注老化、VOC排放、防火安全等特殊工况，但核心框架不变",
    "explanation": "",
    "difficulty": "hard",
    "category": "",
    "tags": [],
    "maxLength": 200,
    "keywords": [],
    "id": "q-1782724275649-otq2e8",
    "createdAt": 1782724275649,
    "updatedAt": 1782724275649
  },
  {
    "type": "multiple",
    "question": "冰箱总成盒体零件选材为PC+ABS材料要求（   ）",
    "options": [
      "需要耐热达到100℃以上",
      "高抗冲、无卤环保阻燃、耐菌要求",
      "良好外观及加工性要求",
      "优秀的气味/VOC性能",
      "以上均需满足。"
    ],
    "correctAnswer": [
      0,
      1,
      2,
      4,
      3
    ],
    "explanation": "满足耐热、抗冲击、阻燃（如适用）、环保及加工性要求\n耐热（≥100℃）、高抗冲、阻燃（通常V-0级）、无卤环保（ELV六项/RoHS）、良好表面质感与加工性\n冰箱也有保温工况 内部最高温度到50℃，所以对材料的耐热性 也有一定要求",
    "difficulty": "medium",
    "category": "",
    "tags": [],
    "id": "q-1782724344237-hd20cb",
    "createdAt": 1782724344237,
    "updatedAt": 1782724344237
  }
];

const STORAGE_KEY = 'quizQuestions';
const BUILD_ID_KEY = 'quizQuestionsBuildId';
const DIRTY_KEY = 'quizQuestionsDirty';
const PUBLISHED_FILE_NAME = 'quiz-questions.json';
const REMOTE_PUBLISHED_URL = 'https://amyfxm0616.github.io/auto-parts-learning/quiz-questions.json';

let currentQuestions: Question[] = quizQuestions;
let initializePromise: Promise<void> | null = null;

function isBrowserEnv(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function isElectronEnv(): boolean {
  return isBrowserEnv() && !!(window as any).electronAPI?.isElectron;
}

function computeBuildId(questions: Question[]): string {
  const serialized = JSON.stringify(questions);
  let hash = 0;
  for (let i = 0; i < serialized.length; i += 1) {
    hash = (hash * 31 + serialized.charCodeAt(i)) >>> 0;
  }
  return `${questions.length}-${hash.toString(36)}`;
}

function readStoredQuestions(): Question[] | null {
  if (!isBrowserEnv()) {
    return null;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistQuestions(
  questions: Question[],
  options: { markDirty?: boolean; buildId?: string } = {}
): void {
  currentQuestions = questions;

  if (!isBrowserEnv()) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  localStorage.setItem(BUILD_ID_KEY, options.buildId ?? computeBuildId(questions));

  if (options.markDirty) {
    localStorage.setItem(DIRTY_KEY, '1');
  } else {
    localStorage.removeItem(DIRTY_KEY);
  }
}

function getPublishedQuestionUrls(): string[] {
  if (!isBrowserEnv() || typeof document === 'undefined') {
    return [];
  }

  const localPublishedUrl = new URL(PUBLISHED_FILE_NAME, document.baseURI).toString();

  if (isElectronEnv()) {
    return [REMOTE_PUBLISHED_URL, localPublishedUrl];
  }

  return [localPublishedUrl];
}

async function loadPublishedQuestions(): Promise<Question[] | null> {
  const urls = getPublishedQuestionUrls();

  for (const url of urls) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        continue;
      }

      const questions = await response.json();
      if (Array.isArray(questions)) {
        return questions as Question[];
      }
    } catch {
      // Ignore and continue to the next source.
    }
  }

  return null;
}

// 从 localStorage 获取题目
export function getQuestions(): Question[] {
  const storedQuestions = readStoredQuestions();
  if (storedQuestions) {
    currentQuestions = storedQuestions;
    return storedQuestions;
  }

  return currentQuestions;
}

// 保存题目到 localStorage
export function saveQuestions(
  questions: Question[],
  options: { markDirty?: boolean } = {}
): void {
  try {
    persistQuestions(questions, { markDirty: options.markDirty ?? true });
  } catch (e) {
    console.error('saveQuestions failed:', e);
    throw e;
  }
}

export function hasDirtyQuestions(): boolean {
  return isBrowserEnv() && localStorage.getItem(DIRTY_KEY) === '1';
}

export function markQuestionsSynced(questions: Question[] = getQuestions()): void {
  saveQuestions(questions, { markDirty: false });
}

// 添加题目
export function addQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Question {
  const questions = getQuestions();
  const now = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const newQuestion: Question = {
    ...question,
    id: `q-${now}-${random}`,
    createdAt: now,
    updatedAt: now,
  };
  questions.push(newQuestion);
  saveQuestions(questions);
  return newQuestion;
}

// 更新题目
export function updateQuestion(id: string, updates: Partial<Question>): Question | null {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  questions[index] = { ...questions[index], ...updates, updatedAt: Date.now() };
  saveQuestions(questions);
  return questions[index];
}

// 删除题目
export function deleteQuestion(id: string): boolean {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  if (filtered.length === questions.length) return false;
  saveQuestions(filtered);
  return true;
}

// 初始化题目：优先保留本地未同步编辑，再读取已发布题库，最后回退到 bundled 数据
export async function initializeQuestions(): Promise<void> {
  if (!isBrowserEnv()) {
    currentQuestions = quizQuestions;
    return;
  }

  if (initializePromise) {
    return initializePromise;
  }

  initializePromise = (async () => {
    const storedQuestions = readStoredQuestions();
    if (storedQuestions) {
      currentQuestions = storedQuestions;
    }

    if (hasDirtyQuestions() && storedQuestions) {
      return;
    }

    const publishedQuestions = await loadPublishedQuestions();
    if (publishedQuestions) {
      const publishedBuildId = computeBuildId(publishedQuestions);
      const storedBuildId = localStorage.getItem(BUILD_ID_KEY);

      if (!storedQuestions || storedBuildId !== publishedBuildId) {
        persistQuestions(publishedQuestions, { markDirty: false, buildId: publishedBuildId });
      } else {
        currentQuestions = storedQuestions;
        localStorage.removeItem(DIRTY_KEY);
      }
      return;
    }

    if (storedQuestions) {
      currentQuestions = storedQuestions;
      return;
    }

    persistQuestions(quizQuestions, { markDirty: false, buildId: computeBuildId(quizQuestions) });
  })();

  try {
    await initializePromise;
  } finally {
    initializePromise = null;
  }
}
