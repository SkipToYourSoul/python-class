/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The inline floor diagrams are exposed as named images. */
'use client';

import Image from 'next/image';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Flower2,
  GitBranch,
  Tag,
  Target,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { usePageState } from '@/components/course/lesson-state';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { GuessReviewBadge, useFlowerGuess } from './flower-guesses';
import { assetBase } from './lesson-data';
import s from './svm-lesson.module.css';

const { labels, tree, svm } = evidence;
const [rootStep, widthStep, nearStep] = tree.steps;
const reviewFlowers = [
  { card: 'A', length: 4.9, prediction: labels[1] },
  { card: 'B', length: 5, prediction: labels[2] },
] as const;

export function TreeReview({ children }: { children: ReactNode }) {
  const [state, setState] = usePageState({ showBranches: false });
  const revealed = state.showBranches;
  return (
    <div className={s.reviewLesson}>
      {children}
      <div className={s.reviewContent}>
        <figure className={s.treeWalk} data-revealed={revealed}>
          <figcaption>
            <strong>两朵示例花 · 放大最后一问</strong>
            <span>花瓣长只差 0.1 厘米</span>
          </figcaption>
          <div className={s.reviewPair}>
            {reviewFlowers.map(({ card, length }) => (
              <div className={s.flowerReading} data-card={card} key={card}>
                <Flower2 aria-hidden="true" />
                <div>
                  <span>花 {card} · 花瓣长</span>
                  <b>
                    {length.toFixed(2)} <small>厘米</small>
                  </b>
                </div>
              </div>
            ))}
          </div>
          <p className={s.commonRoute}>
            <b>前两问走同一条路</b>
            <span>
              花瓣长 &gt; {rootStep.threshold} 厘米，花瓣宽都是{' '}
              {widthStep.value.toFixed(2)} 厘米（≤ {widthStep.threshold}）
            </span>
          </p>
          <h3 className={s.thresholdNode}>
            花瓣长 ≤ <mark>{nearStep.threshold}</mark> 厘米？
          </h3>
          <div className={s.reviewFork} aria-hidden="true">
            <svg viewBox="0 0 1000 52" preserveAspectRatio="none">
              <path d="M500 0V11Q500 24 476 25L278 29Q250 30 250 44V51" />
              <path d="M500 0V11Q500 24 524 25L722 29Q750 30 750 44V51" />
            </svg>
          </div>
          <div
            className={s.reviewPair}
            id="l7-tree-review-outcomes"
            aria-live="polite"
          >
            {reviewFlowers.map(({ card, length, prediction }) => {
              const goesLeft = length <= nearStep.threshold;
              return (
                <div className={s.branchLeaf} data-card={card} key={card}>
                  <p>
                    <span>{goesLeft ? '是' : '否'}</span>{' '}
                    {revealed && (
                      <>
                        花 {card} · {length.toFixed(2)} {goesLeft ? '≤' : '>'}{' '}
                        {nearStep.threshold}
                      </>
                    )}
                  </p>
                  <b>{revealed ? prediction : '会猜成哪种？'}</b>
                </div>
              );
            })}
          </div>
        </figure>
        <div className={s.reviewNotes}>
          <button
            className={s.action}
            type="button"
            aria-expanded={revealed}
            aria-controls="l7-tree-review-outcomes"
            onClick={() => setState({ showBranches: !revealed })}
          >
            <ArrowDown aria-hidden="true" size={21} />
            {revealed ? '收起预测结果' : '看两朵花怎么走'}
          </button>
          <article className={s.reviewNote}>
            <h3>
              <GitBranch aria-hidden="true" /> 优点 · 每一步都能查
            </h3>
            <p>沿着问题和分支回头看，就能说清树为什么这么猜。</p>
          </article>
          <article className={s.reviewNote}>
            <h3>
              <Target aria-hidden="true" /> 局限 · 差一点就可能改判
            </h3>
            <p>读数一跨过分界，就会换一条路。遇到少见的花，树也可能猜错。</p>
          </article>
          <p className={s.reviewBridge}>
            <b>
              <ArrowRight aria-hidden="true" /> 下一站 · 支持向量机（SVM）
            </b>
            两群花点之间，能留出多宽的一条走廊？
          </p>
        </div>
      </div>
    </div>
  );
}

