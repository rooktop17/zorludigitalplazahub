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
