'use client';
import { useCallback, useEffect, useState } from 'react';
import { LessonSpine } from '@/components/course/lesson-spine';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { chapters, scenes, oldAssets, assetBase } from './lesson-data';
import { LessonState, type PageStates } from './lesson-state';
import { LessonScenes } from './lesson-scenes';
import s from './lesson.module.css';

const storageKey = 'ai-python-lesson-02-v1';
// Keep bookmarks for merged or removed scenes usable.
const sceneAliases: Record<string, string> = {
  'l2-route': 'l2-mission',
  'l2-ai': 'l2-practice-03',
  'l2-detail': 'l2-practice-03',
  'l2-checkpoint': 'l2-summary',
};
const resolveSceneId = (id?: string) => (id ? (sceneAliases[id] ?? id) : id);
export default function LessonTwo({ initialScene }: { initialScene?: string }) {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<PageStates>({});
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const [outline, setOutline] = useState(false);
  const [menuChapter, setMenuChapter] = useState('start');
  const [notice, setNotice] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const scene = scenes[index];
  const chapter = chapters.find((c) => c.id === scene.chapter)!;
  const navigate = useCallback((id: string) => {
    id = resolveSceneId(id)!;
    const next = scenes.findIndex((item) => item.id === id);
    if (next < 0) return;
    setIndex(next);
    setOutline(false);
    setNotice('');
    history.replaceState(null, '', `#${id}`);
  }, []);
  useEffect(() => {
    const startup = window.setTimeout(() => {
      let saved: { scene?: string; states?: PageStates } = {};
      try {
        saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      } catch {
        /* Optional local progress. */
      }
      if (saved?.states && typeof saved.states === 'object')
        setStates(saved.states);
      const target = resolveSceneId(
        location.hash.slice(1) || initialScene || saved?.scene,
      );
      if (target && location.hash && location.hash !== `#${target}`)
        history.replaceState(null, '', `#${target}`);
      const next = scenes.findIndex((item) => item.id === target);
      setIndex(Math.max(0, next));
      setReady(true);
    }, 0);
    const hash = () => {
      const target = resolveSceneId(location.hash.slice(1));
      const i = scenes.findIndex((item) => item.id === target);
      if (i >= 0) {
        if (location.hash !== `#${target}`)
          history.replaceState(null, '', `#${target}`);
        setIndex(i);
        setOutline(false);
      }
    };
    const fs = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('hashchange', hash);
    document.addEventListener('fullscreenchange', fs);
    return () => {
      window.clearTimeout(startup);
      window.removeEventListener('hashchange', hash);
      document.removeEventListener('fullscreenchange', fs);
    };
  }, [initialScene]);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ scene: scene.id, states }),
        );
      } catch {
        /* Work without storage. */
      }
  }, [ready, scene.id, states]);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setNotice('请使用浏览器菜单进入全屏。');
    }
  }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        outline ||
        document.querySelector('[role="dialog"]') ||
        (event.target as HTMLElement).closest(
          'input,textarea,select,button,a,[contenteditable="true"]',
        )
      )
        return;
      const jump = (i: number) =>
        navigate(scenes[Math.max(0, Math.min(scenes.length - 1, i))].id);
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        jump(index + 1);
      }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        jump(index - 1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        jump(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        jump(scenes.length - 1);
      }
      if (event.key.toLowerCase() === 'm') {
        setMenuChapter(scene.chapter);
        setOutline(true);
      }
      if (event.key.toLowerCase() === 'f') void toggleFullscreen();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index, navigate, outline, scene.chapter]);
  const group = scenes.filter((item) => item.chapter === scene.chapter);
  return (
    <main
      className={`lesson-player ${s.player}`}
      data-mode="presentation"
      data-ready={ready}
      data-course-series="ai-with-python"
      data-lesson="02"
    >
      <div className="lesson-player-frame">
        <LessonSpine
          activeChapterId={scene.chapter}
          activeLabel={chapter.title}
          chapterProgress={
            group.findIndex((item) => item.id === scene.id) /
            Math.max(1, group.length - 1)
          }
          chapters={chapters
            .filter((c) => !['start', 'finish'].includes(c.id))
            .map((c) => ({ id: c.id, label: c.title }))}
          courseHref="/courses/ai-with-python"
          courseTitle="AI with Python"
          currentSlide={index + 1}
          totalSlides={scenes.length}
          mascotSrc={`${oldAssets}/xiaopai-guide.png`}
          nextDisabled={index === scenes.length - 1}
          previousDisabled={index === 0}
          nextLabel="下一页"
          previousLabel="上一页"
          onNext={() => navigate(scenes[index + 1]?.id)}
          onPrevious={() => navigate(scenes[index - 1]?.id)}
          onChapterSelect={(id) =>
            navigate(scenes.find((item) => item.chapter === id)!.id)
          }
          onOpenOutline={() => {
            setMenuChapter(scene.chapter);
            setOutline(true);
          }}
          outlineOpen={outline}
        />
        <article className="lesson-player-stage" aria-label="第二课课件内容">
          {ready && (
            <section
              id={scene.id}
              className={`lesson-scene is-active ${scene.id.endsWith('-cover') && scene.id !== 'l2-cover' ? 'scene-chapter-cover' : ''}`}
              aria-label={`${index + 1} / ${scenes.length} · ${scene.title}`}
            >
              <div className={`lesson-scene-canvas ${s.canvas}`}>
                <LessonState.Provider
                  value={{
                    value: states[scene.id] || {},
                    update: (value) =>
                      setStates((prev) => ({
                        ...prev,
                        [scene.id]: { ...prev[scene.id], ...value },
                      })),
                    navigate,
                  }}
                >
                  <LessonScenes key={`${scene.id}:${revision}`} id={scene.id} />
                </LessonState.Provider>
              </div>
            </section>
          )}
        </article>
      </div>
      <span className="sr-only" aria-live="polite">
        第 {index + 1} 页，共 {scenes.length} 页。{scene.title}。{notice}
      </span>
      <Dialog open={outline} onOpenChange={setOutline}>
        <DialogContent className={s.modal}>
          <DialogHeader>
            <DialogTitle>第二课 · 教学目录与更多</DialogTitle>
            <DialogDescription>
              第 {index + 1} / {scenes.length} 页 · 翻页与刷新保留本轮练习
            </DialogDescription>
          </DialogHeader>
          <div className={s.toolbar}>
            <button onClick={() => void toggleFullscreen()}>
              {fullscreen ? '退出全屏' : '进入全屏'}
            </button>
            <button
              onClick={() => {
                setStates((prev) => ({ ...prev, [scene.id]: {} }));
                setRevision((value) => value + 1);
                setOutline(false);
                setNotice('本页互动已重置');
              }}
            >
              重置本页互动
            </button>
            <button
              onClick={() => {
                setStates({});
                setRevision((value) => value + 1);
                navigate('l2-cover');
              }}
            >
              重新开始本课
            </button>
            <a href={`${assetBase}/practice/lesson-02-practice.zip`} download>
              下载 Python 练习包
            </a>
          </div>
          <div className={s.menuChapters}>
            {chapters.map((c) => (
              <button
                key={c.id}
                aria-pressed={menuChapter === c.id}
                onClick={() => setMenuChapter(c.id)}
              >
                {c.number} {c.title}
              </button>
            ))}
          </div>
          <div className={s.menuPages}>
            {scenes
              .filter((item) => item.chapter === menuChapter)
              .map((item) => (
                <button
                  key={item.id}
                  aria-current={scene.id === item.id ? 'page' : undefined}
                  onClick={() => navigate(item.id)}
                >
                  <span>
                    {String(scenes.indexOf(item) + 1).padStart(2, '0')}
                  </span>
                  {item.title}
                </button>
              ))}
          </div>
          {notice && <output>{notice}</output>}
        </DialogContent>
      </Dialog>
    </main>
  );
}
