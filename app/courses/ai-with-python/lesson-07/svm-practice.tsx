'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { usePageState } from '@/components/course/lesson-state';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import evidence from '@/public/courses/ai-with-python/lesson-07/practice/evidence.json';
import studentCode from '@/public/courses/ai-with-python/lesson-07/practice/svm-student-cells.json';
import { GuessReviewPrompt, useFlowerGuess } from './flower-guesses';
import { GiftMeasurements } from './gift-measurements';
import { assetBase } from './lesson-data';
import s from './decision-tree-practice.module.css';
import local from './svm-practice.module.css';

const { labels, species } = evidence;
const notebookName = 'lesson7_exe3.ipynb';
const [svmSetup, svmFit, , svmTest] = studentCode.train.split('\n');
const [, , , , treeFit, treeTest] = evidence.code.tree.split('\n');
const predictionInput = studentCode.predict.split('\nif ')[0];
const predictionLines = studentCode.predict.split('\n\n').at(-1) ?? '';
const fullCells = [
  { code: studentCode.split },
  { code: `${studentCode.train}\n\n${studentCode.report}` },
  { code: `${studentCode.measure}\n\n${studentCode.predict}` },
];

const modelComparison = [
  {
    step: '选模型',
    purpose: '创建分类模型',
    tree: 'DecisionTreeClassifier',
    svm: svmSetup.split(' = ')[1],
    keyword: 'SVC',
  },
  {
    step: '训练',
    purpose: '从读数和种名学习',
    tree: treeFit,
    svm: svmFit,
    keyword: 'fit',
  },
  {
    step: '预测',
    purpose: '给测试卡猜种名',
    tree: treeTest.split(' = ')[1],
    svm: svmTest.split(' = ')[1],
    keyword: 'predict',
  },
];

function ModelCodeComparison() {
  return (
    <table className={local.comparisonTable}>
      <caption>对照决策树和线性 SVM 的代码，找找换模型的是哪一行。</caption>
      <thead>
        <tr>
          <th scope="col">代码节选</th>
          <th scope="col">第二次猜花 · 决策树</th>
          <th scope="col">第三次猜花 · 线性 SVM</th>
        </tr>
      </thead>
      <tbody>
        {modelComparison.map(({ step, purpose, tree, svm, keyword }) => {
          const [before, after] = svm.split(keyword);
          return (
            <tr key={step}>
              <th scope="row">
                <b>{step}</b>
                <span>{purpose}</span>
              </th>
              <td>
                <code>{tree}</code>
              </td>
              <td>
                <code>
                  {before}
                  <mark>{keyword}</mark>
                  {after}
                </code>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function FullNotebookReference() {
  return (
    <Dialog>
      <DialogTrigger className={s.replay}>查看完整代码</DialogTrigger>
      <DialogContent className={local.reference} showCloseButton={false}>
        <div className={s.zoomHeader}>
          <div>
            <DialogTitle>课堂练习三 · 完整代码</DialogTitle>
            <DialogDescription>
              在 Python 3 的 JupyterLab 中按顺序运行。先装好
              scikit-learn，再把四个 None 换成实测读数。
            </DialogDescription>
          </div>
          <DialogClose className={s.zoomClose}>关闭</DialogClose>
        </div>
        <div className={local.referenceScroll}>
          <NotebookPanel title={notebookName} cells={fullCells} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SvmPractice() {
  const [state, setState] = usePageState({ svmTab: 'train' });
  const { guess, needsReview, recordGuess } = useFlowerGuess('third');
  return (
    <Tabs
      value={state.svmTab}
      onValueChange={(value) => setState({ svmTab: value })}
      className={s.practice}
    >
      <div className={s.stamp}>
        <ClassPracticeStamp number="03" checklist />
      </div>
      <TabsList
        className={s.tabList}
        aria-label="课堂练习三的三个步骤"
        activateOnFocus
      >
        <TabsTrigger className={s.tab} value="train">
          01 · 对照模型代码
        </TabsTrigger>
        <TabsTrigger className={s.tab} value="predict">
          02 · 读预测代码
        </TabsTrigger>
        <TabsTrigger className={s.tab} value="task">
          03 · 填数猜花
        </TabsTrigger>
      </TabsList>

      <TabsContent
        className={`${s.panel} ${local.comparisonPanel}`}
        value="train"
        keepMounted
      >
        <ModelCodeComparison />
        <div className={local.comparisonFooter}>
          <p>
            两次练习共用 <b>105 张训练卡</b>和 <b>45 张测试卡</b>。
          </p>
          <div className={s.controls}>
            <button
              type="button"
              className={s.next}
              onClick={() => setState({ svmTab: 'predict' })}
            >
              看看怎么预测新花 <ArrowRight aria-hidden="true" size={20} />
            </button>
            <FullNotebookReference />
          </div>
        </div>
      </TabsContent>

      <TabsContent className={s.panel} value="predict" keepMounted>
        <div className={local.codePreview}>
          <NotebookPanel
            title={`${notebookName} · 预测节选`}
            compact
            cells={[
              {
                code: `${studentCode.measure}\n\n${predictionInput}`,
                activeLines: [0, 1, 2, 3],
              },
              { code: predictionLines, activeLines: [0, 1, 2] },
            ]}
          />
        </div>
        <div className={s.guide}>
          <h3 className={s.heading}>一朵新花怎样得到种名？</h3>
          <div className={local.readCards}>
            <p>
              <b>输入</b> 把礼花的四项读数放进 <code>my_flower_feature</code>。
            </p>
            <p>
              <b>预测</b> <code>predict</code> 判断礼花落在哪类区域。
            </p>
            <p>
              <b>输出</b> 最后一行打印预测种名。
            </p>
          </div>
          <div className={s.controls}>
            <button
              type="button"
              className={s.next}
              onClick={() => setState({ svmTab: 'task' })}
            >
              轮到我填数 <ArrowRight aria-hidden="true" size={20} />
            </button>
          </div>
        </div>
      </TabsContent>

      <TabsContent className={s.panel} value="task" keepMounted>
        <figure className={s.measurementArt}>
          <Image
            src={`${assetBase}/assets/flower-room-measurement.jpg`}
            alt="勇士记下园丁量出的花的读数。"
            width={1448}
            height={1086}
            sizes="45vw"
          />
        </figure>
        <div className={`${s.guide} ${s.task}`}>
          <h3 className={s.heading}>填你的读数，做第三次猜测</h3>
          <div className={local.readCards}>
            <p>
              <b>在 JupyterLab 打开练习</b>
              <code>{notebookName}</code> · 运行准备和训练单元格
            </p>
            <p>
              <b>填好读数，再运行最后一格</b>
              把四个 <code>None</code> 换成同一张实测卡里的读数。
            </p>
          </div>
          <GiftMeasurements />
          <label className={local.practiceResults}>
            第三次 · 记录预测种名
            <select
              value={guess}
              onChange={(event) => recordGuess(event.target.value)}
            >
              <option value="">选择模型输出的种名</option>
              {labels.map((label, index) => (
                <option key={label} value={index}>
                  {label}（{species[index]}）
                </option>
              ))}
            </select>
          </label>
          {needsReview && (
            <GuessReviewPrompt onConfirm={() => recordGuess(guess)} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
