import type { Invoice, Payment } from '@/modules/dis-borc/types/database';
import { PAYMENT_METHOD_LABELS, STATUS_LABELS } from '@/modules/dis-borc/types/database';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function formatDate(date: string): string {
  return format(new Date(date), 'dd.MM.yyyy', { locale: tr });
}

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportInvoicesToExcel(invoices: Invoice[]): void {
  const headers = ['Fatura No','Açıklama','Tedarikçi','Toplam Tutar','Kalan Tutar','Son Ödeme Tarihi','Durum','Faturalı','Notlar','Oluşturulma Tarihi'];
  const rows = invoices.map((inv) => [
    escapeCSV(inv.invoice_number), escapeCSV(inv.description), escapeCSV(inv.supplier?.name),
    formatCurrency(inv.total_amount), formatCurrency(inv.remaining_amount), formatDate(inv.due_date),
    STATUS_LABELS[inv.status], inv.has_invoice ? 'Evet' : 'Hayır', escapeCSV(inv.notes), formatDate(inv.created_at),
  ]);
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadCSV(csvContent, `faturalar_${format(new Date(), 'yyyy-MM-dd')}.csv`);
}

export function exportPaymentsToExcel(payments: Payment[], invoiceNumber?: string): void {
  const headers = ['Ödeme Tarihi','Tutar','Ödeme Yöntemi','Ödeyen','Notlar'];
  const rows = payments.map((pay) => [
    formatDate(pay.payment_date), formatCurrency(pay.amount),
    PAYMENT_METHOD_LABELS[pay.payment_method], escapeCSV(pay.paid_by), escapeCSV(pay.notes),
  ]);
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const filename = invoiceNumber
    ? `odemeler_${invoiceNumber}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    : `odemeler_${format(new Date(), 'yyyy-MM-dd')}.csv`;
  downloadCSV(csvContent, filename);
}

function downloadCSV(content: string, filename: string): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
