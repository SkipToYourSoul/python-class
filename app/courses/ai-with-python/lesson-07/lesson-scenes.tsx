/* oxlint-disable next/no-img-element -- Local artwork and pre-rendered source slides. */
'use client';

import type { ReactNode } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Cpu,
  Flower2,
  ListFilter,
  Ruler,
  Search,
  Shapes,
  Tag,
  Tags,
  Trophy,
} from 'lucide-react';
import { ChapterCover } from '@/components/course/ai-with-python/chapter-cover';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { LessonCover } from '@/components/course/ai-with-python/lesson-cover';
import { XiaopaiSpeech } from '@/components/course/ai-with-python/xiaopai-speech';
import { usePageState } from '@/components/course/lesson-state';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { TreeAnatomy, TreeConcept, TreeGoal } from './decision-tree-explainer';
import { TreePractice } from './decision-tree-practice';
import { FlowerMeasurement } from './flower-measurement';
import { GottmanCase } from './gottman-case';
import {
  assetBase,
  chapterTasks,
  firstChapterTitle,
  scenes,
  secondChapterTitle,
  thirdChapterTitle,
  type LessonSevenScene,
} from './lesson-data';
import {
  FlowerDataTable,
  LabeledFlowerCatalog,
  ScatterObservation,
} from './investigation';
import {
  FlowerFloorIntro,
  GiftReveal,
  Hyperplanes,
  MarginLesson,
  ModelComparison,
  SupervisedSummary,
  TreeReview,
} from './svm-lesson';
import { SvmPractice } from './svm-practice';
import {
  TreeConditions,
  TreeDataSplit,
  TreeModelDiscussion,
} from './tree-setup';
import s from './lesson.module.css';

function Cover() {
  return (
    <LessonCover
      lessonLabel="第七课 · LESSON 07"
      title={['送你一朵', '小红花']}
      subtitle="让机器帮你分类"
      description="看图找线索，训练分类模型。"
      nextScene="l7-recap"
      startLabel="跟勇士去花房"
      story={{
        label: '第七课开场漫画',
        question: '这朵鸢尾花是哪一种？',
        image: `${assetBase}/assets/royal-gift.png`,
        alt: '三格漫画：勇士凯旋走进城堡，公主递给他一朵紫色鸢尾花，花茎上系着一张折起来的花签。',
        width: 1672,
        height: 941,
        setup: '勇士战胜魔王回到城堡，公主送给他一朵漂亮的鸢尾花。',
        hook: '勇士看着还没打开的花签：“这朵花是哪一种？”',
      }}
    />
  );
}

