'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CurrencyRate, BankRate } from '@/app/api/currencies/route';

export type BankCurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SAR';

interface Props {
  currency: BankCurrencyCode;
}

interface CurrencyData {
  rates: CurrencyRate[];
  banks: BankRate[];
  lastUpdated: string;
}

const CURRENCY_META: Record<BankCurrencyCode, { nameAr: string; flag: string; buyKey: keyof BankRate; sellKey: keyof BankRate }> = {
  USD: { nameAr: 'الدولار الأمريكي', flag: '🇺🇸', buyKey: 'usdBuy', sellKey: 'usdSell' },
  EUR: { nameAr: 'اليورو',           flag: '🇪🇺', buyKey: 'eurBuy', sellKey: 'eurSell' },
  GBP: { nameAr: 'الجنيه الإسترليني', flag: '🇬🇧', buyKey: 'gbpBuy', sellKey: 'gbpSell' },
  SAR: { nameAr: 'الريال السعودي',   flag: '🇸🇦', buyKey: 'sarBuy', sellKey: 'sarSell' },
};

function Arrow({ dir }: { dir: 'up' | 'down' | 'stable' }) {
  if (dir === 'up')   return <span className="text-green-600 text-xs font-bold">▲</span>;
  if (dir === 'down') return <span className="text-red-500 text-xs font-bold">▼</span>;
  return <span className="text-gray-400 text-xs">—</span>;
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

export default function BankRatesTable({ currency }: Props) {
  const meta = CURRENCY_META[currency];
  const [data, setData]       = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/currencies');
      if (!res.ok) return;
      setData(await res.json());
      setLoading(false);
    } catch { /* silent */ }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5 * 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  const marketRate = data?.rates.find(r => r.code === currency);
  const dir = marketRate?.direction ?? 'stable';
  const pct = marketRate?.changePercent ?? 0;

  const updatedTime = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : null;
  const updatedDate = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-l from-navy to-navy/90 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              أسعار صرف {meta.flag} {meta.nameAr} الآن مقابل الجنيه في كل البنوك
            </h2>
            {updatedTime && (
              <p className="text-gray-300 text-xs mt-1">
                هذه الأسعار بتوقيت {updatedTime}. اضغط على <strong>تحديث</strong> لعرض آخر الأسعار.
              </p>
            )}
            <p className="text-gray-400 text-xs mt-0.5 italic">
              *التغيرات محسوبة على أساس سعر إغلاق اليوم السابق.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            {updatedTime && (
              <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                <LiveDot />
                <span>{updatedTime}</span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
            >
              <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              تحديث
            </button>
          </div>
        </div>

        {/* Mid rate strip */}
        {marketRate && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <span className="text-gray-300">
              السعر الوسيط:
              <span className="text-white font-bold mr-1">{marketRate.rate.toFixed(2)} جنيه</span>
            </span>
            <span className="text-gray-300">
              شراء:
              <span className="text-blue-300 font-bold mr-1">{marketRate.buyRate.toFixed(2)}</span>
            </span>
            <span className="text-gray-300">
              بيع:
              <span className="text-orange-300 font-bold mr-1">{marketRate.sellRate.toFixed(2)}</span>
            </span>
            {pct !== 0 && (
              <span className={`font-semibold ${dir === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {dir === 'up' ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 text-xs border-b border-gray-200 dark:border-gray-600">
                <th className="text-right px-4 py-3 font-semibold">البنك</th>
                <th className="text-center px-4 py-3 font-semibold">سعر الشراء</th>
                <th className="text-center px-4 py-3 font-semibold">سعر البيع</th>
                <th className="text-center px-3 py-3 font-semibold hidden sm:table-cell">آخر تحديث</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.banks.map((b, i) => {
                const buy  = b[meta.buyKey] as number;
                const sell = b[meta.sellKey] as number;
                return (
                  <tr
                    key={b.shortName}
                    className={`hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors
                      ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/40 dark:bg-gray-800/60'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{b.nameAr}</div>
                      <div className="text-xs text-gray-400 font-mono">{b.shortName}</div>
                    </td>
                    {/* Buy */}
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`flex w-7 h-7 items-center justify-center rounded
                          ${dir === 'up' ? 'bg-green-100' : dir === 'down' ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <Arrow dir={dir} />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{buy.toFixed(2)}</span>
                          {pct !== 0 && (
                            <span className={`text-xs tabular-nums font-medium
                              ${dir === 'up' ? 'text-green-600' : dir === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                              {Math.abs(pct).toFixed(3)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Sell */}
                    <td className="text-center px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <div className={`flex w-7 h-7 items-center justify-center rounded
                          ${dir === 'up' ? 'bg-green-100' : dir === 'down' ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <Arrow dir={dir} />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-gray-900 dark:text-white tabular-nums">{sell.toFixed(2)}</span>
                          {pct !== 0 && (
                            <span className={`text-xs tabular-nums font-medium
                              ${dir === 'up' ? 'text-green-600' : dir === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                              {Math.abs(pct).toFixed(3)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Last updated */}
                    <td className="text-center px-3 py-3 hidden sm:table-cell">
                      <div className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-400 gap-0.5">
                        <span className="font-mono">{updatedTime}</span>
                        <span className="font-mono text-gray-400">{updatedDate}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-400 py-8 p-4">تعذر تحميل الأسعار</p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 flex flex-wrap justify-between gap-2">
        <span>* الأسعار للاسترشاد فقط — تختلف باختلاف المبلغ والوقت</span>
        <span className="text-green-500 font-medium">● يتجدد كل 5 دقائق</span>
      </div>
    </div>
  );
}
