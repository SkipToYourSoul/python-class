/* oxlint-disable next/no-img-element -- Reuse the lesson's established story artwork. */
'use client';
import { useContext } from 'react';
import { ArrowRight, FileText, Table2 } from 'lucide-react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { CodeDialog, Guide, LessonStage } from './lesson-ui';
import { assetBase } from './lesson-data';
import { CSV_PREVIEW, INTEL_RECORDS, WRITE_CSV } from './practice-content';
import s from './csv-scenes.module.css';
import entry from './report-practice.module.css';

const fields = ['恶魔', '地点', '弱点'];
export function IntelTable({ emphasis = 'all' }: { emphasis?: string }) {
  return (
    <table className={s.table} data-emphasis={emphasis}>
      <thead>
        <tr>
          {fields.map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {INTEL_RECORDS.map((record) => (
          <tr key={record.name}>
            <td>{record.name}</td>
            <td>{record.location}</td>
            <td>{record.weakness}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export function CsvConcept() {
  return (
    <LessonStage title="CSV：把情报存成一张表" label="CONCEPT · 认识 CSV 文件">
      <section className={s.definition} aria-label="CSV 文件的概念">
        <div>
          <p>
            <strong>CSV 是一种用文本保存表格数据的文件格式。</strong>
          </p>
          <p className={s.definitionName}>
            Comma-Separated Values · 逗号分隔值
          </p>
        </div>
        <div className={s.extension}>
          <span>常见文件后缀</span>
          <code>.csv</code>
        </div>
      </section>
      <div className={s.compare}>
        <section className={s.fileWindow}>
          <header>
            <FileText />
            <strong>handover.csv</strong>
            <span>文本视图</span>
          </header>
          <pre className={s.csvText}>
            {CSV_PREVIEW.split('\n').map((line, i) => (
              <span key={line} data-header={i === 0}>
                {line.split(',').map((value, j) => (
                  <span key={j} data-column={j}>
                    {j > 0 && <b>,</b>}
                    {value}
                  </span>
                ))}
              </span>
            ))}
          </pre>
          <div className={s.windowNote}>文本编辑器里，看到的是这些文字。</div>
        </section>
        <div className={s.arrow}>
          <ArrowRight size={32} aria-hidden="true" />
          <span>
            同一文件
            <br />
            两种视图
          </span>
        </div>
        <section className={s.fileWindow}>
          <header>
            <Table2 />
            <strong>handover.csv</strong>
            <span>表格视图</span>
          </header>
          <IntelTable />
          <div className={s.windowNote}>表格软件按逗号分列，显示成表格。</div>
        </section>
      </div>
      <ul className={s.csvRules} aria-label="这个 CSV 文件的组织方式">
        <li>
          <strong>表头：说明各列</strong>
          <span>本例首行写恶魔、地点、弱点。</span>
        </li>
        <li>
          <strong>英文逗号：分开各列</strong>
          <span>每列保存一种信息。</span>
        </li>
        <li>
          <strong>换行：开始下一条</strong>
          <span>本例每条情报占一行。</span>
        </li>
      </ul>
      <Guide>
        把刚才读出的三条情报按列保存，伙伴更好查找，程序也更容易读取。
      </Guide>
    </LessonStage>
  );
}
const explanations = [
  {
    label: '① 记录',
    lines: [0, 1, 2, 3, 4],
    title: '一条记录，三个字段',
    description: '每个 { } 保存一只恶魔的资料；字段名对应表格的列。',
    emphasis: 'all',
  },
  {
    label: '② 工具',
    lines: [6, 8, 9, 10, 11],
    title: '准备 CSV 写入工具',
    description:
      'newline="" 让 csv 模块管理文件换行，不会把记录拼成一行。fieldnames 决定列的顺序。',
    emphasis: 'none',
  },
  {
    label: '③ 写入',
    lines: [12, 13],
    title: '先表头，再数据行',
    description: 'writeheader() 写一次表头；writerows(records) 写入三条记录。',
    emphasis: 'header',
  },
];
export function CsvCode() {
  const [state, update] = usePageState({ csvCodeStep: 0 });
  const step = explanations[state.csvCodeStep];
  return (
    <LessonStage
      title="把情报写成 CSV 文件"
      label="CODE · 表头一次，记录逐行写"
    >
      <div className={s.codeLayout}>
        <div className={s.code}>
          <NotebookPanel
            compact
            title="第三课练习.ipynb · 完整代码"
            cells={[{ code: WRITE_CSV, activeLines: step.lines }]}
          />
          <p>
            用相对路径保存：<code>./handover.csv</code> · Python 自带
            csv，无需安装。
          </p>
        </div>
        <aside className={s.explain}>
          <fieldset className={s.codeSteps} aria-label="CSV 写入步骤">
            {explanations.map((item, index) => (
              <button
                key={item.label}
                aria-pressed={state.csvCodeStep === index}
                onClick={() => update({ csvCodeStep: index })}
              >
                {item.label}
              </button>
            ))}
          </fieldset>
          <div className={s.smallComic}>
            <img
              src={`${assetBase}/assets/rescue-act-03.png`}
              alt="小派和勇士把恶魔情报按列排好，帮助接班伙伴查找。"
            />
          </div>
          <section className={s.explanation} aria-live="polite">
            <h3>{step.title}</h3>
            <p>小派：{step.description}</p>
          </section>
          <IntelTable emphasis={step.emphasis} />
          <CodeDialog
            code={WRITE_CSV}
            output={CSV_PREVIEW}
            outputLabel="文件内容示例"
            note="按顺序运行全部代码后会生成 handover.csv。写文件没有 print，输出区为空；打开文件核对表头和三条记录。w 会覆盖同名文件。"
          />
        </aside>
      </div>
    </LessonStage>
  );
}
export function CsvPracticeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage
      title="制作自己的勇士图鉴"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={
        <div className={entry.entryFooter}>
          <button
            className={entry.primary}
            onClick={() => navigate('l3-workshop')}
          >
            开始练习 →
          </button>
        </div>
      }
    >
      <div className={entry.entry}>
        <aside className={entry.mission}>
          <ClassPracticeStamp number="03" checklist />
          <strong>让守城伙伴一眼找到弱点</strong>
          <ol>
            <li>向 AI 提供情报表。</li>
            <li>选择风格，发送创作要求。</li>
            <li>对照情报表，核对网页内容。</li>
          </ol>
          <p>
            完成标准：
            <br />
            <b>3 张卡片 · 信息准确 · 文字清楚</b>
          </p>
        </aside>
        <figure className={entry.entryPicture}>
          <div className={entry.handoffFrame}>
            <img
              src={`${assetBase}/assets/rescue-act-03.png`}
              alt="勇士和小派把散乱情报整理成表格，让守城伙伴查找。"
            />
          </div>
          <figcaption>
            把保存的情报交给 AI，做一本守城伙伴用得上的图鉴。
          </figcaption>
        </figure>
      </div>
    </LessonStage>
  );
}
