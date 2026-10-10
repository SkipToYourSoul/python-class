/* oxlint-disable next/no-img-element -- Existing local course artwork. */
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { Page, CodeTools, Art } from './lesson-ui';
import { DataScatter, KindBars } from './charts';
import { demons, demonKinds, penguins, penguinKinds } from './study-data';
import {
  PAIRPLOT_FULL_CODE,
  PAIRPLOT_UNCOLORED_FULL_CODE,
  PENGUIN_PRACTICE_CODE,
  PENGUIN_AXIS_LABELS,
  PENGUIN_PLOT_FIELDS,
  getPenguinFullCode,
} from './practice-content';
import { assetBase } from './lesson-data';
import { estimateDensity } from './penguin-density';
import s from './third-section.module.css';

const colors = ['#1457d9', '#d45030', '#16816a'];
const fields = [
  { key: 'billLength', name: '喙长', unit: 'mm' },
  { key: 'billDepth', name: '喙深', unit: 'mm' },
  { key: 'flipper', name: '鳍肢长度', unit: 'mm' },
  { key: 'mass', name: '体重', unit: 'g' },
] as const;
type PenguinField = (typeof fields)[number]['key'];
const fieldLabel = (key: PenguinField) => {
  const field = fields.find((f) => f.key === key)!;
  return `${field.name}（${field.unit}）`;
};

function PenguinPlot({
  x = 'billLength',
  y = 'billDepth',
  english = false,
}: {
  x?: PenguinField;
  y?: PenguinField;
  english?: boolean;
}) {
  return (
    <DataScatter
      points={penguins.map((p) => ({
        id: p.id,
        kind: english ? p.species : p.kind,
        x: p[x],
        y: p[y],
      }))}
      kinds={english ? ['Adelie', 'Chinstrap', 'Gentoo'] : penguinKinds}
      colored
      interactive={false}
      xLabel={english ? PENGUIN_AXIS_LABELS.x : fieldLabel(x)}
      yLabel={english ? PENGUIN_AXIS_LABELS.y : fieldLabel(y)}
    />
  );
}

export function DemonPairs() {
  const [state, update] = usePageState({ evidenceRevealed: false });
  return (
    <Page
      title="两组特征，交叉核对线索"
      label="DEMON EVIDENCE · 恶魔特征观察"
      footer={
        <>
          <p>同样的 90 个个体、同样的种类颜色，换特征后再核对。</p>
          <button
            className={s.button}
            aria-expanded={state.evidenceRevealed}
            onClick={() =>
              update({ evidenceRevealed: !state.evidenceRevealed })
            }
          >
            {state.evidenceRevealed ? '收起参考线索' : '观察后，核对线索'}
          </button>
        </>
      }
    >
      <div className={s.twoCharts}>
        {(['speed', 'mass'] as const).map((field) => (
          <section className={s.evidenceCard} key={field}>
            <h3>{field === 'speed' ? '身高 × 速度' : '身高 × 体重'}</h3>
            <div className={s.plot}>
              <DataScatter
                points={demons.map((d) => ({
                  id: d.id,
                  kind: d.kind,
                  x: d.height,
                  y: d[field],
                }))}
                kinds={demonKinds}
                colored
                interactive={false}
                xLabel="身高（cm）"
                yLabel={field === 'speed' ? '速度（m/s）' : '体重（kg）'}
              />
            </div>
            <div className={s.finding} aria-live="polite">
              <strong>
                {field === 'speed'
                  ? '哪类点群偏右下？哪类偏左上？'
                  : '较高的点群，也通常更重吗？'}
              </strong>
              <p>
                {state.evidenceRevealed
                  ? field === 'speed'
                    ? '藤甲魔族偏右下，整体较高、速度较低。冰翼魔族偏左上，整体较矮、速度较高。'
                    : '藤甲魔族偏右上，整体较高、较重。冰翼魔族偏左下，整体较矮、较轻。'
                  : '先按图例找到三类点群，再描述它们的位置。也找一找点群交界和例外。'}
              </p>
            </div>
          </section>
        ))}
      </div>
      <p className={s.caution}>
        例外也算证据：D004 身高 205 cm、速度 11.7
        m/s，是一只高而快的炎角兽。整体特点不代表每一个体。
      </p>
    </Page>
  );
}

