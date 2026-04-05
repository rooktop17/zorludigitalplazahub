import { useState, useEffect } from 'react';
import { FileSpreadsheet, Calendar, Trash2, Loader2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Employee } from '@/modules/izin-takip/types/employee';
import { useLeaveRecords } from '@/modules/izin-takip/hooks/useLeaveRecords';

interface LeaveStatementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const LeaveStatementModal = ({ open, onOpenChange, employee }: LeaveStatementModalProps) => {
  const { records, loading, refetch, deleteRecord } = useLeaveRecords();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (open && employee) refetch(employee.id);
  }, [open, employee]);

  if (!employee) return null;

  const remainingLeave = employee.totalLeave - employee.usedLeave;

  const handleDelete = async (recordId: string) => {
    setDeletingId(recordId);
    await deleteRecord(recordId);
    if (employee) await refetch(employee.id);
    setDeletingId(null);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = records.map((record, index) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px">${index + 1}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px">${format(record.startDate, 'dd.MM.yyyy')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px">${format(record.endDate, 'dd.MM.yyyy')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:600;font-size:13px">${record.daysUsed}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px">${record.description || '-'}</td>
      </tr>`).join('');

    const totalUsed = records.reduce((sum, r) => sum + r.daysUsed, 0);

    printWindow.document.write(`<!DOCTYPE html><html><head><title>İzin Ekstresi - ${employee.name} ${employee.surname}</title>
      <style>@page{size:A4 portrait;margin:20mm}body{font-family:Arial,sans-serif;color:#1a1a1a;margin:0;padding:20px}.header{text-align:center;margin-bottom:24px;border-bottom:2px solid #1a1a1a;padding-bottom:16px}.header h1{font-size:18px;margin:0 0 4px 0}.header p{font-size:12px;color:#666;margin:0}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;font-size:13px}.info-item{display:flex;gap:8px}.info-label{font-weight:600;min-width:120px}.summary{display:flex;justify-content:space-around;background:#f3f4f6;padding:12px;border-radius:6px;margin-bottom:20px;font-size:13px}.summary-item{text-align:center}.summary-value{font-size:20px;font-weight:700}.summary-label{font-size:11px;color:#666}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#1a1a1a;color:white;padding:10px 12px;font-size:12px;text-align:center}th:last-child{text-align:left}.footer{text-align:center;font-size:11px;color:#999;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:12px}@media print{body{padding:0}}</style>
      </head><body>
        <div class="header"><h1>İZİN EKSTRESİ</h1><p>Zorlu Digital Plaza</p></div>
        <div class="info-grid">
          <div class="info-item"><span class="info-label">Ad Soyad:</span><span>${employee.name} ${employee.surname}</span></div>
          <div class="info-item"><span class="info-label">Departman:</span><span>${employee.department}</span></div>
          <div class="info-item"><span class="info-label">Düzenlenme Tarihi:</span><span>${format(new Date(), 'dd.MM.yyyy')}</span></div>
        </div>
        <div class="summary">
          <div class="summary-item"><div class="summary-value">${employee.totalLeave}</div><div class="summary-label">Toplam Hak</div></div>
          <div class="summary-item"><div class="summary-value">${totalUsed}</div><div class="summary-label">Kullanılan</div></div>
          <div class="summary-item"><div class="summary-value">${remainingLeave}</div><div class="summary-label">Kalan</div></div>
        </div>
        <table><thead><tr><th>#</th><th>Başlangıç</th><th>Bitiş</th><th>Gün</th><th style="text-align:left">Açıklama</th></tr></thead>
          <tbody>${tableRows || '<tr><td colspan="5" style="text-align:center;padding:20px;color:#999">Kayıt bulunamadı</td></tr>'}</tbody></table>
        <div class="footer">Bu belge ${format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: tr })} tarihinde oluşturulmuştur.</div>
      </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-0 shadow-elevated max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground"><FileSpreadsheet className="h-5 w-5 text-primary" />İzin Ekstresi</DialogTitle>
          <DialogDescription className="text-muted-foreground">{employee.name} {employee.surname} — {employee.department}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-primary/10 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-primary">{employee.totalLeave}</div><div className="text-xs text-muted-foreground">Toplam Hak</div></div>
          <div className="bg-yellow-500/10 rounded-lg p-3 text-center"><div className="text-2xl font-bold text-yellow-600">{employee.usedLeave}</div><div className="text-xs text-muted-foreground">Kullanılan</div></div>
          <div className={`rounded-lg p-3 text-center ${remainingLeave > 5 ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
            <div className={`text-2xl font-bold ${remainingLeave > 5 ? 'text-green-600' : 'text-destructive'}`}>{remainingLeave}</div>
            <div className="text-xs text-muted-foreground">Kalan</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto border border-border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 text-primary animate-spin" /><span className="ml-2 text-muted-foreground text-sm">Yükleniyor...</span></div>
          ) : records.length > 0 ? (
            <Table>
              <TableHeader><TableRow className="bg-muted/50">
                <TableHead className="text-center w-10">#</TableHead><TableHead className="text-center">Başlangıç</TableHead>
                <TableHead className="text-center">Bitiş</TableHead><TableHead className="text-center">Gün</TableHead>
                <TableHead>Açıklama</TableHead><TableHead className="w-10"></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/30">
                    <TableCell className="text-center text-muted-foreground text-xs">{index + 1}</TableCell>
                    <TableCell className="text-center text-sm"><div className="flex items-center justify-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{format(record.startDate, 'dd MMM yyyy', { locale: tr })}</div></TableCell>
                    <TableCell className="text-center text-sm">{format(record.endDate, 'dd MMM yyyy', { locale: tr })}</TableCell>
                    <TableCell className="text-center font-semibold text-sm">{record.daysUsed}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.description || '-'}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletingId === record.id}>
                            {deletingId === record.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>İzin Kaydını Sil</AlertDialogTitle>
                            <AlertDialogDescription>{format(record.startDate, 'dd MMM yyyy', { locale: tr })} - {format(record.endDate, 'dd MMM yyyy', { locale: tr })} tarihli {record.daysUsed} günlük izin kaydı silinecek.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Sil</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Calendar className="h-10 w-10 mb-3 opacity-30" /><p className="text-sm">Henüz izin kaydı bulunmuyor</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Toplam {records.length} kayıt</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Kapat</Button>
            <Button size="sm" onClick={handlePrint} disabled={records.length === 0}><Printer className="h-3.5 w-3.5 mr-1.5" />Yazdır</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveStatementModal;
