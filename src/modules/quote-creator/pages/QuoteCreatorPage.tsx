import ModuleHeader from "@/components/ModuleHeader";
import { QuoteForm } from '@/modules/quote-creator/components/quote/QuoteForm';

export default function QuoteCreatorPage() {
  return (
    <>
      <ModuleHeader title="Teklif Oluşturucu" />
      <QuoteForm />
    </>
  );
}
