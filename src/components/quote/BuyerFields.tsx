"use client";

import type { Dict } from "@/locales/en";
import type { MarketCode } from "@/lib/site";
import { MARKETS, SHIPPING_METHODS } from "@/lib/site";
import { field } from "@/lib/ui";

export type BuyerValues = {
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: "United Kingdom" | "Germany" | "Other";
  otherCountry: string;
  city: string;
  postcode: string;
  address: string;
  shippingMethod: string;
  packaging: string;
  customization: string;
  targetPrice: string;
  notes: string;
};

export const emptyBuyer: BuyerValues = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  country: "United Kingdom",
  otherCountry: "",
  city: "",
  postcode: "",
  address: "",
  shippingMethod: "",
  packaging: "",
  customization: "",
  targetPrice: "",
  notes: "",
};

type Props = {
  dict: Dict;
  market: MarketCode;
  values: BuyerValues;
  errors: Record<string, string>;
  onChange: (name: keyof BuyerValues, value: string) => void;
  destinationLabel?: string;
};

export default function BuyerFields({
  dict,
  market,
  values,
  errors,
  onChange,
  destinationLabel,
}: Props) {
  const address = MARKETS[market];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className={field.label} htmlFor="lead-company">
          {dict.quote.company} <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-company"
          name="company"
          value={values.company}
          onChange={(event) => onChange("company", event.target.value)}
          className={field.input}
          autoComplete="organization"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "lead-company-error" : undefined}
        />
        {errors.company && (
          <p id="lead-company-error" className={field.error}>
            {errors.company}
          </p>
        )}
      </div>

      <div className="sm:col-span-1">
        <label className={field.label} htmlFor="lead-contact">
          {dict.quote.contactPerson} <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-contact"
          name="contactPerson"
          value={values.contactPerson}
          onChange={(event) => onChange("contactPerson", event.target.value)}
          className={field.input}
          autoComplete="name"
          aria-invalid={Boolean(errors.contactPerson)}
          aria-describedby={errors.contactPerson ? "lead-contact-error" : undefined}
        />
        {errors.contactPerson && (
          <p id="lead-contact-error" className={field.error}>
            {errors.contactPerson}
          </p>
        )}
      </div>

      <div>
        <label className={field.label} htmlFor="lead-email">
          {dict.quote.email} <span className="text-red-500">*</span>
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          className={field.input}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "lead-email-error" : undefined}
        />
        {errors.email && <p id="lead-email-error" className={field.error}>{errors.email}</p>}
      </div>

      <div>
        <label className={field.label} htmlFor="lead-phone">
          {dict.quote.phone}
        </label>
        <input
          id="lead-phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={(event) => onChange("phone", event.target.value)}
          className={field.input}
          autoComplete="tel"
        />
      </div>

      <div>
        <label className={field.label} htmlFor="lead-country">
          {dict.quote.country} <span className="text-red-500">*</span>
        </label>
        <select
          id="lead-country"
          name="country"
          value={values.country}
          onChange={(event) => onChange("country", event.target.value as BuyerValues["country"])}
          className={field.select}
          aria-invalid={Boolean(errors.country)}
        >
          <option value="United Kingdom">{dict.quote.countryUk}</option>
          <option value="Germany">{dict.quote.countryDe}</option>
          <option value="Other">{dict.quote.countryOther}</option>
        </select>
        {errors.country && <p className={field.error}>{errors.country}</p>}
      </div>

      {values.country === "Other" && (
        <div>
          <label className={field.label} htmlFor="lead-other-country">
            {dict.quote.otherCountry} <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-other-country"
            name="otherCountry"
            value={values.otherCountry}
            onChange={(event) => onChange("otherCountry", event.target.value)}
            className={field.input}
            aria-invalid={Boolean(errors.otherCountry)}
          />
          {errors.otherCountry && <p className={field.error}>{errors.otherCountry}</p>}
        </div>
      )}

      <div>
        <label className={field.label} htmlFor="lead-city">
          {destinationLabel ?? dict.quote.destination}
        </label>
        <input
          id="lead-city"
          name="city"
          value={values.city}
          onChange={(event) => onChange("city", event.target.value)}
          className={field.input}
          autoComplete="address-level2"
        />
      </div>

      <div>
        <label className={field.label} htmlFor="lead-postcode">
          {address.postcodeLabel}
          <span className="ml-1 font-normal normal-case tracking-normal text-ink-400">
            ({address.postcodeExample})
          </span>
        </label>
        <input
          id="lead-postcode"
          name="postcode"
          value={values.postcode}
          onChange={(event) => onChange("postcode", event.target.value)}
          className={field.input}
          autoComplete="postal-code"
          maxLength={16}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-address">
          {dict.quote.address}
        </label>
        <input
          id="lead-address"
          name="address"
          value={values.address}
          onChange={(event) => onChange("address", event.target.value)}
          className={field.input}
          autoComplete="street-address"
        />
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-shipping">
          {dict.quote.shipping}
        </label>
        <select
          id="lead-shipping"
          name="shippingMethod"
          value={values.shippingMethod}
          onChange={(event) => onChange("shippingMethod", event.target.value)}
          className={field.select}
        >
          <option value="">{dict.quote.shippingPlaceholder}</option>
          {SHIPPING_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-packaging">
          {dict.quote.packaging}
        </label>
        <input
          id="lead-packaging"
          name="packaging"
          value={values.packaging}
          onChange={(event) => onChange("packaging", event.target.value)}
          placeholder={dict.quote.packagingPlaceholder}
          className={field.input}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-customization">
          {dict.quote.customization}
        </label>
        <textarea
          id="lead-customization"
          name="customization"
          rows={3}
          value={values.customization}
          onChange={(event) => onChange("customization", event.target.value)}
          placeholder={dict.quote.customizationPlaceholder}
          className={field.textarea}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-target-price">
          {dict.quote.targetPrice}
        </label>
        <input
          id="lead-target-price"
          name="targetPrice"
          value={values.targetPrice}
          onChange={(event) => onChange("targetPrice", event.target.value)}
          className={field.input}
          placeholder={values.country === "Germany" ? "z. B. 12,50 € / kg" : "e.g. £1.85 / kg"}
        />
        <p className={field.hint}>{dict.quote.targetPriceHint}</p>
      </div>

      <div className="sm:col-span-2">
        <label className={field.label} htmlFor="lead-notes">
          {dict.quote.notes}
        </label>
        <textarea
          id="lead-notes"
          name="notes"
          rows={4}
          value={values.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className={field.textarea}
        />
      </div>
    </div>
  );
}
