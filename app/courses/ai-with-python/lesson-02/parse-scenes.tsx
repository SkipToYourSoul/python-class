/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable complete code is keyboard accessible. */
/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { useState, type ReactNode } from 'react';
import {
  MapPin,
  Flame,
  Shield,
  FileCode2,
  ArrowRight,
  FolderTree,
} from 'lucide-react';
import { Stage, ClassPracticeStamp } from '../lesson-01/lesson-ui';
import { XiaopaiSpeech } from '../lesson-01/xiaopai-speech';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePageState } from './lesson-state';
import { Note, StepBar } from './lesson-ui';
import { NotebookPanel } from './notebook-panels';
import { ScoutHtmlDialog } from './scout-html-dialog';
import { ParseHtmlReference } from './parse-html-reference';
import { ParseStoryComic } from './parse-story-comic';
import { scoutUrl, assetBase } from './lesson-data';
import {
  useScoutSource,
  type ScoutSource,
  type ScoutRecord,
} from './scout-source';
import s from './lesson.module.css';
import p from './parse.module.css';

const fields = [
  { label: '出没地点', key: 'location', Icon: MapPin },
  { label: '属性', key: 'attribute', Icon: Flame },
  { label: '已知弱点', key: 'weakness', Icon: Shield },
] as const;
const setup =
  'from bs4 import BeautifulSoup\n\nsoup = BeautifulSoup(res.text, "html.parser")';
const selectRecords = 'records = soup.find_all("article", class_="record")';
const extraction = `for record in records:
    name = record.find("h2", class_="name")
    location = record.find("span", class_="location")
    attribute = record.find("span", class_="attribute")
    weakness = record.find("span", class_="weakness")
    print(name.get_text(strip=True))
    print(location.get_text(strip=True),
          attribute.get_text(strip=True),
          weakness.get_text(strip=True))`;
