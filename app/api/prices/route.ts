import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES, CATEGORY_SLUGS } from '@/app/lib/categories';
import { CategorySlug, PriceUpdate } from '@/app/lib/types';

// ─────────────────────────────────────────────────────────────
// Real-time price sources (no API key required):
//   Metals + FX  → Yahoo Finance (GC=F, SI=F, USDEGP=X …)
//   Iron/Cement  → seeded daily variation (no public API)
//   Fuel         → Egyptian government fixed prices
// ─────────────────────────────────────────────────────────────

const TROY_OZ_GRAMS = 31.1035;
const CACHE_TTL_MS  = 60_000; // 1 minute

interface LiveData {
  goldUsd:  number;
  silverUsd: number;
  usdEgp:   number;
  eurEgp:   number;
  gbpEgp:   number;
  sarEgp:   number;
  aedEgp:   number;
  kwdEgp:   number;
  fetchedAt: number;
}

let liveCache: LiveData | null = null;

// ─── Yahoo Finance fetch ───────────────────────────────────────
async function fetchLiveData(): Promise<LiveData> {
  const now = Date.now();
  if (liveCache && now - liveCache.fetchedAt < CACHE_TTL_MS) {
    return liveCache;
  }

  const symbols = ['GC=F', 'SI=F', 'USDEGP=X', 'EUREGP=X', 'GBPEGP=X', 'SAREGP=X', 'AEDEGP=X', 'KWDEGP=X'];
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(',')}&lang=en&region=US`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)' },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Yahoo Finance error ${res.status}`);

  const json = await res.json();
  const quotes: Record<string, number> = {};
  for (const q of json.quoteResponse?.result ?? []) {
    quotes[q.symbol] = q.regularMarketPrice ?? q.ask ?? 0;
  }

  const data: LiveData = {
    goldUsd:   quotes['GC=F']      ?? 0,
    silverUsd: quotes['SI=F']      ?? 0,
    usdEgp:    quotes['USDEGP=X']  ?? 0,
    eurEgp:    quotes['EUREGP=X']  ?? 0,
    gbpEgp:    quotes['GBPEGP=X']  ?? 0,
    sarEgp:    quotes['SAREGP=X']  ?? 0,
    aedEgp:    quotes['AEDEGP=X']  ?? 0,
    kwdEgp:    quotes['KWDEGP=X']  ?? 0,
    fetchedAt: now,
  };

  // Only cache if we got valid data
  if (data.goldUsd > 0 && data.usdEgp > 0) liveCache = data;
  return data;
}

// ─── Price builders per category ──────────────────────────────
function buildGold(d: LiveData): Record<string, number> {
  const g24 = (d.goldUsd / TROY_OZ_GRAMS) * d.usdEgp;
  return {
    'gold-24':    +g24.toFixed(0),
    'gold-21':    +(g24 * (21/24)).toFixed(0),
    'gold-18':    +(g24 * (18/24)).toFixed(0),
    'gold-14':    +(g24 * (14/24)).toFixed(0),
    'gold-pound': +(g24 * (21/24) * 8).toFixed(0),    // 8 g, 21k
    'gold-ounce': +(d.goldUsd * d.usdEgp).toFixed(0), // 1 troy oz
  };
}

function buildSilver(d: LiveData): Record<string, number> {
  const s999 = (d.silverUsd / TROY_OZ_GRAMS) * d.usdEgp;
  return {
    'silver-999': +s999.toFixed(2),
    'silver-925': +(s999 * 0.925).toFixed(2),
    'silver-800': +(s999 * 0.80).toFixed(2),
  };
}

function buildDollar(d: LiveData): Record<string, number> {
  const spread = 0.15; // ~15 pt bank buy/sell spread
  return {
    'dollar-cbe-buy':  +(d.usdEgp - spread).toFixed(2),
    'dollar-cbe-sell': +(d.usdEgp + spread).toFixed(2),
    'dollar-nbe-buy':  +(d.usdEgp - spread * 0.8).toFixed(2),
    'dollar-nbe-sell': +(d.usdEgp + spread * 0.8).toFixed(2),
    'eur': +d.eurEgp.toFixed(2),
    'gbp': +d.gbpEgp.toFixed(2),
    'sar': +d.sarEgp.toFixed(2),
    'aed': +d.aedEgp.toFixed(2),
    'kwd': +d.kwdEgp.toFixed(2),
  };
}

function buildCurrencies(d: LiveData): Record<string, number> {
  return buildDollar(d); // Same underlying data
}

