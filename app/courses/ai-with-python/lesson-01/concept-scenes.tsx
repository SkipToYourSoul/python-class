/* oxlint-disable next/no-img-element -- Supplied teaching illustrations. */
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Stage,
  Choices,
  Steps,
  CheckpointTaskTemplate,
  ControlledMedia,
  asset,
  useSceneState,
} from './lesson-ui';
import s from './lesson-review.module.css';
import { TuringScene } from './turing-scene';
import { AgiScene } from './agi-scene';
import { SamuelScene } from './samuel-scene';
import { LearningAnalogyScene } from './learning-analogy-scene';
import { DiscussionScene } from './discussion-scene';
import { TrainPredictScene } from './train-predict-scene';
import { XiaopaiSpeech } from './xiaopai-speech';
import { StudentWorldGallery } from './student-world-gallery';
import galleryStyles from './student-world-gallery.module.css';

const milestones = [
  {
    year: '1956',
    title: '人工智能成为一个研究方向',
    copy: '研究者在达特茅斯聚会，讨论怎样让机器表现出智能。这个名称已出现在 1955 年的会议提案中。',
    image: 'atlas-1956.png',
    source:
      'https://www-formal.stanford.edu/jmc/history/dartmouth/dartmouth.html',
  },
  {
    year: '1959',
    title: '提出“机器学习”的概念',
    copy: '亚瑟·塞缪尔研究让计算机从下棋经验中进步。“机器学习”是一类让计算机从数据或经验中学习的方法，包含多种算法。',
    image: 'atlas-1959.png',
    imageAlt: '1959 年塞缪尔机器学习研究的主题插画：计算机与西洋跳棋',
    source: 'https://doi.org/10.1147/rd.33.0210',
  },
  {
    year: '2006',
    title: '训练更深的网络有了新进展',
    copy: '研究者提出新的训练方法，为后来深度学习的发展提供了重要推动。',
    image: 'atlas-2006.png',
    source: 'https://www.cs.toronto.edu/~hinton/absps/fastnc.pdf',
  },
  {
    year: '2017',
    title: 'Transformer 架构被提出',
    copy: '一种处理信息的新方法出现。后来，许多大语言模型采用了这一架构。',
    image: 'atlas-2017.png',
    source: 'https://arxiv.org/abs/1706.03762',
  },
];
function Milestones() {
  const [v, set] = useSceneState('milestones', { index: 0 });
  const m = milestones[v.index] ?? milestones[0];
  return (
    <Stage label="AI EXPLORER · 发展线索" title="AI 的本领，是一步步发展起来的">
      <Steps
        items={milestones.map((x) => x.year)}
        index={v.index}
        onChange={(index) => set({ index })}
      />
      <div className={s.two}>
        <figure className={s.timelineImage}>
          <img
            src={asset(m.image)}
            alt={m.imageAlt ?? `${m.year} 年的历史主题插画`}
          />
        </figure>
        <div className={`${s.stack} ${s.center}`}>
          <strong className={s.bigYear}>{m.year}</strong>
          <h3>{m.title}</h3>
          <p>{m.copy}</p>
          <a
            className={s.source}
            href={m.source}
            target="_blank"
            rel="noreferrer"
          >
            查看原始研究资料
          </a>
        </div>
      </div>
    </Stage>
  );
}

const filmCases = [
  {
    title: '《我，机器人》',
    year: '2004 · 影视',
    image: 'image56.GIF',
    ability: '像片中的机器人一样，在生活中灵活完成多种任务。',
    result: '部分实现',
    evidence:
      'Figure 展示了连续完成取放餐具等家务任务的机器人；这说明特定任务取得进展，还不能据此推断它具备影片中的全部能力。',
    source: 'https://www.figure.ai/news/helix-02',
    sourceTitle: 'Figure · Helix 02（2026）',
  },
  {
    title: '《钢铁侠》',
    year: '2008 · 影视',
    image: 'image59.GIF',
    ability: '听懂语音、观察画面，并与人讨论眼前的问题。',
    result: '部分实现',
    evidence:
      'Project Astra 展示了结合语音与视觉的助手能力。能讨论眼前画面，与可靠地处理影片中所有复杂任务，仍是不同的要求。',
    source: 'https://deepmind.google/models/project-astra/',
    sourceTitle: 'Google DeepMind · Project Astra',
  },
  {
    title: '《星球大战》',
    year: '2015 · 影视',
    image: 'image57.GIF',
    ability: '像机器人伙伴一样，长期独立应对陌生环境与新任务。',
    result: '仍在探索',
    evidence:
      '已有机器人能在演示中完成具体任务。但这些演示不足以证明它能长期、可靠地应对影片里那样的未知情况。判断前要先约定任务和条件。',
    source: 'https://www.figure.ai/news/helix',
    sourceTitle: 'Figure · Helix（2025）',
  },
  {
    title: '春晚机器人舞蹈',
    year: '2025 · 真实演出',
    image: 'image58.GIF',
    ability: '在排练和编排好的舞台上，协调动作完成群舞。',
    result: '已经实现',
    evidence:
      '2025 年春晚已有机器人群舞表演。这个事实支持“完成编排舞蹈”，并不等于机器人能自行理解所有艺术创作。',
    source: 'https://www.unitree.com/about/',
    sourceTitle: '宇树科技 · 2025 春晚记录',
  },
];
function Future({ active }: { active: boolean }) {
  const [v, set] = useSceneState('future', {
    index: 0,
    answers: [-1, -1, -1, -1],
    shown: [false, false, false, false],
  });
  const c = filmCases[v.index] ?? filmCases[0];
  return (
    <Stage
      label="AI EXPLORER · 证据与想象"
      title="影视里的能力，现实做到了哪一步？"
    >
      <Steps
        items={filmCases.map((x) => x.title)}
        index={v.index}
        onChange={(index) => set({ index })}
      />
      <div className={`${s.two} ${s.wideLeft}`}>
        <ControlledMedia
          key={c.image}
          src={asset(c.image)}
          alt={c.title}
          active={active}
        />
        <div className={s.stack}>
          <span className={s.tag}>{c.year}</span>
          <p>{c.ability}</p>
          <Choices
            label="能力实现程度"
            items={['已经实现', '部分实现', '仍在探索', '暂时无法判断']}
            value={v.answers[v.index]}
            onChange={(answer) => {
              const answers = [...v.answers];
              answers[v.index] = answer;
              set({ answers });
            }}
          />
          <button
            className={s.primary}
            onClick={() => {
              const shown = [...v.shown];
              shown[v.index] = !shown[v.index];
              set({ shown });
            }}
          >
            {v.shown[v.index] ? '收起参考证据' : '对照现实证据'}
          </button>
          {v.shown[v.index] && (
            <div className={`${s.panel} ${s.small}`} aria-live="polite">
              <strong>参考判断：{c.result}</strong>
              <p>{c.evidence}</p>
              <a
                className={s.source}
                href={c.source}
                target="_blank"
                rel="noreferrer"
              >
                {c.sourceTitle}
              </a>
            </div>
          )}
        </div>
      </div>
      <p className={s.small}>
        判断对象是上面写明的能力。现实证据核对于 2026 年 9 月；你的选择会保留。
      </p>
    </Stage>
  );
}

