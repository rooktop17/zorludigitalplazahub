import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw, Eye, CheckCircle, XCircle, Clock, Search } from "lucide-react";

type ReturnStatus = "pending" | "approved" | "rejected";

const statusConfig: Record<ReturnStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  approved: { label: "Onaylandı", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  rejected: { label: "Reddedildi", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

export default function ReturnAdminPanel() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("return_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Talepler yüklenemedi.");
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: ReturnStatus) => {
    const { error } = await supabase
      .from("return_requests")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast.error("Durum güncellenemedi: " + error.message);
      return;
    }
    toast.success(`Talep ${statusConfig[status].label.toLowerCase()} olarak güncellendi.`);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev: any) => ({ ...prev, status }));
    }
  };

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchSearch = searchTerm === "" ||
      `${r.customer_name} ${r.customer_surname} ${r.invoice_no || ""}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map(key => {
            const isAll = key === "all";
            const cfg = isAll ? null : statusConfig[key];
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  filterStatus === key ? "ring-2 ring-primary border-primary" : "border-border"
                } bg-card`}
              >
                <p className="text-2xl font-bold text-foreground">{counts[key]}</p>
                <p className="text-sm text-muted-foreground">{isAll ? "Toplam" : cfg!.label}</p>
              </button>
            );
          })}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Müşteri adı veya fatura no ile ara..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card text-foreground"
            />
          </div>
          <button onClick={fetchRequests} className="p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* List */}
          <div className="flex-1 space-y-3">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Yükleniyor...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Talep bulunamadı.</div>
            ) : (
              filtered.map(req => {
                const cfg = statusConfig[(req.status as ReturnStatus) || "pending"];
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                      selectedRequest?.id === req.id ? "ring-2 ring-primary border-primary" : "border-border"
                    } bg-card`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {req.customer_name} {req.customer_surname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {req.product_name || "—"} • {req.application_date}
                        </p>
                        {req.invoice_no && (
                          <p className="text-xs text-muted-foreground mt-1">Fatura: {req.invoice_no}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cfg.color}`}>
                        <StatusIcon size={12} />
                        {cfg.label}
                      </span>
                    </div>
                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3">
                      {req.status !== "approved" && (
                        <button
                          onClick={e => { e.stopPropagation(); updateStatus(req.id, "approved"); }}
                          className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Onayla
                        </button>
                      )}
                      {req.status !== "rejected" && (
                        <button
                          onClick={e => { e.stopPropagation(); updateStatus(req.id, "rejected"); }}
                          className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Reddet
                        </button>
                      )}
                      {req.status !== "pending" && (
                        <button
                          onClick={e => { e.stopPropagation(); updateStatus(req.id, "pending"); }}
                          className="text-xs px-3 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          Beklet
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Detail */}
          {selectedRequest && (
            <div className="lg:w-[400px] shrink-0">
              <div className="sticky top-8 bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-lg">Talep Detayı</h3>
                  <button onClick={() => setSelectedRequest(null)} className="text-muted-foreground hover:text-foreground text-sm">
                    Kapat
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <Detail label="Müşteri" value={`${selectedRequest.customer_name} ${selectedRequest.customer_surname}`} />
                  <Detail label="Telefon" value={selectedRequest.customer_phone} />
                  <Detail label="E-posta" value={selectedRequest.customer_email} />
                  <Detail label="Adres" value={selectedRequest.customer_address} />
                  <hr className="border-border" />
                  <Detail label="Fatura No" value={selectedRequest.invoice_no} />
                  <Detail label="Fatura Tarihi" value={selectedRequest.invoice_date} />
                  <hr className="border-border" />
                  <Detail label="Ürün" value={selectedRequest.product_name} />
                  <Detail label="Marka / Model" value={`${selectedRequest.product_brand || ""} ${selectedRequest.product_model || ""}`.trim()} />
                  <Detail label="Seri No" value={selectedRequest.product_serial_no} />
                  <Detail label="Adet" value={selectedRequest.product_quantity} />
                  <Detail label="İade Sebebi" value={selectedRequest.return_reason} />
                  <Detail label="Ürün Durumu" value={selectedRequest.product_condition} />
                  <hr className="border-border" />
                  <Detail label="Banka" value={`${selectedRequest.bank_name || ""} - ${selectedRequest.bank_branch || ""}`} />
                  <Detail label="IBAN" value={selectedRequest.iban} />
                  <Detail label="Hesap Sahibi" value={selectedRequest.account_holder} />
                  <hr className="border-border" />
                  <Detail label="Ürün Fiyatı" value={selectedRequest.product_price ? `₺${selectedRequest.product_price}` : null} />
                  <Detail label="KDV" value={selectedRequest.tax_amount ? `₺${selectedRequest.tax_amount}` : null} />
                  <Detail label="Toplam İade" value={selectedRequest.total_refund ? `₺${selectedRequest.total_refund}` : null} highlight />
                  {selectedRequest.notes && <Detail label="Notlar" value={selectedRequest.notes} />}
                </div>

                {/* Status actions */}
                <div className="flex gap-2 pt-2">
                  {(["pending", "approved", "rejected"] as ReturnStatus[]).map(s => {
                    const cfg = statusConfig[s];
                    const Icon = cfg.icon;
                    const isActive = selectedRequest.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedRequest.id, s)}
                        disabled={isActive}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive ? cfg.color + " cursor-default" : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Icon size={14} />
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`text-foreground ${highlight ? "font-bold text-base" : ""}`}>{value}</p>
    </div>
  );
}
