import { useState, useRef, useEffect } from "react";
import logo from "@/assets/kolay-izin-logo.png";
import ModuleHeader from "@/components/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/modules/kolay-izin/lib/store";
import { toast } from "sonner";
import { employees, findEmployeeByPassword } from "@/modules/kolay-izin/data/employees";

export default function KolayIzinLogin() {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = nameInput.trim()
    ? employees.filter((e) =>
        e.fullName.toLowerCase().includes(nameInput.trim().toLowerCase())
      )
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Lütfen adınızı girin.");
      return;
    }
    const employee = findEmployeeByPassword(nameInput, password);
    if (!employee) {
      toast.error("Ad veya şifre yanlış.");
      return;
    }
    setSession({ fullName: employee.fullName, branch: employee.branch, isAdmin: employee.isAdmin });
    navigate(employee.isAdmin ? "/module/kolay-izin/admin" : "/module/kolay-izin/employee");
  };

  return (
    <>
    <ModuleHeader title="ZDC Kolay İzin" />
    <div className="flex min-h-[calc(100vh-49px)] items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-3">
          <img src={logo} alt="Zorlu Digital Plaza" className="h-44 mx-auto" />
          <p className="text-sm text-muted-foreground">İzin Talep Sistemi</p>
        </div>

        <div className="space-y-2 relative" ref={wrapperRef}>
          <Label>Ad Soyad</Label>
          <Input
            value={nameInput}
            onChange={(e) => {
              setNameInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => nameInput.trim() && setShowSuggestions(true)}
            placeholder="Adınızı yazın"
            className="h-12 text-base"
            autoComplete="off"
          />
          {showSuggestions && filtered.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
              {filtered.map((e) => (
                <li
                  key={e.id}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={() => {
                    setNameInput(e.fullName);
                    setShowSuggestions(false);
                  }}
                >
                  {e.fullName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifrenizi girin" className="h-12 text-base" />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold">
          Giriş Yap
        </Button>
      </form>
    </div>
  );
}
