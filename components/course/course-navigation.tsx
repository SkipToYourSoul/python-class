import Link from 'next/link';
import { ArrowLeft, BookOpen, Landmark } from 'lucide-react';

export function CourseNavigation({ course }: { course?: string }) {
  return (
    <nav className="course-navigation" aria-label="课程导航">
      <Link className="course-brand" href="/" aria-label="我的课程首页">
        <Landmark aria-hidden="true" />
        <span>我的课程</span>
      </Link>
      <div className="course-navigation-actions">
        {course && (
          <Link className="course-back" href="/">
            <ArrowLeft aria-hidden="true" />
            <span>全部课程</span>
          </Link>
        )}
        <span className="course-series-name">
          <BookOpen aria-hidden="true" />
          <span>{course ?? 'Python 系列课'}</span>
        </span>
      </div>
    </nav>
  );
}
