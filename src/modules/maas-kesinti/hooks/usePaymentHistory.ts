import { useState, useEffect } from 'react';
import { PaymentRecord, MonthlyReport } from '@/modules/maas-kesinti/types/payment';

const STORAGE_KEY = 'mk_payments';

function loadPayments(): PaymentRecord[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

function savePayments(payments: PaymentRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

export function usePaymentHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setPayments(loadPayments()); setLoading(false); }, []);

  const addBulkPayments = (newPayments: Omit<PaymentRecord, 'id'>[]) => {
    const withIds = newPayments.map(p => ({ ...p, id: crypto.randomUUID() }));
    const updated = [...withIds, ...payments];
    setPayments(updated);
    savePayments(updated);
  };

  const getMonthlyReports = (): MonthlyReport[] => {
    const monthsMap = new Map<string, PaymentRecord[]>();
    payments.forEach(p => { monthsMap.set(p.month, [...(monthsMap.get(p.month) || []), p]); });
    const reports: MonthlyReport[] = [];
    monthsMap.forEach((mp, monthKey) => {
      const [year, month] = monthKey.split('-').map(Number);
      const date = new Date(year, month - 1);
      reports.push({ month: monthKey, year, monthName: date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }), totalEmployees: mp.length, totalSalaries: mp.reduce((s, p) => s + p.baseSalary, 0), totalAdvances: mp.reduce((s, p) => s + p.totalAdvances, 0), totalPaid: mp.reduce((s, p) => s + p.netPayment, 0), payments: mp });
    });
    return reports.sort((a, b) => b.month.localeCompare(a.month));
  };

  const hasPaymentForMonth = (employeeId: string, month: string): boolean => {
    return payments.some(p => p.employeeId === employeeId && p.month === month);
  };

  return { payments, loading, addBulkPayments, getMonthlyReports, hasPaymentForMonth };
}
