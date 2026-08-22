import { useState, useEffect, useRef, useCallback, useMemo } from 'preact/hooks';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Header from './components/Header';
import Footer from './components/Footer';
import ShortcutsModal from './components/ShortcutsModal';
import useLocalStorage from './hooks/useLocalStorage';
import { downloadMarkdown, downloadHTML, copyToClipboard, calculateReadingTime } from './utils/exportUtils';
import { renderMarkdown } from './utils/markdownParser';
import DOMPurify from 'dompurify';
import boilerplate from '../boilerplate.md?raw';

/**
 * Komponen utama App JustMarkdown.
 * Mengelola state konten dan layout responsif.
 */
export default function App() {
  // Persistence (Phase 2 & 3)
  const [content, setContent] = useLocalStorage('jm-draft', boilerplate);
  const [theme, setTheme] = useLocalStorage('jm-theme', 'dark');
  const [isZenMode, setIsZenMode] = useState(false);
  const [editorWidth, setEditorWidth] = useLocalStorage('jm-editor-width', 50);
  const [showHeadingBorder, setShowHeadingBorder] = useLocalStorage('jm-heading-border', false);
  const [spacing, setSpacing] = useLocalStorage('jm-spacing', 'loose');
  const [fileName, setFileName] = useLocalStorage('jm-filename', 'just-markdown');

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [debouncedContent, setDebouncedContent] = useState(content);
  const [activeTab, setActiveTab] = useState('edit');
  const [copyStatus, setCopyStatus] = useState('Copy HTML');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isResizing = useRef(false);
  const editorScrollDOM = useRef(null);
  const previewScrollDOM = useRef(null);
  const isSyncing = useRef(false);
  const activeScroller = useRef(null);
  const scrollTimeout = useRef(null);

  // Logic Resizing
  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    if (!isResizing.current) return;
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback(
    (e) => {
      if (!isResizing.current) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 15 && newWidth < 85) {
        setEditorWidth(newWidth);
      }
    },
    [setEditorWidth],
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  // Force Edit tab when entering Zen Mode
  useEffect(() => {
    if (isZenMode) setActiveTab('edit');
  }, [isZenMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Implementasi Debounce 300ms
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
    downloadMarkdown(content, `${fileName}.md`);
  }, [content, fileName]);

  const handleDownloadHTML = useCallback(() => {
    const rawHTML = renderMarkdown(content || '');
    const sanitized = DOMPurify.sanitize(rawHTML);
    downloadHTML(sanitized, `${fileName}.html`);
  }, [content, fileName]);

  const handleCopyHTML = useCallback(async () => {
    try {
      const rawHTML = renderMarkdown(content || '');
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

  // Listener keyboard shortcut global
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (modKey) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (e.altKey) {
            handleDownloadHTML();
          } else {
            handleDownload();
          }
        } else if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          setIsZenMode((prev) => !prev);
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setShowHeadingBorder((prev) => !prev);
        } else if (e.key.toLowerCase() === 'c' && e.shiftKey) {
          e.preventDefault();
          handleCopyHTML();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDownload, handleDownloadHTML, handleCopyHTML]);

  const stats = useMemo(
    () => ({
      chars: content.length,
      words: content.trim() ? content.trim().split(/\s+/).length : 0,
      readingTime: calculateReadingTime(content),
    }),
    [content],
  );

  // Sync Scroll Logic (Optimized for smoothness & smooth behavior)
  const syncScroll = useCallback(
    (source, target) => {
      if (!source || !target || isZenMode) return;

      // Cegah loop feedback dengan mencatat scroller aktif
      if (activeScroller.current && activeScroller.current !== source) return;

      activeScroller.current = source;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        activeScroller.current = null;
      }, 250); // 250ms kelonggaran animasi smooth scroll native

      const scrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
      const targetPos = scrollRatio * (target.scrollHeight - target.clientHeight);

      // Scroll target dengan perilaku mulus (smooth behavior)
      if (Math.abs(target.scrollTop - targetPos) > 1) {
        target.scrollTo({
          top: targetPos,
          behavior: 'smooth',
        });
      }
    },
    [isZenMode],
  );

  const handleEditorScroll = useCallback(
    (dom) => {
      if (!isZenMode) syncScroll(dom, previewScrollDOM.current);
    },
    [isZenMode, syncScroll],
  );

  const handlePreviewScroll = useCallback(
    (dom) => {
      if (!isZenMode) syncScroll(dom, editorScrollDOM.current);
    },
    [isZenMode, syncScroll],
  );

  return (
    <div className="flex flex-col h-full overflow-hidden transition-colors duration-300 font-sans" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header
        className="shrink-0 overflow-hidden"
        theme={theme}
        setTheme={setTheme}
        isZenMode={isZenMode}
        setIsZenMode={setIsZenMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showHeadingBorder={showHeadingBorder}
        setShowHeadingBorder={setShowHeadingBorder}
        spacing={spacing}
        setSpacing={setSpacing}
        copyStatus={copyStatus}
        handleCopyHTML={handleCopyHTML}
        handleDownload={handleDownload}
        handleDownloadHTML={handleDownloadHTML}
        handleClear={handleClear}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        fileName={fileName}
        setFileName={setFileName}
      />

      {/* Main Area */}
      <main className="flex-1 flex overflow-hidden relative" style={{ '--editor-width': isZenMode ? '100%' : `${editorWidth}%` }}>
        <div
          className={`h-full border-r border-neutral-800 transition-all duration-75 ease-out editor-pane ${activeTab === 'edit' ? 'flex' : 'hidden'} ${isZenMode ? 'w-full px-[5%] sm:px-[15%] lg:px-[25%]' : 'md:flex'}`}
          style={{ backgroundColor: isZenMode ? 'var(--bg-primary)' : 'transparent' }}
        >
          <Editor value={content} onChange={setContent} onEditorMount={(dom) => (editorScrollDOM.current = dom)} onScroll={handleEditorScroll} />
        </div>

        {!isZenMode && <div className="hidden md:block resizer-h" onMouseDown={startResizing} />}

        {!isZenMode && (
          <div className={`h-full transition-all duration-75 ease-out preview-pane ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex overflow-hidden ${showHeadingBorder ? 'show-heading-border' : ''}`} data-spacing={spacing}>
            <Preview content={debouncedContent} onPreviewMount={(dom) => (previewScrollDOM.current = dom)} onScroll={handlePreviewScroll} />
          </div>
        )}
      </main>

      <Footer stats={stats} className="shrink-0" onOpenShortcuts={() => setIsShortcutsOpen(true)} />

      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}
