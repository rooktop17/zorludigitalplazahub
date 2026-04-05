import { useState, useEffect, useMemo } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRequests, updateRequest, getSession, clearSession } from "@/modules/kolay-izin/lib/store";
import { employees } from "@/modules/kolay-izin/data/employees";
import type { LeaveRequest, RequestStatus } from "@/modules/kolay-izin/types/leave";
import { toast } from "sonner";
import { LogOut, Eye, Check, X, CalendarDays, Clock, Users, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, isWithinInterval, startOfDay, differenceInCalendarDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { tr } from "date-fns/locale";

function statusColor(status: RequestStatus) {
  if (status === "Onaylandı") return "bg-green-500 text-white";
  if (status === "Reddedildi") return "bg-destructive text-destructive-foreground";
  return "bg-yellow-500 text-white";
}

function statusDot(status: RequestStatus) {
  if (status === "Onaylandı") return "bg-green-500";
  if (status === "Reddedildi") return "bg-red-400 opacity-50";
  return "bg-amber-400";
}

function getLeaveForDay(date: Date, requests: LeaveRequest[]) {
  return requests.filter((r) => {
    if (r.status === "Reddedildi") return false;
    const start = startOfDay(new Date(r.startDate));
    const end = startOfDay(new Date(r.endDate));
    return isWithinInterval(startOfDay(date), { start, end });
  });
}

export default function KolayIzinAdmin() {
  const navigate = useNavigate();
  const session = getSession();

  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LeaveRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    if (!session || !session.isAdmin) { navigate("/module/kolay-izin"); return; }
    refresh();
  }, []);

  const refresh = () => setRequests(getRequests());

  const today = startOfDay(new Date());

  const pendingCount = requests.filter((r) => r.status === "Beklemede").length;
  const approvedCount = requests.filter((r) => r.status === "Onaylandı").length;
  const todayOnLeave = requests.filter((r) => {
    if (r.status !== "Onaylandı") return false;
    const start = startOfDay(new Date(r.startDate));
    const end = startOfDay(new Date(r.endDate));
    return isWithinInterval(today, { start, end });
  });

  const employeeBalances = useMemo(() => {
    return employees.filter(e => !e.isAdmin).map((emp) => {
      const empRequests = requests.filter((r) => r.fullName === emp.fullName && r.leaveType === "Yıllık" && r.status !== "Reddedildi");
      const used = empRequests.reduce((sum, r) => sum + differenceInCalendarDays(new Date(r.endDate), new Date(r.startDate)) + 1, 0);
      return { ...emp, used, remaining: Math.max(0, emp.annualLeave - used) };
    });
  }, [requests]);

  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const filtered = requests.filter((r) => {
    if (branchFilter !== "all" && r.branch !== branchFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.fullName.toLowerCase().includes(q) && !r.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const decide = (id: string, status: RequestStatus) => {
    updateRequest(id, { status, adminNote, decidedAt: new Date().toISOString() });
    toast.success(status === "Onaylandı" ? "Talep onaylandı." : "Talep reddedildi.");
    setSelected(null);
    setAdminNote("");
    refresh();
  };

  const fmt = (d: string) => {
    try { return format(new Date(d), "dd MMM yyyy", { locale: tr }); } catch { return d; }
  };

  if (!session) return null;

  return (
    <>
    <ModuleHeader title="ZDC Kolay İzin" />
    <div className="min-h-[calc(100vh-49px)] bg-background">
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">İzin Yönetim Paneli</h1>
          <p className="text-xs text-muted-foreground">{format(today, "dd MMMM yyyy, EEEE", { locale: tr })}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{session.fullName}</span>
          <Button variant="ghost" size="icon" onClick={() => { clearSession(); navigate("/module/kolay-izin"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} label="Bekleyen" value={pendingCount} color="text-amber-600" />
          <StatCard icon={<Check className="h-5 w-5 text-green-500" />} label="Onaylanan" value={approvedCount} color="text-green-600" />
          <StatCard icon={<Users className="h-5 w-5 text-primary" />} label="Bugün İzinli" value={todayOnLeave.length} color="text-primary" />
          <StatCard icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />} label="Toplam Talep" value={requests.length} color="text-foreground" />
        </div>

        {todayOnLeave.length > 0 && (
          <div className="border rounded-lg p-4 bg-primary/5">
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> Bugün İzinli Olanlar
            </h3>
            <div className="flex flex-wrap gap-2">
              {todayOnLeave.map((r) => (
                <Badge key={r.id} variant="secondary" className="text-sm py-1 px-3">
                  {r.fullName} <span className="text-muted-foreground ml-1">({r.leaveType})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">📅 Takvim</TabsTrigger>
            <TabsTrigger value="requests">📋 Talepler</TabsTrigger>
            <TabsTrigger value="balances">👥 İzin Bakiyeleri</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(addDays(monthStart, -1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold text-foreground">
                  {format(calendarMonth, "MMMM yyyy", { locale: tr })}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setCalendarMonth(addDays(monthEnd, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {calendarDays.map((day) => {
                  const onLeave = getLeaveForDay(day, requests);
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[70px] md:min-h-[80px] border rounded-md p-1 text-xs transition-colors ${
                        isToday ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                      } ${getDay(day) === 0 || getDay(day) === 6 ? "bg-muted/50" : ""}`}
                    >
                      <div className={`font-medium mb-0.5 ${isToday ? "text-primary" : "text-foreground"}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-0.5">
                        {onLeave.slice(0, 3).map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center gap-1 cursor-pointer hover:opacity-80"
                            onClick={() => { setSelected(r); setAdminNote(r.adminNote); }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(r.status)}`} />
                            <span className="truncate text-[10px] text-foreground">{r.fullName.split(" ")[0]}</span>
                          </div>
                        ))}
                        {onLeave.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{onLeave.length - 3} kişi</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Onaylı</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" /> Beklemede</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger className="w-36 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Şubeler</SelectItem>
                  <SelectItem value="Lefkoşa">Lefkoşa</SelectItem>
                  <SelectItem value="Mağusa">Mağusa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="Beklemede">Beklemede</SelectItem>
                  <SelectItem value="Onaylandı">Onaylandı</SelectItem>
                  <SelectItem value="Reddedildi">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="İsim veya başlık ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 h-10" />
            </div>

            <div className="hidden md:block overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium text-muted-foreground">Tarih</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Ad Soyad</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Başlık</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Şube</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Tür</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Tarihler</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Durum</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 text-muted-foreground">{fmt(r.createdAt)}</td>
                      <td className="p-3 font-medium text-foreground">{r.fullName}</td>
                      <td className="p-3 text-foreground">{r.title}</td>
                      <td className="p-3 text-muted-foreground">{r.branch}</td>
                      <td className="p-3 text-muted-foreground">{r.leaveType}</td>
                      <td className="p-3 text-muted-foreground">{fmt(r.startDate)} – {fmt(r.endDate)}</td>
                      <td className="p-3"><Badge className={statusColor(r.status)}>{r.status}</Badge></td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setSelected(r); setAdminNote(r.adminNote); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {r.status === "Beklemede" && (
                            <>
                              <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => decide(r.id, "Onaylandı")}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => decide(r.id, "Reddedildi")}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">Talep bulunamadı.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-2">
              {filtered.map((r) => (
                <div key={r.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{r.fullName}</span>
                    <Badge className={statusColor(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="text-sm text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.branch} · {r.leaveType} · {fmt(r.startDate)} – {fmt(r.endDate)}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelected(r); setAdminNote(r.adminNote); }}>Görüntüle</Button>
                    {r.status === "Beklemede" && (
                      <>
                        <Button size="sm" className="bg-green-500 text-white" onClick={() => decide(r.id, "Onaylandı")}>Onayla</Button>
                        <Button size="sm" variant="destructive" onClick={() => decide(r.id, "Reddedildi")}>Reddet</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-center text-muted-foreground py-6">Talep bulunamadı.</p>}
            </div>
          </TabsContent>

          <TabsContent value="balances" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {employeeBalances.map((emp) => (
                <div key={emp.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{emp.fullName}</p>
                      <p className="text-xs text-muted-foreground">{emp.branch || "—"} {emp.title ? `· ${emp.title}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${emp.annualLeave >= 999 ? "text-primary" : emp.remaining <= 3 ? "text-destructive" : "text-primary"}`}>
                        {emp.annualLeave >= 999 ? "∞" : emp.remaining}
                      </p>
                      <p className="text-[10px] text-muted-foreground">gün kaldı</p>
                    </div>
                  </div>
                  <Progress value={emp.annualLeave >= 999 ? 100 : (emp.remaining / emp.annualLeave) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Kullanılan: {emp.used} gün</span>
                    <span>Toplam: {emp.annualLeave >= 999 ? "∞" : emp.annualLeave} gün</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <SheetContent className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Talep Detayı</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <Detail label="Ad Soyad" value={selected.fullName} />
                <Detail label="Şube" value={selected.branch} />
                <Detail label="Başlık" value={selected.title} />
                <Detail label="İzin Türü" value={selected.leaveType} />
                <Detail label="Başlangıç" value={fmt(selected.startDate)} />
                <Detail label="Bitiş" value={fmt(selected.endDate)} />
                <Detail label="Süre" value={`${differenceInCalendarDays(new Date(selected.endDate), new Date(selected.startDate)) + 1} gün`} />
                <Detail label="Not" value={selected.note || "—"} />
                <Detail label="Durum" value={selected.status} />
                {selected.decidedAt && <Detail label="Karar Tarihi" value={fmt(selected.decidedAt)} />}

                <div className="space-y-2 pt-2">
                  <Label>Admin Notu</Label>
                  <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Not ekleyin..." rows={2} />
                </div>

                {selected.status === "Beklemede" && (
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-green-500 text-white h-12 text-base" onClick={() => decide(selected.id, "Onaylandı")}>Onayla</Button>
                    <Button variant="destructive" className="flex-1 h-12 text-base" onClick={() => decide(selected.id, "Reddedildi")}>Reddet</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
    </>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="border rounded-lg p-4 flex items-center gap-3">
      {icon}
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
