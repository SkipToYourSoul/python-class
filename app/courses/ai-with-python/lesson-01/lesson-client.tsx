'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize, Minimize, RotateCcw, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LessonSpine } from '@/components/course/lesson-spine';
import { scenes, chapterGroups, legacyHashes } from './lesson-data';
import { OriginalScene } from './lesson-original-scenes';
import { LessonOutline } from './lesson-outline';
import { ConceptScene } from './concept-scenes';
import { ToolScene } from './tool-scenes';
import { ModelScene } from './model-scenes';
import { asset, pageStoragePrefix } from './lesson-ui';
import s from './lesson-review.module.css';

const playerKey = 'ai-python-lesson-01-player-v2';
const oldPlayerKey = 'ai-python-lesson-01-player-v1';
const completeKey = 'ai-python-lesson-01-complete';
const sceneKeys: Record<string, string> = {
  'chapter-1-practice': 'student-worlds',
  'chapter-1-turing': 'turing',
  'chapter-1-milestones': 'milestones',
  'chapter-1-future': 'future',
  'chapter-1-agi': 'agi',
  'chapter-1-samuel': 'samuel',
  'chapter-1-learning-analogy': 'analogy',
  'chapter-1-train-predict': 'train-predict',
  'chapter-2-anaconda': 'anaconda',
  'chapter-2-jupyter-interface': 'interface',
  'chapter-2-notebook-create': 'create',
  'chapter-2-notebook-code': 'notebook-code',
  'chapter-2-notebook-run': 'notebook-run',
  'chapter-2-notebook-save': 'notebook-save',
  'chapter-2-practice': 'notebook-practice',
  'chapter-3-castle-problem': 'castle-problem',
  'chapter-3-discussion': 'data-discussion',
  'chapter-3-role-samples': 'tree-concept',
  'chapter-3-tree-concept': 'training-data',
  'chapter-3-training-data': 'fit',
  'chapter-3-tree-result': 'predict',
  'chapter-3-prediction': 'accuracy',
};
function indexFor(raw: string) {
  const id = raw.replace(/^#/, '');
  return scenes.findIndex((x) => x.id === (legacyHashes[id] ?? id));
}

export default function LessonClient() {
  const [index, setIndex] = useState(0),
    [ready, setReady] = useState(false),
    [outline, setOutline] = useState(false);
  const [fullscreen, setFullscreen] = useState(false),
    [notice, setNotice] = useState(''),
    [complete, setComplete] = useState(false);
  const [revision, setRevision] = useState(0);
  const root = useRef<HTMLElement>(null);
  const scene = scenes[index],
    chapter = chapterGroups.find((x) => x.id === scene.chapterId)!;
  const chapterScenes = scenes.filter((x) => x.chapterId === scene.chapterId);
  const progress =
    chapterScenes.length < 2
      ? 1
      : chapterScenes.findIndex((x) => x.id === scene.id) /
        (chapterScenes.length - 1);
  const navigate = useCallback((next: number) => {
    const target = Math.max(0, Math.min(scenes.length - 1, next));
    setIndex(target);
    setOutline(false);
    setNotice('');
    history.replaceState(null, '', `#${scenes[target].id}`);
  }, []);
  useEffect(() => {
    const startup = window.setTimeout(() => {
      let target = indexFor(location.hash);
      try {
        const saved = JSON.parse(
          localStorage.getItem(playerKey) ||
            localStorage.getItem(oldPlayerKey) ||
            'null',
        );
        if (target < 0 && saved)
          target = indexFor(saved.sceneId ?? saved.currentSceneId ?? '');
        // Migrate position only. Old display preferences and obsolete interaction data are retired.
        localStorage.removeItem(oldPlayerKey);
        setComplete(localStorage.getItem(completeKey) === 'true');
      } catch {
        /* Start at the cover if optional storage is unavailable. */
      }
      setIndex(target >= 0 ? target : 0);
      setReady(true);
    }, 0);
    const hash = () => {
      const next = indexFor(location.hash);
      if (next >= 0) {
        setIndex(next);
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
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(playerKey, JSON.stringify({ sceneId: scene.id }));
    } catch {
      /* Navigation still works without storage. */
    }
  }, [ready, scene.id]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        outline ||
        document.querySelector('[role="dialog"]') ||
        target.closest(
          'input,textarea,select,button,a,[contenteditable="true"]',
        )
      )
        return;
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        navigate(index + 1);
      }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        navigate(index - 1);
      }
      if (event.key === 'Home') {
        event.preventDefault();
        navigate(0);
      }
      if (event.key === 'End') {
        event.preventDefault();
        navigate(scenes.length - 1);
      }
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setOutline(true);
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        if (document.fullscreenElement) void document.exitFullscreen();
        else
          void document.documentElement
            .requestFullscreen()
            .catch(() => setNotice('浏览器未能进入全屏'));
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [index, navigate, outline]);
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setNotice('');
    } catch {
      setNotice('浏览器未能进入全屏，可使用浏览器的全屏菜单。');
    }
  }
  function resetPage() {
    try {
      const key = sceneKeys[scene.id];
      if (key) localStorage.removeItem(pageStoragePrefix + key);
    } catch {
      /* Remount is still available. */
    }
    setRevision((v) => v + 1);
    setOutline(false);
    setNotice('本页已重置');
  }
  function restartLesson() {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(pageStoragePrefix))
        .forEach((key) => localStorage.removeItem(key));
      localStorage.removeItem('ai-python-guardian-feature');
      localStorage.setItem(completeKey, 'false');
    } catch {
      /* Reset visible state even without storage. */
    }
    setComplete(false);
    setRevision((r) => r + 1);
    navigate(0);
  }
  function markComplete() {
    try {
      localStorage.setItem(completeKey, 'true');
    } catch {
      /* Completion is optional. */
    }
    setComplete(true);
    setNotice('本课已标记完成');
  }
  const original =
    scene.id === 'start-cover' ||
    scene.id === 'start-roadmap' ||
    scene.id.endsWith('-cover');
  return (
    <main
      ref={root}
      className={`lesson-player ${s.player}`}
      data-mode="presentation"
      data-ready={ready ? 'true' : 'false'}
    >
      <div className="lesson-player-frame">
        <LessonSpine
          activeChapterId={scene.chapterId}
          activeLabel={
            scene.chapterId === 'start'
              ? '课程开始'
              : scene.chapterId === 'finish'
                ? '本课总结'
                : `任务 ${chapter.number}`
          }
          chapterProgress={progress}
          chapters={chapterGroups
            .filter((x) => x.id.startsWith('chapter-'))
            .map((x) => ({ id: x.id, label: x.title }))}
          courseHref="/courses/ai-with-python/"
          courseTitle="AI with Python"
          currentSlide={index + 1}
          totalSlides={scenes.length}
          mascotSrc={asset('xiaopai-guide.png')}
          nextDisabled={index === scenes.length - 1}
          previousDisabled={index === 0}
          nextLabel="下一页"
          previousLabel="上一页"
          onNext={() => navigate(index + 1)}
          onPrevious={() => navigate(index - 1)}
          onChapterSelect={(id) => navigate(indexFor(id))}
          onOpenOutline={() => setOutline(true)}
          outlineOpen={outline}
        />
        <article className="lesson-player-stage" aria-label="课件内容">
          {ready && (
            <section
              key={`${scene.id}:${revision}`}
              id={scene.id}
              className={`lesson-scene is-active ${scene.id === 'start-cover' ? 'scene-cover' : scene.id.endsWith('-cover') ? 'scene-chapter-cover' : ''} ${s.chapterFix}`}
              aria-label={`${index + 1} / ${scenes.length} · ${scene.title}`}
            >
              <div
                className={`lesson-scene-canvas ${original ? '' : s.canvas}`}
              >
                {original ? (
                  <OriginalScene id={scene.id} navigateTo={navigate} />
                ) : (
                  <>
                    <ConceptScene id={scene.id} active />
                    <ToolScene id={scene.id} />
                    <ModelScene id={scene.id} />
                  </>
                )}
              </div>
            </section>
          )}
        </article>
      </div>
      <span className="sr-only" aria-live="polite">
        {ready
          ? `第 ${index + 1} 页，共 ${scenes.length} 页。${scene.title}。`
          : ''}
        {notice}
      </span>
      <Dialog open={outline} onOpenChange={setOutline}>
        <DialogContent className={`${s.modal} ${s.outlineDialog}`}>
          <DialogHeader>
            <DialogTitle>教学目录与更多</DialogTitle>
            <DialogDescription>
              第 {index + 1} / {scenes.length} 页 · {scene.title}
              。翻页与刷新会保留当前进度。
            </DialogDescription>
          </DialogHeader>
          <div className={s.menuActions}>
            <button
              className={s.primary}
              onClick={() => void toggleFullscreen()}
            >
              {fullscreen ? <Minimize /> : <Maximize />}
              {fullscreen ? '退出全屏' : '进入全屏'}
            </button>
            <button className={s.secondary} onClick={resetPage}>
              <RotateCcw />
              重置本页互动
            </button>
            <button className={s.secondary} onClick={restartLesson}>
              重新开始本课（清空全部互动）
            </button>
            <button className={s.secondary} onClick={markComplete}>
              <Check />
              {complete ? '本课已完成' : '标记本课完成'}
            </button>
          </div>
          {notice && <p aria-live="polite">{notice}</p>}
          <LessonOutline
            key={`${scene.chapterId}-${outline}`}
            currentIndex={index}
            onNavigate={navigate}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
