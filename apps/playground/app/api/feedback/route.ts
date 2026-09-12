import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  FEEDBACK_EMAIL_MAX,
  FEEDBACK_MESSAGE_MAX,
  isFeedbackType,
} from "@/lib/feedback";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character]!,
  );
}

export async function POST(request: NextRequest) {
  let body: {
    type?: unknown;
    message?: unknown;
    email?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Invalid feedback request" },
      { status: 400 },
    );
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!isFeedbackType(body.type)) {
    return NextResponse.json(
      { error: "Choose a valid feedback category" },
      { status: 400 },
    );
  }
  if (!message || message.length > FEEDBACK_MESSAGE_MAX) {
    return NextResponse.json(
      {
        error: `Message must be between 1 and ${FEEDBACK_MESSAGE_MAX} characters`,
      },
      { status: 400 },
    );
  }
  if (
    email &&
    (email.length > FEEDBACK_EMAIL_MAX || !EMAIL_PATTERN.test(email))
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "motionwind <onboarding@resend.dev>",
      to: ["piyushzingade@gmail.com"],
      subject: `[motionwind playground] ${body.type}: New feedback`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="font-size: 18px; margin-bottom: 16px;">Playground feedback: ${escapeHtml(body.type)}</h2>
          <div style="background: #f4f4f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          ${email ? `<p style="color: #71717a; font-size: 13px;">From: ${escapeHtml(email)}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
          <p style="color: #71717a; font-size: 12px;">Sent from the Motionwind playground</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch {
    return NextResponse.json(
      { error: "Unable to send feedback" },
      { status: 500 },
    );
  }
}
