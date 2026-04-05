
-- Add anon access to mk_ tables (matching source project behavior - internal company use)
CREATE POLICY "Anon read mk_employees" ON public.mk_employees FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert mk_employees" ON public.mk_employees FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update mk_employees" ON public.mk_employees FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon delete mk_employees" ON public.mk_employees FOR DELETE TO anon USING (true);

CREATE POLICY "Anon read mk_advances" ON public.mk_advances FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert mk_advances" ON public.mk_advances FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update mk_advances" ON public.mk_advances FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon delete mk_advances" ON public.mk_advances FOR DELETE TO anon USING (true);

CREATE POLICY "Anon read mk_payments" ON public.mk_payments FOR SELECT TO anon USING (true);
CREATE POLICY "Anon insert mk_payments" ON public.mk_payments FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update mk_payments" ON public.mk_payments FOR UPDATE TO anon USING (true);
CREATE POLICY "Anon delete mk_payments" ON public.mk_payments FOR DELETE TO anon USING (true);
