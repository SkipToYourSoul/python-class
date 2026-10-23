/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';
import type { ReactNode } from 'react';
import { FileSpreadsheet, Globe2, Search, Flag } from 'lucide-react';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { StoryRecap } from '@/components/course/ai-with-python/story-recap';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { usePageState } from '@/components/course/lesson-state';
import {
  Page,
  Guide,
  Story,
  Art,
  CodeTools,
  CodeScene,
  Jump,
} from './lesson-ui';
import { FinalBattle } from './final-battle';
import { TowerBattle } from './tower-battle';
import { CoverScene } from './cover-scene';
import { PracticeCode } from './practice-code';
import { ClassPracticeOne } from './class-practice-one';
import { ClassPracticeTwo } from './class-practice-two';
import { ClassPracticeThree } from './class-practice-three';
import {
  ChartChoice,
  ReadLine,
  ScatterStory,
  ChartCode,
  ChartPlan,
  TowerAftermath,
} from './third-section';
import evidence from './analysis-evidence.json';
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
  rows,
}: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <table className={s.table}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
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
        </div>
        <Guide>
          一行是一座塔在一个时刻的观测。守卫编号 guard
          是身份标记，不能拿来求平均。先问：三队该带什么？何时外罩和守卫都比较弱？
        </Guide>
      </div>
    </Page>
  );
}
const selectedInspectionCode = (...parts: string[]) =>
  code.INSPECT_CODE.split('\n')
    .filter((line) => parts.some((part) => line.includes(part)))
    .join('\n');
