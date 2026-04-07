'use client';

import { useState } from 'react';
import { FAQ as FAQType } from '@/app/lib/types';

interface FAQProps {
  faqs: FAQType[];
}

function FAQItem({ faq }: { faq: FAQType }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-right bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.question}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 mr-2 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-200 ease-in-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faqs }: FAQProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">الأسئلة الشائعة</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>
    </section>
  );
}
