/* oxlint-disable next/no-img-element -- Local course illustrations and official library logos. */
'use client';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { Page, Guide, Tabs, CodeTools } from './lesson-ui';
import { Plot } from './charts';
import { demons } from './study-data';
import { SETUP_CODE } from './practice-content';
import { assetBase } from './lesson-data';
import s from './early-scenes.module.css';

const speeds = demons.slice(0, 9).map((d) => d.speed);
const ordered = [...speeds].sort((a, b) => a - b);
const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;

export function NumericStory() {
  const [state, update] = usePageState({ step: 0 });
  return (
    <Page
      title="这么多数字，先看什么？"
      label="NUMERICAL DATA · 数值特征"
      footer={<p>先概括数值的特点，再看整个军团的速度分布。</p>}
    >
      <div className={s.numericGrid}>
        <figure className={s.comic}>
          <img
            src={`${assetBase}/assets/numeric-features.png`}
            alt="小派面对大量速度观测卡片感到困惑，熊猫博士与勇士比较卡片上的数值"
          />
          <figcaption>小派：“90 个速度数字，怎样说清军团的特点？”</figcaption>
        </figure>
        <div className={s.explanation}>
          <div className={s.sample}>
            <strong>先看前 9 个速度 · 从小到大 / m/s</strong>
            <p>{ordered.join('、')}</p>
          </div>
          <Tabs
            items={['集中趋势', '离散趋势']}
            value={state.step}
            onChange={(step) => update({ step })}
          />
          <div className={s.featureList}>
            {state.step === 0 ? (
              <>
                <h3>数据集中在哪里？</h3>
                <p>
                  <strong>平均数 ≈ {mean.toFixed(1)}</strong>
                  <span>总和 ÷ 个数，概括整体水平。</span>
                </p>
                <p>
                  <strong>中位数 = {ordered[4]}</strong>
                  <span>按大小排队后，中间的那个数。</span>
                </p>
                <p>
                  <strong>众数 = 9.6</strong>
                  <span>出现最多的数，这里出现 2 次。</span>
                </p>
              </>
            ) : (
              <>
                <h3>彼此差得有多大？</h3>
                <p>
                  <strong>最小值 5.1 · 最大值 11.7</strong>
                  <span>先找到数值的两端。</span>
                </p>
                <p>
                  <strong>极差 = 11.7 − 5.1 = 6.6</strong>
                  <span>最大值减最小值，描述跨度。</span>
                </p>
                <p>
                  <strong>差异越大，数据越分散</strong>
                  <span>还可用标准差等方法衡量。</span>
                </p>
              </>
            )}
          </div>
          <Guide>
            {state.step === 0
              ? '还要看看：个体差得有多大？'
              : '分组后，还能看清分布的形状。'}
          </Guide>
        </div>
      </div>
    </Page>
  );
}