const completeCode = `import requests
from bs4 import BeautifulSoup

url = "${scoutUrl}"
res = requests.get(url, timeout=10)
res.raise_for_status()
res.encoding = "utf-8"
soup = BeautifulSoup(res.text, "html.parser")
${selectRecords}

${extraction}`;
function RecordCard({
  record,
  field,
  dim = false,
  illustrated = false,
}: {
  record: ScoutRecord;
  field?: string;
  dim?: boolean;
  illustrated?: boolean;
}) {
  return (
    <article
      className={`${p.record} ${illustrated ? p.illustratedRecord : ''}`}
      data-dim={dim}
    >
      <span className={p.recordLabel}>scout.html · 网页内容对照</span>
      <h3 data-active={field === 'name'}>{record.name}</h3>
      {fields.map(({ label, key, Icon }) => (
        <div key={key} data-active={field === key}>
          <Icon aria-hidden="true" />
          <span>
            {label}
            <strong>{record[key]}</strong>
          </span>
        </div>
      ))}
      {illustrated && (
        <img
          className={p.beastPortrait}
          src={`${assetBase}/assets/scout-flame-horn-search.png?v=1`}
          alt="放大镜中发现了藏在北方峡谷岩石后的炎角兽"
        />
      )}
    </article>
  );
}
function Guide({
  children,
  variant = 0,
}: {
  children: ReactNode;
  variant?: number;
}) {
  return (
    <div className={p.guide} data-variant={variant}>
      <XiaopaiSpeech active label="小派讲解 HTML 解析">
        {children}
      </XiaopaiSpeech>
    </div>
  );
}
function Html({
  text,
  line = -1,
  range,
}: {
  text: string;
  line?: number;
  range?: readonly [number, number];
}) {
  return (
    <div className={p.html}>
      <span>
        {text.includes('…')
          ? 'scout.html · 结构节选（… 表示省略）'
          : 'scout.html · 完整 article（长行自动折行）'}
      </span>
      <pre>
        <code>
          {text.split('\n').map((value, i) => (
            <span
              key={i}
              data-active={range ? i >= range[0] && i <= range[1] : line === i}
            >
              {value}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
function ParseCodeDialog() {
  const [copied, setCopied] = useState(false);
  return (
    <Dialog>
      <DialogTrigger className={s.secondary}>完整代码与运行说明</DialogTrigger>
      <DialogContent className={p.dialog}>
        <DialogHeader>
          <DialogTitle>从获取网页到提取敌情</DialogTitle>
          <DialogDescription>
            Python 3；首次使用需安装 requests、beautifulsoup4。在 JupyterLab
            中按顺序运行。
          </DialogDescription>
        </DialogHeader>
        <p>
          安装依赖：<code>%pip install requests beautifulsoup4</code>
        </p>
        <pre tabIndex={0} aria-label="完整 Python 代码">
          <code>{completeCode}</code>
        </pre>
        <div className={s.actions}>
          <button
            className={s.secondary}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(completeCode);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? '已复制' : '复制完整代码'}
          </button>
          <a
            className={s.secondary}
            href={`${assetBase}/practice/lesson-02-practice.zip`}
            download
          >
            下载练习包
          </a>
        </div>
        <p>
          请求失败先检查网址与连接；找不到元素时，核对返回的 HTML 和 class
          拼写。
        </p>
      </DialogContent>
    </Dialog>
  );
}
export function ParseScene({ id }: { id: string }) {
  const { source, failed, retry } = useScoutSource();
  if (!source)
    return (
      <Stage title="读取前线侦察记录" label="HTML · scout.html">
        <p className={s.small}>
          {failed ? '暂时无法读取教学网页，请重试。' : '正在读取 scout.html…'}
        </p>
        {failed && (
          <button className={s.secondary} onClick={retry}>
            重新读取
          </button>
        )}
      </Stage>
    );
  return <LoadedParseScene id={id} source={source} />;
}
function LoadedParseScene({ id, source }: { id: string; source: ScoutSource }) {
  const records = source.records;
  const [v, set] = usePageState({
    step: 0,
    row: 0,
    reveal: false,
    showHtml: false,
  });
  const step = Math.min(
    v.step,
    id === 'l2-dom' ? 3 : id === 'l2-find' || id === 'l2-soup' ? 1 : 2,
  );
  const tabs = (items: string[]) => (
    <StepBar items={items} value={step} onChange={(step) => set({ step })} />
  );
  const referenceFooter = (note: string) => (
    <div className={p.referenceFooter}>
      <Note>{note}</Note>
      <button
        className={s.secondary}
        aria-pressed={v.showHtml}
        aria-controls={`${id}-reference`}
        onClick={() => set({ showHtml: !v.showHtml })}
      >
        {v.showHtml ? '返回图示讲解' : '查看对应 HTML'}
      </button>
    </div>
  );
  switch (id) {
    case 'l2-html':
      return (
        <Stage
          title="地点信息藏在哪一行？"
          label="HTML · 标签、属性、文本"
          footer={
            <Note>
              这一整行来自 scout.html：p 包住说明文字和 span，地点文字在 span
              里。
            </Note>
          }
        >
          {tabs(['标签', '属性', '文本'])}
          <div className={p.equal}>
            <RecordCard record={records[0]} field="location" illustrated />
            <div className={p.stack}>
              <div className={p.anatomy}>
                <span className={p.sourceLabel}>
                  scout.html · 第一个 article 的地点行
                </span>
                <code className={p.sourceAnatomy}>
                  {'<p>'}
                  {records[0].fields.location.label}
                  <mark data-active={step === 0}>{'<span'}</mark>{' '}
                  <mark data-active={step === 1}>{'class="location"'}</mark>
                  {'>'}
                  <mark data-active={step === 2}>{records[0].location}</mark>
                  <mark data-active={step === 0}>{'</span>'}</mark>
                  {'</p>'}
                </code>
              </div>
              <Guide variant={step}>
                {
                  [
                    <>
                      标签像盒子：<strong>span</strong> 把这一段文字包起来。
                    </>,
                    <>
                      属性像标签贴纸：
                      <strong>class=&quot;location&quot;</strong>{' '}
                      是寻找地点的线索。
                    </>,
                    <>
                      打开盒子，取出文字：我们要的情报是
                      <strong>{records[0].location}</strong>。
                    </>,
                  ][step]
                }
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-document':
      return (
        <Stage
          title="网页也有自己的结构"
          label="HTML · 从整页走进记录"
          footer={<Note>先认识包含关系；本节重点看 body 中的敌情记录。</Note>}
        >
          <div className={p.equal}>
            <Html
              range={
                (
                  [
                    [0, 8],
                    [1, 3],
                    [4, 7],
                  ] as const
                )[step]
              }
              text={
                '<html lang="zh-CN">\n  <head>\n    <title>前线侦察记录站</title>\n  </head>\n  <body>\n    <header>…</header>\n    <main>…</main>\n  </body>\n</html>'
              }
            />
            <div className={p.stack}>
              <div className={`${p.document} ${p.documentOverview}`}>
                <button
                  className={p.documentRoot}
                  aria-pressed={step === 0}
                  onClick={() => set({ step: 0 })}
                >
                  <strong>html · 整份文档</strong>
                  <span>根元素，包含 head 和 body。</span>
                </button>
                <button
                  aria-pressed={step === 1}
                  onClick={() => set({ step: 1 })}
                >
                  <FileCode2 />
                  <span>
                    head · 页面信息
                    <strong>title → 浏览器页签上的标题</strong>
                  </span>
                </button>
                <button
                  aria-pressed={step === 2}
                  onClick={() => set({ step: 2 })}
                >
                  <FolderTree />
                  <span>
                    body · 可见内容
                    <strong>header → 站点标题</strong>
                    <strong>main → 三条敌情记录</strong>
                  </span>
                </button>
              </div>
              <Guide variant={1}>
                要找敌情，接下来沿着 <strong>body → main</strong> 往里走。
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-dom':
      return (
        <Stage
          title="沿着树枝，走进一条记录"
          label="DOM · 从根节点找到地点"
          footer={
            <Note>
              元素树来自 scout.html 的结构；另两条 article 内部相同，暂不展开。
            </Note>
          }
        >
          {tabs(['整份网页', '进入 body', '找到 main', '走进地点'])}
          <div className={p.domLayout}>
            <div className={p.domTree} aria-label="侦察记录站的 DOM 元素树">
              <figure className={p.treeTarget}>
                <img
                  src={`${assetBase}/assets/scout-flame-horn-search.png?v=1`}
                  alt="用放大镜寻找藏在北方峡谷的炎角兽"
                />
                <figcaption>寻找炎角兽</figcaption>
              </figure>
              <ul>
                <li>
                  <div className={p.branchRow}>
                    <code data-active={step === 0} data-path>
                      html
                    </code>
                    <span>根元素</span>
                  </div>
                  <ul>
                    <li>
                      <div className={p.branchRow}>
                        <code>head</code>
                        <span aria-hidden="true">→</span>
                        <ul className={p.inlineNodes}>
                          {source.headTags.map((tag, i) => (
                            <li key={i}>
                              <code>{tag}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                    <li>
                      <div className={p.branchRow}>
                        <code data-active={step === 1} data-path={step >= 1}>
                          body
                        </code>
                        <span>页面内容</span>
                      </div>
                      <ul>
                        <li>
                          <div className={p.branchRow}>
                            <code>header</code>
                            <span aria-hidden="true">→</span>
                            <ul className={p.inlineNodes}>
                              {source.headerTags.map((tag, i) => (
                                <li key={i}>
                                  <code>{tag}</code>
                                </li>
                              ))}
                            </ul>
                            <span>站点介绍</span>
                          </div>
                        </li>
                        <li>
                          <div className={p.branchRow}>
                            <code
                              data-active={step === 2}
                              data-path={step >= 2}
                            >
                              main
                            </code>
                            <span>三条敌情记录</span>
                          </div>
                          <ul>
                            <li>
                              <div className={p.branchRow}>
                                <code data-path={step === 3}>article</code>
                                <span>{'class="record"'}</span>
                              </div>
                              <ul>
                                <li>
                                  <div className={p.branchRow}>
                                    <code>h2</code>
                                    <span>
                                      {'class="name"'} · {records[0].name}
                                    </span>
                                  </div>
                                </li>
                                {fields.map(({ key }, i) => (
                                  <li key={key}>
                                    <div className={p.branchRow}>
                                      <code data-path={step === 3 && i === 0}>
                                        p
                                      </code>
                                      <span aria-hidden="true">→</span>
                                      <ul className={p.inlineNodes}>
                                        <li>
                                          <code
                                            data-active={step === 3 && i === 0}
                                          >
                                            span
                                          </code>
                                        </li>
                                      </ul>
                                      <strong
                                        data-target={step === 3 && i === 0}
                                      >
                                        {records[0][key]}
                                      </strong>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </li>
                            <li>
                              <div className={p.branchRow}>
                                <code>article</code>
                                <span>{records[1].name}的记录 …</span>
                              </div>
                            </li>
                            <li>
                              <div className={p.branchRow}>
                                <code>article</code>
                                <span>{records[2].name}的记录 …</span>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className={p.stack}>
              <Html
                line={[0, 0, 0, 2][step]}
                text={
                  [
                    `${source.htmlOpening}\n  <head>…</head>\n  <body>…</body>\n</html>`,
                    '<body>\n  <header>…</header>\n  <main>…</main>\n</body>',
                    '<main>\n' +
                      records
                        .map((record) => `  ${record.opening}…</article>`)
                        .join('\n') +
                      '\n</main>',
                    records[0].source,
                  ][step]
                }
              />
              <Guide variant={step % 2}>
                {
                  [
                    <>
                      浏览器把 HTML 组织成 <strong>DOM 树</strong>。从 html
                      出发，分成 head 和 body。
                    </>,
                    <>
                      进入 <strong>body</strong>：header 是站点介绍，main
                      是记录区。
                    </>,
                    <>
                      <strong>main</strong> 里面有三张 article
                      记录卡。我们先看炎角兽这一张。
                    </>,
                    <>
                      先是 h2 名字，后面三个 p
                      分别放地点、属性和弱点。地点在第一个 p 的{' '}
                      <strong>span</strong> 里。
                    </>,
                  ][step]
                }
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-inspect':
      return (
        <Stage
          title="解析情报，只记住这三步"
          label="解析公式 · 根据属性、寻找元素、获取文本"
          footer={
            <Note>先在 HTML 中认出线索，再让 Python 按这三步取出情报。</Note>
          }
        >
          <img
            className={p.formulaComic}
            src={`${assetBase}/assets/scout-parse-formula.png`}
            alt="勇士与机械鸟认出地点标记、找到对应卷轴、摘出卷轴中的情报"
          />
          <div className={p.formula}>
            {['根据属性', '寻找元素', '获取文本'].map((title, i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <code>
                  {
                    [
                      'class="location"',
                      records[0].fields.location.html,
                      records[0].location,
                    ][i]
                  }
                </code>
              </div>
            ))}
          </div>
        </Stage>
      );
    case 'l2-soup':
      return (
        <Stage
          title="请来一位“档案整理员”"
          label="BEAUTIFUL SOUP · 建立解析树"
          footer={
            <div className={p.footer}>
              <span>接着练习一：res 中已经有成功获取的网页。</span>
              <ParseCodeDialog />
            </div>
          }
        >
          {tabs(['准备工具', '建立解析树'])}
          <div className={`${p.codeGrid} ${p.comicCodeGrid}`}>
            <NotebookPanel
              compact
              title="我的第一次网页请求.ipynb"
              cells={[
                {
                  code: step === 0 ? 'from bs4 import BeautifulSoup' : setup,
                  activeLines: step === 0 ? [0] : [2],
                },
              ]}
            >
              <ParseStoryComic scene="soup" step={step} />
            </NotebookPanel>
            <div className={p.stack}>
              <div className={p.transform}>
                <FileCode2 size={54} />
                <strong>res.text</strong>
                <span>一长串 HTML 文字</span>
                <ArrowRight />
                <FolderTree size={62} />
                <strong>soup</strong>
                <span>可以查找的解析树</span>
              </div>
              <Guide variant={step}>
                {step === 0 ? (
                  <>
                    请 <strong>BeautifulSoup</strong> 帮忙，按标签整理带回来的
                    HTML。
                  </>
                ) : (
                  <>
                    把 HTML 交给解析器 <strong>html.parser</strong>，结果存进
                    soup。
                  </>
                )}
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-find':
      return (
        <Stage
          title="找一条，还是找全部？"
          label="FIND · 先取完整记录卡"
          footer={referenceFooter('先找到记录容器，再进入记录取字段。')}
        >
          {tabs(['find：第一条', 'find_all：全部'])}
          <div className={`${p.codeGrid} ${p.comicCodeGrid}`}>
            <NotebookPanel
              compact
              title="我的第一次网页请求.ipynb"
              cells={[
                {
                  code:
                    step === 0
                      ? 'record = soup.find(\n    "article", class_="record"\n)'
                      : `${selectRecords}\nprint(len(records))`,
                  output: step === 0 ? undefined : '3',
                },
              ]}
            >
              <ParseStoryComic scene="find" step={step} />
            </NotebookPanel>
            <div id={`${id}-reference`} className={p.referenceSlot}>
              {v.showHtml ? (
                <ParseHtmlReference mode="find" step={step} source={source} />
              ) : (
                <div className={p.stack}>
                  <div className={p.recordList}>
                    {records.map((r, i) => (
                      <div key={r.name} data-active={step === 1 || i === 0}>
                        <FileCode2 />
                        <strong>{r.name}</strong>
                        <code>{r.opening}</code>
                      </div>
                    ))}
                  </div>
                  <Guide variant={step}>
                    {step === 0 ? (
                      <>
                        find 像拿出<strong>第一张匹配的卡片</strong>，把它存进
                        record。
                      </>
                    ) : (
                      <>
                        find_all 收集<strong>全部匹配的卡片</strong>。class_
                        对应 HTML 的 class。
                      </>
                    )}
                  </Guide>
                </div>
              )}
            </div>
          </div>
        </Stage>
      );
    case 'l2-fields': {
      const field = fields[step];
      return (
        <Stage
          title="按三步公式，取出一项情报"
          label="GET_TEXT · 从元素到文字"
          footer={referenceFooter(
            'HTML 的 class 属性，与恶魔的“属性”是两回事。',
          )}
        >
          {tabs(fields.map((f) => f.label))}
          <div className={`${p.codeGrid} ${p.comicCodeGrid}`}>
            <NotebookPanel
              compact
              title="我的第一次网页请求.ipynb"
              cells={[
                {
                  code: `record = soup.find("article", class_="record")\n${field.key} = record.find(\n    "span", class_="${field.key}"\n)\nprint(${field.key}.get_text(strip=True))`,
                  activeLines: [1, 2, 4],
                  output: records[0][field.key],
                },
              ]}
            >
              <ParseStoryComic
                scene="fields"
                step={step}
                value={records[0][field.key]}
              />
            </NotebookPanel>
            <div id={`${id}-reference`} className={p.referenceSlot}>
              {v.showHtml ? (
                <ParseHtmlReference mode="fields" step={step} source={source} />
              ) : (
                <div className={p.stack}>
                  <RecordCard record={records[0]} field={field.key} />
                  <Guide variant={2}>
                    <strong>find()</strong> 找到元素；
                    <strong>get_text()</strong> 取出文字。strip=True
                    去掉首尾空白。
                  </Guide>
                </div>
              )}
            </div>
          </div>
        </Stage>
      );
    }
    case 'l2-loop':
      return (
        <Stage
          title="让三张记录卡，依次经过"
          label="FOR · 每次处理一个恶魔"
          footer={referenceFooter(
            '本页先逐条打印名字；课堂练习二再加入地点、属性和弱点。',
          )}
        >
          {tabs(records.map((r) => r.name))}
          <div className={`${p.codeGrid} ${p.comicCodeGrid}`}>
            <NotebookPanel
              compact
              title="我的第一次网页请求.ipynb"
              cells={[
                {
                  code: `${selectRecords}\nfor record in records:\n    name = record.find("h2", class_="name")\n    print(name.get_text(strip=True))`,
                  activeLines: [1, 2, 3],
                  output: records[step].name,
                  outputLabel: `本轮输出示意 · 第 ${step + 1} 次`,
                },
              ]}
            >
              <ParseStoryComic scene="loop" step={step} />
            </NotebookPanel>
            <div id={`${id}-reference`} className={p.referenceSlot}>
              {v.showHtml ? (
                <ParseHtmlReference mode="loop" step={step} source={source} />
              ) : (
                <div className={p.stack}>
                  <RecordCard record={records[step]} field="name" />
                  <Guide variant={step}>
                    这一轮，<strong>record</strong> 就是“{records[step].name}
                    ”这张 article。找到其中的 h2，再打印名字。
                  </Guide>
                </div>
              )}
            </div>
          </div>
        </Stage>
      );
    case 'l2-hotspot-code':
      return (
        <Stage
          title="核对简报：每条敌情都要配对"
          label="CLASS PRACTICE · 课堂练习 02 · 核对"
          footer={
            <div className={p.footer}>
              <ScoutHtmlDialog />
              <ParseCodeDialog />
            </div>
          }
        >
          <div className={p.reviewHeader}>
            <ClassPracticeStamp number="02" checklist />
            <p>对照你运行后的输出，再回到 HTML 查证。</p>
            <button
              className={s.secondary}
              onClick={() => set({ reveal: !v.reveal })}
            >
              {v.reveal ? '收起核对结果' : '查看核对结果'}
            </button>
          </div>
          <table className={p.results}>
            <caption>前线敌情简报 · 输出对照</caption>
            <thead>
              <tr>
                {['恶魔名字', '出没地点', '属性', '已知弱点'].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.name}>
                  <th>{r.name}</th>
                  {fields.map((f) => (
                    <td key={f.key}>{v.reveal ? r[f.key] : '待核对'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Stage>
      );
    default:
      return null;
  }
}

export function ScoutParsingPractice() {
  const [v, set] = usePageState({ checked: [false, false, false] });
  const cells = [
    { code: setup },
    { code: selectRecords },
    { code: extraction },
  ];
  return (
    <Stage
      title="为三个恶魔整理完整情报"
      label="CLASS PRACTICE · 课堂练习 02"
      footer={
        <div className={p.footer}>
          <span>每格写完按 Shift + Enter，再继续下一格。</span>
          <ParseCodeDialog />
        </div>
      }
    >
      <div className={p.practiceGrid}>
        <div className={p.continuedNotebook}>
          <div className={p.previousCell}>
            ↑ 上方：课堂练习一（先运行，得到 res）
          </div>
          <NotebookPanel
            title="我的第一次网页请求.ipynb"
            cells={cells}
            compact
          />
        </div>
        <aside className={p.practiceTask}>
          <div className={p.taskHeading}>
            <ClassPracticeStamp number="02" checklist />
            <h3>
              接着练习一
              <br />
              继续写
            </h3>
          </div>
          <p>保留练习一代码，在它下方新建三个 Code 单元格，从上到下跟写。</p>
          <div className={p.checks}>
            {[
              '取到三个恶魔的记录',
              '输出地点、属性和已知弱点',
              '对照 HTML，确认每条信息配对',
            ].map((text, i) => (
              <label key={text}>
                <input
                  type="checkbox"
                  checked={v.checked[i]}
                  onChange={() =>
                    set({
                      checked: v.checked.map((x, j) => (i === j ? !x : x)),
                    })
                  }
                />
                {text}
              </label>
            ))}
          </div>
          <button
            className={s.secondary}
            onClick={() => set({ checked: [false, false, false] })}
          >
            重新自查
          </button>
        </aside>
      </div>
    </Stage>
  );
}
