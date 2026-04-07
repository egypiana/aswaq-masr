export type CategorySlug = 'gold' | 'silver' | 'dollar' | 'currencies' | 'iron' | 'cement' | 'fuel';

export interface PriceItem {
  id: string;
  nameAr: string;
  unit: string;
  basePrice: number;
  fluctuationRange: number;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PracticalExample {
  title: string;
  description: string;
  defaultQuantity: number;
  unitLabel: string;
  relatedItemId: string;
}

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface CategoryConfig {
  slug: CategorySlug;
  nameAr: string;
  titleAr: string;
  descriptionAr: string;
  h1: string;
  icon: string;
  items: PriceItem[];
  seoArticle: string;
  faqs: FAQ[];
  practicalExamples: PracticalExample[];
  howToSteps: HowToStep[];
  embedTitle: string;
  calculatorLabel: string;
  calculatorUnit: string;
}

export interface PriceUpdate {
  id: string;
  nameAr: string;
  unit: string;
  icon: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
  timestamp: string;
}

export interface APIResponse {
  category: CategorySlug;
  items: PriceUpdate[];
  lastUpdated: string;
}

export interface AllPricesResponse {
  categories: Record<CategorySlug, PriceUpdate[]>;
  lastUpdated: string;
}
