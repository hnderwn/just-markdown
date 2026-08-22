import ThemeSwitcher from './ThemeSwitcher';
import { useRef, useEffect } from 'preact/hooks';

export default function Header({
  className,
  theme,
  setTheme,
  isZenMode,
  setIsZenMode,
  activeTab,
  setActiveTab,
  showHeadingBorder,
  setShowHeadingBorder,
  spacing,
  setSpacing,
  copyStatus,
  handleCopyHTML,
  handleDownload,
  handleDownloadHTML,
  handleClear,
  showMobileMenu,
  setShowMobileMenu,
  fileName,
  setFileName,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showMobileMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu, setShowMobileMenu]);

  const btnStyle = (isActive, size = 'normal') => ({
    backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
    borderColor: 'var(--border-color)',
    color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
    cursor: 'pointer',
    padding: size === 'large' ? '0.5rem 1rem' : '0.25rem 0.6rem',
    fontSize: size === 'large' ? '12px' : '10px',
  });

  return (
    <header className={`flex items-center justify-between px-4 py-2 border-b shadow-md z-30 transition-colors duration-300 bg-(--bg-secondary) border-(--border-color) ${className || ''}`}>
      <div className="flex items-center gap-2">
        <span className="hidden sm:block text-xl font-bold tracking-tight text-(--accent)">JustMarkdown</span>
        <img src="/src/assets/logo.svg" alt="Logo" className="block sm:hidden w-8 h-8 object-contain" />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
          className="md:hidden px-5 py-2.5 rounded-xl transition border border-(--border-color) uppercase font-bold tracking-wider active:scale-95"
          style={btnStyle(true, 'large')}
        >
          {activeTab === 'edit' ? 'PREVIEW' : 'EDIT'}
        </button>

        <ThemeSwitcher theme={theme} setTheme={setTheme} />

        <div className="hidden md:flex items-center gap-2">
          {/* Filename Input */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-(--text-secondary)">File:</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Filename..."
              className="px-2.5 py-1 text-[12px] bg-(--bg-primary) border border-(--border-color) rounded-md text-(--text-primary) w-32 focus:outline-none focus:border-(--accent) focus:ring-1 focus:ring-(--accent) transition-all font-mono"
              title="Nama file ekspor (tanpa ekstensi)"
            />
          </div>

          {/* Spacing Selector (Heading & HR only) */}
          <div className="flex bg-(--bg-primary) rounded-lg p-0.5 border border-(--border-color) mr-2">
            {[
              { label: 'Tight', val: 'tight' },
              { label: 'Normal', val: 'normal' },
              { label: 'Loose', val: 'loose' },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => setSpacing(s.val)}
                className={`px-2 py-1.5 text-[12px] rounded-md transition-all cursor-pointer ${spacing === s.val ? 'bg-(--accent) text-(--bg-primary)' : 'hover:bg-white/10 text-(--text-secondary)'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button onClick={() => setIsZenMode(!isZenMode)} className="rounded-lg transition border active:scale-95 shadow-sm" style={btnStyle(isZenMode, 'large')} title="Toggle Mode Zen (Ctrl + E)">
            Zen Mode
          </button>
          <button onClick={() => setShowHeadingBorder(!showHeadingBorder)} className="rounded-lg transition border active:scale-95 shadow-sm" style={btnStyle(showHeadingBorder, 'large')} title="Toggle Garis Batas Heading (Ctrl + B)">
            Border
          </button>
          <button onClick={handleCopyHTML} className="rounded-lg transition border active:scale-95 shadow-sm" style={btnStyle(false, 'large')} title="Salin HTML ke Clipboard (Ctrl + Shift + C)">
            {copyStatus}
          </button>
          <div className="h-4 w-px bg-(--border-color) mx-1" />
          <button onClick={handleDownload} className="px-3 py-2 rounded-lg transition border active:scale-95 shadow-sm" style={btnStyle(false, 'large')} title="Unduh File Markdown (Ctrl + S)">
            MD
          </button>
          <button onClick={handleDownloadHTML} className="px-3 py-2 rounded-lg transition border active:scale-95 shadow-sm" style={btnStyle(false, 'large')} title="Unduh File HTML (Ctrl + Alt + S)">
            HTML
          </button>
          <button onClick={handleClear} className="rounded-lg transition border border-red-900/30 hover:bg-red-900/40 text-red-100 cursor-pointer px-4 py-2 text-[12px] active:scale-95 shadow-sm ml-2 bg-red-900/40" title="Bersihkan Editor">
            Clear
          </button>
        </div>

        <div ref={menuRef} className="md:hidden relative">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-3 rounded-xl transition-all border border-(--border-color) cursor-pointer active:scale-90 shadow-lg bg-(--bg-secondary)">
            <svg className="w-6 h-6 text-(--accent)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {showMobileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border border-(--border-color) overflow-hidden z-100 animate-in slide-in-from-top-2 duration-200 bg-(--bg-secondary)">
              {[
                { label: copyStatus, onClick: handleCopyHTML },
                { label: 'Download MD', onClick: handleDownload },
                { label: 'Download HTML', onClick: handleDownloadHTML },
                { label: `Border: ${showHeadingBorder ? 'ON' : 'OFF'}`, onClick: () => setShowHeadingBorder(!showHeadingBorder) },
                { label: 'Clear All', onClick: handleClear, className: 'text-red-400' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-xs hover:bg-white/5 transition-colors border-b last:border-0 border-(--border-color) cursor-pointer ${item.className || ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
