'use client';

import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { assetBase, chapters, scenes } from './lesson-data';
import { LessonScenes } from './lesson-scenes';

export default function LessonSeven() {
  return (
    <CourseLessonPlayer
      lessonNumber="07"
      lessonTitle="送你一朵小红花"
      storageKey="ai-python-lesson-07-v1"
      coverId="l7-cover"
      scenes={scenes}
      chapters={chapters}
      downloadUrl={`${assetBase}/practice/lesson-07-practice.zip`}
      RenderScene={LessonScenes}
    />
  );
}
