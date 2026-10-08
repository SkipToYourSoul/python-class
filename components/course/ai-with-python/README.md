# AI with Python · 公共组件使用说明

本文记录公共组件的入口、参数及样式接入方式。教学、视觉及课程验收标准见[课程设计规范](../../../COURSE_DESIGN_SYSTEM.md)，项目协作、工程约定与验证流程见[AGENTS.md](../../../AGENTS.md)。

各课直接从本目录导入组件，剧情、台词、样本和任务数据由调用方提供。公共实现不反向引用单课目录；单课专用讲解留在对应课程中。

## 组件入口与参数

| 组件                     | 入口                                             | 使用方式                                                                                                                                     |
| ------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Stage`                  | [lesson-stage.tsx](lesson-stage.tsx)             | 必传 `title`、`label`、`children`；可传 `footer` 和 `className`，分别提供页尾内容和页面布局样式。内部已包含标题。                            |
| `SceneHeading`           | [lesson-stage.tsx](lesson-stage.tsx)             | 必传 `kicker`、`title`。用于自行组织页面容器时接入统一标题，不在 `Stage` 中重复添加。                                                        |
| `ChapterCover`           | [chapter-cover.tsx](chapter-cover.tsx)           | 必传 `number`、`title`、`kicker`、`task`；`title` 和 `task` 接受 React 节点，章节号、任务内容由各课传入。                                    |
| `ClassPracticeStamp`     | [practice-templates.tsx](practice-templates.tsx) | 传入两位编号 `number`；课堂练习入口显式传入 `checklist`，显示清单图标和 `CHECKLIST`。当前未传该参数时保留旧版 `PRACTICE` 显示。              |
| `CheckpointTaskTemplate` | [practice-templates.tsx](practice-templates.tsx) | 必传 `number`、`title`、`question`、`instruction`、`tip`、`children`；内部已包含 `Stage`、课后练习标签和印章，右侧工作区由 `children` 提供。 |
| `NotebookPanel`          | [notebook-panel.tsx](notebook-panel.tsx)         | 必传笔记本标题 `title` 和单元格数组 `cells`；可传 `compact`、`executionStart`、`children`。这里只展示代码和输出示例，不执行 Python。         |
| `XiaopaiSpeech`          | [xiaopai-speech.tsx](xiaopai-speech.tsx)         | 必传 `active` 和台词 `children`；可传 `label`、`compact`、`featured`、`animated`。台词没有默认内容。                                         |

### 代码面板

`NotebookCell` 类型由代码面板文件导出。每个单元格包含 `code`，可选 `activeLines`、`output` 和 `outputLabel`。`activeLines` 使用从 **0** 开始的行索引，空行也计入；有输出时默认标注“输出示例”，`executionStart` 默认从 1 开始编号。

`compact` 使用紧凑布局并保留代码原有换行，调用方需要为长代码提供足够宽度。`children` 位于单元格区域之后，可承接相关图示。组件不自带复制按钮；页面提供复制操作时，应与展示代码共用内容来源。

### 练习模板与小派气泡

`CheckpointTaskTemplate` 可接收 `illustration={{ src, alt }}`。传入后，左侧用插图替代问题、指令、行动标签和提示文字；调用方需确保任务要求仍通过插图或其他可见内容完整呈现。

`XiaopaiSpeech` 是客户端组件。`active` 应反映当前页面是否处于展示状态；组件在页面隐藏或 `active=false` 时暂停角色动画，并提供手动暂停按钮。静态角色使用 `animated={false}`，此时不显示动画控制按钮；`compact` 缩小角色和间距，`featured` 放大角色。传入与当前讲解对应的 `label`，供辅助技术识别。

## 导入示例

```tsx
import { Stage } from '@/components/course/ai-with-python/lesson-stage';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';

export function PracticeExample() {
  return (
    <Stage title="打印一条消息" label="CLASS PRACTICE · 课堂练习 01">
      <ClassPracticeStamp number="01" checklist />
      <NotebookPanel
        title="练习.ipynb"
        cells={[{ code: 'print("你好")', activeLines: [0], output: '你好' }]}
      />
    </Stage>
  );
}
```

## 样式接入

- 页面组件在课程播放器提供的有界内容容器内使用；`Stage` 填满父容器，并通过容器尺寸适配字号和间距。
- `Stage`、练习模板、代码面板与小派气泡的 CSS Module 与组件同目录维护。公共样式修改后，按课程设计规范的验收标准覆盖相关页面类型验证。
- 统一标题在 [app/globals.css](../../../app/globals.css) 中由 `.lesson-standard-heading` 和 `--lesson-page-*` 变量维护；标题字号适配公式以该文件为准。`SceneHeading` 已自动接入这些类名。
- `ChapterCover` 使用 `atlas-chapter-brief`、`atlas-chapter-brief-simple` 和 `atlas-brief-number` 全局类，依赖课程播放器的演示容器与全局样式。
- 页面确需调整组件布局时，使用组件参数或下表的稳定属性定位，避免依赖 CSS Module 自动生成的类名片段。具体样式规则以对应组件样式文件为准。

| 稳定属性                                                         | 用途                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `data-lesson-stage`                                              | 教学页容器。                                                       |
| `data-practice-stamp`                                            | 课堂或课后练习印章。                                               |
| `data-notebook-panel`、`data-notebook-compact`                   | 代码面板及其紧凑模式。                                             |
| `data-notebook-part="toolbar"`、`"cells"`、`"input"`、`"prompt"` | 工具栏、单元格区域、输入区域和执行编号。                           |
| `data-lesson-image-button`、`data-lesson-art-button`             | 图片按钮的标记，由调用方设置，沿用教学页对特殊图片按钮的样式排除。 |
