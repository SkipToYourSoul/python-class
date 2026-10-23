'use client';
import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { chapters, scenes, assetBase, sceneAliases } from './lesson-data';
import { LessonScenes } from './lesson-scenes';
export default function LessonSix() {
  return (
    <CourseLessonPlayer
      lessonNumber="06"
      lessonTitle="第六课"
      storageKey="ai-python-lesson-06-v3"
      scenes={scenes}
      sceneAliases={sceneAliases}
      chapters={chapters}
      coverId="l6-cover"
      downloadUrl={`${assetBase}/practice/lesson-06-practice.zip`}
      RenderScene={LessonScenes}
    />
  );
}
