import { useId, type CSSProperties } from 'react';
import { DemonSprite } from '../lesson-03/demon-sprite';
import { demons } from './study-data';
import {
  patrolPoints,
  speedBins,
  targetDemon,
} from './castle-challenge-engine';
import s from './castle-challenge-visual.module.css';

type SceneEvent = 'success' | 'alarm' | 'idle' | 'victory';
type SceneProps = {
  round: number;
  completed: number;
  event: SceneEvent;
  running: boolean;
  replay?: number;
  animate?: boolean;
  exitChoice?: string | null;
};
const locations = ['魔堡外墙', '月光庭院', '巡逻长桥', '情报室', '撤离暗门'];
const kindNames = ['炎角兽族', '藤甲魔族', '冰翼魔族'];
const scannedCount = Math.max(...speedBins.map((bin) => bin.count));
const patrolKind = kindNames.indexOf(demons.find((d) => d.id === 'D001')!.kind);
const archiveKind = kindNames.indexOf(targetDemon.kind);
const crossingTime = patrolPoints.reduce((a, b) =>
  a.speed < b.speed ? a : b,
).label;
// Feet follow the same connected stone path in every scene, including replays.
const stops = [
  [85, 359],
  [223, 326],
  [370, 268],
  [522, 306],
  [613, 352],
  [710, 390],
];
const bends = [
  [153, 330],
  [299, 303],
  [446, 287],
  [570, 330],
  [661, 374],
];
const route = stops.flatMap((point, i) =>
  bends[i] ? [point, bends[i]] : [point],
);

function Tower({
  x,
  y,
  height,
  id,
  lit,
}: {
  x: number;
  y: number;
  height: number;
  id: string;
  lit: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} data-lit={lit} className={s.tower}>
      <ellipse cy="10" rx="52" ry="20" fill="#020b1c" opacity=".4" />
      <path
        d={`M-36 0V${-height}L0 ${-height + 18}V18Z`}
        fill={`url(#${id}-stone)`}
      />
      <path d={`M0 18V${-height + 18}L36 ${-height}V0Z`} fill="#132344" />
      <path
        d={`M-36 ${-height}L0 ${-height - 20}L36 ${-height}L0 ${-height + 18}Z`}
        fill="#4a6997"
        stroke="#93a9c6"
        strokeWidth="2"
      />
      <path
        d={`M-28 ${-height - 12}L0 ${-height - 72}L28 ${-height - 12}L0 ${-height + 2}Z`}
        fill={`url(#${id}-roof)`}
        stroke="#647ea4"
        strokeWidth="2"
      />
      <path
        d={`M0 ${-height - 72}V${-height - 103}l25 9-25 9`}
        fill={lit ? '#ffc91c' : '#ad685a'}
        stroke="#b7bdc9"
        strokeWidth="2"
      />
      {[0, 1].map((i) => (
        <g key={i} transform={`translate(0 ${-height + 45 + i * 38})`}>
          <path d="M-25 0v17l10 5V5Z" className={s.window} />
          <path d="M13 6v17l10-5V1Z" className={s.window} />
        </g>
      ))}
      <path
        d="M-21-35q10-23 20 0V7l-20-10Z"
        fill="#09162f"
        stroke="#6d86ab"
        strokeWidth="2"
      />
      <path d="M-36-3 0 15 36-3M0 15v-20" fill="none" stroke="#6881a5" />
    </g>
  );
}

