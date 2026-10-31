"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Dict } from "@/locales/en";
import { cn } from "@/lib/ui";

type Category = { name: string; slug: string; _count: { products: number } };

type Props = {
  dict: Dict;
  categories: Category[];
  currentCategory: string;
};

/**
 * URL-driven catalogue filters: search (debounced), category chips and sort.
 * Category chips are real links, so filtering works without JavaScript too.
 */
export default function Filters({ dict, categories, currentCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const first = useRef(true);

  const sort = searchParams.get("sort") ?? "featured";

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("q", query);
      else params.delete("q");
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "featured") params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <label htmlFor="catalogue-search" className="sr-only">
            {dict.products.searchPlaceholder}
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <input
            id="catalogue-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.products.searchPlaceholder}
            className="w-full rounded-lg border border-line-strong bg-white py-2.5 pl-10 pr-10 text-sm text-ink-900 placeholder:text-ink-400 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={dict.common.clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-400 transition hover:text-navy-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="catalogue-sort" className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            {dict.products.sortLabel}
          </label>
          <select
            id="catalogue-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-line-strong bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/15"
          >
            <option value="featured">{dict.products.sortFeatured}</option>
            <option value="name">{dict.products.sortName}</option>
            <option value="newest">{dict.products.sortNewest}</option>
          </select>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={dict.products.category}>
        <button
          type="button"
          onClick={() => setCategory("")          }
          aria-pressed={!currentCategory}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
            !currentCategory
              ? "border-navy-800 bg-navy-800 text-white"
              : "border-line-strong bg-white text-ink-700 hover:border-navy-800 hover:text-navy-800"
          )}
        >
          {dict.products.allCategories}
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setCategory(category.slug)}
            aria-pressed={currentCategory === category.slug}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
              currentCategory === category.slug
                ? "border-navy-800 bg-navy-800 text-white"
                : "border-line-strong bg-white text-ink-700 hover:border-navy-800 hover:text-navy-800"
            )}
          >
            {category.name}
            <span className="ml-1.5 text-[11px] opacity-60">{category._count.products}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
