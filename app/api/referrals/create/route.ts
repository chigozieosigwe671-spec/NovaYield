import { NextRequest, NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const {
      referrerId,
      referredId,
    } = await req.json();

    if (!referrerId || !referredId) {
      return NextResponse.json(
        { error: "Missing IDs" },
        { status: 400 }
      );
    }

    const { error } = await adminSupabase
      .from("referrals")
      .insert({
        referrer_id: referrerId,
        referred_id: referredId,
        level: 1,
        status: "pending",
        qualified: false,
      });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}