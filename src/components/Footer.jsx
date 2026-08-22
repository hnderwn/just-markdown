export default function Footer({ stats, className, onOpenShortcuts }) {
  return (
    <footer className={`px-4 py-1 text-[10px] border-t flex justify-between items-center font-mono transition-colors duration-300 bg-(--bg-secondary) border-(--border-color) text-(--text-secondary) ${className || ''}`}>
      <div className="flex gap-4">
        <span>Characters: {stats.chars}</span>
        <span>Words: {stats.words}</span>
        <span>Reading: ~{stats.readingTime} min</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenShortcuts}
          className="hover:text-[var(--accent)] font-bold transition-all text-[10px] mr-2 flex items-center gap-1 cursor-pointer bg-transparent border-0 text-[var(--text-secondary)]"
          title="Keyboard Shortcuts"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Shortcuts
        </button>
        <span>v0.3.0 - Modular Architecture</span>
      </div>
    </footer>
  );
}
