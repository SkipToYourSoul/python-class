'use client';

import type { ReactNode } from 'react';
import { Plot } from './charts';
import { Page, CodeTools } from './lesson-ui';
import { COMPLETE_CODE } from './practice-content';
import { demons, demonKinds, demonHistograms, patrol } from './study-data';
import s from './chart-summary.module.css';

type Bounds = { left: number; right: number; top: number; bottom: number };

function scale(low: number, high: number, from: number, to: number) {
  return (value: number) =>
    from + ((value - low) / (high - low || 1)) * (to - from);
}

function SummaryAxes({
  bounds,
  x,
  y,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  xNames,
}: {
  bounds: Bounds;
  x: (value: number) => number;
  y: (value: number) => number;
  xTicks: number[];
  yTicks: number[];
  xLabel: string;
  yLabel: string;
  xNames?: string[];
}) {
  return (
    <g fill="#071a3d">
      {yTicks.map((value) => (
        <g key={value}>
          <line
            x1={bounds.left}
            x2={bounds.right}
            y1={y(value)}
            y2={y(value)}
            stroke="#071a3d"
            opacity=".12"
          />
          <text x={bounds.left - 8} y={y(value) + 6} textAnchor="end">
            {value}
          </text>
        </g>
      ))}
      <path
        d={`M${bounds.left} ${bounds.top}V${bounds.bottom}H${bounds.right}`}
        fill="none"
        stroke="#071a3d"
        strokeWidth="2"
      />
      {xTicks.map((value, index) => (
        <text
          key={value}
          x={x(value)}
          y={bounds.bottom + 23}
          textAnchor="middle"
        >
          {xNames?.[index] ?? Number(value.toFixed(1))}
        </text>
      ))}
      <text x={bounds.left} y="18">
        {yLabel}
      </text>
      <text
        x={(bounds.left + bounds.right) / 2}
        y={bounds.bottom + 45}
        textAnchor="middle"
      >
        {xLabel}
      </text>
    </g>
  );
}

function SummaryPlot({
  label,
  children,
}: {
  label: string;
  children: (bounds: Bounds) => ReactNode;
}) {
  return (
    <div className={s.plot}>
      <Plot label={label}>
        {(bounds) =>
          children({
            ...bounds,
            left: 46,
            right: bounds.right - 8,
            top: 28,
            bottom: bounds.bottom + 10,
          })
        }
      </Plot>
    </div>
  );
}

