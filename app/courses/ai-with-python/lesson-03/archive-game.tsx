/* oxlint-disable next/no-img-element -- Local game art is layered with accessible HTML controls. */
'use client';

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Download,
  FileCode2,
  Flame,
  Hourglass,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Sun,
  Undo2,
  WifiOff,
  X,
} from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  archiveFiles,
  archiveReducer,
  codeSlots,
  readSlots,
  createArchiveState,
  expectedGrid,
  fields,
  fullArchiveCode,
  isCellCorrect,
  isGridCorrect,
  type ArchiveAction,
} from './archive-engine';
import g from './archive-game.module.css';

const stepNames = ['找档案', '整理情报', '保存文件'];
const titles = [
  '哪份档案能帮助我们布防？',
  '从手记中找出信息，填入表格',
  '补全代码，保存防御档案',
];
// Stable between interactions; each attack applies a new shuffled permutation.
function scattered<T>(
  items: readonly T[],
  seeds: readonly number[],
  salt = 0,
): T[] {
  const result = [...items];
  for (const attackSeed of seeds) {
    let seed = (attackSeed + salt * 97) >>> 0;
    const before = [...result];
    for (let i = result.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (result.length > 1 && result.every((item, i) => item === before[i])) {
      [result[0], result[1]] = [result[1], result[0]];
    }
  }
  return result;
}
const defenses = ['探照灯', '火把', '供热装置'];
const defenseIcons = [Sun, Flame, Snowflake];

function DemonSprite({ index }: { index: number }) {
  const [left, width] = [
    [39, 720],
    [766, 670],
    [1460, 690],
  ][index];
  return (
    <svg
      viewBox={`${left} 0 ${width} 724`}
      aria-hidden="true"
      focusable="false"
    >
      <image
        href="/courses/ai-with-python/lesson-03/assets/archive-siege/demons.png"
        width="2172"
        height="724"
      />
    </svg>
  );
}

function Python({ children }: { children: string }) {
  return children
    .split(/("[^"\n]*"|\b(?:import|with|as)\b)/g)
    .map((part, i) => (
      <span
        key={i}
        className={
          part.startsWith('"')
            ? g.string
            : /^(import|with|as)$/.test(part)
              ? g.keyword
              : undefined
        }
      >
        {part}
      </span>
    ));
}
function DataTable({ grid }: { grid: string[][] }) {
  return (
    <table className={g.dataTable}>
      <thead>
        <tr>
          {fields.map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.map((row, r) => (
          <tr key={r}>
            {row.map((cell, c) => (
              <td key={c}>{cell || '—'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function download(content: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/plain;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ArchiveGame() {
  const [page, update] = usePageState({
    siege: createArchiveState(),
    formatView: false,
  });
  const state = useMemo(
    () => ({
      ...createArchiveState(),
      ...page.siege,
      remainingMs: Math.min(300000, page.siege.remainingMs),
    }),
    [page.siege],
  );
  const current = useRef(state);
  const updateRef = useRef(update);
  useLayoutEffect(() => {
    current.current = state;
    updateRef.current = update;
  }, [state, update]);
  const [hidden, setHidden] = useState(false);
  const [dialog, setDialog] = useState<'code' | 'reset' | null>(null);
  const formatView = page.formatView;
  const setFormatView = (value: boolean) => update({ formatView: value });
  const [flight, setFlight] = useState<{
    text: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
  } | null>(null);
  const [victoryStep, setVictoryStep] = useState(state.phase === 'won' ? 3 : 0);
  const [replaying, setReplaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const send = (action: ArchiveAction) => {
    const next = archiveReducer(current.current, action);
    current.current = next;
    updateRef.current({ siege: next });
  };
  useEffect(() => {
    if (!flight) return;
    const timer = window.setTimeout(() => setFlight(null), 450);
    return () => window.clearTimeout(timer);
  }, [flight]);
  function placeToken(row: number, col: number, target: HTMLButtonElement) {
    const source = gameRef.current?.querySelector(
      `[aria-pressed="true"].${g.token}`,
    );
    const room = gameRef.current?.getBoundingClientRect();
    if (source && room && state.selectedToken) {
      const a = source.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      setFlight({
        text: state.selectedToken,
        x: a.left - room.left,
        y: a.top - room.top,
        dx: b.left - a.left + 12,
        dy: b.top - a.top + 12,
      });
    }
    send({ type: 'place', row, col });
  }
  useEffect(() => {
    let previous = performance.now();
    let available = !document.hidden;
    const visibility = () => {
      previous = performance.now();
      available = !document.hidden;
      setHidden(document.hidden);
    };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - previous;
      previous = now;
      const blocked =
        document.hidden || !!document.querySelector('[role="dialog"]');
      if (!blocked && available) {
        const next = archiveReducer(current.current, {
          type: 'tick',
          elapsedMs: elapsed,
          random: Math.random(),
        });
        if (next !== current.current) {
          if (next.phase === 'won' && current.current.phase !== 'won') {
            setVictoryStep(0);
            setReplaying(true);
          }
          current.current = next;
          updateRef.current({ siege: next });
        }
      }
      available = !blocked;
    }, 250);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    if (state.phase !== 'won' || state.paused || hidden || dialog || !replaying)
      return;
    const timer = window.setTimeout(() => {
      setVictoryStep(Math.min(3, victoryStep + 1));
      if (victoryStep >= 2) setReplaying(false);
    }, 1300);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.paused, hidden, dialog, replaying, victoryStep]);

  const selected = archiveFiles.find((file) => file.id === state.selectedFile);
  const opened = archiveFiles.find((file) => file.id === state.openedFile);
  const raiding = state.phase === 'playing' && state.raidRemainingMs > 0;
  const blocked = state.phase !== 'playing' || state.paused || raiding;
  const correctGrid = state.gridChecked && isGridCorrect(state.grid);
  const format = state.step === 1 && correctGrid && formatView;
  const seconds = Math.ceil(state.remainingMs / 1000);
  const timer = `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const threat =
    state.remainingMs <= 60000 ? 2 : state.remainingMs <= 120000 ? 1 : 0;
  const readSlot = (index: number) => (
    <button
      type="button"
      className={g.codeSlot}
      data-active={state.activeReadSlot === index}
      data-error={
        state.readChecked &&
        state.readChoices[index] !== readSlots[index].answer
      }
      aria-label={`选择${readSlots[index].label}`}
      onClick={() => send({ type: 'read-slot', index })}
    >
      {state.readChoices[index] || '____'}
    </button>
  );
  const readLines = [
    <Python key="path">{`path = ${selected ? JSON.stringify(selected.path) : '"请选择档案"'}`}</Python>,
    <span key="open">
      <Python>{'with open(path, '}</Python>
      {readSlot(0)}
      <Python>{', encoding="utf-8") as f:'}</Python>
    </span>,
    <span key="read">
      {'    intel = f.'}
      {readSlot(1)}
      {'()'}
    </span>,
    <span key="blank"> </span>,
    <span key="print">{'print(intel)'}</span>,
  ];
  const slot = (index: number) => (
    <button
      type="button"
      className={g.codeSlot}
      data-active={state.activeSlot === index}
      data-error={
        state.codeChecked && state.choices[index] !== codeSlots[index].answer
      }
      disabled={blocked}
      aria-label={`选择${codeSlots[index].label}`}
      onClick={() => send({ type: 'slot', index })}
    >
      {state.choices[index] || '____'}
    </button>
  );
  const lines: ReactNode[] = [
    <Python key="import">import csv</Python>,
    <span key="blank"> </span>,
    <Python key="fields">{'fields = ["恶魔", "地点", "弱点"]'}</Python>,
    <Python key="path">{'path = "./defense.csv"'}</Python>,
    <span key="open">
      <Python>{'with open(path, '}</Python>
      {slot(0)}
      <Python>{', newline="", encoding="utf-8") as f:'}</Python>
    </span>,
    <span key="writer">
      {'    writer = csv.'}
      {slot(1)}
      {'(f, fieldnames='}
      {slot(2)}
      {')'}
    </span>,
    <span key="header">
      {'    writer.'}
      {slot(3)}
      {'()'}
    </span>,
    <span key="rows">
      {'    writer.'}
      {slot(4)}
      {'(records)'}
    </span>,
  ];
  function reset() {
    send({ type: 'restart' });
    setFormatView(false);
    setDialog(null);
    setVictoryStep(0);
    setReplaying(false);
  }
  function save(random: number) {
    send({ type: 'save', random });
    if (current.current.phase === 'won') {
      setVictoryStep(0);
      setReplaying(true);
    }
  }

  return (
    <div
      ref={gameRef}
      className={g.game}
      data-step={state.step}
      data-raid={raiding}
      data-phase={state.phase}
      data-threat={threat}
      data-paused={
        state.paused ||
        hidden ||
        !!dialog ||
        state.phase === 'ready' ||
        state.phase === 'timeout' ||
        (state.phase === 'won' && !replaying)
      }
      style={{ '--approach': 1 - state.remainingMs / 300000 } as CSSProperties}
    >
      <div className={g.room} aria-hidden="true" />
      <div className={g.invasion} aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={g.invader}
            data-repelled={
              state.phase === 'won' &&
              victoryStep >
                state.grid.findIndex((row) => row[0] === expectedGrid[index][0])
            }
            style={
              {
                '--demon': index,
                '--offset': `${index * 34}%`,
              } as CSSProperties
            }
          >
            <DemonSprite index={index} />
          </div>
        ))}
      </div>
      <header className={g.hud}>
        <span className={g.brand}>
          <ShieldCheck />
          <strong>守住城堡档案室</strong>
        </span>
        <ol className={g.steps}>
          {stepNames.map((name, index) => (
            <li
              key={name}
              aria-current={state.step === index ? 'step' : undefined}
              data-done={state.step > index || state.phase === 'won'}
            >
              <span>
                {state.step > index || state.phase === 'won' ? (
                  <Check size={18} />
                ) : (
                  `0${index + 1}`
                )}
              </span>
              {name}
            </li>
          ))}
        </ol>
        <span
          className={g.timer}
          role="timer"
          aria-label={`剩余 ${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`}
        >
          <Hourglass size={22} />
          {state.practice ? '练习' : timer}
        </span>
        <button
          className={g.pause}
          disabled={state.phase !== 'playing'}
          onClick={() => send({ type: 'pause' })}
        >
          {state.paused ? <Play size={20} /> : <Pause size={20} />}
          {state.paused ? '继续作战' : '暂停讨论'}
        </button>
      </header>

      {state.phase === 'ready' ? (
        <div className={g.lobby}>
          <div className={g.brief}>
            <span className={g.eyebrow}>
              <WifiOff size={22} />
              通信中断 · 本地档案仍在
            </span>
            <h1>
              恶魔即将抵达。
              <br />
              防御办法，藏在档案里。
            </h1>
            <p>
              全班共同指挥，找出三只恶魔的弱点，
              <br />
              把防御情报保存成一份 CSV 档案。
            </p>
            <div className={g.missionSteps}>
              {stepNames.map((name, i) => (
                <span key={name}>
                  <b>0{i + 1}</b>
                  {name}
                </span>
              ))}
            </div>
            <div className={g.startRow}>
              <button
                className={g.gold}
                onClick={() => send({ type: 'start', random: Math.random() })}
              >
                进入档案室 <ArrowRight size={24} />
              </button>
              <span>
                5 分钟作战时间
                <br />
                教师可随时暂停讨论
              </span>
            </div>
          </div>
          <div className={g.lobbySeal}>
            <Hourglass size={46} />
            <strong>05:00</strong>
            <span>守住城门的最后机会</span>
          </div>
        </div>
      ) : state.phase === 'won' ? (
        <div className={g.victory}>
          <div className={g.victoryHeading}>
            <ShieldCheck size={38} />
            <div>
              <span>{state.practice ? '练习完成' : '限时任务完成'}</span>
              <h1>档案送达，三道防线启动！</h1>
            </div>
            <button
              className={g.blue}
              onClick={() => {
                setVictoryStep(0);
                setReplaying(true);
              }}
            >
              <Play size={20} />
              重播布防
            </button>
            <button
              className={g.blue}
              disabled={!replaying && victoryStep >= 3}
              onClick={() => setReplaying((value) => !value)}
            >
              {replaying ? <Pause size={20} /> : <Play size={20} />}
              {replaying || victoryStep >= 3 ? '暂停演出' : '继续演出'}
            </button>
          </div>
          <div className={g.defenses}>
            {state.grid.map((row, index) => {
              const demonIndex = expectedGrid.findIndex(
                (record) => record[0] === row[0],
              );
              const Icon = defenseIcons[demonIndex];
              return (
                <article
                  key={row[0]}
                  data-active={victoryStep > index}
                  data-demon={demonIndex}
                >
                  <div className={g.demonPortrait}>
                    <DemonSprite index={demonIndex} />
                  </div>
                  <div className={g.defenseBeam} />
                  <div
                    className={g.defenseDevice}
                    style={{ backgroundPosition: `${demonIndex * 50}% center` }}
                    aria-hidden="true"
                  />
                  <span>记录地点：{row[1]}</span>
                  <h2>{row[0]}</h2>
                  <p>{row[2]}</p>
                  {victoryStep > index && (
                    <span className={g.repelledBadge}>
                      <Check size={18} />
                      已击退
                    </span>
                  )}
                  <strong>
                    <Icon size={27} />
                    {defenses[demonIndex]}
                    {victoryStep > index ? '已启动' : '待启动'}
                  </strong>
                </article>
              );
            })}
          </div>
          <div className={g.victoryBottom}>
            <section className={g.paper}>
              <h2>
                <Check size={23} />
                defense.csv · 已模拟读回核对
              </h2>
              <pre>{state.savedCsv}</pre>
            </section>
            <div className={g.victoryActions}>
              <p>
                找到档案 → 整理情报 → 写入文件
                <br />
                勇士把这份档案带到了城门。
              </p>
              <button
                className={g.gold}
                onClick={() => download(state.savedCsv!, 'defense.csv')}
              >
                <Download size={21} />
                下载防御档案
              </button>
              <button className={g.blue} onClick={() => setDialog('code')}>
                <FileCode2 size={21} />
                完整 Python 代码
              </button>
              <button className={g.blue} onClick={() => setDialog('reset')}>
                <RotateCcw size={20} />
                重新挑战
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={g.heading}>
            <h1>
              {format ? '让表格成为有规则的 CSV 文本' : titles[state.step]}
            </h1>
            <span className={g.threatLabel}>
              {state.paused
                ? '作战暂停 · 全班讨论'
                : state.practice
                  ? '继续练习 · 不计时'
                  : ['远处发现恶魔', '恶魔已登上石桥', '警报！恶魔逼近城门'][
                      threat
                    ]}
            </span>
          </div>
          <fieldset className={g.workspace} disabled={blocked}>
            <legend className="sr-only">{titles[state.step]}</legend>
            {state.step === 0 && (
              <div className={g.readLayout}>
                <div className={g.cabinet}>
                  {scattered(archiveFiles, state.raidSeeds).map((file) => (
                    <button
                      key={file.id}
                      className={g.book}
                      data-selected={state.selectedFile === file.id}
                      onClick={() => send({ type: 'select-file', id: file.id })}
                      aria-label={`选择${file.title}`}
                      aria-pressed={state.selectedFile === file.id}
                    >
                      <span
                        className={g.bookArt}
                        style={{
                          backgroundPosition: `${(archiveFiles.indexOf(file) * 100) / 3}% center`,
                        }}
                      />
                      <span className={g.bookLabel}>
                        <strong>{file.title}</strong>
                        <code>{file.path.slice(2)}</code>
                      </span>
                      {state.readFiles.includes(file.id) && (
                        <span className={g.readBadge}>
                          <Check size={18} />
                          已读
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <section className={`${g.paper} ${g.readPanel}`}>
                  <div className={g.readNotebook}>
                    <div className={g.notebookTab}>
                      <BookOpen size={20} />
                      archive.ipynb
                    </div>
                    <div
                      className={`${g.code} ${g.readCode}`}
                      aria-label="待补全的 Python 读取代码"
                    >
                      {readLines.map((line, i) => (
                        <div className={g.codeLine} key={i}>
                          <span className={g.lineNumber} aria-hidden="true">
                            {i + 1}
                          </span>
                          <code>{line}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={g.readChoices}>
                    <h2>
                      {state.activeReadSlot + 1}/2 ·{' '}
                      {readSlots[state.activeReadSlot].label}
                    </h2>
                    <div className={g.readChoiceRow}>
                      <div className={g.options}>
                        {scattered(
                          readSlots[state.activeReadSlot].options,
                          state.raidSeeds,
                          state.activeReadSlot + 9,
                        ).map((value) => (
                          <button
                            key={value}
                            aria-pressed={
                              state.readChoices[state.activeReadSlot] === value
                            }
                            onClick={() => send({ type: 'read-choice', value })}
                          >
                            <code>{value}</code>
                          </button>
                        ))}
                      </div>
                      <button
                        className={g.gold}
                        onClick={() => send({ type: 'read' })}
                      >
                        <BookOpen size={20} />
                        打开档案
                      </button>
                    </div>
                  </div>
                  <div className={g.output}>
                    <h2>
                      {opened ? `读到的内容 · ${opened.title}` : '读到的内容'}
                    </h2>
                    <pre>
                      {opened ? opened.text : '选档案，补全两处代码，再打开。'}
                    </pre>
                  </div>
                  <button
                    className={g.gold}
                    onClick={() =>
                      send({ type: 'use-file', random: Math.random() })
                    }
                  >
                    用这份情报布防 <ArrowRight size={20} />
                  </button>
                </section>
              </div>
            )}
            {state.step === 1 && !format && (
              <div className={g.organizeLayout}>
                <section className={`${g.paper} ${g.source}`}>
                  <h2>
                    <BookOpen size={26} />
                    侦察员手记
                  </h2>
                  {scattered(expectedGrid, state.raidSeeds, 4).map(
                    (row, index) => (
                      <p
                        key={row[0]}
                        style={{
                          textAlign:
                            state.raidSerial && (index + state.raidSerial) % 2
                              ? 'right'
                              : 'left',
                        }}
                      >
                        {[row[1], '发现了', row[0], '，它', row[2], '。'].map(
                          (text, i) =>
                            i % 2 === 0 ? (
                              <button
                                key={i}
                                className={g.token}
                                data-used={state.grid.flat().includes(text)}
                                aria-pressed={state.selectedToken === text}
                                onClick={() =>
                                  send({ type: 'token', value: text })
                                }
                              >
                                {text}
                              </button>
                            ) : (
                              <span key={i}>
                                {i === 3 ? (
                                  <>
                                    ，<br />它
                                  </>
                                ) : (
                                  text
                                )}
                              </span>
                            ),
                        )}
                      </p>
                    ),
                  )}
                  <div className={g.instruction}>
                    {state.selectedToken ? (
                      <>
                        已选中 <strong>{state.selectedToken}</strong>
                        ，请点击目标格子。
                      </>
                    ) : (
                      '先点选原文中的信息，再点目标格子。'
                    )}
                  </div>
                </section>
                <section className={`${g.paper} ${g.tablePanel}`}>
                  <h2>防御情报表</h2>
                  <table className={g.fillTable}>
                    <thead>
                      <tr>
                        {fields.map((field) => (
                          <th key={field}>{field}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {state.grid.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td key={c}>
                              <button
                                key={cell}
                                data-error={
                                  state.gridChecked &&
                                  !isCellCorrect(state.grid, r, c)
                                }
                                data-filled={!!cell}
                                aria-label={`第${r + 1}行${fields[c]}${cell ? `：${cell}` : '空格'}`}
                                onClick={(event) =>
                                  placeToken(r, c, event.currentTarget)
                                }
                              >
                                {cell || '······'}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className={g.tableActions}>
                    <button
                      className={g.blue}
                      disabled={!state.gridHistory.length}
                      onClick={() => send({ type: 'undo' })}
                    >
                      <Undo2 size={20} />
                      撤回一步
                    </button>
                    {correctGrid ? (
                      <button
                        className={g.gold}
                        onClick={() => setFormatView(true)}
                      >
                        整理 CSV 格式 <ArrowRight size={20} />
                      </button>
                    ) : (
                      <button
                        className={g.gold}
                        onClick={() => send({ type: 'check-grid' })}
                      >
                        核对情报 <Check size={20} />
                      </button>
                    )}
                  </div>
                </section>
              </div>
            )}
            {state.step === 1 && format && (
              <div className={g.formatLayout}>
                <section className={`${g.paper} ${g.formatControls}`}>
                  <h2>列与行，分别怎样分开？</h2>
                  <DataTable grid={state.grid} />
                  <div>
                    <h3>字段之间，用什么分隔？</h3>
                    <div className={g.options}>
                      {scattered(
                        [
                          ['英文逗号 ,', ','],
                          ['中文逗号 ，', '，'],
                          ['空格', ' '],
                        ],
                        state.raidSeeds,
                        15,
                      ).map(([label, value]) => (
                        <button
                          key={label}
                          aria-pressed={state.separator === value}
                          onClick={() => send({ type: 'separator', value })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3>一条记录结束后呢？</h3>
                    <div className={g.options}>
                      {scattered(
                        [
                          ['换到下一行', '\n'],
                          ['继续接在后面', 'none'],
                        ],
                        state.raidSeeds,
                        18,
                      ).map(([label, value]) => (
                        <button
                          key={label}
                          aria-pressed={state.lineBreak === value}
                          onClick={() => send({ type: 'line-break', value })}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
                <section className={`${g.paper} ${g.csvPanel}`}>
                  <h2>CSV 文本预览</h2>
                  <pre>
                    {state.separator
                      ? [fields, ...state.grid]
                          .map((row) => row.join(state.separator))
                          .join(state.lineBreak === '\n' ? '\n' : '')
                      : '选择分隔方式，观察文本怎样变化。'}
                  </pre>
                  <p>
                    观察表头和三条情报：
                    <br />
                    怎样才能分清字段与记录？
                  </p>
                  <div className={g.tableActions}>
                    <button
                      className={g.blue}
                      onClick={() => setFormatView(false)}
                    >
                      返回表格
                    </button>
                    <button
                      className={g.gold}
                      onClick={() =>
                        send({ type: 'check-format', random: Math.random() })
                      }
                    >
                      核对并去保存 <ArrowRight size={20} />
                    </button>
                  </div>
                </section>
              </div>
            )}
            {state.step === 2 && (
              <div className={g.writeLayout}>
                <section className={`${g.paper} ${g.writePanel}`}>
                  <div className={g.notebookTab}>
                    <BookOpen size={21} />
                    archive.ipynb <span>Python 3</span>
                  </div>
                  <p className={g.recordsNote}>
                    写入代码节选 · records 已由上一环节生成
                  </p>
                  <div className={g.code} aria-label="待补全的 Python 写入代码">
                    {lines.map((line, i) => (
                      <div className={g.codeLine} key={i}>
                        <span className={g.lineNumber} aria-hidden="true">
                          {i + 1}
                        </span>
                        <code>{line}</code>
                      </div>
                    ))}
                  </div>
                  <div className={g.choiceArea}>
                    <h2>
                      <span>{state.activeSlot + 1} / 5</span>
                      {codeSlots[state.activeSlot].label}
                    </h2>
                    <div className={g.options}>
                      {scattered(
                        codeSlots[state.activeSlot].options,
                        state.raidSeeds,
                        state.activeSlot + 20,
                      ).map((value) => (
                        <button
                          key={value}
                          aria-pressed={
                            state.choices[state.activeSlot] === value
                          }
                          onClick={() => send({ type: 'choice', value })}
                        >
                          <code>{value}</code>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
                <section className={`${g.paper} ${g.savePanel}`}>
                  <h2>待保存的内容</h2>
                  <DataTable grid={state.grid} />
                  <div className={g.fileSeal}>
                    <FileCode2 size={65} />
                    <strong>defense.csv</strong>
                    <span>尚未保存</span>
                  </div>
                  <button
                    className={g.gold}
                    onClick={() => save(Math.random())}
                  >
                    保存防御档案
                  </button>
                </section>
              </div>
            )}
          </fieldset>
          <footer className={g.feedback} data-tone={state.tone}>
            <img
              src="/courses/ai-with-python/lesson-01/assets/xiaopai-guide.png"
              alt="小派"
            />
            <p aria-live="polite">{state.feedback}</p>
            <button aria-label="重新挑战" onClick={() => setDialog('reset')}>
              <RotateCcw size={22} />
            </button>
          </footer>
          {state.phase === 'timeout' && (
            <div className={g.timeout}>
              <div>
                <Hourglass size={44} />
                <h2>恶魔抵达城门！</h2>
                <p>
                  还差“{stepNames[state.step]}”。
                  <br />
                  当前情报和选择都已保留。
                </p>
                <button
                  className={g.gold}
                  onClick={() => send({ type: 'continue-practice' })}
                >
                  继续练习
                </button>
                <button className={g.blue} onClick={reset}>
                  重新挑战
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {raiding && (
        <output
          className={g.raidOverlay}
          key={state.raidSerial}
          aria-live="assertive"
        >
          <div className={g.raidRift} aria-hidden="true" />
          <div className={g.raidClaws} aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className={g.raidDemon} aria-hidden="true">
            <DemonSprite index={state.raidDemon} />
          </div>
          <div className={g.raidMessage}>
            <span>城墙遭到冲击</span>
            <strong>{expectedGrid[state.raidDemon][0]}突袭！</strong>
            <p>
              {
                [
                  '档案被震乱了！\n看清书名，找回目标档案。',
                  '情报被吹散了！\n已填内容保留，继续核对。',
                  '代码选项被打乱了！\n看清内容，再做选择。',
                ][state.step]
              }
            </p>
            <button className={g.blue} onClick={() => send({ type: 'pause' })}>
              {state.paused ? <Play size={20} /> : <Pause size={20} />}
              {state.paused ? '继续作战' : '暂停讨论'}
            </button>
          </div>
        </output>
      )}
      {flight && (
        <span
          className={g.flyingToken}
          style={
            {
              left: flight.x,
              top: flight.y,
              '--dx': `${flight.dx}px`,
              '--dy': `${flight.dy}px`,
            } as CSSProperties
          }
        >
          {flight.text}
        </span>
      )}
      <div className={g.simulation}>
        文件操作模拟 · 不会修改电脑上的练习文件
      </div>
      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <DialogContent className={g.dialog}>
          <DialogHeader>
            <DialogTitle>
              {dialog === 'reset'
                ? '重新开始这次挑战？'
                : '防御档案 · 完整 Python 代码'}
            </DialogTitle>
            <DialogDescription>
              {dialog === 'reset'
                ? '本次选择和作战时间将重置，课程中的其他练习保持不变。'
                : 'Python 3 标准库即可运行。先运行完整代码，再核对输出；会在当前目录新建或覆盖 defense.csv。'}
            </DialogDescription>
          </DialogHeader>
          {dialog === 'reset' ? (
            <div className={g.dialogActions}>
              <button className={g.blue} onClick={() => setDialog(null)}>
                <X size={20} />
                继续当前任务
              </button>
              <button className={g.gold} onClick={reset}>
                <RotateCcw size={20} />
                重新开始
              </button>
            </div>
          ) : (
            <>
              <div className={g.fullCode}>
                <NotebookPanel
                  title="defense.py · 完整代码"
                  cells={[
                    {
                      code: fullArchiveCode(state),
                      output: state.savedCsv || undefined,
                      outputLabel: '预期输出',
                    },
                  ]}
                />
              </div>
              <div className={g.dialogActions}>
                <button
                  className={g.blue}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        fullArchiveCode(state),
                      );
                      setCopied(true);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? '已复制' : '复制代码'}
                </button>
                <button
                  className={g.gold}
                  onClick={() => download(fullArchiveCode(state), 'defense.py')}
                >
                  <Download size={20} />
                  下载 Python 文件
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
