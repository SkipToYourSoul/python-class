'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Database,
  Gamepad2,
  HeartPulse,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Swords,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { assetBase, warriors } from '@/lib/course-data';

type GameMode = 'classroom' | 'solo';
type GameStage = 'intro' | 'archive' | 'root' | 'branch' | 'challenge' | 'complete';
type Feature = 'attack' | 'defense' | 'health';
type Role = (typeof warriors)[number];
type RuleOption = {
  id: string;
  label: string;
  feature: Feature;
  threshold: number;
  operator: 'lte' | 'gte';
  score: string;
  correct: boolean;
  feedback: string;
};
type ChallengeRole = {
  name: string;
  image: string;
  attack: number;
  defense: number;
  health: number;
  actual: '勇士' | '恶魔';
};
type DecisionStep = {
  kind: 'question' | 'result';
  kicker: string;
  title: string;
  detail: string;
  tone: 'blue' | 'green' | 'red';
};

const asset = (file: string) => `${assetBase}/${file}`;
const storageKey = 'ai-with-python-castle-guardian-best';

const featureChoices: { id: Feature; icon: typeof Swords; label: string; prompt: string }[] = [
  { id: 'attack', icon: Swords, label: '攻击力', prompt: '力量强弱能直接说明身份吗？' },
  { id: 'defense', icon: ShieldCheck, label: '防御力', prompt: '防守能力会不会更可靠？' },
  { id: 'health', icon: HeartPulse, label: '血量', prompt: '生存能力中藏着怎样的规律？' },
];

const rootRules: RuleOption[] = [
  { id: 'attack-70', label: '攻击力 ≥ 70？', feature: 'attack', threshold: 70, operator: 'gte', score: '6 / 10', correct: false, feedback: '高攻击角色里既有恶魔，也有火焰剑士；另一边同样混杂。只靠这个问题还不够。' },
  { id: 'defense-60', label: '防御力 ≥ 60？', feature: 'defense', threshold: 60, operator: 'gte', score: '7 / 10', correct: false, feedback: '这个问题有一些帮助，但腐肉巨兽混进了高防御一侧，两边仍没有分干净。' },
  { id: 'health-245', label: '血量 ≤ 245？', feature: 'health', threshold: 245, operator: 'lte', score: '9 / 10', correct: true, feedback: '发现关键线索！“是”的一侧 4 个全是恶魔；“否”的一侧只剩 1 个伪装者需要继续判断。' },
];

const branchRules: RuleOption[] = [
  { id: 'attack-65', label: '攻击力 ≤ 65？', feature: 'attack', threshold: 65, operator: 'lte', score: '5 / 6', correct: false, feedback: '腐肉巨兽和勇士站在了同一侧。攻击力仍然不能找到最后那个伪装者。' },
  { id: 'defense-60-branch', label: '防御力 ≥ 60？', feature: 'defense', threshold: 60, operator: 'gte', score: '5 / 6', correct: false, feedback: '高防御的一侧仍混着腐肉巨兽。我们还需要一个更干净的分界线。' },
  { id: 'health-450', label: '血量 ≤ 450？', feature: 'health', threshold: 450, operator: 'lte', score: '6 / 6', correct: true, feedback: '完美分开！5 个勇士都在“是”的一侧，血量 480 的腐肉巨兽独自在“否”的一侧。' },
];

const challengeRoles: ChallengeRole[] = [
  { name: '银翼守卫', image: 'image133.png', attack: 40, defense: 80, health: 390, actual: '勇士' },
  { name: '深渊魔将', image: 'image134.png', attack: 70, defense: 38, health: 190, actual: '恶魔' },
];

const stageMeta = [
  { id: 'archive', label: '查看档案' },
  { id: 'train', label: '训练模型' },
  { id: 'challenge', label: '城门实战' },
  { id: 'complete', label: '任务复盘' },
];

function stageIndex(stage: GameStage) {
  if (stage === 'archive') return 0;
  if (stage === 'root' || stage === 'branch') return 1;
  if (stage === 'challenge') return 2;
  if (stage === 'complete') return 3;
  return -1;
}

