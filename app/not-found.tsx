import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-bg-dark px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-red mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">الصفحة غير موجودة</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="bg-brand-red hover:bg-brand-red/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
