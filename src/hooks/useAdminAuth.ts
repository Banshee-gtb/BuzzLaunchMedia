import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('buzz_admin_auth');
    if (stored === 'true') setIsAuthenticated(true);
  }, []);

  const login = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('admin-auth', {
      body: { action: 'verify', pin },
    });
    setLoading(false);

    if (error || !data?.success) {
      return { success: false, error: data?.error || 'Invalid PIN' };
    }

    sessionStorage.setItem('buzz_admin_auth', 'true');
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    sessionStorage.removeItem('buzz_admin_auth');
    setIsAuthenticated(false);
  };

  const changePin = async (currentPin: string, newPin: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.functions.invoke('admin-auth', {
      body: { action: 'change_pin', pin: currentPin, newPin },
    });
    if (error || !data?.success) return { success: false, error: data?.error || 'Failed' };
    return { success: true };
  };

  return { isAuthenticated, loading, login, logout, changePin };
}
