/* oxlint-disable next/no-img-element -- Contact screenshots and QR codes retain their original pixels and proportions. */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, X } from 'lucide-react';
import s from './personal-home.module.css';

const contacts = [
  {
    id: 'xiaohongshu',
    label: '小红书主页',
    image: '/personal-home/contact/xiaohongshu.png',
    alt: '李美丽的小红书主页：李美丽冲冲冲，小红书号 964575688',
    width: 1016,
    height: 526,
  },
  {
    id: 'wechat',
    label: '微信联系',
    image: '/personal-home/contact/wechat.jpg',
    alt: '李美丽的微信二维码，扫码添加好友',
    width: 888,
    height: 1128,
  },
] as const;

export function ContactLinks() {
  const [open, setOpen] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const pointer = useRef('');

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !nav.current?.contains(event.target))
        setOpen(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      const trigger = nav.current?.querySelector<HTMLButtonElement>(
        '[aria-expanded="true"]',
      );
      setOpen(null);
      trigger?.focus();
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- The navigation delegates hover and focus dismissal for its disclosure buttons and panels.
    <nav
      ref={nav}
      className={s.topLinks}
      aria-label="我的联系方式"
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') setOpen(null);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
      }}
    >
      {contacts.map((contact) => (
        <div key={contact.id} className={s.contactItem}>
          <button
            type="button"
            className={s.contactTrigger}
            aria-expanded={open === contact.id}
            aria-controls={`contact-${contact.id}`}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setOpen(contact.id);
            }}
            onPointerDown={(event) => {
              pointer.current = event.pointerType;
            }}
            onClick={(event) => {
              setOpen((current) =>
                current === contact.id &&
                (event.detail === 0 || pointer.current !== 'mouse')
                  ? null
                  : contact.id,
              );
            }}
          >
            <span>{contact.label}</span>
            <ChevronDown aria-hidden="true" />
          </button>
          <section
            id={`contact-${contact.id}`}
            className={s.contactPopover}
            aria-label={contact.label}
            hidden={open !== contact.id}
          >
            <div className={s.contactCard}>
              <div className={s.contactHeading}>
                <span>{contact.label}</span>
                <button
                  type="button"
                  aria-label={`关闭${contact.label}`}
                  onClick={() => setOpen(null)}
                >
                  <X aria-hidden="true" />
                </button>
              </div>
              <img
                className={s.contactImage}
                src={contact.image}
                alt={contact.alt}
                width={contact.width}
                height={contact.height}
              />
              {contact.id === 'xiaohongshu' ? (
                <a
                  className={s.contactAction}
                  href="https://www.xiaohongshu.com/user/profile/5c792c02000000001000f940"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  打开小红书主页 <ArrowUpRight aria-hidden="true" />
                  <span className={s.srOnly}>（在新标签页打开）</span>
                </a>
              ) : (
                <p className={s.contactHint}>
                  扫码添加微信 · 手机上可长按保存图片
                </p>
              )}
            </div>
          </section>
        </div>
      ))}
    </nav>
  );
}
