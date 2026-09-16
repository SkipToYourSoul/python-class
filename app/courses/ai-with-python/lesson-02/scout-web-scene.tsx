/* oxlint-disable next/no-img-element -- Actual teaching website screenshot. */
import {
  ArrowRight,
  FileCode2,
  Monitor,
  MapPin,
  Download,
  Search,
} from 'lucide-react';
import { Stage } from '../lesson-01/lesson-ui';
import { Code, Note } from './lesson-ui';
import { assetBase, scoutPath } from './lesson-data';
import shared from './lesson.module.css';
import s from './scout-web-scene.module.css';

export function ScoutWebScene() {
  return (
    <Stage
      title="前线情报，原来就在网页上"
      label="从情报站 · 到网页背后"
      footer={<Note>能不能让小帮手按地址，自动把这份 HTML 取回来？</Note>}
    >
      <div className={s.compare}>
        <figure className={s.website}>
          <figcaption>
            <Monitor />
            情报站，就是一个网页
          </figcaption>
          <a
            href={scoutPath}
            target="_blank"
            rel="noreferrer"
            aria-label="打开前线侦察记录站，查看完整网页"
          >
            <span className={shared.webRecordCrop}>
              <img
                src={`${assetBase}/assets/scout-web-record.png`}
                alt="情报网页中的炎角兽记录：北方峡谷、火焰、怕强光。"
              />
            </span>
          </a>
          <span>我们看到的敌情 ↗</span>
        </figure>
        <div className={s.connection}>
          <ArrowRight />
          <span>背后是</span>
        </div>
        <div className={s.source}>
          <h3>
            <FileCode2 />
            HTML 里也写着同一条敌情
          </h3>
          <Code label="网页背后的 HTML · 同一条记录节选" highlight={3}>
            {
              '<article class="record">\n  <h2 class="name">炎角兽</h2>\n  <p>出没地点：\n    <span class="location">北方峡谷</span>\n  </p>\n  <!-- 其余字段省略 -->\n</article>'
            }
          </Code>
        </div>
      </div>
      <div
        className={s.flow}
        aria-label="先从情报网页取回 HTML，再从 HTML 中找到敌情"
      >
        <div className={s.node}>
          <Monitor />
          <span>情报网页</span>
        </div>
        <div className={s.arrow}>
          <span>
            <Download />
            先取回
          </span>
          <ArrowRight />
        </div>
        <div className={s.node}>
          <FileCode2 />
          <span>HTML</span>
        </div>
        <div className={s.arrow}>
          <span>
            <Search />
            再寻找
          </span>
          <ArrowRight />
        </div>
        <div className={`${s.node} ${s.result}`}>
          <MapPin />
          <span>
            敌情信息<strong>北方峡谷 · 火焰 · 怕强光</strong>
          </span>
        </div>
      </div>
    </Stage>
  );
}
