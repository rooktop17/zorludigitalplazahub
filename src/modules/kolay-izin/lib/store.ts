import { LeaveRequest, UserSession } from "@/modules/kolay-izin/types/leave";

const REQUESTS_KEY = "zdc_leave_requests";
const SESSION_KEY = "zdc_session";

export function getRequests(): LeaveRequest[] {
  const data = localStorage.getItem(REQUESTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRequests(requests: LeaveRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function addRequest(req: Omit<LeaveRequest, "id" | "createdAt" | "status" | "adminNote" | "decidedAt">): LeaveRequest {
  const requests = getRequests();
  const newReq: LeaveRequest = {
    ...req,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "Beklemede",
    adminNote: "",
    decidedAt: null,
  };
  requests.unshift(newReq);
  saveRequests(requests);
  return newReq;
}

export function updateRequest(id: string, updates: Partial<LeaveRequest>) {
  const requests = getRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx !== -1) {
    requests[idx] = { ...requests[idx], ...updates };
    saveRequests(requests);
  }
}

export function getSession(): UserSession | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setSession(session: UserSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
