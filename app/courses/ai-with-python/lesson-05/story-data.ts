export type StoryKind = 'guess' | 'patrol' | 'kind';

export type StoryStep = {
  name: string;
  speaker: '勇士' | '小派' | '熊猫博士';
  quote: string;
  question: string;
};

export const storyComics: Record<
  StoryKind,
  {
    title: string;
    label: string;
    image: string;
    alt: string;
    steps: StoryStep[];
  }
> = {
  guess: {
    title: '个头越大，跑得越慢？',
    label: 'MAKE A GUESS · 提出猜想',
    image: 'height-speed-story.png',
    alt: '三格漫画：勇士凭大块头的外形猜它跑得慢；恶魔突然快速移动；勇士、小派与熊猫博士回到已有记录中查证身高和速度。',
    steps: [
      {
        name: '凭外形猜',
        speaker: '勇士',
        quote: '这么大的块头，应该跑不快吧？',
        question: '只看外形，这个判断可靠吗？',
      },
      {
        name: '突然加速',
        speaker: '勇士',
        quote: '它跑得好快！看来不能只凭个头判断。',
        question: '“个头大”一定意味着“速度慢”吗？',
      },
      {
        name: '回到记录',
        speaker: '熊猫博士',
        quote: '翻翻已有记录，检验我们的猜想吧！',
        question: '检验猜想，需要看哪两列？',
      },
    ],
  },
  patrol: {
    title: '同一只恶魔，一直这么快？',
    label: 'STORY · 观察巡逻',
    image: 'patrol-time-story.png',
    alt: '三格漫画：勇士被桥上的炎角兽挡住；小派在不同时间记录同一只戴浅色脚环的恶魔；熊猫博士与同伴核对连续观测记录，尚未决定通过时机。',
    steps: [
      {
        name: '去路被挡',
        speaker: '勇士',
        quote: 'D001 守着桥，一次测速够用吗？',
        question: '一次记录能代表一天的表现吗？',
      },
      {
        name: '分时观察',
        speaker: '小派',
        quote: '每隔两小时，记录一次它的速度！',
        question: '怎样展示时刻与速度的对应关系？',
      },
      {
        name: '找出变化',
        speaker: '熊猫博士',
        quote: '记录齐了！先看变化，再安排侦察。',
        question: '记录该按什么顺序排列？',
      },
    ],
  },
  kind: {
    title: '哪一族通常跑得更快？',
    label: 'STORY · 比较军团',
    image: 'three-kinds-story.png',
    alt: '三格漫画：通向城堡的三条路上都有不同种类的恶魔巡逻；同族个体的移动表现也有差异；团队将三族的已有观测记录分成三组，准备比较。',
    steps: [
      {
        name: '三路巡逻',
        speaker: '勇士',
        quote: '三条路都有巡逻队，哪一族通常更快？',
        question: '观察一个个体，够了解整族吗？',
      },
      {
        name: '一只够吗',
        speaker: '熊猫博士',
        quote: '同族也有快有慢，不能只看一只！',
        question: '怎样让每族的30条记录都参与比较？',
      },
      {
        name: '三族分组',
        speaker: '小派',
        quote: '每族30条记录，分成三组来比吧！',
        question: '用什么数，概括每一组的速度？',
      },
    ],
  },
};
