import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Advance {
  id: string;
  amount: number;
  date: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  salary: number;
  photo: string | null;
  country: string;
  flag: string;
  advances: Advance[];
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const { data: employeesData, error: employeesError } = await supabase
        .from('mk_employees')
        .select('*')
        .order('name');

      if (employeesError) throw employeesError;

      const { data: advancesData, error: advancesError } = await supabase
        .from('mk_advances')
        .select('*');

      if (advancesError) throw advancesError;

      const employeesWithAdvances: Employee[] = (employeesData || []).map((emp: any) => ({
        id: emp.id,
        name: emp.name,
        salary: Number(emp.salary),
        photo: emp.photo,
        country: emp.country,
        flag: emp.flag,
        advances: (advancesData || [])
          .filter((adv: any) => adv.employee_id === emp.id)
          .map((adv: any) => ({
            id: adv.id,
            amount: Number(adv.amount),
            date: adv.date,
            description: adv.description || undefined,
          })),
      }));

      setEmployees(employeesWithAdvances);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const updateSalary = async (id: string, salary: number) => {
    try {
      const { error } = await supabase
        .from('mk_employees')
        .update({ salary } as any)
        .eq('id', id);
      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, salary } : emp));
    } catch (error) {
      console.error('Maaş güncelleme hatası:', error);
      toast.error('Maaş güncellenirken hata oluştu');
    }
  };

  const updatePhoto = async (id: string, photo: string | null) => {
    try {
      const { error } = await supabase
        .from('mk_employees')
        .update({ photo } as any)
        .eq('id', id);
      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, photo } : emp));
    } catch (error) {
      console.error('Fotoğraf güncelleme hatası:', error);
      toast.error('Fotoğraf güncellenirken hata oluştu');
    }
  };

  const addAdvance = async (id: string, advance: Omit<Advance, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('mk_advances')
        .insert({
          employee_id: id,
          amount: advance.amount,
          date: advance.date,
          description: advance.description || null,
        } as any)
        .select()
        .single();
      if (error) throw error;
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === id
            ? { ...emp, advances: [...emp.advances, { id: (data as any).id, amount: Number((data as any).amount), date: (data as any).date, description: (data as any).description || undefined }] }
            : emp
        )
      );
    } catch (error) {
      console.error('Avans ekleme hatası:', error);
      toast.error('Avans eklenirken hata oluştu');
    }
  };

  const removeAdvance = async (employeeId: string, advanceId: string) => {
    try {
      const { error } = await supabase
        .from('mk_advances')
        .delete()
        .eq('id', advanceId);
      if (error) throw error;
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === employeeId ? { ...emp, advances: emp.advances.filter(a => a.id !== advanceId) } : emp
        )
      );
    } catch (error) {
      console.error('Avans silme hatası:', error);
      toast.error('Avans silinirken hata oluştu');
    }
  };

  const clearAdvances = async (employeeId: string) => {
    try {
      const { error } = await supabase
        .from('mk_advances')
        .delete()
        .eq('employee_id', employeeId);
      if (error) throw error;
      setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, advances: [] } : emp));
    } catch (error) {
      console.error('Avansları temizleme hatası:', error);
      toast.error('Avanslar temizlenirken hata oluştu');
    }
  };

  const addEmployee = async (employee: { name: string; salary: number; country: string; flag: string }) => {
    try {
      const { data, error } = await supabase
        .from('mk_employees')
        .insert({
          name: employee.name,
          salary: employee.salary,
          country: employee.country,
          flag: employee.flag,
        } as any)
        .select()
        .single();
      if (error) throw error;
      const newEmployee: Employee = {
        id: (data as any).id,
        name: (data as any).name,
        salary: Number((data as any).salary),
        photo: (data as any).photo,
        country: (data as any).country,
        flag: (data as any).flag,
        advances: [],
      };
      setEmployees(prev => [...prev, newEmployee].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Çalışan eklendi');
      return newEmployee;
    } catch (error) {
      console.error('Çalışan ekleme hatası:', error);
      toast.error('Çalışan eklenirken hata oluştu');
      return null;
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      const { error: advancesError } = await supabase
        .from('mk_advances')
        .delete()
        .eq('employee_id', employeeId);
      if (advancesError) throw advancesError;

      const { error } = await supabase
        .from('mk_employees')
        .delete()
        .eq('id', employeeId);
      if (error) throw error;

      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      toast.success('Çalışan silindi');
    } catch (error) {
      console.error('Çalışan silme hatası:', error);
      toast.error('Çalışan silinirken hata oluştu');
    }
  };

  const calculateRemaining = (employee: Employee): number => {
    const totalAdvances = employee.advances.reduce((sum, adv) => sum + adv.amount, 0);
    return employee.salary - totalAdvances;
  };

  return {
    employees,
    loading,
    updateSalary,
    updatePhoto,
    addAdvance,
    removeAdvance,
    clearAdvances,
    addEmployee,
    deleteEmployee,
    calculateRemaining,
    refetch: fetchEmployees,
  };
}
