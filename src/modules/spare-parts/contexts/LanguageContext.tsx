import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'nav.dashboard': { tr: 'Gösterge Paneli', en: 'Dashboard' },
  'nav.categories': { tr: 'Kategoriler', en: 'Categories' },
  'nav.parts': { tr: 'Parçalar', en: 'Parts' },
  'nav.sales': { tr: 'Satışlar', en: 'Sales' },
  'nav.invoices': { tr: 'Faturalar', en: 'Invoices' },
  'nav.reports': { tr: 'Raporlar', en: 'Reports' },
  'nav.settings': { tr: 'Ayarlar', en: 'Settings' },
  'nav.contact': { tr: 'Bize Ulaşın', en: 'Contact Us' },
  'nav.logout': { tr: 'Çıkış Yap', en: 'Logout' },
  'nav.admin': { tr: 'Admin Panel', en: 'Admin Panel' },
  'dashboard.title': { tr: 'Gösterge Paneli', en: 'Dashboard' },
  'dashboard.totalParts': { tr: 'Toplam Parça', en: 'Total Parts' },
  'dashboard.totalSales': { tr: 'Toplam Satış', en: 'Total Sales' },
  'dashboard.revenue': { tr: 'Gelir', en: 'Revenue' },
  'dashboard.lowStock': { tr: 'Düşük Stok', en: 'Low Stock' },
  'dashboard.recentSales': { tr: 'Son Satışlar', en: 'Recent Sales' },
  'dashboard.topCategories': { tr: 'En Çok Satan Kategoriler', en: 'Top Categories' },
  'dashboard.monthlySales': { tr: 'Aylık Satışlar', en: 'Monthly Sales' },
  'auth.login': { tr: 'Giriş Yap', en: 'Login' },
  'auth.signup': { tr: 'Kayıt Ol', en: 'Sign Up' },
  'auth.email': { tr: 'E-posta', en: 'Email' },
  'auth.password': { tr: 'Şifre', en: 'Password' },
  'auth.forgotPassword': { tr: 'Şifremi Unuttum', en: 'Forgot Password' },
  'auth.googleLogin': { tr: 'Google ile Giriş Yap', en: 'Sign in with Google' },
  'auth.appleLogin': { tr: 'Apple ile Giriş Yap', en: 'Sign in with Apple' },
  'auth.name': { tr: 'Ad Soyad', en: 'Full Name' },
  'auth.welcome': { tr: 'Hoş Geldiniz', en: 'Welcome' },
  'auth.subtitle': { tr: 'Yedek Parça Yönetim Sistemi', en: 'Spare Parts Management System' },
  'categories.title': { tr: 'Ürün Kategorileri', en: 'Product Categories' },
  'categories.all': { tr: 'Tümü', en: 'All' },
  'categories.search': { tr: 'Kategori ara...', en: 'Search categories...' },
  'parts.title': { tr: 'Parça Yönetimi', en: 'Parts Management' },
  'parts.addPart': { tr: 'Yeni Parça Ekle', en: 'Add New Part' },
  'parts.editPart': { tr: 'Parça Düzenle', en: 'Edit Part' },
  'parts.name': { tr: 'Parça Adı', en: 'Part Name' },
  'parts.sku': { tr: 'Stok Kodu', en: 'SKU' },
  'parts.category': { tr: 'Kategori', en: 'Category' },
  'parts.brand': { tr: 'Marka', en: 'Brand' },
  'parts.model': { tr: 'Model', en: 'Model' },
  'parts.price': { tr: 'Satış Fiyatı', en: 'Sale Price' },
  'parts.cost': { tr: 'Maliyet', en: 'Cost' },
  'parts.stock': { tr: 'Stok', en: 'Stock' },
  'parts.minStock': { tr: 'Min Stok', en: 'Min Stock' },
  'parts.description': { tr: 'Açıklama', en: 'Description' },
  'parts.generateImage': { tr: 'AI ile Görsel Oluştur', en: 'Generate Image with AI' },
  'parts.lowStockWarning': { tr: 'Düşük stok uyarısı', en: 'Low stock warning' },
  'parts.deleteConfirm': { tr: 'Bu parçayı silmek istediğinize emin misiniz?', en: 'Are you sure you want to delete this part?' },
  'sales.title': { tr: 'Satış Yönetimi', en: 'Sales Management' },
  'sales.newSale': { tr: 'Yeni Satış', en: 'New Sale' },
  'sales.customer': { tr: 'Müşteri Adı', en: 'Customer Name' },
  'sales.customerPhone': { tr: 'Müşteri Telefon', en: 'Customer Phone' },
  'sales.customerEmail': { tr: 'Müşteri E-posta', en: 'Customer Email' },
  'sales.total': { tr: 'Toplam', en: 'Total' },
  'sales.discount': { tr: 'İndirim', en: 'Discount' },
  'sales.tax': { tr: 'KDV', en: 'Tax' },
  'sales.netAmount': { tr: 'Net Tutar', en: 'Net Amount' },
  'sales.status': { tr: 'Durum', en: 'Status' },
  'sales.pending': { tr: 'Beklemede', en: 'Pending' },
  'sales.completed': { tr: 'Tamamlandı', en: 'Completed' },
  'sales.cancelled': { tr: 'İptal Edildi', en: 'Cancelled' },
  'sales.addItem': { tr: 'Ürün Ekle', en: 'Add Item' },
  'sales.selectPart': { tr: 'Parça Seçin', en: 'Select Part' },
  'sales.quantity': { tr: 'Adet', en: 'Quantity' },
  'sales.unitPrice': { tr: 'Birim Fiyat', en: 'Unit Price' },
  'sales.notes': { tr: 'Notlar', en: 'Notes' },
  'invoices.title': { tr: 'Fatura Yönetimi', en: 'Invoice Management' },
  'invoices.newInvoice': { tr: 'Yeni Fatura', en: 'New Invoice' },
  'invoices.invoiceNumber': { tr: 'Fatura No', en: 'Invoice No' },
  'invoices.customerAddress': { tr: 'Müşteri Adresi', en: 'Customer Address' },
  'invoices.customerTaxId': { tr: 'Müşteri VKN', en: 'Customer Tax ID' },
  'invoices.subtotal': { tr: 'Ara Toplam', en: 'Subtotal' },
  'invoices.taxAmount': { tr: 'KDV Tutarı', en: 'Tax Amount' },
  'invoices.discountAmount': { tr: 'İndirim Tutarı', en: 'Discount Amount' },
  'invoices.totalAmount': { tr: 'Toplam Tutar', en: 'Total Amount' },
  'invoices.draft': { tr: 'Taslak', en: 'Draft' },
  'invoices.sent': { tr: 'Gönderildi', en: 'Sent' },
  'invoices.paid': { tr: 'Ödendi', en: 'Paid' },
  'invoices.cancelled': { tr: 'İptal', en: 'Cancelled' },
  'invoices.downloadPdf': { tr: 'PDF İndir', en: 'Download PDF' },
  'invoices.fromSale': { tr: 'Satıştan Oluştur', en: 'Create from Sale' },
  'reports.title': { tr: 'Raporlar', en: 'Reports' },
  'reports.daily': { tr: 'Günlük', en: 'Daily' },
  'reports.monthly': { tr: 'Aylık', en: 'Monthly' },
  'reports.yearly': { tr: 'Yıllık', en: 'Yearly' },
  'reports.totalRevenue': { tr: 'Toplam Gelir', en: 'Total Revenue' },
  'reports.totalCost': { tr: 'Toplam Maliyet', en: 'Total Cost' },
  'reports.profit': { tr: 'Kar', en: 'Profit' },
  'reports.salesCount': { tr: 'Satış Sayısı', en: 'Sales Count' },
  'settings.title': { tr: 'Şirket Ayarları', en: 'Company Settings' },
  'settings.companyName': { tr: 'Ticari Unvan', en: 'Company Name' },
  'settings.brandName': { tr: 'Marka Adı', en: 'Brand Name' },
  'settings.address': { tr: 'Adres', en: 'Address' },
  'settings.phone': { tr: 'Telefon', en: 'Phone' },
  'settings.email': { tr: 'E-posta', en: 'Email' },
  'settings.taxOffice': { tr: 'Vergi Dairesi', en: 'Tax Office' },
  'settings.taxNumber': { tr: 'Vergi No', en: 'Tax Number' },
  'settings.taxId': { tr: 'Tax ID', en: 'Tax ID' },
  'settings.socialMedia': { tr: 'Sosyal Medya', en: 'Social Media' },
  'settings.workingHours': { tr: 'Çalışma Saatleri', en: 'Working Hours' },
  'settings.saved': { tr: 'Ayarlar kaydedildi', en: 'Settings saved' },
  'admin.title': { tr: 'Admin Paneli', en: 'Admin Panel' },
  'admin.users': { tr: 'Kullanıcılar', en: 'Users' },
  'admin.roles': { tr: 'Roller', en: 'Roles' },
  'admin.makeAdmin': { tr: 'Admin Yap', en: 'Make Admin' },
  'admin.makeTechnician': { tr: 'Teknisyen Yap', en: 'Make Technician' },
  'common.save': { tr: 'Kaydet', en: 'Save' },
  'common.cancel': { tr: 'İptal', en: 'Cancel' },
  'common.delete': { tr: 'Sil', en: 'Delete' },
  'common.edit': { tr: 'Düzenle', en: 'Edit' },
  'common.add': { tr: 'Ekle', en: 'Add' },
  'common.search': { tr: 'Ara...', en: 'Search...' },
  'common.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
  'common.noData': { tr: 'Veri bulunamadı', en: 'No data found' },
  'common.confirm': { tr: 'Onayla', en: 'Confirm' },
  'common.back': { tr: 'Geri', en: 'Back' },
  'common.next': { tr: 'İleri', en: 'Next' },
  'common.actions': { tr: 'İşlemler', en: 'Actions' },
  'common.date': { tr: 'Tarih', en: 'Date' },
  'common.success': { tr: 'Başarılı', en: 'Success' },
  'common.error': { tr: 'Hata', en: 'Error' },
  'footer.rights': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },
  'footer.builtWith': { tr: "Kuzey Kıbrıs'ta ❤️ ile yapıldı", en: 'Built with ❤️ in North Cyprus' },
  'footer.company': { tr: 'Şirket', en: 'Company' },
  'footer.social': { tr: 'Sosyal Medya', en: 'Social Media' },
  'contact.title': { tr: 'Bize Ulaşın', en: 'Contact Us' },
  'contact.name': { tr: 'Adınız', en: 'Your Name' },
  'contact.email': { tr: 'E-posta Adresiniz', en: 'Your Email' },
  'contact.phone': { tr: 'Telefon', en: 'Phone' },
  'contact.subject': { tr: 'Konu', en: 'Subject' },
  'contact.message': { tr: 'Mesajınız', en: 'Your Message' },
  'contact.send': { tr: 'Gönder', en: 'Send' },
  'contact.whatsapp': { tr: 'WhatsApp ile Yazın', en: 'Chat on WhatsApp' },
  'contact.call': { tr: 'Bizi Arayın', en: 'Call Us' },
  'contact.hours': { tr: 'Çalışma Saatleri', en: 'Business Hours' },
  'contact.hoursValue': { tr: 'Pzt - Cmt: 09:00 - 18:00', en: 'Mon - Sat: 09:00 AM - 06:00 PM' },
  'contact.address': { tr: 'Adres', en: 'Address' },
  'greeting.morning': { tr: 'Günaydın', en: 'Good Morning' },
  'greeting.afternoon': { tr: 'İyi Günler', en: 'Good Afternoon' },
  'greeting.evening': { tr: 'İyi Akşamlar', en: 'Good Evening' },
  'greeting.night': { tr: 'İyi Geceler', en: 'Good Night' },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'tr',
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('zorlu-lang') as Language) || 'tr';
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('zorlu-lang', l);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
