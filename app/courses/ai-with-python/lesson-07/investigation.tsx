/* oxlint-disable next/no-img-element -- Local classroom flower photographs. */
'use client';

import { ArrowDown, Tag } from 'lucide-react';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import {
  useLessonPageState,
  usePageState,
} from '@/components/course/lesson-state';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { GuessReviewPrompt, useFlowerGuess } from './flower-guesses';
import { useGiftReadings } from './gift-measurements';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';

const { featureNames, features, labels, species, tableRows } = evidence;
const sampleCount = evidence.points.length + evidence.tree.total;

export function FlowerDataTable() {
  return (
    <table className={`${s.sampleTable} ${s.flowerTable}`}>
      <caption>
        <div className={s.flowerTableHeading}>
          <span>鸢尾花数据表 · 节选</span>
          <b>第一行 · 花谱示范样本</b>
          <span>共 150 条记录 · 3 类，每类 50 条</span>
        </div>
      </caption>
      <colgroup span={features.length} />
      <colgroup span={1} />
      <thead>
        <tr className={s.flowerColumnGroups}>
          <th scope="colgroup" colSpan={features.length}>
            前四列 · 四项测量特征（厘米）
          </th>
          <th scope="colgroup">最后一列 · 种名是标签</th>
        </tr>
        <tr>
          {features.map((feature, index) => (
            <th scope="col" key={feature}>
              {feature}
              <small>{featureNames[index]}</small>
              <span className={s.flowerEntry} aria-hidden="true">
                <b>{tableRows[0][index].toFixed(1)} cm</b>
                <ArrowDown />
              </span>
            </th>
          ))}
          <th scope="col">
            种名 <small>species</small>
            <span className={s.flowerEntry} aria-hidden="true">
              <b>园丁认出的种名</b>
              <ArrowDown />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tableRows.slice(0, 4).map((row, index) => (
          <tr
            key={index}
            className={index === 0 ? s.flowerExampleRow : undefined}
          >
            {row.slice(0, 4).map((value, column) => (
              <td key={column}>{value.toFixed(1)}</td>
            ))}
            <td>
              {index === 0 && <Tag aria-hidden="true" />}
              {labels[row[4]]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function LabeledFlowerCatalog() {
  return (
    <ul className={s.labeledCatalog} aria-label="城堡花谱的三种种名标签">
      {species.map((name, index) => (
        <li key={name} data-species={name}>
          <div className={s.catalogPhoto}>
            <img src={`${assetBase}/assets/iris-catalog/${name}.jpg`} alt="" />
          </div>
          <div className={s.catalogTag}>
            <Tag size={19} aria-hidden="true" />
            <strong>{labels[index]}</strong>
          </div>
          <span className={s.catalogSpecies} lang="en">
            Iris-{name}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Guess({ disabled }: { disabled: boolean }) {
  const { guess, needsReview, recordGuess } = useFlowerGuess('first');
  const [state, setState] = useLessonPageState('l7-practice-01', {
    clue: '',
  });
  return (
    <>
      {needsReview ? (
        <GuessReviewPrompt
          disabled={disabled}
          onConfirm={() => recordGuess(guess)}
        />
      ) : (
        <p>说说哪种颜色的点离礼花更近，再用图例找种名。</p>
      )}
      <div className={s.guess}>
        <label>
          我看到的线索
          <input
            disabled={disabled}
            value={state.clue}
            onChange={(event) => setState({ clue: event.target.value })}
            maxLength={40}
            placeholder="礼花附近的点多是……色"
          />
        </label>
        <label>
          第一次猜的种名
          <select
            disabled={disabled}
            value={guess}
            onChange={(event) => recordGuess(event.target.value)}
          >
            <option value="">选择一种</option>
            {labels.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}

// Plot bounds and tick positions in the original slide 20 chart, in image pixels.
const pairplotFocus = { x: 1062, y: 1423, width: 433, height: 444 };
const pairplotColors = ['#78b7eb', '#ff9957', '#54cf7a'];

export function IrisPairplot({
  point,
  detail = false,
}: {
  point: { x: number; y: number } | null;
  detail?: boolean;
}) {
  const { x, y, width, height } = pairplotFocus;
  const radius = detail ? 13 : 18;
  const diamond = point
    ? `M${point.x} ${point.y - radius} l${radius} ${radius} -${radius} ${radius} -${radius} -${radius}Z`
    : '';

  return (
    <svg
      viewBox={
        detail
          ? `${x - 18} ${y - 18} ${width + 36} ${height + 36}`
          : '0 0 2240 1968'
      }
      aria-label={
        detail
          ? '横轴是花瓣长，纵轴是花瓣宽。输入测量值后，金色菱形标出花的位置。'
          : '原 PPT 的四项特征散点图矩阵。蓝框标出横轴为花瓣长、纵轴为花瓣宽的一格。'
      }
    >
      <image
        href={`${assetBase}/assets/iris-pairplot-ppt20.png`}
        width={2240}
        height={1968}
      />
      {!detail && (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke="#1457d9"
          strokeWidth={8}
        />
      )}
      {point && (
        <>
          <path
            d={diamond}
            fill="none"
            stroke="#071a3d"
            strokeWidth={detail ? 9 : 16}
            strokeLinejoin="round"
          />
          <path
            d={diamond}
            fill="none"
            stroke="#ffc91c"
            strokeWidth={detail ? 5 : 10}
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

export function ScatterObservation() {
  const [{ showDemo }, setState] = usePageState({ showDemo: false });
  const { readings, setReading } = useGiftReadings();
  const petalLength = showDemo ? tableRows[0][2].toFixed(1) : readings[2];
  const petalWidth = showDemo ? tableRows[0][3].toFixed(1) : readings[3];
  const hasMeasurements = petalLength !== '' && petalWidth !== '';
  const length = Number(petalLength);
  const width = Number(petalWidth);
  const point =
    hasMeasurements &&
    length >= 0.5 &&
    length <= 8 &&
    width >= 0 &&
    width <= 2.5
      ? { x: 1153 + (length - 2) * 56.5, y: 1866 - width * 166.4 }
      : null;

  return (
    <div className={s.matrixLesson}>
      <figure className={s.matrixOriginal}>
        <IrisPairplot point={point} />
        <figcaption>
          <b>全部 {sampleCount} 条样本</b>
          。列是横轴，行是纵轴，对角线看单项分布。右侧放大蓝框。
        </figcaption>
      </figure>
      <div className={s.matrixRead}>
        <section className={s.matrixKey} aria-labelledby="l7-scatter-read">
          <ClassPracticeStamp number="01" checklist />
          <div className={s.matrixKeyCopy}>
            <h3 className={s.matrixStepTitle} id="l7-scatter-read">
              01 读懂散点图
            </h3>
            <p>
              <b>一个点</b>对应表格的一行，代表一朵花。
            </p>
            <p>
              <b>颜色</b>对应最后一列的种名标签。
            </p>
            <ul className={s.matrixLegend} aria-label="原图的种名图例">
              {labels.map((label, index) => (
                <li key={label}>
                  <i
                    aria-hidden="true"
                    style={{ background: pairplotColors[index] }}
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className={s.matrixDetail} aria-labelledby="l7-scatter-locate">
          <IrisPairplot point={point} detail />
          <div className={s.matrixMeasure}>
            <h3 className={s.matrixStepTitle} id="l7-scatter-locate">
              02 用实测卡定位
            </h3>
            <label>
              <span>花瓣长 · 横轴</span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={petalLength}
                readOnly={showDemo}
                onChange={(event) => setReading(2, event.target.value)}
              />
              <span>cm</span>
            </label>
            <label>
              <span>花瓣宽 · 纵轴</span>
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={petalWidth}
                readOnly={showDemo}
                onChange={(event) => setReading(3, event.target.value)}
              />
              <span>cm</span>
            </label>
            <button
              type="button"
              className={s.button}
              onClick={() => setState({ showDemo: !showDemo })}
            >
              {showDemo ? '切回礼花实测' : '看看表格第一行'}
            </button>
            <p className={s.matrixPrompt} aria-live="polite">
              {showDemo
                ? '菱形标出花谱样本。切回礼花实测后再记录。'
                : point
                  ? '金色菱形标出礼花的位置。'
                  : hasMeasurements
                    ? '读数超出图上范围。花瓣长为 0.5–8 cm，花瓣宽为 0–2.5 cm。'
                    : '沿用第 14 页实测卡的读数，也可以在这里补填。'}
            </p>
          </div>
        </section>
        <section className={s.matrixAnswer} aria-labelledby="l7-scatter-guess">
          <h3 className={s.matrixStepTitle} id="l7-scatter-guess">
            03 说依据，记下第一次猜测
          </h3>
          <Guess disabled={showDemo} />
        </section>
      </div>
    </div>
  );
}
