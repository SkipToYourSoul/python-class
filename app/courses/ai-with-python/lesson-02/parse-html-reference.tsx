'use client';
import type { ScoutSource } from './scout-source';
import p from './parse.module.css';

/** Show complete original record lines, without inventing markup or moving fields. */
export function ParseHtmlReference({
  mode,
  step,
  source,
}: {
  mode: 'find' | 'fields' | 'loop';
  step: number;
  source: ScoutSource;
}) {
  const row = mode === 'loop' ? step : 0;
  const record = source.records[row];
  const field = ['location', 'attribute', 'weakness'][step];
  const lines =
    mode === 'find'
      ? [
          '<main>',
          ...source.records.flatMap((item) => [
            `  ${item.opening}`,
            `    ${item.nameHtml}`,
            '    …',
            '  </article>',
          ]),
          '</main>',
        ]
      : record.source.split('\n');
  let recordIndex = -1;
  return (
    <section className={p.htmlReference} aria-label="对应 HTML">
      <header>
        <strong>HTML · scout.html</strong>
        <span>
          {mode === 'find'
            ? 'main 节选 · … 省略三个 p 字段'
            : `${record.name} · 完整 article，长行自动折行`}
        </span>
      </header>
      <pre>
        <code>
          {lines.map((text, index) => {
            if (text.includes('<article')) recordIndex++;
            const active =
              mode === 'find'
                ? text.includes('<article') && (step === 1 || recordIndex === 0)
                : mode === 'fields'
                  ? text.includes(`class="${field}"`)
                  : text.includes('class="name"');
            return (
              <span
                key={index}
                data-active={active}
                data-value={mode === 'loop' && active}
              >
                {text}
                {index < lines.length - 1 ? '\n' : ''}
              </span>
            );
          })}
        </code>
      </pre>
    </section>
  );
}
