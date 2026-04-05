import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import zorluLogo from "@/assets/zorlu-logo.png";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/700.css";
import { FileDown, Printer, Facebook, Instagram, Youtube } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.79 4.79 0 0 1-1-.06z"/>
  </svg>
);

const LINE_HEIGHT = 28;
const LINES_COUNT = 24;
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

const Notepad = () => {
  const [text, setText] = useState("");
  const [exporting, setExporting] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExportPDF = useCallback(async () => {
    if (!pageRef.current) return;
    setExporting(true);
    await new Promise((r) => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(pageRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgRatio = canvas.height / canvas.width;
      const pdfHeight = pageWidth * imgRatio;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, Math.min(pdfHeight, pageHeight));
      pdf.save("zorlu-not.pdf");
    } catch (err) {
      console.error("PDF oluşturma hatası:", err);
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-8 px-4 gap-4">
      <div className="flex gap-3 print-hide">
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <FileDown className="w-4 h-4" />
          {exporting ? "PDF Oluşturuluyor..." : "PDF Olarak Kaydet"}
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Printer className="w-4 h-4" />
          Yazdır
        </button>
      </div>

      <div
        ref={pageRef}
        className="bg-white shadow-2xl flex flex-col"
        style={{ width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px`, maxWidth: '100%' }}
      >
        <div className="flex flex-col items-center pt-5 pb-4 px-6">
          <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-12 object-contain" />
        </div>

        <div className="flex-1 relative mx-6 mb-2">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            {Array.from({ length: LINES_COUNT }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-b border-dashed"
                style={{ top: `${(i + 1) * LINE_HEIGHT + LINE_HEIGHT * 0.25}px`, borderColor: '#bbb' }}
              />
            ))}
          </div>

          {exporting ? (
            <div
              className="w-full whitespace-pre-wrap text-xl text-black"
              style={{
                lineHeight: `${LINE_HEIGHT}px`,
                minHeight: `${LINES_COUNT * LINE_HEIGHT}px`,
                paddingTop: `${LINE_HEIGHT * 0.25}px`,
                fontFamily: "'Caveat', cursive",
              }}
            >
              {text}
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Notunuzu buraya yazın..."
              className="w-full bg-transparent resize-none outline-none text-xl text-black placeholder:text-gray-400"
              style={{
                lineHeight: `${LINE_HEIGHT}px`,
                height: `${LINES_COUNT * LINE_HEIGHT}px`,
                paddingTop: `${LINE_HEIGHT * 0.25}px`,
                fontFamily: "'Caveat', cursive",
              }}
              spellCheck={false}
            />
          )}
        </div>

        <div className="mx-6" style={{ borderTop: '1px solid #bbb' }} />
        <div className="grid grid-cols-2 gap-2 px-6 py-2">
          <div className="text-left">
            <p className="text-[10px] font-bold text-black tracking-wide">📍 Lefkoşa Şube</p>
            <p className="text-[8px] text-gray-500 leading-relaxed">
              Belediye Bulvarı, Kent Plaza A Blok No:1<br />
              Yenikent – Lefkoşa<br />
              Tel: +90 392 223 97 39 / +90 548 851 22 22
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-black tracking-wide">📍 Mağusa Şube</p>
            <p className="text-[8px] text-gray-500 leading-relaxed">
              Eşref Bitlis Cad. No:21<br />
              Dükkan Sol 2 – Mağusa<br />
              Tel: +90 548 841 36 36
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 px-6 pb-1">
          <a href="https://facebook.com/zorludigitalplaza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
            <Facebook className="w-3.5 h-3.5" />
            <span className="text-[8px]">zorludigitalplaza</span>
          </a>
          <a href="https://instagram.com/zorludigitalplaza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
            <Instagram className="w-3.5 h-3.5" />
            <span className="text-[8px]">zorludigitalplaza</span>
          </a>
          <a href="https://youtube.com/@zorludigitalplaza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
            <Youtube className="w-3.5 h-3.5" />
            <span className="text-[8px]">zorludigitalplaza</span>
          </a>
          <a href="https://tiktok.com/@zorludigitalplaza" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
            <TikTokIcon className="w-3.5 h-3.5" />
            <span className="text-[8px]">zorludigitalplaza</span>
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 py-2 px-4 flex-wrap" style={{ backgroundColor: '#1f1f1f', color: '#fff' }}>
          <span className="text-[9px] tracking-wide">🌐 www.zorluplus.com</span>
          <span className="text-[9px]">|</span>
          <span className="text-[9px] tracking-wide">📞 Call Center & WhatsApp: +90 548 878 31 31</span>
        </div>
      </div>
    </div>
  );
};

export default Notepad;
