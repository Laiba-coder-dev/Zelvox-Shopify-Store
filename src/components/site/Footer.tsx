import Link from "next/link";
import { Clock, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";
import CookieSettingsButton from "./CookieSettingsButton";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "./SocialIcons";
import { getDict, getLocale, type Locale } from "@/lib/i18n";
import { getMarketSelection } from "@/lib/market";
import { getCompany, pick } from "@/lib/content";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function Footer() {
  const locale = await getLocale();
  const dict = getDict(locale);
  const selection = await getMarketSelection();
  const company = await getCompany();

  const [categories, siteNameRow] = await Promise.all([
    db.category.findMany({
      where: { products: { some: { status: "active" } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { name: true, slug: true },
    }),
    db.setting.findUnique({ where: { key: "site" }, select: { value: true } }),
  ]);

  let siteName = company.name;
  try {
    if (siteNameRow) siteName = JSON.parse(siteNameRow.value).name ?? company.name;
  } catch {
    /* keep fallback */
  }

  const hours = pick(company.hours, locale);
  const socials = [
    { href: company.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: company.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: company.facebook, icon: FacebookIcon, label: "Facebook" },
  ].filter((item) => Boolean(item.href));

  const columns: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
    {
      title: dict.footer.company,
      links: [
        { href: "/about", label: dict.nav.about },
        { href: "/contact", label: dict.nav.contact },
        { href: "/quote", label: dict.common.requestQuote },
        { href: "/about#credentials", label: dict.about.credentials },
      ],
    },
    {
      title: dict.footer.catalogue,
      links: [
        { href: "/products", label: dict.common.viewAll },
        ...categories.slice(0, 5).map((category) => ({
          href: `/products?category=${category.slug}`,
          label: category.name,
        })),
      ],
    },
    {
      title: dict.footer.markets,
      links: [
        { href: "/markets/united-kingdom", label: `🇬🇧 ${dict.nav.uk}` },
        { href: "/markets/germany", label: `🇩🇪 ${dict.nav.de}` },
        { href: "/products", label: dict.common.exploreProducts },
      ],
    },
    {
      title: dict.footer.legal,
      links: [
        { href: "/privacy", label: dict.footer.privacy },
        { href: "/terms", label: dict.footer.terms },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-navy-950 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo name={siteName} className="[&_span]:!text-white [&_span+span]:!text-brand-200" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {pick(company.tagline, locale) || dict.footer.tagline}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {selection.market.short === "International"
              ? "Wholesale supply for importers, distributors and retailers worldwide."
              : locale === "de"
                ? `Großhandelslieferungen für Unternehmen in ${selection.market.name}.`
                : `Wholesale supply for businesses in ${selection.market.name}.`}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/70">
              {selection.currency}
            </span>
            <span className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/70">
              {locale === "de" ? "Deutsch" : "English"}
            </span>
            <span className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-semibold text-white/70">
              {selection.market.flag} {selection.market.short}
            </span>
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">
            {dict.footer.contact}
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {company.email && (
              <li>
                <a href={`mailto:${company.email}`} className="flex items-start gap-2 transition hover:text-white">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                  <span className="break-all">{company.email}</span>
                </a>
              </li>
            )}
            {company.phone && (
              <li>
                <a
                  href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-start gap-2 transition hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
            )}
            {company.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 transition hover:text-white"
                >
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
            )}
            {company.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                <span>{company.address}</span>
              </li>
            )}
            {hours && (
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                <span>{hours}</span>
              </li>
            )}
            {!company.address && !hours && (
              <li className="flex items-start gap-2 text-white/55">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-brand-200" aria-hidden="true" />
                {dict.contact.noDetailsYet}
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition hover:border-brand-500 hover:text-white"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center">
          <p>
            {dict.footer.rights
              .replace("{year}", String(new Date().getFullYear()))
              .replace("{name}", siteName)}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition hover:text-white">
              {dict.footer.privacy}
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              {dict.footer.terms}
            </Link>
            <CookieSettingsButton label={dict.footer.cookiePolicy} />
            <Link href="/admin" className="transition hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
