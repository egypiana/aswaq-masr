'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CategorySlug, PriceUpdate } from '@/app/lib/types';

interface UsePricesResult {
  items: PriceUpdate[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  changedIds: Set<string>;
}

export function usePrices(category?: CategorySlug): UsePricesResult {
  const [items, setItems] = useState<PriceUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const prevPricesRef = useRef<Map<string, number>>(new Map());

  const fetchPrices = useCallback(async () => {
    try {
      const url = category
        ? `/api/prices?category=${category}`
        : '/api/prices';
      const res = await fetch(url);
      if (!res.ok) throw new Error('فشل في جلب الأسعار');
      const data = await res.json();

      let newItems: PriceUpdate[];
      if (category) {
        newItems = data.items;
      } else {
        // Flatten all categories for ticker
        newItems = Object.values(data.categories).flat() as PriceUpdate[];
      }

      // Detect changes
      const changed = new Set<string>();
      newItems.forEach((item) => {
        const prev = prevPricesRef.current.get(item.id);
        if (prev !== undefined && prev !== item.price) {
          changed.add(item.id);
        }
        prevPricesRef.current.set(item.id, item.price);
      });

      setItems(newItems);
      setLastUpdated(data.lastUpdated);
      setChangedIds(changed);
      setLoading(false);
      setError(null);

      // Clear flash after 2 seconds
      if (changed.size > 0) {
        setTimeout(() => setChangedIds(new Set()), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { items, loading, error, lastUpdated, changedIds };
}