const marginPoints = [
  [89, 74],
  [122, 141],
  [147, 104],
  [182, 163],
  [200, 107],
  [307, 107],
  [324, 163],
  [362, 84],
  [385, 137],
  [417, 99],
] as const;

const candidateLines = { A: 223, B: 253.5 } as const;
const floorGridStep = 20;

function FlowerFloorGrid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern
          id={id}
          width={floorGridStep}
          height={floorGridStep}
          patternUnits="userSpaceOnUse"
        >
          <rect width={floorGridStep} height={floorGridStep} fill="#faf4e4" />
          <path
            d={`M${floorGridStep} 0H0V${floorGridStep}`}
            fill="none"
            stroke="#ddcfb2"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        x="35"
        y="32"
        width="440"
        height="170"
        rx="8"
        fill={`url(#${id})`}
      />
    </>
  );
}

function FlowerFloorPoints() {
  return marginPoints.map(([x, y], index) =>
    index < 5 ? (
      <circle className={s.redFlower} key={x} cx={x} cy={y} r="9" />
    ) : (
      <rect
        className={s.blueFlower}
        key={x}
        x={x - 8}
        y={y - 8}
        width="16"
        height="16"
        rx="3"
      />
    ),
  );
}

export function FlowerFloorIntro({
  comic,
  children,
}: {
  comic: ReactNode;
  children: ReactNode;
}) {
  const position = candidateLines.A;
  return (
    <div className={s.floorIntro}>
      {comic}
      <div className={s.floorGuide}>
        {children}
        <figure className={s.floorBoard}>
          <figcaption>
            <strong>花房地面 · 俯视图</strong>
            <div className={s.floorLegend}>
              <span>
                <i className={s.redFlower} /> 红色圆点
              </span>
              <span>
                <i className={s.blueFlower} /> 蓝色方点
              </span>
            </div>
          </figcaption>
          <svg
            className={s.floorDiagram}
            viewBox="23 0 464 215"
            role="img"
            aria-label="俯视花房地面。公主的分界线拉在两群花点之间，红色圆点全在线左侧，蓝色方点全在线右侧。"
          >
            <FlowerFloorGrid id="l7-intro-floor-grid" />
            <FlowerFloorPoints />
            <g className={s.floorRope}>
              <line
                x1={position}
                x2={position}
                y1="33"
                y2="201"
                strokeWidth="5"
              />
              <line
                x1={position}
                x2={position}
                y1="33"
                y2="201"
                strokeWidth="2"
                stroke="#ffc91c"
              />
              <circle cx={position} cy="33" r="4" />
              <circle cx={position} cy="201" r="4" />
              <text x={position} y="22" textAnchor="middle">
                分界线
              </text>
            </g>
          </svg>
          <div className={s.floorPrompt}>
            <h3>这条线还能放在哪儿？</h3>
            <p>在图上指一指。往左或往右挪，哪里还能让两群花点各在一边？</p>
          </div>
          <p className={s.floorNext}>
            <ArrowRight aria-hidden="true" /> 下一页 · 比比哪条线留下的走廊更宽
          </p>
        </figure>
      </div>
    </div>
  );
}

const marginSpeech = {
  guess:
    '刚才我拉的是 A 线。往右挪到 B 线，两群花点也能分开。你猜哪条线能留出更宽的走廊？',
  A: '两段紫线分别连着最近的红点和蓝点。黄色走廊从 A 线向两边等宽展开，会先碰到红点，所以要用较短的那段。',
  B: (
    <>
      两段紫线一样长。圈出的两个花点离 B 线最近，撑住了走廊的两边，叫
      <b>支持向量</b>。
    </>
  ),
};

