import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/untypedClient';
import { addDays, isBefore, startOfDay } from 'date-fns';

export interface DashboardStats {
  totalDebt: number;
  overdueDebt: number;
  dueSoon: number;
  paidTotal: number;
  overdueCount: number;
  dueSoonCount: number;
  pendingCount: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['db-dashboard-stats'],
    queryFn: async () => {
      const { data: invoices, error } = await supabase.from('invoices').select('*');
      if (error) throw error;
      const today = startOfDay(new Date());
      const weekFromNow = addDays(today, 7);
      const stats: DashboardStats = { totalDebt: 0, overdueDebt: 0, dueSoon: 0, paidTotal: 0, overdueCount: 0, dueSoonCount: 0, pendingCount: 0 };
      invoices?.forEach((invoice) => {
        const dueDate = new Date(invoice.due_date);
        const remaining = Number(invoice.remaining_amount);
        const total = Number(invoice.total_amount);
        const paid = total - remaining;
        stats.paidTotal += paid;
        if (invoice.status === 'paid') return;
        stats.totalDebt += remaining;
        if (isBefore(dueDate, today)) { stats.overdueDebt += remaining; stats.overdueCount++; }
        else if (isBefore(dueDate, weekFromNow)) { stats.dueSoon += remaining; stats.dueSoonCount++; }
        else { stats.pendingCount++; }
      });
      return stats;
    },
  });
}

export function useMonthlyTrend() {
  return useQuery({
    queryKey: ['db-monthly-trend'],
    queryFn: async () => {
      const { data: invoices, error: invoicesError } = await supabase.from('invoices').select('*');
      const { data: payments, error: paymentsError } = await supabase.from('payments').select('*');
      if (invoicesError) throw invoicesError;
      if (paymentsError) throw paymentsError;
      const months: { month: string; debt: number; paid: number }[] = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let monthDebt = 0; let monthPaid = 0;
        invoices?.forEach((inv) => { const c = new Date(inv.created_at); if (c >= monthStart && c <= monthEnd) monthDebt += Number(inv.total_amount); });
        payments?.forEach((pay) => { const p = new Date(pay.payment_date); if (p >= monthStart && p <= monthEnd) monthPaid += Number(pay.amount); });
        months.push({ month: monthKey, debt: monthDebt, paid: monthPaid });
      }
      return months;
    },
  });
}

export function useSupplierDistribution() {
  return useQuery({
    queryKey: ['db-supplier-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select(`remaining_amount, supplier:suppliers(name)`).neq('status', 'paid');
      if (error) throw error;
      const distribution: Record<string, number> = {};
      data?.forEach((inv) => { const name = inv.supplier?.name || 'Bilinmeyen'; distribution[name] = (distribution[name] || 0) + Number(inv.remaining_amount); });
      return Object.entries(distribution).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
    },
  });
}
