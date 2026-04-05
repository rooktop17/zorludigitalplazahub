// Untyped supabase client for modules that use tables not yet in the generated types
import { supabase as typedSupabase } from '@/integrations/supabase/client';

// Cast to any to allow usage with tables not yet in generated types
// Once DB tables are created and types regenerated, modules should switch to the typed client
export const supabase = typedSupabase as any;
