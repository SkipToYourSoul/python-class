/* oxlint-disable next/no-img-element -- Local classroom photo and comic. */
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The inline SVG diagrams have accessible image names. */
import { MoveHorizontal, MoveVertical } from 'lucide-react';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import { GiftMeasurements } from './gift-measurements';
import { assetBase } from './lesson-data';
import s from './lesson.module.css';

const [sepalLength, sepalWidth, petalLength, petalWidth] =
  evidence.tableRows[0];

const parts = [
  {
    name: '萼片',
    lengthReading: sepalLength,
    widthReading: sepalWidth,
    shape:
      'M88 177 C87 158 84 148 75 137 C61 121 38 109 38 82 C38 65 46 55 53 45 C59 37 65 39 70 32 C76 27 82 29 87 24 Q91 21 96 21 C104 21 107 26 114 26 C121 26 126 33 131 35 C145 45 153 63 153 82 C153 104 136 120 122 135 C111 147 107 158 105 177Z',
    veins:
      'M96 169 Q98 105 96 31 M91 153 C81 115 61 96 60 59 M102 151 C114 119 136 97 134 62',
    signal:
      'M91 151 C86 134 75 127 75 114 C85 115 93 106 98 100 C103 110 113 116 111 126 C108 135 101 142 101 152 Q96 156 91 151Z',
    widthEdges: [38, 153],
    widthY: 82,
    tone: s.measurementSepal,
  },
  {
    name: '花瓣',
    lengthReading: petalLength,
    widthReading: petalWidth,
    shape:
      'M89 177 C86 154 80 139 73 121 C67 104 62 86 62 66 C62 53 64 44 70 37 C76 32 75 28 82 27 Q90 21 96 21 C102 21 103 28 110 31 C119 39 125 52 125 66 C125 87 116 103 111 122 C106 141 104 161 105 177Z',
    veins:
      'M97 170 Q89 106 96 30 M94 150 C82 116 74 85 76 50 M100 149 C103 117 116 91 113 55',
    widthEdges: [62, 125],
    widthY: 66,
    tone: s.measurementPetal,
  },
];

function PartMeasurements({ part }: { part: (typeof parts)[number] }) {
  const [left, right] = part.widthEdges;
  const widthY = part.widthY;

  return (
    <figure className={s.measurementCard}>
      <h4>量{part.name}</h4>
      <svg
        className={s.measurementDrawing}
        viewBox="0 -7 192 211"
        role="img"
        aria-label={`一片摊开的${part.name}。蓝箭头从基部到顶端，棕箭头横跨最宽处。`}
      >
        <path className={part.tone} d={part.shape} />
        {part.signal && (
          <path className={s.measurementSignal} d={part.signal} />
        )}
        <path className={s.measurementVeins} d={part.veins} />
        <path className={s.measurementGuides} d="M22 21H96 M22 177H96" />
        <path
          className={s.measurementLength}
          d="M22 21V177 M16 29l6-8 6 8 M16 169l6 8 6-8"
        />
        <path
          className={s.measurementWidth}
          d={`M${left} ${widthY}H${right} m-8 -6 8 6 -8 6 M${left + 8} ${widthY - 6}l-8 6 8 6`}
        />
        <text className={s.measurementAnchor} x="33" y="16">
          顶端
        </text>
        <text className={s.measurementAnchor} x="33" y="196">
          基部
        </text>
      </svg>
      <figcaption className={s.measurementLegend}>
        <div>
          <b className={s.measurementLength}>
            <MoveVertical aria-hidden="true" /> {part.name}长
          </b>
          <span>从基部到顶端</span>
          <strong>{part.lengthReading.toFixed(1)} cm</strong>
        </div>
        <div>
          <b className={s.measurementWidth}>
            <MoveHorizontal aria-hidden="true" /> {part.name}宽
          </b>
          <span>横量最宽处</span>
          <strong>{part.widthReading.toFixed(1)} cm</strong>
        </div>
      </figcaption>
    </figure>
  );
}

export function FlowerMeasurement() {
  return (
    <div className={s.measurementLesson}>
      <section className={s.measurementDemo} aria-labelledby="l7-measure-demo">
        <div className={s.measurementGuide}>
          <div className={s.measurementStep}>
            <h3 id="l7-measure-demo">01 看示范</h3>
            <p>园丁用上一页的花谱样本示范。</p>
          </div>
          <figure className={s.measurementPhoto}>
            <img
              src={`${assetBase}/assets/iris-anatomy.png`}
              alt="鸢尾花正面照片。中文标线分别指向内圈三片花瓣、外圈三片萼片和中央的花柱。"
              width={1362}
              height={1024}
            />
            <figcaption>
              <div className={s.measurementParts}>
                <span>
                  <b>花瓣</b> · 内圈三片
                </span>
                <span>
                  <b>萼片</b> · 外圈三片
                </span>
              </div>
            </figcaption>
          </figure>
        </div>
        <div className={s.measurementGuide}>
          <figure className={s.measurementComic}>
            <img
              src={`${assetBase}/assets/flower-room-measurement.jpg`}
              alt="园丁拿着木尺给勇士示范。"
              width={1448}
              height={1086}
            />
            <figcaption>
              <b>园丁</b>
              <p>量长从基部的零刻度读到顶端。量宽时，找到最宽的地方横着量。</p>
            </figcaption>
          </figure>
          <div className={s.measurementCards}>
            {parts.map((part) => (
              <PartMeasurements key={part.name} part={part} />
            ))}
          </div>
        </div>
      </section>
      <GiftMeasurements editable />
    </div>
  );
}
