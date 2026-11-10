'use client';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
} from 'recharts';
import {
  history,
  TOWER_NAMES,
  HOURS,
  ATTACK_THRESHOLD,
  windows,
} from './study-data';
import s from './lesson.module.css';
export const TOWER_COLORS = ['#1457D9', '#BE4B2B', '#16806A'];
const series = HOURS.map((hour) =>
  Object.fromEntries([
    ['hour', hour],
    ...TOWER_NAMES.map((tower) => [
      tower,
      history.find((r) => r.tower === tower && r.hour === hour)!.energy,
    ]),
  ]),
);
const tick = { fontSize: 18, fill: '#071a3d' };
const margin = { top: 8, right: 20, left: 0, bottom: 16 };
export function TowerChart({
  kind = 'history',
  threshold = false,
  tower,
  clueTower,
  codeMapping = false,
}: {
  kind?: 'history' | 'guards';
  threshold?: boolean;
  tower?: string;
  clueTower?: string;
  codeMapping?: boolean;
}) {
  const line = kind === 'history';
  const towers = tower
    ? TOWER_NAMES.filter((name) => name === tower)
    : TOWER_NAMES;
  const candidates = windows
    .filter((row) => row.tower === clueTower)
    .sort((a, b) => a.hour - b.hour);
  const xLabel = line ? '观测时刻（时）' : '守卫防御力';
  const axisColor = (axis: 'x' | 'y') =>
    codeMapping ? `var(--chart-${axis})` : undefined;
  const xAxis = {
    tick: { ...tick, fill: axisColor('x') ?? tick.fill },
    axisLine: codeMapping ? { stroke: axisColor('x'), strokeWidth: 2 } : true,
    label: {
      value: xLabel,
      position: 'insideBottom' as const,
      offset: -10,
      fontSize: 18,
      fontWeight: codeMapping ? 800 : undefined,
      fill: axisColor('x'),
    },
    height: 52,
  };
  const yAxis = {
    tick: { ...tick, fill: axisColor('y') ?? tick.fill },
    axisLine: codeMapping ? { stroke: axisColor('y'), strokeWidth: 2 } : true,
    domain: [0, 100],
    ticks: [0, ATTACK_THRESHOLD, 60, 100],
    width: 48,
  };
  const reference = threshold ? (
    <ReferenceLine
      y={ATTACK_THRESHOLD}
      stroke={codeMapping ? 'var(--chart-limit)' : '#071a3d'}
      strokeWidth={codeMapping ? 3 : 1}
      strokeDasharray="6 4"
      label={
        codeMapping
          ? {
              value: `阈值 ${ATTACK_THRESHOLD}`,
              position: 'insideTopLeft',
              fill: 'var(--chart-limit)',
              fontWeight: 800,
              stroke: '#fffdf8',
              strokeWidth: 4,
              paintOrder: 'stroke',
            }
          : undefined
      }
    />
  ) : null;
  const clueDots = candidates.map((row, index) => (
    <ReferenceDot
      key={row.hour}
      x={line ? row.hour : row.defense}
      y={row.energy}
      r={7}
      fill={TOWER_COLORS[TOWER_NAMES.indexOf(row.tower)]}
      stroke="#071a3d"
      strokeWidth={2}
      label={{
        value: `${row.hour}时`,
        position: line
          ? index === 0
            ? 'left'
            : 'right'
          : index === 0
            ? row.tower === '东塔'
              ? 'left'
              : 'right'
            : 'top',
        offset: 10,
        fontSize: 18,
        fontWeight: 800,
        fill: '#071a3d',
        stroke: '#fffdf8',
        strokeWidth: 4,
        paintOrder: 'stroke',
      }}
    />
  ));
  return (
    <div
      className={s.chart}
      aria-label={
        line
          ? `${tower ? `${tower}12次观测` : '三塔36次观测'}，横轴时刻，纵轴外罩强度`
          : `${tower ? `${tower}12次观测` : '三塔36次观测'}，横轴守卫防御，纵轴外罩强度`
      }
    >
      <div className={s.chartTitle}>
        {tower && `${tower} · `}
        {line ? '外罩强度随时间变化' : '守卫防御 × 外罩强度'}
        <span className={s.chartAxisHint}>
          <span data-chart-y={codeMapping || undefined}>纵轴：外罩强度</span>
          {!line && ' · 每个点是一条观测'}
        </span>
      </div>
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={180}
        initialDimension={{ width: 600, height: 280 }}
      >
        {line ? (
          <LineChart data={series} margin={margin}>
            {threshold && (
              <ReferenceArea
                y1={0}
                y2={ATTACK_THRESHOLD}
                fill="#dcefd6"
                fillOpacity={0.55}
              />
            )}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              type="number"
              dataKey="hour"
              domain={[HOURS[0], HOURS[HOURS.length - 1]]}
              ticks={HOURS}
              {...xAxis}
            />
            <YAxis {...yAxis} />
            <Tooltip
              contentStyle={{ fontSize: 20 }}
              labelFormatter={(v) => `${v} 时`}
            />
            <Legend
              verticalAlign="top"
              height={32}
              wrapperStyle={{ fontSize: 18 }}
            />
            {reference}
            {towers.map((tower) => (
              <Line
                key={tower}
                type="linear"
                dataKey={tower}
                stroke={TOWER_COLORS[TOWER_NAMES.indexOf(tower)]}
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                isAnimationActive={false}
              />
            ))}
            {clueDots}
          </LineChart>
        ) : (
          <ScatterChart margin={margin}>
            {threshold && (
              <ReferenceArea
                y1={0}
                y2={ATTACK_THRESHOLD}
                fill="#dcefd6"
                fillOpacity={0.55}
              />
            )}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="defense"
              name="守卫防御"
              domain={[0, 100]}
              {...xAxis}
            />
            <YAxis type="number" dataKey="energy" name="外罩强度" {...yAxis} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const r = payload[0].payload;
                return (
                  <div className={s.plotTooltip}>
                    {r.tower} · {r.hour} 时<br />
                    外罩 {r.energy} / 防御 {r.defense}
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              height={32}
              wrapperStyle={{ fontSize: 18 }}
            />
            {reference}
            {towers.map((tower) => (
              <Scatter
                key={tower}
                name={tower}
                data={history.filter((r) => r.tower === tower)}
                fill={TOWER_COLORS[TOWER_NAMES.indexOf(tower)]}
                isAnimationActive={false}
              />
            ))}
            {clueDots}
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
