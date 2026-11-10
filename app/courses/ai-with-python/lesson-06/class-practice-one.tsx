'use client';

import { ClassPracticeLayout } from './class-practice-layout';
import { usePracticeWordFill } from './practice-word-fill';
import { PreparationScene } from './preparation-scene';
import {
  PRACTICE_01_FILL_CODE,
  PRACTICE_01_FILL_ANSWERS,
} from './practice-content';

const questions = [
  '导入获取网页的库',
  '导入解析网页的工具',
  '请求情报站网页',
  '找到网页中的情报区域',
  '填写情报区域的 id',
  '提取区域中的文字',
  '打开本地文件',
  '把情报写入文件',
];

const wordBank = [
  'get_text',
  'post',
  'open',
  'requests',
  'select',
  'intel-data',
  'read',
  'BeautifulSoup',
  'write',
  'html.parser',
  'find',
  'get',
];

export function ClassPracticeOne() {
  const exercise = usePracticeWordFill({
    number: '01',
    source: PRACTICE_01_FILL_CODE,
    expected: PRACTICE_01_FILL_ANSWERS,
    questions,
    wordBank,
    successMessage: '全部答对！运行代码，带回作战档案。',
  });
  const { answers, checkedAnswers, correct, hasChecked } = exercise;
  const completedSteps = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7],
  ].map((group) =>
    group.every(
      (index) =>
        hasChecked &&
        correct[index] &&
        answers[index] === checkedAnswers[index],
    ),
  );

  return (
    <ClassPracticeLayout
      number="01"
      title="补齐代码，带回三塔情报"
      codeLabel="获取、提取与保存代码"
      exercise={exercise}
    >
      <PreparationScene completedSteps={completedSteps} />
    </ClassPracticeLayout>
  );
}
