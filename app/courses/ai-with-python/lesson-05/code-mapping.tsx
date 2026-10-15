import { ArrowRight } from 'lucide-react';
import { demons, demonKinds, patrol, demonHistograms } from './study-data';
import s from './code-lesson.module.css';

export type CodeLessonKind = 'hist' | 'scatter' | 'line' | 'bar' | 'hue';
export type CodeMappingRow = {
  column: string;
  value: string;
  parameter: string;
  target: string;
  color?: string;
};
export type CodeMapping = {
  label: string;
  rows: CodeMappingRow[];
};

const sample = demons[0];
const firstPatrol = patrol[0];
const speedBin = demonHistograms.speed.find(
  (bin) => sample.speed >= bin.low && sample.speed < bin.high,
)!;
const firstKindSpeeds = demons
  .filter((d) => d.kind === demonKinds[0])
  .map((d) => d.speed);
const firstKindMean = (
  firstKindSpeeds.reduce((sum, speed) => sum + speed, 0) /
  firstKindSpeeds.length
).toFixed(2);
const samplePosition: CodeMappingRow[] = [
  {
    column: 'height',
    value: `${sample.height} cm`,
    parameter: 'x="height"',
    target: `横轴 ${sample.height}`,
  },
  {
    column: 'speed',
    value: `${sample.speed} m/s`,
    parameter: 'y="speed"',
    target: `纵轴 ${sample.speed}`,
  },
];

/** Mapping examples use the same packaged records as the projected charts. */
export function getCodeMapping(
  kind: CodeLessonKind,
  step: number,
): CodeMapping {
  if (kind === 'hist') {
    if (step === 0)
      return {
        label: '先确定从哪张表取数',
        rows: [
          {
            column: 'demons 表',
            value: `${demons.length} 行个体记录`,
            parameter: 'data=demons',
            target: `${demons.length} 个体参与统计`,
          },
        ],
      };
    if (step === 1)
      return {
        label: `${sample.id} 的速度进入哪个组？`,
        rows: [
          {
            column: 'speed',
            value: `${sample.speed} m/s`,
            parameter: 'x="speed"',
            target: `${speedBin.low.toFixed(2)}–${speedBin.high.toFixed(2)} 组`,
          },
        ],
      };
    return {
      label: '横轴读速度，柱高读个体数',
      rows: [
        {
          column: 'speed',
          value: '单位 m/s',
          parameter: 'plt.xlabel',
          target: '横轴：速度',
        },
        {
          column: '分组后计数',
          value: `示例组 ${speedBin.count} 个体`,
          parameter: 'plt.ylabel',
          target: '纵轴：个体数',
        },
      ],
    };
  }
  if (kind === 'scatter')
    return {
      label:
        step === 0
          ? `跟踪 ${sample.id}：同一行组成一个点`
          : step === 1
            ? '两个字段决定同一个点的位置'
            : `${sample.id} 的位置与坐标轴逐项核对`,
      rows:
        step === 0
          ? [
              {
                column: `${sample.id} 这一行`,
                value: `${sample.height}，${sample.speed}`,
                parameter: 'scatterplot',
                target: '图上的一个点',
              },
            ]
          : step === 1
            ? samplePosition
            : [
                {
                  column: 'height',
                  value: '单位 cm',
                  parameter: 'plt.xlabel',
                  target: '横轴：身高',
                },
                {
                  column: 'speed',
                  value: '单位 m/s',
                  parameter: 'plt.ylabel',
                  target: '纵轴：速度',
                },
              ],
    };
  if (kind === 'line')
    return {
      label:
        step === 0
          ? `patrol 表：同一个体的 ${patrol.length} 次观测`
          : step === 1
            ? '按 hour 的顺序连接这些观测'
            : '第一颗圆点与原始记录一致吗？',
      rows:
        step === 0
          ? [
              {
                column: 'patrol.csv',
                value: `${patrol.length} 条观测`,
                parameter: 'pd.read_csv',
                target: '读入 patrol 表',
              },
            ]
          : step === 1
            ? [
                {
                  column: 'hour',
                  value: `${firstPatrol.hour}:00`,
                  parameter: 'x="hour"',
                  target: `横轴 ${firstPatrol.hour}`,
                },
                {
                  column: 'speed',
                  value: `${firstPatrol.speed} m/s`,
                  parameter: 'y="speed"',
                  target: `纵轴 ${firstPatrol.speed}`,
                },
              ]
            : [
                {
                  column: 'hour',
                  value: '单位：时',
                  parameter: 'plt.xlabel',
                  target: '横轴：时刻',
                },
                {
                  column: 'speed',
                  value: '单位 m/s',
                  parameter: 'plt.ylabel',
                  target: '纵轴：速度',
                },
              ],
    };
  if (kind === 'bar')
    return {
      label:
        step === 0
          ? '同一族的记录归到同一根柱子'
          : step === 1
            ? '柱高来自这一族的全部速度'
            : '横轴找种类，纵轴读平均速度',
      rows:
        step === 0
          ? [
              {
                column: 'kind',
                value: demonKinds[0],
                parameter: 'x="kind"',
                target: '第一根柱子',
              },
            ]
          : step === 1
            ? [
                {
                  column: 'kind',
                  value: demonKinds[0],
                  parameter: 'x="kind"',
                  target: '同族归到一起',
                },
                {
                  column: 'speed',
                  value: `${firstKindSpeeds.length} 条记录`,
                  parameter: 'y="speed"',
                  target: `均值 ${firstKindMean} m/s`,
                },
              ]
            : [
                {
                  column: 'kind',
                  value: `${demonKinds.length} 族`,
                  parameter: 'plt.xlabel',
                  target: '横轴：种类',
                },
                {
                  column: 'speed 均值',
                  value: '单位 m/s',
                  parameter: 'plt.ylabel',
                  target: '纵轴：平均速度',
                },
              ],
    };
  return {
    label:
      step === 0
        ? `${sample.id}：先保留原来的位置`
        : step === 1
          ? `${sample.id}：位置相同，颜色来自种类`
          : '图例把颜色与种类对应起来',
    rows:
      step === 0
        ? samplePosition
        : [
            {
              column: 'kind',
              value: sample.kind,
              parameter: 'hue="kind"',
              target: `${sample.kind}的点`,
              color: '#1457d9',
            },
          ],
  };
}

export function CodeMappingDiagram({ mapping }: { mapping: CodeMapping }) {
  return (
    <section className={s.mapping} aria-label={mapping.label}>
      <div className={s.mappingHeader} aria-hidden="true">
        <span>表中记录</span>
        <ArrowRight size={18} />
        <span>代码参数</span>
        <ArrowRight size={18} />
        <span>图上结果</span>
      </div>
      {mapping.rows.map((row) => (
        <div className={s.mappingRow} key={row.parameter}>
          <div className={s.source}>
            <strong>{row.column}</strong>
            <span>{row.value}</span>
          </div>
          <ArrowRight size={18} aria-hidden="true" />
          <code>{row.parameter}</code>
          <ArrowRight size={18} aria-hidden="true" />
          <span className={s.target}>
            {row.color && (
              <i style={{ background: row.color }} aria-hidden="true" />
            )}
            {row.target}
          </span>
        </div>
      ))}
    </section>
  );
}
