/* oxlint-disable next/no-img-element -- Supplied character artwork. */
'use client';

import { ArrowRight } from 'lucide-react';
import { warriors } from '@/lib/course-data';
import { asset, featureNames } from '../lesson-ui';
import lesson from '../lesson-review.module.css';
import s from './guardian-archive.module.css';

const roles = ['勇士', '恶魔'].flatMap((category) =>
  warriors.filter((role) => role.category === category),
);

export function GuardianArchive({ onContinue }: { onContinue: () => void }) {
  return (
    <div className={s.archive}>
      <ul className={s.cards} aria-label="10 份角色档案">
        {roles.map((role) => (
          <li className={s.card} key={role.name}>
            <div className={s.heading}>
              <h3 className={s.name}>{role.name}</h3>
              <span className={s.identity} data-kind={role.category}>
                {role.category}
              </span>
            </div>
            <div className={s.details}>
              <img src={asset(role.image)} alt={role.name} />
              <dl className={s.stats}>
                {(['attack', 'defense', 'health'] as const).map((feature) => (
                  <div key={feature}>
                    <dt>{featureNames[feature]}</dt>
                    <dd>{role[feature]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>
      <div className={s.actions}>
        <button className={lesson.primary} type="button" onClick={onContinue}>
          下一步：比较规则
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
