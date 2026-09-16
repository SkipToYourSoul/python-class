'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ClassPracticeStamp, Stage, useSceneState } from './lesson-ui';
import s from './notebook-practice-scene.module.css';

const basicCells = [
  {
    title: '变量与输出',
    code: 'name = "小派"\nprint("你好，" + name)',
    output: '你好，小派',
  },
  {
    title: '循环与选择',
    code: 'for number in range(1, 4):\n    if number > 1:\n        print(number, end=" ")',
    output: '2 3',
  },
  {
    title: '列表与字典',
    code: 'names = ["勇士", "恶魔"]\nhero = {"名字": "勇士", "生命": 100}\nprint(names[0], hero["生命"])',
    output: '勇士 100',
  },
];

const starterCells = [
  '# 1. 创建两个角色\nhero = {"名字": "勇士", "攻击": 30}\ndemon = {"名字": "恶魔", "生命": 50}',
  '# 2. 勇士攻击一次\ndemon["生命"] -= hero["攻击"]\nprint("恶魔剩余生命：", demon["生命"])',
  '# 3. 判断胜负\nif demon["生命"] <= 0:\n    print("勇士获胜！")\nelse:\n    print("恶魔还站着！")',
];

export function NotebookPracticeScene() {
  const [value, set] = useSceneState('notebook-practice', {
    tab: 'basic',
    runs: [0, 0, 0],
    runCount: 0,
  });
  const [copyState, setCopyState] = useState('复制起点代码');
  const complete = value.runs.every(Boolean);

  function runCell(index: number) {
    const runCount = value.runCount + 1;
    set({
      runCount,
      runs: value.runs.map((count, cell) =>
        cell === index ? runCount : count,
      ),
    });
  }

  async function copyStarter() {
    try {
      await navigator.clipboard.writeText(starterCells.join('\n\n'));
      setCopyState('已复制，可粘贴到 JupyterLab');
    } catch {
      setCopyState('请选中左侧代码复制');
    }
  }

  return (
    <Stage
      title="从跟着写，到自己创作"
      label="CLASS PRACTICE · 课堂练习 02"
      className={s.scene}
    >
      <Tabs
        value={value.tab}
        onValueChange={(tab) => set({ tab: String(tab) })}
        className={s.tabs}
      >
        <div className={s.tabRow}>
          <TabsList className={s.tabList} aria-label="课堂练习二">
            <TabsTrigger className={s.tab} value="basic">
              01 基础 · 跟着写
            </TabsTrigger>
            <TabsTrigger className={s.tab} value="creative">
              02 进阶 · 自己改
            </TabsTrigger>
          </TabsList>
        </div>

        <div className={s.workArea}>
          <div className={s.stamp}>
            <ClassPracticeStamp number="02" />
          </div>
          <TabsContent className={s.panel} value="basic">
            <div className={s.notebook} aria-label="基础 Python 单元格演示">
              <div className={s.chrome}>
                <strong>◉ practice_02.ipynb</strong>
                <span>Python 3 · 模拟运行</span>
              </div>
              <div className={s.cells}>
                {basicCells.map((cell, index) => (
                  <div className={s.cell} key={cell.title}>
                    <span
                      className={s.execution}
                      aria-label={`单元格 ${index + 1} 执行编号`}
                    >
                      [{value.runs[index] || ' '}]:
                    </span>
                    <div className={s.cellContent}>
                      <pre>
                        <code>{cell.code}</code>
                      </pre>
                      <div className={s.output} aria-live="polite">
                        {value.runs[index] ? (
                          cell.output
                        ) : (
                          <span>运行后查看输出</span>
                        )}
                      </div>
                    </div>
                    <button
                      className={s.run}
                      aria-label={`运行单元格 ${index + 1}：${cell.title}`}
                      onClick={() => runCell(index)}
                    >
                      ▶ 运行
                    </button>
                  </div>
                ))}
              </div>
              <div className={s.status}>
                <span aria-live="polite">
                  {complete
                    ? '三格已运行 · 对照你自己的输出'
                    : '先猜结果，再从上到下逐格运行。'}
                </span>
                <button onClick={() => set({ runs: [0, 0, 0], runCount: 0 })}>
                  重新演示
                </button>
              </div>
            </div>
            <aside className={s.guide}>
              <h3>写一格，运行一格</h3>
              <ol>
                <li>
                  <b>变量</b>
                  <span>记住名字，再打个招呼。</span>
                </li>
                <li>
                  <b>循环 + 选择</b>
                  <span>for 逐个取数，if 判断大小。</span>
                </li>
                <li>
                  <b>列表 + 字典</b>
                  <span>按索引取名字，按键取生命。</span>
                </li>
              </ol>
              <p className={s.check}>完成：三格都能运行，输出与示例一致。</p>
            </aside>
          </TabsContent>

          <TabsContent className={s.panel} value="creative">
            <div className={s.notebook} aria-label="自由创作的可选代码起点">
              <div className={s.chrome}>
                <strong>◉ my_experiment.ipynb</strong>
                <span>可选起点 · 勇士挑战恶魔</span>
              </div>
              <div className={s.cells}>
                {starterCells.map((code, index) => (
                  <div className={s.cell} key={code}>
                    <span className={s.execution}>[ ]:</span>
                    <div className={s.cellContent}>
                      <pre>
                        <code>
                          <span className={s.comment}>
                            {code.split('\n')[0]}
                          </span>
                          {'\n' + code.split('\n').slice(1).join('\n')}
                        </code>
                      </pre>
                    </div>
                    <span className={s.cellNumber}>单元格 {index + 1}</span>
                  </div>
                ))}
              </div>
              <div className={s.status}>
                <span>在 JupyterLab 中改写、运行并保存。</span>
                <button onClick={copyStarter}>{copyState}</button>
              </div>
            </div>
            <aside className={s.guide}>
              <h3>设计你的角色对决</h3>
              <p>
                勇士攻击，恶魔掉生命。
                <br />
                怎样让勇士获胜？
              </p>
              <ol>
                <li>
                  <b>改属性</b>
                  <span>改变攻击力或生命值。</span>
                </li>
                <li>
                  <b>自由扩展</b>
                  <span>循环攻击？加护盾？你来定！</span>
                </li>
              </ol>
              <p className={s.check}>
                改写后从第一格重跑，解释结果；也可自创角色故事。
              </p>
            </aside>
          </TabsContent>
          <a
            className={s.onlineLink}
            href="https://jupyter.org/try-jupyter/lab/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="在线 JupyterLab（在新标签页打开）"
          >
            https://jupyter.org/try-jupyter/lab/
          </a>
        </div>
      </Tabs>
    </Stage>
  );
}
