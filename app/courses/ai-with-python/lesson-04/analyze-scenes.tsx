'use client';
import { useCallback, useState } from 'react';
import { TrapReaction } from './trap-reaction';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  Comic,
  Guide,
  LessonStage,
  Ranking,
  RecordTable,
  Tabs,
} from './lesson-ui';
import { records, rankSuspects } from './investigation-data';
import { codeBlocks, practiceSteps } from './practice-content';
import { LoadScene } from './load-evidence';
import outputs from '@/public/courses/ai-with-python/lesson-04/practice/reference-outputs.json';
import s from './lesson.module.css';
import a from './analysis-layout.module.css';

type CodeKey = keyof typeof codeBlocks;
const exampleGroups = ['炎角兽', '岩背魔', '藤甲魔'];
const details: Record<
  CodeKey,
  {
    title: string;
    chapter: string;
    dialogue?: string;
    explain: string;
    note: string;
  }
> = {
  load: {
    title: '把 CSV 读成一张表',
    chapter: 'SMELL · 闻 / 读取',
    dialogue: '勇士：“文件在这里，怎样让 Python 看见它？”',
    explain:
      'pd 是 pandas 的简写。read_csv 读入文件，df 保存这张表；head() 默认查看前五行。',
    note: 'CSV 和笔记本放在同一文件夹，接下来按页运行。',
  },
  info: {
    title: '先检查这份记录',
    chapter: 'SMELL · 闻 / 全表信息',
    explain:
      'info() 显示行列、非空数量与类型。本样本 3 列文字、2 列整数，没有缺项；仍要核对来源与记录准确性。',
    note: '',
  },
  row: {
    title: '查看第一条进攻记录',
    chapter: 'SMELL · 闻 / 指定行',
    dialogue: '勇士：“我要核对最前面那条战报，而不是整张表。”',
    explain:
      'iloc 按位置取数据；位置从 0 开始，所以 iloc[0] 取第一行，结果是 Series。',
    note: '0 是这里的位置，不是战报编号 A01。改成 iloc[1]，会得到哪一条？',
  },
  select: {
    title: '只留下当前需要的列',
    chapter: 'SMELL · 闻 / 选择列',
    explain:
      '聚焦调查需要的三列：内层列表写列名，外层方括号从 df 取列；copy() 留出独立工作表。',
    note: 'focus 保留 36 行、3 列；原来的 df 仍保留全部 5 列。',
  },
  split: {
    title: '先把名字拆开',
    chapter: 'ANALYZE · 切 / 拆分',
    dialogue: '勇士：“炎角兽和雾铃魔挤在同一格，能直接分别统计吗？”',
    explain: 'str.split("/") 按斜杠把文字拆成名字列表，再放回这一列。',
    note: '此时仍是 36 行，一行一场进攻。先形成列表，下一步才能展开。',
  },
  explode: {
    title: '让每个恶魔各占一行',
    chapter: 'ANALYZE · 切 / 展开',
    explain: 'explode 把名字列表展开：每个恶魔各占一行，保留同场的编号和读数。',
    note: `${records.length} 场进攻展开成 ${records.reduce((sum, row) => sum + row.demons.length, 0)} 条关联记录；${records[0].id} 的两行仍是一场进攻，威胁值不是个人伤害。`,
  },
  group: {
    title: '同一个名字，放到一组',
    chapter: 'ANALYZE · 切 / 分组',
    dialogue: '勇士：“同一个恶魔散落在不同记录里，怎样一起看？”',
    explain:
      'groupby 按名字分组，再选择每组的威胁值。这里只准备好分组，还没计算平均值。',
    note: '右侧示意分组，读数不变。这个单元没有 print，不会打印输出。',
  },
  mean: {
    title: '计算每组的平均威胁值',
    chapter: 'ANALYZE · 切 / 求平均',
    explain:
      'mean() 对每组做同样的平均值计算，结果 means 是 Series。右侧放大一组：读数之和 ÷ 记录数。',
    note: 'round(1) 只把显示结果保留一位小数；排名仍使用原始精度。',
  },
  rank: {
    title: '谁值得优先调查？',
    chapter: 'ANALYZE · 切 / 排序',
    dialogue: '勇士：“平均值已经有了，先从谁开始查？”',
    explain:
      'reset_index 把名字索引变回一列；sort_values 再把表格按威胁值排序。ascending=False 表示从大到小。',
    note: '这是关联进攻的平均威胁值排行榜，还不是首领身份的证明。',
  },
  count: {
    title: '这个平均值来自几次记录？',
    chapter: 'VERIFY · 核对记录数量',
    explain:
      'agg 同时做两种汇总：mean 求平均，count 数非空记录。结果 summary 是一张表。',
    note: '本样本每场每个名字只出现一次，威胁值无缺项，count 对应关联进攻次数。岩背魔只有 1 条记录，100.0 不能代表它每次都会如此。',
  },
  filter: {
    title: '改变条件，再看调查名单',
    chapter: 'VERIFY · 调整调查条件',
    dialogue: '勇士：“这一轮，我们先查至少出现过三次的对象。”',
    explain:
      'count >= 3 生成筛选条件，选出符合条件的行，再按 mean 从高到低排列。',
    note: '3 是本轮调查条件，不是判定首领的定律。保留 summary，改变条件后可以重新筛选。',
  },
};

