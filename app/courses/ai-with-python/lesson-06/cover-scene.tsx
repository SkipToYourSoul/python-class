import { LessonCover } from '@/components/course/ai-with-python/lesson-cover';
import { assetBase } from './lesson-data';

export function CoverScene() {
  return (
    <LessonCover
      lessonLabel="第六课 · LESSON 06"
      title={['决战', '魔王']}
      subtitle="综合练习一"
      description="用数据找到破盾时机"
      nextScene="l6-recap"
      startLabel="迎接最终决战"
      story={{
        label: '第六课开场漫画',
        question: '护盾为何不断恢复？',
        image: `${assetBase}/assets/opening.jpg`,
        alt: '勇士与小派带着恶魔图鉴抵达魔堡，攻击被魔王的紫色护盾挡住；机械猫头鹰发现，三座供能塔正在给护盾补充能量。',
        width: 1672,
        height: 941,
        setup: '勇士已抵达魔王面前，却被不断恢复的护盾挡住。',
        hook: '三塔全部击破，才能直面魔王。',
      }}
    />
  );
}
