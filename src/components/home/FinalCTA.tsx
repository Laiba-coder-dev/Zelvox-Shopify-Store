import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";

type Props = {
  dict: Dict;
  locale: Locale;
  contactEmail: string;
};

export default function FinalCTA({ dict, locale, contactEmail }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-800 py-20 text-white">
      <div className="absolute inset-0 -z-10 grid-surface opacity-60" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div className="container-x text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {dict.home.finalCtaTitle}
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            {dict.home.finalCtaSub}
          </p>
        </Reveal>
        <Reveal index={2}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-7 py-4 text-sm font-semibold text-white shadow-navy transition hover:bg-brand-700"
            >
              {dict.common.getWholesaleQuote}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {dict.common.contactUs}
            </Link>
          </div>
        </Reveal>
        {contactEmail && (
          <Reveal index={3}>
            <p className="mt-6 text-sm text-white/60">
              {locale === "de" ? "oder schreiben an" : "or e-mail"}{" "}
              <a href={`mailto:${contactEmail}`} className="font-medium text-brand-200 underline-offset-4 hover:underline">
                {contactEmail}
              </a>
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
