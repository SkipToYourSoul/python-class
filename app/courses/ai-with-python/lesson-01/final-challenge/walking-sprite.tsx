'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Animated canvas needs an image role and accessible name. */
import { useEffect, useRef } from 'react';
import s from './walking-sprite.module.css';

type WalkSheet = { canvas: HTMLCanvasElement; offsets: number[] };
const sheets = new Map<string, Promise<WalkSheet>>();

// Chroma-key compositing is performed once per sheet. The cached canvas has
// true alpha; only transparent, articulated frames are drawn into the scene.
function loadSheet(src: string) {
  let cached = sheets.get(src);
  if (!cached) {
    cached = new Promise<WalkSheet>((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const sheet = document.createElement('canvas');
        sheet.width = image.naturalWidth;
        sheet.height = image.naturalHeight;
        const ctx = sheet.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.drawImage(image, 0, 0);
        const pixels = ctx.getImageData(0, 0, sheet.width, sheet.height);
        for (let i = 0; i < pixels.data.length; i += 4) {
          const r = pixels.data[i],
            g = pixels.data[i + 1],
            b = pixels.data[i + 2];
          const key = Math.min(r, b) - g;
          if (key > 150 && r > 180 && b > 180) {
            const alpha = Math.max(0, Math.min(1, (220 - key) / 70));
            pixels.data[i + 3] = Math.round(pixels.data[i + 3] * alpha);
            // Suppress the key-color fringe on antialiased silhouette edges.
            if (alpha > 0) {
              pixels.data[i] = Math.min(r, g + 80);
              pixels.data[i + 2] = Math.min(b, g + 80);
            }
          }
        }
        ctx.putImageData(pixels, 0, 0);
        // Generated poses drift within their cells. Register the head/upper
        // torso instead of the silhouette: weapons and swinging limbs should
        // not move the character's centre from side to side.
        const frameWidth = sheet.width / 2;
        const frameHeight = sheet.height / 2;
        const offsets = Array.from({ length: 4 }, (_, frame) => {
          const histogram = Array.from({ length: frameWidth }, () => 0);
          let count = 0;
          for (
            let y = Math.floor(frameHeight * 0.08);
            y < frameHeight * 0.32;
            y++
          ) {
            for (
              let x = Math.floor(frameWidth * 0.32);
              x < frameWidth * 0.68;
              x++
            ) {
              const px = x + (frame % 2) * frameWidth;
              const py = y + Math.floor(frame / 2) * frameHeight;
              if (pixels.data[(py * sheet.width + px) * 4 + 3] > 128) {
                histogram[x]++;
                count++;
              }
            }
          }
          if (!count) return 0;
          let accumulated = 0;
          const anchor = histogram.findIndex((weight) => {
            accumulated += weight;
            return accumulated >= count / 2;
          });
          return frameWidth / 2 - anchor;
        });
        resolve({ canvas: sheet, offsets });
      };
      image.onerror = () => {
        sheets.delete(src);
        reject(new Error(`Cannot load ${src}`));
      };
      image.src = src;
    });
    sheets.set(src, cached);
  }
  return cached;
}

export function WalkingSprite({
  src,
  name,
  walking,
}: {
  src: string;
  name: string;
  walking: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const source = src.replace(
    /final-visitor-(.+)\.png$/,
    'walking/$1-walk-sheet.png',
  );
  useEffect(() => {
    let disposed = false;
    let frameRequest = 0;
    const started = performance.now();
    loadSheet(source)
      .then(({ canvas: sheet, offsets }) => {
        const element = canvas.current;
        if (disposed || !element) return;
        element.width = sheet.width / 2;
        element.height = sheet.height / 2;
        const context = element.getContext('2d');
        if (!context) return;
        let previous = -1;
        const draw = (now: number) => {
          if (disposed) return;
          const frame = walking ? Math.floor((now - started) / 220) % 4 : 0;
          if (previous !== frame) {
            context.clearRect(0, 0, element.width, element.height);
            context.drawImage(
              sheet,
              ((frame % 2) * sheet.width) / 2,
              (Math.floor(frame / 2) * sheet.height) / 2,
              sheet.width / 2,
              sheet.height / 2,
              offsets[frame],
              0,
              element.width,
              element.height,
            );
            element.dataset.frame = String(frame);
            previous = frame;
          }
          if (walking) frameRequest = requestAnimationFrame(draw);
        };
        draw(performance.now());
      })
      .catch(() => {
        if (canvas.current) canvas.current.dataset.loadError = 'true';
      });
    return () => {
      disposed = true;
      cancelAnimationFrame(frameRequest);
    };
  }, [source, walking]);
  return (
    <div className={s.sprite}>
      <span className={s.shadow} aria-hidden="true" />
      <canvas ref={canvas} role="img" aria-label={name} />
    </div>
  );
}
