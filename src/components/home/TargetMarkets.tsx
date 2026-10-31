import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type Localized } from "@/lib/content";

type MarketContent = {
  heroTitle: Localized;
  howPoints: Localized[];
};

type Props = {
  dict: Dict;
  locale: Locale;
  uk: MarketContent;
  de: MarketContent;
};

export default function TargetMarkets({ dict, locale, uk, de }: Props) {
  const cards = [
    {
      href: "/markets/united-kingdom",
      flag: "🇬🇧",
      title: dict.nav.uk,
      image: "/images/market-uk.jpg",
      blurb: dict.home.marketUkCard,
      points: uk.howPoints.slice(0, 3),
      cta: locale === "de" ? "UK-Leitfaden ansehen" : "View UK import guide",
      index: 0,
    },
    {
      href: "/markets/germany",
      flag: "🇩🇪",
      title: dict.nav.de,
      image: "/images/market-germany.jpg",
      blurb: dict.home.marketDeCard,
      points: de.howPoints.slice(0, 3),
      cta: locale === "de" ? "EU-Leitfaden ansehen" : "View EU import guide",
      index: 1,
    },
  ];

  return (
    <section className="section-pad bg-surface-2" aria-labelledby="markets-title">
      <div className="container-x">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">{dict.nav.markets}</p>
            <h2 id="markets-title" className="mt-4 text-3xl font-bold sm:text-4xl">
              {dict.home.marketsTitle}
            </h2>
            <p className="mt-3 text-ink-600">{dict.home.marketsSub}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <Reveal key={card.href} index={card.index}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <img
                    src={card.image}
                    alt=""
                    width={1400}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-white">
                      <span aria-hidden="true">{card.flag}</span>
                      {card.title}
                    </h3>
                    <span className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-navy-800">
                      {card.href.endsWith("united-kingdom") ? "GBP" : "EUR"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-sm leading-relaxed text-ink-600">{card.blurb}</p>
                  <ul className="mt-5 space-y-3">
                    {card.points.map((point) => (
                      <li key={point.en} className="flex items-start gap-2.5 text-[13.5px] text-ink-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                        <span>{pick(point, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold text-navy-800 transition group-hover:border-navy-800 group-hover:bg-navy-800 group-hover:text-white"
                    >
                      {card.cta}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl rounded-xl border border-line bg-white p-4 text-center text-xs leading-relaxed text-ink-500">
          {dict.markets.disclaimer}
        </p>
      </div>
    </section>
  );
}
