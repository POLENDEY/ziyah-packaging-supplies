import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function PATCH(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const currentUsername = String(body.currentUsername || "").trim();
    const currentPassword = String(body.currentPassword || "");
    const newUsername = String(body.newUsername || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!currentUsername || !currentPassword) {
      return NextResponse.json(
        { error: "Current username and password are required." },
        { status: 400 }
      );
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json(
        { error: "Provide a new username and/or new password." },
        { status: 400 }
      );
    }

    if (newPassword && newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const sb = getSupabaseAdmin();
    const { data: existing, error: findError } = await sb
      .from("profile")
      .select("id, username, password")
      .eq("username", currentUsername)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!existing || !verifyPassword(currentPassword, String(existing.password || ""))) {
      return NextResponse.json(
        { error: "Current username or password is incorrect." },
        { status: 401 }
      );
    }

    const nextUsername = newUsername || existing.username;
    const nextPassword = newPassword
      ? hashPassword(newPassword)
      : String(existing.password || "");

    if (nextUsername !== existing.username) {
      const { data: taken } = await sb
        .from("profile")
        .select("id")
        .eq("username", nextUsername)
        .maybeSingle();
      if (taken) {
        return NextResponse.json(
          { error: "That username is already taken." },
          { status: 409 }
        );
      }
    }

    const { data, error } = await sb
      .from("profile")
      .update({ username: nextUsername, password: nextPassword })
      .eq("id", existing.id)
      .select("id, username")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, username: data.username });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
