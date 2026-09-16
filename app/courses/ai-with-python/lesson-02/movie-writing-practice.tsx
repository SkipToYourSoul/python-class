'use client';

import { type ReactNode } from 'react';
import { ClassPracticeStamp, Stage } from '../lesson-01/lesson-ui';
import { XiaopaiSpeech } from '../lesson-01/xiaopai-speech';
import { movieUrl } from './movie-content';
import { usePageState } from './lesson-state';
import { NotebookPanel } from './notebook-panels';
import s from './movie-writing-practice.module.css';

export const moviePracticeCells = [
  'import requests\n\nfrom bs4 import BeautifulSoup',
  `url = "${movieUrl}"\nheaders = {"User-Agent": "ClassroomStudy/1.0"}\nres = requests.get(url, headers=headers, timeout=10)\nres.raise_for_status()\nres.encoding = "utf-8"\nhtml = res.text`,
  'soup = BeautifulSoup(html, "html.parser")\nfor item in soup.find_all("div", class_="item"):\n    title = item.find(class_="title")\n    if title is not None:\n        print(title.get_text(strip=True))',
];

const completionChecks = [
  '依次运行三个单元格',
  '输出中有电影标题',
  '每部电影单独一行',
];

export function MovieWritingPractice({ dialogs }: { dialogs?: ReactNode }) {
  const [state, setState] = usePageState({ checked: [false, false, false] });

  return (
    <Stage
      title="跟写代码：打印电影标题"
      label="CLASS PRACTICE · 课堂练习 03"
      footer={
        <div className={s.footer}>
          <p>若没有输出，先核对收到的 HTML 是否为电影榜单。</p>
          <div className={s.dialogs}>{dialogs}</div>
        </div>
      }
    >
      <div className={s.workspace}>
        <NotebookPanel
          compact
          title="勇士电影清单.ipynb"
          cells={moviePracticeCells.map((code) => ({
            code: code.replace(
              'requests.get(url, headers=headers, timeout=10)',
              'requests.get(url, headers=headers,\n                   timeout=10)',
            ),
          }))}
        />
        <div className={s.brief}>
          <div className={s.mission}>
            <ClassPracticeStamp number="03" checklist />
            <div>
              <h3>给勇士一份电影清单</h3>
              <p>照着左侧代码跟写，取回网页并打印电影标题。</p>
            </div>
          </div>
          <p className={s.order}>
            新建笔记本，依次添加三个 Code 单元格。每格写完按 Shift + Enter。
          </p>
          <div className={s.guide}>
            <XiaopaiSpeech active compact label="小派讲解电影标题练习">
              每找到一张电影卡片，就取出<strong>标题</strong>，打印一行片名！
            </XiaopaiSpeech>
          </div>
          <fieldset className={s.checks} aria-label="课堂练习 03 完成自查">
            {completionChecks.map((text, index) => (
              <label key={text}>
                <input
                  type="checkbox"
                  checked={state.checked[index]}
                  onChange={() =>
                    setState({
                      checked: state.checked.map((checked, checkIndex) =>
                        checkIndex === index ? !checked : checked,
                      ),
                    })
                  }
                />
                {text}
              </label>
            ))}
          </fieldset>
        </div>
      </div>
    </Stage>
  );
}
