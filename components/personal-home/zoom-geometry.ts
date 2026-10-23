export type Point = { x: number; y: number };
export type ZoomView = Point & { scale: number };
export type ZoomBounds = {
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
};
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;

export function fittedSize(bounds: ZoomBounds) {
  const ratio = Math.min(
    bounds.width / bounds.imageWidth,
    bounds.height / bounds.imageHeight,
  );
  return {
    width: bounds.imageWidth * ratio,
    height: bounds.imageHeight * ratio,
  };
}

export function constrainView(view: ZoomView, bounds: ZoomBounds): ZoomView {
  const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.scale));
  const fit = fittedSize(bounds);
  const limitX = Math.max(0, (fit.width * scale - bounds.width) / 2);
  const limitY = Math.max(0, (fit.height * scale - bounds.height) / 2);
  return {
    scale,
    x: Math.max(-limitX, Math.min(limitX, view.x)),
    y: Math.max(-limitY, Math.min(limitY, view.y)),
  };
}

/** Preserve the image point underneath the old anchor at the new anchor. */
export function zoomAt(
  view: ZoomView,
  requestedScale: number,
  anchor: Point,
  bounds: ZoomBounds,
  destination: Point = anchor,
): ZoomView {
  const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, requestedScale));
  return constrainView(
    {
      scale,
      x: destination.x - ((anchor.x - view.x) * scale) / view.scale,
      y: destination.y - ((anchor.y - view.y) * scale) / view.scale,
    },
    bounds,
  );
}

export function pinchView(
  start: ZoomView,
  startA: Point,
  startB: Point,
  a: Point,
  b: Point,
  bounds: ZoomBounds,
): ZoomView {
  const distance = Math.max(
    1,
    Math.hypot(startB.x - startA.x, startB.y - startA.y),
  );
  const current = Math.hypot(b.x - a.x, b.y - a.y);
  return zoomAt(
    start,
    (start.scale * current) / distance,
    { x: (startA.x + startB.x) / 2, y: (startA.y + startB.y) / 2 },
    bounds,
    { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  );
}
