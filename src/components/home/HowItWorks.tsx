import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type StepItem } from "@/lib/content";

type Props = {
  dict: Dict;
  locale: Locale;
  title: string;
  subtitle: string;
  steps: StepItem[];
};

export default function HowItWorks({ dict, locale, title, subtitle, steps }: Props) {
  return (
    <section className="section-pad bg-white" aria-labelledby="how-title">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">{dict.common.next}</p>
          <h2 id="how-title" className="mt-4 text-3xl font-bold sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-ink-600">{subtitle}</p>
        </Reveal>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title.en} index={index} className="relative">
              <div className="h-full rounded-2xl border border-line bg-white p-5 transition hover:border-navy-200 hover:shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold leading-snug">
                  {pick(step.title, locale)}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
                  {pick(step.desc, locale)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
