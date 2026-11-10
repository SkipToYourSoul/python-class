/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';

import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { usePageState } from '@/components/course/lesson-state';
import { Page, Guide, Art, CodeTools, Tabs, Jump } from './lesson-ui';
import { TowerChart } from './tower-chart';
import {
  TOWER_NAMES,
  TEAMS,
  windows,
  plans,
  ATTACK_THRESHOLD,
} from './study-data';
import {
  LINE_LESSON_CODE,
  PLOT_PREPARATION_CODE,
  SCATTER_LESSON_CODE,
} from './practice-content';
import s from './third-section.module.css';

const candidatesFor = (tower: string) =>
  windows.filter((row) => row.tower === tower).sort((a, b) => a.hour - b.hour);
const northTower = '北塔';
const northCandidates = candidatesFor(northTower);
const [earlier, later] = northCandidates;

export function TowerAssaultStory() {
  return (
    <Page title="三队领到作战图，出发！" label="TOWER STORY · 作战图已送达">
      <figure className={s.dispatchComic}>
        <Art
          kind="tower-chart-dispatch"
          panoramic
          alt="三格漫画。小派和勇士把折线图和散点图交给三位队长，队长们对照作战图和路线，各自带图前往仍有外罩保护的北塔、东塔和西塔。"
        />
        <figcaption className={s.dispatchCaptions}>
          <span>01 · 每队领到两张图</span>
          <span>02 · 核对本队命令</span>
          <span>03 · 带图前往各塔</span>
        </figcaption>
      </figure>
      <div className={s.dispatchFooter}>
        <Guide>
          各队先按命令到达阵前。到场后，再测一次外罩，确认现在能不能出击。
        </Guide>
        <Jump id="l6-tower-battle">去阵前核对</Jump>
      </div>
    </Page>
  );
}

export function ChartChoice() {
  return (
    <Page title="两个作战问题，两种图表" label="CHART CHOICE · 从表格到作战图">
      <div className={s.twoCharts}>
        <section className={s.chartCard}>
          <div className={s.cardHeading}>
            <span>① 北塔什么时候能破罩？</span>
            <strong>折线图 · 沿时间找候选</strong>
          </div>
          <TowerChart
            kind="history"
            tower={northTower}
            threshold
            clueTower={northTower}
          />
          <p className={s.chartTakeaway}>虚线下有两个点。顺着横轴读出时刻。</p>
        </section>
        <section className={s.chartCard}>
          <div className={s.cardHeading}>
            <span>② 两次机会，哪次更好打？</span>
            <strong>散点图 · 在候选中比防御</strong>
          </div>
          <TowerChart
            kind="guards"
            tower={northTower}
            threshold
            clueTower={northTower}
          />
          <p className={s.chartTakeaway}>同样两个点。越靠左，守卫防御越低。</p>
        </section>
      </div>
      <Guide>
        两张图都标着北塔 {earlier.hour} 时和 {later.hour}{' '}
        时的观测。换一个横轴，同一条情报就能回答不同的问题。
      </Guide>
    </Page>
  );
}

