export interface Supplier {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string | null;
  supplier_id: string | null;
  supplier_name: string | null;
  description: string;
  total_amount: number;
  remaining_amount: number;
  currency: string;
  due_date: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  has_invoice: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'check' | 'wire_transfer';
  paid_by: string;
  notes: string | null;
  created_at: string;
}

export type PaymentMethod = Payment['payment_method'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Nakit',
  bank_transfer: 'Banka Transferi',
  credit_card: 'Kredi Kartı',
  check: 'Çek',
  wire_transfer: 'Havale',
};

export const STATUS_LABELS: Record<Invoice['status'], string> = {
  pending: 'Beklemede',
  partial: 'Kısmi Ödendi',
  paid: 'Ödendi',
  overdue: 'Vadesi Geçti',
};
