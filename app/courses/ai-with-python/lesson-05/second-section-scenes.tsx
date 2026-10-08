/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';

import { useContext, useState } from 'react';
import { ChartScatter, ChartLine, ChartColumn, ZoomIn } from 'lucide-react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Page, Guide, Tabs, CodeTools } from './lesson-ui';
import { Scatter, LineChart, KindBars } from './charts';
import { demons, demonKinds, patrol } from './study-data';
import {
  PRACTICE_02_PREPARATION,
  PRACTICE_02_PLOTS,
  PRACTICE_02_CODE,
} from './practice-content';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';
import c from './second-section.module.css';

const concepts = {
  scatter: {
    title: '散点图',
    english: 'Scatter Plot',
    icon: ChartScatter,
    text: '用点的位置，展示两个数值变量之间的关系。',
    x: '横轴：身高',
    y: '纵轴：速度',
    mark: '一个点 = 一只恶魔的记录',
  },
  line: {
    title: '折线图',
    english: 'Line Chart',
    icon: ChartLine,
    text: '按时间或连续数值的顺序连接数据点，展示上升、下降与波动。',
    x: '横轴：观测时间',
    y: '纵轴：速度',
    mark: '一条线 = 同一只恶魔的连续观测',
  },
  bar: {
    title: '条形图',
    english: 'Bar Chart',
    icon: ChartColumn,
    text: '用矩形条的长度或高度表示数值，比较不同类别。',
    x: '横轴：恶魔种类',
    y: '纵轴：平均速度',
    mark: '一根柱子 = 一个种类的平均值',
  },
};
export function ChartConcept({ type }: { type: keyof typeof concepts }) {
  const item = concepts[type];
  const Icon = item.icon;
  return (
    <section className={c.concept} aria-label={`${item.title}概念`}>
      <h3>
        <Icon size={32} aria-hidden="true" />
        <span>
          {item.title} <span lang="en">{item.english}</span>
        </span>
      </h3>
      <p>{item.text}</p>
      <div className={c.axisKey}>
        <span>{item.x}</span>
        <span>{item.y}</span>
      </div>
      <strong>{item.mark}</strong>
    </section>
  );
}

