/* oxlint-disable next/no-img-element -- Student artwork preserves its full composition. */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Images, Maximize2, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { asset, useSceneState } from './lesson-ui';
import s from './student-world-gallery.module.css';

const worlds = [
  {
    title: '云端未来乐园',
    original: '轨道、鱼形载具、中央迷宫和五个小装置的学生手绘原画',
    result: '空中轨道连接透明乘坐舱，立体花园城市旁陈列着五个未来装置',
  },
  {
    title: '星际奇遇',
    original:
      '连接月球、火星、木星和金星的路线，以及人物和观景区的学生手绘原画',
    result: '发光航线串起四个星球，山峰上的透明电梯通向太空观景舱',
  },
  {
    title: '未来发明乐园',
    original: '飞行列车、飞碟、弹簧靴、渐变大小通道和地下房间的学生手绘原画',
    result: '长列车飞过未来公园，孩子体验弹簧靴、飞行装置和缩小通道',
  },
  {
    title: '我的机器人伙伴',
    original: '一个人与双圆眼、细长四肢、拿着扫帚的机器人交谈的学生手绘原画',
    result: '孩子在未来花园里与手持发光扫帚的机器人伙伴交谈',
  },
];

type View = 'pair' | 'original' | 'ai';
const number = (index: number) => String(index + 1).padStart(2, '0');
const imagePath = (index: number, kind: 'original' | 'ai') =>
  asset(`student-worlds/${number(index)}-${kind}.jpg`);

export function StudentWorldGallery({
  active,
  open,
  onOpenChange,
}: {
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selection, setSelection] = useSceneState('student-worlds', {
    index: 0,
  });
  const index =
    Number.isInteger(selection.index) &&
    selection.index >= 0 &&
    selection.index < worlds.length
      ? selection.index
      : 0;
  const [view, setView] = useState<View>('pair');
  const trigger = useRef<HTMLButtonElement>(null);
  const zoomOrigin = useRef<'original' | 'ai' | null>(null);
  const originalTrigger = useRef<HTMLButtonElement>(null);
  const aiTrigger = useRef<HTMLButtonElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const world = worlds[index];

  useEffect(() => {
    if (!active) onOpenChange(false);
  }, [active, onOpenChange]);

  useEffect(() => {
    if (view !== 'pair') back.current?.focus();
    else if (open && zoomOrigin.current)
      (zoomOrigin.current === 'original'
        ? originalTrigger
        : aiTrigger
      ).current?.focus();
  }, [view, open]);

  function changeOpen(next: boolean) {
    setView('pair');
    zoomOrigin.current = null;
    onOpenChange(next);
  }

  function select(next: number) {
    setSelection({ index: (next + worlds.length) % worlds.length });
  }

  return (
    <Dialog
      open={active && open}
      onOpenChange={(next, details) => {
        if (!next && details.reason === 'escape-key' && view !== 'pair') {
          details.cancel();
          setView('pair');
          return;
        }
        changeOpen(next);
      }}
    >
      <DialogTrigger ref={trigger} className={s.trigger}>
        <Images size={24} aria-hidden="true" />
        看同学的未来世界
        <ArrowRight size={24} aria-hidden="true" />
      </DialogTrigger>
      <DialogContent
        className={s.gallery}
        showCloseButton={false}
        finalFocus={trigger}
        onKeyDown={(event) => {
          if (
            view === 'pair' &&
            ['ArrowLeft', 'ArrowRight'].includes(event.key)
          ) {
            event.preventDefault();
            event.stopPropagation();
            select(index + (event.key === 'ArrowRight' ? 1 : -1));
          }
        }}
      >
        <header className={s.header}>
          <div className={s.heading}>
            <DialogDescription className={s.eyebrow}>
              同学作品展 <span>·</span> {number(index)} / 04
            </DialogDescription>
            <DialogTitle className={s.title} aria-live="polite">
              {world.title}
            </DialogTitle>
          </div>
          <div className={s.actions}>
            {view !== 'pair' && (
              <button
                ref={back}
                className={s.control}
                onClick={() => setView('pair')}
              >
                <ArrowLeft size={20} aria-hidden="true" />
                返回对照
              </button>
            )}
            <DialogClose className={s.control}>
              <X size={22} aria-hidden="true" />
              关闭
            </DialogClose>
          </div>
        </header>

        {view === 'pair' ? (
          <div className={s.comparison}>
            <figure className={s.original}>
              <figcaption className={s.caption}>
                <span>想象的起点</span>
                <strong>
                  同学原画 <Maximize2 size={18} aria-hidden="true" />
                </strong>
              </figcaption>
              <button
                className={s.originalImage}
                ref={originalTrigger}
                onClick={() => {
                  zoomOrigin.current = 'original';
                  setView('original');
                }}
                aria-label={`放大同学原画：${world.title}`}
              >
                <img src={imagePath(index, 'original')} alt={world.original} />
              </button>
              <p className={s.observation}>
                找一找，原画里的哪些想法被保留下来了？
              </p>
            </figure>
            <figure className={s.result}>
              <figcaption className={s.resultCaption}>
                <strong>AI 生成的未来场景</strong>
                <span>
                  <Maximize2 size={18} aria-hidden="true" />
                  点击画面放大
                </span>
              </figcaption>
              <button
                className={s.resultImage}
                ref={aiTrigger}
                onClick={() => {
                  zoomOrigin.current = 'ai';
                  setView('ai');
                }}
                aria-label={`放大 AI 结果图：${world.title}`}
              >
                <img src={imagePath(index, 'ai')} alt={world.result} />
              </button>
            </figure>
          </div>
        ) : (
          <figure className={s.focusView}>
            <figcaption>
              {view === 'original' ? '同学原画' : 'AI 生成的未来场景'}
            </figcaption>
            <img
              src={imagePath(index, view)}
              alt={view === 'original' ? world.original : world.result}
            />
          </figure>
        )}

        {view === 'pair' ? (
          <footer className={s.footer}>
            <button
              className={s.arrow}
              onClick={() => select(index - 1)}
              aria-label="上一幅作品"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <nav className={s.choices} aria-label="选择同学作品">
              {worlds.map((item, i) => (
                <button
                  key={item.title}
                  className={s.choice}
                  aria-pressed={index === i}
                  onClick={() => select(i)}
                >
                  <img src={imagePath(i, 'ai')} alt="" />
                  <span>
                    <b>{number(i)}</b>
                    {item.title}
                  </span>
                </button>
              ))}
            </nav>
            <button
              className={s.arrow}
              onClick={() => select(index + 1)}
              aria-label="下一幅作品"
            >
              <ArrowRight aria-hidden="true" />
            </button>
          </footer>
        ) : (
          <p className={s.focusHint}>
            完整画面 · 按 Esc 返回原画与 AI 场景对照
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