const edges = [4, 8, 12, 16];
const groups = edges.slice(0, -1).map((low, i) => ({
  low,
  high: edges[i + 1],
  values: speeds.filter((v) => v >= low && v < edges[i + 1]),
}));
export function Buckets() {
  const [state, update] = usePageState({ show: false });
  return (
    <Page
      title="把分组数量，变成柱高"
      label="HISTOGRAM · 从分组到直方图"
      footer={
        <>
          <p>9 个观测，每组宽 4 m/s；区间左含右不含，例如 8 归入 8–12。</p>
          <button
            className={s.action}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '重新分组' : '查看分组与图形'}
          </button>
        </>
      }
    >
      <p className={s.speedStrip}>速度 / m/s：{speeds.join('、')}</p>
      <div className={s.groupGrid}>
        <div className={s.groupList}>
          <section className={s.histogramConcept} aria-label="直方图概念">
            <h3>
              直方图 <span lang="en">Histogram</span>
            </h3>
            <p>
              把数值分成<b>区间</b>，用相邻柱子的<b>高度</b>表示各组数量。
            </p>
            <div className={s.histogramAxes}>
              <span>
                <b>横轴</b> · 数值区间
              </span>
              <span>
                <b>纵轴</b> · 个体数量
              </span>
            </div>
          </section>
          {groups.map((group) => (
            <div className={s.groupRow} key={group.low}>
              <strong>
                {group.low}–{group.high}
                <span>m/s</span>
              </strong>
              <div className={s.tokens}>
                {state.show ? (
                  group.values.length ? (
                    group.values.map((v, i) => <span key={i}>{v}</span>)
                  ) : (
                    <p>没有个体</p>
                  )
                ) : (
                  <p>哪些数在这个区间？</p>
                )}
              </div>
              <b>
                {state.show ? group.values.length : '?'}
                <span>只</span>
              </b>
            </div>
          ))}
          <div className={s.groupReminder}>
            <Guide>每个速度只进入一组。分完后，三组数量加起来还是 9。</Guide>
          </div>
        </div>
        <div className={s.groupChart}>
          <div className={s.chartHeading}>
            <strong>
              {state.show ? '这就是直方图' : '先猜：哪组的柱子最高？'}
            </strong>
            <span>柱高 = 这个区间的个体数</span>
          </div>
          <div
            className={s.miniHistogram}
            aria-label={
              state.show
                ? '速度直方图，4至8为4只，8至12为5只，12至16为0只'
                : '直方图待揭晓，先按区间分组'
            }
          >
            <span className={s.yAxis}>数量 / 只</span>
            <div className={s.bars}>
              {groups.map((group) => (
                <div className={s.barSlot} key={group.low}>
                  <div
                    className={`${s.bar} ${state.show ? '' : s.pendingBar}`}
                    style={{
                      height: state.show
                        ? `${group.values.length * 16}%`
                        : '55%',
                    }}
                  >
                    {(!state.show || group.values.length > 0) && (
                      <strong>{state.show ? group.values.length : '?'}</strong>
                    )}
                  </div>
                  {state.show && group.values.length === 0 && (
                    <strong className={s.zeroCount}>0</strong>
                  )}
                </div>
              ))}
            </div>
            <div className={s.boundaries}>
              {edges.map((v, i) => (
                <span key={v} style={{ left: `${(i / 3) * 100}%` }}>
                  {v}
                </span>
              ))}
            </div>
            <span className={s.xAxis}>速度 / m/s</span>
          </div>
          <p className={s.chartDefinition}>
            直方图把连续数值分成区间，用相邻的柱子呈现各组数量，帮助我们看清分布。
          </p>
        </div>
      </div>
    </Page>
  );
}

