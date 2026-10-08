'use client';
import { CourseLessonPlayer } from '@/components/course/lesson-player';
import { chapters, scenes, assetBase } from './lesson-data';
import { LessonScenes } from './lesson-scenes';

const sceneAliases = {
  'l4-practice-03-stat': 'l4-practice-03-code',
  'l4-practice-03-finish': 'l4-practice-03-code',
  'l4-ask-cover': 'l4-analyze-cover',
  'l4-evidence': 'l4-challenge-entry',
  'l4-case': 'l4-challenge-entry',
  'l4-checkpoint-01': 'l4-practice-03',
  'l4-checkpoint-02': 'l4-practice-03',
};

export default function LessonFour() {
  return (
    <CourseLessonPlayer
      lessonNumber="04"
      lessonTitle="第四课"
      storageKey="ai-python-lesson-04-v1"
      scenes={scenes}
      chapters={chapters}
      coverId="l4-cover"
      downloadUrl={`${assetBase}/practice/lesson-04-practice.zip`}
      RenderScene={LessonScenes}
      sceneAliases={sceneAliases}
    />
  );
}
