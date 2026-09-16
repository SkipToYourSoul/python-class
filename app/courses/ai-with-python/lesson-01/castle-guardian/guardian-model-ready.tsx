/* oxlint-disable next/no-img-element -- Generated game artwork. */
'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { warriors } from '@/lib/course-data';
import { asset, predictRole } from '../lesson-ui';
import lesson from '../lesson-review.module.css';
import s from './guardian-model-ready.module.css';

const correct = warriors.filter(
  (role) => predictRole(role) === role.category,
).length;

export function GuardianModelReady({ onContinue }: { onContinue: () => void }) {
  return (
    <aside className={s.ready} aria-label="守门员已就位">
      <figure className={s.art}>
        <img
          src={asset('castle-guardian-model-ready.png')}
          alt="蓝色披风的城堡守门员手持盾牌，站在发光的城门控制台旁，准备迎接新来客"
        />
      </figure>
      <div className={s.summary}>
        <div className={s.result}>
          <ShieldCheck aria-hidden="true" />
          <div>
            <span>训练档案分对</span>
            <strong>
              {correct} / {warriors.length}
            </strong>
          </div>
        </div>
        <button className={lesson.primary} type="button" onClick={onContinue}>
          迎接新的来客
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
