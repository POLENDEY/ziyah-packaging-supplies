import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendInquiryNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const name = String(body.get("name") || "").trim();
    const email = String(body.get("email") || "").trim();
    const message = String(body.get("message") || "").trim();
    const phone = String(body.get("phone") || "").trim() || null;
    const subject = String(body.get("subject") || "").trim() || null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          error: "Supabase configuration missing",
          details:
            "Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.",
        },
        { status: 500 }
      );
    }

    const { error } = await supabase.from("inquiries").insert([
      {
        name,
        email,
        message,
        phone,
        subject,
        status: "new",
      },
    ]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json(
        { error: error.message || "Database insert failed" },
        { status: 500 }
      );
    }

    try {
      await sendInquiryNotification({ name, email, message, phone, subject });
    } catch (mailError: unknown) {
      const mailMsg =
        mailError instanceof Error ? mailError.message : "Unknown mail error";
      console.error("Inquiry email failed:", mailMsg);
      // Inquiry is already saved in CMS; still report success to the visitor.
      return NextResponse.json({
        success: true,
        emailSent: false,
        emailError: mailMsg,
      });
    }

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error submitting inquiry:", error);
    return NextResponse.json(
      {
        error: "Failed to submit inquiry",
        details: msg,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        error: 'Supabase configuration missing',
        details: 'Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Select Error:', error);
      return NextResponse.json({ error: error.message || 'Database fetch failed' }, { status: 500 });
    }

    // Map created_at to date for backward compatibility with frontend
    const mappedData = data?.map(item => ({
      ...item,
      date: item.created_at
    })) || [];

    return NextResponse.json(mappedData);
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({
      error: 'Failed to fetch inquiries',
      details: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        error: 'Supabase configuration missing',
        details: 'Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
      }, { status: 500 });
    }

    const { id, status } = await request.json();

    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        error: 'Supabase configuration missing',
        details: 'Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.'
      }, { status: 500 });
    }

    const { id } = await request.json();

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