const artworks = [
  ['01-home.png', '窗外是鲸鱼'],
  ['02-school.png', '走进课本里的森林'],
  ['03-nature.png', '长在树上的城市'],
  ['04-friends.png', '听懂动物的心愿'],
  ['05-explore.png', '月球上的周末'],
];
function Practice({ active }: { active: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  return (
    <>
      <CheckpointTaskTemplate
        number="01"
        title="在AI时代，你心中未来的世界是什么模样？"
        question="在AI时代，你心中未来的世界是什么模样？"
        instruction="请在白纸上写出或画出未来世界的模样！"
        tip="生活、学校、自然、朋友、远方……可以从任何地方开始。"
        illustration={{
          src: asset('future-world/creative-task.png'),
          alt: '大胆想象：孩子用彩色画笔描绘未来，鲸鱼在星空中游动，树屋漂浮在空中。在白纸上写出或画出你心中的未来世界，没有标准答案。',
        }}
      >
        <p className={s.creativeInstruction}>
          请在<strong>白纸</strong>上“<strong>写出 / 画出</strong>
          ”未来世界的模样！
        </p>
        <div className={s.artGrid}>
          {artworks.map(([file, title], i) => (
            <button
              key={file}
              className={s.artButton}
              onClick={() => setIndex(i)}
            >
              <img src={asset(`future-world/${file}`)} alt={title} />
              <span>{title}</span>
            </button>
          ))}
        </div>
        <div className={galleryStyles.practiceFooter}>
          <XiaopaiSpeech
            active={active && index === null && !galleryOpen}
            compact
          />
          <StudentWorldGallery
            active={active}
            open={galleryOpen}
            onOpenChange={setGalleryOpen}
          />
        </div>
      </CheckpointTaskTemplate>
      <Dialog
        open={index !== null}
        onOpenChange={(open) => {
          if (!open) setIndex(null);
        }}
      >
        <DialogContent className={`${s.modal} ${s.imageModal}`}>
          <DialogHeader>
            <DialogTitle>{artworks[index ?? 0][1]}</DialogTitle>
            <DialogDescription>
              未来世界作品参考 · {(index ?? 0) + 1} / 5
            </DialogDescription>
          </DialogHeader>
          <img
            src={asset(`future-world/${artworks[index ?? 0][0]}`)}
            alt={artworks[index ?? 0][1]}
          />
          <div className={s.row}>
            <button
              className={s.secondary}
              onClick={() => setIndex(((index ?? 0) + 4) % 5)}
            >
              上一幅
            </button>
            <button
              className={s.primary}
              onClick={() => setIndex(((index ?? 0) + 1) % 5)}
            >
              下一幅
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ConceptScene({ id, active }: { id: string; active: boolean }) {
  switch (id) {
    case 'chapter-1-turing':
      return <TuringScene />;
    case 'chapter-1-milestones':
      return <Milestones />;
    case 'chapter-1-future':
      return <Future active={active} />;
    case 'chapter-1-agi':
      return <AgiScene active={active} />;
    case 'chapter-1-samuel':
      return <SamuelScene />;
    case 'chapter-1-learning-analogy':
      return <LearningAnalogyScene active={active} />;
    case 'chapter-1-train-predict':
      return <TrainPredictScene />;
    case 'chapter-1-discussion':
      return <DiscussionScene />;
    case 'chapter-1-practice':
      return <Practice active={active} />;
    default:
      return null;
  }
}
