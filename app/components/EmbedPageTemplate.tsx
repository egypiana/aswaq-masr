'use client';

import { CategoryConfig } from '@/app/lib/types';
import { usePrices } from '@/app/hooks/usePrices';
import { formatTime } from '@/app/lib/utils';
import PriceCard from './PriceCard';

interface EmbedPageTemplateProps {
  config: CategoryConfig;
}

export default function EmbedPageTemplate({ config }: EmbedPageTemplateProps) {
  const { items, loading, lastUpdated, changedIds } = usePrices(config.slug);

  return (
    <div className="p-4 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {config.icon} {config.h1}
        </h2>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 bg-up rounded-full animate-pulse-dot"></span>
            <span>{formatTime(new Date(lastUpdated))}</span>
          </div>
        )}
      </div>

      {/* Price Cards */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: config.items.length }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <PriceCard
              key={item.id}
              item={item}
              isFlashing={changedIds.has(item.id)}
            />
          ))}
        </div>
      )}

      {/* Watermark */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-center">
        <a
          href="https://aswaqmasr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-brand-red transition-colors"
        >
          مصدر: أسعار وأسواق
        </a>
      </div>
    </div>
  );
}
