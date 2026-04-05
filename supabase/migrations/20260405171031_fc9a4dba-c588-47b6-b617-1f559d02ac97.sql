
-- Fix nullable user_id columns (security: prevents RLS bypass)
-- First update any existing NULL user_ids to the admin user
UPDATE public.invoices SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;
UPDATE public.payments SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;
UPDATE public.quotes SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;
UPDATE public.return_requests SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;
UPDATE public.suppliers SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;
UPDATE public.employees SET user_id = '267fdaa6-ab63-4503-af8c-26ab263bdf66' WHERE user_id IS NULL;

-- Now make user_id NOT NULL
ALTER TABLE public.invoices ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.payments ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.quotes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.return_requests ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.suppliers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.employees ALTER COLUMN user_id SET NOT NULL;

-- Add profiles DELETE policy (missing)
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Add unique constraint on profiles.user_id if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_unique') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
