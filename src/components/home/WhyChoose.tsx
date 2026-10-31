import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  FileCheck2,
  Handshake,
  MessageSquare,
  PackageCheck,
  ShieldCheck,
  Ship,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type WhyItem } from "@/lib/content";

const ICONS = [BadgePercent, ShieldCheck, FileCheck2, PackageCheck, Ship, MessageSquare, Handshake];

type Props = {
  dict: Dict;
  locale: Locale;
  title: string;
  subtitle: string;
  items: WhyItem[];
};

export default function WhyChoose({ dict, locale, title, subtitle, items }: Props) {
  return (
    <section className="section-pad bg-white" aria-labelledby="why-title">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{dict.about.sourcing}</p>
          <h2 id="why-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-ink-600">{subtitle}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <Reveal key={item.title.en} index={index}>
                <div className="group h-full rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-navy-200 hover:shadow-lift">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-800 transition group-hover:bg-brand-50 group-hover:text-brand-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">{pick(item.title, locale)}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">
                    {pick(item.desc, locale)}
                  </p>
                </div>
              </Reveal>
            );
          })}

          <Reveal index={items.length}>
            <div className="flex h-full flex-col justify-between rounded-2xl bg-navy-800 p-6 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
                  {dict.common.next}
                </p>
                <p className="mt-3 text-lg font-semibold leading-snug">
                  {locale === "de"
                    ? "Sprechen Sie mit unserem Exportdesk."
                    : "Talk to our export desk."}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                  {locale === "de"
                    ? "Senden Sie Spezifikation und Mengen — wir antworten schriftlich."
                    : "Send your specification and volumes — we reply in writing."}
                </p>
              </div>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-200 transition hover:text-white"
              >
                {dict.common.contactUs}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
