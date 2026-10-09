/** Crop each established demon from the shared transparent sprite sheet. */
export function DemonSprite({
  index,
  label,
}: {
  index: number;
  label?: string;
}) {
  const [left, width] = [
    [39, 720],
    [766, 670],
    [1460, 690],
  ][index];
  return (
    <svg
      viewBox={`${left} 0 ${width} 724`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <image
        href="/courses/ai-with-python/lesson-03/assets/archive-siege/demons.png"
        width="2172"
        height="724"
      />
    </svg>
  );
}
