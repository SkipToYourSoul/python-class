'use client';
import { useEffect, useRef, useState } from 'react';
import { WalkingSprite } from './walking-sprite';
import s from './walking-sprite.module.css';

export function CountdownArrival({
  src,
  name,
  duration,
  remaining,
  timed,
  running,
}: {
  src: string;
  name: string;
  duration: number;
  remaining: number;
  timed: boolean;
  running: boolean;
}) {
  const image = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!timed || reducedMotion || !image.current) return;
    const approach = image.current.animate(
      [
        { transform: 'translateY(-35%) scale(0.25)' },
        { transform: 'translateY(0) scale(1)' },
      ],
      { duration: duration * 1000, easing: 'linear', fill: 'both' },
    );
    approach.pause();
    animation.current = approach;
    return () => {
      approach.cancel();
      animation.current = null;
    };
  }, [duration, timed, reducedMotion]);

  useEffect(() => {
    const approach = animation.current;
    if (!approach) return;
    // The game clock is authoritative, including restored rounds and pauses.
    approach.currentTime = Math.max(0, duration - remaining) * 1000;
    if (running) approach.play();
    else approach.pause();
  }, [duration, remaining, running, timed, reducedMotion]);

  return (
    <div ref={image} className={s.approach}>
      <WalkingSprite
        src={src}
        name={name}
        walking={timed && running && !reducedMotion}
      />
    </div>
  );
}
