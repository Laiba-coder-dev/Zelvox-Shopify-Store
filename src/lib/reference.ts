import { db } from "./db";

/**
 * Human-friendly reference numbers:
 *   inquiries  → MGE-2026-0001
 *   quotations → QTE-2026-0001
 */
export async function nextReference(prefix: "MGE" | "QTE"): Promise<string> {
  const year = new Date().getFullYear();
  const stem = `${prefix}-${year}-`;

  const readLatest = () =>
    prefix === "MGE"
      ? db.inquiry.findFirst({
          where: { reference: { startsWith: stem } },
          orderBy: { reference: "desc" },
          select: { reference: true },
        })
      : db.quotation.findFirst({
          where: { reference: { startsWith: stem } },
          orderBy: { reference: "desc" },
          select: { reference: true },
        });

  const latest = await readLatest();
  let seq = 1;
  if (latest) {
    const parsed = Number(latest.reference.slice(stem.length));
    if (Number.isFinite(parsed)) seq = parsed + 1;
  }

  for (let attempt = 0; attempt < 500; attempt++, seq++) {
    const candidate = `${stem}${String(seq).padStart(4, "0")}`;
    const taken =
      (await db.inquiry.count({ where: { reference: candidate } })) +
      (await db.quotation.count({ where: { reference: candidate } }));
    if (taken === 0) return candidate;
  }

  throw new Error("Could not allocate a unique reference number.");
}
