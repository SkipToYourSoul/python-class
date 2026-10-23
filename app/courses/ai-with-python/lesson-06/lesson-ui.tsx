/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';
import { useContext, useState, type ReactNode } from 'react';
import { Code2, Copy, Download, Maximize2 } from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PRACTICE_DOWNLOAD_URL } from './practice-content';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';
export function Page({
  title,
  label = 'BATTLE NOTES · 决战观察笔记',
  children,
  footer,
}: {
  title: string;
  label?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Stage title={title} label={label} className={s.stage} footer={footer}>
      {children}
    </Stage>
  );
}
export function Guide({ children }: { children: ReactNode }) {
  return (
    <XiaopaiSpeech active compact animated={false} label="小派讲解">
      {children}
    </XiaopaiSpeech>
  );
}
export function Tabs({
  items,
  value,
  onChange,
  label = '操作步骤',
}: {
  items: string[];
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <fieldset className={s.tabs} aria-label={label}>
      {items.map((item, i) => (
        <button
          key={item}
          onClick={() => onChange(i)}
          aria-pressed={value === i}
        >
          {item}
        </button>
      ))}
    </fieldset>
  );
}
export function Jump({ id, children }: { id: string; children: ReactNode }) {
  const { navigate } = useContext(LessonState);
  return (
    <button className={s.primary} onClick={() => navigate(id)}>
      {children}
    </button>
  );
}
export function Art({
  kind,
  alt,
  firstPanel = false,
  panoramic = false,
}: {
  kind: string;
  alt: string;
  firstPanel?: boolean;
  panoramic?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={s.artButton}
        data-first-panel={firstPanel || undefined}
        data-panoramic={panoramic || undefined}
        data-lesson-art-button
        onClick={() => setOpen(true)}
        aria-label={`放大漫画：${alt}`}
      >
        <img src={`${assetBase}/assets/${kind}.jpg`} alt={alt} />
        <span>
          <Maximize2 size={20} />
          放大漫画
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.artModal}>
          <DialogHeader>
            <DialogTitle>决战漫画</DialogTitle>
            <DialogDescription>{alt}</DialogDescription>
          </DialogHeader>
          <img src={`${assetBase}/assets/${kind}.jpg`} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Story({
  title,
  kind,
  alt,
  quote,
  question,
  panoramic = false,
}: {
  title: string;
  kind: string;
  alt: string;
  quote: string;
  question: string;
  panoramic?: boolean;
}) {
  return (
    <Page title={title} label="STORY · 最终决战">
      <div className={s.story}>
        <Art kind={kind} alt={alt} panoramic={panoramic} />
        <div className={s.storyBrief}>
          <Guide>
            {quote.replace(/^(机械猫头鹰|勇士|小派)：/, '')}
            {panoramic && <br />}
            {question}
          </Guide>
        </div>
      </div>
    </Page>
  );
}
export function CodeTools({
  code,
  label = '完整参考',
}: {
  code: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false),
    [copy, setCopy] = useState('');
  return (
    <>
      <div className={s.actions}>
        <a href={PRACTICE_DOWNLOAD_URL} download>
          <Download size={20} />
          练习包
        </a>
        <button onClick={() => setOpen(true)}>
          <Code2 size={20} />
          {label}
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.codeModal}>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              解压练习包，打开“第六课练习.ipynb”。先运行预置环境格，再按顺序亲手输入代码。
            </DialogDescription>
          </DialogHeader>
          <button
            className={s.primary}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopy('已复制');
              } catch {
                setCopy('请选中下方代码复制');
              }
            }}
          >
            <Copy size={20} />
            {copy || '复制以下代码'}
          </button>
          <pre>{code}</pre>
        </DialogContent>
      </Dialog>
    </>
  );
}
export type CodeStep = {
  name: string;
  code: string;
  text: ReactNode;
  lines?: number[];
  output?: string;
  view?: ReactNode;
  keyCode?: string;
};
function wideCode(source: string, active: number[] = []) {
  const result: string[] = [];
  const highlighted: number[] = [];
  let pending = '';
  let depth = 0;
  let selected = false;
  for (const [index, line] of source.split('\n').entries()) {
    pending += pending
      ? `${/[([{]$/.test(pending) ? '' : ' '}${line.trim()}`
      : line;
    depth +=
      (line.match(/[([{]/g)?.length || 0) -
      (line.match(/[)\]}]/g)?.length || 0);
    selected ||= active.includes(index);
    if (depth <= 0) {
      if (selected) highlighted.push(result.length);
      result.push(pending);
      pending = '';
      depth = 0;
      selected = false;
    }
  }
  if (pending) result.push(pending);
  return { code: result.join('\n'), activeLines: highlighted };
}
export function CodeScene({
  title,
  steps,
  complete,
  label = 'PYTHON LAB · 代码讲解',
  before,
  visual,
  illustration,
}: {
  title: string;
  steps: CodeStep[];
  complete: string;
  label?: string;
  before?: string;
  visual?: ReactNode;
  illustration?: { kind: string; alt: string };
}) {
  const [state, update] = usePageState({ codeStep: 0 });
  const step = steps[state.codeStep] || steps[0];
  const displayed = wideCode(step.code, step.lines);
  return (
    <Page title={title} label={label}>
      <div className={s.codeTop}>
        <Tabs
          items={steps.map((x) => x.name)}
          value={state.codeStep}
          onChange={(codeStep) => update({ codeStep })}
        />
        <CodeTools code={complete} />
      </div>
      <div
        className={
          illustration ? s.codeWithArt : visual ? s.codeWithChart : s.codeBody
        }
      >
        <div className={s.codeColumn}>
          {step.view && step.keyCode && (
            <NotebookPanel
              title="关键代码节选 · 完整代码见参考"
              compact
              cells={[{ code: step.keyCode }]}
            />
          )}
          {step.view || (
            <NotebookPanel
              title="第六课练习.ipynb"
              compact
              cells={[
                {
                  code: displayed.code,
                  activeLines: displayed.activeLines,
                  output: step.output,
                },
              ]}
            />
          )}
        </div>
        {visual && <div className={s.chartColumn}>{visual}</div>}
        {illustration && (
          <div className={s.codeIllustration}>
            <Art kind={illustration.kind} alt={illustration.alt} />
          </div>
        )}
      </div>
      <Guide>
        {before && (
          <>
            {before}
            <br />
          </>
        )}
        {step.text}
      </Guide>
    </Page>
  );
}
