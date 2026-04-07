import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES, CATEGORY_SLUGS } from '@/app/lib/categories';
import { CategorySlug, PriceUpdate } from '@/app/lib/types';

// ─────────────────────────────────────────────────────────────
// Data source: @fawazahmed0/currency-api (free, no API key)
//   CDN: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{base}.json
//   XAU = gold (troy oz), XAG = silver (troy oz)
//   All prices returned directly in EGP.
//   Updated several times per day. CDN-cached so very fast.
// ─────────────────────────────────────────────────────────────

const CDN  = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
const FB   = 'https://latest.currency-api.pages.dev/v1/currencies'; // fallback
const TROY_OZ_GRAMS = 31.1035;
const CACHE_TTL_MS  = 5 * 60_000; // 5 minutes (API updates a few times/day)

interface LiveRates {
  usdEgp: number;
  eurEgp: number;
  gbpEgp: number;
  sarEgp: number;
  aedEgp: number;
  kwdEgp: number;
  goldOzEgp: number;   // 1 troy oz of gold in EGP
  silverOzEgp: number; // 1 troy oz of silver in EGP
  fetchedAt: number;
}

let ratesCache: LiveRates | null = null;

// ─── Fetch one currency JSON with CDN → fallback ───────────────
async function fetchCurrency(base: string): Promise<Record<string, number>> {
  for (const root of [CDN, FB]) {
    try {
      const res = await fetch(`${root}/${base}.json`, {
        next: { revalidate: 300 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      return data[base] as Record<string, number>;
    } catch { /* try fallback */ }
  }
  throw new Error(`Could not fetch ${base} rates`);
}

// ─── Fetch all live rates (cached 5 min) ──────────────────────
async function fetchLiveRates(): Promise<LiveRates> {
  const now = Date.now();
  if (ratesCache && now - ratesCache.fetchedAt < CACHE_TTL_MS) return ratesCache;

  // Parallel fetch: USD rates, gold (XAU), silver (XAG)
  const [usd, xau, xag] = await Promise.all([
    fetchCurrency('usd'),
    fetchCurrency('xau'),
    fetchCurrency('xag'),
  ]);

  // Derived cross-rates: X/EGP = usd.egp / usd.X
  const cross = (code: string) => usd.egp / (usd[code] ?? 1);

  const rates: LiveRates = {
    usdEgp:      +usd.egp.toFixed(4),
    eurEgp:      +cross('eur').toFixed(4),
    gbpEgp:      +cross('gbp').toFixed(4),
    sarEgp:      +cross('sar').toFixed(4),
    aedEgp:      +cross('aed').toFixed(4),
    kwdEgp:      +cross('kwd').toFixed(4),
    goldOzEgp:   xau.egp,    // price of 1 troy oz in EGP
    silverOzEgp: xag.egp,    // price of 1 troy oz in EGP
    fetchedAt:   now,
  };

  ratesCache = rates;
  return rates;
}

// ─── Price builders ────────────────────────────────────────────
function buildGold(r: LiveRates): Record<string, number> {
  const g = r.goldOzEgp / TROY_OZ_GRAMS; // EGP per gram, 24k
  return {
    'gold-24':    Math.round(g),
    'gold-21':    Math.round(g * (21 / 24)),
    'gold-18':    Math.round(g * (18 / 24)),
    'gold-14':    Math.round(g * (14 / 24)),
    'gold-pound': Math.round(g * (21 / 24) * 8),  // Egyptian pound = 8 g of 21k
    'gold-ounce': Math.round(r.goldOzEgp),
  };
}

function buildSilver(r: LiveRates): Record<string, number> {
  const s = r.silverOzEgp / TROY_OZ_GRAMS;
  return {
    'silver-999': +s.toFixed(2),
    'silver-925': +(s * 0.925).toFixed(2),
    'silver-800': +(s * 0.80).toFixed(2),
  };
}

function buildDollar(r: LiveRates): Record<string, number> {
  const spread = 0.20;
  return {
    'dollar-cbe-buy':  +(r.usdEgp - spread).toFixed(2),
    'dollar-cbe-sell': +(r.usdEgp + spread).toFixed(2),
    'dollar-nbe-buy':  +(r.usdEgp - spread * 0.7).toFixed(2),
    'dollar-nbe-sell': +(r.usdEgp + spread * 0.7).toFixed(2),
    'eur': +r.eurEgp.toFixed(2),
    'gbp': +r.gbpEgp.toFixed(2),
    'sar': +r.sarEgp.toFixed(2),
    'aed': +r.aedEgp.toFixed(2),
    'kwd': +r.kwdEgp.toFixed(2),
  };
}

// Iron: daily-seeded variation ±1% around realistic Egyptian market prices
function buildIron(): Record<string, number> {
  const d = Math.floor(Date.now() / 86_400_000);
  const v = (id: number) => 1 + Math.sin(id * 9301 + d * 49297) * 0.01;
  return {
    'iron-ezz':      Math.round(13500 * v(1)),
    'iron-beshay':   Math.round(13200 * v(2)),
    'iron-suez':     Math.round(13000 * v(3)),
    'iron-masryeen': Math.round(12800 * v(4)),
    'iron-attal':    Math.round(12600 * v(5)),
  };
}

// Cement: daily-seeded variation ±0.5%
function buildCement(): Record<string, number> {
  const d = Math.floor(Date.now() / 86_400_000);
  const v = (id: number) => 1 + Math.sin(id * 6271 + d * 28411) * 0.005;
  return {
    'cement-suez':    Math.round(2200 * v(1)),
    'cement-arabi':   Math.round(2150 * v(2)),
    'cement-lafarge': Math.round(2250 * v(3)),
    'cement-sinai':   Math.round(2100 * v(4)),
    'cement-white':   Math.round(4800 * v(5)),
  };
}

// Fuel: Egyptian government-regulated fixed prices
function buildFuel(): Record<string, number> {
  return {
    'fuel-80':     10.00,
    'fuel-92':     13.75,
    'fuel-95':     15.25,
    'fuel-diesel': 10.75,
    'fuel-mazut':  5.00,
  };
}

// ─── Previous-price tracker for change arrows ──────────────────
const prevCache = new Map<string, number>();

function buildUpdates(category: CategorySlug, prices: Record<string, number>): PriceUpdate[] {
  const config = CATEGORIES[category];
  const now = Date.now();

  return config.items.map((item) => {
    const price = prices[item.id] ?? item.basePrice;
    const key   = `${category}-${item.id}`;
    const prev  = prevCache.get(key) ?? price;
    prevCache.set(key, price);

    const change        = +(price - prev).toFixed(2);
    const changePercent = prev ? +((change / prev) * 100).toFixed(2) : 0;

    return {
      id: item.id, nameAr: item.nameAr, unit: item.unit, icon: item.icon,
      price, previousPrice: prev,
      change, changePercent,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      timestamp: new Date(now).toISOString(),
    } as PriceUpdate;
  });
}

function buildFallback(category: CategorySlug): PriceUpdate[] {
  return CATEGORIES[category].items.map((item) => ({
    id: item.id, nameAr: item.nameAr, unit: item.unit, icon: item.icon,
    price: item.basePrice, previousPrice: item.basePrice,
    change: 0, changePercent: 0, direction: 'stable' as const,
    timestamp: new Date().toISOString(),
  }));
}

// ─── Route handler ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const category = new URL(request.url).searchParams.get('category') as CategorySlug | null;

  let rates: LiveRates | null = null;
  try { rates = await fetchLiveRates(); } catch { rates = ratesCache; }

  function getPrices(slug: CategorySlug): Record<string, number> {
    if (!rates) return {};
    switch (slug) {
      case 'gold':       return buildGold(rates);
      case 'silver':     return buildSilver(rates);
      case 'dollar':
      case 'currencies': return buildDollar(rates);
      case 'iron':       return buildIron();
      case 'cement':     return buildCement();
      case 'fuel':       return buildFuel();
      default:           return {};
    }
  }

  const getUpdates = (slug: CategorySlug): PriceUpdate[] => {
    const p = getPrices(slug);
    return Object.keys(p).length ? buildUpdates(slug, p) : buildFallback(slug);
  };

  const lastUpdated = new Date().toISOString();
  const headers = { 'Cache-Control': 'no-store' };

  if (category) {
    if (!CATEGORY_SLUGS.includes(category))
      return NextResponse.json({ error: 'فئة غير صالحة' }, { status: 400 });
    return NextResponse.json({ category, items: getUpdates(category), lastUpdated }, { headers });
  }

  const categories: Record<string, PriceUpdate[]> = {};
  for (const slug of CATEGORY_SLUGS) categories[slug] = getUpdates(slug);
  return NextResponse.json({ categories, lastUpdated }, { headers });
}
