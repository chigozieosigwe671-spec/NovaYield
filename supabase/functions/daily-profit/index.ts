import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const { data: investments, error } = await supabase
    .from("investments")
    .select("*")
    .eq("status", "active");

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  for (const investment of investments ?? []) {

            // Investment has ended
        if (new Date(investment.end_date) <= today) {

          // Return principal to user's wallet
          const { data: wallet } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", investment.user_id)
            .single();

          if (wallet) {
            await supabase
              .from("wallets")
              .update({
                main_balance:
                  Number(wallet.main_balance) + Number(investment.amount),
              })
              .eq("user_id", investment.user_id);
          }

         // Mark investment completed
          await supabase
            .from("investments")
            .update({
              status: "completed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", investment.id);

          // Record principal return
          await supabase.from("transactions").insert({
            user_id: investment.user_id,
            type: "investment_return",
            amount: investment.amount,
            status: "completed",
            description: "Investment principal returned",
          });

          // Notify user
          await supabase.from("notifications").insert({
            user_id: investment.user_id,
            title: "Investment Completed",
            message: `Your investment has completed and your $${investment.amount} principal has been returned to your main balance.`,
            type: "investment",
          });

          continue;
        }

    // Skip if today's profit has already been paid
    if (investment.last_profit_date) {
      const lastPaid = new Date(investment.last_profit_date)
        .toISOString()
        .split("T")[0];

      if (lastPaid === todayString) {
        continue;
      }
    }

    const profit = Number(investment.daily_profit);

    // Update investment
    await supabase
      .from("investments")
      .update({
        total_profit_earned:
          Number(investment.total_profit_earned) + profit,
        last_profit_date: today.toISOString(),
      })
      .eq("id", investment.id);

    // Get wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", investment.user_id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({
          profit_balance:
            Number(wallet.profit_balance) + profit,
          total_profit:
            Number(wallet.total_profit) + profit,
        })
        .eq("user_id", investment.user_id);
    }

    // Record transaction
    await supabase.from("transactions").insert({
      user_id: investment.user_id,
      type: "profit",
      amount: profit,
      status: "completed",
      description: "Daily investment profit",
    });

    // Notification
    await supabase.from("notifications").insert({
      user_id: investment.user_id,
      title: "Daily Profit Credited",
      message: `You earned $${profit} daily profit.`,
      type: "profit",
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      processed: investments?.length ?? 0,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});