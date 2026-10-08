'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePageState } from '@/components/course/lesson-state';
import {
  demons,
  demonKinds,
  patrol,
  kindPatrol,
  demonHistograms,
} from './study-data';
import s from './charts.module.css';

const COLORS = ['#1457d9', '#d45030', '#16816a'];
const demonFields = {
  height: { label: '身高', unit: 'cm' },
  speed: { label: '速度', unit: 'm/s' },
  mass: { label: '体重', unit: 'kg' },
};
type Field = keyof typeof demonFields;
type Bounds = { left: number; right: number; top: number; bottom: number };
export type AxisLabels = { x: string; y: string };

export function Plot({
  children,
  label,
}: {
  children: (b: Bounds) => ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 640, height: 280 });
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={s.plot}>
      <svg viewBox={`0 0 ${size.width} ${size.height}`} aria-label={label}>
        <title>{label}</title>
        {children({
          left: 58,
          right: size.width - 20,
          top: 30,
          bottom: size.height - 60,
        })}
      </svg>
    </div>
  );
}

function Axes({
  b,
  xLabel,
  yLabel,
  xTicks,
  xTickLabels,
  yTicks,
  x,
  y,
}: {
  b: Bounds;
  xLabel: string;
  yLabel: string;
  xTicks: number[];
  xTickLabels?: Record<number, string>;
  yTicks: number[];
  x: (v: number) => number;
  y: (v: number) => number;
}) {
  return (
    <g fill="#071a3d">
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={b.left}
            x2={b.right}
            y1={y(v)}
            y2={y(v)}
            stroke="#071a3d"
            opacity=".12"
          />
          <text x={b.left - 10} y={y(v) + 6} textAnchor="end">
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
      {xTicks.map((v) => (
        <text
          key={v}
          data-axis-tick="x"
          x={x(v)}
          y={b.bottom + 26}
          textAnchor="middle"
        >
          {xTickLabels?.[v] ?? v}
        </text>
      ))}
      <text x={b.left} y={19}>
        {yLabel}
      </text>
      <text x={(b.left + b.right) / 2} y={b.bottom + 53} textAnchor="middle">
        {xLabel}
      </text>
    </g>
  );
}

function range(values: number[], count = 4, zero = false) {
  const min = zero ? 0 : Math.min(...values);
  const max = Math.max(...values);
  const raw = Math.max(1, (max - min) / count);
  const factor = 10 ** Math.floor(Math.log10(raw));
  const step =
    [1, 2, 5, 10].map((v) => v * factor).find((v) => v >= raw) || factor * 10;
  const low = zero ? 0 : Math.floor(min / step) * step;
  const high = Math.ceil(max / step) * step;
  return Array.from({ length: Math.round((high - low) / step) + 1 }, (_, i) =>
    Number((low + step * i).toFixed(2)),
  );
}
const scale = (ticks: number[], from: number, to: number) => (v: number) =>
  from +
  ((v - ticks[0]) / (ticks[ticks.length - 1] - ticks[0] || 1)) * (to - from);

