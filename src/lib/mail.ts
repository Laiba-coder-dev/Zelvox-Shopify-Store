import "server-only";
import { db } from "./db";

/**
 * SMTP delivery via nodemailer.
 *
 * The integration is real: when SMTP_* variables are configured the mail is
 * actually sent and the result is stored in `EmailLog`. When they are absent
 * nothing is faked — the message is logged as `skipped-not-configured` and the
 * admin dashboard reports that notifications are disabled.
 */

export function mailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT);
}

export type SendResult = {
  status: "sent" | "failed" | "skipped-not-configured";
  error?: string;
};

type SendOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  inquiryId?: string;
};

export async function sendEmail(options: SendOptions): Promise<SendResult> {
  const recipients = Array.isArray(options.to) ? options.to.join(", ") : options.to;

  if (!mailConfigured()) {
    await log(options.inquiryId, recipients, options.subject, "skipped-not-configured", null);
    return { status: "skipped-not-configured" };
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM ?? "no-reply@localhost",
      to: recipients,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    await log(options.inquiryId, recipients, options.subject, "sent", null);
    return { status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await log(options.inquiryId, recipients, options.subject, "failed", message);
    return { status: "failed", error: message };
  }
}

async function log(
  inquiryId: string | undefined,
  to: string,
  subject: string,
  status: SendResult["status"],
  error: string | null
): Promise<void> {
  try {
    await db.emailLog.create({
      data: { inquiryId, to, subject, status, error },
    });
  } catch {
    // Never let logging break the request path.
  }
}

/* -------------------------------------------------------------------------- */
/* Message templates                                                           */
/* -------------------------------------------------------------------------- */

function layout(title: string, bodyHtml: string, footer: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f7fa;font-family:Inter,Arial,sans-serif;color:#0d1b2a">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
    <table width="100%" style="max-width:600px;background:#ffffff;border:1px solid #e3e9f0;border-radius:12px;overflow:hidden">
      <tr><td style="background:#0b2545;padding:20px 28px">
        <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:.02em">Meridian Global Exports</span>
        <span style="color:#14a678;font-size:13px;margin-left:8px">UK · Germany</span>
      </td></tr>
      <tr><td style="padding:28px">
        <h1 style="font-size:20px;margin:0 0 16px;color:#0b2545">${title}</h1>
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:18px 28px;background:#f5f7fa;border-top:1px solid #e3e9f0;font-size:12px;color:#5f7288">
        ${footer}
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

export function acknowledgmentEmail(opts: {
  reference: string;
  contactName: string;
  company: string;
  kindLabel: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `We received your request — ${opts.reference}`;
  const html = layout(
    "Your request has been received",
    `<p>Hello ${escapeHtml(opts.contactName)},</p>
     <p>Thank you for contacting <strong>Meridian Global Exports</strong>. Your
     ${escapeHtml(opts.kindLabel)} for <strong>${escapeHtml(opts.company)}</strong>
     has been logged with the reference:</p>
     <p style="font-size:18px;font-weight:700;color:#0b2545;letter-spacing:.06em">${escapeHtml(opts.reference)}</p>
     <p>Our export team reviews every request personally. You will receive a
     written quotation with specifications, packaging, lead time and commercial
     terms — usually within one business day.</p>
     <p>Please quote this reference in any follow-up correspondence.</p>
     <p style="margin-top:24px"><a href="${opts.siteUrl}/quote" style="display:inline-block;background:#0f8f66;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Submit another request</a></p>`,
    `Sent by Meridian Global Exports · <a href="${opts.siteUrl}" style="color:#0b2545">${opts.siteUrl}</a><br/>
     This is an acknowledgement of your business inquiry.`
  );
  const text = `Your request has been received.\nReference: ${opts.reference}\n\nThank you for contacting Meridian Global Exports. Our export team will respond with a written quotation, usually within one business day.`;
  return { subject, html, text };
}

export function adminAlertEmail(opts: {
  reference: string;
  kindLabel: string;
  company: string;
  contactName: string;
  email: string;
  country: string;
  products: string;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `New ${opts.kindLabel.toLowerCase()} ${opts.reference} — ${opts.company}`;
  const html = layout(
    `New lead: ${escapeHtml(opts.reference)}`,
    `<p style="font-size:14px;color:#5f7288;margin-top:0">${escapeHtml(opts.kindLabel)}</p>
     <table cellpadding="6" style="font-size:14px;width:100%">
       <tr><td style="color:#5f7288">Company</td><td><strong>${escapeHtml(opts.company)}</strong></td></tr>
       <tr><td style="color:#5f7288">Contact</td><td>${escapeHtml(opts.contactName)}</td></tr>
       <tr><td style="color:#5f7288">E-mail</td><td>${escapeHtml(opts.email)}</td></tr>
       <tr><td style="color:#5f7288">Country</td><td>${escapeHtml(opts.country)}</td></tr>
       <tr><td style="color:#5f7288">Products</td><td>${escapeHtml(opts.products)}</td></tr>
     </table>
     <p style="margin-top:20px"><a href="${opts.dashboardUrl}" style="display:inline-block;background:#0b2545;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Open in dashboard</a></p>`,
    `Meridian Global Exports · administration alert`
  );
  const text = `New lead ${opts.reference}\n${opts.kindLabel}\n${opts.company} — ${opts.contactName} <${opts.email}>\nCountry: ${opts.country}\nProducts: ${opts.products}\n${opts.dashboardUrl}`;
  return { subject, html, text };
}

export function quotationEmail(opts: {
  reference: string;
  inquiryReference: string;
  contactName: string;
  link: string;
  validUntil?: string;
}): { subject: string; html: string; text: string } {
  const subject = `Quotation ${opts.reference} — Meridian Global Exports`;
  const html = layout(
    `Quotation ${escapeHtml(opts.reference)}`,
    `<p>Hello ${escapeHtml(opts.contactName)},</p>
     <p>Please find our quotation <strong>${escapeHtml(opts.reference)}</strong>
     for your inquiry <strong>${escapeHtml(opts.inquiryReference)}</strong>.</p>
     ${opts.validUntil ? `<p>Valid until: <strong>${escapeHtml(opts.validUntil)}</strong></p>` : ""}
     <p style="margin-top:24px"><a href="${opts.link}" style="display:inline-block;background:#0f8f66;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">View quotation</a></p>
     <p style="font-size:13px;color:#5f7288">Pricing, packaging, lead time and delivery terms are those stated in the
     quotation document. Any import duties, customs clearance, VAT or product
     compliance obligations at destination are the buyer's responsibility unless
     separately agreed in writing.</p>`,
    `Meridian Global Exports · <a href="${opts.link}" style="color:#0b2545">${opts.link}</a>`
  );
  const text = `Quotation ${opts.reference} for inquiry ${opts.inquiryReference}.\nView: ${opts.link}${opts.validUntil ? `\nValid until: ${opts.validUntil}` : ""}`;
  return { subject, html, text };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
