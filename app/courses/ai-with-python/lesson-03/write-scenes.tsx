/* oxlint-disable next/no-img-element -- Local, character-consistent classroom comic. */
'use client';
import { ArrowRight, FileText, Laptop } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { CodeDialog, Guide, LessonStage, Steps } from './lesson-ui';
import { assetBase } from './lesson-data';
import { INTEL_RECORDS, READ_MOVIE } from './practice-content';
import { WriteModesScene } from './write-modes-scene';
import { WriteNewlineScene } from './write-newline-scene';
import { WriteLineBreakScene } from './write-line-break-scene';
import s from './write-story.module.css';

const note = `${INTEL_RECORDS[0].name}｜${INTEL_RECORDS[0].location}｜${INTEL_RECORDS[0].weakness}`;
const readCode = READ_MOVIE.split('\n').slice(0, 3).join('\n');
const writeCode = `note = "${note}"\npath = "./handover.txt"\nwith open(path, "w", encoding="utf-8") as f:\n    f.write(note)`;
const checkCode =
  'with open(path, "r", encoding="utf-8") as f:\n    text = f.read()\n\nprint(text)';
const acts = [
  {
    title: '打开一份档案',
    action: '打开文件',
    caption: '管理员：“给这份交接档案一个名字。”',
    detail: '告诉程序存在哪里，再以写入方式打开。',
    alt: '管理员把打开的空档案递给勇士，小派在旁观看。',
  },
  {
    title: '写下侦察情报',
    action: '写入内容',
    caption: '勇士：“炎角兽怕强光，记下来！”',
    detail: '把程序里的文字写进文件，供下一班读取。',
    alt: '勇士把侦察记录写在档案纸上，小派指向记录。',
  },
  {
    title: '合上档案，交班！',
    action: '关闭文件',
    caption: '管理员：“已经存好，下次还能打开。”',
    detail: '写完关闭文件；程序结束后，文件仍保留。',
    alt: '管理员把写好并合上的档案放入书架，勇士和小派在旁观看。',
  },
];

export function WriteScene({ id }: { id: string }) {
  if (id === 'l3-screen-file') return <WriteJourney />;
  if (id === 'l3-write-code') return <WriteCode />;
  if (id === 'l3-modes') return <WriteModesScene />;
  if (id === 'l3-write-lines') return <WriteLineBreakScene />;
  return <WriteNewlineScene />;
}
function ArchiveComic({ step, caption }: { step: number; caption: string }) {
  return (
    <figure className={s.comic}>
      <div className={s.frame}>
        <img
          src={`${assetBase}/assets/write-archive-journey.png`}
          alt={acts[step].alt}
          style={{ transform: `translateX(-${(step * 100) / 3}%)` }}
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
function WriteJourney() {
  const [state, update] = usePageState({ step: 0 });
  return (
    <LessonStage
      title="写文件，像存入一份新档案"
      label="WRITE · 档案馆里的交接任务"
      footer={
        <Guide>
          读文件：把已有内容取进程序。写文件：把程序里的内容存进文件。
        </Guide>
      }
    >
      <div className={s.journey}>
        <ArchiveComic step={state.step} caption={acts[state.step].caption} />
        <div className={s.journeyExplanation}>
          <p className={s.mission}>下一班勇士要来取情报，我们把它存好。</p>
          <fieldset className={s.journeySteps} aria-label="写文件的三个步骤">
            {acts.map((act, index) => (
              <button
                key={act.action}
                aria-pressed={state.step === index}
                onClick={() => update({ step: index })}
              >
                <span className={s.number}>0{index + 1}</span>
                <span>
                  <strong>{act.title}</strong>
                  <small>对应：{act.action}</small>
                </span>
              </button>
            ))}
          </fieldset>
          <p className={s.detail} aria-live="polite">
            {acts[state.step].detail}
          </p>
          <div className={s.direction} aria-label="内容从程序流向文件">
            <span>
              <Laptop aria-hidden="true" />
              程序中的情报
            </span>
            <ArrowRight aria-hidden="true" />
            <span>
              <FileText aria-hidden="true" />
              本地文件
            </span>
          </div>
          <p className={s.analogy}>
            档案馆是比喻；电脑实际把文件保存在存储设备上。
          </p>
        </div>
      </div>
    </LessonStage>
  );
}
function WriteCode() {
  const [savedState, update] = usePageState({ step: 0 });
  // The previous version had four steps; preserve saved progress within this three-step scene.
  const state = { ...savedState, step: Math.min(savedState.step, 2) };
  const explanation = [
    <>
      地址仍用相对路径。<strong>r</strong> 打开来读，<strong>w</strong>{' '}
      打开来写；<strong>as f</strong> 给打开的文件起个临时名字。
    </>,
    <>
      <strong>read()</strong> 把内容读进变量；<strong>write(note)</strong>{' '}
      把变量里的文字写进文件。<strong>utf-8</strong> 让中文按相同编码读写。
    </>,
    <>
      读和写都放在 <strong>with</strong> 里。离开它的缩进范围，文件会
      <strong>自动关闭</strong>，不用另写 close()。
    </>,
  ];
  return (
    <LessonStage
      title="同样三步，把“读”换成“写”"
      label="WRITE · 对照读文件的老方法"
      footer={<Guide>{explanation[state.step]}</Guide>}
    >
      <Steps
        labels={['打开：r → w', '内容：读 → 写', '用完：自动关闭']}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.codeWorkspace}>
        <div className={s.codeColumn}>
          <NotebookPanel
            compact
            title="读取 · 文件 → 程序"
            cells={[
              {
                code: readCode,
                activeLines: [[0, 1], [2], [1, 2]][state.step],
              },
            ]}
          />
          <NotebookPanel
            compact
            title="写入 · 程序 → 文件"
            cells={[
              {
                code: writeCode,
                activeLines: [
                  [1, 2],
                  [0, 3],
                  [2, 3],
                ][state.step],
              },
            ]}
          />
          <div className={s.codeTools}>
            <CodeDialog
              title="完整代码与核对"
              code={`${writeCode}\n\n${checkCode}`}
              output={note}
              note="在练习文件夹打开 JupyterLab，从上到下运行：写下第一条情报，再以 r 重新打开核对。w 会清空已有的 handover.txt；下一页观察这个过程。"
            />
            <span>本页先写一条，后面再写三条。</span>
          </div>
        </div>
        <div className={s.codeStory}>
          <ArchiveComic step={state.step} caption={acts[state.step].caption} />
          <div className={s.keyword}>
            <strong>
              {
                ['open(..., "w", ...)', 'f.write(note)', 'with 自动关闭'][
                  state.step
                ]
              }
            </strong>
            <span>
              {
                [
                  '打开目标文件，准备写入',
                  '把情报从程序送进文件',
                  '缩进内的操作结束，合上档案',
                ][state.step]
              }
            </span>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
