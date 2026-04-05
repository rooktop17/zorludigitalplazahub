export interface Advance { id: string; amount: number; date: string; description?: string; }
export interface Employee { id: string; name: string; salary: number; photo: string | null; advances: Advance[]; country: string; flag: string; }
