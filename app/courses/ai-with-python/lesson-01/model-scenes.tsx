/* oxlint-disable next/no-img-element -- Supplied character artwork. */
'use client';
import Link from 'next/link';

import { warriors } from '@/lib/course-data';
import {
  Stage,
  Hint,
  Choices,
  More,
  CodeCell,
  RoleCard,
  CastleTree,
  ClassPracticeStamp,
  PracticeProgress,
  asset,
  newRoles,
  useSceneState,
  featureNames,
  type Feature,
  dataX,
  dataY,
  importCode,
  fitCode,
  plotCode,
  predictionCode,
  fullCode,
} from './lesson-ui';
import s from './lesson-review.module.css';
import { CastleBattle } from './castle-battle';
import problemStyles from './castle-problem.module.css';
import { TreeConceptScene } from './tree-concept-scene';
import discussionStyles from './data-discussion.module.css';
import { FitExplainer } from './fit-explainer';
import { XiaopaiSpeech } from './xiaopai-speech';
import predictionStyles from './prediction-paths.module.css';
import { AccuracyScene } from './accuracy-scene';
import { ArrowRight } from 'lucide-react';

export function TrainingTable({
  feature,
  selected,
  onSelect,
  sort = false,
}: {
  feature?: Feature;
  selected?: number;
  onSelect?: (index: number) => void;
  sort?: boolean;
}) {
  let rows = warriors.map((r, index) => ({ ...r, index }));
  if (sort && feature) rows = rows.toSorted((a, b) => a[feature] - b[feature]);
  return (
    <table className={s.dataTable}>
      <thead>
        <tr>
          <th>角色</th>
          <th>已知身份</th>
          {(['attack', 'defense', 'health'] as Feature[]).map((f) => (
            <th key={f} data-focus={f === feature}>
              {featureNames[f]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} data-selected={selected === r.index}>
            <td>
              <div className={s.tableRole}>
                <img src={asset(r.image)} alt="" />
                {onSelect ? (
                  <button onClick={() => onSelect(r.index)}>{r.name}</button>
                ) : (
                  r.name
                )}
              </div>
            </td>
            <td>{r.category}</td>
            {(['attack', 'defense', 'health'] as Feature[]).map((f) => (
              <td key={f} data-focus={f === feature}>
                {r[f]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Problem() {
  const [v, set] = useSceneState('castle-problem', { playing: true });
  return (
    <Stage
      label="CASTLE GUARDIAN · 任务"
      title="谁能进入城堡？"
      footer={
        <Hint>
          输入攻击、防御、血量，预测身份：<strong>勇士放行，恶魔拦下。</strong>
        </Hint>
      }
    >
      <div className={problemStyles.layout}>
        <CastleBattle
          playing={v.playing}
          onToggle={() => set({ playing: !v.playing })}
        />
        <figure className={problemStyles.process}>
          <img
            src={asset('castle-gatekeeper-process.png')}
            alt="城堡守门流程：先用已知身份的勇士、恶魔档案训练模型。再输入新来客的攻击、防御、血量三个数值，使用训练好的模型预测身份；预测为勇士则放行，预测为恶魔则拦下。"
            width={1254}
            height={1254}
          />
        </figure>
      </div>
    </Stage>
  );
}

function DataDiscussion() {
  const [v, set] = useSceneState('data-discussion', {
    feature: 'health' as Feature,
    sort: false,
    voted: false,
  });
  return (
    <Stage
      label="CLASS DISCUSSION · 观察训练数据"
      title="哪条线索，值得先试一试？"
    >
      <div className={`${s.two} ${s.wideLeft}`}>
        <TrainingTable feature={v.feature} sort={v.sort} />
        <div className={s.stack}>
          <h3>先观察，再提出猜想</h3>
          <Choices
            label="选择特征"
            items={['攻击', '防御', '血量']}
            value={(['attack', 'defense', 'health'] as Feature[]).indexOf(
              v.feature,
            )}
            onChange={(index) =>
              set({
                feature: (['attack', 'defense', 'health'] as Feature[])[index],
                voted: false,
              })
            }
          />
          <button
            className={s.secondary}
            onClick={() => set({ sort: !v.sort })}
          >
            {v.sort
              ? '恢复档案顺序'
              : `按${featureNames[v.feature]}从小到大排列`}
          </button>
          <p>你发现了什么？有没有不符合你猜想的角色？</p>
          <button
            className={s.primary}
            onClick={() => {
              set({ voted: true });
              try {
                localStorage.setItem('ai-python-guardian-feature', v.feature);
              } catch {
                /* Optional handoff. */
              }
            }}
          >
            记录我的首选线索
          </button>
          {v.voted && (
            <p className={s.small} aria-live="polite">
              已记录：{featureNames[v.feature]}
              。这是待检验的猜想；进入训练营后，比较实际分类结果。
            </p>
          )}
          <Link
            className={discussionStyles.trainingEntry}
            href="/courses/ai-with-python/lesson-01/castle-guardian/"
          >
            <img
              src={asset('castle-guardian-lobby.png')}
              alt=""
              aria-hidden="true"
            />
            <span className={discussionStyles.entryContent}>
              <span className={discussionStyles.entryTag}>
                实战体验 · 城堡守门
              </span>
              <strong>
                进入训练营 <ArrowRight size={32} aria-hidden="true" />
              </strong>
              <span className={discussionStyles.entryCaption}>
                亲手训练模型，检验你的猜想
              </span>
            </span>
          </Link>
        </div>
      </div>
    </Stage>
  );
}

function PracticeTools() {
  return (
    <Stage label="CLASS PRACTICE · 课堂练习 03" title="先训练，再预测">
      <PracticeProgress active={0} />
      <div className={s.two}>
        <div className={s.panel}>
          <div className={s.row}>
            <ClassPracticeStamp number="03" checklist />
            <h3>完成一次机器学习实验</h3>
          </div>
          <p>
            准备数据 → 训练模型
            <br />
            输入新角色 → 核对真实身份
          </p>
          <Link
            className={s.secondary}
            href="/courses/ai-with-python/lesson-01/castle-guardian/"
          >
            回到训练营复习
          </Link>
        </div>
        <div className={s.stack}>
          <h3>先导入需要的工具</h3>
          <p className={s.small}>sklearn 是机器学习工具库。</p>
          <CodeCell code={importCode} />
          <p>
            <b>tree</b>：建立决策树模型。
            <br />
            <b>metrics</b>：检查预测表现。
          </p>
          <Hint>导入成功通常没有输出；没有报错就可以继续。</Hint>
        </div>
      </div>
    </Stage>
  );
}

function TrainingData() {
  const [v, set] = useSceneState('training-data', { selected: 0 });
  return (
    <Stage label="CLASS PRACTICE · 课堂练习 03" title="把角色卡写成 X 和 y">
      <PracticeProgress active={1} />
      <div className={s.two}>
        <div className={s.stack}>
          <TrainingTable
            selected={v.selected}
            onSelect={(selected) => set({ selected })}
          />
          <p className={s.small}>
            点击档案，右侧同时高亮特征和标签。
            <br />X 每行的顺序：攻击、防御、血量。
          </p>
        </div>
        <div className={s.stack}>
          <CodeCell
            title="X · 完整的 10 组特征"
            code={dataX}
            compact
            highlight={v.selected + 1}
          />
          <div className={s.labelRow}>
            <span>y = [</span>
            {warriors.map((r, i) => (
              <button
                key={r.name}
                aria-label={`${r.name}的标签 ${r.category === '勇士' ? 1 : 0}`}
                data-selected={v.selected === i}
                onClick={() => set({ selected: i })}
              >
                {r.category === '勇士' ? 1 : 0}
                {i < 9 ? ',' : ''}
              </button>
            ))}
            <span>]</span>
          </div>
          <div className={s.row}>
            <More label="复制标签与对应规则">
              <CodeCell code={dataY} />
              <p>1 = 勇士，0 = 恶魔。身份代号是本课约定。</p>
              <p>
                交换 X 中两位角色的位置时，y
                中对应的两个标签也要交换，才能保持一一对应。
              </p>
            </More>
            <span className={s.small}>1 勇士 · 0 恶魔</span>
          </div>
        </div>
      </div>
    </Stage>
  );
}

function Fit() {
  const [v, set] = useSceneState('fit', { step: 0 });
  return (
    <Stage label="CLASS PRACTICE · 课堂练习 03" title="用 fit，让模型开始学习">
      <PracticeProgress active={2} />
      <div className={s.two}>
        <div className={s.stack}>
          <CodeCell code={fitCode} highlight={v.step} />
          <Choices
            label="训练步骤"
            items={['创建分类器', '调用 fit 训练']}
            value={v.step}
            onChange={(step) => set({ step })}
          />
          <More label="怎么确认训练成功？">
            <p>
              先运行导入和完整的
              X、y，再运行这两行。没有报错，并能在下一步成功画树，就说明模型已完成训练。
            </p>
            <p>
              Jupyter 可能显示分类器的文字表示；这不是它对新角色作出的预测。
            </p>
          </More>
        </div>
        <FitExplainer trained={v.step === 1} />
      </div>
    </Stage>
  );
}

function Plot() {
  return (
    <Stage label="CLASS PRACTICE · 课堂练习 03" title="把训练好的决策树画出来">
      <PracticeProgress active={3} />
      <div className={s.two}>
        <div className={s.stack}>
          <CodeCell code={plotCode} compact />
          <XiaopaiSpeech active compact label="小派讲解画出决策树">
            <strong>fit</strong> 负责学习；<strong>plot_tree</strong>{' '}
            把已经学到的规则画出来。
          </XiaopaiSpeech>
        </div>
        <div className={s.stack}>
          <CastleTree />
          <div className={s.row}>
            <More label="查看 Python 原始输出">
              <img
                src={asset('decision-tree-user-output.png')}
                alt="Python plot_tree 实际输出的完整决策树"
                style={{
                  width: '100%',
                  maxHeight: '65vh',
                  objectFit: 'contain',
                }}
              />
              <p>
                图中
                Heart：血量；Warrior：勇士；Demon：恶魔。它和城堡里的树，规则是否一致？
              </p>
            </More>
            <More label="图中其他数字是什么？">
              <p>samples：到达这个节点的训练例子数量。</p>
              <p>value：各类别的例子数量。本例顺序是 [恶魔, 勇士]。</p>
              <p>
                gini：描述这个节点里类别混杂的程度。为 0
                时，训练例子都属于同一类；本课先不计算它。
              </p>
              <p>图中 Heart 对应血量；Warrior 对应勇士；Demon 对应恶魔。</p>
            </More>
          </div>
        </div>
      </div>
    </Stage>
  );
}

function Predict() {
  const [v, set] = useSceneState('predict', {
    step: 0,
    guesses: [-1, -1],
  });
  return (
    <Stage
      label="CLASS PRACTICE · 课堂练习 03"
      title="用同一个模型，预测两位新来客"
    >
      <PracticeProgress active={4} />
      <div className={s.two}>
        <div className={s.stack}>
          <div className={s.two}>
            {newRoles.slice(0, 2).map((r, i) => (
              <div className={s.stack} key={r.name}>
                <RoleCard
                  role={{
                    ...r,
                    name: `来客 ${i === 0 ? 'A' : 'B'}`,
                    image: `prediction-visitor-${i === 0 ? 'a' : 'b'}.png`,
                  }}
                  portrait
                >
                  <ol
                    className={predictionStyles.path}
                    aria-label={`来客 ${i === 0 ? 'A' : 'B'} 的完整判断链路`}
                  >
                    <li>
                      <span>{r.health} ≤ 245？</span>
                      <b>{i === 0 ? '否' : '是'}</b>
                    </li>
                    {i === 0 && (
                      <li>
                        <span>390 ≤ 450？</span>
                        <b>是</b>
                      </li>
                    )}
                    <li className={predictionStyles.result}>
                      <span aria-hidden="true">↓</span>
                      <strong>预测：{i === 0 ? '勇士' : '恶魔'}</strong>
                    </li>
                  </ol>
                </RoleCard>
                <Choices
                  label={`我对来客 ${i === 0 ? 'A' : 'B'} 的预判`}
                  items={['勇士', '恶魔']}
                  value={v.guesses[i]}
                  onChange={(choice) => {
                    const guesses = [...v.guesses];
                    guesses[i] = choice;
                    set({ guesses });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={s.stack}>
          <CodeCell
            code={predictionCode}
            compact
            output={v.step >= 2 ? '[1 0]' : undefined}
          />
          <XiaopaiSpeech active compact label="小派介绍来客预测任务">
            {v.step === 0
              ? '先沿树判断，记录两位来客的预期结果。'
              : v.step === 1
                ? 'predict 用刚才的模型预测：输入只有特征，没有身份标签。'
                : '按输入顺序：A → 1（勇士），B → 0（恶魔）。'}
          </XiaopaiSpeech>
          <button
            className={s.primary}
            onClick={() => set({ step: v.step >= 2 ? 0 : v.step + 1 })}
          >
            {['讲解 predict 的输入', '运行后，揭晓输出', '重新预测'][v.step]}
          </button>
          <p className={s.small}>是否预测正确，下一页再用真实档案核对。</p>
        </div>
      </div>
    </Stage>
  );
}

function Summary() {
  return (
    <Stage
      label="MISSION COMPLETE · 课堂回顾"
      title="我们怎样训练城堡守门模型？"
    >
      <div className={s.summaryGrid}>
        {[
          ['准备数据', '特征 X + 已知标签 y'],
          ['训练模型', 'fit：从例子中学规则'],
          ['判断新例子', 'predict：输出预测'],
          ['核对真实答案', '评价这一次的表现'],
        ].map(([a, b], i) => (
          <div key={a}>
            <span className={s.tag}>0{i + 1}</span>
            <b>{a}</b>
            <p>{b}</p>
          </div>
        ))}
      </div>
      <div className={s.challengeEntry}>
        <img
          src={asset('final-challenge-entry-background.png')}
          alt=""
          aria-hidden="true"
        />
        <div>
          <h3>最终挑战 · 读懂一棵新的决策树</h3>
          <p>看清条件，沿分支判断；试着解释你走过的路径。</p>
          <div className={s.row}>
            <Link
              className={s.primary}
              href="/courses/ai-with-python/lesson-01/final-challenge/"
            >
              进入最终挑战
            </Link>
            <More label="三问回顾">
              <p>① 训练时，X 和 y 分别装什么？</p>
              <p>② 没有真实身份的新角色，为什么也能交给模型预测？</p>
              <p>③ 这次准确率是 100%，为什么仍然可能判断错下一位来客？</p>
            </More>
            <More label="完整 Python 示例">
              <CodeCell code={fullCode} />
            </More>
          </div>
        </div>
      </div>
      <div className={s.row}>
        <Link className={s.secondary} href="/courses/ai-with-python/">
          完成本课 · 返回课程目录
        </Link>
        <p className={s.small}>你已经走完一次：数据 → 模型 → 预测 → 检验。</p>
      </div>
    </Stage>
  );
}

export function ModelScene({ id }: { id: string }) {
  switch (id) {
    case 'chapter-3-castle-problem':
      return <Problem />;
    case 'chapter-3-discussion':
      return <DataDiscussion />;
    case 'chapter-3-role-samples':
      return <TreeConceptScene />;
    case 'chapter-3-dataset':
      return <PracticeTools />;
    case 'chapter-3-tree-concept':
      return <TrainingData />;
    case 'chapter-3-training-data':
      return <Fit />;
    case 'chapter-3-training-fit':
      return <Plot />;
    case 'chapter-3-tree-result':
      return <Predict />;
    case 'chapter-3-prediction':
      return <AccuracyScene />;
    case 'finish-summary':
      return <Summary />;
    default:
      return null;
  }
}
