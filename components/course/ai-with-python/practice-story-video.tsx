'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  Check,
  Pause,
  Play,
  Repeat2,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useLessonPageState } from '@/components/course/lesson-state';
import s from './practice-story-video.module.css';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(change: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener('change', change);
  return () => media.removeEventListener('change', change);
}
const motionSnapshot = () => window.matchMedia(motionQuery).matches;
const serverMotionSnapshot = () => false;

type PracticeStoryVideoProps = {
  pageId: string;
  title: string;
  src: string;
  poster: string;
  description: string;
  descriptionTrack?: string;
  captionTrack?: string;
  initialDuration?: number;
  initialCaption: string;
  phases: readonly { from: number; text: string }[];
  checkpoint?: { time: number; label: string };
  completeCaption?: string;
  steps?: readonly { label: string; complete: boolean }[];
  compact?: boolean;
  className?: string;
  controlLabel?: string;
  elapsedKey?: string;
  loopKey?: string;
  hasAudio?: boolean;
};

export function PracticeStoryVideo({
  pageId,
  title,
  src,
  poster,
  description,
  descriptionTrack,
  captionTrack,
  initialDuration = 12,
  initialCaption,
  phases,
  checkpoint,
  completeCaption,
  steps,
  compact = false,
  className,
  controlLabel = '剧情视频',
  elapsedKey = 'practiceVideoElapsed',
  loopKey = 'practiceVideoLoop',
  hasAudio = false,
}: PracticeStoryVideoProps) {
  const [saved, update] = useLessonPageState<Record<string, number | boolean>>(
    pageId,
    {
      [elapsedKey]: 0,
      [loopKey]: false,
      videoSound: hasAudio,
      videoVolume: 100,
    },
  );
  const savedElapsed = saved[elapsedKey];
  const elapsed =
    typeof savedElapsed === 'number' && Number.isFinite(savedElapsed)
      ? Math.max(0, savedElapsed)
      : 0;
  const looping = saved[loopKey] === true;
  const volume =
    typeof saved.videoVolume === 'number' && Number.isFinite(saved.videoVolume)
      ? Math.min(100, Math.max(0, saved.videoVolume))
      : 100;
  const soundOn = hasAudio && saved.videoSound !== false && volume > 0;
  const fallbackDuration =
    Number.isFinite(initialDuration) && initialDuration > 0
      ? initialDuration
      : 12;
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeRef = useRef(true);
  const initialTime = useRef(elapsed);
  const updateRef = useRef(update);
  const [time, setTime] = useState(elapsed);
  const [duration, setDuration] = useState(fallbackDuration);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const reduced = useSyncExternalStore(
    subscribeMotion,
    motionSnapshot,
    serverMotionSnapshot,
  );

  useEffect(() => {
    updateRef.current = update;
  }, [update]);
  useEffect(() => {
    if (reduced) videoRef.current?.pause();
  }, [reduced]);
  useEffect(() => {
    if (hasAudio && videoRef.current) videoRef.current.volume = volume / 100;
  }, [hasAudio, volume]);
  useEffect(() => {
    activeRef.current = true;
    const video = videoRef.current;
    const hide = () => {
      if (document.hidden && video && !video.paused) {
        video.pause();
        initialTime.current = video.currentTime;
        updateRef.current({ [elapsedKey]: video.currentTime });
      }
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      // Pause events after a page reset must not restore the old page state.
      activeRef.current = false;
      document.removeEventListener('visibilitychange', hide);
      video?.pause();
    };
  }, [elapsedKey]);

  function record(nextTime: number) {
    if (!activeRef.current) return;
    initialTime.current = nextTime;
    setTime(nextTime);
    updateRef.current({ [elapsedKey]: nextTime });
  }
  function seek(nextTime: number) {
    const video = videoRef.current;
    if (!video || !ready) return;
    video.pause();
    const position = Math.max(0, Math.min(duration, nextTime));
    video.currentTime = position;
    record(position);
  }
  function start(fromBeginning = false) {
    const video = videoRef.current;
    if (!video || !ready) return;
    setError('');
    if (reduced) {
      seek(duration);
      return;
    }
    if (fromBeginning || video.ended || video.currentTime >= duration - 0.05) {
      video.currentTime = 0;
      record(0);
    }
    void video.play().catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError')
        return;
      if (activeRef.current) setError('视频暂时无法播放，请再试一次。');
    });
  }
  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      video.pause();
      record(video.currentTime);
    } else start();
  }

  const ended = time >= duration - 0.05;
  const progress = Math.min(1, Math.max(0, time / duration));
  const actionName = controlLabel.replace(/视频$/, '');
  const phase = phases.reduce<{ from: number; text: string } | undefined>(
    (current, item) =>
      time > 0 && time >= item.from && (!current || item.from >= current.from)
        ? item
        : current,
    undefined,
  );
  const caption =
    error ||
    (reduced && ended
      ? `已显示${actionName}画面。`
      : completeCaption && steps?.length && steps.every((step) => step.complete)
        ? completeCaption
        : phase?.text || initialCaption);

  return (
    <section
      className={[s.scene, compact && s.compact, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={title}
      data-practice-video
      data-video-compact={compact}
      data-playing={playing}
      data-elapsed={Math.round(time * 1000)}
      data-looping={looping}
    >
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- Captions are conditional; existing silent clips only provide descriptions. */}
      <video
        ref={videoRef}
        className={s.video}
        data-video-part="video"
        src={src}
        poster={poster}
        muted={!soundOn}
        playsInline
        preload="metadata"
        loop={looping && !reduced}
        aria-label={description}
        onLoadedMetadata={(event) => {
          if (!activeRef.current) return;
          const video = event.currentTarget;
          const length =
            Number.isFinite(video.duration) && video.duration > 0
              ? video.duration
              : fallbackDuration;
          setDuration(length);
          const position = Math.max(0, Math.min(length, initialTime.current));
          video.currentTime = position;
          record(position);
          setReady(true);
          setError('');
        }}
        onTimeUpdate={(event) => {
          if (ready) record(event.currentTarget.currentTime);
        }}
        onPlay={(event) => {
          if (!activeRef.current || reduced || document.hidden) {
            event.currentTarget.pause();
          } else setPlaying(true);
        }}
        onPause={() => {
          if (activeRef.current) setPlaying(false);
        }}
        onEnded={() => {
          if (activeRef.current) {
            setPlaying(false);
            record(duration);
          }
        }}
        onError={() => {
          if (activeRef.current) {
            setPlaying(false);
            setReady(false);
            setError('视频加载失败，请重新加载。');
          }
        }}
      >
        {captionTrack && (
          <track
            kind="captions"
            src={captionTrack}
            srcLang="zh"
            label="中文字幕"
          />
        )}
        {descriptionTrack && (
          <track
            kind="descriptions"
            src={descriptionTrack}
            srcLang="zh"
            label="中文动作描述"
          />
        )}
      </video>
      <header className={s.heading} data-video-part="heading">
        <h3>{title}</h3>
        <p>{caption}</p>
        {checkpoint && (
          <button
            type="button"
            className={s.checkpoint}
            data-video-part="checkpoint"
            disabled={!ready}
            onClick={() => seek(checkpoint.time)}
          >
            {checkpoint.label}
          </button>
        )}
      </header>
      <div className={s.controls} data-video-part="controls">
        <div className={s.buttons} data-video-part="buttons">
          <button
            type="button"
            className={s.play}
            onClick={toggle}
            disabled={!ready}
            aria-label={
              playing
                ? `暂停${controlLabel}`
                : ended
                  ? `重播${controlLabel}`
                  : time > 0
                    ? `继续${controlLabel}`
                    : `播放${controlLabel}`
            }
          >
            {playing ? (
              <Pause size={19} />
            ) : ended ? (
              <RotateCcw size={19} />
            ) : (
              <Play size={19} />
            )}
            {playing
              ? '暂停'
              : ended
                ? '重播'
                : time > 0
                  ? '继续播放'
                  : `播放${actionName}`}
          </button>
          {ready && time > 0 && !ended && (
            <button
              type="button"
              className={s.replay}
              onClick={() => start(true)}
              disabled={!ready}
            >
              <RotateCcw size={18} />
              从头播放
            </button>
          )}
          {hasAudio && (
            <div className={s.audioControls}>
              <button
                type="button"
                className={s.replay}
                aria-label={`${soundOn ? '关闭' : '开启'}${controlLabel}声音`}
                aria-pressed={soundOn}
                onClick={() =>
                  update({ videoSound: !soundOn, videoVolume: volume || 100 })
                }
              >
                {soundOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
                声音{soundOn ? '开' : '关'}
              </button>
              <input
                type="range"
                className={s.volume}
                min={0}
                max={100}
                step={5}
                value={soundOn ? volume : 0}
                aria-label={`${controlLabel}音量`}
                aria-valuetext={`${soundOn ? volume : 0}%`}
                onChange={(event) => {
                  const nextVolume = event.currentTarget.valueAsNumber;
                  update({
                    videoSound: nextVolume > 0,
                    videoVolume: nextVolume,
                  });
                }}
              />
            </div>
          )}
          <button
            type="button"
            className={s.loop}
            aria-label={`循环播放${controlLabel}`}
            aria-pressed={looping}
            onClick={() => update({ [loopKey]: !looping })}
          >
            <Repeat2 size={19} />
            循环{looping ? '开' : '关'}
          </button>
          {!ready && error && (
            <button
              type="button"
              className={s.replay}
              onClick={() => {
                setError('');
                videoRef.current?.load();
              }}
            >
              重新加载
            </button>
          )}
        </div>
        <input
          className={s.scrub}
          data-video-part="progress"
          type="range"
          min={0}
          max={duration}
          step={0.05}
          value={Math.min(time, duration)}
          disabled={!ready}
          aria-label={`${controlLabel}进度`}
          aria-valuetext={
            time.toFixed(1) + '秒，共' + duration.toFixed(1) + '秒'
          }
          style={{
            backgroundImage:
              'linear-gradient(to right,#ffc91c ' +
              progress * 100 +
              '%,#c3d7ed40 ' +
              progress * 100 +
              '%)',
          }}
          onChange={(event) => seek(Number(event.target.value))}
        />
        {steps && steps.length > 0 && (
          <ol
            className={s.steps}
            data-video-part="steps"
            aria-label="代码准备进度"
            style={{
              gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
            }}
          >
            {steps.map((step, i) => (
              <li key={step.label} data-complete={step.complete}>
                {step.complete ? <Check size={18} /> : <span>{i + 1}</span>}
                {step.label}
                <span className={s.srOnly}>
                  {step.complete ? '代码已补齐' : '代码待补齐'}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
