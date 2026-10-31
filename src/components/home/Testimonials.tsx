import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";

export type TestimonialRow = {
  id: string;
  authorName: string;
  authorRole: string | null;
  company: string | null;
  country: string | null;
  content: string;
  rating: number;
};

type Props = {
  dict: Dict;
  locale: Locale;
  items: TestimonialRow[];
};

export default function Testimonials({ dict, locale, items }: Props) {
  return (
    <section className="section-pad bg-surface-2" aria-labelledby="testimonials-title">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{locale === "de" ? "Vertrauen" : "Trust"}</p>
          <h2 id="testimonials-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {dict.home.testimonialsTitle}
          </h2>
          <p className="mt-3 text-ink-600">{dict.home.testimonialsSub}</p>
        </Reveal>

        {items.length === 0 ? (
          <Reveal index={1}>
            <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-line-strong bg-white p-10 text-center">
              <Quote className="h-8 w-8 text-navy-200" aria-hidden="true" />
              <p className="max-w-xl text-sm leading-relaxed text-ink-600">
                {dict.home.testimonialsEmpty}
              </p>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
              >
                {dict.common.requestQuote}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.id} index={index}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-1" aria-label={`${item.rating} / 5`}>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-4 w-4 ${
                          starIndex < item.rating ? "fill-brand-500 text-brand-500" : "text-line-strong"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink-700">
                    “{item.content}”
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <p className="text-sm font-semibold text-ink-950">{item.authorName}</p>
                    <p className="text-xs text-ink-500">
                      {[item.authorRole, item.company, item.country].filter(Boolean).join(" · ")}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
