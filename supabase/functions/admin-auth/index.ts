import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { action, pin, newPin } = await req.json();

  if (action === 'verify') {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_pin_hash')
      .single();

    const storedPin = data?.value ?? '124590';
    if (pin === storedPin) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: false, error: 'Invalid PIN' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (action === 'change_pin') {
    const { data: current } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_pin_hash')
      .single();

    const storedPin = current?.value ?? '124590';
    if (pin !== storedPin) {
      return new Response(JSON.stringify({ success: false, error: 'Current PIN incorrect' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    await supabase
      .from('admin_settings')
      .upsert({ key: 'admin_pin_hash', value: newPin, updated_at: new Date().toISOString() });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid action' }), {
    status: 400,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
