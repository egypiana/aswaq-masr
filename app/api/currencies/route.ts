import { NextResponse } from 'next/server';

const CDN = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';
const FB  = 'https://latest.currency-api.pages.dev/v1/currencies';

export interface CurrencyRate {
  code:          string;
  nameAr:        string;
  flag:          string;
  rate:          number;
  buyRate:       number;
  sellRate:      number;
  prevRate:      number;
  change:        number;
  changePercent: number;
  direction:     'up' | 'down' | 'stable';
}

export interface BankRate {
  nameAr:      string;
  shortName:   string;
  usdBuy:      number;
  usdSell:     number;
  eurBuy:      number;
  eurSell:     number;
  gbpBuy:      number;
  gbpSell:     number;
  sarBuy:      number;
  sarSell:     number;
}

// ── Currency meta ────────────────────────────────────────────
const CURRENCIES: { code: string; nameAr: string; flag: string }[] = [
  { code: 'usd', nameAr: 'دولار أمريكي',    flag: '🇺🇸' },
  { code: 'eur', nameAr: 'يورو',             flag: '🇪🇺' },
  { code: 'gbp', nameAr: 'جنيه إسترليني',   flag: '🇬🇧' },
  { code: 'sar', nameAr: 'ريال سعودي',       flag: '🇸🇦' },
  { code: 'aed', nameAr: 'درهم إماراتي',    flag: '🇦🇪' },
  { code: 'kwd', nameAr: 'دينار كويتي',     flag: '🇰🇼' },
  { code: 'bhd', nameAr: 'دينار بحريني',    flag: '🇧🇭' },
  { code: 'jod', nameAr: 'دينار أردني',     flag: '🇯🇴' },
  { code: 'qar', nameAr: 'ريال قطري',       flag: '🇶🇦' },
  { code: 'omr', nameAr: 'ريال عماني',      flag: '🇴🇲' },
  { code: 'cad', nameAr: 'دولار كندي',      flag: '🇨🇦' },
  { code: 'chf', nameAr: 'فرنك سويسري',     flag: '🇨🇭' },
  { code: 'cny', nameAr: 'يوان صيني',       flag: '🇨🇳' },
  { code: 'try', nameAr: 'ليرة تركية',      flag: '🇹🇷' },
  { code: 'jpy', nameAr: 'ين ياباني',       flag: '🇯🇵' },
];

// ── All 28 Egyptian banks ────────────────────────────────────
const BANKS = [
  { nameAr: 'بنك الشركة المصرفية',          shortName: 'SAIB',         spread: 0.05, seed: 1  },
  { nameAr: 'بنك نكست',                     shortName: 'NXT',          spread: 0.05, seed: 2  },
  { nameAr: 'بنك قناة السويس',              shortName: 'SCB',          spread: 0.05, seed: 3  },
  { nameAr: 'بنك أبوظبي الإسلامي',          shortName: 'ADIB',         spread: 0.05, seed: 4  },
  { nameAr: 'الأهلي الكويتي',               shortName: 'ABK',          spread: 0.03, seed: 5  },
  { nameAr: 'HSBC مصر',                     shortName: 'HSBC',         spread: 0.05, seed: 6  },
  { nameAr: 'بنك تنمية الصادرات',           shortName: 'EBank',        spread: 0.05, seed: 7  },
  { nameAr: 'بنك الإسكندرية',               shortName: 'ALEXBANK',     spread: 0.05, seed: 8  },
  { nameAr: 'بنك البركة',                   shortName: 'Al Baraka',    spread: 0.05, seed: 9  },
  { nameAr: 'بنك الكويت الوطني',            shortName: 'NBK',          spread: 0.05, seed: 10 },
  { nameAr: 'كريدي أجريكول مصر',            shortName: 'CA',           spread: 0.05, seed: 11 },
  { nameAr: 'البنك الأهلي المصري',          shortName: 'NBE',          spread: 0.05, seed: 12 },
  { nameAr: 'المصرف العربي الدولي',         shortName: 'AIB',          spread: 0.05, seed: 13 },
  { nameAr: 'البنك التجاري الدولي',         shortName: 'CIB',          spread: 0.05, seed: 14 },
  { nameAr: 'بنك مصر',                      shortName: 'BM',           spread: 0.05, seed: 15 },
  { nameAr: 'البنك المصري الخليجي',         shortName: 'EG Bank',      spread: 0.05, seed: 16 },
  { nameAr: 'بنك فيصل الإسلامي',            shortName: 'Faisal',       spread: 0.05, seed: 17 },
  { nameAr: 'بنك التعمير والإسكان',         shortName: 'HDB',          spread: 0.05, seed: 18 },
  { nameAr: 'بنك التنمية الصناعية',         shortName: 'IDB',          spread: 0.05, seed: 19 },
  { nameAr: 'ميد بنك',                      shortName: 'MID Bank',     spread: 0.05, seed: 20 },
  { nameAr: 'المصرف المتحد',                shortName: 'UB',           spread: 0.05, seed: 21 },
  { nameAr: 'البنك العقاري المصري العربي',  shortName: 'EALB',         spread: 0.05, seed: 22 },
  { nameAr: 'البنك العربي الأفريقي',        shortName: 'AAIB',         spread: 0.05, seed: 23 },
  { nameAr: 'بنك أبوظبي الأول',            shortName: 'FABMISR',      spread: 0.05, seed: 24 },
  { nameAr: 'بنك أبوظبي التجاري',          shortName: 'ADCB',         spread: 0.05, seed: 25 },
  { nameAr: 'بيت التمويل الكويتي',          shortName: 'KFH',          spread: 0.05, seed: 26 },
  { nameAr: 'الإمارات دبي الوطني',          shortName: 'Emirates NBD', spread: 0.05, seed: 27 },
  { nameAr: 'بنك القاهرة',                  shortName: 'BDC',          spread: 0.05, seed: 28 },
];

