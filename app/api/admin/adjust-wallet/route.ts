import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      balanceType,
      amount,
      action,
      adminId,
    } = await req.json();

    if (!userId || !balanceType || !amount || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: wallet, error: walletError } = await adminSupabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    const currentBalance = Number(wallet[balanceType] || 0);

    const newBalance =
      action === "add"
        ? currentBalance + Number(amount)
        : Math.max(0, currentBalance - Number(amount));

    const { error: updateError } = await adminSupabase
      .from("wallets")
      .update({
        [balanceType]: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    await adminSupabase.from("transactions").insert({
      user_id: userId,
      type: "admin_adjustment",
      amount,
      status: "completed",
      description: `Admin ${action === "add" ? "credited" : "debited"} $${amount} (${balanceType})`,
    });

    await adminSupabase.from("activity_logs").insert({
      user_id: userId,
      action: "wallet_adjustment",
      details: `Admin ${action}ed $${amount} to ${balanceType}`,
    });

    await adminSupabase.from("notifications").insert({
      user_id: userId,
      title: "Wallet Updated",
      message:
        action === "add"
          ? `Your ${balanceType.replace("_", " ")} has been credited with $${amount}.`
          : `Your ${balanceType.replace("_", " ")} has been debited by $${amount}.`,
    });

    return NextResponse.json({
      success: true,
      balance: newBalance,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}