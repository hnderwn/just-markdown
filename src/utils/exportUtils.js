/**
 * Utilitas untuk mengekspor konten markdown.
 */

/**
 * Mengunduh string sebagai file .md.
 * @param {string} content - Konten markdown.
 * @param {string} filename - Nama file (default: document.md).
 */
export const downloadMarkdown = (content, filename = 'just-markdown.md') => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Mengunduh konten sebagai file HTML mandiri.
 * @param {string} htmlContent - Konten HTML hasil render.
 * @param {string} filename - Nama file.
 */
export const downloadHTML = (htmlContent, filename = 'just-markdown.html') => {
  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JustMarkdown Export</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; line-height: 1.5; max-width: 800px; margin: 0 auto; background: #fff; color: #333; }
        pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
        code { font-family: monospace; background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
        img { max-width: 100%; height: auto; }
        blockquote { border-left: 4px solid #ddd; padding-left: 1rem; color: #666; font-style: italic; }
        table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="markdown-body">
        ${htmlContent}
    </div>
</body>
</html>`;
  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Menyalin string ke clipboard.
 * @param {string} text - Teks yang akan disalin.
 * @returns {Promise<boolean>} - Status keberhasilan.
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Gagal menyalin ke clipboard:', err);
    return false;
  }
};

/**
 * Menghitung estimasi waktu baca (assuming 200 wpm).
 * @param {string} text - Teks yang dihitung.
 * @returns {number} - Menit (minimal 1).
 */
export const calculateReadingTime = (text) => {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.ceil(words / 200) || 1;
};