export function ReadLine() {
  const [state, update] = usePageState({ reveal: false });
  return (
    <Page
      title="沿着曲线，圈出可破罩时刻"
      label="READ A CHART · 找阈值 → 圈候选 → 读时刻"
    >
      <div className={s.readGrid}>
        <TowerChart
          kind="history"
          tower={northTower}
          threshold={state.reveal}
          clueTower={state.reveal ? northTower : undefined}
        />
        <section className={s.cluePanel}>
          <img
            className={s.clueBackground}
            src="/courses/ai-with-python/lesson-06/assets/team-north-background.jpg"
            alt=""
            aria-hidden="true"
          />
          <h3>北塔哪些观测点低于 {ATTACK_THRESHOLD}？</h3>
          <ol className={s.readSteps}>
            <li>在纵轴上找到外罩强度 {ATTACK_THRESHOLD}。</li>
            <li>沿曲线找出低于这条线的点。</li>
            <li>向下读横轴，报出两个时刻。</li>
          </ol>
          <button
            className={s.primary}
            aria-expanded={state.reveal}
            onClick={() => update({ reveal: !state.reveal })}
          >
            {state.reveal ? '收起参考，重新读图' : '显示参考线与候选时段'}
          </button>
          {state.reveal ? (
            <div className={s.candidateList}>
              {northCandidates.map((row) => (
                <div key={row.hour}>
                  <strong>{row.hour} 时</strong>
                  <span>
                    外罩 {row.energy} &lt; {ATTACK_THRESHOLD}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={s.prompt}>先报出你找到的两个时刻，再点按钮核对。</p>
          )}
        </section>
      </div>
      <Guide>
        {state.reveal
          ? '两次观测的外罩都低于阈值，先把它们留下来。选哪一次，还得比较守卫防御。'
          : '折线把观测点按时间连起来。每个圆点才是一次实测。'}
      </Guide>
    </Page>
  );
}

export function ScatterStory() {
  return (
    <Page
      title="外罩最弱，就一定最好打吗？"
      label="STORY · 北塔出现两条不同的线索"
    >
      <div className={s.storyGrid}>
        <Art
          kind="north-two-clues-v3"
          alt="北塔前，小派拦住只盯着薄外罩的勇士；两人再比较守卫防御，准备好强光装备，等待合适的机会。"
        />
        <section className={s.comparisonPanel}>
          <h3>同两个时刻，再看守卫防御</h3>
          <table className={s.table}>
            <caption>从北塔折线图圈出的两条记录</caption>
            <thead>
              <tr>
                <th>时刻</th>
                <th>外罩</th>
                <th>守卫防御</th>
              </tr>
            </thead>
            <tbody>
              {northCandidates.map((row) => (
                <tr key={row.hour}>
                  <th scope="row">{row.hour}时</th>
                  <td>{row.energy}</td>
                  <td>{row.defense}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.observation}>
            <span>外罩都低于 {ATTACK_THRESHOLD}</span>
            <strong>{earlier.hour} 时外罩更低</strong>
          </div>
          <div className={s.observation}>
            <span>再比较守卫防御</span>
            <strong>{later.hour} 时守卫防御更低</strong>
          </div>
        </section>
      </div>
      <Guide>
        纵轴还看外罩，横轴换成守卫防御。猜猜看：{earlier.hour} 时和 {later.hour}{' '}
        时，哪个点会画在左边？
      </Guide>
    </Page>
  );
}

export function ChartCode({ kind }: { kind: 'history' | 'guards' }) {
  const line = kind === 'history';
  const source = line ? LINE_LESSON_CODE : SCATTER_LESSON_CODE;
  const highlightFragments = {
    [line ? 'x="hour"' : 'x="defense"']: s.axisX,
    'y="energy"': s.axisY,
    'hue="tower"': s.towerHue,
    [`plt.axhline(${ATTACK_THRESHOLD},`]: s.thresholdLine,
  };
  return (
    <Page
      tools={<CodeTools code={`${PLOT_PREPARATION_CODE}\n\n${source}`} />}
      title={line ? '画折线图，找北塔的候选时刻' : '画散点图，比北塔的守卫防御'}
      label="PYTHON LAB · 从 CSV 到可视化"
    >
      <div className={s.codeToolbar}>
        <span>先读取 towers.csv。右图标出了北塔的两个候选点。</span>
      </div>
      <div className={s.codeGrid}>
        <NotebookPanel
          title={
            line ? '折线图绘图代码 · 逐行注释' : '散点图绘图代码 · 逐行注释'
          }
          compact
          cells={[{ code: source, highlightFragments }]}
        />
        <TowerChart kind={kind} threshold clueTower={northTower} codeMapping />
      </div>
      <Guide>
        {line ? (
          <>
            横轴是时刻，纵轴是外罩。看北塔的蓝线，{earlier.hour} 时和{' '}
            {later.hour} 时的点都在 {ATTACK_THRESHOLD} 虚线下。
          </>
        ) : (
          <>
            北塔两个点都在线下。{later.hour} 时的点更靠左，因为守卫防御是{' '}
            {later.defense}，低于 {earlier.hour} 时的 {earlier.defense}。
          </>
        )}
      </Guide>
    </Page>
  );
}

export function ChartPlan() {
  const [state, update] = usePageState({
    towerIndex: 0,
    revealed: [false, false, false],
  });
  const tower = TOWER_NAMES[state.towerIndex] || TOWER_NAMES[0];
  const index = TOWER_NAMES.indexOf(tower);
  const candidates = candidatesFor(tower);
  const plan = plans.find((row) => row.tower === tower)!;
  const alternative = candidates.find((row) => row.hour !== plan.hour)!;
  const team = TEAMS.find((item) => item.tower === tower)!;
  const revealed = state.revealed[index];
  return (
    <Page title="各队看图，复述出击命令" label="CHART BRIEFING · 战前读图简报">
      <div className={s.planControls}>
        <Tabs
          label="选择要简报的队伍"
          items={TOWER_NAMES.map((name) => `${name}简报`)}
          value={index}
          onChange={(towerIndex) => update({ towerIndex })}
        />
        <button
          className={s.primary}
          onClick={() =>
            update({
              revealed: state.revealed.map((value, i) =>
                i === index ? !value : value,
              ),
            })
          }
        >
          {revealed ? '收起命令，再读一次' : '说出理由后，核对命令'}
        </button>
      </div>
      <div className={s.planGrid}>
        <TowerChart kind="guards" tower={tower} threshold clueTower={tower} />
        <section className={s.planPanel}>
          <img
            className={s.clueBackground}
            src={`/courses/ai-with-python/lesson-06/assets/${['team-north-background', 'team-east-background', 'team-west-background'][index]}.jpg`}
            alt=""
            aria-hidden="true"
          />
          <h3>
            {team.name} → {tower}
          </h3>
          <p className={s.evidenceLabel}>
            ① 历史观测中，两次外罩都低于 {ATTACK_THRESHOLD}
          </p>
          <table className={s.table}>
            <thead>
              <tr>
                <th>时刻</th>
                <th>守卫防御（横轴）</th>
                <th>外罩强度（纵轴）</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((row) => (
                <tr
                  key={row.hour}
                  data-selected={revealed && row.hour === plan.hour}
                >
                  <th scope="row">{row.hour}时</th>
                  <td>{row.defense}</td>
                  <td>{row.energy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.evidenceLabel}>② 比较横坐标：哪个点更靠左？</p>
          <p className={s.evidenceLabel}>③ 查弱点档案：{plan.weakness}</p>
          <div
            className={s.planAnswer}
            data-revealed={revealed}
            aria-live="polite"
          >
            {revealed ? (
              <>
                <strong>
                  本队命令 · {plan.hour} 时出击 · 携带{team.equipment}
                </strong>
              </>
            ) : (
              <p>请替本队复述：几点出击，为什么？带什么装备？</p>
            )}
          </div>
        </section>
      </div>
      <Guide>
        {revealed ? (
          <>
            {plan.hour} 时守卫防御 {plan.defense}，比 {alternative.hour} 时的{' '}
            {alternative.defense} 低。装备按弱点档案配齐，到阵前还要测外罩。
          </>
        ) : (
          <>用图解释为什么选这个时刻，再用弱点档案解释为什么带这件装备。</>
        )}
      </Guide>
    </Page>
  );
}
