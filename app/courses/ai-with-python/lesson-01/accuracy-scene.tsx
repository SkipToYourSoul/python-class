/* oxlint-disable next/no-img-element -- Existing course character illustration. */
'use client';

import {
  Stage,
  PracticeProgress,
  CodeCell,
  accuracyCode,
  newRoles,
  asset,
  useSceneState,
} from './lesson-ui';
import { XiaopaiSpeech } from './xiaopai-speech';
import shared from './lesson-review.module.css';
import s from './accuracy-scene.module.css';

export function AccuracyScene() {
  const [v, set] = useSceneState('accuracy', { reveal: false });
  const visitor = newRoles[2];
  return (
    <Stage
      label="CLASS PRACTICE · 课堂练习 03"
      title="预测之后，用真实答案检查表现"
    >
      <PracticeProgress active={5} />
      <div className={s.layout}>
        <section className={s.check} aria-label="核对两位来客的预测结果">
          <CodeCell code={accuracyCode} compact />
          <XiaopaiSpeech active compact label="小派讲解真实标签">
            <strong>true_labels</strong>{' '}
            是核实后的真实身份，不能用模型的预测当答案。
          </XiaopaiSpeech>
          <table className={s.results}>
            <thead>
              <tr>
                <th>来客</th>
                <th>模型预测</th>
                <th>独立档案</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>A</th>
                <td>勇士</td>
                <td>{v.reveal ? '勇士 ✓' : '待核对'}</td>
              </tr>
              <tr>
                <th>B</th>
                <td>恶魔</td>
                <td>{v.reveal ? '恶魔 ✓' : '待核对'}</td>
              </tr>
            </tbody>
          </table>
          <div className={s.checkAction}>
            <button
              className={shared.primary}
              onClick={() => set({ reveal: !v.reveal })}
            >
              {v.reveal ? '收起真实答案' : '打开真实身份档案'}
            </button>
            {v.reveal && (
              <p
                className={s.score}
                aria-live="polite"
                aria-label="这两位都预测正确，准确率100%"
              >
                <strong>2 / 2 = 100%</strong>
              </p>
            )}
          </div>
        </section>
        <section
          className={s.counterexample}
          aria-label="观察模型预测错误的反例"
        >
          <h3>再遇到一位勇士，模型还会对吗？</h3>
          <figure className={s.visitor}>
            <img src={asset(visitor.image)} alt="远行勇士" />
            <figcaption>
              <strong>远行勇士</strong>
              <span>攻击 48 · 防御 75</span>
              <b>血量 470</b>
              <span className={s.identity}>真实身份：勇士</span>
            </figcaption>
          </figure>
          <p className={s.path}>
            470 ＞ 245 → 470 ＞ 450 → <strong>恶魔</strong>
          </p>
          <CodeCell
            code={'extra = [[48, 75, 470]]\nprint(clf.predict(extra))'}
            compact
            output="[0]"
          />
          <p className={s.conclusion}>
            <strong>预测错了！</strong>学到的规律也有局限。
          </p>
        </section>
      </div>
    </Stage>
  );
}
