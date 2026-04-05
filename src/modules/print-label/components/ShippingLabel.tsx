import zorluLogo from "@/assets/zorlu-logo-black.png";
import zorluQr from "@/assets/zorlu-qr.jpg";

interface ShippingLabelProps {
  invoiceName: string;
  shippingDate: string;
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  productLine1: string;
  productLine2: string;
  productLine3: string;
  paymentStatus: "paid" | "unpaid" | "partial";
  remainingAmount?: string;
  deliveryType: "installation" | "delivery" | "pickup";
  pickupStore?: string;
  shippingSpeed: "express" | "service" | "standard";
  serviceType?: "fault" | "exchange" | "repair";
  exchangeReason?: string;
}

const ShippingLabel = ({
  invoiceName, shippingDate, customerName, customerPhone,
  addressLine1, addressLine2, addressLine3,
  productLine1, productLine2, productLine3,
  paymentStatus, remainingAmount, deliveryType, pickupStore,
  shippingSpeed, serviceType, exchangeReason,
}: ShippingLabelProps) => {
  return (
    <div
      className="bg-white text-black border-2 border-black p-3 font-sans flex flex-col justify-between"
      style={{ width: "100mm", height: "150mm", boxSizing: "border-box" }}
    >
      <div className="flex justify-between items-center">
        <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-16 object-contain" />
        <img src={zorluQr} alt="QR Code" className="h-20 w-20 object-contain" />
      </div>

      <div className="flex justify-between text-[11px] font-semibold border-b-2 border-black pb-1">
        <span>Fatura: {invoiceName}</span>
        <span>Sevk: {shippingDate}</span>
      </div>

      <div className="flex justify-between text-[11px] font-semibold border-b-2 border-black pb-1">
        <span>{customerName}</span>
        <span>{customerPhone}</span>
      </div>

      <div className="text-[11px] border-b-2 border-black pb-1">
        <p className="leading-snug">{addressLine1}</p>
        <p className="leading-snug">{addressLine2}</p>
        <p className="leading-snug">{addressLine3}</p>
      </div>

      <div className="text-[11px] border-b-2 border-black pb-1 flex-1">
        <p className="leading-snug font-bold">Ürün Bilgileri:</p>
        <p className="leading-snug">{productLine1}</p>
        <p className="leading-snug">{productLine2}</p>
        <p className="leading-snug">{productLine3}</p>
      </div>

      <div className="border-2 border-black p-1.5">
        <p className="text-[10px] font-bold mb-1">Ödeme Durumu:</p>
        <div className="flex justify-between text-[10px]">
          {(["paid", "unpaid", "partial"] as const).map((status) => (
            <label key={status} className="flex items-center gap-1">
              <span className={`w-4 h-4 border-2 border-black flex items-center justify-center ${paymentStatus === status ? "bg-black" : "bg-white"}`}>
                {paymentStatus === status && <span className="text-white text-[10px]">✓</span>}
              </span>
              <span>{status === "paid" ? "ÖDENDİ" : status === "unpaid" ? "ÖDENECEK" : "KISMİ"}</span>
            </label>
          ))}
        </div>
        {paymentStatus === "partial" && remainingAmount && (
          <p className="text-[10px] mt-1 font-bold">Kalan: {remainingAmount}</p>
        )}
      </div>

      <div className="flex justify-between gap-1">
        {(["installation", "delivery", "pickup"] as const).map((type) => (
          <div key={type} className={`flex-1 border-2 border-black py-1 text-center text-[10px] font-bold ${deliveryType === type ? "bg-black text-white" : "bg-white"}`}>
            {type === "installation" ? "KURULUM" : type === "delivery" ? "TESLİMAT" : "MAĞAZADAN ALACAK"}
          </div>
        ))}
      </div>

      {deliveryType === "pickup" && (
        <div className="border-2 border-black p-1">
          <p className="text-[10px] font-bold">Alınacağı Mağaza: <span className="font-normal">{pickupStore || ""}</span></p>
        </div>
      )}

      <div className="flex justify-between gap-1">
        {(["express", "service", "standard"] as const).map((speed) => (
          <div key={speed} className={`flex-1 border-2 border-black py-1 text-center text-[10px] font-bold ${shippingSpeed === speed ? "bg-black text-white" : "bg-white"}`}>
            {speed === "express" ? "EXPRESS" : speed === "service" ? "SERVICE" : "STANDART"}
          </div>
        ))}
      </div>

      {shippingSpeed === "service" && (
        <>
          <div className="flex justify-between gap-1">
            {(["fault", "exchange", "repair"] as const).map((type) => (
              <div key={type} className={`flex-1 border-2 border-black py-1 text-center text-[10px] font-bold ${serviceType === type ? "bg-black text-white" : "bg-white"}`}>
                {type === "fault" ? "ARIZA" : type === "exchange" ? "DEĞİŞİM" : "TAMİR"}
              </div>
            ))}
          </div>
          {serviceType === "exchange" && (
            <div className="border-2 border-black p-1">
              <p className="text-[10px] font-bold">Değişim Sebebi: <span className="font-normal">{exchangeReason || ""}</span></p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShippingLabel;
