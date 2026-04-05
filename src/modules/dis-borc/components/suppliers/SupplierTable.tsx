import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from '@/modules/dis-borc/hooks/useSuppliers';
import { useInvoices } from '@/modules/dis-borc/hooks/useInvoices';
import type { Supplier } from '@/modules/dis-borc/types/database';
import { toast } from 'sonner';
import { supplierSchema, type SupplierFormData } from '@/modules/dis-borc/lib/validationSchemas';

interface SupplierTableProps { searchQuery: string; }

export function SupplierTable({ searchQuery }: SupplierTableProps) {
  const { data: suppliers, isLoading } = useSuppliers();
  const { data: invoices } = useInvoices();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SupplierFormData>({ resolver: zodResolver(supplierSchema) });
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const filteredSuppliers = suppliers?.filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()));
  const getSupplierDebt = (supplierId: string) => invoices?.filter((inv: any) => inv.supplier_id === supplierId && inv.status !== 'paid').reduce((sum: number, inv: any) => sum + Number(inv.remaining_amount), 0) || 0;

  const onSubmit = async (data: SupplierFormData) => {
    try {
      const supplierData = { name: data.name, contact_person: data.contact_person || null, phone: data.phone || null, email: data.email || null, address: data.address || null, notes: data.notes || null };
      if (editingSupplier) { await updateSupplier.mutateAsync({ id: editingSupplier.id, ...supplierData }); toast.success('Tedarikçi güncellendi'); }
      else { await createSupplier.mutateAsync(supplierData); toast.success('Tedarikçi eklendi'); }
      setIsOpen(false); setEditingSupplier(null); reset();
    } catch { toast.error('Hata oluştu'); }
  };

  const handleEdit = (supplier: Supplier) => { setEditingSupplier(supplier); setValue('name', supplier.name); setValue('contact_person', supplier.contact_person || ''); setValue('phone', supplier.phone || ''); setValue('email', supplier.email || ''); setValue('address', supplier.address || ''); setValue('notes', supplier.notes || ''); setIsOpen(true); };
  const handleDelete = async (id: string) => { if (confirm('Bu tedarikçiyi silmek istediğinize emin misiniz?')) { await deleteSupplier.mutateAsync(id); toast.success('Tedarikçi silindi'); } };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-muted-foreground" /><h2 className="text-lg font-semibold">Tedarikçiler</h2></div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingSupplier(null); reset(); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Yeni Tedarikçi</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingSupplier ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi Ekle'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2"><Label>Şirket/Kişi Adı *</Label><Input {...register('name')} maxLength={200} />{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>İletişim Kişisi</Label><Input {...register('contact_person')} maxLength={200} /></div>
                <div className="space-y-2"><Label>Telefon</Label><Input {...register('phone')} maxLength={50} /></div>
              </div>
              <div className="space-y-2"><Label>E-posta</Label><Input type="email" {...register('email')} maxLength={200} /></div>
              <div className="space-y-2"><Label>Adres</Label><Textarea {...register('address')} maxLength={500} /></div>
              <div className="space-y-2"><Label>Notlar</Label><Textarea {...register('notes')} maxLength={2000} /></div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>İptal</Button><Button type="submit">{editingSupplier ? 'Güncelle' : 'Ekle'}</Button></div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Şirket/Kişi</TableHead><TableHead>İletişim Kişisi</TableHead><TableHead>Telefon</TableHead><TableHead>E-posta</TableHead><TableHead className="text-right">Toplam Borç</TableHead><TableHead className="text-right">İşlemler</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? (<TableRow><TableCell colSpan={6} className="text-center py-8">Yükleniyor...</TableCell></TableRow>) : filteredSuppliers?.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Tedarikçi bulunamadı</TableCell></TableRow>) : (
              filteredSuppliers?.map((supplier: any) => {
                const debt = getSupplierDebt(supplier.id);
                return (<TableRow key={supplier.id}><TableCell className="font-medium">{supplier.name}</TableCell><TableCell>{supplier.contact_person || '-'}</TableCell><TableCell>{supplier.phone || '-'}</TableCell><TableCell>{supplier.email || '-'}</TableCell><TableCell className="text-right font-medium text-primary">{formatCurrency(debt)}</TableCell><TableCell className="text-right"><div className="flex items-center justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>);
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
