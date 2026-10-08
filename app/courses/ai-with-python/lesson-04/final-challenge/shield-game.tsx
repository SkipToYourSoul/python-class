/* oxlint-disable next/no-img-element -- Local generated game artwork. */
'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  Eye,
  Fullscreen,
  Pause,
  Play,
  Radio,
  RotateCcw,
  ScanLine,
  Shield,
  Sparkles,
  Swords,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import Link from '@/components/static-link';
import {
  CASE_COUNT,
  DEMONS,
  deriveRows,
  finalResult,
  makeCase,
  selectionResult,
  type DemonId,
} from './shield-engine';
import s from './shield-game.module.css';

const ART = '/courses/ai-with-python/lesson-04/assets/shield-game';
const STORAGE = 'lesson04-shield-battle-v2';
const FILM_DURATION = 12000;
type Phase = 'intro' | 'scan' | 'choose' | 'evidence' | 'won';
type Save = {
  caseIndex: number;
  phase: Phase;
  selected: DemonId[];
  evidenceSeen: boolean;
};
type Effect = {
  kind: 'scan' | 'blocked' | 'lock' | 'proof' | 'win';
  target?: DemonId;
  key: number;
};
const fresh = (caseIndex: number): Save => ({
  caseIndex,
  phase: 'intro',
  selected: [],
  evidenceSeen: false,
});
const nameOf = (id: DemonId) => DEMONS.find((demon) => demon.id === id)!.name;
const randomCase = (previous?: number) => {
  const candidates = Array.from({ length: CASE_COUNT }, (_, i) => i).filter(
    (i) =>
      previous === undefined || makeCase(i).host !== makeCase(previous).host,
  );
  return candidates[Math.floor(Math.random() * candidates.length)];
};
function restore(raw: string | null): Save {
  try {
    const value = JSON.parse(raw || '{}') as Save;
    if (
      !Number.isInteger(value.caseIndex) ||
      value.caseIndex < 0 ||
      value.caseIndex >= CASE_COUNT
    )
      return fresh(randomCase());
    if (!['intro', 'scan', 'choose', 'evidence', 'won'].includes(value.phase))
      return fresh(value.caseIndex);
    const selected = Array.isArray(value.selected)
      ? [
          ...new Set(
            value.selected.filter((id) => DEMONS.some((d) => d.id === id)),
          ),
        ].slice(0, 2)
      : [];
    const battle = makeCase(value.caseIndex);
    const validPair = selectionResult(battle, selected).ok;
    const phase =
      ['evidence', 'won'].includes(value.phase) && !validPair
        ? 'choose'
        : value.phase;
    return {
      caseIndex: value.caseIndex,
      selected: phase === 'intro' || phase === 'scan' ? [] : selected,
      phase:
        phase === 'won' && value.evidenceSeen !== true ? 'evidence' : phase,
      evidenceSeen:
        ['evidence', 'won'].includes(phase) && value.evidenceSeen === true,
    };
  } catch {
    return fresh(randomCase());
  }
}

function DemonArt({ id, className = '' }: { id: DemonId; className?: string }) {
  const sprite = DEMONS.find((d) => d.id === id)!.sprite;
  return (
    <span
      className={`${s.demonArt} ${className}`}
      aria-hidden="true"
      style={{
        backgroundPosition: `${(sprite % 2) * 100}% ${Math.floor(sprite / 2) * 100}%`,
      }}
    />
  );
}

