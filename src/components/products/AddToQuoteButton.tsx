"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { getDict, type Locale } from "@/locales";
import { addToBasket, type BasketItem } from "@/lib/client";
import { btn } from "@/lib/ui";

export default function AddToQuoteButton({
  slug,
  name,
  moq,
  locale,
}: {
  slug: string;
  name: string;
  moq: string;
  locale: Locale;
}) {
  const t = getDict(locale);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="button"
        onClick={() => {
          addToBasket({ id: slug, slug, name, sku: "" });
          setAdded(true);
          setTimeout(() => setAdded(false), 2600);
        }}
        className={btn.primary + " flex-1 justify-center gap-2"}
      >
        {added ? <Check size={17} /> : <Plus size={17} />}
        {added ? t.common.addedToQuote : t.product.addToQuote}
      </button>
      <Link href={`/quote?product=${slug}`} className={btn.secondary + " justify-center"}>
        {t.common.requestQuote}
      </Link>
    </div>
  );
}
