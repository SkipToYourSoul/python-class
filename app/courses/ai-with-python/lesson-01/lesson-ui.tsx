/* oxlint-disable next/no-img-element -- The lesson uses supplied course assets. */
'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Check, Copy, Play, Pause, Code2, ListChecks } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { assetBase, warriors } from '@/lib/course-data';
import s from './lesson-review.module.css';

export const asset = (name: string) => `${assetBase}/${name}`;
export const pageStoragePrefix = 'ai-python-lesson-01-scene-v2:';
export type Feature = 'attack' | 'defense' | 'health';
export const featureNames = { attack: '攻击', defense: '防御', health: '血量' };
export type RoleData = {
  name: string;
  image: string;
  attack: number;
  defense: number;
  health: number;
  identity?: string;
};
export const newRoles: RoleData[] = [
  {
    name: '银翼守卫',
    image: 'image133.png',
    attack: 40,
    defense: 80,
    health: 390,
    identity: '勇士',
  },
  {
    name: '深渊魔将',
    image: 'image134.png',
    attack: 70,
    defense: 38,
    health: 190,
    identity: '恶魔',
  },
  {
    name: '远行勇士',
    image: 'final-visitor-sky-lancer.png',
    attack: 48,
    defense: 75,
    health: 470,
    identity: '勇士',
  },
];
export const predictRole = (r: { health: number }) =>
  r.health <= 245 || r.health > 450 ? '恶魔' : '勇士';

