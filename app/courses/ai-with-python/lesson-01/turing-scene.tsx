/* oxlint-disable next/no-img-element -- Local teaching illustrations and diagram. */
'use client';

import { BookOpen, MessageCircle, X } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Stage, useSceneState, asset } from './lesson-ui';
import shared from './lesson-review.module.css';
import s from './turing-scene.module.css';

const stories = [
  {
    tab: '二战 · 破解密码',
    date: '1939—1945',
    title: '读懂秘密电报',
    image: 'turing-enigma-story.png',
    alt: '布莱切利庄园的破译工作：图灵与同伴研究电报，前景是木盒中的 Enigma 密码机，后方是带有多组圆形转鼓的 Bombe。',
    body: (
      <>
        德军用 <strong>Enigma 密码机</strong>把消息变成密文。图灵与同伴借助{' '}
        <strong>Bombe 破译机</strong>，寻找可能的密码设置。
      </>
    ),
    tags: ['秘密电报', '寻找线索', '机器帮忙'],
    idea: '让机器加快搜索，帮助人们破解密码。',
    note: '这是波兰密码学家与英国破译团队接力完成的事业。',
  },
  {
    tab: '回到 1936 · 图灵机',
    date: '1936',
    title: '想象一台“规则机器”',
    image: 'turing-machine-story.png',
    alt: '图灵在纸上构思抽象的图灵机：分成格子的纸带、对准一个格子的读写头，以及控制读写与移动的规则。',
    body: (
      <>
        战争之前，图灵已经在想：计算能怎样一步步完成？他提出
        <strong>图灵机</strong>：读写头按照规则，在纸带上读、写和移动。
      </>
    ),
    tags: ['读一个符号', '按规则写', '移动一格'],
    idea: '简单的规则，也能一步步完成复杂计算。',
    note: '图灵机是想象中的计算模型，并不是二战的破译机。',
  },
  {
    tab: '1950 · 机器能思考吗',
    date: '1950 年 10 月',
    title: '从“会计算”到“有智能”',
    image: 'turing-test-story.png',
    alt: '图灵撰写论文的故事画面，并展示文字对话测试：判断者通过文字与隐藏身份的人和计算机交流。',
    body: (
      <>
        图灵在<strong>《计算机器与智能》</strong>
        中提出：只用文字聊天，你能分出谁是人、谁是机器吗？这成为后来所说的
        <strong>图灵测试</strong>。
      </>
    ),
    tags: ['隐藏身份', '文字问答', '作出判断'],
    idea: '机器能否表现出像人一样的智能？',
    note: '图灵是计算机科学与人工智能的重要先驱。',
  },
];

function HistorySources() {
  return (
    <Dialog>
      <DialogTrigger className={shared.secondary}>
        <BookOpen size={20} aria-hidden="true" />
        故事资料
      </DialogTrigger>
      <DialogContent className={s.dialog} showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className={s.dialogTitle}>故事背后的历史</DialogTitle>
          <DialogDescription className={s.dialogDescription}>
            三幅画是根据史料创作的教学插画；人物与场景并非历史照片。
          </DialogDescription>
        </DialogHeader>
        <ol className={s.sources}>
          <li>
            <strong>二战：团队共同破译 Enigma</strong>
            <p>
              波兰密码学家的早期成果奠定了基础。图灵、韦尔奇曼及同伴推进英国
              Bombe 的设计与使用；它帮助搜索密码设置。
            </p>
            <a
              href="https://www.tnmoc.org/bombe"
              target="_blank"
              rel="noreferrer"
            >
              英国国家计算机博物馆 · Bombe
            </a>
          </li>
          <li>
            <strong>1936：用数学研究“计算”</strong>
            <p>
              图灵提出的抽象计算模型，后来被称为图灵机，为计算机科学奠定了重要基础。
            </p>
            <a
              href="https://www.kings.cam.ac.uk/alan-mathison-turing-1912-54"
              target="_blank"
              rel="noreferrer"
            >
              剑桥大学国王学院 · 图灵档案
            </a>
          </li>
          <li>
            <strong>1950 年 10 月：一篇论文，一个大问题</strong>
            <p>
              《计算机器与智能》以“机器能思考吗？”开篇，并讨论模仿游戏。这是同一篇论文，不是两篇。
            </p>
            <a
              href="https://academic.oup.com/mind/article/LIX/236/433/986238"
              target="_blank"
              rel="noreferrer"
            >
              《Mind》原文 · 第 433—460 页
            </a>
          </li>
        </ol>
        <DialogClose className={`${shared.primary} ${s.close}`}>
          <X size={20} />
          回到故事
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function TuringDiagram() {
  return (
    <Dialog>
      <DialogTrigger className={shared.secondary}>
        <MessageCircle size={20} aria-hidden="true" />
        一张图看懂图灵测试
      </DialogTrigger>
      <DialogContent
        className={`${s.dialog} ${s.diagramDialog}`}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className={s.dialogTitle}>
            图灵测试：谁在回答？
          </DialogTitle>
          <DialogDescription className={s.dialogDescription}>
            判断者可以追问，但看不到对方，也听不到声音。
          </DialogDescription>
        </DialogHeader>
        <img
          className={s.diagram}
          src={asset('turing-test-diagram.svg')}
          alt="判断者向隐藏身份的人和机器提问，双方只用文字来回交流；判断者根据回答判断谁是机器。"
        />
        <p className={s.diagramNote}>
          它考察机器在对话中的表现；难以分辨身份，并不等于证明机器拥有人的思想。
        </p>
        <DialogClose className={`${shared.primary} ${s.close}`}>
          <X size={20} />
          回到故事
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export function TuringScene() {
  const [v, set] = useSceneState('turing', { storyIndex: 0 });
  const index = stories[v.storyIndex] ? v.storyIndex : 0;
  return (
    <Stage label="AI ORIGINS · 人工智能的早期探索" title="图灵：从密码到智能">
      <Tabs
        className={s.storyTabs}
        value={index}
        onValueChange={(value) => set({ storyIndex: Number(value) })}
      >
        <div className={s.topRow}>
          <TabsList className={s.tabsList} aria-label="图灵的三个故事">
            {stories.map((story, i) => (
              <TabsTrigger className={s.tab} key={story.tab} value={i}>
                {story.tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <HistorySources />
        </div>
        {stories.map((story, i) => (
          <TabsContent className={s.story} key={story.tab} value={i}>
            <div className={s.picture}>
              <img
                src={asset(story.image)}
                alt={story.alt}
                width={1536}
                height={1024}
              />
            </div>
            <article className={s.caption}>
              <span className={s.date}>{story.date}</span>
              <h3>{story.title}</h3>
              <p className={s.body}>{story.body}</p>
              <ol
                className={s.tags}
                aria-label={i === 1 ? '图灵机的基本动作' : '故事关键词'}
              >
                {story.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ol>
              <p className={s.idea}>{story.idea}</p>
              <p className={s.note}>{story.note}</p>
              {i === 2 && <TuringDiagram />}
            </article>
          </TabsContent>
        ))}
      </Tabs>
    </Stage>
  );
}
