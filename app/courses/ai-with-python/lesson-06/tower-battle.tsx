'use client';

/* eslint-disable next/no-img-element -- Reuse the established transparent warrior sprite. */
/* eslint-disable jsx-a11y/prefer-tag-over-role -- SVG graphics use native SVG elements with accessible roles. */

import { useContext, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Flag, Pause, Play, RotateCcw } from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import {
  LessonState,
  useLessonPageState,
} from '@/components/course/lesson-state';
import {
  HOURS,
  ATTACK_THRESHOLD,
  TOWER_NAMES,
  TEAMS,
  battleReadings,
  history,
  teamForTower,
} from './study-data';
import {
  assessTowerDecision,
  canFaceBoss,
  completeTower,
  initialCampaign,
  towerOrderError,
  type CampaignState,
} from './campaign-engine';
import s from './tower-battle.module.css';

export function useBattleMotion({
  attacking,
  paused,
  active,
  onComplete,
}: {
  attacking: boolean;
  paused: boolean;
  active: boolean;
  onComplete: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const remaining = useRef(2200);
  useEffect(() => {
    const changed = () => setHidden(document.hidden);
    changed();
    document.addEventListener('visibilitychange', changed);
    return () => document.removeEventListener('visibilitychange', changed);
  }, []);
  const stopped = !active || hidden || paused;
  useEffect(() => {
    if (!attacking) {
      remaining.current = 2200;
      return;
    }
    if (stopped) return;
    const started = Date.now();
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const timer = window.setTimeout(
      onComplete,
      reduced ? 0 : remaining.current,
    );
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started),
      );
    };
  }, [attacking, stopped, onComplete]);
  return stopped;
}

