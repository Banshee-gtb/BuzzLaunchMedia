import { supabase } from './supabase';

export async function trackEvent(event_type: string, page?: string, metadata?: Record<string, unknown>) {
  try {
    await supabase.functions.invoke('track-event', {
      body: { event_type, page, metadata },
    });
  } catch (e) {
    console.log('Analytics track failed (non-critical):', e);
  }
}
