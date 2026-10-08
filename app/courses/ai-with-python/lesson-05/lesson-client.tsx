'use client';
import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { chapters, scenes, assetBase, sceneAliases } from './lesson-data';
import { LessonScenes } from './lesson-scenes';
export default function LessonFive() {
  return (
    <CourseLessonPlayer
      lessonNumber="05"
      lessonTitle="第五课"
      storageKey="ai-python-lesson-05-v1"
      scenes={scenes}
      sceneAliases={sceneAliases}
      chapters={chapters}
      coverId="l5-cover"
      downloadUrl={`${assetBase}/practice/lesson-05-practice.zip`}
      RenderScene={LessonScenes}
    />
  );
}
