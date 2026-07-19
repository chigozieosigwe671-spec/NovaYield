import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const [deposits, withdrawals, investments] = await Promise.all([
      supabase
        .from("deposits")
        .select("amount,status,created_at")
        .eq("user_id", userId),

      supabase
        .from("withdrawals")
        .select("amount,status,created_at")
        .eq("user_id", userId),

      supabase
        .from("investments")
        .select("amount,status,created_at")
        .eq("user_id", userId),
    ]);

    const monthlyData: Record<
      string,
      {
        name: string;
        deposits: number;
        withdrawals: number;
        investments: number;
      }
    > = {};

    (deposits.data || []).forEach((d: any) => {
      const month = new Date(d.created_at).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          deposits: 0,
          withdrawals: 0,
          investments: 0,
        };
      }

      if (d.status === "approved") {
        monthlyData[month].deposits += Number(d.amount);
      }
    });

    (withdrawals.data || []).forEach((w: any) => {
      const month = new Date(w.created_at).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          deposits: 0,
          withdrawals: 0,
          investments: 0,
        };
      }

      if (
        w.status === "approved" ||
        w.status === "completed"
      ) {
        monthlyData[month].withdrawals += Number(w.amount);
      }
    });

    (investments.data || []).forEach((i: any) => {
      const month = new Date(i.created_at).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          name: month,
          deposits: 0,
          withdrawals: 0,
          investments: 0,
        };
      }

      monthlyData[month].investments += Number(i.amount);
    });

    return NextResponse.json(Object.values(monthlyData));
  } catch (err) {
    console.error(err);

    return NextResponse.json([], {
      status: 500,
    });
  }
}