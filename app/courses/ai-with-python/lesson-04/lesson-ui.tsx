/* oxlint-disable next/no-img-element -- Local course comic assets. */
'use client';
import { useState, type ReactNode } from 'react';
import { Copy, Download, FileCode } from 'lucide-react';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { assetBase } from './lesson-data';
import { records, rankSuspects } from './investigation-data';
import { COMPLETE_CODE } from './practice-content';
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
export function Guide({ children }: { children: ReactNode }) {
  return (
    <XiaopaiSpeech active animated={false} compact label="小派讲解">
      {children}
    </XiaopaiSpeech>
  );
}
export function Comic({
  kind = 'analysis',
  className = '',
  alt,
}: {
  kind?: 'arrival' | 'analysis' | 'evidence' | 'read' | 'expand' | 'compare';
  className?: string;
  alt?: string;
}) {
  return (
    <img
      className={`${s.comic} ${className}`}
      src={`${assetBase}/assets/story-${kind}.png`}
      alt={
        alt ||
        {
          read: '勇士与小派把保存的进攻文件读成表格，并观察一列数据',
          expand:
            '小派将同场两个恶魔的名字展开成两条关联记录，保留相同事件标记',
          compare: '勇士与小派比较岩背魔的一次高读数和雾铃魔的多条记录',
          arrival: '勇士守住城堡，猫头鹰送来历次战报',
          evidence: '猫头鹰记录到雾铃魔发出指挥信号',
          analysis: '勇士与小派在城堡档案室比对恶魔的进攻记录',
        }[kind]
      }
    />
  );
}
const newNames = ['岩背魔', '雾铃魔', '砂爪魔', '镜翼魔', '苔帽魔', '墨鳍魔'];
export function Portrait({ name }: { name: string }) {
  const index = newNames.indexOf(name);
  if (index < 0)
    return (
      <span
        aria-hidden="true"
        className={s.portrait}
        style={{
          backgroundImage:
            'url("/courses/ai-with-python/lesson-03/assets/archive-siege/demons.png")',
          backgroundSize: '300% 100%',
          backgroundPosition: `${Math.max(0, ['炎角兽', '藤甲魔', '冰翼魔'].indexOf(name)) * 50}% center`,
        }}
      />
    );
  return (
    <span
      aria-hidden="true"
      className={s.portrait}
      style={{
        backgroundImage: `url("${assetBase}/assets/suspects.png")`,
        backgroundSize: '300% 200%',
        backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 100}%`,
      }}
    />
  );
}
export function Tabs({
  labels,
  value,
  onChange,
  label = '讲解步骤',
}: {
  labels: readonly string[];
  value: number;
  onChange: (n: number) => void;
  label?: string;
}) {
  return (
    <fieldset className={s.tabs} aria-label={label}>
      {labels.map((x, i) => (
        <button key={x} aria-pressed={value === i} onClick={() => onChange(i)}>
          {x}
        </button>
      ))}
    </fieldset>
  );
}
export function RecordTable({
  items = records.slice(0, 3),
  focus = '',
  compact = false,
  full = false,
  caption,
}: {
  items?: typeof records;
  focus?: string;
  compact?: boolean;
  full?: boolean;
  caption?: string;
}) {
  const heads = full
    ? ['记录编号', '地点', '出现的恶魔', '威胁值', '持续分钟数']
    : compact
      ? ['记录编号', '出现的恶魔', '威胁值']
      : ['记录编号', '地点', '出现的恶魔', '威胁值'];
  return (
    <table className={`${s.table} ${full ? s.fullRecordTable : ''}`}>
      <caption>
        {caption ?? (compact ? '调查工作表' : '进攻记录 · 节选')}
      </caption>
      <thead>
        <tr>
          {heads.map((h) => (
            <th key={h} className={focus === h ? s.highlight : ''}>
              {h === '持续分钟数' ? (
                <>
                  持续
                  <br />
                  分钟数
                </>
              ) : (
                h
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((r, i) => (
          <tr
            key={r.id}
            className={focus === '行' && i === 0 ? s.highlight : ''}
          >
            {heads.map((h) => (
              <td
                key={h}
                className={
                  focus === h || (focus === '值' && i === 0 && h === '威胁值')
                    ? s.highlight
                    : ''
                }
              >
                {h === '记录编号'
                  ? r.id
                  : h === '地点'
                    ? r.place
                    : h === '出现的恶魔'
                      ? r.demons.join(' / ')
                      : h === '威胁值'
                        ? r.threat
                        : r.minutes}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function Ranking({
  minimum = 1,
  limit = 5,
  showCount = true,
}: {
  minimum?: number;
  limit?: number;
  showCount?: boolean;
}) {
  const rows = rankSuspects(minimum).slice(0, limit);
  return (
    <table className={s.table}>
      <caption>调查名单 · 按平均威胁值从高到低</caption>
      <thead>
        <tr>
          <th>恶魔</th>
          <th>平均威胁值</th>
          {showCount && <th>记录次数</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <td>{r.name}</td>
            <td>
              <span
                className={s.bar}
                style={{ backgroundSize: `${r.mean}% 100%` }}
              >
                {r.mean.toFixed(1)}
              </span>
            </td>
            {showCount && <td>{r.count}</td>}
          </tr>
        ))}
        {!rows.length && (
          <tr>
            <td colSpan={3}>没有符合条件的记录</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
export function PracticeTools({ code = COMPLETE_CODE }: { code?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied('已复制');
    } catch {
      setCopied('请在代码框中选择并复制');
    }
  }
  return (
    <>
      <div className={s.actions}>
        <a href={`${assetBase}/practice/lesson-04-practice.zip`} download>
          <Download size={20} />
          练习包
        </a>
        <button onClick={() => setOpen(true)}>
          <FileCode size={20} />
          完整代码与核对
        </button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>完整代码与核对</DialogTitle>
            <DialogDescription>
              解压练习包，在 JupyterLab 中从上到下运行。CSV
              与笔记本放在同一文件夹；需要 pandas。
            </DialogDescription>
          </DialogHeader>
          <div className={s.actions}>
            <button onClick={() => void copy()}>
              <Copy size={20} />
              {copied || '复制以下代码'}
            </button>
            <a href={`${assetBase}/practice/完整参考.py`} download>
              下载参考代码
            </a>
          </div>
          <pre>{code}</pre>
          <p>
            每一步的输出可与练习包中的输出对照核对。先解释结果，再继续下一步；完整参考包含后续调查步骤。
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
