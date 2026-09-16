'use client';

import { useEffect, useState } from 'react';
import { XiaopaiFigure } from '@/components/course/xiaopai-figure';
import s from './xiaopai-mascot.module.css';

/** Rig the supplied artwork in SVG coordinates; keep its texture and lettering. */
export function XiaopaiMascot() {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);
  return (
    <div className={s.mascot} data-paused={reducedMotion || hidden}>
      <XiaopaiFigure className={s.figure} />
    </div>
  );
}
