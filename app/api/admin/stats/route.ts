import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [
      users,
      deposits,
      withdrawals,
      investments,
      tickets,
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("deposits").select("amount,status,created_at"),
      supabase.from("withdrawals").select("amount,status,created_at"),
      supabase
        .from("investments")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
    ]);

    const dep = deposits.data || [];
    const wd = withdrawals.data || [];

        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        const chartData = months.map((month, index) => {
        const depositTotal = dep
            .filter((d: any) => {
            if (d.status !== "approved") return false;
            return new Date(d.created_at).getMonth() === index;
            })
            .reduce((sum: number, d: any) => sum + Number(d.amount), 0);

        const withdrawalTotal = wd
            .filter((w: any) => {
            if (w.status !== "approved" && w.status !== "completed") return false;
            return new Date(w.created_at).getMonth() === index;
            })
            .reduce((sum: number, w: any) => sum + Number(w.amount), 0);

        return {
            name: month,
            deposits: depositTotal,
            withdrawals: withdrawalTotal,
        };
        });

    return NextResponse.json({
      totalUsers: users.count || 0,
      totalDeposits: dep.length,
      pendingDeposits: dep.filter(d => d.status === "pending").length,
      totalWithdrawals: wd.length,
      pendingWithdrawals: wd.filter(w => w.status === "pending").length,
      activeInvestments: investments.count || 0,
      openTickets: tickets.count || 0,
      totalDepositAmount: dep
        .filter(d => d.status === "approved")
        .reduce((s, d) => s + Number(d.amount), 0),
      totalWithdrawalAmount: wd
        .filter(w => w.status === "approved" || w.status === "completed")
        .reduce((s, w) => s + Number(w.amount), 0),
        chartData,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}