/* oxlint-disable next/no-img-element -- Local course portrait and generated teaching illustration. */
'use client';

import { Stage, asset } from './lesson-ui';
import s from './samuel-scene.module.css';

export function SamuelScene() {
  return (
    <Stage label="MACHINE LEARNING · 认识机器学习" title="什么是机器学习？">
      <div className={s.introduction}>
        <figure className={s.person}>
          <img
            src={asset('image62.jpeg')}
            alt="亚瑟·塞缪尔"
            width={56}
            height={64}
          />
          <figcaption>
            <strong>亚瑟·塞缪尔 · 1959</strong>
            <span lang="en">
              Field of study that gives computers the ability to learn without
              being explicitly programmed.
            </span>
          </figcaption>
        </figure>
        <p>
          机器学习研究和构建的是一种特殊算法，能够让计算机自己
          <strong>在数据中学习</strong>从而<strong>进行预测</strong>
        </p>
      </div>
      <figure className={s.diagram}>
        <img
          src={asset('samuel-machine-learning-story.png')}
          alt="机器学习比喻图：冰淇淋摊需要决定明天备货多少。把现实问题转成数学问题，记录示例气温和销量：25°C卖出60份、30°C卖出90份、35°C卖出120份。电脑从数据中学习规律，对32°C的销量给出预计约100份的示意预测，再用预测帮助摊主准备冰淇淋。"
          width={1983}
          height={793}
        />
      </figure>
    </Stage>
  );
}
