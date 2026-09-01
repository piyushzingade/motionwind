import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { OgTemplate } from "../../../components/og-template";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Documentation";
  const description = searchParams.get("description") ?? "";
  const eyebrow = searchParams.get("eyebrow") ?? "";

  return new ImageResponse(
    <OgTemplate title={title} description={description} eyebrow={eyebrow} />,
    { width: 1200, height: 630 },
  );
}
