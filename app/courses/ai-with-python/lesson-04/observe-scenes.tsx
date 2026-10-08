/* oxlint-disable next/no-img-element -- Local comic recap and course artwork. */
'use client';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  Comic,
  Guide,
  LessonStage,
  Portrait,
  PracticeTools,
  RecordTable,
  Tabs,
} from './lesson-ui';
import { records, suspects, THREAT_RULE } from './investigation-data';
import s from './lesson.module.css';

export function Opening() {
  return (
    <LessonStage title="城堡守住了，谁在指挥？" label="MISSION · 接下调查任务">
      <div className={s.two}>
        <div className={`${s.stack} ${s.center}`}>
          <img
            className={s.missionArt}
            src="/courses/ai-with-python/lesson-04/assets/mission-briefing.png"
            alt="机械猫头鹰送来厚厚的进攻战报，勇士接过档案，小派指向电脑上的记录表，准备一起寻找线索"
            width={1448}
            height={1086}
          />
          <p className={s.note}>机械猫头鹰：“各地哨塔的战报都在这里！”</p>
        </div>
        <div className={`${s.stack} ${s.center}`}>
          <p className={s.lead}>
            36 次进攻，9 个调查对象。
            <br />
            谁值得优先追踪？
          </p>
          <RecordTable compact />
          <p>每条记录，都是一次进攻留下的线索。</p>
        </div>
      </div>
      <Guide>
        第三课查地点和弱点，这次要比较历次进攻。旧记录不代表现在的位置；谁在指挥，要找证据！
      </Guide>
    </LessonStage>
  );
}
export function SuspectsScene() {
  const [state, update] = usePageState({ page: 1 });
  return (
    <LessonStage
      title="先认识调查名单"
      label="CASE FILE · 九个调查对象"
      footer={
        <Tabs
          labels={['三只老恶魔', '六只新面孔']}
          value={state.page}
          onChange={(page) => update({ page })}
        />
      }
    >
      {state.page === 0 ? (
        <div className={s.oldRoster}>
          <img
            src="/courses/ai-with-python/lesson-03/assets/archive-siege/demons.png"
            alt="炎角兽是熔岩公牛、藤甲魔是藤叶重甲兽、冰翼魔是冰晶双翼龙"
          />
          <div className={s.stack}>
            {suspects.slice(0, 3).map((x) => (
              <div key={x.name}>
                <h3>{x.name}</h3>
                <p>{x.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={s.roster}>
          {suspects.slice(3).map((x) => (
            <div className={s.suspect} key={x.name}>
              <Portrait name={x.name} />
              <div>
                <strong>{x.name}</strong>
                <p>{x.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <Guide>
        它们虽被击退，过去的记录仍可调查。外表只能认名字，谁在指挥要看证据。
      </Guide>
    </LessonStage>
  );
}
export function Roadmap() {
  return (
    <LessonStage
      title="跟着《唐探1900》学探案"
      label="CINEMA · 从电影到数据调查"
    >
      <div className={s.movieLead}>
        <figure className={s.moviePoster}>
          <img
            src="/courses/ai-with-python/lesson-04/assets/tang-detective-1900-poster.jpg"
            alt="电影《唐探1900》官方宣传海报：红金色画面中，侦探与众多人物共同亮相"
            width={750}
            height={1063}
          />
          <figcaption>《唐探1900》电影海报</figcaption>
        </figure>
        <div className={s.movieMethods}>
          <p className={s.movieIntro}>
            电影把中医的“望闻问切”化用为探案思路。
            <br />
            我们也借这四个字，调查恶魔的进攻数据。
          </p>
          <div className={s.methodList} aria-label="本课的数据调查方法">
            {[
              ['望', '看懂战报', '观察数据类型、行与列'],
              ['闻', '读取线索', '用 Python 读入、检查与选列'],
              ['问', '追问依据', '数据能回答什么？证据够吗？'],
              ['切', '动手分析', '展开、分组、统计与核对'],
            ].map(([method, title, detail]) => (
              <div className={s.movieMethod} data-method={method} key={method}>
                <b>{method}</b>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className={s.methodNote}>
            三节课程：望 → 闻 → 切<br />
            <strong>“问”贯穿每一步调查。</strong>
          </p>
        </div>
      </div>
    </LessonStage>
  );
}
const fields = [
  {
    name: '地点',
    value: records[0].place,
    kind: 0,
    reason: '地点表示类别，适合分组。',
  },
  {
    name: '威胁值',
    value: String(records[0].threat),
    kind: 1,
    reason: '统一量尺上的读数，可以比较与计算平均值。',
  },
  {
    name: '记录编号',
    value: records[0].id,
    kind: 0,
    reason: '编号用来区分记录；即使写成数字，也不表示多少。',
  },
  {
    name: '持续分钟数',
    value: String(records[0].minutes),
    kind: 1,
    reason: '表示持续的时间长度，可以计算。',
  },
];
export function TypesScene() {
  const [state, update] = usePageState({
    field: 0,
    choices: {} as Record<number, number>,
    revealed: {} as Record<number, boolean>,
  });
  const f = fields[state.field];
  return (
    <LessonStage title="哪些能分类，哪些能计算？" label="LOOK · 望 / 数据类型">
      <div className={s.typeLayout}>
        <div className={s.typeStory}>
          <Comic />
          <p className={s.speech}>
            勇士：“能不能把地点和威胁值，都加起来求平均？”
          </p>
          <Guide>
            先看这个值表示什么。分类数据用来分组；数值数据表示数量或测量结果。
          </Guide>
        </div>
        <div className={s.stack}>
          <Tabs
            labels={fields.map((x) => x.name)}
            value={state.field}
            onChange={(field) => update({ field })}
          />
          <div className={s.paper}>
            <p>{f.name}</p>
            <strong className={s.number}>{f.value}</strong>
            <div className={s.actions}>
              {['分类／标识', '数值数据'].map((x, i) => (
                <button
                  key={x}
                  aria-pressed={state.choices[state.field] === i}
                  onClick={() =>
                    update({
                      choices: { ...state.choices, [state.field]: i },
                      revealed: { ...state.revealed, [state.field]: false },
                    })
                  }
                >
                  {x}
                </button>
              ))}
            </div>
            <button
              disabled={state.choices[state.field] === undefined}
              onClick={() =>
                update({ revealed: { ...state.revealed, [state.field]: true } })
              }
            >
              核对理由
            </button>
          </div>
          <output
            className={`${s.feedback} ${s.typeFeedback}`}
            aria-live="polite"
          >
            {state.revealed[state.field] ? (
              <span>
                {state.choices[state.field] === f.kind
                  ? '判断正确。'
                  : '再想一想。'}
                {f.reason}
              </span>
            ) : (
              <span>先选一种类型，再核对你的判断理由。</span>
            )}
          </output>
        </div>
      </div>
    </LessonStage>
  );
}
export function TableScene() {
  const [state, update] = usePageState({ step: 0 });
  const focus = ['行', '地点', '值'][state.step];
  return (
    <LessonStage
      title="一行、一列、一个值"
      label="LOOK · 望 / 表格结构"
      footer={
        <Tabs
          labels={['横看一行', '竖看一列', '看一个单元格']}
          value={state.step}
          onChange={(step) => update({ step })}
        />
      }
    >
      <p className={s.speech}>小派：“先说清楚，一条战报到底记了一件什么事？”</p>
      <RecordTable focus={focus} />
      <Guide>
        {
          [
            '一行是一场进攻：编号、地点、出现的恶魔和读数都属于这一场。',
            '一列记录同一个方面。地点这一列，告诉我们每场进攻发生在哪里。',
            '一个单元格放这个字段的一个值。这里的威胁值属于整场进攻。',
          ][state.step]
        }
        <br />
        {THREAT_RULE}
      </Guide>
    </LessonStage>
  );
}
export function StructureScene() {
  const [state, update] = usePageState({ show: false });
  return (
    <LessonStage title="同样的记录，怎样更好找？" label="LOOK · 望 / 整理结构">
      <div className={s.typeLayout}>
        <div className={s.typeStory}>
          <Comic />
          <p className={s.speech}>
            勇士：“名字、地点和读数挤在一起，怎么比较两次进攻？”
          </p>
          <Guide>把同一类信息排成列，查找与比较就方便多了。</Guide>
        </div>
        <div className={s.typeStory}>
          <div className={s.structureViews}>
            <div
              className={`${s.paper} ${s.structureView}`}
              aria-hidden={state.show}
              inert={state.show}
            >
              {records.slice(0, 2).map((r) => (
                <p key={r.id}>
                  {r.id}：{r.place}，{r.demons.join('、')}，威胁值 {r.threat}。
                </p>
              ))}
            </div>
            <div
              className={`${s.stack} ${s.structureView}`}
              aria-hidden={!state.show}
              inert={!state.show}
            >
              <RecordTable items={records.slice(0, 2)} />
              <p className={s.feedback}>
                同场多个名字暂时放在一起，稍后再拆开分析。
              </p>
            </div>
          </div>
          <button onClick={() => update({ show: !state.show })}>
            {state.show ? '再看原记录' : '把同一类信息排成列'}
          </button>
        </div>
      </div>
    </LessonStage>
  );
}
export function PandasScene() {
  return (
    <LessonStage title="请来处理表格的帮手" label="SMELL · 闻 / Pandas">
      <div className={s.balancedLayout}>
        <div className={s.balancedColumn}>
          <Comic />
          <p className={s.speech}>勇士：“36 条记录，一条条翻会漏掉线索。”</p>
          <Guide>
            Pandas 是 Python 的数据分析工具包，能帮我们读表、选列和统计。
          </Guide>
        </div>
        <div className={s.balancedColumn}>
          <div className={s.paper}>
            <strong className={s.lead}>CSV 文件 → DataFrame</strong>
            <RecordTable
              items={records.slice(0, 2)}
              full
              caption="df · 前 2 行，全部 5 列"
            />
          </div>
          <p>DataFrame：带有行、列标签的二维表格。</p>
          <Guide>
            在练习文件夹打开 JupyterLab，选择 Python
            内核。练习包内有环境说明；本课需要安装 pandas。
          </Guide>
          <PracticeTools />
        </div>
      </div>
    </LessonStage>
  );
}
export function SeriesScene() {
  const [state, update] = usePageState({ step: 0 });
  return (
    <LessonStage
      title="用代码取出一列"
      label="SMELL · 闻 / 从 DataFrame 取出 Series"
      footer={
        <Tabs
          labels={['整张表', '取出一列']}
          value={state.step}
          onChange={(step) => update({ step })}
        />
      }
    >
      <div className={s.balancedLayout}>
        <div className={s.balancedColumn}>
          <Comic className={s.miniComic} />
          <NotebookPanel
            title="第四课练习.ipynb"
            cells={[{ code: state.step === 0 ? 'df' : 'df["威胁值"]' }]}
          />
        </div>
        <div className={s.balancedColumn}>
          {state.step === 0 ? (
            <>
              <h3>DataFrame：二维表格</h3>
              <RecordTable
                items={records.slice(0, 3)}
                full
                caption="df · 前 3 行，全部 5 列"
              />
            </>
          ) : (
            <>
              <h3>Series：带索引的一维数据</h3>
              <table className={s.table}>
                <caption>输出示例 · 前 3 项节选</caption>
                <thead>
                  <tr>
                    <th>索引</th>
                    <th className={s.highlight}>威胁值</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 3).map((r, i) => (
                    <tr key={r.id}>
                      <td>{i}</td>
                      <td className={s.highlight}>{r.threat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <Guide>
        {state.step === 0 ? (
          <>
            在单元格最后写 <strong>df</strong>
            ，就能查看整张表。右边保留全部五列，只节选前三行。完整表有{' '}
            <strong>36 行、5 列</strong>。
          </>
        ) : (
          <>
            <strong>{'df["威胁值"]'}</strong> 取出这一列，得到{' '}
            <strong>Series</strong>。看，数值带着索引一起保留下来了，原来的 df
            仍有五列。
          </>
        )}
      </Guide>
    </LessonStage>
  );
}
export function QuestionsScene() {
  const [state, update] = usePageState({ inquiryStep: 0 });
  const step = Number.isInteger(state.inquiryStep)
    ? Math.max(0, Math.min(2, state.inquiryStep))
    : 0;
  const examples = records.filter((record) =>
    ['A01', 'A07', 'A12'].includes(record.id),
  );
  const items = [
    {
      question: `看到 ${examples[0].threat}，能说炎角兽就是 Boss 吗？`,
      observation: `A01 中有两个恶魔。${examples[0].threat} 是整场进攻的威胁值，表中没有谁向谁下令的记录。`,
      guide: '同场还有雾铃魔。单凭一次高读数，不能确定谁在指挥。',
    },
    {
      question: '那我们可以先调查什么？',
      observation: `三场都有炎角兽，威胁值却分别是 ${examples.map((record) => record.threat).join('、')}。`,
      guide:
        '可以先问：炎角兽参与的进攻，整体威胁水平怎样？把相关记录放在一起比较。',
    },
    {
      question: '只看这三条够吗？',
      observation: `这里只展示了 ${examples.length} 条。还要回到全部 ${records.length} 条战报，找齐炎角兽的相关记录，核对出现次数。`,
      guide:
        '先比较各个恶魔参与进攻的威胁水平，再核对出现次数，决定优先调查谁。',
    },
  ];
  return (
    <LessonStage
      title="这份战报能回答什么？"
      label="LOOK · 望 / 先问清问题"
      footer={
        <Tabs
          labels={['01 一条够吗', '02 怎样比较', '03 找齐记录']}
          value={step}
          onChange={(inquiryStep) => update({ inquiryStep })}
          label="从战报提出调查问题"
        />
      }
    >
      <div className={s.questionLayout}>
        <div className={s.questionStory}>
          <Comic />
          <p className={`${s.speech} ${s.questionPrompt}`} aria-live="polite">
            勇士：“{items[step].question}”
          </p>
        </div>
        <div className={s.questionData}>
          <table className={`${s.table} ${s.questionTable}`}>
            <caption className={step === 2 ? s.questionSampleFocus : undefined}>
              部分记录 · 展示 {examples.length} 条 / 全部 {records.length} 条
            </caption>
            <thead>
              <tr>
                <th scope="col">记录编号</th>
                <th scope="col">出现的恶魔</th>
                <th scope="col">威胁值</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((record, index) => (
                <tr
                  key={record.id}
                  className={
                    step === 0 && index === 0 ? s.questionRowFocus : undefined
                  }
                >
                  <th
                    scope="row"
                    className={step === 2 ? s.questionCellFocus : undefined}
                  >
                    {record.id}
                  </th>
                  <td>
                    {record.demons.map((name, nameIndex) => (
                      <span key={name}>
                        {nameIndex > 0 && ' / '}
                        <span
                          className={
                            step === 1 && name === '炎角兽'
                              ? s.questionNameFocus
                              : undefined
                          }
                        >
                          {name}
                        </span>
                      </span>
                    ))}
                  </td>
                  <td className={step === 1 ? s.questionCellFocus : undefined}>
                    {record.threat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p
            className={`${s.feedback} ${s.questionObservation}`}
            aria-live="polite"
          >
            {items[step].observation}
          </p>
        </div>
      </div>
      <Guide>{items[step].guide}</Guide>
    </LessonStage>
  );
}
