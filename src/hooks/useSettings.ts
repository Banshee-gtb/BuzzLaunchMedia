import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { AdminSetting } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('key, value');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data as AdminSetting[]).forEach((s) => { map[s.key] = s.value; });
      return map;
    },
    staleTime: 60000,
  });
}
