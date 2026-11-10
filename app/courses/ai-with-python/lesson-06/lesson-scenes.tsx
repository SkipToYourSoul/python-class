/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';
import { useState, type ReactNode } from 'react';
import { FileSpreadsheet, Globe2, Search, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { StoryRecap } from '@/components/course/ai-with-python/story-recap';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { usePageState } from '@/components/course/lesson-state';
import {
  Page,
  Tabs,
  Guide,
  Story,
  Art,
  CodeTools,
  CodeScene,
} from './lesson-ui';
import { BossFinale } from './boss-finale';
import { TowerBattle } from './tower-battle';
import { CoverScene } from './cover-scene';
import { ClassPracticeOne } from './class-practice-one';
import { ClassPracticeTwo } from './class-practice-two';
import { ClassPracticeThree } from './class-practice-three';
import {
  ChartChoice,
  ReadLine,
  ScatterStory,
  ChartCode,
  ChartPlan,
  TowerAssaultStory,
} from './third-section';
import evidence from './analysis-evidence.json';
import { assetBase } from './lesson-data';
import {
  history,
  summary,
  windows,
  plans,
  TEAMS,
  ATTACK_THRESHOLD,
} from './study-data';
import * as code from './practice-content';
import s from './lesson.module.css';
const old = '/courses/ai-with-python';
const stories = [
  {
    lesson: '第一课',
    title: '守门模型',
    introduction: '勇士和小派用已有档案训练模型，帮助城堡辨认新来客。',
    image: `${old}/lesson-03/assets/lesson-01-recap.jpg`,
    steps: ['认识数据', '整理已知档案', '训练模型', '检验新来客'],
    alt: '第一课：勇士和小派整理档案，训练并检验城堡守门模型。',
  },
  {
    lesson: '第二课',
    title: '网页情报',
    introduction: '消息越来越多，勇士让 Python 从网页中取回并提取情报。',
    image: `${old}/lesson-03/assets/lesson-02-recap.jpg`,
    steps: ['发现敌情', '取回网页', '提取记录', '找到弱点'],
    alt: '第二课：取回网页，提取恶魔地点与弱点，准备防御。',
  },
  {
    lesson: '第三课',
    title: '本地档案',
    introduction: '提前保存的情报，在网络中断后继续帮助勇士守城。',
    image: `${old}/lesson-03/assets/diary-defense-cover.jpg`,
    steps: ['保存情报', '网络中断', '读取档案', '再次守城'],
    alt: '第三课：网络中断后，勇士依靠本地保存的情报击退恶魔。',
  },
  {
    lesson: '第四课',
    title: '追查首领',
    introduction: '勇士分析战报，再核对独立证据，终于揭开魔王的伪装。',
    image: `${old}/lesson-04/assets/lesson-04-opening.jpg`,
    steps: ['收集战报', '检查表格', '统计调查', '核对证据'],
    alt: '第四课：机械猫头鹰送来战报，勇士和小派调查恶魔首领。',
  },
  {
    lesson: '第五课',
    title: '带回恶魔图鉴',
    introduction:
      '勇士用图表看清恶魔特点，潜入魔堡带回情报，并从东侧暗门安全撤离。',
    image: `${old}/lesson-05/assets/discovery.jpg`,
    steps: ['观察个体', '寻找联系', '制作图鉴', '带回情报'],
    alt: '第五课：勇士、小派和熊猫博士用图表完成恶魔军团图鉴，为决战做好准备。',
  },
] as const;

function Recap() {
  return (
    <div className={s.recap}>
      <StoryRecap
        stories={stories}
        nextScene="l6-rule"
        continueLabel="进入第六课决战"
      />
    </div>
  );
}
function DataTable({
  caption,
  headers,
  meanings,
  activeColumns = [],
  rows,
}: {
  caption: string;
  headers: string[];
  meanings?: string[];
  activeColumns?: readonly string[];
  rows: ReactNode[][];
}) {
  return (
    <table className={`${s.table} ${meanings ? s.fieldTable : ''}`}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h, index) => (
            <th key={h} scope="col" data-active={activeColumns.includes(h)}>
              {meanings ? (
                <>
                  <code>{h}</code>
                  <span>{meanings[index]}</span>
                </>
              ) : (
                h
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j} data-active={activeColumns.includes(headers[j])}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function Rule() {
  return (
    <Page title="先破三塔，再战魔王" label="BATTLE PLAN · 三塔供能，守卫把关">
      <div className={s.rule}>
        <div className={s.ruleComic}>
          <Art
            kind="battle-rules-comic"
            alt="两格漫画：勇士和小派等待魔塔外罩出现缺口；穿过外罩后，小派查阅图鉴，勇士用强光对付怕光的炎角兽守卫。"
          />
        </div>
        <div className={s.ruleFacts}>
          <div className={s.ruleCard}>
            <span>01 · 突破魔塔外罩</span>
            <h3>先找薄弱时段</h3>
            <strong>外罩强度 &lt; {ATTACK_THRESHOLD}</strong>
            <p>
              低于 {ATTACK_THRESHOLD} 才能突破，等于 {ATTACK_THRESHOLD} 还不行。
            </p>
          </div>
          <div className={s.ruleCard}>
            <span>02 · 击败守塔恶魔</span>
            <h3>再找守卫弱点</h3>
            <p>
              比较防御，选择更容易对付的守卫；
              <br />
              查明弱点，带上克制它的装备。
            </p>
          </div>
        </div>
      </div>
      <Guide>
        三塔不断为魔王恢复护盾。三队要先破外罩，再击守卫。
        <br />
        全部攻塔成功后，才能直面魔王！
      </Guide>
    </Page>
  );
}
function Roadmap() {
  const steps = [
    {
      Icon: Globe2,
      title: '战前准备',
      text: '取回网页，保存情报',
      out: '产出：towers.csv',
      artwork: 'route-prepare',
      edge: 'bottom',
    },
    {
      Icon: Search,
      title: '策略部署',
      text: '检查、统计、筛选、分队',
      out: '产出：三队作战计划',
      artwork: 'route-strategy',
      edge: 'top',
    },
    {
      Icon: FileSpreadsheet,
      title: '三塔交战',
      text: '看时间变化，比较两个强度',
      out: '产出：两张作战图',
      artwork: 'route-towers',
      edge: 'bottom',
    },
    {
      Icon: Flag,
      title: '魔王决战',
      text: '重新取证，完成数据全流程',
      out: '目标：找到护甲突破口',
      artwork: 'route-boss',
      edge: 'top',
    },
  ];
  return (
    <Page title="一份情报，贯穿整场决战" label="MISSION MAP · 数据行动路线">
      <div className={s.route}>
        {steps.map(({ Icon, title, text, out, artwork, edge }, i) => (
          <div className={s.routeCard} data-art-edge={edge} key={title}>
            <img
              className={s.routeArtwork}
              src={`${old}/lesson-06/assets/${artwork}.jpg`}
              alt=""
              aria-hidden="true"
            />
            <div className={s.routeCopy}>
              <Icon aria-hidden />
              <span>0{i + 1}</span>
              <strong>{title}</strong>
              <p>{text}</p>
              <span>{out}</span>
            </div>
          </div>
        ))}
      </div>
      <Guide>
        前三站是三节课；三个塔全部击破后，我们才进入最后的魔王挑战。
      </Guide>
    </Page>
  );
}
function Station() {
  const row = history[4];
  return (
    <Page title="先读懂侦察员的记录" label="INTELLIGENCE · 每一行，是一次侦察">
      <div className={s.stationLayout}>
        <div className={s.record}>
          <div className={s.recordHeader}>情报卡 · {row.guard}</div>
          <div className={s.recordBody}>
            <strong>
              {row.tower} · {row.hour} 时
            </strong>
            <dl>
              <dt>外罩 energy</dt>
              <dd>{row.energy}</dd>
              <dt>防御 defense</dt>
              <dd>{row.defense}</dd>
              <dt>守卫种类</dt>
              <dd>{row.kind}</dd>
              <dt>属性</dt>
              <dd>{row.attribute}</dd>
              <dt>弱点 weakness</dt>
              <dd>{row.weakness}</dd>
            </dl>
          </div>
        </div>
        <div className={s.column}>
          <div className={s.stationComic}>
            <Art
              kind="station-observation"
              alt="机械猫头鹰侦察魔塔外罩和炎角兽守卫，勇士记下时刻与守卫特点，小派用望远镜观察。"
            />
          </div>
          <div className={`${s.panel} ${s.stationFacts}`}>
            <h3>3 座塔 × 12 个时刻</h3>
            <p>6—17 时，每小时一条；含当班守卫及编号。</p>
            <a
              className={s.primary}
              href="/battle-towers.html"
              target="_blank"
              rel="noreferrer"
            >
              打开三塔情报站
            </a>
          </div>
        </div>
      </div>
      <Guide>
        找一找：北塔 10 时，外罩有多强？守卫怕什么？这两个问题分别对应哪一列？
      </Guide>
    </Page>
  );
}
function RawDataPreview() {
  return (
    <Dialog>
      <DialogTrigger className={s.primary}>查看原始数据</DialogTrigger>
      <DialogContent className={s.dataPreview}>
        <DialogHeader>
          <DialogTitle>三塔原始数据</DialogTitle>
          <DialogDescription>
            共 {history.length} 条记录，每行是一座塔在一个时刻的观测。
          </DialogDescription>
        </DialogHeader>
        <div className={s.dataPreviewScroll}>
          <DataTable
            caption="towers.csv · 8 个字段"
            headers={[
              'tower',
              'hour',
              'energy',
              'guard',
              'kind',
              'attribute',
              'weakness',
              'defense',
            ]}
            meanings={[
              '魔塔',
              '时刻',
              '外罩强度',
              '守卫编号',
              '守卫族类',
              '属性',
              '弱点',
              '守卫防御',
            ]}
            rows={history.map((r) => [
              r.tower,
              r.hour,
              r.energy,
              r.guard,
              r.kind,
              r.attribute,
              r.weakness,
              r.defense,
            ])}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Look() {
  return (
    <Page title="望：看清三塔与守卫档案" label="DIAGNOSIS · 数据类型与行列">
      <DataTable
        caption="从 36 条记录中，先认出每座塔的守卫特点"
        headers={['塔', '守卫族类', '属性', '弱点']}
        rows={summary.map((r) => [r.tower, r.kind, r.attribute, r.weakness])}
      />
      <div className={s.grid}>
        <div className={s.classificationCard}>
          <img
            className={s.classificationArt}
            src={`${old}/lesson-06/assets/classification-background.jpg`}
            alt=""
            aria-hidden="true"
          />
          <div className={s.dataKind}>
            <h3>分类数据</h3>
            <p>用来分组、辨认特点</p>
            <div className={s.fieldTags}>
              {['tower', 'kind', 'attribute', 'weakness'].map((field) => (
                <span key={field}>{field}</span>
              ))}
            </div>
          </div>
          <div className={s.dataKind}>
            <h3>数值数据</h3>
            <p>用来计算、比较大小</p>
            <div className={s.fieldTags}>
              {['hour', 'energy', 'defense'].map((field) => (
                <span key={field}>{field}</span>
              ))}
            </div>
          </div>
          <RawDataPreview />
        </div>
        <Guide>
          一行是一座塔在一个时刻的观测。守卫编号 guard
          是身份标记，不能拿来求平均。先问：三队该带什么？何时外罩和守卫都比较弱？
        </Guide>
      </div>
    </Page>
  );
}
const inspectionSteps = [
  {
    name: '1 看前几行',
    title: '读取与预览',
    statement: 'print(towers.head())',
    text: '档案打开了！head 默认显示前 5 条，先核对列名、塔名与读数是否对齐。',
  },
  {
    name: '2 查看 info',
    title: '整体检查',
    statement: 'towers.info()',
    output: evidence.info,
    text: '先验收档案：36 行、8 列，每列都有 36 个非空值，这份情报没有缺失值。',
  },
  {
    name: '3 核对类型',
    title: '每列类型',
    statement: 'print(towers.dtypes)',
    output: evidence.dtypes,
    text: 'dtypes 列出每列类型：int64 是整数；文字列在不同版本可能显示 str 或 object。',
  },
];
function Inspect() {
  const [state, update] = usePageState({ codeStep: 0, inspectionThrough: 0 });
  const stepIndex = Math.min(
    inspectionSteps.length - 1,
    Math.max(0, state.codeStep),
  );
  const through = Math.min(
    inspectionSteps.length - 1,
    Math.max(stepIndex, state.inspectionThrough),
  );
  const step = inspectionSteps[stepIndex];
  const lines = code.INSPECT_CODE.split('\n');
  const visibleCode = lines
    .slice(0, lines.indexOf(inspectionSteps[through].statement) + 1)
    .join('\n');
  return (
    <Page
      tools={<CodeTools code={code.PRACTICE_02_CODE} />}
      title="闻：读回并检查情报"
      label="PYTHON LAB · 代码讲解"
    >
      <div className={s.codeTop}>
        <Tabs
          items={inspectionSteps.map((item) => item.name)}
          value={stepIndex}
          onChange={(codeStep) =>
            update({ codeStep, inspectionThrough: Math.max(through, codeStep) })
          }
        />
      </div>
      <div className={s.codeWithArt}>
        <div className={s.codeColumn}>
          <div
            className={s.inspectionView}
            data-inspection-output={step.output ? true : undefined}
          >
            <NotebookPanel
              title={`第六课练习.ipynb · ${step.title}`}
              compact
              cells={[
                {
                  code: visibleCode,
                  activeLines: [lines.indexOf(step.statement)],
                  output: step.output,
                },
              ]}
            />
            {stepIndex === 0 && (
              <div className={s.inspectionTable}>
                <DataTable
                  caption="head() 输出 · 前 5 条记录"
                  headers={[
                    'tower',
                    'hour',
                    'energy',
                    'guard',
                    'kind',
                    'attribute',
                    'weakness',
                    'defense',
                  ]}
                  rows={history
                    .slice(0, 5)
                    .map((row) => [
                      row.tower,
                      row.hour,
                      row.energy,
                      row.guard,
                      row.kind,
                      row.attribute,
                      row.weakness,
                      row.defense,
                    ])}
                />
              </div>
            )}
          </div>
        </div>
        <div className={s.codeIllustration}>
          <Art
            kind="inspection-comic"
            alt="猫头鹰送来已保存的档案，勇士和小派先查看记录，再核对整份情报是否完整。"
          />
        </div>
      </div>
      <Guide>{step.text}</Guide>
    </Page>
  );
}

const groupSteps = [
  {
    name: '1 按塔和弱点分组',
    lines: ['.groupby('],
    fields: ['tower', 'weakness'],
    text: 'groupby 按 tower（塔）和 weakness（弱点）分组，每组算一份统计。',
  },
  {
    name: '2 比较均值',
    lines: ['energy_mean=', 'defense_mean='],
    fields: ['energy_mean', 'defense_mean'],
    text: 'mean 计算每组的外罩和防御均值，看平时的守备水平。三塔外罩均值都超过 30，还有机会破罩吗？',
  },
  {
    name: '3 清点记录',
    lines: ['count='],
    fields: ['count'],
    text: 'count 数有守卫编号的记录。这里每塔都统计了 12 条。要定出击时刻，还得回到每小时的读数。',
  },
];

function Group() {
  const [state, update] = usePageState({ codeStep: 0 });
  const step = groupSteps[state.codeStep] ?? groupSteps[0];
  const rows = [...summary].sort((a, b) => (a.tower < b.tower ? -1 : 1));
  return (
    <Page
      title="切：先比较三塔整体"
      label="DIAGNOSIS · 分组与统计"
      tools={<CodeTools code={code.PRACTICE_02_CODE} />}
    >
      <div className={s.codeTop}>
        <Tabs
          items={groupSteps.map((item) => item.name)}
          value={state.codeStep}
          onChange={(codeStep) => update({ codeStep })}
        />
        <RawDataPreview />
      </div>
      <div className={s.analysisLesson}>
        <div className={s.column}>
          <NotebookPanel
            title="第六课练习.ipynb"
            compact
            cells={[
              {
                code: code.GROUP_CODE,
                activeLines: linesOf(code.GROUP_CODE, ...step.lines),
              },
            ]}
          />
          <Guide>{step.text}</Guide>
        </div>
        <div className={`${s.column} ${s.groupEvidence}`}>
          <DataTable
            caption="分组输出 · 每组一行"
            headers={[
              'tower',
              'weakness',
              'energy_mean',
              'defense_mean',
              'count',
            ]}
            meanings={['塔', '弱点', '外罩均值', '防御均值', '记录数']}
            activeColumns={step.fields}
            rows={rows.map((r) => [
              r.tower,
              r.weakness,
              r.mean.toFixed(1),
              r.meanDefense.toFixed(1),
              r.count,
            ])}
          />
          <div className={s.groupComic}>
            <Art
              kind="grouping-comic-v2"
              alt="勇士和小派按三座塔把侦察记录分堆，再比较各堆的外罩与守卫强度；时钟提醒他们还要寻找具体时机。"
            />
          </div>
        </div>
      </div>
    </Page>
  );
}

const filterSteps = [
  {
    name: '1 筛外罩',
    lines: ['towers[towers'],
    fields: ['energy'],
    text: '逐条检查 energy（外罩），只保留外罩低于 30 的记录。虽然三塔的外罩均值都超过 30，每塔仍有两次破罩机会。',
  },
  {
    name: '2 塔内排防御',
    lines: ['.sort_values(', '["tower", "defense"]'],
    fields: ['tower', 'defense'],
    text: '先按 tower 把同塔记录排在一起，再按 defense 从低到高排。每塔最上面那一条，守卫防御最低。',
  },
  {
    name: '3 查看输出列',
    lines: ['print(windows', '["tower", "hour"', '"defense", "weakness"'],
    fields: ['hour', 'weakness'],
    text: '输出五列。hour 告诉我们哪一小时能进攻，weakness 告诉我们该带什么装备。',
  },
];

function Filter() {
  const [state, update] = usePageState({ codeStep: 0 });
  const step = filterSteps[state.codeStep] ?? filterSteps[0];
  return (
    <Page
      title="切：筛选薄弱时段"
      label="DIAGNOSIS · 排序与筛选"
      tools={<CodeTools code={code.PRACTICE_02_CODE} />}
    >
      <Tabs
        items={filterSteps.map((item) => item.name)}
        value={state.codeStep}
        onChange={(codeStep) => update({ codeStep })}
      />
      <div className={s.analysisLesson}>
        <div className={s.column}>
          <NotebookPanel
            title="第六课练习.ipynb"
            compact
            cells={[
              {
                code: code.FILTER_CODE,
                activeLines: linesOf(code.FILTER_CODE, ...step.lines),
              },
            ]}
          />
          <Guide>{step.text}</Guide>
        </div>
        <div>
          <DataTable
            caption="候选输出 · 外罩低于 30，按塔和防御排列"
            headers={['tower', 'hour', 'energy', 'defense', 'weakness']}
            meanings={['塔', '时刻', '外罩', '守卫防御', '弱点']}
            activeColumns={step.fields}
            rows={windows.map((r) => [
              r.tower,
              r.hour,
              r.energy,
              r.defense,
              r.weakness,
            ])}
          />
        </div>
      </div>
    </Page>
  );
}
function Deploy() {
  const [state, update] = usePageState({ reveal: false });
  return (
    <Page title="切：把证据变成三队计划" label="DIAGNOSIS · 综合证据行动">
      <div className={s.deploymentGrid}>
        {TEAMS.map((team, index) => {
          const row = plans.find((r) => r.tower === team.tower)!;
          const baseline = summary.find((r) => r.tower === team.tower)!;
          const candidates = windows
            .filter((r) => r.tower === team.tower)
            .sort((a, b) => a.hour - b.hour);
          const alternative = candidates.find((r) => r.hour !== row.hour)!;
          return (
            <div className={`${s.panel} ${s.deploymentCard}`} key={team.tower}>
              <img
                className={s.deploymentArt}
                src={`${old}/lesson-06/assets/${['team-north-background', 'team-east-background', 'team-west-background'][index]}.jpg`}
                alt=""
                aria-hidden="true"
              />
              <span className={s.teamName}>
                {team.name} → {team.tower}
              </span>
              <p className={s.guardianClue}>
                {row.kind} · {row.attribute}属性
              </p>
              <p className={s.baselineClue}>
                外罩均值 {baseline.mean.toFixed(1)} · 防御均值{' '}
                {baseline.meanDefense.toFixed(1)}
              </p>
              <table className={s.deploymentEvidence}>
                <caption>破罩候选 · 外罩 &lt; {ATTACK_THRESHOLD}</caption>
                <thead>
                  <tr>
                    <th scope="col">时刻</th>
                    <th scope="col">外罩</th>
                    <th scope="col">守卫防御</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => (
                    <tr
                      key={candidate.hour}
                      data-chosen={state.reveal && candidate.hour === row.hour}
                    >
                      <th scope="row">{candidate.hour} 时</th>
                      <td>{candidate.energy}</td>
                      <td>{candidate.defense}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={s.weaknessClue}>守卫弱点：{row.weakness}</p>
              <div
                className={s.deploymentDecision}
                data-revealed={state.reveal}
              >
                {state.reveal ? (
                  <>
                    <strong>
                      {row.hour} 时出击 · 携带{team.equipment}
                    </strong>
                    <p>
                      防御 {row.defense} &lt; {alternative.defense}
                      ，也低于均值。
                    </p>
                  </>
                ) : (
                  <>
                    <strong>选哪个时刻？带什么装备？</strong>
                    <p>用上面的读数和弱点说说理由。</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={s.row}>
        <button
          className={s.primary}
          onClick={() => update({ reveal: !state.reveal })}
        >
          {state.reveal ? '收起计划，再讨论' : '对照三队作战计划'}
        </button>
      </div>
      <Guide>
        三塔的外罩均值都超过 {ATTACK_THRESHOLD}，得找准破罩时机。先找外罩低于{' '}
        {ATTACK_THRESHOLD} 的时段，再选守卫防御最低的一条，按弱点配装备。
      </Guide>
    </Page>
  );
}
function Summary() {
  return (
    <div className={s.summaryComic} data-summary-comic>
      <Art
        kind="data-journey-summary"
        imageOnly
        src="/courses/ai-with-python/lesson-06/assets/data-journey-summary.png"
        alt="从数据出发，走向机器学习。第2课数据获取：网页里的情报，取回来！第3课数据存储：存进文件，下次还能读。第4课数据分析：筛选、统计，找到线索。第5课数据可视化：画成图，看出规律。下一阶段机器学习模型：能让机器从数据中学习，判断新情况吗？用已有数据训练模型，再判断新样本。"
      />
    </div>
  );
}
const linesOf = (source: string, ...parts: string[]) =>
  source
    .split('\n')
    .flatMap((line, i) => (parts.some((p) => line.includes(p)) ? [i] : []));

const firstRecord = history[0];
const csvHeader = Object.keys(firstRecord).join(',');
const csvPreview = [csvHeader, Object.values(firstRecord).join(',')].join('\n');
const scrollSections = [
  {
    id: 'title',
    tag: '<h1>',
    label: '侦察站标题',
    html: '<h1>魔堡侦察站 · 战前情报</h1>',
  },
  {
    id: 'notice',
    tag: '<p>',
    label: '破罩提醒',
    html: '<p>外罩强度低于 30 才能破罩；防御力越低越容易突破。按弱点选择装备。</p>',
  },
  {
    id: 'intel-data',
    tag: '<pre id="intel-data">',
    label: '逗号分隔的记录',
    html: `<pre id="intel-data">${csvPreview}\n…</pre>`,
  },
] as const;
const parseCode = `soup = BeautifulSoup(res.text, "html.parser")
element = soup.find("pre", id="intel-data")
csv_text = element.get_text()`;
const parseReference = [code.FETCH_CODE, parseCode, code.SAVE_CODE].join(
  '\n\n',
);
const parseFormula = [
  { title: '根据属性', example: 'id="intel-data"' },
  { title: '寻找元素', example: 'find("pre", …)' },
  { title: '获取文本', example: 'get_text()' },
];

function SourceExcerpt({ children }: { children: string }) {
  return (
    <pre>
      <code>
        {children.split(/([,>])/).map((part, index) => (
          <span key={index}>
            {part}
            {(part === ',' || part === '>') && <wbr />}
          </span>
        ))}
      </code>
    </pre>
  );
}

function ParseIntel() {
  const [state, update] = usePageState({
    parseSelection: '',
    parseExtracted: false,
  });
  const [cue, setCue] = useState(0);
  const selection = scrollSections.find(
    ({ id }) => id === state.parseSelection,
  );
  const located = state.parseSelection === 'intel-data';
  const extracted = located && state.parseExtracted;
  const activeStep = extracted ? 3 : located ? 2 : 1;
  const comicBeat = extracted
    ? 'lift'
    : located
      ? 'spot'
      : selection
        ? 'retry'
        : 'read';
  const comicCaption = {
    read: '小派和勇士检查卷轴',
    retry: '小派和勇士继续寻找',
    spot: '小派发现正文所在的区域',
    lift: '小派和勇士举起三塔情报',
  }[comicBeat];

  let explanation = '先看 id 属性。找一找哪块区域的 id 是 intel-data。';
  if (extracted) {
    explanation = 'get_text() 取出 element 里的文字，整份情报存进 csv_text。';
  } else if (located) {
    explanation = 'find() 找到 id 匹配的 <pre> 元素，把它存进 element。';
  } else if (state.parseSelection) {
    explanation = '看一下这段 HTML 的起始标签。它有 id="intel-data" 吗？';
  }

  return (
    <Page
      tools={<CodeTools code={parseReference} />}
      title="从网页中提取整份情报"
      label="PYTHON LAB · 代码讲解"
    >
      <div className={s.codeWithArt}>
        <div className={s.codeColumn}>
          <NotebookPanel
            title="第六课练习.ipynb"
            compact
            cells={[{ code: parseCode, activeLines: [extracted ? 2 : 1] }]}
          />
          <section className={s.parseWorkbench} aria-label="情报工作台">
            <p>卷轴里的哪一块装着整份三塔情报？</p>
            <fieldset className={s.parseSections} aria-label="网页结构示意">
              {scrollSections.map(({ id, tag, label }) => (
                <button
                  key={id}
                  type="button"
                  className={s.choice}
                  aria-pressed={state.parseSelection === id}
                  data-located={located && state.parseSelection === id}
                  onClick={() => {
                    setCue((value) => value + 1);
                    if (state.parseSelection !== id) {
                      update({ parseSelection: id, parseExtracted: false });
                    }
                  }}
                >
                  <code>{tag}</code>
                  <span>{label}</span>
                </button>
              ))}
            </fieldset>
            <button
              type="button"
              className={`${s.primary} ${s.parseAction}`}
              disabled={!located}
              onClick={() => {
                setCue((value) => value + 1);
                update({ parseExtracted: true });
              }}
            >
              {extracted ? '重播提取' : '取出文字'}
            </button>
            {selection && (
              <div className={s.parseEvidence} data-extracted={extracted}>
                <section
                  className={s.parseSource}
                  aria-label="选中的 HTML 代码"
                >
                  <strong>{located ? 'HTML 代码节选' : 'HTML 代码'}</strong>
                  <SourceExcerpt>{selection.html}</SourceExcerpt>
                </section>
                {extracted && (
                  <section
                    key={cue}
                    className={s.parsePreview}
                    data-pull={cue > 0}
                    aria-label="CSV 情报卡"
                  >
                    <strong>CSV 情报卡 · {history.length} 条中预览首条</strong>
                    <SourceExcerpt>{csvPreview}</SourceExcerpt>
                  </section>
                )}
              </div>
            )}
          </section>
        </div>
        <div className={s.parseSidebar}>
          <figure className={s.parseComic} data-beat={comicBeat}>
            <div key={cue} className={s.parseFrame} data-motion={cue > 0}>
              <Art
                kind="parse-extract"
                alt="小派先检查网页的结构，再定位并单独取出三塔情报正文。"
              />
            </div>
            <figcaption>{comicCaption}</figcaption>
          </figure>
          <section className={s.parseFormula} aria-label="第二课的解析公式">
            <strong>第二课 · 解析公式</strong>
            <ol>
              {parseFormula.map(({ title, example }, index) => (
                <li
                  key={title}
                  aria-current={activeStep === index + 1 ? 'step' : undefined}
                >
                  <span>
                    <b>0{index + 1}</b> {title}
                  </span>
                  <code>{example}</code>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
      <Guide>
        <output>{explanation}</output>
      </Guide>
    </Page>
  );
}

const codeComics = {
  'fetch-message': {
    label: '三塔情报收发漫画',
    panels: [
      {
        title: '01 发出请求',
        caption: '猫头鹰飞往情报站',
        alt: '小派向三塔情报站发出请求，机械猫头鹰带着请求出发。',
      },
      {
        title: '02 核对回信',
        caption: '猫头鹰带回网页',
        alt: '机械猫头鹰带回装有三塔记录的网页，勇士和小派查看回信。',
      },
    ],
  },
  'save-code-comic': {
    label: '情报归档漫画',
    panels: [
      {
        title: '01 打开档案',
        caption: '情报仍在手中',
        alt: '小派打开空档案，勇士拿着三塔情报。',
      },
      {
        title: '02 写入正文',
        caption: '情报已归档',
        alt: '勇士把三塔情报放进小派打开的档案。',
      },
    ],
  },
} as const;

function CodeComic({
  kind,
  active,
}: {
  kind: keyof typeof codeComics;
  active: 0 | 1;
}) {
  const { label, panels } = codeComics[kind];
  return (
    <div className={s.codeComic} data-comic={kind} aria-label={label}>
      {panels.map(({ title, caption, alt }, index) => (
        <figure
          key={title}
          aria-current={active === index ? 'step' : undefined}
        >
          <div className={s.comicFrame}>
            <img src={`${assetBase}/assets/${kind}.jpg`} alt={alt} />
          </div>
          <figcaption>
            <strong>{title}</strong>
            <span>{caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function LessonScenes({ id }: { id: string }) {
  switch (id) {
    case 'l6-cover':
      return <CoverScene />;
    case 'l6-recap':
      return <Recap />;
    case 'l6-rule':
      return <Rule />;
    case 'l6-roadmap':
      return <Roadmap />;
    case 'l6-collect-cover':
      return (
        <ChapterCover
          number="01"
          title="战前作战准备"
          kicker="DATA MISSION · 获取与存储"
          task={
            <>
              带回三塔 36 条侦察记录，
              <br />
              保存成自己的本地情报档案。
            </>
          }
        />
      );
    case 'l6-station':
      return <Station />;
    case 'l6-fetch':
      return (
        <CodeScene
          title="让 Python 取回情报"
          complete={code.PRACTICE_01_CODE}
          before="先解压整个练习包，打开 Notebook，运行预置环境格。"
          steps={[
            {
              name: '1 发出请求',
              code: code.FETCH_CODE,
              lines: linesOf(code.FETCH_CODE, 'url =', 'requests.get'),
              storyboard: <CodeComic kind="fetch-message" active={0} />,
              text: (
                <>url 保存三塔情报站的网址，requests.get 按这个地址取回网页。</>
              ),
            },
            {
              name: '2 核对回信',
              code: code.FETCH_CODE,
              lines: linesOf(code.FETCH_CODE, 'raise_for_status', 'encoding'),
              storyboard: <CodeComic kind="fetch-message" active={1} />,
              text: (
                <>
                  先确认请求成功，再按 UTF-8 读取中文。res.text
                  就是取回的网页源码。
                </>
              ),
            },
          ]}
        />
      );
    case 'l6-parse-story':
      return (
        <Story
          title="一封信里，装着三十六条情报"
          kind="parse-story-v2"
          panoramic
          alt="猫头鹰带回网页卷轴；勇士发现标题和装饰混在记录周围，小派指向其中真正需要的三塔情报表。"
          quote="网页已经取回，三塔的记录就藏在里面。"
          question="标题、说明、表格混在一起，怎样只提取情报正文？"
        />
      );
    case 'l6-parse':
      return <ParseIntel />;
    case 'l6-save-story':
      return (
        <Story
          title="出发前，先把情报存好"
          kind="save-story-v2"
          panoramic
          alt="勇士出发前回头寻找情报，小派把三塔记录存入电脑文件夹；出城后，两人重新打开保存的档案。"
          quote="作战会议和前线指挥都要用这批记录。"
          question="把它留在电脑里，下次就能直接读取，而不用重新手抄。"
        />
      );
    case 'l6-save':
      return (
        <CodeScene
          title="把情报写入 CSV"
          complete={code.PRACTICE_01_CODE}
          steps={[
            {
              name: '1 打开档案',
              code: code.SAVE_CODE,
              lines: linesOf(code.SAVE_CODE, 'open', 'encoding'),
              storyboard: <CodeComic kind="save-code-comic" active={0} />,
              text: 'w 模式会新建文件，或清空已有的同名文件。这时 towers.csv 还是空的。',
            },
            {
              name: '2 写入正文',
              code: code.SAVE_CODE,
              lines: linesOf(code.SAVE_CODE, 'f.write'),
              storyboard: <CodeComic kind="save-code-comic" active={1} />,
              text: '把 csv_text 写进文件，用 UTF-8 保留中文。打开 towers.csv，核对首行的 8 个列名和下面的 36 行记录。',
              output: '情报已保存：towers.csv',
            },
          ]}
        />
      );
    case 'l6-practice-01':
      return <ClassPracticeOne />;
    case 'l6-analyze-cover':
      return (
        <ChapterCover
          number="02"
          title={
            <>
              部署三队
              <br />
              作战策略
            </>
          }
          kicker="DATA DIAGNOSIS · 望闻问切"
          task={
            <>
              分析守卫与外罩，把勇士分成三队，
              <br />
              为每队确定目标、时机和装备。
            </>
          }
        />
      );
    case 'l6-strategy-story':
      return (
        <Story
          title="守卫不同，打法也要不同"
          kind="strategy-v2"
          panoramic
          alt="勇士、小派与熊猫博士比较三塔守卫和多时刻记录，在地图上分配三支队伍"
          quote="北塔是炎角兽，东塔是藤甲魔，西塔是冰翼魔。三队照同一个办法进攻，行吗？"
          question="再用一次第四课的望闻问切，为每队找证据。"
        />
      );
    case 'l6-look':
      return <Look />;
    case 'l6-read':
      return <Inspect />;
    case 'l6-mean':
      return <Group />;
    case 'l6-filter':
      return <Filter />;
    case 'l6-deploy':
      return <Deploy />;
    case 'l6-practice-02':
      return <ClassPracticeTwo />;
    case 'l6-command-cover':
      return (
        <ChapterCover
          number="03"
          title={
            <>
              用图表攻破
              <br />
              三座魔塔
            </>
          }
          kicker="DATA ACTION · 可视化与战斗"
          task={
            <>
              用折线图找时段，用散点图比强弱，
              <br />
              指挥三支队伍攻破全部魔塔。
            </>
          }
        />
      );
    case 'l6-assault-story':
      return (
        <Story
          title="北塔外罩更薄，为什么还要等？"
          kind="chart-mission-v2"
          panoramic
          alt="勇士难以让三队共读长表格，小派把记录变成两张图，信使带着图表向三塔出发，等待核对后出击。"
          quote="曙光队战士：「北塔 10 时的外罩更弱，为什么命令写的是 11 时？」"
          question="小派：「我们把情报画成图，让每一队都能看懂自己的命令。」"
        />
      );
    case 'l6-chart-choice':
      return <ChartChoice />;
    case 'l6-line-story':
      return <ReadLine />;
    case 'l6-line':
      return <ChartCode kind="history" />;
    case 'l6-scatter-story':
      return <ScatterStory />;
    case 'l6-scatter':
      return <ChartCode kind="guards" />;
    case 'l6-practice-03':
      return <ClassPracticeThree />;
    case 'l6-chart-plan':
      return <ChartPlan />;
    case 'l6-tower-battle':
      return <TowerBattle />;

    case 'l6-latest':
      return <TowerAssaultStory />;
    case 'l6-final-mission':
      return <BossFinale />;
    default:
      return <Summary />;
  }
}
