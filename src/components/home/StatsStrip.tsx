import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import type { Dict } from "@/locales/en";
import type { Locale } from "@/lib/i18n";
import { pick, type StatItem } from "@/lib/content";

type Computed = { value: number; label: string };

type Props = {
  dict: Dict;
  locale: Locale;
  productCount: number;
  categoryCount: number;
  adminItems: StatItem[];
};

export default function StatsStrip({
  dict,
  locale,
  productCount,
  categoryCount,
  adminItems,
}: Props) {
  const stats: Computed[] = [
    { value: productCount, label: dict.home.stats.products },
    { value: categoryCount, label: dict.home.stats.categories },
    { value: 2, label: dict.home.stats.markets },
    { value: 2, label: dict.home.stats.languages },
    ...adminItems.map((item) => ({
      value: item.value,
      label:
        pick(item.label, locale) ||
        pick(item.label, "en"),
    })),
  ].slice(0, 8);

  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-14 text-white" aria-label={dict.about.statsTitle}>
      <div className="absolute inset-0 -z-10 grid-surface opacity-70" aria-hidden="true" />
      <div className="container-x">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-y-12 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={`${stat.label}-${index}`}
              index={index}
              className="text-center lg:text-left"
            >
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <CountUp value={stat.value} suffix="+" locale={locale === "de" ? "de-DE" : "en-GB"} />
              </p>
              <p className="mx-auto mt-3 max-w-[14rem] text-[13px] leading-snug text-white/65 lg:mx-0">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-white/45">{dict.about.statsNote}</p>
      </div>
    </section>
  );
}
