import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Employee } from '@/modules/izin-takip/types/employee';
import { useToast } from '@/hooks/use-toast';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const mappedEmployees: Employee[] = (data || []).map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        surname: emp.surname,
        department: emp.department,
        gender: emp.gender as 'male' | 'female',
        photoUrl: emp.photo_url || '',
        totalLeave: emp.total_leave,
        usedLeave: emp.used_leave,
        lastUpdated: emp.last_updated ? new Date(emp.last_updated) : undefined,
      }));

      setEmployees(mappedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Hata',
        description: 'Personel listesi yüklenemedi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (newEmployee: Omit<Employee, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          name: newEmployee.name,
          surname: newEmployee.surname,
          department: newEmployee.department,
          gender: newEmployee.gender,
          photo_url: newEmployee.photoUrl,
          total_leave: newEmployee.totalLeave,
          used_leave: newEmployee.usedLeave,
        })
        .select()
        .single();

      if (error) throw error;

      const employee: Employee = {
        id: data.id,
        name: data.name,
        surname: data.surname,
        department: data.department,
        gender: data.gender as 'male' | 'female',
        photoUrl: data.photo_url || '',
        totalLeave: data.total_leave,
        usedLeave: data.used_leave,
        lastUpdated: data.last_updated ? new Date(data.last_updated) : undefined,
      };

      setEmployees((prev) => [...prev, employee]);
      toast({ title: 'Başarılı', description: 'Yeni personel eklendi.' });
      return employee;
    } catch (error) {
      console.error('Error adding employee:', error);
      toast({ title: 'Hata', description: 'Personel eklenemedi.', variant: 'destructive' });
      return null;
    }
  };

  const updateLeave = async (employeeId: string, daysUsed: number) => {
    try {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return false;

      const newUsedLeave = employee.usedLeave + daysUsed;
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('employees')
        .update({ used_leave: newUsedLeave, last_updated: now })
        .eq('id', employeeId);

      if (error) throw error;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId
            ? { ...emp, usedLeave: newUsedLeave, lastUpdated: new Date(now) }
            : emp
        )
      );

      toast({ title: 'Başarılı', description: `${daysUsed} gün izin kaydedildi.` });
      return true;
    } catch (error) {
      console.error('Error updating leave:', error);
      toast({ title: 'Hata', description: 'İzin kaydedilemedi.', variant: 'destructive' });
      return false;
    }
  };

  const correctLeave = async (employeeId: string, newUsedLeave: number) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('employees')
        .update({ used_leave: newUsedLeave, last_updated: now })
        .eq('id', employeeId);

      if (error) throw error;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId
            ? { ...emp, usedLeave: newUsedLeave, lastUpdated: new Date(now) }
            : emp
        )
      );

      toast({ title: 'Başarılı', description: 'İzin bilgisi düzeltildi.' });
      return true;
    } catch (error) {
      console.error('Error correcting leave:', error);
      toast({ title: 'Hata', description: 'İzin düzeltilemedi.', variant: 'destructive' });
      return false;
    }
  };

  const updateEmployee = async (employeeId: string, updates: Partial<Omit<Employee, 'id'>>) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('employees')
        .update({
          name: updates.name,
          surname: updates.surname,
          department: updates.department,
          gender: updates.gender,
          photo_url: updates.photoUrl,
          total_leave: updates.totalLeave,
          last_updated: now,
        })
        .eq('id', employeeId);

      if (error) throw error;

      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === employeeId
            ? { ...emp, ...updates, lastUpdated: new Date(now) }
            : emp
        )
      );

      toast({ title: 'Başarılı', description: 'Personel bilgileri güncellendi.' });
      return true;
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({ title: 'Hata', description: 'Personel güncellenemedi.', variant: 'destructive' });
      return false;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error } = await supabase.from('employees').delete().eq('id', employeeId);
      if (error) throw error;

      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
      toast({ title: 'Başarılı', description: 'Personel silindi.' });
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({ title: 'Hata', description: 'Personel silinemedi.', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    loading,
    addEmployee,
    updateLeave,
    correctLeave,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  };
};
