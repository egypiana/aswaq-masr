'use client';

import { usePrices } from '@/app/hooks/usePrices';
import { formatPrice, getDirectionArrow, getDirectionColor } from '@/app/lib/utils';

export default function PriceTicker() {
  const { items, loading } = usePrices();

  if (loading || items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 py-2 overflow-hidden">
        <div className="text-center text-sm text-gray-400">جارٍ تحميل الأسعار...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 py-2 overflow-hidden border-b border-gray-200 dark:border-gray-700">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 mx-4">
            <span className="text-sm">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.nameAr}</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(item.price)}</span>
            <span className={`text-xs ${getDirectionColor(item.direction)}`}>
              {getDirectionArrow(item.direction)} {item.changePercent !== 0 ? `${Math.abs(item.changePercent)}%` : ''}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
