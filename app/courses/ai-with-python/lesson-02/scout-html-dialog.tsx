/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The scrollable source must be keyboard accessible. */
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { scoutPath } from './lesson-data';
import s from './lesson.module.css';

export function ScoutHtmlDialog() {
  const [open, setOpen] = useState(false);
  const [html, setHtml] = useState('');
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const firstName = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch(scoutPath, { signal: controller.signal, cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load scout HTML');
        return res.text();
      })
      .then(setHtml)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [open, attempt]);

  const lines = html.split('\n');
  const nameIndex = lines.findIndex((line) =>
    line.includes('<h2 class="name">'),
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setHtml('');
          setError(false);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger className={s.primary}>查看完整 HTML</DialogTrigger>
      <DialogContent className={`${s.modal} ${s.scoutHtmlModal}`}>
        <DialogHeader>
          <DialogTitle>前线侦察记录站 · 完整 HTML</DialogTitle>
          <DialogDescription>
            对照 scout.html 的完整源代码，核对三个恶魔的名字。
          </DialogDescription>
        </DialogHeader>
        {html ? (
          <>
            <div className={s.htmlSourceToolbar}>
              <span>scout.html</span>
              <button
                className={s.secondary}
                disabled={nameIndex < 0}
                onClick={() =>
                  firstName.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'instant',
                  })
                }
              >
                定位恶魔名字
              </button>
            </div>
            <pre
              className={s.fullHtmlSource}
              tabIndex={0}
              aria-label="scout.html 完整源代码"
            >
              <code>
                {lines.map((line, i) => (
                  <span
                    key={i}
                    ref={i === nameIndex ? firstName : undefined}
                    className={
                      line.includes('<h2 class="name">')
                        ? s.htmlNameLine
                        : undefined
                    }
                  >
                    {line}
                    {i < lines.length - 1 ? '\n' : ''}
                  </span>
                ))}
              </code>
            </pre>
          </>
        ) : error ? (
          <div role="alert">
            <p>HTML 未能加载，请重试。</p>
            <button
              className={s.secondary}
              onClick={() => {
                setError(false);
                setAttempt((n) => n + 1);
              }}
            >
              重新加载
            </button>
          </div>
        ) : (
          <output>正在读取 HTML…</output>
        )}
      </DialogContent>
    </Dialog>
  );
}
