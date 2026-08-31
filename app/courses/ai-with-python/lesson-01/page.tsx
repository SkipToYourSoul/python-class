import LessonClient from './lesson-client';

export const metadata = {
  title: '第一课：走进 AI 世界 · AI with Python',
  description: '理解机器学习的基本思路，认识 JupyterLab，并训练一个决策树模型。',
};

export default function LessonPage() {
  return <LessonClient />;
}
