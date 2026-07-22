import nodemailer from "nodemailer";

export type InquiryEmailPayload = {
  name: string;
  email: string;
  message: string;
  phone?: string | null;
  subject?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInquiryNotification(inquiry: InquiryEmailPayload) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.INQUIRY_NOTIFY_TO || user;
  const from = process.env.EMAIL_FROM || user;

  if (!user || !pass || !to) {
    throw new Error(
      "Email is not configured. Set SMTP_USER, SMTP_PASS, and INQUIRY_NOTIFY_TO in .env.local."
    );
  }

  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    auth: { user, pass },
  });

  const topic = inquiry.subject?.trim() || "General inquiry";
  const phone = inquiry.phone?.trim() || "Not provided";

  await transporter.sendMail({
    from,
    to,
    replyTo: inquiry.email,
    subject: `[Ziyah Inquiry] ${topic} — ${inquiry.name}`,
    text: [
      "New website inquiry",
      "",
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Phone: ${phone}`,
      `Subject: ${topic}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#241c28">
        <h2 style="margin:0 0 12px;color:#412c47">New website inquiry</h2>
        <p style="margin:0 0 8px"><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
        <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>
        <p style="margin:0 0 8px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p style="margin:0 0 16px"><strong>Subject:</strong> ${escapeHtml(topic)}</p>
        <p style="margin:0 0 6px"><strong>Message:</strong></p>
        <p style="margin:0;white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
      </div>
    `,
  });
}
