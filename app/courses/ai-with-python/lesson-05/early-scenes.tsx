/* oxlint-disable next/no-img-element -- Local course illustrations and official library logos. */
'use client';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { Page, Guide, CodeTools } from './lesson-ui';
import { Plot } from './charts';
import { demons } from './study-data';
import { SETUP_CODE } from './practice-content';
import { assetBase } from './lesson-data';
import s from './early-scenes.module.css';

const speeds = demons.slice(0, 9).map((d) => d.speed);
const ordered = [...speeds].sort((a, b) => a - b);
const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
const slowest = ordered[0];
const fastest = ordered[ordered.length - 1];
const speedRange = (fastest - slowest).toFixed(1);

export function NumericStory() {
  return (
    <Page title="先看平均速度，再看快慢差距" label="SPEED DATA · 概括一列速度">
      <div className={s.numericGrid}>
        <figure className={s.comic}>
          <img
            src={`${assetBase}/assets/numeric-features.jpg`}
            alt="小派、勇士与熊猫博士比较恶魔观测卡片上的速度数值"
          />
          <figcaption className={s.comicSpeech} aria-label="小派说">
            先看整体水平和快慢差距，
            <br />
            再分组找出数量最多的速度范围！
          </figcaption>
        </figure>
        <div className={s.explanation}>
          <div className={s.sample}>
            <strong>从 90 只中先取前 9 只 · 速度从小到大 / m/s</strong>
            <p>{ordered.join('、')}</p>
          </div>
          <div className={s.statisticsSections}>
            <section className={s.statSection}>
              <header className={s.statHeader}>
                <h3>① 整体跑得多快？</h3>
                <span>集中趋势</span>
              </header>
              <p className={s.statFeatured}>
                <strong>平均速度 ≈ {mean.toFixed(1)} m/s</strong>
                <span>速度总和 ÷ 9，概括这 9 只的整体水平。</span>
              </p>
              <dl className={s.secondaryStats}>
                <div>
                  <dt>中位数 {ordered[4]}</dt>
                  <dd>从小到大排好队后，中间的数。</dd>
                </div>
                <div>
                  <dt>众数 9.6</dt>
                  <dd>出现次数最多，这里出现 2 次。</dd>
                </div>
              </dl>
            </section>
            <section className={s.statSection}>
              <header className={s.statHeader}>
                <h3>② 最快和最慢差多少？</h3>
                <span>离散程度</span>
              </header>
              <p className={s.statFeatured}>
                <strong>
                  极差 = {fastest} − {slowest} = {speedRange} m/s
                </strong>
                <span>
                  最快 {fastest}、最慢 {slowest} m/s，两者相减得到快慢差距。
                </span>
              </p>
              <dl className={s.secondaryStats}>
                <div>
                  <dt>标准差</dt>
                  <dd>描述各个数值偏离平均数的程度。</dd>
                </div>
              </dl>
            </section>
          </div>
        </div>
      </div>
    </Page>
  );
}

const edges = [4, 8, 12, 16];
const groups = edges.slice(0, -1).map((low, i) => ({
  low,
  high: edges[i + 1],
  values: ordered.filter((v) => v >= low && v < edges[i + 1]),
}));
const largestGroup = groups.reduce((largest, group) =>
  group.values.length > largest.values.length ? group : largest,
);
const groupCounts = groups
  .map((group) => `${group.low}至${group.high}为${group.values.length}只`)
  .join('，');

