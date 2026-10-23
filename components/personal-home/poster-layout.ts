export type PosterVariant = 'desktop' | 'mobile' | 'short';

export const posterLayout = {
  width: 920,
  height: 1300,
  photos: { x: 50, y: 474, width: 820, height: 489 },
  courseCta: { x: 72, y: 1196, width: 300, height: 64 },
} as const;

export function getPosterLayout(variant: PosterVariant, isCourse = false) {
  if (variant === 'desktop')
    return isCourse
      ? {
          ...posterLayout,
          photos: { ...posterLayout.photos, y: 494, height: 449 },
        }
      : posterLayout;
  const short = variant === 'short';
  return {
    width: 920,
    height: short ? 1088 : 1225,
    photos: {
      x: 50,
      y: short ? (isCourse ? 234 : 260) : isCourse ? 390 : 425,
      width: 820,
      height: short ? (isCourse ? 445 : 465) : isCourse ? 460 : 470,
    },
    courseCta: {
      x: 52,
      y: short ? 961 : 1110,
      width: short ? 382 : 350,
      height: 76,
    },
  };
}

export const photoStackOffsets = [
  [-36, -12, -4.5],
  [34, -2, 4],
  [-24, -16, -3],
  [25, -10, 3.5],
  [0, -18, -4],
] as const;

// Smaller backing prints leave room for a larger main photo in the same stack.
export const photoBackScale = 0.9;

export function getPosterTextLayout(variant: PosterVariant, isCourse: boolean) {
  const mobile = variant !== 'desktop';
  const short = variant === 'short';
  return {
    bodySize: mobile ? (short ? 40 : 36) : 30,
    bodyLeading: mobile ? (short ? 48 : 46) : 40,
    descriptionY:
      (!mobile
        ? isCourse
          ? 1000
          : 1020
        : short
          ? isCourse
            ? 744
            : 774
          : isCourse
            ? 907
            : 959) + 20,
    subtitleY: !mobile
      ? 470
      : short
        ? isCourse
          ? 220
          : 230
        : isCourse
          ? 370
          : 411,
    subtitleSize: mobile ? (isCourse ? 40 : 43) : 37,
  };
}

function photoStackBounds(width: number, height: number, imageCount: number) {
  const frames = [
    { x: 0, y: 0, angle: -1.4, width: width + 22, height: height + 22 },
    ...photoStackOffsets.slice(0, imageCount - 1).map(([x, y, angle]) => ({
      x,
      y,
      angle,
      width: width * photoBackScale + 20,
      height: height * photoBackScale + 20,
    })),
  ];
  const bounds = frames.map((frame) => {
    const radians = (frame.angle * Math.PI) / 180;
    const dx =
      (Math.abs(Math.cos(radians)) * frame.width +
        Math.abs(Math.sin(radians)) * frame.height) /
      2;
    const dy =
      (Math.abs(Math.sin(radians)) * frame.width +
        Math.abs(Math.cos(radians)) * frame.height) /
      2;
    return {
      left: frame.x - dx,
      right: frame.x + dx,
      top: frame.y - dy,
      bottom: frame.y + dy,
    };
  });
  return {
    left: Math.min(...bounds.map((frame) => frame.left)),
    right: Math.max(...bounds.map((frame) => frame.right)),
    top: Math.min(...bounds.map((frame) => frame.top)),
    bottom: Math.max(...bounds.map((frame) => frame.bottom)),
  };
}

/** Fit equal-area photos between the subtitle and a reserved count/focus row. */
export function getPhotoStackLayout(
  variant: PosterVariant,
  isCourse: boolean,
  image: { width: number; height: number },
  imageCount: number,
) {
  const mobile = variant !== 'desktop';
  const short = variant === 'short';
  const text = getPosterTextLayout(variant, isCourse);
  const aspect = image.width / image.height;
  const topGap = short ? 26 : mobile ? 22 : 24;
  const countGap = short ? 22 : 18;
  // The count stays at 10–11 CSS px. Reserve its full height even on short
  // screens, plus room for the keyboard outline and a clear gap to the body.
  const countRow = short ? 44 : mobile ? 40 : 38;
  const bodyGap = short ? 28 : 24;
  const top = text.subtitleY + text.subtitleSize * 0.3 + topGap;
  const bottom =
    text.descriptionY - text.bodySize - countRow - bodyGap - countGap;
  const area = short ? 158000 : mobile ? 178000 : 220000;
  let low = 0;
  let high = Math.min(Math.sqrt(area / aspect), (mobile ? 700 : 720) / aspect);
  // Include every rotated white frame, so back-photo corners cannot collide
  // with the subtitle or count when the photo proportions change.
  for (let i = 0; i < 24; i++) {
    const height = (low + high) / 2;
    const bounds = photoStackBounds(height * aspect, height, imageCount);
    if (bounds.bottom - bounds.top <= bottom - top) low = height;
    else high = height;
  }
  const height = low;
  const width = height * aspect;
  const bounds = photoStackBounds(width, height, imageCount);
  const centerY = (top + bottom - bounds.top - bounds.bottom) / 2;
  return {
    width,
    height,
    centerY,
    count: {
      x: Math.min(mobile ? 868 : 848, 460 + bounds.right),
      y: centerY + bounds.bottom + countGap,
    },
  };
}

export function regionStyle(
  region: { x: number; y: number; width: number; height: number },
  layout: { width: number; height: number } = posterLayout,
) {
  return {
    left: `${(region.x / layout.width) * 100}%`,
    top: `${(region.y / layout.height) * 100}%`,
    width: `${(region.width / layout.width) * 100}%`,
    height: `${(region.height / layout.height) * 100}%`,
  };
}
