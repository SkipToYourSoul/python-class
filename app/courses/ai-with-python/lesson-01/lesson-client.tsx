'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  Code2,
  Copy,
  Database,
  Eye,
  Gamepad2,
  Lightbulb,
  Menu,
  MessageCircleQuestion,
  Play,
  Rocket,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  assetBase,
  dictionaryCode,
  helloCode,
  lessonChapters,
  listCode,
  predictionCode,
  trainingCode,
  warriors,
} from '@/lib/course-data';

const navItems = [
  { id: 'start', label: '课程开始', number: '00' },
  ...lessonChapters.map((chapter) => ({ id: chapter.id, label: chapter.title, number: chapter.number })),
  { id: 'finish', label: '本课总结', number: '04' },
];

function asset(file: string) {
  return `${assetBase}/${file}`;
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  async function copyCode() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Copy failed');
        setCopyState('copied');
      } catch {
        setCopyState('error');
      }
    }
    window.setTimeout(() => setCopyState('idle'), 1800);
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <span><Code2 size={16} /> {title}</span>
        <button type="button" onClick={copyCode} aria-label={`复制${title}`}>
          {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
          {copyState === 'copied' ? '已复制' : copyState === 'error' ? '请手动复制' : '复制代码'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function Discussion({ question, prompt }: { question: string; prompt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className={`discussion-card ${open ? 'is-open' : ''}`}>
      <div className="discussion-icon" aria-hidden="true"><MessageCircleQuestion /></div>
      <div>
        <span className="discussion-label">思考和讨论</span>
        <h3>{question}</h3>
        <p>{open ? prompt : '先停下来想一想，再展开查看讨论提示。'}</p>
      </div>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '收起提示' : '展开提示'}</button>
    </aside>
  );
}

function ChapterHeading({ number, title, summary }: { number: string; title: string; summary: string }) {
  return (
    <header className="chapter-heading">
      <div className="chapter-number">/{number}</div>
      <div>
        <span>CHAPTER {number}</span>
        <h2>{title}</h2>
        <p>{summary}</p>
      </div>
    </header>
  );
}

function LessonNavigation({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <nav className="lesson-navigation" aria-label="本课章节">
      <span className="lesson-navigation-title">本课目录</span>
      {navItems.map((item) => (
        <a
          key={item.id}
          className={active === item.id ? 'active' : ''}
          href={`#${item.id}`}
          onClick={onNavigate}
        >
          <span>{item.number}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default function LessonClient() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('start');
  const [mobileNav, setMobileNav] = useState(false);
  const [complete, setComplete] = useState(false);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setComplete(window.localStorage.getItem('ai-python-lesson-01-complete') === 'true');

    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.1, 0.4] },
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  useEffect(() => {
    if (!mobileNav) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobileCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNav(false);
        return;
      }
      if (event.key !== 'Tab' || !mobileDialogRef.current) return;
      const focusable = Array.from(
        mobileDialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      mobileMenuButtonRef.current?.focus();
    };
  }, [mobileNav]);

  function toggleComplete() {
    const next = !complete;
    setComplete(next);
    window.localStorage.setItem('ai-python-lesson-01-complete', String(next));
  }

  return (
    <main className="lesson-page">
      <div className="reading-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <header className="lesson-topbar">
        <Link href="/courses/ai-with-python"><ArrowLeft size={17} /> AI with Python</Link>
        <span>第一课 · 走进 AI 世界</span>
        <button
          ref={mobileMenuButtonRef}
          type="button"
          aria-expanded={mobileNav}
          aria-controls="lesson-mobile-navigation"
          onClick={() => setMobileNav(true)}
          aria-label="打开课程目录"
        ><Menu /></button>
      </header>

      {mobileNav && (
        <div ref={mobileDialogRef} id="lesson-mobile-navigation" className="mobile-nav-layer" role="dialog" aria-modal="true" aria-label="课程目录">
          <button ref={mobileCloseButtonRef} className="mobile-nav-close" type="button" onClick={() => setMobileNav(false)} aria-label="关闭课程目录"><X /></button>
          <LessonNavigation active={activeSection} onNavigate={() => setMobileNav(false)} />
        </div>
      )}

      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <LessonNavigation active={activeSection} />
          <div className="sidebar-progress">
            <span>阅读进度</span>
            <strong>{Math.round(progress)}%</strong>
          </div>
        </aside>

        <article className="lesson-content">
          <section className="lesson-opening lesson-section" id="start">
            <div className="opening-copy">
              <span className="lesson-chip"><Sparkles size={15} /> LESSON 1</span>
              <h1>走进 <em>AI</em> 世界</h1>
              <p>机器到底是怎么学习的？这一课，我们会从生活中的例子出发，最后让 Python 训练出一个真正的机器学习模型。</p>
              <div className="opening-meta">
                <span><BookOpen size={16} /> 3 个章节</span>
                <span><Code2 size={16} /> 3 次实操</span>
                <span><Rocket size={16} /> 1 个完整项目</span>
              </div>
              <a className="primary-cta" href="#chapter-1"><Play size={18} fill="currentColor" /> 开始学习</a>
            </div>
            <div className="opening-art" aria-hidden="true">
              <div className="opening-orbit" />
              <img src={asset('image40.png')} alt="" />
              <span className="floating-label label-one">数据</span>
              <span className="floating-label label-two">模型</span>
              <span className="floating-label label-three">预测</span>
            </div>
          </section>

          <section className="lesson-objectives" aria-label="学习目标">
            {lessonChapters.map((chapter) => (
              <a key={chapter.number} href={`#${chapter.id}`}>
                <span>{chapter.number}</span>
                <strong>{chapter.title}</strong>
                <ArrowRight size={17} />
              </a>
            ))}
          </section>

          <section className="lesson-chapter lesson-section" id="chapter-1">
            <ChapterHeading
              number="01"
              title="机器是怎么学习的"
              summary="先认识人工智能的发展，再把机器学习拆成几个人人都能理解的步骤。"
            />

            <div className="topic-heading">
              <span>01 — AI 的来路</span>
              <h3>从“机器能思考吗”到大语言模型</h3>
              <p>人工智能不是某一种算法，而是一类广泛的问题：怎样让机器表现出类似人类的智能。</p>
            </div>

            <figure className="feature-figure wide-figure">
              <img src={asset('image41.png')} alt="《模仿游戏》与阿兰·图灵的信息图" loading="lazy" />
              <figcaption>
                <span>1950</span>
                阿兰·图灵提出“机器能思考吗”，图灵测试成为人工智能史上的重要起点。
              </figcaption>
            </figure>

            <div className="history-grid">
              <article><span>1956</span><h4>人工智能被正式命名</h4><p>达特茅斯会议之后，“人工智能”成为一个独立研究方向。</p></article>
              <article><span>1959</span><h4>机器学习进入视野</h4><p>Arthur Samuel 用“无需明确编程也能学习”描述机器学习。</p></article>
              <article><span>2006</span><h4>深度学习加速发展</h4><p>机器学习的一个分支开始在视觉、语言等领域展现潜力。</p></article>
              <article><span>2017+</span><h4>大语言模型时代</h4><p>Transformer 与大模型快速演进，AI 开始走进每个人的生活。</p></article>
            </div>

            <div className="image-triptych history-images">
              <figure><img src={asset('image46.png')} alt="阿兰·图灵与密码破译历史信息图" loading="lazy" /><figcaption>图灵与早期人工智能</figcaption></figure>
              <figure><img src={asset('image49.png')} alt="1956 至 2006 的人工智能发展时间线" loading="lazy" /><figcaption>机器学习与深度学习</figcaption></figure>
              <figure><img src={asset('image54.png')} alt="2017 至 2025 的大语言模型发展图" loading="lazy" /><figcaption>大语言模型时代</figcaption></figure>
            </div>

            <div className="topic-heading topic-spaced">
              <span>02 — 想象未来</span>
              <h3>你心中的未来世界，是什么模样？</h3>
              <p>电影里的机器人和智能助手，曾经只是想象；今天，许多场景已经一步步来到现实。</p>
            </div>

            <div className="future-grid">
              <figure><img src={asset('image56.GIF')} alt="《我，机器人》中的人与机器人握手" loading="lazy" /><figcaption><strong>2004</strong>《我，机器人》</figcaption></figure>
              <figure><img src={asset('image59.GIF')} alt="《钢铁侠》中的智能界面" loading="lazy" /><figcaption><strong>2008</strong>《钢铁侠》</figcaption></figure>
              <figure><img src={asset('image57.GIF')} alt="《星球大战》中的机器人" loading="lazy" /><figcaption><strong>2015</strong>《星球大战》</figcaption></figure>
              <figure><img src={asset('image58.GIF')} alt="2025 年春晚机器人表演" loading="lazy" /><figcaption><strong>2025</strong>春晚机器人</figcaption></figure>
            </div>

            <div className="agi-panel">
              <div>
                <span className="panel-kicker">ARTIFICIAL GENERAL INTELLIGENCE</span>
                <h3>终点或许是 AGI</h3>
                <p>通用人工智能希望像人一样跨领域学习、推理并适应新环境。它与只能完成特定任务的狭义 AI 不同。</p>
                <strong>那么，机器究竟是如何学习的？</strong>
              </div>
              <img src={asset('image60.GIF')} alt="机器人舞蹈表演" loading="lazy" />
            </div>

            <div className="samuel-quote">
              <img src={asset('image62.jpeg')} alt="Arthur Samuel" loading="lazy" />
              <blockquote>
                <span>Arthur Samuel</span>
                “让计算机在没有被明确编程的情况下，获得从经验中学习的能力。”
              </blockquote>
              <img className="samuel-diagram" src={asset('image61.png')} alt="现实问题、数学模型与计算机之间的关系" loading="lazy" />
            </div>

            <div className="topic-heading topic-spaced">
              <span>03 — 学习的类比</span>
              <h3>还记得我们是怎么识字的吗？</h3>
              <p>先看许多例子，再找到共同规律。人类学习“一、二、三”的过程，和机器学习很相似。</p>
            </div>

            <div className="character-learning">
              {[
                ['image63.GIF', '一', '一条横线'],
                ['image64.GIF', '二', '两条横线'],
                ['image65.GIF', '三', '三条横线'],
              ].map(([image, label, caption]) => (
                <figure key={label}>
                  <img src={asset(image)} alt={`汉字“${label}”的书写动画`} loading="lazy" />
                  <figcaption><strong>{label}</strong><span>{caption}</span></figcaption>
                </figure>
              ))}
            </div>

            <div className="concept-flow" aria-label="机器学习概念映射">
              {[
                ['数据', '看过的识字卡片'],
                ['特征', '横线的数量'],
                ['建模', '不断总结规律'],
                ['模型', '学会识别一二三'],
              ].map(([title, text], index) => (
                <div key={title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              ))}
            </div>

            <div className="model-examples">
              <div className="model-copy">
                <span className="panel-kicker">MODEL = A USEFUL FUNCTION</span>
                <h3>模型，就是描述规律的一种方式</h3>
                <p>当现实问题可以被数学描述，函数就能帮助机器理解关系、做出判断。</p>
              </div>
              <figure><img src={asset('image68.png')} alt="心情随温度变化的函数" loading="lazy" /><figcaption>温度与心情</figcaption></figure>
              <figure><img src={asset('image69.png')} alt="眼睛大小与小狗可爱程度的函数" loading="lazy" /><figcaption>眼睛大小与可爱程度</figcaption></figure>
            </div>

            <div className="train-predict">
              <article>
                <span>STEP 1 · 离线训练</span>
                <h3>把已知经验交给机器</h3>
                <p>收集数据、准备特征、选择算法、训练并评估，最终得到一个模型。</p>
                <div className="formula-row"><span>训练数据</span><b>+</b><span>机器学习算法</span><b>=</b><strong>模型</strong></div>
              </article>
              <article>
                <span>STEP 2 · 在线预测</span>
                <h3>让模型判断新情况</h3>
                <p>遇到新的数据时，模型利用已经学到的规律给出预测结果。</p>
                <div className="formula-row"><span>新数据</span><b>+</b><span>模型</span><b>=</b><strong>预测</strong></div>
              </article>
            </div>

            <div className="weather-example">
              <div className="weather-copy">
                <span className="panel-kicker">A REAL-LIFE EXAMPLE</span>
                <h3>用乌云预测会不会下雨</h3>
                <dl>
                  <div><dt>训练集</dt><dd>历史天气数据</dd></div>
                  <div><dt>特征</dt><dd>乌云大小、覆盖比例与分布</dd></div>
                  <div><dt>模型</dt><dd>训练得到的天气模型</dd></div>
                </dl>
              </div>
              <div className="weather-steps">
                {['image70.png', 'image71.png', 'image72.png', 'image73.png'].map((image) => (
                  <img key={image} src={asset(image)} alt="天气模型训练与预测步骤" loading="lazy" />
                ))}
              </div>
            </div>

            <Discussion
              question="如果你能教机器学会一项技能，那会是什么？"
              prompt="先想清楚三件事：你能给机器哪些例子？每个例子有什么可观察的特征？学会以后，机器需要对什么新情况做出判断？"
            />

            <div className="practice-break">
              <img src={asset('image74.png')} alt="坐在电脑前编程的学生" loading="lazy" />
              <div><span>课堂练习一</span><h3>画出你心中的未来世界</h3><p>在白纸上“写出 / 画出”未来世界的模样。可以从生活、交通、学习或娱乐中的一个场景开始。</p></div>
            </div>

            <div className="video-lab" aria-labelledby="video-lab-title">
              <div className="topic-heading">
                <span>未来创意参考</span>
                <h3 id="video-lab-title">同一个想法，可以有许多种表达</h3>
              </div>
              <div className="video-grid">
                {[
                  ['media1.mp4', 'image76.png', '未来场景一'],
                  ['media2.mp4', 'image77.png', '未来场景二'],
                  ['media3.mp4', 'image79.png', '未来场景三'],
                ].map(([video, poster, label]) => (
                  <figure key={video}>
                    <video controls playsInline preload="metadata" poster={asset(poster)} aria-label={label}>
                      <source src={asset(video)} type="video/mp4" />
                    </video>
                    <figcaption>{label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>

          <section className="lesson-chapter lesson-section" id="chapter-2">
            <ChapterHeading
              number="02"
              title="搞个金刚钻"
              summary="工欲善其事，必先利其器。先装备 Python 武器库，再熟悉 JupyterLab。"
            />

            <div className="tool-intro">
              <div>
                <span className="panel-kicker">PYTHON TOOLKIT</span>
                <h3>Anaconda：装好一整套数据科学工具</h3>
                <p>Anaconda 是一个开源 Python 发行版，预装了大量数据科学相关的包，也提供 JupyterLab 等常用工具。</p>
                <ul><li><CheckCircle2 size={17} /> 集中管理 Python 环境</li><li><CheckCircle2 size={17} /> 方便安装常用工具包</li><li><CheckCircle2 size={17} /> 适合课堂中的数据与 AI 实验</li></ul>
              </div>
              <figure><img src={asset('image81.png')} alt="Anaconda Navigator 界面" loading="lazy" /><figcaption>Anaconda Navigator</figcaption></figure>
            </div>

            <div className="jupyter-intro">
              <figure><img src={asset('image85.png')} alt="Mu Editor 代码界面" loading="lazy" /><figcaption>Mu Editor</figcaption></figure>
              <div className="tool-switch" aria-hidden="true"><ArrowRight /></div>
              <figure><img src={asset('image86.png')} alt="JupyterLab 中的多种工作界面" loading="lazy" /><figcaption>JupyterLab</figcaption></figure>
            </div>

            <figure className="feature-figure wide-figure screenshot-figure">
              <img src={asset('image89.png')} alt="JupyterLab 界面中的菜单栏、文件管理与单元格" loading="lazy" />
              <figcaption><span>界面介绍</span>菜单栏负责全局操作，左侧管理文件，中间的单元格既能写 Python，也能写说明文字。</figcaption>
            </figure>

            <div className="jupyter-benefits">
              <span><Play size={18} /> 按单元格运行代码</span>
              <span><BookOpen size={18} /> 代码与说明放在一起</span>
              <span><Sparkles size={18} /> 适合交互式探索</span>
            </div>

            <div className="topic-heading topic-spaced">
              <span>JUPYTERLAB · 四步上手</span>
              <h3>创建并运行你的第一个 Notebook</h3>
            </div>

            <div className="step-list">
              <article>
                <div className="step-copy"><span>01</span><h4>新建代码文件</h4><p>点击左上角的 <b>+</b>，确认当前文件路径，再选择 Notebook 分类下的 <b>ipykernel</b>。</p></div>
                <img src={asset('image91.png')} alt="在 JupyterLab 中新建 Notebook" loading="lazy" />
              </article>
              <article>
                <div className="step-copy"><span>02</span><h4>写下第一行代码</h4><p>蓝色边框表示当前正在编辑的单元格。输入代码时，保持光标位于这个单元格中。</p></div>
                <img src={asset('image92.png')} alt="在 JupyterLab 单元格中输入第一行代码" loading="lazy" />
              </article>
              <article>
                <div className="step-copy"><span>03</span><h4>运行当前单元格</h4><p>点击运行按钮。左侧的数字表示执行顺序；新增、删除、移动单元格时，也要留意顺序。</p></div>
                <img src={asset('image95.png')} alt="运行 JupyterLab 单元格" loading="lazy" />
              </article>
              <article>
                <div className="step-copy"><span>04</span><h4>切换 Markdown 并保存</h4><p>Markdown 单元格适合写标题与说明。完成后保存，并把 <b>Untitled.ipynb</b> 改成容易识别的文件名。</p></div>
                <div className="step-image-pair"><img src={asset('image96.png')} alt="切换成 Markdown 单元格" loading="lazy" /><img src={asset('image97.png')} alt="重命名 Notebook 文件" loading="lazy" /></div>
              </article>
            </div>

            <CodeBlock title="第一段 Python 代码" code={helloCode} />

            <div className="practice-break compact-practice">
              <img src={asset('image74.png')} alt="学生正在编程" loading="lazy" />
              <div><span>课堂练习二</span><h3>用 JupyterLab 回顾基础知识</h3><p>先自己完成，再对照下面的参考代码。输入时可以按 <kbd>Tab</kbd> 自动补全。</p></div>
            </div>

            <div className="code-grid">
              <CodeBlock title="列表练习" code={listCode} />
              <CodeBlock title="字典练习" code={dictionaryCode} />
            </div>
          </section>

          <section className="lesson-chapter lesson-section" id="chapter-3">
            <ChapterHeading
              number="03"
              title="识别勇士与恶魔"
              summary="把数据、特征、模型和预测串起来，训练这一课的第一个决策树。"
            />

            <div className="story-panel">
              <div>
                <span className="panel-kicker">THE CASTLE PROBLEM</span>
                <h3>大乱斗之后，城堡需要一套检测系统</h3>
                <p>检测到勇士，可以进入；检测到恶魔，禁止进入。可机器要依据什么来判断身份？</p>
              </div>
              <div className="story-flow" aria-label="城堡检测流程">
                <img src={asset('image99.png')} alt="勇士" loading="lazy" />
                <span className="green-arrow"><ArrowRight /></span>
                <img src={asset('image108.png')} alt="城堡" loading="lazy" />
                <img src={asset('image102.png')} alt="恶魔" loading="lazy" />
                <span className="red-arrow"><ArrowRight /></span>
                <img src={asset('image108.png')} alt="城堡" loading="lazy" />
              </div>
            </div>

            <Link className="chapter-game-callout" href="/courses/ai-with-python/lesson-01/castle-guardian">
              <span className="chapter-game-icon"><Gamepad2 size={28} /></span>
              <span className="chapter-game-copy">
                <small>互动实验 · 8–12 分钟</small>
                <strong>进入「城堡守门人」小游戏</strong>
                <span>亲手训练决策树，再让 AI 判断谁能进入城堡。</span>
              </span>
              <span className="chapter-game-arrow" aria-hidden="true"><ArrowRight size={23} /></span>
            </Link>

            <Discussion
              question="作为城堡的主人，你会如何识别恶魔和勇士？"
              prompt="观察角色卡上的攻击力、防御力和血量。哪些特征可能最有区分度？如果只问一个问题，你会先问什么？"
            />

            <div className="topic-heading topic-spaced">
              <span>STEP 1 · 认识数据</span>
              <h3>先看看我们掌握了哪些角色信息</h3>
              <p>每张卡片都是一个训练样本；攻击力、防御力和血量是特征，“勇士 / 恶魔”是正确答案。</p>
            </div>

            <div className="role-grid">
              {warriors.map((role) => (
                <figure key={role.name}>
                  <img src={asset(role.image)} alt={`${role.name}角色卡`} loading="lazy" />
                  <figcaption><strong>{role.name}</strong><span className={role.category === '勇士' ? 'warrior' : 'demon'}>{role.category}</span></figcaption>
                </figure>
              ))}
            </div>

            <div className="dataset-wrap">
              <div className="dataset-heading"><div><span className="panel-kicker">TRAINING DATA</span><h3>勇士与恶魔数据集</h3></div><span><Database size={17} /> 10 个样本 · 3 个特征</span></div>
              <div className="table-scroll">
                <table>
                  <thead><tr><th>角色</th><th>攻击力</th><th>防御力</th><th>血量</th><th>分类</th><th>类型</th></tr></thead>
                  <tbody>{warriors.map((role) => <tr key={role.name}><th>{role.name}</th><td>{role.attack}</td><td>{role.defense}</td><td>{role.health}</td><td><span className={role.category === '勇士' ? 'table-warrior' : 'table-demon'}>{role.category}</span></td><td>{role.type}</td></tr>)}</tbody>
                </table>
              </div>
            </div>

            <div className="decision-tree-intro">
              <div>
                <span className="panel-kicker">DECISION TREE</span>
                <h3>让模型像玩猜谜一样层层判断</h3>
                <p>决策树会不断询问特征问题，并沿不同分支前进，直到得到结论。它很像我们熟悉的 <code>if / elif / else</code>。</p>
                <div className="tree-node-types"><span>根节点 · 第一个问题</span><span>决策节点 · 继续判断</span><span>结果节点 · 得到分类</span></div>
              </div>
              <img src={asset('image127.png')} alt="决策树示意图" loading="lazy" />
            </div>

            <aside className="concept-note"><Lightbulb size={20} /><p>上面的树是“概念示意”。接下来训练出的实际模型使用攻击力、防御力和血量，并主要通过血量阈值完成分类。</p></aside>

            <div className="topic-heading topic-spaced">
              <span>STEP 2 · 训练模型</span>
              <h3>把训练数据交给决策树</h3>
              <p>下面补齐了 PPT 中省略的数据、导入、特征和标签构造，整段代码可以直接复制运行。</p>
            </div>
            <CodeBlock title="训练决策树" code={trainingCode} />

            <figure className="feature-figure tree-result">
              <img src={asset('image131.png')} alt="训练得到的决策树结果" loading="lazy" />
              <figcaption><span>模型学到的规则</span>先判断血量是否小于等于 245，再判断是否小于等于 450。</figcaption>
            </figure>

            <div className="topic-heading topic-spaced">
              <span>STEP 3 · 在线预测</span>
              <h3>城堡门口来了两位新角色</h3>
              <p>模型没有见过他们，但可以利用学到的规律给出预测。</p>
            </div>

            <div className="prediction-characters">
              <figure><img src={asset('image133.png')} alt="待预测的勇士角色" loading="lazy" /><figcaption><strong>候选角色 A</strong><span>攻击 40 · 防御 80 · 血量 390</span></figcaption></figure>
              <figure><img src={asset('image134.png')} alt="待预测的恶魔角色" loading="lazy" /><figcaption><strong>候选角色 B</strong><span>攻击 70 · 防御 38 · 血量 190</span></figcaption></figure>
            </div>

            <CodeBlock title="预测并计算准确率" code={predictionCode} />

            <div className="prediction-result">
              <div><span>[1]</span><strong>角色 A：勇士</strong><p>允许进入城堡</p></div>
              <div><span>[0]</span><strong>角色 B：恶魔</strong><p>禁止进入城堡</p></div>
              <div className="accuracy"><span>ACCURACY</span><strong>1.0</strong><p>这两个测试样本全部判断正确</p></div>
            </div>
          </section>

          <section className="lesson-finish lesson-section" id="finish">
            <div className="finish-copy">
              <span className="lesson-chip"><CheckCircle2 size={15} /> LESSON COMPLETE</span>
              <h2>你已经迈出了走进 AI 的第一步</h2>
              <p>机器学习从数据中寻找规律，用模型对新数据进行预测。今天你已经亲手走完了这条路径。</p>
              <div className="takeaway-list">
                <span><Eye size={18} /><strong>数据</strong>是 AI 的眼睛和耳朵</span>
                <span><Lightbulb size={18} /><strong>模型</strong>是 AI 的大脑</span>
                <span><Code2 size={18} /><strong>Python</strong>让想法真正运行起来</span>
              </div>
              <button className={complete ? 'complete-button completed' : 'complete-button'} type="button" aria-pressed={complete} onClick={toggleComplete}>
                {complete ? <Check size={19} /> : <Clipboard size={19} />}
                {complete ? '已完成第一课' : '标记为已完成'}
              </button>
              <Link className="finish-back" href="/courses/ai-with-python">返回课程详情 <ArrowRight size={16} /></Link>
            </div>
            <div className="finish-art" aria-hidden="true">
              <img src={asset('image135.png')} alt="" />
              <span>下一课见！</span>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
