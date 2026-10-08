'use client';
import { useContext } from 'react';
import { LessonState, usePageState } from '@/components/course/lesson-state';
import { ClassPracticeStamp } from '@/components/course/ai-with-python/practice-templates';
import { NotebookPanel } from '@/components/course/ai-with-python/notebook-panel';
import { LessonStage, PracticeTools } from './lesson-ui';
import { MOVIE_COMPLETE_CODE, MOVIE_SAMPLES } from './practice-content';
import s from './lesson.module.css';
import m from './movie-practice.module.css';
import { ReportPracticeEntry, ReportPractice } from './report-practice';
import { CsvPracticeEntry } from './csv-scenes';
import { MovieSourceImage, MovieFieldZoom, movieFields } from './movie-source';

export function PracticeScene({ id }: { id: string }) {
  if (id === 'l3-practice-01') return <MoviePracticeEntry />;
  if (id === 'l3-practice-02') return <ReportPracticeEntry />;
  if (id === 'l3-practice-03') return <CsvPracticeEntry />;
  if (id.includes('practice-01')) return <MoviePractice />;
  if (id.includes('practice-02')) return <ReportPractice />;
  return null;
}
function MoviePracticeEntry() {
  const { navigate } = useContext(LessonState);
  return (
    <LessonStage
      title="这次，获取更多电影信息"
      label="CLASS PRACTICE · 课堂练习 01"
      footer={
        <div className={m.entryFooter}>
          <button
            className={s.primary}
            onClick={() => navigate('l3-practice-01-read')}
          >
            开始练习 →
          </button>
        </div>
      }
    >
      <div className={m.entry}>
        <aside className={m.mission}>
          <ClassPracticeStamp number="01" checklist />
          <p>
            上节课已获取
            <br />
            <strong className={m.known}>片名 + 评分</strong>
          </p>
          <p>
            这次再加上
            <br />
            <strong className={m.added}>导演 + 演员</strong>
          </p>
          <p>
            读取保存的网页，
            <br />
            整理这 4 项资料。
          </p>
          <small>
            首次使用先运行：
            <br />
            <code>%pip install beautifulsoup4</code>
          </small>
        </aside>
        <div className={m.entryPicture}>
          <MovieSourceImage />
          <p>从详情页找到导演和演员，再用 Python 取出来。</p>
        </div>
      </div>
    </LessonStage>
  );
}
function MoviePractice() {
  const [state, update] = usePageState({ field: 0 });
  const movie = MOVIE_SAMPLES[0];
  const field = movieFields[state.field];
  return (
    <LessonStage
      title="一口气读出电影资料"
      label="CLASS PRACTICE · 课堂练习 01"
    >
      <div className={m.workspace}>
        <div className={m.code}>
          <NotebookPanel
            compact
            title="第三课练习.ipynb · 完整代码"
            cells={[
              { code: MOVIE_COMPLETE_CODE, activeLines: [...field.lines] },
            ]}
          />
        </div>
        <aside className={m.explanation}>
          <fieldset className={m.fieldTabs} aria-label="代码与网页对应">
            {movieFields.map((item, index) => (
              <button
                key={item.label}
                aria-pressed={state.field === index}
                onClick={() => update({ field: index })}
              >
                {item.label}
              </button>
            ))}
          </fieldset>
          <MovieSourceImage field={state.field} />
          <div className={m.fieldFocus} aria-live="polite">
            <p>高亮代码 → 网页中的{field.label}</p>
            <MovieFieldZoom field={state.field} />
            <strong>{field.value}</strong>
          </div>
          <p>
            跟写全部代码并运行，核对 4 项结果。
            <br />
            练习文件中的演员节选前两位。
          </p>
          <PracticeTools
            code={MOVIE_COMPLETE_CODE}
            output={movie.output}
            note="在练习文件夹打开 Notebook。先安装 beautifulsoup4，再亲手输入完整代码并运行。输出为课堂电影样本的核对结果。"
          />
        </aside>
      </div>
    </LessonStage>
  );
}
