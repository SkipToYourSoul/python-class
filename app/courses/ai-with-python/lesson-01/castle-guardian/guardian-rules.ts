import { warriors } from '@/lib/course-data';
import type { Feature } from '../lesson-ui';

export type Rule = {
  label: string;
  feature: Feature;
  threshold: number;
  operator: 'lte' | 'gte';
};

export const roots: Rule[] = [
  { label: '攻击力 ≥ 70？', feature: 'attack', threshold: 70, operator: 'gte' },
  {
    label: '防御力 ≥ 60？',
    feature: 'defense',
    threshold: 60,
    operator: 'gte',
  },
  { label: '血量 ≤ 245？', feature: 'health', threshold: 245, operator: 'lte' },
];

export const branches: Rule[] = [
  { label: '攻击力 ≤ 65？', feature: 'attack', threshold: 65, operator: 'lte' },
  {
    label: '防御力 ≥ 60？',
    feature: 'defense',
    threshold: 60,
    operator: 'gte',
  },
  { label: '血量 ≤ 450？', feature: 'health', threshold: 450, operator: 'lte' },
];

export function splitByRule(rule: Rule, rows: typeof warriors) {
  const yes = rows.filter((role) =>
    rule.operator === 'lte'
      ? role[rule.feature] <= rule.threshold
      : role[rule.feature] >= rule.threshold,
  );
  const groups = [yes, rows.filter((role) => !yes.includes(role))].map(
    (items) => {
      const warriorCount = items.filter(
        (role) => role.category === '勇士',
      ).length;
      const demonCount = items.length - warriorCount;
      return {
        items,
        warriorCount,
        demonCount,
        correct: Math.max(warriorCount, demonCount),
        prediction:
          warriorCount === demonCount
            ? '身份持平'
            : warriorCount > demonCount
              ? '勇士'
              : '恶魔',
      };
    },
  );
  const correct = groups.reduce((total, group) => total + group.correct, 0);
  const accuracy = rows.length ? (correct / rows.length) * 100 : 0;

  return {
    groups,
    correct,
    total: rows.length,
    percentage: `${Number(accuracy.toFixed(1))}%`,
  };
}
