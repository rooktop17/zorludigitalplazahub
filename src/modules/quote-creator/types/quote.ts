export interface QuoteRow {
  id: string;
  brand: string;
  customBrand?: string;
  category: string;
  model: string;
  qty: number;
  price: number;
  discount: number;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface QuoteData {
  quoteNo: string;
  quoteDate: string;
  currency: Currency;
  customer: Customer;
  notes: string;
  vatRate: number;
  vatIncluded: boolean;
  globalDiscount: number;
  rows: QuoteRow[];
  savedAt?: string;
}

export type Currency = 'TRY' | 'EUR' | 'GBP' | 'USD';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TRY: '₺',
  EUR: '€',
  GBP: '£',
  USD: '$',
};

export const BRANDS = [
  "Samsung", "LG", "Midea", "AUX", "Toshiba", "Philips", "Krups", "Sharp", "Diğer",
];

export const CATEGORIES = [
  "Televizyon", "Duvar Aparatı / Aksesuar", "Yedek Kumanda", "Ses Sistemi",
  "Bluetooth Hoparlör", "Bluetooth Kulaklık", "Soundbar", "Çamaşır Makinesi",
  "Kurutma Makinesi", "Bulaşık Makinesi", "Inverter Buzdolabı", "Derin Dondurucu",
  "Mini Bar", "Inverter Klima", "Smart Projeksiyon", "Su Sebili", "Air Fryer",
  "Multi Cooker", "Solo Mikrodalga", "Ankastre Ocak", "Ankastre Fırın",
  "Aspiratör / Davlumbaz", "Serinlik Fan", "Konvektör Isıtıcı",
];
