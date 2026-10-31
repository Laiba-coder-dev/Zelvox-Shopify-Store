import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/sora/wght.css";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CookieConsent from "@/components/site/CookieConsent";
import { getDict, getLocale } from "@/lib/i18n";
import { getMarketSelection } from "@/lib/market";
import { DEFAULT_SETTINGS, getCompany, pick } from "@/lib/content";
import { getSetting } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSetting("site", DEFAULT_SETTINGS.site);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = site.name;
  const description = site.description;
  return {
    metadataBase: new URL(base),
    title: { default: title, template: `%s · ${title}` },
    description,
    applicationName: title,
    keywords: [
      "bulk export",
      "wholesale supplier",
      "Pakistan export company",
      "UK wholesale imports",
      "Germany wholesale imports",
      "B2B sourcing",
      "bulk quotation",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: title,
      title,
      description,
      url: base,
      images: [
        { url: "/images/hero-logistics.jpg", width: 1600, height: 900, alt: "Container terminal" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-logistics.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b2545",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dict = getDict(locale);
  const selection = await getMarketSelection();
  const company = await getCompany();

  const store = await cookies();
  const consent = store.get("mge_cookie_consent")?.value;

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-b-lg bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {dict.a11y.skipToContent}
        </a>
        <Header
          dict={dict}
          locale={locale}
          market={selection.code}
          currency={selection.currency}
          companyName={company.name}
          contactEmail={company.email}
          contactPhone={company.phone}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent dict={dict} initialOpen={!consent} />
      </body>
    </html>
  );
}
