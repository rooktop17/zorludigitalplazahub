import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord, MonthlyReport } from '@/modules/maas-kesinti/types/payment';
import { toast } from 'sonner';

export function usePaymentHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('mk_payments')
        .select('*')
        .order('paid_at', { ascending: false });

      if (error) throw error;

      const mappedPayments: PaymentRecord[] = (data || []).map((p: any) => ({
        id: p.id,
        employeeId: p.employee_id,
        employeeName: p.employee_name,
        month: p.month,
        baseSalary: Number(p.base_salary),
        totalAdvances: Number(p.total_advances),
        netPayment: Number(p.net_payment),
        paidAt: p.paid_at,
      }));

      setPayments(mappedPayments);
    } catch (error) {
      console.error('Ödeme geçmişi yükleme hatası:', error);
      toast.error('Ödeme geçmişi yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const addBulkPayments = async (newPayments: Omit<PaymentRecord, 'id'>[]) => {
    try {
      const insertData = newPayments.map(p => ({
        employee_id: p.employeeId,
        employee_name: p.employeeName,
        month: p.month,
        base_salary: p.baseSalary,
        total_advances: p.totalAdvances,
        net_payment: p.netPayment,
        paid_at: p.paidAt,
      }));

      const { data, error } = await supabase
        .from('mk_payments')
        .insert(insertData as any)
        .select();

      if (error) throw error;

      const mappedNewPayments: PaymentRecord[] = (data || []).map((p: any) => ({
        id: p.id,
        employeeId: p.employee_id,
        employeeName: p.employee_name,
        month: p.month,
        baseSalary: Number(p.base_salary),
        totalAdvances: Number(p.total_advances),
        netPayment: Number(p.net_payment),
        paidAt: p.paid_at,
      }));

      setPayments(prev => [...mappedNewPayments, ...prev]);
    } catch (error) {
      console.error('Toplu ödeme ekleme hatası:', error);
      toast.error('Ödemeler eklenirken hata oluştu');
    }
  };

  const getMonthlyReports = (): MonthlyReport[] => {
    const monthsMap = new Map<string, PaymentRecord[]>();
    payments.forEach(p => { monthsMap.set(p.month, [...(monthsMap.get(p.month) || []), p]); });
    const reports: MonthlyReport[] = [];
    monthsMap.forEach((mp, monthKey) => {
      const [year, month] = monthKey.split('-').map(Number);
      const date = new Date(year, month - 1);
      reports.push({
        month: monthKey,
        year,
        monthName: date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        totalEmployees: mp.length,
        totalSalaries: mp.reduce((s, p) => s + p.baseSalary, 0),
        totalAdvances: mp.reduce((s, p) => s + p.totalAdvances, 0),
        totalPaid: mp.reduce((s, p) => s + p.netPayment, 0),
        payments: mp,
      });
    });
    return reports.sort((a, b) => b.month.localeCompare(a.month));
  };

  const hasPaymentForMonth = (employeeId: string, month: string): boolean => {
    return payments.some(p => p.employeeId === employeeId && p.month === month);
  };

  return { payments, loading, addBulkPayments, getMonthlyReports, hasPaymentForMonth, refetch: fetchPayments };
}
