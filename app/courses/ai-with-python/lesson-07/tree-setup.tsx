'use client';

import Image from 'next/image';
import { useContext } from 'react';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GitBranch,
  Target,
} from 'lucide-react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { assetBase } from './lesson-data';
import s from './tree-setup.module.css';

const conditions = [
  {
    title: '清晰的问题定义',
    status: '问题已明确',
    text: '判断公主送的是哪一种鸢尾花。',
    detail: '预测结果是三种种名中的一种。',
    Icon: Target,
  },
  {
    title: '充足可靠的数据',
    status: '花谱已备好',
    text: '150 条带种名的样本记录，每种花各 50 条。',
    detail: '每朵花按同样的方法量四项特征。',
    Icon: BookOpen,
  },
  {
    title: '选择合适的模型',
    status: '本节重点',
    text: (
      <>
        用<strong>决策树</strong>从花谱里学出判断规则。
      </>
    ),
    detail: '下一页看看它怎样一步步提问。',
    Icon: GitBranch,
  },
];

export function TreeConditions() {
  return (
    <ol className={s.conditions} aria-label="做好分类的三个条件">
      {conditions.map(({ title, status, text, detail, Icon }, index) => (
        <li key={title}>
          <div className={s.conditionHead}>
            <span>{status}</span>
            <Icon aria-hidden="true" />
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
          <p className={s.conditionDetail}>{detail}</p>
          {index < conditions.length - 1 && (
            <ArrowRight className={s.conditionArrow} aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}

const trainingCount = evidence.points.length;
const testingCount = evidence.tree.total;
const sampleCount = trainingCount + testingCount;

export function TreeDataSplit() {
  return (
    <div className={s.split}>
      <figure className={s.splitStory}>
        <Image
          src={`${assetBase}/assets/decision-gardener-holdout.jpg`}
          alt="园丁把一大叠花卡放进蓝色托盘，把较小的一叠装进金色文件夹，系好绳子留到测试时用。"
          width={1448}
          height={1086}
          sizes="42vw"
        />
        <figcaption>
          <b>园丁</b>
          <p>
            还记得训练前封好的 {testingCount} 张花卡吗？
            <strong>这棵树遇到没见过的花，还能分对吗？</strong>
          </p>
        </figcaption>
      </figure>
      <div className={s.splitPlan}>
        <div className={s.splitIntro}>
          <strong>训练前 · 把 {sampleCount} 张花卡分成两叠</strong>
          <span>每种花各 50 张，随机分到两边。每张卡只进一边。</span>
        </div>
        <div className={s.splitBar} aria-label="按 70% 训练、30% 测试划分">
          <span>70% 训练</span>
          <span>30% 测试</span>
        </div>
        <div className={s.splitCards}>
          <article>
            <BookOpen aria-hidden="true" />
            <div>
              <h3>训练集 · {trainingCount} 张</h3>
              <b>每种花 {trainingCount / evidence.labels.length} 张</b>
              <p>蓝托盘用来练习。读数和种名一起交给模型，让它学分类规则。</p>
            </div>
          </article>
          <article>
            <ClipboardCheck aria-hidden="true" />
            <div>
              <h3>测试集 · {testingCount} 张</h3>
              <b>每种花 {testingCount / evidence.labels.length} 张</b>
              <p>金色文件夹是考卷。训练前封好，等树学完再打开。</p>
            </div>
          </article>
        </div>
        <div className={s.splitWhy}>
          <strong>
            先把 {testingCount} 张卡留出来，才能用树没见过的花检验它学得怎么样。
          </strong>
        </div>
        <section className={s.testSequence} aria-label="测试时怎样预测和评分">
          <h3>训练结束后 · 用测试卡出题</h3>
          <ol>
            <li>
              <b>① 只给读数</b>
              <span>种名是答案，先盖住。</span>
            </li>
            <li>
              <b>② 记下预测</b>
              <span>沿树走到叶节点。</span>
            </li>
            <li>
              <b>③ 翻种名评分</b>
              <span>种名相同就记对。</span>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}

const plotColors = ['#1457d9', '#bd631e', '#27834b'];
const xTicks = [1, 2, 3, 4, 5, 6, 7];
const yTicks = [0, 0.5, 1, 1.5, 2, 2.5];
const plot = { left: 72, right: 587, top: 22, bottom: 319 };
const plotX = (value: number) =>
  plot.left + ((value - 1) / 6) * (plot.right - plot.left);
const plotY = (value: number) =>
  plot.bottom - (value / 2.65) * (plot.bottom - plot.top);
const threshold = evidence.tree.steps[0].threshold;
// The training set has two different species at this exact pair of readings.
const sharedReading = { length: 4.8, width: 1.8 };

function IrisRulePlot({
  showRule,
  showOverlap,
}: {
  showRule: boolean;
  showOverlap: boolean;
}) {
  const cut = plotX(threshold);
  return (
    <figure className={s.discussionPlot}>
      <svg
        viewBox="0 0 610 386"
        aria-label={[
          '第一次猜花用的两个坐标。横轴是花瓣长，纵轴是花瓣宽。每个点是一朵样本花。',
          showRule && `花瓣长 ${threshold} 厘米的切分线把山鸢尾单独分在左边。`,
          showOverlap &&
            `变色鸢尾和维吉尼亚鸢尾各有一朵花落在同一点，花瓣长 ${sharedReading.length} 厘米，宽 ${sharedReading.width} 厘米。`,
        ]
          .filter(Boolean)
          .join('')}
      >
        {showRule && (
          <rect
            x={plot.left}
            y={plot.top}
            width={cut - plot.left}
            height={plot.bottom - plot.top}
            fill="#e8f0ff"
          />
        )}
        {xTicks.map((value) => (
          <g key={value}>
            <line
              x1={plotX(value)}
              x2={plotX(value)}
              y1={plot.top}
              y2={plot.bottom}
            />
            <text x={plotX(value)} y="346" textAnchor="middle">
              {value}
            </text>
          </g>
        ))}
        {yTicks.map((value) => (
          <g key={value}>
            <line
              x1={plot.left}
              x2={plot.right}
              y1={plotY(value)}
              y2={plotY(value)}
            />
            <text x="61" y={plotY(value) + 6} textAnchor="end">
              {value}
            </text>
          </g>
        ))}
        <path
          className={s.plotAxes}
          d={`M${plot.left} ${plot.top}V${plot.bottom}H${plot.right}`}
        />
        <text x="330" y="378" textAnchor="middle">
          花瓣长（cm）
        </text>
        <text x="19" y="168" textAnchor="middle" transform="rotate(-90 19 168)">
          花瓣宽（cm）
        </text>
        {evidence.points.map(([length, width, species], index) => (
          <g
            key={index}
            transform={`translate(${plotX(length)} ${plotY(width)})`}
            fill={plotColors[species]}
            stroke={plotColors[species]}
            fillOpacity={0.45}
            strokeWidth={1.5}
          >
            {species === 0 && <circle r={5} />}
            {species === 1 && <rect x={-4.5} y={-4.5} width={9} height={9} />}
            {species === 2 && <path d="M0 -6 6 0 0 6 -6 0Z" />}
          </g>
        ))}
        {showRule && (
          <g className={s.cutMarker}>
            <line x1={cut} x2={cut} y1={plot.top} y2={plot.bottom} />
            <text x={cut + 8} y="52">
              {threshold} cm
            </text>
          </g>
        )}
        {showOverlap && (
          <g className={s.overlapMarker}>
            <circle
              cx={plotX(sharedReading.length)}
              cy={plotY(sharedReading.width)}
              r="13"
            />
            <path
              d={`M${plotX(sharedReading.length) - 10} ${plotY(sharedReading.width) - 10}l-28 -29h-30`}
            />
            <text
              x={plotX(sharedReading.length) - 73}
              y={plotY(sharedReading.width) - 33}
              textAnchor="end"
            >
              两朵花同一点
            </text>
          </g>
        )}
      </svg>
      <figcaption>
        {evidence.labels.map((label, index) => (
          <span key={label}>
            <i style={{ backgroundColor: plotColors[index] }} />
            {label}
          </span>
        ))}
        <strong>{trainingCount} 张训练花卡</strong>
      </figcaption>
    </figure>
  );
}

export function TreeModelDiscussion() {
  const { navigate } = useContext(LessonState);
  const [state, setState] = usePageState({
    showRule: false,
    showOverlap: false,
  });

  return (
    <div className={s.discussion}>
      <p className={s.discussionBridge}>
        <b>{testingCount} 张测试卡已封好</b>
        <span>
          先回看第一次猜花用的花瓣长宽图。只看训练花卡，你能找出什么规则？
        </span>
      </p>
      <IrisRulePlot showRule={state.showRule} showOverlap={state.showOverlap} />
      <div className={s.discussionBody}>
        <ol>
          <li>
            <div className={s.discussionQuestion}>
              <h3>只挑山鸢尾，一条规则够吗？</h3>
              <button
                type="button"
                aria-expanded={state.showRule}
                aria-controls="l7-rule-note"
                onClick={() => setState({ showRule: !state.showRule })}
              >
                {state.showRule ? '收起切分线' : '显示切分线'}
              </button>
            </div>
            <p>先讨论。只看花瓣长，能把蓝点单独分出来吗？</p>
            <p
              className={s.discussionAnswer}
              id="l7-rule-note"
              hidden={!state.showRule}
            >
              这批样本的蓝点全在线左边。用「花瓣长 ≤ {threshold}{' '}
              cm」这一条规则就够了。
            </p>
          </li>
          <li>
            <div className={s.discussionQuestion}>
              <h3>再分橙点和绿点呢？</h3>
              <button
                type="button"
                aria-expanded={state.showOverlap}
                aria-controls="l7-overlap-note"
                onClick={() => setState({ showOverlap: !state.showOverlap })}
              >
                {state.showOverlap ? '收起重叠点' : '看看重叠点'}
              </button>
            </div>
            <p>只看花瓣长和宽，你能把这两类花全分开吗？</p>
            <div
              className={s.discussionAnswer}
              id="l7-overlap-note"
              hidden={!state.showOverlap}
            >
              <p>
                两朵花的花瓣都长 {sharedReading.length} cm、宽{' '}
                {sharedReading.width} cm，
                一朵是变色鸢尾，另一朵是维吉尼亚鸢尾。
              </p>
              <p>
                只凭这两项读数分不开，可以再看萼片。几项读数要一起看、规则难找时，就让模型从训练卡里学。
              </p>
            </div>
          </li>
        </ol>
        <div className={s.discussionNext}>
          <p>打开封好的考卷，先看决策树答得怎样，再用它猜礼花。</p>
          <button type="button" onClick={() => navigate('l7-practice-02')}>
            进入第二次猜花 <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
