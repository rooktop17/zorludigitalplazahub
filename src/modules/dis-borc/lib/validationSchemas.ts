import { z } from 'zod';

export const invoiceSchema = z.object({
  invoice_number: z.string().max(100, 'Fatura numarası en fazla 100 karakter olmalı').optional().nullable().or(z.literal('')),
  description: z.string().min(1, 'Açıklama gerekli').max(1000, 'Açıklama en fazla 1000 karakter olmalı'),
  supplier_name: z.string().max(200, 'Tedarikçi adı en fazla 200 karakter olmalı').optional().nullable().or(z.literal('')),
  total_amount: z.coerce.number().positive('Tutar pozitif olmalı').max(999999999, 'Tutar çok büyük'),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP']),
  due_date: z.date({ required_error: 'Son ödeme tarihi gerekli' }),
  has_invoice: z.boolean(),
  notes: z.string().max(2000, 'Notlar en fazla 2000 karakter olmalı').optional().nullable().or(z.literal('')),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const paymentSchema = z.object({
  amount: z.coerce.number().positive('Tutar pozitif olmalı').max(999999999, 'Tutar çok büyük'),
  payment_date: z.date({ required_error: 'Ödeme tarihi gerekli' }),
  payment_method: z.enum(['cash', 'bank_transfer', 'credit_card', 'check', 'wire_transfer']),
  paid_by: z.string().min(1, 'Ödeyen kişi gerekli').max(200, 'Ödeyen kişi en fazla 200 karakter olmalı'),
  notes: z.string().max(2000, 'Notlar en fazla 2000 karakter olmalı').optional().nullable().or(z.literal('')),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

export const supplierSchema = z.object({
  name: z.string().min(1, 'Şirket/Kişi adı gerekli').max(200, 'İsim en fazla 200 karakter olmalı'),
  contact_person: z.string().max(200, 'İletişim kişisi en fazla 200 karakter olmalı').optional().nullable().or(z.literal('')),
  phone: z.string().max(50, 'Telefon en fazla 50 karakter olmalı').optional().nullable().or(z.literal('')),
  email: z.string().email('Geçerli email adresi giriniz').max(200, 'Email en fazla 200 karakter olmalı').optional().nullable().or(z.literal('')),
  address: z.string().max(500, 'Adres en fazla 500 karakter olmalı').optional().nullable().or(z.literal('')),
  notes: z.string().max(2000, 'Notlar en fazla 2000 karakter olmalı').optional().nullable().or(z.literal('')),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
