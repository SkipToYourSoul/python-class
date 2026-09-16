/* oxlint-disable next/no-img-element -- Generated game artwork. */
'use client';

import { Play, ShieldCheck } from 'lucide-react';
import { asset } from '../lesson-ui';
import s from './guardian-lobby.module.css';

export function GuardianLobby({ onStart }: { onStart: () => void }) {
  return (
    <figure className={s.lobby}>
      <img
        src={asset('castle-guardian-lobby.png')}
        alt="蓝金色城堡矗立在山谷中，披蓝色斗篷的守卫与石桥上的小恶魔隔桥相望"
      />
      <figcaption className={s.menu}>
        <div className={s.mission}>
          <ShieldCheck aria-hidden="true" />
          <span>
            勇士放行 <i aria-hidden="true">·</i> 恶魔拦下
          </span>
        </div>
        <button className={s.start} type="button" onClick={onStart}>
          <Play aria-hidden="true" fill="currentColor" />
          开始训练
        </button>
      </figcaption>
    </figure>
  );
}