export function BarStory() {
  return (
    <Page title="哪一族通常跑得更快？" label="STORY · 比较军团">
      <div className={s.storyGrid}>
        <img
          className={s.art}
          src={`${assetBase}/assets/fieldwork.png`}
          alt="勇士、小派与熊猫博士侦察三种恶魔的体型和移动速度"
        />
        <div className={s.storyText}>
          <span className={s.tag}>勇士</span>
          <blockquote>
            “一只恶魔的表现，能代表整个种类吗？把每族的记录合起来比较吧！”
          </blockquote>
          <div className={s.question}>
            <span>先想一想</span>
            <p>每族都有 30 只恶魔，怎样比较各族的平均速度？</p>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function KindBarScene() {
  const [state, update] = usePageState({ show: false });
  const means = demonKinds.map((kind) => ({
    kind,
    speed:
      demons
        .filter((d) => d.kind === kind)
        .reduce((sum, d) => sum + d.speed, 0) /
      demons.filter((d) => d.kind === kind).length,
  }));
  const fastest = means.reduce((a, b) => (a.speed > b.speed ? a : b));
  return (
    <Page
      title="用柱高比较三族的速度"
      label="BAR CHART · 条形图"
      footer={
        <>
          <p>平均值帮助比较群体，个体之间仍有差异。</p>
          <button
            className={s.button}
            onClick={() => update({ show: !state.show })}
          >
            {state.show ? '收起观察结果' : '核对哪族均速更高'}
          </button>
        </>
      }
    >
      <div className={s.grid}>
        <div className={`${s.column} ${c.conceptColumn}`}>
          <ChartConcept type="bar" />
          <p className={c.prompt}>先找最高的柱子，再看它对应哪一种恶魔。</p>
          <Guide>
            这次把每族 30
            只的速度求平均。柱高表示平均速度，三根柱子对应三个种类。
          </Guide>
          {state.show && (
            <p className={c.reveal}>
              {fastest.kind}均速最高，为 {fastest.speed.toFixed(1)}{' '}
              m/s。不能推断它的每个个体都最快。
            </p>
          )}
        </div>
        <div className={s.chartPanel}>
          <KindBars />
        </div>
      </div>
    </Page>
  );
}

export function MoreFeaturesScene() {
  const [state, update] = usePageState({ step: 0 });
  const descriptions = [
    {
      title: '位置表达两个变量',
      text: '横轴是身高，纵轴是速度。一个点同时表达两个数值。',
      code: 'x="height", y="speed"',
    },
    {
      title: '再加一个分类变量',
      text: '点的位置保持不变。颜色表示种类，先读图例，再观察各族的位置。',
      code: 'hue="kind"',
    },
    {
      title: '再加一个数值变量',
      text: '颜色继续表示种类。点的面积表示体重，点越大，体重越大。',
      code: 'size="mass"',
    },
  ];
  const current = descriptions[state.step];
  return (
    <Page
      title="第三列、第四列，放在哪里？"
      label="MORE VARIABLES · 颜色与大小"
      footer={<p>仍然在二维平面上，用位置、颜色和大小表达更多变量。</p>}
    >
      <Tabs
        items={['01 两个变量', '02 加上种类', '03 加上体重']}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.grid}>
        <div className={`${s.column} ${c.featureColumn}`}>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <dl className={c.encoding}>
            <div>
              <dt>位置</dt>
              <dd>身高 × 速度</dd>
            </div>
            {state.step >= 1 && (
              <div>
                <dt>
                  <i className={c.colorDot} />
                  颜色
                </dt>
                <dd>种类 kind</dd>
              </div>
            )}
            {state.step >= 2 && (
              <div>
                <dt>
                  <i className={c.largeDot} />
                  大小
                </dt>
                <dd>体重 mass</dd>
              </div>
            )}
          </dl>
          <code className={c.parameter}>{current.code}</code>
          <Guide>
            {state.step === 0
              ? '还有种类和体重两列。你会把它们放在哪里？'
              : state.step === 1
                ? '加入一列分类数据，不一定需要再加一条坐标轴。'
                : '先看颜色图例和大小图例，再解释这个点代表什么。'}
          </Guide>
        </div>
        <div className={s.chartPanel}>
          <Scatter
            colored={state.step >= 1}
            sizeByMass={state.step >= 2}
            interactive
          />
        </div>
      </div>
    </Page>
  );
}

export function GroupedChartsScene() {
  const [state, update] = usePageState({ chart: 0, grouped: false });
  return (
    <Page
      title="折线和条形，也能分组比较"
      label="MORE VARIABLES · 多组图形"
      footer={<p>先读图例：每种颜色表示哪一组？再比较同一横轴位置的数值。</p>}
    >
      <div className={c.controls}>
        <Tabs
          items={['折线图加上种类', '条形图加上体型']}
          value={state.chart}
          onChange={(chart) => update({ chart, grouped: false })}
        />
        <button
          className={s.button}
          aria-pressed={state.grouped}
          onClick={() => update({ grouped: !state.grouped })}
        >
          {state.grouped ? '返回原图' : '加入分类变量'}
        </button>
      </div>
      <div className={s.grid}>
        <div className={`${s.column} ${c.featureColumn}`}>
          <h3>
            {state.chart === 0
              ? state.grouped
                ? '同一时刻，比较三只恶魔'
                : '接上刚才的巡逻折线'
              : '让同一类别里的柱子并排'}
          </h3>
          <p>
            {state.chart === 0
              ? state.grouped
                ? '保留 D001，再加入藤甲魔族 D002、冰翼魔族 D009 的同期记录，用颜色区分种类。'
                : '沿用第 20 页 D001 的六次观测：横轴仍是时刻，纵轴仍是速度。再侦察其他种类，会看到怎样的变化？'
              : state.grouped
                ? '每族再按身高小于 180 cm、不小于 180 cm 分成两组，用并排的柱子比较平均速度。'
                : '刚才每族只有一根均速柱。各族内部，体型不同的个体表现也一样吗？'}
          </p>
          <div className={c.encodingNote}>
            <strong>增加的分类变量</strong>
            <p>
              {state.chart === 0 ? '种类 → 线的颜色' : '体型组 → 柱子的颜色'}
            </p>
          </div>
          <Guide>
            {state.chart === 0
              ? state.grouped
                ? '颜色表示种类，每条线追踪一个个体。这三只的表现，还不能代表整族。'
                : '先看 D001 的原曲线，再加入其他种类的个体。比较同一时刻的速度。'
              : '颜色表示分组，柱高仍然表示数值。空缺表示该组没有观测样本。'}
          </Guide>
        </div>
        <div className={s.chartPanel}>
          {state.chart === 0 ? (
            <LineChart groupedByKind={state.grouped} />
          ) : (
            <KindBars groupedBySize={state.grouped} />
          )}
        </div>
      </div>
    </Page>
  );
}

function PracticeClueComic() {
  const [open, setOpen] = useState(false);
  const src = `${assetBase}/assets/chart-clues.png`;
  const alt =
    '勇士和小派对照特征散点、巡逻折线与三族均速条形图，把三条线索汇入侦察地图，为最终决战做准备';
  return (
    <>
      <button
        type="button"
        data-lesson-art-button
        className={c.practiceComicButton}
        aria-label="放大漫画：勇士整合三种图表线索，为决战做准备"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt={alt} />
        <span className={c.practiceComicCaption}>
          <span>勇士：线索更充分了！</span>
          <span className={s.speedClueZoom}>
            <ZoomIn size={20} aria-hidden="true" />
            放大
          </span>
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${s.modal} ${s.speedClueModal}`}>
          <DialogHeader>
            <DialogTitle>三种图，收集三条线索</DialogTitle>
            <DialogDescription>
              散点看特征联系，折线看时间变化，条形比种类均速。勇士把三条线索汇入图鉴，为最终决战做好准备。
            </DialogDescription>
          </DialogHeader>
          <img src={src} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function PracticeProgress({ current }: { current: 1 | 2 }) {
  return (
    <ol className={c.practiceProgress} aria-label="课堂练习二环节">
      <li aria-current={current === 1 ? 'step' : undefined}>① 跟写代码</li>
      <li aria-current={current === 2 ? 'step' : undefined}>② 核对与收获</li>
    </ol>
  );
}

export function ChartPractice() {
  const { navigate } = useContext(LessonState);
  return (
    <Page
      title="三个例子，亲手画出三种图"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <>
          <CodeTools code={PRACTICE_02_CODE} label="三例完整代码" />
          <button
            className={s.button}
            onClick={() => navigate('l5-practice-02-results')}
          >
            完成跟写，核对图表 →
          </button>
        </>
      }
    >
      <div className={c.practiceCodePage}>
        <div className={c.practiceIntro}>
          <PracticeProgress current={1} />
          <p>先运行字体准备单元格，再按顺序跟写；每格按 Shift+Enter 运行。</p>
        </div>
        <div className={c.practicePreparation}>
          <div className={c.preparationNotebook}>
            <NotebookPanel
              compact
              title="共用准备 · 导入库与读取数据（只写一次）"
              cells={PRACTICE_02_PREPARATION.split('\n\n').map((code) => ({
                code,
              }))}
            />
          </div>
          <ClassPracticeStamp number="02" checklist />
        </div>
        <div className={c.practiceCodeColumns}>
          {PRACTICE_02_PLOTS.map((item, index) => (
            <section
              className={c.practicePlotCode}
              key={item.id}
              aria-label={`${item.title}跟写代码`}
            >
              <p>{item.question}</p>
              <NotebookPanel
                compact
                title={`0${index + 1} ${item.title}`}
                cells={[{ code: item.code }]}
              />
            </section>
          ))}
        </div>
      </div>
    </Page>
  );
}

export function ChartPracticeResults() {
  const { navigate } = useContext(LessonState);
  const [state, update] = usePageState({ revealed: false });
  const maximum = patrol.reduce((a, b) => (a.speed > b.speed ? a : b));
  const minimum = patrol.reduce((a, b) => (a.speed < b.speed ? a : b));
  const fastestKind = demonKinds
    .map((kind) => {
      const samples = demons.filter((d) => d.kind === kind);
      return {
        kind,
        speed: samples.reduce((sum, d) => sum + d.speed, 0) / samples.length,
      };
    })
    .reduce((a, b) => (a.speed > b.speed ? a : b));
  const findings = {
    scatter: {
      sample: '90 个体',
      prompt: '观察点群的方向，也找找例外。',
      conclusion: '整体上较高个体往往较慢，但有例外；关系不等于因果。',
    },
    line: {
      sample: 'D001 · 六次',
      prompt: '找出最高、最低点，再看上升与下降。',
      conclusion: `${maximum.hour} 时最快 ${maximum.speed} m/s；${minimum.hour} 时最慢 ${minimum.speed} m/s。仅代表 D001 当天记录。`,
    },
    bar: {
      sample: '各 30 个体',
      prompt: '先比较柱高，再读对应种类。',
      conclusion: `${fastestKind.kind}均速最高（${fastestKind.speed.toFixed(1)} m/s）；平均值不代表每只个体。`,
    },
  };
  return (
    <Page
      title="三种图，带回三条线索"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <>
          <CodeTools code={PRACTICE_02_CODE} label="三例完整代码" />
          <div className={c.practiceResultActions}>
            <button
              className={`${s.button} ${c.backButton}`}
              onClick={() => navigate('l5-practice-02')}
            >
              ← 返回跟写代码
            </button>
            <button
              className={s.button}
              aria-expanded={state.revealed}
              aria-controls="l5-practice-02-findings"
              onClick={() => update({ revealed: !state.revealed })}
            >
              {state.revealed ? '收起练习收获' : '查看练习收获'}
            </button>
          </div>
        </>
      }
    >
      <div className={c.practiceResultsPage}>
        <PracticeProgress current={2} />
        <div
          className={c.practiceResultColumns}
          id="l5-practice-02-findings"
          aria-live="polite"
        >
          {PRACTICE_02_PLOTS.map((item, index) => {
            const detail = findings[item.id];
            return (
              <section
                className={c.practiceResultCard}
                key={item.id}
                aria-label={`${item.title}输出示例与收获`}
              >
                <h3>
                  0{index + 1} {item.title}
                  <span>{detail.sample}</span>
                </h3>
                <p className={c.practiceQuestion}>{item.question}</p>
                <div className={c.practiceResultPlot}>
                  {item.id === 'scatter' ? (
                    <Scatter interactive={false} axisLabels={item.axisLabels} />
                  ) : item.id === 'line' ? (
                    <LineChart axisLabels={item.axisLabels} />
                  ) : (
                    <KindBars axisLabels={item.axisLabels} />
                  )}
                </div>
                <p className={c.practiceFinding}>
                  <strong>{state.revealed ? '收获：' : '先观察：'}</strong>
                  {state.revealed ? detail.conclusion : detail.prompt}
                </p>
              </section>
            );
          })}
        </div>
        <div className={c.practiceStory}>
          <PracticeClueComic />
          <div className={c.practiceStoryDialogue}>
            <strong>勇士 · 最终决战前</strong>
            <p>
              “特征、巡逻变化、种类差异都看清了！最终决战前，我们准备得更充分了。”
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}
