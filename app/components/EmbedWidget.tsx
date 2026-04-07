'use client';

import { useState } from 'react';
import { CategorySlug } from '@/app/lib/types';

interface EmbedWidgetProps {
  category: CategorySlug;
  title: string;
}

const SITE_URL = 'https://aswaqmasr.com';

export default function EmbedWidget({ category, title }: EmbedWidgetProps) {
  const [copied, setCopied] = useState(false);

  const embedUrl = `${SITE_URL}/${category}/embed`;
  const iframeCode = `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="420"\n  frameborder="0"\n  style="border:1px solid #e5e7eb;border-radius:12px"\n  title="${title}"\n  loading="lazy">\n</iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = iframeCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
          {'</>'} أضف الأسعار لموقعك
        </span>
        <button
          onClick={handleCopy}
          className={`text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            copied
              ? 'bg-up/10 text-up'
              : 'bg-brand-red text-white hover:bg-brand-red/90'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              تم النسخ ✓
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              نسخ الكود
            </>
          )}
        </button>
      </div>

      <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-3 overflow-x-auto text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed" dir="ltr">
        {iframeCode}
      </pre>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        انسخ الكود أعلاه والصقه في أي مكان في موقعك لعرض الأسعار لحظياً — مجاناً بالكامل
      </p>
    </div>
  );
}
