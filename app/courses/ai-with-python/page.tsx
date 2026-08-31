import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Check,
  Clock3,
  Code2,
  Database,
  Layers3,
  Play,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { assetBase, courseLessons, courseStages } from '@/lib/course-data';

export const metadata = {
  title: 'AI with Python · 我的课程',
  description: '从 Python 编程与数据处理出发，逐步掌握机器学习与人工智能实践。',
};

const outcomes = [
  {
    icon: Database,
    title: '获取与管理数据',
    copy: '用 Python 获取、读写、筛选与整理真实数据。',
  },
  {
    icon: BarChart3,
    title: '分析与表达结论',
    copy: '从数据中找到线索，选择合适的图表呈现发现。',
  },
  {
    icon: BrainCircuit,
    title: '训练与理解模型',
    copy: '动手实践分类、回归、聚类和基础神经网络。',
  },
  {
    icon: Trophy,
    title: '完成端到端项目',
    copy: '把数据、分析和模型串联起来，完成综合作品与挑战。',
  },
];

export default function CoursePage() {
  return (
    <main className="course-page">
      <nav className="site-nav course-nav" aria-label="课程导航">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <Code2 size={19} />
          </span>
          <span>我的课程</span>
        </Link>
        <Link className="back-link" href="/">
          <ArrowLeft size={16} /> 返回全部课程
        </Link>
      </nav>

      <section className="course-hero">
        <div className="course-hero-copy">
          <span className="course-label">PROGRAM WITH PYTHON · 12 LESSONS</span>
          <h1>AI with Python</h1>
          <p>
            从 Python 编程与数据处理出发，逐步学习数据采集、可视化、分类、预测、聚类与神经网络，在项目中完成从数据到 AI 模型的全过程。
          </p>

          <div className="course-stat-row" aria-label="课程信息">
            <span><BookOpen size={17} /> 12 节课</span>
            <span><Layers3 size={17} /> 4 个学习阶段</span>
            <span><Sparkles size={17} /> 项目驱动</span>
          </div>

          <div className="course-hero-actions">
            <Link className="primary-cta" href="/courses/ai-with-python/lesson-01">
              <Play size={18} fill="currentColor" /> 开始第 1 课
            </Link>
            <a className="secondary-cta" href="#curriculum">
              查看完整课程 <ArrowDown size={17} />
            </a>
          </div>

          <div className="course-release">
            <span className="course-release-bar" aria-hidden="true"><i /></span>
            <span>当前已上线 <strong>1 / 12</strong></span>
          </div>
        </div>

        <div className="course-hero-art" aria-hidden="true">
          <div className="course-hero-number">AI</div>
          <span className="course-orbit-tag tag-python">Python</span>
          <span className="course-orbit-tag tag-data">Data</span>
          <span className="course-orbit-tag tag-model">Model</span>
          <Image src={`${assetBase}/image40.png`} alt="" width={620} height={620} priority />
        </div>
      </section>

      <section className="course-roadmap" aria-labelledby="roadmap-title">
        <div className="section-heading">
          <div>
            <span className="section-index">LEARNING ROADMAP</span>
            <h2 id="roadmap-title">从 Python 到 AI 的四步路线</h2>
          </div>
          <p>先建立编程与数据基础，再深入模型，最后用综合项目把能力串起来。</p>
        </div>

        <div className="stage-grid">
          {courseStages.map((stage) => (
            <article className="stage-card" key={stage.number}>
              <div className="stage-card-top">
                <span className="stage-number">{stage.number}</span>
                <span className="stage-range">{stage.lessons}</span>
              </div>
              <h3>{stage.title}</h3>
              <p>{stage.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="course-curriculum" id="curriculum" aria-labelledby="curriculum-title">
        <div className="curriculum-heading">
          <div>
            <span className="section-index">FULL CURRICULUM</span>
            <h2 id="curriculum-title">12 节完整课程</h2>
          </div>
          <div className="curriculum-legend" aria-label="课程状态说明">
            <span className="legend-ready"><i /> 已上线</span>
            <span><i /> 内容准备中</span>
          </div>
        </div>

        <div className="curriculum-groups">
          {courseStages.map((stage) => (
            <section className="curriculum-group" key={stage.number} aria-labelledby={`stage-${stage.number}`}>
              <div className="curriculum-stage-label">
                <span>STAGE {stage.number}</span>
                <h3 id={`stage-${stage.number}`}>{stage.title}</h3>
                <p>{stage.lessons}</p>
              </div>

              <div className="curriculum-lessons">
                {courseLessons
                  .filter((lesson) => lesson.stage === stage.number)
                  .map((lesson) => {
                    const content = (
                      <>
                        <span className="curriculum-order">{lesson.number}</span>
                        <div className="curriculum-copy">
                          <span className="curriculum-kicker">第 {Number(lesson.number)} 课</span>
                          <h4>{lesson.title}</h4>
                          <p>{lesson.summary}</p>
                          <div className="curriculum-tags" aria-label="知识点">
                            {lesson.tags.map((tag) => <span key={tag}>{tag}</span>)}
                          </div>
                        </div>
                        <div className="curriculum-status">
                          {lesson.available ? (
                            <>
                              <span className="status-ready"><Check size={14} /> 已上线</span>
                              <span className="curriculum-arrow" aria-hidden="true"><ArrowRight size={20} /></span>
                            </>
                          ) : (
                            <span><Clock3 size={14} /> 内容准备中</span>
                          )}
                        </div>
                      </>
                    );

                    return lesson.available && lesson.href ? (
                      <Link className="curriculum-lesson is-ready" href={lesson.href} key={lesson.number}>
                        {content}
                      </Link>
                    ) : (
                      <article className="curriculum-lesson is-upcoming" key={lesson.number}>
                        {content}
                      </article>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="course-outcomes" aria-labelledby="outcomes-title">
        <div className="outcomes-intro">
          <span className="section-index">AFTER THE COURSE</span>
          <h2 id="outcomes-title">学完这门课，<br />你将能够——</h2>
          <Link className="outcomes-cta" href="/courses/ai-with-python/lesson-01">
            从第 1 课开始 <ArrowRight size={18} />
          </Link>
        </div>

        <div className="outcomes-grid">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <article key={outcome.title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{outcome.title}</h3>
                <p>{outcome.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
