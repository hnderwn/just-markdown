/**
 * ThemeSwitcher: Sederhana, stabil, dan responsif.
 * Menampilkan pilihan tema dalam bentuk kotak kecil yang selalu terlihat.
 */
export default function ThemeSwitcher({ theme: currentTheme, setTheme }) {
  const themes = [
    { id: 'dark', label: 'Dark', color: '#88c0d0' },
    { id: 'light', label: 'Light', color: '#5e81ac' },
    { id: 'dracula', label: 'Dracula', color: '#ff79c6' },
    { id: 'forest', label: 'Forest', color: '#81c784' },
    { id: 'retro', label: 'Retro', color: '#92400e' },
    { id: 'high-contrast', label: 'Contrast', color: '#ffffff' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-md border border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {themes.map((t) => {
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className={`w-5 h-5 rounded-[4px] border cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 flex items-center justify-center ${
              isActive ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] opacity-100' : 'border-[var(--border-color)] opacity-40 hover:opacity-100 hover:border-[var(--text-secondary)]'
            }`}
            style={{ backgroundColor: t.color }}
          >
            {isActive && <div className="w-1.5 min-w-[4px] h-1.5 rounded-sm bg-[var(--bg-primary)] shadow-sm" />}
          </button>
        );
      })}
    </div>
  );
}
