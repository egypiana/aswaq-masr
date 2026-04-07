export function formatPrice(price: number): string {
  return price.toLocaleString('ar-EG');
}

export function formatPriceWithCurrency(price: number, unit: string): string {
  return `${formatPrice(price)} ${unit}`;
}

export function getDirectionArrow(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up': return '▲';
    case 'down': return '▼';
    default: return '—';
  }
}

export function getDirectionColor(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up': return 'text-up';
    case 'down': return 'text-down';
    default: return 'text-gray-400';
  }
}

export function getFlashClass(direction: 'up' | 'down' | 'stable'): string {
  switch (direction) {
    case 'up': return 'animate-flash-up';
    case 'down': return 'animate-flash-down';
    default: return '';
  }
}

export function formatArabicDate(date: Date): string {
  return date.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
