import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Invoice } from '@/modules/dis-borc/types/database';

export function useInvoices() {
  return useQuery({
    queryKey: ['db-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select(`*, supplier:suppliers(*)`).order('due_date', { ascending: true });
      if (error) throw error;
      return data as Invoice[];
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['db-invoice', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select(`*, supplier:suppliers(*)`).eq('id', id).maybeSingle();
      if (error) throw error;
      return data as Invoice | null;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'remaining_amount' | 'supplier' | 'user_id' | 'supplier_id'> & { supplier_id?: string | null }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase.from('invoices').insert({ ...invoice, user_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['db-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['db-dashboard-stats'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...invoice }: Partial<Invoice> & { id: string }) => {
      const { supplier, user_id, ...invoiceData } = invoice as any;
      const { data, error } = await supabase.from('invoices').update(invoiceData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['db-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['db-dashboard-stats'] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['db-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['db-dashboard-stats'] });
    },
  });
}
