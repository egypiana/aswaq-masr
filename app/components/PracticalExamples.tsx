'use client';

import { PracticalExample, PriceUpdate } from '@/app/lib/types';
import { useState } from 'react';
import { formatPrice } from '@/app/lib/utils';

interface PracticalExamplesProps {
  examples: PracticalExample[];
  prices: PriceUpdate[];
}

function ExampleCard({ example, prices }: { example: PracticalExample; prices: PriceUpdate[] }) {
  const [qty, setQty] = useState<string>(String(example.defaultQuantity));
  const relatedPrice = prices.find((p) => p.id === example.relatedItemId);
  const numQty = parseFloat(qty) || 0;
  const result = relatedPrice ? numQty * relatedPrice.price : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{example.title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{example.description}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          min="0"
          step="0.1"
          className="w-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 text-sm text-gray-900 dark:text-white"
        />
        <span className="text-xs text-gray-500">{example.unitLabel}</span>
        <span className="text-xs text-gray-400">=</span>
        <span className="text-sm font-bold text-brand-red">{formatPrice(Math.round(result))} جنيه</span>
      </div>
    </div>
  );
}

export default function PracticalExamples({ examples, prices }: PracticalExamplesProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">أمثلة عملية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example, i) => (
          <ExampleCard key={i} example={example} prices={prices} />
        ))}
      </div>
    </section>
  );
}
