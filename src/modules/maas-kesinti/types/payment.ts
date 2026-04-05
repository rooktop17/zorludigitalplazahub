export interface PaymentRecord { id: string; employeeId: string; employeeName: string; month: string; baseSalary: number; totalAdvances: number; netPayment: number; paidAt: string; }
export interface MonthlyReport { month: string; year: number; monthName: string; totalEmployees: number; totalSalaries: number; totalAdvances: number; totalPaid: number; payments: PaymentRecord[]; }