function Inspect() {
  return (
    <CodeScene
      title="闻：读回并检查情报"
      complete={code.PRACTICE_02_CODE}
      illustration={{
        kind: 'inspection-comic',
        alt: '猫头鹰送来已保存的档案，勇士和小派先查看记录，再核对整份情报是否完整。',
      }}
      steps={[
        {
          name: '1 看前几行',
          code: code.INSPECT_CODE,
          text: (
            <>
              档案打开了！head 默认显示前 5 条，先核对列名、塔名与读数是否对齐。
            </>
          ),
          view: (
            <div className={s.inspectionView}>
              <NotebookPanel
                title="第六课练习.ipynb · 读取与预览"
                compact
                cells={[
                  {
                    code: selectedInspectionCode(
                      'import',
                      'read_csv',
                      '.head()',
                    ),
                  },
                ]}
              />
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
            </div>
          ),
        },
        {
          name: '2 查看 info',
          code: code.INSPECT_CODE,
          view: (
            <div className={s.inspectionView}>
              <NotebookPanel
                title="第六课练习.ipynb · 整体检查"
                compact
                cells={[
                  {
                    code: selectedInspectionCode('.info()'),
                    output: evidence.info,
                  },
                ]}
              />
            </div>
          ),
          text: '先验收档案：36 行、8 列，每列都有 36 个非空值，这份情报没有缺失值。',
        },
        {
          name: '3 核对类型',
          code: code.INSPECT_CODE,
          text: (
            <>
              dtypes 列出每列类型：int64 是整数；文字列在不同版本可能显示 str 或
              object。
            </>
          ),
          view: (
            <div className={s.inspectionView}>
              <NotebookPanel
                title="第六课练习.ipynb · 每列类型"
                compact
                cells={[
                  {
                    code: selectedInspectionCode('.dtypes'),
                    output: evidence.dtypes,
                  },
                ]}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
function Group() {
  return (
    <Page title="切：先比较三塔整体" label="DIAGNOSIS · 分组与统计">
      <div className={s.analysisLesson}>
        <div className={s.column}>
          <NotebookPanel
            title="第六课练习.ipynb"
            compact
            cells={[{ code: code.GROUP_CODE }]}
          />
          <CodeTools code={code.PRACTICE_02_CODE} />
        </div>
        <div className={`${s.column} ${s.groupEvidence}`}>
          <DataTable
            caption="输出节选 · 每塔 12 条记录"
            headers={['塔', '外罩均值', '防御均值']}
            rows={summary.map((r) => [
              r.tower,
              r.mean.toFixed(1),
              r.meanDefense.toFixed(1),
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
      <Guide>
        先把三塔记录分开，再用 mean 求平均、count
        数记录。整体强弱看清了，还要找出具体进攻时刻。
      </Guide>
    </Page>
  );
}
function Filter() {
  return (
    <Page title="切：筛选薄弱时段" label="DIAGNOSIS · 排序与筛选">
      <div className={s.analysisLesson}>
        <div className={s.column}>
          <NotebookPanel
            title="第六课练习.ipynb"
            compact
            cells={[{ code: code.FILTER_CODE }]}
          />
          <Guide>
            先问“哪些记录的外罩低于
            30？”再在每座塔内按防御从低到高排列。同一座塔有两个候选时段，先比较，再选计划。
          </Guide>
          <CodeTools code={code.PRACTICE_02_CODE} />
        </div>
        <DataTable
          caption="输出节选 · 比较守卫防御"
          headers={['塔', '时刻', '外罩', '防御']}
          rows={windows.map((r) => [
            r.tower,
            `${r.hour} 时`,
            r.energy,
            r.defense,
          ])}
        />
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
                      都能破罩，防御 {row.defense} &lt; {alternative.defense}。
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
        先筛外罩 &lt; {ATTACK_THRESHOLD}{' '}
        的时段，再选守卫防御较低的时刻，最后按弱点配装备。北塔外罩最低的时刻，一定最适合出击吗？
      </Guide>
    </Page>
  );
}
function FinalMission() {
  return (
    <Page
      title="最终挑战：找到魔王的突破口"
      label="FINAL CHALLENGE · 三队会合，重新取证"
    >
      <div className={s.grid}>
        <Art
          kind="boss-reveal"
          alt="三座塔熄灭，魔王失去护盾，勇士与小派观察新送来的护甲情报"
        />
        <div className={`${s.column} ${s.center}`}>
          <div className={s.panel}>
            <h3>这次是 9 个护甲部位</h3>
            <p>① 获取新网页，保存 boss.csv。</p>
            <p>② 筛选外罩低于 30 的部位。</p>
            <p>③ 画散点图，找到防御最低的突破口。</p>
            <p>④ 核对弱点，选择装备出击。</p>
          </div>
          <div className={s.row}>
            <a
              className={s.primary}
              href="/boss-intel.html"
              target="_blank"
              rel="noreferrer"
            >
              查看魔王情报
            </a>
            <Jump id="l6-current">开始综合挑战</Jump>
          </div>
          <Guide>
            塔的历史记录不能替魔王作证。请重新走完获取、存储、分析、可视化，再用新证据指挥最后一击。
          </Guide>
        </div>
      </div>
    </Page>
  );
}
function Summary() {
  return (
    <Page title="用数据，完成这场决战" label="STAGE PROJECT · 数据全流程回顾">
      <div className={s.summaryStory}>
        <Art
          kind="victory"
          alt="勇士、小派、熊猫博士和机械猫头鹰围着档案和图表庆祝"
        />
      </div>
      <div className={s.summaryLower}>
        <div className={s.badges}>
          <span>
            <Globe2 size={22} />
            获取情报
          </span>
          <span>
            <FileSpreadsheet size={22} />
            存储档案
          </span>
          <span>
            <Search size={22} />
            分析证据
          </span>
          <span>
            <Flag size={22} />
            可视化决策
          </span>
        </div>
        <Guide>
          说说看：哪条数据改变了你的作战计划？我们把网页变成档案、统计和图表，再把证据变成行动。
        </Guide>
      </div>
    </Page>
  );
}
const linesOf = (source: string, ...parts: string[]) =>
  source
    .split('\n')
    .flatMap((line, i) => (parts.some((p) => line.includes(p)) ? [i] : []));
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
          illustration={{
            kind: 'fetch-message',
            alt: '小派向情报站发出请求，机械猫头鹰随后带回装着三塔记录的网页。',
          }}
          steps={[
            {
              name: '1 发出请求',
              code: code.FETCH_CODE,
              lines: linesOf(code.FETCH_CODE, 'url =', 'requests.get'),
              text: (
                <>url 保存三塔情报站的网址，requests.get 按这个地址取回网页。</>
              ),
            },
            {
              name: '2 核对回信',
              code: code.FETCH_CODE,
              lines: linesOf(code.FETCH_CODE, 'raise_for_status', 'encoding'),
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
      return (
        <CodeScene
          title="从网页中提取整份情报"
          complete={code.PRACTICE_01_CODE}
          illustration={{
            kind: 'parse-extract',
            alt: '小派先检查网页的结构，再定位并单独取出三塔情报正文。',
          }}
          steps={[
            {
              name: '1 读懂网页结构',
              code: code.PARSE_CODE,
              lines: linesOf(code.PARSE_CODE, 'BeautifulSoup'),
              text: (
                <>
                  BeautifulSoup 把网页源码变成可以查找的结构。情报站把完整 CSV
                  正文放在 id 为 intel-data 的区域。
                </>
              ),
            },
            {
              name: '2 找到并取出正文',
              code: code.PARSE_CODE,
              lines: linesOf(code.PARSE_CODE, 'find', 'get_text'),
              text: (
                <>
                  find 定位 intel-data 区域，get_text 取出正文。csv_text
                  中保留列名和 36 条侦察记录。
                </>
              ),
              output:
                'tower,hour,energy,guard,kind,attribute,weakness,defense\n北塔,6,72,G001,炎角兽族,火焰,强光,78\n…',
            },
          ]}
        />
      );
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
              text: (
                <>
                  用 w 模式创建或覆盖 towers.csv，UTF-8 保存中文塔名和弱点。CSV
                  的第一行是列名，每条记录占一行。
                </>
              ),
            },
            {
              name: '2 写入正文',
              code: code.SAVE_CODE,
              lines: linesOf(code.SAVE_CODE, 'f.write'),
              text: (
                <>
                  f.write 把刚提取的 csv_text 真正写进文件。到 Notebook
                  的文件列表打开 towers.csv，核对 8 列、36 条记录。
                </>
              ),
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
          title="队伍出发，先让图表指路"
          kind="chart-mission-v2"
          panoramic
          alt="勇士难以让三队共读长表格，小派把记录变成两张图，信使带着图表向三塔出发，等待核对后出击。"
          quote="三支队伍已经出发！厚厚的表格，怎样变成全队一眼能懂的作战图？"
          question="图表要回答两件事：何时外罩薄弱，守卫防御又有多强。"
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
      return <TowerAftermath />;
    case 'l6-final-mission':
      return <FinalMission />;
    case 'l6-current':
      return <PracticeCode number="current" />;
    case 'l6-battle':
      return <FinalBattle />;
    default:
      return <Summary />;
  }
}
