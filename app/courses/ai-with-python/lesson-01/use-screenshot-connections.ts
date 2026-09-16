'use client';

import { useEffect, useState, type RefObject } from 'react';

type ConnectionPoint = {
  id: number;
  side: 'top' | 'bottom' | 'left' | 'right';
};

export function useScreenshotConnections(
  diagramRef: RefObject<HTMLDivElement | null>,
  regions: readonly ConnectionPoint[],
) {
  const [connections, setConnections] = useState<string[]>([]);

  useEffect(() => {
    const diagram = diagramRef.current;
    const picture = diagram?.querySelector<HTMLDivElement>(
      '[data-tour-picture]',
    );
    if (!diagram || !picture) return;

    const observer = new ResizeObserver(() => {
      const bounds = diagram.getBoundingClientRect();
      const imageBounds = picture.getBoundingClientRect();
      setConnections(
        regions.map(({ id, side }) => {
          const callout = diagram.querySelector<HTMLElement>(
            `[data-callout="${id}"]`,
          );
          const marker = diagram.querySelector<HTMLElement>(
            `[data-marker="${id}"]`,
          );
          if (!callout || !marker) return '';

          const cardBounds = callout.getBoundingClientRect();
          const markerBounds = marker.getBoundingClientRect();
          const toX = markerBounds.left + markerBounds.width / 2 - bounds.left;
          const toY = markerBounds.top + markerBounds.height / 2 - bounds.top;

          if (side === 'left' || side === 'right') {
            const fromX =
              (side === 'left' ? cardBounds.right : cardBounds.left) -
              bounds.left;
            const fromY = cardBounds.top + cardBounds.height / 2 - bounds.top;
            const outsideX =
              (side === 'left'
                ? imageBounds.left - 12
                : imageBounds.right + 12) - bounds.left;
            return `M ${fromX} ${fromY} H ${outsideX} V ${toY} H ${toX}`;
          }

          const fromX = cardBounds.left + cardBounds.width / 2 - bounds.left;
          const fromY =
            (side === 'top' ? cardBounds.bottom : cardBounds.top) - bounds.top;
          const outsideY =
            (side === 'top' ? imageBounds.top - 12 : imageBounds.bottom + 12) -
            bounds.top;
          return `M ${fromX} ${fromY} V ${outsideY} H ${toX} V ${toY}`;
        }),
      );
    });

    observer.observe(diagram);
    observer.observe(picture);
    diagram
      .querySelectorAll('[data-callout]')
      .forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [diagramRef, regions]);

  return connections;
}
