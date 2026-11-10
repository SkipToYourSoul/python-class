/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG chart provides an accessible image. */
'use client';

import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { PracticeStoryVideo } from '@/components/course/ai-with-python/practice-story-video';
import { useLessonPageState } from '@/components/course/lesson-state';
import { CodeTools } from './lesson-ui';
import { CURRENT_CODE } from './practice-content';
import {
  ATTACK_THRESHOLD,
  bossRecords,
  bossWindows,
  type BossRecord,
} from './study-data';
import {
  BOSS_DEMO_CODE,
  BOSS_DEMO_PHASES,
  BOSS_VIDEO,
  BOSS_MOMENTS,
  bossDemoPhaseAt,
} from './boss-finale-content';
import s from './boss-finale.module.css';

const colors: Record<string, string> = {
  强光: '#1457d9',
  火焰: '#be4b2b',
  热量: '#16806a',
};
const target = bossWindows[0];
const candidates = bossRecords.filter((row) => row.energy < ATTACK_THRESHOLD);
const plotHighlights = {
  'x="defense"': s.axisX,
  'y="energy"': s.axisY,
  'hue="weakness"': s.weakness,
  [`plt.axhline(${ATTACK_THRESHOLD},`]: s.threshold,
};

function BossPlot() {
  const x = (value: number) => 46 + value * 3.75;
  const y = (value: number) => 121 - value * 0.89;
  const thresholdY = y(ATTACK_THRESHOLD);
  return (
    <div className={s.plot} data-boss-evidence="plot">
      <div className={s.legend}>
        <strong className={s.weakness}>弱点</strong>
        {Object.entries(colors).map(([name, color]) => (
          <span key={name}>
            <i style={{ background: color }} />
            {name}
          </span>
        ))}
      </div>
      <svg
        viewBox="0 0 500 154"
        role="img"
        aria-label={`魔王九处护甲散点图。横轴防御力，纵轴外罩，虚线为外罩 ${ATTACK_THRESHOLD}。${candidates.map((row) => `${row.part}：外罩 ${row.energy}，防御 ${row.defense}，弱点${row.weakness}`).join('；')}。`}
      >
        <rect
          className={s.windowBand}
          x={x(0)}
          y={thresholdY}
          width={x(100) - x(0)}
          height={y(0) - thresholdY}
        />
        <text x="46" y="21" className={s.axisY}>
          外罩
        </text>
        {[0, ATTACK_THRESHOLD, 100].map((value) => (
          <g key={value}>
            <line
              x1={x(0)}
              x2={x(100)}
              y1={y(value)}
              y2={y(value)}
              stroke="#c3cbd6"
              className={
                value === ATTACK_THRESHOLD ? s.thresholdStroke : undefined
              }
            />
            <text
              x="39"
              y={y(value) + 6}
              textAnchor="end"
              className={value === ATTACK_THRESHOLD ? s.threshold : undefined}
            >
              {value}
            </text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((value) => (
          <text key={value} x={x(value)} y="144" textAnchor="middle">
            {value}
          </text>
        ))}
        <text x="494" y="144" textAnchor="end" className={s.axisX}>
          防御力
        </text>
        {bossRecords.map((row) => (
          <circle
            key={row.part}
            cx={x(row.defense)}
            cy={y(row.energy)}
            r={row.energy < ATTACK_THRESHOLD ? 6 : 4.5}
            fill={colors[row.weakness]}
            stroke="#071a3d"
            strokeWidth={row.energy < ATTACK_THRESHOLD ? 1.8 : 1}
          />
        ))}
        {candidates.map((row) => (
          <g key={row.part}>
            <line
              x1={x(row.defense)}
              x2={x(row.defense)}
              y1={thresholdY - 8}
              y2={y(row.energy) - 7}
              stroke="#526780"
            />
            <text x={x(row.defense)} y={thresholdY - 13} textAnchor="middle">
              {row.part}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BossTable({
  rows,
  heading,
  step,
}: {
  rows: readonly BossRecord[];
  heading: string;
  step: 'read' | 'filter' | 'sort';
}) {
  return (
    <div className={s.tablePanel} data-boss-evidence={step}>
      <table>
        <caption>{heading}</caption>
        <thead>
          <tr>
            <th scope="col">部位</th>
            <th
              scope="col"
              className={step === 'filter' ? s.threshold : undefined}
            >
              外罩
            </th>
            <th scope="col" className={step === 'sort' ? s.axisX : undefined}>
              {step === 'sort' ? '防御 ↑' : '防御'}
            </th>
            <th scope="col">弱点</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.part}>
              <th scope="row">{row.part}</th>
              <td className={step === 'filter' ? s.threshold : undefined}>
                {row.energy}
              </td>
              <td className={step === 'sort' ? s.axisX : undefined}>
                {row.defense}
              </td>
              <td>{row.weakness}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BossFinale() {
  const [saved] = useLessonPageState('l6-final-mission', {
    bossVideoElapsed: 0,
  });
  const time = Number.isFinite(saved.bossVideoElapsed)
    ? saved.bossVideoElapsed
    : 0;
  const phase = bossDemoPhaseAt(time);
  const decided = time >= BOSS_MOMENTS.decide;
  const readingPlot = phase.from === BOSS_MOMENTS.plot;
  return (
    <Stage
      tools={
        <CodeTools
          code={CURRENT_CODE}
          label="完整代码"
          description="教师演示参考。先运行练习包的预置环境格，再从上到下运行以下代码。"
        />
      }
      title="魔王决战：让证据指挥行动"
      label="FINAL DEMO · 数据全流程演示"
      className={s.page}
    >
      <div className={s.layout} data-boss-demo data-demo-phase={phase.from}>
        <div className={s.left}>
          <PracticeStoryVideo
            pageId="l6-final-mission"
            title="取证 → 分析 → 出击"
            src={BOSS_VIDEO.src}
            poster="/courses/ai-with-python/lesson-06/assets/boss-finale-poster.jpg"
            description="勇者根据护甲情报选择装备，先解除外层能量铠甲，再迎战魔王。"
            initialCaption={BOSS_DEMO_PHASES[0].text}
            initialDuration={BOSS_VIDEO.duration}
            phases={BOSS_DEMO_PHASES}
            checkpoint={{ time: BOSS_MOMENTS.plot, label: '停在作战判断' }}
            elapsedKey="bossVideoElapsed"
            loopKey="bossVideoLoop"
            controlLabel="魔王决战视频"
            captionTrack="/courses/ai-with-python/lesson-06/assets/boss-finale-wan3.zh.vtt"
            hasAudio
            compact
            className={s.movie}
          />
          {readingPlot && <BossPlot />}
          {phase.from === BOSS_MOMENTS.read && (
            <BossTable
              step="read"
              heading={`boss.csv · ${bossRecords.length} 条记录（前 3 条）`}
              rows={bossRecords.slice(0, 3)}
            />
          )}
          {phase.from === BOSS_MOMENTS.filter && (
            <BossTable
              step="filter"
              heading={`外罩低于 ${ATTACK_THRESHOLD} · ${bossRecords.length} 处 → ${candidates.length} 处`}
              rows={candidates}
            />
          )}
          {phase.from === BOSS_MOMENTS.sort && (
            <BossTable
              step="sort"
              heading="可破罩的部位 · 按防御从低到高"
              rows={bossWindows}
            />
          )}
        </div>
        <div className={s.code}>
          <NotebookPanel
            title="魔王决战.ipynb"
            compact
            cells={[
              {
                code: BOSS_DEMO_CODE,
                activeLines: [...phase.lines],
                highlightFragments: readingPlot ? plotHighlights : undefined,
              },
            ]}
          />
          {decided ? (
            <div className={s.result} data-demo-result>
              <strong>
                打{target.part} · 用{target.weakness}
              </strong>
              <p>
                外罩 {target.energy} &lt; {ATTACK_THRESHOLD}，防御{' '}
                {target.defense} 在候选中最低，弱点是{target.weakness}。
              </p>
            </div>
          ) : readingPlot ? (
            <div className={s.question}>
              虚线下有 {candidates.length} 个点，先打哪里？该用什么装备？
            </div>
          ) : null}
        </div>
      </div>
    </Stage>
  );
}
