/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG charts use image semantics. */
'use client';

import { usePageState } from '@/components/course/lesson-state';
import { Guide, Page, Tabs } from './lesson-ui';
import s from './warmup-scene.module.css';

const situations = [
  {
    title: '零花钱去向',
    where: '我在记账本里见过这种图。',
    shape: '它像一个圆，被分成几个大小不同的部分。',
    meaning: '花在书本上的零花钱最多，占了一半。',
    sentence:
      '我在记账本里，见过一个圆被分成几部分的图，它告诉我零花钱主要花在哪里。',
  },
  {
    title: '每月气温',
    where: '我在天气记录里见过这种图。',
    shape: '几个点被线连在一起，先升高，再降低。',
    meaning: '这个示例里，7 月气温最高，为 30℃。',
    sentence:
      '我在天气记录里，见过点被线连起来的图，它告诉我气温怎样随月份变化。',
  },
  {
    title: '班级人数',
    where: '我在班级统计里见过这种图。',
    shape: '几根长短不同的柱子，分别对应四个小组。',
    meaning: '第二组人数最多，有 10 人。',
    sentence:
      '我在班级统计里，见过几根长短不同的柱子，它告诉我各组分别有多少人。',
  },
];

function EverydayChart({ scenario }: { scenario: number }) {
  if (scenario === 0) {
    return (
      <svg
        viewBox="0 0 480 220"
        className={s.chart}
        role="img"
        aria-label="零花钱去向示例：书本占百分之五十，运动用品占百分之三十，零食占百分之二十"
      >
        <circle cx="133" cy="110" r="71" fill="#1457d9" />
        <path d="M133 110 L133 39 A71 71 0 0 1 133 181 Z" fill="#1457d9" />
        <path d="M133 110 L133 181 A71 71 0 0 1 65.47 88.06 Z" fill="#ffc91c" />
        <path d="M133 110 L65.47 88.06 A71 71 0 0 1 133 39 Z" fill="#f36d4a" />
        <circle
          cx="133"
          cy="110"
          r="71"
          fill="none"
          stroke="#071a3d"
          strokeWidth="2"
        />
        <path
          d="M133 39 V181 M133 110 L65.47 88.06"
          fill="none"
          stroke="#fffaf0"
          strokeWidth="3"
        />
        {[
          ['书本', '50%', '#1457d9'],
          ['运动用品', '30%', '#ffc91c'],
          ['零食', '20%', '#f36d4a'],
        ].map(([label, percent, color], i) => (
          <g key={label} transform={`translate(255 ${58 + i * 51})`}>
            <rect width="19" height="19" y="-15" fill={color} />
            <text x="31">{label}</text>
            <text x="177" textAnchor="end" fontWeight="800">
              {percent}
            </text>
          </g>
        ))}
      </svg>
    );
  }
  if (scenario === 1) {
    const values = [10, 15, 23, 30, 25, 16];
    const months = [1, 3, 5, 7, 9, 11];
    const points = values.map((value, i) => [70 + i * 70, 172 - value * 4]);
    return (
      <svg
        viewBox="0 0 480 220"
        className={s.chart}
        role="img"
        aria-label="气温示例：一月十度、三月十五度、五月二十三度、七月三十度、九月二十五度、十一月十六度"
      >
        <text x="16" y="25">
          ℃
        </text>
        {[0, 10, 20, 30].map((value) => (
          <g key={value}>
            <line
              x1="58"
              x2="439"
              y1={172 - value * 4}
              y2={172 - value * 4}
              stroke="#c5ccd6"
            />
            <text x="43" y={179 - value * 4} textAnchor="end">
              {value}
            </text>
          </g>
        ))}
        <polyline
          points={points.map((point) => point.join(',')).join(' ')}
          fill="none"
          stroke="#1457d9"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {points.map(([x, y], i) => (
          <g key={months[i]}>
            <circle
              cx={x}
              cy={y}
              r="7"
              fill={i === 3 ? '#ffc91c' : '#1457d9'}
              stroke="#071a3d"
              strokeWidth="2"
            />
            <text x={x} y="205" textAnchor="middle">
              {months[i]}月
            </text>
          </g>
        ))}
        <text x="280" y="38" fontWeight="800" fill="#1457d9">
          30℃
        </text>
      </svg>
    );
  }
  const values = [8, 10, 7, 9];
  return (
    <svg
      viewBox="0 0 480 220"
      className={s.chart}
      role="img"
      aria-label="班级人数示例：第一组八人、第二组十人、第三组七人、第四组九人"
    >
      <text x="15" y="25">
        人
      </text>
      {[0, 5, 10].map((value) => (
        <g key={value}>
          <line
            x1="54"
            x2="450"
            y1={176 - value * 12}
            y2={176 - value * 12}
            stroke="#c5ccd6"
          />
          <text x="43" y={183 - value * 12} textAnchor="end">
            {value}
          </text>
        </g>
      ))}
      {values.map((value, i) => (
        <g key={i}>
          <rect
            x={77 + i * 95}
            y={176 - value * 12}
            width="55"
            height={value * 12}
            fill={i === 1 ? '#ffc91c' : '#1457d9'}
            stroke="#071a3d"
            strokeWidth="2"
          />
          <text x={104.5 + i * 95} y={163 - value * 12} textAnchor="middle">
            {value}
          </text>
          <text x={104.5 + i * 95} y="208" textAnchor="middle">
            第{['一', '二', '三', '四'][i]}组
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Warmup() {
  const [state, update] = usePageState({
    scenario: 0,
    steps: [-1, -1, -1],
    complete: [false, false, false],
  });
  const index = state.scenario;
  const situation = situations[index] || situations[0];
  const step = state.steps[index];
  const reference = [situation.where, situation.shape, situation.meaning];
  const choose = (next: number) => {
    const steps = [...state.steps];
    const complete = [...state.complete];
    steps[index] = next;
    complete[index] = false;
    update({ steps, complete });
  };
  const restart = () => {
    const steps = [...state.steps];
    const complete = [...state.complete];
    steps[index] = -1;
    complete[index] = false;
    update({ steps, complete });
  };
  const feedback = state.complete[index]
    ? situation.sentence
    : step >= 0
      ? reference[step]
      : '先说说你的经历，再点一项提示，看看一种说法。';

  return (
    <Page
      title="你在哪里见过图表？"
      label="QUICK CHAT · 课前快问快答"
      footer={
        <Guide>
          <span aria-live="polite">{feedback}</span>
        </Guide>
      }
    >
      <Tabs
        items={situations.map((item) => item.title)}
        value={index}
        onChange={(scenario) => update({ scenario })}
        label="选择生活中的图表情境"
      />
      <div className={s.grid}>
        <figure className={s.figure}>
          <figcaption>
            <strong>{situation.title}</strong>
            <span>生活示例</span>
          </figcaption>
          <EverydayChart scenario={index} />
        </figure>
        <div className={s.discussion}>
          <h3>借这张图，分享你的经历</h3>
          <p className={s.sentence}>
            我在<span>____</span>场景，见过<span>____</span>样子的图表，
            <br />
            表达的是<span>____</span>含义。
          </p>
          <fieldset className={s.prompts} aria-label="分享提示">
            {['在哪见过？', '长什么样？', '告诉我什么？'].map((item, i) => (
              <button
                key={item}
                aria-pressed={step === i}
                onClick={() => choose(i)}
              >
                <span>{['场景', '样子', '含义'][i]}</span>
                {item}
              </button>
            ))}
          </fieldset>
          <div className={s.actions}>
            <button
              className={s.reveal}
              onClick={() => {
                const complete = [...state.complete];
                complete[index] = true;
                update({ complete });
              }}
            >
              看看完整说法
            </button>
            <button onClick={restart}>重新回答</button>
          </div>
          <p className={s.tip}>说出自己的例子也可以，不用记图表名称。</p>
        </div>
      </div>
    </Page>
  );
}
