/* oxlint-disable next/no-img-element -- Local course illustrations. */
import { ArrowRight, MailQuestion } from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import { assetBase } from './lesson-data';
import s from './scout-scale-scene.module.css';

const messages = [
  {
    image: 'one',
    title: '一封信',
    caption: '自己看，很轻松。',
    alt: '勇士轻松读着一封敌情信，信中画着恶魔和地图。',
  },
  {
    image: 'many',
    title: '来信堆成山',
    caption: '太多了，看不过来！',
    alt: '各地哨站的敌情信堆满桌子，勇士忙得看不过来。',
  },
  {
    image: 'update',
    title: '新消息又来了',
    caption: '刚看完，又变了！',
    alt: '勇士刚读完桌上的敌情，窗口的信使又送来了新消息。',
  },
];

export function ScoutScaleScene() {
  return (
    <Stage title="消息越来越多，怎么办？" label="任务升级 · 勇士的难题">
      <div className={s.layout}>
        <div className={s.comic} aria-label="敌情不断增加的三个场景">
          {messages.map((message, index) => (
            <figure className={s.frame} key={message.image}>
              <figcaption>
                <span className={s.number}>{index + 1}</span>
                <strong>{message.title}</strong>
              </figcaption>
              <img
                src={`${assetBase}/assets/scout-scale-${message.image}.png`}
                alt={message.alt}
              />
              <p>{message.caption}</p>
              {index < messages.length - 1 && (
                <span className={s.next} aria-hidden="true">
                  <ArrowRight />
                </span>
              )}
            </figure>
          ))}
        </div>
        <aside className={s.question}>
          <MailQuestion aria-hidden="true" />
          <p>
            勇士总不能
            <br />
            日夜守着信箱。
          </p>
          <strong>能不能请个小帮手，按约定替我们取信？</strong>
        </aside>
      </div>
    </Stage>
  );
}
