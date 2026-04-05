import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Advance { id: string; amount: number; date: string; description?: string; }
export interface Employee { id: string; name: string; salary: number; photo: string | null; country: string; flag: string; advances: Advance[]; }

const STORAGE_KEY = 'mk_employees';
const ADVANCES_KEY = 'mk_advances';

function loadEmployees(): Employee[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try { return JSON.parse(data); } catch { return []; }
}

function saveEmployeesLocal(employees: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEmployees(loadEmployees());
    setLoading(false);
  }, []);

  const persist = (updated: Employee[]) => { setEmployees(updated); saveEmployeesLocal(updated); };

  const updateSalary = (id: string, salary: number) => {
    persist(employees.map(emp => emp.id === id ? { ...emp, salary } : emp));
  };

  const updatePhoto = (id: string, photo: string | null) => {
    persist(employees.map(emp => emp.id === id ? { ...emp, photo } : emp));
  };

  const addAdvance = (id: string, advance: Omit<Advance, 'id'>) => {
    const newAdv = { ...advance, id: crypto.randomUUID() };
    persist(employees.map(emp => emp.id === id ? { ...emp, advances: [...emp.advances, newAdv] } : emp));
  };

  const removeAdvance = (employeeId: string, advanceId: string) => {
    persist(employees.map(emp => emp.id === employeeId ? { ...emp, advances: emp.advances.filter(a => a.id !== advanceId) } : emp));
  };

  const clearAdvances = (employeeId: string) => {
    persist(employees.map(emp => emp.id === employeeId ? { ...emp, advances: [] } : emp));
  };

  const addEmployee = async (employee: { name: string; salary: number; country: string; flag: string }) => {
    const newEmp: Employee = { id: crypto.randomUUID(), name: employee.name, salary: employee.salary, photo: null, country: employee.country, flag: employee.flag, advances: [] };
    persist([...employees, newEmp].sort((a, b) => a.name.localeCompare(b.name)));
    toast.success('Çalışan eklendi');
    return newEmp;
  };

  const deleteEmployee = (employeeId: string) => {
    persist(employees.filter(emp => emp.id !== employeeId));
    toast.success('Çalışan silindi');
  };

  const calculateRemaining = (employee: Employee): number => {
    return employee.salary - employee.advances.reduce((sum, adv) => sum + adv.amount, 0);
  };

  return { employees, loading, updateSalary, updatePhoto, addAdvance, removeAdvance, clearAdvances, addEmployee, deleteEmployee, calculateRemaining };
}
