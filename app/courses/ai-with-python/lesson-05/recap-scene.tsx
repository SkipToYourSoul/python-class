import { StoryRecap } from '@/components/course/ai-with-python/story-recap';
import s from './recap-scene.module.css';

const recapAssetBase = '/courses/ai-with-python/lesson-03/assets';
const stories = [
  {
    lesson: '第一课',
    title: '守门模型',
    introduction: '勇士和小派训练守门模型，帮助城堡辨认新来客。',
    image: `${recapAssetBase}/lesson-01-recap.png`,
    steps: ['来客难分辨', '整理已知档案', '训练模型', '预测新来客身份'],
    alt: '第一课四格漫画，按从左到右、从上到下阅读：勇士和恶魔一起来到城门；勇士与小派整理带身份标签和属性的档案；训练守门模型，再输入新来客的数据；模型放行勇士，拦下恶魔。',
  },
  {
    lesson: '第二课',
    title: '网页情报',
    introduction: '敌情越来越多，勇士和小派从网页里提取恶魔情报。',
    image: `${recapAssetBase}/lesson-02-recap.png`,
    steps: ['敌情越来越多', '取回网页', '提取地点和弱点', '提前布置防御'],
    alt: '第二课四格漫画，按从左到右、从上到下阅读：勇士发现远方的恶魔；勇士和小派取回情报网页；提取并配对恶魔的地点和弱点；为炎角兽、藤甲魔和冰翼魔提前准备防御。',
  },
  {
    lesson: '第三课',
    title: '本地档案',
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
  {
    lesson: '第四课',
    title: '追查首领',
    introduction: '勇士和小派分析战报、核对证据，最终揭开魔王的伪装。',
    image: '/courses/ai-with-python/lesson-04/assets/lesson-04-opening.png',
    steps: [
      '再次击退进攻',
      '发现撤退疑点',
      '收集各地战报',
      '整理表格，追查首领',
    ],
    alt: '第四课四格漫画，按从左到右、从上到下阅读：勇士与小派依据档案再次击退恶魔；他们发现恶魔成组撤退，怀疑背后有人指挥；机械猫头鹰送来各地的进攻战报；勇士与小派把战报整理成表格，开始调查九个对象。',
  },
] as const;

export function RecapScene() {
  return (
    <div className={s.recap}>
      <StoryRecap
        stories={stories}
        nextScene="l5-mission"
        continueLabel="继续第五课"
      />
    </div>
  );
}
