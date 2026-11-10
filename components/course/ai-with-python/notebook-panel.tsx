import { type ReactNode } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import s from './notebook-panel.module.css';

export type NotebookCell = {
  code: string;
  activeLines?: number[];
  highlightFragments?: Record<string, string>;
  output?: string;
  outputLabel?: string;
};

function PythonLine({ text }: { text: string }) {
  return text
    .split(
      /("[^"\n]*"|'[^'\n]*'|#[^\n]*|\b(?:import|from|for|in|if|else|with|as|print|\d+)\b)/g,
    )
    .map((part, index) => {
      const kind = /^['"]/.test(part)
        ? s.pyString
        : /^(import|from|for|in|if|else|with|as)$/.test(part)
          ? s.pyKeyword
          : part === 'print'
            ? s.pyFunction
            : /^\d+$/.test(part)
              ? s.pyNumber
              : undefined;
      return (
        <span
          className={kind}
          data-python-comment={part.startsWith('#') || undefined}
          key={index}
        >
          {part}
        </span>
      );
    });
}

function HighlightedPythonLine({
  text,
  fragments,
}: {
  text: string;
  fragments: Record<string, string>;
}) {
  const pattern = Object.keys(fragments)
    .filter(Boolean)
    .map((fragment) => fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  if (!pattern) return <PythonLine text={text} />;
  return text.split(new RegExp(`(${pattern})`, 'g')).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className={fragments[part]}>
        {part}
      </mark>
    ) : (
      <PythonLine key={index} text={part} />
    ),
  );
}

export function NotebookPanel({
  title,
  cells,
  executionStart = 1,
  compact = false,
  children,
}: {
  title: string;
  cells: NotebookCell[];
  executionStart?: number;
  compact?: boolean;
  children?: ReactNode;
}) {
  return (
    <section
      className={`${s.notebook} ${compact ? s.compactNotebook : ''}`}
      data-notebook-panel
      data-notebook-compact={compact || undefined}
      aria-label="JupyterLab 代码讲解"
    >
      <div className={s.notebookTab} data-notebook-part="tab">
        <BookOpen size={20} aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div className={s.notebookToolbar} data-notebook-part="toolbar">
        <span>
          Code <ChevronDown size={18} aria-hidden="true" />
        </span>
        <span>Python 3</span>
      </div>
      <div className={s.notebookCells} data-notebook-part="cells">
        {cells.map((cell, index) => (
          <div className={s.notebookCell} key={index}>
            <div className={s.notebookInput} data-notebook-part="input">
              <span
                className={s.cellPrompt}
                data-notebook-part="prompt"
                aria-hidden="true"
              >
                [{cell.output ? index + executionStart : ' '}]:
              </span>
              <pre>
                <code>
                  {cell.code.split('\n').map((line, lineIndex) => (
                    <span
                      key={lineIndex}
                      className={`${s.notebookLine} ${cell.activeLines?.includes(lineIndex) ? s.activeNotebookLine : ''}`}
                    >
                      {cell.highlightFragments ? (
                        <HighlightedPythonLine
                          text={line || ' '}
                          fragments={cell.highlightFragments}
                        />
                      ) : (
                        <PythonLine text={line || ' '} />
                      )}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            {cell.output && (
              <div
                className={`${s.notebookOutput} ${!cell.output.includes('\n') ? s.shortNotebookOutput : ''}`}
              >
                <span className={s.cellOutputLabel}>
                  {cell.outputLabel ?? '输出示例'}
                </span>
                <pre>{cell.output}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
      {children}
    </section>
  );
}
