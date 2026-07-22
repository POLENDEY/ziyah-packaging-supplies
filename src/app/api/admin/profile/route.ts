import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

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

    const { data: existing, error: findError } = await supabase
      .from("profile")
      .select("*")
      .eq("username", currentUsername)
      .eq("password", currentPassword)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Current username or password is incorrect." },
        { status: 401 }
      );
    }

    const nextUsername = newUsername || existing.username;
    const nextPassword = newPassword || existing.password;

    if (nextUsername !== existing.username) {
      const { data: taken } = await supabase
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

    const { data, error } = await supabase
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