const demonClues = [
  { title: '炎角兽族', clue: '三项平均值居中，同族仍有差异。' },
  { title: '藤甲魔族', clue: '整体较高、较重，平均速度较低。' },
  { title: '冰翼魔族', clue: '整体较矮、较轻，平均速度较高。' },
];

export function DemonDossier() {
  return (
    <Page
      title="三张图，补齐恶魔特征档案"
      label="DEMON DOSSIER · 侦察线索归档"
      footer={
        <p>
          把散点图上的点群特点，与三族的平均值交叉核对。每族各 30 个观测个体。
        </p>
      }
    >
      <div className={s.dossierCharts}>
        {(
          [
            { field: 'height', title: '体型线索：谁通常更高？' },
            { field: 'mass', title: '体重线索：谁通常更重？' },
            { field: 'speed', title: '速度线索：谁平均更快？' },
          ] as const
        ).map((item) => (
          <section className={s.evidenceCard} key={item.field}>
            <h3>{item.title}</h3>
            <div className={s.plot}>
              <KindBars field={item.field} colorByKind />
            </div>
          </section>
        ))}
      </div>
      <div className={s.kindCards}>
        {demonClues.map((item, i) => (
          <section key={item.title} style={{ borderTopColor: colors[i] }}>
            <h3>
              <i style={{ background: colors[i] }} />
              {item.title}
            </h3>
            <p>{item.clue}</p>
          </section>
        ))}
      </div>
      <p className={s.caution}>
        图表描述这批样本的体型与速度，平均值不能代替每只恶魔的记录。
      </p>
    </Page>
  );
}

