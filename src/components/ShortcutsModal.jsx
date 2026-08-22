import { useEffect, useRef } from 'preact/hooks';

export default function ShortcutsModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Close modal on Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: [modKey, 'S'], desc: 'Unduh Dokumen Markdown (.md)' },
    { keys: [modKey, 'Alt', 'S'], desc: 'Unduh Hasil Render HTML (.html)' },
    { keys: [modKey, 'Shift', 'C'], desc: 'Salin Kode HTML ke Clipboard' },
    { keys: [modKey, 'F'], desc: 'Buka Panel Pencarian di Editor' },
    { keys: [modKey, 'Shift', 'F'], desc: 'Buka Panel Pencarian di Editor (Alternatif)' },
    { keys: [modKey, 'E'], desc: 'Toggle Mode Zen (Fokus Menulis)' },
    { keys: [modKey, 'B'], desc: 'Toggle Garis Batas Heading (H1, H2, H3)' },
    { keys: ['Esc'], desc: 'Tutup Modal / Batalkan Aksi' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl border border-[var(--border-color)] shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(136,192,208,0.08) 0%, transparent 70%)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[var(--border-color)]">
          <h3 className="text-sm uppercase font-bold tracking-wider text-[var(--accent)] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer text-lg font-bold p-1 rounded transition-colors"
            title="Tutup"
          >
            &times;
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 py-1.5 border-b border-[var(--border-color)]/30 last:border-0">
              <span className="text-xs text-[var(--text-primary)] font-medium opacity-90">{s.desc}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {s.keys.map((key, keyIdx) => (
                  <span key={keyIdx} className="flex items-center gap-1">
                    <kbd
                      className="px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold border border-neutral-300 shadow-sm inline-block"
                      style={{
                        backgroundColor: '#eceff4',
                        color: '#2e3440',
                        boxShadow: '0 1.5px 0 rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      {key}
                    </kbd>
                    {keyIdx < s.keys.length - 1 && <span className="text-[10px] text-[var(--text-secondary)] font-bold">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] hover:border-[var(--accent)] transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
