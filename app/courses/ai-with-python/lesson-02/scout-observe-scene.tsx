/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { Castle, Flashlight, Flame, Snowflake, RotateCcw } from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import { ScoutRecord, Note } from './lesson-ui';
import { assetBase, scoutPath, scoutRecord } from './lesson-data';
import { usePageState } from './lesson-state';
import shared from './lesson.module.css';
import s from './scout-observe-scene.module.css';

const fields = [
  { label: '出没地点', values: [scoutRecord.location, '迷雾森林', '冰封山口'] },
  { label: '属性', values: [scoutRecord.attribute, '藤蔓', '寒冰'] },
  { label: '已知弱点', values: [scoutRecord.weakness, '怕火', '怕热'] },
];
const defenses = [
  { name: '强光照射', Icon: Flashlight },
  { name: '火把防线', Icon: Flame },
  { name: '冰霜屏障', Icon: Snowflake },
];

export function ScoutObserveScene() {
  const [v, set] = usePageState({ intel: [0, 0, 0], defense: -1, replay: 0 });
  const accurate = v.intel.every((value) => value === 0);
  const deployed = v.defense >= 0 && accurate;
  const success = deployed && v.defense === 0;
  return (
    <Stage
      title="先亲自查一条敌情"
      label="人工侦察 · 从情报到防御"
      footer={<Note>先看敌情，再选对策。一条记录，就能帮助勇士提前布防。</Note>}
    >
      <div className={`${shared.two} ${s.layout}`}>
        <div className={shared.stack}>
          <div className={shared.observeEvidence}>
            <img
              src={`${assetBase}/assets/scout-observe.png`}
              alt="勇士在电脑上查看炎角兽的前线情报。"
            />
            <ScoutRecord />
          </div>
          <a
            className={shared.secondary}
            href={scoutPath}
            target="_blank"
            rel="noreferrer"
          >
            打开前线侦察记录站 ↗
          </a>
        </div>
        <div className={s.controls}>
          <h3>
            <span>1</span> 找到这条敌情
          </h3>
          <div className={s.fields}>
            {fields.map((field, index) => (
              <label key={field.label}>
                {field.label}
                <select
                  value={v.intel[index]}
                  onChange={(event) =>
                    set({
                      intel: v.intel.map((value, i) =>
                        i === index ? Number(event.target.value) : value,
                      ),
                      defense: -1,
                    })
                  }
                >
                  {field.values.map((value, i) => (
                    <option key={value} value={i}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <h3>
            <span>2</span> 你会怎样部署防御？
          </h3>
          <div className={s.defenses}>
            {defenses.map(({ name, Icon }, i) => (
              <button
                key={name}
                aria-pressed={v.defense === i}
                onClick={() => set({ defense: i, replay: v.replay + 1 })}
              >
                <Icon aria-hidden="true" />
                {name}
              </button>
            ))}
          </div>
          <div
            key={v.replay}
            className={`${s.battle} ${success ? s.success : ''}`}
            data-defense={deployed ? v.defense : -1}
            aria-hidden="true"
          >
            <div className={s.castle}>
              <Castle />
            </div>
            <div className={s.effect}>
              {deployed && v.defense === 0 && <div className={s.beam} />}
              {deployed && v.defense === 1 && (
                <div className={s.flames}>
                  <Flame />
                  <Flame />
                  <Flame />
                </div>
              )}
              {deployed && v.defense === 2 && (
                <div className={s.ice}>
                  <Snowflake />
                  <Snowflake />
                  <Snowflake />
                </div>
              )}
            </div>
            <div className={s.demon} />
            <span>
              {deployed
                ? success
                  ? '强光亮起 · 炎角兽退避'
                  : '炎角兽仍在逼近'
                : '北方峡谷 · 等待你的部署'}
            </span>
          </div>
          <output className={s.feedback} data-success={success}>
            {v.defense < 0
              ? '它的弱点是“怕强光”，哪种防御能派上用场？'
              : !accurate
                ? '先核对左侧记录：北方峡谷、火焰、怕强光，再部署。'
                : success
                  ? '部署成功！利用“怕强光”的弱点，守住峡谷。'
                  : v.defense === 1
                    ? '记录没有说它怕火。再试试针对“怕强光”的办法。'
                    : '记录没有说它怕冰。再试试针对“怕强光”的办法。'}
          </output>
          <button
            className={s.reset}
            onClick={() =>
              set({ intel: [0, 0, 0], defense: -1, replay: v.replay + 1 })
            }
          >
            <RotateCcw size={20} />
            重新部署
          </button>
        </div>
      </div>
    </Stage>
  );
}
