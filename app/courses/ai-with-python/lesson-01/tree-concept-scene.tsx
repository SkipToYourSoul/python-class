/* oxlint-disable next/no-img-element -- Generated classroom character illustration. */
'use client';

import { GitBranch, Settings2 } from 'lucide-react';
import { Stage, CastleTree, asset } from './lesson-ui';
import { XiaopaiSpeech } from './xiaopai-speech';
import s from './tree-concept-scene.module.css';

export function TreeConceptScene() {
  return (
    <Stage label="DECISION TREE · 专业概念" title="决策树：一种机器学习算法">
      <div className={s.layout}>
        <section className={s.treeArea} aria-label="血量390的完整决策路径">
          <CastleTree health={390} step={3} terms />
          <p className={s.path}>
            <span>390 ＞ 245</span>
            <span aria-hidden="true">→</span>
            <span>390 ≤ 450</span>
            <span aria-hidden="true">→</span>
            <strong>预测：勇士</strong>
          </p>
        </section>
        <div className={s.explanation}>
          <XiaopaiSpeech active compact label="小派讲解决策树">
            <strong>决策树算法</strong>
            从数据中学习判断规则，生成树状模型，再沿条件分支给出预测。
          </XiaopaiSpeech>
          <figure className={s.warrior}>
            <img
              src={asset('decision-tree-warrior-390.png')}
              alt="身穿银蓝铠甲、手持长剑的勇士"
              width={1254}
              height={1254}
            />
            <figcaption>
              <span>新来客 · 银翼守卫</span>
              <strong>
                血量 <b>390</b>
              </strong>
              <p>
                沿左侧蓝色路径
                <br />
                预测为<strong>勇士</strong>
              </p>
            </figcaption>
          </figure>
          <section className={s.comparison} aria-label="算法和模型有什么区别？">
            <h3>算法和模型有什么区别？</h3>
            <div className={s.cards}>
              <div className={s.algorithm}>
                <h4>
                  <Settings2 size={24} aria-hidden="true" />
                  算法 · 学习方法
                </h4>
                <p>从数据中寻找规则。</p>
              </div>
              <div className={s.model}>
                <h4>
                  <GitBranch size={24} aria-hidden="true" />
                  模型 · 学习结果
                </h4>
                <p>
                  学到的具体规则，
                  <br />
                  如左边这棵树。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Stage>
  );
}
