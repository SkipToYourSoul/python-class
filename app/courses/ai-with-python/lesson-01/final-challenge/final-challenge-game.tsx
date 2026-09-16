/* oxlint-disable next/no-img-element -- Supplied game artwork. */
'use client';
import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Trophy,
} from 'lucide-react';
import {
  levels,
  createRoundVisitors,
  type Identity,
  type Level,
  type Visitor,
} from './challenge-data';
import { Choices, asset, useSceneState } from '../lesson-ui';
import s from '../lesson-review.module.css';
import g from '../lesson-games.module.css';
import t from './final-challenge-game.module.css';
import { CountdownArrival } from './countdown-arrival';
import { VictoryScreen } from './victory-screen';

type Phase =
  | 'ready'
  | 'playing'
  | 'correct'
  | 'failed'
  | 'level-complete'
  | 'complete';
type GameState = {
  mode: 'lecture' | 'timed';
  level: number;
  visitor: number;
  visitors: Visitor[];
  phase: Phase;
  time: number;
  guess: Identity | null;
  pathStep: number;
  paused: boolean;
};
const seed: GameState = {
  mode: 'lecture',
  level: 0,
  visitor: 0,
  visitors: levels[0].visitors,
  phase: 'ready',
  time: 25,
  guess: null,
  pathStep: 0,
  paused: false,
};
function DecisionTree({ level, path }: { level: Level; path: string[] }) {
  return (
    <figure className={t.tree} aria-label={`${level.title}完整决策树`}>
      <figcaption>{level.subtitle}</figcaption>
      <div className={t.treeCanvas}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {level.edges.map((e) => {
            const a = level.nodes.find((n) => n.id === e.from)!,
              b = level.nodes.find((n) => n.id === e.to)!;
            const active = path.includes(e.from) && path.includes(e.to);
            return (
              <path
                key={e.to}
                d={`M ${a.x} ${a.y + 4} L ${b.x} ${b.y - 4}`}
                data-active={active}
              />
            );
          })}
        </svg>
        {level.edges.map((e) => {
          const a = level.nodes.find((n) => n.id === e.from)!,
            b = level.nodes.find((n) => n.id === e.to)!;
          return (
            <span
              className={t.edgeLabel}
              key={e.to}
              style={{
                left: `${(a.x + b.x) / 2}%`,
                top: `${(a.y + b.y) / 2}%`,
              }}
            >
              {e.label}
            </span>
          );
        })}
        {level.nodes.map((n) => (
          <div
            className={t.node}
            key={n.id}
            data-kind={n.kind}
            data-active={path.includes(n.id)}
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span>
              {n.kind === 'question' ? n.detail : '预测：' + n.detail}
            </span>
            <strong>{n.label}</strong>
          </div>
        ))}
      </div>
    </figure>
  );
}
function stepExplanation(level: Level, visitor: Visitor, index: number) {
  const node = level.nodes.find((n) => n.id === visitor.path[index]);
  if (!node) return '从根节点开始，检查第一个条件。';
  if (node.kind !== 'question')
    return `到达叶子节点：按这棵树，应判断为${visitor.identity}。`;
  const next = visitor.path[index + 1],
    edge = level.edges.find((e) => e.from === node.id && e.to === next);
  const value = node.label.startsWith('攻击')
    ? visitor.attack
    : node.label.startsWith('防御')
      ? visitor.defense
      : visitor.health;
  return `${node.label} 当前数值 ${value}，答案是“${edge?.label}”。`;
}
export default function FinalChallengeGame() {
  const [v, set] = useSceneState<GameState>('final-challenge-v2', seed);
  const level = levels[v.level] ?? levels[0],
    visitor = v.visitors[v.visitor] ?? level.visitors[0];
  const [arrivalRound, setArrivalRound] = useState(0);
  const [motionPaused, setMotionPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const guided = v.mode === 'lecture',
    review = v.phase === 'correct' || v.phase === 'failed';
  const canSkipReview = v.mode === 'timed' && v.phase === 'correct';
  const completed = v.phase === 'level-complete' || v.phase === 'complete';
  const celebrate = v.phase === 'correct' || completed;
  const scenePaused = !pageVisible || (guided && (motionPaused || v.paused));
  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () =>
      document.removeEventListener('visibilitychange', updateVisibility);
  }, []);
  useEffect(() => {
    if (v.phase !== 'playing' || guided || !pageVisible) return;
    const timer = window.setTimeout(() => {
      if (v.time <= 1)
        set({ time: 0, phase: 'failed', guess: null, pathStep: 0 });
      else set({ time: v.time - 1 });
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [v.phase, v.time, guided, v.paused, motionPaused, pageVisible, set]);
  function start(levelIndex = v.level) {
    setArrivalRound((round) => round + 1);
    setMotionPaused(false);
    set({
      level: levelIndex,
      visitor: 0,
      visitors: createRoundVisitors(levelIndex),
      phase: 'playing',
      time: levels[levelIndex].time,
      guess: null,
      pathStep: 0,
      paused: false,
    });
  }
  function choose(guess: Identity) {
    if (v.phase === 'playing' && !scenePaused)
      set({
        guess,
        phase: guess === visitor.identity ? 'correct' : 'failed',
        pathStep: 0,
      });
  }
  function next() {
    if (v.visitor < 2)
      set({
        visitor: v.visitor + 1,
        phase: 'playing',
        guess: null,
        time: level.time,
        pathStep: 0,
        paused: false,
      });
    else set({ phase: v.level === 2 ? 'complete' : 'level-complete' });
  }
  return (
    <main className={`${g.page} ${s.player}`}>
      {v.phase === 'complete' && <VictoryScreen />}
      <header className={g.topbar}>
        <Link href="/courses/ai-with-python/lesson-01#finish-summary">
          <ArrowLeft />
          返回课程总结
        </Link>
        <span>AI 城门终局挑战</span>
        <button onClick={() => set({ ...seed, mode: v.mode })}>
          <RotateCcw />
          返回挑战入口
        </button>
      </header>
      <section className={g.content}>
        <header className={`lesson-standard-heading ${g.heading}`}>
          <span>FINAL MISSION · LEVEL {level.number}</span>
          <h1>{level.title}</h1>
          <ol className={t.levels} aria-label="关卡进度">
            {levels.map((l, i) => (
              <li
                key={l.number}
                aria-current={i === v.level ? 'step' : undefined}
              >
                {l.number} · {l.title}
              </li>
            ))}
          </ol>
        </header>
        <div className={t.layout}>
          <DecisionTree
            level={level}
            path={review ? visitor.path.slice(0, v.pathStep) : []}
          />
          <section className={t.console} aria-label="来客资料与操作">
            <div
              className={t.castle}
              data-motion-paused={scenePaused}
              data-result={review ? v.phase : completed ? 'correct' : undefined}
              style={{
                backgroundImage: `url(${asset('final-challenge-road.png')})`,
              }}
            >
              {celebrate && (
                <div
                  key={`celebration-${arrivalRound}-${v.level}-${v.visitor}-${v.phase}`}
                  className={t.celebration}
                  aria-hidden="true"
                >
                  {Array.from({ length: 16 }, (_, index) => (
                    <i
                      key={index}
                      style={{ '--piece': index } as CSSProperties}
                    />
                  ))}
                  {!completed && (
                    <div className={t.successStamp}>
                      <CircleCheck />
                      判断正确
                    </div>
                  )}
                </div>
              )}
              <div
                key={`gate-${arrivalRound}-${v.level}-${v.visitor}-${v.guess ?? 'waiting'}`}
                className={t.gate}
                data-open={v.guess === '勇士'}
                data-animated={v.phase !== 'ready'}
                aria-hidden="true"
              >
                <div className={t.gateLeft} />
                <div className={t.gateRight} />
              </div>
              <figure
                key={`visitor-${arrivalRound}-${v.level}-${v.visitor}`}
                className={t.arrival}
              >
                <CountdownArrival
                  src={asset(visitor.image)}
                  name={visitor.name}
                  duration={level.time}
                  remaining={v.time}
                  timed={!guided && v.phase !== 'ready'}
                  running={v.phase === 'playing' && !scenePaused}
                />
                <figcaption>{visitor.name}</figcaption>
              </figure>
              <span className={t.counter}>
                <Timer />
                {guided ? '不限时' : `${v.time} 秒`}
              </span>
              <span className={t.visitorNumber}>来客 {v.visitor + 1} / 3</span>
              {guided && (
                <button
                  className={t.motionControl}
                  aria-label={motionPaused ? '播放场景动效' : '暂停场景动效'}
                  aria-pressed={motionPaused}
                  onClick={() => setMotionPaused((paused) => !paused)}
                >
                  {motionPaused ? <Play /> : <Pause />}
                  {motionPaused ? '播放动效' : '暂停动效'}
                </button>
              )}
              <div className={t.stats}>
                <span>
                  攻击 <b>{visitor.attack}</b>
                </span>
                <span>
                  防御 <b>{visitor.defense}</b>
                </span>
                <span>
                  血量 <b>{visitor.health}</b>
                </span>
              </div>
            </div>
            {v.phase === 'ready' ? (
              <div className={t.feedback}>
                <h2>沿条件，判断来客</h2>
                <Choices
                  label="挑战模式"
                  items={['讲解模式 · 全程不限时', '挑战模式 · 保留倒计时']}
                  value={v.mode === 'lecture' ? 0 : 1}
                  onChange={(mode) =>
                    set({ mode: mode === 0 ? 'lecture' : 'timed' })
                  }
                />
                <p>
                  {v.mode === 'lecture'
                    ? '每位来客由教师手动推进，可以重试。'
                    : '从第一位来客开始计时，三关依次为 25、20、15 秒。'}
                </p>
                <button className={s.primary} onClick={() => start()}>
                  开始本关
                </button>
              </div>
            ) : v.phase === 'playing' ? (
              <div className={t.feedback}>
                <p>
                  {scenePaused
                    ? '场景已暂停；继续后再作答。'
                    : '只看数值与条件。你的选择是什么？'}
                </p>
                <div className={t.answerButtons}>
                  <button disabled={scenePaused} onClick={() => choose('勇士')}>
                    打开城门 · 勇士
                  </button>
                  <button disabled={scenePaused} onClick={() => choose('恶魔')}>
                    保持关闭 · 恶魔
                  </button>
                </div>
              </div>
            ) : review ? (
              <div
                className={t.feedback}
                data-result={v.phase}
                aria-live="polite"
              >
                <div className={t.reviewHeadline}>
                  <h2 className={t.resultTitle}>
                    {v.phase === 'correct' ? (
                      <CircleCheck aria-hidden="true" />
                    ) : (
                      <CircleX aria-hidden="true" />
                    )}
                    {v.phase === 'correct'
                      ? '判断正确'
                      : v.guess === null
                        ? '时间到，尚未作答'
                        : '判断错误'}
                  </h2>
                  <p>
                    你的选择：<b>{v.guess ?? '未作答'}</b>
                  </p>
                </div>
                <p className={t.explanation}>
                  {canSkipReview && v.pathStep === 0
                    ? '判断正确！可以直接继续，也可以沿树复盘。'
                    : stepExplanation(level, visitor, v.pathStep - 1)}
                </p>
                <div className={t.reviewButtons}>
                  <button
                    className={s.secondary}
                    disabled={v.pathStep >= visitor.path.length}
                    onClick={() => set({ pathStep: v.pathStep + 1 })}
                  >
                    {v.pathStep >= visitor.path.length
                      ? '路径已完整显示'
                      : '沿树复盘下一步'}
                  </button>
                  {v.phase === 'failed' && v.mode === 'lecture' && (
                    <button
                      className={s.secondary}
                      onClick={() => {
                        setArrivalRound((round) => round + 1);
                        set({ phase: 'playing', guess: null, pathStep: 0 });
                      }}
                    >
                      再判断这位
                    </button>
                  )}
                  <button
                    className={s.primary}
                    disabled={
                      !canSkipReview && v.pathStep < visitor.path.length
                    }
                    onClick={() =>
                      v.phase === 'failed' && v.mode === 'timed'
                        ? start()
                        : next()
                    }
                  >
                    {v.phase === 'failed' && v.mode === 'timed'
                      ? '重新挑战本关'
                      : v.visitor === 2
                        ? '完成本关'
                        : '继续下一位'}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={t.feedback}
                data-result="complete"
                aria-live="polite"
              >
                <h2 className={t.completionTitle}>
                  <Trophy aria-hidden="true" />
                  {v.phase === 'complete'
                    ? '三关挑战完成！'
                    : `${level.title}完成！`}
                </h2>
                <p>
                  {v.phase === 'complete'
                    ? '你已经能读懂决策树，并沿条件作出判断。'
                    : '下一关的问题更多，继续仔细看每个条件。'}
                </p>
                {v.phase === 'complete' ? (
                  <Link
                    className={s.primary}
                    href="/courses/ai-with-python/lesson-01#finish-summary"
                  >
                    返回课堂总结
                  </Link>
                ) : (
                  <button
                    className={s.primary}
                    onClick={() => start(v.level + 1)}
                  >
                    进入下一关
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
        <p className={g.note}>
          本挑战按给定树的规则计分，考查读树与推演；不能用通关成绩证明模型对真实世界的预测准确率。
        </p>
      </section>
    </main>
  );
}
