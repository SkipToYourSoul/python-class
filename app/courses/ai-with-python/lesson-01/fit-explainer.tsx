'use client';

import { ArrowRight, Database, GitBranch, Tags } from 'lucide-react';
import { XiaopaiSpeech } from './xiaopai-speech';
import s from './fit-explainer.module.css';

export function FitExplainer({ trained }: { trained: boolean }) {
  return (
    <section className={s.explainer} aria-label="小派讲解模型训练">
      <p className={s.label}>代码步骤示意 · 同一个模型 clf</p>
      <XiaopaiSpeech active featured label="小派的训练讲解">
        {trained ? (
          <>
            调用 <strong>fit(X, y)</strong>，让模型对照角色的
            <strong>特征和身份</strong>，学出分类规则！
          </>
        ) : (
          <>
            分类器创建好了！但它还没看过数据，<strong>还不能预测</strong>
            。下一步，用 fit 开始训练。
          </>
        )}
      </XiaopaiSpeech>
      <figure
        className={s.diagram}
        aria-label={
          trained
            ? '特征X和身份y经过fit训练，让模型学到规则'
            : '特征X和身份y尚未用于训练，模型等待学习'
        }
        data-trained={trained}
      >
        <div className={s.flow}>
          <div className={s.data}>
            <span>
              <Database aria-hidden="true" />X · 特征
            </span>
            <span>
              <Tags aria-hidden="true" />y · 身份
            </span>
          </div>
          <div className={s.arrow}>
            <b>fit</b>
            <ArrowRight size={32} aria-hidden="true" />
          </div>
          <div className={s.model}>
            {trained ? (
              <GitBranch size={56} aria-hidden="true" />
            ) : (
              <span className={s.question} aria-hidden="true">
                ?
              </span>
            )}
            <strong>{trained ? '学到规则' : '等待训练'}</strong>
            <span>模型 clf</span>
          </div>
        </div>
        <figcaption>
          {trained ? '已训练 · 可以用于预测' : '未训练 · 还不能预测'}
        </figcaption>
      </figure>
      <p className={s.note}>
        {trained ? (
          <>
            分界值 <strong>245、450</strong> 是从数据中学到的。
          </>
        ) : (
          <>创建模型 ≠ 训练模型</>
        )}
      </p>
    </section>
  );
}
