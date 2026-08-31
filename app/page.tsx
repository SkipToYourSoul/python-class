import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Sparkles } from 'lucide-react';

const course = {
  title: 'AI with Python',
  subtitle: '用 Python 亲手理解并实践 AI',
  lesson: '第一课 · 走进 AI 世界',
  href: '/courses/ai-with-python',
  cover: '/courses/ai-with-python/lesson-01/assets/image5.png',
};

export default function Home() {
  return (
    <main className="home-shell">
      <nav className="site-nav" aria-label="主导航">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            <Code2 size={19} strokeWidth={2.4} />
          </span>
          <span>我的课程</span>
        </Link>
        <span className="nav-note">Program with Python</span>
      </nav>

      <section className="home-hero">
        <div className="home-copy">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            从代码出发，探索智能世界
          </div>
          <h1>
            一门课，带你真正
            <span>走进 AI</span>
          </h1>
          <p>
            从机器如何学习，到亲手训练一个决策树模型。课程保留课堂里的故事、讨论和编程实操，让每一步都看得懂、做得出。
          </p>
          <div className="hero-meta" aria-label="课程特点">
            <span><BookOpen size={17} /> 3 个学习章节</span>
            <span><Code2 size={17} /> 边学边练</span>
          </div>
        </div>

        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="planet planet-yellow" />
          <div className="planet planet-blue" />
          <img src={course.cover} alt="" />
        </div>
      </section>

      <section className="course-section" aria-labelledby="course-title">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / COURSES</span>
            <h2 id="course-title">选择一门课程</h2>
          </div>
          <p>首门课程已经就绪，新的课程会继续出现在这里。</p>
        </div>

        <Link className="course-card" href={course.href}>
          <div className="course-art">
            <span className="course-status">正在学习</span>
            <img src={course.cover} alt="机器人与学习者一起探索 AI" />
          </div>
          <div className="course-content">
            <span className="course-kicker">PROGRAM WITH PYTHON</span>
            <h3>{course.title}</h3>
            <p>{course.subtitle}</p>
            <div className="course-divider" />
            <div className="course-footer">
              <div>
                <span>当前课程</span>
                <strong>{course.lesson}</strong>
              </div>
              <span className="course-arrow" aria-hidden="true"><ArrowRight /></span>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}
