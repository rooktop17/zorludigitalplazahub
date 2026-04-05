import { useState } from 'react';
import { useQuoteForm } from '@/modules/quote-creator/hooks/useQuoteForm';
import { QuoteHeader } from './QuoteHeader';
import { QuoteActions } from './QuoteActions';
import { QuoteTable } from './QuoteTable';
import { QuoteSummary } from './QuoteSummary';
import { QuoteFooter } from './QuoteFooter';
import { PrintPreview } from './PrintPreview';

export function QuoteForm() {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const {
    quoteData, calculations, updateQuoteField, updateCustomerField,
    addRow, updateRow, deleteRow, saveToStorage, loadFromStorage,
    exportToJson, importFromJson, clearForm,
  } = useQuoteForm();

  return (
    <>
      <div className="min-h-screen bg-background py-6 px-4 print:py-0 print:px-0">
        <div className="max-w-[1100px] mx-auto print-full-width">
          <div className="bg-card rounded-2xl border border-border shadow-card print:border-0 print:shadow-none print:rounded-none">
            <div className="p-4 sm:p-6">
              <QuoteHeader quoteData={quoteData} onQuoteFieldChange={updateQuoteField} onCustomerFieldChange={updateCustomerField} />
              <QuoteActions onAddRow={addRow} onSave={saveToStorage} onLoad={loadFromStorage} onExport={exportToJson} onImport={importFromJson} onClear={clearForm} onPrintPreview={() => setShowPrintPreview(true)} />
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
    </>
  );
}
