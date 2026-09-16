/* oxlint-disable next/no-img-element -- Supplied character artwork. */
'use client';

import { ArrowRight, GitBranch, Lightbulb } from 'lucide-react';
import { warriors } from '@/lib/course-data';
import { asset, featureNames } from '../lesson-ui';
import lesson from '../lesson-review.module.css';
import { splitByRule, type Rule } from './guardian-rules';
import s from './guardian-rule-step.module.css';

export function GuardianRuleStep({
  rules,
  rows,
  selected,
  tested,
  canContinue,
  isBranch,
  onSelect,
  onRun,
  onContinue,
}: {
  rules: Rule[];
  rows: typeof warriors;
  selected: number;
  tested: number;
  canContinue: boolean;
  isBranch: boolean;
  onSelect: (index: number) => void;
  onRun: () => void;
  onContinue: () => void;
}) {
  const hasResult = tested >= 0 && tested === selected && !!rules[tested];
  const rule = hasResult ? rules[tested] : undefined;
  const result = rule ? splitByRule(rule, rows) : undefined;

  return (
    <div className={s.layout}>
      <section className={s.controls} aria-label="选择并运行规则">
        <div className={s.heading}>
          <h3>选择一条规则</h3>
          <p>{isBranch ? '血量 > 245 的 6 位角色' : '全部 10 位角色'}</p>
        </div>
        <div className={s.choices}>
          {rules.map((option, index) => (
            <button
              type="button"
              key={option.label}
              aria-pressed={selected === index}
              onClick={() => onSelect(index)}
            >
              {index + 1} · {option.label}
            </button>
          ))}
        </div>
        <button
          className={hasResult ? lesson.secondary : lesson.primary}
          type="button"
          disabled={selected < 0 || hasResult}
          onClick={onRun}
        >
          {hasResult ? '已运行当前规则' : '运行所选规则'}
        </button>
      </section>

      <section
        className={`${s.results} ${result && !canContinue ? s.needsRetry : ''}`}
        aria-label="规则运行结果"
      >
        {result && rule ? (
          <>
            <div className={s.groups}>
              {result.groups.map((group, index) => (
                <section
                  className={s.group}
                  aria-label={`${index === 0 ? '是' : '否'}分组`}
                  key={index}
                >
                  <div className={s.groupHeading}>
                    <h3>
                      {index === 0 ? '是' : '否'} · {group.items.length} 位
                    </h3>
                    <p>
                      勇士 {group.warriorCount} · 恶魔 {group.demonCount}
                    </p>
                    <p>
                      暂判
                      {group.prediction === '身份持平'
                        ? '：身份持平'
                        : `为${group.prediction}`}{' '}
                      · 分对 {group.correct} 位
                    </p>
                  </div>
                  <ul className={s.characters}>
                    {group.items.map((role) => (
                      <li key={role.name}>
                        <img
                          src={asset(role.image)}
                          alt={`${role.name}，${role.category}`}
                        />
                        <div>
                          <strong>{role.name}</strong>
                          <span>
                            {featureNames[rule.feature]}{' '}
                            <b>{role[rule.feature]}</b>
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <div className={s.summary} aria-live="polite">
              <div className={s.count}>
                <span>本轮判对</span>
                <strong>
                  {result.groups[0].correct} + {result.groups[1].correct} ={' '}
                  {result.correct} / {result.total}
                </strong>
              </div>
              <div className={s.accuracy}>
                <span>正确率</span>
                <strong>{result.percentage}</strong>
              </div>
              {canContinue && (
                <button
                  className={lesson.primary}
                  type="button"
                  onClick={onContinue}
                >
                  {isBranch ? '下一步：查看完整模型' : '下一步：继续分组'}
                  <ArrowRight aria-hidden="true" />
                </button>
              )}
            </div>
            {!canContinue && (
              <output className={s.retry}>
                <Lightbulb aria-hidden="true" />
                <span>还有角色分错了，换一条规则试试。</span>
              </output>
            )}
          </>
        ) : (
          <div className={s.empty}>
            <GitBranch aria-hidden="true" />
            <h3>运行后，查看分组</h3>
            <p>
              {selected < 0 ? '先在左侧选择一条规则。' : '点击“运行所选规则”。'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
