"use client";

import { useState } from "react";
import { productImageSrc } from "@/components/ProductCard";
import { cn } from "@/lib/ui";
import { getDict, type Locale } from "@/locales";

type Props = {
  images: { url: string; alt: string }[];
  name: string;
  locale: Locale;
};

export default function Gallery({ images, name, locale }: Props) {
  const t = getDict(locale);
  const list = images.length ? images : [{ url: "/images/placeholder.svg", alt: name }];
  const [active, setActive] = useState(0);
  const current = list[Math.min(active, list.length - 1)];

  return (
    <div>
      <div className="bg-light border border-line rounded-xl overflow-hidden relative">
        <img
          src={productImageSrc(current.url)}
          alt={current.alt || name}
          width={900}
          height={720}
          className="w-full h-[320px] sm:h-[430px] lg:h-[520px] object-cover"
        />
        <div className="absolute bottom-3 right-3 bg-navy/85 text-white text-xs px-2.5 py-1 rounded-full font-medium tracking-wide">
          {active + 1} / {list.length}
        </div>
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-3">
          {list.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${t.product.gallery} ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative rounded-lg overflow-hidden border transition-all h-16 sm:h-20",
                i === active ? "border-navy-800 ring-2 ring-navy-800/20" : "border-line hover:border-navy-800/40",
              )}
            >
              <img
                src={productImageSrc(img.url)}
                alt={img.alt || name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
