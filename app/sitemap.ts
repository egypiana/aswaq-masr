import { MetadataRoute } from 'next';
import { CATEGORY_SLUGS } from '@/app/lib/categories';

const SITE_URL = 'https://aswaqmasr.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryPages = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...categoryPages,
  ];
}
