import { useState } from "react";
import ShippingLabel from "../components/ShippingLabel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrintLabelPage = () => {
  const [formData, setFormData] = useState({
    invoiceName: "FTR-2024-001234",
    shippingDate: "28.01.2026",
    customerName: "Ahmet Yılmaz",
    customerPhone: "0532 123 45 67",
    addressLine1: "Zorlu Center AVM",
    addressLine2: "Levazım Mah. Koru Sok. No:2",
    addressLine3: "Beşiktaş / İstanbul",
    productLine1: "1x Samsung 65' QLED TV",
    productLine2: "1x Soundbar HW-Q990C",
    productLine3: "2x HDMI Kablo 2m",
    paymentStatus: "partial" as "paid" | "unpaid" | "partial",
    remainingAmount: "5.000 TL",
    deliveryType: "installation" as "installation" | "delivery" | "pickup",
    pickupStore: "",
    shippingSpeed: "service" as "express" | "service" | "standard",
    serviceType: "exchange" as "fault" | "exchange" | "repair" | undefined,
    exchangeReason: "Ekran arızası nedeniyle değişim",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Sevk Etiketi Oluşturucu</h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        <Card className="flex-1">
          <CardHeader><CardTitle>Etiket Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="invoiceName">Fatura No</Label><Input id="invoiceName" value={formData.invoiceName} onChange={(e) => handleInputChange("invoiceName", e.target.value)} /></div>
              <div><Label htmlFor="shippingDate">Sevk Tarihi</Label><Input id="shippingDate" value={formData.shippingDate} onChange={(e) => handleInputChange("shippingDate", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label htmlFor="customerName">Müşteri Adı</Label><Input id="customerName" value={formData.customerName} onChange={(e) => handleInputChange("customerName", e.target.value)} /></div>
              <div><Label htmlFor="customerPhone">Telefon</Label><Input id="customerPhone" value={formData.customerPhone} onChange={(e) => handleInputChange("customerPhone", e.target.value)} /></div>
            </div>
            <div className="space-y-2">
              <Label>Adres</Label>
              <Input placeholder="Adres Satır 1" value={formData.addressLine1} onChange={(e) => handleInputChange("addressLine1", e.target.value)} />
              <Input placeholder="Adres Satır 2" value={formData.addressLine2} onChange={(e) => handleInputChange("addressLine2", e.target.value)} />
              <Input placeholder="Adres Satır 3" value={formData.addressLine3} onChange={(e) => handleInputChange("addressLine3", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ürün Bilgileri</Label>
              <Input placeholder="Ürün Satır 1" value={formData.productLine1} onChange={(e) => handleInputChange("productLine1", e.target.value)} />
              <Input placeholder="Ürün Satır 2" value={formData.productLine2} onChange={(e) => handleInputChange("productLine2", e.target.value)} />
              <Input placeholder="Ürün Satır 3" value={formData.productLine3} onChange={(e) => handleInputChange("productLine3", e.target.value)} />
            </div>
            <div>
              <Label>Ödeme Durumu</Label>
              <div className="flex gap-2 mt-2">
                {[{ value: "paid", label: "ÖDENDİ" }, { value: "unpaid", label: "ÖDENECEK" }, { value: "partial", label: "KISMİ" }].map((option) => (
                  <Button key={option.value} type="button" variant={formData.paymentStatus === option.value ? "default" : "outline"} size="sm" onClick={() => handleInputChange("paymentStatus", option.value)}>{option.label}</Button>
                ))}
              </div>
              {formData.paymentStatus === "partial" && (
                <div className="mt-2"><Label htmlFor="remainingAmount">Kalan Tutar</Label><Input id="remainingAmount" value={formData.remainingAmount} onChange={(e) => handleInputChange("remainingAmount", e.target.value)} /></div>
              )}
            </div>
            <div>
              <Label>Teslimat Türü</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[{ value: "installation", label: "KURULUM" }, { value: "delivery", label: "TESLİMAT" }, { value: "pickup", label: "MAĞAZADAN ALACAK" }].map((option) => (
                  <Button key={option.value} type="button" variant={formData.deliveryType === option.value ? "default" : "outline"} size="sm" onClick={() => handleInputChange("deliveryType", option.value)}>{option.label}</Button>
                ))}
              </div>
              {formData.deliveryType === "pickup" && (
                <div className="mt-2"><Label htmlFor="pickupStore">Alınacağı Mağaza</Label><Input id="pickupStore" value={formData.pickupStore} onChange={(e) => handleInputChange("pickupStore", e.target.value)} placeholder="Mağaza adı giriniz" /></div>
              )}
            </div>
            <div>
              <Label>Sevk Hızı</Label>
              <div className="flex gap-2 mt-2">
                {[{ value: "express", label: "EXPRESS" }, { value: "service", label: "SERVICE" }, { value: "standard", label: "STANDART" }].map((option) => (
                  <Button key={option.value} type="button" variant={formData.shippingSpeed === option.value ? "default" : "outline"} size="sm" onClick={() => handleInputChange("shippingSpeed", option.value)}>{option.label}</Button>
                ))}
              </div>
            </div>
            {formData.shippingSpeed === "service" && (
              <div>
                <Label>Servis Türü</Label>
                <div className="flex gap-2 mt-2">
                  {[{ value: "fault", label: "ARIZA" }, { value: "exchange", label: "DEĞİŞİM" }, { value: "repair", label: "TAMİR" }].map((option) => (
                    <Button key={option.value} type="button" variant={formData.serviceType === option.value ? "default" : "outline"} size="sm" onClick={() => handleInputChange("serviceType", option.value)}>{option.label}</Button>
                  ))}
                </div>
                {formData.serviceType === "exchange" && (
                  <div className="mt-2"><Label htmlFor="exchangeReason">Değişim Sebebi</Label><Input id="exchangeReason" value={formData.exchangeReason} onChange={(e) => handleInputChange("exchangeReason", e.target.value)} /></div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-center">Önizleme</h2>
            <Button onClick={() => window.print()} className="mb-4 w-full">Yazdır</Button>
            <div className="print-label">
              <ShippingLabel
                invoiceName={formData.invoiceName}
                shippingDate={formData.shippingDate}
                customerName={formData.customerName}
                customerPhone={formData.customerPhone}
                addressLine1={formData.addressLine1}
                addressLine2={formData.addressLine2}
                addressLine3={formData.addressLine3}
                productLine1={formData.productLine1}
                productLine2={formData.productLine2}
                productLine3={formData.productLine3}
                paymentStatus={formData.paymentStatus}
                remainingAmount={formData.remainingAmount}
                deliveryType={formData.deliveryType}
                pickupStore={formData.deliveryType === "pickup" ? formData.pickupStore : undefined}
                shippingSpeed={formData.shippingSpeed}
                serviceType={formData.shippingSpeed === "service" ? formData.serviceType : undefined}
                exchangeReason={formData.exchangeReason}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintLabelPage;
