/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';

import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  usePageState,
  useLessonPageState,
} from '@/components/course/lesson-state';
import { Page, Guide, Art, CodeTools, Tabs, Story, Jump } from './lesson-ui';
import {
  canFaceBoss,
  initialCampaign,
  type CampaignState,
} from './campaign-engine';
import { TowerChart } from './tower-chart';
import {
  TOWER_NAMES,
  TEAMS,
  windows,
  plans,
  ATTACK_THRESHOLD,
} from './study-data';
import { PRACTICE_03_CODE, LINE_CODE, SCATTER_CODE } from './practice-content';
import s from './third-section.module.css';

const candidatesFor = (tower: string) =>
  windows.filter((row) => row.tower === tower).sort((a, b) => a.hour - b.hour);

export function TowerAftermath() {
  const [campaign] = useLessonPageState<CampaignState>(
    'l6-tower-battle',
    initialCampaign,
  );
  if (canFaceBoss(campaign))
    return (
      <Story
        title="三塔熄灭，魔王终于现身"
        kind="boss-reveal"
        panoramic
        alt="三座塔全部失去光芒，供能线断开，魔王现身，机械猫头鹰送来护甲情报。"
        quote="三塔全部击破，护盾终于消失了！魔王的护甲，仍挡在我们面前。"
        question="新的目标，需要新的情报。九个护甲部位，哪里是最后的突破口？"
      />
    );
  return (
    <Page
      title="三塔未破，魔王护盾仍在恢复"
      label="TOWER MISSION · 先完成三队的战斗"
    >
      <Art
        kind="tower-assault"
        panoramic
        alt="曙光队、烈焰队和暖阳队分别进攻三座魔塔，供能尚未全部切断。"
      />
      <div className={s.codeToolbar}>
        <strong>已击破 {campaign.completed.length} / 3 座魔塔</strong>
        <Jump id="l6-tower-battle">返回三塔战役</Jump>
      </div>
      <Guide>
        先用图表找到每队的进攻时机，按守卫弱点选择装备，再核对阵前读数。三座塔全部击破，才能切断供能、直面魔王。
      </Guide>
    </Page>
  );
}

export function ChartChoice() {
  return (
    <Page title="两个作战问题，两种图表" label="CHART CHOICE · 从表格到作战图">
      <div className={s.twoCharts}>
        <section className={s.chartCard}>
          <div className={s.cardHeading}>
            <span>① 什么时候能破罩？</span>
            <strong>折线图：看随时间的变化</strong>
          </div>
          <TowerChart kind="history" threshold />
          <p className={s.chartTakeaway}>
            沿着同色曲线，找外罩低于 {ATTACK_THRESHOLD} 的观测点。
          </p>
        </section>
        <section className={s.chartCard}>
          <div className={s.cardHeading}>
            <span>② 哪次守卫更容易突破？</span>
            <strong>散点图：同时看两种强度</strong>
          </div>
          <TowerChart kind="guards" threshold />
          <p className={s.chartTakeaway}>
            同一座塔内，先看虚线下方，再向左比较防御。
          </p>
        </section>
      </div>
      <Guide>
        折线图帮我们找候选时段；散点图帮我们在候选中比较守卫。图上看不出装备，还要查第二节的弱点记录。
      </Guide>
    </Page>
  );
}

