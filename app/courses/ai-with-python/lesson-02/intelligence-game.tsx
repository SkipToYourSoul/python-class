/* oxlint-disable next/no-img-element -- Local generated game artwork. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code is keyboard accessible. */
'use client';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Castle,
  RadioTower,
  ShieldCheck,
  Flame,
  Leaf,
  Snowflake,
  Pause,
  Play,
  RotateCcw,
  Check,
  ArrowRight,
  Code2,
  Flag,
  Timer,
  Trophy,
} from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import { assetBase } from './lesson-data';
import { LessonState, usePageState } from './lesson-state';
import { NotebookPanel } from './notebook-panels';
import { levels, type IntelRecord } from './challenge-data';
import {
  initialDefense,
  judgeAnswer,
  remainingAt,
  firstTryCount,
  WRONG_ANSWER_PENALTY_MS,
  type DefenseState,
} from './challenge-engine';
import g from './intelligence-game.module.css';

const formula = ['根据属性', '寻找元素', '获取文本'];
const atlas = `${assetBase}/assets/defense-demons-ivory.png`;
function Demon({ name, small = false }: { name: string; small?: boolean }) {
  const index = name === '炎角兽' ? 0 : name === '藤甲魔' ? 1 : 2;
  return (
    <span
      aria-hidden="true"
      className={`${g.demon} ${small ? g.smallDemon : ''}`}
      style={{
        backgroundImage: `url(${atlas})`,
        backgroundPosition: `${index * 50}% 50%`,
      }}
    />
  );
}
function TorchDefense() {
  return (
    <figure className={g.torchLine} aria-label="三支燃烧的木柄火把组成防线">
      {[0, 1, 2].map((index) => (
        <svg key={index} viewBox="0 0 80 160" aria-hidden="true">
          <ellipse cx="40" cy="149" rx="25" ry="7" fill="#071a3d55" />
          <path
            d="M30 70 L50 70 L46 147 Q40 154 34 147 Z"
            fill="#85421e"
            stroke="#492c20"
            strokeWidth="3"
          />
          <path
            d="M35 79 L40 145"
            fill="none"
            stroke="#d99b53"
            strokeWidth="4"
          />
          <g className={g.torchFlame}>
            <path
              d="M40 80 C8 80 5 55 22 36 C22 48 28 49 27 36 C26 23 39 15 44 3 C59 20 47 32 57 40 C62 34 61 29 60 24 C81 45 75 78 40 80 Z"
              fill="#f45121"
              stroke="#9b341b"
              strokeWidth="2"
            />
            <path
              d="M40 76 C20 75 19 60 32 44 C33 54 38 48 41 28 C56 41 44 49 55 55 C64 67 51 78 40 76 Z"
              fill="#ffac27"
            />
            <path
              d="M40 75 C29 72 31 62 42 51 C41 61 53 66 45 73 Z"
              fill="#fff5b0"
            />
          </g>
          <path
            d="M26 75 L54 75 L50 91 L30 91 Z"
            fill="#42536a"
            stroke="#172940"
            strokeWidth="3"
          />
          <path
            d="M29 78 L51 78 M32 85 L49 85"
            stroke="#c5d2dd"
            strokeWidth="3"
          />
        </svg>
      ))}
    </figure>
  );
}
function HeatDefense() {
  return (
    <figure
      className={g.heatDefense}
      aria-label="山口热浪屏障：加热装置升起暖红色热流，阻挡怕热的冰翼魔"
    >
      <svg viewBox="0 0 220 180" aria-hidden="true">
        <ellipse cx="110" cy="157" rx="90" ry="16" fill="#ed602c44" />
        <g className={g.heatWaves} fill="none" strokeLinecap="round">
          {[50, 95, 140].map((x, i) => (
            <g key={x} style={{ animationDelay: `${i * -0.35}s` }}>
              <path
                d={`M ${x} 125 C ${x - 28} 102 ${x + 28} 86 ${x} 64 S ${x - 18} 30 ${x + 2} 12`}
                stroke="#8d301d"
                strokeWidth="14"
                opacity="0.7"
              />
              <path
                d={`M ${x} 125 C ${x - 28} 102 ${x + 28} 86 ${x} 64 S ${x - 18} 30 ${x + 2} 12`}
                stroke="#ff7545"
                strokeWidth="8"
              />
            </g>
          ))}
        </g>
        <rect
          x="27"
          y="125"
          width="161"
          height="38"
          rx="9"
          fill="#243852"
          stroke="#081a35"
          strokeWidth="4"
        />
        <rect
          x="39"
          y="134"
          width="137"
          height="18"
          rx="5"
          fill="#632d25"
          stroke="#c67d46"
          strokeWidth="2"
        />
        <path
          d="M46 144 Q54 132 62 144 T78 144 T94 144 T110 144 T126 144 T142 144 T158 144 T170 144"
          fill="none"
          stroke="#ff8350"
          strokeWidth="5"
        />
        <path
          d="M43 164 V172 M173 164 V172"
          stroke="#12213a"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
      <figcaption>热浪屏障</figcaption>
    </figure>
  );
}
function DefenseMap({
  wave = 0,
  progress = 0,
  defended = false,
  running = false,
  settled = false,
}: {
  wave?: number;
  progress?: number;
  defended?: boolean;
  running?: boolean;
  settled?: boolean;
}) {
  const towers = [
    [42, 55],
    [59, 33],
    [76, 67],
  ];
  const enemies = levels[wave].records;
  return (
    <div
      className={g.map}
      data-running={running}
      data-defended={defended}
      data-settled={settled}
      aria-label={
        defended ? '情报解析完成，防线启动' : '城堡、三座前哨和恶魔来袭路线'
      }
    >
      <div className={g.mapHeading}>王国防线 · 战术地图</div>
      <div className={g.world}>
        <img
          className={g.mapArt}
          src={`${assetBase}/assets/defense-kingdom-map.png`}
          alt="城堡连接峡谷、森林和冰封山口的三座前哨"
        />
        <div className={g.mapVignette} />
        <svg
          className={g.routes}
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M 140 300 Q 300 410 420 310 Q 610 280 880 120" />
          <path d="M 140 300 Q 350 245 590 190 Q 790 175 930 240" />
          <path d="M 140 300 Q 470 440 760 380 L 930 470" />
        </svg>
        <div className={g.castleMark} style={{ left: '14%', top: '52%' }}>
          <Castle />
          <span>城堡</span>
          {defended && <i className={g.shieldRing} />}
        </div>
        {towers.map(([x, y], i) => (
          <div
            key={i}
            className={g.tower}
            data-active={wave === i || (wave === 2 && i === 0)}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <RadioTower />
            <span>{['峡谷前哨', '森林前哨', '山口前哨'][i]}</span>
          </div>
        ))}
        {enemies.map((enemy, i) => {
          const lane = wave === 2 ? (i === 0 ? 0 : 2) : wave;
          const x = 91 - progress * 50;
          const y = [22 + progress * 35, 43 - progress * 4, 83 - progress * 12][
            lane
          ];
          return (
            <div
              key={enemy.name}
              className={g.enemy}
              data-stopped={defended}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <Demon name={enemy.name} />
              {defended && (
                <i
                  className={g.elementBadge}
                  title={`属性：${enemy.attribute}`}
                >
                  {enemy.attribute === '火焰' ? (
                    <Flame />
                  ) : enemy.attribute === '藤蔓' ? (
                    <Leaf />
                  ) : (
                    <Snowflake />
                  )}
                </i>
              )}
              <strong>{enemy.name}</strong>
            </div>
          );
        })}
        {defended && (
          <>
            {wave === 1 ? (
              <TorchDefense />
            ) : (
              <div
                className={`${g.defenseBeam} ${wave === 2 ? g.northBeam : ''}`}
              />
            )}
            {wave === 2 && <HeatDefense />}
            <div className={g.guard}>
              <img
                src="/courses/ai-with-python/lesson-01/assets/final-guardian-hero.png"
                alt="勇士抵达防线"
              />
              <ShieldCheck />
              <span>
                {wave === 0
                  ? '探照灯就位'
                  : wave === 1
                    ? '火把防线就位'
                    : '双线布防完成'}
              </span>
            </div>
            <div className={g.sparkles} aria-hidden="true">
              ✦　✧　✦　✧
            </div>
          </>
        )}
      </div>
      <div className={g.mapLegend}>
        <span>
          <Flag />
          前哨发布情报
        </span>
        <span>
          <ShieldCheck />
          城堡提前布防
        </span>
      </div>
    </div>
  );
}
export function ChallengeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <Stage title="城堡情报官，准备出战！" label="课程挑战 · 三步解析，提前布防">
      <div className={g.entry}>
        <DefenseMap />
        <div className={g.brief}>
          <div className={g.badge}>
            <ShieldCheck /> KINGDOM INTELLIGENCE
          </div>
          <h3>读懂情报，守住城堡</h3>
          <p>前哨发现恶魔。选择正确代码，在恶魔抵达前读出它的情报。</p>
          <div className={g.missions}>
            {levels.map((level, i) => (
              <div key={level.id}>
                <b>0{i + 1}</b>
                <span>
                  {level.title}
                  <small>{level.seconds} 秒 · 3 道选择题</small>
                </span>
              </div>
            ))}
          </div>
          <div className={g.formula}>
            {formula.map((x, i) => (
              <span key={x}>
                {i + 1} {x}
              </span>
            ))}
          </div>
          <button className={g.start} onClick={() => navigate('l2-challenge')}>
            进入指挥室 <ArrowRight />
          </button>
        </div>
      </div>
    </Stage>
  );
}
function readIntel(html: string): IntelRecord[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll('article.record')).map((record) => ({
    name: record.querySelector('.name')?.textContent?.trim() || '',
    location: record.querySelector('.location')?.textContent?.trim() || '',
    attribute: record.querySelector('.attribute')?.textContent?.trim() || '',
    weakness: record.querySelector('.weakness')?.textContent?.trim() || '',
  }));
}
function TimeoutEffect({
  open,
  wave,
  completed,
  onReview,
  onRetry,
}: {
  open: boolean;
  wave: number;
  completed: number;
  onReview: () => void;
  onRetry: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onReview();
      }}
    >
      <DialogContent className={g.timeoutDialog} showCloseButton={false}>
        <div className={g.timeoutArt} aria-hidden="true">
          <div className={g.timeoutShockwave} />
          <div className={g.timeoutEnemyLeft}>
            {levels[wave].records.length > 1 ? (
              <Demon name={levels[wave].records[0].name} />
            ) : (
              <Castle className={g.timeoutCastle} />
            )}
          </div>
          <div className={g.timeoutEnemyRight}>
            <Demon name={levels[wave].records.at(-1)!.name} />
          </div>
          <svg className={g.brokenShield} viewBox="0 0 180 200">
            <g className={g.shieldLeft}>
              <path
                d="M90 12 L20 40 L25 114 Q32 156 90 187 L77 135 L99 108 L75 83 L95 54 Z"
                fill="#264e73"
                stroke="#bce9ff"
                strokeWidth="5"
              />
              <path
                d="M90 12 L95 54 L75 83 L99 108 L77 135 L90 187"
                fill="none"
                stroke="#ffc87c"
                strokeWidth="5"
              />
            </g>
            <g className={g.shieldRight}>
              <path
                d="M90 12 L160 40 L155 114 Q148 156 90 187 L77 135 L99 108 L75 83 L95 54 Z"
                fill="#193957"
                stroke="#bce9ff"
                strokeWidth="5"
              />
            </g>
          </svg>
          <span className={g.timeoutClock}>0:00</span>
          <span className={g.timeoutEmbers}>✦　✧　✦</span>
        </div>
        <DialogHeader className={g.timeoutHeading}>
          <span className={g.timeoutEyebrow}>
            第 {wave + 1} 关 · {levels[wave].title}
          </span>
          <DialogTitle className={g.timeoutTitle}>时间耗尽</DialogTitle>
          <DialogDescription className={g.timeoutDescription}>
            恶魔已逼近城堡，防御情报尚未完成！
          </DialogDescription>
        </DialogHeader>
        <p className={g.timeoutProgress}>
          本关已完成 {completed} / 3 题 · 查看线索，再次部署
        </p>
        <div className={g.timeoutActions}>
          <button className={g.control} onClick={onReview}>
            <Code2 />
            查看题目与线索
          </button>
          <button className={g.start} onClick={onRetry}>
            <RotateCcw />
            重新部署
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function VictoryEffect({
  open,
  completed,
  firstTry,
  onReport,
}: {
  open: boolean;
  completed: number;
  firstTry: number;
  onReport: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onReport();
      }}
    >
      <DialogContent
        className={`${g.timeoutDialog} ${g.victoryDialog}`}
        showCloseButton={false}
      >
        <div className={`${g.timeoutArt} ${g.victoryArt}`} aria-hidden="true">
          <div className={g.victoryHalo} />
          <div className={g.victoryRays} />
          <ShieldCheck className={g.victoryShield} />
          <span className={g.victoryStars}>✦　★　✦</span>
          {Array.from({ length: 24 }, (_, index) => (
            <i
              key={index}
              className={g.confetti}
              style={{
                left: `${5 + ((index * 17) % 90)}%`,
                animationDelay: `${(index % 6) * 0.07}s`,
                background: ['#ffe18c', '#73dcff', '#ff9673'][index % 3],
              }}
            />
          ))}
        </div>
        <DialogHeader className={g.timeoutHeading}>
          <span className={g.timeoutEyebrow}>城堡情报官 · 三关挑战完成</span>
          <DialogTitle className={g.timeoutTitle}>通关成功！</DialogTitle>
          <DialogDescription className={g.timeoutDescription}>
            情报准确送达，王国防线守住了！
          </DialogDescription>
        </DialogHeader>
        <div className={g.victoryScore}>
          <span>
            <Check />
            完成 <strong>{completed} / 9</strong> 题
          </span>
          <span>
            <Trophy />
            首次答对 <strong>{firstTry} / 9</strong> 题
          </span>
        </div>
        <div className={g.timeoutActions}>
          <button className={g.start} onClick={onReport}>
            <Flag />
            查看完整战报
            <ArrowRight />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function IntelligenceGame() {
  const [stored, patch] = usePageState({ defenseGame: initialDefense });
  const v = stored.defenseGame;
  const save = (next: Partial<DefenseState>) =>
    patch({ defenseGame: { ...v, ...next } });
  const [running, setRunning] = useState(false);
  const [replay, setReplay] = useState(0);
  const [timeoutDismissed, setTimeoutDismissed] = useState(false);
  const [victoryOpen, setVictoryOpen] = useState(v.phase === 'complete');
  const latest = useRef({ v, save });
  useEffect(() => {
    latest.current = { v, save };
  });
  const deadline = useRef<number | null>(null);
  const level = levels[v.wave];
  const question = level.questions[v.step];
  const answer = v.answers[v.wave * 3 + v.step];
  const solved = v.answers.filter((a) => a.solved).length;
  const lastCode =
    v.phase === 'correct' || v.phase === 'defense' || v.phase === 'complete'
      ? question.code
      : v.step > 0
        ? level.questions[v.step - 1].code
        : '';
  function pause() {
    if (deadline.current !== null && latest.current.v.phase === 'answer') {
      const remainingMs = remainingAt(deadline.current, performance.now());
      latest.current.save({
        remainingMs,
        ...(remainingMs === 0 ? { phase: 'timeout' as const } : {}),
      });
      deadline.current = null;
    }
    setRunning(false);
  }
  useEffect(() => {
    const hide = () => {
      if (document.hidden) pause();
    };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  useEffect(() => {
    if (!running || v.phase !== 'answer') {
      deadline.current = null;
      return;
    }
    deadline.current = performance.now() + latest.current.v.remainingMs;
    const tick = () => {
      if (deadline.current === null) return;
      const remainingMs = remainingAt(deadline.current!, performance.now());
      latest.current.save({
        remainingMs,
        ...(remainingMs === 0 ? { phase: 'timeout' as const } : {}),
      });
      if (remainingMs === 0) setRunning(false);
    };
    const timer = window.setInterval(tick, 200);
    return () => {
      window.clearInterval(timer);
      deadline.current = null;
    };
  }, [running, v.phase, v.wave, v.step]);
  function submit() {
    if (!running || v.phase !== 'answer' || v.selected < 0) return;
    const remainingMs =
      deadline.current === null
        ? v.remainingMs
        : remainingAt(deadline.current, performance.now());
    if (remainingMs <= 0) {
      save({ phase: 'timeout', remainingMs: 0 });
      setRunning(false);
      return;
    }
    const next = judgeAnswer({ ...v, remainingMs }, question.correct);
    if (next.phase !== 'correct' && deadline.current !== null) {
      deadline.current -= WRONG_ANSWER_PENALTY_MS;
    }
    next.message =
      next.phase === 'correct'
        ? question.success
        : question.options[v.selected].feedback;
    patch({ defenseGame: next });
    if (next.phase !== 'answer') {
      deadline.current = null;
      setRunning(false);
    }
  }
  function proceed() {
    if (v.phase === 'ready') {
      save({
        phase: 'answer',
        remainingMs: Math.min(v.remainingMs, level.seconds * 1000),
        selected: -1,
        message: '',
      });
      setRunning(true);
    } else if (v.phase === 'correct' && v.step < 2) {
      save({ step: v.step + 1, phase: 'answer', selected: -1, message: '' });
      setRunning(true);
    } else if (v.phase === 'correct') {
      save({ phase: 'defense', message: '' });
      setRunning(true);
      setReplay(replay + 1);
    } else if (v.phase === 'defense' && v.wave < 2) {
      save({
        wave: v.wave + 1,
        step: 0,
        phase: 'ready',
        remainingMs: levels[v.wave + 1].seconds * 1000,
        selected: -1,
        message: '',
      });
      setRunning(false);
    } else if (v.phase === 'defense') {
      save({ phase: 'complete' });
      setVictoryOpen(true);
      setRunning(false);
    }
  }
  function retry() {
    setTimeoutDismissed(false);
    save({
      phase: 'ready',
      selected: -1,
      remainingMs: level.seconds * 1000,
      message: '',
    });
    setRunning(false);
  }
  const reviewing = v.phase === 'timeout';
  const seconds = Math.ceil(v.remainingMs / 1000);
  const control = (
    <button
      className={g.control}
      onClick={() => (running ? pause() : setRunning(true))}
      aria-label={running ? '暂停挑战' : '继续挑战'}
    >
      {running ? <Pause /> : <Play />}
      {running ? '暂停' : '继续'}
    </button>
  );
  const codeDialog = (
    <Dialog>
      <DialogTrigger className={g.control} onClick={pause}>
        <Code2 />
        查看已拼代码
      </DialogTrigger>
      <DialogContent className={g.dialog}>
        <DialogHeader>
          <DialogTitle>{level.title} · 已拼好的代码</DialogTitle>
          <DialogDescription>
            Python 解析节选。游戏演示等价的 HTML 解析；在 Python
            中运行时，先将左侧 HTML 保存为 html。
          </DialogDescription>
        </DialogHeader>
        <section
          className={g.modalNotebook}
          tabIndex={0}
          aria-label="可滚动的解析代码"
        >
          <NotebookPanel
            compact
            title="城堡情报官.ipynb"
            cells={[
              {
                code: 'from bs4 import BeautifulSoup\n\nsoup = BeautifulSoup(html, "html.parser")\nrecord = soup.find(class_="record")',
              },
              { code: lastCode || '# 完成第一步后，代码会出现在这里。' },
            ]}
          />
        </section>
      </DialogContent>
    </Dialog>
  );
  return (
    <Stage
      title="城堡情报官"
      label={`课程挑战 · 第 ${v.wave + 1} 关 / 3 · ${level.title}`}
      footer={
        v.phase === 'answer' || v.phase === 'correct' || reviewing ? (
          <div className={g.codeDock}>
            <span>
              <Code2 />
              代码节选
            </span>
            <code>
              {lastCode.includes('get_text')
                ? v.wave === 0
                  ? 'element.get_text(strip=True)'
                  : v.wave === 1
                    ? 'location.get_text(strip=True)'
                    : 'name.get_text(strip=True)'
                : lastCode
                  ? level.questions[
                      answer.solved ? v.step : Math.max(0, v.step - 1)
                    ].options[
                      level.questions[
                        answer.solved ? v.step : Math.max(0, v.step - 1)
                      ].correct
                    ].code || lastCode.split('\n')[0]
                  : '等待你的第一条指令…'}
            </code>
            {codeDialog}
          </div>
        ) : undefined
      }
    >
      <VictoryEffect
        open={v.phase === 'complete' && victoryOpen}
        completed={solved}
        firstTry={firstTryCount(v.answers)}
        onReport={() => setVictoryOpen(false)}
      />
      <TimeoutEffect
        open={reviewing && !timeoutDismissed}
        wave={v.wave}
        completed={
          v.answers.slice(v.wave * 3, v.wave * 3 + 3).filter((a) => a.solved)
            .length
        }
        onReview={() => setTimeoutDismissed(true)}
        onRetry={retry}
      />
      {v.phase === 'ready' ||
      v.phase === 'defense' ||
      v.phase === 'complete' ? (
        <div className={g.entry}>
          <DefenseMap
            key={replay}
            wave={v.wave}
            progress={v.phase === 'ready' ? 0 : 0.55}
            defended={v.phase !== 'ready'}
            running={running}
            settled={v.phase === 'complete'}
          />
          <div className={g.brief} data-final={v.phase === 'complete'}>
            <div className={g.badge}>
              {v.phase === 'ready' ? <RadioTower /> : <ShieldCheck />}
              {v.phase === 'ready'
                ? '前哨来报'
                : v.phase === 'complete'
                  ? '城堡守住了'
                  : '防线启动'}
            </div>
            <h3>
              {v.phase === 'complete'
                ? '三关完成，情报送达！'
                : v.phase === 'defense'
                  ? '解析完成，勇士出发！'
                  : level.title}
            </h3>
            <p>
              {v.phase === 'ready'
                ? level.brief
                : v.phase === 'complete'
                  ? '你完成了按属性定位、获取文本和逐条解析。'
                  : level.defense}
            </p>
            {v.phase === 'ready' ? (
              <>
                <div className={g.enemyCards}>
                  {level.records.map((r) => (
                    <div key={r.name}>
                      <Demon name={r.name} />
                      <strong>{r.name}</strong>
                    </div>
                  ))}
                </div>
                <div className={g.rules}>
                  <Timer />
                  <span>
                    {level.seconds} 秒 / 3 题 · 答错扣{' '}
                    {WRONG_ANSWER_PENALTY_MS / 1000} 秒<br />
                    {v.step > 0
                      ? `保留进度，从第 ${v.step + 1} 步继续。`
                      : '答对暂停讲解，答错可重选。'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className={g.report}>
                  {(v.phase === 'complete'
                    ? Array.from(
                        new Map(
                          levels
                            .flatMap((l) => readIntel(l.html))
                            .map((r) => [r.name, r]),
                        ).values(),
                      )
                    : readIntel(level.html)
                  ).map((r) => (
                    <div key={r.name}>
                      <strong>{r.name}</strong>
                      <span>
                        {r.location} · {r.attribute}
                      </span>
                      <b>{r.weakness}</b>
                    </div>
                  ))}
                </div>
                {v.phase === 'complete' && (
                  <div className={g.score}>
                    <Trophy />
                    <span>
                      完成 {solved} / 9 题<br />
                      首次答对 {firstTryCount(v.answers)} / 9 题
                    </span>
                  </div>
                )}
              </>
            )}
            <div className={g.mapActions}>
              {v.phase === 'complete' ? (
                <>
                  <button
                    className={g.start}
                    onClick={() => {
                      setVictoryOpen(false);
                      patch({
                        defenseGame: {
                          ...initialDefense,
                          answers: initialDefense.answers.map(() => ({
                            attempts: [],
                            solved: false,
                          })),
                        },
                      });
                      setRunning(false);
                    }}
                  >
                    重新挑战 <RotateCcw />
                  </button>
                  <button
                    className={g.control}
                    onClick={() => setVictoryOpen(true)}
                  >
                    <Trophy />
                    重播通关特效
                  </button>
                </>
              ) : (
                <button className={g.start} onClick={proceed}>
                  {v.phase === 'ready'
                    ? '开始本关'
                    : v.wave === 2
                      ? '查看战报'
                      : '前往下一关'}
                  <ArrowRight />
                </button>
              )}
              {v.phase === 'defense' && (
                <>
                  {control}
                  <button
                    className={g.control}
                    onClick={() => {
                      setReplay(replay + 1);
                      setRunning(true);
                    }}
                  >
                    <RotateCcw />
                    重播布防
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={g.battlebar} data-running={running}>
            <div className={g.battleLabel}>
              <RadioTower />
              <strong>{level.title}</strong>
            </div>
            <div className={g.approach}>
              <Castle />
              <div className={g.approachTrack}>
                {level.records.map((record, index) => (
                  <span
                    key={record.name}
                    className={g.approachEnemy}
                    style={{
                      left: `${Math.max(0, v.remainingMs / (level.seconds * 1000)) * (88 - index * 14)}%`,
                    }}
                  >
                    <Demon name={record.name} small />
                  </span>
                ))}
                <span className={g.routeDots} />
              </div>
              <Flag />
            </div>
            <span className={g.time} data-urgent={seconds <= 20}>
              {v.message && v.phase !== 'correct' && (
                <strong className={g.timePenalty} key={answer.attempts.length}>
                  −{WRONG_ANSWER_PENALTY_MS / 1000} 秒
                </strong>
              )}
              <Timer />
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </span>
            {v.phase === 'answer' && control}
            {v.phase === 'correct' && (
              <span className={g.stopped}>
                <Pause />
                讲解暂停
              </span>
            )}
            {reviewing && (
              <button className={g.control} onClick={retry}>
                <RotateCcw />
                重试本关
              </button>
            )}
          </div>
          <div className={g.workbench}>
            <section className={g.htmlPane}>
              <div className={g.paneTitle}>
                <RadioTower />
                前哨情报 · HTML 关键元素
              </div>
              <pre>
                {level.html.split('\n').map((line, i) => {
                  const lit =
                    (answer.solved || v.message !== '' || reviewing) &&
                    question.highlight.some((x) => line.includes(x));
                  return (
                    <span key={i} data-highlight={lit}>
                      <em aria-hidden="true">{i + 1}</em>
                      <code>{line}</code>
                    </span>
                  );
                })}
              </pre>
              <div className={g.sourceNote}>
                {v.wave === 2
                  ? '两条记录的字段顺序不同，按 class 寻找。'
                  : '网页已取回；soup 与当前 record 已准备。'}
              </div>
            </section>
            <section className={g.quiz} aria-label="情报解析选择题">
              <div className={g.formula}>
                {formula.map((x, i) => (
                  <span
                    key={x}
                    data-current={v.step === i}
                    data-done={i < v.step}
                  >
                    {i < v.step ? <Check /> : i + 1} {x}
                  </span>
                ))}
              </div>
              <h3>{question.prompt}</h3>
              <div
                role="radiogroup"
                aria-label={question.prompt}
                className={g.options}
              >
                {question.options.map((option, i) => (
                  <label
                    key={i}
                    data-selected={v.selected === i}
                    data-correct={
                      (answer.solved || reviewing) && i === question.correct
                    }
                    data-wrong={
                      answer.attempts.includes(i) && i !== question.correct
                    }
                  >
                    <input
                      type="radio"
                      name="intel-answer"
                      aria-label={`${String.fromCharCode(65 + i)} ${option.label}${option.code ? ' ' + option.code : ''}`}
                      checked={v.selected === i}
                      disabled={!running || v.phase !== 'answer'}
                      onChange={() => save({ selected: i, message: '' })}
                    />
                    <b>{String.fromCharCode(65 + i)}</b>
                    <span>
                      {option.code ? (
                        <>
                          {v.wave === 1 && v.step === 2 && i === 0 && (
                            <small>三个字段分别获取文本，例如：</small>
                          )}
                          <code>{option.code}</code>
                        </>
                      ) : (
                        option.label
                      )}
                    </span>
                    {answer.solved && i === question.correct && <Check />}
                  </label>
                ))}
              </div>
              <output
                className={g.feedback}
                data-kind={
                  v.phase === 'correct'
                    ? 'correct'
                    : v.message
                      ? 'wrong'
                      : 'idle'
                }
              >
                {reviewing
                  ? '时间耗尽，布防未完成。参考：' +
                    question.options[question.correct].feedback
                  : v.message ||
                    (v.phase === 'answer' && !running
                      ? '挑战已暂停。准备好后，点击“继续”。'
                      : v.wave === 0
                        ? '小派提示：先看 class，再找到元素，最后取出文字。'
                        : '先观察左侧 HTML，再确认你的选择。')}
              </output>
              <div className={g.quizActions}>
                {v.phase === 'correct' ? (
                  <button className={g.start} onClick={proceed}>
                    {v.step === 2 ? '发送情报，开始布防' : '继续下一步'}
                    <ArrowRight />
                  </button>
                ) : reviewing ? (
                  <button className={g.start} onClick={retry}>
                    重新部署本关
                    <RotateCcw />
                  </button>
                ) : (
                  <button
                    className={g.start}
                    disabled={v.selected < 0 || !running}
                    onClick={submit}
                  >
                    确认解析
                    <Check />
                  </button>
                )}
                <span>已完成 {solved} / 9</span>
              </div>
            </section>
          </div>
        </>
      )}
    </Stage>
  );
}