export function NormalScene() {
  return (
    <Page
      title="统计学中的神奇规律"
      label="NORMAL DISTRIBUTION · 正态分布"
      footer={
        <p>
          图中是形状示意。实际数据可能不对称、有多个峰，不能一律当作正态分布。
        </p>
      }
    >
      <div className={s.normalGrid}>
        <div className={s.normalChart}>
          <strong>同年龄人群的身高 · 形状示意</strong>
          <Plot label="身高分布形状示意，中间人数多，两头人数少，平滑曲线呈钟形">
            {(b) => {
              const x = (v: number) =>
                b.left + ((v - 100) / 100) * (b.right - b.left);
              const y = (v: number) => b.bottom - (v / 24) * (b.bottom - b.top);
              const count = (v: number) =>
                20 * Math.exp(-0.5 * ((v - 150) / 15) ** 2);
              const curve = Array.from(
                { length: 101 },
                (_, i) =>
                  `${i === 0 ? 'M' : 'L'}${x(100 + i)} ${y(count(100 + i))}`,
              ).join(' ');
              return (
                <g fill="#071a3d">
                  {[0, 10, 20].map((v) => (
                    <g key={v}>
                      <line
                        x1={b.left}
                        x2={b.right}
                        y1={y(v)}
                        y2={y(v)}
                        stroke="#d5dfed"
                      />
                      <text x={b.left - 10} y={y(v) + 6} textAnchor="end">
                        {v}
                      </text>
                    </g>
                  ))}
                  {Array.from({ length: 10 }, (_, i) => (
                    <rect
                      key={i}
                      x={x(100 + i * 10) + 1}
                      y={y(count(105 + i * 10))}
                      width={x(110 + i * 10) - x(100 + i * 10) - 2}
                      height={b.bottom - y(count(105 + i * 10))}
                      fill="#a7bce7"
                    />
                  ))}
                  <path
                    d={`M${b.left} ${b.top}V${b.bottom}H${b.right}`}
                    fill="none"
                    stroke="#071a3d"
                    strokeWidth="2"
                  />
                  <path
                    d={curve}
                    fill="none"
                    stroke="#1457d9"
                    strokeWidth="4"
                  />
                  <line
                    x1={x(150)}
                    x2={x(150)}
                    y1={y(20)}
                    y2={b.bottom}
                    stroke="#d45030"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  {[110, 130, 150, 170, 190].map((v) => (
                    <text
                      key={v}
                      x={x(v)}
                      y={b.bottom + 26}
                      textAnchor="middle"
                    >
                      {v}
                    </text>
                  ))}
                  <text x={b.left} y={b.top - 10}>
                    人数（示意）
                  </text>
                  <text
                    x={(b.left + b.right) / 2}
                    y={b.bottom + 54}
                    textAnchor="middle"
                  >
                    身高 / cm
                  </text>
                  <text x={x(150)} y={y(20) - 12} textAnchor="middle">
                    中心附近最多
                  </text>
                </g>
              );
            }}
          </Plot>
        </div>
        <div className={s.normalText}>
          <h3>为什么像一口钟？</h3>
          <p>
            <b>中间多</b>
            <span>多数人的身高在中心附近。</span>
          </p>
          <p>
            <b>两头少</b>
            <span>特别矮或特别高的人较少。</span>
          </p>
          <p>
            <b>大致对称</b>
            <span>中心左右的形状相近。</span>
          </p>
          <Guide>
            许多自然现象都近似服从正态分布，如人的身高、体重、智商，多神奇啊！
          </Guide>
        </div>
      </div>
    </Page>
  );
}

export function Setup() {
  return (
    <Page
      title="请来绘图的帮手"
      label="PYTHON LAB · 开始前"
      footer={<CodeTools code={SETUP_CODE} label="查看并复制准备代码" />}
    >
      <div className={s.setupGrid}>
        <div className={s.setupCode}>
          <NotebookPanel
            compact
            title="第五课练习.ipynb"
            cells={[{ code: SETUP_CODE, activeLines: [1, 2] }]}
          />
          <p>pandas → pd：读取表格，上一课的老朋友。</p>
          <Guide>
            先运行笔记本的环境准备。重新启动内核后，要重新导入模块、读取数据。
          </Guide>
        </div>
        <div className={s.libraries}>
          <a
            className={s.library}
            href="https://seaborn.pydata.org/"
            target="_blank"
            rel="noreferrer"
            aria-label="seaborn 官方网站"
          >
            <img
              src={`${assetBase}/assets/official/seaborn-logo.svg`}
              alt="seaborn 官方标志"
            />
            <strong>seaborn → sns</strong>
            <p>指定表格与字段，快速画出统计图。</p>
            <code>{'sns.histplot(data=demons, x="speed")'}</code>
          </a>
          <a
            className={s.library}
            href="https://matplotlib.org/stable/tutorials/pyplot.html"
            target="_blank"
            rel="noreferrer"
            aria-label="Matplotlib pyplot 官方教程"
          >
            <img
              src={`${assetBase}/assets/official/matplotlib-logo.svg`}
              alt="Matplotlib 官方标志"
            />
            <strong>Matplotlib 的 pyplot → plt</strong>
            <p>补充坐标名称，展示图表。</p>
            <code>plt.xlabel(...) · plt.show()</code>
          </a>
          <p className={s.setupNote}>
            解压后从 JupyterLab 打开笔记本；CSV 与笔记本放在同一文件夹。
          </p>
        </div>
      </div>
    </Page>
  );
}
