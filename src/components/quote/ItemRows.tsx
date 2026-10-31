"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Dict } from "@/locales/en";
import { field } from "@/lib/ui";

export type FormItem = {
  key: string;
  productId: string | null;
  productName: string;
  sku: string;
  quantity: string;
  packaging: string;
  notes: string;
};

export type CatalogueItem = { id: string; slug: string; name: string; sku: string };

type Props = {
  dict: Dict;
  items: FormItem[];
  errors: Record<string, string>;
  catalogue?: CatalogueItem[];
  readOnlyName?: boolean;
  onChange: (key: string, patch: Partial<FormItem>) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
};

export function emptyItem(): FormItem {
  return {
    key: `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productId: null,
    productName: "",
    sku: "",
    quantity: "",
    packaging: "",
    notes: "",
  };
}

/** Product rows: select from the catalogue (or enter a custom line item). */
export default function ItemRows({
  dict,
  items,
  errors,
  catalogue,
  readOnlyName,
  onChange,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const quantityError = errors[`items.${index}.quantity`];
        const nameError = errors[`items.${index}.productName`];
        return (
          <div key={item.key} className="rounded-xl border border-line bg-surface-2 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-start gap-3">
                <div className="flex-1">
                  <label className={field.label} htmlFor={`item-name-${index}`}>
                    {dict.quote.product} <span className="text-red-500">*</span>
                  </label>
                  {readOnlyName ? (
                    <input
                      id={`item-name-${index}`}
                      value={item.productName}
                      readOnly
                      className={`${field.input} bg-surface-3 font-medium`}
                    />
                  ) : (
                    <>
                      <select
                        id={`item-name-${index}`}
                        value={item.productId ?? (item.productName ? "__custom" : "")}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === "__custom") {
                            onChange(item.key, { productId: null, productName: "", sku: "" });
                          } else if (value) {
                            const match = catalogue?.find((entry) => entry.id === value);
                            onChange(item.key, {
                              productId: value,
                              productName: match?.name ?? "",
                              sku: match?.sku ?? "",
                            });
                          } else {
                            onChange(item.key, { productId: null, productName: "", sku: "" });
                          }
                        }}
                        className={field.select}
                        aria-invalid={Boolean(nameError)}
                      >
                        <option value="">— {dict.quote.addProductRow} —</option>
                        {catalogue?.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                        <option value="__custom">
                          {dict.quote.customProduct}
                        </option>
                      </select>
                      {nameError && <p className={field.error}>{nameError}</p>}
                      {!item.productId && (
                        <input
                          value={item.productName}
                          onChange={(event) =>
                            onChange(item.key, { productName: event.target.value })
                          }
                          placeholder={dict.quote.product}
                          className={`${field.input} mt-2`}
                        />
                      )}
                    </>
                  )}
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.key)}
                    className="mt-6 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    aria-label={`${dict.quote.removeRow} — ${item.productName || index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className={field.label} htmlFor={`item-qty-${index}`}>
                  {dict.quote.quantity} <span className="text-red-500">*</span>
                </label>
                <input
                  id={`item-qty-${index}`}
                  value={item.quantity}
                  onChange={(event) => onChange(item.key, { quantity: event.target.value })}
                  placeholder={dict.quote.quantityPlaceholder}
                  className={field.input}
                  aria-invalid={Boolean(quantityError)}
                />
                {quantityError && <p className={field.error}>{quantityError}</p>}
              </div>

              <div>
                <label className={field.label} htmlFor={`item-pack-${index}`}>
                  {dict.quote.itemPackaging}
                </label>
                <input
                  id={`item-pack-${index}`}
                  value={item.packaging}
                  onChange={(event) => onChange(item.key, { packaging: event.target.value })}
                  className={field.input}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={field.label} htmlFor={`item-notes-${index}`}>
                  {dict.quote.itemNotes}
                </label>
                <input
                  id={`item-notes-${index}`}
                  value={item.notes}
                  onChange={(event) => onChange(item.key, { notes: event.target.value })}
                  className={field.input}
                />
              </div>
            </div>
          </div>
        );
      })}

      {!readOnlyName && (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {dict.quote.addProductRow}
        </button>
      )}
    </div>
  );
}
