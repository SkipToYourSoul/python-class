import { Code2, Download } from 'lucide-react';
import type { ReactNode } from 'react';
import s from './code-tool-buttons.module.css';

export function CodeToolGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <fieldset className={s.tools} aria-label={label}>
      {children}
    </fieldset>
  );
}

export function CodeToolButtons({
  downloadUrl,
  referenceLabel,
  onReference,
}: {
  downloadUrl: string;
  referenceLabel: string;
  onReference: () => void;
}) {
  return (
    <CodeToolGroup label="代码工具">
      <a
        href={downloadUrl}
        download
        aria-label="下载练习包"
        data-hint="下载练习包"
      >
        <Download aria-hidden="true" />
      </a>
      <button
        type="button"
        onClick={onReference}
        aria-haspopup="dialog"
        aria-label={referenceLabel}
        data-hint={referenceLabel}
      >
        <Code2 aria-hidden="true" />
      </button>
    </CodeToolGroup>
  );
}
