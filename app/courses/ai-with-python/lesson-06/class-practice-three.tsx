'use client';

import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';
import { ClassPracticeLayout } from './class-practice-layout';
import { usePracticeWordFill } from './practice-word-fill';
import {
  PRACTICE_03_FILL_ANSWERS,
  PRACTICE_03_FILL_CODE,
} from './practice-content';

const questions = [
  '读取自己保存的 CSV',
  '选择折线图方法',
  '横轴表示观测时刻',
  '纵轴表示外罩强度',
  '按魔塔分类着色',
  '选择散点图方法',
  '横轴表示守卫防御力',
];

const wordBank = [
  'scatterplot',
  'title',
  'hour',
  'lineplot',
  'kind',
  'defense',
  'read_csv',
  'barplot',
  'energy',
  'color',
  'hue',
];

export function ClassPracticeThree() {
  const exercise = usePracticeWordFill({
    number: '03',
    source: PRACTICE_03_FILL_CODE,
    expected: PRACTICE_03_FILL_ANSWERS,
    questions,
    wordBank,
    successMessage: '7 空全对！到 Notebook 运行，生成两张图。',
  });

  return (
    <ClassPracticeLayout
      number="03"
      title="补齐代码，为三队绘制作战图"
      codeLabel="折线图与散点图代码"
      exercise={exercise}
    >
      <PracticeStoryVideo
        pageId="l6-practice-03"
        title="三队攻塔战役"
        src="/courses/ai-with-python/lesson-06/assets/tower-assault-wan3-v1.mp4"
        poster="/courses/ai-with-python/lesson-06/assets/tower-assault.jpg"
        description="三支队伍依次突破魔塔：北塔用强光解开外罩，东塔用火焰清开藤蔓，西塔用热量融开冰层。"
        descriptionTrack="/courses/ai-with-python/lesson-06/assets/tower-assault-wan3-v1.zh.vtt"
        initialDuration={15}
        initialCaption="三队按时刻与弱点，发起进攻。"
        phases={[
          { from: 0, text: '北塔：强光解开外罩。' },
          { from: 5, text: '东塔：火焰清开藤蔓。' },
          { from: 10, text: '西塔：热量融开冰层。' },
          { from: 13.5, text: '三塔通道已打开，队伍继续前进。' },
        ]}
        hasAudio
        compact
      />
    </ClassPracticeLayout>
  );
}