function SpeedHistogram() {
  const bins = demonHistograms.speed;
  const low = bins[0].low;
  const high = bins.at(-1)!.high;
  const ceiling =
    Math.ceil(Math.max(...bins.map((bin) => bin.count)) / 10) * 10;
  return (
    <SummaryPlot label="90 只恶魔的速度直方图，横轴速度 m/s，纵轴个体数">
      {(bounds) => {
        const x = scale(low, high, bounds.left, bounds.right);
        const y = scale(0, ceiling, bounds.bottom, bounds.top + 12);
        return (
          <>
            <SummaryAxes
              bounds={bounds}
              x={x}
              y={y}
              xTicks={[low, (low + high) / 2, high]}
              yTicks={[0, ceiling / 2, ceiling]}
              xLabel="速度（m/s）"
              yLabel="个体数（只）"
            />
            {bins.map((bin) => (
              <g key={bin.low}>
                <rect
                  data-low={bin.low}
                  data-high={bin.high}
                  data-count={bin.count}
                  x={x(bin.low) + 1}
                  y={y(bin.count)}
                  width={Math.max(0, x(bin.high) - x(bin.low) - 2)}
                  height={bounds.bottom - y(bin.count)}
                  fill="#1457d9"
                  opacity=".85"
                />
                <text
                  x={(x(bin.low) + x(bin.high)) / 2}
                  y={y(bin.count) - 6}
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
    </SummaryPlot>
  );
}

function HeightSpeedScatter() {
  const lowHeight =
    Math.floor(Math.min(...demons.map((d) => d.height)) / 50) * 50;
  const highHeight =
    Math.ceil(Math.max(...demons.map((d) => d.height)) / 50) * 50;
  const highSpeed = Math.ceil(Math.max(...demons.map((d) => d.speed)) / 5) * 5;
  return (
    <SummaryPlot label="90 只恶魔的身高与速度散点图，横轴身高 cm，纵轴速度 m/s">
      {(bounds) => {
        const x = scale(lowHeight, highHeight, bounds.left, bounds.right);
        const y = scale(0, highSpeed, bounds.bottom, bounds.top + 6);
        return (
          <>
            <SummaryAxes
              bounds={bounds}
              x={x}
              y={y}
              xTicks={[lowHeight, (lowHeight + highHeight) / 2, highHeight]}
              yTicks={[0, highSpeed / 2, highSpeed]}
              xLabel="身高（cm）"
              yLabel="速度（m/s）"
            />
            {demons.map((d) => (
              <circle
                key={d.id}
                data-individual={d.id}
                data-height={d.height}
                data-speed={d.speed}
                cx={x(d.height)}
                cy={y(d.speed)}
                r="3.5"
                fill="#1457d9"
                opacity=".65"
              />
            ))}
          </>
        );
      }}
    </SummaryPlot>
  );
}

function PatrolLine() {
  const ceiling = Math.ceil(Math.max(...patrol.map((p) => p.speed)) / 5) * 5;
  return (
    <SummaryPlot label="D001 同一天六次巡逻的速度折线图，横轴观测时刻，纵轴速度 m/s">
      {(bounds) => {
        const x = scale(6, 20, bounds.left, bounds.right);
        const y = scale(0, ceiling, bounds.bottom, bounds.top + 12);
        return (
          <>
            <SummaryAxes
              bounds={bounds}
              x={x}
              y={y}
              xTicks={patrol.map((p) => p.hour)}
              yTicks={[0, ceiling / 2, ceiling]}
              xLabel="观测时刻（时）"
              yLabel="速度（m/s）"
            />
            <polyline
              points={patrol.map((p) => `${x(p.hour)},${y(p.speed)}`).join(' ')}
              fill="none"
              stroke="#1457d9"
              strokeWidth="3"
            />
            {patrol.map((p) => (
              <g key={p.hour}>
                <circle
                  data-hour={p.hour}
                  data-speed={p.speed}
                  cx={x(p.hour)}
                  cy={y(p.speed)}
                  r="4"
                  fill="#ffc91c"
                  stroke="#071a3d"
                  strokeWidth="1.5"
                />
                <text
                  x={x(p.hour)}
                  y={y(p.speed) - 10}
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
    </SummaryPlot>
  );
}

const kindSpeedGroups = demonKinds.map((kind) => {
  const rows = demons.filter((d) => d.kind === kind);
  return {
    kind,
    count: rows.length,
    speed: rows.reduce((sum, d) => sum + d.speed, 0) / rows.length,
  };
});
const kindSpeedCeiling =
  Math.ceil(Math.max(...kindSpeedGroups.map((g) => g.speed)) / 5) * 5;

function KindSpeedBars() {
  return (
    <SummaryPlot label="三族恶魔平均速度条形图，每族 30 只，横轴种类，纵轴平均速度 m/s">
      {(bounds) => {
        const step = (bounds.right - bounds.left) / kindSpeedGroups.length;
        const x = (value: number) => bounds.left + step * (value + 0.5);
        const y = scale(0, kindSpeedCeiling, bounds.bottom, bounds.top + 12);
        return (
          <>
            <SummaryAxes
              bounds={bounds}
              x={x}
              y={y}
              xTicks={kindSpeedGroups.map((_, index) => index)}
              xNames={kindSpeedGroups.map((g) => g.kind)}
              yTicks={[0, kindSpeedCeiling / 2, kindSpeedCeiling]}
              xLabel="恶魔种类"
              yLabel="平均速度（m/s）"
            />
            {kindSpeedGroups.map((g, index) => (
              <g key={g.kind}>
                <rect
                  data-kind={g.kind}
                  data-count={g.count}
                  data-mean-speed={g.speed}
                  x={x(index) - step * 0.28}
                  y={y(g.speed)}
                  width={step * 0.56}
                  height={bounds.bottom - y(g.speed)}
                  fill="#1457d9"
                />
                <text
                  x={x(index)}
                  y={y(g.speed) - 6}
                  fill="#071a3d"
                  textAnchor="middle"
                >
                  {g.speed.toFixed(1)}
                </text>
              </g>
            ))}
          </>
        );
      }}
    </SummaryPlot>
  );
}

export function ChartSummary() {
  const cards = [
    {
      title: '条形图',
      english: 'Bar chart',
      chart: <KindSpeedBars />,
      question: '谁高、谁低？',
      sample: '三族平均速度 · 每族 30 只',
    },
    {
      title: '直方图',
      english: 'Histogram',
      chart: <SpeedHistogram />,
      question: '集中在哪个区间？',
      sample: '90 只恶魔 · 按速度区间计数',
    },
    {
      title: '散点图',
      english: 'Scatter plot',
      chart: <HeightSpeedScatter />,
      question: '两项特征有何联系？',
      sample: '90 只恶魔 · 一个点对应一只',
    },
    {
      title: '折线图',
      english: 'Line chart',
      chart: <PatrolLine />,
      question: '随时间怎样变化？',
      sample: 'D001 · 同一天六次观测',
    },
  ];
  return (
    <Page
      title="这节课，学会了哪些图表？"
      label="FIELD GUIDE · 图表方法回顾"
      footer={<CodeTools code={COMPLETE_CODE} />}
    >
      <div className={s.grid}>
        {cards.map((card) => (
          <section key={card.title} className={s.card}>
            {card.chart}
            <div className={s.recap}>
              <h3>
                {card.title}
                <span>{card.english}</span>
              </h3>
              <strong>{card.question}</strong>
              <p className={s.sample}>{card.sample}</p>
            </div>
          </section>
        ))}
      </div>
      <div className={s.encodings}>
        <p>
          <b>更多特征</b> · 颜色区分类别 · 点的面积表示数值 · 分组比较差异
        </p>
        <p>
          <b>成对图 Pair plot</b> · 直方图／密度图看分布，散点图看联系
        </p>
      </div>
    </Page>
  );
}