function Door({
  x,
  y,
  open,
  id,
  archive = false,
  active = false,
  marker,
}: {
  x: number;
  y: number;
  open: boolean;
  id: string;
  archive?: boolean;
  active?: boolean;
  marker?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={s.gate}
      data-open={open}
      data-active={active}
      data-archive-door={archive || undefined}
    >
      <path
        d="M-36 5v-81q36-53 72 0V5L0 23Z"
        fill="#172b4e"
        stroke="#8ba1c1"
        strokeWidth="3"
      />
      <path
        d="M-26 1v-72q26-42 52 0V1L0 13Z"
        fill={open ? `url(#${id}-portal)` : '#061126'}
        className={s.portal}
      />
      {archive && open && (
        <foreignObject
          x="-29"
          y="-75"
          width="58"
          height="72"
          className={s.archiveReveal}
        >
          <div className={s.spriteFrame} data-archive-reveal>
            <DemonSprite index={archiveKind} />
          </div>
        </foreignObject>
      )}
      <g className={s.doorLeaf}>
        <path
          d="M-24 1v-70q24-40 48 0V1L0 12Z"
          fill={`url(#${id}-door)`}
          stroke="#b7a379"
          strokeWidth="2"
        />
        <path
          d="M0-86V10M-18-63v52L0-2l18-9v-52"
          fill="none"
          stroke="#b7a379"
        />
        <path
          d="M-9-44v-7q9-17 18 0v7M-12-44h24v20H-12Z"
          fill="#112442"
          stroke="#ffe59f"
          strokeWidth="3"
        />
      </g>
      <path d="M-38 8 0 26 38 8" fill="none" stroke="#d7c88e" strokeWidth="3" />
      {active && <ellipse cy="22" rx="40" ry="14" className={s.targetRing} />}
      {marker && (
        <g transform="translate(0 -120)">
          <circle
            r="24"
            fill={active ? '#ffc91c' : '#203c60'}
            stroke="#d2e0ef"
            strokeWidth="2"
          />
          <path
            transform="scale(2.7)"
            d={
              [
                'M-3-3L0-6V6M-3 6H3',
                'M-4-3Q0-8 4-3Q4 0-4 5H4',
                'M-4-5H3L-1 0Q4 0 4 3Q4 8-4 5',
              ][marker - 1]
            }
            fill="none"
            stroke={active ? '#102541' : '#fff6d9'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
}

function Creature({
  x,
  y,
  index,
  size = 110,
  className = '',
}: {
  x: number;
  y: number;
  index: number;
  size?: number;
  className?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className={`${s.creature} ${className}`}
        data-demon-kind={kindNames[index]}
      >
        <ellipse cy="-2" rx={size * 0.3} ry="10" fill="#030e20" opacity=".6" />
        <foreignObject x={-size / 2} y={-size} width={size} height={size}>
          <div className={s.spriteFrame}>
            <DemonSprite index={index} />
          </div>
        </foreignObject>
      </g>
    </g>
  );
}

function sceneCaption(round: number, event: SceneEvent) {
  if (event === 'victory')
    return ['东侧暗门开启', '勇士带着四份情报，走出魔堡！'];
  if (event === 'alarm')
    return ['行动暂缓', '勇士留在原地，重新观察图表再行动'];
  if (event === 'success')
    return [
      ['扫描 → 开门 → 前进', `${scannedCount} 只守卫被扫描到，勇士进入庭院`],
      ['发射诱饵 → 引开追兵', '冰翼魔追向诱饵，勇士沿通路进入长桥'],
      [
        '等待巡逻 → 穿越长桥',
        `在 ${crossingTime} 的巡逻回放中，勇士抵达情报室`,
      ],
      [
        '核查档案 → 带走情报',
        `${targetDemon.id} 确认为${targetDemon.kind}，开始寻找出口`,
      ],
    ][Math.min(round, 3)];
  return [
    ['外墙扫描镜', '城门紧闭，先看清守卫再进入魔堡'],
    ['庭院诱饵炮', '追兵挡住通路，全班决定引开哪一队'],
    ['巡逻长桥', '守卫沿桥巡逻，寻找回放中的穿越时刻'],
    ['封存档案 · D004', '勇士已到门前，补充线索后核查档案'],
    ['三道撤离门', '核对四份情报，指挥勇士走向安全出口'],
  ][Math.min(round, 4)];
}

export function CastleScene({
  round,
  completed,
  event,
  running,
  replay = 0,
  animate = false,
  exitChoice,
}: SceneProps) {
  const id = useId().replaceAll(':', '');
  const success = event === 'success';
  const victory = event === 'victory';
  const from = stops[Math.min(round, 4)];
  const to =
    stops[victory ? 5 : success ? Math.min(round + 1, 4) : Math.min(round, 4)];
  const bend = bends[Math.min(round, 4)];
  const progress = victory ? 5 : completed;
  const motionStyle = {
    '--from-x': `${from[0]}px`,
    '--from-y': `${from[1]}px`,
    '--bend-x': `${bend[0]}px`,
    '--bend-y': `${bend[1]}px`,
    '--to-x': `${to[0]}px`,
    '--to-y': `${to[1]}px`,
  } as CSSProperties;
  const [eyebrow, caption] = sceneCaption(round, event);
  return (
    <figure
      className={s.world}
      data-castle-scene
      data-zone={victory ? 'victory' : round}
      data-world-event={event}
      data-settled={event !== 'idle' && !animate}
      data-motion={running ? 'playing' : 'paused'}
      aria-label={`${locations[Math.min(round, 4)]}：${caption}。勇士在连通魔堡中行动，已获得 ${completed} 份情报。`}
    >
      <div className={s.backdrop} aria-hidden="true" />
      <div className={s.sceneHeader}>
        <span className={s.location}>
          {victory ? '安全撤离' : locations[Math.min(round, 4)]}
        </span>
        <span className={s.progress}>已深入 {completed}/4</span>
      </div>
      <div className={s.sceneViewport}>
        <svg viewBox="0 0 760 440" className={s.castle} aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-stone`} x2="1" y2="1">
              <stop stopColor="#4c6790" />
              <stop offset="1" stopColor="#263c61" />
            </linearGradient>
            <linearGradient id={`${id}-roof`} x2="1" y2="1">
              <stop stopColor="#4676b4" />
              <stop offset="1" stopColor="#11284b" />
            </linearGradient>
            <linearGradient id={`${id}-floor`} x2=".8" y2="1">
              <stop stopColor="#38516e" />
              <stop offset="1" stopColor="#152941" />
            </linearGradient>
            <linearGradient id={`${id}-door`} x2="0" y2="1">
              <stop stopColor="#345780" />
              <stop offset="1" stopColor="#122642" />
            </linearGradient>
            <linearGradient id={`${id}-portal`} x2="0" y2="1">
              <stop stopColor="#fff5b3" />
              <stop offset=".45" stopColor="#efc54c" />
              <stop offset="1" stopColor="#8b783b" />
            </linearGradient>
            <radialGradient id={`${id}-mist`}>
              <stop stopColor="#b0cbee" stopOpacity=".3" />
              <stop offset="1" stopColor="#718eb5" stopOpacity="0" />
            </radialGradient>
            <pattern
              id={`${id}-paving`}
              width="42"
              height="26"
              patternUnits="userSpaceOnUse"
              patternTransform="matrix(1 .45 -1 .45 0 0)"
            >
              <rect
                width="42"
                height="26"
                fill="none"
                stroke="#a1b7c6"
                strokeOpacity=".12"
              />
            </pattern>
          </defs>
          <ellipse
            cx="405"
            cy="383"
            rx="349"
            ry="72"
            fill="#020b1e"
            opacity=".55"
          />
          <path
            d="M29 341 363 194 736 358 400 429Z"
            fill="#111f38"
            stroke="#54718e"
            strokeWidth="2"
          />
          <path
            d="M29 325 363 178 736 342 400 413Z"
            fill={`url(#${id}-floor)`}
            stroke="#738ca5"
            strokeWidth="2"
          />
          <path
            d="M29 325 363 178 736 342 400 413Z"
            fill={`url(#${id}-paving)`}
          />
          <path
            d="M29 325v16l371 88v-16M736 342v16"
            fill="none"
            stroke="#7892a9"
            strokeWidth="2"
          />
          <path
            d="M48 355 149 309 185 326 84 373Z M608 340 732 382 710 404 587 362Z"
            fill="#425974"
            stroke="#9eafbd"
            strokeWidth="2"
          />
          <path
            d="M48 355v12l36 17 101-46v-12M710 404v11l22-22v-11"
            fill="#20354e"
            stroke="#6f839b"
            strokeWidth="2"
          />
          <path
            d="M149 305V210L358 115 608 225V324L359 207Z"
            fill="#182d4b"
            stroke="#5d7ba0"
            strokeWidth="2"
          />
          <path
            d="M149 210 358 115 608 225 594 234 358 130 165 218Z"
            fill="#577292"
          />
          <path
            d="M167 230 352 145 585 248M167 254 352 169 585 271"
            fill="none"
            stroke="#7790a8"
            strokeOpacity=".25"
            strokeWidth="2"
          />
          {Array.from({ length: 17 }, (_, i) => (
            <path
              key={i}
              d={`M${175 + i * 24} ${201 + Math.abs(i - 7) * 10}v-16l12 5v16`}
              fill="#425d80"
            />
          ))}
          <Tower x={159} y={300} height={101} id={id} lit={completed > 0} />
          <Tower x={346} y={220} height={107} id={id} lit={completed > 2} />
          <Tower x={588} y={310} height={99} id={id} lit={completed > 3} />
          <path
            d="M176 331 225 307 244 316 195 341Z"
            fill="#59718a"
            stroke="#a9bacb"
            strokeWidth="2"
          />
          <path
            d="M176 331v13l19 10 49-25v-13"
            fill="#253c58"
            stroke="#6a829d"
            strokeWidth="2"
          />
          <path
            d="M357 272 388 258 532 296 504 314Z"
            fill="#688197"
            stroke="#afc2cf"
            strokeWidth="2"
          />
          <path
            d="M357 272v23l147 42 28-18v-23l-28 18Z"
            fill="#304a63"
            stroke="#7a96af"
            strokeWidth="2"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${378 + i * 44} ${290 + i * 12}q12-30 25 6v14l-25-7Z`}
              fill="#0c1c33"
              stroke="#55728e"
              strokeWidth="2"
            />
          ))}
          <polyline
            points={route.map(([x, y]) => `${x},${y}`).join(' ')}
            className={s.walkway}
          />
          {round >= 4 && (
            <path
              d="M613 352 518 384 349 410M613 352 658 336 692 333"
              className={s.walkway}
            />
          )}
          <polyline
            points={route
              .slice(0, progress * 2 + 1)
              .map(([x, y]) => `${x},${y}`)
              .join(' ')}
            className={s.completedPath}
          />
          {stops.slice(0, 5).map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <ellipse
                rx="22"
                ry="9"
                className={i < completed ? s.doneStop : s.waitingStop}
              />
              {i < completed && <path d="M-7 0l5 3 9-6" className={s.check} />}
            </g>
          ))}
          <Door
            key={`outer-${round}-${event}-${replay}`}
            x={175}
            y={329}
            id={id}
            open={completed > 0}
            active={round === 0}
          />
          <g
            transform="translate(242 324)"
            className={s.cannon}
            data-active={round === 1}
          >
            <ellipse cy="14" rx="30" ry="10" fill="#06162c" opacity=".7" />
            <path
              d="M-23 8v-20l23-13 23 13V8L0 20Z"
              fill="#263e61"
              stroke="#a6b4c9"
              strokeWidth="2"
            />
            <path
              d="M-15-17 3-43 23-35 7-9Z"
              fill="#4b709d"
              stroke="#c5d6e2"
              strokeWidth="2"
            />
            <ellipse
              cx="13"
              cy="-39"
              rx="12"
              ry="6"
              transform="rotate(22 13 -39)"
              className={s.cannonCore}
            />
            <path d="M-7 0 0-10 7 0 0 10Z" fill="#ffc91c" />
          </g>
          <g transform="translate(547 321)">
            <path
              d="M-38-19v-103l56-26 64 31v99L25 12Z"
              fill="#1b2d47"
              stroke="#778daa"
              strokeWidth="2"
            />
            <path
              d="M-44-122 18-160 86-119 25-86Z"
              fill={`url(#${id}-roof)`}
              stroke="#91a7c2"
              strokeWidth="2"
            />
            <path
              d="M25-86v98l57-30v-99"
              fill="#101f38"
              stroke="#617c9d"
              strokeWidth="2"
            />
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${34 + i * 13} ${-72 - i * 6}v28l7-3v-28Z`}
                fill={completed > 3 ? '#ffd66b' : '#41698e'}
              />
            ))}
            <path
              d="M-26-108 8-92M-26-88 8-72"
              stroke="#9d8b6b"
              strokeWidth="2"
            />
          </g>
          <Door
            key={`archive-${round}-${event}-${replay}`}
            x={544}
            y={319}
            id={id}
            open={completed > 3}
            archive
            active={round === 3}
          />
          {round >= 4 && (
            <>
              <Door
                x={349}
                y={397}
                id={id}
                open={false}
                active={exitChoice === 'west'}
                marker={1}
              />
              <Door
                x={692}
                y={319}
                id={id}
                open={false}
                active={exitChoice === 'north'}
                marker={2}
              />
            </>
          )}
          <Door
            key={`exit-${round}-${event}-${replay}`}
            x={668}
            y={378}
            id={id}
            open={victory}
            active={round >= 4 && (victory || exitChoice === 'east')}
            marker={round >= 4 ? 3 : undefined}
          />
          {[
            [112, 322],
            [271, 341],
            [420, 291],
            [493, 309],
            [618, 358],
            [700, 377],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M0 0v-21m-6 6h12" stroke="#8b967d" strokeWidth="3" />
              <ellipse cy="-25" rx="5" ry="9" className={s.torch} />
            </g>
          ))}
          <g key={`${round}-${event}-${replay}`} className={s.actionActors}>
            <Creature
              x={285}
              y={354}
              index={0}
              size={96}
              className={s.sideGuard}
            />
            <Creature
              x={402}
              y={345}
              index={1}
              size={101}
              className={s.sideGuard}
            />
            {round <= 1 && (
              <Creature
                x={334}
                y={284}
                index={2}
                size={123}
                className={s.iceGuard}
              />
            )}
            {round >= 2 && (
              <Creature
                x={round === 2 ? 458 : 514}
                y={round === 2 ? 294 : 344}
                index={patrolKind}
                size={round === 2 ? 110 : 88}
                className={round === 2 ? s.patrolGuard : s.pastPatrol}
              />
            )}
            {round === 0 && success && (
              <>
                <path d="M85 295 179 201 235 328Z" className={s.scanBeam} />
                {Array.from({ length: scannedCount }, (_, i) => (
                  <circle
                    key={i}
                    cx={181 + (i % 6) * 10}
                    cy={252 + Math.floor(i / 6) * 12}
                    r="3"
                    className={s.scanDot}
                    style={{ '--i': i } as CSSProperties}
                  />
                ))}
              </>
            )}
            {round === 1 && success && (
              <>
                <path d="M255 285Q388 132 641 128" className={s.energyBeam} />
                <g transform="translate(641 128)">
                  <circle r="18" className={s.decoyAura} />
                  <path d="M0-13 10 0 0 13-10 0Z" className={s.decoy} />
                </g>
              </>
            )}
            {round === 3 && success && (
              <path d="M518 245Q531 193 544 244" className={s.archiveLink} />
            )}
            <g
              className={s.heroPosition}
              style={motionStyle}
              data-hero
              data-start={`${from[0]},${from[1]}`}
              data-destination={`${to[0]},${to[1]}`}
            >
              <ellipse cy="-1" rx="32" ry="11" className={s.heroShadow} />
              <ellipse cy="-1" rx="35" ry="12" className={s.heroRing} />
              <g className={s.heroBody}>
                <image
                  href="/courses/ai-with-python/lesson-05/assets/castle-game/warrior.png"
                  x="-51"
                  y="-133"
                  width="107"
                  height="133"
                />
              </g>
              {completed >= 4 && (
                <g className={s.carriedArchive}>
                  <path
                    d="M-40-64l18 6v26l-18-6Z"
                    fill="#ffc91c"
                    stroke="#fff1c0"
                    strokeWidth="2"
                  />
                  <path d="M-34-58v17l7 3v-17Z" fill="#926b28" />
                </g>
              )}
            </g>
            {victory && (
              <g className={s.victoryBurst}>
                {Array.from({ length: 18 }, (_, i) => (
                  <path
                    key={i}
                    d={`M${680 + (i % 6) * 11} ${230 + Math.floor(i / 6) * 14}l5 8-4 2-5-8Z`}
                    style={{ '--i': i } as CSSProperties}
                    fill={i % 2 ? '#ffc91c' : '#a5e7ee'}
                  />
                ))}
              </g>
            )}
          </g>
          <g
            key={`outer-fog-${round}-${event}-${replay}`}
            className={s.mist}
            data-fog="outer"
            data-cleared={completed > 0}
          >
            <ellipse
              cx="230"
              cy="284"
              rx="121"
              ry="83"
              fill={`url(#${id}-mist)`}
            />
          </g>
          <g
            key={`inner-fog-${round}-${event}-${replay}`}
            className={s.mist}
            data-fog="inner"
            data-cleared={completed > 2}
          >
            <ellipse
              cx="483"
              cy="214"
              rx="165"
              ry="100"
              fill={`url(#${id}-mist)`}
            />
          </g>
        </svg>
      </div>
      <figcaption className={s.caption}>
        <span>{eyebrow}</span>
        <strong>{caption}</strong>
      </figcaption>
      {event === 'alarm' && <div className={s.alarmRim} aria-hidden="true" />}
    </figure>
  );
}
