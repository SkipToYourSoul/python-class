import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我的课程 · AI with Python',
  description: '从 Python 出发，走进人工智能世界。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
