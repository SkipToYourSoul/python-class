'use client';

/* eslint-disable next/no-img-element -- Reuse the established transparent warrior sprite. */
/* eslint-disable jsx-a11y/prefer-tag-over-role -- SVG graphics use native SVG elements with accessible roles. */

import { useContext, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Flag,
  LockKeyhole,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import {
  LessonState,
  useLessonPageState,
  usePageState,
} from '@/components/course/lesson-state';
import { ATTACK_THRESHOLD, TOWER_NAMES, bossRecords } from './study-data';
import {
  canFaceBoss,
  initialCampaign,
  type CampaignState,
} from './campaign-engine';
import {
  assessDecision,
  completeBattle,
  initialBattle,
} from './final-battle-engine';
import { useBattleMotion } from './tower-battle';
import s from './final-battle.module.css';

const equipmentColors: Record<string, string> = {
  强光: '#1457d9',
  火焰: '#be4b2b',
  热量: '#16806a',
};

function BossEvidence({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (part: string) => void;
}) {
  const x = (defense: number) => 60 + defense * 4.65;
  const y = (energy: number) => 210 - energy * 1.6;
  return (
    <div className={s.plot}>
      <strong>魔王护甲 · 找到可破罩且防御最低的部位</strong>
      <div className={s.legend}>
        {Object.entries(equipmentColors).map(([equipment, color]) => (
          <span key={equipment}>
            <i style={{ background: color }} />
            弱点：{equipment}
          </span>
        ))}
      </div>
      <svg
        viewBox="0 0 580 260"
        role="group"
        aria-label="魔王九个护甲部位的外罩强度与防御，横轴防御，纵轴外罩，水平虚线为外罩30"
      >
        {[0, 30, 60, 100].map((value) => (
          <g key={value}>
            <line
              x1="60"
              x2="525"
              y1={y(value)}
              y2={y(value)}
              stroke="#d1dae6"
            />
            <text x="48" y={y(value) + 8} textAnchor="end">
              {value}
            </text>
            <text x={x(value)} y="236" textAnchor="middle">
              {value}
            </text>
          </g>
        ))}
        <line
          x1="60"
          x2="525"
          y1={y(30)}
          y2={y(30)}
          stroke="#071a3d"
          strokeDasharray="8 6"
          strokeWidth="2"
        />
        <text x="18" y="24">
          外罩
        </text>
        <text x="520" y="257" textAnchor="end">
          防御
        </text>
        {bossRecords.map((row) => {
          const labelPositions: Record<
            string,
            [number, number, 'start' | 'end']
          > = {
            头盔: [470, 77, 'start'],
            左肩: [320, 110, 'end'],
            右肩: [423, 170, 'start'],
            胸甲: [151, 202, 'end'],
            左臂: [316, 199, 'start'],
            右臂: [284, 145, 'end'],
            腰甲: [225, 167, 'end'],
            左腿: [386, 80, 'end'],
            右腿: [465, 128, 'start'],
          };
          const [labelX, labelY, anchor] = labelPositions[row.part];
          return (
            <g
              key={row.part}
              className={s.dot}
              role="button"
              tabIndex={0}
              aria-label={`选择${row.part}`}
              aria-pressed={selected === row.part}
              onClick={() => onSelect(row.part)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(row.part);
                }
              }}
            >
              <circle
                cx={x(row.defense)}
                cy={y(row.energy)}
                r={selected === row.part ? 10 : 7}
                fill={equipmentColors[row.weakness]}
                stroke={selected === row.part ? '#ffc91c' : '#071a3d'}
                strokeWidth={selected === row.part ? 5 : 1.5}
              />
              <path
                d={`M${x(row.defense)},${y(row.energy)} L${labelX + (anchor === 'end' ? 4 : -4)},${labelY - 7}`}
                fill="none"
                stroke="#77869c"
                strokeWidth="1"
              />
              <text x={labelX} y={labelY} textAnchor={anchor}>
                {row.part}
              </text>
              <title>{row.part} · 点击选择部位</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function BossMap({ phase, stopped }: { phase: string; stopped: boolean }) {
  return (
    <div
      className={s.map}
      data-boss-map
      data-phase={phase}
      data-paused={stopped}
    >
      <svg
        viewBox="0 0 620 175"
        aria-label={
          phase === 'victory'
            ? '三支勇士队伍合力击败魔王'
            : '三队会合，等待指令，魔王的护甲露出了突破口'
        }
      >
        <rect width="620" height="175" fill="#172e52" />
        <path
          d="M0 115 95 63 170 112 252 58 330 112 440 60 510 106 620 69V175H0Z"
          fill="#0c1b39"
        />
        <path d="M0 151Q160 134 310 151T620 145V175H0Z" fill="#334c67" />
        <g className={s.demon}>
          <path
            d="m388 70-15-43 29 14 29-17 29 17 29-14-15 43 9 55-52 18-52-18Z"
            fill="#aa3c5e"
            stroke="#071a3d"
            strokeWidth="4"
          />
          <path d="m402 68 17 5-14 9m56-14-17 5 14 9" fill="#ffc91c" />
          <path
            d="m414 97 17 8 17-8"
            fill="none"
            stroke="#fff0d3"
            strokeWidth="4"
          />
          <path
            className={s.armor}
            d="m407 108 24-7 24 7-5 23-19 6-19-6Z"
            fill="#ffc91c"
            stroke="#fff6bc"
            strokeWidth="3"
          />
        </g>
        <ellipse
          className={s.shield}
          cx="431"
          cy="82"
          rx="76"
          ry="76"
          stroke="#7de2ed"
          strokeWidth="3"
          fill="#7de2ed18"
        />
        <path
          className={s.strike}
          d="m115 145 316-24m-211 20 211-20m-116 22 116-22"
          stroke="#ffc91c"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <g className={s.stars} fill="#ffc91c">
          <path d="m405 35 5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1Z" />
          <path d="m506 86 5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1Z" />
        </g>
      </svg>
      {[0, 1, 2].map((index) => (
        <img
          key={index}
          className={s.hero}
          style={{ left: `${7 + index * 17}%` }}
          src="/courses/ai-with-python/lesson-05/assets/castle-game/warrior.png"
          alt={['曙光队勇士', '烈焰队勇士', '暖阳队勇士'][index]}
        />
      ))}
    </div>
  );
}

export function FinalBattle({ active = true }: { active?: boolean }) {
  const [campaign] = useLessonPageState<CampaignState>(
    'l6-tower-battle',
    initialCampaign,
  );
  const [saved, update] = usePageState({
    battle: initialBattle,
    showReadings: false,
    showWeakness: false,
  });
  const state = saved.battle;
  const { navigate } = useContext(LessonState);
  const [motionKey, setMotionKey] = useState(0);
  const patch = (value: Partial<typeof state>) =>
    update({ battle: { ...state, ...value } });
  const allowed = canFaceBoss(campaign);
  const stopped = useBattleMotion({
    attacking: state.phase === 'attacking',
    paused: state.paused,
    active: active && allowed,
    onComplete: () => update({ battle: completeBattle(state, campaign) }),
  });
  const victory = state.phase === 'victory';
  const locked =
    state.phase === 'ready' || state.phase === 'attacking' || victory;
  const record = bossRecords.find((row) => row.part === state.part);
  function choose(value: Partial<typeof state>) {
    if (!locked)
      update({
        battle: { ...state, ...value, phase: 'command', message: '' },
        ...(value.part !== undefined && value.part !== state.part
          ? { showReadings: false, showWeakness: false }
          : {}),
      });
  }
  function launch() {
    setMotionKey((key) => key + 1);
    patch({ phase: 'attacking', paused: false });
  }
  return (
    <Stage
      title={
        victory && allowed
          ? '三队合力，魔王败退！'
          : '决战魔王：找到最后的突破口'
      }
      label="FINAL CHALLENGE · 全班作战指挥部"
      className={s.stage}
    >
      {!allowed ? (
        <div className={s.gate} data-boss-locked>
          <LockKeyhole size={56} />
          <h3>三座魔塔还在为魔王供能</h3>
          <div className={s.gateTowers}>
            {TOWER_NAMES.map((tower) => (
              <span key={tower} data-done={campaign.completed.includes(tower)}>
                {campaign.completed.includes(tower) ? (
                  <Check size={24} />
                ) : (
                  <LockKeyhole size={24} />
                )}
                {tower}
              </span>
            ))}
          </div>
          <p>先逐一击破三座魔塔，让三支队伍在大门前会合。</p>
          <button type="button" onClick={() => navigate('l6-tower-battle')}>
            返回三塔战役
            <ArrowRight size={22} />
          </button>
        </div>
      ) : (
        <div className={s.game} data-final-battle data-phase={state.phase}>
          <div className={s.topbar}>
            <strong>
              <Flag size={21} /> 三塔已破 · 三队会合
            </strong>
            <button
              type="button"
              onClick={() =>
                update({
                  battle: { ...initialBattle },
                  showReadings: false,
                  showWeakness: false,
                })
              }
            >
              <RotateCcw size={18} />
              重置魔王决战
            </button>
          </div>
          <div className={s.grid}>
            <section
              className={s.evidencePanel}
              aria-label="魔王护甲的图表证据"
            >
              <BossMap key={motionKey} phase={state.phase} stopped={stopped} />
              <BossEvidence
                selected={state.part}
                onSelect={(part) => choose({ part })}
              />
            </section>
            <section className={s.command} aria-label="魔王决战指令">
              {victory ? (
                <>
                  <span className={s.eyebrow}>
                    <Flag size={22} /> 阶段通关 · 指令核验报告
                  </span>
                  <h3>我们用数据赢得了决战！</h3>
                  <p className={s.result}>
                    攻击部位：<b>{state.part}</b>
                    <br />
                    外罩 <b>{state.energy}</b> · 防御 <b>{state.defense}</b>
                    <br />
                    突破装备：<b>{state.equipment}</b>
                  </p>
                  <ol className={s.report} aria-label="本次指令核验结果">
                    <li>
                      <Check size={20} />
                      选中可破罩部位中防御最低的一处
                    </li>
                    <li>
                      <Check size={20} />
                      外罩与防御读数填写正确
                    </li>
                    <li>
                      <Check size={20} />
                      装备与所选部位的弱点匹配
                    </li>
                  </ol>
                  <button className={s.primary} type="button" onClick={launch}>
                    <Play size={20} />
                    重播最后一击
                  </button>
                </>
              ) : (
                <>
                  <p className={s.rule}>
                    先找外罩 &lt; {ATTACK_THRESHOLD}{' '}
                    的部位，再选其中防御最低的突破口。
                  </p>
                  <div className={s.formGrid}>
                    <label>
                      攻击部位
                      <select
                        disabled={locked}
                        value={state.part}
                        onChange={(event) =>
                          choose({ part: event.target.value })
                        }
                      >
                        <option value="">选择突破口</option>
                        {bossRecords.map((row) => (
                          <option key={row.part}>{row.part}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      突破装备
                      <select
                        disabled={locked}
                        value={state.equipment}
                        onChange={(event) =>
                          choose({ equipment: event.target.value })
                        }
                      >
                        <option value="">选择装备</option>
                        {Object.keys(equipmentColors).map((equipment) => (
                          <option key={equipment}>{equipment}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      外罩强度
                      <input
                        type="number"
                        min="0"
                        max="100"
                        inputMode="numeric"
                        disabled={locked}
                        placeholder="填写图中证据"
                        value={state.energy}
                        onChange={(event) =>
                          choose({ energy: event.target.value })
                        }
                      />
                    </label>
                    <label>
                      护甲防御
                      <input
                        type="number"
                        min="0"
                        max="100"
                        inputMode="numeric"
                        disabled={locked}
                        placeholder="填写图中证据"
                        value={state.defense}
                        onChange={(event) =>
                          choose({ defense: event.target.value })
                        }
                      />
                    </label>
                  </div>
                  <div className={s.hints} aria-label="按需查看提示">
                    <div className={s.hint}>
                      <button
                        type="button"
                        disabled={!record}
                        aria-expanded={saved.showReadings}
                        aria-controls="l6-boss-reading-hint"
                        aria-label={`${saved.showReadings ? '收起' : '展开'}读数提示`}
                        onClick={() =>
                          update({ showReadings: !saved.showReadings })
                        }
                      >
                        读数提示 <ChevronDown size={20} />
                      </button>
                      {record && saved.showReadings && (
                        <p id="l6-boss-reading-hint">
                          外罩 <b>{record.energy}</b> · 防御{' '}
                          <b>{record.defense}</b>
                        </p>
                      )}
                    </div>
                    <div className={s.hint}>
                      <button
                        type="button"
                        disabled={!record}
                        aria-expanded={saved.showWeakness}
                        aria-controls="l6-boss-weakness-hint"
                        aria-label={`${saved.showWeakness ? '收起' : '展开'}弱点提示`}
                        onClick={() =>
                          update({ showWeakness: !saved.showWeakness })
                        }
                      >
                        弱点提示 <ChevronDown size={20} />
                      </button>
                      {record && saved.showWeakness && (
                        <p id="l6-boss-weakness-hint">
                          图中颜色对应弱点：<b>{record.weakness}</b>
                        </p>
                      )}
                    </div>
                  </div>
                  <p
                    className={s.feedback}
                    data-success={locked}
                    aria-live="polite"
                  >
                    {state.message ||
                      '先选部位，读坐标和颜色图例并填写判断；需要帮助再展开提示。'}
                  </p>
                  {(state.phase === 'command' ||
                    state.phase === 'feedback') && (
                    <button
                      type="button"
                      className={s.primary}
                      onClick={() => {
                        const result = assessDecision(state, campaign);
                        patch({
                          phase: result.success ? 'ready' : 'feedback',
                          message: result.message,
                          attempts: state.attempts + 1,
                        });
                      }}
                    >
                      <Check size={20} />
                      核实最后指令
                    </button>
                  )}
                  {state.phase === 'ready' && (
                    <button
                      type="button"
                      className={s.primary}
                      onClick={launch}
                    >
                      <Play size={20} />
                      三队协作，发动最后一击！
                    </button>
                  )}
                  {state.phase === 'attacking' && (
                    <div className={s.actions}>
                      <button
                        type="button"
                        onClick={() => patch({ paused: !state.paused })}
                      >
                        {state.paused ? (
                          <Play size={20} />
                        ) : (
                          <Pause size={20} />
                        )}
                        {state.paused ? '继续行动' : '暂停行动'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          update({ battle: completeBattle(state, campaign) })
                        }
                      >
                        查看结果
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      )}
    </Stage>
  );
}
