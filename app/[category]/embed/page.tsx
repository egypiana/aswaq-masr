import { notFound } from 'next/navigation';
import { CATEGORY_SLUGS, getCategoryConfig } from '@/app/lib/categories';
import EmbedPageTemplate from '@/app/components/EmbedPageTemplate';

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

export const metadata = {
  robots: 'noindex, nofollow',
};

interface EmbedPageProps {
  params: { category: string };
}

export default function EmbedPage({ params }: EmbedPageProps) {
  const config = getCategoryConfig(params.category);

  if (!config) {
    notFound();
  }

  return <EmbedPageTemplate config={config} />;
}
