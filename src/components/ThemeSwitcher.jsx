import { useRef } from 'preact/hooks';

/**
 * Komponen ThemeSwitcher untuk memilih tema aplikasi.
 * @param {Object} props
 * @param {string} props.theme - Tema saat ini.
 * @param {Function} props.setTheme - Fungsi untuk mengubah tema.
 */
export default function ThemeSwitcher({ theme, setTheme }) {
  const themes = [
    { id: 'dark', label: 'Dark', color: 'bg-neutral-800' },
    { id: 'retro', label: 'Retro', color: 'bg-[#f4ecd8]' },
    { id: 'high-contrast', label: 'Contrast', color: 'bg-black border-white' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-md transition-colors duration-300" style={{ backgroundColor: 'var(--toolbar-bg)' }}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className={`w-4 h-4 rounded-full border transition-all hover:scale-125 ${t.color} ${theme === t.id ? 'scale-110' : 'opacity-50 hover:opacity-100'}`}
          style={{ borderColor: theme === t.id ? 'var(--accent)' : 'var(--border-color)' }}
        />
      ))}
    </div>
  );
}
