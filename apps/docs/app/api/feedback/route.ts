import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const { type, message, email } = await req.json();

    if (!type || !message) {
      return NextResponse.json(
        { error: "Type and message are required" },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "motionwind <onboarding@resend.dev>",
      to: ["piyushzingade@gmail.com"],
      subject: `[motionwind] ${type}: New feedback received`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="font-size: 18px; margin-bottom: 16px;">New Feedback — ${type}</h2>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          ${email ? `<p style="color: #71717a; font-size: 13px;">From: ${email}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
          <p style="color: #a1a1aa; font-size: 12px;">Sent from motionwind docs</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
