'use client';
import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { chapters, scenes, assetBase } from './lesson-data';
import { LessonScenes } from './lesson-scenes';

const sceneAliases = {
  'l2-route': 'l2-mission',
  'l2-ai': 'l2-practice-03',
  'l2-detail': 'l2-practice-03',
  'l2-checkpoint': 'l2-summary',
};
export default function LessonTwo({ initialScene }: { initialScene?: string }) {
  return (
    <CourseLessonPlayer
      initialScene={initialScene}
      lessonNumber="02"
      lessonTitle="第二课"
      storageKey="ai-python-lesson-02-v1"
      scenes={scenes}
      chapters={chapters}
      coverId="l2-cover"
      downloadUrl={`${assetBase}/practice/lesson-02-practice.zip`}
      RenderScene={LessonScenes}
      sceneAliases={sceneAliases}
    />
  );
}
