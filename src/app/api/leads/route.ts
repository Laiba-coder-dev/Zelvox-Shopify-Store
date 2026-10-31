import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { nextReference } from "@/lib/reference";
import { saveUpload } from "@/lib/uploads";
import { UPLOAD_RULES } from "@/lib/site";
import { fieldErrors, bulkInquirySchema, messageSchema } from "@/lib/validation";
import { adminAlertEmail, acknowledgmentEmail, sendEmail } from "@/lib/mail";
import { getSetting } from "@/lib/settings";
import { DEFAULT_SETTINGS } from "@/lib/content";

export const runtime = "nodejs";

/** Very small in-memory limiter: 6 submissions per IP per 10 minutes. */
const submissions = new Map<string, { count: number; resetAt: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const entry = submissions.get(ip);
  if (!entry || entry.resetAt < now) {
    submissions.set(ip, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

const KINDS = ["inquiry", "sample", "contact", "callback"] as const;
type Kind = (typeof KINDS)[number];

/**
 * Receives bulk inquiries, sample requests, contact messages and callback
 * requests — including multipart file attachments — stores them in the
 * database and triggers real notifications when SMTP is configured.
 */
export async function POST(request: Request) {
  if (limited(clientIp(request))) {
    return NextResponse.json(
      { error: "Too many submissions from this connection. Please try again later." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  // Honeypot field — real visitors never fill it.
  if (form.get("website")) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const rawData = form.get("data");
  if (typeof rawData !== "string") {
    return NextResponse.json({ error: "Missing form data." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawData);
  } catch {
    return NextResponse.json({ error: "Malformed form data." }, { status: 400 });
  }

  const kind: Kind = KINDS.includes((json as { kind?: string })?.kind as Kind)
    ? ((json as { kind?: string }).kind as Kind)
    : "inquiry";

  const parsed =
    kind === "contact" || kind === "callback"
      ? messageSchema.safeParse(json)
      : bulkInquirySchema.safeParse({ ...(json as Record<string, unknown>), kind });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) },
      { status: 422 }
    );
  }

  const data = parsed.data as Record<string, unknown> & { country?: string };
  if (data.country === "Other" && !String(data.otherCountry ?? "").trim()) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: { otherCountry: "Country name is required" } },
      { status: 422 }
    );
  }

  /* ------------------------------- attachments ------------------------------ */
  const uploaded = form
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (uploaded.length > UPLOAD_RULES.inquiryMaxFiles) {
    return NextResponse.json(
      { error: `A maximum of ${UPLOAD_RULES.inquiryMaxFiles} files is allowed.` },
      { status: 422 }
    );
  }

  const saved: Array<{ file: File; storedName: string; size: number; mimeType: string; originalName: string }> = [];
  try {
    for (const file of uploaded) {
      const result = await saveUpload(file, "inquiries", {
        allowedTypes: UPLOAD_RULES.inquiryTypes,
        maxBytes: UPLOAD_RULES.inquiryMaxBytes,
      });
      saved.push({
        file,
        storedName: result.storedName,
        size: result.size,
        mimeType: result.mimeType,
        originalName: result.originalName,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "File upload failed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  /* --------------------------------- items ---------------------------------- */
  const itemInputs = Array.isArray((data as { items?: unknown }).items)
    ? ((data as { items: Array<Record<string, unknown>> }).items ?? [])
    : [];

  let items: Array<{
    productId?: string | null;
    productName: string;
    sku?: string | null;
    quantity: string;
    packaging?: string | null;
    notes?: string | null;
  }> = [];

  if (kind === "inquiry" || kind === "sample") {
    const ids = itemInputs
      .map((item) => (typeof item.productId === "string" ? item.productId : null))
      .filter((id): id is string => Boolean(id));
    const products = ids.length
      ? await db.product.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, sku: true } })
      : [];
    const byId = new Map(products.map((product) => [product.id, product]));

    items = itemInputs.map((item) => {
      const product = typeof item.productId === "string" ? byId.get(item.productId) : undefined;
      return {
        productId: product?.id ?? null,
        productName: product?.name ?? String(item.productName ?? "").slice(0, 200),
        sku: product?.sku ?? (typeof item.sku === "string" ? item.sku : null),
        quantity: String(item.quantity ?? "").slice(0, 80),
        packaging: typeof item.packaging === "string" ? item.packaging.slice(0, 300) : null,
        notes: typeof item.notes === "string" ? item.notes.slice(0, 1000) : null,
      };
    });
  }

  /* -------------------------------- creation -------------------------------- */
  const reference = await nextReference("MGE");

  let inquiryId: string;
  try {
    const inquiry = await db.inquiry.create({
      data: {
        reference,
        kind,
        company: String(data.company ?? "").slice(0, 160),
        contactPerson: String(data.contactPerson ?? "").slice(0, 120),
        email: String(data.email ?? "").slice(0, 160),
        phone: String(data.phone ?? "").slice(0, 40) || null,
        country: String(data.country ?? "Other"),
        otherCountry: String(data.otherCountry ?? "").slice(0, 80) || null,
        city: String(data.city ?? "").slice(0, 90) || null,
        postcode: String(data.postcode ?? "").slice(0, 16) || null,
        address: String(data.address ?? "").slice(0, 240) || null,
        shippingMethod: String(data.shippingMethod ?? "").slice(0, 60) || null,
        packaging: String(data.packaging ?? "").slice(0, 300) || null,
        customization: String(data.customization ?? "").slice(0, 2000) || null,
        targetPrice: String(data.targetPrice ?? "").slice(0, 120) || null,
        notes: String(data.notes ?? "").slice(0, 4000) || null,
        source:
          kind === "contact" || kind === "callback"
            ? "contact-page"
            : "quote-page",
        adminNotes:
          kind === "contact" || kind === "callback"
            ? String(data.subject ?? "").slice(0, 160)
            : null,
        items: items.length ? { create: items } : undefined,
        attachments: saved.length
          ? {
              create: saved.map((entry) => ({
                filename: entry.originalName,
                storedName: entry.storedName,
                mimeType: entry.mimeType,
                size: entry.size,
              })),
            }
          : undefined,
        events: {
          create: [
            {
              type: "note",
              message:
                kind === "contact"
                  ? "Contact message received through the website."
                  : kind === "callback"
                    ? "Callback request received through the website."
                    : kind === "sample"
                      ? "Sample request received through the website."
                      : "Bulk inquiry received through the website.",
              actor: "system",
            },
          ],
        },
      },
    });
    inquiryId = inquiry.id;
  } catch (error) {
    // Clean up files that could not be attached.
    const { deleteUpload } = await import("@/lib/uploads");
    await Promise.all(saved.map((entry) => deleteUpload("inquiries", entry.storedName)));
    console.error("Failed to store inquiry", error);
    return NextResponse.json(
      { error: "We could not store your inquiry. Please try again." },
      { status: 500 }
    );
  }

  /* --------------------------------- e-mail --------------------------------- */
  const site = await getSetting("site", DEFAULT_SETTINGS.site);
  const company = await getSetting("company", DEFAULT_SETTINGS.company);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const kindLabel =
    kind === "contact"
      ? "Contact message"
      : kind === "callback"
        ? "Callback request"
        : kind === "sample"
          ? "Sample request"
          : "Bulk inquiry";

  const productsList =
    items.length > 0
      ? items.map((item) => `${item.productName} × ${item.quantity}`).join(", ")
      : String(data.subject ?? "—");

  const [ack, alert] = await Promise.all([
    sendEmail({
      to: String(data.email),
      inquiryId,
      ...acknowledgmentEmail({
        reference,
        contactName: String(data.contactPerson ?? ""),
        company: String(data.company ?? ""),
        kindLabel,
        siteUrl: baseUrl,
      }),
    }),
    sendEmail({
      to: process.env.ADMIN_NOTIFY_EMAIL || company.email,
      inquiryId,
      ...adminAlertEmail({
        reference,
        kindLabel,
        company: String(data.company ?? ""),
        contactName: String(data.contactPerson ?? ""),
        email: String(data.email),
        country: String(data.country ?? "Other"),
        products: productsList,
        dashboardUrl: `${baseUrl}/admin/inquiries`,
      }),
    }),
  ]);

  const emailStatus =
    ack.status === "sent" && alert.status === "sent"
      ? "sent"
      : ack.status === "failed" || alert.status === "failed"
        ? "failed"
        : "not-configured";

  return NextResponse.json(
    {
      ok: true,
      reference,
      emailStatus,
      site: site.name,
    },
    { status: 201 }
  );
}