function CharacterSpeech({
  name,
  portrait,
  children,
  className = '',
}: {
  name: string;
  portrait: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${s.characterSpeech} ${className}`}>
      <figure className={s.speakerPortrait}>
        <img
          src={`${assetBase}/assets/${portrait}`}
          alt=""
          width={384}
          height={384}
        />
        <figcaption>{name}</figcaption>
      </figure>
      <blockquote className={s.speechBubble}>{children}</blockquote>
    </div>
  );
}

const learningSteps = [
  { title: '现实问题', text: '公主送的礼花是哪一种？', icon: Flower2 },
  { title: '变成数据', text: '用花瓣长宽等数字描述礼花。', icon: Ruler },
  { title: '模型学习', text: '让模型从已有的样本里找规律。', icon: Cpu },
  { title: '回到问题', text: '用学到的规律预测礼花的种名。', icon: Tag },
];

const irisMeasurementNames = evidence.features;

const flowerLearningSteps = [
  {
    title: '选择模型',
    text: '勇士要从三个种名中选一个，先选用分类模型。',
    note: '目标 · 预测类别',
    icon: ListFilter,
  },
  {
    title: '准备训练数据',
    text: (
      <>
        从花谱取每朵花的
        {irisMeasurementNames.map((name, index) => (
          <span key={name} className={s.flowFeature}>
            {name}
            {index < irisMeasurementNames.length - 1 ? '、' : '（厘米）'}
          </span>
        ))}
        ，配上已知种名。
      </>
    ),
    note: '已知种名就是标签',
    icon: BookOpen,
  },
  {
    title: '训练模型',
    text: '把测量记录和标签一起交给模型，让它学习怎样区分三种鸢尾。',
    note: '得到训练好的模型',
    icon: Cpu,
  },
  {
    title: '预测种名',
    text: '只输入礼花的测量记录，让训练好的模型预测种名。',
    note: '预测后打开花签核对',
    icon: Flower2,
  },
];

const gottmanLearningSteps = [
  {
    title: '选择模型',
    text: '要在「离婚」和「未离婚」中选一个，所以选分类模型。',
    art: 'select',
  },
  {
    title: '准备训练数据',
    text: '把同一对夫妻的评分和随访结果配成一条样本。',
    art: 'prepare',
  },
  {
    title: '训练模型',
    text: '用多条带标签的样本，让模型学会找规律。',
    art: 'train',
  },
  {
    title: '预测并核对',
    text: '只输入新对话的评分。先预测，再用随访结果核对。',
    art: 'predict',
  },
];

const firstFlowerRecord = evidence.tableRows[0];

function ClassificationFlow({
  steps,
  label,
}: {
  steps: typeof flowerLearningSteps;
  label: string;
}) {
  return (
    <ol className={`${s.recapFlow} ${s.supervisedFlow}`} aria-label={label}>
      {steps.map(({ title, text, note, icon: Icon }, index) => (
        <li key={title}>
          <div className={s.flowStepHeader} aria-hidden="true">
            <span className={s.bridgeNumber}>{index + 1}</span>
            <Icon className={s.bridgeIcon} />
          </div>
          <h3>{title}</h3>
          <p>{text}</p>
          <strong className={s.flowStepNote}>{note}</strong>
          {index < steps.length - 1 && (
            <ArrowRight className={s.bridgeArrow} aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}

const learningMethods = [
  {
    title: '监督学习',
    text: '用带标签的样本训练模型，再用学到的规律预测新样本。',
    icon: Tag,
    focus: true,
  },
  {
    title: '无监督学习',
    text: '从没有标签的数据里找结构，比如把相似的样本分成组。',
    icon: Shapes,
  },
  {
    title: '强化学习',
    text: '尝试不同的行动，根据获得的奖励学习怎么做得更好。',
    icon: Trophy,
  },
];

const petExample = `${assetBase}/assets/pet-example`;
const petSamples = [
  { label: '猫', photos: ['cat-1', 'cat-2'] },
  { label: '狗', photos: ['dog-1', 'dog-2'] },
];

function LearningMethods() {
  return (
    <div className={`${s.learningBridge} ${s.methodLesson}`}>
      <div className={s.methodDiagram}>
        <div className={s.methodRoot}>
          机器学习 <span>按学习方式分</span>
        </div>
        <ul className={s.methodBranches} aria-label="三种常见的机器学习方式">
          {learningMethods.map(({ title, text, icon: Icon, focus }) => (
            <li key={title} className={focus ? s.methodFocus : undefined}>
              <div className={s.methodHeading}>
                <Icon className={s.bridgeIcon} aria-hidden="true" />
                <h3>{title}</h3>
                {focus && <span>本课重点</span>}
              </div>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.petExample} aria-label="用照片学习区分猫和狗的示意">
        <section className={s.petPanel}>
          <h3>01 · 训练</h3>
          <div className={s.petFlow}>
            <div className={s.petInput}>
              <div className={s.petGroups}>
                {petSamples.map(({ label, photos }) => (
                  <div key={label} className={s.petSample}>
                    <div className={s.petPhotos}>
                      {photos.map((photo) => (
                        <img
                          key={photo}
                          src={`${petExample}/${photo}.png`}
                          alt=""
                        />
                      ))}
                    </div>
                    <span className={s.petTag}>
                      <Tag size={16} aria-hidden="true" />
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <p>照片＋已知标签</p>
            </div>
            <ArrowRight className={s.petArrow} aria-hidden="true" />
            <div className={s.petModel}>
              <Cpu aria-hidden="true" />
              <p>
                模型学习
                <br />
                区分猫和狗
              </p>
            </div>
          </div>
        </section>
        <section className={s.petPanel}>
          <h3>02 · 预测</h3>
          <div className={s.petFlow}>
            <div className={s.petInput}>
              <img
                className={s.newPetPhoto}
                src={`${petExample}/new-dog.png`}
                alt="一张新的柴犬照片"
              />
              <p>只给一张新照片</p>
            </div>
            <ArrowRight className={s.petArrow} aria-hidden="true" />
            <div className={s.petModel}>
              <Cpu aria-hidden="true" />
              <p>训练好的模型</p>
              <strong className={s.petTag}>预测为「狗」</strong>
            </div>
          </div>
        </section>
      </div>
      <CharacterSpeech name="公主" portrait="princess-chibi.png">
        猫和狗的照片有标签。园丁的鸢尾花样本，标签又是什么？
      </CharacterSpeech>
    </div>
  );
}

const irisArt = `${assetBase}/assets/iris-intro`;

function IrisIntroduction() {
  return (
    <div className={s.irisGuide}>
      <figure className={s.irisEntry}>
        <div className={`${s.irisImages} ${s.irisPhotos}`}>
          <img
            src={`${irisArt}/iris-closeup.webp`}
            alt="紫色鸢尾花特写，花瓣向上伸展或向下展开。"
          />
          <img
            src={`${irisArt}/iris-field.webp`}
            alt="山脚下开着许多紫色鸢尾花。"
          />
        </div>
        <figcaption>
          <h3>花是什么样的？</h3>
          <p>
            鸢尾是鸢尾科的多年生草本，有些鸢尾也叫“蓝蝴蝶”。鸢尾属约有 300
            种，广布于北半球温带。
          </p>
        </figcaption>
      </figure>
      <figure className={s.irisEntry}>
        <div className={`${s.irisImages} ${s.irisMyth}`}>
          <img
            src={`${irisArt}/rainbow-goddess.webp`}
            alt="古希腊彩虹女神伊里斯的插画。"
          />
        </div>
        <figcaption>
          <h3>Iris 从哪儿来？</h3>
          <p>鸢尾属的学名 Iris 来自古希腊神话中的彩虹女神伊里斯。</p>
        </figcaption>
      </figure>
      <figure className={s.irisEntry}>
        <div className={`${s.irisImages} ${s.irisInArt}`}>
          <img
            src={`${irisArt}/van-gogh.webp`}
            alt="梵高笔下的紫蓝色鸢尾花。"
          />
          <img src={`${irisArt}/monet.webp`} alt="莫奈画作中的鸢尾花。" />
          <img src={`${irisArt}/tiara.webp`} alt="带花形装饰的冠饰。" />
          <img src={`${irisArt}/iris-brooch.webp`} alt="鸢尾花造型的胸针。" />
        </div>
        <figcaption>
          <h3>花形走进了艺术</h3>
          <p>梵高和莫奈画过鸢尾花。冠饰和珠宝上也能找到它的花形。</p>
        </figcaption>
      </figure>
    </div>
  );
}

function PcaMistakePrompt() {
  const [state, setState] = usePageState({ showPcaMistake: false });

  return (
    <figcaption className={s.pcaQuestion}>
      <p>
        找一个<b>浅蓝区里的绿色叉号</b>。它实际是哪种花？模型把它分成了哪种？
      </p>
      <button
        type="button"
        className={s.button}
        aria-controls="l7-pca-mistake"
        aria-expanded={state.showPcaMistake}
        onClick={() => setState({ showPcaMistake: !state.showPcaMistake })}
      >
        {state.showPcaMistake ? '收起解释' : '核对原因'}
      </button>
      <p id="l7-pca-mistake" hidden={!state.showPcaMistake}>
        绿色叉号是<b>变色鸢尾</b>。它落进浅蓝区，二维模型把它判成了
        <b>维吉尼亚鸢尾</b>，所以分错了。
      </p>
    </figcaption>
  );
}

function TeachingFrame({
  scene,
  label,
  children,
}: {
  scene: LessonSevenScene;
  label: string;
  children: ReactNode;
}) {
  return (
    <Stage title={scene.title} label={label}>
      {children}
    </Stage>
  );
}

export function LessonScenes({ id }: { id: string }) {
  const scene = scenes.find((item) => item.id === id);
  if (!scene) return null;

  switch (scene.id) {
    case 'l7-cover':
      return <Cover />;
    case 'l7-recap':
      return (
        <img
          className={s.recapImage}
          src="/courses/ai-with-python/lesson-06/assets/data-journey-summary.png"
          alt="前情提要漫画。勇士和伙伴从网页获取情报、保存档案、筛选数据并绘制图表，接着尝试用数据训练模型，判断新样本。"
          width={1672}
          height={941}
        />
      );
    case 'l7-one-cover':
    case 'l7-two-cover':
    case 'l7-three-cover': {
      const number = {
        'l7-one-cover': '01',
        'l7-two-cover': '02',
        'l7-three-cover': '03',
      }[scene.id];
      const titleLines = {
        'l7-one-cover': firstChapterTitle,
        'l7-two-cover': secondChapterTitle,
        'l7-three-cover': thirdChapterTitle,
      }[scene.id];
      const [taskLead, taskFollowUp] = chapterTasks[scene.id].split('\n');
      return (
        <ChapterCover
          number={number}
          title={
            <span className={s.chapterTitleLines}>{titleLines.join('\n')}</span>
          }
          kicker="城堡花房调查"
          task={
            taskFollowUp ? (
              <>
                {taskLead}
                <br />
                {taskFollowUp}
              </>
            ) : (
              taskLead
            )
          }
        />
      );
    }
    case 'l7-iris':
      return (
        <TeachingFrame scene={scene} label="鸢尾花图鉴">
          <IrisIntroduction />
        </TeachingFrame>
      );
    case 'l7-culture':
      return (
        <TeachingFrame scene={scene} label="课堂思考 · 公主的礼物">
          <div className={s.giftLayout}>
            <figure className={`${s.comicPanel} ${s.giftComic}`}>
              <img
                src={`${assetBase}/assets/royal-gift.png`}
                alt="公主把一朵紫色鸢尾花递给勇士，花茎上系着折起来的花签。"
              />
            </figure>
            <div className={s.giftBrief}>
              <CharacterSpeech name="公主" portrait="princess-chibi.png">
                园丁把种名写在花签里了。
                <strong>
                  <span>打开之前，</span>
                  <wbr />
                  <span>我们先猜猜看？</span>
                </strong>
              </CharacterSpeech>
              <section
                className={s.giftDiscussion}
                aria-labelledby="gift-discussion"
              >
                <h3 id="gift-discussion">
                  <Search aria-hidden="true" />
                  找线索
                </h3>
                <ol>
                  <li>
                    <span aria-hidden="true">01</span>
                    <div>
                      <strong>观察花朵</strong>
                      <p>你最先注意到它的哪个特点？</p>
                    </div>
                  </li>
                  <li>
                    <span aria-hidden="true">02</span>
                    <div>
                      <strong>还缺什么</strong>
                      <p>如果要确认它是哪一种，你还想知道什么？</p>
                    </div>
                  </li>
                </ol>
              </section>
            </div>
          </div>
        </TeachingFrame>
      );
    case 'l7-floor-story':
      return (
        <TeachingFrame scene={scene} label="漫画 · 城堡花房">
          <FlowerFloorIntro
            comic={
              <figure className={`${s.comicPanel} ${s.floorComic}`}>
                <img
                  src={`${assetBase}/assets/flower-room.png`}
                  alt="公主和勇士蹲在花房地上，拉起细线，旁边摆着两群花点。"
                />
              </figure>
            }
          >
            <CharacterSpeech
              name="公主"
              portrait="princess-chibi.png"
              className={s.floorSpeech}
            >
              刚才，决策树让两朵花走了不同的分支。现在看我在花房地上拉一条线，把两群花点分开！
            </CharacterSpeech>
          </FlowerFloorIntro>
        </TeachingFrame>
      );
    case 'l7-ml-recap':
      return (
        <TeachingFrame scene={scene} label="第一节 · 回顾机器学习">
          <div className={s.learningBridge}>
            <section
              className={s.samuelNote}
              aria-label="亚瑟·塞缪尔对机器学习的定义"
            >
              <img
                src={`${assetBase}/assets/arthur-samuel.jpeg`}
                alt="原课件中的亚瑟·塞缪尔照片"
                width={210}
                height={240}
              />
              <div>
                <p className={s.samuelName}>
                  <b>亚瑟·塞缪尔</b> <span lang="en">Arthur Samuel</span>
                </p>
                <blockquote>
                  <p>
                    研究如何让计算机具备学习能力，而无需事先把每条规则写进程序。
                  </p>
                  <p lang="en">
                    “Field of study that gives computers the ability to learn
                    without being explicitly programmed.”
                  </p>
                </blockquote>
              </div>
            </section>
            <ol className={s.recapFlow} aria-label="机器学习的基本思路">
              {learningSteps.map(({ title, text, icon: Icon }, index) => (
                <li key={title}>
                  <span className={s.bridgeNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <Icon className={s.bridgeIcon} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {index < learningSteps.length - 1 && (
                    <ArrowRight className={s.bridgeArrow} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            <CharacterSpeech
              name="勇士"
              portrait="warrior-chibi.png"
              className={s.warriorSpeech}
            >
              机器要从样本里学，
              <strong>那我们该给它什么样的样本？</strong>
            </CharacterSpeech>
          </div>
        </TeachingFrame>
      );
    case 'l7-learning-methods':
      return (
        <TeachingFrame scene={scene} label="第一节 · 机器学习的方式">
          <LearningMethods />
        </TeachingFrame>
      );
    case 'l7-ai':
      return (
        <TeachingFrame scene={scene} label="第一节 · 监督学习">
          <div className={s.irisDatasetIntro}>
            <CharacterSpeech
              name="园丁"
              portrait="gardener-chibi.png"
              className={s.gardenerSpeech}
            >
              想知道公主送的是哪一种？先翻翻我的花谱。
              <strong>花谱上写好的种名，就是训练用的标签。</strong>
            </CharacterSpeech>
            <aside className={s.catalogHistory}>
              <b>Iris 鸢尾花数据集</b>
              <p>
                植物学家埃德加·安德森采集了这些数据。1936
                年，英国统计学家兼生物学家罗纳德·费希尔（Ronald
                Fisher）将其用于早期的分类研究。
              </p>
            </aside>
          </div>
          <div className={s.learningFlow}>
            <section className={s.learningPhase}>
              <header className={s.catalogHeading}>
                <h3>01 · 训练</h3>
                <span className={s.catalogStats}>
                  城堡花谱 · 150 条样本 · 3 个类别，每类 50 条
                </span>
              </header>
              <LabeledFlowerCatalog />
              <div className={s.sampleKey}>
                <p className={s.sampleFeatures}>
                  <b>四项测量（厘米）</b>
                  {irisMeasurementNames.map((name) => (
                    <span key={name}>{name}</span>
                  ))}
                </p>
                <p>
                  每朵样本花的四项测量值和<b>已知种名（标签）</b>一起用于训练。
                </p>
              </div>
            </section>
            <section className={s.learningPhase}>
              <h3>02 · 预测</h3>
              <div className={s.predictionDemo}>
                <figure className={`${s.comicPanel} ${s.predictionComic}`}>
                  <img
                    src={`${assetBase}/assets/royal-gift.png`}
                    alt="公主送的鸢尾花，花茎上系着尚未打开的花签。"
                  />
                </figure>
                <ol className={s.predictionSteps}>
                  <li>只给礼花的四项测量值</li>
                  <li>
                    <ArrowDown size={20} aria-hidden="true" />
                    交给训练好的模型
                  </li>
                  <li>
                    <ArrowDown size={20} aria-hidden="true" />
                    <strong>预测礼花的种名</strong>
                  </li>
                </ol>
              </div>
              <p className={s.predictionQuestion}>哪边的种名可以先给机器看？</p>
            </section>
          </div>
        </TeachingFrame>
      );
    case 'l7-tasks':
      return (
        <TeachingFrame scene={scene} label="AI TIME · 分类与回归">
          <div className={s.lessonPair}>
            <CharacterSpeech
              name="园丁"
              portrait="gardener-chibi.png"
              className={s.gardenerSpeech}
            >
              监督学习常见的两类任务是<b>分类和回归</b>。
            </CharacterSpeech>
            <div className={s.taskComparison}>
              <article className={s.taskExample}>
                <h3>
                  <Tags size={28} aria-hidden="true" /> 分类
                  <span className={s.taskFocus}>本课任务 · 识别礼花</span>
                </h3>
                <p className={s.taskQuestion}>猜这朵花的种名</p>
                <div className={s.taskOutcome}>
                  <b>预测一个类别</b>
                  <p className={s.taskResult}>
                    <span>示例</span>
                    <strong>山鸢尾</strong>
                  </p>
                  <p>从花谱的三种鸢尾中选一种。</p>
                </div>
              </article>
              <article className={`${s.taskExample} ${s.regressionExample}`}>
                <h3>
                  <Ruler size={28} aria-hidden="true" /> 回归
                </h3>
                <p className={s.taskQuestion}>猜这株花下周有多高</p>
                <div className={s.taskOutcome}>
                  <b>预测一个数值</b>
                  <p className={s.taskResult}>
                    <span>示例</span>
                    <strong>
                      28.5 <small>厘米</small>
                    </strong>
                  </p>
                  <p>预测的高度可以带小数。</p>
                </div>
              </article>
            </div>
            <XiaopaiSpeech active compact animated={false} label="小派提问">
              <strong>生活中哪里会用到分类？</strong>
              举个例子，说说机器会看到什么，又要从哪些类别里选。
            </XiaopaiSpeech>
          </div>
        </TeachingFrame>
      );
    case 'l7-flow':
      return (
        <TeachingFrame scene={scene} label="第一节 · 监督学习的流程">
          <div className={s.learningBridge}>
            <CharacterSpeech
              name="勇士"
              portrait="warrior-chibi.png"
              className={s.warriorSpeech}
            >
              我们要猜的是种名，所以选分类。接下来，看看怎么用花谱训练模型。
            </CharacterSpeech>
            <ClassificationFlow
              steps={flowerLearningSteps}
              label="用花谱给礼花分类的四步"
            />
          </div>
        </TeachingFrame>
      );
    case 'l7-case-intro':
      return (
        <TeachingFrame scene={scene} label="分类案例 · 人物与作品">
          <div className={s.learningBridge}>
            <div className={s.caseProfile}>
              <article>
                <img
                  src={`${assetBase}/assets/gottman-ppt15-portrait.jpeg`}
                  alt="微笑的约翰·戈特曼"
                  width={306}
                  height={405}
                />
                <div>
                  <span className={s.caseStamp}>心理学家</span>
                  <h3>约翰·戈特曼</h3>
                  <p className={s.caseByline} lang="en">
                    John Gottman
                  </p>
                  <p>
                    他是美国心理学家，几十年来研究了数千对夫妻。他和同事观察夫妻怎样交流、怎样处理分歧，再追踪他们后来的婚姻状况。
                  </p>
                </div>
              </article>
              <article>
                <img
                  src={`${assetBase}/assets/gottman-marriage-book.jpeg`}
                  alt="《幸福的婚姻》原版课件中的中文书封，封面是两个相扣的金色戒指。"
                  width={357}
                  height={500}
                />
                <div>
                  <span className={s.caseStamp}>代表作品</span>
                  <h3>《幸福的婚姻》</h3>
                  <p className={s.caseByline}>与娜恩·西尔弗合著</p>
                  <p>
                    两位作者把研究写成七条相处原则和练习，帮助夫妻了解彼此、培养友谊、处理分歧。
                  </p>
                </div>
              </article>
            </div>
            <CharacterSpeech
              name="勇士"
              portrait="warrior-chibi.png"
              className={s.warriorSpeech}
            >
              夫妻聊天时的表现，怎么能成为预测离婚的线索？
            </CharacterSpeech>
          </div>
        </TeachingFrame>
      );
    case 'l7-case':
      return (
        <TeachingFrame scene={scene} label="分类案例 · 认识输入和标签">
          <GottmanCase />
        </TeachingFrame>
      );
    case 'l7-case-flow':
      return (
        <TeachingFrame scene={scene} label="分类案例 · 四步示意">
          <div className={s.caseLesson}>
            <table className={s.caseComparison}>
              <caption>每一行都是一条带标签的样本</caption>
              <thead>
                <tr>
                  <th scope="col">样本</th>
                  <th scope="col">输入 · 模型看到的记录</th>
                  <th scope="col">标签 · 已知的结果</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    一对夫妻
                    <small>教学示例</small>
                  </th>
                  <td>
                    <small>对话评分（节选）</small>
                    <div className={s.caseReadings}>
                      <span>
                        幽默 <b>+4</b>
                      </span>
                      <span>
                        蔑视 <b>−4</b>
                      </span>
                    </div>
                  </td>
                  <td>
                    <small>随访时是否离婚</small>
                    <strong>未离婚</strong>
                  </td>
                </tr>
                <tr>
                  <th scope="row">花谱里的一朵鸢尾花</th>
                  <td>
                    <small>四项测量读数（厘米）</small>
                    <div className={s.caseReadings}>
                      {evidence.features.map((feature, index) => (
                        <span key={feature}>
                          {feature} <b>{firstFlowerRecord[index].toFixed(1)}</b>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <small>园丁标好的种名</small>
                    <strong>{evidence.labels[firstFlowerRecord[4]]}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <ol
              className={`${s.recapFlow} ${s.caseFlow}`}
              aria-label="用对话做分类的四步"
            >
              {gottmanLearningSteps.map(({ title, text, art }, index) => (
                <li key={title}>
                  <span className={s.bridgeNumber} aria-hidden="true">
                    {index + 1}
                  </span>
                  <img
                    className={s.caseStepArt}
                    src={`${assetBase}/assets/gottman-step-${art}.png`}
                    alt=""
                    width={480}
                    height={320}
                  />
                  <h3>{title}</h3>
                  <p>{text}</p>
                  {index < gottmanLearningSteps.length - 1 && (
                    <ArrowRight className={s.bridgeArrow} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </TeachingFrame>
      );
    case 'l7-measure-story':
      return (
        <TeachingFrame scene={scene} label="漫画 · 城堡花房">
          <FlowerMeasurement />
        </TeachingFrame>
      );
    case 'l7-data':
      return (
        <TeachingFrame scene={scene} label="第一节 · 鸢尾花数据集">
          <div className={`${s.stack} ${s.flowerDataLesson}`}>
            <CharacterSpeech
              name="园丁"
              portrait="gardener-chibi.png"
              className={s.gardenerSpeech}
            >
              表里每一行都是一朵花。顺着箭头，把上一页「看示范」的四项读数填进第一行。
            </CharacterSpeech>
            <FlowerDataTable />
            <p className={s.feedback}>
              <b>你的礼花实测卡</b>
              <span>
                下一页，用你填在卡里的花瓣长、宽，在散点图上给礼花定位。
              </span>
            </p>
          </div>
        </TeachingFrame>
      );
    case 'l7-practice-01':
      return (
        <TeachingFrame scene={scene} label="CLASS PRACTICE · 课堂练习 01">
          <ScatterObservation />
        </TeachingFrame>
      );
    case 'l7-cards-story':
      return (
        <TeachingFrame scene={scene} label="第二节 · 选择合适的模型">
          <div className={s.learningBridge}>
            <CharacterSpeech
              name="勇士"
              portrait="warrior-chibi.png"
              className={s.warriorSpeech}
            >
              问题和带标签的花谱都准备好了，接下来选什么模型？
            </CharacterSpeech>
            <TreeConditions />
          </div>
        </TeachingFrame>
      );
    case 'l7-tree-concept':
      return (
        <TeachingFrame scene={scene} label="第二节 · 什么是决策树">
          <TreeConcept />
        </TeachingFrame>
      );
    case 'l7-split':
      return (
        <TeachingFrame scene={scene} label="第二节 · 决策树训练的目标">
          <TreeGoal />
        </TeachingFrame>
      );
    case 'l7-tree-path':
      return (
        <TeachingFrame scene={scene} label="第二节 · 根节点、分支和叶子">
          <TreeAnatomy />
        </TeachingFrame>
      );
    case 'l7-exam':
      return (
        <TeachingFrame scene={scene} label="第二节 · 先分训练集和测试集">
          <TreeDataSplit />
        </TeachingFrame>
      );
    case 'l7-tree-discussion':
      return (
        <TeachingFrame scene={scene} label="第二节 · 思考和讨论">
          <TreeModelDiscussion />
        </TeachingFrame>
      );
    case 'l7-practice-02':
      return (
        <TeachingFrame scene={scene} label="CLASS PRACTICE · 课堂练习 02">
          <TreePractice />
        </TeachingFrame>
      );
    case 'l7-practice-03':
      return (
        <TeachingFrame scene={scene} label="CLASS PRACTICE · 课堂练习 03">
          <SvmPractice />
        </TeachingFrame>
      );
    case 'l7-tree-review':
      return (
        <TeachingFrame scene={scene} label="第三节 · 回看决策树">
          <TreeReview>
            <CharacterSpeech
              name="园丁"
              portrait="gardener-chibi.png"
              className={`${s.gardenerSpeech} ${s.treeReviewSpeech}`}
            >
              刚才我们顺着决策树猜了礼花的种名。现在换成这两朵花，它们会走到同一个种名吗？
            </CharacterSpeech>
          </TreeReview>
        </TeachingFrame>
      );
    case 'l7-margin':
      return (
        <TeachingFrame scene={scene} label="第三节 · 支持向量与最大间隔">
          <MarginLesson
            speech={(line) => (
              <CharacterSpeech
                name="公主"
                portrait="princess-chibi.png"
                className={s.floorSpeech}
              >
                {line}
              </CharacterSpeech>
            )}
          />
        </TeachingFrame>
      );
    case 'l7-hyperplane':
      return (
        <TeachingFrame scene={scene} label="第三节 · 认识超平面">
          <Hyperplanes>
            <CharacterSpeech
              name="公主"
              portrait="princess-chibi.png"
              className={s.floorSpeech}
            >
              刚才 B
              线把地上的花点分成两群。多量一项，花点就有了高低。想象一下，把 B
              线竖成一面透明隔板！
            </CharacterSpeech>
          </Hyperplanes>
        </TeachingFrame>
      );
    case 'l7-compare':
      return (
        <TeachingFrame scene={scene} label="第三节 · 在相同条件下对照">
          <ModelComparison />
        </TeachingFrame>
      );
    case 'l7-pca':
      return (
        <TeachingFrame scene={scene} label="第三节 · 读分类区域">
          <div className={s.pcaLesson}>
            <CharacterSpeech
              name="公主"
              portrait="princess-chibi.png"
              className={s.floorSpeech}
            >
              刚才的{' '}
              <b>
                {evidence.svm.correct}/{evidence.svm.total}
              </b>{' '}
              是用
              <b>四项原始读数</b>训练的线性 SVM 的成绩。这张图先用 PCA
              把四项读数合成
              <b>两个新坐标</b>（主成分 1 和
              2），再用它们另训一个模型，演示平面上怎么分类。
            </CharacterSpeech>
            <div className={s.svmProjection}>
              <figure className={s.pcaChart}>
                <img
                  src={`${assetBase}/assets/svm-pca-ppt44.png`}
                  alt="横轴为主成分 1，纵轴为主成分 2。浅红、浅绿、浅蓝三块底色表示二维示意模型的预测区域。圆点和叉号的颜色表示花的真实种类。"
                />
                <PcaMistakePrompt />
              </figure>
              <div className={s.pcaGuide}>
                <section className={s.pcaKey}>
                  <h3>颜色看种类</h3>
                  <p>
                    <b>浅底色</b>是图中模型预测的种类，<b>花点颜色</b>
                    是花的真实种类。
                  </p>
                  <ul className={s.pcaSpecies} aria-label="分类图的颜色图例">
                    {evidence.labels.map((label, index) => (
                      <li
                        key={label}
                        data-color={['red', 'green', 'blue'][index]}
                      >
                        {['红', '绿', '蓝'][index]} · {label}
                      </li>
                    ))}
                  </ul>
                </section>
                <section className={s.pcaKey}>
                  <h3>形状看用途</h3>
                  <ul className={s.pcaMarks}>
                    <li>
                      <b aria-hidden="true">●</b> 圆点是训练卡
                    </li>
                    <li>
                      <b aria-hidden="true">×</b> 叉号是测试卡
                    </li>
                  </ul>
                </section>
                <section className={s.pcaInput}>
                  <h3>第三次猜花用四项原始读数</h3>
                  <ul
                    className={s.pcaReadings}
                    aria-label="第三次猜花的模型输入"
                  >
                    {evidence.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </TeachingFrame>
      );
    case 'l7-challenge':
      return (
        <TeachingFrame scene={scene} label="结课挑战 · 礼花鉴定卡">
          <GiftReveal />
        </TeachingFrame>
      );
    case 'l7-finish':
      return (
        <TeachingFrame scene={scene} label="全课回顾 · 从花谱到预测">
          <SupervisedSummary />
        </TeachingFrame>
      );
  }
}
