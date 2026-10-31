import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/products/Filters";
import { getDict, getLocale } from "@/lib/i18n";
import { getMarketSelection } from "@/lib/market";
import { db } from "@/lib/db";
import { getFx } from "@/lib/rates";
import { describePrice } from "@/lib/price";
import { cn } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Catalogue — Bulk Export Lines",
  description:
    "Search export-ready bulk products by category: food & agro, textiles, leather, sports goods, surgical instruments and stone. B2B pricing quoted per order.",
};

const PER_PAGE = 9;
const SORTS = ["featured", "name", "newest"] as const;
type Sort = (typeof SORTS)[number];

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}>;

function buildHref(params: {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
}): string {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.sort && params.sort !== "featured") query.set("sort", params.sort);
  if (params.page && params.page > 1) query.set("page", String(params.page));
  const value = query.toString();
  return value ? `/products?${value}` : "/products";
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = await getLocale();
  const dict = getDict(locale);
  const selection = await getMarketSelection();

  const q = (params.q ?? "").trim().slice(0, 80);
  const categorySlug = (params.category ?? "").trim();
  const sort: Sort = (SORTS as readonly string[]).includes(params.sort ?? "")
    ? (params.sort as Sort)
    : "featured";
  const totalPagesInput = Number(params.page ?? 1);
  const page = Number.isFinite(totalPagesInput) && totalPagesInput > 0
    ? Math.floor(totalPagesInput)
    : 1;

  const category = categorySlug
    ? await db.category.findUnique({ where: { slug: categorySlug }, select: { id: true } })
    : null;

  const where = {
    status: "active",
    ...(category ? { categoryId: category.id } : categorySlug ? { categoryId: "__none__" } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { shortDesc: { contains: q } },
            { description: { contains: q } },
            { sku: { contains: q } },
            { searchKeywords: { contains: q } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "name"
      ? { name: "asc" as const }
      : sort === "newest"
        ? { createdAt: "desc" as const }
        : [{ featured: "desc" as const }, { sortOrder: "asc" as const }, { name: "asc" as const }];

  const [total, categories, productRows, fx] = await Promise.all([
    db.product.count({ where }),
    db.category.findMany({
      where: { products: { some: { status: "active" } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { name: true, slug: true, _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    getFx(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const activeCategory = categories.find((item) => item.slug === categorySlug) ?? null;

  const products = productRows.map((product) => ({
    product: {
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      shortDesc: product.shortDesc,
      moq: product.moq,
      leadTime: product.leadTime,
      featured: product.featured,
      category: { name: product.category.name, slug: product.category.slug },
      images: product.images.map((image) => ({ path: image.path, alt: image.alt })),
    },
    price: describePrice(product, selection.currency, fx, locale),
  }));

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-line bg-surface-2">
        <div className="container-x py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-500">
            <Link href="/" className="transition hover:text-navy-800">
              {dict.nav.home}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-ink-700">{dict.products.title}</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            {activeCategory ? activeCategory.name : dict.products.title}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-600">{dict.products.sub}</p>
        </div>
      </section>

      <section className="container-x py-10">
        <Filters dict={dict} categories={categories} currentCategory={categorySlug} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-600">
          <p aria-live="polite">
            {total === 1
              ? dict.products.resultsOne
              : dict.products.resultsMany.replace("{n}", String(total))}
            {q ? ` · “${q}”` : ""}
          </p>
          <p className="text-xs text-ink-500">
            {selection.currency} · {selection.market.flag} {selection.market.short}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-12 text-center">
            <p className="font-semibold text-ink-900">{dict.products.noResults}</p>
            <p className="mt-2 text-sm text-ink-600">{dict.products.noResultsHint}</p>
            <Link href="/products" className="mt-6 inline-flex rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700">
              {dict.products.clearFilters}
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(({ product, price }, index) => (
              <ProductCard key={product.slug} product={product} price={price} dict={dict} index={index} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
            {page > 1 ? (
              <Link
                href={buildHref({ q, category: categorySlug, sort, page: page - 1 })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-navy-800 transition hover:border-navy-800"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-400" aria-hidden="true">
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                href={buildHref({ q, category: categorySlug, sort, page: number })}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition",
                  number === page
                    ? "bg-navy-800 text-white"
                    : "border border-line-strong text-navy-800 hover:border-navy-800"
                )}
              >
                {number}
              </Link>
            ))}
            {page < totalPages ? (
              <Link
                href={buildHref({ q, category: categorySlug, sort, page: page + 1 })}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-navy-800 transition hover:border-navy-800"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-400" aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}

        <div className="mt-10 flex items-center gap-2 rounded-xl border border-line bg-surface-2 p-4 text-xs text-ink-600">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          {locale === "de"
            ? "Preise werden pro Auftrag anhand von Menge, Spezifikation und Zielmarkt angeboten — nutzen Sie die Angebotsanfrage für ein schriftliches Angebot."
            : "Pricing is quoted per order against volume, specification and destination — use the quote request for a written offer."}
        </div>
      </section>
    </div>
  );
}