function matchesRule(role: Role, rule: RuleOption) {
  const value = role[rule.feature];
  return rule.operator === 'lte' ? value <= rule.threshold : value >= rule.threshold;
}

function groupSummary(items: Role[]) {
  const warriorCount = items.filter((role) => role.category === '勇士').length;
  const demonCount = items.length - warriorCount;
  return `${warriorCount} 勇士 · ${demonCount} 恶魔`;
}

function modelPrediction(role: ChallengeRole): '勇士' | '恶魔' {
  if (role.health <= 245) return '恶魔';
  if (role.health <= 450) return '勇士';
  return '恶魔';
}

function buildDecisionPath(role: ChallengeRole): DecisionStep[] {
  if (role.health <= 245) {
    return [
      { kind: 'question', kicker: '根节点', title: '血量 ≤ 245？', detail: `${role.health} ≤ 245，答案是“是”，沿左侧分支前进。`, tone: 'blue' },
      { kind: 'result', kicker: '结果节点', title: '判定为恶魔', detail: 'AI 守卫关闭城门，阻止角色进入。', tone: 'red' },
    ];
  }

  const isWarrior = role.health <= 450;
  return [
    { kind: 'question', kicker: '根节点', title: '血量 ≤ 245？', detail: `${role.health} > 245，答案是“否”，沿右侧分支前进。`, tone: 'blue' },
    { kind: 'question', kicker: '决策节点', title: '血量 ≤ 450？', detail: `${role.health} ${isWarrior ? '≤' : '>'} 450，答案是“${isWarrior ? '是' : '否'}”。`, tone: 'blue' },
    { kind: 'result', kicker: '结果节点', title: `判定为${isWarrior ? '勇士' : '恶魔'}`, detail: isWarrior ? 'AI 守卫打开城门，允许角色进入。' : 'AI 守卫关闭城门，阻止角色进入。', tone: isWarrior ? 'green' : 'red' },
  ];
}

