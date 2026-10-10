'use client';

import { useContext, useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  ChartNoAxesColumnIncreasing,
  ChartScatter,
  ChartLine,
  Check,
  Radar,
  Shield,
  Footprints,
  FolderSearch,
  Flag,
  Pause,
  Play,
  RotateCcw,
  Backpack,
  Zap,
} from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CastleScene } from './castle-challenge-visual';
import { ChallengeChart } from './castle-challenge-charts';
import {
  challengeReducer,
  createInitialChallengeState,
  challengeTools,
  challengeRounds,
  escapeRoutes,
  escapeRuleMatches,
  type ChallengeAction,
} from './castle-challenge-engine';
import s from './castle-challenge.module.css';

const toolIcons = {
  histogram: ChartNoAxesColumnIncreasing,
  bar: BarChart3,
  line: ChartLine,
  scatter: ChartScatter,
};
const routeIcons = [Radar, Shield, Footprints, FolderSearch, Flag];
const routeNames = ['外墙扫描', '引开追兵', '巡逻走廊', '核查档案', '安全撤离'];
const chartNotes = [
  '90 个体 · 柱高表示数量；区间左含右不含，末组含右端点。',
  '三族各 30 个体 · 比较平均值，同族个体仍有差异。',
  'D001 的六次记录 · 在回放中行动，不推断下一次巡逻。',
  '每个点是一只恶魔 · 点群会重叠，图表线索需要档案核实。',
];
const instructions = [
  '扫描镜一次只能选一个速度档位。',
  '能量炮发射诱饵，引开一队追兵。',
  '在已记录的巡逻回放中，选一个时刻穿越。',
  '先找候选，再核查档案；不要只凭高或快判断。',
];

