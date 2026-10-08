/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { useContext, useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Download, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  Page,
  Guide,
  Tabs,
  Art,
  Story,
  CodeTools,
  CodeLesson,
} from './lesson-ui';
import {
  ComparisonBars,
  Histogram,
  Scatter,
  LineChart,
  KindBars,
} from './charts';
import { PenguinIntro, PenguinLab, PenguinReport } from './penguin-challenge';
import { demons, demonKinds, patrol, demonHistograms } from './study-data';
import { Warmup } from './warmup-scene';
import { NumericStory, Buckets, NormalScene, Setup } from './early-scenes';
import {
  ChartConcept,
  BarStory,
  KindBarScene,
  MoreFeaturesScene,
  GroupedChartsScene,
  ChartPractice,
  ChartPracticeResults,
} from './second-section-scenes';
import c from './second-section.module.css';
import {
  SETUP_CODE,
  COMPLETE_CODE,
  BAR_CODE,
  HIST_CODE,
  HIST_AXIS_LABELS,
  SCATTER_CODE,
  SCATTER_AXIS_LABELS,
  HUE_CODE,
  LINE_CODE,
  LINE_AXIS_LABELS,
  KIND_BAR_CODE,
  KIND_BAR_FULL_CODE,
  KIND_BAR_AXIS_LABELS,
} from './practice-content';
import { assetBase, chapters } from './lesson-data';
import s from './lesson.module.css';

