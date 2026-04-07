import type { Metadata } from 'next';
import BankRatesTable from '@/app/components/BankRatesTable';
import Breadcrumb from '@/app/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'سعر الريال السعودي اليوم في البنوك المصرية | أسعار وأسواق',
  description: 'تابع سعر الريال السعودي مقابل الجنيه المصري اليوم في جميع البنوك المصرية — شراء وبيع محدثة لحظياً.',
};

export default function SarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb categoryName="سعر الريال السعودي" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        🇸🇦 سعر الريال السعودي اليوم في البنوك المصرية
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
        أسعار صرف الريال السعودي مقابل الجنيه المصري — شراء وبيع في كل البنوك
      </p>
      <BankRatesTable currency="SAR" />
    </div>
  );
}
