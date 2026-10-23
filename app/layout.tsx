import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '李美丽 · Builder & AI Coach',
  description: '李美丽的作品、经验分享与 AI 编程创作课堂。',
  icons: {
    icon: [
      {
        url: '/personal-home/brand/icon-64.png',
        sizes: '64x64',
        type: 'image/png',
      },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/personal-home/brand/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
