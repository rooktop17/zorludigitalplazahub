import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, RefreshCw, Download } from "lucide-react";
import InsuranceReportForm from "../components/InsuranceReportForm";
import InsuranceReportPreview from "../components/InsuranceReportPreview";
import zorluLogo from "@/assets/zorlu-logo.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generateReportNumber = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const dateStr = `${day}${month}${year}`;
  const storageKey = `report_count_${dateStr}`;
  const currentCount = parseInt(localStorage.getItem(storageKey) || "0", 10);
  const newCount = currentCount + 1;
  localStorage.setItem(storageKey, String(newCount));
  const letterSuffix = String.fromCharCode(96 + newCount);
  return `ZDP-${dateStr}${letterSuffix}-ZORLU TECH & MAINTENANCE TEAM`;
};

const getInitialReportData = () => ({
  customerName: "",
  customerSurname: "",
  customerPhone: "",
  customerAddress: "",
  products: [{ brand: "", model: "", description: "" }],
  defectReason: "",
  repairParts: [{ partName: "", description: "", cost: "" }],
  isRepairable: true,
  equivalentProduct: "",
  equivalentProductCost: "",
  reportDate: new Date().toISOString().split("T")[0],
  reportNumber: generateReportNumber(),
  inspectionLocation: "",
  inspectionLocationOther: "",
});

const SigortaPage = () => {
  const [reportData, setReportData] = useState(getInitialReportData());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();
  const handleReset = () => setReportData(getInitialReportData());

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, logging: false, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${reportData.reportNumber || "rapor"}.pdf`);
    } catch (error) {
      console.error("PDF oluşturulurken hata:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="no-print bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-10 object-contain" />
            <div className="h-8 w-px bg-border"></div>
            <h1 className="text-xl font-semibold text-foreground">Sigorta & Ekspertiz Rapor Sistemi</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2"><RefreshCw className="h-4 w-4" />Yeni Rapor</Button>
            <Button variant="outline" onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="gap-2">
              <Download className="h-4 w-4" />{isGeneratingPdf ? "PDF Oluşturuluyor..." : "PDF İndir"}
            </Button>
            <Button onClick={handlePrint} className="gap-2"><Printer className="h-4 w-4" />Yazdır</Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="no-print">
          <InsuranceReportForm data={reportData} onChange={setReportData} />
        </div>
        <div>
          <div className="no-print mb-4">
            <h2 className="text-lg font-medium text-foreground">Çıktı Önizlemesi (A4 Yatay)</h2>
            <p className="text-sm text-muted-foreground">Bu önizleme yazdırma çıktısını yansıtmaktadır</p>
          </div>
          <div ref={previewRef}>
            <InsuranceReportPreview data={reportData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SigortaPage;
