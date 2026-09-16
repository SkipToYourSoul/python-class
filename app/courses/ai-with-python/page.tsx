import Link from 'next/link';
import { ArrowRight, Clock3, Database, Flag, Network } from 'lucide-react';
import { CourseNavigation } from '@/components/course/course-navigation';
import { courseLessons, courseStages } from '@/lib/course-data';

export const metadata = {
  title: 'AI with Python · 我的课程',
  description:
    '从数据到模型：两大学习阶段，加上导入课和结课挑战，完成 12 节 AI with Python 课程。',
};

type Lesson = (typeof courseLessons)[number];

function LessonTitle({
  title,
  bookend = false,
}: {
  title: string;
  bookend?: boolean;
}) {
  const Heading = bookend ? 'h3' : 'h4';
  const [story, topic] = title.split('——');
  if (!topic && title.includes('：')) {
    const [exercise, work] = title.split('：');
    return (
      <Heading>
        <span className="catalog-lesson-topic">{exercise}</span>
        <span>{work}</span>
      </Heading>
    );
  }
  return (
    <Heading>
      <span>{story}</span>
      {topic && <span className="catalog-lesson-topic">{topic}</span>}
    </Heading>
  );
}

function LessonCard({
  lesson,
  bookend,
}: {
  lesson: Lesson;
  bookend?: 'intro' | 'challenge';
}) {
  const available = lesson.available && !!lesson.href;
  const className = `catalog-lesson ${available ? 'is-ready' : 'is-upcoming'}${bookend ? ' is-bookend' : ''}${lesson.isStageProject ? ' is-project' : ''}`;
  const content = (
    <>
      <span
        className="catalog-lesson-number"
        aria-label={`第 ${Number(lesson.number)} 课`}
      >
        {lesson.number}
      </span>
      <div className="catalog-lesson-copy">
        {bookend && (
          <span className="catalog-bookend-label">
            {bookend === 'intro' ? '课程导入' : '综合挑战'}
          </span>
        )}
        <LessonTitle title={lesson.title} bookend={!!bookend} />
        <p>{lesson.summary}</p>
      </div>
      <div className="catalog-lesson-footer">
        <span className="catalog-lesson-status">
          {available ? (
            <>
              进入学习
              <ArrowRight aria-hidden="true" />
            </>
          ) : (
            <>
              <Clock3 aria-hidden="true" />
              准备中
            </>
          )}
        </span>
        {lesson.isStageProject && (
          <span className="catalog-project-label">
            <Flag aria-hidden="true" />
            阶段作品
          </span>
        )}
      </div>
    </>
  );
  return available && lesson.href ? (
    <Link className={className} href={lesson.href}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}

export default function CoursePage() {
  const intro = courseLessons.find((lesson) => lesson.stage === 'intro')!;
  const challenge = courseLessons.find(
    (lesson) => lesson.stage === 'challenge',
  )!;

  return (
    <main
      className="course-surface course-catalog"
      data-course-series="ai-with-python"
    >
      <CourseNavigation course="AI with Python" />
      <section className="catalog-intro">
        <div>
          <span className="course-eyebrow">AI WITH PYTHON · 12 LESSONS</span>
          <h1>AI with Python</h1>
          <p>从数据到模型，在两个学习阶段中积累本领，完成自己的 AI 作品。</p>
        </div>
      </section>

      <section
        className="catalog-lessons"
        id="curriculum"
        aria-labelledby="lessons-title"
      >
        <header className="catalog-section-heading">
          <h2 id="lessons-title">12 节课程</h2>
          <span className="course-eyebrow">COURSE LIST</span>
        </header>
        <section
          className="catalog-bookend is-intro"
          id="catalog-intro-lesson"
          tabIndex={-1}
          aria-label="第 01 课，课程导入"
        >
          <LessonCard lesson={intro} bookend="intro" />
        </section>

        <div className="catalog-stage-columns">
          {courseStages.map((stage) => {
            const Icon = stage.id === 'data' ? Database : Network;
            return (
              <section
                className="catalog-stage-column"
                key={stage.id}
                data-stage={stage.id}
                aria-labelledby={`catalog-stage-${stage.number}-title`}
              >
                <header id={`catalog-stage-${stage.number}`} tabIndex={-1}>
                  <div className="catalog-stage-eyebrow">
                    <span>
                      {stage.label} · {stage.english}
                    </span>
                    <span>{stage.lessons}</span>
                  </div>
                  <div className="catalog-stage-title">
                    <h3 id={`catalog-stage-${stage.number}-title`}>
                      {stage.title}
                    </h3>
                    <Icon aria-hidden="true" />
                  </div>
                  <p>{stage.goal}</p>
                </header>
                <ol start={stage.start}>
                  {courseLessons
                    .filter((lesson) => lesson.stage === stage.id)
                    .map((lesson) => (
                      <li key={lesson.number}>
                        <LessonCard lesson={lesson} />
                      </li>
                    ))}
                </ol>
              </section>
            );
          })}
        </div>

        <section
          className="catalog-bookend is-challenge"
          id="catalog-challenge"
          tabIndex={-1}
          aria-label="第 12 课，结课挑战"
        >
          <LessonCard lesson={challenge} bookend="challenge" />
        </section>
      </section>
    </main>
  );
}
