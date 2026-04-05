import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export interface ProductInfo {
  brand: string;
  model: string;
  description: string;
}

export interface RepairPartInfo {
  partName: string;
  description: string;
  cost: string;
}

export interface ReportData {
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

interface InsuranceReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

const InsuranceReportForm = ({ data, onChange }: InsuranceReportFormProps) => {
  const handleChange = (field: keyof ReportData, value: string | boolean | ProductInfo[] | RepairPartInfo[]) => {
    onChange({ ...data, [field]: value });
  };

  const handleProductChange = (index: number, field: keyof ProductInfo, value: string) => {
    const updatedProducts = [...data.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    handleChange("products", updatedProducts);
  };

  const addProduct = () => {
    handleChange("products", [...data.products, { brand: "", model: "", description: "" }]);
  };

  const removeProduct = (index: number) => {
    if (data.products.length > 1) {
      handleChange("products", data.products.filter((_, i) => i !== index));
    }
  };

  const handleRepairPartChange = (index: number, field: keyof RepairPartInfo, value: string) => {
    const updatedParts = [...data.repairParts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    handleChange("repairParts", updatedParts);
  };

  const addRepairPart = () => {
    handleChange("repairParts", [...data.repairParts, { partName: "", description: "", cost: "" }]);
  };

  const removeRepairPart = (index: number) => {
    if (data.repairParts.length > 1) {
      handleChange("repairParts", data.repairParts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border border-border shadow-sm">
      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-3">
        Rapor Bilgilerini Düzenle
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reportNumber" className="text-muted-foreground text-sm">Rapor No</Label>
          <Input id="reportNumber" value={data.reportNumber} onChange={(e) => handleChange("reportNumber", e.target.value)} placeholder="2024-001" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reportDate" className="text-muted-foreground text-sm">Tarih</Label>
          <Input id="reportDate" type="date" value={data.reportDate} onChange={(e) => handleChange("reportDate", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-muted-foreground text-sm">Teşhis Edilen / Bakılan Yer</Label>
        <Select value={data.inspectionLocation} onValueChange={(value) => handleChange("inspectionLocation", value)}>
          <SelectTrigger><SelectValue placeholder="Seçiniz..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="musteri_evi">Müşteri Kendi Evi</SelectItem>
            <SelectItem value="zorlu_service_center">Zorlu Service Center</SelectItem>
            <SelectItem value="diger">Diğer</SelectItem>
          </SelectContent>
        </Select>
        {data.inspectionLocation === "diger" && (
          <Input value={data.inspectionLocationOther} onChange={(e) => handleChange("inspectionLocationOther", e.target.value)} placeholder="Teşhis edilen yeri yazınız..." className="mt-2" />
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Müşteri Bilgileri</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Ad</Label>
            <Input value={data.customerName} onChange={(e) => handleChange("customerName", e.target.value)} placeholder="Müşteri adı" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Soyad</Label>
            <Input value={data.customerSurname} onChange={(e) => handleChange("customerSurname", e.target.value)} placeholder="Müşteri soyadı" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Telefon</Label>
          <Input value={data.customerPhone} onChange={(e) => handleChange("customerPhone", e.target.value)} placeholder="+90 5XX XXX XX XX" />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Adres</Label>
          <Textarea value={data.customerAddress} onChange={(e) => handleChange("customerAddress", e.target.value)} placeholder="Müşteri adresi" rows={2} className="resize-none" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Ürün Bilgileri</h3>
          <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-2"><Plus className="h-4 w-4" />Ürün Ekle</Button>
        </div>
        {data.products.map((product, index) => (
          <div key={index} className="p-4 bg-muted rounded-lg border border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">Ürün {index + 1}</span>
              {data.products.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeProduct(index)} className="text-destructive hover:text-destructive/90 gap-1"><Trash2 className="h-4 w-4" />Sil</Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Marka</Label>
                <Input value={product.brand} onChange={(e) => handleProductChange(index, "brand", e.target.value)} placeholder="Ürün markası" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Model No</Label>
                <Input value={product.model} onChange={(e) => handleProductChange(index, "model", e.target.value)} placeholder="Model numarası" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Ürün Açıklaması</Label>
              <Textarea value={product.description} onChange={(e) => handleProductChange(index, "description", e.target.value)} placeholder="Ürün hakkında detaylı açıklama" rows={2} className="resize-none" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Arıza Bilgileri</h3>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Arıza Sebebi</Label>
          <Textarea value={data.defectReason} onChange={(e) => handleChange("defectReason", e.target.value)} placeholder="Arıza sebebi ve detayları" rows={3} className="resize-none" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Tamir / Değişim Bilgileri</h3>
        <div className="flex items-center space-x-3 mb-4">
          <Checkbox id="isRepairable" checked={data.isRepairable} onCheckedChange={(checked) => handleChange("isRepairable", !!checked)} />
          <Label htmlFor="isRepairable" className="text-foreground cursor-pointer">Ürün tamir edilebilir durumda</Label>
        </div>

        {data.isRepairable ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-muted-foreground text-sm font-medium">Değişecek Parçalar</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRepairPart} className="gap-2"><Plus className="h-4 w-4" />Parça Ekle</Button>
            </div>
            {data.repairParts.map((part, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Parça {index + 1}</span>
                  {data.repairParts.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeRepairPart(index)} className="text-destructive hover:text-destructive/90 gap-1"><Trash2 className="h-4 w-4" />Sil</Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Parça Adı</Label>
                    <Input value={part.partName} onChange={(e) => handleRepairPartChange(index, "partName", e.target.value)} placeholder="Değişecek parça adı" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Bedel (TL)</Label>
                    <Input value={part.cost} onChange={(e) => handleRepairPartChange(index, "cost", e.target.value)} placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Açıklama</Label>
                  <Textarea value={part.description} onChange={(e) => handleRepairPartChange(index, "description", e.target.value)} placeholder="Parça hakkında açıklama" rows={2} className="resize-none" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Eş Değer Yeni Ürün</Label>
              <Input value={data.equivalentProduct} onChange={(e) => handleChange("equivalentProduct", e.target.value)} placeholder="Önerilen eş değer ürün adı ve modeli" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Eş Değer Ürün Bedeli (TL)</Label>
              <Input value={data.equivalentProductCost} onChange={(e) => handleChange("equivalentProductCost", e.target.value)} placeholder="0.00" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceReportForm;