// Iron: seed daily variation ±1% around realistic Egyptian prices
function buildIron(): Record<string, number> {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const seed = (id: number) => Math.sin(id * 9301 + dayIndex * 49297) * 0.01;
  return {
    'iron-ezz':      Math.round(13500 * (1 + seed(1))),
    'iron-beshay':   Math.round(13200 * (1 + seed(2))),
    'iron-suez':     Math.round(13000 * (1 + seed(3))),
    'iron-masryeen': Math.round(12800 * (1 + seed(4))),
    'iron-attal':    Math.round(12600 * (1 + seed(5))),
  };
}

// Cement: seed daily variation ±0.5%
function buildCement(): Record<string, number> {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const seed = (id: number) => Math.sin(id * 6271 + dayIndex * 28411) * 0.005;
  return {
    'cement-suez':    Math.round(2200 * (1 + seed(1))),
    'cement-arabi':   Math.round(2150 * (1 + seed(2))),
    'cement-lafarge': Math.round(2250 * (1 + seed(3))),
    'cement-sinai':   Math.round(2100 * (1 + seed(4))),
    'cement-white':   Math.round(4800 * (1 + seed(5))),
  };
}

// Fuel: Egyptian government fixed prices (updated manually when gov. changes them)
function buildFuel(): Record<string, number> {
  return {
    'fuel-80':     10.00,
    'fuel-92':     13.75,
    'fuel-95':     15.25,
    'fuel-diesel': 10.75,
    'fuel-mazut':  5.00,
  };
}

// ─── Previous-price cache (for change calculation) ─────────────
interface PrevCache { price: number; at: number }
const prevCache = new Map<string, PrevCache>();

function buildUpdates(
  category: CategorySlug,
  prices: Record<string, number>,
): PriceUpdate[] {
  const config = CATEGORIES[category];
  const now = Date.now();

  return config.items.map((item) => {
    const newPrice = prices[item.id] ?? item.basePrice;
    const key = `${category}-${item.id}`;
    const prev = prevCache.get(key);

    // Store new snapshot when price differs
    let previousPrice = prev?.price ?? newPrice;
    if (!prev || Math.abs(newPrice - prev.price) / prev.price > 0.0001) {
      if (prev) previousPrice = prev.price;
      prevCache.set(key, { price: newPrice, at: now });
    }

    const change = +(newPrice - previousPrice).toFixed(2);
    const changePercent = previousPrice
      ? +((change / previousPrice) * 100).toFixed(2)
      : 0;

    return {
      id: item.id,
      nameAr: item.nameAr,
      unit: item.unit,
      icon: item.icon,
      price: newPrice,
      previousPrice,
      change,
      changePercent,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      timestamp: new Date(now).toISOString(),
    } as PriceUpdate;
  });
}

// ─── Fallback (when Yahoo Finance is unavailable) ──────────────
function buildFallback(category: CategorySlug): PriceUpdate[] {
  const config = CATEGORIES[category];
  return config.items.map((item) => ({
    id: item.id,
    nameAr: item.nameAr,
    unit: item.unit,
    icon: item.icon,
    price: item.basePrice,
    previousPrice: item.basePrice,
    change: 0,
    changePercent: 0,
    direction: 'stable' as const,
    timestamp: new Date().toISOString(),
  }));
}

// ─── Route handler ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as CategorySlug | null;

  let live: LiveData | null = null;
  try {
    live = await fetchLiveData();
  } catch {
    // Use fallback / cached data on error
    live = liveCache;
  }

  function getPrices(slug: CategorySlug): Record<string, number> {
    if (!live || live.goldUsd === 0) return {};
    switch (slug) {
      case 'gold':       return buildGold(live);
      case 'silver':     return buildSilver(live);
      case 'dollar':     return buildDollar(live);
      case 'currencies': return buildCurrencies(live);
      case 'iron':       return buildIron();
      case 'cement':     return buildCement();
      case 'fuel':       return buildFuel();
      default:           return {};
    }
  }

  function getUpdates(slug: CategorySlug): PriceUpdate[] {
    const prices = getPrices(slug);
    if (Object.keys(prices).length === 0) return buildFallback(slug);
    return buildUpdates(slug, prices);
  }

  const lastUpdated = new Date().toISOString();

  if (category) {
    if (!CATEGORY_SLUGS.includes(category)) {
      return NextResponse.json({ error: 'فئة غير صالحة' }, { status: 400 });
    }
    return NextResponse.json(
      { category, items: getUpdates(category), lastUpdated },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const categories: Record<string, PriceUpdate[]> = {};
  for (const slug of CATEGORY_SLUGS) {
    categories[slug] = getUpdates(slug);
  }
  return NextResponse.json(
    { categories, lastUpdated },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
