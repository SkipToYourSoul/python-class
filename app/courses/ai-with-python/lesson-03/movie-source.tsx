/* oxlint-disable next/no-img-element -- User-provided original webpage screenshot. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable original image needs keyboard focus for scrolling. */
'use client';
import { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MOVIE_SAMPLES } from './practice-content';
import { assetBase } from './lesson-data';
import s from './movie-practice.module.css';

const movie = MOVIE_SAMPLES[0];
const sourceImage = `${assetBase}/assets/douban-shawshank-page.png`;
// Coordinates refer to the user's unchanged 1160 × 1498 screenshot.
export const movieFields = [
  {
    label: '片名',
    lines: [7, 12],
    value: movie.title,
    box: [32, 76, 995, 50],
    crop: [40, 78, 265, 45],
    added: false,
  },
  {
    label: '导演',
    lines: [8, 13],
    value: movie.director,
    box: [288, 146, 222, 34],
    crop: [288, 146, 222, 34],
    added: true,
  },
  {
    label: '评分',
    lines: [9, 14],
    value: movie.score,
    box: [860, 187, 81, 50],
    crop: [852, 185, 264, 62],
    added: false,
  },
  {
    label: '演员',
    lines: [10, 15, 16],
    value: movie.actors.join(' / '),
    box: [288, 214, 540, 68],
    crop: [288, 214, 307, 36],
    added: true,
  },
] as const;

export function MovieSourceImage({ field }: { field?: number }) {
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const markers = field === undefined ? movieFields : [movieFields[field]];
  return (
    <>
      <button
        className={s.sourcePage}
        onClick={() => setOpen(true)}
        aria-label="放大豆瓣页面原图"
      >
        <img
          src={sourceImage}
          alt="肖申克的救赎豆瓣详情页，标出片名、导演、演员和评分"
        />
        {markers.map(({ label, box, added }) => (
          <span
            key={label}
            aria-hidden="true"
            className={s.sourceMarker}
            data-added={added}
            data-selected={field !== undefined}
            style={{
              left: `${(box[0] / 1160) * 100}%`,
              top: `${(box[1] / 600) * 100}%`,
              width: `${(box[2] / 1160) * 100}%`,
              height: `${(box[3] / 600) * 100}%`,
            }}
          />
        ))}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={s.sourceDialog} initialFocus={titleRef}>
          <DialogHeader>
            <DialogTitle ref={titleRef} tabIndex={-1}>
              豆瓣电影详情页 · 原图
            </DialogTitle>
            <DialogDescription>
              查看片名、导演、演员和评分；向下滚动可看完整页面。
            </DialogDescription>
          </DialogHeader>
          <section
            className={s.sourceScroll}
            aria-label="完整豆瓣截图"
            tabIndex={0}
          >
            <img
              src={sourceImage}
              alt="用户提供的肖申克的救赎豆瓣详情页完整截图"
            />
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function MovieFieldZoom({ field }: { field: number }) {
  const data = movieFields[field];
  const [x, y, width, height] = data.crop;
  return (
    <figure
      className={s.fieldZoom}
      aria-label={`原图局部：${data.label}，${data.value}`}
      style={{
        aspectRatio: `${width} / ${height}`,
        backgroundImage: `url('${sourceImage}')`,
        backgroundSize: `${(1160 / width) * 100}% auto`,
        backgroundPosition: `${(x / (1160 - width)) * 100}% ${(y / (1498 - height)) * 100}%`,
      }}
    />
  );
}
