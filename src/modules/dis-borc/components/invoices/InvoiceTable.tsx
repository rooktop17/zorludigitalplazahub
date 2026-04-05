import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Pencil, Trash2, Eye, Download, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from '@/modules/dis-borc/hooks/useInvoices';
import { cn } from '@/lib/utils';
import { STATUS_LABELS, type Invoice } from '@/modules/dis-borc/types/database';
import { exportInvoicesToExcel } from '@/modules/dis-borc/lib/exportToExcel';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';
import { invoiceSchema, type InvoiceFormData } from '@/modules/dis-borc/lib/validationSchemas';

interface InvoiceTableProps { searchQuery: string; onViewPayments: (invoiceId: string) => void; }
const CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP'] as const;
type Currency = typeof CURRENCIES[number];
const CURRENCY_LABELS: Record<Currency, string> = { TRY: '₺ TL', USD: '$ USD', EUR: '€ EUR', GBP: '£ GBP' };

export function InvoiceTable({ searchQuery, onViewPayments }: InvoiceTableProps) {
  const { data: invoices, isLoading } = useInvoices();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();
  const [isOpen, setIsOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<InvoiceFormData>({ resolver: zodResolver(invoiceSchema), defaultValues: { has_invoice: true, currency: 'TRY' } });
  const selectedDate = watch('due_date');
  const hasInvoice = watch('has_invoice');
  const formatCurrency = (amount: number, currency: string = 'TRY') => new Intl.NumberFormat('tr-TR', { style: 'currency', currency }).format(amount);
  const filteredInvoices = invoices?.filter((inv: any) => {
    const matchesSearch = inv.description.toLowerCase().includes(searchQuery.toLowerCase()) || inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) || inv.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase()) || inv.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Invoice['status']) => {
    const colors: Record<string, string> = { paid: 'bg-green-100 text-green-800', partial: 'bg-blue-100 text-blue-800', pending: 'bg-yellow-100 text-yellow-800', overdue: 'bg-red-100 text-red-800' };
    return <span className={cn('px-2 py-1 rounded-full text-xs font-medium', colors[status])}>{STATUS_LABELS[status]}</span>;
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const invoiceData = { invoice_number: data.invoice_number || null, description: data.description, supplier_name: data.supplier_name || null, total_amount: Number(data.total_amount), currency: data.currency, due_date: format(data.due_date, 'yyyy-MM-dd'), has_invoice: data.has_invoice, notes: data.notes || null, status: 'pending' as const };
      if (editingInvoice) { await updateInvoice.mutateAsync({ id: editingInvoice.id, ...invoiceData }); toast.success('Fatura güncellendi'); }
      else { await createInvoice.mutateAsync(invoiceData); toast.success('Fatura eklendi'); }
      setIsOpen(false); setEditingInvoice(null); reset();
    } catch { toast.error('Hata oluştu'); }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setValue('invoice_number', invoice.invoice_number || ''); setValue('description', invoice.description); setValue('supplier_name', invoice.supplier_name || '');
    setValue('total_amount', invoice.total_amount); setValue('currency', (invoice.currency as Currency) || 'TRY'); setValue('due_date', new Date(invoice.due_date));
    setValue('has_invoice', invoice.has_invoice); setValue('notes', invoice.notes || ''); setIsOpen(true);
  };
  const handleDelete = async (id: string) => { if (confirm('Bu faturayı silmek istediğinize emin misiniz?')) { await deleteInvoice.mutateAsync(id); toast.success('Fatura silindi'); } };
  const handleExport = () => { if (filteredInvoices) { exportInvoicesToExcel(filteredInvoices); toast.success('Excel dosyası indiriliyor'); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Durum filtrele" /></SelectTrigger><SelectContent><SelectItem value="all">Tümü</SelectItem><SelectItem value="pending">Beklemede</SelectItem><SelectItem value="partial">Kısmi Ödendi</SelectItem><SelectItem value="paid">Ödendi</SelectItem><SelectItem value="overdue">Vadesi Geçti</SelectItem></SelectContent></Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Excel</Button>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingInvoice(null); reset(); } }}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Yeni Fatura</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editingInvoice ? 'Fatura Düzenle' : 'Yeni Fatura Ekle'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Fatura No</Label><Input {...register('invoice_number')} placeholder="Opsiyonel" />{errors.invoice_number && <p className="text-sm text-destructive">{errors.invoice_number.message}</p>}</div>
                  <div className="space-y-2"><Label>Tedarikçi</Label><Input {...register('supplier_name')} placeholder="Tedarikçi adı" /></div>
                </div>
                <div className="space-y-2"><Label>Açıklama *</Label><Textarea {...register('description')} maxLength={1000} />{errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Toplam Tutar *</Label><div className="flex gap-2"><Input type="number" step="0.01" className="flex-1" {...register('total_amount')} /><Select onValueChange={(val) => setValue('currency', val as Currency)} value={watch('currency') || 'TRY'}><SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger><SelectContent>{CURRENCIES.map((c) => (<SelectItem key={c} value={c}>{CURRENCY_LABELS[c]}</SelectItem>))}</SelectContent></Select></div>{errors.total_amount && <p className="text-sm text-destructive">{errors.total_amount.message}</p>}</div>
                  <div className="space-y-2"><Label>Son Ödeme Tarihi *</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}><CalendarIcon className="mr-2 h-4 w-4" />{selectedDate ? format(selectedDate, 'PPP', { locale: tr }) : 'Tarih seçin'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setValue('due_date', date)} initialFocus /></PopoverContent></Popover></div>
                </div>
                <div className="flex items-center space-x-2"><Switch id="has_invoice" checked={hasInvoice} onCheckedChange={(checked) => setValue('has_invoice', checked)} /><Label htmlFor="has_invoice">Fatura mevcut</Label></div>
                <div className="space-y-2"><Label>Notlar</Label><Textarea {...register('notes')} maxLength={2000} /></div>
                <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>İptal</Button><Button type="submit">{editingInvoice ? 'Güncelle' : 'Ekle'}</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Fatura No</TableHead><TableHead>Tedarikçi</TableHead><TableHead>Açıklama</TableHead><TableHead className="text-right">Toplam</TableHead><TableHead className="text-right">Kalan</TableHead><TableHead>Son Ödeme</TableHead><TableHead>Durum</TableHead><TableHead className="text-right">İşlemler</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Yükleniyor...</TableCell></TableRow>) : filteredInvoices?.length === 0 ? (<TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Fatura bulunamadı</TableCell></TableRow>) : (
              filteredInvoices?.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number || '-'}{!invoice.has_invoice && <Badge variant="outline" className="ml-2 text-xs">Faturasız</Badge>}</TableCell>
                  <TableCell>{invoice.supplier_name || invoice.supplier?.name || '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{invoice.description}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(invoice.total_amount, invoice.currency)}</TableCell>
                  <TableCell className="text-right font-medium text-primary">{formatCurrency(invoice.remaining_amount, invoice.currency)}</TableCell>
                  <TableCell>{format(new Date(invoice.due_date), 'd MMM yyyy', { locale: tr })}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => onViewPayments(invoice.id)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
