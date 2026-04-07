import { CategoryConfig, FAQ } from '@/app/lib/types';
import type { Metadata } from 'next';

const SITE_URL = 'https://aswaqmasr.com';
const SITE_NAME = 'أسعار وأسواق';

export function generatePageMetadata(config: CategoryConfig): Metadata {
  return {
    title: `${config.titleAr} | ${SITE_NAME}`,
    description: config.descriptionAr,
    openGraph: {
      title: `${config.titleAr} | ${SITE_NAME}`,
      description: config.descriptionAr,
      url: `${SITE_URL}/${config.slug}`,
      siteName: SITE_NAME,
      locale: 'ar_EG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${config.titleAr} | ${SITE_NAME}`,
      description: config.descriptionAr,
    },
    alternates: {
      canonical: `${SITE_URL}/${config.slug}`,
    },
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(categoryName: string, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'الرئيسية',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: `${SITE_URL}/${slug}`,
      },
    ],
  };
}
