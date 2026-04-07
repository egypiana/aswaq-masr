'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { NAV_ITEMS } from '@/app/lib/categories';
import { formatArabicDate } from '@/app/lib/utils';

const QUICK_LINKS = [
  { label: 'سعر الذهب اليوم', href: '/gold' },
  { label: 'سعر الدولار', href: '/dollar' },
  { label: 'سعر الحديد', href: '/iron' },
  { label: 'سعر الأسمنت', href: '/cement' },
  { label: 'سعر البنزين', href: '/fuel' },
  { label: 'سعر اليورو', href: '/currencies' },
  { label: 'سعر الريال السعودي', href: '/currencies' },
  { label: 'سعر الفضة', href: '/silver' },
  { label: 'جنيه الذهب', href: '/gold' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Navy Bar */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile: Logo + Hamburger */}
          <div className="flex items-center justify-between py-3 lg:hidden">
            <Logo />
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 hover:bg-white/10 rounded-lg"
                aria-label="القائمة"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop: Full Header */}
          <div className="hidden lg:flex items-center justify-between py-3">
            <div className="flex items-center gap-6">
              <Logo />
              <span className="text-sm text-gray-300">{formatArabicDate(new Date())}</span>
            </div>

            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => 'children' in item && setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm flex items-center gap-1"
                  >
                    {item.label}
                    {'children' in item && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                  {'children' in item && openDropdown === item.href && (
                    <div className="absolute top-full right-0 mt-0 bg-navy border border-white/10 rounded-lg shadow-xl min-w-48 py-1 z-50">
                      {(item as typeof item & { children: { label: string; href: string }[] }).children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp hover:bg-whatsapp/90 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                انضم لقناتنا
              </a>
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <nav className="lg:hidden pb-4 border-t border-white/10 pt-3">
              {NAV_ITEMS.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-3 py-2 hover:bg-white/10 rounded-lg text-sm"
                    onClick={() => !('children' in item) && setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {'children' in item && (
                    <div className="pr-6">
                      {(item as typeof item & { children: { label: string; href: string }[] }).children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-1.5 text-sm text-gray-300 hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="block mx-3 mt-3 bg-whatsapp hover:bg-whatsapp/90 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
              >
                انضم لقناتنا على واتساب
              </a>
            </nav>
          )}
        </div>
      </div>

      {/* Red Bottom Bar */}
      <div className="bg-brand-red text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide flex-1">
            <span className="text-sm font-bold whitespace-nowrap">الأكثر بحثاً:</span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {QUICK_LINKS.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="text-xs whitespace-nowrap bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Icons - Far Left */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            <a href="#" aria-label="YouTube" className="hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" aria-label="X/Twitter" className="hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="Telegram" className="hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="#" aria-label="RSS" className="hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-8.18v4.819c12.951.115 23.357 10.71 23.497 23.625h4.503c-.145-15.733-12.921-28.472-28-28.444z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
