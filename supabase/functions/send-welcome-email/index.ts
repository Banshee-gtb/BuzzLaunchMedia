import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { applicant_name, applicant_email, role } = await req.json();

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - BuzzLaunch Media</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Inter,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://cdn-ai.onspace.ai/onspace/project/uploads/m4GkrG44DmiQLZ8aHa6kt5/fe4f7740-3b0b-4d57-b6e2-c4aac7fdb5e1.png" alt="BuzzLaunch Media" width="200" style="display:block;max-width:200px;" />
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a,#111);border:1px solid #2a2a2a;border-radius:16px;padding:48px 40px;">
              <p style="color:#f5b800;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">Application Received</p>
              <h1 style="color:#ffffff;font-size:28px;font-weight:700;margin:0 0 16px;line-height:1.3;">We've got your application, ${applicant_name}.</h1>
              <p style="color:#888;font-size:16px;line-height:1.6;margin:0 0 32px;">Thank you for applying for the <strong style="color:#f5b800;">${role}</strong> position at BuzzLaunch Media. Our team will review your application and be in touch if it's a match.</p>
              <div style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:12px;padding:24px;margin-bottom:32px;">
                <p style="color:#555;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">What happens next</p>
                <p style="color:#ccc;font-size:15px;line-height:1.7;margin:0;">1. Our team reviews your application<br>2. If selected, we'll reach out via email<br>3. We'll schedule a quick introduction call</p>
              </div>
              <p style="color:#555;font-size:14px;margin:0 0 8px;">Questions? Reach out directly:</p>
              <a href="mailto:buzzlaunchmedia@gmail.com" style="color:#f5b800;text-decoration:none;font-size:14px;">buzzlaunchmedia@gmail.com</a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:#333;font-size:13px;margin:0;">© ${new Date().getFullYear()} BuzzLaunch Media. Be Seen. Be Heard.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await supabase.auth.admin.sendRawEmail({
      to: applicant_email,
      subject: `We received your application — BuzzLaunch Media`,
      html: emailHtml,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email error:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
