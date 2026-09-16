/* oxlint-disable next/no-img-element -- Local course illustrations. */
'use client';
import { Stage } from '../lesson-01/lesson-ui';
import { usePageState } from './lesson-state';
import { Note, ScoutResources, StepBar } from './lesson-ui';
import { assetBase, scoutOrigin, scoutUrl, scoutPath } from './lesson-data';
import {
  NotebookPanel,
  RequestExplainer,
  ResponseExplainer,
} from './notebook-panels';
import s from './lesson.module.css';
import { MissionComic } from './mission-comic';
import { ScoutObserveScene } from './scout-observe-scene';
import { ScoutScaleScene } from './scout-scale-scene';
import { ScoutWebScene } from './scout-web-scene';

export function RequestScene({ id }: { id: string }) {
  const [v, set] = usePageState({ step: 0, choice: -1, reveal: false });
  const addressCode = `url = "${scoutUrl}"`;
  switch (id) {
    case 'l2-mission':
      return <MissionComic />;
    case 'l2-scout-observe':
      return <ScoutObserveScene />;
    case 'l2-scout-scale':
      return <ScoutScaleScene />;
    case 'l2-browser':
      return <ScoutWebScene />;
    case 'l2-rules':
      return (
        <Stage
          title="这位小帮手，叫网页爬虫"
          label="认识工具 · 把取网页的事交给程序"
          footer={
            <Note>
              取信有约定：只取允许获取的资料，不频繁打扰，遇到限制就停下。
            </Note>
          }
        >
          <div className={s.crawlerIntro}>
            <p className={s.crawlerDefinition}>
              网页爬虫，是按规则<strong>自动获取网页信息</strong>的程序。
            </p>
            <p>电脑里的程序，就像这位小帮手，按约定替我们取回网页。</p>
          </div>
          <figure className={s.crawlerConcept}>
            <img
              src={`${assetBase}/assets/scout-crawler-concept.png`}
              alt="用机械信使作比喻：勇士交给它地址，它到前线档案室取回网页资料，再带回给勇士。"
            />
            <figcaption>
              <span>勇士：给出地址</span>
              <span>小帮手：自动取回网页</span>
              <span>档案室：提供资料</span>
            </figcaption>
          </figure>
        </Stage>
      );
    case 'l2-http':
      return (
        <Stage
          title="一次请求的旅程"
          label="像取信一样 · 请求与响应"
          footer={
            <Note>
              GET 表示“请给我这份资源”；HTTP
              是双方传递请求和响应时遵循的通信规则。
            </Note>
          }
        >
          <div className={s.storyFlow}>
            <div className={s.storyEndpoint}>
              <img
                src={`${assetBase}/assets/scout-http-client.png`}
                alt="勇士在电脑前准备写有网页地址的取信请求。"
              />
              <h3>勇士的电脑</h3>
              <p className={s.roleTerm}>浏览器 / Python 程序</p>
              <p>按网页地址，发出请求。</p>
            </div>
            <div
              className={s.requestExchange}
              aria-label="先向服务器发出请求，再接收服务器返回的响应"
            >
              <div className={s.exchangeLeg}>
                <strong>1 发出请求 · GET</strong>
                <p>请把 /scout.html 给我</p>
                <span className={s.exchangeArrow} aria-hidden="true" />
              </div>
              <div className={`${s.exchangeLeg} ${s.responseLeg}`}>
                <span className={s.exchangeArrow} aria-hidden="true" />
                <strong>2 返回响应</strong>
                <p>200 成功 + HTML 网页</p>
              </div>
            </div>
            <div className={s.storyEndpoint}>
              <img
                src={`${assetBase}/assets/scout-http-server.png`}
                alt="前线档案管理员从档案室取出已保存的网页资料，准备回信。"
              />
              <h3>前线档案室</h3>
              <p className={s.roleTerm}>网站服务器</p>
              <p>找到网页，把它装进回信。</p>
            </div>
          </div>
        </Stage>
      );
    case 'l2-url': {
      const step = Math.min(v.step, 1);
      return (
        <Stage
          title="程序要去哪里？"
          label="URL · 网页地址"
          footer={
            <Note>
              完整网址 = 网站地址 + 网页路径。把它交给程序，就知道去哪里取资料。
            </Note>
          }
        >
          <StepBar
            items={['网站地址', '网页路径']}
            value={step}
            onChange={(step) => set({ step })}
          />
          <div className={s.url}>
            {step === 0 ? <mark>{scoutOrigin}</mark> : scoutOrigin}
            {step === 1 ? <mark>{scoutPath}</mark> : scoutPath}
          </div>
          <div className={s.urlStory}>
            <div className={s.urlStoryCopy}>
              <h3>{['先找到侦察站', '再找到这份记录'][step]}</h3>
              <p>
                {
                  [
                    '像先找到一座档案室：前半段告诉程序用 HTTPS 访问哪个网站。',
                    '像到档案室取一份资料：/scout.html 告诉程序要取哪个网页。',
                  ][step]
                }
              </p>
              <a
                className={s.secondary}
                href={scoutUrl}
                target="_blank"
                rel="noreferrer"
              >
                打开前线侦察记录 ↗
              </a>
            </div>
            <div className={s.urlComic}>
              <img
                src={`${assetBase}/assets/${step === 0 ? 'scout-url-site-wide.png' : 'scout-url-record-wide.png'}`}
                alt={
                  step === 0
                    ? '勇士和小信使找到前线档案室。'
                    : '小信使从档案室中取出指定的敌情卷轴。'
                }
              />
            </div>
          </div>
        </Stage>
      );
    }
    case 'l2-request-code': {
      const step = Math.min(v.step, 3);
      const code = [
        'import requests',
        addressCode,
        'res = requests.get(url, timeout=10)',
        'print(res.status_code)\nres.encoding = "utf-8"\nprint(res.text)',
      ]
        .slice(0, step + 1)
        .join('\n');
      return (
        <Stage
          title="用 Python 取回网页"
          label="REQUESTS · 跟着小派读代码"
          footer={
            <div className={s.notebookFooter}>
              <ScoutResources />
            </div>
          }
        >
          <StepBar
            items={['准备工具', '指定地址', '发送请求', '查看响应']}
            value={step}
            onChange={(step) => set({ step })}
          />
          <div
            className={`${s.two} ${s.notebookLesson} ${s.requestNotebookLesson}`}
          >
            <NotebookPanel
              title="前线侦察.ipynb"
              cells={[
                {
                  code,
                  activeLines: [[0], [1], [2], [3, 4, 5]][step],
                },
              ]}
            />
            <RequestExplainer step={step} />
          </div>
        </Stage>
      );
    }
    case 'l2-response': {
      const step = Math.min(v.step, 1);
      const cells: {
        code: string;
        activeLines: number[];
        output: string;
        outputLabel?: string;
      }[] = [
        {
          code: 'print(res.status_code)',
          activeLines: step === 0 ? [0] : [],
          output: '200',
        },
      ];
      if (step === 1)
        cells.push({
          code: 'res.encoding = "utf-8"\nprint(res.text)',
          activeLines: [0, 1],
          output:
            '<h2 class="name">炎角兽</h2>\n…\n<span class="location">北方峡谷</span>',
          outputLabel: '输出示例 · HTML 节选',
        });
      return (
        <Stage
          title="res 里装着什么？"
          label="响应对象 · 跟着小派拆回信"
          footer={
            <p className={s.small}>
              先运行上一页的请求代码。状态码为 200 时，也要核对返回的 HTML
              是否包含所需记录。
            </p>
          }
        >
          <StepBar
            items={['看状态码', '读网页正文']}
            value={step}
            onChange={(step) => set({ step })}
          />
          <div className={`${s.two} ${s.notebookLesson}`}>
            <NotebookPanel
              title="前线侦察.ipynb"
              cells={cells}
              executionStart={2}
            />
            <ResponseExplainer step={step} />
          </div>
        </Stage>
      );
    }
    default:
      return null;
  }
}
