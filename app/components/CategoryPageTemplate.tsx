'use client';

import { CategoryConfig } from '@/app/lib/types';
import { usePrices } from '@/app/hooks/usePrices';
import { formatTime } from '@/app/lib/utils';
import { generateFAQSchema, generateBreadcrumbSchema } from '@/app/lib/seo';
import PriceCard from './PriceCard';
import EmbedWidget from './EmbedWidget';
import HowToUse from './HowToUse';
import PracticalExamples from './PracticalExamples';
import Calculator from './Calculator';
import SEOContent from './SEOContent';
import FAQ from './FAQ';
import JsonLd from './JsonLd';
import Breadcrumb from './Breadcrumb';
import CurrencyTable from './CurrencyTable';
import BankRatesTable from './BankRatesTable';

interface CategoryPageTemplateProps {
  config: CategoryConfig;
}

export default function CategoryPageTemplate({ config }: CategoryPageTemplateProps) {
  const { items, loading, lastUpdated, changedIds } = usePrices(config.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* JSON-LD Schemas */}
      <JsonLd data={generateFAQSchema(config.faqs)} />
      <JsonLd data={generateBreadcrumbSchema(config.nameAr, config.slug)} />

      {/* Breadcrumb */}
      <Breadcrumb categoryName={config.nameAr} />

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          <span className="text-3xl ml-2">{config.icon}</span>
          {config.h1}
        </h1>
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 bg-up rounded-full animate-pulse-dot"></span>
            <span>آخر تحديث: {formatTime(new Date(lastUpdated))}</span>
          </div>
        )}
      </div>

      {/* Price Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: config.items.length }).map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <PriceCard
              key={item.id}
              item={item}
              isFlashing={changedIds.has(item.id)}
            />
          ))}
        </div>
      )}

      {/* Currency Table — shown on dollar & currencies pages */}
      {config.slug === 'dollar' && (
        <BankRatesTable currency="USD" />
      )}
      {config.slug === 'currencies' && (
        <CurrencyTable />
      )}

      {/* Embed Widget */}
      <EmbedWidget category={config.slug} title={config.embedTitle} />

      {/* Calculator */}
      {items.length > 0 && (
        <div className="mt-8">
          <Calculator
            label={config.calculatorLabel}
            unit={config.calculatorUnit}
            items={items}
          />
        </div>
      )}

      {/* How To Use */}
      <HowToUse steps={config.howToSteps} categoryName={config.nameAr} />

      {/* Practical Examples */}
      {items.length > 0 && (
        <PracticalExamples examples={config.practicalExamples} prices={items} />
      )}

      {/* SEO Article */}
      <SEOContent content={config.seoArticle} />

      {/* FAQ */}
      <FAQ faqs={config.faqs} />
    </div>
  );
}
