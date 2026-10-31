import Link from "next/link";
import { Compass } from "lucide-react";
import { getDict, getLocale } from "@/lib/i18n";
import { btn } from "@/lib/ui";

export default async function NotFound() {
  let locale: "en" | "de" = "en";
  try {
    locale = await getLocale();
  } catch {
    /* static contexts */
  }
  const dict = getDict(locale);

  return (
    <div className="container-x flex flex-col items-center justify-center py-28 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 text-navy-800">
        <Compass className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{dict.errors.notFound}</h1>
      <p className="mt-3 max-w-md text-ink-600">{dict.errors.notFoundBody}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={btn.primary}>
          {dict.errors.goHome}
        </Link>
        <Link href="/products" className={btn.secondary}>
          {dict.common.exploreProducts}
        </Link>
      </div>
    </div>
  );
}
