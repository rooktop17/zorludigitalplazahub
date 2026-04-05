import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Save } from 'lucide-react';
import { Employee } from '@/modules/izin-takip/types/employee';
import { format, eachDayOfInterval, isSunday, parse, isValid, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import zorluLogo from '@/assets/zorlu-logo.png';
import managerSignature from '@/assets/manager-signature.png';
import { useToast } from '@/hooks/use-toast';

const getOfficialHolidays = (year: number): Date[] => {
  const fixedHolidays = [
    new Date(year, 0, 1), new Date(year, 3, 23), new Date(year, 4, 9),
    new Date(year, 6, 15), new Date(year, 7, 30), new Date(year, 9, 29),
  ];
  const religiousHolidays: Record<number, Date[]> = {
    2024: [new Date(2024, 3, 10), new Date(2024, 3, 11), new Date(2024, 3, 12), new Date(2024, 5, 16), new Date(2024, 5, 17), new Date(2024, 5, 18), new Date(2024, 5, 19)],
    2025: [new Date(2025, 2, 30), new Date(2025, 2, 31), new Date(2025, 3, 1), new Date(2025, 5, 6), new Date(2025, 5, 7), new Date(2025, 5, 8), new Date(2025, 5, 9)],
    2026: [new Date(2026, 2, 20), new Date(2026, 2, 21), new Date(2026, 2, 22), new Date(2026, 4, 27), new Date(2026, 4, 28), new Date(2026, 4, 29), new Date(2026, 4, 30)],
    2027: [new Date(2027, 2, 9), new Date(2027, 2, 10), new Date(2027, 2, 11), new Date(2027, 4, 16), new Date(2027, 4, 17), new Date(2027, 4, 18), new Date(2027, 4, 19)],
  };
  return [...fixedHolidays, ...(religiousHolidays[year] || [])];
};

const isHoliday = (date: Date): boolean => {
  const holidays = getOfficialHolidays(date.getFullYear());
  return holidays.some(holiday => isSameDay(date, holiday));
};

const getHolidayName = (date: Date): string | null => {
  const month = date.getMonth();
  const day = date.getDate();
  if (month === 0 && day === 1) return 'Yılbaşı';
  if (month === 3 && day === 23) return 'Ulusal Egemenlik ve Çocuk Bayramı';
  if (month === 4 && day === 9) return '9 Mayıs';
  if (month === 6 && day === 15) return 'Demokrasi ve Milli Birlik Günü';
  if (month === 7 && day === 30) return 'Zafer Bayramı';
  if (month === 9 && day === 29) return 'Cumhuriyet Bayramı';
  const year = date.getFullYear();
  const religiousHolidays = getOfficialHolidays(year).slice(6);
  if (religiousHolidays.some(h => isSameDay(date, h))) {
    const ramazanDates: Record<number, number[]> = { 2024: [3], 2025: [2, 3], 2026: [2], 2027: [2] };
    if (ramazanDates[year]?.includes(month)) return 'Ramazan Bayramı';
    return 'Kurban Bayramı';
  }
  return null;
};

interface LeaveDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSaveLeave?: (employeeId: string, days: number) => Promise<boolean>;
}

