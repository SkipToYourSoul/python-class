type ComicAct = {
  title: string;
  image: string;
  alt: string;
  captions: readonly [string, string];
  promptLabel: string;
  prompt: string;
};

type ComicStory = {
  version: number;
  title: string;
  label: string;
  nextScene: string;
  nextLabel: string;
  acts: readonly [ComicAct, ComicAct, ComicAct];
};

export const comicStories = {
  movie: {
    version: 2,
    title: '电影突然卡住了',
    label: 'STORY · 一次断网的提醒',
    nextScene: 'l3-read-cover',
    nextLabel: '先读一份电影资料',
    acts: [
      {
        title: '守城后的电影时间',
        image: 'movie-watch-act-01.png',
        alt: '第一幕：程序帮忙收集情报后，勇士和小派坐在城堡电影馆里，吃着爆米花观看正在联网播放的冒险电影。',
        captions: [
          '勇士：“情报查好了，看会儿电影吧！”',
          '小派：“这段真精彩！”',
        ],
        promptLabel: '接着上回',
        prompt: '程序帮忙收集了情报，勇士终于有时间看会儿电影。',
      },
      {
        title: '恶魔短暂干扰网络',
        image: 'movie-watch-act-02.png',
        alt: '第二幕：城堡外，恶魔用紫色迷雾短暂干扰通信；电影馆里的影片卡在加载画面，电脑显示断网，勇士和小派无法继续观看或打开网页。',
        captions: [
          '恶魔：“让你们断网一小会儿！”',
          '勇士：“电影卡住了，网页也打不开！”',
        ],
        promptLabel: '先想一想',
        prompt: '这次只是电影卡住了。如果守城时查不到恶魔的弱点呢？',
      },
      {
        title: '网络恢复，留下提醒',
        image: 'movie-watch-act-03.png',
        alt: '第三幕：网络恢复，电影继续播放；勇士想到守城情报应该提前保存。管理员展示一份已保存在电脑里的电影资料网页，勇士和小派准备学习读取里面的文字信息。',
        captions: [
          '勇士：“网恢复了，重要情报得提前存下来！”',
          '小派：“先读一份存好的电影资料，再学着保存。”',
        ],
        promptLabel: '接下任务',
        prompt:
          '网络恢复后，电影继续播放。接下来，用保存好的电影资料练习读取文件。',
      },
    ],
  },
  handoff: {
    version: 2,
    title: '守城情报，也要留一份',
    label: 'STORY · 断网带来的启发',
    nextScene: 'l3-write-cover',
    nextLabel: '去写下交接记录',
    acts: [
      {
        title: '想起上次电影断网',
        image: 'handoff-outage-act-01.png',
        alt: '第一幕：读完电影资料后，勇士回想起上次电影加载停住、网页因断网打不开的情景；他和小派离开电影馆，决定把守城情报也提前保存一份。',
        captions: [
          '勇士：“上次看电影一断网，网页也打不开。”',
          '小派：“守城情报更要提前留一份！”',
        ],
        promptLabel: '接着刚才',
        prompt: '读完电影资料，勇士想起上次断网，决定把守城情报也存一份。',
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
        title: '把情报写进文件',
        image: 'handoff-outage-act-03.png',
        alt: '第三幕：勇士和小派从上次电影断网的经历中获得启发，准备把查到的守城情报写进文件；电脑的新文件仍为空白，晚班伙伴在旁等待。',
        captions: [
          '勇士：“把情报存好，下次断网时也能查。”',
          '小派：“还可以交给下一班勇士！”',
        ],
        promptLabel: '接下任务',
        prompt: '把已经查到的三条情报写进文件，留给下一班勇士。',
      },
    ],
  },
  rescue: {
    version: 1,
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
