import { useMemo, useEffect } from 'preact/hooks';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Prism from 'prismjs';
// Styling Prism sekarang dikelola via index.css menggunakan variabel CSS
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

/**
 * Style object dipisah agar mudah di-maintain dan tidak
 * membanjiri JSX. Pendekatan ini juga menghindari konflik
 * antara Tailwind utility class dan inline style.
 */
const previewStyle = {
  // Base color — satu sumber kebenaran via CSS var
  backgroundColor: 'var(--bg-preview, #0d1117)',

  // Layer 1: ambient glow sangat halus di pojok kiri atas
  // Layer 2: noise texture via SVG data URI
  backgroundImage: [`radial-gradient(ellipse 60% 40% at 15% 10%, rgba(99,102,241,0.045) 0%, transparent 70%)`],
};

/**
 * Komponen Preview untuk merender markdown menjadi HTML yang aman.
 * @param {Object} props
 * @param {string} props.content - String markdown mentah yang akan dirender.
 */
export default function Preview({ content }) {
  const sanitizedHTML = useMemo(() => {
    try {
      const rawHTML = marked.parse(content || '', {
        gfm: true,
        breaks: true,
      });
      return DOMPurify.sanitize(rawHTML);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return '<p class="text-red-500">Error rendering markdown</p>';
    }
  }, [content]);

  useEffect(() => {
    Prism.highlightAll();
  }, [sanitizedHTML]);

  return (
    <div
      id="markdown-preview"
      className="prose prose-sm sm:prose lg:prose-lg prose-invert max-w-none h-full w-full overflow-auto p-6 border-none transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-preview)', backgroundImage: previewStyle.backgroundImage }}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
}
