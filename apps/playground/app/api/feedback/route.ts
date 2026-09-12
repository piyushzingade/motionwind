import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  FEEDBACK_EMAIL_MAX,
  FEEDBACK_MESSAGE_MAX,
  isFeedbackType,
} from "@/lib/feedback";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = new Resend(process.env.RESEND_API_KEY);

const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL ?? "piyushzingade@gmail.com";
const FEEDBACK_FROM =
  process.env.FEEDBACK_FROM_EMAIL ?? "motionwind <onboarding@resend.dev>";

/* ── Simple in-memory rate limiter ─────────────────────────────────── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

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
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

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

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FEEDBACK_FROM,
      to: [FEEDBACK_TO],
      subject: `[motionwind playground] ${body.type}: New feedback`,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="font-size: 18px; margin-bottom: 16px;">Playground feedback: ${escapeHtml(body.type as string)}</h2>
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
