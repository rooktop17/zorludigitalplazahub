import { useState } from "react";
import { useGlobalAuth } from "@/hooks/useGlobalAuth";
import ModuleHeader from "@/components/ModuleHeader";
import ReturnForm from "@/modules/return-refund/components/ReturnForm";
import ReturnAdminPanel from "@/modules/return-refund/components/ReturnAdminPanel";
import { LogIn, ShieldAlert } from "lucide-react";

export default function ReturnRefundPage() {
  const { user, isAdmin, loading, login, logout, isAuthenticated } = useGlobalAuth();
  const [tab, setTab] = useState<"form" | "admin">("form");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const result = await login(loginEmail, loginPassword);
    if (result.error) setLoginError(result.error);
    setLoginLoading(false);
  };

  if (loading) {
    return (
      <>
        <ModuleHeader title="İade & Refund" />
        <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Yükleniyor...</div>
      </>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <>
        <ModuleHeader title="İade & Refund" />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-xl p-6 space-y-4 shadow-lg">
            <div className="text-center">
              <LogIn size={32} className="mx-auto text-primary mb-2" />
              <h2 className="text-lg font-bold text-foreground">Giriş Yap</h2>
              <p className="text-sm text-muted-foreground">İade modülüne erişmek için giriş yapın</p>
            </div>
            {loginError && <p className="text-sm text-destructive text-center">{loginError}</p>}
            <input
              type="email"
              placeholder="E-posta"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              required
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loginLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <ModuleHeader title="İade & Refund" />
      <div className="flex items-center justify-center gap-2 py-4 px-4">
        <button
          onClick={() => setTab("form")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "form" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          İade Formu
        </button>
        {isAdmin && (
          <button
            onClick={() => setTab("admin")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "admin" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Admin Panel
          </button>
        )}
        <button
          onClick={logout}
          className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
        >
          Çıkış
        </button>
      </div>

      {/* Non-admin trying to access admin tab */}
      {tab === "admin" && !isAdmin ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-muted-foreground gap-3">
          <ShieldAlert size={48} />
          <p className="font-medium">Bu sayfaya erişim yetkiniz yok.</p>
        </div>
      ) : tab === "admin" ? (
        <ReturnAdminPanel />
      ) : (
        <ReturnForm />
      )}
    </>
  );
}
