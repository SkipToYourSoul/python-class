/* oxlint-disable next/no-img-element -- Keep the supplied Navigator screenshot intact. */
'use client';

import { ArrowDown } from 'lucide-react';
import { asset, Stage } from './lesson-ui';
import s from './anaconda-scene.module.css';

export function AnacondaScene() {
  return (
    <Stage
      label="PYTHON TOOLBOX · 认识 Anaconda"
      title="Anaconda：装好工具的“大蟒蛇”"
      className={s.scene}
    >
      <div className={s.workspace}>
        <figure className={s.tour} aria-label="Anaconda Navigator 工具箱全景">
          <div className={s.pictureSpace}>
            <div className={s.picture}>
              <img
                src={asset('image81.png')}
                alt="Anaconda Navigator 完整窗口。蓝框标出第一行的 JupyterLab 卡片，黄框标出这张卡片底部的 Launch 按钮。"
                width={2880}
                height={1654}
              />
              <div className={s.appHighlight} aria-hidden="true">
                <b>1</b>
              </div>
              <div className={s.launchHighlight} aria-hidden="true">
                <b>2</b>
              </div>
            </div>
          </div>
          <ol className={s.instructions} aria-label="打开 JupyterLab 的步骤">
            <li>
              <b>1</b>
              <span>
                找到 <strong>JupyterLab</strong>
              </span>
            </li>
            <li>
              <b>2</b>
              <span>
                点击 <strong>Launch</strong>（启动）
              </span>
            </li>
          </ol>
        </figure>

        <aside className={s.analogy} aria-label="蟒蛇与大蟒蛇的记忆比喻">
          <p className={s.eyebrow}>名字里的比喻</p>
          <div className={s.python}>
            <span className={s.smallSnake} aria-hidden="true">
              🐍
            </span>
            <div>
              <h3>Python</h3>
              <p>
                <strong>蟒蛇</strong> · 编程语言
              </p>
            </div>
          </div>
          <div className={s.bundle}>
            <ArrowDown size={28} aria-hidden="true" />
            <span>加上常用工具</span>
          </div>
          <div className={s.anaconda}>
            <span className={s.bigSnake} aria-hidden="true">
              🐍
            </span>
            <div>
              <h3>Anaconda</h3>
              <p>
                <strong>大蟒蛇</strong>
              </p>
            </div>
          </div>
          <p className={s.toolbox}>
            把 Python 和数据科学工具装在一起的工具箱。
          </p>
          <p className={s.labNote}>
            <strong>JupyterLab</strong> 就是其中一个写代码的工作台。
          </p>
        </aside>
      </div>
      <p className={s.versionNote}>
        图为课堂使用的软件版本；其他版本中，卡片位置和外观可能不同。
      </p>
    </Stage>
  );
}
