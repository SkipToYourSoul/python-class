/* oxlint-disable next/no-img-element -- Local generated comic artwork. */
import { Stage } from '../lesson-01/lesson-ui';
import { assetBase } from './lesson-data';
import s from './mission-comic.module.css';

export function MissionComic() {
  return (
    <Stage title="守住城门，还不够！" label="故事接续 · 新的难题">
      <figure className={s.comic}>
        <img
          src={`${assetBase}/assets/scout-problem-comic.png`}
          alt="四格漫画：勇士守住城门；登上前哨观察远方的恶魔；根据藤甲魔怕火的情报布置火把；各地不断传来敌情，勇士被成堆的情报包围。"
        />
        <figcaption>
          <p className={s.gate}>
            上次：分清勇士与恶魔，
            <br />
            守好城门。
          </p>
          <p className={s.scout}>
            现在：还要查看
            <br />
            远方的敌情！
          </p>
          <p className={s.defense}>
            了解恶魔的弱点，
            <br />
            才能提前布置防御。
          </p>
          <p className={s.fire}>藤甲魔怕火 → 准备火把</p>
          <p className={s.overload}>
            可是，新的敌情
            <br />
            还在不断送来……
          </p>
          <p className={s.question}>
            情报越来越多，
            <br />
            一条条看不过来，
            <br />
            <strong>我们该怎么办？</strong>
          </p>
        </figcaption>
      </figure>
    </Stage>
  );
}
