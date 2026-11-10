'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowRight, Ruler } from 'lucide-react';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import { usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { assetBase } from './lesson-data';
import s from './decision-tree-explainer.module.css';

const { features, gift, labels, points, tree } = evidence;
const rootStep = tree.steps[0];
const labelColors = ['#1457d9', '#bd631e', '#27834b'];

const battleNodes = [
  {
    id: 'encounter',
    art: 'encounter',
    label: '能安全迎战吗？',
    type: '第一道判断',
  },
  { id: 'retreat', art: 'retreat', label: '先撤回城堡', type: '行动' },
  { id: 'potion', art: 'potion', label: '有魔法药水吗？', type: '下一道判断' },
  { id: 'sword', art: 'sword', label: '用剑迎战', type: '行动' },
  { id: 'magic', art: 'magic', label: '用魔法迎战', type: '行动' },
] as const;

const battleChoices = {
  retreat: '不能安全迎战 → 先撤回城堡。',
  sword: '可以迎战 → 没有药水 → 用剑击退恶魔。',
  magic: '可以迎战 → 有药水 → 用魔法击退恶魔。',
} as const;

const battleForks = [
  {
    row: 2,
    from: 66.67,
    branches: [
      { to: 16.67, label: '否', choice: 'retreat' },
      { to: 66.67, label: '是', choice: 'potion' },
    ],
  },
  {
    row: 4,
    from: 66.67,
    branches: [
      { to: 50, label: '否', choice: 'sword' },
      { to: 83.33, label: '是', choice: 'magic' },
    ],
  },
] as const;

