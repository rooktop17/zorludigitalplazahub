import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Payment } from '@/modules/dis-borc/types/database';

export function usePayments(invoiceId?: string) {
  return useQuery({
    queryKey: ['db-payments', invoiceId],
    queryFn: async () => {
      let query = supabase.from('payments').select('*').order('payment_date', { ascending: false });
      if (invoiceId) query = query.eq('invoice_id', invoiceId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Payment[];
    },
    enabled: invoiceId !== undefined,
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ['db-all-payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payments').select('*').order('payment_date', { ascending: false });
      if (error) throw error;
      return data as Payment[];
    },
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payment: Omit<Payment, 'id' | 'created_at' | 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase.from('payments').insert({ ...payment, user_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['db-payments', variables.invoice_id] });
      queryClient.invalidateQueries({ queryKey: ['db-all-payments'] });
      queryClient.invalidateQueries({ queryKey: ['db-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['db-invoice', variables.invoice_id] });
      queryClient.invalidateQueries({ queryKey: ['db-dashboard-stats'] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, invoiceId }: { id: string; invoiceId: string }) => {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) throw error;
      return { invoiceId };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['db-payments', result.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ['db-all-payments'] });
      queryClient.invalidateQueries({ queryKey: ['db-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['db-invoice', result.invoiceId] });
      queryClient.invalidateQueries({ queryKey: ['db-dashboard-stats'] });
    },
  });
}
