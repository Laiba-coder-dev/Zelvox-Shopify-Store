"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Menu, Quote, X } from "lucide-react";
import Logo from "./Logo";
import type { Dict } from "@/locales/en";
import { LOCALES, type Locale } from "@/locales";
import type { Currency, MarketCode } from "@/lib/site";
import { CURRENCY_LABELS } from "@/lib/site";
import { setPreferences, readBasket, BASKET_EVENT, type BasketItem } from "@/lib/client";

type Props = {
  dict: Dict;
  locale: Locale;
  market: MarketCode;
  currency: Currency;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
};

export default function Header({
  dict,
  locale,
  market,
  currency,
  companyName,
  contactEmail,
  contactPhone,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [marketsOpen, setMarketsOpen] = useState(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onBasket = (event: Event) =>
      setBasket((event as CustomEvent<BasketItem[]>).detail ?? []);
    window.addEventListener(BASKET_EVENT, onBasket);
    setBasket(readBasket());
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(BASKET_EVENT, onBasket);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setMarketsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const change = async (prefs: Parameters<typeof setPreferences>[0]) => {
    const ok = await setPreferences(prefs);
    if (ok) router.refresh();
  };

  const navLinks = [
    { href: "/", label: dict.nav.home },
    { href: "/products", label: dict.nav.products },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-50">
      {/* Utility bar — collapses on scroll */}
      <div
        className={`overflow-hidden border-b border-white/10 bg-navy-950 text-white transition-all duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
        }`}
      >
        <div className="container-x flex h-10 items-center justify-between gap-4 text-[12px]">
          <p className="hidden truncate text-white/70 sm:block">
            {companyName} — {locale === "de" ? "Großhandels-Beschaffung aus Pakistan" : "Bulk export sourcing from Pakistan"}
          </p>
          <div className="flex items-center gap-4">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="hidden text-white/80 transition hover:text-white md:inline"
              >
                {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}
                className="hidden text-white/80 transition hover:text-white md:inline"
              >
                {contactPhone}
              </a>
            )}
            <label className="sr-only" htmlFor="hdr-lang">
              {dict.prefs.language}
            </label>
            <select
              id="hdr-lang"
              value={locale}
              onChange={(event) => change({ locale: event.target.value as Locale })}
              className="cursor-pointer rounded-md border border-white/15 bg-transparent px-2 py-1 text-[12px] text-white/90 outline-none transition hover:border-white/40"
            >
              {LOCALES.map((item) => (
                <option key={item.code} value={item.code} className="text-ink-900">
                  {item.label}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="hdr-market">
              {dict.prefs.market}
            </label>
            <select
              id="hdr-market"
              value={market}
              onChange={(event) => change({ market: event.target.value as MarketCode })}
              className="cursor-pointer rounded-md border border-white/15 bg-transparent px-2 py-1 text-[12px] text-white/90 outline-none transition hover:border-white/40"
            >
              <option value="UK" className="text-ink-900">
                🇬🇧 {dict.prefs.marketUk}
              </option>
              <option value="DE" className="text-ink-900">
                🇩🇪 {dict.prefs.marketDe}
              </option>
              <option value="OTHER" className="text-ink-900">
                🌐 {dict.prefs.marketOther}
              </option>
            </select>
            <label className="sr-only" htmlFor="hdr-currency">
              {dict.prefs.currency}
            </label>
            <select
              id="hdr-currency"
              value={currency}
              onChange={(event) => change({ currency: event.target.value as Currency })}
              className="cursor-pointer rounded-md border border-white/15 bg-transparent px-2 py-1 text-[12px] text-white/90 outline-none transition hover:border-white/40"
            >
              {(Object.keys(CURRENCY_LABELS) as Currency[]).map((code) => (
                <option key={code} value={code} className="text-ink-900">
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "border-line shadow-soft" : "border-transparent"
        }`}
      >
        <div className="container-x flex h-[68px] items-center justify-between gap-6">
          <Logo name={companyName} />

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "text-navy-800"
                    : "text-ink-600 hover:bg-navy-50 hover:text-navy-800"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600" />
                )}
              </Link>
            ))}

            {/* Markets dropdown */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={marketsOpen}
                aria-haspopup="true"
                onClick={() => setMarketsOpen((value) => !value)}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-navy-50 hover:text-navy-800"
              >
                <Globe className="h-4 w-4" aria-hidden="true" />
                {dict.nav.markets}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${marketsOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {marketsOpen && (
                <div className="absolute right-0 top-full w-64 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-lift">
                  <Link
                    href="/markets/united-kingdom"
                    className="flex items-start gap-3 px-4 py-2.5 text-sm transition hover:bg-navy-50"
                  >
                    <span aria-hidden="true">🇬🇧</span>
                    <span>
                      <span className="block font-semibold text-navy-800">{dict.nav.uk}</span>
                      <span className="block text-xs text-ink-500">GBP · UK import guidance</span>
                    </span>
                  </Link>
                  <Link
                    href="/markets/germany"
                    className="flex items-start gap-3 px-4 py-2.5 text-sm transition hover:bg-navy-50"
                  >
                    <span aria-hidden="true">🇩🇪</span>
                    <span>
                      <span className="block font-semibold text-navy-800">{dict.nav.de}</span>
                      <span className="block text-xs text-ink-500">EUR · EU import guidance</span>
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/quote"
              className="relative hidden items-center gap-2 rounded-lg border border-line-strong px-3 py-2 text-sm font-semibold text-navy-800 transition hover:border-navy-800 hover:bg-navy-50 sm:flex"
              title={dict.common.viewQuoteList}
            >
              <Quote className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{dict.common.viewQuoteList}</span>
              {basket.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                  {basket.length}
                </span>
              )}
            </Link>
            <Link
              href="/quote"
              className="hidden rounded-lg bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-navy-700 lg:flex"
            >
              {dict.nav.quote}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-navy-800 transition hover:bg-navy-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.a11y.closeMenu : dict.a11y.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — full-screen sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-[60] overflow-y-auto bg-white lg:hidden"
      >
        <div className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-line bg-white px-5">
          <Logo name={companyName} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-navy-800 transition hover:bg-navy-50"
            aria-label={dict.a11y.closeMenu}
            onClick={() => {
              setOpen(false);
              menuButtonRef.current?.focus();
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-4 py-3 text-base font-semibold transition ${
                isActive(link.href) ? "bg-navy-50 text-navy-800" : "text-ink-700 hover:bg-surface-2"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-2 border-t border-line" />
          <p className="px-4 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
            {dict.nav.markets}
          </p>
          <Link href="/markets/united-kingdom" className="rounded-lg px-4 py-3 text-base font-semibold text-ink-700 hover:bg-surface-2">
            🇬🇧 {dict.nav.uk}
          </Link>
          <Link href="/markets/germany" className="rounded-lg px-4 py-3 text-base font-semibold text-ink-700 hover:bg-surface-2">
            🇩🇪 {dict.nav.de}
          </Link>
          <div className="my-2 border-t border-line" />

          <div className="grid grid-cols-2 gap-3 px-4 pb-2">
            <div>
              <label htmlFor="mob-lang" className="mb-1 block text-xs font-semibold text-ink-500">
                {dict.prefs.language}
              </label>
              <select
                id="mob-lang"
                value={locale}
                onChange={(event) => change({ locale: event.target.value as Locale })}
                className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm"
              >
                {LOCALES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="mob-currency" className="mb-1 block text-xs font-semibold text-ink-500">
                {dict.prefs.currency}
              </label>
              <select
                id="mob-currency"
                value={currency}
                onChange={(event) => change({ currency: event.target.value as Currency })}
                className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm"
              >
                {(Object.keys(CURRENCY_LABELS) as Currency[]).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="mob-market" className="mb-1 block text-xs font-semibold text-ink-500">
                {dict.prefs.market}
              </label>
              <select
                id="mob-market"
                value={market}
                onChange={(event) => change({ market: event.target.value as MarketCode })}
                className="w-full rounded-lg border border-line-strong px-3 py-2.5 text-sm"
              >
                <option value="UK">🇬🇧 {dict.prefs.marketUk}</option>
                <option value="DE">🇩🇪 {dict.prefs.marketDe}</option>
                <option value="OTHER">🌐 {dict.prefs.marketOther}</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-3 px-4 pb-8">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-3.5 text-sm font-semibold text-white"
            >
              {dict.nav.quote}
              {basket.length > 0 && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-bold">
                  {basket.length}
                </span>
              )}
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-line-strong px-5 py-3.5 text-sm font-semibold text-navy-800"
            >
              {dict.common.exploreProducts}
            </Link>
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, "")}`}
                className="text-center text-sm font-medium text-ink-600 underline underline-offset-4"
              >
                {contactPhone}
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
