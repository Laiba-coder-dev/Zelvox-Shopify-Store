/**
 * Site-wide constants shared by the storefront and the admin dashboard.
 * Statuses and market definitions are application-level (SQLite has no enums).
 */

export const SITE_NAME = "Meridian Global Exports";
export const SITE_TAGLINE = "Bulk export sourcing for the UK, Germany & worldwide";

/** Inquiry / lead lifecycle (spec §4). */
export const INQUIRY_STATUSES = [
  "New",
  "Under Review",
  "Quotation Sent",
  "Negotiation",
  "Confirmed",
  "In Production",
  "Shipped",
  "Closed",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

/** Lead types — one pipeline for bulk inquiries, contact, callback + samples. */
export const LEAD_KINDS = ["inquiry", "contact", "callback", "sample"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export const LEAD_KIND_LABELS: Record<LeadKind, string> = {
  inquiry: "Bulk inquiry",
  contact: "Contact message",
  callback: "Callback request",
  sample: "Sample request",
};

export const QUOTATION_STATUSES = [
  "Draft",
  "Sent",
  "Under Negotiation",
  "Accepted",
  "Rejected",
  "Expired",
] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export const ADMIN_ROLES = ["admin", "manager", "viewer"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const SHIPPING_METHODS = [
  "Sea freight (FCL)",
  "Sea freight (LCL)",
  "Air freight",
  "Road / rail freight",
  "Courier (samples)",
  "Not sure — advise me",
] as const;

/** Target markets. */
export const MARKETS = {
  UK: {
    code: "UK" as const,
    name: "United Kingdom",
    short: "UK",
    flag: "🇬🇧",
    currency: "GBP" as const,
    locale: "en" as const,
    postcodeLabel: "Postcode",
    postcodeExample: "e.g. SW1A 1AA",
    cityLabel: "City / town",
    importInfoKey: "ukImportInfo",
  },
  DE: {
    code: "DE" as const,
    name: "Germany",
    short: "Germany",
    flag: "🇩🇪",
    currency: "EUR" as const,
    locale: "de" as const,
    postcodeLabel: "Postleitzahl (PLZ)",
    postcodeExample: "z. B. 20095",
    cityLabel: "Stadt",
    importInfoKey: "deImportInfo",
  },
  OTHER: {
    code: "OTHER" as const,
    name: "Other market",
    short: "International",
    flag: "🌐",
    currency: "USD" as const,
    locale: "en" as const,
    postcodeLabel: "Postcode / ZIP",
    postcodeExample: "Postal code",
    cityLabel: "City",
    importInfoKey: "" as const,
  },
} as const;

export type MarketCode = keyof typeof MARKETS;

export const CURRENCIES = ["GBP", "EUR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_LABELS: Record<Currency, string> = {
  GBP: "GBP — British Pound",
  EUR: "EUR — Euro",
  USD: "USD — US Dollar",
};

export const PRODUCT_STATUSES = ["active", "draft", "archived"] as const;

/** Upload constraints (server-enforced). */
export const UPLOAD_RULES = {
  inquiryMaxFiles: 5,
  inquiryMaxBytes: 8 * 1024 * 1024, // 8 MB per file
  inquiryTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.ms-excel",
    "text/plain",
    "text/csv",
  ],
  productMaxBytes: 6 * 1024 * 1024,
  productTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
} as const;
