'use client';

import Image from 'next/image';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { usePageState } from '@/components/course/lesson-state';
import s from './penguin-challenge.module.css';

const ROOT = '/courses/ai-with-python/lesson-05';
export function PenguinIntro() {
  const [state, update] = usePageState({ penguinIntro: 'photos' });
  return (
    <Stage title="这套方法，也能认识企鹅吗？" label="REAL DATA · 认识企鹅">
      <div className={s.intro}>
        <div className={s.toolbar}>
          <button
            aria-pressed={state.penguinIntro === 'photos'}
            onClick={() => update({ penguinIntro: 'photos' })}
          >
            01 认识研究对象
          </button>
          <button
            aria-pressed={state.penguinIntro === 'fields'}
            onClick={() => update({ penguinIntro: 'fields' })}
          >
            02 看懂观测特征
          </button>
          <span>从恶魔图鉴，走向真实世界。</span>
        </div>
        {state.penguinIntro === 'photos' ? (
          <div className={s.photoGrid}>
            {[
              {
                name: '阿德利企鹅',
                latin: 'Adelie',
                image: 'penguin-adelie.jpg',
              },
              {
                name: '帽带企鹅',
                latin: 'Chinstrap',
                image: 'penguin-chinstrap.jpg',
              },
              {
                name: '巴布亚企鹅',
                latin: 'Gentoo · 也叫金图企鹅',
                image: 'penguin-gentoo.png',
              },
            ].map((p) => (
              <figure className={s.photoCard} key={p.name}>
                <Image
                  width={900}
                  height={900}
                  src={`${ROOT}/assets/${p.image}`}
                  alt={p.name + '的真实照片'}
                />
                <figcaption>
                  {p.name}
                  <span>{p.latin}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className={s.fieldGrid}>
            <Image
              width={1988}
              height={1672}
              className={s.fieldIllustration}
              src={`${ROOT}/assets/penguin-bill.png`}
              alt="企鹅喙的测量图：喙长沿嘴喙上缘方向测量；喙深表示嘴喙上下方向的厚度。"
            />
            <div className={s.definitions}>
              <div>
                <strong>喙长 · mm</strong>
                <span>
                  嘴喙上缘有多长？
                  <br />
                  图中横向箭头。
                </span>
              </div>
              <div>
                <strong>喙深 · mm</strong>
                <span>
                  嘴喙上下有多厚？
                  <br />
                  图中竖向箭头。
                </span>
              </div>
              <div>
                <strong>鳍肢长度 · mm</strong>
                <span>用来游泳的翅膀，从根部到末端有多长？</span>
              </div>
              <div>
                <strong>体重 · g</strong>
                <span>
                  用秤测量身体质量。
                  <br />
                  1000 g＝1 kg。
                </span>
              </div>
            </div>
          </div>
        )}
        <p className={s.lead}>
          先认识三种企鹅和四项测量特征，再用图表观察类别差异。
        </p>
      </div>
    </Stage>
  );
}
