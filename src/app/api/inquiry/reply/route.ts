import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sendInquiryReply } from "@/lib/mail";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const id = Number(body.id);
    const message = String(body.message || "").trim();

    if (!id || !message) {
      return NextResponse.json(
        { error: "Inquiry id and reply message are required." },
        { status: 400 }
      );
    }

    const sb = getSupabaseAdmin();
    const { data: inquiry, error: fetchError } = await sb
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await sendInquiryReply({
      toEmail: inquiry.email,
      toName: inquiry.name,
      replyMessage: message,
      originalSubject: inquiry.subject,
      originalMessage: inquiry.message,
    });

    const { data: updated, error: updateError } = await sb
      .from("inquiries")
      .update({ status: "replied", is_read: true })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          success: true,
          emailSent: true,
          warning: "Reply emailed, but status update failed.",
          details: updateError.message,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      inquiry: { ...updated, date: updated.created_at },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Inquiry reply failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
