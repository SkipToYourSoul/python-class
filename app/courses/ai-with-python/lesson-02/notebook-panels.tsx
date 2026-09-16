import { type ReactNode } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileCode2,
  Mail,
  MapPin,
  PackageOpen,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { XiaopaiSpeech } from '../lesson-01/xiaopai-speech';
import s from './lesson.module.css';

type Cell = {
  code: string;
  activeLines?: number[];
  output?: string;
  outputLabel?: string;
};

function PythonLine({ text }: { text: string }) {
  return text
    .split(
      /("[^"\n]*"|'[^'\n]*'|\b(?:import|from|for|in|if|else|print|\d+)\b)/g,
    )
    .map((part, index) => {
      const kind = /^['"]/.test(part)
        ? s.pyString
        : /^(import|from|for|in|if|else)$/.test(part)
          ? s.pyKeyword
          : part === 'print'
            ? s.pyFunction
            : /^\d+$/.test(part)
              ? s.pyNumber
              : undefined;
      return (
        <span className={kind} key={index}>
          {part}
        </span>
      );
    });
}

export function NotebookPanel({
  title,
  cells,
  executionStart = 1,
  compact = false,
  children,
}: {
  title: string;
  cells: Cell[];
  executionStart?: number;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`${s.notebook} ${compact ? s.compactNotebook : ''}`}
      aria-label="JupyterLab 代码讲解"
    >
      <div className={s.notebookTab}>
        <BookOpen size={20} aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div className={s.notebookToolbar}>
        <span>
          Code <ChevronDown size={18} aria-hidden="true" />
        </span>
        <span>Python 3</span>
      </div>
      <div className={s.notebookCells}>
        {cells.map((cell, index) => (
          <div className={s.notebookCell} key={index}>
            <div className={s.notebookInput}>
              <span className={s.cellPrompt} aria-hidden="true">
                [{cell.output ? index + executionStart : ' '}]:
              </span>
              <pre>
                <code>
                  {cell.code.split('\n').map((line, lineIndex) => (
                    <span
                      key={lineIndex}
                      className={`${s.notebookLine} ${cell.activeLines?.includes(lineIndex) ? s.activeNotebookLine : ''}`}
                    >
                      <PythonLine text={line || ' '} />
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            {cell.output && (
              <div
                className={`${s.notebookOutput} ${!cell.output.includes('\n') ? s.shortNotebookOutput : ''}`}
              >
                <span className={s.cellOutputLabel}>
                  {cell.outputLabel ?? '输出示例'}
                </span>
                <pre>{cell.output}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
      {children}
    </section>
  );
}

export function RequestExplainer({ step }: { step: number }) {
  const sayings = [
    <>
      先打开工具箱！<strong>import</strong> 把 requests 请来帮忙。
    </>,
    <>
      地址写完整，信使才知道<strong>去哪取资料</strong>！
    </>,
    <>
      用 <strong>get()</strong> 发出请求，把回信交给 <strong>res</strong>。
    </>,
    <>
      收到回信！先看<strong>状态</strong>，再读<strong>正文</strong>。
    </>,
  ];
  return (
    <aside
      className={s.requestExplainer}
      data-step={step}
      aria-label="小派讲解请求代码"
    >
      <h3>
        {
          [
            '装备就位！',
            '给信使一张地址条',
            '出发，再带回资料',
            '回信放进 res',
          ][step]
        }
      </h3>
      <div className={s.requestDiagram}>
        {step === 0 && (
          <div className={s.toolkit}>
            <PackageOpen size={64} aria-hidden="true" />
            <strong>requests</strong>
            <span>取网页的工具包</span>
            <div>
              <code>import</code>
              <ArrowRight aria-hidden="true" />
              <span>准备使用</span>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className={s.addressSlip}>
            <MapPin size={40} aria-hidden="true" />
            <strong>url · 目的地</strong>
            <span>前线侦察记录站</span>
            <ArrowDown aria-hidden="true" />
            <code>/scout.html</code>
            <span>完整网址用引号包起来</span>
          </div>
        )}
        {step === 2 && (
          <div className={s.mailJourney}>
            <div>
              <Send aria-hidden="true" />
              <code>get(url)</code>
              <ArrowRight aria-hidden="true" />
              <strong>侦察站</strong>
            </div>
            <div>
              <Mail aria-hidden="true" />
              <code>res</code>
              <ArrowLeft aria-hidden="true" />
              <span>回信</span>
            </div>
            <p>timeout=10：连接或读取时，连续等待超过 10 秒就报错。</p>
          </div>
        )}
        {step === 3 && (
          <div className={s.replyParts}>
            <div className={s.replyHeading}>
              <Mail size={40} aria-hidden="true" />
              <strong>res · 响应对象</strong>
            </div>
            <div>
              <code>status_code</code>
              <span>看状态</span>
            </div>
            <div>
              <code>text</code>
              <span>读 HTML</span>
            </div>
            <p>
              encoding = &quot;utf-8&quot;
              <br />用 UTF-8 读中文
            </p>
          </div>
        )}
      </div>
      <XiaopaiSpeech active label="小派讲解请求代码">
        {sayings[step]}
      </XiaopaiSpeech>
    </aside>
  );
}

export function ResponseExplainer({ step }: { step: number }) {
  return (
    <aside
      className={s.responseExplainer}
      data-step={step}
      aria-label="小派拆解响应对象"
    >
      {step === 0 ? (
        <>
          <div className={s.statusLetter}>
            <div>
              <Mail aria-hidden="true" />
              <code>res.status_code</code>
            </div>
            <strong>200</strong>
            <span>
              <ShieldCheck aria-hidden="true" />
              请求成功
            </span>
          </div>
          <XiaopaiSpeech active label="小派讲解状态码">
            这封回信说：<strong>请求成功了！</strong>接下来看看带回了什么。
          </XiaopaiSpeech>
          <p className={s.explainerNote}>
            <code>res</code> 是回信，<strong>点号</strong>用来读取它的信息。
          </p>
        </>
      ) : (
        <>
          <XiaopaiSpeech active label="小派讲解网页正文">
            打开 <strong>text</strong>！敌情记录就藏在这些{' '}
            <strong>HTML 标签</strong>里。
          </XiaopaiSpeech>
          <div className={s.htmlLetter}>
            <div>
              <FileCode2 aria-hidden="true" />
              <strong>res.text · 网页正文</strong>
            </div>
            <p>
              <code>&lt;h2&gt;</code>
              <mark>炎角兽</mark>
              <code>&lt;/h2&gt;</code>
            </p>
            <p>
              <code>&lt;span&gt;</code>
              <mark>北方峡谷</mark>
              <code>&lt;/span&gt;</code>
            </p>
            <span>标签包着我们要找的信息</span>
          </div>
          <p className={s.explainerNote}>
            requests 取回 HTML，不会运行网页中的 JavaScript。
          </p>
        </>
      )}
    </aside>
  );
}
