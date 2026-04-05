import { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { format, eachDayOfInterval, isSunday, isBefore, isAfter } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Employee } from '@/modules/izin-takip/types/employee';
import { cn } from '@/lib/utils';

interface LeaveEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSubmit: (employeeId: string, days: number, startDate: Date, endDate: Date) => Promise<boolean>;
}

const getOfficialHolidays = (year: number): Date[] => [
  new Date(year, 0, 1), new Date(year, 3, 23), new Date(year, 4, 9),
  new Date(year, 6, 15), new Date(year, 7, 30), new Date(year, 9, 29),
];

const isHoliday = (date: Date): boolean => {
  const holidays = getOfficialHolidays(date.getFullYear());
  return holidays.some(h => h.getDate() === date.getDate() && h.getMonth() === date.getMonth());
};

const calculateWorkingDays = (start: Date, end: Date): number => {
  if (isBefore(end, start)) return 0;
  return eachDayOfInterval({ start, end }).filter(day => !isSunday(day) && !isHoliday(day)).length;
};

const LeaveEntryModal = ({ open, onOpenChange, employee, onSubmit }: LeaveEntryModalProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!employee) return null;

  const remainingLeave = employee.totalLeave - employee.usedLeave;
  const workingDays = startDate && endDate ? calculateWorkingDays(startDate, endDate) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) { setError('Lütfen başlangıç ve bitiş tarihlerini seçin'); return; }
    if (isAfter(startDate, endDate)) { setError('Bitiş tarihi başlangıç tarihinden önce olamaz'); return; }
    if (workingDays <= 0) { setError('Seçilen tarih aralığında iş günü bulunmuyor'); return; }
    if (workingDays > remainingLeave) { setError(`Yetersiz bakiye! Kalan izin: ${remainingLeave} gün`); return; }

    setIsSubmitting(true);
    const success = await onSubmit(employee.id, workingDays, startDate, endDate);
    setIsSubmitting(false);
    if (success) { setStartDate(undefined); setEndDate(undefined); setError(''); onOpenChange(false); }
  };

  const handleClose = () => { setStartDate(undefined); setEndDate(undefined); setError(''); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-0 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground"><Calendar className="h-5 w-5 text-accent" />İzin Girişi</DialogTitle>
          <DialogDescription className="text-muted-foreground">{employee.name} {employee.surname} için izin kaydı</DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Kalan İzin</span>
            <span className="text-2xl font-bold text-accent">{remainingLeave} gün</span>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-muted-foreground">Toplam / Kullanılan</span>
            <span className="text-foreground">{employee.totalLeave} / {employee.usedLeave} gün</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">Başlangıç Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd MMM yyyy", { locale: tr }) : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={startDate} onSelect={(d) => { setStartDate(d); setError(''); }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd MMM yyyy", { locale: tr }) : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent mode="single" selected={endDate} onSelect={(d) => { setEndDate(d); setError(''); }}
                    disabled={(d) => startDate ? isBefore(d, startDate) : false} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {startDate && endDate && workingDays > 0 && (
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <span className="text-sm text-muted-foreground">Toplam İş Günü: </span>
              <span className="text-lg font-bold text-accent">{workingDays} gün</span>
              <p className="text-xs text-muted-foreground mt-1">(Pazar ve resmi tatiller hariç)</p>
            </div>
          )}

          {error && (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isSubmitting}>İptal</Button>
            <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting || !startDate || !endDate}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveEntryModal;
