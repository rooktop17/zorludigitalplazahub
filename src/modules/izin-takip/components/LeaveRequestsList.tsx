import { useState, useEffect } from 'react';
import { Check, X, Clock, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  employee_name?: string;
  employee_surname?: string;
}

interface LeaveRequestsListProps {
  isAdmin: boolean;
  employeeId?: string;
  onApproved?: () => void;
}

const LeaveRequestsList = ({ isAdmin, employeeId, onApproved }: LeaveRequestsListProps) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    let query = (supabase as any).from('leave_requests').select('*').order('created_at', { ascending: false });
    if (!isAdmin && employeeId) query = query.eq('employee_id', employeeId);

    const { data, error } = await query;
    if (error) { console.error(error); setLoading(false); return; }

    if (isAdmin && data && data.length > 0) {
      const empIds = [...new Set(data.map((r: any) => r.employee_id))] as string[];
      const { data: emps } = await supabase.from('employees').select('id, name, surname').in('id', empIds);
      const empMap = new Map(emps?.map((e: any) => [e.id, e]) || []);
      setRequests(data.map((r: any) => {
        const emp = empMap.get(r.employee_id) as any;
        return { ...r, employee_name: emp?.name, employee_surname: emp?.surname };
      }));
    } else {
      setRequests((data as any) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, [isAdmin, employeeId]);

  const handleAction = async (requestId: string, action: 'approved' | 'rejected', empId: string, days: number, startDate: string, endDate: string) => {
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: action, reviewed_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) { toast({ title: 'Hata', description: 'İşlem başarısız.', variant: 'destructive' }); return; }

    if (action === 'approved') {
      const { data: emp } = await supabase.from('employees').select('used_leave').eq('id', empId).single();
      if (emp) {
        await supabase.from('employees').update({ used_leave: (emp as any).used_leave + days, last_updated: new Date().toISOString() }).eq('id', empId);
        await supabase.from('leave_records').insert({ employee_id: empId, start_date: startDate, end_date: endDate, days_used: days, description: 'Çalışan talebi ile onaylandı' });
      }
      onApproved?.();
    }

    toast({ title: 'Başarılı', description: action === 'approved' ? 'Talep onaylandı.' : 'Talep reddedildi.' });
    fetchRequests();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="text-yellow-600 border-yellow-400"><Clock className="h-3 w-3 mr-1" />Bekliyor</Badge>;
      case 'approved': return <Badge className="bg-green-500/10 text-green-600 border-green-400"><Check className="h-3 w-3 mr-1" />Onaylandı</Badge>;
      case 'rejected': return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Reddedildi</Badge>;
      default: return null;
    }
  };

  if (loading) return <p className="text-muted-foreground text-sm text-center py-4">Yükleniyor...</p>;
  if (requests.length === 0) return <p className="text-muted-foreground text-sm text-center py-4">Henüz izin talebi yok.</p>;

  return (
    <div className="space-y-3">
      {requests.map((req) => (
        <Card key={req.id} className="bg-card border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {isAdmin && req.employee_name && (
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1 mb-1">
                    <User className="h-3.5 w-3.5" />{req.employee_name} {req.employee_surname}
                  </p>
                )}
                <p className="text-sm text-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {format(new Date(req.start_date), 'd MMM yyyy', { locale: tr })} – {format(new Date(req.end_date), 'd MMM yyyy', { locale: tr })}
                  <span className="font-semibold text-primary ml-1">({req.days_requested} gün)</span>
                </p>
                {req.reason && <p className="text-xs text-muted-foreground mt-1">Sebep: {req.reason}</p>}
                <p className="text-xs text-muted-foreground mt-1">{format(new Date(req.created_at), 'd MMM yyyy HH:mm', { locale: tr })}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {statusBadge(req.status)}
                {isAdmin && req.status === 'pending' && (
                  <div className="flex gap-1.5 mt-1">
                    <Button size="sm" variant="outline" className="h-7 text-green-600 border-green-300 hover:bg-green-50"
                      onClick={() => handleAction(req.id, 'approved', req.employee_id, req.days_requested, req.start_date, req.end_date)}>
                      <Check className="h-3.5 w-3.5 mr-1" />Onayla
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleAction(req.id, 'rejected', req.employee_id, req.days_requested, req.start_date, req.end_date)}>
                      <X className="h-3.5 w-3.5 mr-1" />Reddet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LeaveRequestsList;
