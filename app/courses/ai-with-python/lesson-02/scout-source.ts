'use client';
import { useEffect, useState } from 'react';
import { scoutPath } from './lesson-data';

export const scoutFieldKeys = ['location', 'attribute', 'weakness'] as const;
export type ScoutFieldKey = (typeof scoutFieldKeys)[number];
export type ScoutRecord = {
  name: string;
  location: string;
  attribute: string;
  weakness: string;
  opening: string;
  nameHtml: string;
  source: string;
  fields: Record<
    ScoutFieldKey,
    { label: string; html: string; paragraph: string }
  >;
};
export type ScoutSource = {
  title: string;
  htmlOpening: string;
  headTags: string[];
  headerTags: string[];
  records: ScoutRecord[];
};
export function openingTag(element: Element) {
  return element.outerHTML.slice(0, element.outerHTML.indexOf('>') + 1);
}
/** Preserve source line order and inline p/span content; remove only shared indentation. */
export function sourceBlock(element: Element) {
  const lines = element.outerHTML.split('\n');
  const last = lines.at(-1) ?? '';
  const indent = last.match(/^ */)?.[0].length ?? 0;
  return lines
    .map((line, i) =>
      i === 0
        ? line
        : line.slice(Math.min(indent, line.match(/^ */)?.[0].length ?? 0)),
    )
    .join('\n');
}
export function parseScoutSource(html: string): ScoutSource {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const header = doc.querySelector('body > header');
  const cards = Array.from(
    doc.querySelectorAll('body > main > article.record'),
  );
  if (!header || cards.length !== 3) throw new Error('Scout structure missing');
  const records = cards.map((card) => {
    const name = card.querySelector('h2.name');
    if (!name) throw new Error('Scout name missing');
    const values = {} as Record<ScoutFieldKey, string>;
    const fields = {} as ScoutRecord['fields'];
    for (const key of scoutFieldKeys) {
      const element = card.querySelector(`p > span.${key}`);
      if (!element?.parentElement)
        throw new Error(`Scout field missing: ${key}`);
      values[key] = element.textContent?.trim() ?? '';
      fields[key] = {
        label: Array.from(element.parentElement.childNodes)
          .filter((node) => node.nodeType === 3)
          .map((node) => node.textContent)
          .join('')
          .trim(),
        html: element.outerHTML,
        paragraph: element.parentElement.outerHTML,
      };
    }
    return {
      ...values,
      name: name.textContent?.trim() ?? '',
      opening: openingTag(card),
      nameHtml: name.outerHTML,
      source: sourceBlock(card),
      fields,
    };
  });
  return {
    title: doc.title,
    htmlOpening: openingTag(doc.documentElement),
    headTags: Array.from(doc.head.children).map((node) => node.localName),
    headerTags: Array.from(header.children).map((node) => node.localName),
    records,
  };
}
export function useScoutSource() {
  const [source, setSource] = useState<ScoutSource | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(scoutPath, { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Scout source unavailable');
        const result = parseScoutSource(await response.text());
        if (!controller.signal.aborted) setSource(result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [attempt]);
  return {
    source,
    failed,
    retry: () => {
      setFailed(false);
      setAttempt((value) => value + 1);
    },
  };
}