function MatrixCell({
  xKey,
  yKey,
  colored,
}: {
  xKey: PenguinField;
  yKey: PenguinField;
  colored: boolean;
}) {
  const xs = penguins.map((p) => p[xKey]);
  const ys = penguins.map((p) => p[yKey]);
  const loX = Math.min(...xs),
    hiX = Math.max(...xs);
  const loY = Math.min(...ys),
    hiY = Math.max(...ys);
  if (xKey !== yKey) {
    return (
      <svg viewBox="0 0 140 100" preserveAspectRatio="none" aria-hidden="true">
        {penguins.map((p) => (
          <circle
            key={p.id}
            cx={7 + ((p[xKey] - loX) / (hiX - loX)) * 126}
            cy={93 - ((p[yKey] - loY) / (hiY - loY)) * 86}
            r="1.7"
            fill={colors[colored ? penguinKinds.indexOf(p.kind) : 0]}
            opacity=".7"
          />
        ))}
      </svg>
    );
  }
  if (colored) {
    const curves = penguinKinds.map((kind) =>
      estimateDensity(
        penguins.filter((p) => p.kind === kind).map((p) => p[xKey]),
        penguins.length,
      ),
    );
    const low = Math.min(...curves.map((curve) => curve.points[0].value));
    const high = Math.max(...curves.map((curve) => curve.points.at(-1)!.value));
    const peak = Math.max(
      ...curves.flatMap((curve) => curve.points.map((point) => point.density)),
    );
    const x = (value: number) => 5 + ((value - low) / (high - low)) * 130;
    return (
      <svg
        viewBox="0 0 140 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        data-field={xKey}
        data-low={low}
        data-high={high}
        data-peak={peak}
      >
        {curves.map((curve, i) => {
          const line = curve.points
            .map(
              (point, j) =>
                `${j === 0 ? 'M' : 'L'}${x(point.value)},${93 - (point.density / peak) * 84}`,
            )
            .join(' ');
          return (
            <g key={penguinKinds[i]} data-kind={penguinKinds[i]}>
              <path
                d={`${line} L${x(curve.points.at(-1)!.value)},93 L${x(curve.points[0].value)},93 Z`}
                fill={colors[i]}
                fillOpacity=".18"
              />
              <path
                d={line}
                fill="none"
                stroke={colors[i]}
                strokeWidth="1.6"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>
    );
  }
  const sorted = [...xs].sort((a, b) => a - b);
  const quantile = (q: number) => {
    const index = (sorted.length - 1) * q;
    const low = Math.floor(index);
    return (
      sorted[low] + (sorted[Math.ceil(index)] - sorted[low]) * (index - low)
    );
  };
  // Match NumPy / Seaborn's default auto rule: the smaller FD or Sturges width.
  const sturgesWidth = (hiX - loX) / (Math.log2(xs.length) + 1);
  const fdWidth =
    (2 * (quantile(0.75) - quantile(0.25))) / Math.cbrt(xs.length);
  const binCount = Math.ceil(
    (hiX - loX) /
      (fdWidth > 0 ? Math.min(fdWidth, sturgesWidth) : sturgesWidth),
  );
  const bins = Array.from(
    { length: binCount },
    (_, i) =>
      penguins.filter(
        (p) =>
          Math.min(
            binCount - 1,
            Math.floor(((p[xKey] - loX) / (hiX - loX)) * binCount),
          ) === i,
      ).length,
  );
  const maxCount = Math.max(...bins);
  return (
    <svg viewBox="0 0 140 100" preserveAspectRatio="none" aria-hidden="true">
      {bins.map((count, i) => (
        <rect
          key={i}
          x={5 + (i * 130) / binCount}
          y={93 - (count / maxCount) * 84}
          width={130 / binCount}
          height={(count / maxCount) * 84}
          data-count={count}
          data-low={loX + (i * (hiX - loX)) / binCount}
          data-high={loX + ((i + 1) * (hiX - loX)) / binCount}
          fill={colors[0]}
          opacity=".65"
        />
      ))}
    </svg>
  );
}

export function PenguinOverview() {
  const [state, update] = usePageState({ matrixColored: false });
  const [zoom, setZoom] = useState<{ x: PenguinField; y: PenguinField } | null>(
    null,
  );
  return (
    <Page
      title="四项特征，一次看全"
      label="REAL DATA · 企鹅数据总览"
      footer={
        <>
          <p>{penguins.length} 条观测 · Penguins_cleaned.csv</p>
          <CodeTools
            code={
              state.matrixColored
                ? PAIRPLOT_FULL_CODE
                : PAIRPLOT_UNCOLORED_FULL_CODE
            }
            label="总览参考代码"
          />
        </>
      }
    >
      <div className={s.overview}>
        <div className={s.matrixArea}>
          <strong className={s.matrixHeading}>成对图 Pair plot</strong>
          <div className={s.matrixControls}>
            <div
              className={s.legend}
              style={{ visibility: state.matrixColored ? 'visible' : 'hidden' }}
              aria-hidden={!state.matrixColored}
            >
              {penguinKinds.map((kind, i) => (
                <span key={kind}>
                  <i style={{ background: colors[i] }} />
                  {kind}
                </span>
              ))}
            </div>
            <button
              className={s.button}
              aria-pressed={state.matrixColored}
              onClick={() => update({ matrixColored: !state.matrixColored })}
            >
              {state.matrixColored ? '隐藏种类颜色' : '按种类着色'}
            </button>
          </div>
          <div className={s.matrix}>
            <strong>
              纵轴<span>／ 横轴</span>
            </strong>
            {fields.map((f) => (
              <strong key={f.key}>
                {f.name}
                <span>{f.unit}</span>
              </strong>
            ))}
            {fields.map((y) => (
              <div className={s.matrixRow} key={y.key}>
                <strong>
                  {y.name}
                  <span>{y.unit}</span>
                </strong>
                {fields.map((x) =>
                  x.key === y.key ? (
                    <figure
                      className={s.matrixDiagonal}
                      key={x.key}
                      aria-label={`${y.name}分布${state.matrixColored ? '密度图' : '直方图'}`}
                    >
                      <MatrixCell
                        xKey={x.key}
                        yKey={y.key}
                        colored={state.matrixColored}
                      />
                    </figure>
                  ) : (
                    <button
                      key={x.key}
                      className={s.matrixCell}
                      aria-label={`放大${x.name}与${y.name}散点图`}
                      onClick={() => setZoom({ x: x.key, y: y.key })}
                    >
                      <MatrixCell
                        xKey={x.key}
                        yKey={y.key}
                        colored={state.matrixColored}
                      />
                    </button>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={s.overviewNotes}>
          <section>
            <b>01 看清全部变量</b>
            <p>
              喙长、喙深、鳍肢长度、体重，都是数值数据。
              <strong>种类 species</strong> 是分类数据。
            </p>
            <p className={s.sampleCounts}>阿德利 151 · 帽带 68 · 巴布亚 123</p>
          </section>
          <section>
            <b>02 看懂每个格子</b>
            <p>
              上方选横轴，左侧选纵轴。两个维度相同的对角格看单项分布，其他格子看两项特征的联系。
            </p>
          </section>
          <section>
            <b>03 加颜色找线索</b>
            <p>
              着色后，对角线改用密度图：曲线越高，该值附近的记录越集中。哪些种类仍然重叠？点击散点格子可以放大。
            </p>
          </section>
        </div>
      </div>
      <Dialog
        open={zoom !== null}
        onOpenChange={(open) => {
          if (!open) setZoom(null);
        }}
      >
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>
              {zoom
                ? `${fieldLabel(zoom.x)} × ${fieldLabel(zoom.y)}`
                : '成对特征'}
            </DialogTitle>
            <DialogDescription>
              每个点是一只企鹅。颜色对应数据中已知种类，观察点群的位置与重叠。
            </DialogDescription>
          </DialogHeader>
          {zoom && (
            <div className={s.zoomPlot}>
              <DataScatter
                points={penguins.map((p) => ({
                  id: p.id,
                  kind: p.kind,
                  x: p[zoom.x],
                  y: p[zoom.y],
                }))}
                kinds={penguinKinds}
                xLabel={fieldLabel(zoom.x)}
                yLabel={fieldLabel(zoom.y)}
                colored={state.matrixColored}
                interactive={false}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Page>
  );
}

export function PenguinBill() {
  const [state, update] = usePageState({
    penguinX: 'billLength' as PenguinField,
    penguinY: 'billDepth' as PenguinField,
    penguinColored: true,
    billClueRevealed: false,
    selectedPoint: '',
  });
  const xField = state.penguinX;
  const yField = state.penguinY;
  const pair = [xField, yField].sort().join('-');
  const billPair = pair === 'billDepth-billLength';
  const observations: Record<string, string> = {
    'billDepth-billLength':
      '阿德利的喙通常较短。帽带与巴布亚的喙长相近，但帽带的喙通常更深。',
    'billLength-flipper':
      '阿德利的喙与鳍肢通常较短。帽带与巴布亚的喙长有重叠，巴布亚的鳍肢通常更长。',
    'billLength-mass':
      '阿德利的喙通常较短。帽带与巴布亚的喙长有重叠，巴布亚的体重通常更大。',
    'billDepth-flipper':
      '巴布亚的喙通常较浅、鳍肢较长。阿德利与帽带在这两项特征上重叠较多。',
    'billDepth-mass':
      '巴布亚的喙通常较浅、体重较大。阿德利与帽带在这两项特征上重叠较多。',
    'flipper-mass':
      '鳍肢较长的企鹅，体重也往往较大。巴布亚通常鳍肢更长、体重更大；其他两类仍有重叠。',
  };
  const chooseField = (axis: 'x' | 'y', field: PenguinField) =>
    update({
      ...(axis === 'x'
        ? { penguinX: field, ...(field === yField ? { penguinY: xField } : {}) }
        : {
            penguinY: field,
            ...(field === xField ? { penguinX: yField } : {}),
          }),
      billClueRevealed: false,
      selectedPoint: '',
    });
  return (
    <Page
      title="换一对特征，观察企鹅点群"
      label="PENGUIN EXPLORER · 企鹅特征观察"
      footer={
        <>
          <CodeTools
            code={getPenguinFullCode(xField, yField, state.penguinColored)}
            label="当前图的参考代码"
          />
          <button
            className={s.button}
            aria-expanded={state.billClueRevealed}
            onClick={() =>
              update({
                billClueRevealed: !state.billClueRevealed,
                penguinColored: true,
              })
            }
          >
            {state.billClueRevealed ? '收起参考观察' : '观察后，核对线索'}
          </button>
        </>
      }
    >
      <div className={s.explorerControls}>
        {(['x', 'y'] as const).map((axis) => (
          <label key={axis}>
            {axis === 'x' ? '横轴' : '纵轴'}
            <select
              value={axis === 'x' ? xField : yField}
              onChange={(e) =>
                chooseField(axis, e.target.value as PenguinField)
              }
            >
              {fields.map((field) => (
                <option key={field.key} value={field.key}>
                  {fieldLabel(field.key)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button
          className={s.button}
          aria-pressed={state.penguinColored}
          onClick={() =>
            update({
              penguinColored: !state.penguinColored,
              billClueRevealed: false,
            })
          }
        >
          {state.penguinColored ? '隐藏种类颜色' : '按种类着色'}
        </button>
        <p>换维度，比较哪些种类更容易区分。</p>
      </div>
      <div className={s.billLayout}>
        <div className={s.evidenceCard}>
          <div className={s.plot}>
            <DataScatter
              points={penguins.map((p) => ({
                id: p.id,
                kind: p.species,
                x: p[xField],
                y: p[yField],
              }))}
              kinds={['Adelie', 'Chinstrap', 'Gentoo']}
              xLabel={PENGUIN_PLOT_FIELDS[xField].label}
              yLabel={PENGUIN_PLOT_FIELDS[yField].label}
              colored={state.penguinColored}
            />
          </div>
        </div>
        <div className={s.billNotes}>
          <figure>
            <img
              src={`${assetBase}/assets/penguin-bill.png`}
              alt="企鹅喙的测量图：喙长沿嘴喙上缘方向测量；喙深表示嘴喙上下方向的厚度。"
            />
            <figcaption>喙长：横向长度　喙深：上下厚度</figcaption>
          </figure>
          <div className={s.finding} aria-live="polite">
            <strong>
              {billPair
                ? '喙长接近，喙深也接近吗？'
                : '换了特征，点群的位置有什么变化？'}
            </strong>
            <p>
              {state.billClueRevealed
                ? observations[pair]
                : `比较${fieldLabel(xField)}与${fieldLabel(yField)}，先找点群的位置，再留意交界与重叠。`}
            </p>
          </div>
        </div>
      </div>
      <p className={s.caution}>
        {penguins.length} 条观测 ·
        每个点是一只企鹅。换特征后再核对，“通常”不等于“一定”。
      </p>
    </Page>
  );
}

export function PenguinFeatures() {
  const [state, update] = usePageState({ bodyClueRevealed: false });
  return (
    <Page
      title="换组特征，换个角度看企鹅"
      label="PENGUIN EVIDENCE · 核对另一组特征"
      footer={
        <>
          <p>与上一页的其他特征组合比较：哪类更容易区分？</p>
          <button
            className={s.button}
            aria-expanded={state.bodyClueRevealed}
            onClick={() =>
              update({ bodyClueRevealed: !state.bodyClueRevealed })
            }
          >
            {state.bodyClueRevealed ? '收起参考观察' : '观察后，核对线索'}
          </button>
        </>
      }
    >
      <div className={s.featureLayout}>
        <div className={s.evidenceCard}>
          <div className={s.plot}>
            <PenguinPlot x="flipper" y="mass" />
          </div>
        </div>
        <div className={s.overviewNotes}>
          <section>
            <b>三类的平均值，帮我们核对位置</b>
            <table className={s.means}>
              <thead>
                <tr>
                  <th>种类</th>
                  <th>鳍肢 / mm</th>
                  <th>体重 / g</th>
                </tr>
              </thead>
              <tbody>
                {penguinKinds.map((kind, i) => {
                  const rows = penguins.filter((p) => p.kind === kind);
                  const mean = (field: PenguinField) =>
                    rows.reduce((sum, p) => sum + p[field], 0) / rows.length;
                  return (
                    <tr key={kind}>
                      <th>
                        <i style={{ background: colors[i] }} />
                        {kind}
                      </th>
                      <td>{mean('flipper').toFixed(1)}</td>
                      <td>{Math.round(mean('mass'))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          <div className={s.finding} aria-live="polite">
            <strong>哪类点群偏右上？</strong>
            <p>
              {state.bodyClueRevealed
                ? '巴布亚企鹅的鳍肢通常更长，体重通常更大。阿德利与帽带在这组特征上重叠较多。'
                : '先读横轴和纵轴，再按颜色找点群。用右侧平均值核对你的观察。'}
            </p>
          </div>
          <p className={s.caution}>
            换特征会改变哪些种类容易区分。只凭一项数值，还不能确定一只企鹅的种类。
          </p>
        </div>
      </div>
    </Page>
  );
}

export function PenguinPractice() {
  const [state, update] = usePageState({ penguinPracticeRevealed: false });
  return (
    <Page
      title="亲手画出企鹅的种类差异"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={
        <>
          <CodeTools code={PENGUIN_PRACTICE_CODE} label="完整跟写代码" />
          <button
            className={s.button}
            aria-expanded={state.penguinPracticeRevealed}
            onClick={() =>
              update({
                penguinPracticeRevealed: !state.penguinPracticeRevealed,
              })
            }
          >
            {state.penguinPracticeRevealed
              ? '收起练习收获'
              : '完成跟写，查看收获'}
          </button>
        </>
      }
    >
      <div className={s.practiceLayout}>
        <div className={s.practiceCode}>
          <p className={s.instructions}>
            先运行字体准备单元格。CSV 与笔记本放在同一文件夹。
            <br />
            亲手跟写完整代码，按 <strong>Shift+Enter</strong> 运行。
          </p>
          <NotebookPanel
            compact
            title="第五课练习.ipynb"
            cells={[{ code: PENGUIN_PRACTICE_CODE }]}
          />
        </div>
        <div className={s.practiceOutput}>
          <section className={s.evidenceCard}>
            <strong className={s.outputLabel}>
              输出示例 · 342 只企鹅，三种颜色
            </strong>
            <div className={s.plot}>
              <PenguinPlot english />
            </div>
          </section>
          <div className={s.practiceFinding}>
            <ClassPracticeStamp number="03" checklist />
            <div aria-live="polite">
              <strong>核对坐标、单位、图例，再解释发现</strong>
              <p>
                {state.penguinPracticeRevealed
                  ? 'hue="species" 让种类差异显现：阿德利的喙通常较短，帽带与巴布亚的喙深有差异。点群仍有重叠。'
                  : '你画出了三类企鹅吗？哪类喙通常较短？哪两类喙长相近、喙深有差异？'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function FinalPreparation() {
  return (
    <Page
      title="图鉴已备好，下一课最终决战"
      label="READY FOR BATTLE · 侦察成果交付"
      footer={<p>第六课：最终决战。勇士带上有图表证据的线索，继续行动。</p>}
    >
      <div className={s.finaleLayout}>
        <div className={s.finaleArt}>
          <Art kind="discovery" />
          <blockquote>“体型和速度看清了，决战前的准备更充分了！”</blockquote>
        </div>
        <div className={s.finalClues}>
          {demonClues.map((item, i) => {
            const rows = demons.filter((d) => d.kind === item.title);
            const mean = (f: 'height' | 'mass' | 'speed') =>
              rows.reduce((sum, d) => sum + d[f], 0) / rows.length;
            return (
              <section key={item.title} style={{ borderLeftColor: colors[i] }}>
                <h3>{item.title}</h3>
                <p>{item.clue}</p>
                <span>
                  平均身高 {mean('height').toFixed(1)} cm · 体重{' '}
                  {mean('mass').toFixed(1)} kg
                  <br />
                  平均速度 {mean('speed').toFixed(2)} m/s
                </span>
              </section>
            );
          })}
          <p className={s.caution}>
            勇士还记得：同族有差异，点群会重叠。图鉴里的特点，需要继续用观测核对。
          </p>
        </div>
      </div>
    </Page>
  );
}
