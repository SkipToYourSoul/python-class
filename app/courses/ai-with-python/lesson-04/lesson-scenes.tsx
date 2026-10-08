'use client';
import { PracticeReadCode } from './practice-read-code';
import { PracticeTwoEntry } from './practice-two-entry';
import { PracticeThreeEntry, PracticeThreeCode } from './practice-three';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { CoverScene } from './cover-scene';
import { FirstPractice } from './first-practice';
import { PandasIntro } from './pandas-intro';
import { PlanScene } from './plan-scene';
import { AnalysisRecap } from './analysis-recap';
import { DataStructuresScene } from './data-structures';
import { chapters, scenes } from './lesson-data';
import {
  Opening,
  PandasScene,
  QuestionsScene,
  Roadmap,
  SeriesScene,
  StructureScene,
  SuspectsScene,
  TableScene,
  TypesScene,
} from './observe-scenes';
import {
  AggregateScene,
  CodeScene,
  TrapScene,
  codeKeys,
} from './analyze-scenes';
import { ChallengeEntry, SummaryScene } from './finish-scenes';
import { AllRecordsScene } from './all-records-scene';
import {
  DataKindsScene,
  CategoryExamplesScene,
  NumericExamplesScene,
} from './data-foundations';

export function LessonScenes({ id }: { id: string }) {
  if (id === 'l4-cover') return <CoverScene />;
  const scene = scenes.find((x) => x.id === id);
  if (!scene) return null;
  if (id.endsWith('-cover')) {
    const chapter = chapters.find((x) => x.id === scene.chapter)!;
    const tasks: Record<string, string> = {
      look: '看懂战报，写下你的调查办法',
      smell: '读入 CSV，建立调查工作表',
      analyze: '分析平均值与次数，生成有依据的调查名单',
    };
    return (
      <ChapterCover
        number={chapter.number}
        kicker={`DATA DETECTIVE · ${chapter.title.split('：')[0]}`}
        title={
          <>
            {chapter.title.split('：')[0]}：<br />
            {chapter.title.split('：')[1]}
          </>
        }
        task={tasks[chapter.id]}
      />
    );
  }
  const key = codeKeys.find((x) => id === `l4-${x}`);
  if (key) return <CodeScene kind={key} />;
  switch (id) {
    case 'l4-opening':
      return <Opening />;
    case 'l4-suspects':
      return <SuspectsScene />;
    case 'l4-roadmap':
      return <Roadmap />;
    case 'l4-types':
      return <TypesScene />;
    case 'l4-data-kinds':
      return <DataKindsScene />;
    case 'l4-categories':
      return <CategoryExamplesScene />;
    case 'l4-quantities':
      return <NumericExamplesScene />;
    case 'l4-all-records':
      return <AllRecordsScene />;
    case 'l4-table':
      return <TableScene />;
    case 'l4-structure':
      return <StructureScene />;
    case 'l4-practice-01':
      return <FirstPractice />;
    case 'l4-pandas-intro':
      return <PandasIntro />;
    case 'l4-data-structures':
      return <DataStructuresScene />;
    case 'l4-pandas':
      return <PandasScene />;
    case 'l4-series':
      return <SeriesScene />;
    case 'l4-practice-02':
      return <PracticeTwoEntry />;
    case 'l4-practice-02-code':
      return <PracticeReadCode />;
    case 'l4-question':
      return <QuestionsScene />;
    case 'l4-save':
      return <AnalysisRecap />;
    case 'l4-plan':
      return <PlanScene />;
    case 'l4-aggregate':
      return <AggregateScene />;
    case 'l4-practice-03':
      return <PracticeThreeEntry />;
    case 'l4-practice-03-code':
      return <PracticeThreeCode />;
    case 'l4-trap':
      return <TrapScene />;
    case 'l4-challenge-entry':
      return <ChallengeEntry />;
    case 'l4-summary':
      return <SummaryScene />;
    default:
      return null;
  }
}
