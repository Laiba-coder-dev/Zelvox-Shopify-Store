import type { Metadata } from "next";
import Hero from "@/components/home/Hero";import Overview from "@/components/home/Overview";
import StatsStrip from "@/components/home/StatsStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChoose from "@/components/home/WhyChoose";
import TargetMarkets from "@/components/home/TargetMarkets";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Credentials from "@/components/home/Credentials";
import FinalCTA from "@/components/home/FinalCTA";
import { getDict, getLocale } from "@/lib/i18n";
import { getMarketSelection } from "@/lib/market";
import { getSettings, getSetting } from "@/lib/settings";
import {
  DEFAULT_SETTINGS,
  getCompany,
  pick,
} from "@/lib/content";
import { db } from "@/lib/db";
import { getFx } from "@/lib/rates";
import { describePrice } from "@/lib/price";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSetting("site", DEFAULT_SETTINGS.site);
  return {
    title: { absolute: `${site.name} — Bulk Exports to the UK & Germany` },
    description: site.description,
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const selection = await getMarketSelection();

  const [hero, overview, whyChoose, howItWorks, stats, credentials, pages, company, fx] =
    await Promise.all([
      getSettings(DEFAULT_SETTINGS.hero),
      getSettings(DEFAULT_SETTINGS.overview),
      getSettings(DEFAULT_SETTINGS.whyChoose),
      getSettings(DEFAULT_SETTINGS.howItWorks),
      getSettings(DEFAULT_SETTINGS.stats),
      getSettings(DEFAULT_SETTINGS.credentials),
      getSettings(DEFAULT_SETTINGS.pages),
      getCompany(),
      getFx(),
    ]);

  const [activeProducts, productCount, categoryCount, testimonials] = await Promise.all([
    db.product.findMany({
      where: { status: "active" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    db.product.count({ where: { status: "active" } }),
    db.category.count(),
    db.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  const featured = activeProducts
    .slice(0, 6)
    .map((product) => ({
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
    <>
      <Hero
        dict={dict}
        locale={locale}
        title={hero.title}
        subtitle={hero.subtitle}
        note={hero.note}
        image={hero.image}
      />

      <Overview dict={dict} locale={locale} content={overview} />

      <StatsStrip
        dict={dict}
        locale={locale}
        productCount={productCount}
        categoryCount={categoryCount}
        adminItems={stats.items}
      />

      <FeaturedProducts dict={dict} locale={locale} products={featured} />

      <WhyChoose
        dict={dict}
        locale={locale}
        title={pick(whyChoose.title, locale)}
        subtitle={pick(whyChoose.subtitle, locale)}
        items={whyChoose.items}
      />

      <TargetMarkets dict={dict} locale={locale} uk={pages.uk} de={pages.de} />

      <HowItWorks
        dict={dict}
        locale={locale}
        title={pick(howItWorks.title, locale)}
        subtitle={pick(howItWorks.subtitle, locale)}
        steps={howItWorks.steps}
      />

      <Testimonials
        dict={dict}
        locale={locale}
        items={testimonials.map((item) => ({
          id: item.id,
          authorName: item.authorName,
          authorRole: item.authorRole,
          company: item.company,
          country: item.country,
          content: item.content,
          rating: item.rating,
        }))}
      />

      <Credentials
        dict={dict}
        locale={locale}
        credentials={credentials.items}
        note={DEFAULT_SETTINGS.about.credentialsNote}
      />

      <FinalCTA dict={dict} locale={locale} contactEmail={company.email} />
    </>
  );
}
