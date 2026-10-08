'use client';
import { useContext } from 'react';
import Link from '@/components/static-link';
import { LessonState } from '@/components/course/lesson-state';
import { Comic, Guide, LessonStage, PracticeTools } from './lesson-ui';
import s from './lesson.module.css';

export function ChallengeEntry() {
  return (
    <LessonStage
      title="数据破魔盾：魔王换身了"
      label="FINAL CHALLENGE · 全班协作"
    >
      <div className={s.challengeEntry}>
        <div
          className={s.challengeScene}
          style={{
            background:
              'url(/courses/ai-with-python/lesson-04/assets/shield-game/arena.png) center / cover',
          }}
        >
          <div>
            <span>旧战报追不到新的伪装。</span>
            <strong>
              四个全新面孔
              <br />
              三层魔盾，一起击破
            </strong>
          </div>
        </div>
        <div className={s.challengeBrief}>
          <div className={s.challengeBriefHeading}>
            <p>
              <span>全班作战任务</span>
              <span>3—5 分钟</span>
            </p>
            <h3>锁定新宿主，击破魔盾</h3>
          </div>
          <ol className={s.challengeSteps}>
            {[
              ['核查次数', '平均值很高，会不会只观测过一次？'],
              ['保留候选', '比较均值与次数，留下两名重点对象。'],
              ['核实指挥', '看清谁发令、谁响应，发动最后一击！'],
            ].map(([title, description], index) => (
              <li key={title}>
                <span className={s.challengeStepNumber}>{index + 1}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={s.challengeLaunch}>
            <Link
              className={s.primary}
              href="/courses/ai-with-python/lesson-04/final-challenge"
            >
              开启破盾行动 →
            </Link>
            <p>全班判断，老师操作 · 选错也能再试</p>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}

export function SummaryScene() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage title="带走一套调查方法" label="FIELD NOTES · 数据小侦探">
      <div className={s.balancedLayout}>
        <div className={`${s.route} ${s.balancedColumn}`}>
          {[
            ['望', '看懂字段、行列与记录含义'],
            ['闻', '读入表格，检查并选择数据'],
            ['切', '展开、分组、统计、排序与筛选'],
          ].map(([a, b]) => (
            <div className={s.routeItem} key={a}>
              <b>{a}</b>
              <p>{b}</p>
            </div>
          ))}
          <p className={s.feedback}>
            “问”贯穿始终：我想知道什么？怎样比较？证据足够吗？
          </p>
        </div>
        <div className={s.balancedColumn}>
          <Comic kind="compare" />
          <Guide>
            统计帮助确定调查方向；确认谁在指挥，还需要核实指令与响应。
          </Guide>
          <div className={s.actions}>
            <button onClick={() => navigate('l4-challenge-entry')}>
              前往结课挑战
            </button>
            <PracticeTools />
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
