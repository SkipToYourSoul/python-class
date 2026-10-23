'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { ArrowLeft, ArrowRight, Images } from 'lucide-react';
import Image from 'next/image';
import Link from '../static-link';
import { chapters } from './chapters';
import { PosterArtwork } from './poster-artwork';
import { PhotoGallery } from './photo-gallery';
import { ContactLinks } from './contact-links';
import {
  getPosterLayout,
  getPhotoStackLayout,
  regionStyle,
  type PosterVariant,
} from './poster-layout';
import { createPaperRenderer, type PaperRenderer } from './paper-renderer';
import {
  resumeScrubPosition,
  scrubPose,
  smoothProgress,
  transitionPose,
} from './paper-motion';
import s from './personal-home.module.css';

const clamp = (n: number) => Math.max(0, Math.min(2, n));

function animateFrames(
  duration: number,
  update: (elapsed: number) => void,
  record: (id: number) => void,
) {
  const start = performance.now();
  function tick(now: number) {
    const elapsed = Math.min(duration, now - start);
    update(elapsed);
    if (elapsed < duration) record(requestAnimationFrame(tick));
  }
  record(requestAnimationFrame(tick));
}

function ScrubArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 12 16" width="12" height="16" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10 2L2 8L10 14Z' : 'M2 2L10 8L2 14Z'}
        fill="currentColor"
      />
    </svg>
  );
}