export function Histogram({
  field = 'speed',
  axisLabels,
}: {
  field?: Field;
  axisLabels?: AxisLabels;
}) {
  const bins = demonHistograms[field];
  const boundaries = [...bins.map((bin) => bin.low), bins.at(-1)!.high];
  const visibleTicks = boundaries.filter((_, i) => i % 2 === 0);
  const yTicks = range(
    bins.map((bin) => bin.count),
    4,
    true,
  );
  const fieldInfo = demonFields[field];
  return (
    <div className={s.chart}>
      <Plot label={`${fieldInfo.label}直方图，柱高表示区间内的个体数`}>
        {(b) => {
          const x = scale(boundaries, b.left, b.right);
          const y = scale(yTicks, b.bottom, b.top + 16);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xTicks={visibleTicks.map((v) => Number(v.toFixed(1)))}
                yTicks={yTicks}
                xLabel={
                  axisLabels?.x ?? `${fieldInfo.label}（${fieldInfo.unit}）`
                }
                yLabel={axisLabels?.y ?? '个体数（只）'}
              />
              {bins.map((bin) => (
                <g key={bin.low}>
                  <rect
                    x={x(bin.low) + 1}
                    y={y(bin.count)}
                    width={Math.max(0, x(bin.high) - x(bin.low) - 2)}
                    height={b.bottom - y(bin.count)}
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
      </Plot>
      <p className={s.detail}>
        自动分组；刻度取近似值。区间左含右不含，最后一组含右端点。
      </p>
    </div>
  );
}

export type ScatterPoint = {
  id: string;
  kind: string;
  x: number;
  y: number;
  mass?: number;
};
export function DataScatter({
  points,
  kinds,
  xLabel,
  yLabel,
  colored = false,
  interactive = true,
  sizeByMass = false,
}: {
  points: ScatterPoint[];
  kinds: readonly string[];
  xLabel: string;
  yLabel: string;
  colored?: boolean;
  interactive?: boolean;
  sizeByMass?: boolean;
}) {
  const [state, setState] = usePageState({ selectedPoint: '' });
  const selected = points.find((p) => p.id === state.selectedPoint);
  const xTicks = range(points.map((p) => p.x));
  const yTicks = range(points.map((p) => p.y));
  const masses = points.flatMap((p) => (p.mass === undefined ? [] : [p.mass]));
  const massMin = Math.min(...masses);
  const massMax = Math.max(...masses);
  // As in Seaborn's `size`, the mass maps to marker area, rather than radius.
  const pointRadius = (mass?: number) =>
    sizeByMass && mass !== undefined
      ? Math.sqrt(
          (40 + ((mass - massMin) / (massMax - massMin || 1)) * 200) / Math.PI,
        )
      : 6;
  return (
    <div className={s.chart}>
      {colored && (
        <div className={s.legend}>
          {kinds.map((kind, i) => (
            <span key={kind}>
              <i style={{ background: COLORS[i % COLORS.length] }} />
              {kind}
            </span>
          ))}
        </div>
      )}
      {sizeByMass && masses.length > 0 && (
        <div className={s.sizeLegend} aria-label="点的面积表示体重">
          <strong>体重（kg）</strong>
          {[massMin, (massMin + massMax) / 2, massMax].map((mass) => (
            <span key={mass}>
              <svg viewBox="0 0 28 28" aria-hidden="true">
                <circle
                  cx="14"
                  cy="14"
                  r={pointRadius(mass)}
                  fill="#071a3d"
                  opacity=".65"
                />
              </svg>
              {Math.round(mass)}
            </span>
          ))}
        </div>
      )}
      <Plot label={`${xLabel}与${yLabel}散点图，每个点代表一个个体`}>
        {(b) => {
          const x = scale(xTicks, b.left, b.right);
          const y = scale(yTicks, b.bottom, b.top + 16);
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xTicks={xTicks}
                yTicks={yTicks}
                xLabel={xLabel}
                yLabel={yLabel}
              />
              {points.map((p) => (
                <circle
                  key={p.id}
                  cx={x(p.x)}
                  cy={y(p.y)}
                  r={
                    pointRadius(p.mass) *
                    (!sizeByMass && selected?.id === p.id ? 1.4 : 1)
                  }
                  fill={
                    colored
                      ? COLORS[kinds.indexOf(p.kind) % COLORS.length]
                      : COLORS[0]
                  }
                  opacity={selected?.id === p.id ? 1 : 0.75}
                  stroke={selected?.id === p.id ? '#071a3d' : 'white'}
                  strokeWidth={selected?.id === p.id ? 3 : 1}
                  className={interactive ? s.point : undefined}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={`${p.id}，${colored ? p.kind + '，' : ''}${xLabel} ${p.x}，${yLabel} ${p.y}${sizeByMass ? `，体重 ${p.mass} kg` : ''}`}
                  onClick={
                    interactive
                      ? () => setState({ selectedPoint: p.id })
                      : undefined
                  }
                  onKeyDown={
                    interactive
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setState({ selectedPoint: p.id });
                          }
                        }
                      : undefined
                  }
                />
              ))}
            </>
          );
        }}
      </Plot>
      {interactive && (
        <p className={s.detail} aria-live="polite">
          {selected
            ? `${selected.id}${colored ? ' · ' + selected.kind : ''}：${xLabel} ${selected.x}；${yLabel} ${selected.y}${sizeByMass ? `；体重 ${selected.mass} kg` : ''}`
            : '点击一个点，查看它对应的观测记录。'}
        </p>
      )}
    </div>
  );
}

export function Scatter({
  colored = false,
  xField = 'height',
  yField = 'speed',
  interactive = true,
  axisLabels,
  sizeByMass = false,
}: {
  colored?: boolean;
  xField?: 'height' | 'mass';
  yField?: 'speed' | 'height';
  interactive?: boolean;
  axisLabels?: AxisLabels;
  sizeByMass?: boolean;
}) {
  return (
    <DataScatter
      points={demons.map((d) => ({
        id: d.id,
        kind: d.kind,
        x: d[xField],
        y: d[yField],
        mass: d.mass,
      }))}
      kinds={demonKinds}
      xLabel={
        axisLabels?.x ??
        `${demonFields[xField].label}（${demonFields[xField].unit}）`
      }
      yLabel={
        axisLabels?.y ??
        `${demonFields[yField].label}（${demonFields[yField].unit}）`
      }
      colored={colored}
      interactive={interactive}
      sizeByMass={sizeByMass}
    />
  );
}

export type PatrolChartType = 'scatter' | 'line' | 'bar';

export function PatrolChart({
  type,
  axisLabels = { x: 'Hour', y: 'Speed (m/s)' },
  groupedByKind = false,
}: {
  type: PatrolChartType;
  axisLabels?: AxisLabels;
  groupedByKind?: boolean;
}) {
  const xTicks = patrol.map((p) => p.hour);
  const yTicks = range(
    patrol.map((p) => p.speed),
    4,
    true,
  );
  const chartNames = { scatter: '散点图', line: '折线图', bar: '条形图' };
  const grouped = type === 'line' && groupedByKind;
  const series = grouped
    ? demonKinds.map((kind) => ({
        kind,
        values: kindPatrol.filter((p) => p.kind === kind),
      }))
    : [
        {
          kind: demonKinds[0],
          values: patrol.map((p) => ({
            id: 'D001',
            kind: demonKinds[0],
            ...p,
          })),
        },
      ];
  return (
    <div className={s.chart}>
      {grouped && (
        <div className={s.legend} aria-label="种类与观测个体图例">
          {series.map((group, i) => (
            <span key={group.kind}>
              <i style={{ background: COLORS[i] }} />
              {group.kind} · {group.values[0].id}
            </span>
          ))}
        </div>
      )}
      <Plot
        label={
          grouped
            ? '三种恶魔各一个体在同一天六次巡逻中的速度折线图，保留 D001 的原六次观测'
            : `D001 六次巡逻速度的${chartNames[type]}，同一份时间与速度记录`
        }
      >
        {(b) => {
          // All chart types and the added kind series retain the original scales.
          const x = scale([6, 20], b.left, b.right);
          const y = scale(yTicks, b.bottom, b.top + 16);
          const barWidth = (x(10) - x(8)) * 0.7;
          const valueLabelY = (hour: number, speed: number) => {
            const center = y(speed);
            const otherPoints = grouped
              ? series
                  .slice(1)
                  .flatMap((group) =>
                    group.values.filter((p) => p.hour === hour),
                  )
              : [];
            const clearance = (offset: number) =>
              Math.min(
                ...otherPoints.map((p) =>
                  Math.abs(center + offset - y(p.speed)),
                ),
              );
            return clearance(-21) < 18 && clearance(20) > clearance(-21)
              ? center + 28
              : center - 13;
          };
          return (
            <>
              <Axes
                b={b}
                x={x}
                y={y}
                xTicks={xTicks}
                yTicks={yTicks}
                xLabel={axisLabels.x}
                yLabel={axisLabels.y}
              />
              {(grouped ? [...series.slice(1), series[0]] : series).map(
                (group) => {
                  const groupIndex = demonKinds.indexOf(group.kind);
                  return (
                    <g key={group.kind} data-patrol-id={group.values[0].id}>
                      {type === 'line' && (
                        <polyline
                          points={group.values
                            .map((p) => `${x(p.hour)},${y(p.speed)}`)
                            .join(' ')}
                          fill="none"
                          stroke={COLORS[groupIndex]}
                          strokeWidth="4"
                        />
                      )}
                      {group.values.map((p) => (
                        <g key={p.hour}>
                          {type === 'bar' ? (
                            <rect
                              x={x(p.hour) - barWidth / 2}
                              y={y(p.speed)}
                              width={barWidth}
                              height={b.bottom - y(p.speed)}
                              fill="#1457d9"
                            />
                          ) : (
                            <circle
                              cx={x(p.hour)}
                              cy={y(p.speed)}
                              r="7"
                              fill={
                                type === 'line' && groupIndex === 0
                                  ? '#ffc91c'
                                  : COLORS[groupIndex]
                              }
                              stroke="#071a3d"
                              strokeWidth="2"
                            >
                              <title>
                                {p.id} · {group.kind}，{p.hour}:00，速度{' '}
                                {p.speed} m/s
                              </title>
                            </circle>
                          )}
                          {groupIndex === 0 && (
                            <text
                              x={x(p.hour)}
                              y={valueLabelY(p.hour, p.speed)}
                              textAnchor="middle"
                              fill="#071a3d"
                              paintOrder="stroke"
                              stroke={grouped ? '#fffcf5' : 'none'}
                              strokeWidth={grouped ? 4 : 0}
                            >
                              {p.speed}
                            </text>
                          )}
                        </g>
                      ))}
                    </g>
                  );
                },
              )}
            </>
          );
        }}
      </Plot>
      <p className={s.detail}>
        {grouped
          ? '每族各观测一个体；每条线仍连接同一个体的六次记录。'
          : type === 'scatter'
            ? '每个点是一条观测：用位置表示时刻与速度。'
            : type === 'line'
              ? '同一个体，多次观测。连线帮助我们追踪时间变化。'
              : '每根柱子是一条观测：用柱高比较各时刻的速度。'}
      </p>
    </div>
  );
}

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

export function LineChart({
  axisLabels,
  groupedByKind = false,
}: {
  axisLabels?: AxisLabels;
  groupedByKind?: boolean;
} = {}) {
  return (
    <PatrolChart
      type="line"
      axisLabels={axisLabels ?? { x: '观测时刻（时）', y: '速度（m/s）' }}
      groupedByKind={groupedByKind}
    />
  );
}

export function KindBars({
  axisLabels,
  groupedBySize = false,
}: {
  axisLabels?: AxisLabels;
  groupedBySize?: boolean;
} = {}) {
  const sizeGroups = ['<180 cm', '≥180 cm'];
  const grouped = demonKinds.map((kind) => ({
    kind,
    values: (groupedBySize ? [0, 1] : [0]).map((groupIndex) => {
      const sample = demons.filter(
        (d) =>
          d.kind === kind &&
          (!groupedBySize ||
            (groupIndex === 0 ? d.height < 180 : d.height >= 180)),
      );
      return sample.length ? mean(sample.map((d) => d.speed)) : null;
    }),
  }));
  const yTicks = range(
    grouped.flatMap((group) =>
      group.values.filter((v): v is number => v !== null),
    ),
    4,
    true,
  );
  return (
    <div className={s.chart}>
      {groupedBySize && (
        <div className={s.legend}>
          <strong>身高</strong>
          {sizeGroups.map((label, i) => (
            <span key={label}>
              <i style={{ background: COLORS[i] }} />
              {label}
            </span>
          ))}
        </div>
      )}
      <Plot
        label={
          groupedBySize
            ? '各恶魔种类按身高分组的平均速度条形图，空组不显示柱子'
            : '三类恶魔的平均速度条形图，每根柱子表示该族 30 个个体的平均值'
        }
      >
        {(b) => {
          const y = scale(yTicks, b.bottom, b.top + 16);
          const step = (b.right - b.left) / demonKinds.length;
          const barWidth = step * (groupedBySize ? 0.3 : 0.56);
          return (
            <>
              <Axes
                b={b}
                x={(v) => b.left + step * (v + 0.5)}
                y={y}
                xTicks={[0, 1, 2]}
                xTickLabels={Object.fromEntries(
                  demonKinds.map((kind, i) => [i, kind]),
                )}
                yTicks={yTicks}
                xLabel={axisLabels?.x ?? '恶魔种类'}
                yLabel={axisLabels?.y ?? '平均速度（m/s）'}
              />
              {grouped.map((group, kindIndex) =>
                group.values.map((value, groupIndex) => {
                  if (value === null) return null;
                  const center = b.left + step * (kindIndex + 0.5);
                  const barCenter = groupedBySize
                    ? center + (groupIndex === 0 ? -1 : 1) * step * 0.17
                    : center;
                  return (
                    <g key={`${group.kind}-${groupIndex}`}>
                      <rect
                        x={barCenter - barWidth / 2}
                        y={y(value)}
                        width={barWidth}
                        height={b.bottom - y(value)}
                        fill={COLORS[groupIndex]}
                      />
                      <text
                        x={barCenter}
                        y={y(value) - 8}
                        textAnchor="middle"
                        fill="#071a3d"
                      >
                        {value.toFixed(1)}
                      </text>
                    </g>
                  );
                }),
              )}
            </>
          );
        }}
      </Plot>
      <p className={s.detail}>
        {groupedBySize
          ? '柱高表示该组平均速度；空缺表示没有样本。'
          : '柱高表示每族 30 个个体的平均速度。'}
      </p>
    </div>
  );
}

export function ComparisonBars() {
  const data = demons.slice(0, 5);
  const yTicks = range(
    data.map((d) => d.height),
    4,
    true,
  );
  return (
    <div className={s.chart}>
      <Plot label="五只恶魔的身高条形图，每根柱子对应一个个体">
        {(b) => {
          const y = scale(yTicks, b.bottom, b.top + 16);
          const step = (b.right - b.left) / data.length;
          return (
            <>
              <Axes
                b={b}
                x={(v) => v}
                y={y}
                xTicks={[]}
                yTicks={yTicks}
                xLabel="恶魔编号"
                yLabel="身高（cm）"
              />
              {data.map((d, i) => (
                <g key={d.id}>
                  <rect
                    x={b.left + step * i + step * 0.2}
                    y={y(d.height)}
                    width={step * 0.6}
                    height={b.bottom - y(d.height)}
                    fill="#1457d9"
                  />
                  <text
                    x={b.left + step * (i + 0.5)}
                    y={y(d.height) - 7}
                    textAnchor="middle"
                    fill="#071a3d"
                  >
                    {d.height}
                  </text>
                  <text
                    x={b.left + step * (i + 0.5)}
                    y={b.bottom + 25}
                    textAnchor="middle"
                    fill="#071a3d"
                  >
                    {d.id}
                  </text>
                </g>
              ))}
            </>
          );
        }}
      </Plot>
    </div>
  );
}
