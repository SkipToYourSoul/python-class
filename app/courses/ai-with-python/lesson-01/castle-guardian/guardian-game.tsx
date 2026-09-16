/* oxlint-disable next/no-img-element -- Supplied game artwork. */
'use client';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Maximize } from 'lucide-react';
import { warriors } from '@/lib/course-data';
import {
  Stage,
  Choices,
  CastleTree,
  useSceneState,
  asset,
  newRoles,
  predictRole,
  type RoleData,
} from '../lesson-ui';
import s from '../lesson-review.module.css';
import g from '../lesson-games.module.css';
import { GuardianLobby } from './guardian-lobby';
import { GuardianArchive } from './guardian-archive';
import { GuardianRuleStep } from './guardian-rule-step';
import { GuardianModelReady } from './guardian-model-ready';
import { roots, branches } from './guardian-rules';
import {
  getGuardianProgress,
  type PredictionRecord,
} from './guardian-progress';
import { GuardianPredictionSummary } from './guardian-prediction-summary';

const visitors: RoleData[] = [
  ...newRoles.slice(0, 2),
  {
    name: '熔岩巨魔',
    image: 'castle-guardian-lava-demon.png',
    attack: 58,
    defense: 72,
    health: 520,
    identity: '恶魔',
  },
];
type GameState = {
  stage: number;
  root: number;
  rootTested: number;
  branch: number;
  branchTested: number;
  visitor: number;
  phase: 'guess' | 'path' | 'model' | 'truth';
  guess: number;
  pathStep: number;
  records: PredictionRecord[];
  best: number;
};
const initial: GameState = {
  stage: 0,
  root: -1,
  rootTested: -1,
  branch: -1,
  branchTested: -1,
  visitor: 0,
  phase: 'guess',
  guess: -1,
  pathStep: 0,
  records: [],
  best: 0,
};
export default function GuardianGame() {
  const [saved, set] = useSceneState<GameState>('guardian-v2', initial);
  const progress = getGuardianProgress(
    saved.stage,
    saved.records,
    visitors.length,
  );
  const v = { ...saved, stage: progress.stage };
  const role = visitors[v.visitor] ?? visitors[0],
    pathLength = role.health <= 245 ? 1 : 2,
    rootDone = v.root === v.rootTested && v.rootTested === 2,
    branchDone = v.branch === v.branchTested && v.branchTested === 2;
  const stageNames = [
    '任务入口',
    '观察档案',
    '第一条规则',
    '继续分组',
    '完整模型',
    '新来客',
  ];
  const titles = [
    '训练你的城堡守门员',
    '观察档案，比较已知身份',
    '哪一个问题，分得更清楚？',
    '继续分开混杂的六位角色',
    '我们得到了一棵决策树',
    '先预测，再打开真实档案',
  ];
  function revealTruth() {
    const model = predictRole(role),
      entry = {
        guess: v.guess === 0 ? '勇士' : '恶魔',
        model,
        truth: role.identity!,
      };
    const records = [...v.records];
    records[v.visitor] = entry;
    set({
      phase: 'truth',
      records,
      best: Math.max(v.best, records.filter((r) => r.guess === r.truth).length),
    });
  }
  function nextVisitor() {
    if (v.visitor < visitors.length - 1)
      set({ visitor: v.visitor + 1, phase: 'guess', guess: -1, pathStep: 0 });
  }
  function nextPath() {
    if (v.pathStep >= pathLength) set({ phase: 'model' });
    else set({ pathStep: v.pathStep + 1 });
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* The browser fullscreen command remains available. */
    }
  }
  return (
    <main className={`${g.page} ${s.player}`}>
      <header className={g.topbar}>
        <Link href="/courses/ai-with-python/lesson-01#chapter-3-discussion">
          <ArrowLeft />
          返回 Python 实践
        </Link>
        <span>城堡守门员</span>
        <div className={s.row}>
          <button onClick={() => void fullscreen()}>
            <Maximize />
            全屏
          </button>
          <button onClick={() => set({ ...initial, best: v.best })}>
            <RotateCcw />
            重新开始训练营
          </button>
        </div>
      </header>
      <div className={g.content}>
        <Stage
          label="CASTLE GUARDIAN · 模拟训练"
          title={titles[v.stage]}
          className={g.entryStage}
        >
          {v.stage === 0 ? (
            <GuardianLobby onStart={() => set({ stage: 1 })} />
          ) : v.stage === 1 ? (
            <GuardianArchive onContinue={() => set({ stage: 2 })} />
          ) : v.stage === 2 || v.stage === 3 ? (
            <GuardianRuleStep
              rules={v.stage === 2 ? roots : branches}
              rows={
                v.stage === 2
                  ? warriors
                  : warriors.filter((role) => role.health > 245)
              }
              selected={v.stage === 2 ? v.root : v.branch}
              tested={v.stage === 2 ? v.rootTested : v.branchTested}
              canContinue={v.stage === 2 ? rootDone : branchDone}
              isBranch={v.stage === 3}
              onSelect={(index) =>
                v.stage === 2
                  ? set({ root: index, rootTested: -1 })
                  : set({ branch: index, branchTested: -1 })
              }
              onRun={() =>
                v.stage === 2
                  ? set({ rootTested: v.root })
                  : set({ branchTested: v.branch })
              }
              onContinue={() => {
                if (v.stage === 2 ? rootDone : branchDone)
                  set({ stage: v.stage + 1 });
              }}
            />
          ) : v.stage === 4 ? (
            <div className={`${s.two} ${s.wideLeft}`}>
              <CastleTree />
              <GuardianModelReady onContinue={() => set({ stage: 5 })} />
            </div>
          ) : v.stage === 5 ? (
            <>
              <div className={`${s.two} ${s.wideLeft}`}>
                <CastleTree
                  health={v.phase === 'guess' ? undefined : role.health}
                  step={v.pathStep}
                />
                <div className={s.stack}>
                  <div className={g.compactRole}>
                    <img
                      src={asset(role.image)}
                      alt={`来客 ${v.visitor + 1} 的角色插画`}
                    />
                    <div>
                      <strong>来客 {v.visitor + 1} / 3</strong>
                      <p>
                        攻击 {role.attack}
                        <br />
                        防御 {role.defense} · 血量 {role.health}
                      </p>
                    </div>
                  </div>
                  {v.phase === 'guess' ? (
                    <>
                      <p>先猜身份，再观察模型的路径。</p>
                      <Choices
                        label="学生预判"
                        items={['勇士', '恶魔']}
                        value={v.guess}
                        onChange={(guess) => set({ guess })}
                      />
                      <button
                        className={s.primary}
                        disabled={v.guess < 0}
                        onClick={() => set({ phase: 'path', pathStep: 0 })}
                      >
                        让新数据进入模型
                      </button>
                    </>
                  ) : v.phase === 'path' ? (
                    <>
                      <p>
                        {v.pathStep === 0
                          ? `血量 ${role.health} ≤ 245？${role.health <= 245 ? '是' : '否'}。`
                          : v.pathStep === 1 && role.health > 245
                            ? `血量 ${role.health} ≤ 450？${role.health <= 450 ? '是' : '否'}。`
                            : `到达预测类别：${predictRole(role)}。`}
                      </p>
                      <button className={s.primary} onClick={nextPath}>
                        {v.pathStep >= pathLength
                          ? '保留模型预测'
                          : '继续下一步'}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={g.guessRow}>
                        <div>
                          学生预判
                          <strong>{v.guess === 0 ? '勇士' : '恶魔'}</strong>
                        </div>
                        <div>
                          模型预测<strong>{predictRole(role)}</strong>
                        </div>
                        <div>
                          真实身份
                          <strong>
                            {v.phase === 'truth' ? role.identity : '未揭晓'}
                          </strong>
                        </div>
                      </div>
                      {v.phase === 'model' ? (
                        <button className={s.primary} onClick={revealTruth}>
                          打开独立的身份档案
                        </button>
                      ) : (
                        <>
                          <p className={s.small} aria-live="polite">
                            档案确认：{role.name}是{role.identity}。<br />
                            学生判断
                            {(v.guess === 0 ? '勇士' : '恶魔') === role.identity
                              ? '正确'
                              : '有误'}
                            ；模型判断
                            {predictRole(role) === role.identity
                              ? '正确'
                              : '有误'}
                            。
                          </p>
                          {v.visitor < visitors.length - 1 && (
                            <button className={s.primary} onClick={nextVisitor}>
                              迎接下一位
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              {progress.complete ? (
                <GuardianPredictionSummary
                  total={progress.total}
                  studentCorrect={progress.studentCorrect}
                  modelCorrect={progress.modelCorrect}
                />
              ) : (
                <p className={s.small}>
                  模型预测与真实身份是两份信息；预测完成后，再打开档案核验。
                </p>
              )}
            </>
          ) : null}
        </Stage>
      </div>
      <nav className={g.navigation} aria-label="训练营进度">
        {stageNames.map((label, i) => (
          <button
            key={label}
            aria-current={v.stage === i ? 'step' : undefined}
            disabled={i > v.stage}
            onClick={() => set({ stage: i })}
          >
            {i + 1} · {label}
          </button>
        ))}
      </nav>
    </main>
  );
}
