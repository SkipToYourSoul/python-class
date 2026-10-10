'use client';

import { Plot } from './charts';
import { demons, demonKinds } from './study-data';
import {
  speedBins,
  kindSpeeds,
  patrolPoints,
  targetDemon,
} from './castle-challenge-engine';
import s from './castle-challenge.module.css';

const COLORS = ['#1457d9', '#d45030', '#16816a'];
const scale =
  (low: number, high: number, from: number, to: number) => (value: number) =>
    from + ((value - low) / (high - low)) * (to - from);
type Bounds = { left: number; right: number; top: number; bottom: number };

function Axes({
  b,
  x,
  y,
  xs,
  ys,
  xLabel,
  yLabel,
  names,
}: {
  b: Bounds;
  x: (v: number) => number;
  y: (v: number) => number;
  xs: number[];
  ys: number[];
  xLabel: string;
  yLabel: string;
  names?: string[];
}) {
  return (
    <g fill="#071a3d">
      {ys.map((v) => (
        <g key={v}>
          <line
            x1={b.left}
            x2={b.right}
            y1={y(v)}
            y2={y(v)}
            stroke="#071a3d"
            opacity=".12"
          />
          <text x={b.left - 9} y={y(v) + 6} textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <path
        d={`M${b.left} ${b.top}V${b.bottom}H${b.right}`}
        fill="none"
        stroke="#071a3d"
        strokeWidth="2"
      />
      {xs.map((v, i) => (
        <text key={v} x={x(v)} y={b.bottom + 25} textAnchor="middle">
          {names?.[i] ?? Number(v.toFixed(1))}
        </text>
      ))}
      <text x={b.left} y="19">
        {yLabel}
      </text>
      <text x={(b.left + b.right) / 2} y={b.bottom + 53} textAnchor="middle">
        {xLabel}
      </text>
    </g>
  );
}

export function ChallengeChart({
  round,
  choice,
  feature = 'speed',
}: {
  round: number;
  choice: string | null;
  feature?: 'speed' | 'mass';
}) {
  if (round === 0)
    return (
      <Plot label="90 只守卫的速度直方图，柱高表示每个速度区间的数量">
        {(b) => {
          const x = scale(
            speedBins[0].low,
            speedBins.at(-1)!.high,
            b.left,
            b.right,
          );
          const y = scale(0, 20, b.bottom, b.top + 18);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xs={[
                  speedBins[0].low,
                  ...speedBins.filter((_, i) => i % 2 === 1).map((v) => v.high),
                ]}
                ys={[0, 10, 20]}
                xLabel="速度（m/s）· 刻度为约数"
                yLabel="守卫数量（只）"
              />
              {speedBins.map((bin) => (
                <g key={bin.id} data-bin={bin.id} data-count={bin.count}>
                  <rect
                    x={x(bin.low) + 1}
                    y={y(bin.count)}
                    width={x(bin.high) - x(bin.low) - 2}
                    height={b.bottom - y(bin.count)}
                    fill={choice === bin.id ? '#ffc91c' : '#1457d9'}
                    stroke={choice === bin.id ? '#071a3d' : 'none'}
                    strokeWidth="2"
                  />
                  <text
                    x={(x(bin.low) + x(bin.high)) / 2}
                    y={y(bin.count) - 7}
                    textAnchor="middle"
                    fill="#071a3d"
                  >
                    {bin.count}
                  </text>
                </g>
              ))}
            </>
          );
        }}
      </Plot>
    );
  if (round === 1)
    return (
      <Plot label="三族平均速度条形图，每族 30 只；柱高表示平均速度">
        {(b) => {
          const step = (b.right - b.left) / kindSpeeds.length;
          const x = (i: number) => b.left + step * (i + 0.5);
          const y = scale(0, 15, b.bottom, b.top + 18);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xs={[0, 1, 2]}
                ys={[0, 5, 10, 15]}
                xLabel="种类 · 每族 30 只"
                yLabel="平均速度（m/s）"
                names={kindSpeeds.map((k) => k.kind)}
              />
              {kindSpeeds.map((k, i) => (
                <g key={k.id} data-kind={k.kind} data-mean={k.speed}>
                  <rect
                    x={x(i) - step * 0.28}
                    y={y(k.speed)}
                    width={step * 0.56}
                    height={b.bottom - y(k.speed)}
                    fill={choice === k.id ? '#ffc91c' : COLORS[i]}
                    stroke={choice === k.id ? '#071a3d' : 'none'}
                    strokeWidth="2"
                  />
                  <text
                    x={x(i)}
                    y={y(k.speed) - 9}
                    textAnchor="middle"
                    fill="#071a3d"
                  >
                    {k.speed.toFixed(2)}
                  </text>
                </g>
              ))}
            </>
          );
        }}
      </Plot>
    );
  if (round === 2)
    return (
      <Plot label="D001 同一天六次巡逻的速度折线图，选择记录中移动最慢的时刻">
        {(b) => {
          const x = scale(6, 20, b.left, b.right);
          const y = scale(0, 10, b.bottom, b.top + 18);
          const selected = patrolPoints.find((p) => p.id === choice);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xs={patrolPoints.map((p) => p.hour)}
                ys={[0, 5, 10]}
                xLabel="观测时刻（时）"
                yLabel="D001 速度（m/s）"
              />
              {selected && (
                <line
                  x1={x(selected.hour)}
                  x2={x(selected.hour)}
                  y1={b.top}
                  y2={b.bottom}
                  stroke="#d45030"
                  strokeDasharray="5 5"
                />
              )}
              <polyline
                points={patrolPoints
                  .map((p) => `${x(p.hour)},${y(p.speed)}`)
                  .join(' ')}
                fill="none"
                stroke="#1457d9"
                strokeWidth="4"
              />
              {patrolPoints.map((p) => (
                <g key={p.id} data-hour={p.hour} data-speed={p.speed}>
                  <circle
                    cx={x(p.hour)}
                    cy={y(p.speed)}
                    r={choice === p.id ? 10 : 6}
                    fill="#ffc91c"
                    stroke="#071a3d"
                    strokeWidth="2"
                  />
                  <text
                    x={x(p.hour)}
                    y={y(p.speed) - 17}
                    fill="#071a3d"
                    textAnchor="middle"
                  >
                    {p.speed}
                  </text>
                </g>
              ))}
            </>
          );
        }}
      </Plot>
    );
  return (
    <div className={s.scatterWrap}>
      <div className={s.legend}>
        {demonKinds.map((kind, i) => (
          <span key={kind}>
            <i style={{ background: COLORS[i] }} />
            {kind}
          </span>
        ))}
      </div>
      <Plot
        label={`身高与${feature === 'mass' ? '体重' : '速度'}散点图，颜色区分已知种类，黄色靶心表示待核查的 D004`}
      >
        {(b) => {
          const x = scale(90, 240, b.left, b.right);
          const high = feature === 'mass' ? 180 : 15;
          const y = scale(0, high, b.bottom, b.top + 18);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xs={[100, 150, 200]}
                ys={feature === 'mass' ? [0, 60, 120, 180] : [0, 5, 10, 15]}
                xLabel="身高（cm）"
                yLabel={feature === 'mass' ? '体重（kg）' : '速度（m/s）'}
              />
              {demons
                .filter((d) => d.id !== targetDemon.id)
                .map((d) => (
                  <circle
                    key={d.id}
                    cx={x(d.height)}
                    cy={y(d[feature])}
                    r="4.5"
                    fill={COLORS[demonKinds.indexOf(d.kind)]}
                    opacity=".72"
                  />
                ))}
              <g
                data-target="D004"
                data-height={targetDemon.height}
                data-value={targetDemon[feature]}
              >
                <circle
                  cx={x(targetDemon.height)}
                  cy={y(targetDemon[feature])}
                  r="13"
                  fill="#ffc91c"
                  stroke="#071a3d"
                  strokeWidth="3"
                />
                <path
                  d={`M${x(targetDemon.height) - 19} ${y(targetDemon[feature])}h38 M${x(targetDemon.height)} ${y(targetDemon[feature]) - 19}v38`}
                  stroke="#071a3d"
                  strokeWidth="2"
                />
              </g>
            </>
          );
        }}
      </Plot>
      <p className={s.chartNote}>
        黄色靶心 D004：{targetDemon.height} cm · {targetDemon[feature]}{' '}
        {feature === 'mass' ? 'kg' : 'm/s'}
      </p>
    </div>
  );
}
