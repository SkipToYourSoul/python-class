'use client';

import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';
import { ClassPracticeLayout } from './class-practice-layout';
import { usePracticeWordFill } from './practice-word-fill';
import {
  PRACTICE_02_FILL_ANSWERS,
  PRACTICE_02_FILL_CODE,
} from './practice-content';

const questions = [
  '读取 CSV 情报文件',
  '查看数据的整体信息',
  '按魔塔与弱点分组',
  '计算平均外罩强度',
  '统计守卫数量',
  '筛选外罩强度这一列',
  '按魔塔和防御力排序',
];

const wordBank = [
  'info',
  'size',
  'groupby',
  'read_csv',
  'median',
  'energy',
  'sort_values',
  'sum',
  'mean',
  'shape',
  'count',
];

export function ClassPracticeTwo() {
  const exercise = usePracticeWordFill({
    number: '02',
    source: PRACTICE_02_FILL_CODE,
    expected: PRACTICE_02_FILL_ANSWERS,
    questions,
    wordBank,
    successMessage: '全部答对！运行代码，为三支队伍制定计划。',
  });

  return (
    <ClassPracticeLayout
      number="02"
      title="补齐代码，部署三队作战计划"
      codeLabel="检查、统计与筛选代码"
      exercise={exercise}
    >
      <PracticeStoryVideo
        pageId="l6-practice-02"
        title="三队作战部署"
        src="/courses/ai-with-python/lesson-06/assets/strategy-wan3-v1.mp4"
        poster="/courses/ai-with-python/lesson-06/assets/strategy-v2.jpg"
        description="勇士对照三塔情报与地图，为三色队伍分配对应装备，交付进攻指令。"
        descriptionTrack="/courses/ai-with-python/lesson-06/assets/strategy-wan3-v1.zh.vtt"
        initialDuration={12}
        initialCaption="勇士对照情报，部署三队。"
        phases={[
          { from: 0, text: '对照情报与地图，找出突破时刻。' },
          { from: 4, text: '按守卫弱点，为三色队伍分配装备。' },
          { from: 8, text: '交付作战指令，三队准备出发。' },
        ]}
        hasAudio
        compact
      />
    </ClassPracticeLayout>
  );
}