export function useSceneState<T extends object>(
  id: string,
  initial: T,
): [T, (change: Partial<T>) => void] {
  const seed = useRef(initial);
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(pageStoragePrefix + id) || 'null',
      );
      if (saved && typeof saved === 'object')
        setValue({ ...seed.current, ...saved });
    } catch {
      /* Local state is optional. */
    }
    setReady(true);
  }, [id]);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(pageStoragePrefix + id, JSON.stringify(value));
      } catch {
        /* Storage may be unavailable. */
      }
    }
  }, [id, ready, value]);
  const patch = useCallback(
    (change: Partial<T>) => setValue((v) => ({ ...v, ...change })),
    [],
  );
  return [value, patch];
}
export function SceneHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <header className={`lesson-standard-heading ${s.heading}`}>
      <span>{kicker}</span>
      <h2>{title}</h2>
    </header>
  );
}
export function Stage({
  title,
  label,
  children,
  footer,
  className = '',
}: {
  title: string;
  label: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${s.scene} ${className}`}>
      <SceneHeading kicker={label} title={title} />
      <div className={s.body}>{children}</div>
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
export function Hint({ children }: { children: ReactNode }) {
  return (
    <div className={s.hint}>
      <img src={asset('xiaopai-guide.png')} alt="" />
      <p>{children}</p>
    </div>
  );
}
export function Choices({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: readonly string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className={s.choices} aria-label={label}>
      {items.map((v, i) => (
        <button
          type="button"
          key={v}
          aria-pressed={value === i}
          onClick={() => onChange(i)}
        >
          {v}
        </button>
      ))}
    </fieldset>
  );
}
export function Steps({
  items,
  index,
  onChange,
}: {
  items: readonly string[];
  index: number;
  onChange: (v: number) => void;
}) {
  return (
    <nav className={s.steps} aria-label="讲解步骤">
      {items.map((v, i) => (
        <button
          type="button"
          key={v}
          aria-current={index === i ? 'step' : undefined}
          onClick={() => onChange(i)}
        >
          <b>{String(i + 1).padStart(2, '0')}</b>
          {v}
        </button>
      ))}
    </nav>
  );
}
export function More({
  label = '展开讲解',
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={s.secondary}
        type="button"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
            <DialogDescription>
              课堂补充 · 可关闭后继续当前页面
            </DialogDescription>
          </DialogHeader>
          <div className={s.modalBody}>{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function ZoomImage({
  src,
  alt,
  label = '放大查看',
}: {
  src: string;
  alt: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={s.imageButton}
        onClick={() => setOpen(true)}
        aria-label={`${label}：${alt}`}
      >
        <img src={src} alt={alt} />
        <span>{label}</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${s.modal} ${s.imageModal}`}>
          <DialogHeader>
            <DialogTitle>{alt}</DialogTitle>
            <DialogDescription>完整图片 · 关闭后返回当前讲解</DialogDescription>
          </DialogHeader>
          <img src={src} alt={alt} />
        </DialogContent>
      </Dialog>
    </>
  );
}
export function CodeCell({
  code,
  title = 'Python',
  output,
  highlight,
  compact = false,
  copyCode,
}: {
  code: string;
  title?: string;
  output?: ReactNode;
  highlight?: number;
  compact?: boolean;
  copyCode?: string;
}) {
  const [status, setStatus] = useState('复制代码');
  async function copy() {
    try {
      await navigator.clipboard.writeText(copyCode ?? code);
      setStatus('已复制');
    } catch {
      setStatus('请选中代码复制');
    }
  }
  return (
    <div className={`${s.codeCell} ${compact ? s.compactCode : ''}`}>
      <header>
        <span>{title}</span>
        <button type="button" onClick={() => void copy()}>
          {status === '已复制' ? <Check /> : <Copy />}
          {status}
        </button>
      </header>
      <pre>
        <code>
          {code.split('\n').map((line, i) => (
            <span
              key={i}
              data-highlight={highlight === i}
              data-comment={line.trimStart().startsWith('#')}
            >
              {line || ' '}
            </span>
          ))}
        </code>
      </pre>
      {output !== undefined && (
        <div className={s.output}>
          <span>输出</span>
          <div>{output}</div>
        </div>
      )}
    </div>
  );
}
export function RoleCard({
  role,
  reveal = false,
  small = false,
  portrait = false,
  children,
}: {
  role: RoleData;
  reveal?: boolean;
  small?: boolean;
  portrait?: boolean;
  children?: ReactNode;
}) {
  return (
    <figure
      className={`${s.role} ${small ? s.smallRole : ''} ${portrait ? s.portraitRole : ''}`}
    >
      <img src={asset(role.image)} alt={role.name} />
      <figcaption>
        <strong>{role.name}</strong>
        <div className={s.stats}>
          {(['attack', 'defense', 'health'] as const).map((f) => (
            <span key={f}>
              {featureNames[f]} <b>{role[f]}</b>
            </span>
          ))}
        </div>
        {reveal && <b className={s.identity}>已知身份 · {role.identity}</b>}
      </figcaption>
      {children}
    </figure>
  );
}
export function ClassPracticeStamp({
  number,
  checklist = false,
}: {
  number: string;
  checklist?: boolean;
}) {
  return (
    <div className={s.stamp}>
      {checklist ? (
        <ListChecks aria-hidden="true" />
      ) : (
        <Code2 aria-hidden="true" />
      )}
      <span>{checklist ? 'CHECKLIST' : 'PRACTICE'}</span>
      <b>{number}</b>
    </div>
  );
}
export function CheckpointTaskTemplate({
  number,
  title,
  question,
  instruction,
  tip,
  illustration,
  children,
}: {
  number: string;
  title: string;
  question: string;
  instruction: string;
  tip: string;
  illustration?: { src: string; alt: string };
  children: ReactNode;
}) {
  return (
    <Stage title={title} label={`CHECKPOINT · 课后练习 ${number}`}>
      <div
        className={`${s.taskLayout} ${illustration ? s.visualTaskLayout : ''}`}
      >
        <aside
          className={`${s.taskBrief} ${illustration ? s.visualTaskBrief : ''}`}
        >
          <div className={s.stamp}>
            <Check />
            <span>CHECKPOINT</span>
            <b>{number}</b>
          </div>
          {illustration ? (
            <div className={s.taskIllustration}>
              <img src={illustration.src} alt={illustration.alt} />
            </div>
          ) : (
            <>
              <h3>{question}</h3>
              <p>{instruction}</p>
              <strong className={s.actionTag}>动手完成你的作品</strong>
              <p className={s.small}>{tip}</p>
            </>
          )}
        </aside>
        <div className={s.taskWork}>{children}</div>
      </div>
    </Stage>
  );
}
export function PracticeProgress({ active }: { active: number }) {
  return (
    <ol className={s.practiceProgress}>
      {['工具', '数据', '训练', '画树', '预测', '检验'].map((v, i) => (
        <li key={v} aria-current={i === active ? 'step' : undefined}>
          <b>{i + 1}</b>
          {v}
        </li>
      ))}
    </ol>
  );
}

