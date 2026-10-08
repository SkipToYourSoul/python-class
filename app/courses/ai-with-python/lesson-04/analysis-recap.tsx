import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Guide, LessonStage, Portrait } from './lesson-ui';
import {
  records,
  rankSuspects,
  type SuspectRanking,
} from './investigation-data';
import s from './analysis-recap.module.css';

const first = records[0];
const ranking = rankSuspects();
const eligible = rankSuspects(3);
const expandedCount = records.reduce((sum, row) => sum + row.demons.length, 0);
const example = ranking.find((row) => row.name === '炎角兽')!;
const rock = ranking.find((row) => row.name === '岩背魔')!;
const exampleReadings = records.filter((row) =>
  row.demons.includes(example.name),
);

function Results({ rows }: { rows: SuspectRanking[] }) {
  return (
    <table className={s.table}>
      <thead>
        <tr>
          <th>恶魔</th>
          <th>均值</th>
          <th>次数</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.name}>
            <th>{row.name}</th>
            <td>{row.mean.toFixed(1)}</td>
            <td>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Step({
  number,
  title,
  method,
  note,
  children,
}: {
  number: number;
  title: string;
  method: string;
  note: string;
  children: ReactNode;
}) {
  const Arrow = number === 3 ? ArrowDown : number > 3 ? ArrowLeft : ArrowRight;
  return (
    <li className={s.step} data-step={number}>
      <header>
        <span className={s.number}>{number}</span>
        <h3>{title}</h3>
        <code>{method}</code>
      </header>
      <div className={s.example}>{children}</div>
      <p className={s.note}>{note}</p>
      {number < 6 && <Arrow className={s.arrow} aria-hidden="true" />}
    </li>
  );
}

export function AnalysisRecap() {
  return (
    <LessonStage
      title="从战报到名单：切的全过程"
      label="RECAP · 切 / 全流程复盘"
    >
      <ol className={s.flow} aria-label="从原始战报到调查名单的六步流程">
        <Step
          number={1}
          title="聚焦三列"
          method="选列"
          note={`${records.length} 场进攻 · 只取分析需要的字段`}
        >
          <table className={s.table}>
            <thead>
              <tr>
                <th>编号</th>
                <th>出现的恶魔</th>
                <th>威胁值</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{first.id}</td>
                <td>{first.demons.join(' / ')}</td>
                <td>{first.threat}</td>
              </tr>
            </tbody>
          </table>
          <span className={s.caption}>focus · 第 1 条示例</span>
        </Step>
        <Step
          number={2}
          title="拆分、展开"
          method="split → explode"
          note={`${records.length} 场 → ${expandedCount} 条关联，进攻没有增多`}
        >
          <div className={s.associations}>
            {first.demons.map((name) => (
              <div key={name}>
                <span>{first.id}</span>
                <strong>{name}</strong>
                <b>{first.threat}</b>
              </div>
            ))}
          </div>
          <span className={s.caption}>expanded · 同一场读数跟着名字走</span>
        </Step>
        <Step
          number={3}
          title="同名归组"
          method="groupby"
          note={`${ranking.length} 个恶魔 → ${ranking.length} 组关联读数`}
        >
          <div className={s.group}>
            <strong>{example.name}</strong>
            <span>
              {exampleReadings
                .slice(0, 3)
                .map((r) => r.threat)
                .join(' · ')}{' '}
              …
            </span>
          </div>
          <div className={s.group}>
            <strong>{rock.name}</strong>
            <span>{rock.mean}</span>
          </div>
          <span className={s.caption}>groups · 分组示意节选，还没有求平均</span>
        </Step>
        <Step
          number={4}
          title="每组汇总"
          method="mean / count"
          note="用全部关联记录计算 · 每个恶魔一行"
        >
          <Results rows={[example, rock]} />
          <span className={s.caption}>summary · 均值和次数节选</span>
        </Step>
        <Step
          number={5}
          title="从高到低排"
          method="sort_values"
          note="岩背魔均值最高，但只出现过 1 次"
        >
          <Results rows={ranking.slice(0, 2)} />
          <span className={s.caption}>排序示意 · 前 2 名，次数供核对</span>
        </Step>
        <Step
          number={6}
          title="核查、筛选"
          method="count ≥ 3"
          note={`保留 ${eligible.length} 个对象 · 再按均值排序`}
        >
          <div className={s.candidate}>
            <div className={s.portrait}>
              <Portrait name={eligible[0].name} />
            </div>
            <div>
              <strong>优先调查：{eligible[0].name}</strong>
              <span>
                均值 {eligible[0].mean.toFixed(1)} · {eligible[0].count} 次记录
              </span>
            </div>
          </div>
          <span className={s.caption}>
            ranking · 岩背魔暂不符合本轮次数条件
          </span>
        </Step>
      </ol>
      <Guide>
        “切”就是把混在一起的线索整理成可比较的数据。名单指引先查谁；要确认首领，还要找到指挥证据！
      </Guide>
    </LessonStage>
  );
}
