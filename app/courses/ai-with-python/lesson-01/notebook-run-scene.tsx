/* oxlint-disable next/no-img-element -- Keep the supplied annotated notebook image as the demonstration backdrop. */
'use client';

import { useRef, type KeyboardEvent } from 'react';
import { asset, Stage, Steps, useSceneState } from './lesson-ui';
import { useScreenshotConnections } from './use-screenshot-connections';
import tour from './jupyter-interface-scene.module.css';
import s from './notebook-run-scene.module.css';

const regions = [
  { id: 1, side: 'top', x: '13.2%', y: 'calc(8.8% - 16px)' },
  { id: 2, side: 'bottom', x: '4.8%', y: 'calc(77.2% + 16px)' },
  { id: 3, side: 'bottom', x: '81.8%', y: '90%' },
] as const;
const greetings = ['Hello, Python!', 'Hi, Python!'];

export function NotebookRunScene() {
  const [value, setValue] = useSceneState('notebook-run', {
    step: 0,
    variant: 0,
    outputVariant: 0,
    pendingVariant: null as number | null,
    runCount: 0,
  });
  const diagramRef = useRef<HTMLDivElement>(null);
  const connections = useScreenshotConnections(diagramRef, regions);
  const executionNumber = 2 + Math.max(1, value.runCount);
  const executionLabel =
    value.step === 0
      ? '[ ]'
      : value.step === 1
        ? '[*]'
        : `[${executionNumber}]`;
  const changed = value.step === 2 && value.variant !== value.outputVariant;

  function startRun() {
    if (value.step !== 1) setValue({ step: 1, pendingVariant: value.variant });
  }

  function finishRun() {
    setValue({
      step: 2,
      outputVariant: value.pendingVariant ?? value.variant,
      runCount: value.runCount + 1,
    });
  }

  function handleRunShortcut(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      startRun();
    }
  }

  function selectStep(step: number) {
    if (step === 1) {
      if (value.step !== 1) setValue({ step, pendingVariant: value.variant });
    } else if (step === 2 && value.step === 1) {
      finishRun();
    } else if (step === 2 && value.runCount === 0) {
      setValue({ step, outputVariant: value.variant, runCount: 1 });
    } else {
      setValue({ step });
    }
  }

  return (
    <Stage
      label="JUPYTERLAB · 操作 03"
      title="运行代码，再看输出发生了什么"
      className={`${tour.scene} ${s.scene}`}
    >
      <div className={s.steps}>
        <Steps
          items={['运行前 [ ]', '运行中 [*]', `运行完成 [${executionNumber}]`]}
          index={value.step}
          onChange={selectStep}
        />
      </div>
      <div className={`${tour.diagram} ${s.diagram}`} ref={diagramRef}>
        <section
          className={`${tour.callout} ${s.runCallout}`}
          data-callout={1}
          aria-label="1 运行按钮"
        >
          <b className={tour.number} aria-hidden="true">
            1
          </b>
          <h3>运行单元格</h3>
          <p>
            {
              [
                '点击 ▶ / Shift + Enter',
                '停在星号，观察后继续。',
                '改代码后，再运行。',
              ][value.step]
            }
          </p>
          <button
            className={s.changeButton}
            onClick={() => setValue({ variant: 1 - value.variant })}
            disabled={value.step === 1}
          >
            只改文字，不运行
          </button>
          <button
            className={s.runButton}
            onClick={value.step === 1 ? finishRun : startRun}
            onKeyDown={handleRunShortcut}
          >
            {value.step === 1
              ? '完成本次演示 →'
              : value.step === 2
                ? '▶ 重新运行'
                : '▶ 演示运行'}
          </button>
        </section>

        <div className={tour.pictureSpace}>
          <div
            className={s.picture}
            data-tour-picture
            data-run-state={value.step}
          >
            <img
              src={asset('image95.png')}
              width={2630}
              height={604}
              alt={`JupyterLab 完整运行界面。前两个单元格已输出 One 和 Two；第三个单元格演示${['运行前', '运行中', '运行完成'][value.step]}，运行按钮、执行编号和输出区域与图外说明相连。`}
            />
            <button
              className={s.runHotspot}
              aria-label="图中运行按钮（演示）"
              onClick={startRun}
              onKeyDown={handleRunShortcut}
              disabled={value.step === 1}
            />
            <span
              className={s.executionCount}
              aria-label={`当前单元格执行状态：${executionLabel}`}
            >
              {executionLabel}
            </span>
            <code className={s.code} aria-label="当前单元格代码">
              <span>print</span>(
              <span className={s.string}>
                &quot;{greetings[value.variant]}&quot;
              </span>
              )
            </code>
            <div
              className={s.output}
              aria-label="当前单元格输出"
              aria-live="polite"
            >
              {value.step === 2 ? greetings[value.outputVariant] : ''}
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
            className={`${tour.callout} ${s.statusCallout}`}
            data-callout={2}
            aria-label="2 执行状态"
          >
            <b className={tour.number} aria-hidden="true">
              2
            </b>
            <h3>{executionLabel}</h3>
            <p>
              {value.step === 0
                ? '空白：尚未运行。'
                : value.step === 1
                  ? '星号：正在运行。'
                  : '本次执行的顺序号。'}
            </p>
          </section>
          <section
            className={`${tour.callout} ${s.outputCallout}`}
            data-callout={3}
            aria-label="3 观察输出"
          >
            <b className={tour.number} aria-hidden="true">
              3
            </b>
            <h3>看输出</h3>
            <p aria-live="polite">
              {value.step === 0
                ? '运行后，结果出现在代码下方。'
                : value.step === 1
                  ? '等本次运行结束，再看输出。'
                  : changed
                    ? '代码改了，输出还没更新。'
                    : '输出来自上一次执行的代码。'}
            </p>
          </section>
        </div>

        <svg className={tour.connections} aria-hidden="true">
          {connections.map((path, index) => (
            <path key={regions[index].id} d={path} />
          ))}
        </svg>
      </div>
      <p className={s.note}>
        课堂状态演示 · 不在网页内执行 Python。Shift + Enter 在 JupyterLab
        中还会移到下一格。
      </p>
    </Stage>
  );
}
