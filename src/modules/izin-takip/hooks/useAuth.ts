import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/untypedClient';
import { User } from '@supabase/supabase-js';

type AppRole = 'admin' | 'employee';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState<string | null>(null);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (data && data.length > 0) {
      setRole(data[0].role as AppRole);
    } else {
      setRole(null);
    }
  };

  const fetchEmployeeId = async (userId: string) => {
    const { data } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data) {
      setEmployeeId(data.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadUserData = async (userId: string) => {
      try {
        await fetchRole(userId);
        await fetchEmployeeId(userId);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        if (!mounted) return;
        setUser(currentUser);
        
        if (currentUser) {
          loadUserData(currentUser.id).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setRole(null);
          setEmployeeId(null);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setEmployeeId(null);
  };

  return {
    user,
    role,
    loading,
    employeeId,
    isAdmin: role === 'admin',
    isEmployee: role === 'employee',
    signIn,
    signOut,
  };
};
