import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductCard, { type CardProduct } from "@/components/ProductCard";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import type { PriceDisplay } from "@/lib/price";

type Props = {
  dict: Dict;
  locale: Locale;
  products: Array<{ product: CardProduct; price: PriceDisplay }>;
};

export default function FeaturedProducts({ dict, locale, products }: Props) {
  return (
    <section className="section-pad bg-surface-2" aria-labelledby="featured-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{dict.common.exploreProducts}</p>
            <h2 id="featured-title" className="mt-4 text-3xl font-bold sm:text-4xl">
              {dict.home.featuredTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-ink-600">{dict.home.featuredSub}</p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50"
          >
            {dict.common.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        {products.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center text-sm text-ink-500">
            {dict.common.noProductsYet}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ product, price }, index) => (
              <ProductCard
                key={product.slug}
                product={product}
                price={price}
                dict={dict}
                index={index}
              />
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-ink-500">
          {locale === "de"
            ? "Die Katalogansicht zeigt Richtpreise, sofern veröffentlicht. Verbindliche Preise erhalten Sie im Angebot."
            : "Catalogue prices, where published, are indicative. Confirmed pricing comes with your written quotation."}
        </p>
      </div>
    </section>
  );
}
