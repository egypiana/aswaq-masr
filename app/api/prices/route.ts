import { NextRequest, NextResponse } from 'next/server';
import { CATEGORIES, CATEGORY_SLUGS } from '@/app/lib/categories';
import { CategorySlug, PriceUpdate } from '@/app/lib/types';

/*
 * Simulated price API for demonstration.
 *
 * For production, integrate real APIs:
 * - Gold/Silver: https://metalpriceapi.com
 * - Currencies: https://exchangerate-api.com or https://api.exchangerate.host
 * - Construction materials: Custom scraping or local Egyptian data providers
 * - Fuel: Manual update (government-regulated prices in Egypt)
 *
 * Example production integration:
 * const goldRes = await fetch('https://api.metalpriceapi.com/v1/latest?api_key=YOUR_KEY&base=EGP&currencies=XAU,XAG');
 * const fxRes = await fetch('https://v6.exchangerate-api.com/v6/YOUR_KEY/latest/USD');
 */

interface CachedPrice {
  price: number;
  previousPrice: number;
  lastChanged: number;
}

const priceCache = new Map<string, CachedPrice>();
let lastCacheUpdate = 0;
const CACHE_DURATION = 60000; // 60 seconds

function generatePrices(category: CategorySlug): PriceUpdate[] {
  const config = CATEGORIES[category];
  const now = Date.now();
  const shouldRefresh = now - lastCacheUpdate > CACHE_DURATION;

  if (shouldRefresh) {
    lastCacheUpdate = now;
  }

  return config.items.map((item) => {
    const cacheKey = `${category}-${item.id}`;
    const cached = priceCache.get(cacheKey);

    if (cached && !shouldRefresh) {
      return {
        id: item.id,
        nameAr: item.nameAr,
        unit: item.unit,
        icon: item.icon,
        price: cached.price,
        previousPrice: cached.previousPrice,
        change: +(cached.price - cached.previousPrice).toFixed(2),
        changePercent: cached.previousPrice
          ? +((cached.price - cached.previousPrice) / cached.previousPrice * 100).toFixed(2)
          : 0,
        direction: cached.price > cached.previousPrice ? 'up' as const
          : cached.price < cached.previousPrice ? 'down' as const
          : 'stable' as const,
        timestamp: new Date(now).toISOString(),
      };
    }

    const previousPrice = cached?.price ?? item.basePrice;
    let newPrice: number;

    if (item.fluctuationRange === 0) {
      // Government-fixed prices (e.g., fuel)
      newPrice = item.basePrice;
    } else {
      // ~30% chance of price change per item
      const shouldChange = Math.random() < 0.3;
      if (shouldChange || !cached) {
        const fluctuation = (Math.random() - 0.5) * 2 * (item.fluctuationRange / 100) * item.basePrice;
        newPrice = +(item.basePrice + fluctuation).toFixed(2);
      } else {
        newPrice = previousPrice;
      }
    }

    priceCache.set(cacheKey, {
      price: newPrice,
      previousPrice,
      lastChanged: now,
    });

    return {
      id: item.id,
      nameAr: item.nameAr,
      unit: item.unit,
      icon: item.icon,
      price: newPrice,
      previousPrice,
      change: +(newPrice - previousPrice).toFixed(2),
      changePercent: previousPrice
        ? +((newPrice - previousPrice) / previousPrice * 100).toFixed(2)
        : 0,
      direction: newPrice > previousPrice ? 'up' as const
        : newPrice < previousPrice ? 'down' as const
        : 'stable' as const,
      timestamp: new Date(now).toISOString(),
    };
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as CategorySlug | null;

  if (category) {
    if (!CATEGORY_SLUGS.includes(category)) {
      return NextResponse.json(
        { error: 'فئة غير صالحة' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      category,
      items: generatePrices(category),
      lastUpdated: new Date().toISOString(),
    });
  }

  // Return all categories
  const categories: Record<string, PriceUpdate[]> = {};
  for (const slug of CATEGORY_SLUGS) {
    categories[slug] = generatePrices(slug);
  }

  return NextResponse.json({
    categories,
    lastUpdated: new Date().toISOString(),
  });
}
