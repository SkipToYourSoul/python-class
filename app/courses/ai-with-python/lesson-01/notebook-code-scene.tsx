/* oxlint-disable next/no-img-element -- Keep the supplied notebook screenshot intact behind the input demonstration. */
'use client';

import { useRef } from 'react';
import { asset, Choices, Stage, useSceneState } from './lesson-ui';
import { useScreenshotConnections } from './use-screenshot-connections';
import tour from './jupyter-interface-scene.module.css';
import s from './notebook-code-scene.module.css';

const example = 'print("Hello, Python!")';
const regions = [
  { id: 1, side: 'top', x: 'calc(77.5% + 16px)', y: '26.9%' },
  { id: 2, side: 'bottom', x: '96.5%', y: 'calc(61.9% + 16px)' },
  { id: 3, side: 'bottom', x: '43.2%', y: 'calc(61.9% + 16px)' },
] as const;

export function NotebookCodeScene() {
  const [value, setValue] = useSceneState('notebook-code', {
    text: '',
    filled: false,
  });
  const diagramRef = useRef<HTMLDivElement>(null);
  const connections = useScreenshotConnections(diagramRef, regions);

  return (
    <Stage
      label="JUPYTERLAB · 操作 02"
      title="在单元格里输入代码"
      className={`${tour.scene} ${s.scene}`}
    >
      <div className={tour.diagram} ref={diagramRef}>
        <div className={s.topRow}>
          <section className={s.demonstration} aria-label="课堂输入示意">
            <div className={s.switches}>
              <span>课堂输入示意</span>
              <Choices
                label="输入前后"
                items={['输入前', '输入后']}
                value={value.filled ? 1 : 0}
                onChange={(index) =>
                  setValue({
                    filled: index === 1,
                    text: index === 1 ? example : '',
                  })
                }
              />
            </div>
            <div className={s.reference}>
              <code aria-label={`参考代码：${example}`}>
                <span className={s.functionName}>print</span>
                <b className={s.parenthesis}>(</b>
                <span className={s.string}>
                  <b>&quot;</b>Hello, Python!<b>&quot;</b>
                </span>
                <b className={s.parenthesis}>)</b>
              </code>
              <p>括号、英文引号，都要成对。</p>
            </div>
          </section>
          <section
            className={tour.callout}
            data-callout={1}
            aria-label="1 确认代码类型"
          >
            <b className={tour.number} aria-hidden="true">
              1
            </b>
            <h3>Code · 代码</h3>
            <p>先确认单元格类型。</p>
          </section>
        </div>

        <div className={tour.pictureSpace}>
          <div className={s.picture} data-tour-picture>
            <img
              src={asset('image92.png')}
              width={1782}
              height={556}
              alt="JupyterLab 完整截图：顶部是 Code 类型，上方单元格有 print 示例，下方选中的单元格用于课堂输入示意。图外说明与 Code、输入区和空白执行编号一一对应。"
            />
            <span
              className={`${s.highlight} ${s.codeType}`}
              aria-hidden="true"
            />
            <span
              className={`${s.highlight} ${s.executionCount}`}
              aria-hidden="true"
            />
            <div className={s.inputFrame}>
              <input
                id="lesson-code-input"
                aria-label="图中代码单元格（输入示意）"
                aria-describedby="notebook-input-instruction notebook-input-status"
                className={s.cellInput}
                value={value.text}
                onChange={(event) =>
                  setValue({
                    text: event.target.value,
                    filled: !!event.target.value,
                  })
                }
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {!value.text && (
                <span className={s.idleCaret} aria-hidden="true" />
              )}
            </div>
            {regions.map((region) => (
              <span
                key={region.id}
                className={`${tour.number} ${tour.marker}`}
                style={{ left: region.x, top: region.y }}
                data-marker={region.id}
                aria-hidden="true"
              >
                {region.id}
              </span>
            ))}
          </div>
        </div>

        <div className={s.bottomRow}>
          <section
            className={tour.callout}
            data-callout={3}
            aria-label="3 空白执行编号"
          >
            <b className={tour.number} aria-hidden="true">
              3
            </b>
            <h3>[ ] 未运行</h3>
            <p id="notebook-input-status" aria-live="polite">
              {value.filled ? '已输入，仍未运行。' : '这个单元格还未运行。'}
            </p>
          </section>
          <section
            className={tour.callout}
            data-callout={2}
            aria-label="2 点击输入区"
          >
            <b className={tour.number} aria-hidden="true">
              2
            </b>
            <h3>点击输入区</h3>
            <p id="notebook-input-instruction">
              出现光标后，输入上方的参考代码。
            </p>
          </section>
        </div>

        <svg className={tour.connections} aria-hidden="true">
          {connections.map((path, index) => (
            <path key={regions[index].id} d={path} />
          ))}
        </svg>
      </div>
    </Stage>
  );
}
