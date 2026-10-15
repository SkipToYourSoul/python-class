import { StoryRecap } from '@/components/course/ai-with-python/story-recap';

const recapAssetBase = '/courses/ai-with-python/lesson-03/assets';
const stories = [
  {
    lesson: '第一课',
    title: '训练城堡守门模型',
    introduction: '勇士和小派训练守门模型，帮助城堡辨认新来客。',
    image: `${recapAssetBase}/lesson-01-recap.png`,
    steps: ['来客难分辨', '整理已知档案', '训练模型', '预测新来客身份'],
    alt: '第一课四格漫画，按从左到右、从上到下阅读：勇士和恶魔一起来到城门；勇士与小派整理带身份标签和属性的档案；训练守门模型，再输入新来客的数据；模型放行勇士，拦下恶魔。',
  },
  {
    lesson: '第二课',
    title: '建立勇士情报站',
    introduction: '敌情越来越多，勇士和小派从网页里提取恶魔情报。',
    image: `${recapAssetBase}/lesson-02-recap.png`,
    steps: ['敌情越来越多', '取回网页', '提取地点和弱点', '提前布置防御'],
    alt: '第二课四格漫画，按从左到右、从上到下阅读：勇士发现远方的恶魔；勇士和小派取回情报网页；提取并配对恶魔的地点和弱点；为炎角兽、藤甲魔和冰翼魔提前准备防御。',
  },
  {
    lesson: '第三课',
    title: '保存和使用守城情报',
    introduction: '恶魔切断网络，勇士和小派靠保存的情报再次守住城堡。',
    image: `${recapAssetBase}/diary-defense-cover.png`,
    steps: [
      '提前保存情报',
      '恶魔切断网络',
      '读取本地档案',
      '找到弱点，击退恶魔',
    ],
    alt: '第三课四格漫画，按从左到右、从上到下阅读：勇士和小派把炎角兽怕强光的情报存入文件；恶魔袭击并切断网络；勇士与晚班勇士读取本地档案；根据记录用强光击退炎角兽，再次守住城堡。',
  },
] as const;

export function RecapScene() {
  return (
    <StoryRecap
      stories={stories}
      nextScene="l4-opening"
      continueLabel="继续第四课"
    />
  );
}
