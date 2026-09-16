/* oxlint-disable next/no-img-element -- Preserve the full supplied Launcher screenshot. */
'use client';

import { useRef } from 'react';
import { asset, Stage } from './lesson-ui';
import { useScreenshotConnections } from './use-screenshot-connections';
import tour from './jupyter-interface-scene.module.css';
import s from './notebook-create-scene.module.css';

const steps = [
  { id: 1, x: 2.7, y: 16.8, side: 'left' },
  { id: 2, x: 2.7, y: 7, side: 'left' },
  { id: 3, x: 42.5, y: 45.2, side: 'right' },
] as const;

export function NotebookCreateScene() {
  const diagramRef = useRef<HTMLDivElement>(null);
  const connections = useScreenshotConnections(diagramRef, steps);

  return (
    <Stage
      label="JUPYTERLAB · 操作 01"
      title="新建一个 Python 笔记本"
      className={`${tour.scene} ${s.scene}`}
    >
      <div className={s.diagram} ref={diagramRef}>
        <div className={s.leftNotes}>
          <section
            className={`${tour.callout} ${s.callout}`}
            data-callout={2}
            aria-label="2 点击蓝色加号"
          >
            <b className={tour.number} aria-hidden="true">
              2
            </b>
            <h3>点蓝色＋</h3>
            <p>再打开启动页。</p>
          </section>
          <section
            className={`${tour.callout} ${s.callout}`}
            data-callout={1}
            aria-label="1 选择保存文件夹"
          >
            <b className={tour.number} aria-hidden="true">
              1
            </b>
            <h3>选文件夹</h3>
            <p>先选好笔记本的保存位置。</p>
          </section>
        </div>

        <div className={tour.pictureSpace}>
          <div className={s.picture} data-tour-picture>
            <img
              src={asset('image91.png')}
              width={2192}
              height={1392}
              alt="JupyterLab Launcher 完整界面。序号 1 标出保存位置，2 标出蓝色加号，3 标出 Notebook 分组中的 Python 3 (ipykernel)，分别连接到图外操作说明。"
            />
            {steps.map((step) => (
              <span
                key={step.id}
                className={`${tour.number} ${tour.marker}`}
                style={{
                  left:
                    step.side === 'left'
                      ? `calc(${step.x}% - 16px)`
                      : `${step.x}%`,
                  top: `${step.y}%`,
                }}
                data-marker={step.id}
                aria-hidden="true"
              >
                {step.id}
              </span>
            ))}
          </div>
        </div>

        <section
          className={`${tour.callout} ${s.callout} ${s.createNote}`}
          data-callout={3}
          aria-label="3 新建 Python 笔记本"
        >
          <b className={tour.number} aria-hidden="true">
            3
          </b>
          <h3>新建笔记本</h3>
          <p>
            在 <strong>Notebook</strong>（笔记本）分组中选择
          </p>
          <strong className={s.kernel}>
            Python 3<span>(ipykernel)</span>
          </strong>
        </section>

        <svg className={tour.connections} aria-hidden="true">
          {connections.map((path, index) => (
            <path key={steps[index].id} d={path} />
          ))}
        </svg>
      </div>

      <p className={s.completion}>
        <strong>完成标志：</strong>顶部出现 .ipynb 标签，页面中出现空白单元格。
      </p>
    </Stage>
  );
}
