import { useState, useEffect } from 'preact/hooks';

/**
 * Hook untuk menyimpan dan memuat state dari localStorage secara otomatis.
 * @param {string} key - Kunci unik untuk penyimpanan di localStorage.
 * @param {any} initialValue - Nilai awal jika data belum ada di localStorage.
 * @returns {[any, Function]} - State saat ini dan fungsi pengubahnya.
 */
export default function useLocalStorage(key, initialValue) {
  // Ambil nilai dari localStorage saat inisialisasi
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(`Gagal memuat localStorage untuk kunci "${key}":`, error);
    }
    return initialValue;
  });

  // Simpan nilai ke localStorage setiap kali 'value' berubah
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Gagal menyimpan ke localStorage untuk kunci "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
