'use client';

import { useEffect, useRef, useState } from 'react';
import { XiaopaiFigure } from './xiaopai-figure';
import s from './course-route-runner.module.css';

/** Keep the badge route curved; only the mascot detours along the picture frame. */
export function CourseRouteRunner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dashedRef = useRef<SVGPathElement>(null);
  const runnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const stopped = reducedMotion || !visible || pageHidden;
  const stoppedRef = useRef(stopped);

  useEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    const runner = runnerRef.current;
    const dashed = dashedRef.current;
    const map = root?.parentElement;
    if (!root || !map || !path || !runner || !dashed) return;
    const artwork = map.querySelector<HTMLElement>('.celestial-artwork');
    const stages = [
      ...map.querySelectorAll<HTMLElement>('.celestial-medallion'),
    ];
    if (!artwork || stages.length !== 3) return;

    function layout() {
      if (!root || !map || !path || !runner || !artwork || !dashed) return;
      const bounds = map.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      const boxes = stages.map((stage) => {
        const box = stage.getBoundingClientRect();
        return {
          x: box.left - bounds.left + box.width / 2,
          y: box.top - bounds.top + box.height / 2,
        };
      });
      const [one, two, three] = boxes;
      const picture = artwork.getBoundingClientRect();
      const frame = {
        left: picture.left - bounds.left,
        right: picture.right - bounds.left,
        top: picture.top - bounds.top,
        height: picture.height,
      };
      const joinY = frame.top + frame.height * 0.5;
      const outerRight = bounds.width - 24;
      // These arcs pass through the centres of 02, 03 and 01, beneath the badges.
      const sharedArcs = `C ${outerRight} ${two.y + 24}, ${outerRight} ${three.y - 88}, ${three.x} ${three.y}
        C ${three.x - bounds.width * 0.1} ${bounds.height * 0.94}, ${one.x + bounds.width * 0.15} ${bounds.height * 0.97}, ${one.x} ${one.y}`;
      const approach = `C ${one.x} ${one.y - 100}, ${frame.left - 64} ${joinY}, ${frame.left} ${joinY}`;
      dashed.setAttribute(
        'd',
        `M ${one.x} ${one.y} ${approach}
        C ${frame.left + bounds.width * 0.25} ${frame.top - 12}, ${two.x - 120} ${two.y}, ${two.x} ${two.y}
        ${sharedArcs} Z`,
      );
      // The sprite's feet meet the top edge; its body stays outside the original image.
      const left = frame.left - 38;
      const top = frame.top - 48;
      const d = `M ${left} ${joinY}
        V ${top + 16} Q ${left} ${top} ${left + 16} ${top}
        H ${frame.right - 16}
        C ${frame.right + 40} ${top}, ${two.x - 104} ${two.y}, ${two.x} ${two.y}
        ${sharedArcs}
        C ${one.x} ${one.y - 100}, ${frame.left - 64} ${joinY}, ${left} ${joinY} Z`;
      path.setAttribute('d', d);
      runner.style.offsetPath = `path("${d.replace(/\s+/g, ' ')}")`;
      const old = animationRef.current;
      const oldDuration = Number(old?.effect?.getTiming().duration) || 1;
      const progress = old
        ? (Number(old.currentTime) % oldDuration) / oldDuration
        : 0;
      old?.cancel();
      const duration = (path.getTotalLength() / 88) * 1000;
      const animation = runner.animate(
        [{ offsetDistance: '0%' }, { offsetDistance: '100%' }],
        { duration, iterations: Infinity, easing: 'linear' },
      );
      animation.currentTime = progress * duration;
      if (stoppedRef.current) animation.pause();
      animationRef.current = animation;
      root.dataset.ready = 'true';
    }

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageHidden(document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    const resize = new ResizeObserver(layout);
    [map, artwork, ...stages].forEach((element) => resize.observe(element));
    const intersection = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    intersection.observe(map);
    layout();
    return () => {
      resize.disconnect();
      intersection.disconnect();
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
      animationRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    stoppedRef.current = stopped;
    if (stopped) animationRef.current?.pause();
    else animationRef.current?.play();
  }, [stopped]);

  return (
    <div ref={rootRef} className={s.route} data-paused={stopped}>
      <svg className={s.track} aria-hidden="true">
        <path ref={dashedRef} />
        <path ref={pathRef} className={s.motionGuide} />
      </svg>
      <div ref={runnerRef} className={s.runner} aria-hidden="true">
        <XiaopaiFigure motion="running" />
      </div>
    </div>
  );
}
