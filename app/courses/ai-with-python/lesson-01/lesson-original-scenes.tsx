/* oxlint-disable next/no-img-element -- Supplied course art. */
import { ArrowRight, Play, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import { scenes } from './lesson-data';
import { SceneHeading } from './lesson-ui';
import { XiaopaiMascot } from './xiaopai-mascot';
type RoadmapTaskKind = 'clues' | 'lab' | 'model';

const roadmapTasks: {
  id: 'chapter-1' | 'chapter-2' | 'chapter-3';
  number: string;
  label: string;
  title: string;
  copy: string;
  kind: RoadmapTaskKind;
}[] = [
  {
    id: 'chapter-1',
    number: '01',
    label: 'GATE MYSTERY',
    title: '调查守门难题',
    copy: '认识 AI 能做什么，了解机器怎样从例子中学习。',
    kind: 'clues',
  },
  {
    id: 'chapter-2',
    number: '02',
    label: 'TRAINING WORKSHOP',
    title: '搭建训练工坊',
    copy: '使用 JupyterLab 编写、运行并保存 Python 实验笔记。',
    kind: 'lab',
  },
  {
    id: 'chapter-3',
    number: '03',
    label: 'SMART GATEKEEPER',
    title: '训练智能守门员',
    copy: '用 Python 训练模型，判断勇士与恶魔，并检验预测结果。',
    kind: 'model',
  },
];

function OpeningGateAlertIllustration() {
  return (
    <svg
      className="opening-gate-illustration"
      viewBox="0 0 420 230"
      aria-hidden="true"
      focusable="false"
    >
      <path className="opening-gate-ground" d="M20 198H400" />
      <circle className="opening-gate-sun" cx="82" cy="66" r="45" />
      <path
        className="opening-gate-castle"
        d="M148 77H176V53H198V77H222V53H244V77H272V198H148ZM181 198V144C181 123 194 110 210 110C226 110 239 123 239 144V198Z"
      />
      <path className="opening-gate-door" d="M181 198V146H239V198" />
      <path className="opening-gate-flag" d="M210 53V20L262 37L210 53Z" />

      <g className="opening-gate-warrior">
        <circle cx="75" cy="121" r="18" />
        <path d="M58 116L75 93L92 116" />
        <path d="M48 191L54 151C56 135 64 128 75 128C86 128 94 135 96 151L102 191Z" />
        <path d="M48 148L28 174M101 148L119 166" />
        <path d="M30 149V190M22 159H38" />
        <path
          className="opening-gate-shield"
          d="M97 151L124 158V177C124 192 114 201 97 208C80 201 70 192 70 177V158Z"
        />
      </g>

      <g className="opening-gate-demon">
        <circle cx="342" cy="121" r="18" />
        <path d="M327 111L317 89L337 101M357 111L367 89L347 101" />
        <path d="M314 191L321 151C324 135 332 128 342 128C352 128 360 135 363 151L370 191Z" />
        <path d="M320 150L300 174M364 150L384 173" />
        <path d="M367 158C398 153 402 181 383 188C374 191 372 181 379 178" />
        <circle className="opening-gate-eye" cx="336" cy="120" r="3" />
        <circle className="opening-gate-eye" cx="348" cy="120" r="3" />
      </g>

      <g className="opening-gate-question">
        <circle cx="210" cy="96" r="24" />
        <path d="M201 89C202 80 218 78 220 89C222 97 211 99 210 106M210 115V116" />
      </g>
      <path className="opening-gate-path" d="M123 183H168M252 183H298" />
    </svg>
  );
}

function RoadmapTaskIllustration({ kind }: { kind: RoadmapTaskKind }) {
  return (
    <div className="roadmap-task-art" aria-hidden="true">
      <svg viewBox="0 0 360 190" focusable="false">
        <path
          className="roadmap-art-grid"
          d="M20 38H340M20 76H340M20 114H340M20 152H340M60 18V172M110 18V172M160 18V172M210 18V172M260 18V172M310 18V172"
        />
        {kind === 'clues' ? (
          <>
            <circle className="roadmap-art-yellow" cx="83" cy="70" r="45" />
            <rect
              className="roadmap-art-paper"
              x="137"
              y="31"
              width="157"
              height="86"
            />
            <path
              className="roadmap-art-line"
              d="M158 57H267M158 79H239M158 100H206"
            />
            <path
              className="roadmap-art-dots"
              d="M48 133H110M48 151H110M48 169H110"
            />
            <rect
              className="roadmap-art-coral"
              x="114"
              y="135"
              width="34"
              height="34"
            />
            <circle className="roadmap-art-lens" cx="236" cy="119" r="40" />
            <path className="roadmap-art-handle" d="M264 148L303 176" />
            <circle className="roadmap-art-blue" cx="236" cy="119" r="8" />
          </>
        ) : null}
        {kind === 'lab' ? (
          <>
            <circle className="roadmap-art-yellow" cx="294" cy="48" r="34" />
            <rect
              className="roadmap-art-paper"
              x="38"
              y="25"
              width="284"
              height="143"
            />
            <path className="roadmap-art-navy-fill" d="M38 25H322V56H38Z" />
            <circle className="roadmap-art-coral" cx="58" cy="40" r="6" />
            <circle className="roadmap-art-yellow" cx="78" cy="40" r="6" />
            <circle className="roadmap-art-blue" cx="98" cy="40" r="6" />
            <path className="roadmap-art-line" d="M92 76V148" />
            <path
              className="roadmap-art-code"
              d="M120 80H252M120 102H285M120 124H232M120 146H270"
            />
            <path
              className="roadmap-art-brackets"
              d="M70 82L55 96L70 110M276 78L291 96L276 114"
            />
            <rect
              className="roadmap-art-coral"
              x="119"
              y="76"
              width="42"
              height="8"
            />
            <circle className="roadmap-art-blue" cx="251" cy="124" r="8" />
          </>
        ) : null}
        {kind === 'model' ? (
          <>
            <circle className="roadmap-art-yellow" cx="104" cy="78" r="54" />
            <path
              className="roadmap-art-castle"
              d="M40 72H72V50H94V72H118V50H140V72H172V166H40ZM74 166V126H104V166Z"
            />
            <rect
              className="roadmap-art-coral"
              x="122"
              y="112"
              width="24"
              height="24"
            />
            <path
              className="roadmap-art-tree"
              d="M230 47V80M230 80L194 111M230 80L276 111M194 111L178 148M194 111L214 148M276 111L258 148M276 111L300 148"
            />
            <circle className="roadmap-art-blue" cx="230" cy="43" r="13" />
            <circle className="roadmap-art-yellow" cx="194" cy="111" r="11" />
            <circle className="roadmap-art-coral" cx="276" cy="111" r="11" />
            <circle className="roadmap-art-node" cx="178" cy="151" r="9" />
            <circle className="roadmap-art-node" cx="214" cy="151" r="9" />
            <circle className="roadmap-art-node" cx="258" cy="151" r="9" />
            <circle className="roadmap-art-node" cx="300" cy="151" r="9" />
          </>
        ) : null}
      </svg>
    </div>
  );
}

export function ChapterCover({
  number,
  title,
  kicker,
  task,
}: {
  number: string;
  title: ReactNode;
  kicker: string;
  task: ReactNode;
}) {
  return (
    <div className="atlas-chapter-brief atlas-chapter-brief-simple">
      <header>
        <span>
          CHAPTER {number} · {kicker}
        </span>
        <h2>{title}</h2>
      </header>
      <div className="atlas-brief-number" aria-hidden="true">
        {number}
      </div>
      <footer>
        <span>本章任务</span>
        <p>{task}</p>
      </footer>
    </div>
  );
}

export function OriginalScene({
  id,
  navigateTo,
}: {
  id: string;
  navigateTo: (index: number) => void;
}) {
  switch (id) {
    case 'start-cover':
      return (
        <div className="lesson-opening">
          <div className="opening-copy">
            <div className="opening-course-title">
              <strong>AI WITH PYTHON</strong>
              <span>LESSON 1</span>
            </div>
            <h1>
              走进 <em>AI</em> 世界
            </h1>
            <div className="opening-story-card">
              <div className="opening-story-visual">
                <OpeningGateAlertIllustration />
              </div>
              <div className="opening-story-copy">
                <span className="opening-story-kicker">
                  CASTLE ALERT · 城门警报
                </span>
                <p>
                  训练一名能识别<strong>勇士</strong>与<strong>恶魔</strong>的
                  AI 守门员。
                </p>
                <div className="opening-story-steps" aria-label="三项任务步骤">
                  <span>
                    <b>01</b>调查
                  </span>
                  <span>
                    <b>02</b>搭建
                  </span>
                  <span>
                    <b>03</b>训练
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="opening-art">
            <div className="opening-orbit" aria-hidden="true" />
            <span className="opening-signal signal-one" aria-hidden="true" />
            <span className="opening-signal signal-two" aria-hidden="true" />
            <XiaopaiMascot />
            <div className="opening-accept-bubble">
              <span>小派 · 任务已就绪</span>
              <strong>准备好守卫你的城堡了吗？</strong>
              <button
                className="primary-cta is-ready"
                type="button"
                onClick={() => navigateTo(1)}
              >
                <Play size={20} fill="currentColor" /> 接受任务
              </button>
            </div>
          </div>
        </div>
      );

    case 'start-roadmap':
      return (
        <>
          <SceneHeading
            kicker="MISSION MAP · 本课任务地图"
            title="三项任务，训练智能守门员"
          />
          <div className="lesson-roadmap" aria-label="三项课堂任务">
            {roadmapTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() =>
                  navigateTo(
                    scenes.findIndex(
                      (scene) => scene.id === `${task.id}-cover`,
                    ),
                  )
                }
              >
                <header className="roadmap-task-head">
                  <span>{task.number}</span>
                  <small>{task.label}</small>
                </header>
                <RoadmapTaskIllustration kind={task.kind} />
                <div className="roadmap-task-copy">
                  <strong>{task.title}</strong>
                  <p>{task.copy}</p>
                </div>
                <span className="roadmap-task-action">
                  进入任务 <ArrowRight />
                </span>
              </button>
            ))}
          </div>
          <p className="scene-teacher-note">
            <Lightbulb /> 点击任意任务卡，可以直接进入对应章节。
          </p>
        </>
      );

    case 'chapter-1-cover':
      return (
        <ChapterCover
          number="01"
          kicker="AI INVESTIGATION"
          title={
            <>
              机器真的会
              <br />
              <em>“思考”</em>吗？
            </>
          }
          task={
            <>
              从图灵的提问出发，沿着 AI
              的发展线索，了解机器如何从数据中学习、找到规律并作出预测。
            </>
          }
        />
      );

    case 'chapter-2-cover':
      return (
        <ChapterCover
          number="02"
          kicker="PYTHON WORKSHOP"
          title={
            <>
              启动 AI
              <br />
              <em>工具台</em>
            </>
          }
          task={
            <>
              认识 Anaconda 与 JupyterLab，创建、运行并保存笔记本，让第一行
              Python 代码真正跑起来。
            </>
          }
        />
      );

    case 'chapter-3-cover':
      return (
        <ChapterCover
          number="03"
          kicker="MODEL TRAINING"
          title={
            <>
              训练城堡
              <br />
              <em>守门模型</em>
            </>
          }
          task="把角色变成数据，训练一名 AI 守门员。"
        />
      );
    default:
      return null;
  }
}
