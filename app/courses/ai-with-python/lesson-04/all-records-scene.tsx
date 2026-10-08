'use client';

import { usePageState } from '@/components/course/lesson-state';
import { records } from './investigation-data';
import { Guide, LessonStage, Tabs } from './lesson-ui';
import s from './all-records-scene.module.css';

const PAGE_SIZE = 6;
const PAGE_COUNT = Math.ceil(records.length / PAGE_SIZE);
const DEMON_COUNT = new Set(records.flatMap((record) => record.demons)).size;
const PAGE_LABELS = Array.from({ length: PAGE_COUNT }, (_, page) => {
  const first = page * PAGE_SIZE + 1;
  const last = Math.min(first + PAGE_SIZE - 1, records.length);
  return `${String(first).padStart(2, '0')}—${String(last).padStart(2, '0')}`;
});

export function AllRecordsScene() {
  const [state, update] = usePageState({ page: 0 });
  const page = Math.max(0, Math.min(state.page, PAGE_COUNT - 1));
  const first = page * PAGE_SIZE;
  const currentRecords = records.slice(first, first + PAGE_SIZE);

  return (
    <LessonStage
      title="先把全部战报看一遍"
      label="LOOK · 望 / 完整数据档案"
      footer={
        <div className={s.pagination}>
          <span>翻阅记录</span>
          <Tabs
            label="选择战报范围"
            labels={PAGE_LABELS}
            value={page}
            onChange={(page) => update({ page })}
          />
        </div>
      }
    >
      <div className={s.overview} aria-label="数据整体概况">
        <p>
          <strong>{records.length}</strong> 场进攻
        </p>
        <p>
          <strong>5</strong> 个字段
        </p>
        <p>
          <strong>{DEMON_COUNT}</strong> 只恶魔
        </p>
        <span>按原始记录顺序翻阅</span>
      </div>
      <table className={s.table}>
        <caption aria-live="polite">
          第 {first + 1}—{first + currentRecords.length} 条 / 共{' '}
          {records.length} 条 · 第 {page + 1} / {PAGE_COUNT} 页
        </caption>
        <colgroup>
          <col className={s.idColumn} />
          <col className={s.placeColumn} />
          <col className={s.demonsColumn} />
          <col className={s.threatColumn} />
          <col className={s.minutesColumn} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">记录编号</th>
            <th scope="col">地点</th>
            <th scope="col">出现的恶魔</th>
            <th scope="col">威胁值</th>
            <th scope="col">持续分钟数</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record) => (
            <tr key={record.id}>
              <th scope="row">{record.id}</th>
              <td>{record.place}</td>
              <td>{record.demons.join(' / ')}</td>
              <td>{record.threat}</td>
              <td>{record.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Guide>
        一行是一场进攻。威胁值是哨塔记录的整场最高读数（0—100），不代表单个恶魔的伤害。
      </Guide>
    </LessonStage>
  );
}
