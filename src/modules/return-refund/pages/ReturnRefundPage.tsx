import { useState } from "react";
import ModuleHeader from "@/components/ModuleHeader";
import ReturnForm from "@/modules/return-refund/components/ReturnForm";
import ReturnAdminPanel from "@/modules/return-refund/components/ReturnAdminPanel";

export default function ReturnRefundPage() {
  const [tab, setTab] = useState<"form" | "admin">("form");

  return (
    <>
      <ModuleHeader title="İade & Refund" />
      <div className="flex justify-center gap-2 py-4 px-4">
        <button
          onClick={() => setTab("form")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "form" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          İade Formu
        </button>
        <button
          onClick={() => setTab("admin")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "admin" ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Admin Panel
        </button>
      </div>
      {tab === "form" ? <ReturnForm /> : <ReturnAdminPanel />}
    </>
  );
}
