import { useState, useEffect, useMemo } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { addRequest, getRequests, getSession, clearSession } from "@/modules/kolay-izin/lib/store";
import { findEmployee } from "@/modules/kolay-izin/data/employees";
import type { LeaveRequest, LeaveType, Branch } from "@/modules/kolay-izin/types/leave";
import { toast } from "sonner";
import { LogOut, CalendarDays } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { tr } from "date-fns/locale";

const leaveTypes: LeaveType[] = ["Yıllık", "Rapor", "Mazeret", "Ücretsiz"];

function statusColor(status: LeaveRequest["status"]) {
  if (status === "Onaylandı") return "bg-green-500 text-white";
  if (status === "Reddedildi") return "bg-destructive text-destructive-foreground";
  return "bg-yellow-500 text-white";
}

function calcDays(start: string, end: string): number {
  return differenceInCalendarDays(new Date(end), new Date(start)) + 1;
}

export default function KolayIzinEmployee() {
  const navigate = useNavigate();
  const session = getSession();

  const [title, setTitle] = useState("");
  const [leaveType, setLeaveType] = useState<LeaveType | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [note, setNote] = useState("");
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);

  const employee = session ? findEmployee(session.fullName) : undefined;
  const branch = employee?.branch || session?.branch || "";
  const totalLeave = employee?.annualLeave ?? 14;

  useEffect(() => {
    if (!session || session.isAdmin) { navigate("/module/kolay-izin"); return; }
    refreshList();
  }, []);

  const refreshList = () => {
    const all = getRequests();
    setMyRequests(all.filter((r) => r.fullName === session?.fullName));
  };

  const usedDays = useMemo(() => {
    return myRequests
      .filter((r) => r.leaveType === "Yıllık" && r.status !== "Reddedildi")
      .reduce((sum, r) => sum + calcDays(r.startDate, r.endDate), 0);
  }, [myRequests]);

  const isUnlimited = totalLeave >= 999;
  const remainingDays = Math.max(0, totalLeave - usedDays);
  const progressPercent = isUnlimited ? 100 : (remainingDays / totalLeave) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leaveType || !startDate || !endDate) {
      toast.error("Lütfen zorunlu alanları doldurun.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("Bitiş tarihi başlangıçtan önce olamaz.");
      return;
    }
    if (leaveType === "Yıllık") {
      const requestedDays = calcDays(startDate, endDate);
      if (requestedDays > remainingDays) {
        toast.error(`Yeterli yıllık izniniz yok. Kalan: ${remainingDays} gün.`);
        return;
      }
    }
    addRequest({
      fullName: session!.fullName,
      branch: branch as Branch,
      title: title.trim(),
      leaveType: leaveType as LeaveType,
      startDate,
      endDate,
      note: note.trim(),
    });
    toast.success("İzin talebiniz gönderildi!");
    setTitle(""); setLeaveType(""); setStartDate(""); setEndDate(""); setNote("");
    refreshList();
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
        <h1 className="text-lg font-bold text-foreground">İzin Talebi</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{session.fullName}</span>
          <Button variant="ghost" size="icon" onClick={() => { clearSession(); navigate("/module/kolay-izin"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-8">
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Yıllık İzin Durumu</h2>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Toplam: {isUnlimited ? "∞" : totalLeave} gün</span>
            <span className="text-muted-foreground">Kullanılan: {usedDays} gün</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
          <p className="text-center text-2xl font-bold text-primary">
            {isUnlimited ? "∞" : remainingDays} <span className="text-sm font-normal text-muted-foreground">gün kaldı</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Başlık *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn: Bayram izni" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label>İzin Türü *</Label>
            <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
              <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Seçin" /></SelectTrigger>
              <SelectContent>
                {leaveTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Başlangıç *</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <Label>Bitiş *</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 text-base" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Not</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="İsteğe bağlı not" rows={2} />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold">Gönder</Button>
        </form>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Taleplerim</h2>
          {myRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz talebiniz yok.</p>
          ) : (
            <div className="space-y-2">
              {myRequests.map((r) => (
                <div key={r.id} className="border rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{r.title}</span>
                    <Badge className={statusColor(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {r.leaveType} · {fmt(r.startDate)} – {fmt(r.endDate)} · {calcDays(r.startDate, r.endDate)} gün
                  </p>
                  {r.adminNote && (
                    <p className="text-xs text-muted-foreground italic">Admin: {r.adminNote}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{fmt(r.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
