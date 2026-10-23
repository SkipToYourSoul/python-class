/* oxlint-disable next/no-img-element -- Archive photographs are displayed without cropping, with their original proportions. */
'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { ImageZoom } from './image-zoom';
import type { Chapter } from './chapters';
import s from './photo-gallery.module.css';

type PhotoGalleryProps = {
  chapter: Chapter;
  open: boolean;
  onClose: () => void;
};

export function PhotoGallery({ chapter, open, onClose }: PhotoGalleryProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbnails = useRef<Array<HTMLButtonElement | null>>([]);
  const touch = useRef<{ id: number; x: number; y: number } | null>(null);
  const zoomTrigger = useRef<HTMLButtonElement>(null);
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(false);
  const titleId = useId();
  const captionId = useId();
  const [selection, setSelection] = useState({
    chapterId: chapter.id,
    open,
    index: 0,
  });
  if (selection.chapterId !== chapter.id || selection.open !== open) {
    setSelection({ chapterId: chapter.id, open, index: 0 });
  }
  const total = chapter.images.length;
  const current = Math.min(selection.index, total - 1);
  const image = chapter.images[current];

  useEffect(() => {
    if (open) {
      if (!dialog.current?.open) dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
    }
    touch.current = null;
  }, [open, chapter.id]);

  useEffect(() => {
    if (open && !zoom)
      thumbnails.current[current]?.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'instant',
      });
  }, [current, open, zoom]);

  function closeZoom() {
    setZoom(false);
    requestAnimationFrame(() =>
      zoomTrigger.current?.focus({ preventScroll: true }),
    );
  }

  function move(step: number) {
    setSelection((previous) => ({
      ...previous,
      index: Math.max(0, Math.min(total - 1, previous.index + step)),
    }));
  }

  return (
    <dialog
      ref={dialog}
      className={`${s.gallery} ${zoom ? s.zoomDialog : ''}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        if (zoom) {
          event.preventDefault();
          closeZoom();
        }
      }}
      onKeyDown={(event) => {
        if (
          zoom ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
        )
          return;
        event.preventDefault();
        event.stopPropagation();
        move(event.key === 'ArrowLeft' ? -1 : 1);
      }}
    >
      {zoom ? (
        <ImageZoom image={image} titleId={titleId} onClose={closeZoom} />
      ) : (
        <div className={s.shell}>
          <header className={s.header}>
            <div>
              <p className={s.eyebrow}>
                PERSONAL ARCHIVE / {chapter.id.toUpperCase()}
              </p>
              <h2 id={titleId}>{chapter.label}</h2>
            </div>
            <button
              type="button"
              className={s.close}
              aria-label="关闭照片"
              onClick={() => dialog.current?.close()}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <figure className={s.figure}>
            <div
              className={s.imageStage}
              onDoubleClick={() => setZoom(true)}
              onPointerDown={(event) => {
                if (event.pointerType !== 'touch' || !event.isPrimary) return;
                touch.current = {
                  id: event.pointerId,
                  x: event.clientX,
                  y: event.clientY,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={(event) => {
                if (touch.current?.id !== event.pointerId) return;
                const dx = event.clientX - touch.current.x;
                const dy = event.clientY - touch.current.y;
                touch.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  lastTap.current = null;
                  move(dx < 0 ? 1 : -1);
                } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
                  const now = performance.now();
                  const previous = lastTap.current;
                  if (
                    previous &&
                    now - previous.time < 300 &&
                    Math.hypot(
                      event.clientX - previous.x,
                      event.clientY - previous.y,
                    ) < 24
                  ) {
                    lastTap.current = null;
                    setZoom(true);
                  } else
                    lastTap.current = {
                      time: now,
                      x: event.clientX,
                      y: event.clientY,
                    };
                }
              }}
              onPointerCancel={() => {
                touch.current = null;
              }}
            >
              <img
                key={image.src}
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.caption}
                aria-describedby={captionId}
                draggable={false}
              />
            </div>
            <button
              ref={zoomTrigger}
              className={s.zoomEntry}
              type="button"
              onClick={() => setZoom(true)}
            >
              <Expand aria-hidden="true" /> 放大查看
            </button>
            <figcaption className={s.caption} id={captionId} aria-live="polite">
              {image.caption}
            </figcaption>
          </figure>
          <div className={s.navigation}>
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={current === 0}
              aria-label="上一张照片"
            >
              <ArrowLeft aria-hidden="true" /> 上一张
            </button>
            <span className={s.counter} aria-live="polite" aria-atomic="true">
              <span className={s.srOnly}>第 </span>
              {String(current + 1).padStart(2, '0')}
              <span aria-hidden="true"> / </span>
              <span className={s.srOnly}> 张，共 </span>
              {String(total).padStart(2, '0')}
              <span className={s.srOnly}> 张照片</span>
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={current === total - 1}
              aria-label="下一张照片"
            >
              下一张 <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <fieldset className={s.thumbnails} aria-label="选择照片">
            {chapter.images.map((photo, i) => (
              <button
                type="button"
                key={photo.src}
                ref={(element) => {
                  thumbnails.current[i] = element;
                }}
                className={s.thumbnail}
                aria-label={`查看第 ${i + 1} 张照片：${photo.caption}`}
                aria-pressed={current === i}
                onClick={() =>
                  setSelection((previous) => ({ ...previous, index: i }))
                }
              >
                <img
                  src={photo.preview}
                  width={photo.width}
                  height={photo.height}
                  alt=""
                  draggable={false}
                />
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </fieldset>
          <p className={s.hint}>左右滑动切换照片 · 点“放大查看”看细节</p>
        </div>
      )}
    </dialog>
  );
}
