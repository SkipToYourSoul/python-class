/* oxlint-disable next/no-img-element -- A single art-directed illustration preserves the approved island composition. */
import Link from '../../components/static-link';
import { ArrowRight, Check } from 'lucide-react';
import { CourseNavigation } from '@/components/course/course-navigation';
import { CourseMapDetail } from '@/components/course/course-map-detail';
import s from './page.module.css';

export const metadata = {
  title: 'Python 学习旅程 · 我的课程',
  description:
    '从基础、进阶到实践，探索 Python 学习路径，进入 AI with Python 课程。',
};

const stages = [
  {
    number: '01',
    name: '基础',
    english: 'Program with Python',
    description: '看懂 Python 代码',
  },
  {
    number: '02',
    name: '进阶',
    english: 'Programming & Testing',
    description: '掌握编程思维',
  },
  {
    number: '03',
    name: '实践',
    english: 'AI with Python',
    description: '探索编程的可能，学会与 AI 协作',
    href: '/courses/ai-with-python',
  },
];

function Compass() {
  return (
    <svg className={s.compass} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="31" />
      <circle cx="50" cy="50" r="26" />
      <path d="M50 12V88M12 50H88M25 25L75 75M75 25L25 75" />
      <path
        className={s.compassRose}
        d="M50 17L56 43L75 25L57 44L83 50L57 56L75 75L56 57L50 83L44 57L25 75L43 56L17 50L43 44L25 25L44 43Z"
      />
      <path
        className={s.compassFacet}
        d="M50 17V50L56 43ZM83 50H50L57 56ZM50 83V50L44 57ZM17 50H50L43 44Z"
      />
      <text x="50" y="9">
        N
      </text>
      <text x="94" y="53">
        E
      </text>
      <text x="50" y="98">
        S
      </text>
      <text x="6" y="53">
        W
      </text>
    </svg>
  );
}

export default function PythonHome() {
  return (
    <div className={s.viewport}>
      <main className={s.home} data-course-series="python">
        <img
          className={s.landscape}
          src="/courses/python-home/exploration-islands.webp"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
          aria-hidden="true"
        />
        <CourseNavigation appearance="paper" homeHref="/python" />
        <header className={s.heading}>
          <p className={s.eyebrow}>PYTHON LEARNING JOURNEY</p>
          <h1>每一步，都通向新的可能。</h1>
          <p className={s.subtitle}>
            基础 <span>→</span> 进阶 <span>→</span> 实践
          </p>
        </header>
        <div className={s.mapAction}>
          <CourseMapDetail />
        </div>
        <aside className={s.marginNote} aria-hidden="true">
          用代码
          <br />
          认识世界
          <br />
          也创造新的世界
          <br />
          <span>/</span>
          <span>
            A<br />
            BETTER
            <br />
            YOU
            <br />
            WITH
            <br />
            PYTHON
          </span>
        </aside>
        <ol className={s.stages} aria-label="Python 系列的三个学习阶段">
          {stages.map((stage) => (
            <li className={s.stage} key={stage.number}>
              <article>
                <h2>
                  <span>{stage.number}</span>
                  {stage.name}
                </h2>
                <p className={s.english}>{stage.english}</p>
                <p className={s.description}>{stage.description}</p>
                {stage.href ? (
                  <div className={s.stageActions}>
                    <Link
                      className={s.enter}
                      href={stage.href}
                      aria-label="进入实践阶段 AI with Python 课程"
                    >
                      进入课程 <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <p className={s.complete}>
                    <span>
                      <Check aria-hidden="true" />
                    </span>
                    已学完
                  </p>
                )}
              </article>
            </li>
          ))}
        </ol>
        <footer className={s.footer} aria-hidden="true">
          <p className={s.footerNote}>
            CURIOSITY
            <br />
            BUILDS
            <br />A BRIGHTER
            <br />
            TOMORROW
            <br />
            <span>/</span>
          </p>
          <div className={s.routeIndex}>
            {stages.map((stage) => (
              <span key={stage.number}>
                {stage.number}
                <i />
              </span>
            ))}
          </div>
          <div className={s.signature}>
            <Compass />
            <p>
              更好的自己
              <br />从 Python 开始
              <br />
              <span>/</span>
            </p>
          </div>
        </footer>
        <section className={s.compact} aria-label="小窗口课程入口">
          <p className={s.eyebrow}>PYTHON LEARNING JOURNEY</p>
          <h1>
            每一步，
            <br />
            都通向新的可能。
          </h1>
          <p>请使用宽屏窗口查看完整探索群岛</p>
          <Link className={s.enter} href="/courses/ai-with-python">
            进入 AI with Python <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
    </div>
  );
}
