'use client';

import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';

const assets = '/courses/ai-with-python/lesson-06/assets';
const phases = [
  { from: 0, text: '猫头鹰正在送来三塔情报。' },
  { from: 3, text: '接稳卷轴，解开情报。' },
  { from: 5, text: '展开情报，仔细查看三塔线索。' },
  { from: 8, text: '对照地图，准备进攻三座魔塔。' },
];

export function PreparationScene({
  completedSteps,
}: {
  completedSteps: boolean[];
}) {
  return (
    <PracticeStoryVideo
      pageId="l6-practice-01"
      title="战前情报室"
      src={assets + '/preparation-wan3-v1.mp4'}
      poster={assets + '/prep-room-v1.jpg'}
      description="勇士接过卷轴、展开情报，再对照三塔地图制定计划。"
      descriptionTrack={assets + '/preparation-wan3-v1.zh.vtt'}
      initialDuration={12.028}
      initialCaption="接过情报，准备三塔作战。"
      phases={phases}
      completeCaption="代码已就绪，去 Notebook 生成档案。"
      steps={['获取', '提取', '保存'].map((label, i) => ({
        label,
        complete: completedSteps[i] ?? false,
      }))}
      controlLabel="备战视频"
      elapsedKey="prepVideoElapsed"
      loopKey="prepSceneLoop"
      hasAudio
      compact
    />
  );
}
