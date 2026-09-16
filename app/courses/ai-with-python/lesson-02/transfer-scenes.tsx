/* oxlint-disable next/no-img-element -- Local classroom comic. */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Keyboard access to scrollable code. */
'use client';
import { type ReactNode } from 'react';
import {
  ArrowRight,
  Clapperboard,
  FileCheck2,
  Mail,
  ShieldAlert,
  FileCode2,
} from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import { XiaopaiSpeech } from '../lesson-01/xiaopai-speech';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { usePageState } from './lesson-state';
import { Note, StepBar } from './lesson-ui';
import { NotebookPanel } from './notebook-panels';
import { MovieStoryComic } from './movie-story-comic';
import {
  MovieWritingPractice as CombinedMoviePractice,
  moviePracticeCells,
} from './movie-writing-practice';
import { assetBase } from './lesson-data';
import {
  movieUrl,
  movieRequestCells,
  movieParseCells,
  movieHtml,
  movieRows,
  movieSampleCode,
} from './movie-content';
import s from './lesson.module.css';
import m from './transfer.module.css';

function Guide({
  children,
  reverse = false,
}: {
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={m.guide} data-pose={reverse ? 'reverse' : 'normal'}>
      <XiaopaiSpeech active compact label="小派讲解电影采集">
        {children}
      </XiaopaiSpeech>
    </div>
  );
}
function MovieRows({ count = 3 }: { count?: number }) {
  return (
    <div className={m.movie}>
      <small>豆瓣页面节选 · 输出对照</small>
      {movieRows.slice(0, count).map(([name, score]) => (
        <div key={name}>
          <span>{name}</span>
          <strong>{score}</strong>
        </div>
      ))}
    </div>
  );
}
function MovieDialog({ sample = false }: { sample?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger className={s.secondary}>
        {sample ? '访问失败时，使用保存样本' : '查看完整代码与输出'}
      </DialogTrigger>
      <DialogContent className={m.dialog}>
        <DialogHeader>
          <DialogTitle>
            {sample ? '用保存的 HTML 继续解析' : '课堂练习 03 · 完整代码'}
          </DialogTitle>
          <DialogDescription>
            {sample
              ? '下载并解压练习包，在同一文件夹打开笔记本。运行下面的单元格，再运行练习中的第三个解析单元格。'
              : 'Python 3；沿用已安装的 requests、beautifulsoup4。在同一个笔记本从上到下运行，请求成功后继续解析。'}
          </DialogDescription>
        </DialogHeader>
        <pre tabIndex={0}>
          {sample ? movieSampleCode : moviePracticeCells.join('\n\n')}
        </pre>
        {!sample && (
          <p>
            输出对照（保存页面前三条）：肖申克的救赎、霸王别姬、泰坦尼克号。每个标题各占一行，实际内容以收到的网页为准。
          </p>
        )}
        <div className={m.actions}>
          <a
            className={s.secondary}
            href={`${assetBase}/practice/lesson-02-practice.zip`}
            download
          >
            下载练习包
          </a>
          <a
            href={`${assetBase}/practice/README.txt`}
            target="_blank"
            rel="noreferrer"
          >
            运行说明 ↗
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export function MovieWritingPractice() {
  return (
    <CombinedMoviePractice
      dialogs={
        <>
          <MovieDialog sample />
          <MovieDialog />
        </>
      }
    />
  );
}
export function TransferScene({ id }: { id: string }) {
  const [v, set] = usePageState({ step: 0, showHtml: false });
  switch (id) {
    case 'l2-movies':
      return (
        <Stage
          title="敌情交给程序，今晚看什么？"
          label="故事继续 · 勇士的电影时间"
          footer={
            <Note>
              把“取回网页 → 找到元素 → 获取文本”的方法，带到真实网站。
            </Note>
          }
        >
          <div className={`${m.grid} ${m.balanced}`}>
            <img
              className={m.art}
              src={`${assetBase}/assets/warriors-movie-time.png`}
              alt="程序整理好敌情，勇士们拿着爆米花挑选电影"
            />
            <div className={m.stack}>
              <div className={m.route}>
                <div>
                  <FileCheck2 size={40} />
                  <strong>敌情简报</strong>
                  <small>程序来整理</small>
                </div>
                <ArrowRight />
                <div>
                  <Clapperboard size={40} />
                  <strong>电影清单</strong>
                  <small>勇士来挑选</small>
                </div>
              </div>
              <h3>用片名和评分，做一份清单</h3>
              <p>打开豆瓣电影 Top 250，看看真实网页里藏着哪些资料。</p>
              <a
                className={s.secondary}
                href={movieUrl}
                target="_blank"
                rel="noreferrer"
              >
                打开豆瓣电影 Top 250 ↗
              </a>
              <Guide>
                新任务，老方法：
                <strong>获取和解析 HTML</strong>！
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-headers':
      return (
        <Stage
          title="去新网站，带上程序的名片"
          label="REQUESTS · 请求头"
          footer={
            <Note>
              User-Agent 描述发出请求的客户端；带上名片后，仍要检查回信。
            </Note>
          }
        >
          <StepBar
            items={['换目的地', '附上名片', '发出请求']}
            value={v.step}
            onChange={(step) => set({ step })}
          />
          <div className={m.grid}>
            <NotebookPanel
              title="勇士电影清单.ipynb"
              compact
              cells={[
                {
                  code:
                    'import requests\n\n' +
                    movieRequestCells[1].replace(
                      'requests.get(url, headers=headers, timeout=10)',
                      'requests.get(url, headers=headers,\n                   timeout=10)',
                    ),
                  activeLines: [[2], [3], [4, 5]][v.step],
                },
              ]}
            >
              <MovieStoryComic scene="request" step={v.step} />
            </NotebookPanel>
            <div className={m.stack}>
              <div className={m.envelope}>
                <Mail />
                <strong>
                  {
                    [
                      '目的地：豆瓣电影',
                      '程序名片 · User-Agent',
                      '请求与名片一起出发',
                    ][v.step]
                  }
                </strong>
                <code>
                  {
                    [
                      movieUrl,
                      'ClassroomStudy/1.0',
                      'get(url, headers=headers)',
                    ][v.step]
                  }
                </code>
              </div>
              <Guide reverse={v.step === 1}>
                {
                  [
                    <>
                      只换 <strong>url</strong>。熟悉的
                      requests，继续帮我们取网页。
                    </>,
                    <>
                      把名片放进 <strong>headers</strong>。User-Agent
                      是其中的一项说明。
                    </>,
                    <>
                      用 <strong>headers=headers</strong> 带上名片；回信仍然交给
                      res。
                    </>,
                  ][v.step]
                }
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-failure':
      return (
        <Stage
          title="收到回信，先确认拿对了"
          label="响应检查 · 状态与内容"
          footer={<MovieDialog sample />}
        >
          <StepBar
            items={['看状态', '看内容', '需要验证时']}
            value={v.step}
            onChange={(step) => set({ step })}
          />
          <div className={m.grid}>
            <NotebookPanel
              title="勇士电影清单.ipynb"
              compact
              cells={[
                {
                  code: movieRequestCells[2],
                  activeLines: v.step === 1 ? [2, 3, 4] : [0, 1],
                },
              ]}
            >
              <MovieStoryComic scene="response" step={v.step} />
            </NotebookPanel>
            <div className={m.stack}>
              <div className={m.status} data-stop={v.step === 2}>
                {v.step === 2 ? <ShieldAlert /> : <FileCode2 />}
                <strong>
                  {
                    [
                      '200 · 请求成功',
                      'HTML 里有电影吗？',
                      '验证或拒绝 · 先停下',
                    ][v.step]
                  }
                </strong>
              </div>
              {v.step === 1 && <MovieRows />}
              <Guide reverse={v.step === 2}>
                {
                  [
                    <>
                      先读状态码。<strong>raise_for_status()</strong> 遇到 HTTP
                      错误会报错，提醒我们停下来。
                    </>,
                    <>
                      <strong>print(html)</strong> 显示网页正文。200
                      也可能是验证页，要继续查看正文。
                    </>,
                    <>
                      如果拿到验证页或请求报错，先停止。用老师准备的
                      <strong>保存样本</strong>，继续练解析。
                    </>,
                  ][v.step]
                }
              </Guide>
            </div>
          </div>
        </Stage>
      );
    case 'l2-movie-code':
      return (
        <Stage
          title="同一个公式，找到电影资料"
          label="方法迁移 · 从 RECORD 到 ITEM"
          footer={
            <div className={m.footer}>
              <p>代码节选：先找到电影，再取片名和评分。</p>
              <button
                className={s.secondary}
                onClick={() => set({ showHtml: !v.showHtml })}
              >
                {v.showHtml ? '返回图示讲解' : '查看对应 HTML'}
              </button>
            </div>
          }
        >
          <StepBar
            items={['根据属性', '寻找元素', '获取文本']}
            value={v.step}
            onChange={(step) => set({ step })}
          />
          <div className={m.grid}>
            <NotebookPanel
              title="勇士电影清单.ipynb"
              compact
              cells={[
                {
                  code:
                    movieParseCells[0].split('\n').slice(0, 2).join('\n') +
                    '\n' +
                    movieParseCells[1].split('\n').slice(0, 6).join('\n'),
                  activeLines:
                    v.step === 0 ? [1] : v.step === 1 ? [3, 4] : [6, 7],
                },
              ]}
            >
              <MovieStoryComic scene="parse" step={v.step} />
            </NotebookPanel>
            <div className={m.stack}>
              {v.showHtml ? (
                <div className={m.html}>
                  <strong>豆瓣首条电影 HTML · 节选</strong>
                  <pre>
                    {movieHtml.split('\n').map((line, i) => (
                      <span key={i}>
                        {(
                          v.step === 0
                            ? line.includes('class="item"')
                            : v.step === 1
                              ? /class="(title|rating_num)"/.test(line)
                              : /肖申克|9.7/.test(line)
                        ) ? (
                          <mark>{line}</mark>
                        ) : (
                          line
                        )}
                      </span>
                    ))}
                  </pre>
                </div>
              ) : (
                <>
                  <div className={m.card}>
                    <h3>
                      {
                        [
                          '换的是属性，方法仍熟悉',
                          '每次走进同一张电影卡',
                          '去掉标签，留下文字',
                        ][v.step]
                      }
                    </h3>
                    {v.step === 0 ? (
                      <div className={m.mapping}>
                        <span>恶魔记录</span>
                        <ArrowRight />
                        <span>电影条目</span>
                        <code>record</code>
                        <ArrowRight />
                        <code>item</code>
                        <code>name</code>
                        <ArrowRight />
                        <code>title</code>
                      </div>
                    ) : (
                      <MovieRows count={1} />
                    )}
                  </div>
                  <Guide reverse={v.step === 1}>
                    {
                      [
                        <>
                          先观察网页，电影外层的 class 是 <strong>item</strong>
                          。用 find_all 找到它们。
                        </>,
                        <>
                          片名找 <strong>title</strong>，评分找{' '}
                          <strong>rating_num</strong>。find
                          只取第一个片名，避免中文名、外文名重复。
                        </>,
                        <>
                          先确认两个元素都存在，再用 <strong>get_text()</strong>
                          。一部电影的片名和评分输出在同一行。
                        </>,
                      ][v.step]
                    }
                  </Guide>
                </>
              )}
            </div>
          </div>
        </Stage>
      );
    default:
      return null;
  }
}
