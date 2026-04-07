'use client';

import { useState } from 'react';
import { PriceUpdate } from '@/app/lib/types';
import { formatPrice } from '@/app/lib/utils';

interface CalculatorProps {
  label: string;
  unit: string;
  items: PriceUpdate[];
}

export default function Calculator({ label, unit, items }: CalculatorProps) {
  const [quantity, setQuantity] = useState<string>('1');
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');

  const selectedItem = items.find((i) => i.id === selectedItemId);
  const numQuantity = parseFloat(quantity) || 0;
  const total = selectedItem ? numQuantity * selectedItem.price : 0;

  return (
    <div className="bg-gradient-to-br from-brand-red/5 to-brand-gold/5 dark:from-brand-red/10 dark:to-brand-gold/10 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">اختر النوع</label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>{item.nameAr}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">الكمية ({unit})</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            step="0.1"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">القيمة التقديرية</label>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-bold text-brand-red">
            {formatPrice(Math.round(total))} جنيه
          </div>
        </div>
      </div>
      {selectedItem && (
        <p className="mt-2 text-xs text-gray-400">
          سعر {selectedItem.nameAr} الحالي: {formatPrice(selectedItem.price)} {selectedItem.unit}
        </p>
      )}
    </div>
  );
}
