import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'أسعار وأسواق - أسعار اليوم في مصر لحظة بلحظة',
  description:
    'تابع أسعار الذهب والفضة والدولار والعملات والحديد والأسمنت والوقود في مصر لحظة بلحظة. أسعار محدثة كل دقيقة.',
  openGraph: {
    title: 'أسعار وأسواق - أسعار اليوم في مصر لحظة بلحظة',
    description:
      'تابع أسعار الذهب والفضة والدولار والعملات والحديد والأسمنت والوقود في مصر لحظة بلحظة.',
    locale: 'ar_EG',
    type: 'website',
    siteName: 'أسعار وأسواق',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <head>
        {/* Inline script to prevent dark mode FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-cairo bg-white dark:bg-bg-dark text-gray-900 dark:text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
