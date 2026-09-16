'use client';

import { ArrowRight } from 'lucide-react';
import { asset, Stage, ZoomImage } from './lesson-ui';
import s from './editor-transition-scene.module.css';

export function EditorTransitionScene() {
  return (
    <Stage
      label="PYTHON TOOLBOX · 熟悉的新工具"
      title="从 Mu 到 JupyterLab"
      className={s.scene}
    >
      <div className={s.comparison}>
        <section className={s.tool} aria-label="Mu Editor 界面">
          <h3>Mu Editor</h3>
          <div className={s.screen}>
            <ZoomImage
              src={asset('image85.png')}
              alt="Mu Editor：熟悉的工具栏和 Python 代码编辑区"
              label="放大 Mu 界面"
            />
          </div>
        </section>

        <div className={s.arrow} aria-hidden="true">
          <ArrowRight strokeWidth={2.5} />
        </div>

        <section className={s.tool} aria-label="JupyterLab 界面">
          <h3>JupyterLab</h3>
          <div className={s.screen}>
            <ZoomImage
              src={asset('image86.png')}
              alt="JupyterLab：并排展示笔记、代码和图表的工作区"
              label="放大 JupyterLab 界面"
            />
          </div>
        </section>
      </div>

      <div className={s.footer}>
        <p className={s.takeaway}>
          <strong>Python 没有变</strong>，今天换一个做实验的工作台。
        </p>
        <a
          className={s.onlineLink}
          href="https://jupyter.org/try-jupyter/lab/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在线 JupyterLab（在新标签页打开）"
        >
          https://jupyter.org/try-jupyter/lab/
        </a>
      </div>
    </Stage>
  );
}
