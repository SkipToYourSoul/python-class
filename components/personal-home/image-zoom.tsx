/* oxlint-disable next/no-img-element -- The viewer preserves original archive image detail. */
'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import {
  constrainView,
  fittedSize,
  pinchView,
  zoomAt,
  MAX_ZOOM,
  MIN_ZOOM,
  type Point,
  type ZoomBounds,
  type ZoomView,
} from './zoom-geometry';
import s from './image-zoom.module.css';

type ZoomImage = {
  src: string;
  width: number;
  height: number;
  caption: string;
};
type Gesture = { view: ZoomView; points: Point[] };
const initialView = { scale: 1, x: 0, y: 0 };

export function ImageZoom({
  image,
  titleId,
  onClose,
}: {
  image: ZoomImage;
  titleId: string;
  onClose: () => void;
}) {
  const viewport = useRef<HTMLButtonElement>(null);
  const viewRef = useRef<ZoomView>({ ...initialView, scale: 2 });
  const bounds = useRef<ZoomBounds>({
    width: 1,
    height: 1,
    imageWidth: image.width,
    imageHeight: image.height,
  });
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const [view, setView] = useState<ZoomView>({ ...initialView, scale: 2 });
  const [fit, setFit] = useState({ width: 0, height: 0 });

  function apply(next: ZoomView) {
    const value = constrainView(next, bounds.current);
    viewRef.current = value;
    setView(value);
  }
  function point(clientX: number, clientY: number): Point {
    const rect = viewport.current!.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  }
  function rebase() {
    gesture.current = {
      view: viewRef.current,
      points: Array.from(pointers.current.values()),
    };
  }
  function release(event: PointerEvent<HTMLButtonElement>) {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    rebase();
  }
  function changeScale(scale: number, anchor = { x: 0, y: 0 }) {
    apply(zoomAt(viewRef.current, scale, anchor, bounds.current));
  }

  useEffect(() => {
    const element = viewport.current!;
    const resize = () => {
      const rect = element.getBoundingClientRect();
      bounds.current = {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        imageWidth: image.width,
        imageHeight: image.height,
      };
      setFit(fittedSize(bounds.current));
      const next = constrainView(viewRef.current, bounds.current);
      viewRef.current = next;
      setView(next);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const delta =
        event.deltaY *
        (event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? bounds.current.height
            : 1);
      const rect = element.getBoundingClientRect();
      const anchor = {
        x: event.clientX - rect.left - rect.width / 2,
        y: event.clientY - rect.top - rect.height / 2,
      };
      const next = zoomAt(
        viewRef.current,
        viewRef.current.scale * Math.exp(-delta * 0.002),
        anchor,
        bounds.current,
      );
      viewRef.current = next;
      setView(next);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    element.addEventListener('wheel', wheel, { passive: false });
    resize();
    element.focus({ preventScroll: true });
    return () => {
      observer.disconnect();
      element.removeEventListener('wheel', wheel);
    };
  }, [image.width, image.height]);

  return (
    <section className={s.zoom} aria-label="照片放大查看">
      <header className={s.header}>
        <h3 id={titleId}>{image.caption}</h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭放大，返回照片画廊"
        >
          <X aria-hidden="true" />
        </button>
      </header>
      <button
        type="button"
        ref={viewport}
        aria-roledescription="可缩放照片"
        className={s.viewport}
        aria-label="放大照片。加减号缩放，方向键移动，回车放大或复原，数字零适应屏幕，Escape 返回画廊"
        data-zoomed={view.scale > 1}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            if (viewRef.current.scale > 1.2) apply(initialView);
            else changeScale(2);
            return;
          }
          const moves: Record<string, Point> = {
            ArrowLeft: { x: 45, y: 0 },
            ArrowRight: { x: -45, y: 0 },
            ArrowUp: { x: 0, y: 45 },
            ArrowDown: { x: 0, y: -45 },
          };
          if (event.key in moves) {
            event.preventDefault();
            event.stopPropagation();
            apply({
              ...viewRef.current,
              x: viewRef.current.x + moves[event.key].x,
              y: viewRef.current.y + moves[event.key].y,
            });
          } else if (['+', '=', '-', '0'].includes(event.key)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === '0') apply(initialView);
            else
              changeScale(
                viewRef.current.scale * (event.key === '-' ? 1 / 1.35 : 1.35),
              );
          }
        }}
        onDoubleClick={(event) => {
          if (viewRef.current.scale > 1.2) apply(initialView);
          else changeScale(2, point(event.clientX, event.clientY));
        }}
        onPointerDown={(event) => {
          if (event.button !== 0 || pointers.current.size >= 2) return;
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          event.currentTarget.setPointerCapture(event.pointerId);
          pointers.current.set(
            event.pointerId,
            point(event.clientX, event.clientY),
          );
          rebase();
        }}
        onPointerMove={(event) => {
          if (!pointers.current.has(event.pointerId)) return;
          pointers.current.set(
            event.pointerId,
            point(event.clientX, event.clientY),
          );
          const start = gesture.current;
          if (!start) return;
          const points = Array.from(pointers.current.values());
          if (points.length === 2 && start.points.length === 2)
            apply(
              pinchView(
                start.view,
                start.points[0],
                start.points[1],
                points[0],
                points[1],
                bounds.current,
              ),
            );
          else if (points.length === 1 && start.points.length === 1)
            apply({
              ...start.view,
              x: start.view.x + points[0].x - start.points[0].x,
              y: start.view.y + points[0].y - start.points[0].y,
            });
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={(event) => {
          if (pointers.current.delete(event.pointerId)) rebase();
        }}
      >
        <img
          src={image.src}
          width={image.width}
          height={image.height}
          alt={image.caption}
          draggable={false}
          style={{
            width: fit.width,
            height: fit.height,
            transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          }}
        />
      </button>
      <footer className={s.footer}>
        <div className={s.tools}>
          <button
            type="button"
            aria-label="缩小照片"
            disabled={view.scale <= MIN_ZOOM}
            onClick={() => changeScale(viewRef.current.scale / 1.35)}
          >
            <Minus aria-hidden="true" />
          </button>
          <output aria-live="polite" aria-label="照片缩放比例">
            {Math.round(view.scale * 100)}%
          </output>
          <button
            type="button"
            aria-label="放大照片"
            disabled={view.scale >= MAX_ZOOM}
            onClick={() => changeScale(viewRef.current.scale * 1.35)}
          >
            <Plus aria-hidden="true" />
          </button>
          <button
            type="button"
            className={s.fit}
            onClick={() => apply(initialView)}
          >
            适应屏幕
          </button>
        </div>
        <p>双指缩放 · 拖动查看细节 · 关闭返回画廊</p>
      </footer>
    </section>
  );
}
