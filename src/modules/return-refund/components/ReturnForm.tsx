import { useState, useRef, useEffect } from "react";
import { Printer, Building2, User, FileText, Package, Landmark, Calculator, CheckCircle, Download, Save, List, Trash2, RefreshCw } from "lucide-react";
import html2pdf from "html2pdf.js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import zorluLogo from "@/assets/zorlu-logo-black.png";
import yetkiliImza from "@/assets/authorized-signature.png";
import zorluQr from "@/assets/zorlu-qr.jpg";

interface FormData {
  customerName: string;
  customerSurname: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerTcNo: string;
  customerTaxNo: string;
  invoiceNo: string;
  invoiceDate: string;
  invoiceName: string;
  invoiceSurname: string;
  invoiceTaxNo: string;
  productName: string;
  productBrand: string;
  productModel: string;
  productSerialNo: string;
  productQuantity: string;
  returnReason: string;
  productCondition: string;
  bankName: string;
  bankBranch: string;
  accountHolder: string;
  iban: string;
  productPrice: string;
  taxAmount: string;
  totalRefund: string;
  applicationDate: string;
  notes: string;
}

const ReturnForm = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedRequests, setSavedRequests] = useState<any[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerSurname: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    customerTcNo: "",
    customerTaxNo: "",
    invoiceNo: "",
    invoiceDate: "",
    invoiceName: "",
    invoiceSurname: "",
    invoiceTaxNo: "",
    productName: "",
    productBrand: "",
    productModel: "",
    productSerialNo: "",
    productQuantity: "1",
    returnReason: "",
    productCondition: "",
    bankName: "",
    bankBranch: "",
    accountHolder: "",
    iban: "",
    productPrice: "",
    taxAmount: "",
    totalRefund: "",
    applicationDate: new Date().toISOString().split('T')[0],
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    if (!printRef.current) {
      window.print();
      return;
    }
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up engelleyici aktif olabilir. Lütfen izin verin.");
      return;
    }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Ürün İade Formu</title><style>@page{size:A4 portrait;margin:10mm}body{font-family:Arial,sans-serif;margin:0;padding:20px;font-size:10px}.border{border:1px solid #e5e7eb}.rounded{border-radius:4px}.p-1{padding:4px}.p-2{padding:8px}.grid{display:grid}.grid-cols-2{grid-template-columns:repeat(2,1fr)}.grid-cols-3{grid-template-columns:repeat(3,1fr)}.gap-2{gap:8px}.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.text-center{text-align:center}.font-bold{font-weight:bold}.font-semibold{font-weight:600}.font-medium{font-weight:500}.text-primary{color:#1e40af}.text-muted-foreground{color:#6b7280}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.col-span-2{grid-column:span 2}img{max-width:100%;height:auto}h4{margin:0}p{margin:0}</style></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  };

  const handleDownloadPdf = async () => {
    if (!showPreview) {
      setShowPreview(true);
      toast.info("Önizleme açılıyor, tekrar PDF İndir'e basın.");
      return;
    }
    if (!printRef.current) {
      toast.error("Önizleme yüklenemedi.");
      return;
    }
    setIsGeneratingPdf(true);
    const formNo = `ZDP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const customerName = formData.customerName || "iade";
    const fileName = `${formNo}_${customerName}_${formData.customerSurname || "form"}.pdf`;
    const clonedElement = printRef.current.cloneNode(true) as HTMLElement;
    clonedElement.style.width = '210mm';
    clonedElement.style.minHeight = '297mm';
    clonedElement.style.padding = '15mm';
    clonedElement.style.backgroundColor = 'white';
    clonedElement.style.fontSize = '11px';
    const options = {
      margin: [5, 5, 5, 5] as [number, number, number, number],
      filename: fileName,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    try {
      await html2pdf().set(options).from(clonedElement).save();
      toast.success("PDF başarıyla indirildi!");
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      toast.error("PDF oluşturulurken hata oluştu.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const formatIBAN = (value: string) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const handleIBANChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIBAN(e.target.value);
    setFormData(prev => ({ ...prev, iban: formatted }));
  };

  const handleSaveToDb = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Lütfen giriş yapın."); setIsSaving(false); return; }

      const record = {
        user_id: user.id,
        customer_name: formData.customerName,
        customer_surname: formData.customerSurname,
        customer_phone: formData.customerPhone || null,
        customer_email: formData.customerEmail || null,
        customer_address: formData.customerAddress || null,
        customer_tc_no: formData.customerTcNo || null,
        customer_tax_no: formData.customerTaxNo || null,
        invoice_no: formData.invoiceNo || null,
        invoice_date: formData.invoiceDate || null,
        product_name: formData.productName || null,
        product_brand: formData.productBrand || null,
        product_model: formData.productModel || null,
        product_serial_no: formData.productSerialNo || null,
        product_quantity: parseInt(formData.productQuantity) || 1,
        return_reason: formData.returnReason || null,
        product_condition: formData.productCondition || null,
        bank_name: formData.bankName || null,
        bank_branch: formData.bankBranch || null,
        account_holder: formData.accountHolder || null,
        iban: formData.iban || null,
        product_price: parseFloat(formData.productPrice.replace(',', '.')) || 0,
        tax_amount: parseFloat(formData.taxAmount.replace(',', '.')) || 0,
        total_refund: parseFloat(formData.totalRefund.replace(',', '.')) || 0,
        application_date: formData.applicationDate,
        notes: formData.notes || null,
      };

      if (currentId) {
        const { error } = await supabase.from('return_requests').update(record).eq('id', currentId);
        if (error) throw error;
        toast.success("İade talebi güncellendi!");
      } else {
        const { data, error } = await supabase.from('return_requests').insert(record).select().single();
        if (error) throw error;
        setCurrentId(data.id);
        toast.success("İade talebi kaydedildi!");
      }
    } catch (err: any) {
      toast.error("Kayıt hatası: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSavedRequests = async () => {
    const { data, error } = await supabase.from('return_requests').select('*').order('created_at', { ascending: false });
    if (error) { toast.error("Liste alınamadı."); return; }
    setSavedRequests(data || []);
    setShowSavedList(true);
  };

  const loadRequest = (req: any) => {
    setCurrentId(req.id);
    setFormData({
      customerName: req.customer_name || "",
      customerSurname: req.customer_surname || "",
      customerPhone: req.customer_phone || "",
      customerEmail: req.customer_email || "",
      customerAddress: req.customer_address || "",
      customerTcNo: req.customer_tc_no || "",
      customerTaxNo: req.customer_tax_no || "",
      invoiceNo: req.invoice_no || "",
      invoiceDate: req.invoice_date || "",
      invoiceName: "",
      invoiceSurname: "",
      invoiceTaxNo: "",
      productName: req.product_name || "",
      productBrand: req.product_brand || "",
      productModel: req.product_model || "",
      productSerialNo: req.product_serial_no || "",
      productQuantity: String(req.product_quantity || 1),
      returnReason: req.return_reason || "",
      productCondition: req.product_condition || "",
      bankName: req.bank_name || "",
      bankBranch: req.bank_branch || "",
      accountHolder: req.account_holder || "",
      iban: req.iban || "",
      productPrice: String(req.product_price || ""),
      taxAmount: String(req.tax_amount || ""),
      totalRefund: String(req.total_refund || ""),
      applicationDate: req.application_date || new Date().toISOString().split('T')[0],
      notes: req.notes || "",
    });
    setShowSavedList(false);
    toast.success("Talep yüklendi.");
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from('return_requests').delete().eq('id', id);
    if (error) { toast.error("Silinemedi."); return; }
    setSavedRequests(prev => prev.filter(r => r.id !== id));
    if (currentId === id) setCurrentId(null);
    toast.success("Talep silindi.");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={formRef}>
          <div className="corporate-header mb-0 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="bg-white rounded-lg p-2">
                <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-12 md:h-16 w-auto" />
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-semibold">ÜRÜN İADE PANELİ</p>
                <p className="text-white/70 text-sm">Form No: ZDP-{new Date().getFullYear()}-____</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-b-xl shadow-lg border border-t-0 border-border p-6 md:p-8">
            <div className="flex flex-wrap justify-end gap-3 mb-6 no-print">
              <button onClick={handleSaveToDb} className="print-button bg-green-600 text-white" disabled={isSaving}>
                <Save size={18} />
                {isSaving ? "Kaydediliyor..." : currentId ? "Güncelle" : "Kaydet"}
              </button>
              <button onClick={fetchSavedRequests} className="print-button bg-blue-600 text-white">
                <List size={18} />
                Kayıtlı Talepler
              </button>
              <button onClick={handleDownloadPdf} className="print-button bg-accent" disabled={isGeneratingPdf}>
                <Download size={18} />
                {isGeneratingPdf ? "PDF Hazırlanıyor..." : "PDF İndir"}
              </button>
              <button onClick={handlePrint} className="print-button">
                <Printer size={18} />
                Yazdır
              </button>
            </div>

            {showSavedList && (
              <div className="mb-6 border border-border rounded-lg p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">Kayıtlı İade Talepleri</h3>
                  <button onClick={() => setShowSavedList(false)} className="text-sm text-muted-foreground hover:text-foreground">Kapat</button>
                </div>
                {savedRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz kayıtlı talep yok.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {savedRequests.map(req => (
                      <div key={req.id} className="flex items-center justify-between p-2 bg-card rounded border border-border">
                        <button onClick={() => loadRequest(req)} className="text-left flex-1 hover:text-primary">
                          <span className="font-medium">{req.customer_name} {req.customer_surname}</span>
                          <span className="text-xs text-muted-foreground ml-2">{req.application_date} — {req.status}</span>
                        </button>
                        <button onClick={() => deleteRequest(req.id)} className="text-destructive hover:text-destructive/80 ml-2 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <section className="form-section">
              <h2 className="form-section-title"><User size={20} className="text-primary" />Müşteri Bilgileri</h2>
              <div className="form-grid">
                <div className="form-field"><label className="form-label">Adı *</label><input type="text" name="customerName" value={formData.customerName} onChange={handleChange} className="form-input" placeholder="Müşteri adı" /></div>
                <div className="form-field"><label className="form-label">Soyadı *</label><input type="text" name="customerSurname" value={formData.customerSurname} onChange={handleChange} className="form-input" placeholder="Müşteri soyadı" /></div>
                <div className="form-field"><label className="form-label">KURUMSAL - TÜZEL KİŞİ ADI</label><input type="text" name="customerTcNo" value={formData.customerTcNo} onChange={handleChange} className="form-input" placeholder="Tüzel kişi / Şirket adı" /></div>
                <div className="form-field"><label className="form-label">MS / VERGİ NO</label><input type="text" name="customerTaxNo" value={formData.customerTaxNo} onChange={handleChange} className="form-input" placeholder="Vergi numarası" /></div>
                <div className="form-field"><label className="form-label">Telefon *</label><input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} className="form-input" placeholder="0 (5XX) XXX XX XX" /></div>
                <div className="form-field"><label className="form-label">E-posta</label><input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} className="form-input" placeholder="ornek@email.com" /></div>
                <div className="form-field md:col-span-2"><label className="form-label">Adres *</label><textarea name="customerAddress" value={formData.customerAddress} onChange={handleChange} className="form-textarea" rows={2} placeholder="Açık adres" /></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><FileText size={20} className="text-primary" />Fatura Bilgileri</h2>
              <div className="form-grid">
                <div className="form-field"><label className="form-label">Fatura No *</label><input type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} className="form-input" placeholder="Fatura numarası" /></div>
                <div className="form-field"><label className="form-label">Fatura Tarihi *</label><input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} className="form-input" /></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><Package size={20} className="text-primary" />İade Edilen Ürün Bilgileri</h2>
              <div className="form-grid">
                <div className="form-field"><label className="form-label">Ürün Adı *</label><input type="text" name="productName" value={formData.productName} onChange={handleChange} className="form-input" placeholder="Ürün adı" /></div>
                <div className="form-field"><label className="form-label">Marka *</label><input type="text" name="productBrand" value={formData.productBrand} onChange={handleChange} className="form-input" placeholder="Ürün markası" /></div>
                <div className="form-field"><label className="form-label">Model *</label><input type="text" name="productModel" value={formData.productModel} onChange={handleChange} className="form-input" placeholder="Ürün modeli" /></div>
                <div className="form-field"><label className="form-label">Seri No *</label><input type="text" name="productSerialNo" value={formData.productSerialNo} onChange={handleChange} className="form-input" placeholder="Ürün seri numarası" /></div>
                <div className="form-field"><label className="form-label">Adet *</label><input type="number" name="productQuantity" value={formData.productQuantity} onChange={handleChange} className="form-input" min="1" /></div>
                <div className="form-field"><label className="form-label">Ürün Durumu *</label><select name="productCondition" value={formData.productCondition} onChange={handleChange} className="form-input"><option value="">Seçiniz</option><option value="kullanilmamis">Kullanılmamış / Ambalajında</option><option value="az_kullanilmis">Az Kullanılmış</option><option value="arizali">Arızalı</option><option value="hasarli">Hasarlı</option></select></div>
                <div className="form-field md:col-span-2"><label className="form-label">İade Sebebi *</label><select name="returnReason" value={formData.returnReason} onChange={handleChange} className="form-input"><option value="">Seçiniz</option><option value="cayma">Cayma Hakkı (14 Gün)</option><option value="urun_hatasi">Üretim Hatası</option><option value="yanlis_urun">Yanlış Ürün Gönderimi</option><option value="hasarli_teslimat">Hasarlı Teslimat</option><option value="garanti">Garanti Kapsamında</option><option value="diger">Diğer</option></select></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><Landmark size={20} className="text-primary" />İade Yapılacak Banka Bilgileri</h2>
              <div className="form-grid">
                <div className="form-field"><label className="form-label">Banka Adı *</label><input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="form-input" placeholder="Örn: Ziraat Bankası" /></div>
                <div className="form-field"><label className="form-label">Şube Adı *</label><input type="text" name="bankBranch" value={formData.bankBranch} onChange={handleChange} className="form-input" placeholder="Şube adı" /></div>
                <div className="form-field"><label className="form-label">Hesap Sahibi Adı Soyadı *</label><input type="text" name="accountHolder" value={formData.accountHolder} onChange={handleChange} className="form-input" placeholder="Hesap sahibinin adı soyadı" /></div>
                <div className="form-field md:col-span-2"><label className="form-label">IBAN Numarası *</label><input type="text" name="iban" value={formData.iban} onChange={handleIBANChange} className="form-input font-mono tracking-wide" maxLength={32} placeholder="TR00 0000 0000 0000 0000 0000 00" /></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><Calculator size={20} className="text-primary" />İade Tutarı Bilgileri</h2>
              <div className="form-grid-3">
                <div className="form-field"><label className="form-label">Ürün Fiyatı (KDV Hariç) *</label><div className="relative"><input type="text" name="productPrice" value={formData.productPrice} onChange={handleChange} className="form-input pr-8" placeholder="0,00" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span></div></div>
                <div className="form-field"><label className="form-label">KDV Tutarı *</label><div className="relative"><input type="text" name="taxAmount" value={formData.taxAmount} onChange={handleChange} className="form-input pr-8" placeholder="0,00" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span></div></div>
                <div className="form-field"><label className="form-label">Toplam İade Tutarı *</label><div className="relative"><input type="text" name="totalRefund" value={formData.totalRefund} onChange={handleChange} className="form-input pr-8 font-semibold bg-secondary" placeholder="0,00" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₺</span></div></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><CheckCircle size={20} className="text-primary" />Ek Bilgiler ve Onay</h2>
              <div className="space-y-4">
                <div className="form-field"><label className="form-label">Başvuru Tarihi *</label><input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleChange} className="form-input w-full md:w-1/3" /></div>
                <div className="form-field"><label className="form-label">Ek Notlar / Açıklamalar</label><textarea name="notes" value={formData.notes} onChange={handleChange} className="form-textarea" rows={3} placeholder="Varsa ek açıklamalar..." /></div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title"><Building2 size={20} className="text-primary" />İmza ve Onay</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="form-label mb-2">Müşteri İmzası</p><div className="signature-box"></div></div>
                <div><p className="form-label mb-2">Yetkili İmzası / Kaşe</p><div className="signature-box items-center justify-center"><img src={yetkiliImza} alt="Yetkili İmza" className="h-16 w-auto object-contain" /></div></div>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-divider text-center text-sm text-muted-foreground">
              <p className="font-medium">ZORLU DIGITAL PLAZA</p>
              <p className="mt-1 text-xs">Bu form iade işlemleri için düzenlenmiştir. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 no-print">
          <button onClick={() => setShowPreview(!showPreview)} className="print-button bg-secondary text-secondary-foreground">
            {showPreview ? "Önizlemeyi Gizle" : "Yazdırma Önizlemesi Göster"}
          </button>
        </div>

        {showPreview && (
          <div className="print-preview-wrapper no-print">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h3 className="text-lg font-semibold text-muted-foreground">A4 Dikey Yazdırma Önizlemesi</h3>
              <button onClick={handlePrint} className="print-button"><Printer size={18} />Yazdır</button>
            </div>
            <div className="overflow-x-auto flex justify-center">
              <div className="print-preview-container">
                <div className="print-preview-content" ref={printRef}>
                  <div className="flex items-center justify-between pb-2 border-b-2 border-primary shrink-0">
                    <div className="flex items-center"><img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-10 w-auto" /></div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary leading-tight">ÜRÜN İADE FORMU</p>
                      <p className="text-[9px] text-muted-foreground">Başvuru Tarihi: {formData.applicationDate}</p>
                      <p className="text-[9px] text-muted-foreground">Form No: ZDP-{new Date().getFullYear()}-{Date.now().toString().slice(-6)}</p>
                    </div>
                  </div>

                  <div className="flex-1 py-2 flex flex-col gap-2" style={{ fontSize: '8px', lineHeight: '1.3' }}>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">Müşteri Bilgileri</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        <p className="truncate"><span className="font-medium">Ad Soyad:</span> {formData.customerName} {formData.customerSurname}</p>
                        <p className="truncate"><span className="font-medium">Telefon:</span> {formData.customerPhone}</p>
                        <p className="truncate"><span className="font-medium">E-posta:</span> {formData.customerEmail}</p>
                        <p className="truncate"><span className="font-medium">Kurumsal:</span> {formData.customerTcNo || "-"}</p>
                        <p className="truncate"><span className="font-medium">Vergi No:</span> {formData.customerTaxNo || "-"}</p>
                        <p className="truncate"><span className="font-medium">Adres:</span> {formData.customerAddress || "-"}</p>
                      </div>
                    </div>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">Fatura Bilgileri</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        <p><span className="font-medium">Fatura No:</span> {formData.invoiceNo || "-"}</p>
                        <p><span className="font-medium">Fatura Tarihi:</span> {formData.invoiceDate || "-"}</p>
                      </div>
                    </div>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">Ürün Bilgileri</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        <p className="truncate"><span className="font-medium">Ürün:</span> {formData.productName || "-"}</p>
                        <p className="truncate"><span className="font-medium">Marka:</span> {formData.productBrand || "-"}</p>
                        <p className="truncate"><span className="font-medium">Model:</span> {formData.productModel || "-"}</p>
                        <p className="truncate"><span className="font-medium">Seri No:</span> {formData.productSerialNo || "-"}</p>
                        <p><span className="font-medium">Adet:</span> {formData.productQuantity}</p>
                        <p className="truncate"><span className="font-medium">Durum:</span> {formData.productCondition || "-"}</p>
                        <p className="truncate col-span-2"><span className="font-medium">İade Sebebi:</span> {formData.returnReason || "-"}</p>
                      </div>
                    </div>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">Banka Bilgileri</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        <p className="truncate"><span className="font-medium">Banka:</span> {formData.bankName || "-"}</p>
                        <p className="truncate"><span className="font-medium">Şube:</span> {formData.bankBranch || "-"}</p>
                        <p className="truncate"><span className="font-medium">Hesap Sahibi:</span> {formData.accountHolder || "-"}</p>
                        <p className="truncate"><span className="font-medium">IBAN:</span> {formData.iban || "-"}</p>
                      </div>
                    </div>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">İade Tutarı</h4>
                      <div className="grid grid-cols-3 gap-x-2">
                        <p><span className="font-medium">Ürün Fiyatı:</span> {formData.productPrice || "0"} ₺</p>
                        <p><span className="font-medium">KDV:</span> {formData.taxAmount || "0"} ₺</p>
                        <p className="font-bold text-primary"><span className="font-medium">Toplam:</span> {formData.totalRefund || "0"} ₺</p>
                      </div>
                    </div>
                    <div className="border border-border rounded p-2">
                      <h4 className="font-semibold text-primary border-b pb-1 mb-1 text-[9px]">Notlar</h4>
                      <p>{formData.notes || "-"}</p>
                    </div>
                    <div className="border border-border rounded p-1">
                      <h4 className="font-semibold text-primary border-b pb-0.5 mb-0.5 text-[8px]">İmza ve Onay</h4>
                      <div className="grid grid-cols-2 gap-2 min-h-[25px]">
                        <div className="border border-dashed border-border rounded p-1 text-center flex flex-col justify-end"><p className="text-[7px] font-medium border-t pt-0.5">Müşteri İmzası</p></div>
                        <div className="border border-dashed border-border rounded p-1 text-center flex flex-col items-center justify-between"><img src={yetkiliImza} alt="Yetkili İmza" className="h-3 w-auto object-contain" /><p className="text-[7px] font-medium border-t pt-0.5 w-full">Yetkili İmza / Kaşe</p></div>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <img src={zorluQr} alt="Zorlu QR Kod" className="h-12 w-12 mx-auto mb-1 object-contain" />
                      <p className="text-[8px] font-semibold text-primary">Bize Ulaşın</p>
                      <p className="text-[7px] text-muted-foreground">info@zorluplus.com</p>
                      <p className="text-[7px] text-muted-foreground">+905488783131</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border text-center shrink-0 mt-auto" style={{ fontSize: '8px' }}>
                    <p className="text-muted-foreground">Bu form iade işlemleri için düzenlenmiştir. <span className="font-bold text-foreground">ZORLU DIGITAL PLAZA</span> Tüm hakları saklıdır.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnForm;
