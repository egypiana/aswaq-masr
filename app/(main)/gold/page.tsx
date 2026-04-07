import { Metadata } from 'next';
import { CATEGORIES } from '@/app/lib/categories';
import { generatePageMetadata } from '@/app/lib/seo';
import CategoryPageTemplate from '@/app/components/CategoryPageTemplate';

const config = CATEGORIES.gold;

export const metadata: Metadata = generatePageMetadata(config);

export default function GoldPage() {
  return <CategoryPageTemplate config={config} />;
}
