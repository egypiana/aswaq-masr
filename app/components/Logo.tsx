import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 text-2xl font-bold">
      <span className="bg-brand-red text-white px-2 py-0.5 rounded">أسعار</span>
      <span className="text-brand-gold">وأسواق</span>
    </Link>
  );
}
