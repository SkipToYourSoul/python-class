export const smoothProgress = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

/** Both halves stop at the same compact pose before changing the print. */
export function transitionPose(progress: number, initialFold = 0) {
  const closing = progress < 0.44;
  return {
    closing,
    fold: closing
      ? initialFold + (1 - initialFold) * smoothProgress(progress / 0.44)
      : 1 - smoothProgress((progress - 0.44) / 0.56),
  };
}

/** The same crease path is traversed backwards when a drag reverses. */
export function scrubPose(value: number) {
  const position = Math.max(0, Math.min(2, value));
  const chapter = Math.round(position);
  return {
    position,
    chapter,
    fold: Math.sin(Math.abs(position - chapter) * Math.PI),
  };
}

/** Re-grabbing an in-flight page starts with its exact current compression. */
export function resumeScrubPosition(
  chapter: number,
  fold: number,
  pointerPosition: number,
) {
  const side =
    chapter === 0 ? 1 : chapter === 2 ? -1 : pointerPosition < chapter ? -1 : 1;
  return chapter + (side * Math.asin(Math.max(0, Math.min(1, fold)))) / Math.PI;
}
