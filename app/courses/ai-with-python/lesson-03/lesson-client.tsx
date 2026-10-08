'use client';
import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { chapters, scenes, assetBase } from './lesson-data';
import { LessonScenes } from './lesson-scenes';
const sceneAliases = {
  'l3-practice-03-csv': 'l3-workshop',
  'l3-practice-03-data': 'l3-csv-code',
  'l3-practice-02-write': 'l3-practice-02-source',
  'l3-practice-02-read': 'l3-practice-02-source',
  'l3-practice-01-parse': 'l3-practice-01-read',
  'l3-practice-01-actors': 'l3-practice-01-read',
};
export default function LessonThree({
  initialScene,
}: {
  initialScene?: string;
}) {
  return (
    <CourseLessonPlayer
      initialScene={initialScene}
      lessonNumber="03"
      lessonTitle="第三课"
      storageKey="ai-python-lesson-03-v1"
      scenes={scenes}
      sceneAliases={sceneAliases}
      chapters={chapters}
      coverId="l3-cover"
      downloadUrl={`${assetBase}/practice/lesson-03-practice.zip`}
      RenderScene={LessonScenes}
    />
  );
}
