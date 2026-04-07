import Link from 'next/link';

interface BreadcrumbProps {
  categoryName: string;
}

export default function Breadcrumb({ categoryName }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      <Link href="/" className="hover:text-brand-red transition-colors">الرئيسية</Link>
      <span>/</span>
      <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
    </nav>
  );
}
