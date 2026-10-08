/* oxlint-disable next/no-img-element -- Reuse illustrations from the user's reference deck. */
'use client';

import { usePageState } from '@/components/course/lesson-state';
import { Guide, LessonStage, Tabs } from './lesson-ui';
import s from './data-foundations.module.css';

const art = '/courses/ai-with-python/lesson-04/assets/data-types';
const dogs = [
  { name: '金毛', image: 'dog-golden.png' },
  { name: '柯基', image: 'dog-corgi.png' },
  { name: '柴犬', image: 'dog-shiba.png' },
  { name: '哈士奇', image: 'dog-husky.png' },
];

export function DataKindsScene() {
  return (
    <LessonStage
      title="同一只狗，可以记录什么？"
      label="LOOK · 望 / 统计学里的两类数据"
    >
      <p className={s.lead}>小派：“给巡逻犬建档，品种和体重都要记下来！”</p>
      <div className={s.comparison}>
        <section className={s.typeCard}>
          <div className={s.dogPair}>
            <img src={`${art}/dog-corgi.png`} alt="柯基犬插图" />
            <div>
              <span>品种</span>
              <strong>柯基</strong>
            </div>
          </div>
          <h3>分类数据</h3>
          <p>
            回答“属于哪一类”。
            <br />
            用类别或标签描述对象。
          </p>
          <div className={s.takeaway}>可以按品种分组，数数每类有几只。</div>
        </section>
        <section className={s.typeCard}>
          <div className={s.dogPair}>
            <img src={`${art}/dog-corgi.png`} alt="同一只柯基犬插图" />
            <div>
              <span>体重</span>
              <strong>
                12 <small>千克</small>
              </strong>
            </div>
          </div>
          <h3>数值数据</h3>
          <p>
            回答“有多少、多大、多长”。
            <br />
            用数量或测量值描述对象。
          </p>
          <div className={s.takeaway}>可以比较轻重，计算平均体重。</div>
        </section>
      </div>
      <Guide>先看记录表示什么，再决定怎样分析。这是统计学里的分类方法。</Guide>
    </LessonStage>
  );
}

export function CategoryExamplesScene() {
  const [state, update] = usePageState({ revealed: false });
  return (
    <LessonStage
      title="分类数据：它属于哪一类？"
      label="LOOK · 望 / 狗狗品种接龙"
    >
      <p className={s.lead}>轮流说一个狗狗品种。同一种品种，放在同一组。</p>
      <div className={s.dogs}>
        {dogs.map((dog, index) => (
          <figure key={dog.name}>
            <img
              src={`${art}/${dog.image}`}
              alt={
                state.revealed ? `${dog.name}插图` : `狗狗示意图 ${index + 1}`
              }
            />
            <figcaption>
              {state.revealed ? dog.name : '你想到了哪一类？'}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className={s.categoryFooter}>
        <div>
          <strong>类别不同，可以分组</strong>
          <p>其他例子：交通工具种类、衣服颜色、进攻地点。</p>
        </div>
        <button
          onClick={() => update({ revealed: !state.revealed })}
          aria-expanded={state.revealed}
        >
          {state.revealed ? '收起品种示例' : '看看品种示例'}
        </button>
      </div>
      <Guide>可以统计“每种狗有几只”，但不能把“柯基”和“柴犬”相加求平均。</Guide>
    </LessonStage>
  );
}

const quantities = [
  {
    tab: '数人数',
    title: '三支巡逻队各有多少人？',
    image: 'people.png',
    unit: '人',
    values: [3, 5, 8],
    labels: ['一队', '二队', '三队'],
    result: '三队比一队多 5 人；三支队伍共有 16 人。',
    note: '人数是数出来的数量，通常用整数记录。',
  },
  {
    tab: '看年龄',
    title: '三位同学分别几岁？',
    image: 'age.png',
    unit: '岁',
    values: [10, 11, 12],
    labels: ['小林', '小安', '小雨'],
    result: '小雨比小林大 2 岁；三人的平均年龄是 11 岁。',
    note: '这里按周岁记录年龄，可以比较年龄差。',
  },
  {
    tab: '量身高',
    title: '三位同学分别有多高？',
    image: 'height.png',
    unit: '厘米',
    values: [140, 150, 160],
    labels: ['小林', '小安', '小雨'],
    result: '小雨比小林高 20 厘米；三人的平均身高是 150 厘米。',
    note: '身高是量出来的数值，也可以记录为 150.5 厘米。',
  },
  {
    tab: '算金额',
    title: '三本笔记本分别多少钱？',
    image: 'money.png',
    unit: '元',
    values: [6, 8, 10],
    labels: ['甲本', '乙本', '丙本'],
    result: '丙本比甲本贵 4 元；三本一起买共需 24 元。',
    note: '金额表示多少钱，可以比较价格、计算总价。',
  },
] as const;

export function NumericExamplesScene() {
  const [state, update] = usePageState({
    example: 0,
    revealed: {} as Record<number, boolean>,
  });
  const index = Math.max(0, Math.min(quantities.length - 1, state.example));
  const example = quantities[index];
  const shown = Boolean(state.revealed[index]);
  return (
    <LessonStage
      title="数值数据：有多少、有多大？"
      label="LOOK · 望 / 数一数，量一量"
      footer={
        <Tabs
          labels={quantities.map((x) => x.tab)}
          value={index}
          onChange={(example) => update({ example })}
          label="数值数据的生活例子"
        />
      }
    >
      <div className={s.quantityLayout}>
        <div className={s.quantityIntro}>
          <img src={`${art}/${example.image}`} alt={`${example.tab}示意图`} />
          <h3>{example.title}</h3>
          <p>{example.note}</p>
        </div>
        <div className={s.quantityWork}>
          <figure
            className={s.bars}
            aria-label={example.values
              .map((v, i) => `${example.labels[i]}${v}${example.unit}`)
              .join('，')}
          >
            {example.values.map((value, i) => (
              <div className={s.barColumn} key={example.labels[i]}>
                <strong>
                  {value}
                  <span> {example.unit}</span>
                </strong>
                <div className={s.barTrack}>
                  <div
                    className={s.barFill}
                    style={{
                      height: `${(value / Math.max(...example.values)) * 100}%`,
                    }}
                  />
                </div>
                <span>{example.labels[i]}</span>
              </div>
            ))}
          </figure>
          <div className={s.numericAnswer} aria-live="polite">
            <p>
              {shown
                ? example.result
                : '先比一比：谁最多？相差多少？还能怎样计算？'}
            </p>
            <button
              onClick={() =>
                update({ revealed: { ...state.revealed, [index]: !shown } })
              }
            >
              {shown ? '再想一想' : '看看比较与计算'}
            </button>
          </div>
        </div>
      </div>
      <Guide>这些数值表示实际的数量或测量结果。比较时，先确认单位一致。</Guide>
    </LessonStage>
  );
}
