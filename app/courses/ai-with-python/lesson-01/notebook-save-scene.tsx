/* oxlint-disable next/no-img-element -- Supplied JupyterLab screenshots are the backdrop for classroom demonstrations. */
'use client';

import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { asset, Stage, Steps, useSceneState } from './lesson-ui';
import { useScreenshotConnections } from './use-screenshot-connections';
import tour from './jupyter-interface-scene.module.css';
import s from './notebook-save-scene.module.css';

const filename = 'my_first_lab.ipynb';
const points = {
  markdown: [
    { id: 1, side: 'right', x: 'calc(61.8% + 16px)', y: '11.8%' },
    { id: 2, side: 'right', x: 'calc(76.8% + 16px)', y: '59.3%' },
  ],
  rename: [{ id: 1, side: 'right', x: '78%', y: '70%' }],
  save: [{ id: 2, side: 'right', x: 'calc(39% + 16px)', y: '33%' }],
  closed: [
    { id: 1, side: 'right', x: 'calc(31.3% + 16px)', y: 'calc(23.2% + 16px)' },
  ],
  opened: [{ id: 2, side: 'right', x: '97%', y: '82%' }],
} as const;

function NotebookContents({ rendered }: { rendered: boolean }) {
  return (
    <>
      <div className={s.writing}>
        {rendered ? <h3>我的第一次实验</h3> : <code># 我的第一次实验</code>}
        <p>用 Python 输出一句问候。</p>
      </div>
      <code className={s.exampleCode}>print(&quot;Hello, Python!&quot;)</code>
      <p className={s.exampleOutput}>Hello, Python!</p>
    </>
  );
}

export function NotebookSaveScene() {
  const [value, setValue] = useSceneState('notebook-save', {
    step: 0,
    rendered: false,
    renamed: false,
    saved: false,
    opened: false,
  });
  const renamed = value.renamed || value.saved;
  const markdown = value.step === 0;
  const renameDialog = value.step === 1 && !renamed;
  const closed = value.step === 2 && !value.opened;
  const regions = markdown
    ? points.markdown
    : renameDialog
      ? points.rename
      : value.step === 1
        ? points.save
        : closed
          ? points.closed
          : points.opened;
  const source = markdown
    ? { file: 'image96.png', width: 1248, height: 768 }
    : closed
      ? { file: 'image91.png', width: 2192, height: 1392 }
      : { file: 'image92.png', width: 1782, height: 556 };
  const diagramRef = useRef<HTMLDivElement>(null);
  const connections = useScreenshotConnections(diagramRef, regions);

  function save() {
    if (renamed) setValue({ saved: true });
  }
  function toggleMarkdown() {
    setValue({
      rendered: !value.rendered,
      renamed,
      saved: false,
      opened: false,
    });
  }
  function open() {
    if (value.saved) setValue({ opened: true });
  }
  function saveShortcut(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      save();
    }
  }

  return (
    <Stage
      label="JUPYTERLAB · 操作 04"
      title="写说明、保存，再打开"
      className={`${tour.scene} ${s.scene}`}
    >
      <div className={s.steps}>
        <Steps
          items={['写说明', '命名与保存', '重新打开']}
          index={value.step}
          onChange={(step) => setValue({ step })}
        />
      </div>
      <div className={s.diagram} ref={diagramRef}>
        <div className={tour.pictureSpace}>
          <div
            className={s.picture}
            data-tour-picture
            data-save-step={value.step}
            style={
              {
                '--picture-ratio': source.width / source.height,
              } as CSSProperties
            }
          >
            <img
              src={asset(source.file)}
              width={source.width}
              height={source.height}
              alt={
                markdown
                  ? 'JupyterLab 的 Markdown 类型与说明单元格，图中可切换原文和排版效果。'
                  : closed
                    ? 'JupyterLab 文件区与启动页，从左侧文件名重新打开笔记本。'
                    : 'JupyterLab 笔记本界面，演示命名、保存与重新打开后的内容。'
              }
            />
            {markdown ? (
              <div
                className={`${s.markdownContent} ${s.writing}`}
                aria-live="polite"
              >
                {value.rendered ? (
                  <h3>我的第一次实验</h3>
                ) : (
                  <code># 我的第一次实验</code>
                )}
                <p>用 Python 输出一句问候。</p>
              </div>
            ) : closed ? (
              <button
                className={s.fileEntry}
                aria-label={`双击打开 ${filename}（演示）`}
                disabled={!value.saved}
                onDoubleClick={open}
                onClick={(event) => {
                  if (event.detail === 0) open();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    open();
                  }
                }}
              >
                {filename}
              </button>
            ) : (
              <>
                {renamed && (
                  <>
                    <span className={s.fileLabel}>{filename}</span>
                    <span className={s.tabLabel}>{filename}</span>
                  </>
                )}
                <div className={s.document} aria-label="笔记本内容示意">
                  <NotebookContents rendered={value.rendered} />
                </div>
                <button
                  className={s.saveHotspot}
                  aria-label="图中保存按钮（演示）"
                  disabled={!renamed}
                  onClick={save}
                  onKeyDown={saveShortcut}
                />
                {value.saved && <span className={s.savedBadge}>已保存</span>}
              </>
            )}
            {renameDialog && (
              <div className={s.renameDialog} aria-label="重命名操作示意">
                <img
                  src={asset('image97.png')}
                  width={750}
                  height={344}
                  alt="Rename file 对话框，在文件名输入框中填入名称，再点击 Rename。"
                />
                <input
                  aria-label="示例文件名"
                  className={s.filenameInput}
                  value={filename}
                  readOnly
                />
                <button
                  className={s.renameHotspot}
                  onClick={() => setValue({ renamed: true })}
                >
                  Rename
                </button>
              </div>
            )}
            {regions.map((point) => (
              <span
                key={point.id}
                className={`${tour.number} ${tour.marker}`}
                data-marker={point.id}
                style={{ left: point.x, top: point.y }}
                aria-hidden="true"
              >
                {point.id}
              </span>
            ))}
          </div>
        </div>
        <div className={s.callouts}>
          <section className={`${tour.callout} ${s.callout}`} data-callout={1}>
            <b className={tour.number} aria-hidden="true">
              1
            </b>
            <h3>
              {markdown
                ? '写说明'
                : value.step === 1
                  ? '给文件起名'
                  : '打开文件'}
            </h3>
            {markdown ? (
              <p>
                类型选 <strong>Markdown</strong>。<br /># 后留空格，再写标题。
              </p>
            ) : value.step === 1 ? (
              <>
                <p>右键文件名 → Rename</p>
                <button
                  className={s.action}
                  disabled={renamed}
                  onClick={() => setValue({ renamed: true })}
                >
                  {renamed ? '已命名' : '演示重命名'}
                </button>
              </>
            ) : (
              <>
                <p>在左侧双击文件名。</p>
                <button
                  className={s.action}
                  onClick={() =>
                    value.saved
                      ? setValue({ opened: !value.opened })
                      : setValue({ step: 1 })
                  }
                >
                  {!value.saved
                    ? '先命名并保存 →'
                    : value.opened
                      ? '关闭，再试一次'
                      : '演示重新打开'}
                </button>
              </>
            )}
          </section>
          <section className={`${tour.callout} ${s.callout}`} data-callout={2}>
            <b className={tour.number} aria-hidden="true">
              2
            </b>
            <h3>
              {markdown
                ? '看排版'
                : value.step === 1
                  ? '保存笔记本'
                  : '检查内容'}
            </h3>
            {markdown ? (
              <>
                <p>按 Shift + Enter。</p>
                <button
                  className={s.action}
                  onClick={toggleMarkdown}
                  onKeyDown={(event) => {
                    if (event.shiftKey && event.key === 'Enter') {
                      event.preventDefault();
                      toggleMarkdown();
                    }
                  }}
                >
                  {value.rendered ? '返回原文' : '演示排版'}
                </button>
              </>
            ) : value.step === 1 ? (
              <>
                <p>
                  点保存图标，或
                  <br />
                  Ctrl / ⌘ + S。
                </p>
                <button
                  className={s.action}
                  disabled={!renamed || value.saved}
                  onClick={save}
                  onKeyDown={saveShortcut}
                >
                  {value.saved ? '已保存' : '演示保存'}
                </button>
              </>
            ) : (
              <p aria-live="polite">
                {value.opened
                  ? '说明、代码、输出都在。'
                  : '核对说明、代码和输出。'}
              </p>
            )}
          </section>
        </div>
        <svg className={tour.connections} aria-hidden="true">
          {regions.map((region, index) => (
            <path key={region.id} d={connections[index] ?? ''} />
          ))}
        </svg>
      </div>
      <p className={s.note}>
        课堂操作示意 · 请在自己的 JupyterLab 中完成保存。
      </p>
    </Stage>
  );
}