export function CastleChallenge() {
  const { navigate } = useContext(LessonState);
  // Nest this game state so the former penguin challenge's saved inputs survive.
  const [saved, update] = usePageState({
    challenge: createInitialChallengeState(),
    motion: true,
    chartFeature: 'speed' as 'speed' | 'mass',
  });
  const state = saved.challenge;
  const [bag, setBag] = useState(false);
  const [replay, setReplay] = useState(0);
  const [actionMotion, setActionMotion] = useState(false);
  const [viewOverride, setViewOverride] = useState<{
    key: string;
    chart: boolean;
  } | null>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => document.removeEventListener('visibilitychange', visibility);
  }, []);
  function dispatch(action: ChallengeAction) {
    if (!['choose', 'reinforce'].includes(action.type)) setViewOverride(null);
    if (['execute', 'tool'].includes(action.type)) setActionMotion(true);
    if (['start', 'reset', 'next', 'retry'].includes(action.type))
      setActionMotion(false);
    update({
      challenge: challengeReducer(state, action),
      ...(action.type === 'reinforce' ? { chartFeature: 'mass' as const } : {}),
      ...(['reset', 'next', 'start'].includes(action.type)
        ? { chartFeature: 'speed' as const }
        : {}),
    });
    setReplay(0);
  }
  const round = challengeRounds[state.round];
  const victory = state.phase === 'victory';
  const escape = state.round === 4;
  const feedback = state.phase === 'feedback';
  const showChart = Boolean(
    round && state.tool === round.tool && state.phase !== 'tool',
  );
  const viewKey = `${state.round}-${state.phase}`;
  const chartVisible =
    showChart &&
    (viewOverride?.key === viewKey ? viewOverride.chart : !feedback);
  const exitEvidence = escapeRoutes.find((route) =>
    escapeRuleMatches(route, state.clues),
  )?.rules;
  const event = victory
    ? 'victory'
    : feedback
      ? state.result?.success
        ? 'success'
        : 'alarm'
      : 'idle';
  const running = saved.motion && !hidden;

  return (
    <Stage
      title={victory ? '侦察成功，全班通关！' : '魔堡潜入：全班图表指挥官'}
      label={
        victory ? 'MISSION COMPLETE · 情报已带回' : 'FINAL CHALLENGE · 全班协作'
      }
      className={s.stage}
    >
      <div
        className={s.game}
        data-castle-game
        data-phase={state.started ? state.phase : 'intro'}
      >
        {state.started && (
          <div className={s.status}>
            <ol className={s.route} aria-label="行动进度">
              {routeNames.map((name, i) => {
                const Icon = routeIcons[i];
                return (
                  <li
                    key={name}
                    data-current={state.round === i && !victory}
                    data-done={i < state.clues.length || victory}
                    aria-current={
                      state.round === i && !victory ? 'step' : undefined
                    }
                  >
                    {i < state.clues.length || victory ? (
                      <Check size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                    <span>{name}</span>
                  </li>
                );
              })}
            </ol>
            <span className={s.alarmCount} data-alarmed={state.alarms > 0}>
              警报 {state.alarms} 次
            </span>
          </div>
        )}

        {!state.started ? (
          <div className={s.missionGrid}>
            <CastleScene
              round={0}
              completed={0}
              event="idle"
              running={running}
            />
            <section className={s.brief}>
              <span className={s.eyebrow}>战前任务 · 10—12 分钟</span>
              <h3>潜入魔堡，带回情报</h3>
              <p>全班一起指挥勇士，突破四道关卡，找到撤离出口。</p>
              <ol className={s.instructions}>
                <li>
                  <span>1</span>
                  <div>
                    <strong>选择图表</strong>
                    <p>面对困境，请出合适的侦察工具。</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>共同决策</strong>
                    <p>看图找证据，讨论后一起投票。</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>老师执行</strong>
                    <p>看行动结果；选错可以修正再试。</p>
                  </div>
                </li>
              </ol>
              <button
                className={s.primary}
                onClick={() => dispatch({ type: 'start' })}
              >
                开始潜入 <ArrowRight size={22} />
              </button>
            </section>
          </div>
        ) : victory ? (
          <div className={s.missionGrid}>
            <CastleScene
              round={4}
              completed={4}
              event="victory"
              animate={actionMotion}
              running={running}
              replay={replay}
            />
            <section className={s.brief}>
              <div className={s.victoryStamp}>
                <Flag size={30} />
                <strong>全班通关</strong>
                <span>四份情报 · 安全撤离</span>
              </div>
              <p>勇士带上有证据的图鉴，为第六课最终决战做好准备。</p>
              <div className={s.victoryClues}>
                {state.clues.map((clue) => (
                  <p key={clue.id}>
                    <Check size={20} />
                    <strong>{clue.title}</strong>
                    <span>
                      {clue.id === 'identity'
                        ? '不只凭单一特征判断'
                        : clue.id === 'scan'
                          ? '看区间里的数量'
                          : clue.id === 'decoy'
                            ? '比较类别平均值'
                            : '沿时间观察变化'}
                    </span>
                  </p>
                ))}
              </div>
              <button
                className={s.primary}
                onClick={() => navigate('l5-summary')}
              >
                带着情报，回顾图表 <ArrowRight size={20} />
              </button>
              <button
                className={s.secondary}
                onClick={() => dispatch({ type: 'reset' })}
              >
                再玩一次
              </button>
            </section>
          </div>
        ) : escape ? (
          <div className={s.missionGrid}>
            <section className={s.escapeField} aria-label="撤离现场与四份情报">
              <CastleScene
                round={4}
                completed={4}
                event={event}
                animate={actionMotion}
                running={running}
                replay={replay}
                exitChoice={state.choice}
              />
              <div className={s.escapeRecords}>
                {exitEvidence?.map((rule) => (
                  <p key={rule.clue}>
                    <Check size={18} />
                    <span>
                      {rule.label}：<strong>{rule.text}</strong>
                    </span>
                  </p>
                ))}
              </div>
            </section>
            <section className={s.command}>
              <span className={s.eyebrow}>最后一步 · 选择撤离出口</span>
              <h3>哪道门的密码全对？</h3>
              <p className={s.commonRules}>
                三门共用：扫描 {escapeRoutes[0].rules[0].text}；档案{' '}
                {escapeRoutes[0].rules[3].text}。
              </p>
              <fieldset className={s.choices} aria-label="撤离出口">
                {escapeRoutes
                  .filter((route) => !feedback || route.id === state.choice)
                  .map((route) => (
                    <button
                      key={route.id}
                      aria-pressed={state.choice === route.id}
                      disabled={feedback}
                      onClick={() =>
                        dispatch({ type: 'choose', choice: route.id })
                      }
                    >
                      <strong>
                        {route.id === 'west'
                          ? '1'
                          : route.id === 'north'
                            ? '2'
                            : '3'}{' '}
                        {route.title}
                      </strong>
                      <span>
                        追兵：{route.rules[1].text} · 时刻：
                        {route.rules[2].text}
                      </span>
                    </button>
                  ))}
              </fieldset>
              {state.result && (
                <div
                  className={s.feedback}
                  data-success={state.result.success}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <strong>{state.result.title}</strong>
                  <p>{state.result.text}</p>
                </div>
              )}
              <div className={s.execute}>
                {feedback ? (
                  <button
                    className={s.primary}
                    onClick={() => dispatch({ type: 'retry' })}
                  >
                    保留情报，重新选门 <RotateCcw size={20} />
                  </button>
                ) : (
                  <button
                    className={s.primary}
                    disabled={!state.choice}
                    onClick={() => dispatch({ type: 'execute' })}
                  >
                    执行撤离 <ArrowRight size={22} />
                  </button>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className={s.missionGrid}>
            <div className={s.fieldPanel}>
              <div className={s.fieldScene} data-hidden={chartVisible}>
                <CastleScene
                  round={state.round}
                  completed={state.clues.length}
                  event={event}
                  animate={actionMotion}
                  running={running && !chartVisible}
                  replay={replay}
                />
              </div>
              {showChart && (
                <section
                  className={`${s.chartPanel} ${s.fieldChart}`}
                  data-hidden={!chartVisible}
                  aria-label="图表侦察镜"
                >
                  <div className={s.chartHeading}>
                    <strong>
                      {challengeTools.find((t) => t.id === state.tool)?.name} ·
                      侦察镜
                    </strong>
                    {state.round === 3 && (
                      <fieldset
                        className={s.featureButtons}
                        aria-label="对照特征"
                      >
                        <button
                          aria-pressed={saved.chartFeature === 'speed'}
                          onClick={() => update({ chartFeature: 'speed' })}
                        >
                          身高 × 速度
                        </button>
                        <button
                          aria-pressed={saved.chartFeature === 'mass'}
                          onClick={() =>
                            state.reinforced
                              ? update({ chartFeature: 'mass' })
                              : dispatch({ type: 'reinforce' })
                          }
                        >
                          {state.reinforced ? '身高 × 体重' : '补看身高 × 体重'}
                        </button>
                      </fieldset>
                    )}
                  </div>
                  <div className={s.chartSpace}>
                    <ChallengeChart
                      round={state.round}
                      choice={state.choice}
                      feature={saved.chartFeature}
                    />
                  </div>
                  <p className={s.chartNote}>{chartNotes[state.round]}</p>
                </section>
              )}
            </div>
            <section className={s.command}>
              <span className={s.eyebrow}>
                关卡 0{state.round + 1} · {round.title}
              </span>
              <h3 className={s.prompt}>{round.prompt}</h3>
              {showChart ? (
                <>
                  {!feedback && (
                    <p className={s.actionHint} aria-live="polite">
                      {state.result
                        ? '线索还不够：请在侦察镜中补看身高与体重。'
                        : instructions[state.round]}
                    </p>
                  )}
                  <fieldset className={s.choices} aria-label="行动选择">
                    {round.options
                      .filter(
                        (option) => !feedback || option.id === state.choice,
                      )
                      .map((option) => (
                        <button
                          key={option.id}
                          aria-pressed={state.choice === option.id}
                          disabled={feedback}
                          onClick={() =>
                            dispatch({ type: 'choose', choice: option.id })
                          }
                        >
                          <span className={s.choiceNumber}>
                            {round.options.indexOf(option) + 1}
                          </span>
                          <span>{option.label}</span>
                          {state.choice === option.id && <Check size={20} />}
                        </button>
                      ))}
                  </fieldset>
                </>
              ) : (
                <>
                  <p className={s.actionHint}>
                    {feedback ? '刚才选择的工具' : '先选择侦察工具。'}
                  </p>
                  <fieldset className={s.tools} aria-label="侦察工具">
                    {challengeTools
                      .filter((tool) => !feedback || tool.id === state.tool)
                      .map((tool) => {
                        const Icon = toolIcons[tool.id];
                        return (
                          <button
                            key={tool.id}
                            disabled={feedback}
                            aria-pressed={state.tool === tool.id}
                            onClick={() =>
                              dispatch({ type: 'tool', tool: tool.id })
                            }
                          >
                            <Icon size={30} />
                            <strong>{tool.name}</strong>
                          </button>
                        );
                      })}
                  </fieldset>
                </>
              )}
              {state.result && feedback && (
                <div
                  className={s.feedback}
                  data-success={state.result.success}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <strong>
                    {state.result.success ? (
                      <Check size={20} />
                    ) : (
                      <Radar size={20} />
                    )}{' '}
                    {state.result.title}
                  </strong>
                  <p>{state.result.text}</p>
                </div>
              )}
              <div className={s.execute}>
                {feedback ? (
                  state.result?.success ? (
                    <button
                      className={s.primary}
                      onClick={() => dispatch({ type: 'next' })}
                    >
                      {state.round === 3 ? '情报到手，寻找出口' : '继续潜入'}{' '}
                      <ArrowRight size={21} />
                    </button>
                  ) : (
                    <button
                      className={s.primary}
                      onClick={() => dispatch({ type: 'retry' })}
                    >
                      重新判断 <RotateCcw size={20} />
                    </button>
                  )
                ) : showChart ? (
                  <button
                    className={s.primary}
                    disabled={!state.choice}
                    onClick={() => dispatch({ type: 'execute' })}
                  >
                    {state.round === 1 ? (
                      <Zap size={21} />
                    ) : (
                      <ArrowRight size={21} />
                    )}{' '}
                    {
                      [
                        '执行扫描',
                        '发射诱饵能量炮',
                        '执行穿越',
                        '核查候选档案',
                      ][state.round]
                    }
                  </button>
                ) : (
                  <p className={s.classroomTip}>
                    先独立想 → 同桌讨论 → 全班投票
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        <div className={s.toolbar}>
          <p>全班决策 · 老师操作 · 可随时停下来讨论</p>
          <div>
            {showChart && (
              <button
                onClick={() =>
                  setViewOverride({ key: viewKey, chart: !chartVisible })
                }
              >
                {chartVisible ? <Footprints size={19} /> : <Radar size={19} />}
                {chartVisible ? '返回现场' : '查看图表'}
              </button>
            )}
            {state.started && (
              <button onClick={() => setBag(true)}>
                <Backpack size={19} />
                情报袋 {state.clues.length}/4
              </button>
            )}
            <button
              aria-pressed={!saved.motion}
              onClick={() => update({ motion: !saved.motion })}
            >
              {saved.motion ? <Pause size={18} /> : <Play size={18} />}{' '}
              {saved.motion ? '暂停动效' : '播放动效'}
            </button>
            {event !== 'idle' && (
              <button
                onClick={() => {
                  update({ motion: true });
                  setActionMotion(true);
                  setViewOverride({ key: viewKey, chart: false });
                  setReplay((n) => n + 1);
                }}
              >
                <RotateCcw size={18} />
                重播行动
              </button>
            )}
          </div>
        </div>
      </div>
      <Dialog open={bag} onOpenChange={setBag}>
        <DialogContent className={s.bagDialog}>
          <DialogHeader>
            <DialogTitle>全班情报袋 · {state.clues.length}/4</DialogTitle>
            <DialogDescription>
              每份情报都来自刚才读过的图表；带着证据继续行动。
            </DialogDescription>
          </DialogHeader>
          {state.clues.length ? (
            state.clues.map((clue) => (
              <article key={clue.id}>
                <h3>
                  <Check size={22} />
                  {clue.title}
                </h3>
                <p>{clue.text}</p>
              </article>
            ))
          ) : (
            <p>还没有收集到情报。先选择合适的图表工具，完成外墙扫描。</p>
          )}
        </DialogContent>
      </Dialog>
    </Stage>
  );
}
