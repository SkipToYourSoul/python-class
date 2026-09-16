/* oxlint-disable next/no-img-element -- Reuse the course's local story illustrations. */
'use client';
import Link from 'next/link';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import { useContext } from 'react';
import { LessonState } from './lesson-state';
import { ResourceButton } from './lesson-ui';
import { assetBase, oldAssets } from './lesson-data';
import { ScoutParsingPractice } from './parse-scenes';
import { ScoutWritingPractice } from './scout-writing-practice';
import { MovieWritingPractice } from './transfer-scenes';
import s from './lesson.module.css';
import summary from './summary.module.css';

const recap = [
  {
    title: '取回网页',
    image: 'scout-http-client.png',
    alt: '勇士带着网页地址发出请求，电脑上显示前线敌情',
    description: '让程序取回 HTML，在输出中找到三个恶魔的名字。',
    tools: 'requests.get() → res.text',
    result: '练习一 · 拿到原始网页',
  },
  {
    title: '解析敌情',
    image: 'scout-parse-formula.png',
    alt: '勇士与机械鸟从卷轴中摘出地点信息，整理成情报',
    description: '看懂 DOM，逐条提取出没地点、属性和已知弱点。',
    tools: 'BeautifulSoup · find / find_all',
    result: '练习二 · 整理三份情报',
  },
  {
    title: '换个网站',
    image: 'warriors-movie-time.png',
    alt: '敌情整理完成后，勇士们用空闲时间挑选电影',
    description: '核对响应和页面结构，用同样的方法打印豆瓣电影标题。',
    tools: 'for 循环 · get_text()',
    result: '练习三 · 得到电影清单',
  },
];

export function PracticeScene({ id }: { id: string }) {
  const { navigate } = useContext(LessonState);
  if (id === 'l2-summary')
    return (
      <Stage
        title="从敌情到电影，一套方法带走"
        label="本课总结 · 获取、解析、迁移"
        footer={
          <div className={summary.actions}>
            <button
              className={s.primary}
              onClick={() => navigate('l2-challenge-entry')}
            >
              <RotateCcw size={20} aria-hidden="true" /> 再次挑战城堡情报官
            </button>
            <ResourceButton label="练习代码与运行说明" />
            <Link href="/courses/ai-with-python">返回课程目录 →</Link>
          </div>
        }
      >
        <div className={summary.cards}>
          {recap.map((item, i) => (
            <article key={item.title} className={summary.card}>
              <div className={summary.picture} data-chapter={i + 1}>
                <img src={`${assetBase}/assets/${item.image}`} alt={item.alt} />
                <span className={summary.number}>0{i + 1}</span>
              </div>
              <div className={summary.copy}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className={summary.tools}>{item.tools}</span>
                <strong className={summary.result}>{item.result}</strong>
              </div>
            </article>
          ))}
        </div>
        <div className={summary.formula}>
          <img src={`${oldAssets}/xiaopai-guide.png`} alt="小派" />
          <span className={summary.formulaLabel}>解析口诀</span>
          <strong>根据属性</strong>
          <ArrowRight aria-hidden="true" />
          <strong>寻找元素</strong>
          <ArrowRight aria-hidden="true" />
          <strong>获取文本</strong>
        </div>
      </Stage>
    );
  if (id === 'l2-practice-02') return <ScoutParsingPractice />;
  if (id === 'l2-practice-01') return <ScoutWritingPractice />;
  if (id === 'l2-practice-03') return <MovieWritingPractice />;
  return null;
}
