
-- Fix parts table to match code expectations
ALTER TABLE public.parts 
  ADD COLUMN IF NOT EXISTS sku text,
  ADD COLUMN IF NOT EXISTS category_id text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stock integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url text;

-- Fix sales table to match code expectations  
ALTER TABLE public.sales
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS tax numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Fix sp_invoices table to match code expectations
ALTER TABLE public.sp_invoices
  ADD COLUMN IF NOT EXISTS customer_address text,
  ADD COLUMN IF NOT EXISTS customer_tax_id text,
  ADD COLUMN IF NOT EXISTS subtotal numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_amount numeric NOT NULL DEFAULT 0;

-- Return requests table
CREATE TABLE public.return_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL DEFAULT '',
  customer_surname text NOT NULL DEFAULT '',
  customer_phone text,
  customer_email text,
  customer_address text,
  customer_tc_no text,
  customer_tax_no text,
  invoice_no text,
  invoice_date date,
  product_name text,
  product_brand text,
  product_model text,
  product_serial_no text,
  product_quantity integer NOT NULL DEFAULT 1,
  return_reason text,
  product_condition text,
  bank_name text,
  bank_branch text,
  account_holder text,
  iban text,
  product_price numeric NOT NULL DEFAULT 0,
  tax_amount numeric NOT NULL DEFAULT 0,
  total_refund numeric NOT NULL DEFAULT 0,
  application_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read return_requests" ON public.return_requests FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can insert return_requests" ON public.return_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner or admin can update return_requests" ON public.return_requests FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin can delete return_requests" ON public.return_requests FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Quotes table
CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_no text NOT NULL DEFAULT '',
  quote_date date NOT NULL DEFAULT CURRENT_DATE,
  currency text NOT NULL DEFAULT 'TRY',
  customer_name text NOT NULL DEFAULT '',
  customer_phone text,
  customer_email text,
  customer_address text,
  vat_rate numeric NOT NULL DEFAULT 18,
  vat_included boolean NOT NULL DEFAULT false,
  global_discount numeric NOT NULL DEFAULT 0,
  notes text,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can read quotes" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner can insert quotes" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner can update quotes" ON public.quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner can delete quotes" ON public.quotes FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Quote items table
CREATE TABLE public.quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL DEFAULT '',
  custom_brand text,
  category text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quote items follow quote access" ON public.quote_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND (quotes.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Quote items insert follows quote" ON public.quote_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid())
);
CREATE POLICY "Quote items update follows quote" ON public.quote_items FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid())
);
CREATE POLICY "Quote items delete follows quote" ON public.quote_items FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quotes WHERE quotes.id = quote_items.quote_id AND quotes.user_id = auth.uid())
);