function measureMargin(position: number) {
  const nearestRed = marginPoints
    .filter(([x]) => x < position)
    .reduce((nearest, point) => (point[0] > nearest[0] ? point : nearest));
  const nearestBlue = marginPoints
    .filter(([x]) => x > position)
    .reduce((nearest, point) => (point[0] < nearest[0] ? point : nearest));
  const nearest = [nearestRed, nearestBlue].map(([x, y]) => ({
    x,
    y,
    distance: Math.abs(x - position),
  }));
  return {
    nearest,
    minimum: Math.min(...nearest.map((point) => point.distance)),
  };
}

const lineMargins = {
  A: measureMargin(candidateLines.A),
  B: measureMargin(candidateLines.B),
};

const gridDistanceFormat = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatGridDistance(distance: number) {
  return gridDistanceFormat.format(distance / floorGridStep);
}

export function MarginLesson({
  speech,
}: {
  speech: (line: ReactNode) => ReactNode;
}) {
  const [state, setState] = usePageState({
    marginLine: null as keyof typeof candidateLines | null,
    viewedMargins: [] as (keyof typeof candidateLines)[],
  });
  const selected = state.marginLine;
  const activeLine = selected ?? 'A';
  const position = candidateLines[activeLine];
  const { nearest, minimum: halfWidth } = lineMargins[activeLine];
  const [redPoint, bluePoint] = nearest;
  const edges = [position - halfWidth, position + halfWidth];
  const viewed = new Set(state.viewedMargins);
  if (selected) viewed.add(selected);
  const compared = viewed.has('A') && viewed.has('B');

  return (
    <div className={s.marginLesson}>
      <figure className={s.marginFigure}>
        <figcaption>
          <strong>花房地面 · 同一组花点</strong>
          <span>A 是公主刚才拉的线</span>
        </figcaption>
        <svg
          viewBox="23 0 464 252"
          role="img"
          aria-label={
            selected === 'A'
              ? '最近的红点和蓝点都用紫色垂直线段连到 A 线。红点离线更近，黄色走廊的半宽取红点的距离。'
              : selected === 'B'
                ? 'B 线的黄色走廊较宽。左右两侧各圈出一个最近的花点，用等长的紫色垂直线段连到 B 线。'
                : '红色圆点在左，蓝色方点在右。A 线和 B 线都能分开两类点。'
          }
        >
          <FlowerFloorGrid id="l7-svm-floor-grid" />
          {selected && (
            <g>
              <rect
                x={position - halfWidth}
                y="33"
                width={2 * halfWidth}
                height="168"
                fill="#ffe485"
                fillOpacity=".8"
              />
              {edges.map((x) => (
                <line
                  key={x}
                  x1={x}
                  x2={x}
                  y1="33"
                  y2="201"
                  stroke="#936515"
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
              ))}
            </g>
          )}
          <FlowerFloorPoints />
          {selected &&
            nearest.map(({ x, y }) => (
              <circle
                key={x}
                cx={x}
                cy={y}
                r="14"
                fill="none"
                stroke="#071a3d"
                strokeWidth="2.5"
              />
            ))}
          {Object.entries(candidateLines).map(([name, x]) => {
            const active = selected === name;
            if (selected && !active) return null;
            return (
              <g key={name}>
                <line
                  x1={x}
                  x2={x}
                  y1="33"
                  y2="201"
                  stroke="#071a3d"
                  strokeWidth={active ? 4 : 2}
                  strokeDasharray={active ? undefined : '5 5'}
                />
                <text x={x} y="23" textAnchor="middle">
                  {name}
                </text>
              </g>
            );
          })}
          {selected && (
            <>
              <g className={s.pointDistance}>
                {nearest.map(({ x, y }) => (
                  <line key={x} x1={x} x2={position} y1={y} y2={y} />
                ))}
                {[...new Set(nearest.map(({ y }) => y))].map((y) => (
                  <g key={y}>
                    <circle cx={position} cy={y} r="3.5" />
                    <path d={`M${position - 7} ${y}v-7h7`} />
                  </g>
                ))}
              </g>
              {nearest.map(({ x, y, distance }) => (
                <text
                  className={s.pointDistanceLabel}
                  key={x}
                  x={position + (x < position ? -8 : 8)}
                  y={y - 17}
                  textAnchor={x < position ? 'end' : 'start'}
                >
                  约 {formatGridDistance(distance)} 格
                </text>
              ))}
              <g stroke="#805012" strokeWidth="2.5">
                <line
                  x1={position - halfWidth}
                  x2={position + halfWidth}
                  y1="218"
                  y2="218"
                />
                {edges.map((x) => (
                  <line key={x} x1={x} x2={x} y1="212" y2="224" />
                ))}
                <text x={position} y="247" textAnchor="middle" stroke="none">
                  {selected} 线的走廊
                </text>
              </g>
            </>
          )}
        </svg>
        <div className={s.distanceCompare} aria-live="polite">
          <p>两条线的最小距离 · 按图中小格计</p>
          <div className={s.distanceCards}>
            {(['A', 'B'] as const).map((line) => (
              <div
                className={s.distanceCard}
                key={line}
                data-better={compared && line === 'B'}
              >
                <b>{line} 线</b>
                <span>
                  {viewed.has(line)
                    ? `约 ${formatGridDistance(lineMargins[line].minimum)} 格`
                    : '待查看'}
                </span>
                <div className={s.distanceTrack} aria-hidden="true">
                  {compared && (
                    <div
                      style={{
                        width: `${(lineMargins[line].minimum / lineMargins.B.minimum) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </figure>
      <div className={s.marginGuide}>
        <div className={s.marginControls}>
          <p>先猜一猜，再分别点开核对。</p>
          <div className={s.actions}>
            {(['A', 'B'] as const).map((name) => (
              <button
                className={s.action}
                type="button"
                key={name}
                aria-pressed={selected === name}
                onClick={() =>
                  setState({
                    marginLine: selected === name ? null : name,
                    viewedMargins: [...new Set([...viewed, name])],
                  })
                }
              >
                看 {name} 线的间隔
              </button>
            ))}
          </div>
        </div>
        <div aria-live="polite">
          {speech(marginSpeech[selected ?? 'guess'])}
          {selected && (
            <div className={s.withinMargin}>
              <h3>① 同一条线，两边取较小值</h3>
              <p>
                {selected === 'A'
                  ? `${formatGridDistance(redPoint.distance)} 格小于 ${formatGridDistance(bluePoint.distance)} 格，取 `
                  : '两边一样远，最小距离约 '}
                <b>{formatGridDistance(halfWidth)} 格</b>。
              </p>
            </div>
          )}
        </div>
        {compared && (
          <article className={s.marginTakeaway}>
            <h3>② 比两条线的最小距离，选较大的</h3>
            <p>
              <b>B 线的最小距离更大</b>
              ，给读数的小变化留出更多余地。两类点能用直线分开时，
              <b>SVM 的训练目标</b>就是让这个最小距离尽量大。
            </p>
          </article>
        )}
      </div>
    </div>
  );
}

// Reuse the flower groups and the B boundary from the greenhouse floor.
const petalLengthPosition = (x: number) => (x - 35) / 440;
const petalWidthPosition = (y: number) => (201 - y) / 168;
const boundaryPosition = petalLengthPosition(candidateLines.B);
const sampleHeights = [
  0.3, 0.58, 0.69, 0.36, 0.45, 0.54, 0.7, 0.28, 0.61, 0.36,
];

function projectFlowerSpace(length: number, width: number, height: number) {
  return [53 + 260 * length + 100 * width, 163 - 44 * width - 106 * height];
}

function DimensionFlower({
  x,
  y,
  blue,
}: {
  x: number;
  y: number;
  blue: boolean;
}) {
  return blue ? (
    <rect
      className={s.blueFlower}
      x={x - 6}
      y={y - 6}
      width="12"
      height="12"
      rx="2"
    />
  ) : (
    <circle className={s.redFlower} cx={x} cy={y} r="6.5" />
  );
}

function TwoReadingDiagram() {
  const boundaryX = 53 + 340 * boundaryPosition;
  return (
    <svg
      viewBox="0 0 450 200"
      role="img"
      aria-label="两项读数决定花点在纸面上的位置。横轴是花瓣长，纵轴是花瓣宽。B 直线左边是红色圆点，右边是蓝色方点。"
    >
      <rect
        x="53"
        y="38"
        width="340"
        height="125"
        rx="6"
        className={s.dimensionGrid}
      />
      <path
        d="M121 38v125m68-125v125m68-125v125m68-125v125M53 69h340M53 100h340M53 132h340"
        className={s.dimensionGuide}
      />
      <path
        d="M53 35v128h344m-6-5 6 5-6 5M48 41l5-6 5 6"
        className={s.dimensionAxis}
      />
      <line
        x1={boundaryX}
        x2={boundaryX}
        y1="38"
        y2="163"
        className={s.dimensionBoundary}
      />
      {marginPoints.map(([x, y], index) => (
        <DimensionFlower
          key={x}
          x={53 + 340 * petalLengthPosition(x)}
          y={163 - 125 * petalWidthPosition(y)}
          blue={index >= 5}
        />
      ))}
      <text x="53" y="26">
        花瓣宽
      </text>
      <text x="393" y="189" textAnchor="end">
        花瓣长
      </text>
      <text
        x={boundaryX}
        y="26"
        textAnchor="middle"
        className={s.dimensionBoundaryLabel}
      >
        B 线
      </text>
    </svg>
  );
}

function ThreeReadingDiagram() {
  const partition = [
    projectFlowerSpace(boundaryPosition, 0, 0),
    projectFlowerSpace(boundaryPosition, 1, 0),
    projectFlowerSpace(boundaryPosition, 1, 1),
    projectFlowerSpace(boundaryPosition, 0, 1),
  ]
    .map((corner) => corner.join(','))
    .join(' ');
  const points = marginPoints.map(([x, y], index) => {
    const [drawX, drawY] = projectFlowerSpace(
      petalLengthPosition(x),
      petalWidthPosition(y),
      sampleHeights[index],
    );
    return <DimensionFlower key={x} x={drawX} y={drawY} blue={index >= 5} />;
  });
  return (
    <svg
      viewBox="0 0 450 200"
      role="img"
      aria-label="萼片长是第三个方向，决定花点的高度。沿 B 线竖起的半透明平面把红色圆点和蓝色方点隔在两边。"
    >
      <path d="M53 163h260l100-44H153Z" className={s.dimensionGrid} />
      <path
        d="M53 57h260l100-44H153Z M153 13v106m160 44V57m100 62V13m-260 106H413"
        className={s.dimensionGuide}
      />
      <path
        d="M53 55v108h264m-6-5 6 5-6 5M48 61l5-6 5 6M313 163l100-44m-8-2 8 2-4 7"
        className={s.dimensionAxis}
      />
      {points.slice(5)}
      <polygon points={partition} className={s.dimensionPlane} />
      {points.slice(0, 5)}
      <text x="20" y="44">
        萼片长
      </text>
      <text x="313" y="189" textAnchor="end">
        花瓣长
      </text>
      <text x="425" y="153" textAnchor="end">
        花瓣宽
      </text>
      <path d="M290 37h17" className={s.dimensionBoundary} />
      <text x="315" y="43" className={s.dimensionBoundaryLabel}>
        分界平面
      </text>
    </svg>
  );
}

export function Hyperplanes({ children }: { children: ReactNode }) {
  return (
    <div className={s.dimensions}>
      {children}
      <div className={s.dimensionDiagrams}>
        <figure>
          <figcaption>
            <span>两项读数</span> <strong>在纸面上用直线分</strong>
          </figcaption>
          <TwoReadingDiagram />
        </figure>
        <figure>
          <figcaption>
            <span>三项读数</span> <strong>在空间里用平面分</strong>
          </figcaption>
          <ThreeReadingDiagram />
        </figure>
      </div>
      <div className={s.dimensionConclusion}>
        <div>
          <h3>四项读数 · 用超平面分</h3>
          <ul className={s.dimensionFeatures} aria-label="鸢尾花的四项读数">
            {evidence.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <p>
            四项读数决定花点在四维空间里的位置。线性 SVM
            在这个空间里找到的分界叫<b>超平面</b>。
          </p>
          <p className={s.dimensionNext}>
            <ArrowRight aria-hidden="true" /> 下一页 ·
            用礼花的四项读数做第三次猜花
          </p>
        </div>
      </div>
    </div>
  );
}

function useGuessHistory() {
  const first = useFlowerGuess('first');
  const second = useFlowerGuess('second');
  const third = useFlowerGuess('third');
  return [
    { round: '第一次', method: '看散点图', ...first },
    { round: '第二次', method: '走决策树', ...second },
    { round: '第三次', method: '看分类边界', ...third },
  ];
}

export function ModelComparison() {
  const guesses = useGuessHistory();
  const allRecorded = guesses.every(({ guess }) => guess !== '');
  const hasPendingReview = guesses.some(({ needsReview }) => needsReview);

  return (
    <div className={s.modelResults}>
      <div className={s.scoreIntro}>
        <h3>同一份测试卡 · 共 {tree.total} 张</h3>
        <p>每格一张卡 · 蓝色答对，黄色答错</p>
      </div>
      <div className={s.comparison}>
        {[
          { name: '决策树', model: tree },
          { name: '线性 SVM', model: svm },
        ].map(({ name, model }) => (
          <article className={s.scoreCard} key={name}>
            <h3>{name}</h3>
            <p className={s.bigScore}>
              <span>答对</span> {model.correct}
              <span> / {model.total} 张</span>
            </p>
            <div className={s.scoreTiles} aria-hidden="true">
              {Array.from({ length: model.total }, (_, index) => (
                <span key={index} data-correct={index < model.correct} />
              ))}
            </div>
            <p className={s.scoreMisses}>
              答错 {model.total - model.correct} 张
            </p>
          </article>
        ))}
      </div>
      <div className={s.comparison}>
        <section className={s.guessReview}>
          <h3>对照我的三次猜花</h3>
          <dl>
            {guesses.map(({ round, method, guess, needsReview }) => (
              <div key={round}>
                <dt>
                  <b>{round}</b>
                  <span>{method}</span>
                </dt>
                <dd>
                  {guess === '' ? '未记录' : labels[Number(guess)]}
                  {needsReview && <GuessReviewBadge />}
                </dd>
              </div>
            ))}
          </dl>
          <p>
            {hasPendingReview
              ? '实测读数有变化，请回到对应的练习，用新读数复核。'
              : allRecorded
                ? '三次猜的种名一样吗？等花签打开，再核对礼花的答案。'
                : '还没记录的结果，可以回到对应的练习补上。'}
          </p>
        </section>
        <section className={s.scoreTakeaway}>
          <h3>这次线性 SVM 多答对 {svm.correct - tree.correct} 张</h3>
          <p>
            这份考卷只说明两种模型这一次的表现。换一批测试卡，谁答对得更多可能会变。
          </p>
        </section>
      </div>
    </div>
  );
}

export function SupervisedSummary() {
  const cards = [
    {
      round: '第一次猜花',
      title: '从散点图找线索',
      action: '用花瓣长和宽找相近的花点，从颜色找线索。',
      Icon: Target,
      takeaway: '想清楚问题',
      detail: '我们要预测的是礼花的种名，这是分类问题。',
    },
    {
      round: '第二次猜花',
      title: '顺着决策树走',
      action: '用礼花的四项读数沿着决策树走到一个种名。',
      Icon: BookOpen,
      takeaway: '用可靠的带标签数据训练',
      detail: '花卡的读数要量准，种名要标对。模型用它们来学分类规则。',
    },
    {
      round: '第三次猜花',
      title: '看分类边界',
      action: '用同样的四项读数，让线性 SVM 按分类边界猜种名。',
      Icon: GitBranch,
      takeaway: '选择合适的模型',
      detail: '选模型时，既看预测准不准，也看判断过程好不好解释。',
    },
  ];
  return (
    <div className={s.summary}>
      <div className={s.summaryCards}>
        {cards.map(({ round, title, action, Icon, takeaway, detail }) => (
          <article className={s.summaryCard} key={round}>
            <span className={s.summaryRound}>{round}</span>
            <h3>{title}</h3>
            <p>{action}</p>
            <div className={s.summaryTakeaway}>
              <h4>
                <Icon aria-hidden="true" /> {takeaway}
              </h4>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
      <div className={s.summaryEnd}>
        <section className={s.summaryTest}>
          <h3>用事先留出的测试卡检验</h3>
          <dl>
            <div>
              <dt>{evidence.points.length} 张训练卡</dt>
              <dd>看读数和种名，学规则</dd>
            </div>
            <div>
              <dt>{tree.total} 张测试卡</dt>
              <dd>先猜种名，再翻标签评分</dd>
            </div>
          </dl>
          <p>两种模型用同一份没见过的考卷，才好比较。</p>
        </section>
        <section className={s.summaryTeaser}>
          <div>
            <h3>公主手里的花签</h3>
            <p>礼花的种名还藏在花签里。带着你的猜花记录来核对吧。</p>
            <p className={s.summaryNext}>
              <ArrowRight aria-hidden="true" /> 下一页 · 打开花签
            </p>
          </div>
          <figure
            className={`${s.giftArt} ${s.summaryGiftArt}`}
            aria-label="公主和勇士看着礼花上还没打开的花签"
          />
        </section>
      </div>
    </div>
  );
}

const giftName = '荷兰球根鸢尾';

export function GiftReveal() {
  const [state, setState] = usePageState({ tagRevealed: false });
  const guesses = useGuessHistory();

  return (
    <div className={s.reveal}>
      <figure className={s.revealIllustration}>
        <Image
          src={`${assetBase}/assets/princess-flower-tag.png`}
          alt="Q 版公主举起还没打开的花签，旁边是一朵紫色鸢尾花。"
          fill
          sizes="40vw"
        />
      </figure>
      <div className={s.stack}>
        <blockquote className={s.princessLine}>
          <b>公主</b> 打开花签，把上面的种名和你的猜花记录对一对。
        </blockquote>
        <section className={s.revealGuesses}>
          <h3>我的三次猜花记录</h3>
          <dl className={s.guessHistory}>
            {guesses.map(({ round, method, guess, needsReview }) => (
              <div key={round}>
                <dt>
                  <b>{round}</b>
                  <span>{method}</span>
                </dt>
                <dd>
                  {guess === '' ? '未记录' : labels[Number(guess)]}
                  {needsReview && <GuessReviewBadge />}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <button
          className={s.action}
          type="button"
          aria-expanded={state.tagRevealed}
          aria-controls="l7-flower-tag"
          onClick={() => setState({ tagRevealed: !state.tagRevealed })}
        >
          <Tag size={21} aria-hidden="true" />{' '}
          {state.tagRevealed ? '合上花签' : '打开花签'}
        </button>
        <div aria-live="polite" id="l7-flower-tag">
          {state.tagRevealed && (
            <div className={s.flowerTag}>
              <span>花签上的种名</span>
              <h3>
                <Flower2 aria-hidden="true" /> {giftName}
              </h3>
              <p>
                这朵花的种名在花谱之外，模型只能从训练时见过的山鸢尾、变色鸢尾和维吉尼亚鸢尾三个标签中选一个。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
