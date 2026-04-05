import { useState, useEffect } from 'react';
import { useQuoteForm } from '@/modules/quote-creator/hooks/useQuoteForm';
import { QuoteHeader } from './QuoteHeader';
import { QuoteActions } from './QuoteActions';
import { QuoteTable } from './QuoteTable';
import { QuoteSummary } from './QuoteSummary';
import { QuoteFooter } from './QuoteFooter';
import { PrintPreview } from './PrintPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, FileText } from 'lucide-react';

export function QuoteForm() {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showSavedQuotes, setShowSavedQuotes] = useState(false);
  const {
    quoteData, calculations, updateQuoteField, updateCustomerField,
    addRow, updateRow, deleteRow, saveToStorage, loadFromStorage,
    exportToJson, importFromJson, clearForm,
    saveToDatabase, fetchSavedQuotes, loadFromDatabase, deleteFromDatabase,
    savedQuotes, loadingQuotes, currentQuoteId,
  } = useQuoteForm();

  useEffect(() => {
    if (showSavedQuotes) fetchSavedQuotes();
  }, [showSavedQuotes, fetchSavedQuotes]);

  return (
    <>
      <div className="min-h-screen bg-background py-6 px-4 print:py-0 print:px-0">
        <div className="max-w-[1100px] mx-auto print-full-width">
          {currentQuoteId && (
            <div className="mb-2 text-xs text-muted-foreground">
              Düzenlenen teklif ID: {currentQuoteId.slice(0, 8)}…
            </div>
          )}
          <div className="bg-card rounded-2xl border border-border shadow-card print:border-0 print:shadow-none print:rounded-none">
            <div className="p-4 sm:p-6">
              <QuoteHeader quoteData={quoteData} onQuoteFieldChange={updateQuoteField} onCustomerFieldChange={updateCustomerField} />
              <QuoteActions
                onAddRow={addRow} onSave={saveToStorage} onLoad={loadFromStorage}
                onExport={exportToJson} onImport={importFromJson} onClear={clearForm}
                onPrintPreview={() => setShowPrintPreview(true)}
                onSaveToDb={saveToDatabase}
                onShowSavedQuotes={() => setShowSavedQuotes(true)}
              />
            </div>
            <div className="p-4 sm:p-6 pt-0 sm:pt-0">
              <QuoteTable rows={quoteData.rows} currency={quoteData.currency} onUpdateRow={updateRow} onDeleteRow={deleteRow} onAddRow={addRow} />
              <QuoteSummary quoteData={quoteData} calculations={calculations} onQuoteFieldChange={updateQuoteField} />
              <QuoteFooter currency={quoteData.currency} />
            </div>
          </div>
        </div>
      </div>
      {showPrintPreview && (
        <PrintPreview quoteData={quoteData} calculations={calculations} onClose={() => setShowPrintPreview(false)} />
      )}
      <Dialog open={showSavedQuotes} onOpenChange={setShowSavedQuotes}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Kayıtlı Teklifler</DialogTitle></DialogHeader>
          {loadingQuotes ? (
            <p className="text-center py-8 text-muted-foreground">Yükleniyor...</p>
          ) : savedQuotes.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Henüz kayıtlı teklif yok.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teklif No</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead className="text-right">Tutar</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedQuotes.map((q: any) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-mono text-sm">{q.quote_no}</TableCell>
                    <TableCell>{q.customer_name}</TableCell>
                    <TableCell>{new Date(q.quote_date).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell className="text-right font-bold">₺{Number(q.total_amount).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={async () => { await loadFromDatabase(q.id); setShowSavedQuotes(false); }}>
                          <FileText size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { if (confirm('Bu teklifi silmek istiyor musunuz?')) deleteFromDatabase(q.id); }}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
