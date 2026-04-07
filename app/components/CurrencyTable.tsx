'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { CurrencyRate, BankRate } from '@/app/api/currencies/route';

interface CurrencyData {
  rates: CurrencyRate[];
  banks: BankRate[];
  lastUpdated: string;
}

export type BankCurrencyCode = 'USD' | 'EUR' | 'GBP' | 'SAR';

interface CurrencyTableProps {
  initialTab?: 'market' | 'banks';
  initialCurrency?: BankCurrencyCode;
}

// ── Helpers ───────────────────────────────────────────────────
function Arrow({ dir }: { dir: 'up' | 'down' | 'stable' }) {
  if (dir === 'up')   return <span className="text-green-600 text-xs font-bold">▲</span>;
  if (dir === 'down') return <span className="text-red-500 text-xs font-bold">▼</span>;
  return <span className="text-gray-400 text-xs">—</span>;
}

function ChangeBadge({ pct, dir }: { pct: number; dir: 'up' | 'down' | 'stable' }) {
  const bg = dir === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
           : dir === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
           : 'bg-gray-100 text-gray-500 dark:bg-gray-800';
  const sign = dir === 'up' ? '+' : '';
  return (
    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${bg}`}>
      {sign}{pct.toFixed(2)}%
    </span>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

function EmbedCode({ origin }: { origin: string }) {
  const [copied, setCopied] = useState(false);
  const code = `<iframe src="${origin}/currencies/embed" width="100%" height="500" frameborder="0" scrolling="no" style="border:none;border-radius:12px;"></iframe>`;
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">📎 كود التضمين (Embed)</span>
        <button
          onClick={copy}
          className="text-xs bg-brand-red text-white px-3 py-1.5 rounded-lg hover:bg-brand-red/90 transition-colors"
        >
          {copied ? '✓ تم النسخ' : 'نسخ الكود'}
        </button>
      </div>
      <code className="block text-xs text-gray-500 dark:text-gray-400 break-all font-mono leading-relaxed">
        {code}
      </code>
    </div>
  );
}

// ── Market rates tab ──────────────────────────────────────────
function MarketTab({ rates }: { rates: CurrencyRate[] }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="bg-navy text-white text-xs">
            <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">العملة</th>
            <th className="text-center px-4 py-3 font-semibold">سعر التحويل</th>
            <th className="text-center px-4 py-3 font-semibold">سعر الشراء</th>
            <th className="text-center px-4 py-3 font-semibold">سعر البيع</th>
            <th className="text-center px-4 py-3 font-semibold">التغيير</th>
            <th className="text-center px-4 py-3 font-semibold rounded-tl-lg">نسبة التغيير</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((r, i) => (
            <tr
              key={r.code}
              className={`border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors
                ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/60 dark:bg-gray-800/60'}`}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{r.flag}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{r.nameAr}</div>
                    <div className="text-xs text-gray-400 font-mono">{r.code}</div>
                  </div>
                </div>
              </td>
              <td className="text-center px-4 py-3 font-bold text-gray-900 dark:text-white tabular-nums">
                {r.rate.toFixed(4)}
              </td>
              <td className="text-center px-4 py-3">
                <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-semibold tabular-nums">
                  {r.buyRate.toFixed(2)}
                </span>
              </td>
              <td className="text-center px-4 py-3">
                <span className="inline-block bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded font-semibold tabular-nums">
                  {r.sellRate.toFixed(2)}
                </span>
              </td>
              <td className="text-center px-4 py-3">
                <div className="flex items-center justify-center gap-1">
                  <Arrow dir={r.direction} />
                  <span className={`font-semibold tabular-nums text-sm
                    ${r.direction === 'up' ? 'text-green-600' : r.direction === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                    {r.change === 0 ? '0.00' : (r.change > 0 ? '+' : '') + r.change.toFixed(4)}
                  </span>
                </div>
              </td>
              <td className="text-center px-4 py-3">
                <ChangeBadge pct={r.changePercent} dir={r.direction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Banks tab ─────────────────────────────────────────────────
const BANK_CURRENCY_TABS = [
  { code: 'USD' as const, label: 'دولار أمريكي', flag: '🇺🇸', buyKey: 'usdBuy' as const, sellKey: 'usdSell' as const },
  { code: 'EUR' as const, label: 'يورو',          flag: '🇪🇺', buyKey: 'eurBuy' as const, sellKey: 'eurSell' as const },
  { code: 'GBP' as const, label: 'إسترليني',      flag: '🇬🇧', buyKey: 'gbpBuy' as const, sellKey: 'gbpSell' as const },
  { code: 'SAR' as const, label: 'ريال سعودي',    flag: '🇸🇦', buyKey: 'sarBuy' as const, sellKey: 'sarSell' as const },
];

function BanksTab({
  banks, rates, lastUpdated, initialCurrency = 'USD',
}: {
  banks: BankRate[];
  rates: CurrencyRate[];
  lastUpdated: string;
  initialCurrency?: BankCurrencyCode;
}) {
  const [selected, setSelected] = useState<BankCurrencyCode>(initialCurrency);
  const tab = BANK_CURRENCY_TABS.find(t => t.code === selected)!;
  const marketRate = rates.find(r => r.code === selected);
  const dir = marketRate?.direction ?? 'stable';
  const pct = marketRate?.changePercent ?? 0;

  const updatedTime = new Date(lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  const updatedDate = new Date(lastUpdated).toLocaleDateString('ar-EG', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          أسعار صرف {tab.flag} {tab.label} الآن مقابل الجنيه في كل البنوك
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          هذه الأسعار بتوقيت {updatedTime}. اضغط على <strong>تحديث</strong> لعرض آخر الأسعار.
          <br />
          <em>*التغيرات محسوبة على أساس سعر إغلاق اليوم السابق.</em>
        </p>
      </div>

      {/* Currency selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {BANK_CURRENCY_TABS.map(({ code, label, flag }) => (
          <button
            key={code}
            onClick={() => setSelected(code)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${selected === code
                ? 'bg-navy text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {flag} {label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-navy text-white text-xs">
              <th className="text-right px-4 py-3 font-semibold rounded-tr-lg">البنك</th>
              <th className="text-center px-4 py-3 font-semibold">سعر الشراء</th>
              <th className="text-center px-4 py-3 font-semibold">سعر البيع</th>
              <th className="text-center px-3 py-3 font-semibold hidden sm:table-cell rounded-tl-lg">آخر تحديث</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((b, i) => {
              const buy  = b[tab.buyKey];
              const sell = b[tab.sellKey];
              return (
                <tr
                  key={b.shortName}
                  className={`border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors
                    ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/60 dark:bg-gray-800/60'}`}
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
                    <div className="flex flex-col items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-mono">{updatedTime}</span>
                      <span className="font-mono text-gray-400">{updatedDate}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function CurrencyTable({ initialTab = 'market', initialCurrency = 'USD' }: CurrencyTableProps) {
  const [tab, setTab]       = useState<'market' | 'banks'>(initialTab);
  const [data, setData]     = useState<CurrencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [origin, setOrigin] = useState('');
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
    setOrigin(window.location.origin);
    fetchData();
    intervalRef.current = setInterval(fetchData, 5 * 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  const time = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-l from-navy to-navy/90 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">أسعار صرف العملات اليوم</h2>
            <p className="text-gray-300 text-xs mt-0.5">مقابل الجنيه المصري • المصدر: السوق الفوري</p>
          </div>
          <div className="flex items-center gap-3">
            {time && (
              <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                <LiveDot />
                <span>آخر تحديث: {time}</span>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 px-1">
          {([['market', '📊 أسعار السوق'], ['banks', '🏦 أسعار البنوك']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px
                ${tab === key
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              {label}
            </button>
          ))}

          <div className="mr-auto flex items-center gap-4 px-4 text-xs text-gray-400 self-center">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-blue-200" />
              شراء
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-orange-100 border border-orange-200" />
              بيع
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : data ? (
            tab === 'market'
              ? <MarketTab rates={data.rates} />
              : <BanksTab
                  banks={data.banks}
                  rates={data.rates}
                  lastUpdated={data.lastUpdated}
                  initialCurrency={initialCurrency}
                />
          ) : (
            <p className="text-center text-gray-400 py-8">تعذر تحميل الأسعار</p>
          )}
        </div>

        {/* Footer */}
        {data && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
              <span>* الأسعار للاسترشاد فقط — تختلف أسعار البنوك باختلاف المبلغ والوقت</span>
              <span className="text-green-500 font-medium">● يتجدد كل 5 دقائق</span>
            </div>
            <EmbedCode origin={origin} />
          </div>
        )}
      </div>
    </section>
  );
}
