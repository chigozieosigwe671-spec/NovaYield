import { createClient } from "npm:@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();

    if (!type || !to) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, to" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailTemplates: Record<string, { subject: string; html: string }> = {
      registration: {
        subject: "Welcome to NovaYield",
        html: `<h1>Welcome to NovaYield!</h1><p>Hi ${data?.name || 'there'},</p><p>Your account has been created successfully. Start your AI-powered investment journey today!</p><p><a href="${data?.loginUrl || 'https://novayield.com/login'}" style="background:#E31E24;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">Login to Your Account</a></p>`,
      },
      deposit_submitted: {
        subject: "Deposit Request Received",
        html: `<h1>Deposit Request Received</h1><p>Your deposit of <strong>$${data?.amount || 0}</strong> via ${data?.method || 'payment method'} is pending approval.</p><p>We will process your request within 1-24 hours.</p>`,
      },
      deposit_approved: {
        subject: "Deposit Approved",
        html: `<h1>Deposit Approved!</h1><p>Your deposit of <strong>$${data?.amount || 0}</strong> has been approved and credited to your wallet.</p>`,
      },
      deposit_rejected: {
        subject: "Deposit Rejected",
        html: `<h1>Deposit Rejected</h1><p>Your deposit of <strong>$${data?.amount || 0}</strong> was rejected. Reason: ${data?.reason || 'Please contact support.'}</p>`,
      },
      withdrawal_submitted: {
        subject: "Withdrawal Request Received",
        html: `<h1>Withdrawal Request Received</h1><p>Your withdrawal of <strong>$${data?.amount || 0}</strong> via ${data?.method || 'payment method'} is pending approval.</p>`,
      },
      withdrawal_approved: {
        subject: "Withdrawal Approved",
        html: `<h1>Withdrawal Approved!</h1><p>Your withdrawal of <strong>$${data?.amount || 0}</strong> has been approved and processed. Transaction ID: ${data?.transactionId || 'N/A'}</p>`,
      },
      withdrawal_rejected: {
        subject: "Withdrawal Rejected",
        html: `<h1>Withdrawal Rejected</h1><p>Your withdrawal of <strong>$${data?.amount || 0}</strong> was rejected. Funds have been restored to your balance. Reason: ${data?.reason || 'Please contact support.'}</p>`,
      },
      investment_activated: {
        subject: "Investment Activated",
        html: `<h1>Investment Activated!</h1><p>Your investment of <strong>$${data?.amount || 0}</strong> in the ${data?.plan || 'plan'} is now active. Daily profit: $${data?.dailyProfit || 0}</p>`,
      },
      investment_completed: {
        subject: "Investment Completed",
        html: `<h1>Investment Completed!</h1><p>Your investment has completed. Total profit earned: <strong>$${data?.totalProfit || 0}</strong></p>`,
      },
      support_ticket: {
        subject: "Support Ticket Received",
        html: `<h1>Support Ticket Received</h1><p>We have received your ticket: "${data?.subject || ''}". Our team will get back to you soon.</p>`,
      },
      support_reply: {
        subject: "Support Reply",
        html: `<h1>Support Reply</h1><p>Admin replied to your ticket: "${data?.subject || ''}"</p><p>Message: ${data?.message || ''}</p>`,
      },
      password_reset: {
        subject: "Password Reset",
        html: `<h1>Password Reset</h1><p>Your password has been reset successfully. If this was not you, please contact support immediately.</p>`,
      },
      referral_registered: {
        subject: "New Referral!",
        html: `<h1>New Referral!</h1><p>A new user has registered using your referral code. You will earn commission once they make their first deposit.</p>`,
      },
      referral_commission: {
        subject: "Referral Commission Earned",
        html: `<h1>Referral Commission Earned!</h1><p>You earned <strong>$${data?.amount || 0}</strong> in referral commission from your referral's ${data?.sourceType || 'activity'}.</p>`,
      },
    };

    const template = emailTemplates[type];
    if (!template) {
      return new Response(
        JSON.stringify({ error: "Unknown email type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log email in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to send via Resend if API key is configured
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "NovaYield <onboarding@resend.dev>",
          to: [to],
          subject: template.subject,
          html: template.html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return new Response(
          JSON.stringify({ error: `Email send failed: ${err}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