export function CastleTree({
  health,
  step = 3,
  terms = false,
}: {
  health?: number;
  step?: number;
  terms?: boolean;
}) {
  const low = health !== undefined && health <= 245,
    middle = health !== undefined && health > 245 && health <= 450;
  const nodes = [
    {
      id: 'root',
      x: 50,
      y: 10,
      text: '血量 ≤ 245？',
      label: '根节点',
      active: health !== undefined,
    },
    {
      id: 'low',
      x: 19,
      y: 48,
      text: '预测：恶魔',
      label: '叶子节点',
      active: low && step >= 1,
    },
    {
      id: 'branch',
      x: 69,
      y: 48,
      text: '血量 ≤ 450？',
      label: '判断节点',
      active: health !== undefined && !low && step >= 1,
    },
    {
      id: 'middle',
      x: 52,
      y: 86,
      text: '预测：勇士',
      label: '叶子节点',
      active: middle && step >= 2,
    },
    {
      id: 'high',
      x: 85,
      y: 86,
      text: '预测：恶魔',
      label: '叶子节点',
      active: health !== undefined && !low && !middle && step >= 2,
    },
  ];
  const edges = [
    ['root', 'low', '是'],
    ['root', 'branch', '否'],
    ['branch', 'middle', '是'],
    ['branch', 'high', '否'],
  ];
  return (
    <figure className={s.tree} aria-label="训练得到的完整城堡决策树">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {edges.map(([a, b]) => {
          const n = nodes.find((x) => x.id === a)!,
            m = nodes.find((x) => x.id === b)!;
          return (
            <path
              key={b}
              d={`M${n.x} ${n.y + 5} V${(n.y + m.y) / 2} H${m.x} V${m.y - 5}`}
              className={m.active ? s.activeEdge : undefined}
            />
          );
        })}
      </svg>
      {edges.map(([a, b, label]) => {
        const n = nodes.find((x) => x.id === a)!,
          m = nodes.find((x) => x.id === b)!;
        return (
          <span
            key={b}
            className={s.branchLabel}
            style={{ left: `${m.x}%`, top: `${(n.y + m.y) / 2}%` }}
          >
            {label}
          </span>
        );
      })}
      {nodes.map((n) => (
        <div
          key={n.id}
          className={s.treeNode}
          data-active={n.active}
          data-leaf={['low', 'middle', 'high'].includes(n.id)}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          {terms && <small>{n.label}</small>}
          <strong>{n.text}</strong>
        </div>
      ))}
    </figure>
  );
}

export function ControlledMedia({
  src,
  alt,
  active = true,
}: {
  src: string;
  alt: string;
  active?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const img = useRef<HTMLImageElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const freeze = () => {
    const a = img.current,
      c = canvas.current;
    if (a?.naturalWidth && c) {
      c.width = a.naturalWidth;
      c.height = a.naturalHeight;
      c.getContext('2d')?.drawImage(a, 0, 0);
    }
  };
  useEffect(() => {
    if (active) return;
    const timer = window.setTimeout(() => {
      freeze();
      setPlaying(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active]);
  return (
    <div className={s.media}>
      <img
        ref={img}
        src={src}
        alt={alt}
        onLoad={freeze}
        style={{ visibility: playing ? 'visible' : 'hidden' }}
      />
      <canvas ref={canvas} aria-label={`${alt}（静帧）`} hidden={playing} />
      <button
        type="button"
        onClick={() => {
          if (playing) freeze();
          setPlaying(!playing);
        }}
      >
        {playing ? <Pause /> : <Play />}
        {playing ? '暂停片段' : '播放片段'}
      </button>
    </div>
  );
}

export const dataX = `X = [\n${warriors.map((r) => `    [${r.attack}, ${r.defense}, ${r.health}]`).join(',\n')}\n]`;
export const dataY = 'y = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]';
export const importCode = 'from sklearn import tree, metrics';
export const fitCode = 'clf = tree.DecisionTreeClassifier()\nclf.fit(X, y)';
export const plotCode = `import matplotlib.pyplot as plt\nfrom sklearn.tree import plot_tree\nplt.figure(figsize=(12, 8))\nplot_tree(clf,\n    feature_names=['Attack', 'Defense', 'Health'],\n    class_names=['Demon', 'Warrior'],\n    filled=True, rounded=True, fontsize=14\n)\nplt.show()`;
export const predictionCode = `predict_data = [\n    [40, 80, 390],\n    [70, 38, 190]\n]\npredict_res = clf.predict(predict_data)\nprint(predict_res)`;
export const accuracyCode = `true_labels = [1, 0]\naccuracy = metrics.accuracy_score(\n    true_labels, predict_res)\nprint(f"本轮准确率：{accuracy:.0%}")`;
export const fullCode = [
  importCode,
  dataX,
  dataY,
  fitCode,
  plotCode,
  predictionCode,
  accuracyCode,
].join('\n\n');
