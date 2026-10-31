import Link from "next/link";
import { ArrowUpRight, Clock, Package } from "lucide-react";
import type { Dict } from "@/locales/en";
import type { PriceDisplay } from "@/lib/price";
import { cn } from "@/lib/ui";

export type CardProduct = {
  slug: string;
  name: string;
  sku: string;
  shortDesc: string;
  moq: string;
  leadTime: string;
  featured: boolean;
  category: { name: string; slug: string };
  images: Array<{ path: string; alt: string | null }>;
};

type Props = {
  product: CardProduct;
  price: PriceDisplay;
  dict: Dict;
  /** Stagger position in a grid (0-based). */
  index?: number;
  className?: string;
};

export function productImageSrc(path: string): string {
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path;
  return `/api/media/${path.replace(/^\/+/, "")}`;
}

export default function ProductCard({ product, price, dict, index = 0, className }: Props) {
  const image = product.images[0];
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift",
        className
      )}
      style={{ ["--i" as string]: index }}
      data-reveal=""
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-3"
        tabIndex={-1}
        aria-hidden="true"
      >
        {image ? (
          <img
            src={productImageSrc(image.path)}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-50 to-surface-3">
            <Package className="h-10 w-10 text-navy-200" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy-800 shadow-soft">
          {product.category.name}
        </span>
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-md bg-brand-600 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white shadow-soft">
            {dict.products.featured}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-400">
            {dict.products.sku} {product.sku}
          </span>
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="text-ink-950 transition hover:text-navy-700"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-600">
          {product.shortDesc}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-4 text-[12px]">
          <div className="flex items-start gap-1.5">
            <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                {dict.products.moq}
              </dt>
              <dd className="font-medium text-ink-700">{product.moq}</dd>
            </div>
          </div>
          <div className="flex items-start gap-1.5">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-400">
                {dict.products.leadTime}
              </dt>
              <dd className="font-medium text-ink-700">{product.leadTime}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-3 min-h-[42px]">
          {price.show ? (
            <div>
              <p className="flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-bold text-navy-800">{price.text}</span>
                {price.unit && (
                  <span className="text-xs text-ink-500">
                    {dict.common.perUnit.replace("{unit}", price.unit)}
                  </span>
                )}
                <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">
                  {dict.common.indicative}
                </span>
              </p>
              <p className="mt-0.5 text-[10.5px] leading-snug text-ink-400">{price.rateNote}</p>
            </div>
          ) : (
            <p className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-navy-700">
              {dict.common.quoteOnly}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-semibold text-navy-800 underline-offset-4 transition hover:underline"
          >
            {dict.common.viewDetails}
          </Link>
          <Link
            href={`/quote?product=${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-800 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-600"
          >
            {dict.common.requestAQuote}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