export function Buckets() {
  const [state, update] = usePageState({ show: false });
  return (
    <Page
      title="直方图：看清数值的分布"
      label="CHART 01 · 今天学习的第一个图表"
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
      <p className={s.speedStrip}>
        沿用刚才这 9 个速度 / m/s：{ordered.join('、')}
      </p>
      <div className={s.groupGrid}>
        <div className={s.groupList}>
          <section className={s.histogramConcept} aria-label="直方图概念">
            <h3>
              直方图 <span lang="en">Histogram</span>
            </h3>
            <p>
              速度按<b>等宽区间</b>分组，柱子的<b>高度</b>表示每组数量。
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
            <div
              className={`${s.groupRow} ${state.show && group.low === largestGroup.low ? s.peakGroup : ''}`}
              key={group.low}
            >
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
          <div
            className={s.groupTotal}
            aria-label="每只只计入一组，分组后仍是9只"
          >
            <strong>
              {state.show
                ? groups.map((group) => group.values.length).join(' + ')
                : '? + ? + ?'}
              {' = '}
              {speeds.length} 只
            </strong>
            <span>每只只计入一组</span>
          </div>
        </div>
        <div className={s.groupChart}>
          <div className={s.chartHeading}>
            <strong>这 {speeds.length} 只的速度分布</strong>
            <span>比柱高：哪个区间最多？哪里没有？</span>
          </div>
          <div
            className={s.miniHistogram}
            aria-label={
              state.show
                ? `速度直方图，${groupCounts}`
                : '直方图待揭晓，先按区间分组'
            }
          >
            <span className={s.yAxis}>数量 / 只</span>
            <div className={s.bars}>
              {groups.map((group) => (
                <div className={s.barSlot} key={group.low}>
                  <div
                    className={`${s.bar} ${state.show ? (group.low === largestGroup.low ? s.peakBar : '') : s.pendingBar}`}
                    style={{
                      height: state.show
                        ? `${group.values.length * 16}%`
                        : '55%',
                    }}
                  >
                    {(!state.show || group.values.length > 0) && (
                      <div className={s.barLabel}>
                        <strong>
                          {state.show ? `${group.values.length}只` : '?'}
                        </strong>
                        {state.show && group.low === largestGroup.low && (
                          <span>最多</span>
                        )}
                      </div>
                    )}
                  </div>
                  {state.show && group.values.length === 0 && (
                    <div className={s.zeroCount}>
                      <strong>0只</strong>
                      <span>没有</span>
                    </div>
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
          <div className={s.histogramConclusion}>
            {state.show ? (
              <>
                <p>
                  {largestGroup.values.length > speeds.length / 2
                    ? '超过一半在'
                    : '最多的是'}{' '}
                  <b>
                    {largestGroup.low}–{largestGroup.high} m/s
                  </b>
                </p>
                <div className={s.shareEvidence}>
                  <div className={s.shareDots} aria-hidden="true">
                    {Array.from({ length: speeds.length }, (_, i) => (
                      <span
                        key={i}
                        className={
                          i < largestGroup.values.length ? s.peakDot : ''
                        }
                      />
                    ))}
                  </div>
                  <strong>
                    {largestGroup.values.length} / {speeds.length} 只
                  </strong>
                </div>
              </>
            ) : (
              <p>先分组、再比柱高：看清哪里多、哪里少、哪里没有。</p>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

export function NormalScene() {
  const [state, update] = usePageState({ show: false });
  return (
    <Page
      title="直方图的轮廓，像什么？"
      label="OBSERVE · 从直方图看形状"
      footer={
        <>
          <p>
            {state.show
              ? '形状示意；实际数据未必对称，也可能有多个峰。'
              : '沿用直方图：柱子越高，这个身高区间的人越多。'}
          </p>
          <button
            className={s.action}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '重新观察' : '描出轮廓，认识分布'}
          </button>
        </>
      }
    >
      <div className={s.normalGrid}>
        <div className={s.normalChart}>
          <strong>换看一组身高直方图 · 形状示意</strong>
          <Plot
            label={
              state.show
                ? '身高直方图及钟形轮廓示意：中间多、两头少、左右对称'
                : '一组身高直方图形状示意，请观察柱高和左右的形状'
            }
          >
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
                      y={y(Math.round(count(105 + i * 10)))}
                      width={x(110 + i * 10) - x(100 + i * 10) - 2}
                      height={b.bottom - y(Math.round(count(105 + i * 10)))}
                      fill={
                        state.show
                          ? i === 4 || i === 5
                            ? '#ffc91c'
                            : '#a7bce7'
                          : '#1457d9'
                      }
                    />
                  ))}
                  <path
                    d={`M${b.left} ${b.top}V${b.bottom}H${b.right}`}
                    fill="none"
                    stroke="#071a3d"
                    strokeWidth="2"
                  />
                  {state.show && (
                    <g>
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
                        stroke="#071a3d"
                        strokeWidth="2"
                        strokeDasharray="6 5"
                      />
                      <text x={x(150)} y={y(20) - 14} textAnchor="middle">
                        中间多
                      </text>
                      {[110, 190].map((v) => (
                        <text key={v} x={x(v)} y={y(4)} textAnchor="middle">
                          少
                        </text>
                      ))}
                    </g>
                  )}
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
                </g>
              );
            }}
          </Plot>
        </div>
        <div className={s.normalText}>
          <ol className={s.normalSteps} aria-label="从观察到概念">
            <li aria-current={!state.show ? 'step' : undefined}>01 看柱子</li>
            <li aria-current={state.show ? 'step' : undefined}>02 认形状</li>
          </ol>
          <h3 className={s.normalQuestionTitle}>这组柱子，像什么？</h3>
          {state.show ? (
            <>
              <div className={s.normalConcept}>
                <h3>正态分布</h3>
                <span lang="en">Normal distribution</span>
                <p>一种左右对称的钟形分布。</p>
              </div>
              <div className={s.normalClues} aria-label="图形特点">
                <span>中间多</span>
                <span>两头少</span>
                <span>左右对称</span>
              </div>
              <p className={s.normalNext}>回到恶魔军团：速度分布也像这样吗？</p>
            </>
          ) : (
            <div className={s.normalQuestions}>
              <span>上一页数数量，这一页看形状</span>
              <p>
                <b>①</b> 哪一段的柱子最高？
              </p>
              <p>
                <b>②</b> 两端的柱子怎么样？
              </p>
              <p>
                <b>③</b> 左右的形状像不像？
              </p>
            </div>
          )}
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
      tools={<CodeTools code={SETUP_CODE} label="查看并复制准备代码" />}
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
