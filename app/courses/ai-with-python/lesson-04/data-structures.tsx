/* oxlint-disable next/no-img-element -- Reuse the local panda character artwork. */
'use client';

import { useState } from 'react';
import { usePageState } from '@/components/course/lesson-state';
import { LessonStage } from './lesson-ui';
import { records } from './investigation-data';
import s from './data-structures.module.css';

export function DataStructuresScene() {
  const [state, update] = usePageState({ extracted: false });
  const [animate, setAnimate] = useState(false);
  const examples = records.slice(0, 3);
  const extract = () => {
    if (state.extracted) return;
    setAnimate(true);
    update({ extracted: true });
  };

  return (
    <LessonStage
      title="熊猫博士的两种数据工具"
      label="SMELL · 闻 / 认识 DataFrame 与 Series"
      footer={
        <button
          onClick={() => {
            if (state.extracted) {
              setAnimate(false);
              update({ extracted: false });
            } else {
              extract();
            }
          }}
        >
          {state.extracted ? '再看整张表' : '取出“威胁值”这一列 →'}
        </button>
      }
    >
      <div className={s.concepts}>
        <section className={s.panel} aria-label="DataFrame 战报表">
          <header>
            <h3>DataFrame</h3>
            <p>有行、有列的二维表格</p>
          </header>
          <table className={s.table} data-extracted={state.extracted}>
            <caption>战报示意 · 前 3 行，全部 5 列</caption>
            <thead>
              <tr>
                <th scope="col" className={s.index}>
                  索引
                </th>
                <th scope="col">记录编号</th>
                <th scope="col">地点</th>
                <th scope="col">出现的恶魔</th>
                <th scope="col" className={s.threat}>
                  <button
                    onClick={extract}
                    aria-pressed={state.extracted}
                    aria-controls="l4-series-example"
                    aria-label="取出威胁值这一列"
                  >
                    威胁值 ↗
                  </button>
                </th>
                <th scope="col">持续分钟数</th>
              </tr>
            </thead>
            <tbody>
              {examples.map((record, index) => (
                <tr key={record.id}>
                  <th scope="row" className={s.index}>
                    {index}
                  </th>
                  <td>{record.id}</td>
                  <td>{record.place}</td>
                  <td>{record.demons.join(' / ')}</td>
                  <td className={s.threat}>{record.threat}</td>
                  <td>{record.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={s.note}>索引是行标签；记录编号是表中的一列。</p>
        </section>

        <section
          className={`${s.panel} ${s.seriesPanel}`}
          aria-label="Series 威胁值列"
        >
          <header>
            <h3>Series</h3>
            <p>带索引的一维数据</p>
          </header>
          <div className={s.seriesSlot} id="l4-series-example">
            <table
              className={`${s.table} ${s.seriesTable}`}
              aria-hidden={!state.extracted}
              data-animate={animate}
              onAnimationEnd={() => setAnimate(false)}
            >
              <caption>从左表单独取出的“威胁值”列</caption>
              <thead>
                <tr>
                  <th scope="col" className={s.index}>
                    索引
                  </th>
                  <th scope="col">威胁值</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((record, index) => (
                  <tr key={record.id}>
                    <th scope="row" className={s.index}>
                      {index}
                    </th>
                    <td>{record.threat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!state.extracted && (
              <div className={s.waiting}>
                <span aria-hidden="true">↗</span>
                <p>
                  点击左表的“威胁值”，
                  <br />
                  把这一列单独拿出来。
                </p>
              </div>
            )}
          </div>
          <p className={s.note}>索引和值一起保留，原表仍在。</p>
        </section>
      </div>

      <div className={s.doctor}>
        <img
          src="/courses/ai-with-python/lesson-04/assets/turtle-panda-helpers.png"
          alt="拿着表格记录板的熊猫博士"
        />
        <div className={s.speech}>
          <strong>熊猫博士</strong>
          <p aria-live="polite">
            {state.extracted
              ? `看！${examples.map((record) => record.threat).join('、')} 带着索引一起出来了。这是一份 Series；左边仍是 DataFrame。`
              : '把战报排成一整张表，是 DataFrame。只想研究威胁值？试着单独取出这一列！'}
          </p>
        </div>
      </div>
    </LessonStage>
  );
}
