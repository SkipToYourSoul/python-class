/* oxlint-disable next/no-img-element -- Supplied application screenshots. */
'use client';

import { AnacondaScene } from './anaconda-scene';
import { EditorTransitionScene } from './editor-transition-scene';
import { JupyterInterfaceScene } from './jupyter-interface-scene';
import { NotebookCreateScene } from './notebook-create-scene';
import { NotebookCodeScene } from './notebook-code-scene';
import { NotebookRunScene } from './notebook-run-scene';
import { NotebookSaveScene } from './notebook-save-scene';

import { NotebookPracticeScene } from './notebook-practice-scene';

export function ToolScene({ id }: { id: string }) {
  switch (id) {
    case 'chapter-2-anaconda':
      return <AnacondaScene />;
    case 'chapter-2-editor-transition':
      return <EditorTransitionScene />;
    case 'chapter-2-jupyter-interface':
      return <JupyterInterfaceScene />;
    case 'chapter-2-notebook-create':
      return <NotebookCreateScene />;
    case 'chapter-2-notebook-code':
      return <NotebookCodeScene />;
    case 'chapter-2-notebook-run':
      return <NotebookRunScene />;
    case 'chapter-2-notebook-save':
      return <NotebookSaveScene />;
    case 'chapter-2-practice':
      return <NotebookPracticeScene />;
    default:
      return null;
  }
}
