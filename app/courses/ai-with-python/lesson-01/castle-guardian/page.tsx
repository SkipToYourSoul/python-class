import type { Metadata } from 'next';
import GuardianGame from './guardian-game';

export const metadata: Metadata = {
  title: '城堡守门人 · 决策树互动实验',
  description: '观察训练数据、搭建决策树，并让 AI 识别勇士与恶魔。',
};

export default function CastleGuardianPage() {
  return <GuardianGame />;
}