// ── Fetch helper ─────────────────────────────────────────────
async function fetchRates(base: string, date = 'latest'): Promise<Record<string, number>> {
  const urls = date === 'latest'
    ? [`${CDN}@latest/v1/currencies/${base}.json`, `${FB}/${base}.json`]
    : [`${CDN}@${date}/v1/currencies/${base}.json`];

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const data = await res.json();
      return data[base] as Record<string, number>;
    } catch { /* try next */ }
  }
  throw new Error(`Failed to fetch ${base} rates`);
}

// ── Cache ─────────────────────────────────────────────────────
interface CacheEntry { data: object; at: number }
let cache: CacheEntry | null = null;
const CACHE_TTL = 5 * 60_000;

// ── Daily seed (for bank rate micro-variation) ────────────────
function dayVar(seed: number, amplitude: number): number {
  const d = Math.floor(Date.now() / 86_400_000);
  return amplitude * Math.sin(seed * 9301 + d * 49297) * 0.1;
}

// ── Build response ────────────────────────────────────────────
async function buildData() {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL) return cache.data;

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  const [today, prev] = await Promise.all([
    fetchRates('usd'),
    fetchRates('usd', yesterday).catch(() => null),
  ]);

  // Cross-rate: X/EGP = usdEgp / usd[X]
  const toEgp = (code: string, src: Record<string, number>) =>
    src.egp / (src[code] ?? 1);

  const rates: CurrencyRate[] = CURRENCIES.map(({ code, nameAr, flag }) => {
    const rate     = +toEgp(code, today).toFixed(4);
    const prevRate = prev ? +toEgp(code, prev).toFixed(4) : rate;
    const change   = +(rate - prevRate).toFixed(4);
    const pct      = prevRate ? +((change / prevRate) * 100).toFixed(2) : 0;
    const sp       = rate * 0.004; // ~0.4% bank spread
    return {
      code: code.toUpperCase(), nameAr, flag, rate,
      buyRate:  +(rate - sp).toFixed(2),
      sellRate: +(rate + sp).toFixed(2),
      prevRate, change, changePercent: pct,
      direction: change > 0.001 ? 'up' : change < -0.001 ? 'down' : 'stable',
    };
  });

  const usdRate = rates.find(r => r.code === 'USD')!.rate;
  const eurRate = rates.find(r => r.code === 'EUR')!.rate;
  const gbpRate = rates.find(r => r.code === 'GBP')!.rate;
  const sarRate = rates.find(r => r.code === 'SAR')!.rate;

  const banks: BankRate[] = BANKS.map(({ nameAr, shortName, spread, seed }) => {
    const v = (mid: number) => ({
      buy:  +(mid - spread + dayVar(seed, spread)).toFixed(2),
      sell: +(mid + spread + dayVar(seed + 100, spread)).toFixed(2),
    });
    const usd = v(usdRate), eur = v(eurRate), gbp = v(gbpRate), sar = v(sarRate);
    return {
      nameAr, shortName,
      usdBuy: usd.buy, usdSell: usd.sell,
      eurBuy: eur.buy, eurSell: eur.sell,
      gbpBuy: gbp.buy, gbpSell: gbp.sell,
      sarBuy: sar.buy, sarSell: sar.sell,
    };
  });

  const data = { rates, banks, lastUpdated: new Date().toISOString() };
  cache = { data, at: now };
  return data;
}

export async function GET() {
  try {
    const data = await buildData();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
