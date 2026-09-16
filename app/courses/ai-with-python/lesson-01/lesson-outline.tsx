'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { chapterGroups, scenes } from './lesson-data';
import s from './lesson-outline.module.css';

const numberedScenes = scenes.map((scene, index) => ({ ...scene, index }));
const sections = chapterGroups
  .filter((chapter) => chapter.id.startsWith('chapter-'))
  .map((chapter) => ({
    ...chapter,
    pages: numberedScenes.filter((scene) => scene.chapterId === chapter.id),
  }));
const bookends = numberedScenes.filter(
  (scene) => scene.chapterId === 'start' || scene.chapterId === 'finish',
);
const pageNumber = (index: number) => String(index + 1).padStart(2, '0');

export function LessonOutline({
  currentIndex,
  onNavigate,
}: {
  currentIndex: number;
  onNavigate: (index: number) => void;
}) {
  const currentChapter = scenes[currentIndex].chapterId;
  const initialSection = currentChapter.startsWith('chapter-')
    ? currentChapter
    : sections[0].id;

  return (
    <nav className={s.outline} aria-label="按小节查看教学目录">
      <div className={s.bookends}>
        {bookends.map((page) => (
          <button
            className={s.page}
            key={page.id}
            type="button"
            aria-current={page.index === currentIndex ? 'page' : undefined}
            onClick={() => onNavigate(page.index)}
          >
            <span className={s.bookendLabel}>
              {page.chapterId === 'start' ? '开场' : '总结'}
            </span>
            <b>{pageNumber(page.index)}</b>
            <span>{page.title}</span>
          </button>
        ))}
      </div>
      <Tabs className={s.sections} defaultValue={initialSection}>
        <TabsList className={s.sectionList} aria-label="本课三个小节">
          {sections.map((section) => (
            <TabsTrigger
              className={s.section}
              value={section.id}
              key={section.id}
            >
              <span className={s.sectionMeta}>
                <span>
                  {currentChapter === section.id ? '当前 · ' : ''}
                  小节 {section.number}
                </span>
                <span>
                  第 {pageNumber(section.pages[0].index)}–
                  {pageNumber(section.pages.at(-1)!.index)} 页
                </span>
              </span>
              <strong>{section.title}</strong>
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((section) => (
          <TabsContent
            className={s.sectionPages}
            value={section.id}
            key={section.id}
          >
            <ol className={s.pageList}>
              {section.pages.map((page) => (
                <li key={page.id}>
                  <button
                    className={s.page}
                    type="button"
                    aria-current={
                      page.index === currentIndex ? 'page' : undefined
                    }
                    onClick={() => onNavigate(page.index)}
                  >
                    <b>{pageNumber(page.index)}</b>
                    <span>{page.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </TabsContent>
        ))}
      </Tabs>
    </nav>
  );
}
