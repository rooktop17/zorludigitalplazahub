import { useState, useCallback, useMemo } from 'react';
import { QuoteData, QuoteRow, Currency } from '@/modules/quote-creator/types/quote';
import { supabase } from '@/integrations/supabase/untypedClient';
import { toast } from 'sonner';

const STORAGE_KEY = 'zorlu_teklif_formu_v1';
function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getTodayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 10);
}

function getDefaultRow(): QuoteRow {
  return { id: generateId(), brand: 'Samsung', category: 'Televizyon', model: '', qty: 1, price: 0, discount: 0 };
}

function getDefaultQuoteData(): QuoteData {
  return {
    quoteNo: 'ZDP-0001',
    quoteDate: getTodayISO(),
    currency: 'TRY',
    customer: { name: '', phone: '', email: '', address: '' },
    notes: '',
    vatRate: 0,
    vatIncluded: false,
    globalDiscount: 0,
    rows: [getDefaultRow()],
  };
}

export function useQuoteForm() {
  const [quoteData, setQuoteData] = useState<QuoteData>(getDefaultQuoteData);
  const [savedQuotes, setSavedQuotes] = useState<any[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);

  const updateQuoteField = useCallback(<K extends keyof QuoteData>(field: K, value: QuoteData[K]) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateCustomerField = useCallback((field: keyof QuoteData['customer'], value: string) => {
    setQuoteData(prev => ({ ...prev, customer: { ...prev.customer, [field]: value } }));
  }, []);

  const addRow = useCallback(() => {
    setQuoteData(prev => ({ ...prev, rows: [...prev.rows, getDefaultRow()] }));
  }, []);

  const updateRow = useCallback((id: string, updates: Partial<QuoteRow>) => {
    setQuoteData(prev => ({ ...prev, rows: prev.rows.map(row => row.id === id ? { ...row, ...updates } : row) }));
  }, []);

  const deleteRow = useCallback((id: string) => {
    setQuoteData(prev => ({ ...prev, rows: prev.rows.filter(row => row.id !== id) }));
  }, []);

  const calculations = useMemo(() => {
    const grossTotal = quoteData.rows.reduce((sum, row) => sum + row.qty * row.price, 0);
    const rowDiscountTotal = quoteData.rows.reduce((sum, row) => sum + row.qty * row.price * (row.discount / 100), 0);
    const subTotal = grossTotal - rowDiscountTotal;
    const vatAmount = subTotal * (quoteData.vatRate / 100);
    const globalDiscountAmount = subTotal * (quoteData.globalDiscount / 100);
    const grandTotal = subTotal - globalDiscountAmount + vatAmount;
    return { grossTotal, rowDiscountTotal, subTotal, vatAmount, globalDiscountAmount, grandTotal };
  }, [quoteData.rows, quoteData.vatRate, quoteData.globalDiscount]);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...quoteData, savedAt: new Date().toISOString() }));
    return true;
  }, [quoteData]);

  const loadFromStorage = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const data = JSON.parse(raw) as QuoteData;
      data.rows = data.rows.map(row => ({ ...row, id: row.id || generateId() }));
      setQuoteData(data);
      return true;
    } catch { return false; }
  }, []);

  // Save to Supabase
  const saveToDatabase = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Kaydetmek için giriş yapmalısınız'); return false; }

      const quotePayload = {
        user_id: user.id,
        quote_no: quoteData.quoteNo,
        quote_date: quoteData.quoteDate,
        currency: quoteData.currency,
        customer_name: quoteData.customer.name,
        customer_phone: quoteData.customer.phone,
        customer_email: quoteData.customer.email,
        customer_address: quoteData.customer.address,
        vat_rate: quoteData.vatRate,
        vat_included: quoteData.vatIncluded,
        global_discount: quoteData.globalDiscount,
        notes: quoteData.notes,
        total_amount: calculations.grandTotal,
        status: 'draft',
      };

      let quoteId = currentQuoteId;

      if (quoteId) {
        const { error } = await supabase.from('quotes').update(quotePayload).eq('id', quoteId);
        if (error) throw error;
        // Delete old items and re-insert
        await supabase.from('quote_items').delete().eq('quote_id', quoteId);
      } else {
        const { data, error } = await supabase.from('quotes').insert(quotePayload).select('id').single();
        if (error) throw error;
        quoteId = data.id;
        setCurrentQuoteId(quoteId);
      }

      // Insert quote items
      const items = quoteData.rows.map(row => ({
        quote_id: quoteId,
        brand: row.brand,
        custom_brand: row.customBrand || null,
        category: row.category,
        model: row.model,
        quantity: row.qty,
        price: row.price,
        discount: row.discount,
      }));
      const { error: itemsErr } = await supabase.from('quote_items').insert(items);
      if (itemsErr) throw itemsErr;

      toast.success('Teklif veritabanına kaydedildi');
      return true;
    } catch (err: any) {
      toast.error('Kayıt hatası: ' + err.message);
      return false;
    }
  }, [quoteData, calculations, currentQuoteId]);

  // Load saved quotes list
  const fetchSavedQuotes = useCallback(async () => {
    setLoadingQuotes(true);
    const { data } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
    setSavedQuotes(data || []);
    setLoadingQuotes(false);
  }, []);

  // Load a specific quote from DB
  const loadFromDatabase = useCallback(async (quoteId: string) => {
    try {
      const { data: quote } = await supabase.from('quotes').select('*').eq('id', quoteId).single();
      if (!quote) { toast.error('Teklif bulunamadı'); return false; }

      const { data: items } = await supabase.from('quote_items').select('*').eq('quote_id', quoteId);

      const rows: QuoteRow[] = (items || []).map((item: any) => ({
        id: generateId(),
        brand: item.brand,
        customBrand: item.custom_brand || undefined,
        category: item.category,
        model: item.model,
        qty: item.quantity,
        price: Number(item.price),
        discount: Number(item.discount),
      }));

      setQuoteData({
        quoteNo: quote.quote_no,
        quoteDate: quote.quote_date,
        currency: quote.currency as Currency,
        customer: {
          name: quote.customer_name,
          phone: quote.customer_phone || '',
          email: quote.customer_email || '',
          address: quote.customer_address || '',
        },
        notes: quote.notes || '',
        vatRate: Number(quote.vat_rate),
        vatIncluded: quote.vat_included,
        globalDiscount: Number(quote.global_discount),
        rows: rows.length > 0 ? rows : [getDefaultRow()],
      });
      setCurrentQuoteId(quoteId);
      toast.success('Teklif yüklendi');
      return true;
    } catch (err: any) {
      toast.error('Yükleme hatası: ' + err.message);
      return false;
    }
  }, []);

  const deleteFromDatabase = useCallback(async (quoteId: string) => {
    const { error } = await supabase.from('quotes').delete().eq('id', quoteId);
    if (error) { toast.error('Silme hatası'); return; }
    toast.success('Teklif silindi');
    if (currentQuoteId === quoteId) { setCurrentQuoteId(null); }
    fetchSavedQuotes();
  }, [currentQuoteId, fetchSavedQuotes]);

  const exportToJson = useCallback(() => {
    const data = { ...quoteData, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `zorlu-teklif-${(quoteData.quoteNo || 'taslak').replace(/[^a-z0-9_-]/gi, '')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [quoteData]);

  const importFromJson = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || '{}')) as QuoteData;
          data.rows = data.rows.map(row => ({ ...row, id: row.id || generateId() }));
          setQuoteData(data);
          setCurrentQuoteId(null);
          resolve(true);
        } catch { resolve(false); }
      };
      reader.readAsText(file);
    });
  }, []);

  const clearForm = useCallback(() => {
    setQuoteData(getDefaultQuoteData());
    setCurrentQuoteId(null);
  }, []);

  return {
    quoteData, calculations, updateQuoteField, updateCustomerField,
    addRow, updateRow, deleteRow, saveToStorage, loadFromStorage,
    exportToJson, importFromJson, clearForm,
    saveToDatabase, fetchSavedQuotes, loadFromDatabase, deleteFromDatabase,
    savedQuotes, loadingQuotes, currentQuoteId,
  };
}
