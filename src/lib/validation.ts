import { z } from "zod";
import { INQUIRY_STATUSES, PRODUCT_STATUSES, QUOTATION_STATUSES } from "./site";

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer`)
    .optional()
    .transform((v) => (v ?? "").trim());

const contactFields = {
  company: z
    .string({ required_error: "Company name is required" })
    .min(2, "Company name is required")
    .max(160),
  contactPerson: z
    .string({ required_error: "Contact person is required" })
    .min(2, "Contact person is required")
    .max(120),
  email: z
    .string({ required_error: "Business e-mail is required" })
    .email("Enter a valid e-mail address")
    .max(160),
  phone: optionalText(40),
  country: z.enum(["United Kingdom", "Germany", "Other"], {
    errorMap: () => ({ message: "Select a destination country" }),
  }),
  otherCountry: optionalText(80),
  city: optionalText(90),
  postcode: optionalText(16),
  address: optionalText(240),
  shippingMethod: optionalText(60),
  packaging: optionalText(300),
  customization: optionalText(2000),
  targetPrice: optionalText(120),
  notes: optionalText(4000),
};

export const inquiryItemSchema = z.object({
  productId: z.string().optional().nullable(),
  productName: z
    .string({ required_error: "Select a product" })
    .min(1, "Select a product")
    .max(200),
  sku: optionalText(60),
  quantity: z
    .string({ required_error: "Quantity is required" })
    .min(1, "Required quantity is required")
    .max(80),
  packaging: optionalText(300),
  notes: optionalText(1000),
});
export type InquiryItemInput = z.infer<typeof inquiryItemSchema>;

export const bulkInquirySchema = z.object({
  ...contactFields,
  kind: z.enum(["inquiry", "sample"]).default("inquiry"),
  items: z
    .array(inquiryItemSchema)
    .min(1, "Add at least one product to your inquiry"),
});
export type BulkInquiryInput = z.infer<typeof bulkInquirySchema>;

export const messageSchema = z.object({
  ...contactFields,
  kind: z.enum(["contact", "callback"]).default("contact"),
  subject: optionalText(160),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Please write at least 10 characters")
    .max(5000),
  callbackRequested: z.boolean().optional().default(false),
});
export type MessageInput = z.infer<typeof messageSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid e-mail address"),
  password: z.string().min(1, "Password is required"),
});

/* -------------------------------------------------------------------------- */
/* Admin inputs                                                                */
/* -------------------------------------------------------------------------- */

export const productSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().max(180).optional().transform((v) => (v ?? "").trim()),
  sku: z.string().min(2).max(60),
  categoryId: z.string().min(1, "Choose a category"),
  shortDesc: z.string().min(10, "Add a short description (min. 10 characters)").max(400),
  description: z.string().min(20, "Add a full description (min. 20 characters)").max(6000),
  moq: z.string().min(1, "MOQ is required").max(120),
  leadTime: z.string().min(1, "Lead time is required").max(120),
  packaging: z.string().min(1, "Packaging details are required").max(1500),
  customization: optionalText(1500),
  materials: optionalText(400),
  dimensions: optionalText(400),
  pricePublished: z.coerce.boolean().default(false),
  priceAmount: z.coerce
    .number({ invalid_type_error: "Enter a numeric price" })
    .positive("Price must be greater than zero")
    .nullable()
    .optional(),
  priceUnit: optionalText(60),
  priceCurrency: z.enum(["GBP", "EUR", "USD"]).default("GBP"),
  featured: z.coerce.boolean().default(false),
  status: z.enum(PRODUCT_STATUSES).default("active"),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  searchKeywords: optionalText(400),
  options: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        values: z.string().min(1).max(400),
        sortOrder: z.coerce.number().int().min(0).default(0),
      })
    )
    .default([]),
  specifications: z
    .array(
      z.object({
        label: z.string().min(1).max(80),
        value: z.string().min(1).max(300),
        sortOrder: z.coerce.number().int().min(0).default(0),
      })
    )
    .default([]),
  imageAlts: z.array(z.object({ id: z.string(), alt: z.string().max(200) })).optional(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().max(90).optional().transform((v) => (v ?? "").trim()),
  description: optionalText(300),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

export const statusUpdateSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
  note: optionalText(1000),
  adminNotes: optionalText(4000),
});

export const quotationSchema = z.object({
  inquiryId: z.string().min(1),
  subject: z.string().min(3).max(200),
  currency: z.enum(["GBP", "EUR", "USD"]).default("GBP"),
  status: z.enum(QUOTATION_STATUSES).default("Draft"),
  validUntil: optionalText(20),
  intro: optionalText(1500),
  notes: optionalText(2000),
  terms: optionalText(2000),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1).max(400),
        quantity: z.string().min(1).max(80),
        unitPrice: z.coerce.number().min(0),
        amount: z.coerce.number().min(0),
      })
    )
    .min(1, "Add at least one line item"),
});
export type QuotationInput = z.infer<typeof quotationSchema>;

export const testimonialSchema = z.object({
  authorName: z.string().min(2).max(100),
  authorRole: optionalText(100),
  company: optionalText(120),
  country: optionalText(60),
  content: z.string().min(10, "Write the review text").max(1500),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  published: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

/** Flatten a ZodError into field → first message. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
