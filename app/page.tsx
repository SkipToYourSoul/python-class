import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { CourseNavigation } from '@/components/course/course-navigation';
import { CourseMapDetail } from '@/components/course/course-map-detail';
import { CourseRouteRunner } from '@/components/course/course-route-runner';

const stages = [
  {
    number: '01',
    label: '基础',
    lines: ['Program', 'with Python'],
    position: 'stage-one',
  },
  {
    number: '02',
    label: '进阶',
    lines: ['Programming', '& Testing'],
    position: 'stage-two',
  },
  {
    number: '03',
    label: '实践',
    lines: ['AI with', 'Python'],
    position: 'stage-three',
  },
];

function StageFrame() {
  return (
    <svg
      className="celestial-medallion-frame"
      viewBox="0 0 200 200"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="88" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="celestial-viewport">
      <main
        className="course-surface celestial-home"
        data-course-series="python"
      >
        <CourseNavigation />
        <div className="celestial-compact-entry">
          <p>请使用宽屏窗口查看完整课程路线</p>
          <Link href="/courses/ai-with-python">
            进入 AI with Python <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <section className="celestial-map" aria-label="Python 系列课程路线">
          <span className="celestial-background-two" aria-hidden="true">
            02
          </span>
          <CourseRouteRunner />
          <h1 className="sr-only">Python 系列学习路线</h1>
          <figure className="celestial-artwork">
            <span className="celestial-frame-gem is-top" aria-hidden="true" />
            <span
              className="celestial-frame-gem is-bottom"
              aria-hidden="true"
            />
            <span className="celestial-frame-corner is-tl" aria-hidden="true" />
            <span className="celestial-frame-corner is-tr" aria-hidden="true" />
            <span className="celestial-frame-corner is-bl" aria-hidden="true" />
            <span className="celestial-frame-corner is-br" aria-hidden="true" />
            <CourseMapDetail />
          </figure>

          <ol className="celestial-stages">
            {stages.map((stage, index) => {
              const medallion = (
                <div className="celestial-medallion">
                  <StageFrame />
                  <span className="celestial-stage-gem" aria-hidden="true" />
                  <strong>{stage.number}</strong>
                  <span className="celestial-stage-label">
                    · {stage.label} ·
                  </span>
                  <h2>
                    {stage.lines[0]}
                    {index === 1 ? <br /> : ' '}
                    {stage.lines[1]}
                  </h2>
                  {index === 2 ? (
                    <small className="celestial-current-label">当前阶段</small>
                  ) : (
                    <span
                      className="celestial-complete-seal"
                      aria-hidden="true"
                    >
                      <Check />
                    </span>
                  )}
                </div>
              );
              return (
                <li
                  className={`celestial-stage ${stage.position}`}
                  key={stage.number}
                >
                  {index === 2 ? (
                    <Link
                      className="celestial-stage-link"
                      href="/courses/ai-with-python"
                      aria-label="进入实践阶段 AI with Python"
                    >
                      {medallion}
                      <span className="celestial-enter">
                        进入课程
                        <ArrowRight aria-hidden="true" />
                      </span>
                    </Link>
                  ) : (
                    <article aria-label={`${stage.label}阶段`}>
                      {medallion}
                      <span className="celestial-complete-label">已学完</span>
                    </article>
                  )}
                </li>
              );
            })}
          </ol>
          <svg
            className="celestial-compass"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="32" />
            <path className="compass-axis" d="M50 0 V100 M0 50 H100" />
            <path
              className="compass-point"
              d="M50 9 L56 42 L76 24 L58 44 L91 50 L58 56 L76 76 L56 58 L50 91 L44 58 L24 76 L42 56 L9 50 L42 44 L24 24 L44 42 Z"
            />
            <path
              className="compass-facet"
              d="M50 9 V50 L56 42 Z M91 50 H50 L58 56 Z M50 91 V50 L44 58 Z M9 50 H50 L42 44 Z"
            />
          </svg>
        </section>
      </main>
    </div>
  );
}
