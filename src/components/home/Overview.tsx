import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type Localized } from "@/lib/content";

type Props = {
  dict: Dict;
  locale: Locale;
  content: {
    title: Localized;
    p1: Localized;
    p2: Localized;
    points: Localized[];
    image: string;
    qualityImage: string;
    qualityTitle: Localized;
    qualityBody: Localized;
  };
};

export default function Overview({ dict, locale, content }: Props) {
  return (
    <section className="section-pad bg-white" aria-labelledby="overview-title">
      <div className="container-x">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
                <img
                  src={content.image}
                  alt=""
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 hidden max-w-[16rem] rounded-2xl border border-line bg-white p-4 shadow-lift sm:block lg:-right-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
                  {locale === "de" ? "Direkter Ansprechpartner" : "Single point of contact"}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                  {locale === "de"
                    ? "Ein Exportdesk für Anfrage, Angebot, Produktion und Dokumente."
                    : "One export desk for inquiry, quotation, production updates and documents."}
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow">
                {locale === "de" ? "Unternehmen" : "Company overview"}
              </p>
              <h2 id="overview-title" className="mt-4 text-3xl font-bold sm:text-4xl">
                {pick(content.title, locale)}
              </h2>
            </Reveal>
            <Reveal index={1}>
              <p className="mt-5 leading-relaxed text-ink-600">{pick(content.p1, locale)}</p>
            </Reveal>
            <Reveal index={2}>
              <p className="mt-4 leading-relaxed text-ink-600">{pick(content.p2, locale)}</p>
            </Reveal>
            <Reveal index={3}>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {content.points.map((point) => (
                  <li key={point.en} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                    <span>{pick(point, locale)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal index={4}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700">
                  {dict.common.learnMore}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/quote" className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-5 py-3 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50">
                  {dict.common.requestQuote}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Quality assurance */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6 lg:order-2">
            <Reveal>
              <p className="eyebrow">{dict.about.quality}</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                {pick(content.qualityTitle, locale)}
              </h2>
              <p className="mt-5 leading-relaxed text-ink-600">
                {pick(content.qualityBody, locale)}
              </p>
            </Reveal>
            <Reveal index={1}>
              <div className="mt-7 rounded-2xl border border-line bg-surface-2 p-5">
                <p className="text-sm font-semibold text-ink-950">
                  {locale === "de"
                    ? "Dokumente je Auftrag abgestimmt"
                    : "Documentation aligned to your order"}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                  {locale === "de"
                    ? "Handelsrechnung, Packliste, Ursprungsnachweise und Versandpapiere werden vor dem Versand bereitgestellt und geprüft."
                    : "Commercial invoice, packing list, origin documents and shipping papers are prepared and checked before dispatch."}
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-6 lg:order-1">
            <div className="overflow-hidden rounded-3xl border border-line shadow-soft">
              <img
                src={content.qualityImage}
                alt=""
                width={1200}
                height={900}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
