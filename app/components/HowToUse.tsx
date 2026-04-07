import { HowToStep } from '@/app/lib/types';

interface HowToUseProps {
  steps: HowToStep[];
  categoryName: string;
}

export default function HowToUse({ steps, categoryName }: HowToUseProps) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        كيفية استخدام صفحة {categoryName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.step}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4"
          >
            <div className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center text-sm font-bold mb-3">
              {step.step}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
