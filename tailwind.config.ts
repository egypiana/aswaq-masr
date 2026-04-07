import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        'brand-red': '#D42B2B',
        'brand-gold': '#F5A623',
        up: '#16A34A',
        down: '#DC2626',
        whatsapp: '#25D366',
        'bg-dark': '#0F172A',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      animation: {
        'flash-up': 'flash-up 1s ease-in-out',
        'flash-down': 'flash-down 1s ease-in-out',
        'ticker': 'ticker 30s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        'flash-up': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(22, 163, 74, 0.2)' },
        },
        'flash-down': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(220, 38, 38, 0.2)' },
        },
        'ticker': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