export function TreeConcept() {
  const [state, setState] = usePageState<{
    battleChoice: keyof typeof battleChoices | '';
  }>({ battleChoice: '' });
  const choice = state.battleChoice;
  const onPath = (id: string) =>
    !!choice &&
    (id === 'encounter' ||
      id === choice ||
      (id === 'potion' && choice !== 'retreat'));

  return (
    <div className={s.concept}>
      <section className={s.battlePanel} aria-label="勇士遇到恶魔的决策树">
        <div className={s.battleTree}>
          <div className={s.battleGoal}>
            <figure>
              <Image
                src={`${assetBase}/assets/warrior-chibi.png`}
                alt=""
                width={384}
                height={384}
                sizes="112px"
              />
              <figcaption>勇士</figcaption>
            </figure>
            <blockquote>
              <strong>我要安全回到城堡！</strong>
              <span>先看看能不能迎战。</span>
            </blockquote>
            <ArrowRight className={s.goalArrow} aria-hidden="true" />
          </div>
          {battleNodes.map(({ id, art, label, type }) => {
            const select = id === 'retreat' || id === 'sword' || id === 'magic';
            const content = (
              <>
                <span
                  className={s.battleArt}
                  data-art={art}
                  aria-hidden="true"
                />
                <span className={s.battleLabel}>
                  <small>{type}</small>
                  <strong>{label}</strong>
                </span>
              </>
            );
            return select ? (
              <button
                key={id}
                type="button"
                data-node={id}
                data-active={onPath(id)}
                aria-pressed={choice === id}
                className={s.battleNode}
                onClick={() =>
                  setState({ battleChoice: choice === id ? '' : id })
                }
              >
                {content}
              </button>
            ) : (
              <div
                key={id}
                data-node={id}
                data-active={onPath(id)}
                className={s.battleNode}
              >
                {content}
              </div>
            );
          })}
          {battleForks.map(({ row, from, branches }) => (
            <div className={s.battleFork} key={row} style={{ gridRow: row }}>
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {branches.map(({ to, choice: target }) => (
                  <path
                    key={target}
                    d={`M${from} 0 V8 H${to} V37 m-0.7 -4 0.7 4 0.7 -4`}
                    vectorEffect="non-scaling-stroke"
                    data-active={onPath(target)}
                  />
                ))}
              </svg>
              {branches.map(({ to, label, choice: target }) => (
                <span
                  key={target}
                  data-active={onPath(target)}
                  style={{ left: `${to}%` }}
                >
                  {label}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className={s.battleFeedback} aria-live="polite">
          {choice
            ? battleChoices[choice]
            : '点一个行动，看看勇士经过了哪些判断。'}
        </p>
      </section>
      <div className={s.conceptNotes}>
        <XiaopaiSpeech active compact animated={false} label="小派讲解决策树">
          <span className={s.conceptSpeaker}>小派</span>
          <span>
            每答一道题，勇士就沿着<strong>「是」或「否」</strong>
            走一条分支，直到选出行动。
          </span>
          <span>
            把这样的判断排成树，就是<strong>决策树</strong>
            。它是一种机器学习模型，常用于监督学习中的分类。
          </span>
        </XiaopaiSpeech>
      </div>
    </div>
  );
}

function summarizePile(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const gini = total
    ? 1 - counts.reduce((sum, count) => sum + (count / total) ** 2, 0)
    : 0;
  return { counts, total, gini };
}

function createCut(threshold: number) {
  const groups = labels.map(() => 0);
  const left = [...groups];
  const right = [...groups];

  for (const [length, , label] of points) {
    const group = length <= threshold ? left : right;
    group[label] += 1;
  }

  const piles = [summarizePile(left), summarizePile(right)] as const;
  const impurity = piles.reduce(
    (sum, { total, gini }) => sum + (total / points.length) * gini,
    0,
  );
  return { threshold, piles, impurity };
}

const cuts = [createCut(4.45), createCut(rootStep.threshold)];
const exampleCut = cuts[1];

function CardPile({
  title,
  pile: { counts, total },
}: {
  title: string;
  pile: ReturnType<typeof summarizePile>;
}) {
  return (
    <div className={s.pile}>
      <strong>
        {title} · {total} 张
      </strong>
      <div className={s.pileBar} aria-hidden="true">
        {counts.map((count, index) =>
          count > 0 ? (
            <span
              key={labels[index]}
              style={{ flexGrow: count, backgroundColor: labelColors[index] }}
            />
          ) : null,
        )}
      </div>
      <div className={s.pileCounts}>
        {counts.map((count, index) =>
          count > 0 ? (
            <span key={labels[index]}>
              <i
                aria-hidden="true"
                style={{ backgroundColor: labelColors[index] }}
              />
              {labels[index]} {count}
            </span>
          ) : null,
        )}
      </div>
    </div>
  );
}

export function TreeGoal() {
  const [state, setState] = usePageState({ selectedCut: -1 });
  const firstChoice = useRef<HTMLButtonElement>(null);
  const hasChoice = state.selectedCut >= 0;
  const [left, right] = exampleCut.piles;

  return (
    <div className={s.goal}>
      <figure className={s.trainingStory}>
        <Image
          src={`${assetBase}/assets/decision-gardener-sorting.jpg`}
          alt="Q 版园丁在花房里把三种鸢尾花的样本卡分成两堆。"
          width={1199}
          height={1312}
          sizes="26vw"
        />
        <figcaption>
          <b>园丁</b>
          <p>
            刚才勇士按问题选路。现在要给鸢尾花分类，
            <strong>决策树怎么知道先问什么？</strong>
          </p>
        </figcaption>
      </figure>
      <div className={s.trainingCompare}>
        <div className={s.trainingPrompt}>
          <p className={s.trainingCounts}>
            <strong>{points.length} 张用来训练</strong>
            <span>另外 {tree.total} 张事先封好做考卷。</span>
          </p>
          <p>
            <b>目标</b> 建一棵能分辨三种鸢尾花的决策树。
          </p>
          <p>先看第一问。比较两堆的颜色，你觉得哪种分法混得更少？</p>
        </div>
        <div className={s.cutGrid}>
          {cuts.map((cut, index) => (
            <section
              key={cut.threshold}
              className={s.cut}
              data-selected={state.selectedCut === index}
            >
              <div className={s.cutHeader}>
                <h3>花瓣长 ≤ {cut.threshold.toFixed(2)} cm？</h3>
                <button
                  type="button"
                  className={s.button}
                  ref={index === 0 ? firstChoice : undefined}
                  aria-pressed={state.selectedCut === index}
                  onClick={() => setState({ selectedCut: index })}
                >
                  选择分法 {index === 0 ? 'A' : 'B'}
                </button>
              </div>
              <CardPile title="是 · 左堆" pile={cut.piles[0]} />
              <CardPile title="否 · 右堆" pile={cut.piles[1]} />
              {hasChoice && (
                <p className={s.score}>
                  加权基尼不纯度 <b>{cut.impurity.toFixed(3)}</b>
                </p>
              )}
            </section>
          ))}
        </div>
        {hasChoice && (
          <div className={s.trainingTakeaway}>
            <output>
              分法 B 的分数更低，混得更少。
              <strong>一层层选出这样的问题，就是在训练决策树。</strong>
            </output>
            <div className={s.trainingActions}>
              <Dialog>
                <DialogTrigger className={s.giniTrigger}>
                  看基尼算式
                </DialogTrigger>
                <DialogContent className={s.giniDialog} showCloseButton={false}>
                  <DialogTitle>分法 B 的基尼算式</DialogTitle>
                  <DialogDescription>
                    随机抽一张花卡，放回后再抽一张。两张卡种名不同的概率，就是这一堆的基尼不纯度。
                  </DialogDescription>
                  <p>
                    左堆全是山鸢尾，分数是 <b>{left.gini}</b>
                    。右堆两种各占一半，分数是 <b>{right.gini}</b>。
                  </p>
                  <div className={s.trainingFormula}>
                    <strong>各堆的分数乘上张数占比，再相加。</strong>
                    <p>
                      ({left.total}/{points.length}) × {left.gini} + (
                      {right.total}/{points.length}) × {right.gini} ≈{' '}
                      <b>{exampleCut.impurity.toFixed(3)}</b>
                    </p>
                  </div>
                  <DialogClose className={s.giniTrigger}>返回比较</DialogClose>
                </DialogContent>
              </Dialog>
              <button
                type="button"
                className={s.reset}
                onClick={() => {
                  setState({ selectedCut: -1 });
                  firstChoice.current?.focus();
                }}
              >
                重新比较
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type TreePosition = { id: number; x: number; depth: number };

function createTreeLayout() {
  const leafCount = tree.nodes.filter((node) => node.feature === null).length;
  const positions: TreePosition[] = [];
  let leavesVisited = 0;

  function place(id: number, depth: number): number {
    const node = tree.nodes[id];
    const x =
      node.left === null || node.right === null
        ? (100 * (leavesVisited++ + 0.5)) / leafCount
        : (place(node.left, depth + 1) + place(node.right, depth + 1)) / 2;
    positions[id] = { id, x, depth };
    return x;
  }

  place(0, 0);
  return positions;
}

const positions = createTreeLayout();
const irisPhotos = ['setosa', 'versicolor', 'virginica'] as const;
const nodeHeight = 56;
const layerHeight = 82;
const diagramHeight =
  Math.max(...positions.map(({ depth }) => depth)) * layerHeight + nodeHeight;
const route = tree.steps.map((step) =>
  step.wentLeft ? tree.nodes[step.node].left : tree.nodes[step.node].right,
);
export function TreeAnatomy() {
  const [state, setState] = usePageState({ pathLength: 0, tryAgain: false });
  const markedNodes = [0, ...route.slice(0, state.pathLength)];
  const step = tree.steps[state.pathLength];
  const currentNode = markedNodes.at(-1) ?? 0;
  const walkedStep = tree.steps[state.pathLength - 1];

  function chooseBranch(wentLeft: boolean) {
    if (!step) return;
    if (wentLeft === step.wentLeft) {
      setState({ pathLength: state.pathLength + 1, tryAgain: false });
    } else {
      setState({ tryAgain: true });
    }
  }

  const edges = positions.flatMap((from) =>
    [tree.nodes[from.id].left, tree.nodes[from.id].right].flatMap(
      (toId, index) =>
        toId === null
          ? []
          : [
              {
                from,
                to: positions[toId],
                left: index === 0,
                marked: markedNodes.includes(toId),
              },
            ],
    ),
  );

  return (
    <div className={s.anatomy}>
      <div className={s.treeSample}>
        <b>带一朵示例花走树</b>
        <ul aria-label="示例花的测量值">
          {features.map((feature, index) => (
            <li key={feature} data-in-use={step?.feature === index}>
              {feature} <strong>{gift.values[index].toFixed(1)} cm</strong>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.structureBar}>
        <span>
          <b>根节点</b> 上页选出的第一问
        </span>
        <span>
          <b>内部节点</b> 接着问
        </span>
        <span>
          <b>分支</b> 按「是／否」走到下一个节点
        </span>
        <span>
          <b>叶节点</b> 到终点，读出种名
        </span>
      </div>

      <div className={s.treeCanvas}>
        <svg
          className={s.connectors}
          viewBox={`0 0 1000 ${diagramHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {edges.map(({ from, to, marked }) => (
            <line
              key={to.id}
              x1={from.x * 10}
              y1={from.depth * layerHeight + nodeHeight}
              x2={to.x * 10}
              y2={to.depth * layerHeight}
              data-marked={marked}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {edges.map(({ from, to, left, marked }) => (
          <span
            key={to.id}
            className={s.edgeLabel}
            data-marked={marked}
            style={{
              left: `${(from.x + to.x) / 2}%`,
              top: `${((to.depth * layerHeight - (layerHeight - nodeHeight) / 2) / diagramHeight) * 100}%`,
            }}
          >
            {left ? '是' : '否'}
          </span>
        ))}
        {positions.map(({ id, x, depth }) => {
          const node = tree.nodes[id];
          const isLeaf = node.feature === null || node.threshold === null;
          return (
            <div
              className={s.treeNode}
              key={id}
              data-leaf={isLeaf}
              data-species={isLeaf ? node.prediction : undefined}
              data-marked={markedNodes.includes(id)}
              data-current={currentNode === id}
              style={{
                left: `${x}%`,
                top: `${((depth * layerHeight) / diagramHeight) * 100}%`,
                minHeight: `${(nodeHeight / diagramHeight) * 100}%`,
              }}
            >
              {isLeaf ? (
                <Image
                  className={s.nodeArt}
                  src={`${assetBase}/assets/iris-catalog/${irisPhotos[node.prediction]}.jpg`}
                  alt=""
                  width={56}
                  height={56}
                  sizes="54px"
                />
              ) : (
                <Ruler className={s.nodeArt} aria-hidden="true" />
              )}
              <div>
                <span>
                  {depth === 0 ? '根节点' : isLeaf ? '叶节点' : '内部节点'}
                </span>
                <strong>
                  {node.feature !== null && node.threshold !== null
                    ? `${features[node.feature]} ≤ ${node.threshold.toFixed(2)}？`
                    : labels[node.prediction]}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className={s.pathActions}>
        <div
          className={s.pathCaption}
          data-retry={state.tryAgain}
          aria-live="polite"
        >
          {step ? (
            <>
              <strong>
                第 {state.pathLength + 1} 问 · {features[step.feature]} ≤{' '}
                {step.threshold.toFixed(2)} cm？
              </strong>
              <span>
                {state.tryAgain
                  ? `再比一比：这朵花的${features[step.feature]}是 ${step.value.toFixed(1)} cm。`
                  : walkedStep
                    ? `刚才：${tree.path[state.pathLength - 1]}，沿「${walkedStep.wentLeft ? '是' : '否'}」走。`
                    : '看测量值，选「是」或「否」。'}
              </span>
            </>
          ) : (
            <>
              <strong>
                走到叶节点 · 预测种名是
                {labels[tree.nodes[currentNode].prediction]}
              </strong>
              <span>
                走过的分支：
                {tree.steps
                  .map(({ wentLeft }) => (wentLeft ? '是' : '否'))
                  .join(' → ')}
              </span>
            </>
          )}
        </div>
        <div className={s.pathChoices}>
          {step && (
            <>
              <button
                type="button"
                className={s.button}
                onClick={() => chooseBranch(true)}
              >
                是，走左边
              </button>
              <button
                type="button"
                className={s.button}
                onClick={() => chooseBranch(false)}
              >
                否，走右边
              </button>
            </>
          )}
          <button
            type="button"
            className={s.reset}
            onClick={() => setState({ pathLength: 0, tryAgain: false })}
            disabled={state.pathLength === 0 && !state.tryAgain}
          >
            重走路径
          </button>
        </div>
      </div>
    </div>
  );
}
