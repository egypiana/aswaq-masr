import { Metadata } from 'next';
import { CATEGORIES } from '@/app/lib/categories';
import { generatePageMetadata } from '@/app/lib/seo';
import CategoryPageTemplate from '@/app/components/CategoryPageTemplate';

const config = CATEGORIES.currencies;

export const metadata: Metadata = generatePageMetadata(config);

export default function CurrenciesPage() {
  return <CategoryPageTemplate config={config} />;
}
