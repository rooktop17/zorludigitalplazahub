
-- 1) Strengthen RLS on employees: add user_id column, drop open policies, add auth-based policies
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Anyone can read employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can update employees" ON public.employees;
DROP POLICY IF EXISTS "Anyone can delete employees" ON public.employees;

CREATE POLICY "Authenticated users can read employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 2) Strengthen RLS on suppliers: drop open policies, add auth-based policies
DROP POLICY IF EXISTS "Anyone can read suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can insert suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can update suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Anyone can delete suppliers" ON public.suppliers;

CREATE POLICY "Authenticated users can read suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner or admin can insert suppliers" ON public.suppliers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can update suppliers" ON public.suppliers FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can delete suppliers" ON public.suppliers FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 3) Strengthen RLS on invoices
DROP POLICY IF EXISTS "Anyone can read invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can update invoices" ON public.invoices;
DROP POLICY IF EXISTS "Anyone can delete invoices" ON public.invoices;

CREATE POLICY "Authenticated users can read invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner or admin can insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can update invoices" ON public.invoices FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can delete invoices" ON public.invoices FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4) Strengthen RLS on payments
DROP POLICY IF EXISTS "Anyone can read payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can update payments" ON public.payments;
DROP POLICY IF EXISTS "Anyone can delete payments" ON public.payments;

CREATE POLICY "Authenticated users can read payments" ON public.payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owner or admin can insert payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can update payments" ON public.payments FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can delete payments" ON public.payments FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 5) Strengthen RLS on leave_records
DROP POLICY IF EXISTS "Anyone can read leave_records" ON public.leave_records;
DROP POLICY IF EXISTS "Anyone can insert leave_records" ON public.leave_records;
DROP POLICY IF EXISTS "Anyone can update leave_records" ON public.leave_records;
DROP POLICY IF EXISTS "Anyone can delete leave_records" ON public.leave_records;

CREATE POLICY "Authenticated users can read leave_records" ON public.leave_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert leave_records" ON public.leave_records FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leave_records" ON public.leave_records FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leave_records" ON public.leave_records FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