function TowerEvidence({ tower, hour }: { tower: string; hour: string }) {
  const rows = history.filter((row) => row.tower === tower);
  const low = rows.filter((row) => row.energy < ATTACK_THRESHOLD);
  const x = (hour: number) => 64 + ((hour - 6) / 11) * 470;
  const y = (energy: number) => 124 - energy * 0.84;
  return (
    <div className={s.plot} aria-label={`${tower}的外罩曲线和低谷时的守卫防御`}>
      <strong>作战图 · 历史外罩读数</strong>
      <svg
        viewBox="0 0 580 170"
        role="img"
        aria-label="横轴为6至17时，纵轴为外罩强度，虚线为30"
      >
        {[0, 30, 60, 100].map((value) => (
          <g key={value}>
            <line
              x1="64"
              x2="534"
              y1={y(value)}
              y2={y(value)}
              stroke={value === ATTACK_THRESHOLD ? '#be4b2b' : '#cad5e3'}
              strokeDasharray={value === ATTACK_THRESHOLD ? '8 6' : undefined}
            />
            <text x="48" y={y(value) + 8} textAnchor="end">
              {value}
            </text>
          </g>
        ))}
        {[6, 8, 10, 12, 14, 17].map((hour) => (
          <text key={hour} x={x(hour)} y="158" textAnchor="middle">
            {hour}时
          </text>
        ))}
        <polyline
          fill="none"
          stroke="#1457d9"
          strokeWidth="4"
          points={rows
            .map((row) => `${x(row.hour)},${y(row.energy)}`)
            .join(' ')}
        />
        {rows.map((row) => (
          <circle
            key={row.hour}
            cx={x(row.hour)}
            cy={y(row.energy)}
            r={row.energy < ATTACK_THRESHOLD ? 7 : 4}
            fill={row.energy < ATTACK_THRESHOLD ? '#ffc91c' : '#1457d9'}
            stroke="#071a3d"
            strokeWidth="1.5"
          >
            <title>
              {row.hour}时：外罩{row.energy}，守卫防御{row.defense}
            </title>
          </circle>
        ))}
      </svg>
      <table className={s.candidates}>
        <caption>历史候选 · 外罩低于 {ATTACK_THRESHOLD}，再比较防御</caption>
        <thead>
          <tr>
            <th scope="col">时刻</th>
            <th scope="col">外罩</th>
            <th scope="col">守卫防御</th>
          </tr>
        </thead>
        <tbody>
          {low.map((row) => (
            <tr key={row.hour} data-selected={String(row.hour) === hour}>
              <th scope="row">{row.hour} 时</th>
              <td>
                {row.energy} &lt; {ATTACK_THRESHOLD}
              </td>
              <td>{row.defense}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CampaignMap({
  state,
  stopped,
}: {
  state: CampaignState;
  stopped: boolean;
}) {
  return (
    <div
      className={s.map}
      data-campaign-map
      data-phase={state.phase}
      data-paused={stopped}
    >
      <svg
        viewBox="0 0 620 190"
        aria-label="三支队伍分别进攻三座魔塔，击破一座后记录一次进度"
      >
        <rect width="620" height="190" fill="#172e52" />
        <path
          d="M0 115 70 65 140 110 230 49 300 103 395 62 460 115 550 75 620 116V190H0Z"
          fill="#0c1b39"
        />
        <path d="M0 161Q160 142 310 163T620 156V190H0Z" fill="#334c67" />
        {TOWER_NAMES.map((tower, index) => {
          const cx = 140 + index * 175;
          const done = state.completed.includes(tower);
          const attacking =
            state.tower === tower && state.phase === 'attacking';
          return (
            <g
              key={tower}
              data-cut={done}
              data-target={attacking}
              className={s.tower}
            >
              <path
                d={`M${cx - 26} 67h52v72h-52Z`}
                fill={done ? '#64748b' : '#c5d5e5'}
                stroke="#071a3d"
                strokeWidth="3"
              />
              <path
                d={`m${cx - 35} 69 35-36 35 36Z`}
                fill={done ? '#425579' : '#1457d9'}
                stroke="#071a3d"
                strokeWidth="3"
              />
              <rect
                className={s.towerCore}
                x={cx - 10}
                y="87"
                width="20"
                height="32"
                rx="3"
                fill={done ? '#425579' : '#79e2ef'}
              />
              <ellipse
                className={s.shield}
                cx={cx}
                cy="86"
                rx="49"
                ry="66"
                fill="#7de2ed1c"
                stroke="#7de2ed"
                strokeWidth="3"
              />
              <path
                className={s.strike}
                d={`M${cx - 70} 156 ${cx} 100`}
                stroke="#ffc91c"
                strokeWidth="10"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
      <div className={s.mapLabels}>
        {TOWER_NAMES.map((tower, index) => (
          <span
            className={s.mapLabel}
            key={tower}
            style={{ left: `${((140 + index * 175) / 620) * 100}%` }}
          >
            {tower}
            {state.completed.includes(tower) ? ' ✓' : ''}
          </span>
        ))}
        {TEAMS.map((team, index) => (
          <img
            key={team.name}
            className={s.hero}
            style={{ left: `${((70 + index * 175) / 620) * 100}%` }}
            src="/courses/ai-with-python/lesson-05/assets/castle-game/warrior.png"
            alt={`${team.name}的勇士`}
          />
        ))}
      </div>
    </div>
  );
}

export function TowerBattle({ active = true }: { active?: boolean }) {
  const [state, update] = useLessonPageState<CampaignState>(
    'l6-tower-battle',
    initialCampaign,
  );
  const { navigate } = useContext(LessonState);
  const [motionKey, setMotionKey] = useState(0);
  const stopped = useBattleMotion({
    attacking: state.phase === 'attacking',
    paused: state.paused,
    active,
    onComplete: () => update(completeTower(state)),
  });
  const current = battleReadings.find((row) => row.tower === state.tower)!;
  const team = teamForTower(state.tower)!;
  const cleared = state.phase === 'cleared';
  const locked =
    cleared || state.phase === 'ready' || state.phase === 'attacking';
  const onsite = state.phase === 'onsite';
  const canBreakShield = current.energy < ATTACK_THRESHOLD;
  const allDone = canFaceBoss(state);
  // Existing manually verified receipts remain valid after replacing number inputs.
  const readingsConfirmed =
    state.energy.trim() !== '' &&
    state.defense.trim() !== '' &&
    Number(state.energy) === current.energy &&
    Number(state.defense) === current.defense;
  const patchOrder = (value: Partial<CampaignState>) =>
    update({ ...value, phase: 'command', message: '' });
  const reopenOrder = () =>
    update({ phase: 'command', energy: '', defense: '', message: '' });
  function selectTower(tower: string) {
    const receipt = state.receipts[tower];
    update({
      tower,
      ...(receipt ?? { hour: '', equipment: '', energy: '', defense: '' }),
      message: '',
      paused: false,
      phase: state.completed.includes(tower) ? 'cleared' : 'command',
    });
  }
  function launch() {
    setMotionKey((key) => key + 1);
    update({ phase: 'attacking', paused: false });
  }
  return (
    <Stage
      title={allDone ? '三塔击破，三队准备会合！' : '到了阵前，现在能出击吗？'}
      label="TOWER BATTLE · 三塔战役"
      className={s.stage}
    >
      <div className={s.game} data-tower-battle data-phase={state.phase}>
        <div className={s.topbar}>
          <strong>
            <Flag size={21} /> 已击破 {state.completed.length} / 3 座魔塔
          </strong>
          <button
            type="button"
            onClick={() =>
              update({ ...initialCampaign, completed: [], receipts: {} })
            }
          >
            <RotateCcw size={18} />
            重置三塔战役
          </button>
        </div>
        <div className={s.grid}>
          <section className={s.evidencePanel} aria-label="作战图与历史依据">
            <CampaignMap key={motionKey} state={state} stopped={stopped} />
            <TowerEvidence tower={state.tower} hour={state.hour} />
          </section>
          <section className={s.command} aria-label="三塔出击指令">
            <fieldset
              disabled={state.phase === 'attacking'}
              className={s.targets}
              aria-label="选择要攻打的魔塔"
            >
              <div>
                {TOWER_NAMES.map((tower) => (
                  <button
                    type="button"
                    key={tower}
                    aria-pressed={state.tower === tower}
                    onClick={() => selectTower(tower)}
                  >
                    {tower}
                    {state.completed.includes(tower) && <Check size={19} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className={s.team}>
              <strong>{team.name}</strong> · {current.kind} · 弱点：
              <b>{current.weakness}</b>
            </p>
            <div className={s.plan}>
              <strong>① 对照作战图，核对本队命令</strong>
              <div className={s.formGrid}>
                <label>
                  计划出击时刻
                  <select
                    value={state.hour}
                    disabled={onsite || locked}
                    onChange={(event) =>
                      patchOrder({ hour: event.target.value })
                    }
                  >
                    <option value="">选择时刻</option>
                    {HOURS.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour} 时
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  携带装备
                  <select
                    value={state.equipment}
                    disabled={onsite || locked}
                    onChange={(event) =>
                      patchOrder({ equipment: event.target.value })
                    }
                  >
                    <option value="">选择装备</option>
                    {TEAMS.map((item) => (
                      <option key={item.equipment}>{item.equipment}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {(onsite || locked) && (
              <section className={s.snapshot} aria-label="阵前新情报与确认">
                <strong>② 阵前新情报 · 现在能破罩吗？</strong>
                <p>
                  {current.hour} 时实测 · 外罩 <b>{current.energy}</b> ·
                  守卫防御 <b>{current.defense}</b>
                </p>
                {canBreakShield ? (
                  <label className={s.confirm}>
                    <input
                      type="checkbox"
                      checked={readingsConfirmed}
                      disabled={locked}
                      onChange={(event) =>
                        update({
                          energy: event.target.checked
                            ? String(current.energy)
                            : '',
                          defense: event.target.checked
                            ? String(current.defense)
                            : '',
                          message: '',
                        })
                      }
                    />
                    我已核对：现场外罩低于 {ATTACK_THRESHOLD}，可以破罩。
                  </label>
                ) : (
                  <p>现场外罩达到 {ATTACK_THRESHOLD} 或以上，暂缓出击。</p>
                )}
              </section>
            )}
            <p className={s.feedback} data-success={locked} aria-live="polite">
              {state.message ||
                (cleared
                  ? `${state.tower}已击破。接着核对下一队的命令。`
                  : onsite
                    ? '命令已核对。现在用现场读数判断能否出击。'
                    : '先根据历史候选核对时刻，再按守卫弱点核对装备。')}
            </p>
            {(state.phase === 'command' || state.phase === 'feedback') && (
              <button
                type="button"
                className={s.primary}
                onClick={() => {
                  const error = towerOrderError(state);
                  update({
                    phase: error ? 'feedback' : 'onsite',
                    message: error ?? '',
                    energy: '',
                    defense: '',
                    attempts: state.attempts + 1,
                  });
                }}
              >
                <Check size={20} />
                核对命令，接收新情报
              </button>
            )}
            {onsite && (
              <div className={s.actions}>
                <button type="button" onClick={reopenOrder}>
                  重核命令
                </button>
                {canBreakShield && (
                  <button
                    type="button"
                    className={s.primary}
                    onClick={() => {
                      const result = assessTowerDecision(state);
                      update({
                        phase: result.success ? 'ready' : 'onsite',
                        message: result.message,
                      });
                    }}
                  >
                    <Check size={20} />
                    确认能否出击
                  </button>
                )}
              </div>
            )}
            {state.phase === 'ready' && (
              <div className={s.actions}>
                <button type="button" onClick={reopenOrder}>
                  重核命令
                </button>
                <button type="button" className={s.primary} onClick={launch}>
                  <Play size={20} />
                  {team.name}，出击！
                </button>
              </div>
            )}
            {state.phase === 'attacking' && (
              <div className={s.actions}>
                <button
                  type="button"
                  onClick={() => update({ paused: !state.paused })}
                >
                  {state.paused ? <Play size={20} /> : <Pause size={20} />}
                  {state.paused ? '继续' : '暂停'}
                </button>
                <button
                  type="button"
                  onClick={() => update(completeTower(state))}
                >
                  查看结果
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
            {cleared && (
              <div className={s.actions}>
                <button type="button" onClick={launch}>
                  <Play size={20} />
                  重播
                </button>
                <button
                  type="button"
                  className={s.primary}
                  onClick={() =>
                    allDone
                      ? navigate('l6-final-mission')
                      : selectTower(
                          TOWER_NAMES.find(
                            (tower) => !state.completed.includes(tower),
                          )!,
                        )
                  }
                >
                  {allDone ? '完成攻塔，继续前进' : '前往下一座塔'}
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </Stage>
  );
}
