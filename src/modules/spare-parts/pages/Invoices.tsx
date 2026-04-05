import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { Plus, Trash2, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const Invoices: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ sale_id: '', customer_name: '', customer_address: '', customer_tax_id: '', subtotal: 0, tax_amount: 0, discount_amount: 0, total_amount: 0, notes: '' });

  const fetchInvoices = async () => { setLoading(true); let q = supabase.from('sp_invoices').select('*').order('created_at', { ascending: false }); if (search) q = q.ilike('customer_name', `%${search}%`); const { data } = await q; setInvoices(data || []); setLoading(false); };
  const fetchSales = async () => { const { data } = await supabase.from('sales').select('*').eq('status', 'completed').order('created_at', { ascending: false }); setSales(data || []); };
  useEffect(() => { fetchInvoices(); fetchSales(); }, [search]);

  const selectSale = (saleId: string) => { const sale = sales.find(s => s.id === saleId); if (!sale) return; setForm({ sale_id: saleId, customer_name: sale.customer_name, customer_address: '', customer_tax_id: '', subtotal: Number(sale.total_amount), tax_amount: Number(sale.tax), discount_amount: Number(sale.discount), total_amount: Number(sale.net_amount), notes: sale.notes || '' }); };

  const handleSave = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { error } = await supabase.from('sp_invoices').insert({ sale_id: form.sale_id || null, customer_name: form.customer_name, customer_address: form.customer_address, customer_tax_id: form.customer_tax_id, subtotal: form.subtotal, tax_amount: form.tax_amount, discount_amount: form.discount_amount, total_amount: form.total_amount, notes: form.notes, status: 'draft', user_id: currentUser?.id });
      if (error) throw error;
      toast({ title: t('common.success') }); setDialogOpen(false); fetchInvoices();
    } catch (err: any) { toast({ title: t('common.error'), description: err.message, variant: 'destructive' }); }
  };

  const deleteInvoice = async (id: string) => { if (!confirm(t('common.confirm'))) return; await supabase.from('sp_invoices').delete().eq('id', id); fetchInvoices(); };
  const updateStatus = async (id: string, status: string) => { await supabase.from('sp_invoices').update({ status }).eq('id', id); fetchInvoices(); };
  const statusColor = (s: string) => { if (s === 'paid') return 'bg-green-500/10 text-green-500'; if (s === 'sent') return 'bg-primary/10 text-primary'; if (s === 'draft') return 'bg-muted text-muted-foreground'; return 'bg-destructive/10 text-destructive'; };

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('invoices.title')}</h1>
          {isAdmin && <Button onClick={() => { setForm({ sale_id: '', customer_name: '', customer_address: '', customer_tax_id: '', subtotal: 0, tax_amount: 0, discount_amount: 0, total_amount: 0, notes: '' }); setDialogOpen(true); }}><Plus size={18} /> {t('invoices.newInvoice')}</Button>}
        </div>
        <div className="relative mb-6"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10 max-w-sm" /></div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>{t('invoices.invoiceNumber')}</TableHead><TableHead>{t('common.date')}</TableHead><TableHead>{t('sales.customer')}</TableHead><TableHead className="text-right">{t('invoices.totalAmount')}</TableHead><TableHead>{t('sales.status')}</TableHead><TableHead className="text-right">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t('common.loading')}</TableCell></TableRow>
              : invoices.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
              : invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.invoice_number}</TableCell>
                  <TableCell>{new Date(inv.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{inv.customer_name}</TableCell>
                  <TableCell className="text-right font-bold">₺{Number(inv.total_amount).toFixed(2)}</TableCell>
                  <TableCell>{isAdmin ? <Select value={inv.status} onValueChange={v => updateStatus(inv.id, v)}><SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">{t('invoices.draft')}</SelectItem><SelectItem value="sent">{t('invoices.sent')}</SelectItem><SelectItem value="paid">{t('invoices.paid')}</SelectItem><SelectItem value="cancelled">{t('invoices.cancelled')}</SelectItem></SelectContent></Select> : <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(inv.status)}`}>{t(`invoices.${inv.status}`)}</span>}</TableCell>
                  <TableCell className="text-right"><div className="flex justify-end gap-1">{isAdmin && <Button variant="ghost" size="icon" onClick={() => deleteInvoice(inv.id)}><Trash2 size={16} className="text-destructive" /></Button>}</div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t('invoices.newInvoice')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">{t('invoices.fromSale')}</label><Select value={form.sale_id} onValueChange={selectSale}><SelectTrigger><SelectValue placeholder={t('sales.selectPart')} /></SelectTrigger><SelectContent>{sales.map(s => <SelectItem key={s.id} value={s.id}>{s.customer_name} — ₺{Number(s.net_amount).toFixed(2)}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-sm font-medium">{t('sales.customer')}</label><Input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">{t('invoices.subtotal')}</label><Input type="number" value={form.subtotal} onChange={e => setForm({ ...form, subtotal: +e.target.value })} /></div>
              <div><label className="text-sm font-medium">{t('invoices.totalAmount')}</label><Input type="number" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: +e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button onClick={handleSave} disabled={!form.customer_name}>{t('common.save')}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Invoices;
