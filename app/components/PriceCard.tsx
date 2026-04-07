'use client';

import { PriceUpdate } from '@/app/lib/types';
import { formatPrice, getDirectionArrow, getDirectionColor, getFlashClass } from '@/app/lib/utils';

interface PriceCardProps {
  item: PriceUpdate;
  isFlashing: boolean;
}

export default function PriceCard({ item, isFlashing }: PriceCardProps) {
  const flashClass = isFlashing ? getFlashClass(item.direction) : '';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ${flashClass}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{item.icon}</span>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.nameAr}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          item.direction === 'up'
            ? 'bg-up/10 text-up'
            : item.direction === 'down'
            ? 'bg-down/10 text-down'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
        }`}>
          {getDirectionArrow(item.direction)} {item.changePercent !== 0 ? `${Math.abs(item.changePercent)}%` : '—'}
        </span>
      </div>

      <div className="mt-3">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatPrice(item.price)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">{item.unit}</span>
      </div>

      {item.change !== 0 && (
        <div className={`mt-1 text-xs ${getDirectionColor(item.direction)}`}>
          {item.direction === 'up' ? '+' : ''}{formatPrice(item.change)} {item.unit}
        </div>
      )}
    </div>
  );
}