export function ReadLine() {
  const [state, update] = usePageState({ reveal: false });
  return (
    <Page
      title="沿着曲线，圈出可破罩时段"
      label="READ A CHART · 看颜色 → 找阈值 → 读时刻"
    >
      <div className={s.readGrid}>
        <TowerChart kind="history" threshold={state.reveal} />
        <section className={s.cluePanel}>
          <img
            className={s.clueBackground}
            src="/courses/ai-with-python/lesson-06/assets/team-north-background.jpg"
            alt=""
            aria-hidden="true"
          />
          <h3>每座塔有哪些点低于 {ATTACK_THRESHOLD}？</h3>
          <ol className={s.readSteps}>
            <li>认颜色：追踪同一座塔。</li>
            <li>看纵轴：外罩必须低于 {ATTACK_THRESHOLD}。</li>
            <li>读横轴：记下这些点的时刻。</li>
          </ol>
          <button
            className={s.primary}
            onClick={() => update({ reveal: !state.reveal })}
          >
            {state.reveal ? '收起参考，重新读图' : '显示参考线与候选时段'}
          </button>
          {state.reveal ? (
            <div className={s.candidateList}>
              {TOWER_NAMES.map((tower) => (
                <div key={tower}>
                  <strong>{tower}</strong>
                  <span>
                    {candidatesFor(tower)
                      .map((row) => `${row.hour}时（${row.energy}）`)
                      .join('、')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={s.prompt}>先口头报出每塔的两个候选时段，再核对。</p>
          )}
        </section>
      </div>
      <Guide>
        括号里是外罩读数。低于 {ATTACK_THRESHOLD}{' '}
        只能说明“可以破罩”，还不能决定最终选哪个时刻。曲线连接的是已有观测，不能据此编出未观测时刻的精确读数。
      </Guide>
    </Page>
  );
}

export function ScatterStory() {
  return (
    <Page
      title="外罩最弱，就一定最好打吗"
      label="STORY · 北塔出现两条不同的线索"
    >
      <div className={s.storyGrid}>
        <Art
          kind="north-two-clues-v3"
          alt="北塔前，小派拦住只盯着薄外罩的勇士；两人再比较守卫防御，准备好强光装备，等待合适的机会。"
        />
        <section className={s.comparisonPanel}>
          <h3>北塔：两次都能破罩</h3>
          <table className={s.table}>
            <caption>同一座塔的候选记录</caption>
            <thead>
              <tr>
                <th>时刻</th>
                <th>外罩</th>
                <th>守卫防御</th>
              </tr>
            </thead>
            <tbody>
              {candidatesFor('北塔').map((row) => (
                <tr key={row.hour}>
                  <th scope="row">{row.hour}时</th>
                  <td>{row.energy}</td>
                  <td>{row.defense}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.observation}>
            <span>只看外罩</span>
            <strong>10时的外罩更低</strong>
          </div>
          <div className={s.observation}>
            <span>再看守卫</span>
            <strong>11时的防御更低</strong>
          </div>
        </section>
      </div>
      <Guide>
        两次外罩都低于 {ATTACK_THRESHOLD}
        。若只选外罩最低的10时，就忽略了更强的守卫。怎样把这两个强度放在一张图里比较？
      </Guide>
    </Page>
  );
}

export function ChartCode({ kind }: { kind: 'history' | 'guards' }) {
  const line = kind === 'history';
  const source = line ? LINE_CODE : SCATTER_CODE;
  return (
    <Page
      title={line ? '画折线图，让候选时段现身' : '画散点图，比较外罩与防御'}
      label="PYTHON LAB · 从 CSV 到可视化"
    >
      <div className={s.codeToolbar}>
        <span>先读取 towers.csv；完整导入与两张图见课堂练习03。</span>
        <CodeTools code={PRACTICE_03_CODE} />
      </div>
      <div className={s.codeGrid}>
        <NotebookPanel
          title={line ? '折线图完整绘图代码' : '散点图完整绘图代码'}
          compact
          cells={[{ code: source, activeLines: [1, 2, 3, 4] }]}
        />
        <TowerChart kind={kind} threshold />
      </div>
      <Guide>
        {line ? (
          <>
            <code>{'x="hour"'}</code> 是时刻，<code>{'y="energy"'}</code>{' '}
            是外罩；<code>{'hue="tower"'}</code>
            用颜色区分三塔。虚线画在30，线下的观测才是候选。savefig 保存图，show
            显示图。
          </>
        ) : (
          <>
            每个点对应一次观测：横坐标 defense 越小，守卫防御越低；纵坐标 energy
            越小，外罩越弱。先筛虚线下方，再按同色点向左比较。
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
    <Page
      title="把图上的线索，变成出击方案"
      label="CHART TO ACTION · 每个结论都找到依据"
    >
      <div className={s.planControls}>
        <Tabs
          label="查看各塔的读图方案"
          items={TOWER_NAMES.map((name) => `${name}的图表证据`)}
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
          {revealed ? '收起本队方案，再观察' : '说出理由，再核对本队方案'}
        </button>
      </div>
      <div className={s.planGrid}>
        <TowerChart kind="guards" tower={tower} threshold clues />
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
          <p className={s.evidenceLabel}>① 虚线下方：两次都能破罩</p>
          <table className={s.table}>
            <thead>
              <tr>
                <th>点的时刻</th>
                <th>防御 x</th>
                <th>外罩 y</th>
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
                  {plan.hour}时 · 携带{team.equipment}
                </strong>
              </>
            ) : (
              <p>时刻、装备各由哪条证据决定？</p>
            )}
          </div>
        </section>
      </div>
      <Guide>
        {revealed ? (
          <>
            {tower}两次都能破罩；{plan.hour}时防御{plan.defense} &lt;{' '}
            {alternative.hour}时的{alternative.defense}，选更靠左的点。弱点是
            {plan.weakness}，所以携带{team.equipment}；到阵前再核对新读数。
          </>
        ) : (
          <>
            每次只比较同一座塔。先找虚线下方的候选，再向左比较防御，最后按弱点配装备。
          </>
        )}
      </Guide>
    </Page>
  );
}
