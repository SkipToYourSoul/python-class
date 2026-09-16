import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我的课程',
  description: '课程与学习路径的个人画廊。',
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