const full = (code: string) => `${SETUP_CODE}\n\n${code}`;
function Cover() {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ recap: false });
  return (
    <div className={s.cover} data-lesson-cover>
      <div className={s.coverIntro}>
        <span>
          AI WITH PYTHON
          <br />
          LESSON 05
        </span>
        <h1>
          勇闯
          <br />
          <em>图表世界</em>
        </h1>
        <strong>恶魔军团图鉴</strong>
        <p>
          用图表摸清恶魔特点，
          <br />
          为最终决战做好准备。
        </p>
        <button className={s.button} onClick={() => navigate('l5-mission')}>
          开始战前侦察 <ArrowRight size={24} />
        </button>
      </div>
      <figure className={s.coverArt}>
        <span className={s.coverLabel}>
          {state.recap ? '前情回顾 · 第四课' : '本课故事 · 决战前的侦察'}
        </span>
        <img
          className={s.art}
          src={
            state.recap
              ? '/courses/ai-with-python/lesson-04/assets/lesson-04-opening.png'
              : `${assetBase}/assets/opening.png`
          }
          alt={
            state.recap
              ? '第四课勇士与小派收集战报，调查恶魔首领的漫画'
              : '勇士、小派与熊猫博士查看恶魔个体档案，为最终决战准备侦察图鉴'
          }
        />
        <figcaption>
          {state.recap
            ? '我们分析战报、核对证据，最终揭开魔王的伪装。'
            : '魔王已经现身，决战在即！看清恶魔的体型与速度，为勇士备好图鉴。'}
        </figcaption>
        <nav>
          <button
            className={s.button}
            disabled={state.recap}
            onClick={() => update({ recap: true })}
          >
            <ArrowLeft size={20} />
            回顾第四课
          </button>
          <button
            className={s.button}
            disabled={!state.recap}
            onClick={() => update({ recap: false })}
          >
            本课故事
            <ArrowRight size={20} />
          </button>
        </nav>
      </figure>
    </div>
  );
}
function Compare() {
  const [state, update] = usePageState({ show: false });
  return (
    <Page
      title="同一份数据，两种看法"
      label="BAR CHART · 条形图"
      footer={
        <>
          <p>每根柱子对应一个个体，柱高表示身高。</p>
          <CodeTools code={full(BAR_CODE)} label="条形图代码" />
        </>
      }
    >
      <div className={s.grid}>
        <div className={s.column}>
          <table className={`${s.table} ${s.comparisonTable}`}>
            <caption>新侦察档案 · 前 5 个个体</caption>
            <thead>
              <tr>
                <th>个体编号</th>
                <th>身高 / cm</th>
              </tr>
            </thead>
            <tbody>
              {demons.slice(0, 5).map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.height}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Guide>熊猫博士已把记录整理成表格。哪只最高？哪两只比较接近？</Guide>
          <button
            className={s.button}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '收起图表，重新观察' : '把这五行画成图'}
          </button>
        </div>
        <div
          className={`${s.chartPanel} ${state.show ? '' : s.comparisonArtPanel}`}
        >
          {state.show ? (
            <ComparisonBars />
          ) : (
            <img
              className={s.comparisonArt}
              data-comparison-art
              src={`${assetBase}/assets/compare-heights.png`}
              width={1254}
              height={1254}
              alt="勇士、小派和熊猫博士观察同一基线上的五只恶魔，依次对应 D001 至 D005，比较身高差异"
            />
          )}
        </div>
      </div>
    </Page>
  );
}
function Archive() {
  const examples = [demons[0], demons[3]];
  const difference = examples[1].height - examples[0].height;
  const average = (examples[0].height + examples[1].height) / 2;
  return (
    <Page
      title="一行是一只恶魔"
      label="NEW EVIDENCE · 个体观测档案"
      footer={
        <p>这是新获得的个体观测记录。第四课的整场进攻威胁值，不是个体属性。</p>
      }
    >
      <div className={s.grid}>
        <div className={s.column}>
          <Art />
          <p className={s.note}>
            三类恶魔，各观测 30 个个体，共 90 行。不同个体使用不同编号。
          </p>
        </div>
        <div className={s.column}>
          <div className={`${s.fields} ${s.archiveFields}`}>
            <div className={s.field}>
              <strong>身高 height</strong>
              <span>cm · 站立时脚底到头顶</span>
            </div>
            <div className={s.field}>
              <strong>速度 speed</strong>
              <span>m/s · 同条件短距离移动</span>
            </div>
            <div className={s.field}>
              <strong>体重 mass</strong>
              <span>kg · 同一口径称量</span>
            </div>
            <div className={s.field}>
              <strong>种类 kind</strong>
              <span>炎角兽族 / 藤甲魔族 / 冰翼魔族</span>
            </div>
          </div>
          <section
            className={s.numericEvidence}
            aria-label="数值数据的测量、比较与计算"
          >
            <h3>数值数据：量一量，比一比</h3>
            <div className={s.measurementExample}>
              <figure className={s.measurementOrigin}>
                <img
                  src="/courses/ai-with-python/lesson-04/assets/data-types/height.png"
                  alt="沿用第四课的身高测量图示：人站在尺子旁测量身高"
                />
                <figcaption>
                  上一课量同学
                  <br />
                  这一课量恶魔
                </figcaption>
              </figure>
              <figure
                className={s.heightEvidence}
                aria-label="D001 身高180厘米，D004 身高205厘米，同一单位下比较身高"
              >
                {examples.map((d, i) => (
                  <div className={s.heightColumn} key={d.id}>
                    <strong>
                      {d.height}
                      <span> cm</span>
                    </strong>
                    <div className={s.heightTrack}>
                      <div
                        className={s.heightFill}
                        style={{
                          height: `${(d.height / examples[1].height) * 100}%`,
                          background: i === 0 ? '#1457d9' : '#b77a00',
                        }}
                      />
                    </div>
                    <span>{d.id}</span>
                  </div>
                ))}
              </figure>
            </div>
            <div className={s.numericCalculations}>
              <div>
                <strong>可比较 · 高多少？</strong>
                <p>
                  {examples[1].height} − {examples[0].height} ={' '}
                  <b>{difference} cm</b>
                </p>
              </div>
              <div>
                <strong>可运算 · 求平均</strong>
                <p>
                  ({examples[0].height} + {examples[1].height}) ÷ 2 ={' '}
                  <b>{average} cm</b>
                </p>
              </div>
            </div>
            <p className={s.numericUnitNote}>
              先统一单位；种类和编号是标签，不拿来求平均。
            </p>
          </section>
        </div>
      </div>
    </Page>
  );
}
function HistogramScene() {
  const [state, update] = usePageState({ field: 0 });
  return (
    <Page
      title="柱子里藏着多少个体？"
      label="HISTOGRAM · 直方图"
      footer={<p>横轴是连续数值区间，纵轴是个体数量；这里每个区间等宽。</p>}
    >
      <Tabs
        items={['速度分布', '身高分布']}
        value={state.field}
        onChange={(field) => update({ field })}
      />
      <div className={s.grid}>
        <div className={s.column}>
          <img
            className={s.miniArt}
            src={`${assetBase}/assets/fieldwork.png`}
            alt="勇士与小派观察恶魔的体型和移动"
          />
          <p>观察全部 90 个个体：最高的柱子对应哪个区间？两端的个体多不多？</p>
          <Guide>柱子的高度表示数量。它不表示某一只恶魔有多高、跑多快。</Guide>
        </div>
        <div className={s.chartPanel}>
          <Histogram field={state.field === 0 ? 'speed' : 'height'} />
        </div>
      </div>
    </Page>
  );
}
function Guess() {
  const [state, update] = usePageState({ answer: '' });
  return (
    <Page title="个头越大，跑得越慢？" label="MAKE A GUESS · 提出猜想">
      <div className={s.storyGrid}>
        <Art />
        <div className={s.storyText}>
          <span className={s.tag}>勇士的猜想</span>
          <blockquote>“大块头看起来很笨重，速度应该都很慢吧？”</blockquote>
          <div className={s.choices}>
            {['我猜是', '不一定', '需要更多记录'].map((answer) => (
              <button
                key={answer}
                aria-pressed={state.answer === answer}
                onClick={() => update({ answer })}
              >
                {answer}
              </button>
            ))}
          </div>
          <div className={s.question}>
            <p>
              {state.answer
                ? `保留你的猜想“${state.answer}”。下一步同时观察每只恶魔的身高和速度。`
                : '先说出猜想，再考虑：需要看哪两列来检验？'}
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
function Point() {
  const [state, update] = usePageState({ selected: 0 });
  const row = demons[state.selected];
  return (
    <Page
      title="一行记录，变成一个点"
      label="SCATTER · 认识坐标"
      footer={<p>横轴先找到身高，纵轴再找到速度；交会处就是这个个体的位置。</p>}
    >
      <Tabs
        items={demons.slice(0, 3).map((d) => d.id)}
        value={state.selected}
        onChange={(selected) => update({ selected })}
        label="选择观测个体"
      />
      <div className={s.grid}>
        <div className={s.column}>
          <table className={s.table}>
            <caption>正在观察 {row.id}</caption>
            <thead>
              <tr>
                <th>身高 / cm</th>
                <th>速度 / m/s</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{row.height}</td>
                <td>{row.speed}</td>
              </tr>
            </tbody>
          </table>
          <div className={s.question}>
            <span>这个点的位置</span>
            <p>
              向右找到 {row.height} cm
              <br />
              向上找到 {row.speed} m/s
            </p>
          </div>
          <Guide>
            一个点同时表达两个数。点越靠右，身高越大；点越靠上，速度越快。
          </Guide>
        </div>
        <div className={s.chartPanel}>
          <SinglePoint height={row.height} speed={row.speed} id={row.id} />
        </div>
      </div>
    </Page>
  );
}
function SinglePoint({
  height,
  speed,
  id,
}: {
  height: number;
  speed: number;
  id: string;
}) {
  // Percent positions keep labels as HTML at readable pixel sizes.
  const left = ((height - 50) / 200) * 100;
  const bottom = (speed / 15) * 100;
  return (
    <div className={s.pointPlot}>
      <span className={s.pointY}>速度 / m/s</span>
      <div className={s.pointArea}>
        <span className={s.pointTop}>15</span>
        <span className={s.pointZero}>0</span>
        <div className={s.crossX} style={{ bottom: `${bottom}%` }} />
        <div className={s.crossY} style={{ left: `${left}%` }} />
        <span
          className={s.pointDot}
          style={{ left: `${left}%`, bottom: `${bottom}%` }}
        />
        <strong
          className={s.pointLabel}
          style={{ left: `${Math.min(left, 80)}%`, bottom: `${bottom + 5}%` }}
        >
          {id}
        </strong>
        <span className={s.pointLeft}>50</span>
        <span className={s.pointRight}>250</span>
        <span className={s.valueX} style={{ left: `${left}%` }}>
          {height}
        </span>
        <span className={s.valueY} style={{ bottom: `${bottom}%` }}>
          {speed}
        </span>
      </div>
      <span className={s.pointX}>身高 / cm</span>
    </div>
  );
}
function ScatterScene() {
  const [state, update] = usePageState({ show: false });
  const special = demons.find((d) => d.id === 'D004')!;
  return (
    <Page
      title="把所有个体放在一起"
      label="SCATTER · 检验猜想"
      footer={
        <>
          <p>可点选图中的个体，核对它的实际记录。</p>
          <button
            className={s.button}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '收起观察提示' : '寻找一个例外'}
          </button>
        </>
      }
    >
      <div className={s.grid}>
        <div className={`${s.column} ${c.conceptColumn}`}>
          <ChartConcept type="scatter" />
          <p className={c.prompt}>
            先看整体，再找例外：有没有又高、又快的个体？
          </p>
          <Guide>
            看到一些点有共同方向，可以描述趋势。但“通常如此”不等于“每个都如此”。
          </Guide>
          {state.show && (
            <p className={c.reveal}>
              D004 身高 {special.height} cm，速度 {special.speed}{' '}
              m/s。它提醒我们：高个体也可能跑得快。
            </p>
          )}
        </div>
        <div className={s.chartPanel}>
          <Scatter interactive />
        </div>
      </div>
    </Page>
  );
}
function LineScene() {
  const [state, update] = usePageState({ show: false });
  const maximum = patrol.reduce((a, b) => (a.speed > b.speed ? a : b));
  return (
    <Page
      title="沿着时间看变化"
      label="LINE · 折线图"
      footer={
        <>
          <p>同一个体 D001，每 2 小时一次，共 6 次观测。</p>
          <button
            className={s.button}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '收起结果' : '核对最高观测值'}
          </button>
        </>
      }
    >
      <div className={s.grid}>
        <div className={`${s.column} ${c.conceptColumn}`}>
          <ChartConcept type="line" />
          <p className={c.prompt}>先猜哪个时刻最快，再沿着折线核对。</p>
          <Guide>
            连接相邻观测时刻，看清变化。未测量时刻的精确速度、之后的表现，都还不能确定。
          </Guide>
          {state.show && (
            <p className={c.reveal}>
              记录中，{maximum.hour}:00 的速度最高，为 {maximum.speed} m/s。
            </p>
          )}
        </div>
        <div className={s.chartPanel}>
          <LineChart />
        </div>
      </div>
    </Page>
  );
}
const quiz = [
  {
    q: '比较前 5 个恶魔的身高，谁更高？',
    a: '条形图',
    why: '横轴是不同个体，柱高表示各自的身高。',
  },
  {
    q: '90 个恶魔的速度，主要集中在哪个区间？',
    a: '直方图',
    why: '先把速度按区间分组，再看各区间的个体数量。',
  },
  {
    q: '身高和速度有没有联系？',
    a: '散点图',
    why: '每个点同时表达一个个体的身高与速度。',
  },
  {
    q: 'D001 从上午到傍晚，速度怎样变化？',
    a: '折线图',
    why: '沿时间顺序连接同一个体的观测值，观察变化。',
  },
];
const quizChoices = [
  { name: '条形图', english: 'Bar Chart' },
  { name: '直方图', english: 'Histogram' },
  { name: '散点图', english: 'Scatter Plot' },
  { name: '折线图', english: 'Line Chart' },
];
function Choose() {
  const [state, update] = usePageState({
    question: 0,
    answers: ['', '', '', ''],
    revealed: [false, false, false, false],
  });
  const i = state.question;
  const q = quiz[i];
  return (
    <Page title="先看问题，再选图表" label="CHART CHOICE · 图表判断">
      <div className={s.quizBody}>
        <div className={s.quizLeft}>
          <Tabs
            items={['比较', '分布', '关系', '变化']}
            value={i}
            label="选择判断题"
            onChange={(question) => update({ question })}
          />
          <div className={s.quizTask}>
            <div className={s.quizQuestion}>
              <span className={s.quizNumber}>问题 {i + 1} / 4</span>
              <p className={s.quizPrompt}>{q.q}</p>
            </div>
            <fieldset className={s.quizChoices} aria-label="选择图表">
              {quizChoices.map(({ name, english }, index) => (
                <button
                  key={name}
                  aria-label={name}
                  aria-pressed={state.answers[i] === name}
                  onClick={() => {
                    const answers = [...state.answers];
                    answers[i] = name;
                    const revealed = [...state.revealed];
                    revealed[i] = false;
                    update({ answers, revealed });
                  }}
                >
                  <span className={s.quizOptionLetter} aria-hidden="true">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={s.quizOptionText}>
                    <strong>{name}</strong>
                    <span>{english}</span>
                  </span>
                  {state.answers[i] === name && (
                    <Check className={s.quizOptionCheck} aria-hidden="true" />
                  )}
                </button>
              ))}
            </fieldset>
          </div>
          <div className={s.quizCheck}>
            <p aria-live="polite">
              {state.answers[i]
                ? `已选：${state.answers[i]}`
                : '先选择一种图表'}
            </p>
            <button
              className={s.button}
              disabled={!state.answers[i]}
              onClick={() => {
                const revealed = [...state.revealed];
                revealed[i] = true;
                update({ revealed });
              }}
            >
              核对理由 <ArrowRight size={22} aria-hidden="true" />
            </button>
          </div>
          <p className={s.quizHint}>先说说选择的理由，再看右侧图表。</p>
        </div>
        <div className={s.column}>
          {state.revealed[i] ? (
            <>
              <div className={s.feedback}>
                <strong>
                  {state.answers[i] === q.a
                    ? '选择合适。'
                    : '再想一想，推荐用' + q.a + '。'}
                </strong>
                <p>
                  你的选择：{state.answers[i]}。{q.why}
                </p>
              </div>
              <div className={s.chartPanel}>
                {i === 0 ? (
                  <ComparisonBars />
                ) : i === 1 ? (
                  <Histogram field="speed" />
                ) : i === 2 ? (
                  <Scatter interactive={false} />
                ) : (
                  <LineChart />
                )}
              </div>
            </>
          ) : (
            <>
              <Art kind="discovery" />
              <p className={s.note}>先说明你想比较什么，再决定怎样展示。</p>
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
function Colors({ pairs = false }: { pairs?: boolean }) {
  const [state, update] = usePageState({ colored: false, pair: 0 });
  return (
    <Page
      title={pairs ? '换一组特征，会更清楚吗？' : '加上颜色，再看一次'}
      label="COLOR · 类别与图例"
      footer={
        <p>
          颜色对应已知种类。不同种类可以重叠，图上接近的点不一定属于同一类。
        </p>
      }
    >
      <div className={s.tabs}>
        {pairs && (
          <Tabs
            items={['身高 × 速度', '体重 × 速度']}
            value={state.pair}
            onChange={(pair) => update({ pair })}
          />
        )}
        <button
          aria-pressed={state.colored}
          onClick={() => update({ colored: !state.colored })}
        >
          {state.colored ? '隐藏类别颜色' : '按种类着色'}
        </button>
      </div>
      <div className={s.grid}>
        <div className={s.column}>
          <img
            className={s.miniArt}
            src={`${assetBase}/assets/discovery.png`}
            alt="小派和勇士研究有类别颜色的散点图"
          />
          <p>
            {pairs
              ? '哪组特征更容易看出类别差异？哪些区域仍然重叠？'
              : '刚才聚在一起的点，真的属于同一种恶魔吗？先猜，再打开颜色。'}
          </p>
          <Guide>
            {pairs
              ? '一组特征看不清，就换一组。但需要保留图里不确定的地方。'
              : '先读图例，再找对应颜色。加入种类这一列，能帮助我们解释点群。'}
          </Guide>
        </div>
        <div className={s.chartPanel}>
          <Scatter
            colored={state.colored}
            xField={state.pair === 1 ? 'mass' : 'height'}
            interactive
          />
        </div>
      </div>
    </Page>
  );
}
function SpeedClueComic() {
  const [open, setOpen] = useState(false);
  const src = `${assetBase}/assets/speed-clue.png`;
  const alt =
    '勇士举起恶魔速度分布图，握拳露出坚定笑容，小派指向图中的线索，远处城堡呼应最终决战';
  return (
    <>
      <button
        className={s.speedClueButton}
        data-lesson-art-button
        type="button"
        aria-label="放大漫画：勇士发现速度线索，对最终决战更有信心"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} />
        <span className={s.speedClueCaption}>
          <span>勇士：看清速度分布，决战更有底气！</span>
          <span className={s.speedClueZoom}>
            <ZoomIn size={20} aria-hidden="true" />
            放大
          </span>
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${s.modal} ${s.speedClueModal}`}>
          <DialogHeader>
            <DialogTitle>勇士的新线索</DialogTitle>
            <DialogDescription>
              看清了恶魔群体的速度分布，勇士对最终决战更有信心了。
            </DialogDescription>
          </DialogHeader>
          <img src={src} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  );
}
function SpeedPractice() {
  const [state, update] = usePageState({ reference: false });
  const bins = demonHistograms.speed;
  const peak = bins.reduce((a, b) => (a.count > b.count ? a : b));
  const middle = bins.slice(2, 6);
  const middleCount = middle.reduce((sum, bin) => sum + bin.count, 0);
  const code = full(HIST_CODE);
  return (
    <Page
      title="画出军团的速度分布"
      label="CLASS PRACTICE · 课堂练习 01"
      footer={
        <>
          <CodeTools code={code} label="完整跟写代码" />
          <button
            className={s.button}
            aria-expanded={state.reference}
            aria-controls="l5-speed-outcome"
            onClick={() => update({ reference: !state.reference })}
          >
            {state.reference ? '收起练习收获' : '完成跟写，查看收获'}
          </button>
        </>
      }
    >
      <div className={s.practiceGrid}>
        <div className={`${s.practiceCode} ${s.speedPracticeCode}`}>
          <p className={s.followInstructions}>
            先运行字体准备单元格，再亲手输入以下代码。
            <br />按 <strong>Shift+Enter</strong> 运行，核对右图。
          </p>
          <NotebookPanel compact title="第五课练习.ipynb" cells={[{ code }]}>
            <SpeedClueComic />
          </NotebookPanel>
        </div>
        <div className={s.column}>
          <div className={s.chartPanel}>
            <strong className={s.practicePlotLabel}>
              输出示例 · {demons.length} 只恶魔
            </strong>
            <Histogram field="speed" axisLabels={HIST_AXIS_LABELS} />
          </div>
          <div className={s.speedOutcome} id="l5-speed-outcome">
            <ClassPracticeStamp number="01" checklist />
            <div aria-live="polite">
              {state.reference ? (
                <>
                  <h3>收获：看清恶魔速度分布</h3>
                  <p>
                    {demons.length} 只中有 <b>{middleCount} 只</b>集中在约{' '}
                    {middle[0].low.toFixed(1)}–{middle.at(-1)!.high.toFixed(1)}{' '}
                    m/s，两端的个体较少。
                  </p>
                  <p className={s.peakEvidence}>
                    最高柱：约 {peak.low.toFixed(2)}–{peak.high.toFixed(2)}{' '}
                    m/s，
                    <b>共 {peak.count} 只</b>。
                  </p>
                </>
              ) : (
                <>
                  <h3>运行后，观察你的图</h3>
                  <p>哪个速度区间的恶魔最多？很慢、很快的恶魔多不多？</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
const dossierTask = {
  title: '完成你的恶魔图鉴',
  goal: '用图中的证据说明不同种类的特点。',
  steps: [
    '给散点图增加种类颜色，核对图例。',
    '选择一组特征，观察各类的位置与重叠。',
    '写一条发现，并指出还不能确定的地方。',
  ],
  code: HUE_CODE,
};
function PracticeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <Page title={dossierTask.title} label="CLASS PRACTICE · 课堂练习 03">
      <div className={s.practiceGrid}>
        <div className={s.practiceEntry}>
          <ClassPracticeStamp number="03" checklist />
          <h3>{dossierTask.goal}</h3>
          <ol>
            {dossierTask.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className={s.actions}>
            <button onClick={() => navigate('l5-practice-03-code')}>
              开始跟写
              <ArrowRight size={20} />
            </button>
            <a href={`${assetBase}/practice/lesson-05-practice.zip`} download>
              <Download size={20} />
              下载练习包
            </a>
          </div>
        </div>
        <div className={s.column}>
          <Art kind="discovery" />
          <p className={s.note}>
            打开 JupyterLab，运行环境准备单元格。用你运行得到的图核对结果。
          </p>
        </div>
      </div>
    </Page>
  );
}
function PracticeCode() {
  const [state, update] = usePageState({
    text: '',
    checked: false,
    reference: false,
  });
  return (
    <Page
      title="一张图，一条有依据的发现"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={<CodeTools code={full(dossierTask.code)} label="复制跟写代码" />}
    >
      <div className={s.steps}>
        <span className={s.active}>01 输入代码</span>
        <span>02 运行核对</span>
        <span>03 解释发现</span>
      </div>
      <div className={s.practiceGrid}>
        <div className={s.practiceCode}>
          <NotebookPanel
            compact
            title="第五课练习.ipynb"
            cells={[{ code: full(dossierTask.code) }]}
          />
        </div>
        <div className={s.column}>
          <label className={s.inputLabel}>
            我的发现
            <textarea
              value={state.text}
              onChange={(e) => update({ text: e.target.value })}
              placeholder="我观察到……，图中的依据是……"
              maxLength={240}
            />
          </label>
          <label className={s.check}>
            <input
              type="checkbox"
              checked={state.checked}
              onChange={(e) => update({ checked: e.target.checked })}
            />
            我已运行代码，并核对了坐标、单位与图例。
          </label>
          {state.reference ? (
            <p className={s.feedback}>
              比较炎角兽族与藤甲魔族的位置。交界处仍有重叠；类别特点不适用于每一只。
            </p>
          ) : (
            <Guide>
              不要只说“颜色不同”。请说清哪类个体在哪个区域，以及是否重叠。
            </Guide>
          )}
          <button
            className={s.button}
            onClick={() => update({ reference: !state.reference })}
          >
            {state.reference ? '收起参考观察' : '完成后查看参考观察'}
          </button>
        </div>
      </div>
    </Page>
  );
}
function Dossier() {
  const [state, update] = usePageState({ tab: 0 });
  const kind = demonKinds[state.tab];
  const rows = demons.filter((d) => d.kind === kind);
  const range = (f: 'height' | 'speed') =>
    `${Math.min(...rows.map((d) => d[f])).toFixed(1)}–${Math.max(...rows.map((d) => d[f])).toFixed(1)}`;
  return (
    <Page
      title="把图鉴交给勇士"
      label="MISSION COMPLETE · 侦察归档"
      footer={
        <p>
          图鉴描述这批观测样本。继续侦察时，新的记录可能补充或修正我们的发现。
        </p>
      }
    >
      <Tabs
        items={demonKinds}
        value={state.tab}
        onChange={(tab) => update({ tab })}
      />
      <div className={s.storyGrid}>
        <Art kind="discovery" />
        <div className={s.storyText}>
          <span className={s.tag}>
            {kind} · {rows.length} 个观测个体
          </span>
          <h3>身高 {range('height')} cm</h3>
          <h3>速度 {range('speed')} m/s</h3>
          <blockquote>
            “我知道要观察什么了，也知道同一类里仍有不同！”
          </blockquote>
          <p className={s.note}>勇士带上图鉴，准备下一次侦察。</p>
        </div>
      </div>
    </Page>
  );
}
function Summary() {
  return (
    <Page
      title="带走一套看数据的方法"
      label="FIELD GUIDE · 本课回顾"
      footer={<CodeTools code={COMPLETE_CODE} />}
    >
      <div className={s.summary}>
        {[
          {
            title: '比较对象',
            chart: '条形图',
            text: '同一个指标，谁更高、谁更低？',
          },
          {
            title: '观察分布',
            chart: '直方图',
            text: '主要集中在哪里？少数个体在哪里？',
          },
          {
            title: '寻找关系',
            chart: '散点图',
            text: '两个数值有什么联系？有没有例外？',
          },
          {
            title: '观察变化',
            chart: '折线图',
            text: '同一对象，随时间怎样改变？',
          },
        ].map((x) => (
          <div className={s.summaryItem} key={x.title}>
            <span className={s.tag}>{x.chart}</span>
            <strong>{x.title}</strong>
            <p>{x.text}</p>
          </div>
        ))}
      </div>
      <p className={s.evidence}>
        <Check
          size={24}
          style={{ display: 'inline', verticalAlign: 'middle' }}
        />
        先提出问题，再选择图表。用证据解释发现，为不确定的地方留下空间。
      </p>
    </Page>
  );
}

export function LessonScenes({ id }: { id: string }) {
  const c = chapters.find((x) => id === `l5-${x.id}-cover`);
  if (c)
    return (
      <ChapterCover
        number={c.number}
        title={c.title}
        kicker="FIELD GUIDE · 勇闯图表世界"
        task={
          {
            observe: '比较个体，观察数值分布',
            connect: '研究三类问题，用合适的图表找线索',
            discover: '制作恶魔图鉴，再研究真实企鹅',
          }[c.id]
        }
      />
    );
  if (id === 'l5-practice-01') return <SpeedPractice />;
  if (id === 'l5-practice-02') return <ChartPractice />;
  if (id === 'l5-practice-02-results') return <ChartPracticeResults />;
  if (id === 'l5-practice-03') return <PracticeEntry />;
  if (id === 'l5-practice-03-code') return <PracticeCode />;
  switch (id) {
    case 'l5-cover':
      return <Cover />;
    case 'l5-mission':
      return (
        <Story
          kind="opening"
          title="最终决战前的侦察"
          speaker="勇士"
          quote="我们守住了城堡，也找到了魔王。最终决战前，要先摸清这些恶魔的体型和速度。"
          question="侦察队带回一大叠个体记录，怎样才能一眼看出差异？"
        />
      );
    case 'l5-compare':
      return <Compare />;
    case 'l5-warmup':
      return <Warmup />;
    case 'l5-archive':
      return <Archive />;
    case 'l5-distribution-story':
      return <NumericStory />;
    case 'l5-normal':
      return <NormalScene />;
    case 'l5-buckets':
      return <Buckets />;
    case 'l5-histogram':
      return <HistogramScene />;
    case 'l5-setup':
      return <Setup />;
    case 'l5-hist-code':
      return (
        <CodeLesson
          title="一列数据，画出分布"
          code={HIST_CODE}
          complete={full(HIST_CODE)}
          steps={[
            {
              name: '取数据',
              lines: [1],
              text: 'data 指向我们读入的 demons 表。',
            },
            {
              name: '选速度',
              lines: [0, 1],
              text: 'histplot 绘制直方图；x 选择 speed 列。让 seaborn 自动把速度分组。',
            },
            {
              name: '展示图表',
              lines: [3, 4, 5],
              text: 'Speed (m/s) 是速度（米/秒），Count 是个体数；plt.show() 显示图表。',
            },
          ]}
          chart={<Histogram field="speed" axisLabels={HIST_AXIS_LABELS} />}
        />
      );
    case 'l5-guess':
      return <Guess />;
    case 'l5-point':
      return <Point />;
    case 'l5-scatter':
      return <ScatterScene />;
    case 'l5-scatter-code':
      return (
        <CodeLesson
          title="横轴和纵轴，各选一列"
          code={SCATTER_CODE}
          complete={full(SCATTER_CODE)}
          steps={[
            {
              name: '一行一个点',
              lines: [0],
              text: 'scatterplot 把每行记录画成一个点。',
            },
            {
              name: '指定两个轴',
              lines: [2],
              text: 'x 选 height，y 选 speed。右侧同时呈现两种数值。',
            },
            {
              name: '读懂位置',
              lines: [4, 5, 6],
              text: '靠右表示身高大，靠上表示速度快。轴的单位也要看清。',
            },
          ]}
          chart={<Scatter interactive axisLabels={SCATTER_AXIS_LABELS} />}
        />
      );
    case 'l5-time-story':
      return (
        <Story
          title="同一只恶魔，一直这么快？"
          speaker="勇士"
          quote="图鉴里有一次速度记录。但 D001 在不同时间，移动速度也会变化吧？"
          question="如果每隔两小时记录一次，怎样展示一天中的变化？"
        />
      );
    case 'l5-line':
      return <LineScene />;
    case 'l5-line-code':
      return (
        <CodeLesson
          title="有顺序的观测，连成线"
          code={LINE_CODE}
          complete={full(LINE_CODE)}
          steps={[
            {
              name: '连续观测',
              lines: [0],
              text: 'hour 表示观测时刻。',
            },
            {
              name: '按时间连线',
              lines: [2, 3, 4],
              text: '按时刻连线，圆点是观测值。',
            },
            {
              name: '核对变化',
              lines: [6, 7, 8],
              text: '看清变化，原因还需调查。',
            },
          ]}
          chart={<LineChart axisLabels={LINE_AXIS_LABELS} />}
        />
      );
    case 'l5-choose':
      return <Choose />;
    case 'l5-bar-story':
      return <BarStory />;
    case 'l5-bar':
      return <KindBarScene />;
    case 'l5-bar-code':
      return (
        <CodeLesson
          title="按种类，比较平均速度"
          code={KIND_BAR_CODE}
          complete={KIND_BAR_FULL_CODE}
          steps={[
            {
              name: '种类对应柱子',
              lines: [0, 2],
              text: 'barplot 把种类放在横轴，每一族对应一根柱子。',
            },
            {
              name: '比较平均值',
              lines: [2, 3],
              text: '同一族有 30 条速度记录。barplot 默认求平均，这里先只展示均值。',
            },
            {
              name: '看清坐标',
              lines: [5, 6, 7],
              text: 'Kind 是种类；Mean speed (m/s) 是平均速度。均值不同，个体仍可能重叠。',
            },
          ]}
          chart={<KindBars axisLabels={KIND_BAR_AXIS_LABELS} />}
        />
      );
    case 'l5-multivariate-scatter':
      return <MoreFeaturesScene />;
    case 'l5-multivariate-groups':
      return <GroupedChartsScene />;
    case 'l5-color-story':
      return (
        <Story
          kind="discovery"
          title="更多列，也能一起画吗？"
          speaker="小派"
          quote="身高和速度能画在两个轴上。档案里还有种类、体重，也能一起看吗？"
          question="第三列一定要加一条坐标轴吗？颜色、大小能帮上什么忙？"
        />
      );
    case 'l5-colors':
      return <Colors />;
    case 'l5-hue-code':
      return (
        <CodeLesson
          title="颜色也能表达一列数据"
          code={HUE_CODE}
          complete={full(HUE_CODE)}
          steps={[
            {
              name: '保留两个轴',
              lines: [2],
              text: '身高和速度继续决定位置，点没有换位置。',
            },
            {
              name: '加入种类',
              lines: [3],
              text: 'hue="kind" 把种类映射为不同颜色。',
            },
            {
              name: '核对图例',
              lines: [3],
              text: '先读图例，再描述不同种类的位置和重叠。颜色本身不表示大小。',
            },
          ]}
          chart={
            <Scatter colored interactive axisLabels={SCATTER_AXIS_LABELS} />
          }
        />
      );
    case 'l5-pairs':
      return <Colors pairs />;
    case 'l5-dossier':
      return <Dossier />;
    case 'l5-transfer':
      return (
        <Story
          kind="discovery"
          title="真实世界，也能这样研究吗？"
          speaker="小派"
          quote="我们用数据看懂了恶魔的特点。这套方法，也能帮助我们认识真实动物吗？"
          question="下一项任务：用真实企鹅的观测数据，独立发现不同种类的差异。"
        />
      );
    case 'l5-penguins':
      return <PenguinIntro />;
    case 'l5-challenge':
      return <PenguinLab />;
    case 'l5-challenge-report':
      return <PenguinReport />;
    case 'l5-summary':
      return <Summary />;
    default:
      return null;
  }
}