function SplitPreview({ roles, rule }: { roles: Role[]; rule: RuleOption }) {
  const yesGroup = roles.filter((role) => matchesRule(role, rule));
  const noGroup = roles.filter((role) => !matchesRule(role, rule));

  return (
    <div className="guardian-split-preview" aria-label={`${rule.label}的数据分组结果`}>
      {[
        { answer: '是', items: yesGroup },
        { answer: '否', items: noGroup },
      ].map((group) => (
        <div className="guardian-split-group" key={group.answer}>
          <div className="guardian-split-label"><strong>{group.answer}</strong><span>{groupSummary(group.items)}</span></div>
          <div className="guardian-split-faces">
            {group.items.map((role) => (
              <span className={role.category === '勇士' ? 'is-warrior' : 'is-demon'} key={role.name} title={`${role.name} · ${role.category}`}>
                <Image src={asset(role.image)} alt={role.name} width={96} height={96} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GameProgress({ stage }: { stage: GameStage }) {
  const current = stageIndex(stage);

  return (
    <div className="guardian-progress-wrap">
      <div className="guardian-progress-label"><span>守门人训练进度</span><strong>{current + 1} / 4</strong></div>
      <ol className="guardian-progress" aria-label="小游戏进度">
        {stageMeta.map((item, index) => (
          <li className={index < current ? 'is-done' : index === current ? 'is-current' : ''} key={item.id} aria-current={index === current ? 'step' : undefined}>
            <span>{index < current ? <Check size={15} /> : index + 1}</span><small>{item.label}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function GuardianGame() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [stage, setStage] = useState<GameStage>('intro');
  const [inspected, setInspected] = useState<string[]>([]);
  const [focusRole, setFocusRole] = useState<string | null>(null);
  const [hypothesis, setHypothesis] = useState<Feature | null>(null);
  const [rootChoice, setRootChoice] = useState<string | null>(null);
  const [rootTested, setRootTested] = useState<string | null>(null);
  const [branchChoice, setBranchChoice] = useState<string | null>(null);
  const [branchTested, setBranchTested] = useState<string | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [guess, setGuess] = useState<'勇士' | '恶魔' | null>(null);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const [pathStep, setPathStep] = useState(0);
  const [records, setRecords] = useState<{ name: string; guess: '勇士' | '恶魔'; actual: '勇士' | '恶魔' }[]>([]);
  const [bestRun, setBestRun] = useState<number | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const savedScoreTimer = window.setTimeout(() => {
      const score = saved === null ? Number.NaN : Number(saved);
      if (Number.isInteger(score) && score >= 0 && score <= challengeRoles.length) setBestRun(score);
    }, 0);
    const pendingTimers = timers.current;
    return () => {
      window.clearTimeout(savedScoreTimer);
      pendingTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const currentChallenge = challengeRoles[challengeIndex];
  const currentPath = currentChallenge ? buildDecisionPath(currentChallenge) : [];
  const selectedRoot = rootRules.find((rule) => rule.id === rootChoice) ?? null;
  const selectedBranch = branchRules.find((rule) => rule.id === branchChoice) ?? null;
  const branchRoles = warriors.filter((role) => role.health > 245);
  const currentStageIndex = stageIndex(stage);

  function scrollToTop() {
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 20);
  }

  function goToStage(nextStage: GameStage) {
    setStage(nextStage);
    scrollToTop();
  }

  function startGame() {
    if (!mode) return;
    goToStage('archive');
  }

  function toggleRole(name: string) {
    setFocusRole(name);
    setInspected((current) => current.includes(name) ? current : [...current, name]);
  }

  function resetRunState() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.length = 0;
    setGuess(null);
    setRunStatus('idle');
    setPathStep(0);
  }

  function resetGame() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.length = 0;
    setMode(null);
    setStage('intro');
    setInspected([]);
    setFocusRole(null);
    setHypothesis(null);
    setRootChoice(null);
    setRootTested(null);
    setBranchChoice(null);
    setBranchTested(null);
    setChallengeIndex(0);
    setGuess(null);
    setRunStatus('idle');
    setPathStep(0);
    setRecords([]);
    scrollToTop();
  }

  function runSoloPath() {
    if (!guess || runStatus !== 'idle') return;
    setRunStatus('running');
    setPathStep(0);
    currentPath.forEach((_, index) => {
      const timer = window.setTimeout(() => {
        setPathStep(index + 1);
        if (index === currentPath.length - 1) setRunStatus('done');
      }, 320 + index * 720);
      timers.current.push(timer);
    });
  }

  function advanceClassroomPath() {
    if (!guess || runStatus === 'done') return;
    const nextStep = pathStep + 1;
    setRunStatus(nextStep >= currentPath.length ? 'done' : 'running');
    setPathStep(nextStep);
  }

  function finishChallengeRole() {
    if (!guess || runStatus !== 'done') return;
    const nextRecords = [...records, { name: currentChallenge.name, guess, actual: currentChallenge.actual }];
    setRecords(nextRecords);

    if (challengeIndex < challengeRoles.length - 1) {
      setChallengeIndex((index) => index + 1);
      resetRunState();
      scrollToTop();
      return;
    }

    const score = nextRecords.filter((record) => record.guess === record.actual).length;
    const nextBest = Math.max(Number.isFinite(bestRun) ? bestRun ?? 0 : 0, score);
    window.localStorage.setItem(storageKey, String(nextBest));
    setBestRun(nextBest);
    goToStage('complete');
  }

  if (stage === 'intro') {
    return (
      <main className="guardian-page">
        <nav className="guardian-topbar" aria-label="小游戏导航">
          <Link href="/courses/ai-with-python/lesson-01#chapter-3"><ArrowLeft size={18} /> 返回第三小节</Link>
          <span><Gamepad2 size={17} /> AI 互动实验</span>
        </nav>

        <section className="guardian-hero" aria-labelledby="guardian-title">
          <div className="guardian-hero-copy">
            <span className="guardian-kicker">DECISION TREE MISSION · 01</span>
            <h1 id="guardian-title">城堡<br /><em>守门人</em></h1>
            <p>大乱斗刚刚结束。你要用 10 份角色档案训练 AI 守卫，在陌生角色抵达城门时作出正确判断。</p>
            <a className="guardian-primary" href="#choose-mode">接受任务 <ArrowRight size={19} /></a>
            {bestRun !== null && <span className="guardian-best"><Sparkles size={15} /> 上次最佳预判：{bestRun} / 2</span>}
          </div>
          <div className="guardian-hero-art" aria-hidden="true">
            <Image className="guardian-castle" src={asset('image108.png')} alt="" width={600} height={600} priority />
            <Image className="guardian-hero-warrior" src={asset('image99.png')} alt="" width={260} height={260} priority />
            <Image className="guardian-hero-demon" src={asset('image102.png')} alt="" width={260} height={260} priority />
            <span>勇士放行</span>
            <span>恶魔拦截</span>
          </div>
        </section>

        <section className="guardian-mode-section" id="choose-mode" aria-labelledby="mode-title">
          <div className="guardian-section-heading">
            <span>先选择游玩方式</span>
            <h2 id="mode-title">你准备怎样完成任务？</h2>
          </div>
          <div className="guardian-mode-grid">
            <button className={mode === 'classroom' ? 'is-selected' : ''} type="button" onClick={() => setMode('classroom')} aria-pressed={mode === 'classroom'}>
              <UsersRound size={30} /><span><strong>课堂共创</strong><small>投屏展示 · 全班投票 · 教师逐步揭晓</small></span>
            </button>
            <button className={mode === 'solo' ? 'is-selected' : ''} type="button" onClick={() => setMode('solo')} aria-pressed={mode === 'solo'}>
              <UserRound size={30} /><span><strong>个人挑战</strong><small>独立思考 · 即时反馈 · 自动演示路径</small></span>
            </button>
          </div>
          <div className="guardian-mode-footer">
            <p aria-live="polite">{mode ? `已选择${mode === 'classroom' ? '课堂共创' : '个人挑战'}模式。` : '选择后即可进入角色档案室。'}</p>
            <button className="guardian-primary guardian-button" type="button" disabled={!mode} onClick={startGame}>开始训练 <ArrowRight size={19} /></button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="guardian-page guardian-play-page">
      <nav className="guardian-topbar guardian-play-topbar" aria-label="小游戏导航">
        <Link href="/courses/ai-with-python/lesson-01#chapter-3"><ArrowLeft size={18} /> 返回第三小节</Link>
        <span><Gamepad2 size={17} /> {mode === 'classroom' ? '课堂共创模式' : '个人挑战模式'}</span>
        <button type="button" onClick={resetGame}><RotateCcw size={16} /> 重新开始</button>
      </nav>

      <div className="guardian-game-shell">
        <GameProgress stage={stage} />

        {stage === 'archive' && (
          <section className="guardian-stage" aria-labelledby="archive-title">
            <div className="guardian-stage-heading">
              <span><Database size={17} /> STAGE 1 · 角色档案室</span>
              <h1 id="archive-title">先认识 AI 的训练数据</h1>
              <p>{mode === 'classroom' ? '请不同小组各挑一张角色卡，读出三个特征并寻找共同规律。' : '至少检查 3 张角色卡，比较勇士和恶魔的特征，再提出你的第一条假设。'}</p>
            </div>

            <div className="guardian-archive-status"><span>已检查 <strong>{inspected.length}</strong> / 10</span><span>{inspected.length >= 3 ? <><CheckCircle2 size={16} /> 已获得足够线索</> : '检查 3 张即可继续'}</span></div>

            <div className="guardian-archive-grid">
              {warriors.map((role) => {
                const isFocused = focusRole === role.name;
                const isInspected = inspected.includes(role.name);
                return (
                  <button className={`${isFocused ? 'is-focused' : ''} ${isInspected ? 'is-inspected' : ''}`} type="button" key={role.name} onClick={() => toggleRole(role.name)} aria-pressed={isFocused}>
                    <span className="guardian-role-image"><Image src={asset(role.image)} alt={`${role.name}角色`} width={420} height={420} />{isInspected && <i><Check size={13} /></i>}</span>
                    <span className="guardian-role-name"><strong>{role.name}</strong><small className={role.category === '勇士' ? 'is-warrior' : 'is-demon'}>{role.category}</small></span>
                    <span className="guardian-role-stats"><small><Swords size={13} /> 攻 {role.attack}</small><small><ShieldCheck size={13} /> 防 {role.defense}</small><small><HeartPulse size={13} /> 血 {role.health}</small></span>
                  </button>
                );
              })}
            </div>

            <div className="guardian-hypothesis">
              <div><span>提出假设</span><h2>如果只能先问一个问题，你会观察哪个特征？</h2><p>这一步不计分。先大胆猜，再让数据检验你的想法。</p></div>
              <div className="guardian-feature-choices">
                {featureChoices.map((feature) => {
                  const Icon = feature.icon;
                  return <button className={hypothesis === feature.id ? 'is-selected' : ''} type="button" key={feature.id} onClick={() => setHypothesis(feature.id)} aria-pressed={hypothesis === feature.id}><Icon size={22} /><span><strong>{feature.label}</strong><small>{feature.prompt}</small></span></button>;
                })}
              </div>
            </div>

            <div className="guardian-action-row">
              <p aria-live="polite">{inspected.length < 3 ? `还需检查 ${3 - inspected.length} 张角色卡` : !hypothesis ? '再选择一个最值得先观察的特征' : '档案分析完成，可以进入训练场'}</p>
              <button className="guardian-primary guardian-button" type="button" disabled={inspected.length < 3 || !hypothesis} onClick={() => goToStage('root')}>带着假设去训练 <ArrowRight size={18} /></button>
            </div>
          </section>
        )}

        {stage === 'root' && (
          <section className="guardian-stage" aria-labelledby="root-title">
            <div className="guardian-stage-heading">
              <span><BrainCircuit size={17} /> STAGE 2 · 训练场 / 第一问</span>
              <h1 id="root-title">选出决策树的根节点</h1>
              <p>一个好问题要让两边尽量“纯”：同一侧的角色身份越一致，模型就越容易判断。</p>
            </div>

            <div className="guardian-builder-layout">
              <div className="guardian-rule-workbench">
                <div className="guardian-teacher-prompt"><Sparkles size={18} /><p>{mode === 'classroom' ? '先请全班投票，再由老师选择得票最高的问题运行一次。答错也没关系，混杂的分组正是讨论材料。' : `你最先关注了${featureChoices.find((item) => item.id === hypothesis)?.label}。现在真正运行三个候选问题，看看数据是否支持你的假设。`}</p></div>
                <div className="guardian-rule-options">
                  {rootRules.map((rule) => <button className={rootChoice === rule.id ? 'is-selected' : ''} type="button" key={rule.id} onClick={() => { setRootChoice(rule.id); setRootTested(null); }} aria-pressed={rootChoice === rule.id}><span>{rule.label}</span><small>点击选择</small></button>)}
                </div>
                <button className="guardian-run-rule" type="button" disabled={!rootChoice} onClick={() => setRootTested(rootChoice)}><Play size={18} /> 运行这个问题</button>
              </div>

              <div className="guardian-rule-result" aria-live="polite">
                {!selectedRoot || rootTested !== selectedRoot.id ? (
                  <div className="guardian-waiting-result"><Crosshair size={34} /><strong>等待运行</strong><p>选择一个候选问题，AI 会把 10 份档案分到“是 / 否”两边。</p></div>
                ) : (
                  <>
                    <div className={`guardian-score-card ${selectedRoot.correct ? 'is-success' : 'is-retry'}`}><span>{selectedRoot.correct ? <CheckCircle2 size={18} /> : <X size={18} />}{selectedRoot.correct ? '关键规则' : '仍有混杂'}</span><strong>{selectedRoot.score}</strong><small>若现在直接分类，可判断正确</small></div>
                    <SplitPreview roles={warriors} rule={selectedRoot} />
                    <p className="guardian-rule-feedback">{selectedRoot.feedback}</p>
                  </>
                )}
              </div>
            </div>

            <div className="guardian-tree-strip" aria-label="当前决策树">
              <div className={selectedRoot?.correct && rootTested === selectedRoot.id ? 'is-built' : ''}><small>根节点</small><strong>{selectedRoot?.correct && rootTested === selectedRoot.id ? '血量 ≤ 245？' : '等待发现第一条规则'}</strong></div><ChevronRight />
              <div><small>决策节点</small><strong>尚未解锁</strong></div><ChevronRight />
              <div><small>结果节点</small><strong>尚未解锁</strong></div>
            </div>

            <div className="guardian-action-row">
              <p>{selectedRoot && rootTested === selectedRoot.id && !selectedRoot.correct ? '观察混杂角色，换一个更有区分度的问题' : selectedRoot?.correct && rootTested === selectedRoot.id ? '第一条规则已经装入决策树' : '先运行一个候选问题'}</p>
              {selectedRoot?.correct && rootTested === selectedRoot.id && <button className="guardian-primary guardian-button" type="button" onClick={() => goToStage('branch')}>寻找第二条规则 <ArrowRight size={18} /></button>}
            </div>
          </section>
        )}

        {stage === 'branch' && (
          <section className="guardian-stage" aria-labelledby="branch-title">
            <div className="guardian-stage-heading">
              <span><BrainCircuit size={17} /> STAGE 2 · 训练场 / 第二问</span>
              <h1 id="branch-title">找出藏在高血量组里的恶魔</h1>
              <p>血量 ≤ 245 的 4 个角色已经能确定是恶魔。现在只需继续处理右侧剩下的 6 个角色。</p>
            </div>

            <div className="guardian-builder-layout">
              <div className="guardian-rule-workbench">
                <div className="guardian-teacher-prompt"><Sparkles size={18} /><p>{mode === 'classroom' ? '把 6 张剩余角色卡投到大屏上，请学生指出哪一个恶魔最特别，再决定要测试的问题。' : '注意腐肉巨兽：它和其他恶魔相比，哪一个数值特别不一样？'}</p></div>
                <div className="guardian-rule-options">
                  {branchRules.map((rule) => <button className={branchChoice === rule.id ? 'is-selected' : ''} type="button" key={rule.id} onClick={() => { setBranchChoice(rule.id); setBranchTested(null); }} aria-pressed={branchChoice === rule.id}><span>{rule.label}</span><small>点击选择</small></button>)}
                </div>
                <button className="guardian-run-rule" type="button" disabled={!branchChoice} onClick={() => setBranchTested(branchChoice)}><Play size={18} /> 运行这个问题</button>
              </div>

              <div className="guardian-rule-result" aria-live="polite">
                {!selectedBranch || branchTested !== selectedBranch.id ? (
                  <div className="guardian-waiting-result"><Crosshair size={34} /><strong>等待运行</strong><p>这次只对血量大于 245 的 6 个角色继续分组。</p></div>
                ) : (
                  <>
                    <div className={`guardian-score-card ${selectedBranch.correct ? 'is-success' : 'is-retry'}`}><span>{selectedBranch.correct ? <CheckCircle2 size={18} /> : <X size={18} />}{selectedBranch.correct ? '完美分组' : '差一点点'}</span><strong>{selectedBranch.score}</strong><small>剩余样本判断正确</small></div>
                    <SplitPreview roles={branchRoles} rule={selectedBranch} />
                    <p className="guardian-rule-feedback">{selectedBranch.feedback}</p>
                  </>
                )}
              </div>
            </div>

            <div className="guardian-tree-strip guardian-tree-complete" aria-label="当前决策树">
              <div className="is-built"><small>根节点</small><strong>血量 ≤ 245？</strong></div><ChevronRight />
              <div className={selectedBranch?.correct && branchTested === selectedBranch.id ? 'is-built' : ''}><small>决策节点</small><strong>{selectedBranch?.correct && branchTested === selectedBranch.id ? '血量 ≤ 450？' : '等待第二条规则'}</strong></div><ChevronRight />
              <div className={selectedBranch?.correct && branchTested === selectedBranch.id ? 'is-built' : ''}><small>结果节点</small><strong>{selectedBranch?.correct && branchTested === selectedBranch.id ? '勇士 / 恶魔' : '尚未解锁'}</strong></div>
            </div>

            <div className="guardian-action-row">
              <p>{selectedBranch && branchTested === selectedBranch.id && !selectedBranch.correct ? '还剩 1 个角色混错了，再试一个问题' : selectedBranch?.correct && branchTested === selectedBranch.id ? '训练数据 10 / 10 全部分对，模型可以上岗了' : '继续测试候选问题'}</p>
              {selectedBranch?.correct && branchTested === selectedBranch.id && <button className="guardian-primary guardian-button" type="button" onClick={() => goToStage('challenge')}>派 AI 去守城门 <ArrowRight size={18} /></button>}
            </div>
          </section>
        )}

        {stage === 'challenge' && currentChallenge && (
          <section className="guardian-stage guardian-challenge-stage" aria-labelledby="challenge-title">
            <div className="guardian-stage-heading">
              <span><Crosshair size={17} /> STAGE 3 · 城门实战 {challengeIndex + 1} / {challengeRoles.length}</span>
              <h1 id="challenge-title">陌生角色抵达城门</h1>
              <p>{mode === 'classroom' ? '先请全班举手投票，再选择大家的预判；随后由老师逐步揭晓 AI 的判断路径。' : '先做出自己的预判，再启动 AI 守卫，看看你和模型的思路是否一致。'}</p>
            </div>

            <div className="guardian-challenge-layout">
              <article className="guardian-candidate-card">
                <span className="guardian-candidate-number">NEW · 0{challengeIndex + 1}</span>
                <Image src={asset(currentChallenge.image)} alt={`${currentChallenge.name}角色`} width={640} height={640} priority />
                <h2>{currentChallenge.name}</h2>
                <div><span><Swords size={16} /> 攻击力 <strong>{currentChallenge.attack}</strong></span><span><ShieldCheck size={16} /> 防御力 <strong>{currentChallenge.defense}</strong></span><span><HeartPulse size={16} /> 血量 <strong>{currentChallenge.health}</strong></span></div>
              </article>

              <div className="guardian-gate-console">
                <div className="guardian-guess-panel">
                  <span>第一步 · 你的预判</span>
                  <h2>你觉得这位角色是什么身份？</h2>
                  <div><button className={guess === '勇士' ? 'is-selected warrior-choice' : 'warrior-choice'} type="button" disabled={runStatus !== 'idle'} onClick={() => setGuess('勇士')} aria-pressed={guess === '勇士'}><ShieldCheck size={20} /> 勇士 · 放行</button><button className={guess === '恶魔' ? 'is-selected demon-choice' : 'demon-choice'} type="button" disabled={runStatus !== 'idle'} onClick={() => setGuess('恶魔')} aria-pressed={guess === '恶魔'}><Crosshair size={20} /> 恶魔 · 拦截</button></div>
                </div>

                <div className="guardian-ai-console">
                  <div className="guardian-console-head"><span><BrainCircuit size={18} /> AI 守卫决策路径</span><small>{runStatus === 'idle' ? '等待启动' : runStatus === 'running' ? '正在判断…' : '判断完成'}</small></div>
                  <div className="guardian-path-list" aria-live="polite">
                    {currentPath.map((step, index) => {
                      const revealed = index < pathStep;
                      const active = revealed && index === pathStep - 1 && runStatus !== 'done';
                      return <article className={`${revealed ? 'is-revealed' : ''} ${active ? 'is-active' : ''} tone-${step.tone}`} key={`${currentChallenge.name}-${step.kicker}`}><span>{revealed ? index + 1 : '?'}</span><div><small>{step.kicker}</small><strong>{step.title}</strong><p>{revealed ? step.detail : '等待上一节点作出判断'}</p></div></article>;
                    })}
                  </div>

                  {runStatus !== 'done' && (
                    <button className="guardian-run-ai" type="button" disabled={!guess || (mode === 'solo' && runStatus === 'running')} onClick={mode === 'classroom' ? advanceClassroomPath : runSoloPath}>
                      <Play size={19} />
                      {mode === 'classroom' ? pathStep === 0 ? '启动 AI · 显示第一步' : '显示下一步' : runStatus === 'running' ? 'AI 正在判断…' : '启动 AI 守卫'}
                    </button>
                  )}

                  {runStatus === 'done' && (
                    <output className={`guardian-verdict ${modelPrediction(currentChallenge) === '勇士' ? 'is-warrior' : 'is-demon'}`}>
                      <span>{modelPrediction(currentChallenge) === '勇士' ? <ShieldCheck size={24} /> : <Crosshair size={24} />}</span>
                      <div><small>模型最终判断</small><strong>{modelPrediction(currentChallenge)} · {modelPrediction(currentChallenge) === '勇士' ? '打开城门' : '关闭城门'}</strong><p>{guess === modelPrediction(currentChallenge) ? '你的预判与模型一致！' : '你的预判与模型不同，回看上面的分支就能找到原因。'}</p></div>
                    </output>
                  )}
                </div>
              </div>
            </div>

            {runStatus === 'done' && <div className="guardian-action-row"><p>AI 没有见过这个角色，它只是把新数据放进刚学会的规则中。</p><button className="guardian-primary guardian-button" type="button" onClick={finishChallengeRole}>{challengeIndex < challengeRoles.length - 1 ? '迎接下一位角色' : '查看任务报告'} <ArrowRight size={18} /></button></div>}
          </section>
        )}

        {stage === 'complete' && (
          <section className="guardian-stage guardian-complete-stage" aria-labelledby="complete-title">
            <div className="guardian-complete-hero">
              <div>
                <span className="guardian-complete-badge"><CheckCircle2 size={18} /> MISSION COMPLETE</span>
                <h1 id="complete-title">AI 守卫<br />正式上岗</h1>
                <p>你没有直接告诉模型每一个新角色的答案，而是先给它训练数据，让它学出可以重复使用的判断规则。</p>
              </div>
              <div className="guardian-report-card">
                <span>本次任务报告</span>
                <div><small>模型训练集</small><strong>10 / 10</strong></div>
                <div><small>模型城门实战</small><strong>{challengeRoles.filter((role) => modelPrediction(role) === role.actual).length} / {challengeRoles.length}</strong></div>
                <div><small>你的提前预判</small><strong>{records.filter((record) => record.guess === record.actual).length} / 2</strong></div>
              </div>
            </div>

            <div className="guardian-recap-grid">
              <article><span>01 · 数据</span><h2>10 张有答案的角色卡</h2><p>攻击力、防御力、血量是特征；勇士 / 恶魔是标签。模型从这些已知答案中寻找规律。</p></article>
              <article><span>02 · 模型</span><h2>两个血量问题组成决策树</h2><p>先问血量是否 ≤ 245；如果不是，再问是否 ≤ 450。每次回答都决定接下来走哪条路。</p></article>
              <article><span>03 · 预测</span><h2>让陌生角色走过同一套规则</h2><p>新角色不在训练档案中，但它的特征可以沿着决策树一路走到勇士或恶魔的结果节点。</p></article>
            </div>

            <div className="guardian-code-reveal">
              <div><span>从游戏回到 Python</span><h2>刚才搭出的树，就是一组条件判断</h2><p>真正的决策树由程序从数据中训练出来；下面的代码用最直观的方式还原了它学到的路径。</p></div>
              <pre><code>{`if health <= 245:\n    result = "恶魔"\nelif health <= 450:\n    result = "勇士"\nelse:\n    result = "恶魔"`}</code></pre>
            </div>

            <aside className="guardian-twist"><Sparkles size={24} /><div><strong>为什么还要问第二个问题？</strong><p>因为腐肉巨兽的血量高达 480。第一问能抓住 4 个低血量恶魔，却会暂时把它和勇士放在一起；第二问正是为了找出这个“反常样本”。</p></div></aside>

            <div className="guardian-finish-actions">
              <button className="guardian-secondary" type="button" onClick={resetGame}><RotateCcw size={18} /> 再玩一次</button>
              <Link className="guardian-primary" href="/courses/ai-with-python/lesson-01#chapter-3">回到课件看 Python 实现 <ArrowRight size={18} /></Link>
            </div>
          </section>
        )}
      </div>

      {currentStageIndex >= 0 && <footer className="guardian-game-footer"><span>AI with Python · 第一课</span><span>游戏结果仅保存在当前浏览器</span></footer>}
    </main>
  );
}
