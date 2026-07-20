import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    // Step 1: Receive the deposit ID
    const { depositId } = await req.json();

    // Step 2: Find the deposit
    const { data: deposit, error: depositError } = await adminSupabase
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (depositError) {
      return NextResponse.json(
        { error: depositError.message },
        { status: 400 }
      );
    } 
    // Prevent approving the same deposit twice
    if (deposit.status === 'approved') {
     return NextResponse.json(
    {
      success: false,
      error: 'This deposit has already been approved.',
    },
    { status: 400 }
  );
}

    // Step 3: Find the user's wallet
    const { data: wallet, error: walletError } = await adminSupabase
      .from('wallets')
      .select('*')
      .eq('user_id', deposit.user_id)
      .single();

    if (walletError) {
      return NextResponse.json(
        { error: walletError.message },
        { status: 400 }
      );
    }

  // Step 4: Approve the deposit
const { error: approveError } = await adminSupabase
  .from('deposits')
  .update({
    status: 'approved',
    processed: true,
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .eq('id', depositId);

    // Step 5: Credit the wallet
    const { error: walletUpdateError } = await adminSupabase
      .from('wallets')
      .update({
        main_balance:
          Number(wallet.main_balance || 0) + Number(deposit.amount),

        total_deposits:
          Number(wallet.total_deposits || 0) + Number(deposit.amount),

        updated_at: new Date().toISOString(),
      })
      .eq('user_id', deposit.user_id);

    if (walletUpdateError) {
      return NextResponse.json(
        { error: walletUpdateError.message },
        { status: 400 }
      );
    }
    // Step 5.5 - Pay referral bonus on first approved deposit
    const { count } = await adminSupabase
      .from("deposits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", deposit.user_id)
      .eq("status", "approved");

    if (count === 1) {
      const { data: referral } = await adminSupabase
        .from("referrals")
        .select("*")
        .eq("referred_id", deposit.user_id)
        .eq("status", "pending")
        .maybeSingle();

      if (referral) {
        const { data: referrerWallet } = await adminSupabase
          .from("wallets")
          .select("*")
          .eq("user_id", referral.referrer_id)
          .single();

        if (referrerWallet) {
          await adminSupabase
            .from("wallets")
            .update({
              bonus_balance:
                Number(referrerWallet.bonus_balance || 0) + 5,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", referral.referrer_id);
        }
      // Increase referral earnings
      const { data: referrerProfile } = await adminSupabase
        .from("profiles")
        .select("referral_earnings")
        .eq("id", referral.referrer_id)
        .single();

      await adminSupabase
        .from("profiles")
        .update({
          referral_earnings:
            Number(referrerProfile?.referral_earnings || 0) + 5,
        })
      .eq("id", referral.referrer_id);
        await adminSupabase
          .from("referrals")
          .update({
            status: "rewarded",
            qualified: true,
          })
          .eq("id", referral.id);

        await adminSupabase
          .from("notifications")
          .insert({
            user_id: referral.referrer_id,
            title: "Referral Bonus",
            message:
              "Congratulations! You earned a $5 referral bonus because your referral made their first approved deposit.",
            type: "referral",
          });

        await adminSupabase
          .from("activity_logs")
          .insert({
            user_id: referral.referrer_id,
            action: "referral_bonus_paid",
            details: "$5 referral bonus credited.",
          });
      }
    }


   // Step 6: Update the transaction
const { data: txUpdate, error: txError } = await adminSupabase
  .from('transactions')
  .update({
    status: 'completed',
  })
  .eq('reference_id', deposit.id)
  .select();

console.log('Transaction update:', txUpdate);
console.log('Transaction error:', txError);
    // Step 7: Send notification
    await adminSupabase
      .from('notifications')
      .insert({
        user_id: deposit.user_id,
        title: 'Deposit Approved',
        message: `Your deposit of $${deposit.amount} has been approved and credited to your wallet.`,
        type: 'deposit',
      });

    // Step 8: Create activity log
    await adminSupabase
      .from('activity_logs')
      .insert({
        user_id: deposit.user_id,
        action: 'deposit_approved',
        details: `Deposit of $${deposit.amount} approved by admin`,
      });

    // Step 9: Return success
    return NextResponse.json({
      success: true,
      message: 'Deposit approved successfully.',
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}