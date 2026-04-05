import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface SaleItem { part_id: string; part_name: string; quantity: number; unit_price: number; total_price: number; }
interface Part { id: string; name: string; price: number; stock: number; }

const Sales: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [sales, setSales] = useState<any[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate] = useState(18);

  const fetchSales = async () => { setLoading(true); let q = supabase.from('sales').select('*').order('created_at', { ascending: false }); if (search) q = q.ilike('customer_name', `%${search}%`); const { data } = await q; setSales(data || []); setLoading(false); };
  const fetchParts = async () => { const { data } = await supabase.from('parts').select('id, name, price, stock').gt('stock', 0); setParts((data as Part[]) || []); };
  useEffect(() => { fetchSales(); fetchParts(); }, [search]);

  const addItem = (partId: string) => { const part = parts.find(p => p.id === partId); if (!part) return; const existing = items.find(i => i.part_id === partId); if (existing) { setItems(items.map(i => i.part_id === partId ? { ...i, quantity: i.quantity + 1, total_price: (i.quantity + 1) * i.unit_price } : i)); } else { setItems([...items, { part_id: partId, part_name: part.name, quantity: 1, unit_price: part.price, total_price: part.price }]); } };
  const removeItem = (partId: string) => setItems(items.filter(i => i.part_id !== partId));
  const subtotal = items.reduce((sum, i) => sum + i.total_price, 0);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const netAmount = subtotal - discount + taxAmount;

  const handleSave = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const { data: sale, error: saleErr } = await supabase.from('sales').insert({ customer_name: customer, customer_phone: customerPhone, customer_email: customerEmail, total_amount: subtotal, discount, tax: taxAmount, net_amount: netAmount, notes, status: 'completed', user_id: currentUser?.id }).select().single();
      if (saleErr) throw saleErr;
      const saleItems = items.map(i => ({ sale_id: sale.id, part_id: i.part_id, quantity: i.quantity, unit_price: i.unit_price, total_price: i.total_price }));
      const { error: itemsErr } = await supabase.from('sale_items').insert(saleItems);
      if (itemsErr) throw itemsErr;
      toast({ title: t('common.success') }); setDialogOpen(false); resetForm(); fetchSales(); fetchParts();
    } catch (err: any) { toast({ title: t('common.error'), description: err.message, variant: 'destructive' }); }
  };
  const resetForm = () => { setCustomer(''); setCustomerPhone(''); setCustomerEmail(''); setNotes(''); setItems([]); setDiscount(0); };
  const deleteSale = async (id: string) => { if (!confirm(t('common.confirm'))) return; await supabase.from('sales').delete().eq('id', id); fetchSales(); };
  const statusColor = (s: string) => { if (s === 'completed') return 'bg-green-500/10 text-green-500'; if (s === 'pending') return 'bg-yellow-500/10 text-yellow-500'; return 'bg-destructive/10 text-destructive'; };

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('sales.title')}</h1>
          {isAdmin && <Button onClick={() => setDialogOpen(true)}><Plus size={18} /> {t('sales.newSale')}</Button>}
        </div>
        <div className="relative mb-6"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10 max-w-sm" /></div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>{t('common.date')}</TableHead><TableHead>{t('sales.customer')}</TableHead><TableHead className="text-right">{t('sales.total')}</TableHead><TableHead className="text-right">{t('sales.netAmount')}</TableHead><TableHead>{t('sales.status')}</TableHead>{isAdmin && <TableHead className="text-right">{t('common.actions')}</TableHead>}</TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8">{t('common.loading')}</TableCell></TableRow>
              : sales.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
              : sales.map(sale => (
                <TableRow key={sale.id}>
                  <TableCell className="text-sm">{new Date(sale.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{sale.customer_name}</TableCell>
                  <TableCell className="text-right">₺{Number(sale.total_amount).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">₺{Number(sale.net_amount).toFixed(2)}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(sale.status)}`}>{t(`sales.${sale.status}`)}</span></TableCell>
                  {isAdmin && <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => deleteSale(sale.id)}><Trash2 size={16} className="text-destructive" /></Button></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t('sales.newSale')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label className="text-sm font-medium">{t('sales.customer')}</label><Input value={customer} onChange={e => setCustomer(e.target.value)} /></div>
              <div><label className="text-sm font-medium">{t('sales.customerPhone')}</label><Input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></div>
              <div><label className="text-sm font-medium">{t('sales.customerEmail')}</label><Input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} /></div>
            </div>
            <div><label className="text-sm font-medium">{t('sales.addItem')}</label><Select onValueChange={addItem}><SelectTrigger><SelectValue placeholder={t('sales.selectPart')} /></SelectTrigger><SelectContent>{parts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} — ₺{p.price} (Stok: {p.stock})</SelectItem>)}</SelectContent></Select></div>
            {items.length > 0 && (
              <Table><TableHeader><TableRow><TableHead>{t('parts.name')}</TableHead><TableHead className="text-right">{t('sales.quantity')}</TableHead><TableHead className="text-right">{t('sales.unitPrice')}</TableHead><TableHead className="text-right">{t('sales.total')}</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>{items.map(item => (
                <TableRow key={item.part_id}><TableCell>{item.part_name}</TableCell><TableCell className="text-right"><Input type="number" min={1} value={item.quantity} className="w-20 text-right ml-auto" onChange={e => setItems(items.map(i => i.part_id === item.part_id ? { ...i, quantity: +e.target.value, total_price: +e.target.value * i.unit_price } : i))} /></TableCell><TableCell className="text-right">₺{item.unit_price.toFixed(2)}</TableCell><TableCell className="text-right font-medium">₺{item.total_price.toFixed(2)}</TableCell><TableCell><Button variant="ghost" size="icon" onClick={() => removeItem(item.part_id)}><Trash2 size={14} className="text-destructive" /></Button></TableCell></TableRow>
              ))}</TableBody></Table>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium">{t('sales.discount')}</label><Input type="number" value={discount} onChange={e => setDiscount(+e.target.value)} /></div>
              <div><label className="text-sm font-medium">{t('sales.notes')}</label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>
            </div>
            <div className="bg-muted rounded-lg p-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>{t('invoices.subtotal')}:</span><span>₺{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>{t('sales.discount')}:</span><span>-₺{discount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>{t('sales.tax')} ({taxRate}%):</span><span>₺{taxAmount.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2"><span>{t('sales.netAmount')}:</span><span>₺{netAmount.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button onClick={handleSave} disabled={!customer || items.length === 0}>{t('common.save')}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Sales;
