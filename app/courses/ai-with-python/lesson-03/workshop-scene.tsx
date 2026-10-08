/* oxlint-disable next/no-img-element -- Reuse the established classroom demon art. */
'use client';

import { useRef, useState } from 'react';
import {
  Check,
  Copy,
  FileSpreadsheet,
  Paperclip,
  ShieldCheck,
  X,
  Sparkles,
  Search,
} from 'lucide-react';
import { usePageState } from '@/components/course/lesson-state';
import { LessonStage } from './lesson-ui';
import { AI_PROMPT, INTEL_RECORDS } from './practice-content';
import s from './workshop-scene.module.css';

const styles = ['城堡档案', '冒险手账', '夜间指挥台'] as const;

export function WorkshopScene() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [state, update] = usePageState({ fileName: '', style: 0, search: '' });
  const [fileError, setFileError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  );
  const selectedStyle = styles[state.style] ?? styles[0];
  const prompt = AI_PROMPT.replace(/【[^】]+】/, selectedStyle);
  const search = state.search.trim();
  const visibleRecords = INTEL_RECORDS.map((record, portraitIndex) => ({
    ...record,
    portraitIndex,
  })).filter((record) => record.name.includes(search));

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  return (
    <LessonStage
      title="把情报表变成勇士图鉴"
      label="CLASS PRACTICE · 课堂练习 03"
    >
      <div className={s.workspace}>
        <section className={s.instructions} aria-label="给 AI 的创作要求">
          <div className={s.chat}>
            <header className={s.chatHeader}>
              <Sparkles size={24} aria-hidden="true" />
              <h3>AI 对话</h3>
              <span>操作示意</span>
            </header>
            <div className={s.chatBody}>
              <div className={s.promptCard}>
                <div className={s.attachmentArea}>
                  {state.fileName ? (
                    <div className={s.attachment}>
                      <FileSpreadsheet size={28} aria-hidden="true" />
                      <span title={state.fileName}>{state.fileName}</span>
                      <button
                        aria-label="移除 CSV 附件"
                        onClick={() => {
                          update({ fileName: '' });
                          setFileError('');
                          if (fileInput.current) fileInput.current.value = '';
                        }}
                      >
                        <X size={20} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <p className={s.emptyAttachment}>① 选择你的 CSV 文件</p>
                  )}
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".csv,text/csv"
                    hidden
                    aria-label="选择 CSV 文件"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (!file.name.toLowerCase().endsWith('.csv')) {
                        setFileError('请选择 .csv 格式的文件。');
                        event.target.value = '';
                        return;
                      }
                      update({ fileName: file.name });
                      setFileError('');
                    }}
                  />
                  <button
                    className={s.attachButton}
                    onClick={() => fileInput.current?.click()}
                  >
                    <Paperclip size={22} aria-hidden="true" />
                    {state.fileName ? '更换 CSV' : '添加 CSV'}
                  </button>
                </div>
                <fieldset className={s.styles} aria-label="选择图鉴风格">
                  <legend>② 选择图鉴风格</legend>
                  <div>
                    {styles.map((style, index) => (
                      <button
                        key={style}
                        aria-pressed={selectedStyle === style}
                        onClick={() => {
                          update({ style: index });
                          setCopyState('idle');
                        }}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <p className={s.prompt}>{prompt.replace(/\n\n/g, '\n')}</p>
                <div className={s.composerActions}>
                  <span>③ 复制当前风格的提示词</span>
                  <button className={s.copyButton} onClick={copyPrompt}>
                    {copyState === 'copied' ? (
                      <Check size={20} aria-hidden="true" />
                    ) : (
                      <Copy size={20} aria-hidden="true" />
                    )}
                    {copyState === 'copied' ? '已复制' : '复制提示词'}
                  </button>
                </div>
              </div>
              {(fileError || copyState === 'failed') && (
                <output className={s.copyFeedback}>
                  {fileError || '未能复制，请选中上方文字复制。'}
                </output>
              )}
              <p className={s.localNote}>
                本页仅为操作示意；请到 AI 工具上传 CSV，再粘贴提示词发送。
              </p>
            </div>
          </div>
          <p className={s.checklist}>
            <ShieldCheck size={22} aria-hidden="true" />
            <span>核对：三只都在 · 地点、弱点配对正确 · 搜索可用</span>
          </p>
        </section>

        <section className={s.preview} aria-label="勇士图鉴作品示意">
          <header>
            <h3>城堡敌情图鉴</h3>
            <p>作品示意 · 保存时的已知情报</p>
          </header>
          <div className={s.search}>
            <Search size={22} aria-hidden="true" />
            <input
              aria-label="按恶魔名称搜索"
              placeholder="输入恶魔名称搜索"
              value={state.search}
              onChange={(event) => update({ search: event.target.value })}
            />
            {state.search && (
              <button
                aria-label="清除搜索"
                onClick={() => update({ search: '' })}
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className={s.cards}>
            {visibleRecords.map((record) => (
              <article key={record.name} className={s.demonCard}>
                <div className={s.portrait}>
                  <img
                    src="/courses/ai-with-python/lesson-02/assets/defense-demons-ivory.png"
                    alt={record.name}
                    style={{
                      transform: `translateX(-${record.portraitIndex * (100 / 3)}%)`,
                    }}
                  />
                </div>
                <div className={s.record}>
                  <h4>{record.name}</h4>
                  <dl>
                    <div>
                      <dt>地点</dt>
                      <dd>{record.location}</dd>
                    </div>
                    <div>
                      <dt>弱点</dt>
                      <dd>{record.weakness}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
            {visibleRecords.length === 0 && (
              <output className={s.noResults}>
                没有匹配的恶魔。点击右侧 ×，清除搜索再试。
              </output>
            )}
          </div>
        </section>
      </div>
    </LessonStage>
  );
}
