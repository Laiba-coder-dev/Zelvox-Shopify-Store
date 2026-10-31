"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/locales";
import type { MarketCode } from "@/lib/site";
import { MARKETS, UPLOAD_RULES } from "@/lib/site";
import { btn, field } from "@/lib/ui";
import BuyerFields, { emptyBuyer, type BuyerValues } from "./BuyerFields";
import ItemRows, { emptyItem, type CatalogueItem, type FormItem } from "./ItemRows";
import { clearBasket } from "@/lib/client";

type Props = {
  dict: Dict;
  locale: Locale;
  market: MarketCode;
  /** Single product page or multi-product quote page. */
  mode: "product" | "basket";
  initialItems: FormItem[];
  catalogue?: CatalogueItem[];
  allowSample?: boolean;
  source: string;
  showBasketNotice?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MB = 1024 * 1024;

export default function LeadForm({
  dict,
  locale,
  market,
  mode,
  initialItems,
  catalogue,
  allowSample = false,
  source,
  showBasketNotice = false,
}: Props) {
  const defaultCountry: BuyerValues["country"] =
    market === "DE" ? "Germany" : market === "UK" ? "United Kingdom" : "Other";

  const [buyer, setBuyer] = useState<BuyerValues>({
    ...emptyBuyer,
    country: defaultCountry,
  });
  const [items, setItems] = useState<FormItem[]>(
    initialItems.length ? initialItems : [emptyItem()]
  );
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [reference, setReference] = useState("");
  const [emailStatus, setEmailStatus] = useState<string>("sent");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  const basketNotice = useMemo(
    () => (showBasketNotice && items.length > 1 ? dict.quote.basketNotice.replace("{n}", String(items.length)) : ""),
    [showBasketNotice, items.length, dict]
  );

  const setBuyerField = (name: keyof BuyerValues, value: string) => {
    setBuyer((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const setItemField = (key: string, patch: Partial<FormItem>) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, ...patch } : item))
    );
    setErrors((current) => {
      const next = { ...current };
      Object.keys(next)
        .filter((path) => path.startsWith("items.") && path.endsWith(".quantity"))
        .forEach((path) => {
          const index = Number(path.split(".")[1]);
          if (items[index]?.key === key) delete next[path];
        });
      return next;
    });
  };

  const addItem = () => setItems((current) => [...current, emptyItem()]);

  const removeItem = (key: string) =>
    setItems((current) => (current.length > 1 ? current.filter((item) => item.key !== key) : current));

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const accepted: File[] = [];
    const problems: string[] = [];
    for (const file of Array.from(incoming)) {
      if (files.length + accepted.length >= UPLOAD_RULES.inquiryMaxFiles) {
        problems.push(
          dict.quote.uploadHint
            .replace("{n}", String(UPLOAD_RULES.inquiryMaxFiles))
            .replace("{mb}", String(Math.round(UPLOAD_RULES.inquiryMaxBytes / MB)))
        );
        break;
      }
      if (!UPLOAD_RULES.inquiryTypes.includes(file.type as never)) {
        problems.push(`${file.name}: type not allowed`);
        continue;
      }
      if (file.size > UPLOAD_RULES.inquiryMaxBytes) {
        problems.push(`${file.name}: ${Math.round(file.size / MB)} MB > limit`);
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) setFiles((current) => [...current, ...accepted]);
    if (problems.length) setMessage(problems.join(" · "));
  };

  function validate(): boolean {
    const found: Record<string, string> = {};
    if (buyer.company.trim().length < 2) found.company = dict.quote.company;
    if (buyer.contactPerson.trim().length < 2) found.contactPerson = dict.quote.contactPerson;
    if (!EMAIL_RE.test(buyer.email.trim())) found.email = dict.quote.email;
    if (buyer.country === "Other" && !buyer.otherCountry.trim()) found.otherCountry = dict.quote.otherCountry;

    if (mode === "product" || allowSample || items.length >= 0) {
      items.forEach((item, index) => {
        if (!item.productName.trim()) found[`items.${index}.productName`] = dict.quote.product;
        if (!item.quantity.trim()) found[`items.${index}.quantity`] = dict.quote.quantity;
      });
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function submit(kind: "inquiry" | "sample") {
    if (honeypot) {
      setMessage(dict.quote.genericError);
      setStatus("error");
      return;
    }
    if (!validate()) {
      setStatus("error");
      setMessage(dict.quote.errorSummary);
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          kind,
          company: buyer.company.trim(),
          contactPerson: buyer.contactPerson.trim(),
          email: buyer.email.trim(),
          phone: buyer.phone.trim(),
          country: buyer.country,
          otherCountry: buyer.otherCountry.trim(),
          city: buyer.city.trim(),
          postcode: buyer.postcode.trim(),
          address: buyer.address.trim(),
          shippingMethod: buyer.shippingMethod,
          packaging: buyer.packaging.trim(),
          customization: buyer.customization.trim(),
          targetPrice: buyer.targetPrice.trim(),
          notes: buyer.notes.trim(),
          items: items
            .filter((item) => item.productName.trim() && item.quantity.trim())
            .map((item) => ({
              productId: item.productId,
              productName: item.productName.trim(),
              sku: item.sku || undefined,
              quantity: item.quantity.trim(),
              packaging: item.packaging.trim() || undefined,
              notes: item.notes.trim() || undefined,
            })),
        })
      );
      formData.append("website", honeypot);
      files.forEach((file) => formData.append("files", file, file.name));

      const res = await fetch("/api/leads", { method: "POST", body: formData });
      const payload = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reference?: string;
        emailStatus?: string;
        error?: string;
        fields?: Record<string, string>;
      };

      if (res.status === 201 && payload.reference) {
        setReference(payload.reference);
        setEmailStatus(payload.emailStatus ?? "not-configured");
        setStatus("success");
        setErrors({});
        if (mode === "basket") clearBasket();
        return;
      }

      if (res.status === 422 && payload.fields) {
        setErrors(payload.fields);
        setMessage(payload.error ?? dict.quote.errorSummary);
        setStatus("error");
        window.requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      setMessage(payload.error ?? dict.quote.genericError);
      setStatus("error");
    } catch {
      setMessage(dict.errors.network);
      setStatus("error");
    }
  }

  /* --------------------------------- success -------------------------------- */
  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-7 sm:p-9" role="status">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-700 shadow-soft">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl font-bold text-ink-950">{dict.quote.successTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-700">
          {dict.quote.successBody.replace("{email}", buyer.email)}
        </p>

        <dl className="mt-6 grid gap-4 rounded-xl border border-brand-200 bg-white p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              {dict.quote.successRef}
            </dt>
            <dd className="mt-1 font-mono text-xl font-bold tracking-wider text-navy-800">
              {reference}
            </dd>
          </div>
          <div className="text-xs leading-relaxed text-ink-600">
            <p className="font-semibold text-ink-800">{dict.quote.successNext}</p>
            {emailStatus === "not-configured" && (
              <p className="mt-2 rounded-lg bg-surface-2 p-3 text-ink-600">
                {dict.quote.emailNotice}
              </p>
            )}
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setReference("");
              setFiles([]);
              setBuyer({ ...emptyBuyer, country: defaultCountry });
              setItems(initialItems.length ? initialItems : [emptyItem()]);
            }}
            className={btn.secondary}
          >
            {dict.quote.successNew}
          </button>
          <Link href="/products" className={btn.primary}>
            {dict.quote.backToCatalogue}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------------------------- form ---------------------------------- */
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void submit("inquiry");
      }}
      noValidate
      className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {(status === "error" || message) && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{message || dict.quote.errorSummary}</span>
        </div>
      )}

      <fieldset className="border-0 p-0">
        <legend className="mb-5 text-lg font-bold text-ink-950">{dict.quote.buyerSection}</legend>
        <BuyerFields
          dict={dict}
          market={market}
          values={buyer}
          errors={errors}
          onChange={setBuyerField}
        />
      </fieldset>

      <div className="my-7 h-px bg-line" />

      <fieldset className="border-0 p-0">
        <legend className="mb-4 text-lg font-bold text-ink-950">{dict.quote.productsSection}</legend>
        {basketNotice && (
          <p className="mb-4 rounded-lg bg-navy-50 px-4 py-3 text-[13px] text-navy-700">
            {basketNotice}
          </p>
        )}
        <ItemRows
          dict={dict}
          items={items}
          errors={errors}
          catalogue={catalogue}
          readOnlyName={mode === "product"}
          onChange={setItemField}
          onAdd={addItem}
          onRemove={removeItem}
        />
      </fieldset>

      <div className="my-7 h-px bg-line" />

      <fieldset className="border-0 p-0">
        <legend className="mb-4 text-lg font-bold text-ink-950">
          {dict.quote.termsSection}
        </legend>

        {/* File upload */}
        <div>
          <span className={field.label}>{dict.quote.upload}</span>
          <label
            htmlFor="lead-files"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-surface-2 px-4 py-5 text-sm font-medium text-ink-600 transition hover:border-navy-600 hover:bg-navy-50"
          >
            <Paperclip className="h-4 w-4 text-navy-700" aria-hidden="true" />
            {dict.quote.upload}
          </label>
          <input
            id="lead-files"
            type="file"
            multiple
            className="sr-only"
            accept={UPLOAD_RULES.inquiryTypes.join(",")}
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <p className={field.hint}>
            {dict.quote.uploadHint
              .replace("{n}", String(UPLOAD_RULES.inquiryMaxFiles))
              .replace("{mb}", String(Math.round(UPLOAD_RULES.inquiryMaxBytes / MB)))}
          </p>
          {files.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs text-ink-700"
                >
                  <span className="max-w-[14rem] truncate">{file.name}</span>
                  <span className="text-ink-400">{(file.size / MB).toFixed(1)} MB</span>
                  <button
                    type="button"
                    onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                    className="rounded p-0.5 text-ink-400 transition hover:text-red-600"
                    aria-label={`${dict.common.remove} ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={`${btn.primary} px-7 py-3.5`}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {dict.quote.submitting}
            </>
          ) : (
            <>
              {dict.quote.submit}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        {allowSample && (
          <button
            type="button"
            disabled={status === "submitting"}
            onClick={() => void submit("sample")}
            className={btn.secondary}
          >
            {dict.common.sample}
          </button>
        )}

        <span className="text-xs text-ink-500 sm:ml-auto">
          {locale === "de"
            ? "Ihre Anfrage wird gespeichert und beantwortet."
            : "Your inquiry is stored securely and answered by our export desk."}
        </span>
      </div>
      <span className="sr-only">{MARKETS[market].short}</span>
    </form>
  );
}