export default function PersonalHome() {
  const [selected, setSelected] = useState(0);
  const [gallery, setGallery] = useState(false);
  const [variant, setVariant] = useState<PosterVariant>('desktop');
  const initializedChapter = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const svg = useRef<Array<SVGSVGElement | null>>([]);
  const renderer = useRef<PaperRenderer | null>(null);
  const frame = useRef(0);
  const index = useRef(0);
  const fold = useRef(0);
  const foldDirection = useRef(1);
  const dragDirection = useRef<number | null>(null);
  const dragOrigin = useRef(0);
  const dragOffset = useRef(0);
  const reduced = useRef(false);
  const dragging = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swallowClick = useRef(false);
  const galleryTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px)');
    const landscape = window.matchMedia(
      '(max-width: 1100px) and (max-height: 600px)',
    );
    const short = window.matchMedia('(max-height: 710px)');
    const update = () =>
      setVariant(
        mobile.matches || landscape.matches
          ? short.matches
            ? 'short'
            : 'mobile'
          : 'desktop',
      );
    update();
    for (const media of [mobile, landscape, short])
      media.addEventListener('change', update);
    return () => {
      for (const media of [mobile, landscape, short])
        media.removeEventListener('change', update);
    };
  }, []);

  const setIndex = useCallback((n: number) => {
    if (index.current !== n) {
      index.current = n;
      setSelected(n);
    }
  }, []);

  const paint = useCallback(
    (n: number, p: number, direction = foldDirection.current) => {
      setIndex(n);
      fold.current = p;
      foldDirection.current = direction;
      if (!root.current || !stage.current || !paper.current) return;
      root.current.dataset.folding = String(p > 0.002);
      root.current.style.setProperty('--fold', String(p));
      root.current.style.setProperty('--compact', String(smoothProgress(p)));
      root.current.style.setProperty(
        '--shadow-turn',
        String(0.18 + 0.82 * Math.abs(Math.cos(p * Math.PI))),
      );
      root.current.style.setProperty(
        '--fold-lift',
        String(Math.sin(p * Math.PI)),
      );
      root.current.style.setProperty(
        '--fold-drift',
        `${Math.sin(p * Math.PI) * direction * 8}px`,
      );
      root.current.dataset.renderer = renderer.current ? 'webgl' : 'css';
      if (renderer.current && p > 0.002) {
        renderer.current.draw(
          n,
          p,
          direction,
          stage.current.clientWidth,
          stage.current.clientHeight,
          paper.current.offsetHeight,
        );
      }
    },
    [setIndex],
  );

  const placeHandle = useCallback((position: number) => {
    handle.current?.style.setProperty('left', `${(position / 2) * 100}%`);
    track.current?.style.setProperty(
      '--paper-scrub-position',
      String(position / 2),
    );
  }, []);

  const unfold = useCallback(
    (n: number, from: number) => {
      cancelAnimationFrame(frame.current);
      if (reduced.current) {
        paint(n, 0);
        return;
      }
      const duration =
        root.current?.dataset.posterVariant === 'desktop' ? 560 : 480;
      const direction = foldDirection.current;
      animateFrames(
        duration,
        (elapsed) => {
          paint(n, from * (1 - smoothProgress(elapsed / duration)), direction);
        },
        (id) => {
          frame.current = id;
        },
      );
    },
    [paint],
  );

  const go = useCallback(
    (requested: number) => {
      const next = clamp(requested);
      cancelAnimationFrame(frame.current);
      placeHandle(next);
      if (reduced.current) {
        paint(next, 0);
        return;
      }
      const previous = index.current;
      if (previous === next) {
        unfold(next, fold.current);
        return;
      }
      const initial = fold.current;
      const direction =
        initial > 0.002 ? foldDirection.current : next > previous ? 1 : -1;
      const duration =
        root.current?.dataset.posterVariant === 'desktop' ? 1000 : 900;
      animateFrames(
        duration,
        (elapsed) => {
          const pose = transitionPose(elapsed / duration, initial);
          paint(pose.closing ? previous : next, pose.fold, direction);
        },
        (id) => {
          frame.current = id;
        },
      );
    },
    [paint, placeHandle, unfold],
  );

  useEffect(() => {
    let disposed = false;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      reduced.current = media.matches;
      if (media.matches) {
        cancelAnimationFrame(frame.current);
        paint(index.current, 0);
        placeHandle(index.current);
      }
    };
    syncMotion();
    media.addEventListener('change', syncMotion);
    const initial = clamp(
      Number.parseInt(
        new URLSearchParams(location.search).get('ch') || '0',
        10,
      ) || 0,
    );
    if (!initializedChapter.current) {
      initializedChapter.current = true;
      setIndex(initial);
    }
    // A responsive artwork change cancels the previous animation. Start the
    // replacement renderer with an unfolded page instead of a frozen fold.
    paint(index.current, 0);
    placeHandle(index.current);
    const surface = canvas.current!;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      renderer.current?.dispose();
      renderer.current = null;
      paint(index.current, fold.current);
    };
    const refreshSize = () => paint(index.current, fold.current);
    const controller = new AbortController();
    const initialize = () => {
      void createPaperRenderer(
        surface,
        svg.current.filter((el): el is SVGSVGElement => !!el),
        controller.signal,
      )
        .then((value) => {
          if (disposed) value?.dispose();
          else {
            renderer.current = value;
            paint(index.current, fold.current);
          }
        })
        .catch((error: unknown) => {
          if (!disposed) {
            console.warn(
              'Paper renderer unavailable; using the CSS fallback.',
              error,
            );
            renderer.current = null;
            paint(index.current, fold.current);
          }
        });
    };
    surface.addEventListener('webglcontextlost', onContextLost);
    surface.addEventListener('webglcontextrestored', initialize);
    window.addEventListener('resize', refreshSize);
    initialize();
    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(frame.current);
      renderer.current?.dispose();
      renderer.current = null;
      media.removeEventListener('change', syncMotion);
      surface.removeEventListener('webglcontextlost', onContextLost);
      surface.removeEventListener('webglcontextrestored', initialize);
      window.removeEventListener('resize', refreshSize);
    };
  }, [paint, placeHandle, setIndex, variant]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        gallery ||
        (event.target instanceof HTMLElement &&
          event.target.matches(
            'input,textarea,select,[contenteditable="true"]',
          ))
      )
        return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index.current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, gallery]);

  const closeGallery = useCallback(() => {
    setGallery(false);
    galleryTrigger.current?.focus();
  }, []);

  function openGallery() {
    if (swallowClick.current) {
      swallowClick.current = false;
      return;
    }
    cancelAnimationFrame(frame.current);
    paint(index.current, 0);
    placeHandle(index.current);
    setGallery(true);
  }

  function scrub(clientX: number) {
    const bounds = track.current!.getBoundingClientRect();
    const pose = scrubPose(
      ((clientX - bounds.left) / bounds.width) * 2 + dragOffset.current,
    );
    if (
      dragDirection.current === null &&
      Math.abs(pose.position - dragOrigin.current) > 0.005
    )
      dragDirection.current = pose.position > dragOrigin.current ? 1 : -1;
    placeHandle(pose.position);
    paint(
      pose.chapter,
      reduced.current ? 0 : pose.fold,
      dragDirection.current ?? foldDirection.current,
    );
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    cancelAnimationFrame(frame.current);
    dragging.current = true;
    dragOrigin.current = index.current;
    dragDirection.current = fold.current > 0.002 ? foldDirection.current : null;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerPosition = ((event.clientX - bounds.left) / bounds.width) * 2;
    dragOffset.current =
      fold.current > 0.002
        ? resumeScrubPosition(index.current, fold.current, pointerPosition) -
          pointerPosition
        : 0;
    event.currentTarget.querySelector('input')?.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    root.current?.setAttribute('data-dragging', 'true');
    scrub(event.clientX);
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    root.current?.setAttribute('data-dragging', 'false');
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    placeHandle(index.current);
    unfold(index.current, fold.current);
  }

  const chapter = chapters[selected];
  const layout = getPosterLayout(variant, selected === 2);
  const photoStack = getPhotoStackLayout(
    variant,
    selected === 2,
    chapter.images[0],
    chapter.images.length,
  );
  return (
    <div
      ref={root}
      className={s.home}
      style={
        {
          '--accent': chapter.color,
          '--poster-ratio': `${layout.width} / ${layout.height}`,
        } as CSSProperties
      }
      data-folding="false"
      data-chapter={chapter.id}
      data-poster-variant={variant}
      onPointerDownCapture={() => {
        root.current?.setAttribute('data-input-method', 'pointer');
      }}
      onKeyDownCapture={() => {
        root.current?.setAttribute('data-input-method', 'keyboard');
      }}
    >
      <header className={s.masthead}>
        <Link href="/" className={s.brand} aria-label="李美丽个人主页">
          <Image
            className={s.avatar}
            src="/personal-home/brand/li-meili-avatar.webp"
            width="60"
            height="60"
            alt=""
            unoptimized
            loading="eager"
            fetchPriority="high"
          />
          <span className={s.brandText}>
            <span className={s.greeting}>你好，我是</span>
            <span className={s.brandName}>李美丽</span>
          </span>
        </Link>
        <div className={s.identity}>
          <p className={s.role}>Builder</p>
          <span className={s.identityDivider} aria-hidden="true">
            /
          </span>
          <span className={s.coach}>AI Coach</span>
        </div>
        <p className={s.bio}>
          在小红书写代码，
          <br />
          陪孩子用 AI 把想法做成作品。
        </p>
      </header>
      <ContactLinks />
      <main className={s.exhibit}>
        <div
          ref={stage}
          className={s.stage}
          onPointerDown={(event) => {
            swallowClick.current = false;
            if (event.pointerType === 'touch')
              touch.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!touch.current) return;
            const dx = event.clientX - touch.current.x,
              dy = event.clientY - touch.current.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              swallowClick.current =
                event.target instanceof Node &&
                paper.current?.contains(event.target) === true;
              go(index.current + (dx < 0 ? 1 : -1));
            }
            touch.current = null;
          }}
          onPointerCancel={() => {
            touch.current = null;
          }}
        >
          <div className={s.paperShadow} aria-hidden="true" />
          <div ref={paper} className={s.paper}>
            {chapters.map((c, i) => (
              <span key={c.id} className={s.artwork} hidden={i !== selected}>
                <PosterArtwork
                  chapter={c}
                  index={i}
                  variant={variant}
                  ref={(element) => {
                    svg.current[i] = element;
                  }}
                />
              </span>
            ))}
            <button
              className={s.nextChapter}
              aria-label={`${chapter.label}：${chapter.subtitle}。点击查看下一章`}
              onClick={() => {
                if (swallowClick.current) {
                  swallowClick.current = false;
                  return;
                }
                go((index.current + 1) % 3);
              }}
            />
            <button
              ref={galleryTrigger}
              className={s.photoArea}
              style={regionStyle(layout.photos, layout)}
              aria-label={`查看${chapter.label}的全部 ${chapter.images.length} 张照片`}
              onClick={openGallery}
            >
              <span
                className={s.photoCount}
                aria-hidden="true"
                style={{
                  left: `${((photoStack.count.x - layout.photos.x) / layout.photos.width) * 100}%`,
                  top: `${((photoStack.count.y - layout.photos.y) / layout.photos.height) * 100}%`,
                  color: selected === 2 ? '#f3f0ff' : chapter.ink,
                }}
              >
                <Images aria-hidden="true" strokeWidth={2.1} />
                {chapter.images.length} 张
              </span>
            </button>
            {selected === 2 && (
              <Link
                href="/python"
                className={s.courseCta}
                style={regionStyle(layout.courseCta, layout)}
                onClick={(event) => {
                  if (swallowClick.current) {
                    event.preventDefault();
                    swallowClick.current = false;
                  }
                }}
              >
                <span className={s.srOnly}>开启我的创作之旅</span>
              </Link>
            )}
          </div>
          <canvas ref={canvas} className={s.foldCanvas} aria-hidden="true" />
        </div>
        <section className={s.controls} aria-label="个人经历展览">
          <div className={s.chapterInfo} aria-live="polite" aria-atomic="true">
            <span className={s.chapterTag}>{chapter.badge}</span>
            <h1>{chapter.caption}</h1>
          </div>
          <div
            ref={track}
            className={s.track}
            onPointerDown={pointerDown}
            onPointerMove={(event) => {
              if (dragging.current) scrub(event.clientX);
            }}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
          >
            <input
              className={s.range}
              type="range"
              min={1}
              max={3}
              step={1}
              value={selected + 1}
              aria-label="拖动切换个人经历"
              aria-valuetext={`${selected + 1} / 3：${chapter.label}`}
              onInput={(event) => go(Number(event.currentTarget.value) - 1)}
              onKeyDown={(event) => {
                const targets: Record<string, number> = {
                  ArrowLeft: index.current - 1,
                  ArrowDown: index.current - 1,
                  ArrowRight: index.current + 1,
                  ArrowUp: index.current + 1,
                  Home: 0,
                  End: 2,
                };
                if (event.key in targets) {
                  event.preventDefault();
                  go(targets[event.key]);
                }
              }}
            />
            <div className={s.ticks} aria-hidden="true">
              {Array.from({ length: 61 }, (_, i) => (
                <span
                  key={i}
                  className={i % 10 === 0 ? s.majorTick : ''}
                  style={{ '--i': i / 60 } as CSSProperties}
                />
              ))}
            </div>
            <div ref={handle} className={s.handle} aria-hidden="true">
              <span>
                <ScrubArrow direction="left" />
                <i />
                <ScrubArrow direction="right" />
              </span>
            </div>
          </div>
          <div className={s.chapterLabels}>
            {chapters.map((c, i) => (
              <button
                key={c.id}
                onClick={() => go(i)}
                aria-pressed={selected === i}
              >
                <span>0{i + 1}</span> {c.label}
                <span className={s.labelEnglish}>{c.englishLabel}</span>
              </button>
            ))}
          </div>
          <div className={s.toolbar}>
            <p>
              点击海报翻页 <span>·</span> 拖动刻度切章 <span>·</span> 照片看画廊{' '}
              <span className={s.keyboardHint}>
                · <span className={s.srOnly}>左右方向键</span>
                <kbd>
                  <ArrowLeft aria-hidden="true" />
                </kbd>{' '}
                <kbd>
                  <ArrowRight aria-hidden="true" />
                </kbd>{' '}
                翻页
              </span>
            </p>
          </div>
        </section>
        <article className={s.srOnly} aria-label="当前海报文字">
          <h2>
            {chapter.title} · {chapter.subtitle}
          </h2>
          <p>
            {chapter.description[0]}。{chapter.description.slice(1).join('')}
          </p>
          <p>{chapter.facts.join('，')}</p>
        </article>
      </main>
      {gallery && (
        <PhotoGallery chapter={chapter} open onClose={closeGallery} />
      )}
    </div>
  );
}