export function CodeScene({ kind }: { kind: CodeKey }) {
  const d = details[kind];
  const [state, update] = usePageState({
    step: 0,
    group: '炎角兽',
    minimum: 3,
  });
  const code =
    kind === 'filter'
      ? codeBlocks.filter.replace('>= 3', `>= ${state.minimum}`)
      : codeBlocks[kind];
  const dialogue =
    kind === 'filter'
      ? `勇士：“这一轮，我们先查至少出现过 ${state.minimum} 次的对象。”`
      : d.dialogue;
  const note =
    kind === 'filter'
      ? `本轮至少 ${state.minimum} 次，是调查条件，不是首领定律。保留 summary，改变条件可以重新筛选。`
      : d.note;
  const explain =
    kind === 'filter'
      ? `count >= ${state.minimum} 选出记录次数足够的行，再按 mean 从高到低排列。`
      : d.explain;
  if (kind === 'load') {
    return <LoadScene step={state.step} onStep={(step) => update({ step })} />;
  }
  const mergedGuide = ['select', 'explode', 'mean', 'count'].includes(kind);
  const infoGuide = kind === 'info';
  const comic = (
    <Comic
      className={mergedGuide || infoGuide ? a.comic : s.miniComic}
      kind={
        ['info', 'row', 'select'].includes(kind)
          ? 'read'
          : ['split', 'explode'].includes(kind)
            ? 'expand'
            : 'analysis'
      }
    />
  );
  return (
    <LessonStage title={d.title} label={d.chapter}>
      <div className={mergedGuide || infoGuide ? a.layout : s.codeLayout}>
        <div className={mergedGuide || infoGuide ? a.column : s.codeSide}>
          {!mergedGuide && !infoGuide && <p className={s.speech}>{dialogue}</p>}
          <NotebookPanel
            title="第四课练习.ipynb"
            compact
            cells={[
              {
                code,
                output: kind === 'info' ? outputs.info.trimEnd() : undefined,
                outputLabel: 'df.info() 原始输出示例',
              },
            ]}
          />
          {mergedGuide && comic}
          {!mergedGuide && kind !== 'info' && (
            <Guide>
              {explain}
              <br />
              {note}
            </Guide>
          )}
        </div>
        <div className={mergedGuide || infoGuide ? a.column : s.codeSide}>
          {!mergedGuide && comic}
          <CodeEvidence
            kind={kind}
            group={
              exampleGroups.includes(state.group)
                ? state.group
                : exampleGroups[0]
            }
            minimum={state.minimum}
            onGroup={(group) => update({ group })}
            onMinimum={(minimum) => update({ minimum })}
          />
          {infoGuide && <Guide>{explain}</Guide>}
        </div>
      </div>
      {mergedGuide && (
        <Guide>
          {explain}
          <br />
          {note}
        </Guide>
      )}
    </LessonStage>
  );
}
function CodeEvidence({
  kind,
  group,
  minimum,
  onGroup,
  onMinimum,
}: {
  kind: CodeKey;
  group: string;
  minimum: number;
  onGroup: (s: string) => void;
  onMinimum: (n: number) => void;
}) {
  if (kind === 'select')
    return (
      <>
        <div className={s.selectionChange}>
          <span>df · 36 行 × 5 列</span>
          <span aria-hidden="true">→</span>
          <strong>focus · 36 行 × 3 列</strong>
        </div>
        <RecordTable
          items={records.slice(0, 3)}
          compact
          caption="focus · 前 3 行，选出的全部 3 列"
        />
        <p className={s.note}>
          输出示例节选：这里只放大前三条。完整输出见练习包。
        </p>
      </>
    );
  if (kind === 'info')
    return (
      <div className={s.paper} aria-label="全表信息摘要">
        <div className={s.infoMetrics}>
          <p className={s.metric}>
            <strong>{records.length}</strong> 行记录
          </p>
          <p className={s.metric}>
            <strong>5</strong> 列字段
          </p>
        </div>
        <p>每列 36 个非空值</p>
      </div>
    );
  if (kind === 'row')
    return (
      <div className={s.paper}>
        <strong>输出示例 · 第一行</strong>
        <pre className={s.output}>{outputs.row}</pre>
      </div>
    );
  if (kind === 'split')
    return (
      <div className={s.stack}>
        <div className={s.paper}>
          <span className={s.note}>拆分前 · 一个字符串</span>
          <p>{`"${records[0].demons.join('/')}"`}</p>
        </div>
        <div className={s.paper}>
          <span className={s.note}>拆分后 · 一个名字列表</span>
          <p>[{records[0].demons.map((n) => `"${n}"`).join(', ')}]</p>
        </div>
      </div>
    );
  if (kind === 'explode')
    return (
      <>
        <table className={s.table}>
          <caption>输出示例 · A01 展开成两条关联</caption>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>恶魔</th>
              <th>威胁值</th>
            </tr>
          </thead>
          <tbody>
            {records[0].demons.map((n) => (
              <tr key={n}>
                <td>{records[0].id}</td>
                <td>{n}</td>
                <td>{records[0].threat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  if (kind === 'group' || kind === 'mean') {
    const related = records.filter((r) => r.demons.includes(group));
    const total = related.reduce((a, b) => a + b.threat, 0);
    return (
      <>
        <label className={s.answer}>
          查看哪个分组？
          <select value={group} onChange={(e) => onGroup(e.target.value)}>
            {exampleGroups.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
        <div className={s.paper}>
          <strong>{group}的威胁值记录</strong>
          <div className={s.tokens}>
            {related.map((r) => (
              <span className={s.token} key={r.id} title={r.id}>
                {r.threat}
              </span>
            ))}
          </div>
          {kind === 'mean' && (
            <p className={s.lead}>
              {total} ÷ {related.length} = {(total / related.length).toFixed(1)}
            </p>
          )}
        </div>
      </>
    );
  }
  if (kind === 'rank')
    return (
      <>
        <Ranking limit={4} showCount={false} />
        <p className={s.note}>输出示例节选 · 完整排名包含 9 个对象。</p>
      </>
    );
  if (kind === 'count')
    return <Ranking limit={3} caption="汇总示意 · 平均威胁值与记录次数" />;
  if (kind === 'filter')
    return (
      <>
        <label className={s.answer}>
          至少出现几次？
          <select
            value={minimum}
            onChange={(e) => onMinimum(Number(e.target.value))}
          >
            {[1, 3, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n} 次
              </option>
            ))}
          </select>
        </label>
        <Ranking minimum={minimum} limit={3} />
        <p className={s.note}>
          根据同一份数据演示筛选；左侧代码同步改变。页面不执行 Python。
        </p>
      </>
    );
  return null;
}

export function AggregateScene() {
  const [state, update] = usePageState({ step: 0 });
  const exampleName = '炎角兽';
  const values = records
    .filter((r) => r.demons.includes(exampleName))
    .map((r) => r.threat);
  const total = values.reduce((a, b) => a + b, 0);
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  const medianExplanation =
    sorted.length % 2 === 0
      ? `这里有 ${sorted.length} 个数，中位数是排序后第 ${middle}、${middle + 1} 个数的平均值。`
      : `这里有 ${sorted.length} 个数，中位数是排序后第 ${middle + 1} 个数。`;
  const items = [
    ['mean()', '平均威胁值', (total / values.length).toFixed(1)],
    ['count()', '记录有几条', String(values.length)],
    ['max()', '最高威胁值', String(Math.max(...values))],
    ['min()', '最低威胁值', String(Math.min(...values))],
    ['sum()', '把这些读数相加', String(total)],
    ['median()', '排序后中间的值', median.toFixed(1)],
  ];
  const explanations = [
    'mean() 把读数相加，再除以记录条数，得到平均值。',
    'count() 数这一组有几条非空记录。这里每个读数都有值。',
    'max() 找出这一组最大的读数。',
    'min() 找出这一组最小的读数。',
    'sum() 把这些读数相加；读数之和不表示恶魔的累计伤害。',
    medianExplanation,
  ];
  return (
    <LessonStage title="一组数字，怎样概括？" label="ANALYZE · 切 / 聚合">
      <Tabs
        labels={items.map((x) => x[0])}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={a.aggregateLayout}>
        <figure className={a.story}>
          <Comic />
          <figcaption>
            勇士：“同一组记录，是数次数，还是比较通常有多危险？”
          </figcaption>
        </figure>
        <div className={a.aggregatePanel}>
          <h3>{exampleName}关联进攻的威胁值</h3>
          <div className={s.tokens}>
            {(state.step === 5 ? sorted : values).map((v, i) => (
              <span key={i} className={s.token}>
                {v}
              </span>
            ))}
          </div>
          <output
            className={`${s.paper} ${a.statResult}`}
            aria-label="当前汇总结果"
          >
            <span>{items[state.step][1]}</span>
            <strong className={s.number}>{items[state.step][2]}</strong>
          </output>
        </div>
      </div>
      <Guide>
        聚合把一组数概括成一个结果。不同问题选不同方法，本课重点用 mean 与
        count。
        <br />
        {explanations[state.step]}
      </Guide>
    </LessonStage>
  );
}

export function TrapScene() {
  const [state, update] = usePageState({ choice: '', revealed: false });
  const [reaction, setReaction] = useState({ burst: 0, playing: false });
  const finishReaction = useCallback(
    () => setReaction((current) => ({ ...current, playing: false })),
    [],
  );
  const ranking = rankSuspects();
  const rock = ranking.find((x) => x.name === '岩背魔')!;
  return (
    <LessonStage title="排在第一，就能结案吗？" label="VERIFY · 再问一次">
      <div className={s.balancedLayout}>
        <div className={s.balancedColumn}>
          <Ranking limit={ranking.length} showCount={state.revealed} />
        </div>
        <div className={s.balancedColumn}>
          <TrapReaction
            choice={state.choice}
            burst={reaction.burst}
            playing={reaction.playing}
            onFinish={finishReaction}
          />
          <p className={s.speech}>勇士：“岩背魔平均威胁值最高，它就是首领？”</p>
          <div className={s.actions}>
            {['现在就结案', '先看有几条记录'].map((x) => (
              <button
                key={x}
                aria-pressed={state.choice === x}
                onClick={() => {
                  update({ choice: x, revealed: false });
                  setReaction((current) => ({
                    burst: current.burst + 1,
                    playing: x === '现在就结案',
                  }));
                }}
              >
                {x}
              </button>
            ))}
          </div>
          <button
            disabled={!state.choice}
            onClick={() => {
              finishReaction();
              update({ revealed: true });
            }}
          >
            展开记录次数
          </button>
          <output
            className={s.feedback}
            data-result={
              state.choice
                ? state.choice === '现在就结案'
                  ? 'retry'
                  : 'success'
                : undefined
            }
          >
            {state.revealed ? (
              <>
                {state.choice === '现在就结案'
                  ? '先别着急。'
                  : '这一步很重要。'}
                岩背魔只出现 {rock.count}{' '}
                次；我们要继续核查，不能仅凭平均值确认首领。
              </>
            ) : state.choice === '现在就结案' ? (
              '恶魔在偷笑！单凭平均值还不能结案，先展开记录次数。'
            ) : state.choice ? (
              '抓到核查方向了！看看每个平均值背后有几条记录。'
            ) : (
              '先作出判断，再展开记录次数，用数据核对你的想法。'
            )}
          </output>
        </div>
      </div>
    </LessonStage>
  );
}

export const codeKeys = Object.keys(codeBlocks) as CodeKey[];
export const getPracticeInstruction = (kind: CodeKey) =>
  practiceSteps.find((x) => x.key === kind)?.instruction;