function BattleEffect({ effect }: { effect: Effect }) {
  const target = DEMONS.findIndex((d) => d.id === effect.target);
  const x = target < 0 ? 500 : 125 + target * 250;
  return (
    <div
      key={effect.key}
      className={s.effect}
      data-effect={effect.kind}
      aria-hidden="true"
      style={{ '--impact-x': `${x / 10}%` } as CSSProperties}
    >
      {effect.kind !== 'scan' && (
        <svg
          className={s.attackBeam}
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="attack-light" x1="0" y1="1" x2="0" y2="0">
              <stop stopColor="#ffc857" />
              <stop offset="1" stopColor="#fff7cf" />
            </linearGradient>
          </defs>
          <path d={`M500 520 Q${x} 390 ${x} 220`} />
          <circle cx={x} cy="220" r="36" />
        </svg>
      )}
      {effect.kind === 'scan' ? (
        <div className={s.scanSweep} />
      ) : (
        <div className={s.impact} />
      )}
      {Array.from({ length: 22 }, (_, i) => (
        <i
          key={i}
          className={s.particle}
          style={
            {
              '--dx': `${Math.cos(i * 2.4) * (70 + i * 7)}px`,
              '--dy': `${Math.sin(i * 2.4) * (50 + i * 5)}px`,
              '--delay': `${(i % 5) * 24}ms`,
              '--turn': `${i * 33}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function ShieldGame() {
  const [save, setSave] = useState<Save>(fresh(0));
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState<'neutral' | 'good' | 'bad'>('neutral');
  const [effect, setEffect] = useState<Effect | null>(null);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [filmTime, setFilmTime] = useState(0);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const serial = useRef(0);
  const fxElapsed = useRef(0);
  const filmElapsed = useRef(0);
  const battle = makeCase(save.caseIndex);
  const rows = deriveRows(battle);
  const suspended = paused || hidden || resetOpen || recordsOpen;
  const busy = !!effect;
  const seals =
    save.phase === 'scan' || save.phase === 'intro'
      ? 0
      : save.phase === 'choose'
        ? 1
        : save.phase === 'evidence'
          ? 2
          : 3;
  const filmCue =
    filmTime < 800 ? -1 : Math.min(3, Math.floor((filmTime - 800) / 2800));
  const clips = [
    ...battle.commands.orders.map((order, i) => ({
      ...order,
      kind: 'order' as const,
      label: `口令 ${i + 1}`,
      place: '',
    })),
    ...battle.commands.responses.map((response, i) => ({
      ...response,
      kind: 'action' as const,
      label: `${i === 0 ? '东' : '西'}队实况`,
      place: response.destination,
    })),
  ];
  const proving = effect?.kind === 'proof' || effect?.kind === 'win';
  const taunting = save.phase === 'evidence' && effect?.kind === 'blocked';
  const currentClip = filmCue >= 0 ? clips[filmCue] : null;

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE);
    } catch {
      /* Storage may be unavailable. */
    }
    let mounted = true;
    queueMicrotask(() => {
      if (!mounted) return;
      setSave(restore(stored));
      setReady(true);
      motion();
    });
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(media.matches);
    const visibility = () => {
      setHidden(document.hidden);
      if (document.hidden) {
        setPaused(true);
        void audio.current?.suspend();
      }
    };
    media.addEventListener('change', motion);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      mounted = false;
      media.removeEventListener('change', motion);
      document.removeEventListener('visibilitychange', visibility);
      void audio.current?.close();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(STORAGE, JSON.stringify(save));
      } catch {
        /* The current session remains playable. */
      }
    }
  }, [save, ready]);
  useEffect(() => {
    if (suspended || muted) void audio.current?.suspend();
  }, [suspended, muted]);
  useEffect(() => {
    if (!paused && !resetOpen && !recordsOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = root.current?.querySelector<HTMLElement>('dialog[open]');
    const controls = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href]',
        ) ?? [],
      );
    controls()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (resetOpen) setResetOpen(false);
        else if (recordsOpen) setRecordsOpen(false);
        else setPaused(false);
      }
      if (event.key === 'Tab' && dialog) {
        const items = controls(),
          first = items[0],
          last = items[items.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            !dialog?.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !dialog?.contains(document.activeElement))
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
      if (previous?.isConnected) previous.focus();
    };
  }, [paused, resetOpen, recordsOpen]);
  useEffect(() => {
    if (!effect || suspended) return;
    let frame = 0,
      last = performance.now();
    const duration =
      effect.kind === 'proof'
        ? 2800
        : reduced
          ? 350
          : effect.kind === 'win'
            ? 1700
            : 1100;
    const tick = (now: number) => {
      fxElapsed.current += now - last;
      last = now;
      if (fxElapsed.current >= duration) {
        if (effect.kind === 'proof') {
          fxElapsed.current = 0;
          setEffect({ ...effect, kind: 'win', key: ++serial.current });
          return;
        }
        if (effect.kind === 'win') setSave((old) => ({ ...old, phase: 'won' }));
        setEffect(null);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [effect, suspended, reduced]);
  useEffect(() => {
    if (!filmPlaying || suspended) return;
    let frame = 0,
      last = performance.now(),
      lastPaint = 0;
    const tick = (now: number) => {
      filmElapsed.current += now - last;
      last = now;
      if (now - lastPaint > 40) {
        setFilmTime(filmElapsed.current);
        lastPaint = now;
      }
      if (filmElapsed.current >= FILM_DURATION) {
        setFilmTime(FILM_DURATION);
        setFilmPlaying(false);
        setSave((old) => ({ ...old, evidenceSeen: true }));
        setMessage(
          '两名候选都在发令。两队实际执行了谁的口令？点击它，发动最后一击！',
        );
        setMood('neutral');
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [filmPlaying, suspended]);

  function sound(kind: 'tap' | 'scan' | 'blocked' | 'success') {
    if (muted || suspended) return;
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      void ctx.resume();
      const notes =
        kind === 'blocked'
          ? [170, 115]
          : kind === 'success'
            ? [392, 523.25, 659.25, 783.99]
            : kind === 'scan'
              ? [240, 420, 640]
              : [480];
      notes.forEach((frequency, i) => {
        const oscillator = ctx.createOscillator(),
          gain = ctx.createGain();
        const start = ctx.currentTime + i * 0.085;
        oscillator.type = kind === 'blocked' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        oscillator.frequency.exponentialRampToValueAtTime(
          frequency * (kind === 'scan' ? 1.4 : 0.95),
          start + 0.2,
        );
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.065, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.3);
      });
    } catch {
      /* Visual feedback is always available. */
    }
  }
  function pulse(kind: Effect['kind'], target?: DemonId) {
    fxElapsed.current = 0;
    setEffect({ kind, target, key: ++serial.current });
    sound(
      kind === 'blocked' ? 'blocked' : kind === 'scan' ? 'scan' : 'success',
    );
  }
  function feedback(
    text: string,
    result: 'neutral' | 'good' | 'bad' = 'neutral',
  ) {
    setMessage(text);
    setMood(result);
  }
  function startFilm() {
    filmElapsed.current = 0;
    setFilmTime(0);
    setFilmPlaying(true);
    feedback('对照两道口令，记住两队实际到达的地点。');
    sound('scan');
  }
  function choose(id: DemonId) {
    if (busy || suspended || filmPlaying) return;
    if (save.phase === 'scan') {
      pulse('blocked', id);
      feedback(
        '魔盾反弹了攻击！平均值很高，也可能只有一条记录。先查次数。',
        'bad',
      );
      return;
    }
    if (save.phase === 'choose') {
      if (!save.selected.includes(id) && save.selected.length === 2) {
        pulse('blocked', id);
        feedback('已经锁定两名。先点一下取消原来的对象，再调整判断。', 'bad');
        return;
      }
      const selected = save.selected.includes(id)
        ? save.selected.filter((x) => x !== id)
        : [...save.selected, id];
      setSave({ ...save, selected });
      sound('tap');
      feedback(
        selected.length === 2
          ? `已选择${selected.map(nameOf).join('、')}。核对均值和次数，再锁定。`
          : selected.length === 1
            ? `已瞄准${nameOf(selected[0])}，再找一名值得调查的对象。`
            : '已取消选择。比较均值与次数，再选两名。',
      );
      return;
    }
    if (save.phase === 'evidence') {
      const verdict = finalResult(battle, id, save.evidenceSeen);
      feedback(verdict.message, verdict.ok ? 'good' : 'bad');
      pulse(verdict.ok ? 'proof' : 'blocked', id);
    }
  }
  function scan() {
    if (busy) return;
    setSave({ ...save, phase: 'choose' });
    pulse('scan');
    feedback(
      `${nameOf(battle.outlier)}只有 1 次观测，先别急着定案。留下均值接近、次数足够的两名。`,
      'good',
    );
  }
  function lock() {
    const verdict = selectionResult(battle, save.selected);
    feedback(verdict.message, verdict.ok ? 'good' : 'bad');
    if (!verdict.ok) {
      pulse(
        'blocked',
        save.selected.find((id) => !battle.candidates.includes(id)),
      );
      return;
    }
    setSave({ ...save, phase: 'evidence' });
    pulse('lock');
    startFilm();
  }
  function again() {
    setSave(fresh(randomCase(save.caseIndex)));
    setResetOpen(false);
    setPaused(false);
    setFilmPlaying(false);
    filmElapsed.current = 0;
    setFilmTime(0);
    setEffect(null);
    feedback('');
    sound('tap');
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
    } catch {
      feedback('当前窗口无法进入全屏，可使用浏览器的全屏功能。');
    }
  }
  const headline =
    save.phase === 'scan'
      ? '平均值最高，就能直接攻击？'
      : save.phase === 'choose'
        ? '先把两位重点对象，一起留下'
        : filmPlaying
          ? '两道口令，部队听了谁的？'
          : '口令与行动，指向谁？';
  const instruction =
    save.phase === 'scan'
      ? '新一轮哨塔观测 · 数字是平均威胁值'
      : save.phase === 'choose'
        ? '结合均值与观测次数，保留两名值得继续调查的对象'
        : filmPlaying
          ? '现场回放 · 可暂停讨论，结束后保留记录'
          : '点击恶魔发射破盾攻击 · 判断依据是指挥证据';

  return (
    <div
      ref={root}
      className={s.game}
      data-ready={ready}
      data-phase={save.phase}
      data-paused={suspended}
      data-reduced={reduced}
      data-film={filmPlaying}
      data-taunt={taunting}
    >
      <div className={s.environment} aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />
      <header className={s.topbar}>
        <Link
          href="/courses/ai-with-python/lesson-04#l4-challenge-entry"
          className={s.back}
          aria-label="返回第四课"
        >
          <ArrowLeft />
        </Link>
        <div className={s.brand}>
          <Shield />
          <strong>数据破魔盾</strong>
        </div>
        <div className={s.seals} aria-label={`已击破 ${seals} 层魔盾，共三层`}>
          {['核查次数', '保留候选', '核实指挥'].map((label, i) => (
            <div key={label} data-broken={i < seals}>
              <span>{i < seals ? <Check /> : i + 1}</span>
              <b>{label}</b>
            </div>
          ))}
        </div>
        <div className={s.controls}>
          <button
            onClick={() => {
              setMuted(!muted);
              if (muted) feedback('音效已开启');
            }}
            aria-label={muted ? '开启音效' : '关闭音效'}
            title={muted ? '开启音效' : '关闭音效'}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </button>
          <button
            onClick={() => void fullscreen()}
            aria-label="切换全屏"
            title="全屏"
          >
            <Fullscreen />
          </button>
          <button
            onClick={() => setPaused(!paused)}
            aria-label={paused ? '继续游戏' : '暂停游戏'}
          >
            {paused ? <Play /> : <Pause />}
          </button>
          <button
            onClick={() => setResetOpen(true)}
            aria-label="重新开始挑战"
            title="重新开始"
          >
            <RotateCcw />
          </button>
        </div>
      </header>

      {!ready ? (
        <div className={s.loading}>
          <Shield />
          <p>正在开启城堡结界…</p>
        </div>
      ) : save.phase === 'intro' ? (
        <main className={s.intro}>
          <div className={s.introCopy}>
            <span className={s.eyebrow}>
              <Sparkles /> 最终挑战 · 全班协作
            </span>
            <h1>
              魔王，
              <br />
              <em>换身了。</em>
            </h1>
            <p>
              旧战报追不到新的伪装。
              <br />
              这一次，用数据和证据击碎魔盾。
            </p>
            <div className={s.introPills}>
              <span>
                <ScanLine /> 查次数
              </span>
              <span>
                <Crosshair /> 留候选
              </span>
              <span>
                <Radio /> 验指令
              </span>
            </div>
            <button
              className={s.primary}
              onClick={() => {
                setSave({ ...save, phase: 'scan' });
                feedback('全班先判断：只凭平均值，证据够吗？');
                sound('success');
              }}
            >
              开启破盾行动 <ArrowRight />
            </button>
            <span className={s.caption}>3—5 分钟 · 老师操作，全班判断</span>
          </div>
          <div className={s.introCast} aria-label="四个新的调查对象">
            <div className={s.sigil} aria-hidden="true" />
            {DEMONS.map((d) => (
              <figure key={d.id}>
                <DemonArt id={d.id} />
                <figcaption>{d.name}</figcaption>
              </figure>
            ))}
            <p>四个新面孔 · 三层魔盾 · 一个隐藏的宿主</p>
          </div>
        </main>
      ) : save.phase === 'won' ? (
        <main className={s.victory}>
          <div className={s.reveal}>
            <div className={s.sigil} aria-hidden="true" />
            <img src={`${ART}/sovereign.png`} alt="伪装破碎后现身的魔王灵体" />
            <span className={s.sealMark}>伪装已破</span>
          </div>
          <div className={s.victoryCopy}>
            <span className={s.eyebrow}>
              <Shield /> 三层魔盾 · 全部击破
            </span>
            <h1>
              魔王现身。
              <br />
              <em>城堡守住了！</em>
            </h1>
            <p>
              这次的宿主是 <strong>{nameOf(battle.host)}</strong>。
            </p>
            <div className={s.victoryEvidence}>
              <span>
                <Check /> 次数：单次高值不急着定案
              </span>
              <span>
                <Check /> 均值：保留两名合理候选
              </span>
              <span>
                <Check /> 指挥：两队行动与同一道口令吻合
              </span>
            </div>
            <div className={s.victoryActions}>
              <button className={s.primary} onClick={again}>
                再战一局 <RotateCcw />
              </button>
              <Link
                className={s.secondary}
                href="/courses/ai-with-python/lesson-04#l4-summary"
              >
                带走调查方法 <ArrowRight />
              </Link>
            </div>
            <span className={s.caption}>
              下一局，宿主和观测数据会一起变化。
            </span>
          </div>
        </main>
      ) : (
        <main className={s.battle}>
          <div className={s.roundHeading}>
            <div>
              <span className={s.eyebrow}>
                第{' '}
                {save.phase === 'scan'
                  ? '一'
                  : save.phase === 'choose'
                    ? '二'
                    : '三'}{' '}
                道封印
              </span>
              <h1>{headline}</h1>
              <p>{instruction}</p>
            </div>
            <button
              className={s.sourceButton}
              onClick={() => setRecordsOpen(true)}
            >
              <Eye /> 最新观测
            </button>
          </div>
          <div className={s.arena}>
            <div className={s.demons}>
              {rows.map((row, i) => {
                const isSelected = save.selected.includes(row.id),
                  isSpeaking = filmPlaying && currentClip?.actor === row.id;
                return (
                  <button
                    key={row.id}
                    className={s.target}
                    data-selected={isSelected}
                    data-speaking={isSpeaking}
                    data-outlier={save.phase !== 'scan' && row.count === 1}
                    data-response={isSpeaking && currentClip?.kind === 'action'}
                    data-hit={
                      effect?.target === row.id ? effect.kind : undefined
                    }
                    disabled={busy || suspended || filmPlaying}
                    onClick={() => choose(row.id)}
                    aria-pressed={
                      save.phase === 'choose' ? isSelected : undefined
                    }
                    aria-label={
                      save.phase === 'choose'
                        ? `选择${row.name}`
                        : `攻击${row.name}`
                    }
                    style={{ '--index': i } as CSSProperties}
                  >
                    <div className={s.portraitZone}>
                      <div className={s.aura} />
                      <div className={s.ward} />
                      <DemonArt id={row.id} />
                      {taunting && <span className={s.tauntLabel}>嘻嘻…</span>}
                      {isSelected && !taunting && (
                        <span className={s.targetLock}>
                          <Crosshair /> 重点对象
                        </span>
                      )}
                      {isSpeaking && (
                        <span className={s.speakingLabel}>
                          <Radio />{' '}
                          {currentClip?.kind === 'order'
                            ? '下达口令'
                            : `已到${currentClip?.place}`}
                        </span>
                      )}
                    </div>
                    <div className={s.statPanel}>
                      <h2>{row.name}</h2>
                      <div className={s.reading}>
                        <span>平均威胁</span>
                        <strong>{row.mean.toFixed(1)}</strong>
                      </div>
                      <div
                        className={s.count}
                        data-revealed={save.phase !== 'scan'}
                      >
                        {save.phase === 'scan' ? (
                          <>
                            <Shield size={18} /> 观测次数待扫描
                          </>
                        ) : (
                          <>
                            <b>{row.count}</b> 次观测
                            {row.count === 1 && <span>仅一次</span>}
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {effect && effect.kind !== 'proof' && (
              <BattleEffect effect={effect} />
            )}
            {save.phase === 'evidence' && proving && (
              <svg
                className={s.commandPaths}
                viewBox="0 0 1000 300"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {battle.commands.responses.map((response, i) => {
                  const from =
                      125 + DEMONS.findIndex((d) => d.id === battle.host) * 250,
                    to =
                      125 +
                      DEMONS.findIndex((d) => d.id === response.actor) * 250;
                  return (
                    <path
                      key={i}
                      data-active="true"
                      d={`M${from} 180 Q${(from + to) / 2} -10 ${to} 180`}
                    />
                  );
                })}
              </svg>
            )}
          </div>
          {save.phase === 'evidence' && (
            <div className={s.evidence}>
              {filmPlaying ? (
                <div className={s.filmCaption} aria-live="polite">
                  <span className={s.rec}>
                    <i /> 现场回放
                  </span>
                  <strong>
                    {currentClip
                      ? `${nameOf(currentClip.actor)}：“${currentClip.text}”`
                      : '猫头鹰发现了新的指挥信号…'}
                  </strong>
                  <div className={s.filmProgress}>
                    <i
                      style={{ width: `${(filmTime / FILM_DURATION) * 100}%` }}
                    />
                  </div>
                </div>
              ) : save.evidenceSeen ? (
                <div className={s.evidenceCards}>
                  {clips.map((clip, i) => (
                    <div
                      key={clip.actor}
                      data-proof={
                        proving
                          ? clip.kind === 'action' || clip.actor === battle.host
                            ? 'match'
                            : 'decoy'
                          : undefined
                      }
                    >
                      <span>
                        {i + 1} · {clip.label}
                      </span>
                      <strong>{nameOf(clip.actor)}</strong>
                      <p>
                        {clip.kind === 'order'
                          ? clip.text
                              .split('！')
                              .filter(Boolean)
                              .map((line) => (
                                <span className={s.orderLine} key={line}>
                                  {line}！
                                </span>
                              ))
                          : clip.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={s.filmCaption}>
                  <Radio />
                  <strong>猫头鹰带回了现场记录，准备核对发令者。</strong>
                </div>
              )}
            </div>
          )}
          <footer className={s.actionDock}>
            <output className={s.feedback} data-mood={mood}>
              <span className={s.feedbackIcon}>
                {mood === 'bad' ? (
                  <Shield />
                ) : mood === 'good' ? (
                  <Sparkles />
                ) : (
                  <Radio />
                )}
              </span>
              <p>
                {paused
                  ? '战场暂停，全班讨论。看着当前数据与口令，想清楚再行动。'
                  : message ||
                    (save.phase === 'choose'
                      ? '点选两名对象，再锁定调查方向。'
                      : save.phase === 'evidence'
                        ? '回放记录保留在上方，请全班讨论后指认。'
                        : '全班先判断：只凭平均值，证据够吗？')}
              </p>
            </output>
            <div className={s.mainActions}>
              {paused ? (
                <button className={s.primary} onClick={() => setPaused(false)}>
                  <Play /> 继续行动
                </button>
              ) : save.phase === 'scan' ? (
                <>
                  <button
                    className={s.secondary}
                    disabled={busy || suspended}
                    onClick={() => choose(battle.outlier)}
                  >
                    <Swords /> 攻击最高者
                  </button>
                  <button
                    className={s.primary}
                    disabled={busy || suspended}
                    onClick={scan}
                  >
                    <ScanLine /> 先查观测次数
                  </button>
                </>
              ) : save.phase === 'choose' ? (
                <>
                  <span className={s.selectionCount}>
                    已选 {save.selected.length} / 2
                  </span>
                  <button
                    className={s.primary}
                    disabled={busy || suspended}
                    onClick={lock}
                  >
                    <Crosshair /> 锁定这两名
                  </button>
                </>
              ) : filmPlaying ? (
                <button className={s.secondary} onClick={() => setPaused(true)}>
                  <Pause /> 暂停讨论
                </button>
              ) : (
                <button
                  className={s.secondary}
                  disabled={busy || suspended}
                  onClick={startFilm}
                >
                  <Play /> {save.evidenceSeen ? '重播指挥片段' : '播放指挥片段'}
                </button>
              )}
            </div>
          </footer>
        </main>
      )}
      {resetOpen && (
        <div className={s.overlay}>
          <dialog
            open
            className={s.pausePanel}
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <RotateCcw />
            <h2 id="reset-title">开启新的伪装？</h2>
            <p>本轮进度将清空，新的宿主与观测数据一起出现。</p>
            <div className={s.mainActions}>
              <button
                autoFocus
                className={s.secondary}
                onClick={() => setResetOpen(false)}
              >
                保留本轮
              </button>
              <button className={s.primary} onClick={again}>
                开启新一局
              </button>
            </div>
          </dialog>
        </div>
      )}
      {recordsOpen && (
        <div className={s.overlay}>
          <dialog
            open
            className={s.recordsPanel}
            aria-modal="true"
            aria-labelledby="records-title"
          >
            <header>
              <div>
                <span className={s.eyebrow}>独立于课堂战报的新样本</span>
                <h2 id="records-title">哨塔最新观测</h2>
              </div>
              <button
                autoFocus
                onClick={() => setRecordsOpen(false)}
                aria-label="关闭最新观测"
              >
                <X />
              </button>
            </header>
            <p>每个数是一条观测的威胁读数；均值与次数都由这些记录计算。</p>
            <div className={s.recordGroups}>
              {rows.map((row) => (
                <div key={row.id}>
                  <strong>{row.name}</strong>
                  <p>
                    {battle.records
                      .filter((record) => record.demons.includes(row.id))
                      .map((record) => record.threat)
                      .join(' · ')}
                  </p>
                </div>
              ))}
            </div>
            <p className={s.caption}>
              观测只能提供调查方向，指挥身份还需要现场证据。
            </p>
          </dialog>
        </div>
      )}
    </div>
  );
}
