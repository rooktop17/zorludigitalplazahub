export type Branch = "Lefkoşa" | "Mağusa";
export type LeaveType = "Yıllık" | "Rapor" | "Mazeret" | "Ücretsiz";
export type RequestStatus = "Beklemede" | "Onaylandı" | "Reddedildi";

export interface LeaveRequest {
  id: string;
  createdAt: string;
  fullName: string;
  branch: Branch;
  title: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  note: string;
  status: RequestStatus;
  adminNote: string;
  decidedAt: string | null;
}

export interface UserSession {
  fullName: string;
  branch?: Branch;
  isAdmin: boolean;
}
