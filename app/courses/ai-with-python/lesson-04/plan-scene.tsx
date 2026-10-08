import { ArrowRight, ArrowDownWideNarrow, FileCheck2 } from 'lucide-react';
import { Comic, Guide, LessonStage } from './lesson-ui';
import { records } from './investigation-data';
import s from './plan-scene.module.css';

const first = records[0];
const groupName = first.demons[0];
const examples = records
  .filter((record) => record.demons.includes(groupName))
  .slice(0, 3);
const steps = [
  { title: '拆开名字', description: '每个名字各占一行，保留进攻编号与读数。' },
  {
    title: '按恶魔分组',
    description: '找到同一个恶魔，把它关联的记录放在一起。',
  },
  { title: '求平均并排序', description: '每组求平均，从大到小排出调查顺序。' },
  {
    title: '核对并筛选',
    description: '检查记录次数，按条件筛选，说明先查谁。',
  },
];

export function PlanScene() {
  return (
    <LessonStage title="四步整理出调查名单" label="ANALYZE · 切 / 调查路线">
      <div className={s.brief}>
        <Comic className={s.comic} />
        <div className={s.question}>
          <span>勇士的任务</span>
          <p>
            名字挤在一格里，记录散在各处。
            <br />
            怎样找出值得优先调查的恶魔？
          </p>
        </div>
      </div>
      <ol className={s.flow} aria-label="数据调查的四个步骤">
        {steps.map((step, index) => (
          <li className={s.step} key={step.title}>
            <div className={s.heading}>
              <span className={s.number}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{step.title}</h3>
            </div>
            <div className={s.visual}>
              {index === 0 && (
                <>
                  <span className={s.caption}>同一场进攻 → 两条关联</span>
                  {first.demons.map((name) => (
                    <div className={s.record} key={name}>
                      <span>{first.id}</span>
                      <strong>{name}</strong>
                      <span>{first.threat}</span>
                    </div>
                  ))}
                </>
              )}
              {index === 1 && (
                <>
                  <strong>{groupName}这一组</strong>
                  <div className={s.group}>
                    {examples.map((record) => (
                      <span key={record.id}>{record.threat}</span>
                    ))}
                  </div>
                  <span className={s.caption}>关联读数示意 · 节选</span>
                </>
              )}
              {index === 2 && (
                <>
                  <span className={s.fraction}>
                    <strong>威胁值之和</strong>
                    <span>关联记录条数</span>
                  </span>
                  <span className={s.sort}>
                    <ArrowDownWideNarrow aria-hidden="true" /> 从高到低
                  </span>
                </>
              )}
              {index === 3 && (
                <>
                  <FileCheck2 className={s.file} aria-hidden="true" />
                  <strong>均值 ＋ 次数</strong>
                  <span className={s.caption}>本轮条件：至少 3 次</span>
                </>
              )}
            </div>
            <p className={s.description}>{step.description}</p>
            {index < 3 && <ArrowRight className={s.arrow} aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <Guide>
        先整理，再比较，最后核对。名单告诉我们先查谁；要确认首领，还得找到指挥证据。
      </Guide>
    </LessonStage>
  );
}
