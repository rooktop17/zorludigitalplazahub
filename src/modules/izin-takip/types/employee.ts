export interface Employee {
  id: string;
  name: string;
  surname: string;
  department: string;
  gender: 'male' | 'female';
  photoUrl: string;
  totalLeave: number;
  usedLeave: number;
  lastUpdated?: Date;
}

export interface LeaveRecord {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  daysUsed: number;
  description?: string;
  createdAt: Date;
}

export const DEFAULT_LEAVE_QUOTA = 15;

export const DEPARTMENTS = [
  'Lefkoşa Mağaza Sorumlusu',
  'TV – Beyaz Eşya Ustası',
  'Klima Ustası',
  'Mağusa Mağaza Sorumlusu',
  'Tamir Ustası',
] as const;
