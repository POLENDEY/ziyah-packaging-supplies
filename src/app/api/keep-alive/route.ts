import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * Lightweight DB ping to prevent Supabase Free Plan auto-pause
 * (inactive free projects pause after ~7 days).
 *
 * Called by:
 * - Vercel Cron (vercel.json)
 * - GitHub Actions (.github/workflows/supabase-keep-alive.yml)
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("placeholder")) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  // Real PostgREST query = counts as database activity for pause prevention
  const { error } = await supabase.from("inquiries").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, at: new Date().toISOString() },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Supabase keep-alive ping succeeded",
    at: new Date().toISOString(),
  });
}
