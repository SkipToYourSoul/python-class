// Run: node --test scripts/test-ui-chart.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

// Load the actual TSX component and its utils as ESM without writing build files.
// Data URL modules need absolute URLs for imports, including the JSX runtime.
function asModule(source, aliases = {}) {
  const code = ts
    .transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
      },
    })
    .outputText.replace(/from (['"])([^'"]+)\1/g, (_, _quote, specifier) => {
      const url = aliases[specifier] ?? import.meta.resolve(specifier);
      return `from ${JSON.stringify(url)}`;
    });

  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
}

const utilsUrl = asModule(
  await readFile(new URL('../lib/utils.ts', import.meta.url), 'utf8'),
);
const chartUrl = asModule(
  await readFile(
    new URL('../components/ui/chart.tsx', import.meta.url),
    'utf8',
  ),
  { '@/lib/utils': utilsUrl },
);
const { ChartContainer, ChartTooltipContent, ChartLegendContent } =
  await import(chartUrl);

const accessor = (row) => row.amount;
const config = {
  series: { label: 'Series name fallback' },
  value: { label: 'Default fallback' },
  amount: { label: 'String data key' },
  0: { label: 'Zero numeric key' },
  '': { label: 'Empty string key' },
  custom: { label: 'Explicit key override' },
  [String(accessor)]: { label: 'Incorrect function source key' },
};

const cases = [
  [
    'tooltip uses the series name for a function dataKey',
    ChartTooltipContent,
    {
      active: true,
      payload: [{ dataKey: accessor, name: 'series', value: 10 }],
    },
    'Series name fallback',
  ],
  [
    'tooltip uses the default key when a function dataKey has no name',
    ChartTooltipContent,
    { active: true, payload: [{ dataKey: accessor, value: 10 }] },
    'Default fallback',
  ],
  [
    'tooltip preserves string data keys',
    ChartTooltipContent,
    { active: true, payload: [{ dataKey: 'amount', value: 10 }] },
    'String data key',
  ],
  [
    'tooltip preserves numeric zero data keys',
    ChartTooltipContent,
    { active: true, payload: [{ dataKey: 0, value: 10 }] },
    'Zero numeric key',
  ],
  [
    'tooltip preserves empty string data keys',
    ChartTooltipContent,
    { active: true, payload: [{ dataKey: '', value: 10 }] },
    'Empty string key',
  ],
  [
    'tooltip explicit labelKey and nameKey override automatic keys',
    ChartTooltipContent,
    {
      active: true,
      nameKey: 'custom',
      labelKey: 'custom',
      payload: [{ dataKey: accessor, name: 'series', value: 10 }],
    },
    'Explicit key override',
    2,
  ],
  [
    'legend uses its display value for a function dataKey',
    ChartLegendContent,
    { payload: [{ dataKey: accessor, value: 'series', color: 'red' }] },
    'Series name fallback',
  ],
  [
    'legend uses the default key when a function dataKey has no value',
    ChartLegendContent,
    { payload: [{ dataKey: accessor, color: 'red' }] },
    'Default fallback',
  ],
  [
    'legend preserves string data keys before display values',
    ChartLegendContent,
    { payload: [{ dataKey: 'amount', value: 'series', color: 'red' }] },
    'String data key',
  ],
  [
    'legend preserves numeric zero data keys',
    ChartLegendContent,
    { payload: [{ dataKey: 0, color: 'red' }] },
    'Zero numeric key',
  ],
  [
    'legend explicit nameKey overrides automatic keys',
    ChartLegendContent,
    {
      nameKey: 'custom',
      payload: [{ dataKey: accessor, value: 'series', color: 'red' }],
    },
    'Explicit key override',
  ],
];

for (const [name, Component, props, expected, expectedCount] of cases) {
  test(name, () => {
    const markup = renderToStaticMarkup(
      React.createElement(
        ChartContainer,
        { config },
        React.createElement(Component, props),
      ),
    );
    assert.ok(markup.includes(expected), markup);
    assert.ok(!markup.includes('Incorrect function source key'), markup);
    if (expectedCount !== undefined) {
      assert.equal(markup.split(expected).length - 1, expectedCount, markup);
    }
  });
}
