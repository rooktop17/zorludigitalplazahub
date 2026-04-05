import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Save, Upload, Download, FileUp, Printer, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuoteActionsProps {
  onAddRow: () => void;
  onSave: () => boolean;
  onLoad: () => boolean;
  onExport: () => void;
  onImport: (file: File) => Promise<boolean>;
  onClear: () => void;
  onPrintPreview: () => void;
}

export function QuoteActions({ onAddRow, onSave, onLoad, onExport, onImport, onClear, onPrintPreview }: QuoteActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="no-print">
      <div className="flex flex-wrap items-center gap-2 mt-5">
        <Button onClick={onAddRow} className="bg-gold text-accent-foreground hover:bg-gold/90"><Plus className="w-4 h-4 mr-1" />Satır Ekle</Button>
        <Button onClick={() => { if (onSave()) toast.success('Kaydedildi'); }} variant="outline"><Save className="w-4 h-4 mr-1" />Yerel Kaydet</Button>
        <Button onClick={() => { if (onLoad()) toast.success('Yüklendi'); else toast.error('Kayıt bulunamadı'); }} variant="outline"><Upload className="w-4 h-4 mr-1" />Yerel Yükle</Button>
        <Button onClick={onExport} variant="outline"><Download className="w-4 h-4 mr-1" />JSON</Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="outline"><FileUp className="w-4 h-4 mr-1" />İçe Aktar</Button>
        <Button onClick={onPrintPreview} variant="outline"><Printer className="w-4 h-4 mr-1" />Önizle & Yazdır</Button>
        <Button onClick={() => { if (window.confirm('Formu temizlemek istiyor musunuz?')) { onClear(); toast.info('Form temizlendi'); } }} variant="destructive"><Trash2 className="w-4 h-4 mr-1" />Temizle</Button>
      </div>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0];
        if (file) { const ok = await onImport(file); if (ok) toast.success('JSON içe aktarıldı'); else toast.error('JSON okunamadı'); }
        e.target.value = '';
      }} />
    </div>
  );
}
