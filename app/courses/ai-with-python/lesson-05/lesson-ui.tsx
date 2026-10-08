/* oxlint-disable next/no-img-element -- Local illustrated course assets. */
'use client';
import { useState, type ReactNode } from 'react';
import { Copy, Download, Code2 } from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePageState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';
export function Page({
  title,
  label = 'FIELD NOTES · 恶魔观察笔记',
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
    <XiaopaiSpeech active animated={false} compact label="小派讲解">
      {children}
    </XiaopaiSpeech>
  );
}
export function Tabs({
  items,
  value,
  onChange,
  label = '观察步骤',
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
          aria-pressed={i === value}
          onClick={() => onChange(i)}
        >
          {item}
        </button>
      ))}
    </fieldset>
  );
}
export function Art({
  kind = 'fieldwork',
  alt,
}: {
  kind?: 'opening' | 'fieldwork' | 'discovery';
  alt?: string;
}) {
  return (
    <img
      className={s.art}
      src={`${assetBase}/assets/${kind}.png`}
      alt={
        alt ||
        {
          opening: '勇士、小派和熊猫博士在城堡中查看新侦察记录',
          fieldwork: '小派和勇士在野外观察不同体型的恶魔',
          discovery: '勇士、小派和熊猫博士在图表中发现类别差异',
        }[kind]
      }
    />
  );
}
export function Story({
  title,
  kind = 'fieldwork',
  speaker,
  quote,
  question,
}: {
  title: string;
  kind?: 'opening' | 'fieldwork' | 'discovery';
  speaker: string;
  quote: string;
  question: string;
}) {
  return (
    <Page title={title} label="STORY · 侦察行动">
      <div className={s.storyGrid}>
        <Art kind={kind} />
        <div className={s.storyText}>
          <span className={s.tag}>{speaker}</span>
          <blockquote>“{quote}”</blockquote>
          <div className={s.question}>
            <span>先想一想</span>
            <p>{question}</p>
          </div>
        </div>
      </div>
    </Page>
  );
}
export function CodeTools({
  code,
  label = '完整代码',
}: {
  code: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState('');
  return (
    <>
      <div className={s.actions}>
        <a href={`${assetBase}/practice/lesson-05-practice.zip`} download>
          <Download size={20} />
          练习包
        </a>
        <button onClick={() => setOpen(true)}>
          <Code2 size={20} />
          {label}
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              解压后打开“第五课练习.ipynb”。CSV 与笔记本放在同一文件夹，需要
              pandas、matplotlib 和
              seaborn，先运行笔记本的字体准备单元格。页面图表是数据演示，Python
              请在 JupyterLab 中运行。
            </DialogDescription>
          </DialogHeader>
          <button
            className={s.button}
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
export function CodeLesson({
  title,
  code,
  complete,
  steps,
  chart,
}: {
  title: string;
  code: string;
  complete: string;
  steps: { name: string; lines: number[]; text: string }[];
  chart?: ReactNode;
}) {
  const [state, update] = usePageState({ step: 0 });
  const current = steps[state.step] || steps[0];
  return (
    <Page
      title={title}
      label="PYTHON LAB · 代码讲解"
      footer={
        <>
          <p>已运行导入与读表单元格；下方图形为对应数据示例。</p>
          <CodeTools code={complete} />
        </>
      }
    >
      <Tabs
        items={steps.map((x) => x.name)}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.codeGrid}>
        <div className={s.column}>
          <NotebookPanel
            compact
            title="第五课练习.ipynb"
            cells={[{ code, activeLines: current.lines }]}
          />
          <Guide>{current.text}</Guide>
        </div>
        <div className={s.chartPanel}>{chart}</div>
      </div>
    </Page>
  );
}
