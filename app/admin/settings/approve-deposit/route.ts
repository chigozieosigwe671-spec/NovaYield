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
    approved_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .eq('id', depositId);

    if (approveError) {
      return NextResponse.json(
        { error: approveError.message },
        { status: 400 }
      );
    }

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

    // Step 6: Update the transaction
    await adminSupabase
  .from('transactions')
  .update({
    status: 'approved',
  })
  .eq('reference_id', deposit.id);

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