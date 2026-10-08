/* oxlint-disable next/no-img-element -- Local educational diagram. */
'use client';
import {
  ArrowRight,
  BookOpen,
  FileCode2,
  HardDrive,
  LockKeyhole,
  Globe,
  WifiOff,
  Archive,
} from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { FileSheet, Guide, LessonStage, Steps } from './lesson-ui';
import { READ_MOVIE, MOVIE_SAMPLES } from './practice-content';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';

export function ReadScene({ id }: { id: string }) {
  if (id === 'l3-files') return <Files />;
  if (id === 'l3-file-concept') return <FileConcept />;
  if (id === 'l3-read-steps') return <ReadSteps />;
  if (id === 'l3-path') return <Paths />;
  if (id === 'l3-read-code') return <ReadCode />;
  return <Parse />;
}
function MoviePreview() {
  const movie = MOVIE_SAMPLES[0];
  return (
    <div className={s.moviePreview}>
      <span>电影馆 · 资料页</span>
      <h3>{movie.title}</h3>
      <dl>
        <dt>导演</dt>
        <dd>{movie.director}</dd>
        <dt>演员</dt>
        <dd>{movie.actors.join(' / ')}</dd>
      </dl>
      <strong>★ {movie.score}</strong>
    </div>
  );
}
function Files() {
  const [state, update] = usePageState({ offline: false, localOpen: true });
  return (
    <LessonStage
      title="网页，也能存进文件"
      label="FILE · 保存网页内容"
      footer={
        <Guide>
          网页内容保存在本地文件里，以后还能打开。本例的文字资料，断网也能看。
        </Guide>
      }
    >
      <div className={s.webComparison}>
        <section className={s.webWindow}>
          <header>
            <Globe />
            <strong>在线网页</strong>
            <span>从网站获取</span>
          </header>
          <div className={s.addressBar}>movie.douban.com/subject/1292052/</div>
          {state.offline ? (
            <div className={s.webUnavailable}>
              <WifiOff size={64} />
              <h3>暂时连不上网站</h3>
              <p>无法重新获取网页</p>
            </div>
          ) : (
            <MoviePreview />
          )}
        </section>
        <div className={s.saveArrow}>
          <ArrowRight />
          <span>保存</span>
        </div>
        <section className={s.webWindow}>
          <header>
            <HardDrive />
            <strong>本地文件</strong>
            <span>从电脑打开</span>
          </header>
          <div className={s.addressBar}>film_1292052.html</div>
          {state.localOpen ? (
            <MoviePreview />
          ) : (
            <div className={s.webUnavailable}>
              <FileCode2 size={72} />
              <strong>film_1292052.html</strong>
              <p>网页内容已经保存在文件中</p>
            </div>
          )}
        </section>
      </div>
      <div className={s.compareControls}>
        <button onClick={() => update({ offline: !state.offline })}>
          {state.offline ? '恢复联网' : '断网试试'}
        </button>
        <button onClick={() => update({ localOpen: !state.localOpen })}>
          {state.localOpen ? '查看本地文件' : '用浏览器打开文件'}
        </button>
      </div>
    </LessonStage>
  );
}
function FileConcept() {
  return (
    <LessonStage
      title="文件：给信息一个保存的地方"
      label="FILE · 认识计算机文件"
      footer={
        <Guide>
          文件是一组相关信息，保存在硬盘、U
          盘等存储设备上。关闭程序后，保存的文件还在。
          <br />
          这份网页另存了内容相同的 TXT 副本；Python 两种都能读取，本课统一用
          TXT。
        </Guide>
      }
    >
      <div className={`${s.two} ${s.fileConcept}`}>
        <figure className={s.fileFormats}>
          <img
            src={`${assetBase}/assets/computer-file-formats.png`}
            alt="电脑里保存着多种格式的文件：DOC 文档、JPG 图片、MP3 音频、PPT 演示文稿、MP4 视频、TXT 文本、PDF 电子文档和 HTML 网页。"
          />
          <figcaption>照片、音乐、视频、文档……都能存成文件。</figcaption>
        </figure>
        <div className={s.fileFacts}>
          <div>
            <span>文件名</span>
            <strong>film_1292052.txt</strong>
            <p>用名字区分文件</p>
          </div>
          <div>
            <span>扩展名</span>
            <strong>.txt</strong>
            <p>提示文件类型</p>
          </div>
          <div>
            <span>内容</span>
            <strong>电影网页的 HTML</strong>
            <p>真正保存的信息</p>
          </div>
          <div>
            <span>元数据</span>
            <strong>大小、修改时间等</strong>
            <p>描述这个文件的信息</p>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
function ReadSteps() {
  const [state, update] = usePageState({ step: 0 });
  const acts = [
    {
      icon: Archive,
      title: '按地址取出档案',
      action: '打开文件',
      code: 'open(...)',
      note: '先告诉 Python 文件在哪里，再打开它。',
    },
    {
      icon: BookOpen,
      title: '读出里面的记录',
      action: '读取内容',
      code: 'f.read()',
      note: '把文件里的文本读进程序，放进 html 变量。',
    },
    {
      icon: LockKeyhole,
      title: '用完合上档案',
      action: '关闭文件',
      code: '离开 with 的缩进',
      note: 'with 会自动关闭文件；读进 html 的文本仍然能用。',
    },
  ];
  return (
    <LessonStage
      title="读文件，像借阅一份档案"
      label="READ · 先理解三个动作"
      footer={<Guide>{acts[state.step].note}</Guide>}
    >
      <Steps
        labels={acts.map((act) => act.action)}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.readJourney}>
        {acts.map((act, i) => (
          <section key={act.title} data-active={state.step === i}>
            <span className={s.journeyNumber}>0{i + 1}</span>
            <act.icon aria-hidden="true" />
            <h3>{act.title}</h3>
            <strong>{act.action}</strong>
            <code>{act.code}</code>
          </section>
        ))}
      </div>
      <p className={s.small}>
        借阅是帮助理解的比喻：读取只取出内容，不会移走或修改原文件。
      </p>
    </LessonStage>
  );
}
function Paths() {
  return (
    <LessonStage
      title="同一份档案，两种找法"
      label="PATH · 绝对路径与相对路径"
      footer={
        <Guide>
          本课使用<strong>相对路径</strong>：在练习文件夹打开
          Notebook，读取放在同一层的电影文件。
        </Guide>
      }
    >
      <div className={`${s.two} ${s.pathLayout}`}>
        <figure className={s.pathIllustration}>
          <img
            src={`${assetBase}/assets/library-file-paths.png`}
            alt="城堡图书馆中，蓝色长路线从入口经过课程区，到达第三课书架的电影档案；黄色短路线从我在这里的位置，到达同一份电影档案。"
          />
          <figcaption>书架像文件夹，电影档案像文件。</figcaption>
        </figure>
        <div className={s.pathExplanations}>
          <section className={s.absolutePath}>
            <h3>
              <span aria-hidden="true">①</span> 绝对路径
            </h3>
            <p>
              像从图书馆入口出发，
              <br />
              写出到档案的<strong>完整路线</strong>。
            </p>
            <span className={s.small}>从根目录开始 · 地址举例</span>
            <code>/课程/第三课练习/film_1292052.txt</code>
          </section>
          <section className={s.relativePath}>
            <h3>
              <span aria-hidden="true">②</span> 相对路径 <em>本课使用</em>
            </h3>
            <p>
              像从你所在的书架出发，
              <br />从<strong>当前工作文件夹</strong>找到档案。
            </p>
            <code>
              <mark>./</mark>film_1292052.txt
            </code>
            <span className={s.small}>
              <strong>./</strong> 表示当前工作文件夹
            </span>
          </section>
        </div>
      </div>
    </LessonStage>
  );
}
function ReadCode() {
  const [state, update] = usePageState({ step: 0 });
  const lines = [[0, 1], [2], [4], [1]][state.step];
  return (
    <LessonStage title="打开、读取、自动关闭" label="READ · Python 读取文件">
      <Steps
        labels={['打开文件', '读取内容', '离开缩进', '读中文']}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <NotebookPanel
        compact
        title="第三课练习.ipynb"
        cells={[{ code: READ_MOVIE, activeLines: lines }]}
      />
      <div className={s.flow}>
        <div data-active={state.step === 0}>
          <HardDrive />
          <span>文件</span>
        </div>
        <ArrowRight />
        <div data-active={state.step === 1}>
          <BookOpen />
          <span>html 变量</span>
        </div>
        <ArrowRight />
        <div data-active={state.step === 2}>
          <LockKeyhole />
          <span>文件已关闭</span>
        </div>
      </div>
      <Guide>
        {
          [
            <span key="open">
              <strong>open</strong> 找到文件。<strong>r</strong> 表示读取，
              <strong>f</strong> 是操作这个文件的名字。
            </span>,
            <span key="read">
              <strong>f.read()</strong> 读出全部文本，交给变量{' '}
              <strong>html</strong>。
            </span>,
            <span key="close">
              离开 <strong>with</strong> 的缩进后，文件自动关闭；已经读出的{' '}
              <strong>html</strong> 仍可使用。
            </span>,
            <span key="encoding">
              <strong>encoding=&quot;utf-8&quot;</strong>{' '}
              指定文字的解码规则。本课样本都按 UTF-8 保存。
            </span>,
          ][state.step]
        }
      </Guide>
    </LessonStage>
  );
}
function Parse() {
  const [state, update] = usePageState({ step: 0 });
  const movie = MOVIE_SAMPLES[0];
  const fields = [
    {
      label: '片名',
      attribute: 'property',
      selector: 'v:itemreviewed',
      tag: 'span',
      values: [movie.title],
    },
    {
      label: '导演',
      attribute: 'rel',
      selector: 'v:directedBy',
      tag: 'a',
      values: [movie.director],
    },
    {
      label: '评分',
      attribute: 'property',
      selector: 'v:average',
      tag: 'strong',
      values: [movie.score],
    },
    {
      label: '演员',
      attribute: 'rel',
      selector: 'v:starring',
      tag: 'a',
      values: movie.actors,
    },
  ];
  const field = fields[state.step];
  const multiple = field.label === '演员';
  const find = `soup.${multiple ? 'find_all' : 'find'}("${field.tag}", ${field.attribute}="${field.selector}")`;
  return (
    <LessonStage title="老方法，读出新资料" label="PARSE · 复用第二课的方法">
      <Steps
        labels={fields.map((f) => f.label)}
        value={state.step}
        onChange={(step) => update({ step })}
      />
      <div className={s.two}>
        <FileSheet name="电影 HTML · 节选">
          <div className={s.tagged}>
            {field.values.map((value) => (
              <div key={value}>
                &lt;{field.tag} {field.attribute}=
                <mark>&quot;{field.selector}&quot;</mark>&gt;
                <br />
                <strong>　{value}</strong>&lt;/{field.tag}&gt;
              </div>
            ))}
          </div>
        </FileSheet>
        <div className={`${s.paper} ${s.center} ${s.parseResult}`}>
          <span className={s.small}>
            {multiple
              ? 'find_all 找到全部演员，再逐个取文本'
              : '标签 + 属性定位，再用 get_text() 取文本'}
          </span>
          {field.values.map((value) => (
            <strong className={s.large} key={value}>
              {value}
            </strong>
          ))}
          <p>{field.label}已经取出来了。</p>
        </div>
      </div>
      <NotebookPanel
        compact
        title="沿用网页解析方法"
        cells={[
          {
            code: `soup = BeautifulSoup(html, "html.parser")\n${multiple ? `actors = ${find}\nfor actor in actors:\n    print(actor.get_text(strip=True))` : `item = ${find}\nprint(item.get_text(strip=True))`}`,
            activeLines: multiple ? [1, 2, 3] : [1, 2],
          },
        ]}
      />
      <p className={s.small}>
        代码节选：先运行读取代码，并导入 BeautifulSoup。文件提供
        HTML；查找条件要与这份网页的标签、属性对应。
      </p>
    </LessonStage>
  );
}
