import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRecord } from '@/modules/izin-takip/types/employee';
import { useToast } from '@/hooks/use-toast';

export const useLeaveRecords = (employeeId?: string) => {
  const [records, setRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRecords = async (empId?: string) => {
    const targetId = empId || employeeId;
    if (!targetId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leave_records')
        .select('*')
        .eq('employee_id', targetId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const mappedRecords: LeaveRecord[] = (data || []).map((rec: any) => ({
        id: rec.id,
        employeeId: rec.employee_id,
        startDate: new Date(rec.start_date),
        endDate: new Date(rec.end_date),
        daysUsed: rec.days_used,
        description: rec.description || undefined,
        createdAt: new Date(rec.created_at),
      }));

      setRecords(mappedRecords);
    } catch (error) {
      console.error('Error fetching leave records:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (
    empId: string,
    startDate: Date,
    endDate: Date,
    daysUsed: number,
    description?: string
  ): Promise<LeaveRecord | null> => {
    try {
      const { data, error } = await supabase
        .from('leave_records')
        .insert({
          employee_id: empId,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          days_used: daysUsed,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newRecord: LeaveRecord = {
        id: data.id,
        employeeId: data.employee_id,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        daysUsed: data.days_used,
        description: data.description || undefined,
        createdAt: new Date(data.created_at),
      };

      setRecords((prev) => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error('Error adding leave record:', error);
      toast({ title: 'Hata', description: 'İzin kaydı eklenemedi.', variant: 'destructive' });
      return null;
    }
  };

  const deleteRecord = async (recordId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('leave_records').delete().eq('id', recordId);
      if (error) throw error;

      setRecords((prev) => prev.filter((rec) => rec.id !== recordId));
      toast({ title: 'Başarılı', description: 'İzin kaydı silindi.' });
      return true;
    } catch (error) {
      console.error('Error deleting leave record:', error);
      toast({ title: 'Hata', description: 'İzin kaydı silinemedi.', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchRecords(employeeId);
    }
  }, [employeeId]);

  return {
    records,
    loading,
    addRecord,
    deleteRecord,
    refetch: fetchRecords,
  };
};
