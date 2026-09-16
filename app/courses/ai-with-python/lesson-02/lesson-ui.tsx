/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { useState, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  announcements,
  assetBase,
  oldAssets,
  scoutRecord,
} from './lesson-data';
import s from './lesson.module.css';

export function Code({
  children,
  label = 'Python · 讲解节选',
  highlight = -1,
}: {
  children: string;
  label?: string;
  highlight?: number;
}) {
  return (
    <div className={s.code}>
      <div className={s.codeLabel}>{label}</div>
      <pre>
        {children.split('\n').map((line, i) => (
          <span key={i} className={i === highlight ? s.codeHighlight : ''}>
            {line || ' '}
            <br />
          </span>
        ))}
      </pre>
    </div>
  );
}
export function StepBar({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <nav className={s.stepbar} aria-label="本页讲解步骤">
      {items.map((item, i) => (
        <button
          key={item}
          aria-current={i === value ? 'step' : undefined}
          onClick={() => onChange(i)}
        >
          <b>{i + 1}</b>
          {item}
        </button>
      ))}
    </nav>
  );
}
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className={s.note}>
      <img src={`${oldAssets}/xiaopai-guide.png`} alt="" />
      <p>{children}</p>
    </div>
  );
}
export function Feedback({
  children,
  correct = false,
}: {
  children: ReactNode;
  correct?: boolean;
}) {
  return (
    <output className={`${s.feedback} ${correct ? s.correct : ''}`}>
      {children}
    </output>
  );
}
export function Choice({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={s.choices}>
      {items.map((item, i) => (
        <button
          key={item}
          aria-pressed={i === value}
          onClick={() => onChange(i)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Board({
  compact = false,
  selected = -1,
  onSelect,
}: {
  compact?: boolean;
  selected?: number;
  onSelect?: (n: number) => void;
}) {
  return (
    <div className={s.board}>
      <div className={s.boardHead}>
        <span>王国公告</span>
      </div>
      {announcements.slice(0, compact ? 1 : 3).map((item, i) => (
        <div
          className={`${s.news} ${selected === i ? s.selectedNews : ''}`}
          key={item.href}
        >
          <span className={s.rank}>{String(i + 1).padStart(2, '0')}</span>
          <div>
            {onSelect ? (
              <button onClick={() => onSelect(i)}>{item.title}</button>
            ) : (
              <h3>{item.title}</h3>
            )}
            <p>
              热度 {item.hot} <span>查看详情 →</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ScoutRecord() {
  return (
    <div className={s.panel}>
      <p className={s.small}>前线侦察记录站</p>
      <h3>{scoutRecord.name}</h3>
      <dl className={s.scoutFields}>
        <dt>出没地点</dt>
        <dd>{scoutRecord.location}</dd>
        <dt>属性</dt>
        <dd>{scoutRecord.attribute}</dd>
        <dt>已知弱点</dt>
        <dd>{scoutRecord.weakness}</dd>
      </dl>
    </div>
  );
}
export function ScoutResources() {
  return <ResourceButton variant="scout" file="lesson-02-scout.zip" />;
}
export function ResourceButton({
  label = '代码与运行说明',
  file = 'lesson-02-practice.zip',
  variant = 'all',
}: {
  label?: string;
  file?: string;
  variant?: 'all' | 'scout';
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={s.secondary} onClick={() => setOpen(true)}>
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>
              {variant === 'scout' ? '课堂练习 01 · 前线侦察' : 'Python 练习包'}
            </DialogTitle>
            <DialogDescription>
              在 JupyterLab 中打开练习本，或在终端运行 Python 文件。
            </DialogDescription>
          </DialogHeader>
          <p>
            {variant === 'scout'
              ? '下载并解压，打开「前线侦察练习.ipynb」，先完成“第一次请求”，继续在练习二中解析地点、属性和弱点。默认通过本机 HTTP 获取。'
              : '下载并解压，在同一文件夹中打开「第二课练习.ipynb」，从上到下运行。电影练习先请求豆瓣，访问失败时可手动改用保存样本。'}
          </p>
          <Code label="Jupyter · 首次安装">
            {variant === 'scout'
              ? '%pip install requests'
              : '%pip install requests beautifulsoup4'}
          </Code>
          <p>
            {variant === 'scout'
              ? '本节完成获取与核对；输入老师提供的网址，也可以直接请求部署后的侦察网页。'
              : '01 获取网页；02 恶魔情报；03 豆瓣电影清单。每项包含完整代码、输出对照与运行说明。'}
          </p>
          <div className={s.toolbar}>
            <a
              className={s.primary}
              href={`${assetBase}/practice/${file}`}
              download
            >
              下载完整练习包
            </a>
            <a
              href={`${assetBase}/practice/${variant === 'scout' ? 'SCOUT_README.txt' : 'README.txt'}`}
              target="_blank"
              rel="noreferrer"
            >
              查看运行说明 ↗
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function CopyPrompt({ text }: { text: string }) {
  const [status, setStatus] = useState('复制给 AI');
  return (
    <button
      className={s.primary}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setStatus('已复制');
        } catch {
          setStatus('请选中文字复制');
        }
      }}
    >
      {status}
    </button>
  );
}
