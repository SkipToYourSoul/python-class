/* oxlint-disable next/no-img-element -- Local classroom illustrations. */
'use client';
import { useContext, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Copy,
  Download,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import { comicStories } from './comic-stories';
import { PRACTICE_DOWNLOAD_URL } from './practice-content';
import s from './lesson.module.css';

export function LessonStage({
  title,
  label,
  children,
  footer,
}: {
  title: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Stage title={title} label={label} className={s.stage} footer={footer}>
      {children}
    </Stage>
  );
}
export function Steps({
  labels,
  value,
  onChange,
}: {
  labels: readonly string[];
  value: number;
  onChange: (step: number) => void;
}) {
  return (
    <fieldset className={s.steps} aria-label="讲解步骤">
      {labels.map((label, index) => (
        <button
          key={label}
          aria-pressed={index === value}
          onClick={() => onChange(index)}
        >
          <b>{String(index + 1).padStart(2, '0')}</b>
          {label}
        </button>
      ))}
    </fieldset>
  );
}
export function Guide({ children }: { children: ReactNode }) {
  return (
    <div className={s.guide}>
      <XiaopaiSpeech active={false} animated={false} label="小派讲解" compact>
        {children}
      </XiaopaiSpeech>
    </div>
  );
}
export function FileSheet({
  name,
  children,
  tone = 'paper',
}: {
  name: string;
  children: ReactNode;
  tone?: 'paper' | 'blue';
}) {
  return (
    <section className={s.fileSheet} data-tone={tone}>
      <header>
        <FileText size={24} aria-hidden="true" />
        <strong>{name}</strong>
      </header>
      <div>{children}</div>
    </section>
  );
}
export function CodeDialog({
  title = '完整代码与核对',
  code,
  output,
  outputLabel,
  note,
}: {
  title?: string;
  code: string;
  output?: string;
  outputLabel?: string;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  return (
    <>
      <button className={s.secondary} onClick={() => setOpen(true)}>
        <BookOpen size={20} />
        {title}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.modal} initialFocus={titleRef}>
          <DialogHeader>
            <DialogTitle ref={titleRef} tabIndex={-1}>
              {title}
            </DialogTitle>
            <DialogDescription>
              {note ??
                '在解压后的练习文件夹中打开 JupyterLab，按顺序输入并运行。'}
            </DialogDescription>
          </DialogHeader>
          <NotebookPanel
            title="第三课练习.ipynb"
            cells={[{ code, output, outputLabel }]}
          />
          <div className={s.actions}>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setCopy(true);
                } catch {
                  setCopy(false);
                }
              }}
            >
              <Copy size={20} />
              {copy ? '已复制代码' : '复制完整代码'}
            </button>
            <a href={PRACTICE_DOWNLOAD_URL} download>
              <Download size={20} />
              下载练习包
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function PracticeTools({
  code,
  output,
  outputLabel,
  note,
}: {
  code?: string;
  output?: string;
  outputLabel?: string;
  note?: string;
}) {
  return (
    <div className={s.actions}>
      <a className={s.secondary} href={PRACTICE_DOWNLOAD_URL} download>
        <Download size={20} />
        下载练习包
      </a>
      {code && (
        <CodeDialog
          code={code}
          output={output}
          outputLabel={outputLabel}
          note={note}
        />
      )}
    </div>
  );
}

export function ComicScene({ story }: { story: keyof typeof comicStories }) {
  const data = comicStories[story];
  const [state, update] = usePageState({ step: 0, comicVersion: 0 });
  const { navigate } = useContext(LessonState);
  // Start revised stories at act one, then preserve progress for that version.
  const step = state.comicVersion === data.version ? state.step : 0;
  const setStep = (next: number) =>
    update({ step: next, comicVersion: data.version });
  const act = data.acts[step];
  const lastAct = step === data.acts.length - 1;
  return (
    <LessonStage
      title={data.title}
      label={data.label}
      footer={
        <div className={s.comicControls}>
          <div className={s.actProgress} aria-live="polite">
            <span>
              第 {step + 1} 幕 / {data.acts.length} 幕
            </span>
            <strong>{act.title}</strong>
          </div>
          <button className={s.secondary} onClick={() => setStep(0)}>
            <RotateCcw size={20} aria-hidden="true" />
            重看
          </button>
          <button
            className={s.secondary}
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
            上一幕
          </button>
          <button
            className={s.primary}
            onClick={() =>
              lastAct ? navigate(data.nextScene) : setStep(step + 1)
            }
          >
            {lastAct ? data.nextLabel : '继续故事'}
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <figure
        className={s.comic}
        aria-label={`第 ${step + 1} 幕：${act.title}`}
      >
        <div className={s.comicArtwork}>
          <img
            key={act.image}
            src={`${assetBase}/assets/${act.image}`}
            alt={act.alt}
          />
        </div>
        <figcaption>
          {act.captions.map((caption) => (
            <span key={caption}>{caption}</span>
          ))}
        </figcaption>
      </figure>
      <div className={s.storyLine} aria-live="polite">
        <span>{act.promptLabel}</span>
        <p>{act.prompt}</p>
      </div>
    </LessonStage>
  );
}
