type ComicAct = {
  title: string;
  image: string;
  alt: string;
  captions: readonly [string, string];
  promptLabel: string;
  prompt: string;
};

type ComicStory = {
  title: string;
  label: string;
  nextScene: string;
  nextLabel: string;
  acts: readonly [ComicAct, ComicAct, ComicAct];
};

export const comicStories = {
  movie: {
    title: '今晚的电影，谁来介绍？',
    label: 'STORY · 电影馆的旧档案',
    nextScene: 'l3-read-cover',
    nextLabel: '去读取电影档案',
    acts: [
      {
        title: '片名有了，介绍呢？',
        image: 'movie-act-01.png',
        alt: '第一幕：勇士为城堡电影夜准备介绍，小派发现电影卡片还缺少详细资料。',
        captions: [
          '勇士：“片名有了，谁来介绍电影？”',
          '小派：“导演、演员和评分呢？”',
        ],
        promptLabel: '先想一想',
        prompt: '只知道片名，够做一张电影介绍卡吗？',
      },
      {
        title: '网站暂时连不上',
        image: 'movie-act-02.png',
        alt: '第二幕：电影网站暂时无法连接，管理员指向电脑里已经保存的电影网页。',
        captions: [
          '勇士：“糟了，网站暂时连不上！”',
          '管理员：“我存过这些电影网页。”',
        ],
        promptLabel: '找找办法',
        prompt: '网站打不开，保存下来的文件还能派上用场吗？',
      },
      {
        title: '读出已有的档案',
        image: 'movie-act-03.png',
        alt: '第三幕：管理员展示电脑中保存的电影网页，小派和勇士准备读取文件里的资料。',
        captions: [
          '管理员：“这就是之前保存的网页。”',
          '小派：“让 Python 读出里面的资料！”',
        ],
        promptLabel: '接下任务',
        prompt: '读出片名、导演、演员和评分，完成电影介绍。',
      },
    ],
  },
  handoff: {
    title: '下一班勇士，也需要情报',
    label: 'STORY · 回到勇士情报站',
    nextScene: 'l3-write-cover',
    nextLabel: '去写下交接记录',
    acts: [
      {
        title: '电影档案帮了大忙',
        image: 'handoff-act-01.png',
        alt: '第一幕：勇士顺利完成电影介绍，和小派离开电影馆，管理员收好电影档案。',
        captions: [
          '勇士：“幸好这些资料被保存下来了！”',
          '小派：“下次需要，还能打开来看。”',
        ],
        promptLabel: '任务完成',
        prompt: '电影介绍准备好了，勇士和小派回到城堡。',
      },
      {
        title: '换岗了，情报怎么交接？',
        image: 'handoff-act-02.png',
        alt: '第二幕：换岗钟响，晚班勇士来取情报；电脑显示着恶魔资料，交接文件夹却还是空的。',
        captions: [
          '晚班勇士：“查到的弱点，留我一份吧！”',
          '勇士：“只显示出来了，还没保存……”',
        ],
        promptLabel: '先想一想',
        prompt: '屏幕上看到了，就等于保存成文件了吗？',
      },
      {
        title: '把电影馆的办法用起来',
        image: 'handoff-act-03.png',
        alt: '第三幕：勇士想起电影馆保存的文件，和小派准备建立交接记录，晚班伙伴在旁等待。',
        captions: [
          '勇士：“电影资料能存，情报也能存！”',
          '小派：“这次，我们把内容写进文件。”',
        ],
        promptLabel: '接下任务',
        prompt: '把已经查到的三条情报，留给下一班勇士。',
      },
    ],
  },
  rescue: {
    title: '通信中断，档案仍在',
    label: 'STORY · 城堡的夜晚',
    nextScene: 'l3-organize-cover',
    nextLabel: '去整理守城档案',
    acts: [
      {
        title: '夜色中的坏消息',
        image: 'rescue-act-01.png',
        alt: '第一幕：恶魔用迷雾干扰通信，猫头鹰信使被拦住；城堡电脑收不到最新消息。',
        captions: [
          '恶魔：“让你们收不到新消息！”',
          '晚班勇士：“今晚怎么准备防线？”',
        ],
        promptLabel: '先想一想',
        prompt: '新消息暂时来不了，还能用什么准备防线？',
      },
      {
        title: '白天的记录还在',
        image: 'rescue-act-02.png',
        alt: '第二幕：小派找到本地交接文件，勇士读取保存过的恶魔弱点，准备探照灯、火把和供热装置。',
        captions: [
          '小派：“白天保存的文件还在这里！”',
          '勇士：“炎角兽怕强光，先备好探照灯。”',
        ],
        promptLabel: '小派提醒',
        prompt: '档案记录的是当时的情报，旧地点不一定是现在的位置。',
      },
      {
        title: '让记录更好找',
        image: 'rescue-act-03.png',
        alt: '第三幕：密集的文字记录让伙伴难以查找，小派和勇士设想将情报分列排整齐。',
        captions: [
          '晚班勇士：“记录再多些，怎么找？”',
          '小派：“把每条记录排整齐！”',
        ],
        promptLabel: '接下任务',
        prompt: '分清恶魔、地点和弱点，让伙伴更快找到需要的信息。',
      },
    ],
  },
} as const satisfies Record<string, ComicStory>;
