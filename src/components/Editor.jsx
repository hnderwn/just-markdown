import { useEffect, useRef } from 'preact/hooks';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { basicSetup } from 'codemirror';

/**
 * Custom Theme CodeMirror yang tersinkronisasi dengan variabel CSS.
 */
const nordTheme = EditorView.theme(
  {
    '&': {
      color: 'var(--text-primary)',
      backgroundColor: 'var(--bg-primary)',
      height: '100%',
    },
    '.cm-content': {
      caretColor: 'var(--accent)',
      fontFamily: "'JetBrains Mono', monospace",
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: 'var(--accent)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: 'var(--selection-bg) !important',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-secondary)',
      borderRight: '1px solid var(--border-color)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'var(--text-primary)',
    },
  },
  { dark: true },
);

/**
 * HighlightStyle kustom untuk menyelaraskan warna token editor dengan variabel CSS.
 */
const nordHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: 'var(--code-comment)', fontStyle: 'italic' },
  { tag: t.variableName, color: 'var(--code-variable)' },
  { tag: [t.string, t.special(t.brace)], color: 'var(--code-string)' },
  { tag: t.number, color: 'var(--code-number)' },
  { tag: t.bool, color: 'var(--code-number)' },
  { tag: t.null, color: 'var(--code-number)' },
  { tag: t.keyword, color: 'var(--code-keyword)' },
  { tag: t.operator, color: 'var(--code-operator)' },
  { tag: [t.className, t.typeName], color: 'var(--code-function)' },
  { tag: [t.function(t.variableName), t.propertyName], color: 'var(--code-function)' },
  { tag: t.punctuation, color: 'var(--code-punctuation)' },
  { tag: t.heading1, fontWeight: 'bold', fontSize: '1.4em', color: 'var(--accent)' },
  { tag: t.heading2, fontWeight: 'bold', fontSize: '1.2em', color: 'var(--accent)' },
  { tag: t.heading3, fontWeight: 'bold', fontSize: '1.1em', color: 'var(--accent)' },
]);

/**
 * Komponen Editor menggunakan CodeMirror 6.
 * @param {Object} props
 * @param {string} props.value - Konten markdown saat ini.
 * @param {Function} props.onChange - Callback saat konten berubah.
 */
export default function Editor({ value, onChange }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    // Inisialisasi editor hanya sekali
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        nordTheme,
        syntaxHighlighting(nordHighlightStyle),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // Update konten jika 'value' berubah dari luar (misal: Clear Editor)
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full overflow-auto border-none focus:outline-none" id="markdown-editor" />;
}
