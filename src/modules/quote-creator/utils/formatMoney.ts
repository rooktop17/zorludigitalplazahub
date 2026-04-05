import { Currency, CURRENCY_SYMBOLS } from '@/modules/quote-creator/types/quote';

export function formatMoney(value: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '';
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${symbol}`;
}
