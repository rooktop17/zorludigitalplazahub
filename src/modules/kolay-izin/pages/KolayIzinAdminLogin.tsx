import { useState } from "react";
import logo from "@/assets/kolay-izin-logo.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/modules/kolay-izin/lib/store";
import type { Branch } from "@/modules/kolay-izin/types/leave";
import { toast } from "sonner";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "hacilarpompa";

export default function KolayIzinAdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      toast.error("Kullanıcı adı veya şifre yanlış.");
      return;
    }
    setSession({ fullName: "Admin", branch: "Lefkoşa" as Branch, isAdmin: true });
    navigate("/module/kolay-izin/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="text-center space-y-3">
          <img src={logo} alt="Zorlu Digital Plaza" className="h-44 mx-auto" />
          <p className="text-sm text-muted-foreground">Yönetici Girişi</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Kullanıcı Adı</Label>
          <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adı" className="h-12 text-base" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" className="h-12 text-base" />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold">
          Giriş Yap
        </Button>
      </form>
    </div>
  );
}
