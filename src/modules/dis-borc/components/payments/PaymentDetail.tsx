import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarIcon, Plus, Trash2, ArrowLeft, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useInvoice } from '@/modules/dis-borc/hooks/useInvoices';
import { usePayments, useCreatePayment, useDeletePayment } from '@/modules/dis-borc/hooks/usePayments';
import { cn } from '@/lib/utils';
import { PAYMENT_METHOD_LABELS, STATUS_LABELS, type PaymentMethod } from '@/modules/dis-borc/types/database';
import { exportPaymentsToExcel } from '@/modules/dis-borc/lib/exportToExcel';
import { toast } from 'sonner';
import { paymentSchema, type PaymentFormData } from '@/modules/dis-borc/lib/validationSchemas';

interface PaymentDetailProps { invoiceId: string; onBack: () => void; }

export function PaymentDetail({ invoiceId, onBack }: PaymentDetailProps) {
  const { data: invoice } = useInvoice(invoiceId);
  const { data: payments } = usePayments(invoiceId);
  const createPayment = useCreatePayment();
  const deletePayment = useDeletePayment();
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PaymentFormData>({ resolver: zodResolver(paymentSchema), defaultValues: { payment_date: new Date(), payment_method: 'cash' } });
  const selectedDate = watch('payment_date');
  const selectedMethod = watch('payment_method');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      if (Number(data.amount) > Number(invoice?.remaining_amount || 0)) { toast.error('Ödeme tutarı kalan borçtan fazla olamaz'); return; }
      await createPayment.mutateAsync({ invoice_id: invoiceId, amount: Number(data.amount), payment_date: format(data.payment_date, 'yyyy-MM-dd'), payment_method: data.payment_method, paid_by: data.paid_by, notes: data.notes || null });
      toast.success('Ödeme kaydedildi'); setIsOpen(false); reset({ payment_date: new Date(), payment_method: 'cash' });
    } catch { toast.error('Hata oluştu'); }
  };
  const handleDeletePayment = async (paymentId: string) => { if (confirm('Bu ödemeyi silmek istediğinize emin misiniz?')) { await deletePayment.mutateAsync({ id: paymentId, invoiceId }); toast.success('Ödeme silindi'); } };
  const handleExport = () => { if (payments) { exportPaymentsToExcel(payments, invoice?.invoice_number || undefined); toast.success('Excel dosyası indiriliyor'); } };

  if (!invoice) return <div className="text-center py-8">Yükleniyor...</div>;
  const statusColors: Record<string, string> = { paid: 'bg-green-100 text-green-800', partial: 'bg-blue-100 text-blue-800', pending: 'bg-yellow-100 text-yellow-800', overdue: 'bg-red-100 text-red-800' };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Geri</Button><h2 className="text-xl font-semibold">Ödeme Detayları</h2></div>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div><CardTitle className="text-lg">{invoice.invoice_number || 'Faturasız Alım'}</CardTitle><CardDescription>{invoice.supplier?.name || 'Bilinmeyen Tedarikçi'}</CardDescription></div>
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', statusColors[invoice.status])}>{STATUS_LABELS[invoice.status]}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-sm text-muted-foreground">Açıklama</p><p className="font-medium">{invoice.description}</p></div>
            <div><p className="text-sm text-muted-foreground">Toplam Tutar</p><p className="font-medium text-lg">{formatCurrency(invoice.total_amount)}</p></div>
            <div><p className="text-sm text-muted-foreground">Kalan Tutar</p><p className="font-medium text-lg text-primary">{formatCurrency(invoice.remaining_amount)}</p></div>
            <div><p className="text-sm text-muted-foreground">Son Ödeme Tarihi</p><p className="font-medium">{format(new Date(invoice.due_date), 'd MMMM yyyy', { locale: tr })}</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ödeme Geçmişi</h3>
        <div className="flex items-center gap-2">
          {payments && payments.length > 0 && <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Excel</Button>}
          {invoice.status !== 'paid' && <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4 mr-2" />Ödeme Ekle</Button>}
        </div>
      </div>
      {payments && payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((payment: any, index: number) => (
            <Card key={payment.id}><CardContent className="py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-6"><div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">{payments.length - index}</div><div><p className="font-semibold text-lg">{formatCurrency(Number(payment.amount))}</p><p className="text-sm text-muted-foreground">{format(new Date(payment.payment_date), 'd MMMM yyyy', { locale: tr })}</p></div><div className="border-l pl-6"><Badge variant="outline">{PAYMENT_METHOD_LABELS[payment.payment_method as keyof typeof PAYMENT_METHOD_LABELS]}</Badge><p className="text-sm text-muted-foreground mt-1">Ödeyen: {payment.paid_by}</p></div>{payment.notes && <div className="border-l pl-6"><p className="text-sm text-muted-foreground">{payment.notes}</p></div>}</div><Button variant="ghost" size="icon" onClick={() => handleDeletePayment(payment.id)}><Trash2 className="h-4 w-4" /></Button></div></CardContent></Card>
          ))}
        </div>
      ) : (<Card><CardContent className="py-8 text-center text-muted-foreground">Henüz ödeme kaydı bulunmuyor</CardContent></Card>)}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Yeni Ödeme Ekle</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-3 bg-muted rounded-md"><p className="text-sm text-muted-foreground">Kalan Borç</p><p className="text-xl font-bold text-primary">{formatCurrency(invoice.remaining_amount)}</p></div>
            <div className="space-y-2"><Label>Ödeme Tutarı (₺) *</Label><Input type="number" step="0.01" max={invoice.remaining_amount} {...register('amount')} />{errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}</div>
            <div className="space-y-2"><Label>Ödeme Tarihi *</Label><Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{selectedDate ? format(selectedDate, 'PPP', { locale: tr }) : 'Tarih seçin'}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setValue('payment_date', date)} initialFocus /></PopoverContent></Popover></div>
            <div className="space-y-2"><Label>Ödeme Yöntemi *</Label><Select value={selectedMethod} onValueChange={(val) => setValue('payment_method', val as PaymentMethod)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (<SelectItem key={value} value={value}>{label}</SelectItem>))}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Ödeyen Kişi *</Label><Input {...register('paid_by')} maxLength={200} />{errors.paid_by && <p className="text-sm text-destructive">{errors.paid_by.message}</p>}</div>
            <div className="space-y-2"><Label>Notlar</Label><Textarea {...register('notes')} maxLength={2000} /></div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>İptal</Button><Button type="submit">Kaydet</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
