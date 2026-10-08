'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { usePageState } from '@/components/course/lesson-state';
import { DataScatter } from './charts';
import { penguins, penguinKinds } from './study-data';
import { PENGUIN_FULL_CODE } from './practice-content';
import s from './penguin-challenge.module.css';

const ROOT = '/courses/ai-with-python/lesson-05';
const fields = {
  billLength: { name: '喙长', unit: 'mm', pythonLabel: 'Bill length (mm)' },
  billDepth: { name: '喙深', unit: 'mm', pythonLabel: 'Bill depth (mm)' },
  flipper: { name: '鳍肢长度', unit: 'mm', pythonLabel: 'Flipper length (mm)' },
  mass: { name: '体重', unit: 'g', pythonLabel: 'Body mass (g)' },
};
type PenguinField = keyof typeof fields;
const fieldKeys = Object.keys(fields) as PenguinField[];
const label = (field: PenguinField) =>
  `${fields[field].name}（${fields[field].unit}）`;

export function PenguinIntro() {
  const [state, update] = usePageState({ penguinIntro: 'photos' });
  return (
    <Stage
      title="这套方法，也能认识企鹅吗？"
      label="FINAL CHALLENGE · 结课挑战"
    >
      <div className={s.intro}>
        <div className={s.toolbar}>
          <button
            aria-pressed={state.penguinIntro === 'photos'}
            onClick={() => update({ penguinIntro: 'photos' })}
          >
            01 认识研究对象
          </button>
          <button
            aria-pressed={state.penguinIntro === 'fields'}
            onClick={() => update({ penguinIntro: 'fields' })}
          >
            02 看懂观测特征
          </button>
          <span>从恶魔图鉴，走向真实世界。</span>
        </div>
        {state.penguinIntro === 'photos' ? (
          <div className={s.photoGrid}>
            {[
              {
                name: '阿德利企鹅',
                latin: 'Adelie',
                image: 'penguin-adelie.jpg',
              },
              {
                name: '帽带企鹅',
                latin: 'Chinstrap',
                image: 'penguin-chinstrap.jpg',
              },
              {
                name: '巴布亚企鹅',
                latin: 'Gentoo · 也叫金图企鹅',
                image: 'penguin-gentoo.png',
              },
            ].map((p) => (
              <figure className={s.photoCard} key={p.name}>
                <Image
                  width={900}
                  height={900}
                  src={`${ROOT}/assets/${p.image}`}
                  alt={p.name + '的真实照片'}
                />
                <figcaption>
                  {p.name}
                  <span>{p.latin}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className={s.fieldGrid}>
            <Image
              width={1988}
              height={1672}
              className={s.fieldIllustration}
              src={`${ROOT}/assets/penguin-bill.png`}
              alt="企鹅喙的测量图：喙长沿嘴喙上缘方向测量；喙深表示嘴喙上下方向的厚度。"
            />
            <div className={s.definitions}>
              <div>
                <strong>喙长 · mm</strong>
                <span>
                  嘴喙上缘有多长？
                  <br />
                  图中横向箭头。
                </span>
              </div>
              <div>
                <strong>喙深 · mm</strong>
                <span>
                  嘴喙上下有多厚？
                  <br />
                  图中竖向箭头。
                </span>
              </div>
              <div>
                <strong>鳍肢长度 · mm</strong>
                <span>用来游泳的翅膀，从根部到末端有多长？</span>
              </div>
              <div>
                <strong>体重 · g</strong>
                <span>
                  用秤测量身体质量。
                  <br />
                  1000 g＝1 kg。
                </span>
              </div>
            </div>
          </div>
        )}
        <p className={s.lead}>
          任务：自己选两个特征，用散点图发现不同种类的特点。
        </p>
      </div>
    </Stage>
  );
}

function downloadText(filename: string, content: string) {
  const url = URL.createObjectURL(
    new Blob([content], { type: 'text/plain;charset=utf-8' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PenguinLab() {
  const [state, update] = usePageState({
    penguinX: 'billLength' as PenguinField,
    penguinY: 'billDepth' as PenguinField,
    penguinColored: false,
    penguinMode: 'observe',
    penguinFinding: '',
    penguinChecked: false,
    penguinNeedsReview: false,
  });
  const codeDialog = useRef<HTMLDialogElement>(null);
  const referenceDialog = useRef<HTMLDialogElement>(null);
  const xField = state.penguinX;
  const yField = state.penguinY;
  const currentCode = PENGUIN_FULL_CODE.replace(
    'x="billLength"',
    `x="${xField}"`,
  )
    .replace('y="billDepth"', `y="${yField}"`)
    .replace(
      'plt.xlabel("Bill length (mm)")',
      `plt.xlabel("${fields[xField].pythonLabel}")`,
    )
    .replace(
      'plt.ylabel("Bill depth (mm)")',
      `plt.ylabel("${fields[yField].pythonLabel}")`,
    )
    .replace(
      ',\n    hue="kind"',
      state.penguinColored ? ',\n    hue="kind"' : '',
    );
  const chooseField = (axis: 'x' | 'y', field: PenguinField) => {
    if (axis === 'x')
      update({
        penguinX: field,
        ...(field === yField ? { penguinY: xField } : {}),
        penguinChecked: false,
        penguinNeedsReview: Boolean(state.penguinFinding.trim()),
      });
    else
      update({
        penguinY: field,
        ...(field === xField ? { penguinX: yField } : {}),
        penguinChecked: false,
        penguinNeedsReview: Boolean(state.penguinFinding.trim()),
      });
  };
  const saveReport = () =>
    downloadText(
      '企鹅观察报告.txt',
      `企鹅观察报告\n横轴：${label(xField)}\n纵轴：${label(yField)}\n按种类着色：${state.penguinColored ? '是' : '否'}\n\n我的发现与证据：\n${state.penguinFinding}\n\n数据：Palmer Penguins，四项数值完整的 ${penguins.length} 条观测。\n`,
    );
  return (
    <Stage title="选一对特征，寻找你的发现" label="FINAL CHALLENGE · 结课挑战">
      <div className={s.lab}>
        <div className={s.toolbar}>
          <label>
            横轴
            <select
              value={xField}
              onChange={(e) => chooseField('x', e.target.value as PenguinField)}
            >
              {fieldKeys.map((key) => (
                <option value={key} key={key}>
                  {label(key)}
                </option>
              ))}
            </select>
          </label>
          <label>
            纵轴
            <select
              value={yField}
              onChange={(e) => chooseField('y', e.target.value as PenguinField)}
            >
              {fieldKeys.map((key) => (
                <option value={key} key={key}>
                  {label(key)}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-pressed={state.penguinColored}
            onClick={() =>
              update({
                penguinColored: !state.penguinColored,
                penguinChecked: false,
              })
            }
          >
            {state.penguinColored ? '已按种类着色' : '按种类着色'}
          </button>
          <button onClick={() => codeDialog.current?.showModal()}>
            Python 参考代码
          </button>
        </div>
        <div className={s.workbench}>
          <div className={s.chartPanel}>
            <DataScatter
              points={penguins.map((p) => ({
                id: p.id,
                kind: p.kind,
                x: p[xField],
                y: p[yField],
              }))}
              kinds={penguinKinds}
              xLabel={label(xField)}
              yLabel={label(yField)}
              colored={state.penguinColored}
            />
          </div>
          <div className={s.notes}>
            <div className={s.tabs}>
              <button
                aria-pressed={state.penguinMode === 'observe'}
                onClick={() => update({ penguinMode: 'observe' })}
              >
                观察任务
              </button>
              <button
                aria-pressed={state.penguinMode === 'report'}
                onClick={() => update({ penguinMode: 'report' })}
              >
                写下发现
              </button>
            </div>
            {state.penguinMode === 'observe' ? (
              <div className={s.task}>
                <ol>
                  <li>先看同色点群，你注意到什么？</li>
                  <li>加入类别颜色，对照你的猜想。</li>
                  <li>换一组特征，比较类别是否更容易区分。</li>
                </ol>
                <p className={s.note}>
                  每个点是一只企鹅。颜色告诉我们已知种类，重叠的地方也值得观察。
                </p>
                <button
                  className={s.button}
                  onClick={() => referenceDialog.current?.showModal()}
                >
                  需要提示时，再看参考
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="penguin-finding">我的发现与图中证据</label>
                <textarea
                  id="penguin-finding"
                  maxLength={280}
                  value={state.penguinFinding}
                  onChange={(e) =>
                    update({
                      penguinFinding: e.target.value,
                      penguinChecked: false,
                      penguinNeedsReview: false,
                    })
                  }
                  placeholder="在这份样本中，……。图中可以看到……。"
                />
                <label className={s.check}>
                  <input
                    type="checkbox"
                    checked={state.penguinChecked}
                    onChange={(e) =>
                      update({
                        penguinChecked: e.target.checked,
                        penguinNeedsReview: false,
                      })
                    }
                  />
                  我写出了特征、类别和证据，留意了重叠或例外。
                </label>
                <button
                  className={`${s.button} ${s.primary}`}
                  disabled={
                    !state.penguinFinding.trim() || !state.penguinChecked
                  }
                  onClick={saveReport}
                >
                  保存我的观察报告
                </button>
                <p className={s.note}>
                  {state.penguinNeedsReview
                    ? '坐标已改变，请核对原来的发现，再重新勾选自查。'
                    : '这是开放观察，由你和同学讨论证据是否充分。'}
                </p>
              </>
            )}
          </div>
        </div>
        <div className={s.bottom}>
          <p>{penguins.length} 条完整观测 · Palmer Penguins</p>
          <a
            className={s.button}
            href={`${ROOT}/practice/penguins.csv`}
            download
          >
            下载企鹅数据
          </a>
        </div>
      </div>
      <dialog
        ref={codeDialog}
        className={s.modal}
        aria-labelledby="penguin-code-title"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={s.modalHeader}>
          <h3 id="penguin-code-title">在 JupyterLab 中动手绘图</h3>
          <button
            className={s.button}
            onClick={() => codeDialog.current?.close()}
          >
            关闭
          </button>
        </div>
        <p>
          运行条件：Python 3、pandas、seaborn、matplotlib；将 penguins.csv
          放在笔记本同一目录。按顺序运行完整代码，修改两个特征列名继续探索。
        </p>
        <pre>
          <code>{currentCode}</code>
        </pre>
        <div className={s.toolbar}>
          <button onClick={() => downloadText('企鹅研究.py', currentCode)}>
            下载完整代码
          </button>
          <a
            className={s.button}
            href={`${ROOT}/practice/penguins.csv`}
            download
          >
            下载 penguins.csv
          </a>
          <span>
            预期输出：{label(xField)}与{label(yField)}的散点图
            {state.penguinColored ? '，按种类着色。' : '。'}
          </span>
        </div>
      </dialog>
      <dialog
        ref={referenceDialog}
        className={s.modal}
        aria-labelledby="penguin-reference-title"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={s.modalHeader}>
          <h3 id="penguin-reference-title">参考线索：对照各类的范围</h3>
          <button
            className={s.button}
            onClick={() => referenceDialog.current?.close()}
          >
            关闭
          </button>
        </div>
        <p>
          下面的范围来自当前样本。回到图上找一找：哪些范围重叠？哪类的点群位置不同？
        </p>
        <table>
          <thead>
            <tr>
              <th>种类</th>
              <th>{label(xField)}</th>
              <th>{label(yField)}</th>
            </tr>
          </thead>
          <tbody>
            {penguinKinds.map((kind) => {
              const group = penguins.filter((p) => p.kind === kind);
              const extent = (field: PenguinField) =>
                `${Math.min(...group.map((p) => p[field]))}—${Math.max(...group.map((p) => p[field]))}`;
              return (
                <tr key={kind}>
                  <th>{kind}</th>
                  <td>{extent(xField)}</td>
                  <td>{extent(yField)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>
          尝试这样表达：“在这份样本中，……类的……通常更……，但……。”范围有重叠时，不要把“通常”写成“一定”。
        </p>
      </dialog>
    </Stage>
  );
}

export function PenguinReport() {
  return (
    <Stage title="带回一个有依据的发现" label="FINAL CHALLENGE · 分享与回顾">
      <div className={s.report}>
        <p className={s.lead}>带着刚才保存的观察报告，向同学介绍你的研究。</p>
        <div className={s.reportCards}>
          <section>
            <b>01</b>
            <h3>我研究什么？</h3>
            <p>说出横轴、纵轴，以及你想比较的企鹅种类。</p>
          </section>
          <section>
            <b>02</b>
            <h3>图告诉了我什么？</h3>
            <p>指出点群的位置、范围或重叠，支持你的发现。</p>
          </section>
          <section>
            <b>03</b>
            <h3>还有什么未知？</h3>
            <p>说出一个例外，或者接下来想调查的问题。</p>
          </section>
        </div>
        <p className={s.lead}>
          从恶魔到企鹅：提出问题 → 选择图表 → 观察证据 → 谨慎表达。
        </p>
      </div>
    </Stage>
  );
}
