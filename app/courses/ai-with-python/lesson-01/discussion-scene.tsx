/* oxlint-disable next/no-img-element -- Generated classroom illustrations. */
'use client';

import { ArrowRight } from 'lucide-react';
import { asset, Hint, More, Stage } from './lesson-ui';
import s from './discussion-scene.module.css';

const questions = [
  {
    title: '想判断什么？',
    copy: '例如：新角色是勇士还是恶魔。',
    image: '01-judgement.png',
    alt: '守门机器面对身份未知的新角色，需要在勇士和恶魔两种身份之间作出判断。',
  },
  {
    title: '找哪些带答案的例子？',
    copy: '例如：已经核实身份的角色档案。',
    image: '02-labelled-examples.png',
    alt: '老师核实勇士与恶魔的身份，给多份角色档案标明答案，再交给机器学习。',
  },
  {
    title: '从中提取什么线索？',
    copy: '例如：攻击、防御、血量。',
    image: '03-features.png',
    alt: '机器从角色资料中找出攻击、防御和血量，分别用剑、盾牌、爱心与数值条表示。',
  },
];

export function DiscussionScene() {
  return (
    <Stage
      label="CLASS DISCUSSION · 课堂讨论"
      title="你想教机器学会什么？"
      className={s.scene}
    >
      <div className={s.questions}>
        {questions.map((question, index) => (
          <section className={s.question} key={question.title}>
            <span className={s.number}>问题 0{index + 1}</span>
            <h3>{question.title}</h3>
            <figure className={s.illustration}>
              <img
                src={asset(`discussion/${question.image}`)}
                alt={question.alt}
                width={1536}
                height={1152}
              />
            </figure>
            <p>{question.copy}</p>
            {index < questions.length - 1 && (
              <ArrowRight className={s.connector} aria-hidden="true" />
            )}
          </section>
        ))}
      </div>
      <div className={s.discussionPrompt}>
        <Hint>选一个你熟悉的问题，口头说明你的想法。现在不必写代码。</Hint>
        <More label="教师追问">
          <p>这些真实答案是谁确认的？如果答案标错了，会发生什么？</p>
          <p>
            预测时，能提前拿到你选的那些线索吗？哪些错误可能影响使用这个模型的人？
          </p>
          <p>
            先接住学生的问题，再帮助他们把“想做什么”说成一个具体、可以检查的判断任务。
          </p>
        </More>
      </div>
    </Stage>
  );
}
