/* oxlint-disable next/no-img-element -- Original course character artwork. */
'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, Swords } from 'lucide-react';
import { warriors } from '@/lib/course-data';
import { asset } from './lesson-ui';
import s from './castle-battle.module.css';

export function CastleBattle({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
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
    <div
      className={s.battle}
      data-playing={playing && !hidden && !reducedMotion}
    >
      <img className={s.backdrop} src={asset('image108.png')} alt="" />
      <div className={s.arena}>
        <div className={s.impact} aria-hidden="true">
          <span className={s.cloud} />
          <span className={s.burst}>
            <Swords />
          </span>
          <i className={s.spark} />
          <i className={s.spark} />
          <i className={s.spark} />
        </div>
        {(['勇士', '恶魔'] as const).map((category) => (
          <div
            key={category}
            className={`${s.team} ${category === '勇士' ? s.warriors : s.demons}`}
            aria-label={`${category}队伍`}
          >
            {warriors
              .filter((role) => role.category === category)
              .map((role) => (
                <figure key={role.name} className={s.fighter}>
                  <img src={asset(role.image)} alt={role.name} />
                </figure>
              ))}
          </div>
        ))}
      </div>
      {reducedMotion ? (
        <span className={s.motionNote}>已减少动态效果</span>
      ) : (
        <button className={s.control} type="button" onClick={onToggle}>
          {playing ? (
            <Pause size={20} aria-hidden="true" />
          ) : (
            <Play size={20} aria-hidden="true" />
          )}
          {playing ? '暂停混战动效' : '播放混战动效'}
        </button>
      )}
    </div>
  );
}
