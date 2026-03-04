import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeSwitcher from './components/ThemeSwitcher';
import useLocalStorage from './hooks/useLocalStorage';
import { downloadMarkdown, downloadHTML, copyToClipboard, calculateReadingTime } from './utils/exportUtils';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Komponen utama App JustMarkdown.
 * Mengelola state konten dan layout responsif.
 */
export default function App() {
  // Persistence (Phase 2 & 3)
  const [content, setContent] = useLocalStorage('jm-draft', '# Just Markdown\n\nSelamat datang di Just Markdown!');
  const [theme, setTheme] = useLocalStorage('jm-theme', 'dark');
  const [isZenMode, setIsZenMode] = useState(false);

  const [debouncedContent, setDebouncedContent] = useState(content);
  const [activeTab, setActiveTab] = useState('edit');
  const [copyStatus, setCopyStatus] = useState('Copy HTML');

  // Sinkronisasi atribut data-theme ke elemen root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Implementasi Debounce 300ms sesuai Technical Guardrails di rules.md
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContent(content);
    }, 300);

    return () => clearTimeout(handler);
  }, [content]);

  const handleClear = useCallback(() => {
    if (confirm('Bersihkan semua teks?')) {
      setContent('');
    }
  }, [setContent]);

  const handleDownload = useCallback(() => {
    downloadMarkdown(content);
  }, [content]);

  const handleDownloadHTML = useCallback(() => {
    const rawHTML = marked.parse(content || '', { gfm: true, breaks: true });
    const sanitized = DOMPurify.sanitize(rawHTML);
    downloadHTML(sanitized);
  }, [content]);

  const handleCopyHTML = useCallback(async () => {
    try {
      const rawHTML = marked.parse(content || '');
      const sanitized = DOMPurify.sanitize(rawHTML);
      const success = await copyToClipboard(sanitized);
      if (success) {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy HTML'), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  }, [content]);

  // Statistik (Phase 2)
  const stats = useMemo(
    () => ({
      chars: content.length,
      words: content.trim() ? content.trim().split(/\s+/).length : 0,
      readingTime: calculateReadingTime(content),
    }),
    [content],
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Header / Toolbar */}
      <header className="flex items-center justify-between px-4 py-2 border-b shadow-sm z-10 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--accent)' }}>
            JustMarkdown
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />

          <button
            onClick={() => setIsZenMode(!isZenMode)}
            className={`text-[10px] px-2 py-1 rounded transition border ${isZenMode ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            style={{
              backgroundColor: isZenMode ? 'var(--accent)' : 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: isZenMode ? 'var(--bg-primary)' : 'var(--text-primary)',
            }}
          >
            Zen Mode
          </button>

          {/* Ekspor Desktop */}
          <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-neutral-700 pr-3">
            <button onClick={handleCopyHTML} className="text-[10px] px-2 py-1 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded transition">
              {copyStatus}
            </button>
            <button onClick={handleDownload} className="text-[10px] px-2 py-1 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded transition">
              MD
            </button>
            <button onClick={handleDownloadHTML} className="text-[10px] px-2 py-1 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded transition">
              HTML
            </button>
          </div>

          {/* Mobile Tab Toggle */}
          <div className="flex md:hidden bg-neutral-700 p-1 rounded-lg">
            <button onClick={() => setActiveTab('edit')} className={`px-3 py-1 rounded-md text-sm transition-colors ${activeTab === 'edit' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400'}`}>
              Edit
            </button>
            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1 rounded-md text-sm transition-colors ${activeTab === 'preview' ? 'bg-neutral-600 text-white shadow-sm' : 'text-neutral-400'}`}>
              Preview
            </button>
          </div>

          <button onClick={handleClear} className="text-xs px-3 py-1.5 bg-neutral-700 hover:bg-red-900/40 text-neutral-300 hover:text-red-200 rounded transition duration-200 border border-neutral-600 hover:border-red-900/50">
            Clear
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Pane */}
        <div className={`h-full border-r border-neutral-800 transition-all duration-300 ease-in-out ${activeTab === 'edit' ? 'flex' : 'hidden'} ${isZenMode ? 'w-full px-[5%] sm:px-[15%] lg:px-[25%] bg-primary' : 'md:w-1/2 flex'}`}>
          <Editor value={content} onChange={setContent} />
        </div>

        {/* Preview Pane */}
        {!isZenMode && (
          <div className={`h-full transition-all duration-300 ease-in-out ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex md:w-1/2`}>
            <Preview content={debouncedContent} />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer
        className="px-4 py-1 text-[10px] border-t flex justify-between items-center font-mono transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
      >
        <div className="flex gap-4">
          <span>Characters: {stats.chars}</span>
          <span>Words: {stats.words}</span>
          <span>Reading: ~{stats.readingTime} min</span>
        </div>
        <div>v0.2.0 - Stability & Utilities</div>
      </footer>
    </div>
  );
}
