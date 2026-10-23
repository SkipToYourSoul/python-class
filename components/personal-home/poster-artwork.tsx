/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG is the accessible print artwork and the source for the WebGL texture. */
import { forwardRef } from 'react';
import type { Chapter } from './chapters';
import { lettering } from './poster-lettering';
import {
  getPhotoStackLayout,
  getPosterLayout,
  getPosterTextLayout,
  photoBackScale,
  photoStackOffsets,
  type PosterVariant,
} from './poster-layout';

/** The visible SVG is also the texture of the folding paper: no screenshot swap. */
export const PosterArtwork = forwardRef<
  SVGSVGElement,
  { chapter: Chapter; index: number; variant?: PosterVariant }
>(function PosterArtwork({ chapter: c, index, variant = 'desktop' }, ref) {
  const shadow = `photo-shadow-${index}`;
  const first = c.images[0];
  const mobile = variant !== 'desktop';
  const short = variant === 'short';
  const isBlue = index === 2;
  const bodyInk = isBlue ? '#f3f0ff' : c.ink;
  const inset = mobile ? 52 : 72;
  const { bodySize, bodyLeading, descriptionY, subtitleY, subtitleSize } =
    getPosterTextLayout(variant, isBlue);
  const posterLayout = getPosterLayout(variant, isBlue);
  const {
    centerY: photoY,
    height: photoHeight,
    width: photoWidth,
  } = getPhotoStackLayout(variant, isBlue, first, c.images.length);
  const factLineY = descriptionY + bodyLeading * 2 + (mobile ? 28 : 30);
  const factY = factLineY + (mobile ? 44 : 42);
  const cta = posterLayout.courseCta;
  return (
    <svg
      ref={ref}
      viewBox={`0 0 920 ${posterLayout.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${c.title}：${c.subtitle}。${c.description[0]}。${c.description.slice(1).join('')} ${c.facts.join('，')}`}
    >
      <defs>
        <filter
          id={shadow}
          x="-30%"
          y="-30%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="5"
            dy="9"
            stdDeviation="8"
            floodColor="#16120d"
            floodOpacity="0.22"
          />
        </filter>
        <mask id={`wear-mask-${index}`}>
          <rect width="920" height={posterLayout.height} fill="#fff" />
          <rect
            x={posterLayout.photos.x}
            y={posterLayout.photos.y}
            width={posterLayout.photos.width}
            height={posterLayout.photos.height}
            fill="#000"
          />
          <rect
            x={inset - 8}
            y={descriptionY - bodySize - 20}
            width={920 - (inset - 8) * 2}
            height={posterLayout.height}
            fill="#303030"
          />
        </mask>
      </defs>
      <rect width="920" height={posterLayout.height} fill={c.color} />
      <g fill={c.ink} fontFamily="Arial, 'PingFang SC', sans-serif">
        <text
          x={inset}
          y={mobile ? 42 : 63}
          fontSize={mobile ? 22 : 18}
          letterSpacing="3"
        >
          {c.eyebrow}
        </text>
        <text
          x="852"
          y="40"
          textAnchor="start"
          fontSize="15"
          transform="rotate(180 852 40)"
        >
          LI MEILI / BUILD WHAT’S NEXT
        </text>
        <g transform={`rotate(-3 460 ${short ? 130 : 270})`} aria-hidden="true">
          {c.headline.map((line, i) => {
            const glyph = lettering[line];
            if (short) {
              const firstGlyph = lettering[c.headline[0]];
              const secondGlyph = lettering[c.headline[1]];
              const space = index === 1 ? 0 : glyph.units * 0.17;
              const scale =
                790 / (firstGlyph.width + secondGlyph.width + space);
              const x = 65 + (i === 0 ? 0 : (firstGlyph.width + space) * scale);
              return (
                <path
                  key={line}
                  d={glyph.path}
                  transform={`translate(${x} ${isBlue ? 155 : 180}) scale(${scale} ${-scale})`}
                />
              );
            }
            const width = mobile ? 720 : 754;
            const y = !mobile
              ? i === 0
                ? 240
                : 402
              : isBlue
                ? i === 0
                  ? 170
                  : 285
                : i === 0
                  ? 205
                  : 335;
            const height = mobile ? (isBlue ? 145 : 175) : 215;
            return (
              <path
                key={line}
                d={glyph.path}
                transform={`translate(${(920 - width) / 2} ${y}) scale(${width / glyph.width} ${-height / glyph.units})`}
              />
            );
          })}
        </g>
        <text
          x="460"
          y={subtitleY}
          textAnchor="middle"
          fontSize={subtitleSize}
          fontFamily="'Songti SC', 'Noto Serif SC', serif"
          fontWeight="700"
          letterSpacing={mobile ? 1 : 4}
        >
          {c.subtitle}
        </text>
        <g aria-hidden="true">
          {c.images.slice(1).map((image, i) => {
            const [dx, dy, angle] = photoStackOffsets[i];
            const w = photoWidth * photoBackScale,
              h = photoHeight * photoBackScale;
            return (
              <g
                key={image.src}
                data-photo-back=""
                transform={`translate(${460 + dx} ${photoY + dy}) rotate(${angle})`}
              >
                <rect
                  x={-w / 2 - 10}
                  y={-h / 2 - 10}
                  width={w + 20}
                  height={h + 20}
                  fill="#fffdf7"
                  filter={`url(#${shadow})`}
                />
                <svg
                  x={-w / 2}
                  y={-h / 2}
                  width={w}
                  height={h}
                  viewBox={`0 0 ${image.width} ${image.height}`}
                  preserveAspectRatio="xMidYMid slice"
                  overflow="hidden"
                >
                  <image
                    href={image.preview}
                    width={image.width}
                    height={image.height}
                  />
                </svg>
              </g>
            );
          })}
          <g data-photo-front="">
            <g transform={`translate(460 ${photoY}) rotate(-1.4)`}>
              <rect
                x={-photoWidth / 2 - 11}
                y={-photoHeight / 2 - 11}
                width={photoWidth + 22}
                height={photoHeight + 22}
                fill="#fffdf7"
                filter={`url(#${shadow})`}
              />
              <image
                href={first.preview}
                x={-photoWidth / 2}
                y={-photoHeight / 2}
                width={photoWidth}
                height={photoHeight}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </g>
        </g>
        <g fill={bodyInk}>
          {c.description.map((line, i) => (
            <text
              key={line}
              x={inset}
              y={descriptionY + i * bodyLeading}
              fontSize={bodySize}
              fontWeight={i === 0 ? '700' : '400'}
            >
              {line}
            </text>
          ))}
        </g>
        <line
          x1={inset}
          y1={factLineY}
          x2={920 - inset}
          y2={factLineY}
          stroke={bodyInk}
          strokeOpacity={isBlue ? '0.25' : '0.4'}
        />
        {c.facts.map((fact, i) => (
          <text
            key={fact}
            fill={bodyInk}
            x={inset + i * 411}
            y={factY}
            fontSize={mobile ? (short ? 38 : 36) : 30}
            fontWeight="600"
          >
            {fact}
          </text>
        ))}
        {isBlue && (
          <g aria-hidden="true" fill={bodyInk}>
            <text
              x={cta.x}
              y={cta.y + cta.height * 0.65}
              fontSize={mobile ? (short ? 40 : 36) : 30}
              fontWeight="600"
            >
              开启我的创作之旅
            </text>
            <line
              data-course-underline=""
              x1={cta.x}
              x2={cta.x + cta.width - 8}
              y1={cta.y + cta.height * 0.65 + 12}
              y2={cta.y + cta.height * 0.65 + 12}
              stroke={bodyInk}
              strokeWidth="1.5"
            />
            <path
              data-course-arrow=""
              d={`M${cta.x + cta.width - (mobile ? 40 : 38)} ${cta.y + cta.height / 2}h${mobile ? 30 : 26}m-11 -11l11 11-11 11`}
              fill="none"
              stroke={bodyInk}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
        <text
          x={inset}
          y={posterLayout.height - (mobile ? 16 : 24)}
          fontSize={mobile ? 26 : 22}
          letterSpacing="1"
          fill={isBlue ? '#dedbff' : c.ink}
        >
          {mobile && isBlue
            ? '讲师个人资质：IITC 工信人才认证'
            : mobile
              ? `${c.date} / ${c.footer}`
              : `ⓘ ${c.footer}`}
        </text>
        <g
          transform={`translate(712 ${mobile ? posterLayout.height - 30 : isBlue ? 1250 : 1230})${mobile ? ' scale(0.65)' : ''}`}
        >
          {Array.from({ length: 38 }, (_, i) => (
            <rect
              key={i}
              x={i * 3.6}
              y="0"
              width={i % 3 === 0 ? 3 : 1.3}
              height={isBlue ? (i % 5 === 0 ? 25 : 21) : i % 5 === 0 ? 39 : 34}
            />
          ))}
        </g>
        <text
          x="30"
          y="115"
          fontSize="17"
          letterSpacing="3"
          transform="rotate(90 30 115)"
        >
          A SMALL ARCHIVE OF BIG IDEAS
        </text>
      </g>
      <g
        mask={`url(#wear-mask-${index})`}
        transform={
          mobile ? `scale(1 ${posterLayout.height / 1300})` : undefined
        }
        opacity={mobile ? '0.12' : '0.2'}
        fill="none"
        stroke="#fff"
        strokeWidth="2"
      >
        <path d="M20 38L895 20L904 1278L18 1282Z M31 22L25 1271M893 34L881 1280 M23 420L895 412 M24 1132L893 1147" />
        <path
          d="M111 0L115 410L103 742L128 1300 M0 810L450 821L920 803"
          strokeWidth="1"
        />
      </g>
      <image
        href="/personal-home/paper-wear.png"
        width="920"
        height={posterLayout.height}
        opacity={mobile ? '0.18' : '0.48'}
        mask={`url(#wear-mask-${index})`}
        preserveAspectRatio="none"
      />
    </svg>
  );
});
