import { useState, useEffect } from 'react';
import { LogOut, Calendar, Clock, Building2, Loader2, Key, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Employee, LeaveRecord } from '@/modules/izin-takip/types/employee';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import zorluLogo from '@/assets/zorlu-logo.png';
import ChangePasswordModal from '@/modules/izin-takip/components/ChangePasswordModal';
import LeaveRequestModal from '@/modules/izin-takip/components/LeaveRequestModal';
import LeaveRequestsList from '@/modules/izin-takip/components/LeaveRequestsList';
import { useToast } from '@/hooks/use-toast';

interface EmployeeDashboardProps {
  employeeId: string;
  onSignOut: () => void;
}

const EmployeeDashboard = ({ employeeId, onSignOut }: EmployeeDashboardProps) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [records, setRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: empData } = await supabase.from('employees').select('*').eq('id', employeeId).single();
      if (empData) {
        setEmployee({
          id: (empData as any).id, name: (empData as any).name, surname: (empData as any).surname,
          department: (empData as any).department, gender: (empData as any).gender as 'male' | 'female',
          photoUrl: (empData as any).photo_url || '', totalLeave: (empData as any).total_leave,
          usedLeave: (empData as any).used_leave,
          lastUpdated: (empData as any).last_updated ? new Date((empData as any).last_updated) : undefined,
        });
      }
      const { data: recData } = await supabase.from('leave_records').select('*').eq('employee_id', employeeId).order('start_date', { ascending: false });
      if (recData) {
        setRecords(recData.map((rec: any) => ({
          id: rec.id, employeeId: rec.employee_id,
          startDate: new Date(rec.start_date), endDate: new Date(rec.end_date),
          daysUsed: rec.days_used, description: rec.description || undefined,
          createdAt: new Date(rec.created_at),
        })));
      }
      setLoading(false);
    };
    fetchData();
  }, [employeeId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>;
  if (!employee) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Personel kaydı bulunamadı.</p></div>;

  const remainingLeave = employee.totalLeave - employee.usedLeave;
  const usagePercentage = (remainingLeave / employee.totalLeave) * 100;
  const getInitials = () => `${employee.name.charAt(0)}${employee.surname.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen">
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-10 object-contain" />
            <div className="hidden md:block h-8 w-px bg-border" />
            <h1 className="hidden md:block text-xl font-semibold text-foreground">İzin Takip</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setIsRequestModalOpen(true)}><Send className="h-4 w-4 mr-1" /><span className="hidden sm:inline">İzin Talep Et</span><span className="sm:hidden">Talep</span></Button>
            <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)}><Key className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Şifre Değiştir</span></Button>
            <Button variant="outline" size="sm" onClick={onSignOut}><LogOut className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Çıkış</span></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-card border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-20 w-20 ring-2 ring-primary/10">
                <AvatarImage src={employee.photoUrl} alt={`${employee.name} ${employee.surname}`} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{employee.name} {employee.surname}</h2>
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1"><Building2 className="h-4 w-4" /><span>{employee.department}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-background"><p className="text-2xl font-bold text-foreground">{employee.totalLeave}</p><p className="text-xs text-muted-foreground">Toplam İzin</p></div>
              <div className="text-center p-3 rounded-lg bg-background"><p className="text-2xl font-bold text-foreground">{employee.usedLeave}</p><p className="text-xs text-muted-foreground">Kullanılan</p></div>
              <div className="text-center p-3 rounded-lg bg-background"><p className="text-2xl font-bold text-green-600">{remainingLeave}</p><p className="text-xs text-muted-foreground">Kalan</p></div>
            </div>
            <Progress value={usagePercentage} className="h-2 bg-muted" />
            <p className="text-xs text-muted-foreground mt-1 text-right">%{Math.round(usagePercentage)} kaldı</p>
          </CardContent>
        </Card>

        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 mt-8"><Send className="h-5 w-5 text-primary" />İzin Taleplerim</h3>
        <LeaveRequestsList isAdmin={false} employeeId={employeeId} />

        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 mt-8"><Calendar className="h-5 w-5 text-primary" />İzin Geçmişi</h3>
        {records.length === 0 ? (
          <Card className="bg-card border-0 shadow-sm"><CardContent className="p-8 text-center"><p className="text-muted-foreground">Henüz izin kaydı bulunmuyor.</p></CardContent></Card>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <Card key={record.id} className="bg-card border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{format(record.startDate, 'd MMM yyyy', { locale: tr })} – {format(record.endDate, 'd MMM yyyy', { locale: tr })}</p>
                    {record.description && <p className="text-xs text-muted-foreground mt-0.5">{record.description}</p>}
                  </div>
                  <span className="text-sm font-semibold text-primary">{record.daysUsed} gün</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {employee.lastUpdated && (
          <p className="text-xs text-muted-foreground mt-6 flex items-center gap-1">
            <Clock className="h-3 w-3" />Son güncelleme: {format(new Date(employee.lastUpdated), 'd MMM yyyy, HH:mm', { locale: tr })}
          </p>
        )}
      </main>

      <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen} />
      <LeaveRequestModal open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen} remainingLeave={remainingLeave}
        onSubmit={async (startDate, endDate, days, reason) => {
          const { error } = await (supabase as any).from('leave_requests').insert({
            employee_id: employeeId,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            days_requested: days,
            reason: reason || null,
          });
          if (error) { toast({ title: 'Hata', description: 'Talep gönderilemedi.', variant: 'destructive' }); return false; }
          toast({ title: 'Başarılı', description: 'İzin talebiniz gönderildi.' });
          return true;
        }}
      />
    </div>
  );
};

export default EmployeeDashboard;
