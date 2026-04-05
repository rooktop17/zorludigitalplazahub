import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import ModuleViewer from "./pages/ModuleViewer";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";

// Lazy-loaded module pages
const NotesPage = lazy(() => import("./modules/notes/pages/NotesPage"));
const SigortaPage = lazy(() => import("./modules/sigorta/pages/SigortaPage"));
const PrintLabelPage = lazy(() => import("./modules/print-label/pages/PrintLabelPage"));
const ReturnRefundPage = lazy(() => import("./modules/return-refund/pages/ReturnRefundPage"));
const QuoteCreatorPage = lazy(() => import("./modules/quote-creator/pages/QuoteCreatorPage"));
const MaasKesintiPage = lazy(() => import("./modules/maas-kesinti/pages/MaasKesintiPage"));
const MaasKesintiReports = lazy(() => import("./modules/maas-kesinti/pages/MaasKesintiReports"));
const KolayIzinLogin = lazy(() => import("./modules/kolay-izin/pages/KolayIzinLogin"));
const KolayIzinEmployee = lazy(() => import("./modules/kolay-izin/pages/KolayIzinEmployee"));
const KolayIzinAdminLogin = lazy(() => import("./modules/kolay-izin/pages/KolayIzinAdminLogin"));
const KolayIzinAdmin = lazy(() => import("./modules/kolay-izin/pages/KolayIzinAdmin"));
const IzinTakipPage = lazy(() => import("./modules/izin-takip/pages/IzinTakipPage"));
const DisBorcPage = lazy(() => import("./modules/dis-borc/pages/DisBorcPage"));
const SparePartsPage = lazy(() => import("./modules/spare-parts/pages/SparePartsPage"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Embedded module routes */}
            <Route path="/module/notes" element={<NotesPage />} />
            <Route path="/module/sigorta-ekspertiz" element={<SigortaPage />} />
            <Route path="/module/print-label" element={<PrintLabelPage />} />
            <Route path="/module/return-refund" element={<ReturnRefundPage />} />
            <Route path="/module/quote-creator" element={<QuoteCreatorPage />} />
            <Route path="/module/maas-kesinti" element={<MaasKesintiPage />} />
            <Route path="/module/maas-kesinti/raporlar" element={<MaasKesintiReports />} />
            <Route path="/module/kolay-izin" element={<KolayIzinLogin />} />
            <Route path="/module/kolay-izin/employee" element={<KolayIzinEmployee />} />
            <Route path="/module/kolay-izin/panel" element={<KolayIzinAdminLogin />} />
            <Route path="/module/kolay-izin/admin" element={<KolayIzinAdmin />} />
            <Route path="/module/izin-takip" element={<IzinTakipPage />} />
            <Route path="/module/dis-borc" element={<DisBorcPage />} />
            {/* External modules still use iframe viewer */}
            <Route path="/module/:moduleId" element={<ModuleViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
