/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { useContext } from 'react';
import { ChapterCover } from '../lesson-01/lesson-original-scenes';
import { XiaopaiMascot } from '../lesson-01/xiaopai-mascot';
import { LessonState } from './lesson-state';
import { chapters, assetBase, scenes } from './lesson-data';
import s from './lesson.module.css';
import { RequestScene } from './request-scenes';
import { ParseScene } from './parse-scenes';
import { TransferScene } from './transfer-scenes';
import { PracticeScene } from './practice-scenes';
import { ChallengeEntry, IntelligenceGame } from './intelligence-game';

export function LessonScenes({ id }: { id: string }) {
  const { navigate } = useContext(LessonState);
  if (id === 'l2-cover')
    return (
      <div className={s.cover}>
        <div className={s.coverCopy}>
          <span className={s.eyebrow}>AI WITH PYTHON / LESSON 02</span>
          <h1>
            敌情动态
            <br />
            <em>早知道</em>
          </h1>
          <p>勇士与恶魔 · 前线侦察</p>
          <div className={s.rule} />
          <p className={s.coverBrief}>
            用 Python 收集敌情，
            <br />
            为城堡准备防御方案。
          </p>
          <button className={s.primary} onClick={() => navigate('l2-mission')}>
            接下侦察任务 →
          </button>
          <div className={s.coverCompanion}>
            <div className={s.coverSpeech}>
              小派就位，
              <br />
              准备出发侦察！
            </div>
            <div className={s.coverMascot}>
              <XiaopaiMascot />
            </div>
          </div>
        </div>
        <figure className={s.coverArt}>
          <img
            src={`${assetBase}/assets/intelligence-station.png`}
            alt="勇士在城堡瞭望室观察远方，准备收集情报"
          />
          <figcaption>王国档案 02 · 数据获取</figcaption>
        </figure>
      </div>
    );
  const scene = scenes.find((item) => item.id === id)!;
  if (id.endsWith('-cover')) {
    const c = chapters.find((item) => item.id === scene.chapter)!;
    return (
      <ChapterCover
        number={c.number}
        kicker={
          c.id === 'request'
            ? 'REQUEST'
            : c.id === 'parse'
              ? 'PARSE'
              : 'TRANSFER'
        }
        title={c.title}
        task={
          c.id === 'request'
            ? '从前线侦察记录站取回网页，核对恶魔信息。'
            : c.id === 'parse'
              ? '名字已经找到，再解析每个恶魔的地点、属性和已知弱点。'
              : '敌情交给程序，勇士腾出时间选电影。用学过的方法获取豆瓣片名与评分。'
        }
      />
    );
  }
  if (id === 'l2-challenge-entry') return <ChallengeEntry />;
  if (id === 'l2-challenge') return <IntelligenceGame />;
  if (id.startsWith('l2-practice-') || id === 'l2-summary')
    return <PracticeScene id={id} />;
  if (scene.chapter === 'start' || scene.chapter === 'request')
    return <RequestScene id={id} />;
  if (scene.chapter === 'parse') return <ParseScene id={id} />;
  if (scene.chapter === 'transfer') return <TransferScene id={id} />;
  return null;
}
