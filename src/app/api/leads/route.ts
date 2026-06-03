import { NextResponse } from "next/server";
import { parseSubmitLeadBody } from "@/lib/leadFormValidation";
import { isLeadEmailConfigured, sendLeadEmail } from "@/lib/server/leadEmail";
import type { SubmitLeadResponse } from "@/types/lead";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isLeadEmailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Lead email is not configured. Set RESEND_API_KEY, LEADS_FROM_EMAIL, and LEADS_TO_EMAIL.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = parseSubmitLeadBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { data } = parsed;
  const result = await sendLeadEmail({
    name: data.name,
    phone: data.phone,
    email: data.email ?? "",
    comments: data.comments ?? "",
    source: data.source,
    lang: data.lang ?? "",
    pageUrl: data.pageUrl ?? "",
    privacyAccepted: data.privacyAccepted === true,
    agreementAccepted: data.agreementAccepted === true,
  });

  if (!result.ok) {
    console.error("[api/leads] send failed:", result.error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true } satisfies SubmitLeadResponse);
}
