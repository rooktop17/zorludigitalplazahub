
-- Function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Maaş Kesinti: Çalışanlar
CREATE TABLE public.mk_employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  salary NUMERIC NOT NULL DEFAULT 0,
  photo TEXT,
  country TEXT NOT NULL,
  flag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maaş Kesinti: Avanslar
CREATE TABLE public.mk_advances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.mk_employees(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Maaş Kesinti: Ödemeler
CREATE TABLE public.mk_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.mk_employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  base_salary NUMERIC NOT NULL,
  total_advances NUMERIC NOT NULL,
  net_payment NUMERIC NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, month)
);

-- İzin Talepleri
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.mk_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mk_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mk_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- mk_employees policies
CREATE POLICY "Auth read mk_employees" ON public.mk_employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert mk_employees" ON public.mk_employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update mk_employees" ON public.mk_employees FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete mk_employees" ON public.mk_employees FOR DELETE TO authenticated USING (true);

-- mk_advances policies
CREATE POLICY "Auth read mk_advances" ON public.mk_advances FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert mk_advances" ON public.mk_advances FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update mk_advances" ON public.mk_advances FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete mk_advances" ON public.mk_advances FOR DELETE TO authenticated USING (true);

-- mk_payments policies
CREATE POLICY "Auth read mk_payments" ON public.mk_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert mk_payments" ON public.mk_payments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update mk_payments" ON public.mk_payments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete mk_payments" ON public.mk_payments FOR DELETE TO authenticated USING (true);

-- leave_requests policies
CREATE POLICY "Auth read leave_requests" ON public.leave_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert leave_requests" ON public.leave_requests FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update leave_requests" ON public.leave_requests FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete leave_requests" ON public.leave_requests FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger
CREATE TRIGGER update_mk_employees_updated_at
BEFORE UPDATE ON public.mk_employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed data
INSERT INTO public.mk_employees (name, salary, country, flag) VALUES
('ALAEDDIN ERDEMCI', 0, 'KKTC', '🇹🇷'),
('ABDELKERIM AZBAKI', 0, 'FİLİSTİN', '🇵🇸'),
('MUSTAFA OZDOGAN', 0, 'KKTC', '🇹🇷'),
('SERKAN TARAS', 0, 'KKTC', '🇹🇷'),
('DENIZ BISIKLETCILER', 0, 'KKTC', '🇹🇷'),
('DILA JUMAKOVA', 0, 'TÜRKMENİSTAN', '🇹🇲'),
('SUHRAP ALYMOV', 0, 'TÜRKMENİSTAN', '🇹🇲'),
('YHTIYAR RECEPOV', 0, 'TÜRKMENİSTAN', '🇹🇲'),
('UMIT ROZYEV', 0, 'TÜRKMENİSTAN', '🇹🇲'),
('RAMAZAN KOSHAYEV', 0, 'TÜRKMENİSTAN', '🇹🇲'),
('MUHAMMED BILAL ALI', 0, 'PAKİSTAN', '🇵🇰');

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('mk-employee-photos', 'mk-employee-photos', true);

CREATE POLICY "Read mk photos" ON storage.objects FOR SELECT USING (bucket_id = 'mk-employee-photos');
CREATE POLICY "Upload mk photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'mk-employee-photos');
CREATE POLICY "Update mk photos" ON storage.objects FOR UPDATE USING (bucket_id = 'mk-employee-photos');
CREATE POLICY "Delete mk photos" ON storage.objects FOR DELETE USING (bucket_id = 'mk-employee-photos');
