/* oxlint-disable next/no-img-element -- Course illustrations are local assets. */
'use client';
import { useContext } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  ShieldCheck,
  Table2,
} from 'lucide-react';
import { LessonState } from '@/components/course/lesson-state';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { CheckpointTaskTemplate } from '@/components/course/ai-with-python/practice-templates';
import { assetBase, chapters, scenes } from './lesson-data';
import {
  ComicScene,
  FileSheet,
  Guide,
  LessonStage,
  PracticeTools,
} from './lesson-ui';
import { ReadScene } from './read-scenes';
import { WriteScene } from './write-scenes';
import { PracticeScene } from './practice-scenes';
import { OrganizeScene } from './organize-scenes';
import { ArchiveGame } from './archive-game';
import { practiceSource } from './practice-content';
import { CoverScene } from './cover-scene';
import { RecapScene } from './recap-scene';
import s from './lesson.module.css';

export function LessonScenes({ id }: { id: string }) {
  if (id === 'l3-cover') return <CoverScene />;
  if (id === 'l3-recap') return <RecapScene />;
  if (id === 'l3-movie-story') return <ComicScene story="movie" />;
  if (id === 'l3-handoff-story') return <ComicScene story="handoff" />;
  if (id === 'l3-rescue-story') return <ComicScene story="rescue" />;
  const scene = scenes.find((item) => item.id === id);
  if (!scene) return null;
  if (id.endsWith('-cover')) {
    const chapter = chapters.find((item) => item.id === scene.chapter)!;
    const detail = {
      read: {
        kicker: 'READ',
        task: '读取文件，解析电影信息',
      },
      write: {
        kicker: 'WRITE',
        task: '写入文件，保存侦察记录',
      },
      organize: {
        kicker: 'USE',
        task: '整理情报，完成守城挑战',
      },
    }[chapter.id as 'read' | 'write' | 'organize'];
    return (
      <ChapterCover
        number={chapter.number}
        title={
          <>
            <span className={s.chapterTitleLine}>
              {chapter.title.split('：')[0]}：
            </span>
            <br />
            <span className={s.chapterTitleLine}>
              {chapter.title.split('：')[1]}
            </span>
          </>
        }
        kicker={detail.kicker}
        task={detail.task}
      />
    );
  }
  if (id.startsWith('l3-practice-')) return <PracticeScene id={id} />;
  if (id === 'l3-challenge-entry') return <ChallengeEntry />;
  if (id === 'l3-challenge') return <ArchiveGame />;
  if (id === 'l3-checkpoint' || id === 'l3-checkpoint-02')
    return <Homework second={id.endsWith('-02')} />;
  if (id === 'l3-summary') return <Summary />;
  if (scene.chapter === 'read') return <ReadScene id={id} />;
  if (scene.chapter === 'write') return <WriteScene id={id} />;
  return <OrganizeScene id={id} />;
}
function ChallengeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage title="守住城堡档案室" label="CHALLENGE · 城堡档案官">
      <div className={s.two}>
        <img
          className={s.challengeArt}
          src={`${assetBase}/assets/archive-siege/challenge-entry-demons.png`}
          alt="城堡档案室的窗外，炎角兽和藤甲魔正沿石桥逼近，冰翼魔从空中飞来；室内档案柜与暖灯仍完好。"
        />
        <div className={`${s.stack} ${s.center}`}>
          <h3>网络中断，恶魔即将抵达！</h3>
          <p>找到本地档案，整理情报，保存防御 CSV。</p>
          <p>全班共同指挥，在 5 分钟内完成三步任务。</p>
          <div className={s.feedback}>
            <strong>通关证据</strong>
            <br />
            情报准确，档案保存，三道防线启动。教师可随时暂停讨论。
          </div>
          <div>
            <button
              className={s.primary}
              onClick={() => navigate('l3-challenge')}
            >
              接受档案任务 <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
function Homework({ second }: { second: boolean }) {
  const task = second
    ? practiceSource.homework.atlas
    : practiceSource.homework.file;
  return (
    <div className={s.homework}>
      <CheckpointTaskTemplate
        number={second ? '02' : '01'}
        title={task.title}
        question={task.question}
        instruction={task.instruction}
        tip={task.tip}
      >
        <div className={`${s.stack} ${s.center}`}>
          <h3>{second ? '任选一种创作方向' : '完成后，拿出这些证据'}</h3>
          {second ? (
            <>
              {practiceSource.homework.atlas.directions.map((direction) => (
                <p key={direction}>{direction}</p>
              ))}
              <FileSheet name="核对清单">
                <p>{practiceSource.homework.atlas.evidence}</p>
              </FileSheet>
            </>
          ) : (
            <>
              {practiceSource.homework.file.evidence.map((evidence, index) => (
                <p key={evidence}>
                  {['①', '②', '③'][index]} {evidence}
                </p>
              ))}
              <FileSheet name="再试一个变化">
                <p>{practiceSource.homework.file.variation}</p>
              </FileSheet>
            </>
          )}
          <PracticeTools />
        </div>
      </CheckpointTaskTemplate>
    </div>
  );
}
function Summary() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage
      title="带走一套保存情报的方法"
      label="FIELD NOTES · 本课收获"
      footer={<PracticeTools />}
    >
      <div className={s.two}>
        <div className={s.summaryPath}>
          <div>
            <BookOpen />
            <span>
              <strong>读进来</strong>
              <br />
              open · r · read
            </span>
          </div>
          <div>
            <FileText />
            <span>
              <strong>写下来</strong>
              <br />
              open · w · write · \n
            </span>
          </div>
          <div>
            <Table2 />
            <span>
              <strong>整理好，再使用</strong>
              <br />
              固定字段 · CSV · 图鉴
            </span>
          </div>
        </div>
        <div className={`${s.paper} ${s.center}`}>
          <ShieldCheck size={64} color="#1457d9" />
          <h3>记录留住了，新的问题来了</h3>
          <p>电影资料越来越多，哪位演员出现在多部电影中？</p>
          <Guide>下次，我们从保存的数据里寻找更多线索。</Guide>
          <div>
            <button onClick={() => navigate('l3-challenge-entry')}>
              再挑战一次
            </button>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
