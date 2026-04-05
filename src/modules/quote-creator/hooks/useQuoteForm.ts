import { useState, useCallback, useMemo, useEffect } from 'react';
import { QuoteData, QuoteRow, Currency } from '@/modules/quote-creator/types/quote';

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
          resolve(true);
        } catch { resolve(false); }
      };
      reader.readAsText(file);
    });
  }, []);

  const clearForm = useCallback(() => {
    setQuoteData(getDefaultQuoteData());
  }, []);

  return {
    quoteData, calculations, updateQuoteField, updateCustomerField,
    addRow, updateRow, deleteRow, saveToStorage, loadFromStorage,
    exportToJson, importFromJson, clearForm,
  };
}
