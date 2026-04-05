import zorluLogo from "@/assets/zorlu-logo.png";
import authorizedSignature from "@/assets/authorized-signature.png";
import zorluQr from "@/assets/zorlu-qr.jpg";
import type { ProductInfo, RepairPartInfo } from "./InsuranceReportForm";

interface ReportData {
  customerName: string;
  customerSurname: string;
  customerPhone: string;
  customerAddress: string;
  products: ProductInfo[];
  defectReason: string;
  repairParts: RepairPartInfo[];
  isRepairable: boolean;
  equivalentProduct: string;
  equivalentProductCost: string;
  reportDate: string;
  reportNumber: string;
  inspectionLocation: string;
  inspectionLocationOther: string;
}

const getInspectionLocationLabel = (value: string, otherText: string) => {
  switch (value) {
    case "musteri_evi": return "Müşteri Kendi Evi";
    case "zorlu_service_center": return "Zorlu Service Center";
    case "diger": return otherText || "Diğer";
    default: return "—";
  }
};

interface InsuranceReportPreviewProps {
  data: ReportData;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCurrency = (value: string) => {
  if (!value) return "0,00 TL";
  const num = parseFloat(value.replace(",", "."));
  if (isNaN(num)) return "0,00 TL";
  return num.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL";
};

const InsuranceReportPreview = ({ data }: InsuranceReportPreviewProps) => {
  return (
    <div className="bg-card shadow-xl mx-auto" style={{ aspectRatio: "297/210", maxWidth: "900px" }}>
      <div className="h-full flex flex-col p-5">
        <div className="flex items-start justify-between border-b-2 border-primary pb-2 mb-2">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3">
              <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-12 object-contain" />
              <img src={zorluQr} alt="QR Code" className="h-12 w-12 object-contain" />
            </div>
            <div className="mt-1">
              <p className="text-[10px] text-primary font-medium tracking-wide">📞 +90 548 878 31 31 • 🌐 www.zorluplus.com • 📧 info@zorluplus.com</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-sm font-bold text-primary uppercase tracking-widest">SİGORTA / EKSPERTİZ RAPORU</h1>
            <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
              <p><span className="font-medium">Rapor No:</span> {data.reportNumber || "—"}</p>
              <p><span className="font-medium">Tarih:</span> {formatDate(data.reportDate) || "—"}</p>
              <p><span className="font-medium">Teşhis Yeri:</span> {getInspectionLocationLabel(data.inspectionLocation, data.inspectionLocationOther)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="bg-muted rounded p-2 border border-border">
              <h2 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 border-b border-border pb-1">Müşteri Bilgileri</h2>
              <div className="space-y-0.5 text-foreground">
                <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Ad Soyad:</span><span className="font-medium">{data.customerName} {data.customerSurname}</span></div>
                <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Telefon:</span><span className="font-medium">{data.customerPhone || "—"}</span></div>
                <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Adres:</span><span className="font-medium line-clamp-1">{data.customerAddress || "—"}</span></div>
              </div>
            </div>
            <div className="bg-muted rounded p-2 border border-border">
              <h2 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 border-b border-border pb-1">Ürün Bilgileri ({data.products.length} Ürün)</h2>
              <div className="space-y-1 text-foreground max-h-16 overflow-y-auto">
                {data.products.map((product, index) => (
                  <div key={index} className={index > 0 ? "pt-1 border-t border-border" : ""}>
                    {data.products.length > 1 && <span className="text-xs text-primary font-medium">Ürün {index + 1}</span>}
                    <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Marka:</span><span className="font-medium">{product.brand || "—"}</span></div>
                    <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Model:</span><span className="font-medium">{product.model || "—"}</span></div>
                    <div className="flex"><span className="text-muted-foreground w-14 shrink-0">Açıklama:</span><span className="font-medium line-clamp-1">{product.description || "—"}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-muted rounded p-2 border border-border">
              <h2 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 border-b border-border pb-1">Arıza Bilgileri</h2>
              <p className="font-medium leading-relaxed line-clamp-2 text-foreground">{data.defectReason || "Arıza sebebi belirtilmemiş."}</p>
            </div>
            <div className={`rounded p-2 border-2 ${data.isRepairable ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"}`}>
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-1 border-b border-border pb-1">
                {data.isRepairable ? "Tamir Bilgileri" : "Değişim Bilgileri"}
              </h2>
              <div className="space-y-0.5 text-foreground">
                {data.isRepairable ? (
                  <>
                    <div className="flex items-center"><span className="text-muted-foreground w-16 shrink-0">Durum:</span><span className="font-semibold text-green-700">Tamir Edilebilir</span></div>
                    <div className="max-h-12 overflow-y-auto space-y-0.5">
                      {data.repairParts.map((part, index) => (
                        <div key={index} className={index > 0 ? "pt-0.5 border-t border-border" : ""}>
                          <div className="flex justify-between"><span className="font-medium text-xs">{part.partName || "—"}</span><span className="font-semibold text-green-700 text-xs">{formatCurrency(part.cost)}</span></div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center pt-1 border-t border-border">
                      <span className="text-muted-foreground w-16 shrink-0">Toplam:</span>
                      <span className="font-bold text-sm text-green-700">
                        {formatCurrency(data.repairParts.reduce((sum, part) => sum + (parseFloat(part.cost.replace(",", ".")) || 0), 0).toString())}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center"><span className="text-muted-foreground w-16 shrink-0">Durum:</span><span className="font-semibold text-amber-700">Tamir Edilemez</span></div>
                    <div className="flex"><span className="text-muted-foreground w-16 shrink-0">Eş Değer:</span><span className="font-medium line-clamp-1">{data.equivalentProduct || "—"}</span></div>
                    <div className="flex items-center"><span className="text-muted-foreground w-16 shrink-0">Bedel:</span><span className="font-bold text-sm text-amber-700">{formatCurrency(data.equivalentProductCost)}</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-2"></div>

        <div className="pt-2 border-t-2 border-border">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="h-10 border-b-2 border-border mb-1 flex items-center justify-center">
                <img src={authorizedSignature} alt="Yetkili İmza" className="h-8 object-contain" />
              </div>
              <p className="text-muted-foreground font-medium text-xs">Yetkili İmza</p>
              <p className="text-xs text-muted-foreground">Zorlu Digital Plaza</p>
            </div>
            <div className="text-center">
              <div className="h-10 border-b-2 border-border mb-1"></div>
              <p className="text-muted-foreground font-medium text-xs">Müşteri İmza</p>
              <p className="text-xs text-muted-foreground">{data.customerName} {data.customerSurname}</p>
            </div>
            <div className="text-center">
              <div className="h-10 border-b-2 border-border mb-1"></div>
              <p className="text-muted-foreground font-medium text-xs">Eksper / Sigorta Yetkilisi</p>
              <p className="text-xs text-muted-foreground">Kaşe ve İmza</p>
            </div>
          </div>
        </div>

        <div className="mt-1 text-xs text-muted-foreground text-center">
          <p>Bu rapor Zorlu Digital Plaza tarafından müşterimizin isteği üzerine düzenlenmiştir. İşbu belge sigorta ve ekspertiz işlemleri için geçerlidir.</p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceReportPreview;
