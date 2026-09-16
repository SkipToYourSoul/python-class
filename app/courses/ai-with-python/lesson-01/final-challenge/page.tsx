import type { Metadata } from 'next';
import FinalChallengeGame from './final-challenge-game';

export const metadata: Metadata = {
  title: 'AI 城门终局挑战 · AI with Python',
  description: '读懂决策树，在倒计时结束前识别勇士与恶魔。',
};

export default function FinalChallengePage() {
  return <FinalChallengeGame />;
}
