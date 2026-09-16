/* oxlint-disable next/no-img-element -- Preserve the original GIFs and lesson illustrations. */
'use client';

import { useSyncExternalStore } from 'react';
import { ArrowRight } from 'lucide-react';
import { asset, Stage, useSceneState } from './lesson-ui';
import s from './learning-analogy-scene.module.css';

const samples = [
  { character: '一', image: 63, count: 1, feature: '一条横线' },
  { character: '二', image: 64, count: 2, feature: '两条横线' },
  { character: '三', image: 65, count: 3, feature: '三条横线' },
] as const;

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Correspondence({
  children,
  concept,
  shown,
}: {
  children: string;
  concept: string;
  shown: boolean;
}) {
  return (
    <div className={s.correspondence}>
      <h3>{children}</h3>
      {shown && (
        <span className={s.concept}>
          <ArrowRight size={24} aria-hidden="true" />
          <strong>{concept}</strong>
        </span>
      )}
    </div>
  );
}

export function LearningAnalogyScene({ active }: { active: boolean }) {
  const [value, set] = useSceneState('analogy', { showConcepts: false });
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    () => true,
  );
  const shown = value.showConcepts;

  return (
    <Stage
      label="MACHINE LEARNING · 认字的启发"
      title="还记得小时候怎样认字吗？"
      className={s.scene}
    >
      <nav className={s.revealSteps} aria-label="认字类比讲解步骤">
        <button
          type="button"
          aria-current={!shown ? 'step' : undefined}
          onClick={() => set({ showConcepts: false })}
        >
          <b>01</b> 回忆认字
        </button>
        <ArrowRight aria-hidden="true" />
        <button
          type="button"
          aria-current={shown ? 'step' : undefined}
          onClick={() => set({ showConcepts: true })}
        >
          <b>02</b> 联系机器学习
        </button>
      </nav>

      <div className={s.workspace}>
        <section className={s.examples} aria-label="字帖与字的模样">
          <div className={s.data}>
            <Correspondence concept="数据" shown={shown}>
              字帖
            </Correspondence>
            <span>{shown ? '供机器学习的例子' : '看过、练过的例子'}</span>
          </div>

          <div className={s.samples}>
            {samples.map((sample) => (
              <figure key={sample.character}>
                <img
                  className={s.characterImage}
                  src={asset(
                    active && !reducedMotion
                      ? `image${sample.image}.GIF`
                      : `learning-analogy/image${sample.image}-complete.png`,
                  )}
                  alt={`“${sample.character}”字的笔顺：${sample.feature}`}
                  width={600}
                  height={600}
                />
                <figcaption>
                  <span className={s.strokeDots} aria-hidden="true">
                    {Array.from({ length: sample.count }, (_, index) => (
                      <i key={index} />
                    ))}
                  </span>
                  {sample.feature}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className={s.features}>
            <Correspondence concept="特征" shown={shown}>
              字的模样
            </Correspondence>
            <p>
              {shown
                ? '帮助区分字的线索：横画数量。'
                : '数一数：每个字有几条横线？'}
            </p>
          </div>
        </section>

        <div className={s.learning}>
          <section className={s.thinking} aria-label="思考与建模">
            <img
              className={s.storyImage}
              src={asset('learning-analogy/learning-process.png')}
              alt="小朋友看着字帖，比较一、二、三的横画数量，反复练习认字。"
              width={1448}
              height={1086}
            />
            <div className={s.storyText}>
              <Correspondence concept="建模" shown={shown}>
                大脑的思考过程
              </Correspondence>
              <strong className={s.storyCaption}>看、比较、反复练习</strong>
              {shown && <p>用数据找规律、建立模型的过程。</p>}
            </div>
          </section>

          <div className={s.resultArrow} aria-hidden="true">
            ↓
          </div>

          <section className={s.skill} aria-label="学会的技能与模型">
            <img
              className={s.storyImage}
              src={asset('learning-analogy/learned-skill.png')}
              alt="同一个小朋友换了一本字帖，仍能认出不同写法的一、二、三。"
              width={1445}
              height={1088}
            />
            <div className={s.storyText}>
              <Correspondence concept="模型" shown={shown}>
                大脑学会的技能
              </Correspondence>
              <strong className={s.storyCaption}>换个写法，我也认识</strong>
              {shown && <p>学到的规律，用来判断新的例子。</p>}
            </div>
          </section>
        </div>
      </div>

      <div className={s.takeaway} aria-live="polite">
        <p>
          {shown ? (
            <>
              <strong>建模</strong>是学习的过程；<strong>模型</strong>
              是学到的结果。
            </>
          ) : (
            <>想一想：我们怎样把看过的字，变成自己的识字本领？</>
          )}
        </p>
        <span>这里用认字作类比；机器用算法处理数据，并不等同于人脑思考。</span>
      </div>
    </Stage>
  );
}
