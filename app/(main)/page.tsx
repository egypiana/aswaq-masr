'use client';

import Link from 'next/link';
import { CATEGORIES, CATEGORY_SLUGS } from '@/app/lib/categories';
import { usePrices } from '@/app/hooks/usePrices';
import { formatPrice, getDirectionArrow, getDirectionColor } from '@/app/lib/utils';
import PriceTicker from '@/app/components/PriceTicker';

function CategoryOverviewCard({ slug }: { slug: string }) {
  const config = CATEGORIES[slug as keyof typeof CATEGORIES];
  const { items, loading } = usePrices(config.slug);
  const mainItem = items[0];

  return (
    <Link
      href={`/${slug}`}
      className="block bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{config.icon}</span>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{config.nameAr}</h2>
      </div>

      {loading ? (
        <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
      ) : mainItem ? (
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(mainItem.price)}
            </span>
            <span className="text-sm text-gray-500">{mainItem.unit}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{mainItem.nameAr}</span>
            {mainItem.change !== 0 && (
              <span className={`text-xs ${getDirectionColor(mainItem.direction)}`}>
                {getDirectionArrow(mainItem.direction)} {Math.abs(mainItem.changePercent)}%
              </span>
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-3 text-xs text-brand-red font-medium group-hover:underline flex items-center gap-1">
        شاهد التفاصيل
        <svg className="w-3 h-3 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-navy to-navy/90 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            أسعار اليوم في مصر لحظة بلحظة
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            تابع أسعار الذهب والفضة والدولار والعملات والحديد والأسمنت والوقود — محدثة كل دقيقة
          </p>
        </div>
      </section>

      {/* Price Ticker */}
      <PriceTicker />

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">جميع الأسعار</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORY_SLUGS.map((slug) => (
            <CategoryOverviewCard key={slug} slug={slug} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">عن أسعار وأسواق</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            موقع أسعار وأسواق هو منصتك الشاملة لمتابعة جميع الأسعار في السوق المصري. نوفر لك أسعار الذهب بجميع عياراته، أسعار العملات الأجنبية مقابل الجنيه المصري، أسعار مواد البناء كالحديد والأسمنت، بالإضافة إلى أسعار الوقود. جميع الأسعار يتم تحديثها بشكل دوري لضمان حصولك على أحدث المعلومات.
          </p>
        </div>
      </section>
    </div>
  );
}
