'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { GuessReviewPrompt, useFlowerGuess } from './flower-guesses';
import { GiftMeasurements } from './gift-measurements';
import { assetBase } from './lesson-data';
import s from './decision-tree-practice.module.css';

const { features, gift, labels, species, tree } = evidence;

// Positions on the original 1392 × 930 figure along the example flower's route.
const figureNodes = [
  [352, 24, 314, 144],
  [547, 276, 304, 143],
  [163, 527, 314, 143],
  [409, 792, 201, 117],
] as const;
const figureBranches = [
  [563, 168, 640, 270],
  [591, 419, 435, 522],
  [375, 670, 461, 786],
] as const;

function ExampleRoute({ step }: { step: number }) {
  return (
    <g aria-hidden="true" fill="none" strokeWidth="6">
      {figureBranches.slice(0, step).map(([x1, y1, x2, y2]) => (
        <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1457d9" />
      ))}
      {figureNodes.slice(0, step + 1).map(([x, y, width, height], index) => (
        <rect
          key={x}
          x={x - 7}
          y={y - 7}
          width={width + 14}
          height={height + 14}
          rx="10"
          stroke={index === step ? '#a7660a' : '#1457d9'}
        />
      ))}
    </g>
  );
}

function PracticeFigure({
  file,
  title,
  alt,
  description,
  width,
  height,
  children,
}: {
  file: string;
  title: string;
  alt: string;
  description: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  const src = `${assetBase}/assets/${file}`;
  const artwork = (
    <svg
      className={s.figureArt}
      viewBox={`0 0 ${width} ${height}`}
      aria-label={alt}
    >
      <image href={src} width={width} height={height} />
      {children}
    </svg>
  );

  return (
    <Dialog>
      <DialogTrigger
        className={s.figure}
        aria-label={`放大查看${title}`}
        data-lesson-image-button
      >
        {artwork}
        <span className={s.figureLabel}>
          {title}
          <span>
            <ZoomIn aria-hidden="true" /> 放大
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className={s.zoom} showCloseButton={false}>
        <div className={s.zoomHeader}>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <DialogClose className={s.zoomClose}>关闭</DialogClose>
        </div>
        {artwork}
      </DialogContent>
    </Dialog>
  );
}

export function TreePractice() {
  const [state, setState] = usePageState({
    tab: 'report',
    treePracticeStep: 0,
  });
  const { guess, needsReview, recordGuess } = useFlowerGuess('second');
  const accuracy = Math.round((tree.correct / tree.total) * 100);
  const step = state.treePracticeStep;
  const finished = step === tree.steps.length;

  return (
    <Tabs
      value={state.tab}
      onValueChange={(value) => setState({ tab: value })}
      className={s.practice}
    >
      <div className={s.stamp}>
        <ClassPracticeStamp number="02" checklist />
      </div>
      <TabsList
        className={s.tabList}
        aria-label="课堂练习二的三个步骤"
        activateOnFocus
      >
        <TabsTrigger className={s.tab} value="report">
          01 · 打开考卷
        </TabsTrigger>
        <TabsTrigger className={s.tab} value="tree">
          02 · 跟着树走
        </TabsTrigger>
        <TabsTrigger className={s.tab} value="task">
          03 · 动手猜花
        </TabsTrigger>
      </TabsList>

      <TabsContent className={s.panel} value="report" keepMounted>
        <PracticeFigure
          file="tree-report-ppt34.png"
          title="决策树的分类报告"
          alt="分类报告显示测试集 45 条，准确率 0.98。黄圈标在维吉尼亚鸢尾一行的 precision 0.94。"
          description="蓝框是整份考卷的准确率。黄圈对应维吉尼亚鸢尾的查准率。"
          width={1076}
          height={388}
        >
          <rect
            x="70"
            y="254"
            width="993"
            height="48"
            rx="6"
            fill="none"
            stroke="#1457d9"
            strokeWidth="4"
          />
        </PracticeFigure>
        <div className={s.guide}>
          <h3 className={s.heading}>45 张新花卡，答对了几张？</h3>
          <div className={s.score}>
            <strong>
              {tree.correct} / {tree.total}
            </strong>
            <span>张答对 · {tree.total - tree.correct} 张答错</span>
          </div>
          <p>
            预测完再翻种名，核对每一张。蓝框里的 <b>accuracy</b>{' '}
            是整份考卷的准确率，
            {tree.correct} ÷ {tree.total} ≈ <b>{accuracy}%</b>。
          </p>
          <div className={s.precision}>
            <p>
              <b>黄圈里的 0.94</b> 是维吉尼亚鸢尾的查准率（precision）。
            </p>
            <p>模型预测为这一类的 16 条里，有 15 条确实是这一类。</p>
          </div>
          <div className={s.controls}>
            <button
              type="button"
              className={s.next}
              onClick={() => setState({ tab: 'tree' })}
            >
              看树怎么猜 <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </TabsContent>

      <TabsContent className={s.panel} value="tree" keepMounted>
        <PracticeFigure
          file="tree-ppt34.png"
          title="鸢尾花决策树"
          alt="决策树从花瓣长是否不超过 2.45 厘米开始提问。满足条件往左，否则往右，沿分支到叶子得到预测种名。"
          description="从顶端开始，沿着每道问题的分支找到预测种名。"
          width={1392}
          height={930}
        >
          <ExampleRoute step={step} />
        </PracticeFigure>
        <div className={s.guide}>
          <h3 className={s.heading}>从第一道问题走到叶子</h3>
          <p>
            示例花的花瓣长 <b>{gift.values[2]} cm</b>、宽{' '}
            <b>{gift.values[3]} cm</b>
            。看方框首行，是（True）往左，否（False）往右。
          </p>
          <ol className={s.path} aria-label="示例走法">
            {tree.steps.map(
              ({ node, feature, threshold, value, wentLeft }, index) => (
                <li
                  key={node}
                  data-current={index === step}
                  aria-current={index === step ? 'step' : undefined}
                >
                  <span>
                    {index + 1}. {features[feature]} ≤ {threshold}？
                  </span>
                  {index <= step && (
                    <b>
                      {value.toFixed(1)} {wentLeft ? '≤' : '>'} {threshold} ·{' '}
                      {wentLeft ? '是，走左边' : '否，走右边'}
                    </b>
                  )}
                </li>
              ),
            )}
          </ol>
          <div aria-live="polite">
            {finished && (
              <p className={s.example}>
                到叶节点，读 <b>class = {species[tree.prediction]}</b>。预测是{' '}
                <strong>{labels[tree.prediction]}</strong>。
              </p>
            )}
          </div>
          <div className={s.controls}>
            {finished ? (
              <button
                type="button"
                className={s.next}
                onClick={() => setState({ tab: 'task' })}
              >
                换我的花来猜 <ArrowRight size={20} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className={s.next}
                onClick={() => setState({ treePracticeStep: step + 1 })}
              >
                {step === tree.steps.length - 1 ? '走到叶节点' : '沿这一支走'}{' '}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              className={s.replay}
              disabled={step === 0}
              onClick={() => setState({ treePracticeStep: 0 })}
            >
              重走示例
            </button>
          </div>
        </div>
      </TabsContent>

      <TabsContent className={s.panel} value="task" keepMounted>
        <figure className={s.measurementArt}>
          <Image
            src={`${assetBase}/assets/flower-room-measurement.jpg`}
            alt="园丁和勇士一起测量礼花，勇士把读数记在笔记上。"
            width={1448}
            height={1086}
            sizes="45vw"
          />
        </figure>
        <div className={`${s.guide} ${s.task}`}>
          <h3 className={s.heading}>用你量的四个数来猜花</h3>
          <p>
            在 JupyterLab 打开 <code>lesson7_exe2.ipynb</code>
            ，先运行准备和训练单元格，再把实测卡的四项读数填入最后一个有内容的单元格并运行。
          </p>
          <GiftMeasurements />
          <label>
            把预测种名记下来，和第一次猜的比一比
            <select
              value={guess}
              onChange={(event) => recordGuess(event.target.value)}
            >
              <option value="">选择预测种名</option>
              {labels.map((label, index) => (
                <option key={label} value={index}>
                  {label}（{species[index]}）
                </option>
              ))}
            </select>
          </label>
          {needsReview && (
            <GuessReviewPrompt onConfirm={() => recordGuess(guess)} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
