'use client';

/* oxlint-disable next/no-img-element -- Preserve the supplied full-resolution course diagram. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The overflow region must support keyboard scrolling. */
import { useState } from 'react';
import { Expand, X, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const mapSource = '/courses/ai-with-python/course-position.png';
const mapDescription =
  'Python 系列完整路线图：基础阶段学习语法与编程，进阶阶段学习函数与数据结构，实践阶段学习数据分析与机器学习。';

export function CourseMapDetail() {
  const [originalSize, setOriginalSize] = useState(false);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setOriginalSize(false);
      }}
    >
      <DialogTrigger
        className="course-map-artwork-trigger"
        aria-label="放大查看完整路线图"
      >
        <img
          className="course-map-original"
          src={mapSource}
          width={2370}
          height={1334}
          alt={mapDescription}
        />
        <span className="course-map-caption">
          <Expand aria-hidden="true" />
          放大查看
        </span>
      </DialogTrigger>
      <DialogContent className="course-map-dialog" showCloseButton={false}>
        <header>
          <div>
            <DialogTitle className="course-map-dialog-title">
              Python 系列 · 完整路线图
            </DialogTitle>
            <DialogDescription className="course-map-dialog-description">
              可切换原图尺寸，查看图中的详细课程安排。
            </DialogDescription>
          </div>
          <div className="course-map-dialog-actions">
            <button
              className="course-map-dialog-zoom"
              type="button"
              aria-pressed={originalSize}
              onClick={() => setOriginalSize(!originalSize)}
            >
              <ZoomIn aria-hidden="true" />
              原图尺寸
            </button>
            <DialogClose
              className="course-map-dialog-close"
              aria-label="关闭完整路线图"
            >
              <X aria-hidden="true" />
              关闭
            </DialogClose>
          </div>
        </header>
        <section
          className="course-map-image-scroll"
          data-original-size={originalSize}
          tabIndex={0}
          aria-label="完整路线图，可滚动查看"
        >
          <img
            src={mapSource}
            width={2370}
            height={1334}
            alt={mapDescription}
          />
        </section>
      </DialogContent>
    </Dialog>
  );
}
