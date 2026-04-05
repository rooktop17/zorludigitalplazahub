import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import { categories } from '@/modules/spare-parts/lib/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface Part { id: string; name: string; sku: string | null; category_id: string; brand: string; model: string | null; description: string | null; price: number; cost: number; stock: number; min_stock: number; image_url: string | null; }

const emptyPart = { name: '', sku: '', category_id: '', brand: '', model: '', description: '', price: 0, cost: 0, stock: 0, min_stock: 5, image_url: '' };

const Parts: React.FC = () => {
  const { t, lang } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Partial<Part> | null>(null);
  const [form, setForm] = useState(emptyPart);

  const fetchParts = async () => {
    setLoading(true);
    let query = supabase.from('parts').select('*').order('created_at', { ascending: false });
    if (categoryFilter !== 'all') query = query.eq('category_id', categoryFilter);
    if (brandFilter !== 'all') query = query.eq('brand', brandFilter);
    if (search) query = query.ilike('name', `%${search}%`);
    const { data } = await query;
    setParts((data as Part[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchParts(); }, [categoryFilter, brandFilter, search]);

  const handleSave = async () => {
    try {
      const payload = { name: form.name, sku: form.sku || null, category_id: form.category_id, brand: form.brand, model: form.model || null, description: form.description || null, price: form.price, cost: form.cost, stock: form.stock, min_stock: form.min_stock, image_url: form.image_url || null };
      if (editingPart?.id) {
        const { error } = await supabase.from('parts').update(payload).eq('id', editingPart.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('parts').insert(payload);
        if (error) throw error;
      }
      toast({ title: t('common.success') });
      setDialogOpen(false); setEditingPart(null); setForm(emptyPart); fetchParts();
    } catch (err: any) { toast({ title: t('common.error'), description: err.message, variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => { if (!confirm(t('parts.deleteConfirm'))) return; await supabase.from('parts').delete().eq('id', id); fetchParts(); };
  const openEdit = (part: Part) => { setEditingPart(part); setForm({ name: part.name, sku: part.sku || '', category_id: part.category_id, brand: part.brand, model: part.model || '', description: part.description || '', price: part.price, cost: part.cost, stock: part.stock, min_stock: part.min_stock, image_url: part.image_url || '' }); setDialogOpen(true); };
  const openNew = () => { setEditingPart({}); setForm(emptyPart); setDialogOpen(true); };

  const selectedCategory = categories.find(c => c.id === form.category_id);

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('parts.title')}</h1>
          {isAdmin && <Button onClick={openNew}><Plus size={18} /> {t('parts.addPart')}</Button>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder={t('common.search')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}><SelectTrigger className="w-48"><SelectValue placeholder={t('parts.category')} /></SelectTrigger><SelectContent><SelectItem value="all">{t('categories.all')}</SelectItem>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name[lang]}</SelectItem>)}</SelectContent></Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}><SelectTrigger className="w-48"><SelectValue placeholder={t('parts.brand')} /></SelectTrigger><SelectContent><SelectItem value="all">{t('categories.all')}</SelectItem>{(categoryFilter !== 'all' ? categories.find(c => c.id === categoryFilter)?.brands || [] : [...new Set(categories.flatMap(c => c.brands))].sort()).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>{t('parts.name')}</TableHead><TableHead>{t('parts.sku')}</TableHead><TableHead>{t('parts.brand')}</TableHead><TableHead>{t('parts.category')}</TableHead><TableHead className="text-right">{t('parts.price')}</TableHead><TableHead className="text-right">{t('parts.stock')}</TableHead>{isAdmin && <TableHead className="text-right">{t('common.actions')}</TableHead>}</TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={7} className="text-center py-8">{t('common.loading')}</TableCell></TableRow>
              : parts.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('common.noData')}</TableCell></TableRow>
              : parts.map(part => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium"><div className="flex items-center gap-2">{part.image_url && <img src={part.image_url} alt="" className="w-8 h-8 rounded object-cover" />}{part.name}</div></TableCell>
                  <TableCell className="font-mono text-xs">{part.sku}</TableCell>
                  <TableCell>{part.brand}</TableCell>
                  <TableCell>{categories.find(c => c.id === part.category_id)?.name[lang] || part.category_id}</TableCell>
                  <TableCell className="text-right">₺{Number(part.price).toFixed(2)}</TableCell>
                  <TableCell className="text-right"><span className={`inline-flex items-center gap-1 ${part.stock <= part.min_stock ? 'text-destructive' : ''}`}>{part.stock <= part.min_stock && <AlertTriangle size={14} />}{part.stock}</span></TableCell>
                  {isAdmin && <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(part)}><Edit2 size={16} /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)}><Trash2 size={16} className="text-destructive" /></Button></div></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPart?.id ? t('parts.editPart') : t('parts.addPart')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground">{t('parts.name')}</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-foreground">{t('parts.sku')}</label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="font-mono" /></div>
              <div><label className="text-sm font-medium text-foreground">{t('parts.category')}</label><Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v, brand: '' })}><SelectTrigger><SelectValue placeholder={t('parts.category')} /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name[lang]}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-foreground">{t('parts.brand')}</label><Select value={form.brand || undefined} onValueChange={v => setForm({ ...form, brand: v })}><SelectTrigger><SelectValue placeholder={t('parts.brand')} /></SelectTrigger><SelectContent>{form.category_id ? (selectedCategory?.brands || []).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>) : [...new Set(categories.flatMap(c => c.brands))].sort().map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
              <div><label className="text-sm font-medium text-foreground">{t('parts.model')}</label><Input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-foreground">{t('parts.price')}</label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
              <div><label className="text-sm font-medium text-foreground">{t('parts.cost')}</label><Input type="number" value={form.cost} onChange={e => setForm({ ...form, cost: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-foreground">{t('parts.stock')}</label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} /></div>
              <div><label className="text-sm font-medium text-foreground">{t('parts.minStock')}</label><Input type="number" value={form.min_stock} onChange={e => setForm({ ...form, min_stock: +e.target.value })} /></div>
            </div>
            <div><label className="text-sm font-medium text-foreground">{t('parts.description')}</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-input bg-card p-3 text-sm min-h-[80px] outline-none" /></div>
            <div><label className="text-sm font-medium text-foreground">Image URL</label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." /></div>
            <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button><Button onClick={handleSave} disabled={!form.name || !form.category_id || !form.brand}>{t('common.save')}</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Parts;
