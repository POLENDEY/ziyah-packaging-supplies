import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { reviews as fallbackReviews } from "@/data/reviews";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("id, name, role, rating, photo, quote")
      .order("id", { ascending: true });

    if (error || !data?.length) {
      return NextResponse.json(fallbackReviews);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(fallbackReviews);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : null;

    if (!items || items.length !== 4) {
      return NextResponse.json(
        { error: "Exactly 4 feedback cards are required." },
        { status: 400 }
      );
    }

    for (const item of items) {
      const id = Number(item.id);
      const name = String(item.name || "").trim();
      const role = String(item.role || "").trim();
      const rating = Number(item.rating);
      const photo = String(item.photo || "").trim() || "/logo.png";
      const quote = String(item.quote || "").trim();

      if (!id || id < 1 || id > 4 || !name || !quote || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: `Invalid feedback card #${item.id || "?"}` },
          { status: 400 }
        );
      }

      const payload = {
        name,
        role,
        rating,
        photo,
        quote,
        updated_at: new Date().toISOString(),
      };

      const { data: updated, error: updateError } = await supabase
        .from("feedback")
        .update(payload)
        .eq("id", id)
        .select("id")
        .maybeSingle();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      // If the row was missing, insert it (requires INSERT policy)
      if (!updated) {
        const { error: insertError } = await supabase.from("feedback").insert({
          id,
          ...payload,
        });
        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    }

    const { data } = await supabase
      .from("feedback")
      .select("id, name, role, rating, photo, quote")
      .order("id", { ascending: true });

    return NextResponse.json({ success: true, items: data || items });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save feedback";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
