/* oxlint-disable next/no-img-element -- Local classroom comic. */
'use client';

import { ArrowRight } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';

const dialogueGroups = [
  { name: '幸福组', behavior: '冷静互助' },
  { name: '无效组', behavior: '回避冲突' },
  { name: '多变组', behavior: '争论激烈' },
  { name: '敌对组', behavior: '交流很少' },
  { name: '无感组', behavior: '一方冷淡' },
];

export function GottmanCase() {
  const [state, setState] = usePageState({ resultsRevealed: false });

  return (
    <div className={s.caseLesson}>
      <div className={s.caseRecordParts}>
        <figure className={s.caseRecordPart}>
          <div className={s.casePanelArt}>
            <span className={s.caseStamp}>01 · 录下对话</span>
            <img
              src={`${assetBase}/assets/gottman-dialogue-chibi.png`}
              alt="戈特曼观察一对夫妻讨论分歧，桌旁的摄像机正在录制。"
              width={768}
              height={690}
            />
          </div>
          <figcaption>
            <h3>输入 · 对话表现的评分</h3>
            <ul className={s.caseFacts} aria-label="对话录制设置">
              <li>
                <strong>700 对夫妻</strong>
                <span>参与研究</span>
              </li>
              <li>
                <strong>争议话题</strong>
                <span>如金钱、亲戚关系</span>
              </li>
              <li>
                <strong>15 分钟</strong>
                <span>每场讨论时长</span>
              </li>
            </ul>
            <p>研究者看录像打分，例如幽默 +4、蔑视 −4。</p>
          </figcaption>
        </figure>
        <ArrowRight className={s.caseRecordArrow} aria-hidden="true" />
        <figure className={`${s.caseRecordPart} ${s.caseRecordLabel}`}>
          <div className={s.casePanelArt}>
            <span className={s.caseStamp}>02 · 分组与随访</span>
            <img
              src={`${assetBase}/assets/gottman-followup-chibi.png`}
              alt="后来再次见到同一对夫妻，戈特曼把真实的婚姻状况记在记录板上。"
              width={768}
              height={690}
            />
          </div>
          <figcaption>
            <section className={s.caseGrouping} aria-label="对话分组">
              <h3>先按对话评分分成五组</h3>
              <ul className={s.caseGroups}>
                {dialogueGroups.map(({ name, behavior }) => (
                  <li key={name}>
                    <strong>{name}</strong>
                    <span>{behavior}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className={s.caseFollowup} aria-label="随访标签">
              <div className={s.caseOutcomes}>
                <h3>随访标签 · 是否离婚</h3>
                <span>离婚</span>
                <span>未离婚</span>
              </div>
              <p>同组的夫妻，随访结果也可能不同。</p>
            </section>
          </figcaption>
        </figure>
      </div>
      <div className={s.caseReveal}>
        <button
          type="button"
          className={s.primary}
          aria-controls="l7-case-results"
          aria-expanded={state.resultsRevealed}
          onClick={() => setState({ resultsRevealed: !state.resultsRevealed })}
        >
          {state.resultsRevealed ? '收起随访结果' : '揭晓随访结果'}
        </button>
        <div aria-live="polite">
          <div id="l7-case-results" hidden={!state.resultsRevealed}>
            <ul
              className={`${s.caseFacts} ${s.caseResults}`}
              aria-label="随访与预测结果"
            >
              <li>
                <strong>12 年</strong>
                <span>随访时长</span>
              </li>
              <li>
                <strong>1–2 年</strong>
                <span>联络间隔</span>
              </li>
              <li>
                <strong>94%</strong>
                <span>这次预测的准确率</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