const LeaveDocumentModal = ({ open, onOpenChange, employee, onSaveLeave }: LeaveDocumentModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const parseDateInput = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parsed = parse(dateStr, 'dd-MM-yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  };

  const formatDateForDisplay = (dateStr: string): string => {
    const date = parseDateInput(dateStr);
    if (!date) return '___________________';
    return format(date, 'd MMMM yyyy', { locale: tr });
  };

  const calculateWorkingDays = (): number => {
    const startDate = parseDateInput(startDateInput);
    const endDate = parseDateInput(endDateInput);
    if (!startDate || !endDate || startDate > endDate) return 0;
    return eachDayOfInterval({ start: startDate, end: endDate }).filter(day => !isSunday(day) && !isHoliday(day)).length;
  };

  const getExcludedDaysInfo = () => {
    const startDate = parseDateInput(startDateInput);
    const endDate = parseDateInput(endDateInput);
    if (!startDate || !endDate || startDate > endDate) return { sundays: 0, holidays: [] as Date[] };
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    return {
      sundays: allDays.filter(day => isSunday(day)).length,
      holidays: allDays.filter(day => isHoliday(day) && !isSunday(day)),
    };
  };

  const handleDateInput = (value: string, setter: (val: string) => void) => {
    let cleaned = value.replace(/[^\d-]/g, '');
    if (cleaned.length === 2 && !cleaned.includes('-')) cleaned += '-';
    else if (cleaned.length === 5 && cleaned.split('-').length === 2) cleaned += '-';
    if (cleaned.length <= 10) setter(cleaned);
  };

  const getImageBase64 = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext('2d')?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve('');
      img.src = src;
    });
  };

  const handleSaveLeave = async () => {
    if (!employee || !onSaveLeave) return;
    const workingDays = calculateWorkingDays();
    if (workingDays <= 0) { toast({ title: 'Hata', description: 'Geçerli tarih aralığı girin.', variant: 'destructive' }); return; }
    const remainingLeave = employee.totalLeave - employee.usedLeave;
    if (workingDays > remainingLeave) { toast({ title: 'Hata', description: `Yetersiz izin bakiyesi! Kalan: ${remainingLeave} gün`, variant: 'destructive' }); return; }

    setIsSaving(true);
    try {
      const success = await onSaveLeave(employee.id, workingDays);
      if (success) toast({ title: 'Başarılı', description: `${workingDays} gün izin kaydedildi.` });
    } finally { setIsSaving(false); }
  };

  const handlePrint = async () => {
    if (!printRef.current || !employee) return;
    const logoBase64 = await getImageBase64(zorluLogo);
    const signatureBase64 = await getImageBase64(managerSignature);
    let printContent = printRef.current.innerHTML
      .replace(new RegExp(zorluLogo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), logoBase64)
      .replace(new RegExp(managerSignature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), signatureBase64);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>İzin Belgesi - ${employee.name} ${employee.surname}</title>
        <style>@page{size:A4 portrait;margin:15mm 20mm}*{box-sizing:border-box;-webkit-print-color-adjust:exact}html,body{width:210mm;min-height:297mm;margin:0;padding:0}body{font-family:'Times New Roman',Times,serif;padding:15mm 20mm;line-height:1.6;font-size:12pt;color:#000;background:#fff}.header{text-align:center;margin-bottom:25px}.logo-img{max-height:50px;margin-bottom:10px}.title{font-size:18pt;font-weight:bold;text-decoration:underline;margin-bottom:8px}.date{text-align:right;margin-bottom:20px;font-size:11pt}.content{text-align:justify;font-size:11pt}.content p{margin-bottom:12px;text-indent:30px}table{width:100%;border-collapse:collapse;margin-bottom:20px}table td{padding:6px 0;font-size:11pt;vertical-align:top}.signature-area{margin-top:40px;display:flex;justify-content:space-between;page-break-inside:avoid}.signature-box{text-align:center;width:180px}.signature-img{height:50px;object-fit:contain;display:block;margin:0 auto 5px auto}.footer{margin-top:30px;padding-top:15px;border-top:1px solid #ccc;font-size:9pt;text-align:center;color:#666}@media print{html,body{width:210mm;height:297mm}body{padding:0}}</style>
        </head><body>${printContent}</body></html>`);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
    }
  };

  const today = format(new Date(), 'd MMMM yyyy', { locale: tr });
  if (!employee) return null;

  const remainingLeave = employee.totalLeave - employee.usedLeave;
  const workingDays = calculateWorkingDays();
  const excludedInfo = getExcludedDaysInfo();
  const totalExcluded = excludedInfo.sundays + excludedInfo.holidays.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>İzin Belgesi Oluştur</DialogTitle></DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-muted rounded-lg">
          <div>
            <Label htmlFor="startDate">İzin Başlangıç Tarihi (GG-AA-YYYY)</Label>
            <Input id="startDate" type="text" placeholder="01-01-2025" value={startDateInput}
              onChange={(e) => handleDateInput(e.target.value, setStartDateInput)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="endDate">İzin Bitiş Tarihi (GG-AA-YYYY)</Label>
            <Input id="endDate" type="text" placeholder="05-01-2025" value={endDateInput}
              onChange={(e) => handleDateInput(e.target.value, setEndDateInput)} className="mt-1" />
          </div>
        </div>

        {workingDays > 0 && totalExcluded > 0 && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm space-y-1">
            <div className="text-yellow-600 font-medium">Hariç Tutulan Günler:</div>
            {excludedInfo.sundays > 0 && <div className="text-foreground">• {excludedInfo.sundays} Pazar günü</div>}
            {excludedInfo.holidays.length > 0 && (
              <div className="text-foreground">• {excludedInfo.holidays.length} Resmi tatil: {excludedInfo.holidays.map(h => `${format(h, 'd MMM', { locale: tr })} (${getHolidayName(h)})`).join(', ')}</div>
            )}
            <div className="text-foreground font-medium pt-1 border-t border-yellow-500/20 mt-2">Toplam çalışma günü: <strong>{workingDays} gün</strong></div>
          </div>
        )}

        <div ref={printRef} className="bg-white text-black p-8 border rounded-lg shadow-inner" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          <div className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src={zorluLogo} alt="Zorlu Digital Plaza" className="logo-img" style={{ maxHeight: '50px', marginBottom: '15px' }} />
            <div className="title" style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'underline' }}>YILLIK İZİN TALEBİ</div>
          </div>
          <div className="date" style={{ textAlign: 'right', marginBottom: '25px' }}>Tarih: {today}</div>
          <div className="content" style={{ lineHeight: '2', fontSize: '14px' }}>
            <p style={{ marginBottom: '15px' }}><strong>Zorlu Digital Plaza Yönetimi'ne,</strong></p>
            <p style={{ marginBottom: '20px', textIndent: '40px' }}>Aşağıda bilgileri yer alan personel olarak, yıllık izin hakkımdan kullanmak üzere izin talebinde bulunuyorum.</p>
            <table style={{ width: '100%', marginBottom: '25px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '8px 0', width: '40%' }}><strong>Adı Soyadı:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{employee.name} {employee.surname}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Departman:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{employee.department}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Toplam İzin Hakkı:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{employee.totalLeave} gün</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Kullanılan İzin:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{employee.usedLeave} gün</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Kalan İzin Hakkı:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{remainingLeave} gün</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>İzin Başlangıç Tarihi:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{formatDateForDisplay(startDateInput)}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>İzin Bitiş Tarihi:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{formatDateForDisplay(endDateInput)}</td></tr>
                <tr><td style={{ padding: '8px 0' }}><strong>Talep Edilen İzin Süresi:</strong></td><td style={{ padding: '8px 0', borderBottom: '1px solid #000' }}>{workingDays > 0 ? `${workingDays} gün` : '___________________'}</td></tr>
              </tbody>
            </table>
            <p style={{ marginBottom: '20px', textIndent: '40px' }}>Yukarıda belirtilen tarihler arasında yıllık iznimi kullanmak istiyorum. Gereğini arz ederim.</p>
            <p style={{ marginBottom: '20px', textIndent: '40px' }}>Saygılarımla,</p>
          </div>
          <div className="signature-area" style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between' }}>
            <div className="signature-box" style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ borderTop: '1px solid #000', marginTop: '80px', paddingTop: '10px' }}>
                <strong>Personel İmzası</strong>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>{employee.name} {employee.surname}</div>
              </div>
            </div>
            <div className="signature-box" style={{ textAlign: 'center', width: '200px' }}>
              <img src={managerSignature} alt="Yönetici İmzası" className="signature-img" style={{ height: '60px', objectFit: 'contain', margin: '0 auto 5px auto', display: 'block' }} />
              <div style={{ borderTop: '1px solid #000', paddingTop: '10px' }}>
                <strong>Yönetici Onayı</strong>
                <div style={{ fontSize: '12px', marginTop: '5px' }}>Halil Kavaz</div>
              </div>
            </div>
          </div>
          <div className="footer" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc', fontSize: '11px', textAlign: 'center', color: '#666' }}>
            Zorlu Digital Plaza - Personel İzin Takip Sistemi
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          {onSaveLeave && (
            <Button variant="outline" onClick={handleSaveLeave} disabled={isSaving || workingDays <= 0}
              className="bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-500/30">
              <Save className="h-4 w-4 mr-2" />{isSaving ? 'Kaydediliyor...' : `Kaydet (${workingDays} gün)`}
            </Button>
          )}
          <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Yazdır</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDocumentModal;
