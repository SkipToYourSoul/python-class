/* oxlint-disable next/no-img-element -- Local character-consistent teaching comic. */
'use client';

import { Monitor } from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { CodeDialog, LessonStage } from './lesson-ui';
import { assetBase } from './lesson-data';
import { ARCHIVE_OUTPUT } from './practice-content';
import s from './write-newline.module.css';

const records = ARCHIVE_OUTPUT.trimEnd().split('\n');
const pathCode = 'path = "./samples/intel-archive.txt"';
const openCode = 'with open(path, "r", encoding="utf-8") as f:';
const wholeCode = `${pathCode}\n${openCode}\n    text = f.read()`;
const lineCode = `${pathCode}\n${openCode}\n    for line in f:\n        print(line, end="")`;
const initial = { readingStep: 0 };
const acts = ['① 档案太多', '② 一次读入', '③ 逐行读取'];

export function WriteNewlineScene() {
  const [state, update] = usePageState(initial);
  const step = state.readingStep;
  const byLine = step >= 2;
  const count = Math.max(0, step - 2);
  const complete = count === records.length;
  const act = byLine ? 2 : step;
  const action = !byLine
    ? `看第 ${step + 2} 幕 →`
    : complete
      ? '重读这 4 行'
      : `读取第 ${count + 1} 行 →`;

  return (
    <LessonStage
      title="档案太大，一次读完会怎样？"
      label="READ LINES · 一条一条处理"
      footer={
        <div className={s.controls}>
          <span>
            {byLine
              ? '逐行读取示意 · 用 4 行小样本演示'
              : '如果交班档案积累了几万条情报……'}
          </span>
          <CodeDialog
            title="完整代码与核对"
            code={lineCode}
            output={ARCHIVE_OUTPUT}
            note={
              '解压课堂练习包，在练习文件夹的 Notebook 中运行。samples/intel-archive.txt 是已有的 4 行样本。line 通常保留行尾换行符；print 的 end="" 避免再添一个换行。'
            }
          />
        </div>
      }
    >
      <div className={s.workspace}>
        <div className={s.diagram} aria-label="文件到内存的读取示意">
          <figure className={s.comic}>
            <div className={s.comicFrame}>
              <span className={s.comicBadge}>漫画 {act + 1} / 3</span>
              <img
                src={`${assetBase}/assets/reading-large-archive.png`}
                style={{
                  transform: `translateX(-${((byLine ? 2 : step) * 100) / 3}%)`,
                }}
                alt={
                  byLine
                    ? '勇士每次只在桌上阅读一张记录，其余档案留在柜中，小派和管理员协助逐条取阅。'
                    : step === 1
                      ? '勇士把整份档案一次搬上小桌，纸张堆满桌面，小派惊讶地探出头。'
                      : '勇士和小派面对装满记录的巨大档案柜，旁边只有一张小工作桌。'
                }
              />
            </div>
            <figcaption>
              {byLine
                ? '小派：“一次拿一张，桌上就放得下！”'
                : step === 1
                  ? '勇士：“全搬过来，桌子都堆满了！”'
                  : '勇士：“这么多档案，都要搬上桌吗？”'}
            </figcaption>
          </figure>
        </div>
        <div className={s.codeColumn}>
          <div className={s.navigation}>
            <fieldset className={s.actTabs} aria-label="选择漫画幕次">
              {acts.map((label, index) => (
                <button
                  key={label}
                  aria-pressed={act === index}
                  onClick={() => {
                    if (act !== index) update({ readingStep: index });
                  }}
                >
                  {label}
                </button>
              ))}
            </fieldset>
            <div className={s.progressRow}>
              <span aria-live="polite">
                {byLine
                  ? `已读 ${count} / ${records.length} 行${complete ? ' · 已完成' : ` · 还剩 ${records.length - count} 行`}`
                  : `漫画第 ${act + 1} 幕 / 共 3 幕`}
              </span>
              <button
                className={s.primary}
                onClick={() => update({ readingStep: complete ? 2 : step + 1 })}
              >
                {action}
              </button>
            </div>
          </div>
          <NotebookPanel
            compact
            title="第三课练习.ipynb"
            cells={[
              {
                code: byLine ? lineCode : wholeCode,
                activeLines: byLine ? (count ? [2, 3] : [2]) : [2],
              },
            ]}
          />
          <section
            className={s.memory}
            data-crowded={step === 1}
            aria-live="polite"
          >
            <header>
              <Monitor size={24} aria-hidden="true" />
              <strong>工作桌好比内存</strong>
            </header>
            {step === 0 ? (
              <p className={s.question}>
                整份档案都搬上桌，
                <br />
                需要多少空间？
              </p>
            ) : step === 1 ? (
              <div className={s.pile}>
                <span>第 1 条</span>
                <span>第 2 条</span>
                <span>第 3 条</span>
                <span>……还有很多</span>
                <strong>全文都放在 text 里</strong>
              </div>
            ) : (
              <div className={s.currentLine}>
                <p>
                  {count ? (
                    <>
                      <b>line：</b>
                      {records[count - 1]}
                    </>
                  ) : (
                    'line 等待接收第一行。'
                  )}
                </p>
              </div>
            )}
          </section>
          <div className={s.explanation} aria-live="polite">
            <strong>
              {step === 0
                ? '先想一想，再点按钮观察'
                : step === 1
                  ? '文件越大，全文占用的内存越多'
                  : complete
                    ? '4 行样本已读完，循环结束'
                    : 'for line in f：每轮读取并处理一行'}
            </strong>
            <p>
              {step === 0
                ? '内存就像工作桌，能放下的东西有限。'
                : step === 1
                  ? '内存不足时，程序可能变慢或报错。'
                  : complete
                    ? '离开 with 后，文件自动关闭。原文件保持不变。'
                    : 'end=""：行尾已有换行时，不再多换一行。'}
            </p>
          </div>
        </div>
      </div>
    </LessonStage>
  );
}
